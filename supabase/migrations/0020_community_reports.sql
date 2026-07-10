create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid not null,
  target_type text not null check (target_type in ('post', 'reply')),
  target_id uuid not null,
  reason text not null default 'Reported by community member',
  status text not null default 'open' check (status in ('open', 'reviewed', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.community_reports enable row level security;

drop policy if exists community_reports_member_create on public.community_reports;
drop policy if exists community_reports_self_select on public.community_reports;
drop policy if exists community_reports_staff_select on public.community_reports;
drop policy if exists community_reports_staff_update on public.community_reports;

create policy community_reports_member_create
on public.community_reports
for insert
to authenticated
with check (auth.uid() = reporter_user_id);

create policy community_reports_self_select
on public.community_reports
for select
to authenticated
using (auth.uid() = reporter_user_id);

create policy community_reports_staff_select
on public.community_reports
for select
to authenticated
using (public.can_access_module('community'));

create policy community_reports_staff_update
on public.community_reports
for update
to authenticated
using (public.can_access_module('community'))
with check (public.can_access_module('community'));

create index if not exists community_reports_status_idx on public.community_reports (status);
create index if not exists community_reports_target_idx on public.community_reports (target_type, target_id);
create index if not exists community_reports_created_at_idx on public.community_reports (created_at desc);
