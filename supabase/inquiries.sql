-- Run in the Supabase SQL editor to set up inquiry storage and the /admin account. Safe to re-run.
-- Mirrors the Inquiry type and validation in app/inquiries.ts / app/api/inquiries/route.ts.

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 30),
  phone text not null check (phone ~ '^[0-9-]{9,14}$'),
  item text not null check (char_length(item) between 1 and 60),
  sms_consent boolean not null default false,
  status text not null default 'new' check (status in ('new', 'in_progress', 'done')),
  memo text not null default '' check (char_length(memo) <= 2000)
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);

-- RLS enabled with NO policies defined: this blocks the anon/authenticated
-- Postgres roles entirely. Only server code using the service role key
-- (which bypasses RLS) can read or write this table.
alter table public.inquiries enable row level security;
-- backstop in case RLS is ever disabled or a policy is added by mistake
revoke all on public.inquiries from anon, authenticated;

-- /admin login (app/admin/auth.ts): first create the user in Authentication → Users → Add user
-- (check "Auto Confirm User"), then put its email below. Only role = admin can log in.
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'
where email = 'admin@example.com';

-- check: lists the admin accounts (empty = the email above doesn't match a created user)
select email from auth.users where raw_app_meta_data->>'role' = 'admin';
