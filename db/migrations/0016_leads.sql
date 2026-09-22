-- =====================================================================
--  0016 — Landing leads (demo email capture + newsletter).
--  Public/anon can INSERT a lead (email). Nobody can read via the API
--  (insert-only RLS). On each new lead, Postgres pings you by email via
--  Resend (same Vault key + pg_net setup as 0012_daily_reminders).
--
--  SETUP: pg_net enabled + Vault secret `resend_api_key` (already done for
--  0012). Edit v_from (verified sender) and v_to (your inbox) below if needed.
--  Run this file in Supabase → SQL Editor.
-- =====================================================================

create extension if not exists pg_net;

create table if not exists leads (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  source     text,                       -- 'demo' | 'newsletter'
  level      text,                       -- '1bac' | '2bac'
  created_at timestamptz not null default now()
);

alter table leads enable row level security;

-- Insert-only for anon + authenticated. No SELECT policy → not readable via API.
drop policy if exists leads_insert on leads;
create policy leads_insert on leads
  for insert to anon, authenticated
  with check (email is not null and length(email) <= 200);

grant insert on public.leads to anon, authenticated;

-- Notify you by email whenever a lead comes in.
create or replace function notify_new_lead()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key  text;
  v_from text := 'Bac Up <onboarding@resend.dev>';  -- test sender (works without a domain)
  v_to   text := 'bacup@gmail.com';
begin
  select decrypted_secret into v_key from vault.decrypted_secrets where name = 'resend_api_key';
  if v_key is null then
    return new;  -- no key yet: keep the lead, skip the email
  end if;

  perform net.http_post(
    url     := 'https://api.resend.com/emails',
    headers := jsonb_build_object('Authorization', 'Bearer ' || v_key, 'Content-Type', 'application/json'),
    body    := jsonb_build_object(
      'from', v_from,
      'to', v_to,
      'subject', '🎯 Nouveau lead Bac Up — ' || new.email,
      'html',
        '<div style="font-family:Inter,Arial,sans-serif;color:#0f172a">'
        || '<h2 style="margin:0 0 8px">Nouveau lead</h2>'
        || '<p><b>Email :</b> ' || new.email || '<br>'
        || '<b>Source :</b> ' || coalesce(new.source, '—') || '<br>'
        || '<b>Niveau :</b> ' || coalesce(new.level, '—') || '</p>'
        || '<p style="color:#94a3b8;font-size:12px">Bac Up · HSGenius</p></div>'
    )
  );
  return new;
end;
$$;

drop trigger if exists trg_notify_new_lead on leads;
create trigger trg_notify_new_lead
  after insert on leads
  for each row execute function notify_new_lead();
