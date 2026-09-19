import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/jobStore";
import { verifyTransaction } from "@/lib/paystack";
import { completePaidJob } from "@/lib/completePaidJob";

// Called by the preview page the moment it lands back on
// /preview/[jobId]?paid=1&reference=... . Paystack's callback_url fires
// whether the payment succeeded, failed, or was abandoned -- so this is
// what actually tells those apart, rather than assuming success and
// waiting on a webhook that may never come.
export async function POST(req: NextRequest) {
  const { jobId, reference } = await req.json();

  if (!jobId || !reference) {
    return NextResponse.json({ error: "jobId and reference are required" }, { status: 400 });
  }

  const job = await getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // The webhook usually beats the browser's redirect back from Paystack --
  // if it's already handled this, there's nothing left to check.
  if (job.status === "deploying" || job.status === "done") {
    return NextResponse.json({ status: job.status, siteUrl: job.siteUrl });
  }

  let verified;
  try {
    verified = await verifyTransaction(reference);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }

  if (verified.status !== "success") {
    return NextResponse.json({
      status: "payment_failed",
      reason: verified.gatewayResponse || verified.status,
    });
  }

  // Payment genuinely succeeded but the webhook hasn't landed yet (or isn't
  // reachable, e.g. still on localhost without a tunnel) -- finish the job
  // the same way the webhook would have.
  const username = job.username ?? verified.metadata?.username;
  const updated = await completePaidJob(jobId, username);
  return NextResponse.json({ status: updated.status, siteUrl: updated.siteUrl, error: updated.error });
}
