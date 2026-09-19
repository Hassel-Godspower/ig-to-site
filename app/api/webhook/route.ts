import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paystack";
import { completePaidJob } from "@/lib/completePaidJob";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const metadata = event.data?.metadata ?? {};
  const jobId = metadata.jobId;
  const username = metadata.username;

  if (!jobId || !username) {
    return NextResponse.json({ error: "Missing jobId/username in transaction metadata" }, { status: 400 });
  }

  // No Vercel call happens here at all -- deploying is a manual step you do
  // from the Vercel dashboard whenever you get to it. This just gets a real
  // repo, with the real files, ready for that.
  await completePaidJob(jobId, username);

  return NextResponse.json({ received: true });
}
