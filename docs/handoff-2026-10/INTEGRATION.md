# Integration guide

## Two ways to bring this into the app

### Option A — ship the pages as they are, wire the API (fastest, recommended for launch)
1. Serve each `index.html` at its route (`/`, `/onboarding`, `/ambassadeurs`, `/ambassadeurs/espace`) on the same domain as the app, so `localStorage["bacup.card"]` and the session cookie are shared.
2. Replace every **MOCK** point below with a `fetch()` to your API (see API.md). Each page is one file: HTML, CSS and JS inline, no build step, no framework.
3. Protect `/ambassadeurs/espace` behind login (redirect to `/ambassadeurs` when the user is not an ambassador).
4. Later, move inline images (base64) to a CDN to make the landing lighter (it is ~650 KB because the photos and coin are embedded).

### Option B — rebuild as components in your framework
Use the HTML as the pixel-exact spec. Everything you need is readable in the source: copy, CSS values, animation timings, validation rules. Reuse the JS logic blocks (`flow()`, `total()`, `gainsJS()`, the crop code, the canvas studio) — they are framework-agnostic.

## MOCK points to replace

### Landing
| Search | Today | Should |
|---|---|---|
| `window.BACUP=` / `bacupLive` | static 1002 / 80 % | load `/api/stats/public` and call `bacupLive()` |
| `$("jform")` | only tracked | POST community request |
| `[data-pt]` mock handler (`"Maquette · "`) | toast for `parent` | WhatsApp link to a parents page |
| `?ref=` on load | carried to onboarding only | also POST `/api/clicks` |

### Student onboarding
| Search | Today | Should |
|---|---|---|
| `[data-go]` (Google / Apple) and `#mailb` | go to next screen | real OAuth / magic link; returning users with a full profile skip to `/app` |
| `renderPromo()` / `#apc` | any 4+ char code accepted | validate with `/api/promo/:code` |
| `if(id==="checkout")` | sets `A.paid` / `A.cod` locally | create order; card → redirect to CMI, come back on `paid`; COD → show `cod` with the real order ref |
| `$("#oid")` | random `BU-XXXXXX` | real order ref |
| `side()` → `LS.set` | saves to localStorage only | also PATCH `/api/me/profile` |
| crop `#cok` | photo kept as data URL | upload to `/api/me/photo` |
| `nav.demo` | demo links | **remove** |

### Ambassador funnel
| Search | Today | Should |
|---|---|---|
| `[data-go]`, `#mailb` | go next | real login |
| `cav()` / `CFG.taken` | hard-coded list | `/api/ambassadors/code-availability` (debounce 300 ms) |
| `if(id==="done")` | redirect with URL params | POST `/api/ambassadors`, then go to the dashboard (no params) |
| `natRank` / `cityRank`, `ex=[["Salma"…` | demo ranks and names | real leaderboard |

### Ambassador dashboard
| Search | Today | Should |
|---|---|---|
| `/* ---------- demo data (replaced by the API) ---------- */` | random 90 days of clicks/sales | `/api/ambassadors/me/stats` + `/sales` |
| `/* Arrivée depuis le funnel ambassadeur` | reads `?view=db&p=&code=…` | read the session (`/api/ambassadors/me`) |
| `R=[["Salma","Rabat",41]` | example leaderboard | `/api/ambassadors/leaderboard` |
| `$("f").addEventListener("submit"` | old 5-step sign-up form (identity → contact → channels → payout → charter) | keep **only** the payout step as "Compte de versement" (identity now comes from the funnel) |
| `#vWel`, `#vDone` views | old welcome + done screens | superseded by the funnel; can be deleted |
| tag "Données de démo" | visible | remove when real data is wired |

## Downloads (content studio)
The studio creates the video with `canvas.captureStream()` + `MediaRecorder` (MP4 when the browser supports it, otherwise WebM) and the status image with `canvas.toBlob()`. Saving goes through `save()`: it uses a normal `<a download>` on your domain (the `claude.use("downloads")` branch only matters inside the prototype viewer and can be removed).

## Analytics (landing)
`track(name, data)` pushes `{event:"bacup_"+name, …}` to `window.dataLayer` (GTM-ready) and dispatches a `bacup:track` DOM event. Events: `cta_click`, `price_click`, `parent_share`, `result_cta`, `test_started`, `test_finished`, `faq_open`, `community_submit`, `onboarding_open`.
Suggested additions: onboarding step views, `order_created`, `payment_success`, ambassador `signup_done`.

## Design tokens (shared)
| Token | Value |
|---|---|
| Font | Plus Jakarta Sans 500/600/700/800 |
| Dark bg | `#0A1016` / `#060B14` |
| Light hero bg | `#F7F9FB` |
| Ink | `#F2F6FA` (dark) · `#0B1520` (light) |
| Brand cyan | `#7FE3F2` · blues `#22B8E6` `#1B7FDC` `#0DB8D3` |
| Card gradient | `linear-gradient(125deg,#12366A,#0A1830 46%,#154483)`, gold chip `#F5D98B → #C9A227` |
| Success | `#10B981` / `#34D399` |
| Accent orange (COD, Concours) | `#FF8A3D` |
| Ambassador metals | Argent `#F3F5F7→#A9B1BA`, Or `#FBF0C4→#B98A2B`, Platinum `#343A43→#0B0D11` |
| Radii | cards 18–28 px, pills 99 px |
| Motion | ease `cubic-bezier(.2,.8,.2,1)`; all animations respect `prefers-reduced-motion` |

## Third-party
- KaTeX 0.16.9 (cdnjs) — math in the level test.
- qrcode-generator 1.4.4 (cdnjs) — QR in the dashboard.
- Brand icons (TikTok, Instagram, WhatsApp, Snapchat, YouTube, Visa) from Simple Icons (CC0). Mastercard circles drawn to the official colours. Use the card marks per Visa / Mastercard merchant guidelines.
- **CMI logo**: placeholder text badge — replace with the official CMI acceptance logo from the merchant kit.

## Launch checklist
- [ ] Routes live, links point to production (already set in these copies)
- [ ] Login (Google, Apple, email) on onboarding and funnel
- [ ] Profile saved server-side, photo upload
- [ ] Promo code validation, server-side totals
- [ ] CMI payment + callback → access + referral sale
- [ ] COD back-office (confirm call, ship, mark cash received, refused)
- [ ] Activation card redeem in the app
- [ ] Ambassador create + review + code activation
- [ ] Dashboard on real data, payout account form, monthly payouts
- [ ] Level bonuses + monthly race jobs, fraud checks
- [ ] Remove `nav.demo`, "Données de démo" tag, demo rank formula and example names
- [ ] Real member number on the Carte élève
- [ ] CMI official logo
- [ ] Analytics connected (GTM / your tool)
- [ ] Test on iPhone Safari (MediaRecorder MP4 support varies) and Android Chrome
