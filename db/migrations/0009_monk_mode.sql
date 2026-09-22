-- =====================================================================
--  0009 — Monk Mode: daily-habit discipline tracker with streaks.
--  * 4 "non-negotiable" core habits (is_core) + up to 4 extras (max 8)
--  * one check row per habit per day
--  * streak is derived from checks (only core habits count)
--  * monk_settings keeps best streak + the permanent Monk badge (90j)
--  Idempotent. RLS: each student sees only their own rows.
-- =====================================================================

create table if not exists monk_habits (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  title      text not null,
  icon       text,                       -- lucide icon key (see UI map)
  is_core    boolean not null default false,
  position   int not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_monk_habits_user on monk_habits(user_id, active, position);

create table if not exists monk_checks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  habit_id   uuid not null references monk_habits(id) on delete cascade,
  day        date not null,
  created_at timestamptz not null default now(),
  unique (habit_id, day)
);
create index if not exists idx_monk_checks_user_day on monk_checks(user_id, day);

create table if not exists monk_settings (
  user_id     uuid primary key references profiles(id) on delete cascade,
  best_streak int not null default 0,
  monk_badge  boolean not null default false,   -- reached 90 days at least once
  updated_at  timestamptz not null default now()
);

-- ---- RLS: own rows only -------------------------------------------------
alter table monk_habits   enable row level security;
alter table monk_checks   enable row level security;
alter table monk_settings enable row level security;

drop policy if exists own_monk_habits on monk_habits;
create policy own_monk_habits on monk_habits for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists own_monk_checks on monk_checks;
create policy own_monk_checks on monk_checks for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists own_monk_settings on monk_settings;
create policy own_monk_settings on monk_settings for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
