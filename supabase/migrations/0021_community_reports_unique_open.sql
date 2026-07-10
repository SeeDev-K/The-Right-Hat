create unique index if not exists community_reports_unique_open_target_reporter_idx
on public.community_reports (reporter_user_id, target_type, target_id)
where status in ('open', 'reviewed');
