import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createJob } from "@/lib/jobStore";
import { parseInstagramExport } from "@/lib/parseInstagramExport";
import { generateSite } from "@/lib/generateSite";
import { saveSiteFiles } from "@/lib/siteStore";

// Mirrors the client-side check in app/page.tsx. On Vercel, oversized
// requests are usually rejected by the platform itself before this code
// ever runs -- but if this app is hosted elsewhere (Render, a VM), that
// platform-level cutoff doesn't exist, so this is the real backstop there.
const MAX_FILE_BYTES = 4 * 1024 * 1024;

// Runs synchronously and returns once the site is generated. Nothing gets
// created in GitHub here -- files are stored in Supabase Storage only, so
// browsing/generating/editing is free and leaves no trace in your GitHub
// account. A repo only gets created once someone actually pays (see
// app/api/webhook/route.ts).
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Upload your Instagram export file." }, { status: 400 });
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      {
        error:
          `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB, over the 4 MB limit. ` +
          "Export just your profile and posts (not messages, stories, or media) to keep it small.",
      },
      { status: 413 }
    );
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const profile = parseInstagramExport(bytes, file.name);
    const files = await generateSite(profile);

    const jobId = nanoid(12);
    await saveSiteFiles(jobId, files);

    await createJob({
      id: jobId,
      status: "draft",
      parsedUsername: profile.username || undefined,
    });

    return NextResponse.json({ jobId, defaultUsername: profile.username || "" });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}
