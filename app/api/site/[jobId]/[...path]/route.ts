import { NextRequest, NextResponse } from "next/server";
import path from "path";
import {
  getSiteFile,
  getSiteBinary,
  saveSiteFile,
  isBinaryPath,
  contentTypeFor,
} from "@/lib/siteStore";

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

// GET /api/site/[jobId]/index.html
// also: /api/site/[jobId]/media/xxx.jpg  (binary)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string; path: string[] }> }
) {
  const { jobId, path: filePath } = await params;
  const fileName = filePath.join("/");

  // --- media only (does not touch html/css/js/json) ---
  if (isBinaryPath(fileName)) {
    const blob = await getSiteBinary(jobId, fileName);
    if (!blob) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    const ab = await blob.arrayBuffer();
    return new NextResponse(ab, {
      headers: {
        "Content-Type": contentTypeFor(fileName),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // --- original text path (unchanged) ---
  const content = await getSiteFile(jobId, fileName);

  if (content === null) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const ext = path.extname(fileName);

  return new NextResponse(content, {
    headers: {
      "Content-Type":
        CONTENT_TYPES[ext] ?? "text/plain; charset=utf-8",
    },
  });
}

// PUT /api/site/[jobId]/index.html  (unchanged)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string; path: string[] }> }
) {
  const { jobId, path: filePath } = await params;

  const fileName = filePath.join("/");
  const content = await req.text();

  await saveSiteFile(jobId, fileName, content);

  return NextResponse.json({ saved: true });
}
