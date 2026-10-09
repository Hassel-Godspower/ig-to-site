import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createJob } from "@/lib/jobStore";
import { generateSite } from "@/lib/generateSite";
import { saveSiteFiles, saveSiteFile } from "@/lib/siteStore";
import type { InstagramProfile } from "@/lib/parseInstagramExport";
import { enrichFromHandle } from "@/lib/instagramEnrich";

const NICHES = [
  // legacy ids
  "spa_wellness", "fitness_gym", "beauty_salon", "ecommerce_retail",
  "restaurant_food", "creative_portfolio", "real_estate", "general_business",
  "legal_professional", "healthcare_clinic", "auto_dealership", "hotel_stay",
  "education", "church_faith", "tech_saas",
  // 30-niche blueprint ids
  "restaurant_dining", "fast_food_qsr", "cafe_coffee", "bakery_pastry", "bar_lounge",
  "event_centre", "short_let", "fashion_boutique", "african_wear", "jewelry",
  "hair_salon", "barber_shop", "dental_clinic", "pharmacy", "law_firm", "accounting",
  "auto_mechanic", "logistics", "creative_agency", "photography", "coach_consultant",
  "school_education",
] as const;

function sanitizeHandle(raw: string): string {
  return raw
    .trim()
    .replace(/^@+/, "")
    .replace(/[^a-zA-Z0-9._]/g, "")
    .slice(0, 30);
}

function displayNameFromHandle(handle: string): string {
  const base = handle.replace(/[._]+/g, " ").trim();
  return base
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Only used when live enrich fails */
function templateProfile(
  handle: string,
  nicheHint: string
): InstagramProfile {
  const name = displayNameFromHandle(handle);
  return {
    username: handle,
    name,
    bio: `${name} (@${handle})\n${nicheHint.replace(/_/g, " ")}`,
    posts: [
      { caption: `${name}\nWelcome — explore what we offer.`, imageUrls: [] },
      { caption: "Services\nBuilt around what our clients need.", imageUrls: [] },
      { caption: "Gallery\nA look at our work.", imageUrls: [] },
    ],
    mediaUrls: [],
  };
}


/** Ensure generated HTML has data-goke hooks for the visual editor */
function stampEditableHooks(html: string): string {
  let out = html;
  // Headings
  out = out.replace(/<(h[1-6])(\s)(?![^>]*data-goke)/gi, '<$1 data-goke="heading"$2');
  out = out.replace(/<(h[1-6])>/gi, '<$1 data-goke="heading">');
  // Paragraphs
  out = out.replace(/<(p)(\s)(?![^>]*data-goke)/gi, '<$1 data-goke="text"$2');
  out = out.replace(/<(p)>/gi, '<$1 data-goke="text">');
  // Images
  out = out.replace(/<(img)(\s)(?![^>]*data-goke)/gi, '<$1 data-goke="image"$2');
  // Buttons
  out = out.replace(/<(button)(\s)(?![^>]*data-goke)/gi, '<$1 data-goke="button"$2');
  out = out.replace(/<(button)>/gi, '<$1 data-goke="button">');
  // Sections
  out = out.replace(/<(section)(\s)(?![^>]*data-goke)/gi, '<$1 data-goke="section"$2');
  out = out.replace(/<(section)>/gi, '<$1 data-goke="section">');
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const handle = sanitizeHandle(String(body.handle || ""));
    if (handle.length < 2) {
      return NextResponse.json(
        { error: "Enter a valid Instagram handle (e.g. yourbrand)." },
        { status: 400 }
      );
    }

    const nicheRaw = String(body.niche || "general_business");
    const niche = NICHES.includes(nicheRaw as (typeof NICHES)[number])
      ? nicheRaw
      : "general_business";

    let profile: InstagramProfile;
    let enrichSource = "template";

    const enriched = await enrichFromHandle(handle);
    if (enriched?.profile) {
      profile = enriched.profile;
      enrichSource = enriched.source;

      // Keep user niche as soft hint in bio for detectNiche if bio is thin
      if ((profile.bio || "").length < 12) {
        profile.bio = `${profile.bio || profile.name}\n${niche.replace(/_/g, " ")}`.trim();
      }
    } else {
      profile = templateProfile(handle, niche);
    }

    // Optional client overrides
    if (body.name) profile.name = String(body.name).trim();
    if (body.bio) profile.bio = String(body.bio).trim();
    if (body.brandColor && /^#[0-9a-fA-F]{6}$/.test(String(body.brandColor))) {
      profile.brandColor = String(body.brandColor);
    }

    // Prefer user-selected niche for blueprint detection
    (profile as InstagramProfile & { nicheHint?: string }).nicheHint = niche;
    const files = await generateSite(profile);
    for (const [k, v] of Object.entries(files)) {
      if (k.endsWith(".html") && typeof v === "string") {
        files[k] = stampEditableHooks(v);
      }
    }

    // Stamp brand color into CSS so the site isn't a random palette
    if (profile.brandColor && files["styles.css"]) {
      const hex = profile.brandColor;
      let css = files["styles.css"];
      css = css.replace(/--goke-primary\s*:\s*#[0-9a-fA-F]{3,8}/gi, `--goke-primary:${hex}`);
      css = css.replace(/--primary\s*:\s*#[0-9a-fA-F]{3,8}/gi, `--primary:${hex}`);
      if (!css.includes("--goke-primary")) {
        css = `:root{--goke-primary:${hex};--primary:${hex};}\n` + css;
      } else if (!css.trimStart().startsWith(":root") || !css.includes(`--goke-primary:${hex}`)) {
        css = `:root{--goke-primary:${hex};--primary:${hex};}\n` + css;
      }
      files["styles.css"] = css;
    }

    // Force logo URL into HTML if generator omitted it
    const logo = profile.logoUrl || profile.profilePicUrl;
    if (logo) {
      for (const key of Object.keys(files)) {
        if (!key.endsWith(".html")) continue;
        let html = files[key];
        if (!html.includes(logo) && html.includes("brand-logo")) {
          html = html.replace(
            /src="[^"]*"(\s[^>]*class="[^"]*brand-logo)/,
            `src="${logo}"$1`
          );
        }
        if (!html.includes("brand-logo") && html.includes('class="brand"')) {
          html = html.replace(
            /(<a[^>]*class="brand"[^>]*>)/i,
            `$1<img class="brand-logo site-logo" src="${logo}" alt="" width="40" height="40" data-goke="image" />`
          );
        }
        files[key] = html;
      }
    }

    const jobId = nanoid(12);
    await saveSiteFiles(jobId, files);

    await saveSiteFile(
      jobId,
      "editor-meta.json",
      JSON.stringify(
        {
          editorMode: "simple",
          handle,
          niche,
          createdVia: "handle",
          enrichSource,
          brandColor: profile.brandColor || null,
          name: profile.name,
          hasBio: Boolean(profile.bio),
          postCount: profile.posts?.length || 0,
        },
        null,
        2
      )
    );

    try {
      await createJob({
        id: jobId,
        status: "draft",
        parsedUsername: handle,
        editorMode: "simple",
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/editor_mode/i.test(msg)) {
        await createJob({ id: jobId, status: "draft", parsedUsername: handle });
      } else throw e;
    }

    return NextResponse.json({
      jobId,
      defaultUsername: handle,
      editorMode: "simple",
      enrichSource,
      brandColor: profile.brandColor || null,
      name: profile.name,
      hasProfilePic: Boolean(profile.profilePicUrl),
      postCount: profile.posts?.length || 0,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
