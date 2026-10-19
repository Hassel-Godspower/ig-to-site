/**
 * POST /api/generate-professional
 * multipart: linkedinUrl?, cv (PDF)?, 
 * Compatible with ig-to-site jobStore + siteStore (same as generate-handle).
 */

import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createJob } from "@/lib/jobStore";
import { saveSiteFiles, saveSiteFile } from "@/lib/siteStore";
import { parseCvPdf } from "@/lib/parseCvPdf";
import { enrichFromLinkedInUrl } from "@/lib/linkedinEnrich";
import { mergeProfessionalProfiles } from "@/lib/mergeProfessionalProfile";
import { generateProfessionalSiteFiles } from "@/lib/generateProfessionalSite";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Same editor-hook stamping as generate-handle */
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
    let cvBuffer: Buffer | null = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      linkedinUrl = String(form.get("linkedinUrl") || form.get("linkedin") || "");
      const file = form.get("cv") || form.get("pdf") || form.get("file");
      if (file && typeof file === "object" && "arrayBuffer" in file) {
        const ab = await (file as File).arrayBuffer();
        cvBuffer = Buffer.from(ab);
      }
    } else {
      const body = await req.json().catch(() => ({}));
      linkedinUrl = String(body.linkedinUrl || body.linkedin || "");
      if (body.cvBase64) {
        cvBuffer = Buffer.from(String(body.cvBase64), "base64");
      }
    }

    if (!linkedinUrl && !cvBuffer) {
      return NextResponse.json(
        {
          error:
            "Provide a LinkedIn profile URL and/or a CV PDF. Without PROXYCURL_API_KEY, upload a text-based PDF.",
        },
        { status: 400 }
      );
    }

    const warnings: string[] = [];
    let linkedinProfile = null;
    let cvProfile = null;

    if (linkedinUrl) {
      const en = await enrichFromLinkedInUrl(linkedinUrl);
      if (en.skipped) warnings.push(en.error || "LinkedIn enrichment skipped");
      else if (en.error) warnings.push(en.error);
      else linkedinProfile = en.profile;
    }

    if (cvBuffer) {
      const parsed = await parseCvPdf(cvBuffer);
      cvProfile = parsed.profile;
      warnings.push(...parsed.warnings);
    }

    const profile = mergeProfessionalProfiles(linkedinProfile, cvProfile);
    if (
      (!profile.experience.length && !profile.about && profile.fullName === "Professional") ||
      (!linkedinProfile && !cvProfile)
    ) {
      return NextResponse.json(
        {
          error:
            "Could not build a profile. Upload a text-based PDF CV, or set PROXYCURL_API_KEY for LinkedIn-only.",
          warnings,
        },
        { status: 422 }
      );
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
      // Older schema without optional columns
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
