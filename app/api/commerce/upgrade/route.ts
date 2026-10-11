import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/jobStore";
import { initializeTransaction } from "@/lib/paystack";
import { requirePublishedJob, errJson, json } from "@/lib/commerceAuth";

export const runtime = "nodejs";

/**
 * POST { jobId, email, product: "commerce"|"booking"|"both" }
 * Paystack unlock for Gòke Commerce / Booking Pro (published sites only).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const jobId = String(body.jobId || "");
    const email = String(body.email || "").trim().toLowerCase();
    const product = String(body.product || "commerce") as
      | "commerce"
      | "booking"
      | "both";

    if (!jobId || !email.includes("@")) {
      return json({ error: "jobId and email required" }, 400, req);
    }

    const job = await requirePublishedJob(jobId);
    const owner = (job.email || "").trim().toLowerCase();
    if (owner && owner !== email) {
      return json(
        { error: "Use the same email as checkout / dashboard" },
        403,
        req
      );
    }

    const commerceAmt = Number(process.env.COMMERCE_UPGRADE_AMOUNT || 1500000);
    const bookingAmt = Number(process.env.BOOKING_UPGRADE_AMOUNT || 1000000);
    let amount = commerceAmt;
    if (product === "booking") amount = bookingAmt;
    if (product === "both") amount = commerceAmt + bookingAmt;

    const baseUrl = (process.env.BASE_URL || "").replace(/\/$/, "");
    if (!baseUrl) return json({ error: "BASE_URL not set" }, 500, req);

    const { authorizationUrl, reference } = await initializeTransaction({
      email,
      amount,
      callbackUrl: `${baseUrl}/dashboard?upgrade=1&jobId=${encodeURIComponent(jobId)}&product=${encodeURIComponent(product)}`,
      metadata: {
        jobId,
        type: "goke_infra_upgrade",
        product,
      },
    });

    return json({ checkoutUrl: authorizationUrl, reference, amount, product }, 200, req);
  } catch (err) {
    return errJson(err, req);
  }
}
