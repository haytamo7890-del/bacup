-- 0026 gamification: cohort/period leaderboard (approved-only) + monk milestones/XP/reset
-- Applied via Supabase. Leaderboard scopes to caller's filière+niveau, status='active' only.
-- monk_sync: server-side streak (Africa/Casablanca), milestone XP 7/21/66/90/180/365 (idempotent).
-- See functions: leaderboard(text,int), my_rank(text), monk_sync(), monk_reset().
alter table public.monk_settings add column if not exists awarded_milestones int[] not null default '{}';
-- (full function bodies applied via migration gamification_leaderboard_monk + tz patch)
