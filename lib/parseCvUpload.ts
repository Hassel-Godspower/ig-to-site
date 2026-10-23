/**
 * Unified CV intake: PDF | Word (.docx) | image (jpg/png/webp) | plain text.
 * All paths normalize into ProfessionalProfile via profileFromCvText.
 */

import {
  parseCvPdf,
  profileFromCvText,
  type ParseCvResult,
} from "./parseCvPdf";
import { parseCvDocx } from "./parseCvDocx";
import { parseCvImage, ocrPdfBuffer } from "./parseCvImage";
import { emptyProfessionalProfile } from "./professionalProfile";

export type CvUploadKind = "pdf" | "docx" | "image" | "text" | "unknown";

const PDF_MIME = new Set(["application/pdf"]);
const DOCX_MIME = new Set([
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword", // often mislabeled; we still try / warn
]);
const IMAGE_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
]);

export function detectCvKind(
  filename?: string | null,
  mime?: string | null
): CvUploadKind {
  const name = (filename || "").toLowerCase();
  const type = (mime || "").toLowerCase();

  if (name.endsWith(".pdf") || PDF_MIME.has(type)) return "pdf";
  if (name.endsWith(".docx") || type.includes("wordprocessingml")) return "docx";
  if (name.endsWith(".doc") || type === "application/msword") return "docx"; // attempt
  if (
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".webp") ||
    name.endsWith(".gif") ||
    IMAGE_MIME.has(type)
  ) {
    return "image";
  }
  if (name.endsWith(".txt") || type === "text/plain") return "text";
  return "unknown";
}

/**
 * Parse any supported CV buffer into ProfessionalProfile.
 * Thin PDFs (scanned) automatically fall through to OCR.
 */
export async function parseCvUpload(
  buffer: Buffer,
  opts: { filename?: string; mime?: string } = {}
): Promise<ParseCvResult> {
  const kind = detectCvKind(opts.filename, opts.mime);
  const warnings: string[] = [];
  const filename = opts.filename || "cv";

  if (kind === "text") {
    const rawText = buffer.toString("utf8");
    return {
      profile: profileFromCvText(rawText),
      rawText,
      warnings,
    };
  }

  if (kind === "docx") {
    if ((opts.filename || "").toLowerCase().endsWith(".doc")) {
      warnings.push(
        "Legacy .doc files are unreliable. Prefer .docx, PDF, or a photo of the CV."
      );
    }
    const result = await parseCvDocx(buffer);
    return {
      profile: result.profile,
      rawText: result.rawText,
      warnings: [...warnings, ...result.warnings],
    };
  }

  if (kind === "image") {
    const result = await parseCvImage(buffer, filename);
    return {
      profile: result.profile,
      rawText: result.rawText,
      warnings: [...warnings, ...result.warnings],
    };
  }

  if (kind === "pdf") {
    const result = await parseCvPdf(buffer);
    warnings.push(...result.warnings);

    // Scanned / image-only PDF → OCR fallback
    if ((result.rawText || "").trim().length < 80) {
      warnings.push(
        "PDF text layer was thin — running OCR (works for scanned CVs)."
      );
      const ocr = await ocrPdfBuffer(buffer, filename.endsWith(".pdf") ? filename : "cv.pdf");
      warnings.push(...ocr.warnings);
      if (ocr.text.trim().length > (result.rawText || "").length) {
        const profile = profileFromCvText(ocr.text);
        profile.source = "cv";
        return { profile, rawText: ocr.text, warnings };
      }
    }

    return { profile: result.profile, rawText: result.rawText, warnings };
  }

  // Unknown: try PDF parse, then OCR as image
  warnings.push(
    "Unrecognised file type — trying PDF extract, then OCR."
  );
  const asPdf = await parseCvPdf(buffer);
  if ((asPdf.rawText || "").trim().length >= 80) {
    return {
      profile: asPdf.profile,
      rawText: asPdf.rawText,
      warnings: [...warnings, ...asPdf.warnings],
    };
  }
  const asImg = await parseCvImage(buffer, filename);
  if ((asImg.rawText || "").trim().length >= 40) {
    return {
      profile: asImg.profile,
      rawText: asImg.rawText,
      warnings: [...warnings, ...asImg.warnings],
    };
  }

  return {
    profile: emptyProfessionalProfile({ source: "cv", fullName: "Professional" }),
    rawText: "",
    warnings: [
      ...warnings,
      ...asPdf.warnings,
      ...asImg.warnings,
      "Could not read this file. Upload PDF, .docx, or a clear photo (JPG/PNG), or paste text.",
    ],
  };
}
