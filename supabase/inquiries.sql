-- Run in the Supabase SQL editor to set up inquiry storage and the /admin account. Safe to re-run.
-- Mirrors the Inquiry type and validation in app/inquiries.ts / app/api/inquiries/route.ts.

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 30),
  phone text not null check (phone ~ '^[0-9-]{9,14}$'),
  item text not null check (char_length(item) between 1 and 60),
  sms_consent boolean not null default false, -- no longer collected (single consent), kept for older rows
  status text not null default 'new',
  memo text not null default '' check (char_length(memo) <= 2000)
);

-- status values (STATUSES in app/inquiries.ts); drop + add so re-running also upgrades older tables
alter table public.inquiries drop constraint if exists inquiries_status_check;
alter table public.inquiries add constraint inquiries_status_check check (status in ('new', 'in_progress', 'hold', 'done'));

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);

-- RLS enabled with NO policies defined: this blocks the anon/authenticated
-- Postgres roles entirely. Only server code using the service role key
-- (which bypasses RLS) can read or write this table.
alter table public.inquiries enable row level security;
-- backstop in case RLS is ever disabled or a policy is added by mistake
revoke all on public.inquiries from anon, authenticated;

-- retention: the privacy policy (app/privacy-policy.tsx) promises deletion 1 year after submission.
-- Daily job at 03:00 UTC (12:00 KST); scheduling the same name again just updates it.
create extension if not exists pg_cron;
select cron.schedule('purge-old-inquiries', '0 3 * * *', $$delete from public.inquiries where created_at < now() - interval '1 year'$$);

-- /admin login (app/admin/auth.ts): every user in Authentication → Users can log in.
-- Add them via Add user (check "Auto Confirm User") and turn OFF "Allow new users to sign up".
