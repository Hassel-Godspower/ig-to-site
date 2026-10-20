/**
 * POST /api/generate-professional
 * Free path priority:
 * 1) CV PDF (pdf-parse) — richest
 * 2) Pasted profile text
 * 3) LinkedIn URL → name/slug stub (editable in gòke) — no paid API
 * 4) Optional Proxycurl if PROXYCURL_API_KEY is set
 */

import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createJob } from "@/lib/jobStore";
import { saveSiteFiles, saveSiteFile } from "@/lib/siteStore";
import { parseCvPdf } from "@/lib/parseCvPdf";
import { enrichFromLinkedInUrl } from "@/lib/linkedinEnrich";
import { mergeProfessionalProfiles } from "@/lib/mergeProfessionalProfile";
import { generateProfessionalSiteFiles } from "@/lib/generateProfessionalSite";
import {
  profileFromLinkedInUrl,
  profileFromPastedText,
} from "@/lib/profileFromLinkedInUrl";
import { normalizeLinkedInUrl } from "@/lib/normalizeLinkedInUrl";
import type { ProfessionalProfile } from "@/lib/professionalProfile";

export const runtime = "nodejs";
export const maxDuration = 60;

function stampEditableHooks(html: string): string {
  let out = html;
  out = out.replace(/<(h[1-6])(\s)(?![^>]*data-goke)/gi, '<$1 data-goke="heading"$2');
  out = out.replace(/<(h[1-6])>/gi, '<$1 data-goke="heading">');
  out = out.replace(/<(p)(\s)(?![^>]*data-goke)/gi, '<$1 data-goke="text"$2');
  out = out.replace(/<(p)>/gi, '<$1 data-goke="text">');
  out = out.replace(/<(img)(\s)(?![^>]*data-goke)/gi, '<$1 data-goke="image"$2');
  out = out.replace(/<(button)(\s)(?![^>]*data-goke)/gi, '<$1 data-goke="button"$2');
  out = out.replace(/<(button)>/gi, '<$1 data-goke="button">');
  out = out.replace(/<(section)(\s)(?![^>]*data-goke)/gi, '<$1 data-goke="section"$2');
  out = out.replace(/<(section)>/gi, '<$1 data-goke="section">');
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let linkedinUrl = "";
    let pasteText = "";
    let cvBuffer: Buffer | null = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      linkedinUrl = String(form.get("linkedinUrl") || form.get("linkedin") || "");
      pasteText = String(form.get("pasteText") || form.get("profileText") || "");
      const file = form.get("cv") || form.get("pdf") || form.get("file");
      if (file && typeof file === "object" && "arrayBuffer" in file) {
        const ab = await (file as File).arrayBuffer();
        cvBuffer = Buffer.from(ab);
      }
    } else {
      const body = await req.json().catch(() => ({}));
      linkedinUrl = String(body.linkedinUrl || body.linkedin || "");
      pasteText = String(body.pasteText || body.profileText || "");
      if (body.cvBase64) {
        cvBuffer = Buffer.from(String(body.cvBase64), "base64");
      }
    }

    const normalizedUrl = linkedinUrl ? normalizeLinkedInUrl(linkedinUrl) : null;

    if (!normalizedUrl && !cvBuffer && pasteText.trim().length < 40) {
      return NextResponse.json(
        {
          error:
            "Provide a LinkedIn profile URL, a PDF CV, or paste your profile/CV text (at least a short About).",
        },
        { status: 400 }
      );
    }

    const warnings: string[] = [];
    let linkedinProfile: ProfessionalProfile | null = null;
    let cvProfile: ProfessionalProfile | null = null;
    let pasteProfile: ProfessionalProfile | null = null;

    // 1) Optional paid enrichment
    if (normalizedUrl) {
      const en = await enrichFromLinkedInUrl(normalizedUrl);
      if (en.skipped) {
        warnings.push(
          "Live LinkedIn fetch is off (no PROXYCURL_API_KEY). Using free path: URL stub + CV/paste if provided."
        );
      } else if (en.error) {
        warnings.push(en.error);
      } else if (en.profile) {
        linkedinProfile = en.profile;
      }
    }

    // 2) Free URL stub if enrichment missing
    if (!linkedinProfile && normalizedUrl) {
      linkedinProfile = profileFromLinkedInUrl(normalizedUrl);
      if (linkedinProfile) {
        warnings.push(
          "Built a starter site from your LinkedIn URL. Add a PDF CV or edit the site for full experience and skills."
        );
      }
    }

    // 3) CV PDF
    if (cvBuffer) {
      try {
        const parsed = await parseCvPdf(cvBuffer);
        cvProfile = parsed.profile;
        warnings.push(...parsed.warnings);
      } catch (e) {
        warnings.push(
          "CV parse failed: " + (e instanceof Error ? e.message : String(e))
        );
      }
    }

    // 4) Pasted text
    if (pasteText.trim().length >= 40) {
      pasteProfile = profileFromPastedText(
        pasteText,
        normalizedUrl || undefined
      );
    }

    // Merge: CV wins over paste over LinkedIn stub
    let profile = mergeProfessionalProfiles(linkedinProfile, cvProfile);
    if (pasteProfile) {
      profile = mergeProfessionalProfiles(profile, pasteProfile);
    }

    // Last resort: URL stub alone is enough to open the editor
    if (
      (!profile || profile.fullName === "Professional") &&
      linkedinProfile
    ) {
      profile = linkedinProfile;
    }

    if (!profile || (!profile.linkedinUrl && !profile.about && !profile.experience.length && profile.fullName === "Professional")) {
      return NextResponse.json(
        {
          error:
            "Could not build a profile. Upload a text-based PDF CV (npm install pdf-parse), paste your About/experience, or use a valid LinkedIn /in/ URL.",
          warnings,
        },
        { status: 422 }
      );
    }

    // Ensure LinkedIn link preserved
    if (normalizedUrl && !profile.linkedinUrl) {
      profile.linkedinUrl = normalizedUrl;
    }

    const files = generateProfessionalSiteFiles(profile);
    for (const [key, val] of Object.entries(files)) {
      if (key.endsWith(".html") && typeof val === "string") {
        files[key] = stampEditableHooks(val);
      }
    }

    const jobId = nanoid(12);
    await saveSiteFiles(jobId, files);

    const slug =
      profile.fullName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "")
        .slice(0, 24) || "professional";

    await saveSiteFile(
      jobId,
      "editor-meta.json",
      JSON.stringify(
        {
          editorMode: "simple",
          createdVia: "professional",
          source: profile.source,
          persona: profile.persona,
          name: profile.fullName,
          hasLinkedIn: Boolean(profile.linkedinUrl),
          freePath: !process.env.PROXYCURL_API_KEY,
          experienceCount: profile.experience.length,
          skillCount: profile.skills.length,
        },
        null,
        2
      )
    );

    try {
      await createJob({
        id: jobId,
        status: "draft",
        parsedUsername: slug,
        editorMode: "simple",
        customerName: profile.fullName,
        phone: profile.phone,
        email: profile.email,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/editor_mode|customer_name|phone|email/i.test(msg)) {
        await createJob({
          id: jobId,
          status: "draft",
          parsedUsername: slug,
        });
      } else throw e;
    }

    return NextResponse.json({
      jobId,
      defaultUsername: slug,
      editorMode: "simple",
      path: "professional",
      name: profile.fullName,
      persona: profile.persona,
      source: profile.source,
      warnings,
      previewPath: `/preview-simple/${jobId}`,
      advancedPreviewPath: `/preview/${jobId}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
