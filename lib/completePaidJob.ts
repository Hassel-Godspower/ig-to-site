import { getJob, updateJob, Job } from "./jobStore";
import { getPublishFiles } from "./siteStore";
import { createRepoWithFiles } from "./githubRepo";

// Turns a paid job into a real GitHub repo. Called from Paystack webhook
// and /api/verify-payment. Idempotent if already deploying/done.
export async function completePaidJob(
  jobId: string,
  username?: string
): Promise<Job> {
  const job = await getJob(jobId);
  if (!job) throw new Error(`Job ${jobId} not found`);

  if (job.status === "deploying" || job.status === "done") return job;

  const finalUsername = username ?? job.username;
  if (!finalUsername) throw new Error("No username on file for this job");

  try {
    const publishFiles = await getPublishFiles(jobId);
    if (publishFiles.length === 0) {
      throw new Error(
        "No generated files found for this job -- nothing to push."
      );
    }

    // Map to RepoFile shape (contentBase64)
    const repo = await createRepoWithFiles(
      publishFiles.map((f) => ({
        path: f.path,
        contentBase64: f.contentBase64,
      })),
      finalUsername
    );

    return await updateJob(jobId, {
      status: "deploying",
      username: repo.repoName,
      repoOwner: repo.owner,
      repoName: repo.repoName,
      repoUrl: repo.repoUrl,
      defaultBranch: repo.defaultBranch,
      siteUrl: `https://${repo.repoName}.vercel.app`,
    });
  } catch (err: any) {
    return await updateJob(jobId, {
      status: "failed",
      error: String(err?.message ?? err),
    });
  }
}
