# Bac Up — front-end handoff

Four working prototypes, built as self-contained HTML pages. They are the **visual and behavioural spec**: every screen, animation, copy line and rule is in them. What they do **not** have yet is a backend: logins, payments, codes and dashboards run on mock data. This package tells you exactly where to plug the real thing in.

| # | Folder | What it is | Route (proposed) |
|---|--------|-----------|------------------|
| 1 | `01-landing/` | Marketing landing: founder intro, hero, level test, features, live *Carte élève* builder, pricing, community, ambassadors, FAQ | `/` |
| 2 | `02-student-onboarding/` | Sign-up funnel for students: login, pseudo/avatar (with crop), year & stream, goal, dream school, impact curve, checkout (card or cash on delivery) | `/onboarding` |
| 3 | `03-ambassador-funnel/` | Sign-up funnel for ambassadors: card, code, city, profile, audience, earnings simulator, monthly race, kit, charter | `/ambassadeurs` |
| 4 | `04-ambassador-dashboard/` | Ambassador space: KPIs, sales, payouts, links & QR, content studio (video + WhatsApp), levels, leaderboard, profile | `/ambassadeurs/espace` |

Open any `index.html` in Chrome: it works offline (fonts and images are embedded; the landing loads Plus Jakarta Sans from Google Fonts and KaTeX from cdnjs, the dashboard loads `qrcode-generator` from cdnjs).

## Read in this order

1. `docs/ROUTES.md` — how the four pages link to each other, every URL parameter, every CTA.
2. `docs/FLOWS.md` — screen-by-screen flows (explorer vs buyer, card vs cash on delivery, ambassador steps).
3. `docs/BUSINESS-RULES.md` — prices, discounts, delivery fee, ambassador earnings, levels, race, payouts, fraud rules.
4. `docs/DATA-MODEL.md` — entities and fields the backend needs.
5. `docs/API.md` — endpoints to build, with request/response shapes, and the exact place in each file that calls them.
6. `docs/CONFIG.md` — every constant and where it lives in each file.
7. `docs/INTEGRATION.md` — how to bring the pages into the app (two options), mock points to replace, tracking events, checklist.
8. `docs/OPEN-QUESTIONS.md` — what the founder still has to confirm before launch.

`assets/` has the logo, the ½ dirham coin, avatar/medal icons as SVG + JSON. `shots/` has screenshots of every screen (desktop and mobile).

## Status

- Front-end: done and tested on desktop (1440 px) and phone (390 px), no horizontal overflow.
- Backend: not started. Everything marked **MOCK** in `docs/INTEGRATION.md` must be replaced.
- Links in these copies already point to production URLs (`https://bacup.ma/...`). Change them in one place per file (see `CONFIG.md`) if the routes differ.
