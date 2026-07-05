create table if not exists public.content_posts (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('media', 'academy')),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.content_posts enable row level security;

create policy content_posts_public_read_published
on public.content_posts
for select
to anon, authenticated
using (status = 'published');

create policy content_posts_service_role_all
on public.content_posts
for all
to service_role
using (true)
with check (true);

create table if not exists public.community_members (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  role text,
  status text not null default 'pending' check (status in ('pending', 'active', 'blocked')),
  created_at timestamptz not null default now()
);

alter table public.community_members enable row level security;

create policy community_members_service_role_all
on public.community_members
for all
to service_role
using (true)
with check (true);
