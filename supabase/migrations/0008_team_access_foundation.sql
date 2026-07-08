create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  full_name text not null,
  email text not null unique,
  role text not null default 'editor',
  status text not null default 'active' check (status in ('active','invited','paused')),
  modules text[] not null default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  role text not null default 'editor',
  status text not null default 'pending' check (status in ('pending','accepted','cancelled')),
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

alter table public.team_members enable row level security;
alter table public.team_invites enable row level security;

drop policy if exists team_members_admin_all on public.team_members;
create policy team_members_admin_all on public.team_members
for all to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());

drop policy if exists team_invites_admin_all on public.team_invites;
create policy team_invites_admin_all on public.team_invites
for all to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());
