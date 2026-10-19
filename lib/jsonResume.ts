/**
 * JSON Resume interop (https://jsonresume.org/schema) — MIT community standard.
 * Maps to/from ProfessionalProfile. Sample shape from jsonresume sample.resume.json.
 */

import type {
  ProfessionalProfile,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  SkillGroup,
  AwardItem,
} from "./professionalProfile";
import { emptyProfessionalProfile, detectPersona } from "./professionalProfile";

export type JsonResume = {
  $schema?: string;
  basics?: {
    name?: string;
    label?: string;
    image?: string;
    email?: string;
    phone?: string;
    url?: string;
    summary?: string;
    location?: {
      address?: string;
      postalCode?: string;
      city?: string;
      countryCode?: string;
      region?: string;
    };
    profiles?: { network?: string; username?: string; url?: string }[];
  };
  work?: {
    name?: string;
    position?: string;
    location?: string;
    description?: string;
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
    courses?: string[];
  }[];
  skills?: { name?: string; level?: string; keywords?: string[] }[];
  projects?: {
    name?: string;
    description?: string;
    url?: string;
    highlights?: string[];
    keywords?: string[];
  }[];
  certificates?: { name?: string; date?: string; issuer?: string; url?: string }[];
  awards?: { title?: string; date?: string; awarder?: string; summary?: string }[];
  languages?: { language?: string; fluency?: string }[];
  volunteer?: {
    organization?: string;
    position?: string;
    summary?: string;
    highlights?: string[];
  }[];
  meta?: { theme?: string; canonical?: string; version?: string };
};

export function professionalToJsonResume(p: ProfessionalProfile): JsonResume {
  const profiles: NonNullable<JsonResume["basics"]>["profiles"] = [];
  if (p.linkedinUrl) {
    profiles.push({ network: "LinkedIn", url: p.linkedinUrl });
  }
  const skillGroups: SkillGroup[] =
    p.skillGroups?.length
      ? p.skillGroups
      : p.skills.length
        ? [{ name: "Core", keywords: p.skills }]
        : [];

  return {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: p.fullName,
      label: p.headline,
      image: p.photoUrl,
      email: p.email,
      phone: p.phone,
      url: p.website,
      summary: p.about,
      location: p.location ? { city: p.location } : undefined,
      profiles,
    },
    work: p.experience.map((e) => ({
      name: e.company,
      position: e.title,
      location: e.location,
      startDate: e.start,
      endDate: e.end === "Present" ? undefined : e.end,
      highlights: e.bullets?.length ? e.bullets : undefined,
      url: e.url,
    })),
    education: p.education.map((ed) => ({
      institution: ed.school,
      studyType: ed.degree,
      area: ed.field,
      endDate: ed.year,
      score: ed.score,
    })),
    skills: skillGroups.map((g) => ({
      name: g.name,
      keywords: g.keywords,
    })),
    projects: (p.projects || []).map((pr) => ({
      name: pr.name,
      description: pr.description,
      url: pr.url,
      highlights: pr.highlights,
      keywords: pr.keywords,
    })),
    certificates: (p.certifications || []).map((c) => ({ name: c })),
    awards: (p.awards || []).map((a) => ({
      title: a.title,
      date: a.date,
      awarder: a.awarder,
      summary: a.summary,
    })),
    languages: p.languages,
    meta: {
      theme: "goke-professional",
      canonical: p.linkedinUrl,
      version: "v1.0.0",
    },
  };
}

export function jsonResumeToProfessional(
  r: JsonResume,
  source: ProfessionalProfile["source"] = "json_resume"
): ProfessionalProfile {
  const li = r.basics?.profiles?.find((p) =>
    /linkedin/i.test(p.network || p.url || "")
  );
  const loc = r.basics?.location;
  const location = [loc?.city, loc?.region, loc?.countryCode]
    .filter(Boolean)
    .join(", ");

  const skillGroups: SkillGroup[] = (r.skills || []).map((s) => ({
    name: s.name || "Skills",
    keywords: s.keywords?.length ? s.keywords : s.name ? [s.name] : [],
  }));
  const skills = skillGroups.flatMap((g) => g.keywords);

  const experience: ExperienceItem[] = (r.work || []).map((w) => ({
    title: w.position || "Role",
    company: w.name || "Company",
    location: w.location,
    start: w.startDate,
    end: w.endDate || "Present",
    bullets: w.highlights?.length ? w.highlights : w.summary ? [w.summary] : [],
    url: w.url,
  }));

  // Volunteer → experience-like optional: append lightly as projects note
  const projects: ProjectItem[] = (r.projects || []).map((pr) => ({
    name: pr.name || "Project",
    description: pr.description,
    url: pr.url,
    highlights: pr.highlights,
    keywords: pr.keywords,
  }));

  const awards: AwardItem[] = (r.awards || []).map((a) => ({
    title: a.title || "Award",
    date: a.date,
    awarder: a.awarder,
    summary: a.summary,
  }));

  let profile = emptyProfessionalProfile({
    source,
    fullName: r.basics?.name || "Professional",
    headline: r.basics?.label,
    location: location || undefined,
    photoUrl: r.basics?.image || undefined,
    about: r.basics?.summary,
    email: r.basics?.email,
    phone: r.basics?.phone,
    website: r.basics?.url,
    linkedinUrl: li?.url,
    experience,
    education: (r.education || []).map((ed) => ({
      school: ed.institution || "School",
      degree: ed.studyType,
      field: ed.area,
      year: ed.endDate?.slice(0, 4),
      score: ed.score,
    })),
    skills: Array.from(new Set(skills)).slice(0, 60),
    skillGroups,
    projects,
    certifications: (r.certificates || []).map((c) => c.name || "").filter(Boolean),
    awards,
    languages: (r.languages || [])
      .filter((l) => l.language)
      .map((l) => ({ language: l.language!, fluency: l.fluency })),
  });
  profile.persona = detectPersona(profile);
  return profile;
}
