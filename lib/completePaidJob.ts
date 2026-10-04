import { getJob, updateJob, Job } from "./jobStore";
import { getPublishFiles } from "./siteStore";
import { createRepoWithFiles } from "./githubRepo";

/**
 * After successful Paystack payment: create GitHub repo with all site files.
 * Idempotent if already deploying/done.
 */
export async function completePaidJob(
  jobId: string,
  username?: string
): Promise<Job> {
  const job = await getJob(jobId);
  if (!job) throw new Error(`Job ${jobId} not found`);

  // Already have a repo — skip. If "deploying" without repoUrl, retry publish.
  if (job.status === "done") return job;
  if (job.status === "deploying" && job.repoUrl) return job;

  // Prefer explicit username → job.username → parsedUsername
  const finalUsername =
    (username && username.trim()) ||
    job.username ||
    job.parsedUsername ||
    null;

  if (!finalUsername) {
    const failed = await updateJob(jobId, {
      status: "failed",
      error:
        "Payment received but no site username was stored. Retry via /api/deploy with a username.",
    });
    return failed;
  }

  try {
    // Prevent double concurrent runs
    await updateJob(jobId, {
      status: "deploying",
      username: finalUsername,
      error: null as unknown as string,
    });

    const publishFiles = await getPublishFiles(jobId);
    if (publishFiles.length === 0) {
      throw new Error(
        "No generated files found in storage for this job — nothing to push to GitHub."
      );
    }

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
      error: undefined as unknown as string,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return await updateJob(jobId, {
      status: "failed",
      error: message,
    });
  }
}
