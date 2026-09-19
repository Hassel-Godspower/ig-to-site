import { NextRequest, NextResponse } from "next/server";
import { getJob, updateJob } from "@/lib/jobStore";
import { initializeTransaction } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  const { jobId, username, email } = await req.json();

  if (!jobId || !username || !email) {
    return NextResponse.json({ error: "jobId, username and email are required" }, { status: 400 });
  }

  const job = await getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const cleanUsername = sanitizeUsername(username);
  await updateJob(jobId, { status: "pending_payment", username: cleanUsername });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const amount = Number(process.env.PAYSTACK_AMOUNT);

  const { authorizationUrl } = await initializeTransaction({
    email,
    amount,
    callbackUrl: `${baseUrl}/preview/${jobId}?paid=1`,
    metadata: { jobId, username: cleanUsername },
  });

  return NextResponse.json({ checkoutUrl: authorizationUrl });
}

function sanitizeUsername(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 50);
}
