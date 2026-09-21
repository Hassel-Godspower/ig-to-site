import { NextResponse } from "next/server";
import { listJobs } from "@/lib/jobStore";

// Gated by middleware.ts -- only reachable with a valid admin_session cookie.
export async function GET() {
  try {
    const jobs = await listJobs();
    return NextResponse.json({ jobs });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}
