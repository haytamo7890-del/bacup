-- =====================================================================
--  0012 — Daily "come back" email reminder (out-of-app retention).
--  Every morning, active students who did NOTHING the day before (no QCM,
--  no lesson read, no Monk check) get one warm email to resume. No extra
--  server — Postgres (pg_cron) calls Resend over HTTP (pg_net).
--
--  SETUP (once), in order:
--   1) Dashboard → Database → Extensions: enable  pg_cron  and  pg_net.
--   2) Create a Resend account, verify your sending domain, get an API key.
--   3) Store the key in Vault (Dashboard → Project Settings → Vault) named
--      exactly  resend_api_key   — or run:
--        select vault.create_secret('re_xxxxxxxx', 'resend_api_key');
--   4) Edit v_from (verified sender) and v_app (your app URL) below.
--   5) Run this migration. It schedules the job at 07:00 daily.
--  Test now without waiting:   select send_daily_reminders();
-- =====================================================================

create extension if not exists pg_net;
-- pg_cron is pre-loaded on Supabase; enable it in Dashboard → Extensions
-- if the next line errors, then re-run this file.
create extension if not exists pg_cron;

-- One reminder per student per day (no double-sends).
create table if not exists reminder_log (
  user_id uuid not null references profiles(id) on delete cascade,
  day     date not null default current_date,
  sent_at timestamptz not null default now(),
  primary key (user_id, day)
);

-- Active students who were inactive on p_day and not yet reminded that day.
create or replace function students_needing_reminder(p_day date default current_date)
returns table(user_id uuid, email text, display_name text)
language sql
security definer
set search_path = public, auth
as $$
  select sp.id, u.email, p.display_name
  from student_profiles sp
  join auth.users u on u.id = sp.id
  left join profiles p on p.id = sp.id
  where sp.status = 'active'
    and u.email is not null
    and not exists (select 1 from reminder_log rl where rl.user_id = sp.id and rl.day = p_day)
    and not exists (select 1 from attempts a where a.student_id = sp.id and a.created_at::date = p_day)
    and not exists (select 1 from lesson_completions lc where lc.user_id = sp.id and lc.created_at::date = p_day)
    and not exists (select 1 from monk_checks mc where mc.user_id = sp.id and mc.day = p_day);
$$;

-- Send the emails via Resend and log them. Returns how many were sent.
create or replace function send_daily_reminders()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  r     record;
  v_key text;
  v_from text := 'Bac-up <onboarding@resend.dev>';  -- test sender (works without a domain)
  v_app  text := 'http://localhost:3000';           -- your app URL (change in production)
  n int := 0;
begin
  select decrypted_secret into v_key from vault.decrypted_secrets where name = 'resend_api_key';
  if v_key is null then
    raise notice 'resend_api_key introuvable dans Vault — aucun email envoyé.';
    return 0;
  end if;

  for r in select * from students_needing_reminder(current_date) loop
    perform net.http_post(
      url     := 'https://api.resend.com/emails',
      headers := jsonb_build_object('Authorization', 'Bearer ' || v_key, 'Content-Type', 'application/json'),
      body    := jsonb_build_object(
        'from', v_from,
        'to', r.email,
        'subject', 'Reprends ta préparation BAC 🔥',
        'html',
          '<div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:auto;color:#0f172a">'
          || '<h2 style="margin:0 0 8px">Salut ' || coalesce(r.display_name, '') || ' 👋</h2>'
          || '<p style="color:#475569;line-height:1.6">Tu n''as pas encore révisé aujourd''hui. Reprends là où tu t''es arrêté '
          || 'et valide ton Monk Mode <b>avant minuit</b> pour ne pas casser ta série. 🔥</p>'
          || '<a href="' || v_app || '/dashboard" style="display:inline-block;background:#1b7fdc;color:#fff;'
          || 'padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600;margin-top:8px">Reprendre maintenant →</a>'
          || '<p style="color:#94a3b8;font-size:12px;margin-top:24px">Bac-up · HSGenius</p></div>'
      )
    );
    insert into reminder_log (user_id, day) values (r.user_id, current_date) on conflict do nothing;
    n := n + 1;
  end loop;

  return n;
end;
$$;

-- Schedule: every evening at 20:00 Morocco time = 19:00 UTC (Supabase runs UTC).
-- Evening = students are home, free to study, and can act before the streak
-- resets at midnight. Re-running this block safely re-schedules.
do $$
begin
  if exists (select 1 from cron.job where jobname = 'bacup-daily-reminders') then
    perform cron.unschedule('bacup-daily-reminders');
  end if;
end $$;
select cron.schedule('bacup-daily-reminders', '0 19 * * *', $$ select send_daily_reminders(); $$);
