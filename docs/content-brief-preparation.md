# Bac Up — Brief contenu « Espace de préparation »

> For the content team. Read this first, then open `content/prep/examples/pc-rc-exemple-complet.json`: it shows the quality level expected in **every** file.
> Scaffolds to fill: `content/prep/scaffolds/<pack>/<chapitre>.json` (list and priorities in `_manifest.json`).

---

## 1. What we are building (and why it will be the best)

The Espace de préparation takes what the best products each do well and puts it in one place:

| Benchmark | What we take from it | How it shows up in the app |
|---|---|---|
| **Khan Academy** | Mastery per skill | Every **cours notion** climbs *À découvrir → En cours → Acquis → Maîtrisé → Niveau BAC* |
| **Brilliant** | Guided problems, one step at a time | **Problèmes type BAC**: a shared statement, then chained sub-questions (Partie A/B) |
| **Anki / Duolingo** | Spaced repetition | **À revoir**: every mistake comes back after 0 d → 1 d → 3 d → 7 d until it is mastered |
| **Kartable / SchoolMouv** | Tight fit with the cours | Every question is tagged with an **exact `##` heading of the cours**, so « Revoir le cours » opens the right notion |
| **Real BAC papers** | Real exam difficulty | Problems adapted from the annales we hold, re-expressed in our own words |

**Your job:** give each notion enough good questions for these mechanics to work. The student sees:

1. an **indice** (optional hint) before answering;
2. after answering, **why their choice is wrong** (the `why` of the chosen option) and why the right one is right;
3. the **corrigé** (`solution`) and the **méthode à retenir** (`methode`).

A question without `why` on its traps, or without a `hint`, is only half a question.

---

## 2. The workflow

1. Take a scaffold, e.g. `content/prep/scaffolds/pc-commun/pc-rc.json`. Start with the **P1** files (PC + SVT filières).
2. Read its `_scaffold` block: the allowed notions, existing questions, targets, suggested figures, and the **sources** (annales + corrigés we hold, with file paths).
3. Fill in the blocks that have `"_todo": true`:
   - write the questions (copy the template, increment `-q1`, `-q2`…);
   - **delete the line `"_todo": true`** from every block you finished. Blocks still marked `_todo` are ignored at import, so a partial file is fine.
4. **Admin → Préparation → Import JSON** → drop the file → **Vérifier**. Fix every red error and read the amber warnings (a notion that doesn't match a heading, a missing solution…).
5. **Importer**, with "Régénérer les séries auto" ticked.
6. Check in the app: Préparation → the subject → Par notion → the chapter.

The CLI works too: `npm run import:prep content/prep/scaffolds/pc-commun/` (dry run), then `-- --commit --regen`.

> Re-importing the same file is safe: `ref`s update in place, with no duplicates and students keep their history. **Never rename a `ref`** once imported.

---

## 3. File format (`bacup.prep/v2`)

```jsonc
{
  "format": "bacup.prep/v2",
  "level": "2bac",
  "subject": "pc",                // maths | pc | svt | si
  "track": null,                  // tronc commun  — OR —  "tracks": ["pc","svt"] (same content for several filières)
  "_scaffold": { … },             // information only, ignored at import
  "exercises": [ … ],
  "series": [ … ]
}
```

### 3.1 QCU exercise (one per notion)
```jsonc
{
  "ref": "pc-rc-la-charge-du-condensateur",   // stable, never renamed
  "chapter": "pc-rc",                          // chapter code (given)
  "kind": "qcu",
  "title": "La charge du condensateur",
  "difficulty": 2,
  "origin": { "type": "original" },            // or annale, see §5
  "questions": [ { …question… } ]
}
```

### 3.2 Question
```jsonc
{
  "ref": "pc-rc-la-charge-du-condensateur-q1",
  "notion": "La charge du condensateur",       // EXACT text of a ## heading (list in _scaffold.notions)
  "difficulty": 2,                             // 1 facile · 2 moyen · 3 niveau BAC
  "statement": "À la date $t = \\tau$, la tension $u_C$ vaut environ :",
  "options": [
    { "label": "$0{,}63\\,E$", "correct": true, "why": "Pourquoi c'est juste (1 phrase)." },
    { "label": "$0{,}37\\,E$", "why": "The exact mistake of a student who picks this." },
    { "label": "$E/2$",        "why": "…" },
    { "label": "$E$",          "why": "…" }
  ],
  "hint": "A nudge that points the way without giving the answer away.",
  "solution": "The Bac Up corrigé, step by step.",
  "methode": "The reusable method in 1–2 lines (optional but strongly recommended).",
  "points": 1
}
```

### 3.3 Guided BAC problem (`kind: "probleme"`, 2 per chapter)
```jsonc
{
  "ref": "pc-rc-probleme-1", "chapter": "pc-rc", "kind": "probleme",
  "title": "Identifier un condensateur par sa charge",
  "difficulty": 3,
  "figure": "rc-charge",                       // optional: a figure name from §7
  "origin": { "type": "annale", "ref": "pc-svt-2023-normale", "exercise": "Exercice 3", "reexpressed": true },
  "context": "Shared statement: data, set-up, notation.",
  "questions": [
    { "part": "Partie A — Étude théorique", "notion": "…", "difficulty": 1, … },
    { "part": "Partie A — Étude théorique", "notion": "…", "difficulty": 2, … },
    { "part": "Partie B — Exploitation",    "notion": "…", "difficulty": 3, … }
  ]
}
```
- **5 to 8 sub-questions**, rising difficulty (1 → 3), like a real BAC exercise.
- Each sub-question is tagged with **ONE** notion of the chapter. That's what makes a notion reach **« Niveau BAC »**: the student must also pass the problem questions on it.
- The `context` is shown in the app above every sub-question: put **all** the useful data in it.

### 3.4 Série (3 per chapter)
```jsonc
{ "slug": "pc-rc-serie-1", "title": "Dipôle RC · Échauffement", "description": "…",
  "kind": "custom", "chapter": "pc-rc", "difficulty": 1, "xp_bonus": 20, "position": 101,
  "questions": ["pc-rc-…-q1", "pc-rc-…-q2", …] }       // 8 to 12 refs, easiest to hardest
```
| Série | Content | Difficulty | Bonus XP |
|---|---|---|---|
| **Échauffement** | the core notions, difficulty 1–2 | 1 | 20 |
| **Entraînement** | every notion of the chapter, mixed | 2 | 30 |
| **Type BAC** | difficulty 3 + problem sub-questions | 3 | 50 |

The bonus is awarded once, the first time the student scores ≥ 70 %. **Bilans, Unités** and **Mixtes BAC** séries are generated automatically, so don't build those.

---

## 4. Quality rules (non-negotiable)

**Statement**
- One question = one idea. Short, precise, no ambiguity. Units always given.
- Math in `$…$`, French decimal comma `2{,}0`, units in `\mathrm{}`. In JSON, **double every backslash**: `\\tau`.

**Options (4)**
- **Exactly one** correct answer. The order doesn't matter (the app shuffles).
- Every wrong answer is a **real trap**: the result of a typical mistake (forgot to convert, sign error, wrong formula, confused charge/décharge, stopped one step short…).
- Same format and same length for all 4 options, so the answer can't be guessed from its shape.
- No « aucune des réponses » / « toutes les réponses ».

**`why` on every option**
- On a trap: **name the exact mistake** (« Tu as calculé $C/R$ au lieu de $R\times C$. »). Informal *tu*, one sentence.
- On the right answer: the key justification in one line.

**`hint`**: points the way (« Isole l'exponentielle puis passe au $\ln$ ») **without giving the answer**.

**`solution`**: a complete corrigé, calculations spelled out, ending with the result and its unit. **In our own words.**

**`methode`**: what the student must remember so they don't make the mistake again (a reflex, a formula, benchmark values).

**Difficulty**
- **1 — Facile**: direct application of a definition or formula (1 step).
- **2 — Moyen**: 2–3 steps, or a graph/document to read.
- **3 — Niveau BAC**: reasoning or a classic trap from the exam, several steps, the notation of the papers.

**Mix per notion** (see `_brief.difficulty_mix`): cours → 1 facile, 2 moyen, 1 niveau BAC · expérimental → 1 + 1 · approfondissement → 1 niveau BAC.

**Always check** every number (recompute it), every unit and the single correct answer. A false corrigé costs more than a missing question.

---

## 5. Sources and IP (important)

- **Allowed sources**: the annales we hold, `annales-propres/` (sujets) and `corriges-propres/` (corrigés), plus `annales-a-uploader/`. Each scaffold lists the ones for its subject and filière in `_scaffold.sources`.
- **Forbidden**: `exam-pdfs/**` (MonBac material). Never copy it and never use it as a model.
- **Adapting an annale problem**
  1. pick an exercise from the annale that covers **this chapter**;
  2. **change the numerical values and the context** (other components, other data), keeping the logic of the questions;
  3. **rewrite** the statement and the corrigé in our own words, and recompute everything;
  4. fill in `origin`: `{"type":"annale","ref":"pc-svt-2023-normale","exercise":"Exercice 3","reexpressed":true}`.
- For a fully original question: `"origin": {"type":"original"}`.
- The answers and methods of public exams are facts; the **wording and layout** of a third-party corrigé are not ours. That's why we re-express everything (see CLAUDE.md, the IP rule).

---

## 6. Volume and priorities

`content/prep/scaffolds/_manifest.json` gives the targets per file. Overall:

| Pack | Filières | Priority | Chapters | Notions | New QCU targeted |
|---|---|---|---|---|---|
| maths-scex | PC + SVT | **P1** | 6 | 142 | 452 |
| pc-commun | PC, SVT, SM (tronc commun) | **P1** | 27 | 381 | 979 |
| pc-specifique | PC, SM-A, SM-B | **P1** | 2 | 15 | 49 |
| svt-pc | PC | **P1** | 10 | 140 | 377 |
| svt-svt | SVT | **P1** | 11 | 160 | 417 |
| maths-sm | SM-A + SM-B | P2 | 8 | 97 | 274 |
| svt-sm | SM | P2 | 4 | 77 | 211 |
| si-smb | SM-B | P2 | 8 | 106 | 285 |

Plus **2 problems** and **3 séries** per chapter (152 problems, 228 séries).
Inside a file, the notions are already sorted by **BAC frequency** (the most-examined ones first): fill them in that order.

**Suggested pace:** 1 chapter = one working session. Import after every chapter.

---

## 7. Available figures (`"figure": "…"`)

Only these names work (they're drawn in `src/components/course/figures.tsx`). Each scaffold suggests the relevant ones in `_scaffold.suggested_figures`. Need a new figure? Describe it in the `context` and ask the dev team.

`tvi` · `gendarmes` · `asymptote` · `suite-monotone-bornee` · `suite-escalier` · `convexite-inflexion` · `ln-exp-symetrie` · `plan-complexe` · `complexe-rotation` · `onde-transversale` · `onde-corde` · `diffraction` · `radioactivite` · `diagramme-nz` · `courbe-aston` · `diagramme-energie-nucleaire` · `rc-charge` · `rc-decharge` · `cinetique` · `titrage-ph` · `pile` · `projectile` · `vecteurs-cinematiques` · `chute-fluide-forces` · `chute-fluide-vitesse` · `projectile-portee` · `chronophoto-projectile` · `particule-champ-e` · `particule-champ-b` · `satellite-orbite` · `kepler-ellipse` · `pendule-torsion` · `pendule-pesant` · `oscillations-amorties` · `energie-oscillateur` · `niveaux-energie` · `montage-celerite` · `onde-types` · `retard-temporel` · `onde-phase` · `diffraction-ecran` · `dispersion-prisme` · `montage-rl` · `rl-rupture` · `rl-etablissement` · `montage-rlc-libre` · `rlc-energie` · `rlc-regimes` · `rlc-oscillation` · `fresnel-rlc` · `montage-rsf` · `resonance-intensite` · `modulation-amplitude` · `demodulation-enveloppe` · `montage-modulation` · `spectre-modulation` · `facteurs-cinetiques` · `vitesse-tangente` · `demi-reaction` · `montage-conductimetrie` · `equilibre-dynamique` · `pile-daniell` · `montage-electrolyse` · `esterification-rendement` · `savon-micelle` · `catalyse-profil` · `indicateurs-colores` · `predominance-acide-base` · `dosage-conductimetrique` · `dosage-derivee` · `pendule-elastique` · `montage-rc` · `montage-titrage` · `cuve-ondes` · `montage-reflux` · `montage-gaz` · `moteur-cc` · `si-chaine` · `si-grafcet` · `si-asservissement` · `si-capteur` · `svt-dorsale` · `svt-subduction` · `svt-chaines-types` · `svt-collision` · `svt-facies-metamorphiques` · `svt-solidus-peridotite` · `svt-granite-anatexie` · `svt-granite-intrusif` · `svt-schistosite` · `svt-cycle-cellulaire` · `svt-replication-adn` · `svt-transcription-traduction` · `svt-code-genetique` · `svt-transgenese` · `svt-pli-faille` · `svt-metamorphisme` · `svt-exao` · `svt-myogramme` · `svt-adn` · `svt-electrophorese` · `svt-anticorps` · `svt-meiose` · `svt-station-epuration` · `svt-dechets` · `svt-cellule` · `svt-mitose` · `svt-effet-serre`

---

## 8. Checklist before « Importer »

- [ ] Every `notion` is copied **exactly** from `_scaffold.notions` (no amber warning after « Vérifier »).
- [ ] 4 options, **1 single** `correct: true`, a `why` on **all 4**.
- [ ] `hint` present, and it doesn't give the answer away.
- [ ] `solution` complete, recomputed, in **our own words**; units correct.
- [ ] Difficulty mix followed; at least one difficulty 3 per core notion.
- [ ] 2 problems with a complete `context`, 5–8 sub-questions, `origin` filled in.
- [ ] 3 séries with 8–12 refs each, easiest to hardest.
- [ ] Finished blocks: the `"_todo": true` line is deleted.
- [ ] Nothing comes from `exam-pdfs/`.

---

## 9. Ready-to-use prompt (for the content team's Claude)

> Tu es l'auteur de contenu de Bac Up. Lis `docs/content-brief-preparation.md` et l'exemple `content/prep/examples/pc-rc-exemple-complet.json`.
> Remplis le scaffold `content/prep/scaffolds/<pack>/<chapitre>.json` :
> 1. Lis le cours du chapitre (les titres sont dans `_scaffold.notions`) et les annales listées dans `_scaffold.sources` (sujets **et** corrigés).
> 2. Pour chaque notion, écris `target_new_questions` QCU selon `difficulty_mix`, chacune avec 4 options, un `why` sur chaque option (piège = erreur réelle d'élève), un `hint`, une `solution` rédigée avec nos mots et une `methode`.
> 3. Écris 2 problèmes type BAC (5–8 sous-questions, Partie A/B, difficulté croissante), adaptés d'exercices d'annales portant sur ce chapitre : change les valeurs et le contexte, réécris tout, recalcule tout, renseigne `origin`.
> 4. Compose les 3 séries (Échauffement / Entraînement / Type BAC) avec 8–12 refs chacune.
> 5. Recalcule chaque résultat numérique, vérifie qu'il n'y a qu'une bonne réponse, puis retire `"_todo": true` des blocs terminés.
> 6. N'utilise jamais `exam-pdfs/` (MonBac). Réponds uniquement avec le fichier JSON complet, valide.
