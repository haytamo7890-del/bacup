-- =====================================================================
--  0028 — Content packs for the Espace de préparation.
--  Content is authored as JSON files ("bacup.prep/v1", see
--  data/_prep-pack-template.json + docs/content-packs.md) and imported
--  through /admin/preparation (or `npm run import:prep`).
--
--  • exercises.ref / questions.ref : stable author keys → re-importing a
--    pack UPDATES in place (no duplicates, student history preserved).
--  • import_prep_pack(pack, dry_run) : validates + upserts exercises,
--    questions (notion-tagged), options, solutions and séries in ONE
--    transaction. dry_run=true returns the full report and rolls back.
--  Admin (profiles.role='admin') or service_role only.
--  • "id" (uuid) is accepted too, so an EXPORTED pack round-trips: edit the
--    JSON, re-import, and existing questions are updated in place.
--  • regenerate_auto_series() : rebuilds the "auto:*" starter séries
--    (bilans / unités / mixtes) after new content lands.
-- =====================================================================

alter table exercises add column if not exists ref text;
alter table questions add column if not exists ref text;
create unique index if not exists exercises_ref_uidx on exercises(ref) where ref is not null;
create unique index if not exists questions_ref_uidx on questions(ref) where ref is not null;

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
                                          'questions_updated',0,'series_created',0,'series_updated',0,'series_items',0);
  v_level uuid; v_subject uuid; v_track uuid;
  ex jsonb; q jsonb; o jsonb; s jsonb; r jsonb;
  v_ch uuid; v_ex uuid; v_q uuid; v_s uuid;
  v_label text; v_ok boolean; v_correct int; v_nopt int; v_ncorrect int;
  i int; j int; k int; v_path text; v_new boolean;
  v_chname text;
begin
  if not (is_admin() or coalesce(auth.role(),'') = 'service_role' or (auth.uid() is null and coalesce(auth.role(),'') = ''))  -- admin, service key, or SQL editor then
    raise exception 'forbidden: admin only';
  end if;

  if coalesce(p_pack->>'format','') <> 'bacup.prep/v1' then
    return jsonb_build_object('ok', false, 'errors', jsonb_build_array('format doit valoir "bacup.prep/v1"'));
  end if;

  select id into v_level   from levels   where code = p_pack->>'level';
  select id into v_subject from subjects where code = p_pack->>'subject';
  if v_level is null   then v_errors := v_errors || to_jsonb('level inconnu: ' || coalesce(p_pack->>'level','∅')); end if;
  if v_subject is null then v_errors := v_errors || to_jsonb('subject inconnu: ' || coalesce(p_pack->>'subject','∅')); end if;
  if nullif(p_pack->>'track','') is not null then
    select id into v_track from tracks where code = p_pack->>'track';
    if v_track is null then v_errors := v_errors || to_jsonb('track inconnu: ' || (p_pack->>'track')); end if;
  end if;
  if jsonb_array_length(v_errors) > 0 then
    return jsonb_build_object('ok', false, 'errors', v_errors, 'warnings', v_warnings, 'stats', v_stats, 'dry_run', p_dry_run);
  end if;

  begin  -- ===== transactional block: rolled back on dry-run or any error =====

    -- ---------- exercises + questions ----------
    i := 0;
    for ex in select * from jsonb_array_elements(coalesce(p_pack->'exercises','[]')) loop
      i := i + 1; v_path := 'exercises[' || i || ']';
      -- chapter: code or exact name (case-insensitive); filière-specific wins over shared
      select c.id, c.name into v_ch, v_chname from chapters c
       where c.subject_id = v_subject and c.level_id = v_level
         and (c.track_id = v_track or c.track_id is null)
         and (lower(c.code) = lower(ex->>'chapter') or lower(c.name) = lower(ex->>'chapter'))
       order by (c.track_id is null) limit 1;
      if v_ch is null then
        v_errors := v_errors || to_jsonb(v_path || ': chapitre introuvable "' || coalesce(ex->>'chapter','∅') || '"');
        continue;
      end if;
      if jsonb_typeof(ex->'questions') is distinct from 'array' or jsonb_array_length(ex->'questions') = 0 then
        v_errors := v_errors || to_jsonb(v_path || ': "questions" vide'); continue;
      end if;

      v_ex := null;
      if nullif(ex->>'ref','') is not null then select id into v_ex from exercises where ref = ex->>'ref'; end if;
      if v_ex is null and (ex->>'id') ~* '^[0-9a-f-]{36}$' then select id into v_ex from exercises where id = (ex->>'id')::uuid; end if;
      if v_ex is null and nullif(ex->>'title','') is not null then
        select id into v_ex from exercises where chapter_id = v_ch and title = ex->>'title' and exam_id is null limit 1;
      end if;
      if v_ex is null then
        insert into exercises (subject_id, chapter_id, source, difficulty, title, statement, position, ref)
        values (v_subject, v_ch, 'hsgenius', coalesce((ex->>'difficulty')::int, 1),
                coalesce(nullif(ex->>'title',''), v_chname || ' — exercices'), nullif(ex->>'context',''),
                coalesce((select max(position) + 1 from exercises where chapter_id = v_ch), 1), nullif(ex->>'ref',''))
        returning id into v_ex;
        v_stats := jsonb_set(v_stats, '{exercises_created}', to_jsonb((v_stats->>'exercises_created')::int + 1));
      else
        update exercises set chapter_id = v_ch, subject_id = v_subject,
               difficulty = coalesce((ex->>'difficulty')::int, difficulty),
               title = coalesce(nullif(ex->>'title',''), title),
               statement = coalesce(nullif(ex->>'context',''), statement),
               ref = coalesce(nullif(ex->>'ref',''), ref)
         where id = v_ex;
        v_stats := jsonb_set(v_stats, '{exercises_updated}', to_jsonb((v_stats->>'exercises_updated')::int + 1));
      end if;

      j := 0;
      for q in select * from jsonb_array_elements(ex->'questions') loop
        j := j + 1; v_path := 'exercises[' || i || '].questions[' || j || ']';
        if coalesce(btrim(q->>'statement'),'') = '' then v_errors := v_errors || to_jsonb(v_path || ': "statement" manquant'); continue; end if;
        if jsonb_typeof(q->'options') is distinct from 'array' or jsonb_array_length(q->'options') < 2 then
          v_errors := v_errors || to_jsonb(v_path || ': au moins 2 "options"'); continue;
        end if;
        -- correct answer: "correct": index (0-based)  OR  options[{label,is_correct}]
        v_nopt := jsonb_array_length(q->'options');
        v_correct := nullif(q->>'correct','')::int;
        select count(*) into v_ncorrect from jsonb_array_elements(q->'options') e
         where jsonb_typeof(e) = 'object' and coalesce((e->>'is_correct')::boolean, false);
        if v_correct is not null and (v_correct < 0 or v_correct >= v_nopt) then
          v_errors := v_errors || to_jsonb(v_path || ': "correct" hors limites'); continue;
        end if;
        if v_correct is null and v_ncorrect <> 1 then
          v_errors := v_errors || to_jsonb(v_path || ': exactement 1 bonne réponse attendue ("correct" ou is_correct)'); continue;
        end if;
        if coalesce(btrim(q->>'notion'),'') = '' then v_warnings := v_warnings || to_jsonb(v_path || ': pas de "notion" — invisible en mode Par notion'); end if;
        if coalesce(btrim(q->>'solution'),'') = '' then v_warnings := v_warnings || to_jsonb(v_path || ': pas de "solution"'); end if;

        v_q := null; v_new := false;
        if nullif(q->>'ref','') is not null then select id into v_q from questions where ref = q->>'ref'; end if;
        if v_q is null and (q->>'id') ~* '^[0-9a-f-]{36}$' then select id into v_q from questions where id = (q->>'id')::uuid; end if;
        if v_q is null then
          insert into questions (exercise_id, kind, statement, points, position, notion, ref)
          values (v_ex, 'mcq', q->>'statement', coalesce((q->>'points')::numeric, 1), j, nullif(btrim(q->>'notion'),''), nullif(q->>'ref',''))
          returning id into v_q;
          v_new := true;
          v_stats := jsonb_set(v_stats, '{questions_created}', to_jsonb((v_stats->>'questions_created')::int + 1));
        else
          update questions set exercise_id = v_ex, statement = q->>'statement', points = coalesce((q->>'points')::numeric, points),
                 position = j, notion = nullif(btrim(q->>'notion'),''), ref = coalesce(nullif(q->>'ref',''), ref)
           where id = v_q;
          delete from answer_options where question_id = v_q;
          delete from solutions where question_id = v_q;
          delete from question_explanations where question_id = v_q;  -- stale AI explanations
          v_stats := jsonb_set(v_stats, '{questions_updated}', to_jsonb((v_stats->>'questions_updated')::int + 1));
        end if;

        k := 0;
        for o in select * from jsonb_array_elements(q->'options') loop
          k := k + 1;
          if jsonb_typeof(o) = 'string' then v_label := o #>> '{}'; v_ok := (v_correct = k - 1);
          else v_label := o->>'label'; v_ok := case when v_correct is not null then v_correct = k - 1 else coalesce((o->>'is_correct')::boolean, false) end;
          end if;
          insert into answer_options (question_id, label, is_correct, position) values (v_q, v_label, v_ok, k);
        end loop;

        if coalesce(btrim(q->>'solution'),'') <> '' then
          insert into solutions (question_id, exercise_id, author, body) values (v_q, v_ex, 'hsgenius', q->>'solution');
        end if;
      end loop;
    end loop;

    -- ---------- séries ----------
    i := 0;
    for s in select * from jsonb_array_elements(coalesce(p_pack->'series','[]')) loop
      i := i + 1; v_path := 'series[' || i || ']';
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

      select id into v_s from series where slug = s->>'slug';
      if v_s is null then
        insert into series (slug, subject_id, level_id, track_id, chapter_id, unit, kind, title, description, difficulty, position, xp_bonus, is_published)
        values (s->>'slug', v_subject, v_level, v_track, v_ch, nullif(s->>'unit',''),
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
        select id into v_q from questions where ref = r #>> '{}';
        if v_q is null and (r #>> '{}') ~* '^[0-9a-f-]{36}$' then select id into v_q from questions where id = (r #>> '{}')::uuid; end if;
        if v_q is null then v_errors := v_errors || to_jsonb(v_path || '.questions[' || j || ']: question introuvable "' || (r #>> '{}') || '"'); continue; end if;
        insert into series_items (series_id, question_id, position) values (v_s, v_q, j) on conflict (series_id, question_id) do update set position = excluded.position;
        v_stats := jsonb_set(v_stats, '{series_items}', to_jsonb((v_stats->>'series_items')::int + 1));
      end loop;
      if j = 0 then v_warnings := v_warnings || to_jsonb(v_path || ': série sans questions'); end if;
    end loop;

    if p_dry_run or jsonb_array_length(v_errors) > 0 then
      raise exception using errcode = 'P0001', message = 'bacup_rollback';
    end if;
  exception when others then
    if sqlerrm <> 'bacup_rollback' then
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

-- ---------- auto séries (same logic as db/seed/series_auto.sql) ----------
create or replace function regenerate_auto_series()
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if not (is_admin() or coalesce(auth.role(),'') = 'service_role' or (auth.uid() is null and coalesce(auth.role(),'') = ''))  -- admin, service key, or SQL editor then
    raise exception 'forbidden: admin only';
  end if;

  insert into series (slug, subject_id, level_id, track_id, chapter_id, unit, kind, title, description, difficulty, position, xp_bonus)
  select 'auto:ch:' || c.id, c.subject_id, c.level_id, c.track_id, c.id, c.unit, 'chapitre',
         'Bilan · ' || c.name, 'Toutes les notions du chapitre, en alternance.', 1, c.position, 20
  from chapters c
  where exists (select 1 from exercises e join questions q on q.exercise_id = e.id where e.chapter_id = c.id)
  on conflict (slug) do update set title = excluded.title, unit = excluded.unit, position = excluded.position;

  delete from series_items si using series s where s.id = si.series_id and s.slug like 'auto:%';

  insert into series_items (series_id, question_id, position)
  select s.id, y.qid, row_number() over (partition by y.chapter_id order by y.rk, y.notion, y.epos, y.qpos)
  from (
    select e.chapter_id, q.id qid, coalesce(q.notion,'') notion, e.position epos, q.position qpos,
           row_number() over (partition by e.chapter_id, coalesce(q.notion,'') order by e.position, q.position) rk
    from questions q join exercises e on e.id = q.exercise_id
    where e.chapter_id is not null
      and exists (select 1 from answer_options o where o.question_id = q.id and o.is_correct)
  ) y join series s on s.slug = 'auto:ch:' || y.chapter_id
  on conflict do nothing;

  insert into series (slug, subject_id, level_id, track_id, unit, kind, title, description, difficulty, position, xp_bonus)
  select 'auto:unit:' || md5(u.subject_id::text || coalesce(u.level_id::text,'') || coalesce(u.track_id::text,'all') || u.unit),
         u.subject_id, u.level_id, u.track_id, u.unit, 'unite',
         'Série unité · ' || u.unit, 'Les chapitres de l''unité mélangés — comme au BAC.', 2, 1000 + u.upos, 40
  from (select subject_id, level_id, track_id, unit, min(c.position) upos
        from chapters c where c.unit is not null and exists (select 1 from exercises e where e.chapter_id = c.id)
        group by 1,2,3,4 having count(distinct c.id) >= 2) u
  on conflict (slug) do update set title = excluded.title, position = excluded.position;

  insert into series_items (series_id, question_id, position)
  select s.id, x.qid, x.pos from (
    select b.*, row_number() over (partition by b.subject_id, b.level_id, b.track_id, b.unit order by b.rk, md5(b.qid::text)) pos
    from (select q.id qid, c.subject_id, c.level_id, c.track_id, c.unit,
                 row_number() over (partition by c.id order by md5(q.id::text)) rk
          from questions q join exercises e on e.id = q.exercise_id join chapters c on c.id = e.chapter_id
          where c.unit is not null and exists (select 1 from answer_options o where o.question_id = q.id and o.is_correct)) b
  ) x
  join series s on s.slug = 'auto:unit:' || md5(x.subject_id::text || coalesce(x.level_id::text,'') || coalesce(x.track_id::text,'all') || x.unit)
  where x.pos <= 12
  on conflict do nothing;

  insert into series (slug, subject_id, level_id, track_id, kind, title, description, difficulty, position, xp_bonus)
  select 'auto:mix:' || md5(g.subject_id::text || coalesce(g.level_id::text,'') || coalesce(g.track_id::text,'all')) || ':' || n.k,
         g.subject_id, g.level_id, g.track_id, 'mixte',
         'Série mixte BAC ' || n.k, 'Tout le programme, dans le désordre. Le vrai test avant l''examen.', 3, 2000 + n.k, 60
  from (select c.subject_id, c.level_id, c.track_id from chapters c
        where exists (select 1 from exercises e where e.chapter_id = c.id)
        group by 1,2,3 having count(distinct c.id) >= 3) g
  cross join generate_series(1,2) n(k)
  on conflict (slug) do nothing;

  insert into series_items (series_id, question_id, position)
  select s.id, x.qid, ((x.pos - 1) % 15) + 1 from (
    select b.*, row_number() over (partition by b.subject_id, b.level_id, b.track_id order by b.rk, md5(b.qid::text || 'mix')) pos
    from (select q.id qid, c.subject_id, c.level_id, c.track_id,
                 row_number() over (partition by c.id order by md5(q.id::text || 'mix')) rk
          from questions q join exercises e on e.id = q.exercise_id join chapters c on c.id = e.chapter_id
          where exists (select 1 from answer_options o where o.question_id = q.id and o.is_correct)) b
  ) x
  join series s on s.slug = 'auto:mix:' || md5(x.subject_id::text || coalesce(x.level_id::text,'') || coalesce(x.track_id::text,'all')) || ':' || (((x.pos - 1) / 15) + 1)
  where x.pos <= 30
  on conflict do nothing;

  delete from series s where s.slug like 'auto:%' and (select count(*) from series_items i where i.series_id = s.id) < 4;

  return jsonb_build_object('series', (select count(*) from series where slug like 'auto:%'),
                            'items', (select count(*) from series_items i join series s on s.id = i.series_id where s.slug like 'auto:%'));
end;
$$;

revoke all on function regenerate_auto_series() from public, anon;
grant execute on function regenerate_auto_series() to authenticated, service_role;
