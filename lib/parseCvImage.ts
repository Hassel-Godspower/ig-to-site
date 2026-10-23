/**
 * Image CV / scanned page → text via OCR.
 *
 * Order:
 *  1) OCR.space API (works well on Vercel; set OCR_SPACE_API_KEY, or free demo key)
 *  2) Optional tesseract.js if installed (heavier; good for local/dev)
 */

import type { ProfessionalProfile } from "./professionalProfile";
import { emptyProfessionalProfile } from "./professionalProfile";
import { profileFromCvText, type ParseCvResult } from "./parseCvPdf";

async function ocrSpace(
  buffer: Buffer,
  filename: string
): Promise<{ text: string; warning?: string }> {
  const key = process.env.OCR_SPACE_API_KEY || "helloworld";
  const form = new FormData();
  const bytes = new Uint8Array(buffer);
  const blob = new Blob([bytes]);
  form.append("file", blob, filename || "cv.png");
  form.append("language", "eng");
  form.append("isOverlayRequired", "false");
  form.append("OCREngine", "2");
  form.append("scale", "true");
  form.append("detectOrientation", "true");

  const res = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: { apikey: key },
    body: form,
  });

  const data = (await res.json()) as {
    IsErroredOnProcessing?: boolean;
    ErrorMessage?: string | string[];
    ParsedResults?: { ParsedText?: string }[];
  };

  if (!res.ok || data.IsErroredOnProcessing) {
    const msg = Array.isArray(data.ErrorMessage)
      ? data.ErrorMessage.join("; ")
      : data.ErrorMessage || `OCR HTTP ${res.status}`;
    return { text: "", warning: "OCR.space: " + msg };
  }

  const text = (data.ParsedResults || [])
    .map((p) => p.ParsedText || "")
    .join("\n")
    .trim();
  return { text };
}

async function ocrTesseract(buffer: Buffer): Promise<{ text: string; warning?: string }> {
  try {
    const { createRequire } = await import("node:module");
    const require = createRequire(__filename);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Tesseract: any = require("tesseract.js");
    if (!Tesseract?.recognize) {
      return { text: "", warning: "tesseract.js not installed" };
    }
    const result = await Tesseract.recognize(buffer, "eng", {
      logger: () => {},
    });
    return { text: String(result?.data?.text || "").trim() };
  } catch (e) {
    return {
      text: "",
      warning:
        "tesseract.js failed: " + (e instanceof Error ? e.message : String(e)),
    };
  }
}

/**
 * OCR an image buffer (jpg/png/webp/gif).
 */
export async function parseCvImage(
  buffer: Buffer,
  filename = "cv.png"
): Promise<ParseCvResult> {
  const warnings: string[] = [];
  let rawText = "";

  // 1) OCR.space
  try {
    const ocr = await ocrSpace(buffer, filename);
    if (ocr.warning) warnings.push(ocr.warning);
    rawText = ocr.text;
  } catch (e) {
    warnings.push(
      "OCR.space request failed: " +
        (e instanceof Error ? e.message : String(e))
    );
  }

  // 2) tesseract fallback
  if (rawText.length < 40) {
    const tess = await ocrTesseract(buffer);
    if (tess.warning) warnings.push(tess.warning);
    if (tess.text.length > rawText.length) rawText = tess.text;
  }

  if (rawText.length < 40) {
    warnings.push(
      "Could not read text from this image. Use a clearer photo, a text PDF/Word file, or paste your CV text."
    );
    return {
      profile: emptyProfessionalProfile({ source: "cv", fullName: "Professional" }),
      rawText,
      warnings,
    };
  }

  const profile = profileFromCvText(rawText);
  profile.source = "cv";
  return { profile, rawText, warnings };
}

/**
 * OCR a PDF when pdf-parse extracted almost nothing (scanned PDF).
 * OCR.space accepts PDF uploads.
 */
export async function ocrPdfBuffer(
  buffer: Buffer,
  filename = "cv.pdf"
): Promise<{ text: string; warnings: string[] }> {
  const warnings: string[] = [];
  try {
    const ocr = await ocrSpace(buffer, filename.endsWith(".pdf") ? filename : "cv.pdf");
    if (ocr.warning) warnings.push(ocr.warning);
    return { text: ocr.text, warnings };
  } catch (e) {
    warnings.push(
      "PDF OCR failed: " + (e instanceof Error ? e.message : String(e))
    );
    return { text: "", warnings };
  }
}
