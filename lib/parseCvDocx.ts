/**
 * Word .docx → plain text (mammoth).
 * Does not support legacy .doc binary format.
 */

import { createRequire } from "node:module";
import { emptyProfessionalProfile } from "./professionalProfile";
import { profileFromCvText, type ParseCvResult } from "./parseCvPdf";

type MammothExtract = {
  value: string;
  messages?: { type: string; message: string }[];
};

export async function parseCvDocx(buffer: Buffer): Promise<ParseCvResult> {
  const warnings: string[] = [];
  try {
    const require = createRequire(__filename);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mammoth: any = require("mammoth");
    if (!mammoth?.extractRawText) {
      warnings.push(
        "mammoth is not available. Run: npm install mammoth — then redeploy."
      );
      return {
        profile: emptyProfessionalProfile({ source: "cv", fullName: "Professional" }),
        rawText: "",
        warnings,
      };
    }
    const result = (await mammoth.extractRawText({
      buffer,
    })) as MammothExtract;
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
