-- =====================================================================
--  0011 — Lesson completions (the "Marquer comme lu" store).
--  Self-healing: works whether the table is absent, or already exists
--  with a legacy shape (e.g. a student_id column instead of user_id).
--  Non-destructive — keeps existing rows. Idempotent.
-- =====================================================================

-- 1) Ensure the table exists (minimal shell if it doesn't).
create table if not exists lesson_completions (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

-- 2) Ensure the columns we need exist.
alter table lesson_completions add column if not exists user_id    uuid;
alter table lesson_completions add column if not exists lesson_id  uuid;
alter table lesson_completions add column if not exists created_at timestamptz not null default now();

-- 3) If a legacy student_id column exists, copy it into user_id.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'lesson_completions' and column_name = 'student_id'
  ) then
    execute 'update lesson_completions set user_id = student_id where user_id is null';
  end if;
end $$;

-- 4) Ensure foreign keys + the unique pair (add only if missing).
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'lesson_completions_user_fk') then
    alter table lesson_completions add constraint lesson_completions_user_fk
      foreign key (user_id) references profiles(id) on delete cascade;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'lesson_completions_lesson_fk') then
    alter table lesson_completions add constraint lesson_completions_lesson_fk
      foreign key (lesson_id) references lessons(id) on delete cascade;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'lesson_completions_uniq') then
    alter table lesson_completions add constraint lesson_completions_uniq unique (user_id, lesson_id);
  end if;
end $$;

-- 5) Index + RLS (own rows only).
create index if not exists idx_lesson_completions_user on lesson_completions(user_id);

alter table lesson_completions enable row level security;
drop policy if exists own_lesson_completions on lesson_completions;
create policy own_lesson_completions on lesson_completions for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 6) Mark a lesson as read for the current student.
create or replace function mark_lesson_read(p_lesson uuid)
returns void
language sql
security definer
set search_path = public
as $$
  insert into lesson_completions (user_id, lesson_id)
  values (auth.uid(), p_lesson)
  on conflict (user_id, lesson_id) do nothing;
$$;
