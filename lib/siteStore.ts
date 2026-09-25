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

const BINARY_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".ico",
  ".mp4",
  ".webm",
]);

function extOf(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i === -1 ? "" : filename.slice(i).toLowerCase();
}

export function contentTypeFor(filename: string): string {
  return CONTENT_TYPES[extOf(filename)] ?? "application/octet-stream";
}

export function isBinaryPath(filename: string): boolean {
  return BINARY_EXT.has(extOf(filename));
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
  if (error) {
    throw new Error(
      `Supabase storage upload failed for ${filename}: ${error.message}`
    );
  }
}

/** Binary upload (images / video) under the job prefix */
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
    .storage.from(BUCKET)
    .upload(`${jobId}/${filename}`, body, {
      contentType: contentType ?? contentTypeFor(filename),
      upsert: true,
    });
  if (error) {
    throw new Error(
      `Supabase storage upload failed for ${filename}: ${error.message}`
    );
  }
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

/** Binary download — never call .text() on the result */
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

/** List object names under jobId/media/ */
export async function listMediaFiles(jobId: string): Promise<string[]> {
  const { data, error } = await getSupabase()
    .storage.from(BUCKET)
    .list(`${jobId}/media`, { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  if (error || !data) return [];
  return data
    .filter((f) => f.name && !f.name.endsWith("/"))
    .map((f) => `media/${f.name}`);
}

/** Text site files only (editor preview / legacy) */
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

export type PublishFile = {
  path: string;
  /** utf-8 text OR raw binary bytes as base64 for GitHub Contents API */
  contentBase64: string;
  isBinary: boolean;
};

/**
 * Bundle for GitHub publish:
 * - HTML/CSS/JS with /api/site/{jobId}/media/… rewritten to relative media/…
 * - Each media file as base64 binary
 */
export async function getPublishFiles(jobId: string): Promise<PublishFile[]> {
  const textFiles = await getAllSiteFiles(jobId);
  const out: PublishFile[] = [];

  const rewrite = (s: string) =>
    s.replaceAll(`/api/site/${jobId}/`, "").replaceAll(`/api/site/${jobId}`, "");

  for (const [path, content] of Object.entries(textFiles)) {
    const body = path.endsWith(".html") || path.endsWith(".css") || path.endsWith(".js")
      ? rewrite(content)
      : content;
    out.push({
      path,
      contentBase64: Buffer.from(body, "utf-8").toString("base64"),
      isBinary: false,
    });
  }

  const media = await listMediaFiles(jobId);
  for (const path of media) {
    const blob = await getSiteBinary(jobId, path);
    if (!blob) continue;
    const ab = Buffer.from(await blob.arrayBuffer());
    out.push({
      path,
      contentBase64: ab.toString("base64"),
      isBinary: true,
    });
  }

  return out;
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
