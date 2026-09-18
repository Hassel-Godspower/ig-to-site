import fs from "fs";
import path from "path";

export interface Job {
  id: string;
  status: "draft" | "pending_payment" | "deploying" | "done" | "failed";
  username?: string; // desired subdomain, e.g. "username" -> username.vercel.app
  parsedUsername?: string; // username as read from the Instagram export, used as a default
  siteUrl?: string;
  error?: string;
}

const JOBS_DIR = path.join(process.cwd(), ".jobs");

function ensureDir() {
  if (!fs.existsSync(JOBS_DIR)) fs.mkdirSync(JOBS_DIR, { recursive: true });
}

function jobPath(id: string): string {
  return path.join(JOBS_DIR, `${id}.json`);
}

export function createJob(job: Job): void {
  ensureDir();
  fs.writeFileSync(jobPath(job.id), JSON.stringify(job, null, 2));
}

export function getJob(id: string): Job | null {
  try {
    return JSON.parse(fs.readFileSync(jobPath(id), "utf-8"));
  } catch {
    return null;
  }
}

export function updateJob(id: string, patch: Partial<Job>): Job {
  const current = getJob(id);
  if (!current) throw new Error(`Job ${id} not found`);
  const updated = { ...current, ...patch };
  fs.writeFileSync(jobPath(id), JSON.stringify(updated, null, 2));
  return updated;
}
