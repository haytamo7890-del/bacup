-- 0030b — record_exam(): wrong answers in full exams also feed the review queue (Leitner),
-- exactly like record_practice (miss → box 0 due now; hit on a queued item climbs a box,
-- box 4 = learnt → removed). Also returns review_due. Everything else unchanged.
-- Run in the Supabase SQL editor (the MCP needs an approval for replacing a live function).

drop function if exists public.zz_probe();  -- leftover connectivity probe, harmless

create or replace function public.record_exam(p_answers jsonb)
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v_student uuid := auth.uid();
  el jsonb;
  v_qid uuid;
  v_correct boolean;
  v_points numeric;
  v_earned int := 0;
  v_today date := current_date;
  rec record;
begin
  if v_student is null then
    raise exception 'not authenticated';
  end if;

  -- 1) one attempt row per answered question + tally XP
  for el in select * from jsonb_array_elements(p_answers)
  loop
    v_qid := (el->>'question_id')::uuid;
    v_correct := coalesce((el->>'is_correct')::boolean, false);
    select points into v_points from public.questions where id = v_qid;
    insert into public.attempts (student_id, question_id, status, score)
    values (
      v_student, v_qid,
      case when v_correct then 'correct'::attempt_status else 'incorrect'::attempt_status end,
      case when v_correct then coalesce(v_points, 1) else 0 end
    );
    v_earned := v_earned + case when v_correct then 10 else 1 end;
  end loop;

  -- 1b) review queue (same Leitner rules as record_practice)
  with ans as (
    select distinct on ((x->>'question_id')::uuid) (x->>'question_id')::uuid qid, coalesce((x->>'is_correct')::boolean, false) ok
    from jsonb_array_elements(p_answers) x
    where exists (select 1 from public.questions q where q.id = (x->>'question_id')::uuid)
  )
  insert into public.review_items (user_id, question_id, box, due_at, lapses, updated_at)
  select v_student, qid, 0, now(), 1, now() from ans where not ok
  on conflict (user_id, question_id) do update
    set box = 0, due_at = now(), lapses = public.review_items.lapses + 1, updated_at = now();
  update public.review_items r set box = r.box + 1,
         due_at = now() + (case r.box + 1 when 1 then interval '1 day' when 2 then interval '3 days' else interval '7 days' end),
         updated_at = now()
    from jsonb_array_elements(p_answers) x
   where coalesce((x->>'is_correct')::boolean, false)
     and r.user_id = v_student and r.question_id = (x->>'question_id')::uuid;
  delete from public.review_items where user_id = v_student and box >= 4;

  -- 2) recompute chapter_mastery per affected chapter
  for rec in
    select ex.chapter_id as chapter_id,
           count(*) as n_total,
           count(*) filter (where coalesce((el2->>'is_correct')::boolean, false)) as n_correct
    from jsonb_array_elements(p_answers) el2
    join public.questions q on q.id = (el2->>'question_id')::uuid
    join public.exercises ex on ex.id = q.exercise_id
    where ex.chapter_id is not null
    group by ex.chapter_id
  loop
    insert into public.chapter_mastery
      (student_id, chapter_id, attempts_count, correct_count, mastery_pct, last_practiced_at, updated_at)
    values
      (v_student, rec.chapter_id, rec.n_total, rec.n_correct,
       round(rec.n_correct::numeric / rec.n_total * 100, 1), now(), now())
    on conflict (student_id, chapter_id) do update
    set attempts_count = public.chapter_mastery.attempts_count + excluded.attempts_count,
        correct_count  = public.chapter_mastery.correct_count + excluded.correct_count,
        mastery_pct    = round(
          (public.chapter_mastery.correct_count + excluded.correct_count)::numeric
          / (public.chapter_mastery.attempts_count + excluded.attempts_count) * 100, 1),
        last_practiced_at = now(),
        updated_at = now();
  end loop;

  -- 3) XP event
  insert into public.xp_events (student_id, kind, amount)
  values (v_student, 'exam', v_earned);

  -- 4) streak
  insert into public.streaks (student_id, current_days, longest_days, last_active_on)
  values (v_student, 1, 1, v_today)
  on conflict (student_id) do update
  set current_days = case
        when public.streaks.last_active_on = v_today then public.streaks.current_days
        when public.streaks.last_active_on = v_today - 1 then public.streaks.current_days + 1
        else 1 end,
      longest_days = greatest(public.streaks.longest_days,
        case
          when public.streaks.last_active_on = v_today then public.streaks.current_days
          when public.streaks.last_active_on = v_today - 1 then public.streaks.current_days + 1
          else 1 end),
      last_active_on = v_today;

  return jsonb_build_object(
    'earned', v_earned,
    'total_xp', (select coalesce(sum(amount), 0) from public.xp_events where student_id = v_student),
    'streak', (select current_days from public.streaks where student_id = v_student),
    'review_due', (select count(*) from public.review_items where user_id = v_student and due_at <= now())
  );
end;
$function$;
