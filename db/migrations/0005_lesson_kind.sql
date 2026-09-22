-- =====================================================================
--  0005 — Lesson kind: split each chapter's content into "cours" (full)
--  and "resume" (condensed key-points). Existing rows default to 'cours'.
--  Safe to run once (idempotent).
-- =====================================================================
alter table lessons
  add column if not exists kind text not null default 'cours';

-- Guard the allowed values (drop-then-add so re-runs stay clean).
alter table lessons drop constraint if exists lessons_kind_chk;
alter table lessons
  add constraint lessons_kind_chk check (kind in ('cours', 'resume'));

create index if not exists idx_lessons_chapter_kind
  on lessons (chapter_id, kind, position);
