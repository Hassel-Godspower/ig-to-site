import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Created lazily, on first real use, rather than at module load time. If
// this ran eagerly at the top level, Next.js would execute it during
// `next build`'s page-data-collection step for every route that imports
// jobStore/siteStore -- meaning a missing or misconfigured env var would
// fail the *entire build*, not just the route that actually needs
// Supabase. Lazy init means a missing var only breaks the specific
// request that touches it, with a clear error message pointing at why.
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error(
        "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set -- add them to .env.local (or your deployment's environment variables)."
      );
    }
    // Service role key — server-side only, bypasses row-level security.
    // Never expose this key to the browser.
    client = createClient(url, key);
  }
  return client;
}
