import fs from "fs";
import path from "path";

const SITES_DIR = path.join(process.cwd(), ".jobs", "sites");

function siteDir(jobId: string): string {
  return path.join(SITES_DIR, jobId);
}

export function writeSiteFiles(jobId: string, files: Record<string, string>): void {
  const dir = siteDir(jobId);
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), content, "utf-8");
  }
}

export function writeSiteFile(jobId: string, name: string, content: string): void {
  const dir = siteDir(jobId);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), content, "utf-8");
}

export function readSiteFile(jobId: string, name: string): string | null {
  try {
    return fs.readFileSync(path.join(siteDir(jobId), name), "utf-8");
  } catch {
    return null;
  }
}

export function readAllSiteFiles(jobId: string): Record<string, string> {
  const dir = siteDir(jobId);
  if (!fs.existsSync(dir)) return {};
  const out: Record<string, string> = {};
  for (const name of fs.readdirSync(dir)) {
    out[name] = fs.readFileSync(path.join(dir, name), "utf-8");
  }
  return out;
}

export const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
};
