import { getSupabase } from "./supabase";

const BUCKET = "sites";

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

function extOf(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i === -1 ? "" : filename.slice(i).toLowerCase();
}

export function contentTypeFor(filename: string): string {
  return CONTENT_TYPES[extOf(filename)] ?? "application/octet-stream";
}

export function isBinaryPath(filename: string): boolean {
  const ext = extOf(filename);
  return [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".svg",
    ".ico",
    ".mp4",
    ".webm",
  ].includes(ext);
}

export async function saveSiteFiles(
  jobId: string,
  files: Record<string, string>
): Promise<void> {
  await Promise.all(
    Object.entries(files).map(([filename, content]) =>
      saveSiteFile(jobId, filename, content)
    )
  );
}

export async function saveSiteFile(
  jobId: string,
  filename: string,
  content: string
): Promise<void> {
  const { error } = await getSupabase()
    .storage.from(BUCKET)
    .upload(`${jobId}/${filename}`, new Blob([content]), {
      contentType: contentTypeFor(filename),
      upsert: true,
    });
  if (error)
    throw new Error(
      `Supabase storage upload failed for ${filename}: ${error.message}`
    );
}

// add next to your existing CONTENT_TYPES / helpers

const BINARY_EXT = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico", ".mp4", ".webm",
]);

const BINARY_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

function extOf(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i === -1 ? "" : filename.slice(i).toLowerCase();
}

export function isBinaryPath(filename: string): boolean {
  return BINARY_EXT.has(extOf(filename));
}

export function contentTypeFor(filename: string): string {
  return BINARY_TYPES[extOf(filename)] ?? "application/octet-stream";
}

/** Binary download — do NOT use .text() */
export async function getSiteBinary(
  jobId: string,
  filename: string
): Promise<Blob | null> {
  const { data, error } = await getSupabase()
    .storage.from("sites")
    .download(`\( {jobId}/ \){filename}`);
  if (error || !data) return null;
  return data;
}

/** Binary upload for media library */
export async function saveSiteBinary(
  jobId: string,
  filename: string,
  data: ArrayBuffer | Buffer | Blob,
  contentType?: string
): Promise<void> {
  const body =
    data instanceof Blob
      ? data
      : new Blob([data as BlobPart], {
          type: contentType ?? contentTypeFor(filename),
        });
  const { error } = await getSupabase()
    .storage.from("sites")
    .upload(`\( {jobId}/ \){filename}`, body, {
      contentType: contentType ?? contentTypeFor(filename),
      upsert: true,
    });
  if (error) {
    throw new Error(`Upload failed for ${filename}: ${error.message}`);
  }
}

/** Binary upload (images, video) into the job's storage prefix */
export async function saveSiteBinary(
  jobId: string,
  filename: string,
  data: ArrayBuffer | Blob | Buffer,
  contentType?: string
): Promise<void> {
  const body =
    data instanceof Blob
      ? data
      : new Blob([data as BlobPart], {
          type: contentType ?? contentTypeFor(filename),
        });
  const { error } = await getSupabase()
    .storage.from(BUCKET)
    .upload(`${jobId}/${filename}`, body, {
      contentType: contentType ?? contentTypeFor(filename),
      upsert: true,
    });
  if (error)
    throw new Error(
      `Supabase storage upload failed for ${filename}: ${error.message}`
    );
}

export async function getSiteFile(
  jobId: string,
  filename: string
): Promise<string | null> {
  const { data, error } = await getSupabase()
    .storage.from(BUCKET)
    .download(`${jobId}/${filename}`);
  if (error || !data) return null;
  return await data.text();
}

export async function getSiteBinary(
  jobId: string,
  filename: string
): Promise<Blob | null> {
  const { data, error } = await getSupabase()
    .storage.from(BUCKET)
    .download(`${jobId}/${filename}`);
  if (error || !data) return null;
  return data;
}

/** Publish artifacts only (HTML/CSS/JS). editor.json stays for re-edit. */
export async function getAllSiteFiles(
  jobId: string
): Promise<Record<string, string>> {
  const filenames = ["index.html", "styles.css", "script.js"];
  const entries = await Promise.all(
    filenames.map(
      async (filename) =>
        [filename, await getSiteFile(jobId, filename)] as const
    )
  );
  const files: Record<string, string> = {};
  for (const [filename, content] of entries) {
    if (content !== null) files[filename] = content;
  }
  return files;
}

export async function saveEditorDocument(
  jobId: string,
  json: string
): Promise<void> {
  await saveSiteFile(jobId, "editor.json", json);
}

export async function getEditorDocument(
  jobId: string
): Promise<string | null> {
  return getSiteFile(jobId, "editor.json");
}
