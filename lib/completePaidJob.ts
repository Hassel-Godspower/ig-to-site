import { getJob, updateJob, Job } from "./jobStore";
import { getAllSiteFiles } from "./siteStore";
import { createRepoWithFiles } from "./githubRepo";

// Turns a paid job into a real GitHub repo. Called from two places: the
// Paystack webhook (the normal, fast path) and /api/verify-payment (a
// fallback for when the customer's browser lands back on the preview page
// before the webhook has arrived, or if the webhook is misconfigured).
// Idempotent -- if the job is already "deploying" or "done" by the time
// this runs, it's a no-op, so calling it twice for the same payment never
// creates two repos.
export async function completePaidJob(jobId: string, username?: string): Promise<Job> {
  const job = await getJob(jobId);
  if (!job) throw new Error(`Job ${jobId} not found`);

  if (job.status === "deploying" || job.status === "done") return job;

  const finalUsername = username ?? job.username;
  if (!finalUsername) throw new Error("No username on file for this job");

  try {
    const files = await getAllSiteFiles(jobId);
    if (Object.keys(files).length === 0) {
      throw new Error("No generated files found for this job -- nothing to push.");
    }

    const repo = await createRepoWithFiles(files, finalUsername);

    return await updateJob(jobId, {
      status: "deploying",
      username: repo.repoName, // reflects the final name, in case of a collision suffix
      repoOwner: repo.owner,
      repoName: repo.repoName,
      repoUrl: repo.repoUrl,
      defaultBranch: repo.defaultBranch,
      siteUrl: `https://${repo.repoName}.vercel.app`,
    });
  } catch (err: any) {
    return await updateJob(jobId, { status: "failed", error: String(err?.message ?? err) });
  }
}
