/**
 * Merge professional sources with strict priority:
 *   1) CV (PDF / Word / image) — source of truth
 *   2) LinkedIn (enrichment or URL stub) — fills gaps only
 *   3) Pasted About / experience — fills remaining gaps only
 *
 * Non-empty CV fields are never overwritten by later sources.
 */

import type { ProfessionalProfile } from "./professionalProfile";
import {
  detectPersona,
  emptyProfessionalProfile,
} from "./professionalProfile";

function isBlank(s?: string | null): boolean {
  return !s || !String(s).trim();
}

function pickPrimary(primary?: string, filler?: string): string | undefined {
  const p = (primary || "").trim();
  if (p) return p;
  const f = (filler || "").trim();
  return f || undefined;
}

/** Fill empty fields on `base` from `filler` without overwriting base. */
export function fillProfileGaps(
  base: ProfessionalProfile,
  filler: ProfessionalProfile | null | undefined
): ProfessionalProfile {
  if (!filler) return base;

  const nameBase =
    base.fullName && base.fullName !== "Professional" ? base.fullName : "";
  const nameFill =
    filler.fullName && filler.fullName !== "Professional"
      ? filler.fullName
      : "";

  const merged = emptyProfessionalProfile({
    source:
      base.source === "cv" || filler.source === "cv"
        ? base.source === "linkedin" || filler.source === "linkedin"
          ? "linkedin+cv"
          : "cv"
        : base.source || filler.source || "manual",
    fullName: nameBase || nameFill || "Professional",
    headline: pickPrimary(base.headline, filler.headline),
    location: pickPrimary(base.location, filler.location),
    // Prefer CV photo if present; else LinkedIn portrait
    photoUrl: pickPrimary(base.photoUrl, filler.photoUrl),
    about: pickPrimary(base.about, filler.about),
    email: pickPrimary(base.email, filler.email),
    phone: pickPrimary(base.phone, filler.phone),
    linkedinUrl: pickPrimary(base.linkedinUrl, filler.linkedinUrl),
    website: pickPrimary(base.website, filler.website),
    experience:
      base.experience?.length > 0 ? base.experience : filler.experience || [],
    education:
      base.education?.length > 0 ? base.education : filler.education || [],
    skills:
      base.skills?.length > 0
        ? Array.from(
            new Set([...(base.skills || []), ...(filler.skills || [])])
          ).slice(0, 50)
        : filler.skills || [],
    skillGroups: base.skillGroups?.length
      ? base.skillGroups
      : filler.skillGroups,
    projects: base.projects?.length ? base.projects : filler.projects,
    certifications: base.certifications?.length
      ? base.certifications
      : filler.certifications,
    awards: base.awards?.length ? base.awards : filler.awards,
    languages: base.languages?.length ? base.languages : filler.languages,
  });

  // If base had skills and filler adds more unique ones, already unioned when base had skills
  if (base.skills?.length > 0 && filler.skills?.length) {
    merged.skills = Array.from(
      new Set([...(base.skills || []), ...(filler.skills || [])])
    ).slice(0, 50);
  }

  merged.persona = detectPersona(merged);
  return merged;
}

/**
 * Back-compat two-arg merge: **first argument is primary (CV)**, second fills gaps.
 * Call as mergeProfessionalProfiles(cv, linkedin) — not the old (linkedin, cv) order.
 */
export function mergeProfessionalProfiles(
  primary: ProfessionalProfile | null | undefined,
  secondary: ProfessionalProfile | null | undefined
): ProfessionalProfile {
  if (primary && secondary) {
    return fillProfileGaps(primary, secondary);
  }
  if (primary) {
    return {
      ...primary,
      persona: detectPersona(primary),
    };
  }
  if (secondary) {
    return {
      ...secondary,
      persona: detectPersona(secondary),
    };
  }
  return emptyProfessionalProfile();
}

/**
 * Explicit ordered merge: CV → LinkedIn → paste.
 */
export function mergeProfessionalSources(opts: {
  cv?: ProfessionalProfile | null;
  linkedin?: ProfessionalProfile | null;
  paste?: ProfessionalProfile | null;
}): ProfessionalProfile {
  let profile = emptyProfessionalProfile({ source: "manual" });

  if (opts.cv) {
    profile = { ...opts.cv, source: opts.cv.source || "cv" };
  }
  if (opts.linkedin) {
    profile = fillProfileGaps(profile, opts.linkedin);
  }
  if (opts.paste) {
    profile = fillProfileGaps(profile, opts.paste);
  }

  // If only linkedin/paste and no CV, avoid empty "Professional" wipe
  if (
    (!opts.cv || opts.cv.fullName === "Professional") &&
    isBlank(profile.about) &&
    !(profile.experience?.length > 0) &&
    opts.linkedin
  ) {
    profile = fillProfileGaps(opts.linkedin, opts.paste || null);
  }

  profile.persona = detectPersona(profile);
  if (opts.cv && (opts.linkedin || opts.paste)) {
    if (profile.source !== "linkedin+cv") {
      profile.source =
        opts.cv && opts.linkedin ? "linkedin+cv" : opts.cv.source || "cv";
    }
  }
  return profile;
}
