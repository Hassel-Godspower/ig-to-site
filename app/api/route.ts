import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readSiteFile, writeSiteFile, CONTENT_TYPES } from "@/lib/siteStore";

// GET /api/site/[jobId]/index.html (or styles.css, script.js) — serves the
// raw file so the preview page's iframe can render it same-origin.
export async function GET(
  _req: NextRequest,
  { params }: { params: { jobId: string; path: string[] } }
) {
  const fileName = params.path.join("/");
  const content = readSiteFile(params.jobId, fileName);

  if (content === null) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const ext = path.extname(fileName);
  return new NextResponse(content, {
    headers: { "Content-Type": CONTENT_TYPES[ext] ?? "text/plain; charset=utf-8" },
  });
}

// PUT /api/site/[jobId]/index.html — overwrites a file with edited content.
// Used by the preview page's "Save" button after in-browser editing.
export async function PUT(
  req: NextRequest,
  { params }: { params: { jobId: string; path: string[] } }
) {
  const fileName = params.path.join("/");
  const content = await req.text();
  writeSiteFile(params.jobId, fileName, content);
  return NextResponse.json({ saved: true });
}
