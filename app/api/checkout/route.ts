import { NextRequest, NextResponse } from "next/server";
import { getJob, updateJob } from "@/lib/jobStore";
import { initializeTransaction } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const jobId = String(body.jobId || "");
  const username = String(body.username || "");
  const email = String(body.email || "").trim();
  const phone = body.phone ? String(body.phone).trim() : "";
  const customerName = body.customerName
    ? String(body.customerName).trim().slice(0, 80)
    : body.name
      ? String(body.name).trim().slice(0, 80)
      : "";
  const returnPath = String(body.returnPath || "preview");

  if (!jobId || !username) {
    return NextResponse.json(
      { error: "jobId and username are required" },
      { status: 400 }
    );
  }
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "A valid email is required for payment" },
      { status: 400 }
    );
  }

  const job = await getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const cleanUsername = sanitizeUsername(username);
  await updateJob(jobId, {
    status: "pending_payment",
    username: cleanUsername,
    email,
    ...(phone ? { phone } : {}),
    ...(customerName ? { customerName } : {}),
  });

  const baseUrl = (process.env.BASE_URL || "").replace(/\/$/, "");
  if (!baseUrl) {
    return NextResponse.json(
      { error: "BASE_URL is not configured on the server" },
      { status: 500 }
    );
  }

  const amount = Number(process.env.PAYSTACK_AMOUNT || 2000000);
  const path =
    returnPath === "preview-simple"
      ? `/preview-simple/${jobId}`
      : `/preview/${jobId}`;

  const { authorizationUrl } = await initializeTransaction({
    email,
    amount,
    callbackUrl: `${baseUrl}${path}?paid=1`,
    metadata: {
      jobId,
      username: cleanUsername,
      ...(phone ? { phone } : {}),
      ...(customerName ? { customerName } : {}),
    },
  });

  return NextResponse.json({ checkoutUrl: authorizationUrl });
}

function sanitizeUsername(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}
