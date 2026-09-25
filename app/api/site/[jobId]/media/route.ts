import { NextRequest, NextResponse } from "next/server";
import { listMediaFiles, deleteSiteFile } from "@/lib/siteStore";

/**
 * GET  /api/site/[jobId]/media  → list library
 * DELETE /api/site/[jobId]/media?file=media/xxx.jpg
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
  return NextResponse.json({
    items: files.map((filename) => ({
      filename,
      url: `/api/site/${jobId}/${filename}`,
    })),
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  if (!jobId || /[^a-zA-Z0-9_-]/.test(jobId)) {
    return NextResponse.json({ error: "Invalid jobId" }, { status: 400 });
  }
  const file = req.nextUrl.searchParams.get("file") || "";
  if (!file.startsWith("media/") || file.includes("..")) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }
  try {
    await deleteSiteFile(jobId, file);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
