-- =====================================================================
--  0022 — Corrigés. A resource is now a 'sujet' or a 'corrige'; a sujet
--  and its corrigé share (scope_key, filiere, year, session). Files:
--    Sujet-<matiere>-<filiere>-<year>-<session>.pdf
--    Corrige-<matiere>-<filiere>-<year>-<session>.pdf
--  Existing rows default to 'sujet'. Run in Supabase → SQL Editor.
-- =====================================================================

alter table resources add column if not exists kind text not null default 'sujet';

alter table resources drop constraint if exists resources_kind_chk;
alter table resources add constraint resources_kind_chk check (kind in ('sujet', 'corrige'));

create index if not exists idx_resources_exam
  on resources(scope, scope_key, filiere, year, session, kind);

update resources set kind = 'sujet' where kind is null;
