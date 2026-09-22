-- =====================================================================
--  0023 — Niveau (1bac | 2bac) on resources, so annales/content can be
--  managed and shown per niveau. Existing rows default to '2bac'
--  (the national annales already loaded). Run in Supabase → SQL Editor.
-- =====================================================================

alter table resources add column if not exists niveau text not null default '2bac';

alter table resources drop constraint if exists resources_niveau_chk;
alter table resources add constraint resources_niveau_chk check (niveau in ('1bac', '2bac'));

create index if not exists idx_resources_niveau
  on resources(scope, niveau, scope_key, filiere);

update resources set niveau = '2bac' where niveau is null;
