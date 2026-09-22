-- =====================================================================
--  0024 — Study layer: per-student "je maîtrise" progress on cours
--  sections. One row per (student, lesson, section). Powers the
--  checkable sommaire circles and the chapter maîtrise %.
--  Run in Supabase → SQL Editor (or applied via MCP).
-- =====================================================================

create table if not exists cours_progress (
  user_id     uuid not null references auth.users(id) on delete cascade,
  lesson_id   uuid not null references lessons(id) on delete cascade,
  section_key text not null,                 -- e.g. 'sec-1'
  mastered    boolean not null default true,
  review      boolean not null default false, -- flagged "à revoir" (spaced repetition, phase 2)
  updated_at  timestamptz not null default now(),
  primary key (user_id, lesson_id, section_key)
);

alter table cours_progress enable row level security;

drop policy if exists cours_progress_rw on cours_progress;
create policy cours_progress_rw on cours_progress for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

grant select, insert, update, delete on cours_progress to authenticated;
