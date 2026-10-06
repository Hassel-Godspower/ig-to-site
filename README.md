# Raise gòke publish fee to ₦20,000

## Amount in code
Paystack uses **kobo**: ₦20,000 = **2,000,000** kobo.

## 1. Apply files
Copy these into the repo root, commit, push.

## 2. Vercel (required for live charge)
Settings → Environment Variables → Production:

  PAYSTACK_AMOUNT=2000000

Optional:
  PAYSTACK_CURRENCY=NGN

Then **Redeploy**.

If PAYSTACK_AMOUNT is missing, checkout now defaults to 2000000 in code.

## 3. Paystack
No product is required. Amount is sent on each `/transaction/initialize`.
Dashboard will show ₦20,000 on new checkouts after Vercel env is updated.

## 4. Verify
Start Go live → Paystack should show **NGN 20,000.00**.
