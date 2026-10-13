import { getSupabase } from "./supabase";

const LIVE_WINDOW_MS = 45_000;

export type LiveVisitor = {
  sessionId: string;
  path: string | null;
  referrer: string | null;
  country: string | null;
  lastSeenAt: string;
  firstSeenAt: string;
  pageviews: number;
  userAgent: string | null;
};

export async function recordHeartbeat(input: {
  jobId: string;
  sessionId: string;
  path?: string;
  referrer?: string;
  userAgent?: string;
  country?: string;
  isPageview?: boolean;
}): Promise<void> {
  const sb = getSupabase();
  const now = new Date().toISOString();
  const { jobId, sessionId } = input;

  const { data: existing } = await sb
    .from("site_sessions")
    .select("id, pageviews")
    .eq("id", sessionId)
    .eq("job_id", jobId)
    .maybeSingle();

  if (existing) {
    const pageviews =
      (existing.pageviews as number) + (input.isPageview ? 1 : 0);
    await sb
      .from("site_sessions")
      .update({
        last_path: input.path ?? null,
        referrer: input.referrer ?? null,
        user_agent: input.userAgent ?? null,
        country: input.country ?? null,
        last_seen_at: now,
        pageviews,
      })
      .eq("id", sessionId)
      .eq("job_id", jobId);
  } else {
    await sb.from("site_sessions").insert({
      id: sessionId,
      job_id: jobId,
      last_path: input.path ?? null,
      referrer: input.referrer ?? null,
      user_agent: input.userAgent ?? null,
      country: input.country ?? null,
      last_seen_at: now,
      first_seen_at: now,
      pageviews: 1,
    });
  }

  if (input.isPageview) {
    await sb.from("site_pageviews").insert({
      job_id: jobId,
      session_id: sessionId,
      path: input.path ?? null,
      referrer: input.referrer ?? null,
    });
  }
}

export async function listLiveVisitors(jobId: string): Promise<{
  live: LiveVisitor[];
  count: number;
}> {
  const sb = getSupabase();
  const since = new Date(Date.now() - LIVE_WINDOW_MS).toISOString();
  const { data, error } = await sb
    .from("site_sessions")
    .select("*")
    .eq("job_id", jobId)
    .gte("last_seen_at", since)
    .order("last_seen_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);

  const live: LiveVisitor[] = (data ?? []).map((r) => ({
    sessionId: r.id as string,
    path: (r.last_path as string) ?? null,
    referrer: (r.referrer as string) ?? null,
    country: (r.country as string) ?? null,
    lastSeenAt: r.last_seen_at as string,
    firstSeenAt: r.first_seen_at as string,
    pageviews: (r.pageviews as number) ?? 1,
    userAgent: (r.user_agent as string) ?? null,
  }));

  return { live, count: live.length };
}

export async function listRecentSessions(
  jobId: string,
  limit = 40
): Promise<LiveVisitor[]> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("site_sessions")
    .select("*")
    .eq("job_id", jobId)
    .order("last_seen_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? []).map((r) => ({
    sessionId: r.id as string,
    path: (r.last_path as string) ?? null,
    referrer: (r.referrer as string) ?? null,
    country: (r.country as string) ?? null,
    lastSeenAt: r.last_seen_at as string,
    firstSeenAt: r.first_seen_at as string,
    pageviews: (r.pageviews as number) ?? 1,
    userAgent: (r.user_agent as string) ?? null,
  }));
}
