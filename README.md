# ig-to-site

A customer uploads their Instagram data export and gets a live, editable
preview of a generated static site immediately (free) — generated files
are stored privately in Supabase, nothing touches your GitHub account yet.
They only pay when they click "Go live": a $9 charge. **Payment is what
creates the GitHub repo** — a private repo under your account, named after
their chosen subdomain, with their files pushed as the initial commit.
The customer sees "Creating live website…" while you deploy it on Vercel
whenever you get to it.

## Stack, and why

| Piece | Service | Why this one |
|---|---|---|
| Site generation | **Groq** (Llama 3.3 70B) | Free API, no credit card, real production use — rate-limited (~30 req/min, daily token caps), not a trial |
| Pre-payment site files | **Supabase Storage** (private bucket) | Where a generated site's files live while someone's still previewing/editing it for free |
| Site files after payment | **GitHub** (a private repo per paid site) | Created once, at payment time — becomes the source of truth going forward |
| Job records | **Supabase** (Postgres) | Tracks status/repo/username per job throughout |
| Payments | **Paystack** | No monthly fee — only takes a cut of successful payments; strong in NGN/Africa-focused markets |
| Publishing | **You, manually, via the Vercel dashboard** | Vercel never sees whether anyone paid — it just imports whatever repo you point it at, whenever you get to it |

**Where does the app itself run?** Not on Vercel's free Hobby plan — its
terms explicitly restrict Hobby to non-commercial personal use, and this
app takes payments, so it's commercial. Two free options that don't have
that restriction:
- **Render** free web service — deploys straight from GitHub, only
  downside is it sleeps after ~15 min idle and takes a few seconds to
  wake back up. Simplest to set up.
- A small always-on VM (e.g. an Oracle Cloud free-tier instance) if the
  cold-start on Render bothers you.

(This restriction is about the app itself, not customer sites — those are
plain static repos that you import into Vercel one at a time, same as any
project of your own.)

## Flow

1. `POST /api/generate` — parses the uploaded export, calls Groq to
   produce plain `index.html` / `styles.css` / `script.js`, and saves them
   to a private Supabase Storage bucket under the new job's ID. **No
   GitHub repo exists yet.** This step is free and runs for every visitor,
   paying or not.
2. Browser redirects to `/preview/[jobId]`, showing the site in an iframe
   served from `/api/site/[jobId]/index.html`, which reads the file out of
   Supabase Storage. "Edit content" turns on `document.designMode`; "Save
   changes" PUTs the edited HTML back, overwriting it in the bucket.
3. "Go live" opens a modal asking for the desired subdomain and an email
   address (Paystack requires an email to start a transaction), then
   redirects to a Paystack-hosted payment page for $9.
4. Paystack redirects back to `/preview/[jobId]?paid=1&reference=...`. The
   page immediately calls `POST /api/verify-payment`, which asks Paystack
   directly whether that reference actually succeeded — this is what tells
   a genuine payment apart from a cancelled or failed one, since Paystack's
   `callback_url` fires either way. On success, this route (or the
   `POST /api/webhook`, whichever gets there first — both call the same
   shared `completePaidJob` helper, so only one repo ever gets created)
   reads all three files back out of Supabase Storage and **creates a
   brand-new private GitHub repo** named after the chosen subdomain
   (falling back to a suffixed name on collision), pushing the files as
   its initial commit. It records `https://<repo-name>.vercel.app` as the
   job's predicted `siteUrl`. No Vercel API call happens anywhere in this
   app. On failure, the customer sees "Payment wasn't completed" with a
   button to try again.
5. The preview page then polls `GET /api/status/[jobId]`, which — while a
   job is "deploying" — actively fetches the predicted URL and flips the
   job to "done" the moment it responds successfully. So once you've
   imported the repo into Vercel and it's built, the customer's screen
   updates on its own within a couple seconds, with no manual step from
   you beyond the Vercel import itself. If repo creation itself failed
   (e.g. a transient GitHub error), the customer sees a "Retry" button
   that calls `POST /api/deploy` to try again without re-charging them.

## Your one manual step

Whenever it's convenient — not necessarily right away — open the Vercel
dashboard, **Add New → Project**, and import the newly-created repo.
Vercel names the project after the repo by default, so it lands at
`<repo-name>.vercel.app`, matching what the customer's already been shown.
That's the only manual step, and it only happens for repos that
represent an actual paying customer.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in real keys
npm run dev
```

Required env vars: see `.env.example` (Groq, Paystack, Supabase, GitHub).

**Supabase setup** — run once in the Supabase SQL editor for job records:

```sql
create table jobs (
  id text primary key,
  status text not null,
  username text,
  parsed_username text,
  site_url text,
  error text,
  repo_owner text,
  repo_name text,
  repo_url text,
  default_branch text,
  created_at timestamptz default now()
);
```

Also create a **Storage bucket named `sites`** (Supabase dashboard →
Storage → New bucket), kept private — the app reads/writes it with the
service role key, never directly from the browser.

**GitHub setup** — create a classic Personal Access Token
(github.com/settings/tokens) with the **`repo`** scope, under the account
you want customer site repos created in. That's the only permission
needed — this app never touches Vercel.

**Paystack setup** — dashboard.paystack.com → **Settings → API Keys &
Webhooks** → copy the secret key (`PAYSTACK_SECRET_KEY`; use the test key
while developing). On the same page, set your **Webhook URL** to
`<your-deployed-url>/api/webhook` — Paystack has no local-forwarding CLI
like Stripe's, so for local testing you'll need a tunnel (e.g. `ngrok http
3000`) and a webhook URL pointed at the tunnel's public address while you
test.

Decide `PAYSTACK_AMOUNT` and `PAYSTACK_CURRENCY` based on what your
Paystack account supports — new accounts are typically NGN-only until you
request other currencies, so confirm in the dashboard before assuming
`PAYSTACK_CURRENCY=USD` will work.

## Not production-ready — deliberate cut corners

- **`<name>.vercel.app` isn't guaranteed exact** — if you already have a
  Vercel project with that name, importing will land on a suffixed domain
  instead, and the customer's shown URL will be stale until you notice and
  update it by hand. Same idea for the GitHub repo name itself, which
  falls back to a suffixed name on collision — rare, but not impossible.
- **The status poll only resolves once you actually import + deploy in
  Vercel.** There's no notification to you that a new repo is waiting;
  you'd want to check the account's repo list (or add a simple admin view
  over the `jobs` table) periodically.
- **Editing is a raw `designMode` overlay**, not a structured content
  editor. Fine for text tweaks; anything more (reordering sections, image
  swaps) needs a real editing UI. Editing is also locked once a job has
  gone live — the repo becomes the source of truth at that point, and this
  app doesn't push further edits into it.
- **No auth** — anyone with a `jobId` can view or edit that draft.
- **No queue** — generation, storage writes, and repo creation all run
  inline in the request. Fine at low volume, worth revisiting as usage
  grows.
- **`verify-payment` only runs once, on the redirect back.** If the
  customer closes the tab mid-payment and never lands back on
  `?paid=1&reference=...`, nothing checks that reference again — the job
  just sits at `pending_payment`. The webhook is the real safety net for
  that case, as long as it's configured and reachable.
- **No cleanup job for abandoned drafts** — a visitor who generates a site
  and never pays leaves their files sitting in the `sites` bucket
  indefinitely (harmless, since nothing's created in GitHub, but worth a
  periodic sweep in a real version of this).
