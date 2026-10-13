create table if not exists site_sessions (
  id text primary key,
  job_id text not null,
  last_path text,
  referrer text,
  user_agent text,
  country text,
  last_seen_at timestamptz not null default now(),
  first_seen_at timestamptz not null default now(),
  pageviews int not null default 1
);
create index if not exists site_sessions_job_seen on site_sessions (job_id, last_seen_at desc);

create table if not exists site_pageviews (
  id bigserial primary key,
  job_id text not null,
  session_id text not null,
  path text,
  referrer text,
  created_at timestamptz not null default now()
);
create index if not exists site_pageviews_job on site_pageviews (job_id, created_at desc);

-- Platform traffic uses job_id = 'platform' (no row required in jobs table)
