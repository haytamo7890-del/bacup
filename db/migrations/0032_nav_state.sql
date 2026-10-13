-- =====================================================================
--  0032 — Navigation memory ("reprendre où j'en étais"), synced across devices.
--  One row per student: spots = { "<feature>": { "url": "/dashboard/...", "y": 420, "t": 1728000000000 } }
--  The client keeps a localStorage copy and merges per feature by newest t.
--  Idempotent.
-- =====================================================================
create table if not exists public.nav_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  spots      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.nav_state enable row level security;

drop policy if exists nav_state_select_own on public.nav_state;
create policy nav_state_select_own on public.nav_state
  for select using (auth.uid() = user_id);

drop policy if exists nav_state_insert_own on public.nav_state;
create policy nav_state_insert_own on public.nav_state
  for insert with check (auth.uid() = user_id);

drop policy if exists nav_state_update_own on public.nav_state;
create policy nav_state_update_own on public.nav_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
