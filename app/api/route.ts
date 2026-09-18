import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getJob, updateJob } from "@/lib/jobStore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { jobId, username } = await req.json();

  if (!jobId || !username) {
    return NextResponse.json({ error: "jobId and username are required" }, { status: 400 });
  }

  const job = getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const cleanUsername = sanitizeUsername(username);
  updateJob(jobId, { status: "pending_payment", username: cleanUsername });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${baseUrl}/preview/${jobId}?paid=1`,
    cancel_url: `${baseUrl}/preview/${jobId}?canceled=1`,
    metadata: { jobId, username: cleanUsername },
  });

  return NextResponse.json({ checkoutUrl: session.url });
}

function sanitizeUsername(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 50);
}
