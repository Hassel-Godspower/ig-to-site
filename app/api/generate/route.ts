import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createJob } from "@/lib/jobStore";
import { parseInstagramExport } from "@/lib/parseInstagramExport";
import { generateSite } from "@/lib/generateSite";
import { saveSiteFiles } from "@/lib/siteStore";

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
