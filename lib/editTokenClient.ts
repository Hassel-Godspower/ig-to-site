/**
 * Browser helper for Stage 1 edit auth.
 * Import from preview / preview-simple pages and MediaContext.
 */

const storageKey = (jobId: string) => `goke-edit-token:${jobId}`;

export function readStoredEditToken(jobId: string): string | null {
  if (typeof window === "undefined" || !jobId) return null;
  try {
    return sessionStorage.getItem(storageKey(jobId));
  } catch {
    return null;
  }
}

export function storeEditToken(jobId: string, token: string): void {
  if (typeof window === "undefined" || !jobId || !token) return;
  try {
    sessionStorage.setItem(storageKey(jobId), token);
  } catch {
    /* private mode */
  }
}

/** Headers for PUT / upload / DELETE / seed */
export function editAuthHeaders(
  jobId: string,
  extra?: Record<string, string>
): Record<string, string> {
  const h: Record<string, string> = { ...(extra || {}) };
  const tok = readStoredEditToken(jobId);
  if (tok) h["x-goke-edit-token"] = tok;
  try {
    const access = new URLSearchParams(window.location.search).get("access");
    if (access) h["x-goke-access"] = access;
  } catch {
    /* SSR */
  }
  return h;
}

/**
 * Claim or refresh edit token. Call once when the editor mounts.
 */
export async function ensureEditToken(jobId: string): Promise<string | null> {
  if (!jobId) return null;
  const existing = readStoredEditToken(jobId);
  let access: string | null = null;
  try {
    access = new URLSearchParams(window.location.search).get("access");
  } catch {
    access = null;
  }

  try {
    const res = await fetch(`/api/site/${jobId}/edit-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(existing ? { edit: existing } : {}),
        ...(access ? { access } : {}),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.warn("[goke] edit-token", data.error || res.status);
      return existing;
    }
    if (data.token) {
      storeEditToken(jobId, data.token);
      return data.token as string;
    }
  } catch (e) {
    console.warn("[goke] edit-token fetch failed", e);
  }
  return existing;
}
