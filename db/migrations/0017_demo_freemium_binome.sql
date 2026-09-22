-- =====================================================================
--  0017 — Freemium demo tier + binôme (Netflix-style, one payment / two profiles)
--
--  Access model (student_profiles.status):
--    'demo'    → free tier: enters the real app, gated content (see app guards)
--    'active'  → paid (full access)
--    'pending' / other → legacy, still routed to /payment
--
--  Demo: first cours + first annale per subject open; Monk Mode works for 24h
--  from demo_started_at then the streak is gated; gamification/AI/Coach locked.
--  Gating is enforced in the app (guards + server routes); this migration only
--  adds the columns those guards read.
--
--  Binôme: buyer enters a partner; ONE payment activates both. binome_group
--  links the pair; binome_partner_email lets the payment/admin flow provision
--  + activate the partner.
--  Run in Supabase → SQL Editor.
-- =====================================================================

alter table student_profiles
  add column if not exists demo_started_at    timestamptz,
  add column if not exists binome_group       uuid,
  add column if not exists binome_partner_email text,
  add column if not exists binome_role        text;   -- 'payer' | 'partner'

-- IMPORTANT: allow the new 'demo' access state (the old CHECK rejected it).
alter table student_profiles drop constraint if exists student_status_chk;
alter table student_profiles add constraint student_status_chk
  check (status in ('pending', 'active', 'suspended', 'demo'));

-- Pairs table (audit + admin dual-activation). Holds BOTH profiles so the
-- partner can be any niveau/filière (1bac+2bac, 1bac+1bac, 2bac+2bac).
create table if not exists binome_pairs (
  id             uuid primary key default gen_random_uuid(),
  payer_id       uuid references student_profiles(id) on delete set null,
  partner_id     uuid references student_profiles(id) on delete set null,
  payer_email    text,
  payer_level    text,   -- '1bac' | '2bac'
  payer_track    text,   -- filière code
  partner_name   text,
  partner_email  text,
  partner_level  text,
  partner_track  text,
  paid           boolean not null default false,
  created_at     timestamptz not null default now()
);
alter table binome_pairs enable row level security;
-- owner (payer) reads/creates their own pair; admins via service role.
drop policy if exists binome_pairs_owner_read on binome_pairs;
create policy binome_pairs_owner_read on binome_pairs
  for select to authenticated
  using (payer_id = auth.uid() or partner_id = auth.uid());
drop policy if exists binome_pairs_owner_insert on binome_pairs;
create policy binome_pairs_owner_insert on binome_pairs
  for insert to authenticated
  with check (payer_id = auth.uid());
grant insert, select on public.binome_pairs to authenticated;

-- Convenience: mark a demo start (idempotent — only sets it once).
create or replace function start_demo(p_user uuid)
returns void language sql security definer set search_path = public as $$
  update student_profiles
     set status = case when status = 'active' then status else 'demo' end,
         demo_started_at = coalesce(demo_started_at, now())
   where id = p_user;
$$;
