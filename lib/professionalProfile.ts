/**
 * Shared schema for LinkedIn / CV → professional website.
 * Aligns loosely with JSON Resume concepts without requiring the full schema.
 */

export type ExperienceItem = {
  title: string;
  company: string;
  location?: string;
  start?: string;
  end?: string | "Present";
  bullets: string[];
};

export type EducationItem = {
  school: string;
  degree?: string;
  field?: string;
  year?: string;
};

export type ProjectItem = {
  name: string;
  description?: string;
  url?: string;
};

export type ProfessionalProfile = {
  source: "linkedin" | "cv" | "linkedin+cv" | "manual";
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
  skills: string[];
  projects?: ProjectItem[];
  certifications?: string[];
  /** Detected persona for blueprint / imagery */
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
    source: "manual",
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
    projects: partial?.projects || [],
    certifications: partial?.certifications || [],
    persona: partial?.persona || "general",
  };
}

/** Heuristic persona from headline + skills */
export function detectPersona(p: ProfessionalProfile): ProfessionalProfile["persona"] {
  const blob = `${p.headline || ""} ${p.about || ""} ${p.skills.join(" ")} ${p.experience
    .map((e) => e.title)
    .join(" ")}`.toLowerCase();
  if (/lawyer|legal|counsel|attorney|barrister/.test(blob)) return "lawyer";
  if (/design|ui|ux|brand|figma|creative director/.test(blob)) return "designer";
  if (/engineer|developer|software|devops|fullstack|backend|frontend/.test(blob))
    return "engineer";
  if (/founder|ceo|co-founder|startup/.test(blob)) return "founder";
  if (/market|growth|seo|content|brand strateg/.test(blob)) return "marketer";
  if (/consult|advisor|coach|strategy/.test(blob)) return "consultant";
  if (/creator|writer|podcast|youtube|influencer/.test(blob)) return "creator";
  return "general";
}
