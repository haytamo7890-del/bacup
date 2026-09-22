-- =====================================================================
--  0014 — Bibliothèque hardening: Storage-level guarantees.
--  The bucket itself now REJECTS anything that isn't a PDF, and any file
--  over 25 MB — enforced by Supabase Storage server-side, so a renamed
--  .exe / .html can't be stored even if the browser check is bypassed.
-- =====================================================================
update storage.buckets
set file_size_limit    = 26214400,                 -- 25 MB per file
    allowed_mime_types = array['application/pdf']   -- PDF only
where id = 'library';
