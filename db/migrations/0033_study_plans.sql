-- =====================================================================
--  0033 — Plan BAC: one plan per student (questionnaire answers).
--  Daily tasks are computed deterministically on the client
--  (src/lib/plan/engine.ts) from these answers + progress; only answers are stored.
--  Applied 2026-10-07.
-- =====================================================================
create table if not exists public.study_plans (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  answers    jsonb not null,
  exam_date  date not null,
  version    integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.study_plans enable row level security;
create policy study_plans_select_own on public.study_plans for select using ((select auth.uid()) = user_id);
create policy study_plans_insert_own on public.study_plans for insert with check ((select auth.uid()) = user_id);
create policy study_plans_update_own on public.study_plans for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
