import { getJob, updateJob, Job } from "./jobStore";
import { getPublishFiles } from "./siteStore";
import { createRepoWithFiles } from "./githubRepo";
import {
  deployToCloudflarePages,
  isCloudflareConfigured,
} from "./deployToCloudflare";

/**
 * After payment: GitHub backup + Cloudflare Pages live URL.
 * Pass force=true to re-upload even if already on pages.dev.
 */
export async function completePaidJob(
  jobId: string,
  username?: string,
  force = false
): Promise<Job> {
  const job = await getJob(jobId);
  if (!job) throw new Error(`Job ${jobId} not found`);

  const onCloudflare = Boolean(
    job.siteUrl &&
      (job.siteUrl.includes("pages.dev") ||
        (process.env.CLOUDFLARE_PAGES_DOMAIN &&
          job.siteUrl.includes(process.env.CLOUDFLARE_PAGES_DOMAIN)))
  );

  if (!force && onCloudflare && (job.status === "done" || job.status === "deploying")) {
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

    let repoOwner = job.repoOwner;
    let repoName = job.repoName;
    let repoUrl = job.repoUrl;
    let defaultBranch = job.defaultBranch;

    if (!repoUrl || force) {
      try {
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
      } catch (ghErr: unknown) {
        // If repo already exists, continue to Cloudflare
        const m = ghErr instanceof Error ? ghErr.message : String(ghErr);
        if (!/already exists|name already taken/i.test(m) && !repoUrl) {
          // soft: still try CF if we have a name
          console.error("GitHub push warning:", m);
        }
      }
    }

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
      throw new Error(
        "CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN not set on Vercel"
      );
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
