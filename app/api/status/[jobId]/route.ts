import { NextRequest, NextResponse } from "next/server";
import { getJob, updateJob } from "@/lib/jobStore";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const job = await getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if ((job.status === "deploying" || job.status === "done") && job.siteUrl) {
    const isLive = await checkLive(job.siteUrl);
    if (isLive && job.status !== "done") {
      const updated = await updateJob(job.id, {
        status: "done",
        error: undefined as unknown as string,
      });
      return NextResponse.json({
        status: updated.status,
        siteUrl: updated.siteUrl,
        repoUrl: updated.repoUrl,
        error: updated.error,
        live: true,
      });
    }
    return NextResponse.json({
      status: job.status,
      siteUrl: job.siteUrl,
      repoUrl: job.repoUrl,
      error: job.error,
      live: isLive,
    });
  }

  return NextResponse.json({
    status: job.status,
    siteUrl: job.siteUrl,
    repoUrl: job.repoUrl,
    error: job.error,
    live: false,
  });
}

async function checkLive(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
      headers: { "User-Agent": "goke-status-check/1.0" },
    });
    return res.ok;
  } catch {
    return false;
  }
}
