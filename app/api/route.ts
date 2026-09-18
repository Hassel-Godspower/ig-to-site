import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createJob } from "@/lib/jobStore";
import { parseInstagramExport } from "@/lib/parseInstagramExport";
import { generateSite } from "@/lib/generateSite";
import { writeSiteFiles } from "@/lib/siteStore";

// Runs synchronously and returns once the site is generated — there's no
// payment gate here, so there's nothing to defer to a webhook. This is a
// reasonable tradeoff while generation takes single-digit seconds; if it
// grows slower, move it behind a queue and poll /api/status instead.
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Upload your Instagram export file." }, { status: 400 });
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const profile = parseInstagramExport(bytes, file.name);
    const files = await generateSite(profile);

    const jobId = nanoid(12);
    writeSiteFiles(jobId, files);
    createJob({
      id: jobId,
      status: "draft",
      parsedUsername: profile.username || undefined,
    });

    return NextResponse.json({ jobId, defaultUsername: profile.username || "" });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}
