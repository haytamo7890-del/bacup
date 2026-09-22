-- =====================================================================
--  0015 — Personalization quiz answers (post-signup funnel).
--  Stored on the student profile to power the dashboard goal + AI coach.
--  Idempotent. RLS already covers student_profiles (own row only).
-- =====================================================================
alter table student_profiles add column if not exists target_note numeric(4,2);
alter table student_profiles add column if not exists ambition    text;
alter table student_profiles add column if not exists consistency text;
alter table student_profiles add column if not exists blocker     text;
alter table student_profiles add column if not exists quiz_done   boolean not null default false;
