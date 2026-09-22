-- =====================================================================
--  0010 — AI usage metering: cap AI calls per student per day.
--  Protects Anthropic cost + blocks abuse at scale. The check+increment
--  is atomic in a SECURITY DEFINER function. Idempotent.
-- =====================================================================

create table if not exists ai_usage (
  user_id uuid not null references profiles(id) on delete cascade,
  day     date not null default current_date,
  count   int  not null default 0,
  primary key (user_id, day)
);

alter table ai_usage enable row level security;
drop policy if exists own_ai_usage on ai_usage;
create policy own_ai_usage on ai_usage for select using (user_id = auth.uid());

-- Returns true and records one use if the student is under the daily cap.
create or replace function ai_can_use(p_max int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare c int;
begin
  if auth.uid() is null then return false; end if;
  select count into c from ai_usage where user_id = auth.uid() and day = current_date;
  if coalesce(c, 0) >= p_max then return false; end if;
  insert into ai_usage (user_id, day, count) values (auth.uid(), current_date, 1)
    on conflict (user_id, day) do update set count = ai_usage.count + 1;
  return true;
end;
$$;
