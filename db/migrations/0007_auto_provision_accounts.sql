-- =====================================================================
--  0007 — Auto-provision accounts on signup (email OR Google).
--  A trigger creates the profiles + student_profiles rows the moment an
--  auth user is created, so every path (password or OAuth) always has a
--  row. This removes race conditions and the "Google sends me back to
--  login" class of bugs. Idempotent.
-- =====================================================================

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, role, display_name, phone)
  values (
    new.id,
    'student',
    coalesce(
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;

  insert into student_profiles (id, status)
  values (new.id, 'pending')
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Backfill: make sure any EXISTING auth user has both rows too.
insert into profiles (id, role, display_name)
select u.id, 'student', split_part(u.email, '@', 1)
from auth.users u
left join profiles p on p.id = u.id
where p.id is null;

insert into student_profiles (id, status)
select u.id, 'pending'
from auth.users u
left join student_profiles s on s.id = u.id
where s.id is null;
