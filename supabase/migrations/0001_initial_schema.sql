create extension if not exists pgcrypto;

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  source text default 'website',
  status text default 'new',
  created_at timestamptz not null default now()
);

alter table public.contact_requests enable row level security;

create policy contact_requests_service_role_all
on public.contact_requests
for all
to service_role
using (true)
with check (true);

create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  full_name text,
  role text default 'admin',
  created_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;

create policy admin_profiles_service_role_all
on public.admin_profiles
for all
to service_role
using (true)
with check (true);
