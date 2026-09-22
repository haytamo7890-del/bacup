-- =====================================================================
--  0013 — Bibliothèque: each student's private PDF library.
--  Organized by subject + custom folders. 250 MB per student (enforced
--  by a trigger). Private 'library' storage bucket. Idempotent.
-- =====================================================================

create table if not exists library_folders (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_library_folders_user on library_folders(user_id);

create table if not exists library_files (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  name         text not null,
  subject_code text,                                             -- subject folder (null if in a custom folder)
  folder_id    uuid references library_folders(id) on delete set null,
  storage_path text not null,
  size_bytes   bigint not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists idx_library_files_user on library_files(user_id);

alter table library_folders enable row level security;
alter table library_files   enable row level security;
drop policy if exists own_library_folders on library_folders;
create policy own_library_folders on library_folders for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists own_library_files on library_files;
create policy own_library_files on library_files for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Total bytes used by the current student.
create or replace function library_usage()
returns bigint language sql security definer set search_path = public as $$
  select coalesce(sum(size_bytes), 0) from library_files where user_id = auth.uid();
$$;

-- Backstop: reject inserts that push a student past 250 MB.
create or replace function library_quota_guard()
returns trigger language plpgsql security definer set search_path = public as $$
declare total bigint;
begin
  select coalesce(sum(size_bytes), 0) into total from library_files where user_id = new.user_id;
  if total + new.size_bytes > 250 * 1024 * 1024 then
    raise exception 'Quota Bibliothèque dépassé (250 Mo).';
  end if;
  return new;
end $$;
drop trigger if exists trg_library_quota on library_files;
create trigger trg_library_quota before insert on library_files
  for each row execute function library_quota_guard();

-- Private bucket + own-folder access.
insert into storage.buckets (id, name, public) values ('library', 'library', false)
on conflict (id) do nothing;

do $$
begin
  drop policy if exists library_rw_own on storage.objects;
  create policy library_rw_own on storage.objects for all to authenticated
    using (bucket_id = 'library' and (storage.foldername(name))[1] = auth.uid()::text)
    with check (bucket_id = 'library' and (storage.foldername(name))[1] = auth.uid()::text);
exception when others then
  raise notice 'Could not create library storage policy via SQL (%). Add it in Dashboard → Storage → library.', sqlerrm;
end $$;
