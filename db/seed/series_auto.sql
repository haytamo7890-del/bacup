-- Starter séries (bilans de chapitre · unités · mixtes BAC), rebuilt from the
-- chapter QCU banks. Idempotent. The logic lives in regenerate_auto_series()
-- (migration 0028) so the admin portal can run it too (/admin/preparation).
select regenerate_auto_series();
