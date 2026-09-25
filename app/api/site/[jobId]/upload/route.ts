import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { saveSiteBinary, contentTypeFor } from "@/lib/siteStore";

const MAX = 12 * 1024 * 1024; // 12 MB
const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
]);
const EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

/**
 * POST /api/site/[jobId]/upload
 * multipart field "file" → media/{id}.{ext}
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  if (!jobId || /[^a-zA-Z0-9_-]/.test(jobId)) {
    return NextResponse.json({ error: "Invalid jobId" }, { status: 400 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form" }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (file.size > MAX) {
    return NextResponse.json({ error: "Max 12MB" }, { status: 413 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: `Unsupported type: ${file.type}` },
      { status: 415 }
    );
  }

  const ext = EXT[file.type] ?? ".bin";
  const filename = `media/${nanoid(12)}${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  try {
    await saveSiteBinary(jobId, filename, buf, file.type);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const url = `/api/site/${jobId}/${filename}`;

  return NextResponse.json({
    ok: true,
    url,
    filename,
    contentType: contentTypeFor(filename),
    size: file.size,
  });
}
