-- =====================================================================
--  0003 — Sample QCM content (Maths · Probabilités) to test the engine.
--  Safe to run once. Creates 1 chapter, 1 exam, 1 exercise, 3 MCQ
--  questions with options + our own corrections.
-- =====================================================================
do $$
declare
  v_es uuid; v_lvl uuid; v_subj uuid; v_chap uuid; v_exam uuid; v_ex uuid;
  q1 uuid; q2 uuid; q3 uuid;
begin
  select id into v_es from education_systems where code = 'ma_secondaire_qualifiant';
  select id into v_lvl from levels where code = '2bac' and education_system_id = v_es;
  select id into v_subj from subjects where code = 'maths' and education_system_id = v_es;

  insert into chapters (subject_id, level_id, code, name, position)
  values (v_subj, v_lvl, 'proba', 'Probabilités', 1)
  returning id into v_chap;

  insert into exams (education_system_id, level_id, subject_id, exam_type, session, year, title)
  values (v_es, v_lvl, v_subj, 'national', 'normale', 2023, 'BAC National 2023 — Mathématiques')
  returning id into v_exam;

  insert into exercises (subject_id, chapter_id, exam_id, source, difficulty, title)
  values (v_subj, v_chap, v_exam, 'official_exam', 2, 'Probabilités conditionnelles')
  returning id into v_ex;

  -- Q1
  insert into questions (exercise_id, kind, statement, position)
  values (v_ex, 'mcq', 'On tire une carte d''un jeu de 52 cartes. Sachant que la carte est rouge, quelle est la probabilité qu''elle soit un cœur ?', 1)
  returning id into q1;
  insert into answer_options (question_id, label, is_correct, position) values
    (q1, '1/2', true, 1), (q1, '1/4', false, 2), (q1, '1/13', false, 3), (q1, '1/26', false, 4);
  insert into solutions (question_id, author, body) values
    (q1, 'hsgenius', 'P(cœur | rouge) = P(cœur ∩ rouge) / P(rouge). Les cœurs sont rouges, donc cœur ∩ rouge = cœur, soit 13/52. Rouge : 26/52. Donc (13/52) / (26/52) = 13/26 = 1/2.');

  -- Q2
  insert into questions (exercise_id, kind, statement, position)
  values (v_ex, 'mcq', 'Deux événements A et B sont indépendants avec P(A) = 0,3 et P(B) = 0,5. Que vaut P(A ∩ B) ?', 2)
  returning id into q2;
  insert into answer_options (question_id, label, is_correct, position) values
    (q2, '0,15', true, 1), (q2, '0,8', false, 2), (q2, '0,2', false, 3), (q2, '0', false, 4);
  insert into solutions (question_id, author, body) values
    (q2, 'hsgenius', 'Pour deux événements indépendants, P(A ∩ B) = P(A) × P(B) = 0,3 × 0,5 = 0,15.');

  -- Q3
  insert into questions (exercise_id, kind, statement, position)
  values (v_ex, 'mcq', 'Une urne contient 3 boules rouges et 2 vertes. On tire 2 boules sans remise. Probabilité d''obtenir 2 rouges ?', 3)
  returning id into q3;
  insert into answer_options (question_id, label, is_correct, position) values
    (q3, '3/10', true, 1), (q3, '9/25', false, 2), (q3, '6/25', false, 3), (q3, '1/2', false, 4);
  insert into solutions (question_id, author, body) values
    (q3, 'hsgenius', 'Sans remise : 1ère rouge = 3/5, puis 2ème rouge = 2/4. Donc P = (3/5) × (2/4) = 6/20 = 3/10.');
end $$;
