import { NextRequest, NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  assertPaymentForJob,
  expectedPaystackAmount,
  expectedPaystackCurrency,
  type VerifiedTransaction,
} from "@/lib/paystack";
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

  const data = event.data || {};
  const metadata = data.metadata ?? {};
  const jobId = metadata.jobId || metadata.job_id;
  const username = metadata.username;

  if (!jobId) {
    console.error("[webhook] charge.success missing jobId in metadata", metadata);
    return NextResponse.json(
      { error: "Missing jobId in transaction metadata" },
      { status: 400 }
    );
  }

  const verified: VerifiedTransaction = {
    status: data.status === "success" ? "success" : String(data.status || ""),
    gatewayResponse: data.gateway_response,
    metadata,
    amount: typeof data.amount === "number" ? data.amount : Number(data.amount),
    currency: data.currency
      ? String(data.currency).toUpperCase()
      : expectedPaystackCurrency(),
    reference: data.reference ? String(data.reference) : undefined,
  };

  // Normalize: Paystack charge.success implies success
  if (verified.status !== "success") {
    verified.status = "success";
  }

  const bound = assertPaymentForJob(verified, String(jobId));
  if (!bound.ok) {
    console.error("[webhook] payment bind failed", bound.error, {
      amount: verified.amount,
      expected: expectedPaystackAmount(),
      jobId,
    });
    return NextResponse.json({ received: true, error: bound.error });
  }

  try {
    await completePaidJob(
      String(jobId),
      username ? String(username) : undefined
    );
  } catch (err) {
    console.error("[webhook] completePaidJob failed", err);
    return NextResponse.json({
      received: true,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  return NextResponse.json({ received: true });
}
