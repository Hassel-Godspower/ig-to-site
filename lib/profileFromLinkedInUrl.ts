/**
 * Free path: build a minimal ProfessionalProfile from a LinkedIn URL slug.
 * No Proxycurl / scraping — user edits the rest in gòke, or uploads a CV.
 */

import type { ProfessionalProfile } from "./professionalProfile";
import { emptyProfessionalProfile, detectPersona } from "./professionalProfile";
import { normalizeLinkedInUrl } from "./normalizeLinkedInUrl";

function titleCaseSlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/**
 * e.g. www.linkedin.com/in/hassel-godspower → fullName "Hassel Godspower"
 */
export function profileFromLinkedInUrl(rawUrl: string): ProfessionalProfile | null {
  // Prefer shared normalizer if present; inline fallback
  let url: string | null = null;
  try {
    url = normalizeLinkedInUrl(rawUrl);
  } catch {
    url = null;
  }
  if (!url) {
    let s = rawUrl.trim();
    if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
    try {
      const u = new URL(s);
      const m = u.pathname.match(/\/in\/([A-Za-z0-9\-_%]+)/i);
      if (!m) return null;
      url = `https://www.linkedin.com/in/${m[1]}`;
    } catch {
      return null;
    }
  }

  const slug = url.split("/in/")[1]?.replace(/\/$/, "") || "professional";
  const fullName = titleCaseSlug(decodeURIComponent(slug));

  const profile = emptyProfessionalProfile({
    source: "linkedin",
    fullName,
    headline: "Professional",
    about: `${fullName} is building a professional presence on the open web. Edit this site to add your real headline, experience, and skills — or re-generate with a PDF CV for richer content.`,
    linkedinUrl: url,
    experience: [],
    education: [],
    skills: [],
  });
  profile.persona = detectPersona(profile);
  return profile;
}

/**
 * Parse free-form paste (About + roles) into a rough profile.
 */
export function profileFromPastedText(
  text: string,
  linkedinUrl?: string
): ProfessionalProfile | null {
  const raw = (text || "").trim();
  if (raw.length < 40) return null;

  const lines = raw
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  const fullName =
    lines[0] && lines[0].length < 60 && !/@/.test(lines[0])
      ? lines[0]
      : "Professional";

  const about = raw.slice(0, 1200);
  const skills: string[] = [];
  const skillLine = raw.match(/(?:skills|expertise)[:\s]+([^\n]+)/i);
  if (skillLine) {
    skills.push(
      ...skillLine[1]
        .split(/[,|•]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1 && s.length < 40)
        .slice(0, 30)
    );
  }

  const profile = emptyProfessionalProfile({
    source: linkedinUrl ? "linkedin" : "manual",
    fullName,
    headline: lines[1] && lines[1].length < 100 ? lines[1] : undefined,
    about,
    linkedinUrl: linkedinUrl || undefined,
    skills,
    experience: [],
  });
  profile.persona = detectPersona(profile);
  return profile;
}
