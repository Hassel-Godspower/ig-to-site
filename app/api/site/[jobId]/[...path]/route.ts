import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { getSiteFile, saveSiteFile } from "@/lib/siteStore";

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
};

// GET /api/site/[jobId]/index.html
// Reads the requested file from Supabase Storage so the preview iframe
// can render the generated site.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string; path: string[] }> }
) {
  const { jobId, path: filePath } = await params;

  const fileName = filePath.join("/");
  const content = await getSiteFile(jobId, fileName);

  if (content === null) {
    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    );
  }

  const ext = path.extname(fileName);

  return new NextResponse(content, {
    headers: {
      "Content-Type":
        CONTENT_TYPES[ext] ?? "text/plain; charset=utf-8",
    },
  });
}

// PUT /api/site/[jobId]/index.html
// Overwrites a generated site file in Supabase Storage.
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
