import { getJob, updateJob, Job } from "./jobStore";
import { getPublishFiles } from "./siteStore";
import { createRepoWithFiles } from "./githubRepo";
import {
  deployToCloudflarePages,
  isCloudflareConfigured,
} from "./deployToCloudflare";

/**
 * After successful Paystack payment:
 * 1) Push site to private GitHub repo (source of truth / backup)
 * 2) Deploy to Cloudflare Pages (live URL for the customer)
 * Idempotent if already done.
 */
export async function completePaidJob(
  jobId: string,
  username?: string
): Promise<Job> {
  const job = await getJob(jobId);
  if (!job) throw new Error(`Job ${jobId} not found`);

  // Skip only if already live on Cloudflare. Re-run if still vercel.app or no siteUrl.
  const onCloudflare = Boolean(
    job.siteUrl &&
      (job.siteUrl.includes("pages.dev") ||
        (process.env.CLOUDFLARE_PAGES_DOMAIN &&
          job.siteUrl.includes(process.env.CLOUDFLARE_PAGES_DOMAIN)))
  );
  if (onCloudflare && (job.status === "done" || job.status === "deploying")) {
    return job;
  }

  const finalUsername =
    (username && username.trim()) ||
    job.username ||
    job.parsedUsername ||
    null;

  if (!finalUsername) {
    return await updateJob(jobId, {
      status: "failed",
      error:
        "Payment received but no site username was stored. Retry via /api/deploy with a username.",
    });
  }

  try {
    await updateJob(jobId, {
      status: "deploying",
      username: finalUsername,
      error: null as unknown as string,
    });

    const publishFiles = await getPublishFiles(jobId);
    if (publishFiles.length === 0) {
      throw new Error(
        "No generated files found in storage for this job — nothing to publish."
      );
    }

    // --- 1) GitHub (backup / editable source) ---
    let repoOwner = job.repoOwner;
    let repoName = job.repoName;
    let repoUrl = job.repoUrl;
    let defaultBranch = job.defaultBranch;

    if (!repoUrl) {
      const repo = await createRepoWithFiles(
        publishFiles.map((f) => ({
          path: f.path,
          contentBase64: f.contentBase64,
        })),
        finalUsername
      );
      repoOwner = repo.owner;
      repoName = repo.repoName;
      repoUrl = repo.repoUrl;
      defaultBranch = repo.defaultBranch;
    }

    // --- 2) Cloudflare Pages (live site) ---
    let siteUrl = `https://${repoName || finalUsername}.pages.dev`;
    let cfProject = repoName || finalUsername;

    if (isCloudflareConfigured()) {
      const cf = await deployToCloudflarePages(
        repoName || finalUsername,
        publishFiles
      );
      siteUrl = cf.siteUrl;
      cfProject = cf.projectName;
    } else {
      // Fallback: GitHub only — operator imports to CF/Vercel manually
      siteUrl =
        process.env.FALLBACK_SITE_URL_TEMPLATE?.replace(
          "{name}",
          repoName || finalUsername
        ) || `https://${repoName || finalUsername}.pages.dev`;
    }

    return await updateJob(jobId, {
      status: "done",
      username: cfProject,
      repoOwner: repoOwner ?? undefined,
      repoName: repoName ?? undefined,
      repoUrl: repoUrl ?? undefined,
      defaultBranch: defaultBranch ?? undefined,
      siteUrl,
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
