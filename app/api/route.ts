import { NextRequest, NextResponse } from "next/server";
import { getJob, updateJob } from "@/lib/jobStore";
import { readAllSiteFiles } from "@/lib/siteStore";
import { deployToVercel } from "@/lib/deployToVercel";

// Retries a deploy for a job that already paid but failed to go live —
// does not re-run generation or re-charge the customer.
export async function POST(req: NextRequest) {
  const { jobId } = await req.json();
  const job = getJob(jobId);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }
  if (job.status !== "failed" || !job.username) {
    return NextResponse.json(
      { error: `Job status is '${job.status}' — nothing to retry.` },
      { status: 400 }
    );
  }

  try {
    const files = readAllSiteFiles(jobId);
    const { url } = await deployToVercel(files, job.username);
    updateJob(jobId, { status: "done", siteUrl: url, error: undefined });
    return NextResponse.json({ siteUrl: url });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}
