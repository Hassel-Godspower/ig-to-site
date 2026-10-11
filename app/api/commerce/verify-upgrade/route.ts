import { NextRequest } from "next/server";
import { getJob, updateJob } from "@/lib/jobStore";
import { verifyTransaction } from "@/lib/paystack";
import { json, errJson } from "@/lib/commerceAuth";

export const runtime = "nodejs";

/** POST { jobId, reference, product? } */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const jobId = String(body.jobId || "");
    const reference = String(body.reference || "");
    if (!jobId || !reference) {
      return json({ error: "jobId and reference required" }, 400, req);
    }

    const verified = await verifyTransaction(reference);
    if (verified.status !== "success") {
      return json(
        {
          error: "Payment not successful",
          reason: verified.gatewayResponse || verified.status,
        },
        400,
        req
      );
    }

    const meta = verified.metadata || {};
    const product = String(
      body.product || meta.product || meta.Product || "commerce"
    );

    const job = await getJob(jobId);
    if (!job) return json({ error: "Job not found" }, 404, req);

    // Optional: metadata jobId must match if present
    if (meta.jobId && String(meta.jobId) !== jobId) {
      return json({ error: "Payment metadata job mismatch" }, 400, req);
    }

    const patch: { commerceTier?: "pro"; bookingTier?: "pro" } = {};
    if (product === "commerce" || product === "both") patch.commerceTier = "pro";
    if (product === "booking" || product === "both") patch.bookingTier = "pro";
    if (!Object.keys(patch).length) patch.commerceTier = "pro";

    const updated = await updateJob(jobId, patch);
    return json(
      {
        ok: true,
        commerceTier: updated.commerceTier || "lite",
        bookingTier: updated.bookingTier || "lite",
      },
      200,
      req
    );
  } catch (err) {
    return errJson(err, req);
  }
}
