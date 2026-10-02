import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createJob } from "@/lib/jobStore";
import { generateSite } from "@/lib/generateSite";
import { saveSiteFiles, saveSiteFile } from "@/lib/siteStore";
import type { InstagramProfile } from "@/lib/parseInstagramExport";

const NICHES = [
  "spa_wellness",
  "fitness_gym",
  "beauty_salon",
  "ecommerce_retail",
  "restaurant_food",
  "creative_portfolio",
  "real_estate",
  "general_business",
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

function profileFromHandle(
  handle: string,
  nicheHint: string,
  displayName?: string,
  bio?: string
): InstagramProfile {
  const name = displayName?.trim() || displayNameFromHandle(handle);
  const nicheBio =
    bio?.trim() ||
    (nicheHint.includes("spa")
      ? "Wellness · Massage · Body care. Book your session today."
      : nicheHint.includes("fit")
        ? "Training · Results · Community. Start your journey."
        : nicheHint.includes("beauty")
          ? "Beauty · Hair · Glow. Look and feel your best."
          : nicheHint.includes("ecom") || nicheHint.includes("retail")
            ? "Quality products. Fast delivery. Shop the collection."
            : `${name} on Instagram — now on the open web.`);

  return {
    username: handle,
    name,
    bio: `${nicheBio}\n@${handle}`,
    posts: [
      {
        caption: `${name} — featured work\nCrafted for clients who want quality.`,
        imageUrls: [],
      },
      {
        caption: "What we offer\nClear packages and a simple way to get in touch.",
        imageUrls: [],
      },
      {
        caption: "Gallery\nReal results and moments from our work.",
        imageUrls: [],
      },
    ],
    mediaUrls: [],
  };
}

/**
 * POST { handle, niche?, name?, bio? }
 * Generates a premium multi-page site without Instagram export.
 * Jobs are marked editorMode: "simple".
 */
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

    const profile = profileFromHandle(
      handle,
      niche,
      body.name ? String(body.name) : undefined,
      body.bio ? String(body.bio) : undefined
    );

    // Seed niche into bio so detectNiche / curated images fire correctly
    if (!profile.bio.toLowerCase().includes(niche.split("_")[0])) {
      profile.bio = `${profile.bio}\n${niche.replace(/_/g, " ")}`;
    }

    const files = await generateSite(profile);
    const jobId = nanoid(12);
    await saveSiteFiles(jobId, files);

    // Meta for simple editor (works even if DB column missing)
    await saveSiteFile(
      jobId,
      "editor-meta.json",
      JSON.stringify(
        {
          editorMode: "simple",
          handle,
          niche,
          createdVia: "handle",
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
      // Retry without editorMode if column not migrated yet
      const msg = e instanceof Error ? e.message : String(e);
      if (/editor_mode/i.test(msg)) {
        await createJob({
          id: jobId,
          status: "draft",
          parsedUsername: handle,
        });
      } else {
        throw e;
      }
    }

    return NextResponse.json({
      jobId,
      defaultUsername: handle,
      editorMode: "simple",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
