create table if not exists public.api_integrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null default 'internal',
  base_url text,
  status text not null default 'inactive' check (status in ('active','inactive','degraded','error')),
  auth_type text not null default 'none' check (auth_type in ('none','bearer','apikey','basic','oauth2')),
  masked_key text,
  webhook_url text,
  rate_limit_per_min integer,
  last_status_code integer,
  last_latency_ms integer,
  last_check_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.api_logs (
  id uuid primary key default gen_random_uuid(),
  integration_id uuid references public.api_integrations(id) on delete cascade,
  event_type text not null,
  status text not null default 'info',
  message text,
  status_code integer,
  latency_ms integer,
  created_at timestamptz not null default now()
);

alter table public.api_integrations enable row level security;
alter table public.api_logs enable row level security;

drop policy if exists api_integrations_module_all on public.api_integrations;
create policy api_integrations_module_all
on public.api_integrations
for all
to authenticated
using (public.is_current_admin() or public.can_access_module('apis'))
with check (public.is_current_admin() or public.can_access_module('apis'));

drop policy if exists api_logs_module_select on public.api_logs;
drop policy if exists api_logs_module_insert on public.api_logs;
create policy api_logs_module_select
on public.api_logs
for select
to authenticated
using (public.is_current_admin() or public.can_access_module('apis'));

create policy api_logs_module_insert
on public.api_logs
for insert
to authenticated
with check (public.is_current_admin() or public.can_access_module('apis'));
