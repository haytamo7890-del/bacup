-- =====================================================================
--  0019 — Admin: secure role promotion (only admins can promote/demote).
--  Powers the "Passer en admin" button on a student profile.
--  Run in Supabase → SQL Editor.
-- =====================================================================

create or replace function set_user_role(p_user uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- only an admin may change roles
  if not exists (select 1 from profiles where id = auth.uid() and role = 'admin') then
    raise exception 'not authorized';
  end if;
  if p_role not in ('student', 'admin') then
    raise exception 'bad role';
  end if;
  update profiles set role = p_role where id = p_user;
end;
$$;

grant execute on function set_user_role(uuid, text) to authenticated;
