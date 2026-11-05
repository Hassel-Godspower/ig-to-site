import { NextRequest, NextResponse } from "next/server";
import {
  getSiteFile,
  getSiteBinary,
  saveSiteFile,
  isBinaryPath,
  contentTypeFor,
} from "@/lib/siteStore";
import { assertSiteWriteAccess } from "@/lib/editAuth";

const TEXT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function extOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i).toLowerCase();
}

// GET remains public (preview iframe)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string; path: string[] }> }
) {
  const { jobId, path: filePath } = await params;
  const fileName = filePath.join("/");

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

  const content = await getSiteFile(jobId, fileName);
  if (content === null) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return new NextResponse(content, {
    headers: {
      "Content-Type":
        TEXT_TYPES[extOf(fileName)] ?? "text/plain; charset=utf-8",
    },
  });
}

// PUT requires edit token or dashboard access
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string; path: string[] }> }
) {
  const { jobId, path: filePath } = await params;
  const auth = await assertSiteWriteAccess(req, jobId);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const fileName = filePath.join("/");
  const content = await req.text();
  await saveSiteFile(jobId, fileName, content);
  return NextResponse.json({ saved: true });
}
