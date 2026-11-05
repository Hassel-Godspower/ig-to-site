import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/jobStore";
import { completePaidJob } from "@/lib/completePaidJob";
import {
  verifyTransaction,
  assertPaymentForJob,
} from "@/lib/paystack";
import { assertAdminForce } from "@/lib/editAuth";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * POST { jobId, reference?, username?, force? }
 *
 * Stage 1 rules:
 * - force=true only with header x-goke-admin: ADMIN_PASSWORD
 * - reference present → must verify Paystack + amount + currency + metadata.jobId
 * - no reference → only redeploy stuck/failed/done jobs (not pending_payment)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const jobId = String(body.jobId || "");
    const reference = body.reference ? String(body.reference) : "";
    const usernameOverride = body.username
      ? String(body.username)
      : undefined;
    const force = Boolean(body.force);

    if (!jobId) {
      return NextResponse.json({ error: "jobId required" }, { status: 400 });
    }

    const job = await getJob(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (force) {
      if (!assertAdminForce(req)) {
        return NextResponse.json(
          {
            error:
              "force=true requires x-goke-admin header matching ADMIN_PASSWORD",
          },
          { status: 403 }
        );
      }
    } else if (reference) {
      let verified;
      try {
        verified = await verifyTransaction(reference);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: message }, { status: 500 });
      }
      const bound = assertPaymentForJob(verified, jobId);
      if (!bound.ok) {
        return NextResponse.json(
          { error: bound.error, status: "payment_failed" },
          { status: 400 }
        );
      }
    } else if (job.status === "done") {
      return NextResponse.json({
        status: job.status,
        siteUrl: job.siteUrl,
        repoUrl: job.repoUrl,
      });
    } else if (job.status === "deploying" || job.status === "failed") {
      // Redeploy after a prior paid attempt (no free publish from pending_payment)
    } else {
      return NextResponse.json(
        {
          error:
            "Payment reference required. Complete Paystack checkout first, or pass a verified reference.",
        },
        { status: 400 }
      );
    }

    const username =
      usernameOverride || job.username || job.parsedUsername || undefined;

    const updated = await completePaidJob(jobId, username, force);

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
