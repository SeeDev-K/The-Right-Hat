create or replace function public.current_admin_role()
returns text
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (
      select role
      from public.admin_profiles
      where user_id = auth.uid()
      limit 1
    ),
    (
      select role
      from public.team_members
      where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and status = 'active'
      limit 1
    )
  );
$$;

create or replace function public.can_access_module(required_module text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid()
  )
  or exists (
    select 1
    from public.team_members
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and status = 'active'
    and (
      role in ('owner', 'admin')
      or required_module = any(modules)
    )
  );
$$;

grant execute on function public.current_admin_role() to authenticated;
grant execute on function public.can_access_module(text) to authenticated;

drop policy if exists team_members_self_or_admin_select on public.team_members;
create policy team_members_self_or_admin_select
on public.team_members
for select
to authenticated
using (
  public.is_current_admin()
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);
