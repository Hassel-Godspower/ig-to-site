/**
 * Merge LinkedIn enrichment + CV parse.
 * Rule: CV wins on conflicts for facts the user uploaded; LinkedIn fills gaps.
 */

import type { ProfessionalProfile } from "./professionalProfile";
import { detectPersona, emptyProfessionalProfile } from "./professionalProfile";

function prefer(a?: string, b?: string): string | undefined {
  const x = (a || "").trim();
  const y = (b || "").trim();
  if (x.length >= y.length && x) return x;
  return y || x || undefined;
}

export function mergeProfessionalProfiles(
  linkedin: ProfessionalProfile | null | undefined,
  cv: ProfessionalProfile | null | undefined
): ProfessionalProfile {
  if (linkedin && cv) {
    const merged = emptyProfessionalProfile({
      source: "linkedin+cv",
      fullName: prefer(cv.fullName, linkedin.fullName) || "Professional",
      headline: prefer(cv.headline, linkedin.headline),
      location: prefer(cv.location, linkedin.location),
      photoUrl: linkedin.photoUrl || cv.photoUrl,
      about: prefer(cv.about, linkedin.about),
      email: prefer(cv.email, linkedin.email),
      phone: prefer(cv.phone, linkedin.phone),
      linkedinUrl: linkedin.linkedinUrl || cv.linkedinUrl,
      website: prefer(cv.website, linkedin.website),
      experience:
        cv.experience.length >= linkedin.experience.length
          ? cv.experience
          : linkedin.experience,
      education:
        cv.education.length >= linkedin.education.length
          ? cv.education
          : linkedin.education,
      skills: Array.from(
        new Set([...(cv.skills || []), ...(linkedin.skills || [])])
      ).slice(0, 50),
      projects: cv.projects?.length ? cv.projects : linkedin.projects,
      certifications: cv.certifications?.length
        ? cv.certifications
        : linkedin.certifications,
    });
    merged.persona = detectPersona(merged);
    return merged;
  }
  if (cv) {
    return { ...cv, source: "cv", persona: detectPersona(cv) };
  }
  if (linkedin) {
    return { ...linkedin, source: "linkedin", persona: detectPersona(linkedin) };
  }
  return emptyProfessionalProfile();
}
