# Gòke commerce — seamless pack (lite + pro)

Replaces the separate booking + infra zips with one compatible set.

## What improved
- **generateSite** patched from current main (0 lines lost)
- **jobStore** = main + `commerceTier` / `bookingTier` only
- **Owner APIs require** `x-goke-access` dashboard token matching job email
- **CORS + OPTIONS** on public catalog/orders/booking for static `*.pages.dev` sites
- **Lite runtime** still works alone; if `window.GokeCommerce` / `GokeBooking` exist (pro snippet), orders/bookings also hit gòke APIs then WhatsApp
- Input length limits on orders/bookings
- Delete product + list orders for owners

## Install order
```bash
# 1) SQL.md in Supabase

# 2) Libs
cp goke-commerce-seamless/lib/staticCommerceRuntime.ts lib/
cp goke-commerce-seamless/lib/generateSite.ts lib/
cp goke-commerce-seamless/lib/jobStore.ts lib/
cp goke-commerce-seamless/lib/commerceStore.ts lib/
cp goke-commerce-seamless/lib/commerceAuth.ts lib/
cp goke-commerce-seamless/lib/gokeCommerceClientSnippet.ts lib/

# 3) Kits + editor
cp goke-commerce-seamless/src/goke-editor/components/commerce-kits.ts src/goke-editor/components/
cp goke-commerce-seamless/src/goke-editor/components/booking-kits.ts src/goke-editor/components/
cp goke-commerce-seamless/src/goke-editor/components/Editor.tsx src/goke-editor/components/
cp "goke-commerce-seamless/app/preview/[jobId]/page.tsx" "app/preview/[jobId]/page.tsx"

# 4) APIs
mkdir -p app/api/commerce app/api/booking
cp -R goke-commerce-seamless/app/api/commerce/* app/api/commerce/
cp -R goke-commerce-seamless/app/api/booking/* app/api/booking/

# 5) Marketing (optional)
cp goke-commerce-seamless/app/components/marketing/CommerceBookingStrip.tsx app/components/marketing/
cp goke-commerce-seamless/app/page.tsx app/

git add lib src/goke-editor app/api/commerce app/api/booking app/preview app/page.tsx app/components/marketing
git commit -m "Seamless shop/book lite + secured Gòke Commerce/Booking pro APIs"
git push
```

Requires existing: `lib/dashboardAuth.ts`, `lib/paystack.ts`, `BASE_URL`, Paystack keys.

Owner API header: `x-goke-access: <token from dashboard access link>`
