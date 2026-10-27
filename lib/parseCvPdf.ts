/**
 * Server-side CV PDF → ProfessionalProfile.
 *
 * Supports:
 *  - pdf-parse v1.x  →  default export function(buffer)
 *  - pdf-parse v2.x  →  { PDFParse } class with getText()
 *
 * Pin recommendation: "pdf-parse": "1.1.1" (simpler + more reliable on many CVs)
 * or keep ^2.4.x with this loader.
 *
 * Runtime: Node only (not Edge).
 */

import { createRequire } from "node:module";
import type {
  ProfessionalProfile,
  ExperienceItem,
  EducationItem,
} from "./professionalProfile";
import {
  emptyProfessionalProfile,
  detectPersona,
} from "./professionalProfile";

export type ParseCvResult = {
  profile: ProfessionalProfile;
  rawText: string;
  warnings: string[];
};

type PdfParseV1 = (data: Buffer) => Promise<{ text?: string; numpages?: number }>;

async function extractTextFromPdf(buffer: Buffer): Promise<{
  text: string;
  warnings: string[];
}> {
  const warnings: string[] = [];
  try {
    const require = createRequire(__filename);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod: any = require("pdf-parse");

    // --- v1: module is a function ---
    if (typeof mod === "function") {
      const parsed = await (mod as PdfParseV1)(buffer);
      return { text: String(parsed?.text || ""), warnings };
    }

    // --- v2: class PDFParse ---
    const PDFParse = mod.PDFParse || mod.default?.PDFParse || mod.default;
    if (typeof PDFParse === "function") {
      try {
        const data = new Uint8Array(buffer);
        const parser = new PDFParse({ data });
        const result = await parser.getText();
        if (typeof parser.destroy === "function") {
          try {
            await parser.destroy();
          } catch {
            /* ignore */
          }
        }
        return { text: String(result?.text || ""), warnings };
      } catch (e) {
        warnings.push(
          "pdf-parse v2 failed: " + (e instanceof Error ? e.message : String(e))
        );
      }
    }

    warnings.push(
      "pdf-parse is installed but API was not recognised. Pin pdf-parse@1.1.1 or upgrade parseCvPdf."
    );
    return { text: "", warnings };
  } catch {
    warnings.push(
      "pdf-parse is not installed. Run: npm install pdf-parse@1.1.1 — then redeploy."
    );
    return { text: "", warnings };
  }
}

/** Fix common extract artefacts (tab-separated letters, excess whitespace). */
function normalizeExtractedText(raw: string): string {
  let t = raw.replace(/\r/g, "\n");
  // If many single letters separated by tabs/spaces, collapse letter-gaps
  const letterGapRatio =
    (t.match(/[A-Za-z]\t+[A-Za-z]/g) || []).length / Math.max(t.length / 20, 1);
  if (letterGapRatio > 0.15) {
    t = t.replace(/\t+/g, "");
  }
  t = t.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
  return t.trim();
}

function extractEmail(text: string): string | undefined {
  const m = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return m?.[0];
}

function extractPhone(text: string): string | undefined {
  const m = text.match(
    /(?:\+?234|0)[\s\-]?[789]\d{2}[\s\-]?\d{3}[\s\-]?\d{4}|\+\d{1,3}[\s\-]?\d{6,14}|\b0[789]\d{9}\b/
  );
  return m?.[0]?.replace(/\s+/g, "");
}

function extractLinkedIn(text: string): string | undefined {
  const m = text.match(
    /https?:\/\/(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9\-_%]+\/?/i
  );
  return m?.[0];
}

function sectionAfter(text: string, headers: RegExp): string {
  const m = text.match(headers);
  if (!m || m.index == null) return "";
  const start = m.index + m[0].length;
  const rest = text.slice(start);
  const next = rest.search(
    /\n\s*(?:PROFESSIONAL\s+)?(?:SUMMARY|PROFILE|ABOUT|OBJECTIVE|EXPERIENCE|WORK\s+HISTORY|WORK\s+EXPERIENCE|EMPLOYMENT|EDUCATION|ACADEMIC|CORE\s+SKILLS|SKILLS|TECHNICAL\s+SKILLS|PROJECTS|CERTIFICATIONS|CONTACT|REFERENCES)\b/i
  );
  return (next >= 0 ? rest.slice(0, next) : rest).trim();
}

/**
 * Parse experience blocks that look like:
 *   08/2022 - 10/2025
 *   IT Professional/Brand Manager (Full time)
 *   Zikel Cosmetics
 *   • Designed & Managed...
 * or:
 *   IT Professional at Zikel Cosmetics
 *   Aug 2022 – Oct 2025
 */
function parseExperience(block: string): ExperienceItem[] {
  if (!block) return [];
  const lines = block
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  const items: ExperienceItem[] = [];
  let current: ExperienceItem | null = null;

  const dateOnly =
    /^(?:(?:0?[1-9]|1[0-2])[\/\-.](?:19|20)\d{2}|(?:19|20)\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*(?:19|20)\d{2})\s*[-–—to]+\s*(?:(?:0?[1-9]|1[0-2])[\/\-.](?:19|20)\d{2}|(?:19|20)\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*(?:19|20)\d{2}|Present|Current)$/i;
  const dateInline =
    /((?:0?[1-9]|1[0-2])[\/\-.](?:19|20)\d{2}|(?:19|20)\d{2})\s*[-–—]\s*((?:0?[1-9]|1[0-2])[\/\-.](?:19|20)\d{2}|(?:19|20)\d{2}|Present|Current)/i;

  for (const line of lines) {
    // Bullet under current role
    if (current && /^[•\-\u2022*●]/.test(line)) {
      current.bullets.push(line.replace(/^[•\-\u2022*●]+\s*/, "").trim());
      continue;
    }

    // Pure date line → start new role (title/company on following lines)
    if (dateOnly.test(line) || (/^\d{2}\/\d{4}/.test(line) && line.length < 40)) {
      if (current && (current.title || current.company)) items.push(current);
      const dm = line.match(dateInline) || line.match(/(\S+)\s*[-–—]\s*(\S+)/);
      current = {
        title: "",
        company: "",
        start: dm?.[1],
        end: dm?.[2],
        bullets: [],
      };
      continue;
    }

    // "Title at Company" / "Title — Company"
    const roleAt = line.match(
      /^(.{3,80}?)\s+(?:at|@|—|–|-|,)\s+(.{2,80})$/i
    );
    if (roleAt && !/^[•\-]/.test(line)) {
      if (current && current.title) items.push(current);
      current = {
        title: roleAt[1].trim(),
        company: roleAt[2].trim(),
        bullets: [],
      };
      continue;
    }

    // Title with (Full time) suffix
    if (
      current &&
      !current.title &&
      line.length < 100 &&
      !/^https?:/i.test(line)
    ) {
      current.title = line.replace(/\s*\((?:Full\s*time|Part\s*time|Contract)\)\s*$/i, "").trim();
      continue;
    }

    // Company line after title
    if (
      current &&
      current.title &&
      !current.company &&
      line.length < 80 &&
      !/^[•\-]/.test(line)
    ) {
      current.company = line;
      continue;
    }

    // Orphan title-looking line starts a role
    if (
      !current &&
      line.length > 5 &&
      line.length < 90 &&
      /manager|developer|engineer|designer|officer|assistant|director|lead|consultant|marketer|professional/i.test(
        line
      )
    ) {
      current = { title: line, company: "", bullets: [] };
    }
  }

  if (current && (current.title || current.company || current.bullets.length)) {
    if (!current.title) current.title = "Role";
    if (!current.company) current.company = "Organisation";
    items.push(current);
  }

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
  // Prefer line-based skills (one skill per line) over comma split of long sentences
  const lines = block
    .split(/\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 60 && !/^core skills$/i.test(s));

  if (lines.length >= 3) {
    return [...new Set(lines)].slice(0, 40);
  }

  return block
    .split(/[,|•\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 40)
    .slice(0, 40);
}

function guessName(text: string): string {
  const lines = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // ALL CAPS name at top (HASSEL GODSPOWER)
  for (const l of lines.slice(0, 8)) {
    if (
      /^[A-Z][A-Z\s.'-]{2,50}$/.test(l) &&
      !/SUMMARY|EXPERIENCE|EDUCATION|SKILLS|PROFILE|CURRICULUM|RESUME|CONTACT|PHONE|EMAIL|ADDRESS/i.test(
        l
      ) &&
      l.split(/\s+/).length >= 2 &&
      l.split(/\s+/).length <= 5
    ) {
      return l
        .split(/\s+/)
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(" ");
    }
  }

  // Title Case name
  for (const l of lines.slice(0, 8)) {
    if (
      /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+$/.test(l) &&
      l.length < 50 &&
      !/@/.test(l)
    ) {
      return l;
    }
  }

  const first = lines.find(
    (l) =>
      l.length > 2 &&
      l.length < 60 &&
      !/@/.test(l) &&
      !/curriculum|resume|cv|phone|email|address|summary|skills/i.test(l)
  );
  return first || "Professional";
}

function guessHeadline(text: string): string | undefined {
  const lines = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  for (const l of lines.slice(0, 12)) {
    if (
      /developer|engineer|manager|designer|marketer|consultant|director|professional|specialist/i.test(
        l
      ) &&
      l.length < 80 &&
      !/summary|experience|skilled in/i.test(l)
    ) {
      return l.replace(/\s*\|\s*/g, " · ");
    }
  }
  return undefined;
}


function extractLocation(text: string): string | undefined {
  const m =
    text.match(
      /(?:location|based in|lives? in|address)\s*[:\-]?\s*([A-Za-z .,'-]{3,60})/i
    ) ||
    text.match(
      /\b(Lagos|Abuja|Port Harcourt|Ibadan|Accra|Nairobi|London|Remote)(?:\s*[,/]\s*[A-Za-z ]+)?\b/i
    );
  if (m) return m[1] ? m[1].trim() : m[0].trim();
  return undefined;
}

function parseCertifications(text: string): string[] {
  const block = sectionAfter(
    text,
    /\b(CERTIFICATIONS?|LICEN[CS]ES?|COURSES?|TRAINING)\b/i
  );
  if (!block) return [];
  return block
    .split(/\n+/)
    .map((l) => l.replace(/^[•\-\*]\s*/, "").trim())
    .filter((l) => l.length > 3 && l.length < 120)
    .slice(0, 12);
}

function parseLanguages(text: string): { language: string; fluency?: string }[] {
  const block = sectionAfter(text, /\b(LANGUAGES?)\b/i);
  if (!block) return [];
  return block
    .split(/[,|\n]/)
    .map((l) => l.replace(/^[•\-\*]\s*/, "").trim())
    .filter((l) => l.length > 1 && l.length < 40)
    .slice(0, 8)
    .map((line) => {
      const parts = line.split(/[:\-–—]/).map((x) => x.trim());
      return { language: parts[0], fluency: parts[1] };
    });
}


/**
 * Parse plain text (paste path or already-extracted PDF text) into a profile.
 */
export function profileFromCvText(rawText: string): ProfessionalProfile {
  const text = normalizeExtractedText(rawText);

  const expBlock = sectionAfter(
    text,
    /\b(EXPERIENCE|WORK EXPERIENCE|WORK HISTORY|EMPLOYMENT|PROFESSIONAL EXPERIENCE)\b/i
  );
  const eduBlock = sectionAfter(text, /\b(EDUCATION|ACADEMIC|QUALIFICATIONS)\b/i);
  const skillsBlock = sectionAfter(
    text,
    /\b(CORE\s+SKILLS|SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|COMPETENCIES|EXPERTISE)\b/i
  );
  const aboutBlock =
    sectionAfter(
      text,
      /\b(PROFESSIONAL\s+SUMMARY|SUMMARY|PROFILE|ABOUT|OBJECTIVE|CAREER OBJECTIVE)\b/i
    ) || "";

  // About: prefer summary section; else first substantial paragraph under name
  let about = aboutBlock.replace(/\s+/g, " ").trim().slice(0, 1200);
  if (about.length < 40) {
    const paras = text
      .split(/\n{2,}/)
      .map((p) => p.replace(/\s+/g, " ").trim())
      .filter((p) => p.length > 60 && !/EXPERIENCE|EDUCATION|SKILLS/i.test(p));
    if (paras[0]) about = paras[0].slice(0, 1200);
  }

  const experience = parseExperience(expBlock);
  // Fallback: if no EXPERIENCE header, try whole text after summary
  const experienceFinal =
    experience.length > 0
      ? experience
      : parseExperience(
          sectionAfter(text, /\b(PROFESSIONAL SUMMARY|SUMMARY)\b/i) || text
        );

  const skills = parseSkills(skillsBlock);
  // Harvest skill-like tokens from bullets if skills section empty
  let skillsFinal = skills;
  if (skillsFinal.length < 3) {
    const fromBullets = experienceFinal
      .flatMap((e) => e.bullets || [])
      .join(" ")
      .match(
        /\b(WordPress|SEO|JavaScript|TypeScript|React|Python|Excel|Photoshop|Figma|SQL|HTML|CSS|Marketing|Analytics|Salesforce|HubSpot|Shopify)\b/gi
      );
    if (fromBullets) {
      skillsFinal = [...new Set([...(skills || []), ...fromBullets])].slice(0, 40);
    }
  }

  const profile = emptyProfessionalProfile({
    source: "cv",
    fullName: guessName(text),
    headline: guessHeadline(text),
    location: extractLocation(text),
    about,
    email: extractEmail(text),
    phone: extractPhone(text),
    linkedinUrl: extractLinkedIn(text),
    experience: experienceFinal,
    education: parseEducation(eduBlock),
    skills: skillsFinal,
    certifications: parseCertifications(text),
    languages: parseLanguages(text),
  });
  profile.persona = detectPersona(profile);
  return profile;
}

/**
 * Parse a PDF buffer into ProfessionalProfile.
 */
export async function parseCvPdf(buffer: Buffer): Promise<ParseCvResult> {
  const { text: extracted, warnings } = await extractTextFromPdf(buffer);
  const rawText = normalizeExtractedText(extracted);

  if (!rawText || rawText.length < 40) {
    warnings.push(
      "Very little text extracted from this PDF. It may be scanned/image-based or use non-standard fonts. Paste your CV text in the box, or export a text-based PDF."
    );
    return {
      profile: emptyProfessionalProfile({
        source: "cv",
        fullName: "Professional",
      }),
      rawText: rawText || "",
      warnings,
    };
  }

  const profile = profileFromCvText(rawText);

  if (!profile.experience.length) {
    warnings.push(
      "Could not fully structure experience from the PDF. Edit roles in the editor, or paste a clearer experience section."
    );
  }
  if (profile.fullName === "Professional") {
    warnings.push("Could not detect your name from the PDF — set it in the editor.");
  }
  if (!profile.skills.length) {
    warnings.push("Few or no skills detected — add them in the editor.");
  }

  return { profile, rawText, warnings };
}
