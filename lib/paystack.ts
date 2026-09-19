import crypto from "crypto";

const PAYSTACK_API = "https://api.paystack.co";

export interface InitializedTransaction {
  authorizationUrl: string;
  reference: string;
}

// Starts a Paystack transaction and returns the hosted payment page to
// redirect the customer to. `amount` must already be in the currency's
// smallest unit (kobo for NGN, cents for USD, etc.) — see PAYSTACK_AMOUNT
// in .env.example. Unlike Stripe Checkout, Paystack requires an email
// address up front to initialize a transaction, so the caller must collect
// one from the customer first.
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

  return { authorizationUrl: data.data.authorization_url, reference: data.data.reference };
}

// Confirms a webhook payload genuinely came from Paystack: an HMAC-SHA512
// of the *raw* request body, keyed with your secret key, must match the
// `x-paystack-signature` header exactly. Always verify this before trusting
// anything in the payload — anyone can POST a fake "charge.success" event
// to a guessed webhook URL otherwise.
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");
  return hash === signature;
}

export interface VerifiedTransaction {
  status: string; // "success" | "failed" | "abandoned" | ...
  gatewayResponse?: string;
  metadata?: Record<string, any>;
}

// Directly asks Paystack whether a transaction succeeded. Paystack's
// callback_url fires the browser back to your site regardless of outcome
// (success, failed, or abandoned) — there's no separate cancel URL like
// Stripe's — so this is what lets the preview page tell those apart once
// the customer lands back on it, instead of just waiting on a webhook that
// will never arrive for a failed/abandoned payment.
export async function verifyTransaction(reference: string): Promise<VerifiedTransaction> {
  const res = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });
  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(`Paystack verify failed: ${data.message ?? res.status}`);
  }
  return {
    status: data.data.status,
    gatewayResponse: data.data.gateway_response,
    metadata: data.data.metadata,
  };
}
