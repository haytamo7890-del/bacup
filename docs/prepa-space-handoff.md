# Espace de préparation — état actuel & plan (handoff)

> Written 2026-10-02 from a direct audit of the repo. Read this before building.
> The prep space is **already ~90% built** — do not re-create the data model.

## TL;DR
Backend, runner, spaced-repetition, mastery/XP, and the authored import pipeline
all exist. Build the **deltas**: dashboard surfacing, a dedicated error journal,
cours↔prépa polish — and author the exercise **content** (the real launch blocker).

## What already exists (verified in repo)
Migrations 0024–0029:
- `exercises → questions → answer_options`, notion-tagged (`questions.notion`,
  resolved via `src/config/notion-map.ts` / `src/lib/notions`)
- `series` / `series_items` / `series_progress` (`xp_bonus`, `is_published`, `kind`)
- `review_items` — Leitner-box spaced repetition (box 0–4, `due_at`): miss → box 0
  due now; hit climbs (1→+1d, 2→+3d, 3→+7d, 4 → learnt/removed)
- `attempts`, `chapter_mastery`, `xp_events`, `streaks`
- RPCs: `record_practice(p_answers, p_kind ∈ {notion,serie,review}, p_series)` →
  attempts + chapter_mastery + XP + streak + review-queue update, returns `review_due`;
  `import_prep_pack(p_pack, p_dry_run)`; `import_series`; `regenerate_auto_series()`

UI:
- `/dashboard/examens` — hub: subject → modes (Réviser par notion / Séries d'exercices /
  Examen Complet) → run
- `/dashboard/examens/pratique` — runner for `notion|serie|review`;
  `?review=all|<subjectCode>` = "À revoir aujourd'hui"; has an "Erreurs fréquentes" tab
- `/admin/exercices`, `/admin/preparation`, `/admin/import-cours`,
  `src/components/admin/prep/prep-import.tsx` — authoring/import

## Verified gaps (what to actually build)
1. **Dashboard surfacing (highest ROI).** Home screen surfaces none of the review
   engine. Add "À réviser aujourd'hui (N)" + "Mes erreurs (N)" banners (reuse
   `SubjectBanner`) deep-linking to `pratique?review=all` and the error journal.
   Add an RPC (e.g. `my_prep_stats`) returning due count + error count.
2. **Dedicated error journal page.** Today errors are only a tab inside a chapter run.
   Build `/dashboard/examens/erreurs`: questions whose latest attempt is wrong (or
   `review_items` with lapses), grouped subject → notion, with "rejouer mes erreurs"
   launching a review run of just those.
3. **Cours ↔ prépa integration.** Make "M'entraîner sur cette notion" prominent on
   each cours notion (funnel exists via notion slugs); add "Revoir le cours" from an
   exercise correction; seed/weight review from cours completion.
4. **Review UX completeness.** Ensure a cross-subject review run is reachable and the
   dashboard deep-links to it; consider per-notion due counts.
5. **CONTENT — the real launch blocker.** Pipeline is built but thin/empty. Author QCU
   exercises per notion for the **PC beachhead** (then SVT) via `import_prep_pack`.
   Deliver an exercises scaffold JSON (real UUIDs, by notion) for the cofounder — same
   scaffold-fill workflow as cours.

## Build order (new conversation)
1. **Audit live DB vs migrations** — confirm 0024–0029 are applied and report row
   counts for exercises/questions/series/review_items. (Remember the `ai_usage` lesson:
   a migration in the repo ≠ applied to the live DB.)
2. Dashboard banners (`review_due` + errors) via `my_prep_stats`, reusing `SubjectBanner`.
3. Error-journal page + "rejouer mes erreurs".
4. Cours notion → "m'entraîner" CTA + correction → cours backlink.
5. Content: exercises scaffold per notion (PC first) → `import_prep_pack` dry-run →
   load → verify byte-exact.
6. Typecheck + lock-aside atomic commit (standard attribution lines).

## Decisions locked (2026-10-02)
- Exercise source: **authored via /admin** (`import_prep_pack`).
- Scope: **all three** (prep polish + spaced-rep surfacing + error journal).
- Build in a **new conversation** (start from the desktop app, hsgenius connected).

## First prompt for the new conversation
Continue Bac Up's Espace de préparation. It's largely built (migrations 0024–0029:
exercises/questions/series/review_items + record_practice/import_prep_pack). First
audit the live DB vs these migrations and report row counts. Then build the gaps:
dashboard "À réviser aujourd'hui" + "Mes erreurs" banners (reuse SubjectBanner), a
dedicated error-journal page with "rejouer mes erreurs", and the cours → "m'entraîner
par notion" CTA. Then produce an exercises scaffold JSON (real UUIDs, by notion, PC
first) for authored content via import_prep_pack. Typecheck + commit with the
lock-aside pattern.
