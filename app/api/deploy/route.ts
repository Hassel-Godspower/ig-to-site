import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/jobStore";
import { completePaidJob } from "@/lib/completePaidJob";
import { verifyTransaction } from "@/lib/paystack";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST { jobId, reference?, username? }
 * Retry GitHub repo creation after payment (failed jobs or stuck pending).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const jobId = String(body.jobId || "");
    const reference = body.reference ? String(body.reference) : "";
    const usernameOverride = body.username
      ? String(body.username)
      : undefined;

    if (!jobId) {
      return NextResponse.json({ error: "jobId required" }, { status: 400 });
    }

    const job = await getJob(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // If reference provided, confirm payment first
    if (reference) {
      const verified = await verifyTransaction(reference);
      if (verified.status !== "success") {
        return NextResponse.json(
          {
            error: "Payment not successful",
            reason: verified.gatewayResponse || verified.status,
          },
          { status: 400 }
        );
      }
    } else if (
      job.status !== "failed" &&
      job.status !== "pending_payment" &&
      job.status !== "deploying"
    ) {
      // Only allow blind retry for failed / stuck
      if (job.status === "done") {
        return NextResponse.json({
          status: job.status,
          siteUrl: job.siteUrl,
          repoUrl: job.repoUrl,
        });
      }
      return NextResponse.json(
        {
          error: `Job status is '${job.status}'. Pass payment reference to force, or wait for payment.`,
        },
        { status: 400 }
      );
    }

    const username =
      usernameOverride ||
      job.username ||
      job.parsedUsername ||
      undefined;

    const updated = await completePaidJob(jobId, username);
    if (updated.status === "failed") {
      return NextResponse.json(
        { error: updated.error, status: "failed" },
        { status: 500 }
      );
    }
    return NextResponse.json({
      status: updated.status,
      siteUrl: updated.siteUrl,
      repoUrl: updated.repoUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
