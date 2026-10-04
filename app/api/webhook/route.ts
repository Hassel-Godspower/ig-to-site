import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paystack";
import { completePaidJob } from "@/lib/completePaidJob";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const metadata = event.data?.metadata ?? {};
  const jobId = metadata.jobId || metadata.job_id;
  const username = metadata.username;

  if (!jobId) {
    console.error("[webhook] charge.success missing jobId in metadata", metadata);
    return NextResponse.json(
      { error: "Missing jobId in transaction metadata" },
      { status: 400 }
    );
  }

  try {
    await completePaidJob(String(jobId), username ? String(username) : undefined);
  } catch (err) {
    console.error("[webhook] completePaidJob failed", err);
    // Still 200 so Paystack does not infinite-retry with same broken state
    // Client verify-payment /api/deploy can retry.
    return NextResponse.json({
      received: true,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  return NextResponse.json({ received: true });
}
