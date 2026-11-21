import { NextRequest, NextResponse } from "next/server";
import {
  countryFromRequest,
  displayCurrencyForCountry,
  chargeCurrencyForCountry,
  formatDisplayPrice,
  amountForCurrency,
  NGN_AMOUNT_KOBO,
  USD_AMOUNT_CENTS,
} from "@/lib/pricing";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const country = countryFromRequest(req) || "XX";
  const display = displayCurrencyForCountry(country);
  const charge = chargeCurrencyForCountry(country);
  const formatted = formatDisplayPrice(display);

  return NextResponse.json({
    country,
    displayCurrency: display,
    chargeCurrency: charge,
    primary: formatted.primary,
    secondary: formatted.secondary,
    chargeAmount: amountForCurrency(charge),
    ngnKobo: NGN_AMOUNT_KOBO,
    usdCents: USD_AMOUNT_CENTS,
    usdEnabled:
      String(process.env.PAYSTACK_USD_ENABLED || "").toLowerCase() === "true",
  });
}
