-- =====================================================================
--  0031 — Auto séries use the chapter BANK only (exercises.exam_id is null).
--  Examen-blanc questions (one-line corrections, locked exam engine) no
--  longer feed Bilans / Unités / Mixtes. Re-run: select regenerate_auto_series();
--  Idempotent (create or replace).
-- =====================================================================
create or replace function public.regenerate_auto_series()
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
begin
  if not (is_admin() or coalesce(auth.role(),'') = 'service_role' or (auth.uid() is null and coalesce(auth.role(),'') = '')) then
    raise exception 'forbidden: admin only';
  end if;

  insert into series (slug, subject_id, level_id, track_id, chapter_id, unit, kind, title, description, difficulty, position, xp_bonus)
  select 'auto:ch:' || c.id, c.subject_id, c.level_id, c.track_id, c.id, c.unit, 'chapitre',
         'Bilan · ' || c.name, 'Toutes les notions du chapitre, en alternance.', 1, c.position, 20
  from chapters c
  where exists (select 1 from exercises e join questions q on q.exercise_id = e.id where e.chapter_id = c.id and e.exam_id is null)
  on conflict (slug) do update set title = excluded.title, unit = excluded.unit, position = excluded.position;

  delete from series_items si using series s where s.id = si.series_id and s.slug like 'auto:%';

  insert into series_items (series_id, question_id, position)
  select s.id, y.qid, row_number() over (partition by y.chapter_id order by y.rk, y.notion, y.epos, y.qpos)
  from (
    select e.chapter_id, q.id qid, coalesce(q.notion,'') notion, e.position epos, q.position qpos,
           row_number() over (partition by e.chapter_id, coalesce(q.notion,'') order by e.position, q.position) rk
    from questions q join exercises e on e.id = q.exercise_id
    where e.chapter_id is not null and e.exam_id is null
      and exists (select 1 from answer_options o where o.question_id = q.id and o.is_correct)
  ) y join series s on s.slug = 'auto:ch:' || y.chapter_id
  on conflict do nothing;

  insert into series (slug, subject_id, level_id, track_id, unit, kind, title, description, difficulty, position, xp_bonus)
  select 'auto:unit:' || md5(u.subject_id::text || coalesce(u.level_id::text,'') || coalesce(u.track_id::text,'all') || u.unit),
         u.subject_id, u.level_id, u.track_id, u.unit, 'unite',
         'Série unité · ' || u.unit, 'Les chapitres de l''unité mélangés — comme au BAC.', 2, 1000 + u.upos, 40
  from (select subject_id, level_id, track_id, unit, min(c.position) upos
        from chapters c where c.unit is not null and exists (select 1 from exercises e where e.chapter_id = c.id and e.exam_id is null)
        group by 1,2,3,4 having count(distinct c.id) >= 2) u
  on conflict (slug) do update set title = excluded.title, position = excluded.position;

  insert into series_items (series_id, question_id, position)
  select s.id, x.qid, x.pos from (
    select b.*, row_number() over (partition by b.subject_id, b.level_id, b.track_id, b.unit order by b.rk, md5(b.qid::text)) pos
    from (select q.id qid, c.subject_id, c.level_id, c.track_id, c.unit,
                 row_number() over (partition by c.id order by md5(q.id::text)) rk
          from questions q join exercises e on e.id = q.exercise_id join chapters c on c.id = e.chapter_id
          where c.unit is not null and e.exam_id is null
            and exists (select 1 from answer_options o where o.question_id = q.id and o.is_correct)) b
  ) x
  join series s on s.slug = 'auto:unit:' || md5(x.subject_id::text || coalesce(x.level_id::text,'') || coalesce(x.track_id::text,'all') || x.unit)
  where x.pos <= 12
  on conflict do nothing;

  insert into series (slug, subject_id, level_id, track_id, kind, title, description, difficulty, position, xp_bonus)
  select 'auto:mix:' || md5(g.subject_id::text || coalesce(g.level_id::text,'') || coalesce(g.track_id::text,'all')) || ':' || n.k,
         g.subject_id, g.level_id, g.track_id, 'mixte',
         'Série mixte BAC ' || n.k, 'Tout le programme, dans le désordre. Le vrai test avant l''examen.', 3, 2000 + n.k, 60
  from (select c.subject_id, c.level_id, c.track_id from chapters c
        where exists (select 1 from exercises e where e.chapter_id = c.id and e.exam_id is null)
        group by 1,2,3 having count(distinct c.id) >= 3) g
  cross join generate_series(1,2) n(k)
  on conflict (slug) do nothing;

  insert into series_items (series_id, question_id, position)
  select s.id, x.qid, ((x.pos - 1) % 15) + 1 from (
    select b.*, row_number() over (partition by b.subject_id, b.level_id, b.track_id order by b.rk, md5(b.qid::text || 'mix')) pos
    from (select q.id qid, c.subject_id, c.level_id, c.track_id,
                 row_number() over (partition by c.id order by md5(q.id::text || 'mix')) rk
          from questions q join exercises e on e.id = q.exercise_id join chapters c on c.id = e.chapter_id
          where e.exam_id is null
            and exists (select 1 from answer_options o where o.question_id = q.id and o.is_correct)) b
  ) x
  join series s on s.slug = 'auto:mix:' || md5(x.subject_id::text || coalesce(x.level_id::text,'') || coalesce(x.track_id::text,'all')) || ':' || (((x.pos - 1) / 15) + 1)
  where x.pos <= 30
  on conflict do nothing;

  delete from series s where s.slug like 'auto:%' and (select count(*) from series_items i where i.series_id = s.id) < 4;

  return jsonb_build_object('series', (select count(*) from series where slug like 'auto:%'),
                            'items', (select count(*) from series_items i join series s on s.id = i.series_id where s.slug like 'auto:%'));
end;
$function$;
