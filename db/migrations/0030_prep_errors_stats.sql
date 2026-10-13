-- 0030 — Espace de préparation: dashboard surfacing + error journal
--   • my_prep_stats()  → { due, errors, due_by_subject, errors_by_subject } for the home banners
--   • my_errors(p_subject) → the error journal: questions whose LATEST attempt is wrong
--   (record_exam → review queue lives in 0030b, run separately)
-- Idempotent. Applied via Supabase MCP.

-- ---------- error journal ----------
create or replace function my_errors(p_subject text default null)
returns table (
  question_id uuid, subject_code text, chapter_id uuid, chapter_name text, chapter_position int,
  notion text, statement text, from_exam boolean, misses int, last_wrong_at timestamptz,
  due_at timestamptz, box smallint
)
language sql stable security definer set search_path = public as $$
  with latest as (
    select distinct on (a.question_id) a.question_id, a.status, a.created_at
    from attempts a
    where a.student_id = auth.uid()
    order by a.question_id, a.created_at desc
  ), wrong as (
    select l.question_id, l.created_at from latest l where l.status = 'incorrect'
  )
  select q.id, s.code, c.id, c.name, c.position, q.notion, q.statement, (e.exam_id is not null),
         (select count(*)::int from attempts a2 where a2.student_id = auth.uid() and a2.question_id = q.id and a2.status = 'incorrect'),
         w.created_at, r.due_at, r.box
  from wrong w
  join questions q on q.id = w.question_id
  join exercises e on e.id = q.exercise_id
  left join chapters c on c.id = e.chapter_id
  join subjects s on s.id = coalesce(c.subject_id, e.subject_id)
  left join review_items r on r.user_id = auth.uid() and r.question_id = q.id
  where auth.uid() is not null and (p_subject is null or s.code = p_subject)
  order by s.code, c.position nulls last, q.notion nulls last, w.created_at desc;
$$;
revoke all on function my_errors(text) from public, anon;
grant execute on function my_errors(text) to authenticated;

-- ---------- home-screen stats ----------
create or replace function my_prep_stats()
returns jsonb
language sql stable security definer set search_path = public as $$
  with due as (
    select s.code
    from review_items r
    join questions q on q.id = r.question_id
    join exercises e on e.id = q.exercise_id
    left join chapters c on c.id = e.chapter_id
    join subjects s on s.id = coalesce(c.subject_id, e.subject_id)
    where r.user_id = auth.uid() and r.due_at <= now()
  ), err as (
    select subject_code as code from my_errors(null)
  )
  select jsonb_build_object(
    'due', (select count(*) from due),
    'errors', (select count(*) from err),
    'due_by_subject', coalesce((select jsonb_object_agg(code, n) from (select code, count(*) n from due group by code) x), '{}'::jsonb),
    'errors_by_subject', coalesce((select jsonb_object_agg(code, n) from (select code, count(*) n from err group by code) y), '{}'::jsonb)
  )
  where auth.uid() is not null;
$$;
revoke all on function my_prep_stats() from public, anon;
grant execute on function my_prep_stats() to authenticated;

