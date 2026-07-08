drop policy if exists community_posts_moderator_read on public.community_posts;
drop policy if exists community_posts_moderator_update on public.community_posts;
drop policy if exists community_replies_moderator_read on public.community_replies;
drop policy if exists community_replies_moderator_update on public.community_replies;

create policy community_posts_moderator_read
on public.community_posts
for select
to authenticated
using (public.can_access_module('community'));

create policy community_posts_moderator_update
on public.community_posts
for update
to authenticated
using (public.can_access_module('community'))
with check (public.can_access_module('community'));

create policy community_replies_moderator_read
on public.community_replies
for select
to authenticated
using (public.can_access_module('community'));

create policy community_replies_moderator_update
on public.community_replies
for update
to authenticated
using (public.can_access_module('community'))
with check (public.can_access_module('community'));
