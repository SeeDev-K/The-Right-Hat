create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  title text not null,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

alter table public.content_items enable row level security;
