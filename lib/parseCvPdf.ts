/**
 * Server-side CV PDF → rough ProfessionalProfile.
 * Uses pdf-parse when available; falls back to empty structure with raw text notes.
 *
 * npm: pdf-parse
 */

import type { ProfessionalProfile, ExperienceItem, EducationItem } from "./professionalProfile";
import { emptyProfessionalProfile, detectPersona } from "./professionalProfile";

export type ParseCvResult = {
  profile: ProfessionalProfile;
  rawText: string;
  warnings: string[];
};

function extractEmail(text: string): string | undefined {
  const m = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return m?.[0];
}

function extractPhone(text: string): string | undefined {
  const m = text.match(
    /(?:\+?234|0)[\s\-]?[789]\d{2}[\s\-]?\d{3}[\s\-]?\d{4}|\+\d{1,3}[\s\-]?\d{6,14}/
  );
  return m?.[0]?.replace(/\s+/g, "");
}

function extractLinkedIn(text: string): string | undefined {
  const m = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9\-_%]+\/?/i);
  return m?.[0];
}

function sectionAfter(text: string, headers: RegExp): string {
  const m = text.match(headers);
  if (!m || m.index == null) return "";
  const start = m.index + m[0].length;
  const rest = text.slice(start);
  const next = rest.search(
    /\n\s*(EXPERIENCE|WORK HISTORY|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|CONTACT)\b/i
  );
  return (next >= 0 ? rest.slice(0, next) : rest).trim();
}

function parseExperience(block: string): ExperienceItem[] {
  if (!block) return [];
  const lines = block
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  const items: ExperienceItem[] = [];
  let current: ExperienceItem | null = null;
  for (const line of lines) {
    if (/^[•\-\u2022]/.test(line) || /^[a-z]/.test(line) === false && line.length > 80) {
      // bullet-ish
      if (current && /^[•\-\u2022*]/.test(line)) {
        current.bullets.push(line.replace(/^[•\-\u2022*]+\s*/, ""));
        continue;
      }
    }
    // New role heuristic: "Title at Company" or "Title — Company"
    const role = line.match(/^(.+?)\s+(?:at|@|—|-|–|,)\s+(.+)$/i);
    if (role && line.length < 120) {
      if (current) items.push(current);
      current = {
        title: role[1].trim(),
        company: role[2].trim(),
        bullets: [],
      };
      continue;
    }
    if (current && /^[•\-\u2022*]/.test(line)) {
      current.bullets.push(line.replace(/^[•\-\u2022*]+\s*/, ""));
    }
  }
  if (current) items.push(current);
  return items.slice(0, 12);
}

function parseEducation(block: string): EducationItem[] {
  if (!block) return [];
  return block
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 3 && l.length < 160)
    .slice(0, 8)
    .map((line) => {
      const parts = line.split(/[|,–—-]/).map((p) => p.trim());
      return {
        school: parts[0] || line,
        degree: parts[1],
        field: parts[2],
        year: line.match(/(19|20)\d{2}/)?.[0],
      };
    });
}

function parseSkills(block: string): string[] {
  if (!block) return [];
  return block
    .split(/[,|•\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 40)
    .slice(0, 40);
}

function guessName(text: string): string {
  const first = text
    .split(/\n/)
    .map((l) => l.trim())
    .find((l) => l.length > 2 && l.length < 60 && !/@/.test(l) && !/curriculum|resume|cv/i.test(l));
  return first || "Professional";
}

/**
 * Parse a PDF buffer into ProfessionalProfile.
 * Call only from Node runtime routes (not Edge).
 */
export async function parseCvPdf(buffer: Buffer): Promise<ParseCvResult> {
  const warnings: string[] = [];
  let rawText = "";

  try {
    // Dynamic import so build still works if dep not installed yet
    const pdfParse = (await import("pdf-parse")).default as (
      data: Buffer
    ) => Promise<{ text: string }>;
    const parsed = await pdfParse(buffer);
    rawText = (parsed.text || "").replace(/\r/g, "\n");
  } catch (e) {
    warnings.push(
      "pdf-parse unavailable or failed — install `pdf-parse` and retry. " +
        (e instanceof Error ? e.message : String(e))
    );
    return {
      profile: emptyProfessionalProfile({ source: "cv", fullName: "Professional" }),
      rawText: "",
      warnings,
    };
  }

  if (rawText.length < 40) {
    warnings.push("Very little text extracted from PDF (scanned image?). Prefer a text-based CV.");
  }

  const expBlock = sectionAfter(
    rawText,
    /\b(EXPERIENCE|WORK EXPERIENCE|WORK HISTORY|EMPLOYMENT)\b/i
  );
  const eduBlock = sectionAfter(rawText, /\b(EDUCATION|ACADEMIC)\b/i);
  const skillsBlock = sectionAfter(rawText, /\b(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES)\b/i);
  const aboutBlock =
    sectionAfter(rawText, /\b(SUMMARY|PROFILE|ABOUT|OBJECTIVE)\b/i) ||
    rawText.slice(0, 600);

  let profile = emptyProfessionalProfile({
    source: "cv",
    fullName: guessName(rawText),
    about: aboutBlock.slice(0, 1200),
    email: extractEmail(rawText),
    phone: extractPhone(rawText),
    linkedinUrl: extractLinkedIn(rawText),
    experience: parseExperience(expBlock),
    education: parseEducation(eduBlock),
    skills: parseSkills(skillsBlock),
  });
  profile.persona = detectPersona(profile);

  if (!profile.experience.length) {
    warnings.push("Could not structure experience — LLM generation will use raw text more heavily.");
  }

  return { profile, rawText, warnings };
}
