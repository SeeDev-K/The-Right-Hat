create table if not exists public.member_moderation (
  user_id uuid primary key,
  status text not null default 'active',
  reason text,
  updated_at timestamptz not null default now()
);

alter table public.member_moderation enable row level security;

drop policy if exists member_moderation_admin_select on public.member_moderation;
drop policy if exists member_moderation_admin_insert on public.member_moderation;
drop policy if exists member_moderation_admin_update on public.member_moderation;

create policy member_moderation_admin_select
on public.member_moderation
for select
to authenticated
using (public.can_access_module('community'));

create policy member_moderation_admin_insert
on public.member_moderation
for insert
to authenticated
with check (public.can_access_module('community'));

create policy member_moderation_admin_update
on public.member_moderation
for update
to authenticated
using (public.can_access_module('community'))
with check (public.can_access_module('community'));

create or replace function public.member_can_post()
returns boolean
language sql
security definer
set search_path = public
as $$
  select not exists (
    select 1
    from public.member_moderation
    where user_id = auth.uid()
    and status in ('paused', 'banned')
  );
$$;

grant execute on function public.member_can_post() to authenticated;

drop policy if exists community_posts_create on public.community_posts;
drop policy if exists community_replies_create on public.community_replies;

create policy community_posts_create
on public.community_posts
for insert
to authenticated
with check (auth.uid() = user_id and public.member_can_post());

create policy community_replies_create
on public.community_replies
for insert
to authenticated
with check (auth.uid() = user_id and public.member_can_post());

create index if not exists member_moderation_status_idx on public.member_moderation (status);
