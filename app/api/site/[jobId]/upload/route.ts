import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { saveSiteBinary, contentTypeFor } from "@/lib/siteStore";

const MAX = 8 * 1024 * 1024;
const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);
const EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const form = await req.formData();
  const file = form.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (file.size > MAX) {
    return NextResponse.json({ error: "Max 8MB" }, { status: 413 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Unsupported type" }, { status: 415 });
  }

  const filename = `media/\( {nanoid(12)} \){EXT[file.type]}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await saveSiteBinary(jobId, filename, buf, file.type);

  // URL the builder uses (same host as preview)
  const url = `/api/site/\( {jobId}/ \){filename}`;

  return NextResponse.json({
    ok: true,
    url,
    filename,
    contentType: contentTypeFor(filename),
  });
}
