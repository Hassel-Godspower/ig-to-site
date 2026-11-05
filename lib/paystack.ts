import crypto from "crypto";

const PAYSTACK_API = "https://api.paystack.co";

export interface InitializedTransaction {
  authorizationUrl: string;
  reference: string;
}

export async function initializeTransaction(params: {
  email: string;
  amount: number;
  callbackUrl: string;
  metadata: Record<string, string>;
}): Promise<InitializedTransaction> {
  const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amount,
      currency: process.env.PAYSTACK_CURRENCY || "NGN",
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(`Paystack initialize failed: ${data.message ?? res.status}`);
  }

  return {
    authorizationUrl: data.data.authorization_url,
    reference: data.data.reference,
  };
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null
): boolean {
  if (!signature || !process.env.PAYSTACK_SECRET_KEY) return false;
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(hash, "utf8"),
      Buffer.from(signature, "utf8")
    );
  } catch {
    return hash === signature;
  }
}

export interface VerifiedTransaction {
  status: string;
  gatewayResponse?: string;
  metadata?: Record<string, any>;
  /** Amount in smallest currency unit (kobo for NGN) */
  amount?: number;
  currency?: string;
  reference?: string;
  paidAt?: string | null;
}

export async function verifyTransaction(
  reference: string
): Promise<VerifiedTransaction> {
  const res = await fetch(
    `\( {PAYSTACK_API}/transaction/verify/ \){encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );
  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(`Paystack verify failed: ${data.message ?? res.status}`);
  }
  const d = data.data || {};
  return {
    status: d.status,
    gatewayResponse: d.gateway_response,
    metadata: d.metadata || {},
    amount: typeof d.amount === "number" ? d.amount : Number(d.amount),
    currency: d.currency ? String(d.currency).toUpperCase() : undefined,
    reference: d.reference ? String(d.reference) : reference,
    paidAt: d.paid_at ?? null,
  };
}

/** Expected publish fee from env (kobo). Default ₦20,000. */
export function expectedPaystackAmount(): number {
  const n = Number(process.env.PAYSTACK_AMOUNT || 2000000);
  return Number.isFinite(n) && n > 0 ? n : 2000000;
}

export function expectedPaystackCurrency(): string {
  return (process.env.PAYSTACK_CURRENCY || "NGN").toUpperCase();
}

/**
 * Ensure a successful Paystack transaction belongs to this job and amount.
 */
export function assertPaymentForJob(
  verified: VerifiedTransaction,
  jobId: string
): { ok: true } | { ok: false; error: string } {
  if (verified.status !== "success") {
    return {
      ok: false,
      error: verified.gatewayResponse || verified.status || "Payment not successful",
    };
  }

  const meta = verified.metadata || {};
  const metaJob = String(meta.jobId || meta.job_id || "").trim();
  if (!metaJob) {
    return {
      ok: false,
      error: "Payment metadata missing jobId — cannot bind payment to this site",
    };
  }
  if (metaJob !== jobId) {
    return {
      ok: false,
      error: "Payment reference does not belong to this job",
    };
  }

  const expected = expectedPaystackAmount();
  if (
    typeof verified.amount === "number" &&
    Number.isFinite(verified.amount) &&
    verified.amount !== expected
  ) {
    return {
      ok: false,
      error: `Payment amount mismatch (got ${verified.amount}, expected ${expected})`,
    };
  }

  const cur = (verified.currency || expectedPaystackCurrency()).toUpperCase();
  if (cur !== expectedPaystackCurrency()) {
    return {
      ok: false,
      error: `Payment currency mismatch (got ${cur}, expected ${expectedPaystackCurrency()})`,
    };
  }

  return { ok: true };
}
