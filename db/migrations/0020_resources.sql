-- =====================================================================
--  0020 — Admin-uploaded resources (PDF/images) for cours & examens.
--  Admins attach files to a subject, chapter, or exam; students can view
--  them. Files live in a public 'resources' storage bucket; the table
--  indexes them. Run in Supabase → SQL Editor.
-- =====================================================================

create table if not exists resources (
  id           uuid primary key default gen_random_uuid(),
  scope        text not null check (scope in ('subject', 'chapter', 'exam')),
  scope_key    text not null,                 -- subject_code | chapter_id | exam_id
  name         text not null,
  storage_path text not null,
  size_bytes   bigint not null default 0,
  created_by   uuid,
  created_at   timestamptz not null default now()
);
create index if not exists idx_resources_scope on resources(scope, scope_key);

alter table resources enable row level security;

-- public read (it's course content), admin-only write.
drop policy if exists resources_read on resources;
create policy resources_read on resources for select to anon, authenticated using (true);

drop policy if exists resources_admin_write on resources;
create policy resources_admin_write on resources for all to authenticated
  using      (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

grant select on resources to anon, authenticated;
grant insert, delete on resources to authenticated;

-- Public storage bucket for the files.
insert into storage.buckets (id, name, public) values ('resources', 'resources', true)
  on conflict (id) do nothing;

drop policy if exists resources_obj_read on storage.objects;
create policy resources_obj_read on storage.objects for select to anon, authenticated
  using (bucket_id = 'resources');

drop policy if exists resources_obj_write on storage.objects;
create policy resources_obj_write on storage.objects for insert to authenticated
  with check (bucket_id = 'resources' and exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

drop policy if exists resources_obj_del on storage.objects;
create policy resources_obj_del on storage.objects for delete to authenticated
  using (bucket_id = 'resources' and exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
