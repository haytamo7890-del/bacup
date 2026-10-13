# Configuration — every constant and where it lives

Search the quoted text in each file. In the long run these should come from one server config (`/api/config`) so the four pages never disagree.

## 01-landing/index.html
| What | Where (search) | Current value |
|---|---|---|
| Onboarding base URL | `const ONB=` | `https://bacup.ma/onboarding` |
| Ambassador funnel link | `a class="pbtn ambcta" href=` | `https://bacup.ma/ambassadeurs` |
| Hero numbers | `window.BACUP=` | `{students:1002, online:null, founder:80}` — `online` stays hidden until a real number is given. Update live with `window.bacupLive({...})` |
| BAC countdown date | `const J=(()=>{const t=new Date(2027,5,1)` | 1 June 2027 (month is 0-based) |
| Prices shown | text in `#tarif`, `.vs`, mobile bar | 250 DH, ~~450 DH~~ (static text) |
| Card storage key | `KEY="bacup.card"` | shared with onboarding |
| Level test questions | `<script type="application/json" id="bank">` | JSON question bank (LaTeX in `$…$`, rendered by KaTeX) |
| Analytics | `function track(` | pushes to `window.dataLayer` + `bacup:track` DOM event |

## 02-student-onboarding/index.html
`const CFG={…}` near the top of the script:
| Key | Value | Meaning |
|---|---|---|
| `price` | 250 | DH |
| `old` | 450 | crossed-out price |
| `founderPct` | 80 | founder bar |
| `delivery` | 19 | COD delivery fee |
| `refDiscount` | 20 | code discount |
| `app` | `https://bacup.ma/app` | where "Ouvrir Bac Up" goes |
| `signup` | `https://bacup.ma/signup` | legacy, unused |
| `coin` | data URI | ½ dirham image |
| `member` | 1003 | member number on the card (replace with the real one) |

Other lists in the same script: `FIL` (streams per year), `G1`/`G2` (goals), `SCH` (schools + medal + motivational line), `AV` (avatars), `MD` (medal icons), `MV` (mention → target average used by the impact curve).

## 03-ambassador-funnel/index.html
`const CFG={…}`:
| Key | Value |
|---|---|
| `perSale` | 30 |
| `discount` | 20 |
| `price` | 250 |
| `levels` | Argent 0 · Or 10 (+50) · Élite Platinum 25 (+150) · extra 50 (+400) |
| `prizes` | [1000, 500, 250] |
| `bacDate` | `2027-06-01` |
| `site` | `bacup.ma` |
| `dash` | `https://bacup.ma/ambassadeurs/espace` |
| `taken` | reserved codes (replace with the API check) |

Also: `PROF` (profiles), `AUD` (audience ranges), `CITIES`, `CH` (channels with brand icons), `natRank()` / `cityRank()` (**demo** rank formula — replace with real leaderboard).

## 04-ambassador-dashboard/index.html
`const P={…}`:
| Key | Value | Note |
|---|---|---|
| `price` | 250 | |
| `discount` | 20 | |
| `perSale` | 30 | |
| `levels` | same as funnel | |
| `codDays` | 7 | assumption |
| `validDays` | 14 | assumption |
| `minPayout` | 200 | assumption |
| `payDay` | 5 | assumption |
| `site` | `bacup.ma` | used to build `bacup.ma/?ref=CODE` |

Content studio: `const BAC=new Date("2027-06-01")`, colour themes `TH`, templates `TPL`, WhatsApp texts `MSG`.

## Keep in sync
- 250 / 450 / 20 / 19 / 30 and the levels appear in several files: change them together (or serve them from one config endpoint).
- BAC date appears in 3 places (landing `J`, funnel `bacDate`, dashboard `BAC`).
