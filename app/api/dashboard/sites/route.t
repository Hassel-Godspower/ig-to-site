import { NextRequest, NextResponse } from "next/server";
import { listJobsByEmail } from "@/lib/jobStore";

export const runtime = "nodejs";

/**
 * GET /api/dashboard/sites?email=user@example.com
 * Lists published + draft sites for that checkout email.
 */
export async function GET(req: NextRequest) {
  try {
    const email = String(req.nextUrl.searchParams.get("email") || "").trim();
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const jobs = await listJobsByEmail(email);
    const sites = jobs.map((j) => {
      const live = j.status === "done" && j.siteUrl;
      const editorPath =
        j.editorMode === "simple"
          ? `/preview-simple/${j.id}`
          : `/preview/${j.id}`;
      return {
        jobId: j.id,
        status: j.status,
        username: j.username || j.parsedUsername || null,
        email: j.email || null,
        siteUrl: j.siteUrl || null,
        repoUrl: j.repoUrl || null,
        editorMode: j.editorMode || "full",
        editorUrl: editorPath,
        canEdit: true, // storage still holds files for draft + published jobs
        isLive: Boolean(live),
      };
    });

    return NextResponse.json({ email, sites });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
