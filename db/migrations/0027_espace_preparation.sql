-- =====================================================================
--  0027 — Espace de préparation: séries (curated QCU sets) + progress,
--  and record_practice() — the prep counterpart of record_exam().
--
--  Taxonomy is REUSED (subject → chapter → lesson "##" notion); séries
--  are just ordered lists of existing questions. Same progress/XP model
--  as the exam engine: attempts + chapter_mastery + xp_events + streaks.
--  Additive only — record_exam() is untouched.
--  Run in Supabase → SQL Editor (idempotent).
-- =====================================================================

-- ---------- séries ----------
create table if not exists series (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique,                              -- stable key for idempotent seeds
  subject_id   uuid not null references subjects(id) on delete cascade,
  level_id     uuid references levels(id) on delete cascade,
  track_id     uuid references tracks(id) on delete cascade, -- null = all filières of the level
  chapter_id   uuid references chapters(id) on delete cascade, -- null = cross-chapter série
  unit         text,                                     -- cross-chapter grouping (chapters.unit)
  kind         text not null default 'chapitre' check (kind in ('chapitre','unite','mixte','custom')),
  title        text not null,
  description  text,
  difficulty   smallint not null default 1 check (difficulty between 1 and 3),
  position     int not null default 0,
  xp_bonus     int not null default 30,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);
create index if not exists series_subject_idx on series(subject_id, level_id);
create index if not exists series_chapter_idx on series(chapter_id);

create table if not exists series_items (
  series_id   uuid not null references series(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  position    int not null default 0,
  primary key (series_id, question_id)
);
create index if not exists series_items_q_idx on series_items(question_id);

create table if not exists series_progress (
  user_id        uuid not null references auth.users(id) on delete cascade,
  series_id      uuid not null references series(id) on delete cascade,
  attempts_count int not null default 0,
  best_pct       numeric not null default 0,
  last_pct       numeric not null default 0,
  completed_at   timestamptz,                 -- first run ≥ 70% (unlocks xp_bonus once)
  updated_at     timestamptz not null default now(),
  primary key (user_id, series_id)
);

alter table series          enable row level security;
alter table series_items    enable row level security;
alter table series_progress enable row level security;

drop policy if exists series_read on series;
create policy series_read on series for select using (is_published or is_admin());
drop policy if exists series_admin on series;
create policy series_admin on series for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists series_items_read on series_items;
create policy series_items_read on series_items for select using (true);
drop policy if exists series_items_admin on series_items;
create policy series_items_admin on series_items for all to authenticated using (is_admin()) with check (is_admin());

-- progress is written only through record_practice(); students read their own rows.
drop policy if exists series_progress_own on series_progress;
create policy series_progress_own on series_progress for select to authenticated using (user_id = auth.uid());

grant select on series, series_items to anon, authenticated;
grant insert, update, delete on series, series_items to authenticated;  -- RLS: admins only
grant select on series_progress to authenticated;

-- ---------- record_practice ----------
-- p_answers: [{ "question_id": uuid, "option_id": uuid }]  (correctness computed server-side)
-- p_kind:    'notion' | 'serie'
-- p_series:  série id when p_kind = 'serie'
create or replace function record_practice(p_answers jsonb, p_kind text, p_series uuid default null)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_student uuid := auth.uid();
  v_today   date := current_date;
  v_earned  int := 0;
  v_bonus   int := 0;
  v_total   int := 0;
  v_correct int := 0;
  v_pct     numeric := 0;
  v_first   boolean := false;
  v_rows    int := 0;
  v_q       uuid[];
  v_ok      boolean[];
  rec record;
begin
  if v_student is null then raise exception 'not authenticated'; end if;
  if p_kind not in ('notion','serie') then raise exception 'bad kind'; end if;
  if jsonb_typeof(p_answers) <> 'array' or jsonb_array_length(p_answers) = 0 then
    return jsonb_build_object('earned', 0, 'bonus', 0);
  end if;
  if jsonb_array_length(p_answers) > 80 then raise exception 'too many answers'; end if;
  if p_kind = 'serie' and (p_series is null or not exists (select 1 from series where id = p_series and is_published)) then
    raise exception 'unknown série';
  end if;

  -- 1) attempts (correctness from answer_options, never trusted from the client)
  select coalesce(array_agg(a.qid), '{}'), coalesce(array_agg(a.ok), '{}') into v_q, v_ok
  from (
    select distinct on (x.qid) x.qid,
           exists (select 1 from answer_options o where o.question_id = x.qid and o.id = x.oid and o.is_correct) ok
    from (select (el->>'question_id')::uuid qid, nullif(el->>'option_id','')::uuid oid
          from jsonb_array_elements(p_answers) el) x
    join questions q on q.id = x.qid
  ) a;

  for rec in select u.qid, u.ok, q.points from unnest(v_q, v_ok) as u(qid, ok) join questions q on q.id = u.qid loop
    insert into attempts (student_id, question_id, status, score)
    values (v_student, rec.qid,
            case when rec.ok then 'correct'::attempt_status else 'incorrect'::attempt_status end,
            case when rec.ok then coalesce(rec.points,1) else 0 end);
    v_earned := v_earned + case when rec.ok then 10 else 1 end;
  end loop;

  -- 2) chapter_mastery (identical rule to record_exam)
  for rec in
    select ex.chapter_id, count(*) n_total, count(*) filter (where p.ok) n_correct
    from unnest(v_q, v_ok) as p(qid, ok) join questions q on q.id = p.qid join exercises ex on ex.id = q.exercise_id
    where ex.chapter_id is not null group by ex.chapter_id
  loop
    insert into chapter_mastery (student_id, chapter_id, attempts_count, correct_count, mastery_pct, last_practiced_at, updated_at)
    values (v_student, rec.chapter_id, rec.n_total, rec.n_correct, round(rec.n_correct::numeric / rec.n_total * 100, 1), now(), now())
    on conflict (student_id, chapter_id) do update
    set attempts_count = chapter_mastery.attempts_count + excluded.attempts_count,
        correct_count  = chapter_mastery.correct_count + excluded.correct_count,
        mastery_pct    = round((chapter_mastery.correct_count + excluded.correct_count)::numeric
                               / (chapter_mastery.attempts_count + excluded.attempts_count) * 100, 1),
        last_practiced_at = now(), updated_at = now();
  end loop;

  -- 3) série progress + one-time completion bonus
  if p_kind = 'serie' then
    select count(*) into v_total from series_items where series_id = p_series;
    select count(*) into v_correct from unnest(v_q, v_ok) as p(qid, ok) join series_items si on si.question_id = p.qid and si.series_id = p_series where p.ok;
    v_pct := case when v_total > 0 then round(v_correct::numeric / v_total * 100, 1) else 0 end;

    insert into series_progress (user_id, series_id, attempts_count, best_pct, last_pct, updated_at)
    values (v_student, p_series, 1, v_pct, v_pct, now())
    on conflict (user_id, series_id) do update
    set attempts_count = series_progress.attempts_count + 1,
        best_pct = greatest(series_progress.best_pct, excluded.best_pct),
        last_pct = excluded.last_pct, updated_at = now();

    if v_pct >= 70 then
      update series_progress set completed_at = now()
       where user_id = v_student and series_id = p_series and completed_at is null;
      get diagnostics v_rows = row_count;
      v_first := v_rows > 0;
      if v_first then select xp_bonus into v_bonus from series where id = p_series; end if;
    end if;
  end if;

  -- 4) XP
  insert into xp_events (student_id, kind, amount)
  values (v_student, case when p_kind = 'serie' then 'prep_serie' else 'prep_notion' end, v_earned);
  if coalesce(v_bonus,0) > 0 then
    insert into xp_events (student_id, kind, amount) values (v_student, 'serie_bonus', v_bonus);
  end if;

  -- 5) streak (identical rule to record_exam)
  insert into streaks (student_id, current_days, longest_days, last_active_on)
  values (v_student, 1, 1, v_today)
  on conflict (student_id) do update
  set current_days = case
        when streaks.last_active_on = v_today then streaks.current_days
        when streaks.last_active_on = v_today - 1 then streaks.current_days + 1
        else 1 end,
      longest_days = greatest(streaks.longest_days, case
        when streaks.last_active_on = v_today then streaks.current_days
        when streaks.last_active_on = v_today - 1 then streaks.current_days + 1
        else 1 end),
      last_active_on = v_today;

  return jsonb_build_object(
    'earned', v_earned, 'bonus', coalesce(v_bonus,0), 'pct', v_pct, 'first_completion', v_first,
    'total_xp', (select coalesce(sum(amount),0) from xp_events where student_id = v_student),
    'streak',   (select current_days from streaks where student_id = v_student));
end;
$$;

revoke all on function record_practice(jsonb, text, uuid) from public, anon;
grant execute on function record_practice(jsonb, text, uuid) to authenticated;
