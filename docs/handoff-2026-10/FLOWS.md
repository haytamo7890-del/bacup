# Flows, screen by screen

Screenshots for every step are in `shots/` (file names match the step ids below).

## A. Landing

1. **Founder intro** (every page load, skipped with `prefers-reduced-motion`): « Salut, moi c'est Haytam. » → … → « IT'LL BE FUN », shrinks into the hero, then the activation card flies in (flip + shine) and lands beside the headline. Click anywhere to skip.
2. **Hero** (always light): BAC countdown pill (days only), headline, email pill "Accès anticipé", "Fonctionne avec" chip, social proof (students count + avatars), founder bar (80 %), "10K+ QCU", laptop mockup rising on scroll.
3. Sections in order: Pourquoi (word-lighting text) → level test (real QCU bank, KaTeX math) → Cours → Annales → Monk Mode → feature carousel (Plan BAC, Révisions espacées, Bac Up Intelligence, Bibliothèque, Classement; auto-advance 7 s) → Classement → VS (cost comparison) → **Carte élève builder** → Tarif (Gratuit / Accès complet with Concours Pass bonus / parents) → Communauté (form) → Ambassadeurs (3 revolving cards) → FAQ.
4. **Carte élève builder** (`#carte`): pseudo, 8 avatars, year (1bac/2bac), stream. The card updates live and is saved for later; "Activer ma carte" opens the onboarding with the card.

## B. Student onboarding

Step ids (internal names in `SC` / `F`): `login, name, profil, note, ecole, build, impact, checkout, paid, cod, done`.

### B1. Explorer (`entry=start`)
```
login → name* → profil* → note → ecole (2bac only) → build → impact → checkout
                                                                    ├─ card  → paid → /app
                                                                    ├─ COD   → cod  → done → /app
                                                                    └─ "Continuer avec le compte gratuit" → done → /app
```
### B2. Buyer (`entry=buy`)
```
login → checkout ─┬─ card → paid → name* → profil* → note → ecole (2bac) → build → done → /app
                  └─ COD  → cod  → (same questions)                          → done → /app
```
`*` skipped when the card came from the landing (pseudo / year+stream already known).

| Step | Content | Saved fields |
|---|---|---|
| `login` | Google, Apple, email. Email pre-filled from `?email=`. "Invité par CODE · −20 DH" badge when `ref` present. | session |
| `name` | Pseudo (≤ 18, changeable later), 8 glass-medal avatars **or** own photo → crop modal (drag + zoom, outputs 320×320 JPEG). | `pseudo`, `avatar` or `photo` |
| `profil` | Year: 1bac / 2bac. Stream list depends on year: 1bac → Sciences Ex, Sciences Maths · 2bac → PC, SVT, SM A, SM B. Subtitle changes per year. | `level`, `stream` |
| `note` | Current average slider (6–19, step 0.5). Goal: **1bac** = régional target 12+/14+/16+/18+ · **2bac** = mention Passable/Assez bien/Bien/Très bien. | `average`, `goal` |
| `ecole` | 2bac only. Médecine, ENSA·ENSAM, CPGE, ENCG, ISCAE, ENA, Pas encore décidé. Each has its medal and a line (« Un bon médecin se prépare dès aujourd'hui. »). | `dreamSchool` |
| `build` | Progress ring 0→100 %, checklist, auto-advance. | — |
| `impact` | Exponential curve "Résultats / Discipline", 3 stats, goal box. All numbers are illustrative (computed from the answers). | — |
| `checkout` | Plan card (250 DH, ~~450~~, ½ DH coin line, founder bar, Concours Pass bonus). Payment: **Carte bancaire** (CMI · Visa · Mastercard, instant access) or **À la livraison** (phone, city, address; +19 DH delivery). Promo/ambassador code field (or auto-applied). Live summary. | `order` |
| `paid` | "Paiement confirmé · Bienvenue chez les Fondateurs." | — |
| `cod` | Thank-you: we call to confirm → delivery 24–48 h, pay cash → scratch & activate. Order number. Free account open meanwhile. | — |
| `done` | Summary, "Ouvrir Bac Up". | — |

The **Carte élève** on the right (desktop) / pinned on top (phone) fills in with every answer: avatar, pseudo, year·stream, goal, school, member number `BU · 2027 · 01003`, "Carte élève" → "Membre Fondateur" after payment.

## C. Ambassador funnel

Step ids: `login, name, city, profil, audience, gains, course, kit, charte, done`.

| Step | Content | Saved fields |
|---|---|---|
| `login` | "Rejoins la squad. Partage. Gagne. Level up." 3 perks (30 DH/sale, −20 DH for friends, 1 000 DH for #1 of the month). Google / Apple / email. | session |
| `name` | Pseudo + code `BAC-XXXX` (auto from pseudo, editable, 4–12 A–Z0–9, live availability check) + avatar or photo (crop). | `pseudo`, `code`, `avatar/photo` |
| `city` | 12 city chips + free input. | `city` |
| `profil` | Lycéen(ne), Collégien(ne), Étudiant(e), Créateur de contenu, Enseignant(e), Freelance, Salarié(e), Parent, Autre (auto-advance). | `profile` |
| `audience` | Followers: < 1K, 1K–10K, 10K–100K, 100K–1M, > 1M · channels (multi): TikTok, Instagram, WhatsApp, Snapchat, YouTube, En classe. | `audience`, `channels[]` |
| `gains` | Slider "accès this month" (0–80) → live DH total incl. level bonuses; level rail; card flips Argent → Or → Platinum; estimated city & national rank; Top-3 prize hint. **Ranks are a demo formula.** | — |
| `course` | Monthly race podium 1 000 / 500 / 250 DH, days left, city leaderboard (example rows) with the user's row. | — |
| `kit` | 3 ready-to-post mockups with their code; 4 missions with badges (locked). | — |
| `charte` | 3 rules + age group (< 18 → parent consent before 1st payout) + accept checkbox. | `ageGroup`, `charterAcceptedAt` |
| `done` | Confetti, Argent card, "Bienvenue dans la squad", dashboard preview, button to the dashboard. | → create ambassador (status `pending_review`) |

## D. Ambassador dashboard

Sidebar: Accueil · Ventes · Paiements · Code et liens · Guide et contenus · Ma carte et niveaux · Classement · Profil. Period switch 7 / 30 / 90 days.

- **Accueil**: "La course du mois" (prizes, days left), KPIs (gains, accès vendus, clics, inscriptions) with sparklines, clicks per day chart, today's to-dos, click sources, click → sign-up → sale funnel, earnings breakdown.
- **Ventes**: daily sales chart + table (date, student first name, channel, via code/link, payment card/COD, status, share).
- **Paiements**: amounts per status (in delivery, pending, validated, paid), next transfer date, history.
- **Code et liens**: code, link, source-tagged links, QR code (printable card).
- **Guide et contenus**: **Studio de contenus** (3 video templates × 4 colours + custom line → MP4/WebM 7 s 9:16; WhatsApp message + status PNG), how-to guides, 10 video ideas, don'ts.
- **Ma carte et niveaux**: revolving Argent / Or / Élite Platinum cards, progress, bonuses.
- **Classement**: monthly leaderboard (first name + city only).
- **Profil**: identity + payout account; "Modifier mes informations" opens the payout form (holder, bank, CIN, 24-digit RIB, parent phone + consent for minors).

Sale statuses used everywhere: `in_delivery` (En livraison) · `pending` (En attente) · `validated` (Validée) · `paid` (Payée) · `refunded` (Remboursée) · `delivery_refused` (Livraison refusée).
