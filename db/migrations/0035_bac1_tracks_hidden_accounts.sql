-- =====================================================================
-- 0035 — 1bac filières + fresh start (hidden pre-launch accounts)
--
--   1. Two 1bac filières: sex (Sciences Expérimentales), sm (Sciences
--      Mathématiques). 1bac content is imported against these; the app
--      stays locked for 1bac until FEATURES.level1bac = true (src/config).
--      The single existing 1bac exam (filed under pc) moves to sex.
--   2. student_profiles.hidden_at: accounts created before the launch are
--      hidden from leaderboards (they keep their login and access).
--      Every account except admins is hidden now.
--   3. leaderboard / my_rank / challenge_leaderboard skip hidden accounts
--      (a hidden user still sees their own rank).
--   4. Guard: users cannot change hidden_at themselves.
-- Safe to re-run.
-- =====================================================================

begin;

-- 1. 1bac filières -----------------------------------------------------
insert into tracks (education_system_id, code, name)
select t.education_system_id, v.code, v.name
  from (values ('sex', 'Sciences Expérimentales'), ('sm', 'Sciences Mathématiques')) as v(code, name)
  cross join (select education_system_id from tracks where code = 'pc' limit 1) t
 where not exists (select 1 from tracks x where x.code = v.code);

update exams e
   set track_id = (select id from tracks where code = 'sex')
 where e.level_id = (select id from levels where code = '1bac')
   and e.track_id = (select id from tracks where code = 'pc');

-- 2. hidden accounts ---------------------------------------------------
alter table student_profiles add column if not exists hidden_at timestamptz;

update student_profiles sp
   set hidden_at = now()
 where sp.hidden_at is null
   and not exists (select 1 from profiles p where p.id = sp.id and p.role = 'admin');

-- 4. guard (same as 0034 + hidden_at) -----------------------------------
create or replace function guard_student_profile() returns trigger
language plpgsql set search_path = public as $$
begin
  if current_user in ('authenticated', 'anon') and not is_admin() then
    if tg_op = 'INSERT' then
      if new.status is null or new.status not in ('pending', 'demo') then new.status := 'pending'; end if;
      new.program := null; new.activated_at := null;
      new.founder := false; new.access_until := null;
      new.member_number := null; new.referred_by_code := null;
      new.hidden_at := null;
    else
      if not (old.status in ('pending', 'demo') and new.status in ('pending', 'demo')) then
        new.status := old.status;
      end if;
      new.program          := old.program;
      new.activated_at     := old.activated_at;
      new.founder          := old.founder;
      new.access_until     := old.access_until;
      new.member_number    := old.member_number;
      new.referred_by_code := old.referred_by_code;
      new.hidden_at        := old.hidden_at;
    end if;
  elsif tg_op = 'INSERT' and new.member_number is null then
    new.member_number := nextval('member_number_seq');
  end if;
  return new;
end $$;

-- 3. leaderboards skip hidden accounts ----------------------------------
create or replace function leaderboard(p_period text default 'all', p_limit integer default 10)
returns table(rank bigint, display_name text, total_xp bigint, is_me boolean)
language sql security definer set search_path = public as $$
  with me as (select level_id, track_id from student_profiles where id = auth.uid()),
  cohort as (
    select sp.id
    from student_profiles sp, me
    where sp.status = 'active'
      and (sp.hidden_at is null or sp.id = auth.uid())
      and sp.level_id is not distinct from me.level_id
      and sp.track_id is not distinct from me.track_id
  ),
  xp as (
    select c.id, coalesce(sum(x.amount),0) as amt
    from cohort c
    left join xp_events x on x.student_id = c.id
      and (p_period <> 'week' or x.created_at >= date_trunc('week', now()))
    group by c.id
  )
  select row_number() over (order by xp.amt desc, p.display_name) as rank,
         coalesce(p.display_name,'Élève') as display_name,
         xp.amt as total_xp,
         xp.id = auth.uid() as is_me
  from xp join profiles p on p.id = xp.id
  order by xp.amt desc, p.display_name
  limit p_limit;
$$;

create or replace function my_rank(p_period text default 'all')
returns table(rank bigint, total_xp bigint, cohort_size bigint)
language sql security definer set search_path = public as $$
  with me as (select level_id, track_id from student_profiles where id = auth.uid()),
  cohort as (
    select sp.id from student_profiles sp, me
    where sp.status = 'active'
      and (sp.hidden_at is null or sp.id = auth.uid())
      and sp.level_id is not distinct from me.level_id
      and sp.track_id is not distinct from me.track_id
  ),
  xp as (
    select c.id, coalesce(sum(x.amount),0) as amt
    from cohort c
    left join xp_events x on x.student_id = c.id
      and (p_period <> 'week' or x.created_at >= date_trunc('week', now()))
    group by c.id
  ),
  ranked as (select id, amt, row_number() over (order by amt desc) as rk from xp)
  select rk, amt, (select count(*) from cohort) from ranked where id = auth.uid();
$$;

create or replace function challenge_leaderboard(p_challenge uuid, p_limit integer default 20)
returns table(rank integer, name text, city text, track text, score numeric, time_spent_s integer)
language sql stable security definer set search_path = public as $$
  select row_number() over (order by e.score desc, e.time_spent_s asc nulls last, e.submitted_at asc)::int,
         coalesce(p.display_name, 'Élève'), sp.city, t.name, e.score, e.time_spent_s
  from challenge_entries e
  join student_profiles sp on sp.id = e.student_id
  left join profiles p on p.id = e.student_id
  left join tracks t on t.id = sp.track_id
  where e.challenge_id = p_challenge
    and sp.hidden_at is null
  order by 1 limit p_limit;
$$;

commit;
