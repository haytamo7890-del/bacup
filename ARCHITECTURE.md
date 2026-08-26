# HSGenius — Engineering Blueprint & Build Workflow

> How to build the product so the **foundation is correct** — the decisions that are cheap now and brutally expensive to change later.
> This is a working reference. Drop it in the repo root as `ARCHITECTURE.md`. Claude Code should read it before any significant task.

---

## 0. Prime directive

Build this as a **real startup product from day one**, not a disposable prototype. That does **not** mean building every feature — it means the *foundations* (auth, data model, security, AI abstraction, migrations) are done right, while *features* stay ruthlessly minimal.

The rule for every line of code and every architectural choice:

> **Is this cheap to change later?** If yes, do the simplest thing that works. If no, slow down and get it right now.

Cheap to change: a button, a page layout, a prompt, a pricing number.
Expensive to change: your auth model, your database schema, hardcoded AI provider, secrets in the client, missing row-level security.

---

## 1. The 8 non-negotiable foundations

Get these right before you build features. Everything else can be iterated.

| # | Foundation | Why it's expensive to fix later |
|---|-----------|--------------------------------|
| 1 | **Auth + Row Level Security** | Retrofitting security after data leaks is a rewrite — and your users are minors. |
| 2 | **Multi-curriculum data model** | A BAC-only schema forces a rebuild for ENCG/MENA. (Already designed — `hsgenius_schema.sql`.) |
| 3 | **AI provider abstraction** | Hardcoding one model locks you into its price/quality forever. |
| 4 | **Env & secrets discipline** | A leaked API key = surprise bill + breach. One mistake, permanent damage. |
| 5 | **Type safety end-to-end** | Untyped data across the DB→API→UI boundary breeds silent runtime bugs at scale. |
| 6 | **Validation at every boundary** | Trusting client input is how you get injected, corrupted, or abused. |
| 7 | **Migrations as code** | Hand-editing the prod DB is unrepeatable and unrecoverable. |
| 8 | **Observability from v1** | You can't fix or measure (activation, trial→paid, AI cost) what you don't instrument. |

If a feature PR touches one of these 8 and weakens it, it does not merge. This is the quality gate.

---

## 2. Tech stack — decisions, tradeoffs, and what I'd challenge

Your instinct (Next.js / Supabase / Tailwind / Vercel) is correct for this product. Here's the reasoning, the alternative, and the honest risk of each — so you're choosing, not cargo-culting.

| Layer | Choice | Why | Alternative | Risk to watch |
|-------|--------|-----|-------------|---------------|
| Language | **TypeScript everywhere** | One language, shared types DB→UI | — | Discipline: `strict: true`, no `any` |
| Frontend | **Next.js (App Router) + React** | SSR, routing, API routes in one | Remix, Vite SPA | App Router learning curve |
| Styling / UI | **Tailwind + shadcn/ui** | Fast, premium, you own the components | MUI, Chakra | Keep design tokens centralized |
| Backend | **Next.js route handlers + server actions** | No separate service to start | Standalone NestJS/Fastify | Extract a service only when AI/queues demand it |
| Database | **Postgres (Supabase)** | Relational fits curriculum; RLS built in | PlanetScale, raw RDS | Learn RLS properly — it *is* your authz |
| Auth | **Supabase Auth** | Free, integrates with RLS via `auth.uid()` | Clerk | Clerk is nicer UX but adds cost + a second identity source; start with Supabase |
| AI | **Provider-abstracted gateway** (Vercel AI SDK or your own) | Swap models by cost/subject/task | Direct SDK calls | Never call a provider SDK directly from features |
| Payments | **Abstraction over CMI + wallet + cash** | Morocco needs multiple rails | Stripe (not fully MA-ready) | CMI has no recurring → annual model |
| Hosting | **Vercel** (web) + Supabase (data) | Zero-ops, preview deploys | Fly.io, Railway | Watch cold-start + Morocco latency; consider a region close to MENA |
| Analytics | **PostHog** | Events, funnels, retention, self-host option | Amplitude, Mixpanel | Instrument events from day one |
| Errors | **Sentry** | Catch prod errors early | Logtail | Wire before launch, not after |

**Challenges to your assumptions:**

- **Don't add Clerk yet.** Supabase Auth + RLS is one coherent system; Clerk adds a second identity source and monthly cost for UX polish you don't need at 0 users.
- **Don't build a separate backend yet.** Next.js server-side is enough until you have background jobs, heavy AI orchestration, or a mobile app hitting a shared API. Extract *then*, not now.
- **Don't train or self-host a model.** Rent frontier models via the abstraction. Your moat is curriculum data + corrections + personalization, not weights (see the strategy brief).
- **Don't hardcode 220 MAD or the trial length anywhere.** These are config, not code.

---

## 3. System architecture

### 3.1 The layers

```
┌───────────────────────────────────────────────┐
│  CLIENT  (Next.js / React / Tailwind)          │  ← never holds secrets
│  landing · signup · dashboard · tutor · exams  │
└───────────────┬───────────────────────────────┘
                │  typed API (route handlers / server actions)
┌───────────────▼───────────────────────────────┐
│  APPLICATION LAYER                             │
│  · validation (zod)   · authz checks           │
│  · feature services (tutor, exams, progress)   │
│  · AI GATEWAY  ────────────► model providers   │  ← the only place models are called
│  · payment gateway ───────► CMI / wallet / cash│
└───────────────┬───────────────────────────────┘
                │  SQL (parameterized)
┌───────────────▼───────────────────────────────┐
│  DATA  (Postgres + RLS)                        │  ← RLS = last line of authz
│  curriculum · exams · attempts · mastery ·     │
│  conversations · subscriptions (schema.sql)    │
└────────────────────────────────────────────────┘
        │                         │
   PostHog (events)          Sentry (errors)
```

### 3.2 The AI tutor pipeline (the core system)

The tutor is **not** `user → LLM → answer`. That's a commodity anyone can copy. Build the pipeline — even a simple version — from the start, because it's where your moat compounds:

```
student message
   ↓ 1. intent detection      (question? request exercise? correction?)
   ↓ 2. student context       (level, track, weak chapters, past mistakes)
   ↓ 3. curriculum context    (subject + chapter + learning objective)
   ↓ 4. retrieval             (relevant lesson / exercise / official method)
   ↓ 5. reasoning + generate  (routed model: cheap vs strong)
   ↓ 6. quality/safety check  (age-appropriate, on-curriculum, not just the answer)
   ↓ 7. persist               (message + tokens + model)
   ↓ 8. update performance    (mastery, mistake tags)
   ↓ 9. feed recommendations  ("practice probability today")
```

Steps 2, 4, 8, 9 are the proprietary layer. Ship a thin version first (context + retrieval + persist), deepen over time.

---

## 4. Repository structure

Feature-based modules, not a dumping ground. This scales to multiple products without tangling.

```
hsgenius/
├─ apps/
│  └─ web/                      # Next.js app
│     ├─ app/                   # routes (App Router)
│     │  ├─ (marketing)/        # landing, pricing, faq
│     │  ├─ (auth)/             # signup, login
│     │  └─ (app)/              # dashboard, tutor, exams, progress
│     ├─ components/            # shared UI (shadcn)
│     └─ lib/                   # client helpers
├─ packages/
│  ├─ core/                     # domain logic, framework-agnostic
│  │  ├─ tutor/                 # the AI pipeline
│  │  ├─ progress/              # mastery + recommendations
│  │  ├─ exams/                 # exam library logic
│  │  └─ billing/               # subscription rules
│  ├─ ai/                       # AI GATEWAY — model routing, prompts, caching
│  ├─ db/                       # schema, migrations, typed client, RLS tests
│  ├─ validation/               # zod schemas shared client+server
│  └─ config/                   # env parsing, feature flags, pricing constants
├─ .github/workflows/           # CI
└─ ARCHITECTURE.md              # this file
```

**Rules:** features import from `packages/core`, never the reverse. Models are called **only** through `packages/ai`. Pricing/trial/limits live in `packages/config`. No business logic in React components.

---

## 5. Environments & secrets

Three environments, isolated data:

| Env | Purpose | Data |
|-----|---------|------|
| `local` | your machine | seeded dev DB |
| `staging` | preview / QA | separate Supabase project |
| `production` | real users | locked-down Supabase project |

**Secrets rules (never break these):**

- **No secret ever reaches the client bundle.** Only `NEXT_PUBLIC_*` vars are public — and those hold *nothing* sensitive.
- API keys (AI providers, payment, service-role) live in server env only, injected via Vercel/Supabase env settings.
- `.env` is git-ignored; commit a `.env.example` with keys but no values.
- Rotate any key the moment it's exposed. Assume a leaked key is compromised.
- The Supabase **service-role key** bypasses RLS — server-only, never in a route the client can trigger arbitrarily.

---

## 6. Database & migrations workflow

The DB is your most expensive-to-fix layer. Treat it like code.

1. **Every schema change is a migration file**, committed and reviewed. Never edit the prod DB by hand.
2. **Migrations run in CI/CD**, staging before prod.
3. **RLS is written *with* the table**, not bolted on later. A table with personal data and no RLS is a bug.
4. **Seed scripts** populate curriculum (countries → BAC → filières → subjects). Idempotent.
5. **Never `SELECT *` in app code** — select the columns you need; it survives schema changes better.
6. Foreign keys + `ON DELETE` rules are explicit (already done in `schema.sql`).

Migration flow: `write migration → apply local → test (incl. RLS) → PR → CI applies to staging → merge → deploy applies to prod`.

---

## 7. Security & child-safety foundations

Your users are minors. Treat this as a launch requirement, not a later cleanup.

- **Authorization in two places:** app-layer checks *and* database RLS. RLS is the backstop that holds even if app code has a bug. A student must never read another student's data.
- **Validate all input with zod** at the API boundary — shape, type, range. Reject, don't coerce.
- **Parameterized queries only.** The typed DB client handles this; never string-concat SQL.
- **Rate-limit** auth, tutor, and payment endpoints (abuse + AI cost control).
- **Minimize PII.** Store `birth_year`, not full birth date. No data you don't need.
- **Consent + guardianship** are modeled (`consents`, `guardianships`) — wire them into signup for minors.
- **Moderation** on any student-visible generated content and (later) community.
- **Dependency hygiene:** `npm audit` in CI, no unmaintained packages, lockfile committed.
- **Least privilege:** service-role key server-only; anon key is RLS-constrained.

---

## 8. AI architecture in practice (cost + quality)

At 220 MAD/user, an unmanaged tutor destroys your margin. Build these in from v1:

- **Provider abstraction** (`packages/ai`): features call `ai.tutor(...)`, never a provider SDK. Swap models by config.
- **Model routing:** cheap/small model for routine Q&A, formatting, intent detection; strong reasoning model only for genuinely hard problems. Route by task + subject + difficulty.
- **Caching:** curriculum answers and standard corrections are near-identical across thousands of students — compute once, cache, serve many.
- **Retrieval grounding:** answer from your curriculum content, not open-ended generation — cheaper *and* more accurate *and* on-syllabus.
- **Usage caps** per tier (generous but bounded); premium tier for heavy users.
- **Prompt versioning:** prompts are versioned artifacts in `packages/ai`, not scattered string literals. You'll iterate them constantly.
- **Token accounting:** every `messages` row records model + input/output tokens (already in schema) → COGS dashboard.
- **Eval loop:** a small set of graded Q&A to catch quality regressions when you change models or prompts.

Target: keep AI COGS **under ~20–25% of revenue**.

---

## 9. Development workflow

### 9.1 Git

- **Trunk-based with short-lived branches.** `main` is always deployable.
- Branch → small PR → CI green → review → squash-merge. Keep PRs small (< ~400 lines); large PRs hide bugs.
- **Conventional commits** (`feat:`, `fix:`, `chore:`) — clean history, easy changelogs.
- No direct commits to `main`. No merging red CI.

### 9.2 Code review checklist (every PR)

- [ ] Does it weaken any of the 8 foundations? (If yes, stop.)
- [ ] Input validated? Authz enforced (app + RLS)?
- [ ] No secrets, no `any`, no `SELECT *`, no hardcoded config?
- [ ] Tests for the important logic? Do they pass?
- [ ] Errors handled (not swallowed)? Key events instrumented?

### 9.3 Using Claude Code correctly

You'll build fast with AI. These rules keep it from producing spaghetti:

- **Give it this file as context.** Point it at `ARCHITECTURE.md` before tasks.
- **Small, scoped tasks.** "Build the exam-filter API with validation + tests," not "build the exams feature."
- **Demand a plan before big changes.** For anything touching the 8 foundations, make it explain *what/why/tradeoffs/what could break* before writing code.
- **Require tests** for logic it writes. No fake/mock features presented as done.
- **Review its output like a junior's.** It's fast, not infallible — especially on RLS, auth, and money paths.
- **Never let it invent config or commit secrets.**

---

## 10. Testing strategy

You're a startup — don't test everything, test what **hurts when it breaks**. Priorities:

| Layer | Test | Priority |
|-------|------|----------|
| **RLS policies** | A student cannot read another's data | **P0 — non-negotiable** |
| **Money paths** | Signup → subscription → payment status | **P0** |
| **Auth** | Login, session, role gating | **P0** |
| Core logic (unit) | Mastery calc, recommendation, XP | P1 |
| API (integration) | Validation rejects bad input; happy paths | P1 |
| Critical E2E | Signup→tutor→exercise; pay flow | P1 |
| UI components | Visual/interaction | P2 (spot-check) |

Write an **RLS test suite** explicitly — it's your security proof. A green test that a student *cannot* see another student's attempts is worth more than 100 UI tests.

---

## 11. CI/CD

Pipeline on every PR (fail fast, cheap steps first):

```
lint → typecheck → unit/integration tests → build → preview deploy (Vercel)
```

On merge to `main`:

```
run migrations (staging → prod) → deploy → smoke test → done
```

**Quality gates:** red lint/types/tests block merge. Migrations must succeed on staging before prod. Every PR gets a preview URL to click through.

---

## 12. Observability & analytics

Wire these **before** launch — they're how you'll hit the growth numbers.

- **Product analytics (PostHog):** instrument the funnel that matters — `signup`, `activation` (first AI question, first exercise), `trial_started`, `paid`, `D1/D7/D30 return`, `referral_sent/accepted` (K-factor). These map 1:1 to the strategy brief metrics.
- **Error tracking (Sentry):** every prod exception, with release tagging.
- **AI cost dashboard:** aggregate `messages` tokens × model price → COGS per user, watched weekly.
- **DB monitoring:** slow-query + connection alerts (Supabase dashboard).
- **Uptime check** on the payment + tutor endpoints.

If you can't see activation, trial→paid, and AI cost on a dashboard, you're flying blind.

---

## 13. Definition of Done (per feature)

A feature is done when:

1. Code merged, CI green, deployed to staging.
2. Input validated, authz enforced (app + RLS), errors handled.
3. Important logic tested; RLS/money/auth paths covered.
4. Key events instrumented in PostHog.
5. No secrets, no hardcoded config, no `any`, no `SELECT *`.
6. Clicked through on a preview URL by a human.

---

## 14. The build sequence (foundations first, then features)

Order matters. Build the skeleton before the muscles. Rough sequencing (compress or expand to your pace):

**Phase 0 — Foundation (before any feature).**
Repo + monorepo structure · TypeScript strict · Supabase project (local+staging+prod) · apply `schema.sql` + RLS + RLS tests · env/secrets setup · CI pipeline · Sentry + PostHog wired · AI gateway skeleton · config package (pricing/flags).

**Phase 1 — MVP core (the value moment).**
Auth (signup with track+level) · AI tutor v1 (context + retrieval + persist) · exam library (browse/filter official sujets) · corrections (HSGenius-authored) · basic progress (chapter mastery from attempts).

**Phase 2 — Monetize + measure.**
Trial → paywall · payment gateway (CMI + wallet + cash) · subscription lifecycle · full funnel analytics · AI cost dashboard.

**Phase 3 — Retention + growth loops.**
Streaks · XP · recommendations ("practice X today") · referral system + shareable rank cards.

**Phase 4 — Depth.**
National/class ranking · richer personalization · parent view · then (later) community, B2B, new curricula.

**Do not** start Phase 1 until Phase 0's 8 foundations are solid. This is the whole point of "make the foundation correct."

---

## 15. Traps to avoid (sharpened)

- Building features on a shaky foundation → you'll rewrite. Foundations first.
- Calling AI provider SDKs directly from features → locked in, no cost control. Use the gateway.
- Skipping RLS "for now" → a data leak with minors is existential. Never.
- Secrets in client code / committed `.env` → assume compromised. Server-only.
- Hardcoding prices, limits, prompts → make them config.
- One giant file / duplicated logic → feature modules, shared packages.
- 90 days of coding with no users → build + talk to students every week.
- Over-building (community, B2B, gamification) before the core value moment works → deprioritize.
- Trusting AI-generated code blindly on auth/money/RLS → review it hardest exactly there.

---

### Companion files
- `hsgenius_schema.sql` — the database (apply in Phase 0).
- `hsgenius_erd.mermaid` — visual data model.
- `HSGenius_Strategic_Brief.docx` — the business/why behind these choices.
- `HSGenius_Examens_1BAC.xlsx` / `_2BAC.xlsx` — content collection map.

> **One sentence:** Get the 8 foundations right first, keep features minimal, call models only through the gateway, enforce security at the database, measure the funnel from day one — and you'll have a product that scales from BAC to a platform without a rewrite.
