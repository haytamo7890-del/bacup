# Routes, links and URL parameters

```
                 ?ref=CODE (ambassador link)
                          │
                          ▼
   ┌──────────────────────────────────────┐        "Devenir ambassadeur"
   │  /  Landing                          │ ───────────────────────────────►  /ambassadeurs  (funnel)
   │  hero form · nav · pricing · builder │                                        │ "Ouvrir mon tableau de bord"
   └──────────────────────────────────────┘                                        ▼
        │ entry=start            │ entry=buy                        /ambassadeurs/espace?view=db&p=&code=&city=&prof=
        ▼                        ▼                                         (dashboard)
   ┌──────────────────────────────────────┐                                        │ shares
   │  /onboarding                         │                                        ▼
   └──────────────────────────────────────┘                          bacup.ma/?ref=CODE&src=tiktok …
        │ "Ouvrir Bac Up"                                              (back to the landing)
        ▼
      /app
```

## 1. Landing `/`

Reads: `?ref=CODE` (A–Z, 0–9 only, uppercased). It is appended to every onboarding link so the discount follows the student.

All onboarding links are built by one function, `url(entry, email)`, in the script block `/* ===== v35: CTAs -> onboarding ===== */`. Base URL constant: `ONB`.

| Element | Selector | Goes to |
|---|---|---|
| Nav "Commencer" | `a[data-onb="start"]` | `/onboarding?entry=start` |
| Hero email pill "Accès anticipé" | `form#hform` | `/onboarding?entry=start&email=<typed email>` |
| Pricing "Créer mon compte" | `[data-pt="free"]` | `/onboarding?entry=start` |
| Pricing "Obtenir l'accès complet" | `[data-pt="paid"]` | `/onboarding?entry=buy` |
| Level-test result "Continuer gratuitement" | `[data-c="free"]` | `/onboarding?entry=start` |
| Level-test result "Voir l'accès complet · 250 DH" | `[data-c="paid"]` | `/onboarding?entry=buy` |
| Carte élève builder "Activer ma carte" | `#lcgo` | `/onboarding?entry=start` (+ card params) |
| "Envoyer à mes parents" | `[data-pt="parent"]`, `[data-c="parent"]` | **MOCK** — should open WhatsApp with a parents page link |
| "Tester mon niveau", "Voir le tarif", mobile bar "250 DH" | `[data-go="test"]`, `[data-go="tarif"]` | scroll to `#test` / `#tarif` (in-page) |
| Nav links | `a[href="#cours"]` … | in-page anchors `#cours #plus #tarif #communaute #ambassadeur` |
| "Devenir ambassadeur" | `a.ambcta` | `/ambassadeurs` |
| Community form | `form#jform` | **MOCK** — no submit target yet (see API.md) |

Card parameters added to every onboarding link when the visitor built a card on the landing (`window.buCardData()`):

| Param | Value | Example |
|---|---|---|
| `p` | pseudo (≤ 18 chars) | `p=Haytam` |
| `av` | avatar key (see `assets/icons/avatars.json`) | `av=fusee` |
| `n` | year: `1bac` or `2bac` | `n=2bac` |
| `f` | stream, must match the year's list | `f=SM A` |

The landing also saves the card in `localStorage["bacup.card"]` (same key as the onboarding, see DATA-MODEL.md). On the same domain the onboarding picks it up even without URL params.

Links open in a new tab (`window.open(..., "_blank")`). In production you will probably want the same tab: change `go()` in that block.

## 2. Student onboarding `/onboarding`

| Param | Meaning |
|---|---|
| `entry=start` | "Explorer" path: questions first, then impact curve, then checkout (can skip to free account). Default. |
| `entry=buy` | "Buyer" path: login → checkout → payment → questions. |
| `email=` | Pre-fills the email field on the login screen. |
| `ref=` | Ambassador code, auto-applied (−20 DH), shown as "Invité par CODE". |
| `p`, `av`, `n`, `f` | Card from the landing. If `p` is set the pseudo screen is skipped; if `n`+`f` are set the year screen is skipped. |

Exits:
- "Ouvrir Bac Up" (after card payment, or the final screen) → `CFG.app` = `https://bacup.ma/app`.
- The **Démo** pill top-right (`nav.demo`) is for testing only. Remove it in production.

## 3. Ambassador funnel `/ambassadeurs`

No params. Final button → `CFG.dash` with:

`?view=db&p=<pseudo>&code=<CODE>&city=<city>&prof=<profile>`

## 4. Ambassador dashboard `/ambassadeurs/espace`

| Param | Meaning |
|---|---|
| `view=db` | Open straight on the dashboard (otherwise the old welcome/sign-up view shows, see INTEGRATION.md) |
| `p`, `code`, `city`, `prof` | Fill the ambassador identity (pseudo, code, city, profile) |

In production these come from the session, not the URL.

The ambassador's share link is `bacup.ma/?ref=CODE`, with an optional source tag `&src=instagram|tiktok|whatsapp|youtube` (built in "Code et liens"). The landing should log `ref` + `src` as a click (see API.md).
