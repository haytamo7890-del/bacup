-- =====================================================================
--  0006 — Accounts, manual payments & admin control panel.
--  * Account activation lifecycle (pending → active / suspended)
--  * Manual payment requests (RIB / CashPlus / Wafacash + receipt upload)
--  * Editable payment channel settings (admin-managed)
--  * Private 'receipts' storage bucket + policies
--  * is_admin() helper, admin RLS, approve/reject RPCs
--  Idempotent: safe to run once in Supabase → SQL Editor.
-- =====================================================================

-- ---- Profile / student account fields --------------------------------
alter table profiles         add column if not exists phone text;

alter table student_profiles add column if not exists status text not null default 'pending';
alter table student_profiles drop constraint if exists student_status_chk;
alter table student_profiles add constraint student_status_chk
  check (status in ('pending', 'active', 'suspended'));
alter table student_profiles add column if not exists program      text;          -- 'bac1' | 'bac2'
alter table student_profiles add column if not exists activated_at  timestamptz;

-- ---- Admin helper ----------------------------------------------------
create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- ---- Payment requests (manual bank / cash transfer + receipt) --------
create table if not exists payment_requests (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  program      text not null,                       -- 'bac1' | 'bac2'
  amount_mad   numeric(8,2) not null default 220,
  method       text not null,                       -- 'virement' | 'cashplus' | 'wafacash'
  full_name    text not null,                       -- payer's real name (for matching)
  phone        text,
  receipt_path text,                                 -- object path in the 'receipts' bucket
  status       text not null default 'pending',
  admin_note   text,
  reviewed_by  uuid references profiles(id) on delete set null,
  reviewed_at  timestamptz,
  created_at   timestamptz not null default now()
);
alter table payment_requests drop constraint if exists payment_status_chk;
alter table payment_requests add constraint payment_status_chk
  check (status in ('pending', 'approved', 'rejected'));
create index if not exists idx_payreq_user   on payment_requests(user_id);
create index if not exists idx_payreq_status on payment_requests(status, created_at desc);

-- ---- Editable payment channels (shown on the payment page) -----------
create table if not exists payment_settings (
  channel      text primary key,                    -- 'virement' | 'cashplus' | 'wafacash'
  label        text not null,
  holder       text,                                 -- account / recipient name
  value        text,                                 -- RIB or phone number
  instructions text,
  enabled      boolean not null default true,
  position     int not null default 0,
  updated_at   timestamptz not null default now()
);
insert into payment_settings (channel, label, holder, value, instructions, position) values
  ('virement', 'Virement bancaire', 'HSGenius', 'RIB à configurer dans l''admin',
   'Effectue un virement du montant exact vers ce RIB, puis téléverse la capture du reçu.', 1),
  ('cashplus', 'CashPlus', 'HSGenius', 'Numéro à configurer dans l''admin',
   'Dépose le montant exact dans une agence CashPlus vers ce numéro, garde le reçu et téléverse-le.', 2),
  ('wafacash', 'Wafacash', 'HSGenius', 'Numéro à configurer dans l''admin',
   'Envoie le montant via Wafacash / Barid Cash, garde le reçu et téléverse-le.', 3)
on conflict (channel) do nothing;

-- ---- RLS -------------------------------------------------------------
alter table payment_requests enable row level security;
alter table payment_settings enable row level security;

drop policy if exists payreq_select on payment_requests;
create policy payreq_select on payment_requests for select
  using (user_id = auth.uid() or is_admin());

drop policy if exists payreq_insert on payment_requests;
create policy payreq_insert on payment_requests for insert
  with check (user_id = auth.uid());

drop policy if exists payreq_admin_update on payment_requests;
create policy payreq_admin_update on payment_requests for update
  using (is_admin()) with check (is_admin());

drop policy if exists paysettings_read on payment_settings;
create policy paysettings_read on payment_settings for select using (true);

drop policy if exists paysettings_admin_write on payment_settings;
create policy paysettings_admin_write on payment_settings for all
  using (is_admin()) with check (is_admin());

-- Admins can read / update every student profile (for the control panel).
drop policy if exists admin_read_students on student_profiles;
create policy admin_read_students on student_profiles for select using (is_admin());
drop policy if exists admin_update_students on student_profiles;
create policy admin_update_students on student_profiles for update
  using (is_admin()) with check (is_admin());

-- Admins can read every profile (names, phone) for the users table.
drop policy if exists admin_read_profiles on profiles;
create policy admin_read_profiles on profiles for select using (is_admin());

-- Admins manage content (chapters / lessons / exams / exercises / questions …).
do $$
declare t text;
begin
  foreach t in array array['chapters','lessons','exams','exercises','questions','answer_options','solutions']
  loop
    execute format('drop policy if exists admin_write_%1$s on %1$s;', t);
    execute format('create policy admin_write_%1$s on %1$s for all using (is_admin()) with check (is_admin());', t);
  end loop;
end $$;

-- ---- Approve / reject (security definer: flips account + request) -----
create or replace function approve_payment(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_user uuid; v_program text;
begin
  if not is_admin() then raise exception 'not authorized'; end if;
  select user_id, program into v_user, v_program from payment_requests where id = p_id;
  if v_user is null then raise exception 'payment not found'; end if;

  update payment_requests
     set status = 'approved', reviewed_by = auth.uid(), reviewed_at = now(), admin_note = null
   where id = p_id;

  update student_profiles
     set status = 'active', program = coalesce(v_program, program), activated_at = now()
   where id = v_user;
end $$;

create or replace function reject_payment(p_id uuid, p_note text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'not authorized'; end if;
  update payment_requests
     set status = 'rejected', reviewed_by = auth.uid(), reviewed_at = now(), admin_note = p_note
   where id = p_id;
end $$;

-- Admin can suspend / reactivate an account directly.
create or replace function set_account_status(p_user uuid, p_status text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'not authorized'; end if;
  if p_status not in ('pending','active','suspended') then raise exception 'bad status'; end if;
  update student_profiles set status = p_status,
    activated_at = case when p_status = 'active' then coalesce(activated_at, now()) else activated_at end
   where id = p_user;
end $$;

-- ---- Private receipts bucket + storage policies ----------------------
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

drop policy if exists receipts_upload_own on storage.objects;
create policy receipts_upload_own on storage.objects for insert to authenticated
  with check (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists receipts_read_own_or_admin on storage.objects;
create policy receipts_read_own_or_admin on storage.objects for select to authenticated
  using (bucket_id = 'receipts' and ((storage.foldername(name))[1] = auth.uid()::text or is_admin()));
