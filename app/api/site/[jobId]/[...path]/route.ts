import { NextRequest, NextResponse } from "next/server";
import path from "path";
import {
  getSiteFile,
  getSiteBinary,
  saveSiteFile,
  isBinaryPath,
  contentTypeFor,
} from "@/lib/siteStore";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string; path: string[] }> }
) {
  const { jobId, path: filePath } = await params;
  const fileName = filePath.join("/");

  // Images / video — raw bytes
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

  // HTML / CSS / JS / JSON — text
  const content = await getSiteFile(jobId, fileName);
  if (content === null) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return new NextResponse(content, {
    headers: {
      "Content-Type": contentTypeFor(fileName),
    },
  });
}

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
