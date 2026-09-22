-- =====================================================================
--  0008 — Ensure the private 'receipts' bucket + policies exist.
--  Run this if receipts don't upload or admins can't open them. It is
--  idempotent and won't roll back anything else. If your SQL role can't
--  create storage.objects policies, it raises a NOTICE (not an error) —
--  in that case add the two policies in Dashboard → Storage → receipts.
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

do $$
begin
  drop policy if exists receipts_upload_own on storage.objects;
  create policy receipts_upload_own on storage.objects for insert to authenticated
    with check (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);

  drop policy if exists receipts_read_own_or_admin on storage.objects;
  create policy receipts_read_own_or_admin on storage.objects for select to authenticated
    using (bucket_id = 'receipts' and ((storage.foldername(name))[1] = auth.uid()::text or is_admin()));
exception when others then
  raise notice 'Could not create storage policies via SQL (%). Add them in Dashboard → Storage → receipts → Policies.', sqlerrm;
end $$;
