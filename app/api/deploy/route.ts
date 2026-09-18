import { NextRequest, NextResponse } from "next/server";
import { getJob, updateJob } from "@/lib/jobStore";
import { getAllSiteFiles } from "@/lib/siteStore";
import { createRepoWithFiles } from "@/lib/githubRepo";

// Retries repo creation for a job that paid but failed (e.g. a transient
// GitHub API error) -- does not re-run generation or re-charge the
// customer. Relies on the site files still being in Supabase Storage from
// the original generation.
export async function POST(req: NextRequest) {
  const { jobId } = await req.json();
  const job = await getJob(jobId);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }
  if (job.status !== "failed" || !job.username) {
    return NextResponse.json(
      { error: `Job status is '${job.status}' -- nothing to retry.` },
      { status: 400 }
    );
  }

  try {
    const files = await getAllSiteFiles(jobId);
    if (Object.keys(files).length === 0) {
      throw new Error("No generated files found for this job -- nothing to push.");
    }

    const repo = await createRepoWithFiles(files, job.username);
    await updateJob(jobId, {
      status: "deploying",
      username: repo.repoName,
      repoOwner: repo.owner,
      repoName: repo.repoName,
      repoUrl: repo.repoUrl,
      defaultBranch: repo.defaultBranch,
      siteUrl: `https://${repo.repoName}.vercel.app`,
      error: undefined,
    });
    return NextResponse.json({ status: "deploying" });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}
