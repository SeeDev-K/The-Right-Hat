create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  author_email text,
  title text not null,
  body text not null,
  visibility text not null default 'public',
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null,
  author_email text,
  body text not null,
  status text not null default 'published',
  created_at timestamptz not null default now()
);

create index if not exists community_posts_created_at_idx on public.community_posts (created_at desc);
create index if not exists community_replies_post_id_idx on public.community_replies (post_id);
