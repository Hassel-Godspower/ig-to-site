/**
 * Handle enrichment for gòke — best-effort public sources.
 * Goal: real name, bio, post captions, media URLs, brand color from avatar.
 *
 * Sources (in order):
 * 1) IG_SELFHOST_URL worker (recommended for production reliability)
 * 2) Instagram web_profile_info (public, rate-limited)
 * 3) HTML scrape of instagram.com/{handle}/ (meta + shared data)
 * 4) Optional IG_HTML_PROXY template
 *
 * Meta Graph API OAuth is the long-term official path; this keeps the
 * “type @handle” UX working without shipping keys to the browser.
 */

import type { InstagramPost, InstagramProfile } from "./parseInstagramExport";

function sanitizeHandle(raw: string): string {
  return raw
    .trim()
    .replace(/^@+/, "")
    .replace(/[^a-zA-Z0-9._]/g, "")
    .slice(0, 30);
}

const UA_DESKTOP =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
const UA_MOBILE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

/** Approximate dominant color from image bytes. */
export async function colorFromImageUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA_DESKTOP,
        Accept: "image/*,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 80) return null;

    let r = 0,
      g = 0,
      b = 0,
      n = 0;
    const step = Math.max(3, Math.floor(buf.length / 700) * 3);
    for (let i = 24; i + 2 < buf.length && n < 500; i += step) {
      const rr = buf[i],
        gg = buf[i + 1],
        bb = buf[i + 2];
      if (rr > 248 && gg > 248 && bb > 248) continue;
      if (rr < 10 && gg < 10 && bb < 10) continue;
      r += rr;
      g += gg;
      b += bb;
      n++;
    }
    if (n < 15) return null;
    r = Math.min(255, Math.round((r / n) * 1.12));
    g = Math.min(255, Math.round((g / n) * 1.12));
    b = Math.min(255, Math.round((b / n) * 1.12));
    if (Math.max(r, g, b) - Math.min(r, g, b) < 28) return null;
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  } catch {
    return null;
  }
}

function mapUser(u: any, handle: string): InstagramProfile {
  const edges =
    u.edge_owner_to_timeline_media?.edges ||
    u.edge_felix_video_timeline?.edges ||
    u.edges ||
    u.media?.nodes ||
    [];
  const posts: InstagramPost[] = edges.slice(0, 24).map((e: any) => {
    const node = e.node || e;
    const caption =
      node.edge_media_to_caption?.edges?.[0]?.node?.text ||
      node.caption?.text ||
      node.caption ||
      node.accessibility_caption ||
      "";
    const url =
      node.display_url ||
      node.thumbnail_src ||
      node.displayUrl ||
      node.image_versions2?.candidates?.[0]?.url ||
      "";
    return {
      caption: String(caption).trim(),
      imageUrls: url ? [String(url)] : [],
    };
  });

  const mediaUrls = posts
    .flatMap((p) => p.imageUrls || [])
    .filter((x) => /^https?:\/\//i.test(x))
    .slice(0, 24);

  const pic =
    u.profile_pic_url_hd ||
    u.profile_pic_url ||
    u.profilePicUrl ||
    u.hd_profile_pic_url_info?.url ||
    undefined;

  return {
    username: sanitizeHandle(u.username || handle),
    name: String(u.full_name || u.fullName || handle).trim(),
    bio: String(u.biography || u.bio || "").trim(),
    posts,
    mediaUrls,
    profilePicUrl: pic,
    logoUrl: pic,
    externalUrl: u.external_url || u.externalUrl || undefined,
    followers: u.edge_followed_by?.count ?? u.follower_count ?? undefined,
    category: u.category_name || u.business_category_name || undefined,
  };
}

async function fetchWebProfile(handle: string): Promise<InstagramProfile | null> {
  try {
    const res = await fetch(
      `https://i.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(handle)}`,
      {
        headers: {
          "User-Agent": UA_MOBILE,
          "X-IG-App-ID": "936619743392459",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          Origin: "https://www.instagram.com",
          Referer: `https://www.instagram.com/${handle}/`,
        },
        signal: AbortSignal.timeout(14000),
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const u = json?.data?.user;
    if (!u) return null;
    return mapUser(u, handle);
  } catch {
    return null;
  }
}

async function fetchSelfHost(handle: string): Promise<InstagramProfile | null> {
  const base = process.env.IG_SELFHOST_URL?.replace(/\/$/, "");
  if (!base) return null;
  try {
    const res = await fetch(`${base}/profile/${encodeURIComponent(handle)}`, {
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    const u = await res.json();
    return mapUser(u?.user || u?.data || u, handle);
  } catch {
    return null;
  }
}

/** Optional: IG_HTML_PROXY="https://r.jina.ai/http://www.instagram.com/{handle}/" */
async function fetchViaProxyTemplate(handle: string): Promise<InstagramProfile | null> {
  const tpl = process.env.IG_HTML_PROXY?.trim();
  if (!tpl) return null;
  const url = tpl.replace("{handle}", encodeURIComponent(handle));
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA_DESKTOP, Accept: "text/html,*/*" },
      signal: AbortSignal.timeout(18000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    return profileFromHtml(html, handle);
  } catch {
    return null;
  }
}

function profileFromHtml(html: string, handle: string): InstagramProfile | null {
  // og:title often "Name (@handle) • Instagram photos..."
  const ogTitle =
    html.match(/property="og:title"\s+content="([^"]+)"/i)?.[1] ||
    html.match(/content="([^"]+)"\s+property="og:title"/i)?.[1] ||
    "";
  const ogDesc =
    html.match(/property="og:description"\s+content="([^"]+)"/i)?.[1] ||
    html.match(/content="([^"]+)"\s+property="og:description"/i)?.[1] ||
    "";
  const ogImage =
    html.match(/property="og:image"\s+content="([^"]+)"/i)?.[1] ||
    html.match(/content="([^"]+)"\s+property="og:image"/i)?.[1] ||
    "";

  let name = handle;
  const titleMatch = ogTitle.match(/^(.+?)\s*\(@/i);
  if (titleMatch) name = decodeHtml(titleMatch[1]).trim();

  // Captions sometimes appear in description as "X Followers, Y Following, Z Posts - Bio"
  let bio = decodeHtml(ogDesc);
  // Strip follower noise prefix if present
  bio = bio.replace(/^[\d.,KMB]+\s*Followers?,[^-]*-\s*/i, "").trim();

  const posts: InstagramPost[] = [];
  if (bio) {
    posts.push({ caption: bio.slice(0, 500), imageUrls: ogImage ? [ogImage] : [] });
  }

  // Try embedded shared data JSON for more captions
  const shared =
    html.match(/window\._sharedData\s*=\s*(\{.+?\});<\/script>/s)?.[1] ||
    html.match(/"ProfilePage"\s*:\s*\[(\{.+?\})\]/s)?.[1];
  if (shared) {
    try {
      const data = JSON.parse(shared.length > 2 && shared[0] === "{" ? shared : `{"x":${shared}}`);
      const user =
        data?.entry_data?.ProfilePage?.[0]?.graphql?.user ||
        data?.graphql?.user ||
        null;
      if (user) return mapUser(user, handle);
    } catch {
      /* ignore */
    }
  }

  if (!name && !bio && !ogImage) return null;

  return {
    username: handle,
    name: name || handle,
    bio,
    posts,
    mediaUrls: ogImage ? [ogImage] : [],
    profilePicUrl: ogImage || undefined,
    logoUrl: ogImage || undefined,
  };
}

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\\u0026/g, "&");
}

async function fetchInstagramHtml(handle: string): Promise<InstagramProfile | null> {
  try {
    const res = await fetch(`https://www.instagram.com/${encodeURIComponent(handle)}/`, {
      headers: {
        "User-Agent": UA_DESKTOP,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(14000),
      redirect: "follow",
    });
    if (!res.ok) return null;
    const html = await res.text();
    return profileFromHtml(html, handle);
  } catch {
    return null;
  }
}

function mergeProfiles(
  primary: InstagramProfile,
  secondary: InstagramProfile | null
): InstagramProfile {
  if (!secondary) return primary;
  const posts =
    (primary.posts?.length || 0) >= (secondary.posts?.length || 0)
      ? primary.posts
      : secondary.posts;
  return {
    ...primary,
    name: primary.name || secondary.name,
    bio: primary.bio || secondary.bio,
    posts: posts || [],
    mediaUrls: [
      ...new Set([...(primary.mediaUrls || []), ...(secondary.mediaUrls || [])]),
    ].slice(0, 24),
    profilePicUrl: primary.profilePicUrl || secondary.profilePicUrl,
    logoUrl: primary.logoUrl || secondary.logoUrl,
    externalUrl: primary.externalUrl || secondary.externalUrl,
    brandColor: primary.brandColor || secondary.brandColor,
  };
}

/**
 * Enrich handle → profile with real text + color when possible.
 */
export async function enrichFromHandle(
  rawHandle: string
): Promise<{ profile: InstagramProfile; source: string } | null> {
  const handle = sanitizeHandle(rawHandle);
  if (handle.length < 2) return null;

  const sources: string[] = [];
  let profile: InstagramProfile | null = null;

  const selfHost = await fetchSelfHost(handle);
  if (selfHost) {
    profile = selfHost;
    sources.push("selfhost");
  }

  const web = await fetchWebProfile(handle);
  if (web) {
    profile = profile ? mergeProfiles(profile, web) : web;
    sources.push("web_profile");
  }

  if (!profile || !(profile.posts?.length) || !profile.bio) {
    const htmlP = await fetchInstagramHtml(handle);
    if (htmlP) {
      profile = profile ? mergeProfiles(profile, htmlP) : htmlP;
      sources.push("html");
    }
  }

  if (!profile || !(profile.posts?.length)) {
    const prox = await fetchViaProxyTemplate(handle);
    if (prox) {
      profile = profile ? mergeProfiles(profile, prox) : prox;
      sources.push("proxy");
    }
  }

  if (!profile) return null;

  // Brand color from avatar (or first media)
  const pic = profile.profilePicUrl || profile.logoUrl || profile.mediaUrls?.[0];
  if (pic && !profile.brandColor) {
    const color = await colorFromImageUrl(pic);
    if (color) profile.brandColor = color;
  }

  if ((!profile.mediaUrls || profile.mediaUrls.length === 0) && pic) {
    profile.mediaUrls = [pic];
  }

  // Ensure generator has caption text
  if (!profile.posts?.length) {
    const line =
      profile.bio?.split("\n").find((l) => l.trim().length > 2) ||
      profile.name ||
      handle;
    profile.posts = [
      { caption: line, imageUrls: pic ? [pic] : [] },
    ];
  }

  // Keep only posts that have some caption or image
  profile.posts = (profile.posts || []).filter(
    (p) => (p.caption && p.caption.trim()) || (p.imageUrls && p.imageUrls.length)
  );

  return {
    profile,
    source: sources.join("+") || "unknown",
  };
}
