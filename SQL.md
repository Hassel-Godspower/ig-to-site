-- Run in Supabase SQL editor (idempotent)

alter table jobs add column if not exists customer_name text;
alter table jobs add column if not exists commerce_tier text default 'lite';
alter table jobs add column if not exists booking_tier text default 'lite';

create table if not exists commerce_products (
  id uuid primary key default gen_random_uuid(),
  job_id text not null,
  name text not null,
  description text,
  price_kobo bigint not null default 0,
  image_url text,
  sku text,
  stock int,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists commerce_products_job on commerce_products(job_id);

create table if not exists commerce_orders (
  id uuid primary key default gen_random_uuid(),
  job_id text not null,
  customer_name text,
  customer_phone text,
  customer_email text,
  items jsonb not null default '[]',
  total_kobo bigint not null default 0,
  status text not null default 'pending',
  paystack_ref text,
  notes text,
  created_at timestamptz default now()
);
create index if not exists commerce_orders_job on commerce_orders(job_id);

create table if not exists booking_requests (
  id uuid primary key default gen_random_uuid(),
  job_id text not null,
  customer_name text,
  customer_phone text,
  service text,
  preferred_date text,
  preferred_time text,
  notes text,
  status text not null default 'new',
  created_at timestamptz default now()
);
create index if not exists booking_requests_job on booking_requests(job_id);

-- Optional: soft FK if jobs.id is text
-- alter table commerce_products add constraint commerce_products_job_fk foreign key (job_id) references jobs(id) on delete cascade;
