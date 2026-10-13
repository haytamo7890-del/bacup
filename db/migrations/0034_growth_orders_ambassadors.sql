-- =====================================================================
-- 0034 — Bac Up growth layer (handoff 2026-10: landing, onboarding,
--        ambassador program)
--
--   1. Privilege guards (fix): a signed-in user could
--        - set profiles.role = 'admin' on their own row  (own_profile_update)
--        - set student_profiles.status = 'active' on their own row
--      Both are now blocked by BEFORE triggers. SECURITY DEFINER functions
--      (start_demo, claim_partner_access, handle_new_user, admin RPCs) and
--      the service role are unaffected.
--   2. Carte élève fields on student_profiles (+ sequential member number).
--   3. app_settings          — values the team edits (founder bar, hero count…)
--   4. orders                — card / cash on delivery, server-computed totals
--   5. activation_cards      — scratch codes for COD (CSV batches)
--   6. ambassadors (+ payout accounts), promo_codes, reserved_codes,
--      referral_sales, ambassador_bonuses, payouts, link_clicks,
--      ambassador_missions
--   7. community_requests    — landing community form
--   8. RPCs: ambassador_code_available, validate_promo, ensure_member_number
--
-- Prices/discounts stay in src/config (server recomputes every total).
-- Additive only: no column or table is dropped. Safe to re-run.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. Privilege guards
--    SECURITY INVOKER on purpose: current_user is 'authenticated' for
--    browser calls, and the function owner inside SECURITY DEFINER RPCs.
-- ---------------------------------------------------------------------
create or replace function guard_profile_role() returns trigger
language plpgsql set search_path = public as $$
begin
  if current_user in ('authenticated', 'anon') and not is_admin() then
    if tg_op = 'INSERT' then
      new.role := 'student';
    elsif new.role is distinct from old.role then
      new.role := old.role;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_guard_profile_role on profiles;
create trigger trg_guard_profile_role before insert or update on profiles
  for each row execute function guard_profile_role();

-- ---------------------------------------------------------------------
-- 2. Carte élève fields
-- ---------------------------------------------------------------------
alter table student_profiles add column if not exists pseudo           text;
alter table student_profiles add column if not exists avatar_key       text;
alter table student_profiles add column if not exists photo_url        text;
alter table student_profiles add column if not exists average_now      numeric(3,1);
alter table student_profiles add column if not exists goal             text;
alter table student_profiles add column if not exists dream_school     text;
alter table student_profiles add column if not exists member_number    integer;
alter table student_profiles add column if not exists founder          boolean not null default false;
alter table student_profiles add column if not exists access_until     date;
alter table student_profiles add column if not exists referred_by_code text;

alter table student_profiles drop constraint if exists sp_pseudo_len;
alter table student_profiles add constraint sp_pseudo_len check (pseudo is null or char_length(pseudo) between 1 and 18);
alter table student_profiles drop constraint if exists sp_avatar_key;
alter table student_profiles add constraint sp_avatar_key check (avatar_key is null or avatar_key in
  ('laureat','couronne','flamme','fusee','eclair','bouclier','diamant','etoile'));
alter table student_profiles drop constraint if exists sp_average_range;
alter table student_profiles add constraint sp_average_range check (average_now is null or average_now between 0 and 20);
create unique index if not exists uq_student_member_number on student_profiles(member_number);

-- Member numbers: sequential, assigned at account creation (no column
-- default, so client upserts never burn numbers). Backfill by sign-up date.
create sequence if not exists member_number_seq start 1;

with ordered as (
  select sp.id, row_number() over (order by p.created_at, sp.id) as n
    from student_profiles sp join profiles p on p.id = sp.id
   where sp.member_number is null
)
update student_profiles sp
   set member_number = o.n + coalesce((select max(member_number) from student_profiles), 0)
  from ordered o where o.id = sp.id;

select setval('member_number_seq', greatest(coalesce((select max(member_number) from student_profiles), 0), 1),
              (select count(*) > 0 from student_profiles where member_number is not null));

-- Students who already paid become Membres Fondateurs, access to 31 Jul 2027.
update student_profiles
   set founder = true, access_until = coalesce(access_until, date '2027-07-31')
 where status = 'active';

create or replace function guard_student_profile() returns trigger
language plpgsql set search_path = public as $$
begin
  if current_user in ('authenticated', 'anon') and not is_admin() then
    if tg_op = 'INSERT' then
      if new.status is null or new.status not in ('pending', 'demo') then new.status := 'pending'; end if;
      new.program := null; new.activated_at := null;
      new.founder := false; new.access_until := null;
      new.member_number := null; new.referred_by_code := null;
    else
      -- free <-> pending only; paid / suspended are set by RPCs or admins
      if not (old.status in ('pending', 'demo') and new.status in ('pending', 'demo')) then
        new.status := old.status;
      end if;
      new.program          := old.program;
      new.activated_at     := old.activated_at;
      new.founder          := old.founder;
      new.access_until     := old.access_until;
      new.member_number    := old.member_number;
      new.referred_by_code := old.referred_by_code;
    end if;
  elsif tg_op = 'INSERT' and new.member_number is null then
    new.member_number := nextval('member_number_seq');
  end if;
  return new;
end $$;

drop trigger if exists trg_guard_student_profile on student_profiles;
create trigger trg_guard_student_profile before insert or update on student_profiles
  for each row execute function guard_student_profile();

-- For rows created by the browser (no number yet): give one, once.
create or replace function ensure_member_number() returns integer
language plpgsql security definer set search_path = public as $$
declare v integer;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select member_number into v from student_profiles where id = auth.uid();
  if v is null then
    update student_profiles set member_number = nextval('member_number_seq')
     where id = auth.uid() and member_number is null
     returning member_number into v;
  end if;
  return v;
end $$;
revoke all on function ensure_member_number() from public, anon;
grant execute on function ensure_member_number() to authenticated;

-- ---------------------------------------------------------------------
-- 3. app_settings — public read, admin write
-- ---------------------------------------------------------------------
create table if not exists app_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);
alter table app_settings enable row level security;
drop policy if exists app_settings_read on app_settings;
create policy app_settings_read on app_settings for select using (true);
drop policy if exists app_settings_admin on app_settings;
create policy app_settings_admin on app_settings for all using (is_admin()) with check (is_admin());

insert into app_settings (key, value) values
  ('founder_pct',        '80'),
  ('founder_phase_open', 'true'),
  ('students_display',   '1002'),
  ('access_until',       '"2027-07-31"'),
  ('bac_date',           '"2027-06-01"'),
  ('cod_carrier',        '"Big Delivery"'),
  ('cod_max_attempts',   '2')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------
-- 6a. Ambassadors (created before promo_codes/orders that reference them)
-- ---------------------------------------------------------------------
create table if not exists ambassadors (
  user_id             uuid primary key references auth.users(id) on delete restrict,
  pseudo              text not null check (char_length(pseudo) between 1 and 18),
  avatar_key          text,
  photo_url           text,
  code                text not null unique check (code ~ '^[A-Z0-9]{4,12}$'),  -- without "BAC-"
  city                text,
  profile             text,
  audience            text,
  channels            text[] not null default '{}',
  age_group           text not null check (age_group in ('minor', 'adult')),
  charter_accepted_at timestamptz not null,
  status              text not null default 'pending_review'
                      check (status in ('pending_review', 'active', 'suspended', 'blocked')),
  reviewed_by         uuid references auth.users(id),
  reviewed_at         timestamptz,
  review_note         text,
  created_at          timestamptz not null default now()
);
create index if not exists idx_ambassadors_status on ambassadors(status, created_at desc);
create index if not exists idx_ambassadors_reviewed_by on ambassadors(reviewed_by);
alter table ambassadors enable row level security;
drop policy if exists amb_own_read on ambassadors;
create policy amb_own_read on ambassadors for select using (user_id = auth.uid() or is_admin());
drop policy if exists amb_admin_write on ambassadors;
create policy amb_admin_write on ambassadors for all using (is_admin()) with check (is_admin());
-- Creation goes through the server (service role) after validation.

create table if not exists ambassador_payout_accounts (
  user_id           uuid primary key references ambassadors(user_id) on delete cascade,
  holder            text not null,
  bank              text not null,
  cin               text not null,
  rib               text not null check (rib ~ '^[0-9]{24}$'),
  parent_phone      text,
  parent_consent_at timestamptz,
  updated_at        timestamptz not null default now()
);
alter table ambassador_payout_accounts enable row level security;
drop policy if exists apa_own on ambassador_payout_accounts;
create policy apa_own on ambassador_payout_accounts for all
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

-- ---------------------------------------------------------------------
-- 6b. Codes
-- ---------------------------------------------------------------------
create table if not exists reserved_codes (code text primary key);
alter table reserved_codes enable row level security;
drop policy if exists reserved_admin on reserved_codes;
create policy reserved_admin on reserved_codes for all using (is_admin()) with check (is_admin());
insert into reserved_codes (code) values
  ('BACUP'),('BACUPMA'),('ADMIN'),('ADMINS'),('SUPPORT'),('HSGENIUS'),('GENIUS'),('OFFICIEL'),
  ('OFFICIAL'),('STAFF'),('TEAM'),('EQUIPE'),('PROMO'),('GRATUIT'),('FREE'),('TEST'),('DEMO'),
  ('FONDATEUR'),('FOUNDER'),('AMBASSADEUR'),('MINISTERE'),('BAC2027'),('BAC2026')
on conflict do nothing;

create table if not exists promo_codes (
  code          text primary key check (code ~ '^[A-Z0-9]{4,12}$'),
  type          text not null check (type in ('ambassador', 'promo')),
  ambassador_id uuid references ambassadors(user_id) on delete restrict,
  discount      integer not null default 20 check (discount between 0 and 250),
  active        boolean not null default false,
  max_uses      integer,
  created_at    timestamptz not null default now(),
  check ((type = 'ambassador') = (ambassador_id is not null))
);
create index if not exists idx_promo_ambassador on promo_codes(ambassador_id);
alter table promo_codes enable row level security;
drop policy if exists promo_own_read on promo_codes;
create policy promo_own_read on promo_codes for select using (ambassador_id = auth.uid() or is_admin());
drop policy if exists promo_admin on promo_codes;
create policy promo_admin on promo_codes for all using (is_admin()) with check (is_admin());

-- Normalise what people type: "bac-haytam", "BAC HAYTAM" -> "HAYTAM"
create or replace function normalize_code(p text) returns text
language sql immutable set search_path = public as $$
  select regexp_replace(regexp_replace(upper(coalesce(p, '')), '^BAC[-\s]+', ''), '[^A-Z0-9]', '', 'g');
$$;

create or replace function ambassador_code_available(p_code text) returns boolean
language sql stable security definer set search_path = public as $$
  with c as (select normalize_code(p_code) as code)
  select c.code ~ '^[A-Z0-9]{4,12}$'
     and not exists (select 1 from reserved_codes r where r.code = c.code)
     and not exists (select 1 from promo_codes p where p.code = c.code)
     and not exists (select 1 from ambassadors a where a.code = c.code)
  from c;
$$;
grant execute on function ambassador_code_available(text) to anon, authenticated;

-- Public check used by the checkout. Only active codes of active ambassadors.
create or replace function validate_promo(p_code text)
returns table (code text, discount integer, ambassador_pseudo text)
language sql stable security definer set search_path = public as $$
  select p.code, p.discount, a.pseudo
    from promo_codes p
    left join ambassadors a on a.user_id = p.ambassador_id
   where p.code = normalize_code(p_code)
     and p.active
     and (p.type = 'promo' or a.status = 'active');
$$;
grant execute on function validate_promo(text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 4. Orders
-- ---------------------------------------------------------------------
create or replace function gen_order_ref() returns text
language plpgsql volatile set search_path = public as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  r text;
begin
  loop
    r := 'BU-';
    for k in 1..6 loop
      r := r || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from orders where ref = r);
  end loop;
  return r;
end $$;

create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  ref               text not null unique,
  user_id           uuid references auth.users(id) on delete set null,
  method            text not null check (method in ('card', 'cod')),
  provider          text,                      -- 'whop' | 'tijaripay' (card)
  provider_ref      text,
  price             integer not null check (price >= 0),
  discount          integer not null default 0 check (discount >= 0),
  delivery_fee      integer not null default 0 check (delivery_fee >= 0),
  total             integer generated always as (price - discount + delivery_fee) stored,
  promo_code        text references promo_codes(code) on delete restrict,
  ref_source        text,                      -- ?src= of the ambassador link
  ref_via           text check (ref_via in ('code', 'link')),
  status            text not null default 'pending_payment' check (status in (
                      'pending_payment', 'paid', 'cod_to_confirm', 'cod_confirmed', 'shipped',
                      'delivered_paid', 'delivery_refused', 'refunded', 'cancelled')),
  phone             text,
  city              text,
  address           text,
  delivery_attempts integer not null default 0,
  admin_note        text,
  paid_at           timestamptz,
  cash_received_at  timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  check (method = 'card' or (phone is not null and city is not null and address is not null))
);
alter table orders alter column ref set default gen_order_ref();
create index if not exists idx_orders_user on orders(user_id, created_at desc);
create index if not exists idx_orders_status on orders(status, created_at desc);
create index if not exists idx_orders_promo on orders(promo_code);
create unique index if not exists uq_orders_provider_ref on orders(provider, provider_ref) where provider_ref is not null;
alter table orders enable row level security;
drop policy if exists orders_own_read on orders;
create policy orders_own_read on orders for select using (user_id = auth.uid() or is_admin());
drop policy if exists orders_admin on orders;
create policy orders_admin on orders for all using (is_admin()) with check (is_admin());
-- Orders are created by the server only (totals recomputed from src/config).

-- ---------------------------------------------------------------------
-- 5. Activation cards (COD scratch codes)
-- ---------------------------------------------------------------------
create table if not exists activation_cards (
  code        text primary key check (code ~ '^BU-[A-Z0-9]{4}-[A-Z0-9]{4}$'),
  batch       text not null,
  order_id    uuid references orders(id) on delete set null,
  redeemed_by uuid references auth.users(id) on delete set null,
  redeemed_at timestamptz,
  disabled    boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists idx_cards_batch on activation_cards(batch);
create index if not exists idx_cards_order on activation_cards(order_id);
create index if not exists idx_cards_redeemed_by on activation_cards(redeemed_by);
alter table activation_cards enable row level security;
drop policy if exists cards_admin on activation_cards;
create policy cards_admin on activation_cards for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------
-- 6c. Sales, bonuses, payouts, clicks, missions
-- ---------------------------------------------------------------------
create table if not exists payouts (
  id            uuid primary key default gen_random_uuid(),
  ambassador_id uuid not null references ambassadors(user_id) on delete restrict,
  amount        integer not null check (amount > 0),
  period        date not null,                 -- first day of the month paid
  status        text not null default 'scheduled' check (status in ('scheduled', 'sent', 'failed')),
  rib_last4     text,
  sent_at       timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists idx_payouts_amb on payouts(ambassador_id, period desc);
alter table payouts enable row level security;
drop policy if exists payouts_own_read on payouts;
create policy payouts_own_read on payouts for select using (ambassador_id = auth.uid() or is_admin());
drop policy if exists payouts_admin on payouts;
create policy payouts_admin on payouts for all using (is_admin()) with check (is_admin());

create table if not exists referral_sales (
  id            uuid primary key default gen_random_uuid(),
  ambassador_id uuid not null references ambassadors(user_id) on delete restrict,
  order_id      uuid not null unique references orders(id) on delete restrict,
  share         integer not null default 30,
  source        text,
  via           text not null default 'code' check (via in ('code', 'link')),
  status        text not null default 'in_delivery' check (status in (
                  'in_delivery', 'pending', 'validated', 'paid', 'refunded',
                  'delivery_refused', 'excluded_fraud')),
  counted_at    timestamptz,                   -- card: paid_at · COD: cash_received_at
  validated_at  timestamptz,
  payout_id     uuid references payouts(id) on delete set null,
  created_at    timestamptz not null default now()
);
create index if not exists idx_sales_amb on referral_sales(ambassador_id, created_at desc);
create index if not exists idx_sales_status on referral_sales(status, counted_at);
create index if not exists idx_sales_payout on referral_sales(payout_id);
alter table referral_sales enable row level security;
drop policy if exists sales_own_read on referral_sales;
create policy sales_own_read on referral_sales for select using (ambassador_id = auth.uid() or is_admin());
drop policy if exists sales_admin on referral_sales;
create policy sales_admin on referral_sales for all using (is_admin()) with check (is_admin());

create table if not exists ambassador_bonuses (
  id            uuid primary key default gen_random_uuid(),
  ambassador_id uuid not null references ambassadors(user_id) on delete restrict,
  type          text not null check (type in ('level_or', 'level_platinum', 'level_50', 'race_1', 'race_2', 'race_3')),
  amount        integer not null check (amount > 0),
  month         date,                          -- race bonuses only
  status        text not null default 'pending' check (status in ('pending', 'validated', 'paid', 'cancelled')),
  payout_id     uuid references payouts(id) on delete set null,
  created_at    timestamptz not null default now(),
  unique nulls not distinct (ambassador_id, type, month)
);
create index if not exists idx_bonuses_payout on ambassador_bonuses(payout_id);
alter table ambassador_bonuses enable row level security;
drop policy if exists bonuses_own_read on ambassador_bonuses;
create policy bonuses_own_read on ambassador_bonuses for select using (ambassador_id = auth.uid() or is_admin());
drop policy if exists bonuses_admin on ambassador_bonuses;
create policy bonuses_admin on ambassador_bonuses for all using (is_admin()) with check (is_admin());

create table if not exists link_clicks (
  id                bigint generated always as identity primary key,
  ambassador_code   text not null,
  src               text,
  path              text,
  session_id        text,
  signed_up_user_id uuid references auth.users(id) on delete set null,
  visited_at        timestamptz not null default now()
);
create index if not exists idx_clicks_code on link_clicks(ambassador_code, visited_at desc);
create index if not exists idx_clicks_user on link_clicks(signed_up_user_id);
alter table link_clicks enable row level security;
drop policy if exists clicks_admin on link_clicks;
create policy clicks_admin on link_clicks for select using (is_admin());
-- Written by the server (service role); ambassadors read aggregates via the stats API.

create table if not exists ambassador_missions (
  ambassador_id uuid not null references ambassadors(user_id) on delete cascade,
  mission_key   text not null,
  done_at       timestamptz not null default now(),
  primary key (ambassador_id, mission_key)
);
alter table ambassador_missions enable row level security;
drop policy if exists missions_own_read on ambassador_missions;
create policy missions_own_read on ambassador_missions for select using (ambassador_id = auth.uid() or is_admin());
drop policy if exists missions_admin on ambassador_missions;
create policy missions_admin on ambassador_missions for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------
-- 7. Community requests (landing form)
-- ---------------------------------------------------------------------
create table if not exists community_requests (
  id         uuid primary key default gen_random_uuid(),
  first_name text not null,
  city       text,
  stream     text,
  whatsapp   text,
  email      text,
  consent    boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_community_created on community_requests(created_at desc);
alter table community_requests enable row level security;
drop policy if exists community_admin on community_requests;
create policy community_admin on community_requests for select using (is_admin());
-- Inserted by the server (service role) after validation.

-- student_profiles.referred_by_code -> promo_codes (first code used)
alter table student_profiles drop constraint if exists sp_referred_by_code_fk;
alter table student_profiles add constraint sp_referred_by_code_fk
  foreign key (referred_by_code) references promo_codes(code) on delete set null;
create index if not exists idx_sp_referred_by on student_profiles(referred_by_code);

commit;
