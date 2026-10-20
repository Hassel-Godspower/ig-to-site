/**
 * Accept common LinkedIn profile shapes and return a canonical https URL, or null.
 *
 * Accepts:
 * - https://www.linkedin.com/in/name
 * - http://linkedin.com/in/name/
 * - www.linkedin.com/in/name
 * - linkedin.com/in/name
 * - /in/name (rare)
 */
export function normalizeLinkedInUrl(input: string): string | null {
  let s = (input || "").trim();
  if (!s) return null;

  // strip surrounding quotes / spaces
  s = s.replace(/^['"]|['"]$/g, "").trim();

  // If user pasted only the path
  if (s.startsWith("/in/")) {
    s = `www.linkedin.com${s}`;
  }

  // Prepend scheme when missing (fixes www.linkedin.com/... )
  if (!/^https?:\/\//i.test(s)) {
    s = `https://${s.replace(/^\/\//, "")}`;
  }

  try {
    const u = new URL(s);
    const host = u.hostname.replace(/^www\./i, "").toLowerCase();
    if (host !== "linkedin.com") return null;
    // pathname must include /in/slug
    const m = u.pathname.match(/\/in\/([A-Za-z0-9\-_%]+)/i);
    if (!m) return null;
    const slug = m[1].replace(/\/$/, "");
    if (!slug || slug.length < 2) return null;
    return `https://www.linkedin.com/in/${slug}`;
  } catch {
    return null;
  }
}
