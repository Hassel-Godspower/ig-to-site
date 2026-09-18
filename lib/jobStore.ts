import { supabase } from "./supabase";

export interface Job {
  id: string;
  status: "draft" | "pending_payment" | "deploying" | "done" | "failed";
  username?: string;
  parsedUsername?: string;
  siteUrl?: string;
  error?: string;
  repoOwner?: string;
  repoName?: string;
  repoUrl?: string;
  defaultBranch?: string;
}

// Expects a `jobs` table in Supabase. Run this once in the Supabase SQL editor:
//
// create table jobs (
//   id text primary key,
//   status text not null,
//   username text,
//   parsed_username text,
//   site_url text,
//   error text,
//   repo_owner text,
//   repo_name text,
//   repo_url text,
//   default_branch text,
//   created_at timestamptz default now()
// );

export async function createJob(job: Job): Promise<void> {
  const { error } = await supabase.from("jobs").insert({
    id: job.id,
    status: job.status,
    username: job.username ?? null,
    parsed_username: job.parsedUsername ?? null,
    site_url: job.siteUrl ?? null,
    error: job.error ?? null,
    repo_owner: job.repoOwner ?? null,
    repo_name: job.repoName ?? null,
    repo_url: job.repoUrl ?? null,
    default_branch: job.defaultBranch ?? null,
  });
  if (error) throw new Error(`Supabase insert failed: ${error.message}`);
}

export async function getJob(id: string): Promise<Job | null> {
  const { data, error } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Supabase read failed: ${error.message}`);
  if (!data) return null;
  return {
    id: data.id,
    status: data.status,
    username: data.username ?? undefined,
    parsedUsername: data.parsed_username ?? undefined,
    siteUrl: data.site_url ?? undefined,
    error: data.error ?? undefined,
    repoOwner: data.repo_owner ?? undefined,
    repoName: data.repo_name ?? undefined,
    repoUrl: data.repo_url ?? undefined,
    defaultBranch: data.default_branch ?? undefined,
  };
}

export async function updateJob(id: string, patch: Partial<Job>): Promise<Job> {
  const row: Record<string, any> = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.username !== undefined) row.username = patch.username;
  if (patch.parsedUsername !== undefined) row.parsed_username = patch.parsedUsername;
  if (patch.siteUrl !== undefined) row.site_url = patch.siteUrl;
  if (patch.error !== undefined) row.error = patch.error;
  if (patch.repoOwner !== undefined) row.repo_owner = patch.repoOwner;
  if (patch.repoName !== undefined) row.repo_name = patch.repoName;
  if (patch.repoUrl !== undefined) row.repo_url = patch.repoUrl;
  if (patch.defaultBranch !== undefined) row.default_branch = patch.defaultBranch;

  const { error } = await supabase.from("jobs").update(row).eq("id", id);
  if (error) throw new Error(`Supabase update failed: ${error.message}`);

  const updated = await getJob(id);
  if (!updated) throw new Error(`Job ${id} not found after update`);
  return updated;
}
