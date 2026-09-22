-- =====================================================================
--  0021 — Filière / year / session metadata on resources.
--  Annales (subject-scoped sujets) are named
--    Sujet-<matiere>-<filiere>-<year>-<session>.pdf
--  These columns let the app browse annales per filière (like Cours),
--  sort by year, and label each sujet. Backfilled from storage_path.
--  Run in Supabase → SQL Editor (or applied via MCP).
-- =====================================================================

alter table resources add column if not exists filiere text;   -- sm | smb | pc | svt (null = shared / n/a)
alter table resources add column if not exists year    int;
alter table resources add column if not exists session text;   -- 'normale' | 'rattrapage'

create index if not exists idx_resources_subject_filiere
  on resources(scope, scope_key, filiere);

-- Backfill from the canonical filename in storage_path.
update resources set
  filiere = lower((regexp_match(storage_path, 'Sujet-[a-z]+-([a-z]+)-\d{4}-(?:normale|rattrapage)'))[1]),
  year    = (regexp_match(storage_path, 'Sujet-[a-z]+-[a-z]+-(\d{4})-'))[1]::int,
  session = lower((regexp_match(storage_path, '-(normale|rattrapage)'))[1])
where scope = 'subject'
  and storage_path ~ 'Sujet-[a-z]+-[a-z]+-\d{4}-(normale|rattrapage)';
