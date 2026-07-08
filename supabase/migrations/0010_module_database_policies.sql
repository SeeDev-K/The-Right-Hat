-- Database-level module access policies.
-- This keeps UI guards and Supabase RLS aligned.

-- Content CMS: Academy / Media.
alter table public.content_items enable row level security;

drop policy if exists content_items_admin_select on public.content_items;
drop policy if exists content_items_admin_insert on public.content_items;
drop policy if exists content_items_admin_update on public.content_items;
drop policy if exists content_items_admin_delete on public.content_items;

drop policy if exists content_items_module_select on public.content_items;
drop policy if exists content_items_module_insert on public.content_items;
drop policy if exists content_items_module_update on public.content_items;
drop policy if exists content_items_module_delete on public.content_items;

create policy content_items_module_select
on public.content_items
for select
to authenticated
using (
  public.is_current_admin()
  or (kind = 'academy' and public.can_access_module('academy'))
  or (kind = 'media' and public.can_access_module('media'))
);

create policy content_items_module_insert
on public.content_items
for insert
to authenticated
with check (
  public.is_current_admin()
  or (kind = 'academy' and public.can_access_module('academy'))
  or (kind = 'media' and public.can_access_module('media'))
);

create policy content_items_module_update
on public.content_items
for update
to authenticated
using (
  public.is_current_admin()
  or (kind = 'academy' and public.can_access_module('academy'))
  or (kind = 'media' and public.can_access_module('media'))
)
with check (
  public.is_current_admin()
  or (kind = 'academy' and public.can_access_module('academy'))
  or (kind = 'media' and public.can_access_module('media'))
);

create policy content_items_module_delete
on public.content_items
for delete
to authenticated
using (
  public.is_current_admin()
  or (kind = 'academy' and public.can_access_module('academy'))
  or (kind = 'media' and public.can_access_module('media'))
);

-- Team access.
alter table public.team_members enable row level security;
alter table public.team_invites enable row level security;

drop policy if exists team_members_admin_all on public.team_members;
drop policy if exists team_invites_admin_all on public.team_invites;
drop policy if exists team_members_module_all on public.team_members;
drop policy if exists team_invites_module_all on public.team_invites;

create policy team_members_module_all
on public.team_members
for all
to authenticated
using (public.is_current_admin() or public.can_access_module('team'))
with check (public.is_current_admin() or public.can_access_module('team'));

create policy team_invites_module_all
on public.team_invites
for all
to authenticated
using (public.is_current_admin() or public.can_access_module('team'))
with check (public.is_current_admin() or public.can_access_module('team'));

-- API center foundation if the tables exist.
do $$
begin
  if to_regclass('public.api_integrations') is not null then
    execute 'alter table public.api_integrations enable row level security';
    execute 'drop policy if exists api_integrations_admin_select on public.api_integrations';
    execute 'drop policy if exists api_integrations_admin_insert on public.api_integrations';
    execute 'drop policy if exists api_integrations_admin_update on public.api_integrations';
    execute 'drop policy if exists api_integrations_admin_delete on public.api_integrations';
    execute 'drop policy if exists api_integrations_module_all on public.api_integrations';
    execute 'create policy api_integrations_module_all on public.api_integrations for all to authenticated using (public.is_current_admin() or public.can_access_module(''apis'')) with check (public.is_current_admin() or public.can_access_module(''apis''))';
  end if;

  if to_regclass('public.api_logs') is not null then
    execute 'alter table public.api_logs enable row level security';
    execute 'drop policy if exists api_logs_admin_select on public.api_logs';
    execute 'drop policy if exists api_logs_admin_insert on public.api_logs';
    execute 'drop policy if exists api_logs_module_select on public.api_logs';
    execute 'drop policy if exists api_logs_module_insert on public.api_logs';
    execute 'create policy api_logs_module_select on public.api_logs for select to authenticated using (public.is_current_admin() or public.can_access_module(''apis''))';
    execute 'create policy api_logs_module_insert on public.api_logs for insert to authenticated with check (public.is_current_admin() or public.can_access_module(''apis''))';
  end if;

  if to_regclass('public.audit_logs') is not null then
    execute 'alter table public.audit_logs enable row level security';
    execute 'drop policy if exists audit_logs_admin_select on public.audit_logs';
    execute 'drop policy if exists audit_logs_admin_insert on public.audit_logs';
    execute 'drop policy if exists audit_logs_module_select on public.audit_logs';
    execute 'drop policy if exists audit_logs_module_insert on public.audit_logs';
    execute 'create policy audit_logs_module_select on public.audit_logs for select to authenticated using (public.is_current_admin() or public.can_access_module(''activity''))';
    execute 'create policy audit_logs_module_insert on public.audit_logs for insert to authenticated with check (public.is_current_admin() or public.can_access_module(''activity''))';
  end if;
end $$;
