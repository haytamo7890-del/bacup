# Content packs — Espace de préparation (`bacup.prep/v2`)

> **v2** adds guided BAC problems (`kind: "probleme"`, `context`, `figure`, `origin`), `hint`, `methode`, `difficulty`, `part`, per-option `why`, `"tracks": [...]` and `_todo` placeholders. Full writing guide: **`docs/content-brief-preparation.md`**; scaffolds to fill: `content/prep/scaffolds/`. v1 files still import.

The content team ships **exercices par notion** and **séries** as JSON files.
One file = one *pack* for one matière / niveau (optionally one filière).

**Where to put them:** `content/prep/*.json` (files starting with `_` are ignored by the CLI).
**How to import:**
- **Admin portal:** `/admin/preparation` → *Import JSON*. Drop the files, click **Vérifier** (dry run, nothing written), then **Importer**.
- **CLI:** `npm run import:prep content/prep/` (dry run), then `npm run import:prep content/prep/ -- --commit --regen`.

Every pack runs in **one transaction**. If there is a single error, nothing from that pack is written.
**Re-importing is safe.** Anything with a `ref` (or an `id`, from an export) is **updated in place**: no duplicates, and students keep their history.
Template: `data/_prep-pack-template.json` (also downloadable from the portal).

## Shape

```jsonc
{
  "format": "bacup.prep/v1",
  "level": "2bac",               // "1bac" | "2bac"
  "subject": "pc",               // subjects.code: maths, pc, svt, si, anglais, philo…
  "track": null,                 // tracks.code (pc, svt, sm_a, sm_b…) or null = common chapters
  "exercises": [ … ],            // optional
  "series":    [ … ]             // optional
}
```

### `exercises[]`
| key | required | meaning |
|---|---|---|
| `ref` | recommended | stable id you choose (`pc-rc-ex-charge-01`). A re-import updates the exercise. |
| `chapter` | ✔ | chapter **code** (preferred, e.g. `pc-rc`) or its exact name. See *Couverture* in the portal for codes. |
| `title` | | shown in admin |
| `difficulty` | | 1 facile · 2 moyen · 3 difficile |
| `context` | | shared statement shown above each question (LaTeX ok) |
| `questions` | ✔ | list below |

### `questions[]`
| key | required | meaning |
|---|---|---|
| `ref` | **strongly recommended** | stable id (`pc-rc-q-tau-01`). Séries point to questions by this. |
| `notion` | ✔ in practice | **copy a `## heading` of the chapter's cours** (e.g. `La constante de temps`). This puts the question under that notion in *Par notion* and in the cours funnel. Anything else lands in "Autres notions" (the portal warns you). |
| `statement` | ✔ | question text; math in `$…$` |
| `options` | ✔ (≥ 2) | `["$10\\,ms$", "…"]` + `correct`, **or** `[{ "label": "…", "is_correct": true }, …]` |
| `correct` | ✔ with string options | 0-based index of the right option |
| `solution` | recommended | the Bac-up corrigé, **in our own words** (see the IP rule in CLAUDE.md) |
| `points` | | default 1 |

Options are shuffled for every student, so their order in the file doesn't matter.
When a question is updated, its stored AI explanations are cleared and regenerated on demand.

### `series[]`
| key | required | meaning |
|---|---|---|
| `slug` | ✔ | stable id (`pc-rc-serie-essentiels`). The `auto:` prefix is reserved. |
| `title` | ✔ | |
| `description` | | one line shown on the card |
| `kind` | | `custom` (default: "Séries du prof"), `chapitre`, `unite`, `mixte` |
| `chapter` | | chapter code/name, or omit for a cross-chapter série |
| `unit` | | unit label for grouping |
| `difficulty` | | 1–3 |
| `xp_bonus` | | XP granted **once**, the first time a student scores ≥ 70 % (default 30) |
| `position` | | display order (lower first) |
| `published` | | default `true` |
| `questions` | ✔ | ordered list of question `ref`s (from this pack or an earlier one) or uuids |

## Auto séries
Besides the hand-made séries, the app generates starter séries from the banks: a **Bilan** per chapter, **Unité** séries and 2 **Mixtes BAC** per matière.
You rebuild them with *Régénérer auto* (portal) or `--regen` (CLI) after new questions land.
Don't edit their question lists. Use **Dupliquer** to make a custom copy instead.

## Round-trip editing of existing content
In *Couverture*, **JSON** exports a chapter (or the whole matière) as a pack, with `id`s.
Edit it (fix a solution, retag a `notion`, add questions) and re-import it: existing questions are updated, new ones are created.

## Checklist before sending a pack
- [ ] `notion` = an exact `##` heading of that chapter's cours (no red/amber warnings in *Vérifier*)
- [ ] exactly one correct option per question
- [ ] every question has a `solution` written in our own words
- [ ] `ref`s are unique and never renamed after the first import
