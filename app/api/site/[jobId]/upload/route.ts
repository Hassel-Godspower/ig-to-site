import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { saveSiteBinary, contentTypeFor } from "@/lib/siteStore";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
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
 * multipart form field "file" → stores under media/ and returns public app URL
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
    return NextResponse.json({ error: "Missing file field" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File too large (max 8MB)" },
      { status: 413 }
    );
  }

  const type = file.type || "application/octet-stream";
  if (!ALLOWED.has(type)) {
    return NextResponse.json(
      { error: `Unsupported type: ${type}` },
      { status: 415 }
    );
  }

  const ext = EXT[type] ?? ".bin";
  const filename = `media/${nanoid(12)}${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  try {
    await saveSiteBinary(jobId, filename, buf, type);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  // Served through our API (private bucket) — works in preview & after deploy rewrite if needed
  const url = `/api/site/${jobId}/${filename}`;

  return NextResponse.json({
    ok: true,
    url,
    filename,
    contentType: contentTypeFor(filename),
    size: file.size,
  });
}
