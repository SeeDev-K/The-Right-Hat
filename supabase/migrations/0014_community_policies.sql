alter table public.community_posts enable row level security;
alter table public.community_replies enable row level security;

drop policy if exists community_posts_read on public.community_posts;
drop policy if exists community_posts_create on public.community_posts;
drop policy if exists community_replies_read on public.community_replies;
drop policy if exists community_replies_create on public.community_replies;

create policy community_posts_read
on public.community_posts
for select
to anon, authenticated
using (status = 'published');

create policy community_posts_create
on public.community_posts
for insert
to authenticated
with check (auth.uid() = user_id);

create policy community_replies_read
on public.community_replies
for select
to anon, authenticated
using (status = 'published');

create policy community_replies_create
on public.community_replies
for insert
to authenticated
with check (auth.uid() = user_id);
