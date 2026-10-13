# Bac-up — App Map & Content Guide for Claude

> **Paste this whole file into Claude** (or add it as **Project knowledge** in a Claude Project) before asking it to write any course or exercise. It tells Claude exactly what Bac-up is and the precise formats its content must follow so everything drops straight into the app.

---

## 1. What Bac-up is

**Bac-up** is an AI-powered BAC-prep app for Moroccan lycée students. Company = HSGenius; the product students see = **Bac-up**. UI is in **French** (Philosophie content is in **Arabic**, right-to-left). Design is "Arctic-glass", dark-first, premium.

Two levels, chosen at signup:
- **1bac-up** — régional
- **2bac-up** — national ← **launch focus**

Launch beachhead: **2bac PC + SVT** (filières Sciences Physiques and SVT). Core science subjects: **Maths, Physique-Chimie, SVT**.

The app has: rich **courses**, a **résumé/fiche** per notion, an **exam engine** (annales nationales + examens blancs, timed, /20, with corrections + AI explanations), **exercise series**, an **AI coach**, and **gamification** (XP, streaks, leaderboard, Monk mode).

---

## 2. How the pipeline works (scaffold-fill)

You do **not** paste into the app. You fill a **scaffold file** and hand it back — it gets loaded automatically. Steps:

1. You receive a **scaffold JSON** — an array of notions to write. Each entry already has its `id`, `chapter`, `notion` (title), plus empty `body`, `resume`, `objectives`, `difficulty`, `duration_min`, `bac_frequency`.
2. **Fill in** `body` (the full Cours complet), `resume` (the Fiche), and the metadata — for each entry, using the source material. **Never change `id`, `chapter`, or `notion`.**
3. Return the **same JSON array**, filled. That's it — it gets imported by `id`.

You can fill it a few chapters at a time; partially-filled files are fine (empty entries are skipped on load).

Claude should **never** invent facts or math it isn't sure of — this is exam prep; correctness is everything.

## 2b. THE RICHNESS BAR — read this twice

The #1 failure is producing a **summary** instead of a **course**. A summary is useless here. Every `body` you write must teach the notion from zero, and must clear **all** of these:

- **Length:** at least ~1,800–3,500 characters of real teaching (not filler).
- **Structure:** at least **2–4 `##` sections**.
- **At least 4 callouts**, including at minimum one `:::definition`, one `:::theoreme` *or* `:::propriete`, one `:::methode`, and one `:::attention` (a real BAC pitfall).
- **At least one fully worked example** (`:::exemple` or `:::methode`) solved step by step — not just stated.
- **Real math** in `$...$` / `$$...$$` where the notion needs it.
- **At least one `:::app`** (a mini "à toi de jouer" the student does while reading).

The **`resume`** is the opposite — short: 2–4 `:::aretenir` blocks with the key formulas/results, one small table if useful. It's the night-before revision, not the lesson.

> Rule of thumb: if a student who has never seen the notion couldn't learn it from your `body` alone, it's not done. When in doubt, go deeper, add another worked example, add the pitfalls.

---

## 3. The content model — Matière → Chapitre → Notion

```
Matière (subject)   e.g. Mathématiques
  └─ Chapitre        e.g. Suites numériques
      └─ Notion      the smallest unit — the student studies & completes it, earns XP
```

A **Notion** has two views the student toggles between:
- **Cours complet** — the full native lesson (this is the `body`).
- **Fiche · L'essentiel** — a condensed résumé for fast revision (this is the `resume`).

Plus **en-tête metadata**: objectives, difficulty (1–3), estimated duration (min), and BAC frequency (0–3).

> **Key rule:** a notion is a course lesson. Its title should read as a real notion name. Inside the course body, `## headings` split it into sub-sections — and **each `##` heading is what exercises/QCU get tagged to** (see §6).

---

## 4. Course authoring syntax (the `body` and the `resume`)

Courses are written in a lightweight markup the app renders (KaTeX math, styled callouts, figures, tables). Use these and nothing else:

**Structure & text**
- `## Titre de section` → a collapsible section with a number. Use several per notion.
- Blank line = new paragraph.
- `**gras**` for bold.
- Lists: `- item` (bullets) or `1. item` (numbered).
- Tables: markdown pipes —
  ```
  | Colonne A | Colonne B |
  | --- | --- |
  | valeur | valeur |
  ```

**Math (KaTeX)**
- Inline: `$f(x) = ax^2 + bx + c$`
- Display (centered): `$$\Delta = b^2 - 4ac$$` (can also span multiple lines between two `$$` fences).

**Callouts** — `:::kind Titre optionnel` … then content … then `:::` on its own line. Available kinds:

| Kind | Renders as |
|---|---|
| `definition` | Définition |
| `theoreme` | Théorème |
| `propriete` | Propriété |
| `exemple` | Exemple |
| `methode` | Méthode type |
| `remarque` | Remarque |
| `attention` | Attention (⚠ pièges au BAC) |
| `aretenir` | À retenir (l'essentiel) |
| `demonstration` | Démonstration (repliable) |
| `solution` | Correction (repliable) |
| `app` | "À toi de jouer" — a mini-exercise the student marks done (feeds mastery) |
| `funnel` | A "Teste-toi sur cette notion" button (the title = the notion) |

English-workbook kinds (for Anglais): `rule`, `example`, `tip`, `remember`, `mistake`.
Arabic kinds (for Philo): `tarif` (تعريف), `ishkal` (إشكال), `mawqif` (موقف فلسفي), `khoulasa` (خلاصة).

**Example of a well-formed course body:**
```
## Définition et premières propriétés

:::definition Suite numérique
Une suite $(u_n)$ est une fonction de $\mathbb{N}$ vers $\mathbb{R}$ qui à tout entier $n$ associe un réel $u_n$.
:::

Le terme $u_n$ est appelé **terme général** de la suite.

:::theoreme Suite arithmétique
$(u_n)$ est arithmétique de raison $r$ si $u_{n+1} = u_n + r$ pour tout $n$.
$$u_n = u_0 + n\,r$$
:::

:::methode Reconnaître une suite arithmétique
Calcule $u_{n+1} - u_n$. Si le résultat est constant, la suite est arithmétique et cette constante est la raison $r$.
:::

:::attention
Ne confonds pas $u_0 + nr$ (arithmétique) avec $u_0 \times q^n$ (géométrique). C'est l'erreur la plus fréquente au BAC.
:::

:::app Applique
Soit $u_n = 3n + 2$. Quelle est la raison ? Quel est $u_5$ ?
:::
```

> **Don't** use raw HTML, images by URL, or figure names you haven't been told exist (`[[fig:NAME]]` only works for figures already coded in the app — skip figures unless Haytam confirms the name).

The **fiche (`resume`)** uses the *same* syntax but short — mostly `:::aretenir` blocks, key formulas, and a compact table. It's for revision the night before, not first learning.

---

## 5. Exercise series — the JSON the importer accepts

The admin importer (`/admin/exercices`) takes a **JSON array of questions**. Each question:

```json
[
  {
    "statement": "Résoudre dans ℝ : x² - 5x + 6 = 0",
    "kind": "mcq",
    "notion": "équation du second degré",
    "options": [
      { "label": "x = 2 ou x = 3", "is_correct": true },
      { "label": "x = -2 ou x = -3" },
      { "label": "x = 1 ou x = 6" },
      { "label": "aucune solution" }
    ],
    "solution": "Δ = 25 - 24 = 1 ; x = (5 ± 1)/2 → x = 2 ou x = 3."
  },
  {
    "statement": "Donner la dérivée de f(x) = x³.",
    "kind": "open",
    "notion": "dérivation",
    "correct_value": "3x²",
    "solution": "f'(x) = 3x²."
  }
]
```

Field rules:
- `statement` (required) — the question; math in `$...$` works here too.
- `kind` — `"mcq"` (default), `"open"`, or `"numeric"`.
- `notion` — a short tag; **make it match a phrase in the course's `##` heading** so the course's "Teste-toi" funnel can find it.
- `options` — **mcq only**; give 3–4, exactly one `"is_correct": true`.
- `correct_value` — for `open`/`numeric` (the expected answer).
- `solution` — the worked correction (always include one).

Paste the array into `/admin/exercices → JSON (rapide)`.

---

## 6. Conventions (get these right or content won't link up)

- **Subjects codes:** `maths`, `pc` (physique-chimie), `svt`, `si` (sciences-ingénieur), `anglais`, `philo`.
- **Filières (tracks):** `sm_a`, `sm_b` (Sciences Maths A & B — they sit the **same** Maths/PC/SVT papers, shown as one "SM"), `pc` (Sciences Physiques), `svt`, `eco`.
- **Niveaux:** `1bac` (régional), `2bac` (national).
- **Exam types:** `national`, `regional`, `blanc`, `other`. **Sessions:** `normale`, `rattrapage`.
- **Difficulty:** 1 = facile, 2 = moyen, 3 = difficile.
- **BAC frequency:** 0 = jamais, 1 = parfois, 2 = souvent, 3 = quasi-systématique.
- **Notion tagging = the link.** An exercise/QCU only shows under a course notion if its `notion` phrase appears in that notion's `## heading`. Keep them consistent (e.g. heading "## Suites arithmétiques" ↔ notion "suites arithmétiques").

---

## 7. The admin tools (where content goes)

Log in as admin → the admin area has these tabs:

- **`/admin/cours`** — Chapitres & notions. Pick niveau → filière → matière → chapitre. For each **notion**: write the **Cours complet**, the **Fiche**, and set difficulty/durée/fréquence/objectifs. Button **"Utiliser comme fiche"** copies the current course into the fiche field (handy when replacing an old summary with a real deep course).
- **`/admin/exercices`** — Séries d'exercices. Pick a chapitre → build a série with the **manual builder** or paste the **JSON** from §5.
- **`/admin/annales`** — Sujets & corrigés PDF, by filière / année / session.

Students see this content under **/dashboard/cours** (Cours ↔ Fiche toggle) and **/dashboard/examens** (Réviser par notion · Séries d'exercices · Exam blanc & national).

---

## 8. Ready-to-use prompts

**Fill the scaffold (main workflow):**
> "Here is a Bac-up course scaffold (JSON array of notions) and the source material. For each entry, fill `body` with a **rich Cours complet** and `resume` with a short **Fiche**, following the guide's syntax and clearing the **richness bar** (≥2 sections, ≥4 callouts incl. definition/théorème/méthode/attention, ≥1 worked example, ≥1 `:::app`). Also set `difficulty` (1–3), `duration_min`, `bac_frequency` (0–3). Keep `id`, `chapter`, `notion` unchanged. Return the same JSON array, filled. Verify all math. Scaffold: <paste JSON>. Source: <paste>."

**Turn an exercise sheet into series JSON:**
> "From the exercises below, produce a **Bac-up exercise-series JSON array** per the guide (fields: statement, kind, notion, options/correct_value, solution). Tag each `notion` to match the course heading it belongs to. Verify every answer. Source: <paste>."

**Level-check a chapter:**
> "Here is our current course for <chapitre>. Compare it against the official 2bac <filière> programme for this chapter and list what's missing or too shallow, notion by notion."

---

*Keep this file current: if the app's formats or admin tools change, update this guide so Claude stays accurate.*
