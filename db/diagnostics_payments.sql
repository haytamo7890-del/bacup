-- Run this in Supabase → SQL Editor to see why payments/receipts may be missing.
-- Read the output rows top to bottom.

-- 1) Do the tables exist?
select 'payment_requests exists' as check,
       to_regclass('public.payment_requests') is not null as ok;
select 'payment_settings exists' as check,
       to_regclass('public.payment_settings') is not null as ok;

-- 2) Does the receipts bucket exist?
select 'receipts bucket exists' as check,
       exists(select 1 from storage.buckets where id = 'receipts') as ok;

-- 3) How many payment requests exist, by status?
select status, count(*) from public.payment_requests group by status;

-- 4) Are you an admin? (must return your row with role = admin)
select id, role, display_name from public.profiles where role = 'admin';

-- 5) The latest 5 payment requests (raw), to confirm rows are really there:
select id, user_id, status, method, full_name, receipt_path, created_at
from public.payment_requests
order by created_at desc
limit 5;
