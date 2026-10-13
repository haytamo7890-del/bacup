# CLAUDE.md — Bac-up project context

> Read this first. It orients you on the project, conventions, current state, and what's next.
> Deeper docs: `ARCHITECTURE.md` (engineering blueprint), `docs/product-spec.md`, `docs/plan-day1.md`.

## What this is
**Bac-up** — an AI-powered BAC-prep app for Moroccan students. Two parts (chosen on the landing):
`1bac-up` (régional) and `2bac-up` (national). Science filières: Sciences Maths A/B, Sciences Physiques (PC), SVT.
Core = a **timed QCU exam engine** (past sujets + examens blancs) with **/20 scoring**, **detailed corrections**,
an **AI explain layer** (5 modes), an **AI coach**, and **gamification** (XP, streak, mastery, note estimée).
Design: **Arctic-glass**, dark default, French UI. Company = HSGenius; consumer product = Bac-up.

## Stack
Next.js 16 (App Router) · TypeScript (strict) · Tailwind v4 · Supabase (Postgres + Auth + RLS) ·
KaTeX (math) · next-themes · lucide-react · Anthropic SDK (AI).

## Project layout
```
src/app/                route (App Router)
  (dashboard) …         /dashboard, /dashboard/examens (exam engine), /dashboard/coach
  api/explain, api/coach  server routes calling the AI gateway
src/components/         UI (dashboard/sidebar, topbar, coach-avatar, math, theme-*)
src/lib/                supabase clients, ai/gateway.ts (the ONLY place models are called)
src/config/             pricing, tiers, limits, feature flags (no hardcoded config elsewhere)
db/migrations/          SQL migrations (0001 schema … 0028 prep content packs) — run in Supabase SQL editor
db/seed/                idempotent content seed batches (cours enrichment, QCU banks)
data/                   exam content JSON (loaded by the import script)
scripts/                import-content.mjs, generate-explanations.mjs
docs/                   product-spec.md, plan-day1.md, erd.mermaid
```

## How to run things
- Dev: `npm run dev` (http://localhost:3000). Log in at /login.
- Migrations: open the `.sql` in `db/migrations`, paste into **Supabase → SQL Editor → Run** (no CLI migration tool set up).
- Import exam content: `npm run import:content data/<file>.json` (format in `data/_template.json`).
- Pre-generate stored explanations: `npm run generate:explanations`.
- Env: `.env.local` (git-ignored). Needs Supabase URL/anon/secret + `ANTHROPIC_API_KEY`. **AI features need credits on the Anthropic account.**

## Conventions & rules (do not break)
- **AI only through `src/lib/ai/gateway.ts`** — never call the Anthropic SDK from a feature.
- **Config in `src/config`** — never hardcode prices/limits/prompts inline.
- **Secrets only in `.env.local`** — never in client code, never committed. Only `NEXT_PUBLIC_*` reach the browser.
- **RLS on every table.** Students see only their own rows. Content tables are public-read. (See migrations 0002.)
- **Math**: render any text that may contain LaTeX with `<Math>{...}</Math>` (`src/components/math.tsx`), using `$...$` inline delimiters.
- **Content/IP**: official past sujets are public (OK). **Corrigés**: we take the *answers/methods* from the reference corrigés we hold (facts about public exams — not copyrightable), then **re-express them in our own words, verify them for correctness, and brand them Bac-up (author `hsgenius`)**. Never ship a third party's verbatim wording, layout, or logo. Re-expressed + verified = legally safe AND the moat.
- **Design**: Arctic-glass (`.glass` utility, `arctic-*` colors), dark-first, French copy, minimal + premium.
- **No emoji anywhere in the UI or copy** (incl. ✓ ✗ ⚠ ✨ in strings) and **no `Sparkles` icon**. Use a lucide/Bac-up icon or plain words. Design direction: see the "Bac-up UI Reset" artifact (calm trays + white cards, one accent, no glass/gradients).
- Keep PRs/changes small and verifiable; TS strict, no `any` where avoidable, no `SELECT *`.

## Current state (built)
- Auth: signup (email + filière/niveau → profile) · login · dashboard shell (collapsible glass sidebar, topbar).
- Design system: Arctic-glass, light+dark, Inter, `.glass`, palette.
- **Dashboard (Aperçu): wired to REAL data** — ranking, précision, série, XP/niveau, mastery rings.
- Coach (`/dashboard/coach`): avatar + "Analyse ma performance" → `/api/coach` (AI).
- **Exam engine** (`/dashboard/examens`): subject → real exams → timed QCU run → results **/20** + detailed
  corrections + **5-mode AI menu** (`/api/explain`). **Persists results** via the `record_exam` RPC → attempts,
  XP, mastery and streaks are saved (Block C is DONE). Also modes: exercices aléatoires, adaptatif.
- **Annales** (`/dashboard/annales`): past papers per filière, in-app PDF reader, corrigés, admin manager.
- **Cours** (`/dashboard/cours`): rich renderer — `##` sections, `:::callout` fences (FR/EN/AR kinds), `$…$`/`$$…$$`
  math, markdown tables, named SVG figures via `[[fig:NAME]]` (`src/components/course/figures.tsx`), and per-section
  practice **funnels**. Content across Maths, PC, SVT, SI, Anglais and Philo (Arabic, RTL). Dept/unit grouping.
- **QCU banks (~6,660 questions across all tracks, as of 2026-10-06):** every question tagged with a `notion` = a cours `##` heading; funnels filter to
  that notion only (maths via `notionSlug` in `src/config/notion-map.ts`; other subjects via text-overlap in
  `src/app/dashboard/cours/page.tsx` `selectForNotion`). Answers **randomly shuffled** each open
  (`src/components/course/practice-quiz.tsx`, Fisher–Yates). Funnel CTA hidden on sections with no questions
  (`canPractice`). Every content section has ≥1 QCU.
- **Subject-name typography:** `SubjectName` in `src/components/subject-pad.tsx` — Yellowtail brush + SVG swash
  underline (`.subject-title` / `.subject-swash` in `globals.css`), used on cours/annales/exam/dashboard. Arabic
  falls back to Aref Ruqaa. Fonts loaded in `src/app/layout.tsx` via `next/font`.
- **Espace de préparation** (`/dashboard/examens/preparation`): hub → `/preparation/<subject>?mode=notion|series|examens`
- **Review surfacing + error journal (0030)**: `my_prep_stats()` (due + errors per subject) feeds `<PrepAlerts>` (dashboard home, prep hub, subject page); `my_errors(p_subject)` = questions whose latest attempt is wrong → `/dashboard/examens/erreurs`; replay via `pratique?errors=<subject|all>[&chapter=<id|__exam>&notion=<heading|__autres>]` (kind `review`). `0030b`: record_exam also feeds review_items. Cours notions show « M'entraîner sur cette notion » (→ prep runner) + « Test rapide »; wrong answers in the runner link « Revoir le cours ».
  → runner `/dashboard/examens/pratique?chapter=&notion=` | `?serie=`. Same taxonomy as the cours: notions = lesson `##`
  headings, grouped by ONE resolver `groupByNotion` in `src/lib/notions.ts` (also used by cours funnels). Progress via
  `record_practice` RPC (attempts + chapter_mastery + XP `prep_*` + streak + `series_progress`, one-time série bonus ≥70 %).
  Data layer `src/lib/prep.ts`. Examens tab reuses the session runner unchanged (chapter "— QCU" banks hidden there).
- **Séries**: tables `series` / `series_items` / `series_progress` (0027). Auto séries (`auto:*` slugs: bilans, unités,
  mixtes) rebuilt by `regenerate_auto_series()`; hand-made ones = `kind='custom'`.
- **Prep content = JSON packs** `bacup.prep/v1` (spec `docs/content-packs.md`, template `data/_prep-pack-template.json`),
  imported via **/admin/preparation** (Import JSON · Séries · Couverture/export) or `npm run import:prep` →
  `import_prep_pack(pack, dry_run)` (0028). `ref` / `id` make re-imports update in place.
- **Notion tags = exact cours headings** (2026-09-30 retag, `db/seed/notion_retag_20260930.sql`; old values in
  `questions_notion_backup_20260930`). Maths chapter banks restored from `db/seed/exercise_bank_batch1.sql` as packs
  `content/prep/maths-2bac-*-banque1.json` (6 original QCU per chapter — thin, needs more content).
- **Prep v2 (0029)**: guided BAC problems (`exercises.kind='probleme'`, `figure`, `origin`), `questions.hint/methode/difficulty/part`,
  `answer_options.why`; notion mastery ladder (`notionLevel` in `src/lib/prep.ts`: À découvrir → En cours → Acquis → Maîtrisé →
  Niveau BAC); spaced review `review_items` (Leitner 0→1d→3d→7d, fed by `record_practice`, runner `?review=<subject|all>`).
  Content brief for the content team: `docs/content-brief-preparation.md`; scaffolds `content/prep/scaffolds/**` (manifest);
  gold-standard example `content/prep/examples/pc-rc-exemple-complet.json` (imported).
- **Exam engine LOCKED (2026-10-04):** `FEATURES.examEngine = false` in `src/config/index.ts`. Examens tab/cards show a « Bientôt » pill and open `<ExamsSoonPanel>` (`src/components/prep/exams-soon.tsx`: construction bar = `EXAMS_COMING_SOON.progress` + what the section will do); `/dashboard/examens/session` renders `<ExamsSoonGate>`; blanc exercises are excluded from random/adaptive runs. Data kept in DB. Sidebar label is now **Préparation**. Flip the flag to re-open.
- **SM maths parity (2026-10-06):** SM cours rewritten at SM depth (56 lessons, résumé + objectives + funnel on every cours,
  ~4.4k chars avg; arctan, Rolle/TAF/IAF, racines n-ièmes, transformations, y''+ay'+by=0, Riemann, Z/nZ…; structures &
  arithmétique written from scratch). SM QCU 33 → 84/chapter (674 per track; sm_a = sm_b): PC-track questions copied +
  original SM questions, ALL with hint, `why` on 4 options, méthode, difficulty, solution. Live DB is the source of truth;
  repo record = `db/seed/sm_maths_cours_20261006.sql` + `content/prep/maths-sm-v2/` (snapshots, not import packs).
  Helper tables (RLS on, staging only): `lesson_drafts`, `lesson_patches`, `qcu_drafts` (+ fn `build_sm_pack(codes)` →
  bacup.prep/v2 pack), `notion_map_pc_sm`, `b1_enrich`, `meth_stage`; backups `lessons_backup_20261006`, `emoji_backup_20261006`.
  QA: `node scripts/content-qa/validate-cours.mjs` / `validate-qcu.mjs` (KaTeX, renderer rules, emoji, exact notions).
- **No-emoji sweep (2026-10-06):** removed ✓/✔/✗ verification marks from 314 solutions, 132 lessons, 4 options
  (fn `strip_checkmarks`; table cells became « oui »/« non »). ♀/♂ kept in SVT (biology notation).
- **Notion resolver fix:** `groupByNotion` now gives a question whose tag equals a heading to THAT heading; substring
  overlap only for loose tags (before: earlier short headings like « Groupe » swallowed 31 SM questions).
- Calculette page (`/dashboard/calculette`). Bibliothèque, classement, monk mode, reminders, payments/admin.
- Schema/migrations: `0001` … `0028` (0027/0028 applied to the live DB). Idempotent content seeds under `db/seed/`. AI gateway with cheap/strong routing.

## What's NEXT (candidates — nothing broken)
1. **Content breadth/QA:** some chapters are still thinner than Maths; audit filière-by-filière and level them up.
   Verify per-notion funnels + enriched banks across ALL filières in the running app (esp. SVT, PC).
2. **More exam content** in the engine (additional real sujets / examens blancs via the importer).
3. **Polish:** sign off the Yellowtail/swash subject typography live; landing/signup refinements.

## Gotchas
- New pages/routes hot-reload; **new fonts/npm packages need a dev-server restart** (Yellowtail + Aref Ruqaa were
  just added — restart `npm run dev` to load them).
- Supabase migrations are applied manually (paste SQL). Keep them in `db/migrations`, numbered. Content seeds in
  `db/seed/` are idempotent; several bank/tagging changes were applied directly to the live DB via the connector.
- Adding a QCU: tag its `notion` with a phrase that appears in the chapter's `##` heading, or the funnel won't show it.

## Growth layer (handoff 2026-10: landing, onboarding, ambassadors)
- Spec: `docs/handoff-2026-10/` (API, flows, business rules, data model). Pages = static HTML in `public/bacup/`
  served by `beforeFiles` rewrites in `next.config.ts`: `/onboarding`, `/ambassadeurs`, `/ambassadeurs/espace`
  and `/` (landing). The old `src/app/page.tsx` and `/onboarding` page.tsx are shadowed by these rewrites.
- Login for those pages: `public/bacup/bacup-auth.js` -> `/api/auth/email` (6-digit code), `/api/auth/verify`,
  `/api/auth/google` (`next` kept in cookie `bacup_next`, read by `/auth/callback`), `/api/auth/signout`, `/api/me`.
  Apple button visible but inactive until the Apple account exists.
- Rules: `src/config/bacup.ts` (250 DH, -20 code, +19 COD, access until 31 Jul 2027, ambassador rules, stream<->track map).
- Schema: `db/migrations/0034_growth_orders_ambassadors.sql` (orders, activation_cards, ambassadors, promo_codes, sales,
  bonuses, payouts, link_clicks, community_requests, app_settings; Carte élève columns; guards stopping users from
  editing their own role / paid status).
