import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getJob, updateJob } from "@/lib/jobStore";
import { readAllSiteFiles } from "@/lib/siteStore";
import { deployToVercel } from "@/lib/deployToVercel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${err}` }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const jobId = session.metadata?.jobId;
  const username = session.metadata?.username;

  if (!jobId || !username) {
    return NextResponse.json({ error: "Missing jobId/username in session metadata" }, { status: 400 });
  }

  const job = getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: `Job ${jobId} not found` }, { status: 404 });
  }

  try {
    updateJob(jobId, { status: "deploying" });

    const files = readAllSiteFiles(jobId);
    if (Object.keys(files).length === 0) {
      throw new Error("No generated files found for this job — nothing to deploy.");
    }

    // Passing `username` as the Vercel project name gets it the default
    // `<name>.vercel.app` domain on production deploys, PROVIDED that name
    // isn't already taken by another project in the same team/account. If
    // it collides, Vercel will create the project under a modified name
    // and the resulting URL won't be an exact match — worth adding an
    // availability check + "this name's taken, try another" step before
    // charging the customer in a real version of this.
    const { url } = await deployToVercel(files, username);

    updateJob(jobId, { status: "done", siteUrl: url });
  } catch (err: any) {
    updateJob(jobId, { status: "failed", error: String(err?.message ?? err) });
  }

  return NextResponse.json({ received: true });
}
