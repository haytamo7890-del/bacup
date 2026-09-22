# Bac-up — System Architecture & Scaling Blueprint

> Senior-engineer view of the whole system: what exists, how it fits, and how it scales from
> the first 100 students to millions. Product: **Bac-up** (company: HSGenius) — AI-powered BAC
> prep for Moroccan students, 1bac (régional) + 2bac (national).

---

## 1. System architecture (high level)

```
                    ┌─────────────────────────────────────────────┐
   Students /        │            Next.js 16 (App Router)          │
   Google bots  ───► │  ┌──────────────┐    ┌────────────────────┐ │
                     │  │ Public/SEO   │    │ App (auth-gated)   │ │
                     │  │ (RSC, static)│    │ /dashboard/* (CSR) │ │
                     │  └──────┬───────┘    └─────────┬──────────┘ │
                     │         │  anon read           │ user session │
                     └─────────┼──────────────────────┼────────────┘
                               │                      │
                     ┌─────────▼──────────────────────▼────────────┐
                     │            Supabase (Postgres 17)            │
                     │  Auth · Row-Level Security · RPC functions   │
                     │  content tables (public read) · student data │
                     └─────────┬───────────────────────┬───────────┘
                               │                        │
                        ┌──────▼──────┐          ┌──────▼───────┐
                        │ AI gateway  │          │  CDN / edge  │
                        │ (Anthropic) │          │ static + ISR │
                        └─────────────┘          └──────────────┘
```

**Principles**
- **One writeable place per concern.** AI only through `src/lib/ai/gateway.ts`; config only in `src/config`; secrets only in `.env.local`.
- **RLS is the security boundary**, not the app. Every table has policies; students read only their own rows; content is public-read.
- **Reads are cheap and cacheable.** Public/SEO pages are React Server Components rendered statically with `revalidate`, so Google (and users) hit the CDN, not the DB.
- **Writes go through SECURITY DEFINER functions** (`record_exam`, `submit_challenge`, …) that encapsulate multi-table transactions and run with `auth.uid()` — no raw client writes to sensitive tables.

---

## 2. File structure

```
src/
  app/
    (public, statically rendered, indexable)
      page.tsx                     landing (10-section)
      examens/                     SEO exam tree
        page.tsx                   hub  → levels → subjects
        [level]/[subject]/page.tsx subject hub
        [level]/[subject]/[exam]/page.tsx         énoncé
        [level]/[subject]/[exam]/corrige/page.tsx corrigé
      defi/                        Défi National (live)
        page.tsx (RSC)  +  defi-client.tsx (CSR)
      sitemap.ts / robots.ts       programmatic SEO
      signup / login / onboarding / auth/callback
    (auth-gated, client-rendered)
      dashboard/                   aperçu · cours · examens · classement · coach · calculette
    api/explain · api/coach        AI route handlers → gateway
  components/  public-shell, math (KaTeX), dashboard/*, theme-*
  config/      index (pricing/limits/flags), site (SEO slugs), landing
  lib/         supabase-browser | server | public, ai/gateway
db/migrations/ numbered SQL (RLS, functions)
scripts/       import-content, generate-explanations
docs/          this file, product-spec, plan
```

Three Supabase clients, one per trust context: **browser** (session, client components), **server** (cookie session, RSC/handlers), **public** (anon, cookie-less — powers SEO pages + sitemap).

---

## 3. Data model (Postgres)

**Content (public-read):** `education_systems → levels, subjects, tracks` ; `exams(level, subject, track?, year, session, exam_type)` ; `exercises → questions → answer_options` ; `solutions` (author = hsgenius) ; `chapters → lessons`.

**Student (RLS, owner-only):** `profiles / student_profiles` ; `attempts` ; `chapter_mastery` ; `xp_events` ; `streaks` ; `lesson_completions` ; `subscriptions / payments`.

**Défi National (new):**
```
challenges(id, slug, title, exam_id, level_id, subject_id, opens_at, closes_at)
challenge_entries(challenge_id, student_id, score /20, time_spent_s, submitted_at,
                  unique(challenge_id, student_id))
  index (challenge_id, score desc, time_spent_s asc, submitted_at asc)  -- leaderboard
```

**Server-side functions (the write/aggregate API):**
`record_exam(p_answers)` → attempts→mastery→XP→streak, returns /20 & XP ·
`my_stats()`, `my_xp_series()`, `leaderboard()` · `mark_lesson_read()` ·
`current_challenge()`, `challenge_leaderboard(id,limit)`, `submit_challenge(id,score,time)`,
`my_challenge_entry(id)`.

---

## 4. API surface

There is almost no bespoke REST layer — that's deliberate. Three mechanisms:

1. **PostgREST (auto)** — typed reads over RLS-protected tables via the Supabase client.
2. **RPC functions** — all non-trivial writes/aggregations (above). Transactional, testable, cache-free.
3. **Next route handlers** — only where a secret is needed: `POST /api/explain`, `POST /api/coach` call the AI gateway server-side so the Anthropic key never reaches the browser.

This keeps the attack surface tiny and lets the DB scale independently of app servers.

---

## 5. UI architecture

- **Public/SEO pages**: RSC, theme-aware (light/dark via `next-themes` + `.c-*` tokens), Arctic-glass. Each page ships `<title>`, meta description, canonical, OG, breadcrumbs, and JSON-LD (BreadcrumbList / FAQPage / LearningResource / Event). Statically rendered with `revalidate`.
- **App**: client components with the browser Supabase client; the timed exam engine, dashboard rings/curves, coach, calculette.
- **Design system**: `.glass` + `arctic-*` palette, `<Math>` (KaTeX) for LaTeX in `$...$`.

---

## 6. Flagship: « Défi National »

The differentiator no Moroccan bac platform has: a **weekly, synchronized, nationally-ranked mock exam**.

**Flow.** A `challenge` opens for a week over one real sujet. Students launch it from `/defi` → the exam engine runs with `?defi=<id>`; on finish, `record_exam` scores it and `submit_challenge` writes the entry (best score kept, ties broken by time, +15 XP once). `/defi` shows a live countdown, participant counter, and a national leaderboard filterable by filière — auto-refreshed every 30 s, names privacy-masked (`Anas B.`).

**Why it wins.** Virality (share your rank), real social proof (the leaderboard fills itself), retention (a reason to come back every week), and a growth loop into schools/cities. It reuses the exam engine, XP and streaks already built — net-new code is one page + four SQL functions.

**Ops.** A weekly cron (Supabase scheduled function or a Vercel cron) inserts next week's `challenge` row; everything else is data-driven.

---

## 7. Scaling to millions

| Layer | First 1k | Millions | Lever |
|---|---|---|---|
| **Reads** | RSC + `revalidate` | same, +CDN edge cache | SEO/public pages are static — traffic never touches the DB |
| **DB CPU** | single Postgres | read replicas + PgBouncer pooling | Supabase scales vertically then read-replicas; leaderboard is index-backed |
| **Leaderboard** | live query | materialized top-N refreshed every N s | precompute per challenge; `challenge_entries` index already covers it |
| **Live counts** | 30 s poll | Supabase Realtime broadcast | swap polling for a channel with zero UI change |
| **AI cost** | per-request | pre-generated + cached explanations, cheap/strong model routing, fair-use limits | gateway already routes models; `AI_LIMITS` per tier protects margin |
| **Writes** | RPC | same, partition `attempts`/`entries` by time | SECURITY DEFINER funcs stay the only write path |
| **Media** | — | Supabase Storage + CDN for PDFs/images | signed URLs |
| **Search** | Postgres | trigram / pg_trgm, then Meilisearch if needed | additive |

**Cost control is the real scaling story for an AI EdTech in Morocco:** keep the expensive path (AI) gated and cached, keep the cheap path (annales + corrigés) static and SEO-driven so growth is organic, and let the DB do aggregation in indexed functions rather than in app code.

---

## 8. What's next (engineering)

1. Auto-launch a défi's exact sujet from `/defi` (deep-link the engine to an exam id).
2. Weekly cron to roll the next `challenge`.
3. Materialized leaderboard + Supabase Realtime for the live counter.
4. Filière-tagged exams (`exams.track_id`) → add a `[filiere]` segment to the SEO tree.
5. Paywall/entitlement engine (trial → 220 DH) enforced in RLS + a `subscriptions` check.
