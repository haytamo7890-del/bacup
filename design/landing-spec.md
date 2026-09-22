# Bac-up — Landing Page Spec (Postflows-inspired)

_Single source of truth for the build. Every decision below is locked with Haytam._

## Strategy & positioning (drives everything)
- **Payer = the student** (argent de poche) → keep student-voiced ("tu"); **dual price anchor**: parent-frame (_ce que tes parents paieraient 150 DH/séance_) **+ pocket-money reframe** (_220 DH = 2 sorties, pour tout ton BAC_). Self-pay students often have no card → **Cashplus is essential**.
- **#1 objection = TRUST** (new brand, pay upfront, no refund) → the page's main job is **credibility, not hype**: **demo = top conversion tool** (try-before-trust, placed high), **founder story load-bearing**, real screenshots, "conçu au Maroc", "signale une erreur" honesty. De-risk > hype.
- **Real competitor = cours particuliers** → position: **24/7 vs sur rendez-vous · toutes les matières vs un prof/une matière · une fraction du prix · zéro déplacement**.
- **Acquisition (rec): organic TikTok/Insta + WhatsApp binôme virality** (trust favours organic/creator; paid ads flagged for minor-targeting) → tune page for **fast mobile hook + demo above the fold + shareable + founder face**.
- **Demo = the whole funnel:** page funnels to **"Essaie la démo" first** (demo earns trust) → then **"Obtenir l'accès"** collects. Demo placed high + repeated.
- **Price:** 220 DH **single payment** (no split).
- **Lifecycle:** design the **1bac → 2bac upsell** — this year's 1bac buyers are next year's 2bac buyers; loyalty/returning discount at renewal (real LTV on a one-time product).
- **Timing:** **launch NOW (la rentrée, Sept 2026)** — founder pre-sale immediately. "Why now" = **rentrée (best moment to start a system) + prix fondateur + places limitées**. Copy angle: _"Commence l'année en tête."_
- **Demo designed around the "IA aha":** the demo + hero sample question must deliver a moment where a stuck concept **clicks** via the IA explanation. That feeling is the buy trigger.
- **North-star = demo-start rate** → optimize the page to maximise demo starts (prominent, low-friction, above the fold); everything else secondary.
- **Content:** **all subjects ready at launch** → "toutes les matières" is honest (content completion is on the critical path before opening).
- **#1 risk = distribution** (reaching students) → the landing must be a **virality + conversion engine**: binôme loop, WhatsApp share, shareable OG, founder face for TikTok, ambassador-ready. Growth engine > page polish.

### Growth engine
- **Ambassador program:** **20 DH cash per sale**, **unique code each** (tracked at checkout; ~200 DH net on referred sales) → landing has a **"Deviens ambassadeur"** entry (footer/mini-section). Users → sales force.
- **Founder-led content:** **Haytam is the face** (TikTok/Insta), **primary pillar = his story + mission** → founder section is load-bearing; page carries the Haytam narrative; link founder socials (later).
- **Viral object = the binôme WhatsApp invite** → the WhatsApp share **IS the growth loop**: make it frictionless + prominent (pre-filled message), not buried in pricing.
- **Cold-start (rec):** **comp'd founding cohort** from Haytam's network/school → seeds the leaderboard with *real* names, first authentic testimonials, first ambassadors. Closed group, not a public free plan.

## Foundations
- **Offer:** Paid **early access** — prix fondateur, places limitées. **No free plan. No refund** → lean hard on trust signals (see note).
- **CTAs everywhere:** primary **"Obtenir l'accès"** (paid) + secondary **"Essayer la démo"** (email-gated → full sandbox). Hero also has an inline **live sample question**.
- **Price:** **220 DH solo** one-time, toute l'année (1bac & 2bac same). **Pack Binôme: 200 DH chacun** (2 achetés ensemble = 400 DH / 2 codes, synchronous, no cash-back). Framed: ~~prix normal ~450 DH~~ → **220 DH prix fondateur**, anchor _un cours particulier ≈ 150 DH_, _< 1 DH/jour_. Ritual line: _"Le BAC se prépare à deux."_
- **1bac/2bac clarity (to convert):** surfaced 3× — hero chips, pricing toggle (same 220 DH), and woven in copy ("que tu sois en 1bac ou 2bac, tout est adapté à ta filière").
- **Visual journey:** **Light → dark.** Opener + leaderboard + features start light; page darkens through Avec/Sans → founder → impact → footer.
- **Positioning:** **Fun + efficace.** Tagline: _"Réussis ton BAC. Sans t'ennuyer."_ (logo lockup, OG card, ads, meta).
- **Motion (dynamic like Postflows):** scroll-reveal on every block, count-up numbers, draw-on curves, sticky "chapter" beats, auto-scroll marquee, hover micro-interactions. **Full rich on all devices** — keep to GPU-friendly transform/opacity so it stays smooth on budget Android; `prefers-reduced-motion` fallback kept for accessibility.
  - **Character:** **smooth & confident** — long gentle eases (~0.6–0.9s), nothing bouncy.
  - **Scroll:** reveal-on-enter for most blocks + a few **scroll-progress moments** (hero dash pop-out, curve draw, gradient sweep).
  - **Pointer:** **magnetic CTAs + 3D card tilt** + glow response (desktop; graceful degrade on touch).
  - **Ambient:** **subtle & living** — slow gradient drift + a floating orb + the marquee, calm at rest.
  - **Reveal:** rise +~20px + fade; children **staggered ~80ms**.
  - **Headlines:** **word-by-word rise** (cohesive with the founder quote).
  - **Intro (~1s):** arctic **orb draws/glows in → "Bac-up" wordmark → lifts/fades to reveal hero**.
  - **Gradient sweep:** **scroll-progress driven** — dark bleeds up as you scroll the Avec/Sans transition.
- **Share card:** custom branded **OG image** + title/description tuned for WhatsApp shares.
- **Domain:** none yet — placeholder (suggest **bacup.ma**).
- **Accent:** arctic cyan → blue + mint glow. **Real logos:** WhatsApp, Gmail (personalised files from Haytam).
- **Typography:** bold **display font for headlines** (geometric — Space Grotesk / General Sans vibe) + **Inter** for body.
- **Light→dark pivot:** light through opener → features → metrics → flows; **flips dark at Avec/Sans via a smooth gradient sweep** and stays dark to the footer (founder, impact, pricing, FAQ, CTA all render dark).
- **Buttons:** primary = arctic **cyan→blue gradient + soft glow-shadow**, lifts on hover.
- **Page entrance:** **~1s branded Bac-up orb/logo intro** → hero reveals.
- **Mobile-first:** single-column stack (feature rows, Sans→Avec, marquee still scrolls). Audience is almost all on phones.
- **Scarcity (seeded, static — no live ticker):** seat bar ~**87% des places fondateur prises · plus que ~40 places** + **"−40% prix fondateur"** badge.
- **Nav:** Programmes (1bac/2bac) · Fonctionnalités · Tarifs · Démo · [lang toggle] · CTA.
- **Leads:** demo/access emails → Supabase `leads` table **+ Resend email alert** to Haytam.
- **Social proof:** soft phrasing — _"Rejoins les premiers élèves fondateurs"_ (no invented count).
- **Language:** **French default**, **Arabic (العربية) toggle added right after** — build **RTL-ready (full mirror)**; layout flips for AR. ~2× copy. FR ships first, AR follows once FR is approved.
- **Payment:** CMI (carte) · Cashplus / Wafacash (cash) · virement — shown as a **trust strip with provider logos** on the pricing block.

## Section order
0. **Sticky CTA bar** — **appears after the hero** (not from top). Logo + "Obtenir l'accès · prix fondateur" + mini seat indicator + "Démo" secondary.
1. **Opener** — **"Ta prépa BAC, enfin fun et efficace."** / _"Fini les fiches ennuyeuses. Un système qui te fait progresser — et qui te donne envie de continuer."_ Animated **mix of dashboard screens** with **blur→sharp scale-up** on scroll (Mac 3-dot chrome), doubling as an **inline live sample question** (answer → correct/faux + /20 + **IA teaser** + soft CTA "Débloque tout · Essaie la démo"). Primary CTA **"Obtenir l'accès"** + secondary **"Essayer la démo"** + **1bac-up / 2bac-up** chips + seat counter.
2. **Rejoins les meilleurs** — **glassy student card marquee, one row, slow, pause on hover, top-rank card glows**: rang · score · XP · _"Pseudo · filière · ville"_ (e.g. Yassine B. · 2 Bac SM · Casablanca). Seeded.
3. **Features — 4 alternating full-width rows** (dashboard mock + copy + **mini student testimonial** each), order **Work → smart → focus → fun**:
   1. Moteur d'examens /20
   2. IA Explique (5 modes)
   3. Monk mode (défi discipline)
   4. Gamification (XP, série, mastery, note estimée)
4. **Three connected metrics — the engine:** matières couvertes · correction en **<2s** · **5 modes** d'explication IA. **Three nodes connected by animated flowing lines** (our answer to +12 / 99.8% / <5s).
5. **La boucle qui fait progresser** — **circular auto-rotating ring**, 5 nodes **Révise → Teste → Corrige → Comprends → Remonte**, arrows animating around it → **"Obtenir l'accès"** CTA.
6. **Avec / Sans Bac-up** — **EXACT iPhone notification-banner layout** (per Postflows ref image): two columns, each = 3 stacked iOS banners `[app icon] · [titre gras + emoji] · [timestamp] / [sous-titre]`. Left **Sans = gris/gloom**, right **Avec = arctic/warm**. Icons: **Gmail · WhatsApp · Bac-up**.
   - **Sans (gauche):** 1) 📧 "Où est passée ma moyenne? 💀" _/ Toujours bloqué à 08/20._ · now — 2) 💬 "Je suis complètement perdu 😩" _/ Je sais même pas par où commencer._ · 2m — 3) 🅱️(grisé) "Stress +42% cette semaine" _/ 3ème nuit blanche sans méthode._ · 5m
   - **Avec (droite):** 1) 🅱️ "Moyenne +6 pts ce mois 📈" _/ Note estimée : 16,2/20._ · now — 2) 📧 "Enfin je comprends tout 🧡" _/ L'IA m'a débloqué en physique._ · 4m — 3) 💬 "Coach : ta séance du jour est prête 💪" _/ 2 exos sur tes points faibles._ · 12m
7. **Founder statement (Haytam)** — **word-by-word scroll reveal** (Postflows-style, text lights up as you scroll), empathy/method:
   > «J'ai vu trop d'élèves brillants stresser et échouer au BAC — pas par manque d'intelligence, mais de méthode. Alors j'ai construit Bac-up : pour rendre la réussite fun, claire et à la portée de tous.» — Haytam, fondateur de HSGenius
   _(name + title only, no photo)_
8. **L'impact de Bac-up** — exponential curve (reuse built component), **toggle Résultats × Discipline**:
   - _Résultats:_ +pts de moyenne · note estimée ×2,5 · top 10% de la classe
   - _Discipline:_ jours de série · temps de focus · examens blancs faits
   - **Toggle redraws the curve + re-counts the numbers** on each switch.
   - (exact numbers TBD with Haytam)
9. **Pricing — Le Pack Bac-up** (dark) — **two-column**: left = value-stack checklist (toutes les matières · examens blancs /20 · IA Explique · Coach IA · Monk mode · Classement · mises à jour · accès démo→complet); right = price card (**~~450 DH~~ → 220 DH fondateur**, _< 1 DH/jour_, tutoring anchor 100–150 DH, seats ~87%, primary "Obtenir l'accès" + secondary "Essayer la démo", **payment logos** CMI/Cashplus/Wafacash). **Two toggles:** _niveau_ (1bac/2bac — same price) and _formule_ (**Solo 220 · Binôme 200 chacun**). Binôme = "Le BAC se prépare à deux" + **"Partage sur WhatsApp"** invite button (pre-filled message). **Redemption:** buyer pays 400 → receives **2 codes** → sends one to a friend on WhatsApp; **any pairing** (each gets their own program).
10. **FAQ** — **accordion, one open at a time, ~7 Q** (proposed, editable): C'est quoi Bac-up ? · Ça marche pour ma filière ? (SM-A/B, PC, SVT, ECO) · 1bac vs 2bac ? · C'est quoi l'accès fondateur / le prix ? · Y a-t-il un essai gratuit ? (non → démo + accès fondateur) · Sur quels appareils ? · Les corrections/annales sont-elles fiables ? (corrections HSGenius) · Quand je reçois mon accès ?
11. **Final CTA — rotating-verb band:** "Les meilleurs élèves ne laissent rien au hasard. Ils **[progressent / cartonnent / réussissent]**." + big CTA + seat counter.
12. **Footer** — **multi-column** (Produit · Programmes · Légal · Contact) + **newsletter capture ("Conseils BAC gratuits chaque semaine")** + legal links + **socials later (none yet)** + credit **"Built by HSGenius"**.

## ⚠ No-refund trust note
No free plan + no refund is high-friction. Compensate with: (1) **interactive demo** (try a real question + see /20 correction & IA explanation live — recommended), (2) strong social proof (leaderboard + per-feature testimonials), (3) founder statement, (4) transparent real screenshots/video, (5) scarcity, (6) de-risking FAQ.

## Demo experience (product work — specced separately, but drives the landing CTAs)
- **Entry:** "Essayer la démo" → **email capture** (lead) → **direct access, NO email verification** → into the app.
- **Scope:** **full free-roam sandbox** — seeded dashboard, an exam, corrections, IA Explique, leaderboard, monk mode. **Opens on content that adapts to the niveau/filière** picked in the hero chips.
- **Preview only:** demo progress does **NOT** carry into a purchase (purchase = fresh account) → a **shared reset sandbox** is fine, no per-user persistence needed.
- **Data hygiene:** shared sandbox auto-resets; seed data = demo student, default rankings, a few completed exams + XP, a sample correction.
- **Conversion inside demo:** "Obtenir l'accès" prompts on locked chapters / save-progress / premium bits.
- **Hero taste:** one live sample question inline (no email) → the aha before the email gate.

## Dashboard enhancement (for all mockups)
Real screens are used as base but **marketed**: swap Haytam's PII (name, haytamo7890@gmail.com, ID 80482) for a seeded demo identity; **fill empty data** — leaderboard populated with Moroccan pseudos climbing real XP (244/231/218…), Monk streak bumped to ~12j, Cours with subjects unlocked + mastery. No dead "0 XP" rows.

## Assets — received vs needed
**Received:** Classement · Monk Mode · Cours & Résumés · WhatsApp + Gmail logos (from ref) · support (bacup@gmail.com / 0619340506).
**Still needed from Haytam:**
- Screenshots: **Examens** (exam run + /20 result) · **IA Explique (5 modes)** · **Aperçu/Dashboard** home.
- **Logo files**: payment — **CMI, Cashplus, Wafacash** (+ any others Haytam is sending). Bac-up app icon recreated from the app.
- **Real numbers** when ready: student count, note gains, matières, questions, **price + founder discount**, seat count.
- Optional: **founder photo** (Haytam) for section 7.
- **Demo seed data**: default demo student, seeded rankings, sample completed exams + a sample correction (for the sandbox).
- **Support**: real support **email** + **WhatsApp number** (footer + support link).

## Marketing & measurement
- **Coverage claim:** "toutes les matières" — ✓ **all subjects ready at launch**, so the claim is honest (content completion on critical path before opening access).
- **Ad pixels:** Meta (Insta/FB) + TikTok — **fire only after consent**.
- **Analytics:** privacy-light (Plausible or Vercel Analytics), no cookie.
- **Consent:** minimal banner **required** (because pixels present); pixels gated behind it.

## Post-lead, legal & support
- **Lead nurture (Resend):** welcome email (demo link) → 2–3 nudges (prix fondateur qui se termine, ce qu'ils ratent).
- **Legal pages:** **CGV** (encodes the no-refund policy — required for CMI + enforceability) · **Politique de confidentialité** · **Mentions légales**. I'll draft all three.
- **Support:** **bacup@gmail.com** · **WhatsApp 0619340506** (footer + support link).
- **Copy locked** — Hero rotating: _ton BAC / 18/20 / ton rêve / ton admission_. Final-CTA verbs: _progressent / cartonnent / réussissent_.

## Policy & compliance (⚠ = verify with a lawyer for loi 09-08)
- **Minors/consent:** statement **"16+, ou avec accord parental"** (no hard checkout gate).
- **Refund:** no refund, **disclosed in CGV only**. ⚠ _Recommend surfacing one line at checkout — a buried no-refund term is weaker/enforceability + invites chargebacks._
- **Ads to minors:** **standard targeting** (Haytam's call). ⚠ _Meta & TikTok restrict/prohibit targeted ads to under-18s; risk of ad-account restriction + legal exposure. Safer: target parents/18+, consent-gate pixels, no minor profiling._
- **AI accuracy:** corrections **HSGenius human-verified**, presented as reliable + **"signale une erreur"** report link. No blanket AI disclaimer.
- **Data retention:** keep while account active, **delete within X days on request** (droit à l'effacement).
- **Messaging consent:** **opt-out / on by default** (Haytam's call). ⚠ _WhatsApp Business **requires opt-in** — opt-out risks a number ban; email marketing without consent is unlawful in most places, esp. minors. Recommend opt-in for WhatsApp at minimum._
- **Seeded testimonials/leaderboard:** **presented as real** (Haytam's call). ⚠ _Invented users shown as genuine = deceptive/false-testimonial risk + reputational blowup if spotted. Recommend a small "exemples · illustratif" tag until real ones exist._
- **Anchor price:** ~450 DH = **genuine future launch price** (real reference, defensible). ✓
- **Legal pages:** CGV (encodes no-refund) · Confidentialité · Mentions légales — I draft; lawyer reviews.

## Numbers (placeholders — overwrite anytime)
- **Scarcity:** 300 places fondateur · 87% prises · ~40 restantes.
- **Price:** ~~450 DH~~ → **220 DH fondateur solo** / **200 DH binôme** · ≈ 0,8 DH/jour · cours particulier ≈ 100–150 DH.
- **Hero pills:** 2 programmes · 5 filières · +2 400 questions & annales.
- **3 engine metrics:** correction <2s · 5 modes d'IA · +40 annales officielles.
- **Impact — Résultats:** +5,2 pts de moyenne · note estimée ×2,4 · Top 10% de la classe.
- **Impact — Discipline:** 38 j de série (moy.) · +12h de focus/semaine · ×3 examens blancs.
- **Leaderboard (seeded):** 244 / 231 / 218 / 205 / 197 XP, Moroccan pseudos · Monk streak 12 j.

## Build approach
Standalone HTML mockups, **section by section**, for approval → then port into the Next.js landing (arctic-glass system, `src/app`). **Copy written per-section at build.** Not wired to real code until approved.
- **Scope v1:** landing (mockups → Next.js) **+ live lead capture** (Supabase `leads` table + Resend alert). **Demo sandbox = separate workstream.**
- **Ambassador entry** ("Deviens ambassadeur") included on v1.
- **Hero sample question:** I mock a representative Q + /20 correction + IA explanation **per filière** (Haytam verifies accuracy).
- **Wordmark/logo:** await Haytam's logo file (placeholder "B" tile until then).
