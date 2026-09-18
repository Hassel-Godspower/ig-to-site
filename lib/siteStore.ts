import { supabase } from "./supabase";

const BUCKET = "sites";

// Site files live here only until payment. At payment time, the webhook
// reads all three files out of this bucket and pushes them into a brand
// new GitHub repo — after that, this bucket's copy is no longer the
// source of truth and can be cleaned up.

export async function saveSiteFiles(jobId: string, files: Record<string, string>): Promise<void> {
  await Promise.all(
    Object.entries(files).map(([filename, content]) => saveSiteFile(jobId, filename, content))
  );
}

export async function saveSiteFile(jobId: string, filename: string, content: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(`${jobId}/${filename}`, new Blob([content]), {
      contentType: CONTENT_TYPES[extOf(filename)] ?? "text/plain; charset=utf-8",
      upsert: true,
    });
  if (error) throw new Error(`Supabase storage upload failed for ${filename}: ${error.message}`);
}

export async function getSiteFile(jobId: string, filename: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from(BUCKET).download(`${jobId}/${filename}`);
  if (error) return null;
  return await data.text();
}

// Pulls all three known site files at once — used by the payment webhook
// when it's ready to push everything into a new GitHub repo.
export async function getAllSiteFiles(jobId: string): Promise<Record<string, string>> {
  const filenames = ["index.html", "styles.css", "script.js"];
  const entries = await Promise.all(
    filenames.map(async (filename) => [filename, await getSiteFile(jobId, filename)] as const)
  );
  const files: Record<string, string> = {};
  for (const [filename, content] of entries) {
    if (content !== null) files[filename] = content;
  }
  return files;
}

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
};

function extOf(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i === -1 ? "" : filename.slice(i);
}
