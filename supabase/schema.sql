-- Spitch waitlist. Run this once in the Supabase SQL editor.
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text not null check (role in ('pitcher','builder','both')),
  organization text,
  in_region boolean not null,
  consent boolean not null,
  created_at timestamptz not null default now()
);
create unique index waitlist_email_unique on public.waitlist (lower(email));
alter table public.waitlist enable row level security;
create policy "anon can insert with consent" on public.waitlist
  for insert to anon with check (consent = true);
-- no select/update/delete policies: the public can only insert.
