drop policy if exists member_moderation_self_select on public.member_moderation;

create policy member_moderation_self_select
on public.member_moderation
for select
to authenticated
using (auth.uid() = user_id);
