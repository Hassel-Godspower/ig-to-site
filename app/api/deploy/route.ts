import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/jobStore";
import { completePaidJob } from "@/lib/completePaidJob";
import {
  verifyTransaction,
  assertPaymentForJob,
} from "@/lib/paystack";
import { assertAdminForce } from "@/lib/editAuth";
import { verifyDashboardToken } from "@/lib/dashboardAuth";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * POST { jobId, reference?, username?, force?, access? }
 *
 * - force=true: admin header OR dashboard access token that owns the job
 * - reference: verify Paystack (amount + currency + metadata.jobId)
 * - no reference / no force: only retry deploying | failed (not pending_payment)
 * - done + no force: return current status (no silent free republish)
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
    const access = body.access ? String(body.access).trim() : "";

    if (!jobId) {
      return NextResponse.json({ error: "jobId required" }, { status: 400 });
    }

    const job = await getJob(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (force) {
      const adminOk = assertAdminForce(req);
      let ownerOk = false;

      if (!adminOk && access) {
        const verified = verifyDashboardToken(access);
        if (
          verified &&
          job.email &&
          verified.email === job.email.trim().toLowerCase()
        ) {
          ownerOk = true;
        }
      }

      if (!adminOk && !ownerOk) {
        return NextResponse.json(
          {
            error:
              "force=true requires x-goke-admin or a valid dashboard access token for this job.",
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
        error: job.error || null,
      });
    } else if (job.status === "deploying" || job.status === "failed") {
      // Retry after a prior paid attempt — no free publish from pending_payment
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
        {
          error: updated.error || "Deploy failed",
          status: "failed",
          siteUrl: updated.siteUrl || null,
          repoUrl: updated.repoUrl || null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: updated.status,
      siteUrl: updated.siteUrl,
      repoUrl: updated.repoUrl,
      error: updated.error || null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
