alter table public.content_items add column if not exists slug text;
alter table public.content_items add column if not exists summary text;

create unique index if not exists content_items_kind_slug_unique
on public.content_items (kind, slug)
where slug is not null;
