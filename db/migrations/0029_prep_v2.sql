-- =====================================================================
--  0029 — Espace de préparation v2
--   • Guided BAC problems: exercises.kind ('qcu' | 'probleme'), figure, origin (source trace)
--   • Richer questions: hint, methode, difficulty, part (e.g. "Partie A")
--   • Per-option feedback: answer_options.why ("erreur fréquente" / why it's right)
--   • Smart review ("À revoir"): review_items = Leitner boxes, fed by record_practice()
--   • import_prep_pack v2: format bacup.prep/v2 (v1 still accepted), "tracks": [...] to
--     import one pack into several filières, "_todo": true / TODO placeholders are skipped.
--  Additive; record_exam() untouched. Run in Supabase SQL editor (idempotent).
-- =====================================================================

alter table exercises add column if not exists kind text not null default 'qcu';
alter table exercises drop constraint if exists exercises_kind_chk;
alter table exercises add constraint exercises_kind_chk check (kind in ('qcu','probleme'));
alter table exercises add column if not exists figure text;          -- [[fig:NAME]] of src/components/course/figures.tsx
alter table exercises add column if not exists origin jsonb;         -- {"type":"annale","ref":"pc-svt-2023-normale","exercise":"Ex 2","reexpressed":true} | {"type":"original"}

alter table questions add column if not exists hint text;
alter table questions add column if not exists methode text;
alter table questions add column if not exists difficulty smallint;
alter table questions add column if not exists part text;

alter table answer_options add column if not exists why text;

-- ---------- smart review (Leitner) ----------
create table if not exists review_items (
  user_id     uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  box         smallint not null default 0,          -- 0 = due now … 4 = learnt (row deleted)
  due_at      timestamptz not null default now(),
  lapses      int not null default 1,
  updated_at  timestamptz not null default now(),
  primary key (user_id, question_id)
);
create index if not exists review_items_due_idx on review_items(user_id, due_at);
alter table review_items enable row level security;
drop policy if exists review_items_own on review_items;
create policy review_items_own on review_items for select to authenticated using (user_id = auth.uid());
grant select on review_items to authenticated;

-- ---------- record_practice v2 (adds review queue + 'review' kind) ----------
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
  if p_kind not in ('notion','serie','review') then raise exception 'bad kind'; end if;
  if jsonb_typeof(p_answers) <> 'array' or jsonb_array_length(p_answers) = 0 then
    return jsonb_build_object('earned', 0, 'bonus', 0);
  end if;
  if jsonb_array_length(p_answers) > 80 then raise exception 'too many answers'; end if;
  if p_kind = 'serie' and (p_series is null or not exists (select 1 from series where id = p_series and is_published)) then
    raise exception 'unknown série';
  end if;

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

  -- review queue: a miss (re)enters box 0 (due now); a hit on a queued item climbs a box
  -- (1 → +1 day, 2 → +3 days, 3 → +7 days, 4 → learnt: removed)
  insert into review_items (user_id, question_id, box, due_at, lapses, updated_at)
  select v_student, u.qid, 0, now(), 1, now() from unnest(v_q, v_ok) as u(qid, ok) where not u.ok
  on conflict (user_id, question_id) do update
    set box = 0, due_at = now(), lapses = review_items.lapses + 1, updated_at = now();
  update review_items r set box = r.box + 1,
         due_at = now() + (case r.box + 1 when 1 then interval '1 day' when 2 then interval '3 days' else interval '7 days' end),
         updated_at = now()
    from unnest(v_q, v_ok) as u(qid, ok)
   where u.ok and r.user_id = v_student and r.question_id = u.qid;
  delete from review_items where user_id = v_student and box >= 4;

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

  insert into xp_events (student_id, kind, amount)
  values (v_student, case p_kind when 'serie' then 'prep_serie' when 'review' then 'prep_review' else 'prep_notion' end, v_earned);
  if coalesce(v_bonus,0) > 0 then
    insert into xp_events (student_id, kind, amount) values (v_student, 'serie_bonus', v_bonus);
  end if;

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
    'streak',   (select current_days from streaks where student_id = v_student),
    'review_due', (select count(*) from review_items where user_id = v_student and due_at <= now()));
end;
$$;
revoke all on function record_practice(jsonb, text, uuid) from public, anon;
grant execute on function record_practice(jsonb, text, uuid) to authenticated;

-- ---------- import_prep_pack v2 ----------
create or replace function import_prep_pack(p_pack jsonb, p_dry_run boolean default true)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_errors   jsonb := '[]';
  v_warnings jsonb := '[]';
  v_stats    jsonb := jsonb_build_object('exercises_created',0,'exercises_updated',0,'questions_created',0,
                                          'questions_updated',0,'series_created',0,'series_updated',0,'series_items',0,'skipped_todo',0);
  v_level uuid; v_subject uuid; v_track uuid; v_tcode text;
  v_tracks text[];
  v_sfx text;
  ex jsonb; q jsonb; o jsonb; s jsonb; r jsonb;
  v_ch uuid; v_ex uuid; v_q uuid; v_s uuid;
  v_ok boolean; v_correct int; v_nopt int; v_ncorrect int;
  i int; j int; k int; v_path text; v_tp text;
  v_chname text; v_kind text; v_ref text; v_qref text;
  v_bump constant text := 'bacup_rollback';
begin
  if not (is_admin() or coalesce(auth.role(),'') = 'service_role' or (auth.uid() is null and coalesce(auth.role(),'') = '')) then
    raise exception 'forbidden: admin only';
  end if;
  if coalesce(p_pack->>'format','') not in ('bacup.prep/v1','bacup.prep/v2') then
    return jsonb_build_object('ok', false, 'errors', jsonb_build_array('format doit valoir "bacup.prep/v2" (ou v1)'));
  end if;

  select id into v_level   from levels   where code = p_pack->>'level';
  select id into v_subject from subjects where code = p_pack->>'subject';
  if v_level is null   then v_errors := v_errors || to_jsonb('level inconnu: ' || coalesce(p_pack->>'level','∅')); end if;
  if v_subject is null then v_errors := v_errors || to_jsonb('subject inconnu: ' || coalesce(p_pack->>'subject','∅')); end if;

  -- filières: "tracks": ["sm_a","sm_b"]  |  "track": "pc"  |  null = shared chapters
  if jsonb_typeof(p_pack->'tracks') = 'array' and jsonb_array_length(p_pack->'tracks') > 0 then
    select array_agg(x) into v_tracks from jsonb_array_elements_text(p_pack->'tracks') x;
  else
    v_tracks := array[nullif(p_pack->>'track','')];
  end if;
  foreach v_tcode in array v_tracks loop
    if v_tcode is not null and not exists (select 1 from tracks where code = v_tcode) then
      v_errors := v_errors || to_jsonb('track inconnu: ' || v_tcode);
    end if;
  end loop;
  if jsonb_array_length(v_errors) > 0 then
    return jsonb_build_object('ok', false, 'errors', v_errors, 'warnings', v_warnings, 'stats', v_stats, 'dry_run', p_dry_run);
  end if;

  begin
  foreach v_tcode in array v_tracks loop
    v_track := null;
    if v_tcode is not null then select id into v_track from tracks where code = v_tcode; end if;
    v_sfx := case when array_length(v_tracks,1) > 1 then '@' || coalesce(v_tcode,'commun') else '' end;
    v_tp := case when array_length(v_tracks,1) > 1 then '[' || coalesce(v_tcode,'commun') || '] ' else '' end;

    -- ---------- exercises ----------
    i := 0;
    for ex in select * from jsonb_array_elements(coalesce(p_pack->'exercises','[]')) loop
      i := i + 1; v_path := v_tp || 'exercises[' || i || ']';
      if coalesce((ex->>'_todo')::boolean, false) then
        v_stats := jsonb_set(v_stats, '{skipped_todo}', to_jsonb((v_stats->>'skipped_todo')::int + 1)); continue;
      end if;
      select c.id, c.name into v_ch, v_chname from chapters c
       where c.subject_id = v_subject and c.level_id = v_level
         and (c.track_id = v_track or c.track_id is null)
         and (lower(c.code) = lower(ex->>'chapter') or lower(c.name) = lower(ex->>'chapter'))
       order by (c.track_id is null) limit 1;
      if v_ch is null then
        v_errors := v_errors || to_jsonb(v_path || ': chapitre introuvable "' || coalesce(ex->>'chapter','∅') || '"'); continue;
      end if;
      v_kind := coalesce(nullif(ex->>'kind',''), 'qcu');
      if v_kind not in ('qcu','probleme') then v_errors := v_errors || to_jsonb(v_path || ': kind doit être "qcu" ou "probleme"'); continue; end if;
      if jsonb_typeof(ex->'questions') is distinct from 'array' or jsonb_array_length(ex->'questions') = 0 then
        v_errors := v_errors || to_jsonb(v_path || ': "questions" vide'); continue;
      end if;
      if v_kind = 'probleme' and coalesce(btrim(ex->>'context'),'') = '' then
        v_warnings := v_warnings || to_jsonb(v_path || ': problème sans "context" (énoncé commun)');
      end if;

      v_ref := nullif(ex->>'ref','') || v_sfx;
      v_ex := null;
      if v_ref is not null then select id into v_ex from exercises where ref = v_ref; end if;
      if v_ex is null and v_sfx = '' and (ex->>'id') ~* '^[0-9a-f-]{36}$' then select id into v_ex from exercises where id = (ex->>'id')::uuid; end if;
      if v_ex is null and v_ref is null and nullif(ex->>'title','') is not null then
        select id into v_ex from exercises where chapter_id = v_ch and title = ex->>'title' and exam_id is null limit 1;
      end if;
      if v_ex is null then
        insert into exercises (subject_id, chapter_id, source, difficulty, title, statement, position, ref, kind, figure, origin)
        values (v_subject, v_ch, 'hsgenius', coalesce((ex->>'difficulty')::int, 1),
                coalesce(nullif(ex->>'title',''), v_chname || ' — exercices'), nullif(ex->>'context',''),
                coalesce((select max(position) + 1 from exercises where chapter_id = v_ch), 1), v_ref,
                v_kind, nullif(ex->>'figure',''), case when jsonb_typeof(ex->'origin') = 'object' then ex->'origin' end)
        returning id into v_ex;
        v_stats := jsonb_set(v_stats, '{exercises_created}', to_jsonb((v_stats->>'exercises_created')::int + 1));
      else
        update exercises set chapter_id = v_ch, subject_id = v_subject,
               difficulty = coalesce((ex->>'difficulty')::int, difficulty),
               title = coalesce(nullif(ex->>'title',''), title),
               statement = coalesce(nullif(ex->>'context',''), statement),
               ref = coalesce(v_ref, ref), kind = v_kind,
               figure = coalesce(nullif(ex->>'figure',''), figure),
               origin = coalesce(case when jsonb_typeof(ex->'origin') = 'object' then ex->'origin' end, origin)
         where id = v_ex;
        v_stats := jsonb_set(v_stats, '{exercises_updated}', to_jsonb((v_stats->>'exercises_updated')::int + 1));
      end if;

      j := 0;
      for q in select * from jsonb_array_elements(ex->'questions') loop
        j := j + 1; v_path := v_tp || 'exercises[' || i || '].questions[' || j || ']';
        if coalesce((q->>'_todo')::boolean, false) or coalesce(q->>'statement','') ~ '^\s*TODO' then
          v_stats := jsonb_set(v_stats, '{skipped_todo}', to_jsonb((v_stats->>'skipped_todo')::int + 1)); continue;
        end if;
        if coalesce(btrim(q->>'statement'),'') = '' then v_errors := v_errors || to_jsonb(v_path || ': "statement" manquant'); continue; end if;
        if jsonb_typeof(q->'options') is distinct from 'array' or jsonb_array_length(q->'options') < 2 then
          v_errors := v_errors || to_jsonb(v_path || ': au moins 2 "options"'); continue;
        end if;
        v_nopt := jsonb_array_length(q->'options');
        v_correct := nullif(q->>'correct','')::int;
        select count(*) into v_ncorrect from jsonb_array_elements(q->'options') e
         where jsonb_typeof(e) = 'object' and coalesce((e->>'is_correct')::boolean, (e->>'correct')::boolean, false);
        if v_correct is not null and (v_correct < 0 or v_correct >= v_nopt) then
          v_errors := v_errors || to_jsonb(v_path || ': "correct" hors limites'); continue;
        end if;
        if v_correct is null and v_ncorrect <> 1 then
          v_errors := v_errors || to_jsonb(v_path || ': exactement 1 bonne réponse attendue ("correct" ou is_correct)'); continue;
        end if;
        if coalesce(btrim(q->>'notion'),'') = '' then v_warnings := v_warnings || to_jsonb(v_path || ': pas de "notion" — invisible en mode Par notion'); end if;
        if coalesce(btrim(q->>'solution'),'') = '' then v_warnings := v_warnings || to_jsonb(v_path || ': pas de "solution"'); end if;

        v_qref := nullif(q->>'ref','') || v_sfx;
        v_q := null;
        if v_qref is not null then select id into v_q from questions where ref = v_qref; end if;
        if v_q is null and v_sfx = '' and (q->>'id') ~* '^[0-9a-f-]{36}$' then select id into v_q from questions where id = (q->>'id')::uuid; end if;
        if v_q is null then
          insert into questions (exercise_id, kind, statement, points, position, notion, ref, hint, methode, difficulty, part)
          values (v_ex, 'mcq', q->>'statement', coalesce((q->>'points')::numeric, 1), j, nullif(btrim(q->>'notion'),''), v_qref,
                  nullif(q->>'hint',''), nullif(q->>'methode',''), nullif(q->>'difficulty','')::smallint, nullif(q->>'part',''))
          returning id into v_q;
          v_stats := jsonb_set(v_stats, '{questions_created}', to_jsonb((v_stats->>'questions_created')::int + 1));
        else
          update questions set exercise_id = v_ex, statement = q->>'statement', points = coalesce((q->>'points')::numeric, points),
                 position = j, notion = nullif(btrim(q->>'notion'),''), ref = coalesce(v_qref, ref),
                 hint = nullif(q->>'hint',''), methode = nullif(q->>'methode',''),
                 difficulty = nullif(q->>'difficulty','')::smallint, part = nullif(q->>'part','')
           where id = v_q;
          delete from answer_options where question_id = v_q;
          delete from solutions where question_id = v_q;
          delete from question_explanations where question_id = v_q;
          v_stats := jsonb_set(v_stats, '{questions_updated}', to_jsonb((v_stats->>'questions_updated')::int + 1));
        end if;

        k := 0;
        for o in select * from jsonb_array_elements(q->'options') loop
          k := k + 1;
          if jsonb_typeof(o) = 'string' then
            insert into answer_options (question_id, label, is_correct, position) values (v_q, o #>> '{}', v_correct = k - 1, k);
          else
            v_ok := case when v_correct is not null then v_correct = k - 1 else coalesce((o->>'is_correct')::boolean, (o->>'correct')::boolean, false) end;
            insert into answer_options (question_id, label, is_correct, position, why) values (v_q, o->>'label', v_ok, k, nullif(o->>'why',''));
          end if;
        end loop;

        if coalesce(btrim(q->>'solution'),'') <> '' then
          insert into solutions (question_id, exercise_id, author, body) values (v_q, v_ex, 'hsgenius', q->>'solution');
        end if;
      end loop;
    end loop;

    -- ---------- séries ----------
    i := 0;
    for s in select * from jsonb_array_elements(coalesce(p_pack->'series','[]')) loop
      i := i + 1; v_path := v_tp || 'series[' || i || ']';
      if coalesce((s->>'_todo')::boolean, false) then
        v_stats := jsonb_set(v_stats, '{skipped_todo}', to_jsonb((v_stats->>'skipped_todo')::int + 1)); continue;
      end if;
      if coalesce(s->>'slug','') = '' or coalesce(s->>'title','') = '' then
        v_errors := v_errors || to_jsonb(v_path || ': "slug" et "title" requis'); continue;
      end if;
      if s->>'slug' like 'auto:%' then v_errors := v_errors || to_jsonb(v_path || ': le préfixe "auto:" est réservé'); continue; end if;
      v_ch := null;
      if nullif(s->>'chapter','') is not null then
        select c.id into v_ch from chapters c
         where c.subject_id = v_subject and c.level_id = v_level and (c.track_id = v_track or c.track_id is null)
           and (lower(c.code) = lower(s->>'chapter') or lower(c.name) = lower(s->>'chapter'))
         order by (c.track_id is null) limit 1;
        if v_ch is null then v_errors := v_errors || to_jsonb(v_path || ': chapitre introuvable "' || (s->>'chapter') || '"'); continue; end if;
      end if;

      select id into v_s from series where slug = (s->>'slug') || v_sfx;
      if v_s is null then
        insert into series (slug, subject_id, level_id, track_id, chapter_id, unit, kind, title, description, difficulty, position, xp_bonus, is_published)
        values ((s->>'slug') || v_sfx, v_subject, v_level, v_track, v_ch, nullif(s->>'unit',''),
                coalesce(nullif(s->>'kind',''), 'custom'), s->>'title', nullif(s->>'description',''),
                coalesce((s->>'difficulty')::int, 1), coalesce((s->>'position')::int, 500),
                coalesce((s->>'xp_bonus')::int, 30), coalesce((s->>'published')::boolean, true))
        returning id into v_s;
        v_stats := jsonb_set(v_stats, '{series_created}', to_jsonb((v_stats->>'series_created')::int + 1));
      else
        update series set subject_id = v_subject, level_id = v_level, track_id = v_track, chapter_id = v_ch,
               unit = nullif(s->>'unit',''), kind = coalesce(nullif(s->>'kind',''), 'custom'), title = s->>'title',
               description = nullif(s->>'description',''), difficulty = coalesce((s->>'difficulty')::int, difficulty),
               position = coalesce((s->>'position')::int, position), xp_bonus = coalesce((s->>'xp_bonus')::int, xp_bonus),
               is_published = coalesce((s->>'published')::boolean, is_published)
         where id = v_s;
        delete from series_items where series_id = v_s;
        v_stats := jsonb_set(v_stats, '{series_updated}', to_jsonb((v_stats->>'series_updated')::int + 1));
      end if;

      j := 0;
      for r in select * from jsonb_array_elements(coalesce(s->'questions','[]')) loop
        j := j + 1; v_q := null;
        select id into v_q from questions where ref = (r #>> '{}') || v_sfx;
        if v_q is null then select id into v_q from questions where ref = r #>> '{}'; end if;
        if v_q is null and (r #>> '{}') ~* '^[0-9a-f-]{36}$' then select id into v_q from questions where id = (r #>> '{}')::uuid; end if;
        if v_q is null then v_errors := v_errors || to_jsonb(v_path || '.questions[' || j || ']: question introuvable "' || (r #>> '{}') || '"'); continue; end if;
        insert into series_items (series_id, question_id, position) values (v_s, v_q, j) on conflict (series_id, question_id) do update set position = excluded.position;
        v_stats := jsonb_set(v_stats, '{series_items}', to_jsonb((v_stats->>'series_items')::int + 1));
      end loop;
      if j = 0 then v_warnings := v_warnings || to_jsonb(v_path || ': série sans questions'); end if;
    end loop;
  end loop;

    if p_dry_run or jsonb_array_length(v_errors) > 0 then
      raise exception using errcode = 'P0001', message = v_bump;
    end if;
  exception when others then
    if sqlerrm <> v_bump then
      v_errors := v_errors || to_jsonb('erreur: ' || sqlerrm || coalesce(' (' || v_path || ')', ''));
    end if;
  end;

  return jsonb_build_object('ok', jsonb_array_length(v_errors) = 0, 'dry_run', p_dry_run,
                            'committed', (not p_dry_run and jsonb_array_length(v_errors) = 0),
                            'errors', v_errors, 'warnings', v_warnings, 'stats', v_stats);
end;
$$;
revoke all on function import_prep_pack(jsonb, boolean) from public, anon;
grant execute on function import_prep_pack(jsonb, boolean) to authenticated, service_role;
