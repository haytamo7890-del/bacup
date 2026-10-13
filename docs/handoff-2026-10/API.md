# API to build

REST/JSON suggestion. Auth = session cookie or bearer token. Each endpoint lists the **exact place in the prototype** that currently fakes it (search the quoted text in the file).

## Auth
| Method | Path | Body → Response | Replaces |
|---|---|---|---|
| POST | `/api/auth/google` · `/api/auth/apple` | OAuth result → `{user, isNew}` | onboarding & funnel: `el.querySelectorAll("[data-go]").forEach(b=>b.onclick=next)` (Google/Apple buttons just go next) |
| POST | `/api/auth/email` | `{email}` → magic link / OTP sent | `#mailb` handler (`mb.onclick=`) only validates the format today |

## Public / landing
| Method | Path | Body → Response | Replaces |
|---|---|---|---|
| GET | `/api/stats/public` | → `{students:1002, online:null, founder:80}` | landing: call `window.bacupLive(data)` with the response (hook already there, see `window.BACUP`) |
| POST | `/api/clicks` | `{ref, src, path}` → 204 | landing: nothing yet. Fire on load when `?ref=` is present |
| POST | `/api/community/requests` | `{firstName, city, stream, whatsapp, email, consent}` → 201 | landing `#jform` (only tracked today) |
| GET | `/api/parents/share?…` | → link to a parents page | landing `[data-pt="parent"]`, `[data-c="parent"]` (mock toast) |

## Student
| Method | Path | Body → Response | Replaces |
|---|---|---|---|
| GET | `/api/me` | → user + student profile + plan | — |
| PATCH | `/api/me/profile` | `{pseudo, avatarKey, level, stream, average, goal, dreamSchool}` | onboarding `side()` → `LS.set(...)` (saves locally on every answer). Send on `build` step or on each step |
| POST | `/api/me/photo` | multipart JPEG 320×320 (already cropped client-side) → `{photoUrl}` | onboarding crop `#cok` handler (`A.photo=c.toDataURL(...)`) |
| GET | `/api/promo/:code` | → `{valid:true, discount:20, ambassadorPseudo:"Salma"}` / 404 | onboarding `renderPromo()` → `#apc` accepts any code ≥ 4 chars; `REF` from URL is trusted as-is |

## Checkout
| Method | Path | Body → Response | Replaces |
|---|---|---|---|
| POST | `/api/orders` | `{method:"card", promoCode?}` → `{orderId, total, paymentUrl}` (CMI hosted page) | onboarding: `if(id==="checkout"){if(A.pay==="card"){A.paid=true;…` |
| POST | `/api/orders` | `{method:"cod", promoCode?, phone, city, address}` → `{orderId, ref:"BU-NHHK4E", total:249}` | same handler (`A.cod=true`); the `cod` screen generates a random ref in `after:()=>{$("#oid")…}` |
| POST | `/api/payments/cmi/callback` | CMI server-to-server notification | — (activate access, create `referral_sales` row) |
| GET | `/api/orders/:id` | → status (for the return page after CMI) | the `paid` screen should only show after a confirmed callback |
| POST | `/api/activation/redeem` | `{code}` → access granted | — (in the app, for COD cards) |
| (admin) | `PATCH /api/admin/orders/:id` | `{status:"cod_confirmed" \| "shipped" \| "delivered_paid" \| "delivery_refused"}` | — (`delivered_paid` sets `cash_received_at` → ambassador sale counts) |

Server must recompute totals (250 − 20 if valid code + 19 if COD). Never trust the client total.

## Ambassador funnel
| Method | Path | Body → Response | Replaces |
|---|---|---|---|
| GET | `/api/ambassadors/code-availability?code=HAYTAM` | → `{available:true}` | funnel `cav()` checks `CFG.taken` (hard-coded list) |
| POST | `/api/ambassadors` | `{pseudo, code, avatarKey, city, profile, audience, channels[], ageGroup, charterAccepted:true}` → `{status:"pending_review"}` | funnel: `if(id==="done"){const q=new URLSearchParams({view:"db",…` (currently just redirects with URL params) |
| POST | `/api/me/photo` | (same as student) | funnel crop `#cok` |
| GET | `/api/ambassadors/leaderboard?scope=national\|city&city=Rabat&month=2026-10` | → `[{rank, pseudo, city, sales}]` | funnel `course` screen example rows (`ex=[["Salma",64…`) and the `natRank()` / `cityRank()` demo formula on `gains` |

## Ambassador dashboard
| Method | Path | Body → Response | Replaces |
|---|---|---|---|
| GET | `/api/ambassadors/me` | → identity, code, level, status, payout account (masked) | arrival block `/* Arrivée depuis le funnel ambassadeur` (reads URL params into `U`) |
| GET | `/api/ambassadors/me/stats?range=7\|30\|90` | → `{days:[{date, clicks, signups, sales}], kpis, prevPeriod}` | `/* ---------- demo data (replaced by the API) ---------- */` → `DAYS` |
| GET | `/api/ambassadors/me/sales?range=` | → `[{date, studentFirstName, channel, via, payment, status, share}]` | same block → `SALES` (random generator `rng()`) |
| GET | `/api/ambassadors/me/balance` | → `{inDelivery, pending, validated, paid, bonuses, nextPayoutDate}` | `dash()` → `mL mP mV mY` values |
| GET | `/api/ambassadors/leaderboard?scope=national&month=` | | `rkT` rows (`R=[["Salma","Rabat",41],…`) and "La course du mois" card |
| PUT | `/api/ambassadors/me/payout-account` | `{holder, bank, cin, rib, parentPhone?, parentConsent?}` | form `#f` submit (`$("f").addEventListener("submit"`) step 3 |
| GET | `/api/ambassadors/me/missions` | → `[{key, done}]` | funnel `kit` screen (all locked) and dashboard to-dos |

`/api/ambassadors/me/stats` should compute: clicks from `link_clicks`, sign-ups = users created with that ref, sales = `referral_sales` not refunded/refused.

## Webhooks / jobs
- Nightly: move `pending` sales older than `validDays` to `validated`; award level bonuses when thresholds are crossed.
- Monthly (1st): freeze last month's race, create `race_1/2/3` bonuses, reset counters.
- Monthly (`payDay`): create payouts for balances ≥ `minPayout`.
- Fraud checks on each referral sale: same phone / address / card fingerprint as the ambassador → `excluded_fraud`.
