import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/jobStore";
import { completePaidJob } from "@/lib/completePaidJob";

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

  const updated = await completePaidJob(jobId, job.username);
  if (updated.status === "failed") {
    return NextResponse.json({ error: updated.error }, { status: 500 });
  }
  return NextResponse.json({ status: updated.status, siteUrl: updated.siteUrl });
}
