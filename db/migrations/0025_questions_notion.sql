-- =====================================================================
--  0025 — per-notion tagging for QCU questions.
--  Adds questions.notion and tags each maths QCU question with a topic
--  slug (by exam title + position, identical across all filières) so a
--  cours funnel pulls ONLY its notion's exercises. Client resolves a
--  section heading → slug via src/config/notion-map.ts (falls back to the
--  full chapter bank when a heading has no matching slug).
--  Run ONCE in Supabase → SQL Editor.
-- =====================================================================

alter table questions add column if not exists notion text;

-- Suites numériques
update questions q set notion = case q.position
  when 1 then 'arithgeo' when 2 then 'limite' when 3 then 'limite' when 4 then 'convergence'
  when 5 then 'convergence' when 6 then 'limite' when 7 then 'arithgeo' when 8 then 'limite'
  when 9 then 'convergence' when 10 then 'limite' when 11 then 'limite' when 12 then 'arithgeo'
  when 13 then 'arithgeo' when 14 then 'convergence' end
from exercises e join exams x on x.id=e.exam_id
where e.id=q.exercise_id and x.exam_type='blanc'
  and x.subject_id='7d10f167-723e-4764-8df2-ea6371d05b3c' and x.title like 'Suites%';

-- Limites & continuité
update questions q set notion = case q.position
  when 1 then 'limite' when 2 then 'limite' when 3 then 'limite' when 4 then 'continuite'
  when 5 then 'tvi' when 6 then 'limite' when 7 then 'limite' when 8 then 'limite'
  when 9 then 'limite' when 10 then 'limite' when 11 then 'limite' when 12 then 'tvi'
  when 13 then 'limite' when 14 then 'continuite' end
from exercises e join exams x on x.id=e.exam_id
where e.id=q.exercise_id and x.exam_type='blanc'
  and x.subject_id='7d10f167-723e-4764-8df2-ea6371d05b3c' and x.title like 'Limites%';

-- Dérivation & étude de fonctions
update questions q set notion = case q.position
  when 1 then 'derivee' when 2 then 'derivee' when 3 then 'derivee' when 4 then 'derivee'
  when 5 then 'logexp' when 6 then 'logexp' when 7 then 'primitive' when 8 then 'primitive'
  when 9 then 'derivee' when 10 then 'derivee' when 11 then 'derivee' when 12 then 'logexp'
  when 13 then 'primitive' when 14 then 'primitive' end
from exercises e join exams x on x.id=e.exam_id
where e.id=q.exercise_id and x.exam_type='blanc'
  and x.subject_id='7d10f167-723e-4764-8df2-ea6371d05b3c' and x.title like 'Dérivation%';

-- Calcul intégral
update questions q set notion = case q.position
  when 1 then 'calcul' when 2 then 'calcul' when 3 then 'calcul' when 4 then 'application'
  when 5 then 'application' when 6 then 'application' when 7 then 'propriete' when 8 then 'propriete'
  when 9 then 'calcul' when 10 then 'calcul' when 11 then 'calcul' when 12 then 'propriete'
  when 13 then 'propriete' when 14 then 'application' end
from exercises e join exams x on x.id=e.exam_id
where e.id=q.exercise_id and x.exam_type='blanc'
  and x.subject_id='7d10f167-723e-4764-8df2-ea6371d05b3c' and x.title like 'Calcul intégral%';

-- Nombres complexes
update questions q set notion = case q.position
  when 1 then 'forme' when 2 then 'forme' when 3 then 'forme' when 4 then 'equation'
  when 5 then 'trigo' when 6 then 'trigo' when 7 then 'geo' when 8 then 'geo'
  when 9 then 'forme' when 10 then 'forme' when 11 then 'trigo' when 12 then 'equation'
  when 13 then 'geo' when 14 then 'trigo' end
from exercises e join exams x on x.id=e.exam_id
where e.id=q.exercise_id and x.exam_type='blanc'
  and x.subject_id='7d10f167-723e-4764-8df2-ea6371d05b3c' and x.title like 'Nombres complexes%';

-- Structures algébriques
update questions q set notion = case q.position
  when 1 then 'loi' when 2 then 'groupe' when 3 then 'groupe' when 4 then 'groupe'
  when 5 then 'ev' when 6 then 'ev' when 7 then 'ev' when 8 then 'groupe'
  when 9 then 'loi' when 10 then 'groupe' when 11 then 'groupe' when 12 then 'groupe'
  when 13 then 'ev' when 14 then 'ev' end
from exercises e join exams x on x.id=e.exam_id
where e.id=q.exercise_id and x.exam_type='blanc'
  and x.subject_id='7d10f167-723e-4764-8df2-ea6371d05b3c' and x.title like 'Structures%';

-- Arithmétique dans ℤ
update questions q set notion = case q.position
  when 1 then 'divis' when 2 then 'divis' when 3 then 'pgcd' when 4 then 'pgcd'
  when 5 then 'cong' when 6 then 'pgcd' when 7 then 'cong' when 8 then 'cong'
  when 9 then 'pgcd' when 10 then 'cong' when 11 then 'cong' when 12 then 'divis'
  when 13 then 'pgcd' when 14 then 'cong' end
from exercises e join exams x on x.id=e.exam_id
where e.id=q.exercise_id and x.exam_type='blanc'
  and x.subject_id='7d10f167-723e-4764-8df2-ea6371d05b3c' and x.title like 'Arithmétique%';

-- Calcul des probabilités
update questions q set notion = case q.position
  when 1 then 'denom' when 2 then 'proba' when 3 then 'proba' when 4 then 'proba'
  when 5 then 'varia' when 6 then 'varia' when 7 then 'varia' when 8 then 'varia'
  when 9 then 'denom' when 10 then 'proba' when 11 then 'proba' when 12 then 'varia'
  when 13 then 'proba' when 14 then 'denom' end
from exercises e join exams x on x.id=e.exam_id
where e.id=q.exercise_id and x.exam_type='blanc'
  and x.subject_id='7d10f167-723e-4764-8df2-ea6371d05b3c' and x.title like 'Calcul des probabilités%';
