alter table public.team_invites add column if not exists modules text[] not null default array[]::text[];

create index if not exists team_invites_modules_idx on public.team_invites using gin (modules);
