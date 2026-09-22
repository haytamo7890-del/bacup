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
db/migrations/          SQL migrations (0001 schema … 0025 questions_notion) — run in Supabase SQL editor
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
- **Content/IP**: official past sujets are public (OK). Corrections are **ours** (author `hsgenius`) — never copy a competitor's corrections, wording, or design. This is legal safety AND the moat.
- **Design**: Arctic-glass (`.glass` utility, `arctic-*` colors), dark-first, French copy, minimal + premium.
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
- **QCU banks (~1,094 questions):** every question tagged with a `notion` = a cours `##` heading; funnels filter to
  that notion only (maths via `notionSlug` in `src/config/notion-map.ts`; other subjects via text-overlap in
  `src/app/dashboard/cours/page.tsx` `selectForNotion`). Answers **randomly shuffled** each open
  (`src/components/course/practice-quiz.tsx`, Fisher–Yates). Funnel CTA hidden on sections with no questions
  (`canPractice`). Every content section has ≥1 QCU.
- **Subject-name typography:** `SubjectName` in `src/components/subject-pad.tsx` — Yellowtail brush + SVG swash
  underline (`.subject-title` / `.subject-swash` in `globals.css`), used on cours/annales/exam/dashboard. Arabic
  falls back to Aref Ruqaa. Fonts loaded in `src/app/layout.tsx` via `next/font`.
- Calculette page (`/dashboard/calculette`). Bibliothèque, classement, monk mode, reminders, payments/admin.
- Schema/migrations: `0001` … `0025`. Idempotent content seeds under `db/seed/`. AI gateway with cheap/strong routing.

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
