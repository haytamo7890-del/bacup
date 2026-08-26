# HSGenius

Le coach IA du BAC marocain — comprendre, s'entraîner, progresser.

## Stack
Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Auth) · Claude (AI) · Vercel

## Getting started
```bash
npm install        # install dependencies (first time)
npm run dev        # start the dev server
```
Then open http://localhost:3000

## Environment
Copy `.env.example` to `.env.local` and fill in your keys. Never commit `.env.local`.

## Project layout
```
src/
  app/            # routes (App Router)
  config/         # pricing, tiers, limits, feature flags
db/
  schema.sql      # database schema — apply in Supabase SQL editor
docs/
  erd.mermaid     # data model diagram
ARCHITECTURE.md   # engineering blueprint — read before big changes
```

## Foundations (do not weaken)
See `ARCHITECTURE.md` — auth+RLS, multi-curriculum data, AI provider abstraction,
secrets discipline, type safety, validation, migrations, observability.
