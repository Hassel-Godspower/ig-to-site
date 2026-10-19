/**
 * Professional / career presence schema for gòke.
 * Aligned with JSON Resume sections (basics, work, education, skills, projects, …)
 * without requiring the full @jsonresume/schema runtime dependency.
 */

export type ExperienceItem = {
  title: string;
  company: string;
  location?: string;
  start?: string;
  end?: string | "Present";
  /** Impact bullets — prefer over long summary (JSON Resume highlights) */
  bullets: string[];
  url?: string;
};

export type EducationItem = {
  school: string;
  degree?: string;
  field?: string;
  year?: string;
  score?: string;
};

export type ProjectItem = {
  name: string;
  description?: string;
  url?: string;
  highlights?: string[];
  keywords?: string[];
};

export type SkillGroup = {
  name: string;
  keywords: string[];
};

export type AwardItem = {
  title: string;
  date?: string;
  awarder?: string;
  summary?: string;
};

export type ProfessionalProfile = {
  source: "linkedin" | "cv" | "linkedin+cv" | "manual" | "json_resume";
  fullName: string;
  headline?: string;
  location?: string;
  photoUrl?: string;
  about?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  website?: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  /** Flat skills (legacy) — also mirrored into skillGroups when possible */
  skills: string[];
  /** JSON Resume style grouped skills */
  skillGroups?: SkillGroup[];
  projects?: ProjectItem[];
  certifications?: string[];
  awards?: AwardItem[];
  languages?: { language: string; fluency?: string }[];
  persona?:
    | "consultant"
    | "engineer"
    | "designer"
    | "founder"
    | "lawyer"
    | "marketer"
    | "creator"
    | "general";
};

export function emptyProfessionalProfile(
  partial?: Partial<ProfessionalProfile>
): ProfessionalProfile {
  return {
    source: partial?.source || "manual",
    fullName: partial?.fullName || "Professional",
    headline: partial?.headline,
    location: partial?.location,
    photoUrl: partial?.photoUrl,
    about: partial?.about,
    email: partial?.email,
    phone: partial?.phone,
    linkedinUrl: partial?.linkedinUrl,
    website: partial?.website,
    experience: partial?.experience || [],
    education: partial?.education || [],
    skills: partial?.skills || [],
    skillGroups: partial?.skillGroups,
    projects: partial?.projects || [],
    certifications: partial?.certifications || [],
    awards: partial?.awards || [],
    languages: partial?.languages || [],
    persona: partial?.persona || "general",
  };
}

export function detectPersona(p: ProfessionalProfile): ProfessionalProfile["persona"] {
  const blob = `${p.headline || ""} ${p.about || ""} ${p.skills.join(" ")} ${p.experience
    .map((e) => `${e.title} ${e.company}`)
    .join(" ")}`.toLowerCase();
  if (/lawyer|legal|counsel|attorney|barrister|solicitor/.test(blob)) return "lawyer";
  if (/design|ui|ux|brand|figma|creative director|art director/.test(blob)) return "designer";
  if (/engineer|developer|software|devops|fullstack|backend|frontend|sre/.test(blob))
    return "engineer";
  if (/founder|ceo|co-founder|startup|managing director/.test(blob)) return "founder";
  if (/market|growth|seo|content strateg|brand strateg|demand gen/.test(blob)) return "marketer";
  if (/consult|advisor|coach|strategy|fractional/.test(blob)) return "consultant";
  if (/creator|writer|podcast|youtube|influencer|journalist/.test(blob)) return "creator";
  return "general";
}

/** Ensure skillGroups exist from flat skills */
export function ensureSkillGroups(p: ProfessionalProfile): SkillGroup[] {
  if (p.skillGroups?.length) return p.skillGroups;
  if (!p.skills.length) return [];
  return [{ name: "Core", keywords: p.skills.slice(0, 40) }];
}
