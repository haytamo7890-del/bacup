-- =====================================================================
--  0002 — RLS hardening
--  Every public table must have RLS enabled (Supabase treats an
--  RLS-disabled public table as fully open). Pattern:
--    · content/catalog tables  -> RLS on + public READ, writes via service_role
--    · personal tables         -> RLS on + own-row access only
-- =====================================================================

-- ---- CONTENT / CATALOG: readable by anyone, writable only by service_role ----
do $$
declare t text;
begin
  foreach t in array array[
    'countries','education_systems','levels','tracks','subjects',
    'track_subjects','chapters','lessons','regions','exams',
    'exercises','questions','answer_options','solutions'
  ] loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists read_all on %I;', t);
    execute format('create policy read_all on %I for select using (true);', t);
  end loop;
end $$;

-- ---- PERSONAL TABLES that were missing RLS ----

alter table profiles enable row level security;
drop policy if exists own_profile_select on profiles;
drop policy if exists own_profile_upsert on profiles;
drop policy if exists own_profile_update on profiles;
create policy own_profile_select on profiles for select using (id = auth.uid());
create policy own_profile_upsert on profiles for insert with check (id = auth.uid());
create policy own_profile_update on profiles for update using (id = auth.uid());

alter table guardianships enable row level security;
drop policy if exists own_guardianship on guardianships;
create policy own_guardianship on guardianships for select
  using (guardian_id = auth.uid() or student_id = auth.uid());

alter table consents enable row level security;
drop policy if exists own_consents on consents;
create policy own_consents on consents for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table referrals enable row level security;
drop policy if exists own_referrals on referrals;
create policy own_referrals on referrals for select
  using (referrer_id = auth.uid() or referred_id = auth.uid());

-- NOTE: `solutions` (your corrections) are public-read for now. When you add
-- paid tiers, gate them behind an entitlement check instead of a blanket read.
