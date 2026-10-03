/**
 * Lightweight handle enrichment for gòke.
 * Best-effort public fetch → name, bio, avatar, posts, brand color.
 * No Apify/RapidAPI required. Falls back silently.
 */

import type { InstagramPost, InstagramProfile } from "./parseInstagramExport";

function sanitizeHandle(raw: string): string {
  return raw
    .trim()
    .replace(/^@+/, "")
    .replace(/[^a-zA-Z0-9._]/g, "")
    .slice(0, 30);
}

/** Approximate dominant color from image bytes (JPEG/PNG-ish sampling). */
export async function colorFromImageUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
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
    // Avoid muddy greys as brand accent
    if (Math.max(r, g, b) - Math.min(r, g, b) < 28) return null;
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  } catch {
    return null;
  }
}

function mapUser(u: any, handle: string): InstagramProfile {
  const edges = u.edge_owner_to_timeline_media?.edges || u.edges || [];
  const posts: InstagramPost[] = edges.slice(0, 18).map((e: any) => {
    const node = e.node || e;
    const caption =
      node.edge_media_to_caption?.edges?.[0]?.node?.text ||
      node.caption ||
      "";
    const url =
      node.display_url ||
      node.thumbnail_src ||
      node.displayUrl ||
      "";
    return {
      caption: String(caption).trim(),
      imageUrls: url ? [url] : [],
    };
  });

  const mediaUrls = posts
    .flatMap((p) => p.imageUrls || [])
    .filter((x) => /^https?:\/\//i.test(x))
    .slice(0, 20);

  const pic =
    u.profile_pic_url_hd ||
    u.profile_pic_url ||
    u.profilePicUrl ||
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

/** Instagram mobile web_profile_info (public profiles, no login — may rate-limit). */
async function fetchWebProfile(handle: string): Promise<InstagramProfile | null> {
  try {
    const res = await fetch(
      `https://i.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(handle)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
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

/**
 * Optional self-hosted worker: set IG_SELFHOST_URL=https://your-worker
 * Worker should respond GET /profile/:username → JSON with full_name, biography, etc.
 */
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

/**
 * Enrich handle → profile with real text + color when possible.
 */
export async function enrichFromHandle(
  rawHandle: string
): Promise<{ profile: InstagramProfile; source: string } | null> {
  const handle = sanitizeHandle(rawHandle);
  if (handle.length < 2) return null;

  let profile =
    (await fetchSelfHost(handle)) || (await fetchWebProfile(handle));

  if (!profile) return null;

  // Brand color from avatar
  const pic = profile.profilePicUrl || profile.logoUrl;
  if (pic) {
    const color = await colorFromImageUrl(pic);
    if (color) profile.brandColor = color;
  }

  // Ensure media list includes avatar if posts empty
  if ((!profile.mediaUrls || profile.mediaUrls.length === 0) && pic) {
    profile.mediaUrls = [pic];
  }

  // Ensure at least one caption-like post so generator has text
  if (!profile.posts?.length && profile.bio) {
    profile.posts = [
      { caption: profile.bio.split("\n")[0] || profile.name, imageUrls: pic ? [pic] : [] },
    ];
  }

  const source = process.env.IG_SELFHOST_URL ? "selfhost_or_web" : "web_profile";
  return { profile, source };
}
