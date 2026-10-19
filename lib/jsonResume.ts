/**
 * Interop with JSON Resume (https://jsonresume.org/schema) — MIT community standard.
 * We do NOT depend on @jsonresume/schema at runtime; we map shapes intentionally.
 *
 * Extracted concepts from jsonresume/resume-schema + themes:
 * - basics / work / education / skills / projects / certificates
 * - work[].highlights (not free-form paragraphs)
 * - skills[].keywords
 * - profiles[] for LinkedIn / GitHub / etc.
 */

import type {
  ProfessionalProfile,
  ExperienceItem,
  EducationItem,
  ProjectItem,
} from "./professionalProfile";
import { emptyProfessionalProfile, detectPersona } from "./professionalProfile";

/** Subset of JSON Resume we care about */
export type JsonResume = {
  basics?: {
    name?: string;
    label?: string;
    image?: string;
    email?: string;
    phone?: string;
    url?: string;
    summary?: string;
    location?: { city?: string; region?: string; countryCode?: string };
    profiles?: { network?: string; username?: string; url?: string }[];
  };
  work?: {
    name?: string;
    position?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
    url?: string;
  }[];
  education?: {
    institution?: string;
    area?: string;
    studyType?: string;
    startDate?: string;
    endDate?: string;
    score?: string;
  }[];
  skills?: { name?: string; level?: string; keywords?: string[] }[];
  projects?: {
    name?: string;
    description?: string;
    url?: string;
    highlights?: string[];
  }[];
  certificates?: { name?: string; date?: string; issuer?: string; url?: string }[];
  languages?: { language?: string; fluency?: string }[];
  meta?: { theme?: string; canonical?: string };
};

export function professionalToJsonResume(p: ProfessionalProfile): JsonResume {
  const profiles: NonNullable<JsonResume["basics"]>["profiles"] = [];
  if (p.linkedinUrl) {
    profiles.push({ network: "LinkedIn", url: p.linkedinUrl });
  }
  return {
    basics: {
      name: p.fullName,
      label: p.headline,
      image: p.photoUrl,
      email: p.email,
      phone: p.phone,
      url: p.website,
      summary: p.about,
      location: p.location
        ? { city: p.location }
        : undefined,
      profiles,
    },
    work: p.experience.map((e) => ({
      name: e.company,
      position: e.title,
      location: e.location,
      startDate: e.start,
      endDate: e.end === "Present" ? undefined : e.end,
      highlights: e.bullets?.length ? e.bullets : undefined,
    })),
    education: p.education.map((ed) => ({
      institution: ed.school,
      studyType: ed.degree,
      area: ed.field,
      endDate: ed.year,
    })),
    skills: p.skills.length
      ? [
          {
            name: "Core",
            keywords: p.skills,
          },
        ]
      : [],
    projects: (p.projects || []).map((pr) => ({
      name: pr.name,
      description: pr.description,
      url: pr.url,
    })),
    certificates: (p.certifications || []).map((c) =>
      typeof c === "string" ? { name: c } : c
    ),
    meta: {
      theme: "goke-professional",
      canonical: p.linkedinUrl,
    },
  };
}

export function jsonResumeToProfessional(
  r: JsonResume,
  source: ProfessionalProfile["source"] = "manual"
): ProfessionalProfile {
  const li = r.basics?.profiles?.find((p) =>
    /linkedin/i.test(p.network || p.url || "")
  );
  const loc = r.basics?.location;
  const location = [loc?.city, loc?.region, loc?.countryCode]
    .filter(Boolean)
    .join(", ");

  const skills: string[] = [];
  for (const s of r.skills || []) {
    if (s.keywords?.length) skills.push(...s.keywords);
    else if (s.name) skills.push(s.name);
  }

  const experience: ExperienceItem[] = (r.work || []).map((w) => ({
    title: w.position || "Role",
    company: w.name || "Company",
    location: w.location,
    start: w.startDate,
    end: w.endDate || "Present",
    bullets: w.highlights?.length
      ? w.highlights
      : w.summary
        ? [w.summary]
        : [],
  }));

  const education: EducationItem[] = (r.education || []).map((ed) => ({
    school: ed.institution || "School",
    degree: ed.studyType,
    field: ed.area,
    year: ed.endDate?.slice(0, 4),
  }));

  const projects: ProjectItem[] = (r.projects || []).map((pr) => ({
    name: pr.name || "Project",
    description: pr.description || pr.highlights?.join(" "),
    url: pr.url,
  }));

  let profile = emptyProfessionalProfile({
    source,
    fullName: r.basics?.name || "Professional",
    headline: r.basics?.label,
    location: location || undefined,
    photoUrl: r.basics?.image,
    about: r.basics?.summary,
    email: r.basics?.email,
    phone: r.basics?.phone,
    website: r.basics?.url,
    linkedinUrl: li?.url,
    experience,
    education,
    skills: Array.from(new Set(skills)).slice(0, 50),
    projects,
    certifications: (r.certificates || []).map((c) => c.name || "").filter(Boolean),
  });
  profile.persona = detectPersona(profile);
  return profile;
}
