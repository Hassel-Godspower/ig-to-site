/**
 * Optional LinkedIn profile enrichment via Proxycurl (or compatible API).
 * Never scrape LinkedIn HTML in production.
 *
 * Env: PROXYCURL_API_KEY
 * Docs: https://nubela.co/proxycurl/
 */

import type { ProfessionalProfile, ExperienceItem, EducationItem } from "./professionalProfile";
import { emptyProfessionalProfile, detectPersona } from "./professionalProfile";

export type LinkedInEnrichResult = {
  profile: ProfessionalProfile | null;
  error?: string;
  skipped?: boolean;
};

function normalizeLinkedInUrl(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  try {
    const u = new URL(s.startsWith("http") ? s : `https://${s}`);
    if (!/linkedin\.com$/i.test(u.hostname.replace(/^www\./, "")) &&
        !u.hostname.endsWith("linkedin.com")) {
      // allow www.linkedin.com
      if (!u.hostname.includes("linkedin.com")) return null;
    }
    if (!/\/in\//i.test(u.pathname)) return null;
    return u.toString().split("?")[0];
  } catch {
    return null;
  }
}

/**
 * Fetch person profile from Proxycurl.
 * Returns skipped:true if no API key (caller should fall back to PDF).
 */
export async function enrichFromLinkedInUrl(
  linkedinUrl: string
): Promise<LinkedInEnrichResult> {
  const url = normalizeLinkedInUrl(linkedinUrl);
  if (!url) {
    return { profile: null, error: "Invalid LinkedIn profile URL (need linkedin.com/in/...)" };
  }

  const key = process.env.PROXYCURL_API_KEY || process.env.LINKEDIN_API_KEY || "";
  if (!key) {
    return {
      profile: null,
      skipped: true,
      error: "PROXYCURL_API_KEY not set — use CV PDF or set enrichment key",
    };
  }

  try {
    const endpoint = new URL("https://nubela.co/proxycurl/api/v2/linkedin");
    endpoint.searchParams.set("url", url);
    endpoint.searchParams.set("use_cache", "if-present");

    const res = await fetch(endpoint.toString(), {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(25000),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        profile: null,
        error: `LinkedIn enrichment failed (${res.status}): ${body.slice(0, 200)}`,
      };
    }

    const data = (await res.json()) as Record<string, unknown>;
    const experiences: ExperienceItem[] = [];
    const expRaw = (data.experiences as Array<Record<string, unknown>>) || [];
    for (const e of expRaw.slice(0, 12)) {
      experiences.push({
        title: String(e.title || e.role || "Role"),
        company: String(e.company || e.company_name || "Company"),
        location: e.location ? String(e.location) : undefined,
        start: e.starts_at
          ? String(
              typeof e.starts_at === "object"
                ? (e.starts_at as { year?: number }).year || ""
                : e.starts_at
            )
          : undefined,
        end: e.ends_at
          ? String(
              typeof e.ends_at === "object"
                ? (e.ends_at as { year?: number }).year || "Present"
                : e.ends_at
            )
          : "Present",
        bullets: e.description
          ? String(e.description)
              .split(/\n|•/)
              .map((x) => x.trim())
              .filter(Boolean)
              .slice(0, 6)
          : [],
      });
    }

    const education: EducationItem[] = (
      (data.education as Array<Record<string, unknown>>) || []
    )
      .slice(0, 8)
      .map((ed) => ({
        school: String(ed.school || ed.institution || "School"),
        degree: ed.degree_name ? String(ed.degree_name) : undefined,
        field: ed.field_of_study ? String(ed.field_of_study) : undefined,
        year: ed.ends_at
          ? String(
              typeof ed.ends_at === "object"
                ? (ed.ends_at as { year?: number }).year || ""
                : ed.ends_at
            )
          : undefined,
      }));

    const skills = (
      (data.skills as Array<string | { name?: string }>) || []
    )
      .map((s) => (typeof s === "string" ? s : s.name || ""))
      .filter(Boolean)
      .slice(0, 40);

    let profile = emptyProfessionalProfile({
      source: "linkedin",
      fullName: String(
        data.full_name ||
          `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
          "Professional"
      ),
      headline: data.headline ? String(data.headline) : undefined,
      location: data.city
        ? `${data.city}${data.country ? ", " + data.country : ""}`
        : data.country
          ? String(data.country)
          : undefined,
      photoUrl: data.profile_pic_url ? String(data.profile_pic_url) : undefined,
      about: data.summary ? String(data.summary) : undefined,
      email: undefined,
      linkedinUrl: url,
      experience: experiences,
      education,
      skills,
    });
    profile.persona = detectPersona(profile);
    return { profile };
  } catch (e) {
    return {
      profile: null,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
