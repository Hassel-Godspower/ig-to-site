import { getJob, updateJob, Job } from "./jobStore";
import { getPublishFiles } from "./siteStore";
import { createRepoWithFiles } from "./githubRepo";
import {
  deployToCloudflarePages,
  isCloudflareConfigured,
} from "./deployToCloudflare";
import { notifySiteReady } from "./notifySiteReady";

/**
 * After payment: GitHub → Cloudflare Pages → email link to customer.
 * Verifies live URL before marking done when possible.
 */

async function verifyLiveUrl(url: string, attempts = 5): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(12000),
        headers: { "User-Agent": "goke-deploy-check/1.0" },
      });
      if (res.ok) return true;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 2500 * (i + 1)));
  }
  return false;
}

function humanDeployError(raw: string): string {
  const m = raw || "Unknown deploy error";
  if (/CLOUDFLARE_ACCOUNT_ID|CLOUDFLARE_API_TOKEN|not set/i.test(m)) {
    return "Cloudflare is not configured on the server (missing ACCOUNT_ID or API token). Contact support.";
  }
  if (/No index\.html/i.test(m)) {
    return "Publish failed: site is missing index.html. Re-save in the editor, then retry deploy.";
  }
  if (/No generated files|nothing to publish/i.test(m)) {
    return "No site files found for this job. Generate the site again, then pay / retry deploy.";
  }
  if (/username/i.test(m) && /not stored|required/i.test(m)) {
    return "Payment received but username is missing. Retry deploy with a username.";
  }
  if (/rate limit|429/i.test(m)) {
    return "Deploy rate-limited by Cloudflare or GitHub. Wait a minute and retry.";
  }
  if (/manifest/i.test(m)) {
    return "Cloudflare rejected the upload package. Retry deploy; if it persists, contact support.";
  }
  return m.length > 280 ? m.slice(0, 277) + "…" : m;
}

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

  if (
    !force &&
    onCloudflare &&
    job.status === "done" &&
    job.siteUrl
  ) {
    const stillLive = await verifyLiveUrl(job.siteUrl, 2);
    if (stillLive) return job;
  }

  if (!force && onCloudflare && job.status === "deploying") {
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
      error: humanDeployError(
        "Payment received but no site username was stored. Retry via /api/deploy with a username."
      ),
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
        "No generated files in storage for this job — nothing to publish."
      );
    }

    let repoOwner = job.repoOwner;
    let repoName = job.repoName;
    let repoUrl = job.repoUrl;
    let defaultBranch = job.defaultBranch;

    if (!repoUrl) {
      try {
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
      } catch (ghErr: unknown) {
        const m = ghErr instanceof Error ? ghErr.message : String(ghErr);
        if (!/already exists|name already taken/i.test(m)) {
          console.error("GitHub:", m);
        }
      }
    }

    if (!isCloudflareConfigured()) {
      throw new Error(
        "CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN not set on Vercel"
      );
    }

    const cf = await deployToCloudflarePages(
      repoName || finalUsername,
      publishFiles
    );

    const live = await verifyLiveUrl(cf.siteUrl, 5);
    if (!live) {
      // Still mark done with URL — Pages often needs extra DNS/propagation time
      console.warn(
        "Deployed but live check not OK yet:",
        cf.siteUrl,
        "files=",
        cf.fileCount
      );
    }

    const updated = await updateJob(jobId, {
      status: "done",
      username: cf.projectName,
      repoOwner: repoOwner ?? undefined,
      repoName: repoName ?? undefined,
      repoUrl: repoUrl ?? undefined,
      defaultBranch: defaultBranch ?? undefined,
      siteUrl: cf.siteUrl,
      error: live
        ? (undefined as unknown as string)
        : ("Site deployed; URL may take a minute to resolve. Refresh " +
            cf.siteUrl) as unknown as string,
    });

    try {
      const notify = await notifySiteReady({
        siteUrl: cf.siteUrl,
        username: cf.projectName,
        email: job.email,
        phone: (job as Job & { phone?: string }).phone,
        businessName: job.username || cf.projectName,
      });
      if (notify.errors.length) {
        console.error("notifySiteReady:", notify.errors.join("; "));
      }
    } catch (nErr) {
      console.error("notifySiteReady failed", nErr);
    }

    return updated;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return await updateJob(jobId, {
      status: "failed",
      error: humanDeployError(message),
    });
  }
}
