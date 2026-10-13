-- =====================================================================
-- 0036 — Payments: Whop (card) + cash on delivery
--
--   orders.provider_session   Whop checkout configuration id (ch_…)
--   activate_full_access()    paid access: status active, founder (during the
--                             founder phase), access_until from app_settings
--   mark_order_paid()         called by the Whop webhook after the payment is
--                             re-checked with the Whop API. Idempotent.
--   mark_order_refunded()     refund webhook: order refunded, share cancelled,
--                             access removed (back to the free account)
-- All three run only with the service role (server), never from a browser.
-- =====================================================================

begin;

alter table orders add column if not exists provider_session text;
create index if not exists idx_orders_provider_session on orders(provider_session);

create or replace function activate_full_access(p_user uuid, p_code text) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_founder boolean := coalesce((select (value)::text::boolean from app_settings where key = 'founder_phase_open'), false);
  v_until   date    := coalesce((select (value #>> '{}')::date from app_settings where key = 'access_until'), date '2027-07-31');
begin
  update student_profiles sp
     set status           = 'active',
         activated_at     = coalesce(sp.activated_at, now()),
         founder          = sp.founder or v_founder,
         access_until     = greatest(coalesce(sp.access_until, v_until), v_until),
         program          = case (select l.code from levels l where l.id = sp.level_id) when '1bac' then 'bac1' else 'bac2' end,
         referred_by_code = coalesce(sp.referred_by_code, p_code)
   where sp.id = p_user;
end $$;

create or replace function mark_order_paid(
  p_order uuid, p_provider text, p_provider_ref text, p_amount numeric, p_currency text
) returns text
language plpgsql security definer set search_path = public as $$
declare
  o     orders%rowtype;
  v_amb uuid;
begin
  select * into o from orders where id = p_order for update;
  if not found then return 'not_found'; end if;
  if o.status = 'paid' then return 'already_paid'; end if;
  if o.method <> 'card' or o.status <> 'pending_payment' then return 'bad_status'; end if;
  if lower(coalesce(p_currency, '')) <> 'mad' or coalesce(p_amount, 0) < o.total then return 'amount_mismatch'; end if;

  update orders
     set status = 'paid', paid_at = now(), provider = p_provider, provider_ref = p_provider_ref, updated_at = now()
   where id = o.id;

  if o.user_id is not null then
    perform activate_full_access(o.user_id, o.promo_code);
  end if;

  select ambassador_id into v_amb from promo_codes where code = o.promo_code and type = 'ambassador';
  if v_amb is not null then
    insert into referral_sales (ambassador_id, order_id, source, via, status, counted_at)
    values (v_amb, o.id, o.ref_source, coalesce(o.ref_via, 'code'),
            case when v_amb = o.user_id then 'excluded_fraud' else 'pending' end, now())
    on conflict (order_id) do nothing;
  end if;
  return 'ok';
end $$;

create or replace function mark_order_refunded(p_provider text, p_provider_ref text) returns text
language plpgsql security definer set search_path = public as $$
declare o orders%rowtype;
begin
  select * into o from orders where provider = p_provider and provider_ref = p_provider_ref for update;
  if not found then return 'not_found'; end if;
  if o.status = 'refunded' then return 'already_refunded'; end if;

  update orders set status = 'refunded', updated_at = now() where id = o.id;
  -- an already paid-out share is clawed back by hand from the next payout
  update referral_sales set status = 'refunded' where order_id = o.id and status <> 'paid';

  if o.user_id is not null and not exists (
       select 1 from orders x where x.user_id = o.user_id and x.id <> o.id and x.status in ('paid', 'delivered_paid')) then
    update student_profiles
       set status = 'demo', founder = false, access_until = null
     where id = o.user_id;
  end if;
  return 'ok';
end $$;

revoke all on function activate_full_access(uuid, text) from public, anon, authenticated;
revoke all on function mark_order_paid(uuid, text, text, numeric, text) from public, anon, authenticated;
revoke all on function mark_order_refunded(text, text) from public, anon, authenticated;
grant execute on function activate_full_access(uuid, text) to service_role;
grant execute on function mark_order_paid(uuid, text, text, numeric, text) to service_role;
grant execute on function mark_order_refunded(text, text) to service_role;

commit;
