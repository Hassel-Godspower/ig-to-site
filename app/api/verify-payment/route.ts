import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/jobStore";
import { verifyTransaction } from "@/lib/paystack";
import { completePaidJob } from "@/lib/completePaidJob";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST { jobId, reference }
 * Verifies Paystack payment then creates the GitHub repo immediately.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const jobId = String(body.jobId || "");
    const reference = String(body.reference || body.trxref || "");

    if (!jobId || !reference) {
      return NextResponse.json(
        { error: "jobId and reference are required" },
        { status: 400 }
      );
    }

    const job = await getJob(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.status === "deploying" || job.status === "done") {
      return NextResponse.json({
        status: job.status,
        siteUrl: job.siteUrl,
        repoUrl: job.repoUrl,
      });
    }

    let verified;
    try {
      verified = await verifyTransaction(reference);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: message }, { status: 500 });
    }

    if (verified.status !== "success") {
      return NextResponse.json({
        status: "payment_failed",
        reason: verified.gatewayResponse || verified.status,
      });
    }

    const username =
      job.username ||
      verified.metadata?.username ||
      job.parsedUsername ||
      undefined;

    const updated = await completePaidJob(jobId, username);

    return NextResponse.json({
      status: updated.status,
      siteUrl: updated.siteUrl,
      repoUrl: updated.repoUrl,
      error: updated.error,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
