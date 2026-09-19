import { NextRequest, NextResponse } from "next/server";
import { getJob, updateJob } from "@/lib/jobStore";

// While a job is "deploying", siteUrl holds the *predicted*
// <repo-name>.vercel.app address — predicted because it only resolves once
// you've manually imported that repo into Vercel. Each poll checks whether
// it's live yet and flips the job to "done" the moment it responds, so
// there's no manual step needed to tell the app "it's live now" — just
// import the repo in Vercel whenever you get to it, and this catches up on
// its own within a few seconds.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const job = await getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (job.status === "deploying" && job.siteUrl) {
    const isLive = await checkLive(job.siteUrl);
    if (isLive) {
      const updated = await updateJob(job.id, { status: "done" });
      return NextResponse.json({ status: updated.status, siteUrl: updated.siteUrl, error: updated.error });
    }
  }

  return NextResponse.json({
    status: job.status,
    siteUrl: job.siteUrl,
    error: job.error,
  });
}

async function checkLive(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    // A domain Vercel hasn't been told about yet still answers (with a 404
    // page), so require a genuine 2xx rather than just "didn't throw."
    return res.ok;
  } catch {
    // DNS/connection failure — not live yet.
    return false;
  }
}
