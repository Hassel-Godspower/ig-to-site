/**
 * Word .docx → plain text (mammoth).
 * Optional dependency: npm install mammoth
 * Uses createRequire so the app still builds if mammoth is not installed yet.
 */

import { createRequire } from "node:module";
import { emptyProfessionalProfile } from "./professionalProfile";
import { profileFromCvText, type ParseCvResult } from "./parseCvPdf";

type MammothExtract = {
  value: string;
  messages?: { type: string; message: string }[];
};

function loadMammoth(): {
  extractRawText: (opts: { buffer: Buffer }) => Promise<MammothExtract>;
} | null {
  try {
    const require = createRequire(__filename);
    // Build package name at runtime so webpack does not fail the compile
    // when mammoth is not in node_modules yet.
    const name = ["mam", "moth"].join("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mammoth: any = require(name);
    if (mammoth?.extractRawText) return mammoth;
    if (mammoth?.default?.extractRawText) return mammoth.default;
    return null;
  } catch {
    return null;
  }
}

export async function parseCvDocx(buffer: Buffer): Promise<ParseCvResult> {
  const warnings: string[] = [];
  const mammoth = loadMammoth();
  if (!mammoth) {
    warnings.push(
      "mammoth is not installed. Run: npm install mammoth — then redeploy. Word .docx upload needs this package."
    );
    return {
      profile: emptyProfessionalProfile({ source: "cv", fullName: "Professional" }),
      rawText: "",
      warnings,
    };
  }

  try {
    const result = await mammoth.extractRawText({ buffer });
    const rawText = String(result?.value || "").trim();
    if (result.messages?.length) {
      for (const m of result.messages.slice(0, 3)) {
        if (m.type === "warning") warnings.push(m.message);
      }
    }
    if (rawText.length < 40) {
      warnings.push(
        "Very little text in this Word file. Paste your CV text, or upload a fuller .docx."
      );
    }
    const profile = profileFromCvText(rawText || "Professional");
    profile.source = "cv";
    return { profile, rawText, warnings };
  } catch (e) {
    warnings.push(
      "Word parse failed: " + (e instanceof Error ? e.message : String(e))
    );
    return {
      profile: emptyProfessionalProfile({ source: "cv", fullName: "Professional" }),
      rawText: "",
      warnings,
    };
  }
}
