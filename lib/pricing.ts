/**
 * Publish fee: ₦20,000 (NG) or $15 (international display + charge when USD enabled).
 * Paystack amounts are always in the smallest unit (kobo / cents).
 */

export type PricingCurrency = "NGN" | "USD";

/** ₦20,000 in kobo */
export const NGN_AMOUNT_KOBO = Number(
  process.env.PAYSTACK_AMOUNT_NGN || process.env.PAYSTACK_AMOUNT || 2_000_000
);

/** $15.00 in cents */
export const USD_AMOUNT_CENTS = Number(
  process.env.PAYSTACK_AMOUNT_USD || 1500
);

export function isNigeriaCountry(code: string | null | undefined): boolean {
  return String(code || "").toUpperCase() === "NG";
}

/** Country from Vercel / Cloudflare edge headers */
export function countryFromRequest(req: {
  headers: { get(name: string): string | null };
}): string {
  return (
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-country-code") ||
    ""
  ).toUpperCase();
}

export function displayCurrencyForCountry(country: string): PricingCurrency {
  return isNigeriaCountry(country) ? "NGN" : "USD";
}

/**
 * Currency to charge on Paystack.
 * USD only if PAYSTACK_USD_ENABLED=true (account must support USD).
 * Otherwise always NGN so checkout still works for foreign IPs.
 */
export function chargeCurrencyForCountry(country: string): PricingCurrency {
  if (isNigeriaCountry(country)) return "NGN";
  if (String(process.env.PAYSTACK_USD_ENABLED || "").toLowerCase() === "true") {
    return "USD";
  }
  return "NGN";
}

export function amountForCurrency(currency: PricingCurrency): number {
  return currency === "USD" ? USD_AMOUNT_CENTS : NGN_AMOUNT_KOBO;
}

export function formatDisplayPrice(currency: PricingCurrency): {
  primary: string;
  secondary: string;
  currency: PricingCurrency;
  amountMajor: number;
} {
  if (currency === "USD") {
    return {
      primary: "$15",
      secondary: "≈ ₦20,000 · one-time",
      currency: "USD",
      amountMajor: 15,
    };
  }
  return {
    primary: "₦20,000",
    secondary: "≈ $15 · one-time",
    currency: "NGN",
    amountMajor: 20_000,
  };
}

/** Accept either successful NGN fee or USD fee as “paid in full”. */
export function isAcceptedPublishPayment(
  amount: number | undefined,
  currency: string | undefined
): boolean {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return false;
  const cur = String(currency || "NGN").toUpperCase();
  if (cur === "NGN" && amount === NGN_AMOUNT_KOBO) return true;
  if (cur === "USD" && amount === USD_AMOUNT_CENTS) return true;
  return false;
}
