# ig-to-site

A customer uploads their Instagram data export, gets a live, editable
preview of a generated static site immediately (free), edits the content
in-browser, and only pays when they click "Go live" — at which point the
site deploys to `<username>.vercel.app`.

## Flow

1. `POST /api/generate` — parses the uploaded `.zip`/`.json` export, calls
   Claude to produce plain `index.html` / `styles.css` / `script.js`
   (no framework, no build step), and stores them under
   `.jobs/sites/<jobId>/`. No payment involved yet.
2. The browser is redirected to `/preview/[jobId]`, which shows the
   generated site in an iframe (served straight from
   `/api/site/[jobId]/index.html` — the exact file that will later be
   deployed). Clicking "Edit content" turns on `document.designMode` inside
   the iframe for direct in-place editing; "Save changes" PUTs the edited
   HTML back to the same route.
3. Clicking "Go live" opens a modal asking for the desired subdomain
   (`<name>.vercel.app`), then creates a Stripe Checkout session and
   redirects to Stripe's hosted payment page.
4. On successful payment, `POST /api/webhook` fires, reads the already-
   generated files from disk, and calls `deployToVercel()` with the chosen
   username as the Vercel project name.
5. The preview page (now back at `/preview/[jobId]?paid=1`) polls
   `GET /api/status/[jobId]` until a `siteUrl` appears, then shows it.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in real keys
npm run dev
```

Required env vars (see `.env.example`): `ANTHROPIC_API_KEY`,
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`,
`VERCEL_API_TOKEN`, optional `VERCEL_TEAM_ID`, and
`NEXT_PUBLIC_BASE_URL`.

For local Stripe webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

## Not production-ready — deliberate cut corners

- **Job and site storage**: flat files under `.jobs/` on local disk. Swap
  for a database + blob storage before real traffic — this app's own
  filesystem is ephemeral on Vercel, and concurrent writes to the same
  file will race.
- **`username.vercel.app` isn't guaranteed exact.** Passing `username` as
  the Vercel project name gets the default `<name>.vercel.app` domain on
  production deploys only if that name isn't already taken by another
  project in the same team. There's no availability check before payment
  yet — add one (or a fallback naming scheme) so customers don't pay for a
  name that's unavailable.
- **Editing is a raw `designMode` overlay**, not a structured content
  editor — it edits the live DOM and saves the full outer HTML back. Fine
  for text tweaks; anything more (reordering sections, image swaps) would
  need a real editing UI.
- **No auth** — anyone with a `jobId` can view or edit that draft, and the
  status route is unauthenticated. Fine for a demo link, not for a real
  multi-tenant product.
- **No queue** — generation runs inline in the request (acceptable, since
  nothing is billed yet if it's slow); deploy runs inline in the webhook,
  which has a timeout window worth watching as sites get bigger.
