import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getJob, updateJob } from "@/lib/jobStore";
import { getAllSiteFiles } from "@/lib/siteStore";
import { createRepoWithFiles } from "@/lib/githubRepo";

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

  const job = await getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: `Job ${jobId} not found` }, { status: 404 });
  }

  try {
    // This is the only place a GitHub repo gets created -- only once payment
    // has actually cleared. No Vercel call happens here at all: deploying is
    // a manual step you do from the Vercel dashboard whenever you get to it.
    // This just gets a real repo, with the real files, ready for that.
    const files = await getAllSiteFiles(jobId);
    if (Object.keys(files).length === 0) {
      throw new Error("No generated files found for this job -- nothing to push.");
    }

    const repo = await createRepoWithFiles(files, username);

    await updateJob(jobId, {
      status: "deploying",
      username: repo.repoName, // reflects the final name, in case of a collision suffix
      repoOwner: repo.owner,
      repoName: repo.repoName,
      repoUrl: repo.repoUrl,
      defaultBranch: repo.defaultBranch,
      siteUrl: `https://${repo.repoName}.vercel.app`,
    });
  } catch (err: any) {
    await updateJob(jobId, { status: "failed", error: String(err?.message ?? err) });
  }

  return NextResponse.json({ received: true });
}
