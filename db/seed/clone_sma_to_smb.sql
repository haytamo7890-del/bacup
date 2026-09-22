-- =====================================================================
--  Clone the full SM-A maths content (cours lessons + QCU exams) to SM-B.
--  SM-A and SM-B share the exact same maths programme, so we duplicate.
--  Chapters for both tracks already exist (same codes). Run ONCE in
--  Supabase → SQL Editor. Idempotent guards prevent double-insertion.
-- =====================================================================

do $$
declare
  subj uuid := '7d10f167-723e-4764-8df2-ea6371d05b3c';  -- subjects.code = 'maths'
  sma  uuid := 'dfad244d-1da5-4b16-91d1-f085cd0f1bbf';  -- track sm_a
  smb  uuid := '7434574e-e9b5-4850-96e6-da033d4f7813';  -- track sm_b
  r_ex record; r_exc record; r_q record;
  new_ex uuid; new_exc uuid; new_q uuid; cb_id uuid;
begin
  -- 1) Clone lessons (cours + fiches) into the matching SM-B chapters (by code)
  insert into lessons (chapter_id, title, body, kind, position)
  select cb.id, l.title, l.body, l.kind, l.position
  from lessons l
  join chapters ca on ca.id = l.chapter_id and ca.track_id = sma and ca.subject_id = subj
  join chapters cb on cb.code = ca.code and cb.track_id = smb and cb.subject_id = subj
  where not exists (
    select 1 from lessons l2 where l2.chapter_id = cb.id and l2.position = l.position
  );

  -- 2) Clone the QCU exams (blanc) with their exercises/questions/options/solutions
  for r_ex in
    select * from exams
    where subject_id = subj and track_id = sma and exam_type = 'blanc'
      and not exists (
        select 1 from exams e2 where e2.subject_id = subj and e2.track_id = smb and e2.title = exams.title
      )
  loop
    insert into exams (education_system_id, level_id, subject_id, track_id, exam_type, session, year, title, duration_minutes)
    values (r_ex.education_system_id, r_ex.level_id, r_ex.subject_id, smb, r_ex.exam_type, r_ex.session, r_ex.year, r_ex.title, r_ex.duration_minutes)
    returning id into new_ex;

    for r_exc in select * from exercises where exam_id = r_ex.id loop
      select cb.id into cb_id
      from chapters ca join chapters cb on cb.code = ca.code and cb.track_id = smb and cb.subject_id = subj
      where ca.id = r_exc.chapter_id;

      insert into exercises (subject_id, chapter_id, exam_id, source, title, statement, position)
      values (r_exc.subject_id, cb_id, new_ex, r_exc.source, r_exc.title, r_exc.statement, r_exc.position)
      returning id into new_exc;

      for r_q in select * from questions where exercise_id = r_exc.id loop
        insert into questions (exercise_id, kind, statement, points, position)
        values (new_exc, r_q.kind, r_q.statement, r_q.points, r_q.position)
        returning id into new_q;

        insert into answer_options (question_id, label, is_correct, position)
        select new_q, label, is_correct, position from answer_options where question_id = r_q.id;

        insert into solutions (question_id, author, body)
        select new_q, author, body from solutions where question_id = r_q.id;
      end loop;
    end loop;
  end loop;
end $$;

-- Verification (optional): should show 8 chapters populated for SM-B
-- select c.name, (select count(*) from lessons l where l.chapter_id=c.id) lessons
-- from chapters c where c.subject_id='7d10f167-723e-4764-8df2-ea6371d05b3c'
--   and c.track_id='7434574e-e9b5-4850-96e6-da033d4f7813' order by c.position;
