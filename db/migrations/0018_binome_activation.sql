-- =====================================================================
--  0018 — Binôme activation (one payment → two active profiles)
--
--  Flow:
--   1) Payer signs up via /signup/binome, entering the partner (email + niveau
--      + filière). A binome_pairs row is created (paid=false).
--   2) Payer pays; admin approves the payment_request → trigger marks the pair
--      paid=true (payer is activated by the existing approve_payment).
--   3) Partner signs up normally with THAT email. On their next auth redirect,
--      the app calls claim_partner_access(): if their email matches a paid pair,
--      their profile is created/activated with the stored niveau + filière.
--
--  (Auth users can't be created from SQL, so the partner self-claims on login —
--   like redeeming a code, but automatic by email.)
--  Run in Supabase → SQL Editor (after 0017).
-- =====================================================================

create extension if not exists pg_net;

-- On payment approval: mark the payer's binôme pair paid + email the partner
-- so they know to create their account (with that email) and self-activate.
create or replace function mark_binome_paid()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  r      record;
  v_key  text;
  v_from text := 'Bac Up <onboarding@resend.dev>';
  v_app  text := 'https://bacup.ma';
begin
  if new.status = 'approved' and old.status is distinct from 'approved' then
    select decrypted_secret into v_key from vault.decrypted_secrets where name = 'resend_api_key';
    for r in select * from binome_pairs where payer_id = new.user_id and paid = false loop
      update binome_pairs set paid = true where id = r.id;
      if v_key is not null and r.partner_email is not null then
        perform net.http_post(
          url     := 'https://api.resend.com/emails',
          headers := jsonb_build_object('Authorization', 'Bearer ' || v_key, 'Content-Type', 'application/json'),
          body    := jsonb_build_object(
            'from', v_from, 'to', r.partner_email,
            'subject', 'Ton binôme t''a activé Bac Up 🎉',
            'html',
              '<div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:auto;color:#0f172a">'
              || '<h2 style="margin:0 0 8px">Bonne nouvelle ' || coalesce(r.partner_name, '') || ' 👋</h2>'
              || '<p style="color:#475569;line-height:1.6">Ton binôme a réglé le Pack Bac Up pour vous deux. '
              || 'Crée ton compte avec <b>cet email</b> pour débloquer ton accès complet automatiquement.</p>'
              || '<a href="' || v_app || '/signup" style="display:inline-block;background:#1b7fdc;color:#fff;'
              || 'padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600;margin-top:8px">Créer mon compte →</a>'
              || '<p style="color:#94a3b8;font-size:12px;margin-top:24px">Bac Up · HSGenius</p></div>'
          )
        );
      end if;
    end loop;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_binome_paid on payment_requests;
create trigger trg_binome_paid
  after update on payment_requests
  for each row execute function mark_binome_paid();

-- Partner self-activation: if the caller's email matches a paid pair, provision
-- + activate their profile with the niveau/filière the payer chose.
create or replace function claim_partner_access()
returns boolean language plpgsql security definer set search_path = public, auth as $$
declare
  v_email text;
  v_pair  binome_pairs%rowtype;
  v_level uuid;
  v_track uuid;
begin
  select email into v_email from auth.users where id = auth.uid();
  if v_email is null then return false; end if;

  select * into v_pair from binome_pairs
    where lower(partner_email) = lower(v_email) and paid = true and partner_id is null
    order by created_at desc limit 1;
  if v_pair.id is null then return false; end if;

  select id into v_level from levels where code = v_pair.partner_level limit 1;
  select id into v_track from tracks where code = v_pair.partner_track limit 1;

  insert into student_profiles (id, level_id, track_id, status, quiz_done, binome_group, binome_role)
    values (auth.uid(), v_level, v_track, 'active', true, v_pair.id, 'partner')
  on conflict (id) do update set
    level_id  = coalesce(student_profiles.level_id, excluded.level_id),
    track_id  = coalesce(student_profiles.track_id, excluded.track_id),
    status    = 'active',
    quiz_done = true,
    binome_group = v_pair.id,
    binome_role  = 'partner';

  update binome_pairs set partner_id = auth.uid() where id = v_pair.id;
  return true;
end;
$$;

grant execute on function claim_partner_access() to authenticated;
