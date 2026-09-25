import { NextRequest, NextResponse } from "next/server";
import { listMediaFiles } from "@/lib/siteStore";

/**
 * GET /api/site/[jobId]/media
 * Returns uploaded media paths + public app URLs for the media library.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  if (!jobId || /[^a-zA-Z0-9_-]/.test(jobId)) {
    return NextResponse.json({ error: "Invalid jobId" }, { status: 400 });
  }

  const files = await listMediaFiles(jobId);
  const items = files.map((filename) => ({
    filename,
    url: `/api/site/${jobId}/${filename}`,
  }));

  return NextResponse.json({ items });
}
