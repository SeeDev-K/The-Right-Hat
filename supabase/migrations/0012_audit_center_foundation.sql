create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  actor_email text,
  module text,
  action text not null,
  target text,
  severity text not null default 'info',
  details jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_logs add column if not exists actor_user_id uuid;
alter table public.audit_logs add column if not exists actor_email text;
alter table public.audit_logs add column if not exists module text;
alter table public.audit_logs add column if not exists target text;
alter table public.audit_logs add column if not exists details jsonb default '{}'::jsonb;

alter table public.audit_logs enable row level security;

drop policy if exists audit_logs_admin_select on public.audit_logs;
drop policy if exists audit_logs_admin_insert on public.audit_logs;
drop policy if exists audit_logs_module_select on public.audit_logs;
drop policy if exists audit_logs_module_insert on public.audit_logs;

create policy audit_logs_module_select
on public.audit_logs
for select
to authenticated
using (public.is_current_admin() or public.can_access_module('activity'));

create policy audit_logs_module_insert
on public.audit_logs
for insert
to authenticated
with check (public.is_current_admin() or public.can_access_module('activity') or public.can_access_module(coalesce(module, 'activity')));

create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_module_idx on public.audit_logs (module);
create index if not exists audit_logs_severity_idx on public.audit_logs (severity);
