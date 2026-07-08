create table if not exists public.member_profiles (
  user_id uuid primary key,
  display_name text,
  headline text,
  company text,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.member_profiles enable row level security;

drop policy if exists member_profiles_read on public.member_profiles;
drop policy if exists member_profiles_create on public.member_profiles;
drop policy if exists member_profiles_update on public.member_profiles;

create policy member_profiles_read
on public.member_profiles
for select
to anon, authenticated
using (true);

create policy member_profiles_create
on public.member_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

create policy member_profiles_update
on public.member_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
