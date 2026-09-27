# Bac-up — SVT & SI content addendum

> Read this **in addition to** `context-for-claude-content.md`. Same data model, same `[[fig:…]]` syntax, same scaffold-fill workflow (fill `body` / `resume` / `objectives` / `difficulty` / `duration_min` / `bac_frequency`, keep `id` / `chapter` / `notion` untouched, return the same JSON array), same load path (**`/admin` → Import cours**, update-by-id, no mirror). This file covers what's **different for SVT and SI**.

---

# PART A — SVT

## A1. SVT is built on experiments and documents — not just theory

The SVT bac épreuve is **exploitation de documents et d'expériences**: the student is shown a protocole, a graph, an électrophorèse, a coupe géologique… and must interpret it. So an SVT notion must be built **around** the experiment/document, not around a definition dump.

**Structure = the PC template + an experiment block.** Keep the usual `## sections`, `:::definition`, a `:::propriete` (here a **loi** or **mécanisme**), a `:::methode`, a `:::attention`, `:::app`. On top of that, **most notions must carry at least one `:::experience` block**, structured in three beats:

```
:::experience Mise en évidence de la fermentation alcoolique
**Protocole.** On place une suspension de levures dans du glucose, en absence de O₂ ; on suit le CO₂ dégagé à l'ExAO.
**Résultats.**
[[fig:svt-exao]]
Le CO₂ augmente ; de l'éthanol est détecté en fin d'expérience.
**Interprétation.** En anaérobie, le glucose est dégradé en éthanol + CO₂ : c'est la fermentation alcoolique, qui régénère le NAD⁺ nécessaire à la glycolyse.
:::
```

Rules for the experiment block:
- Always the three beats in this order: **Protocole → Résultats → Interprétation** (bold labels, as above).
- The **Résultats** beat is where the figure goes (`[[fig:…]]` — a montage, a graph, a photo-schematic).
- The **Interprétation** beat is the conclusion the bac question is really after.

Two more callouts are available when they fit:
- `:::observation` — a pure observation (microscopie, coupe, caryotype) with its figure, when there's no full protocole.
- `:::document` — an "étude de document" (a provided graph/table + what to read from it).

## A2. SVT visuals — schematic SVG, reuse first

Every mechanism, cycle, coupe, or montage should be **seen**. We draw them as inline SVG (consistent, dark-mode, no hosting). **Reuse an existing figure whenever one fits** — reference the key with `[[fig:key]]`:

| Key | Shows | Fits |
|---|---|---|
| `svt-adn` | ADN double hélice, appariement A-T/G-C | Nature de l'info génétique |
| `svt-mitose` | mitose — reproduction conforme | Transmission (mitose) |
| `svt-meiose` | méiose — brassage interchromosomique | Transmission (méiose), génétique |
| `svt-electrophorese` | gel, puits, bandes | Génie génétique, empreinte ADN |
| `svt-anticorps` | réponse immunitaire primaire vs secondaire | Immunologie |
| `svt-cellule` | cellule + mitochondrie | Libération d'énergie (respiration) |
| `svt-exao` | montage ExAO respiration/fermentation | Libération d'énergie |
| `svt-myogramme` | myogramme (secousse, tétanos) | Muscle strié squelettique |
| `svt-dorsale` | dorsale, expansion, anomalies magnétiques | Tectonique des plaques |
| `svt-subduction` | fosse, plan de Bénioff, volcanisme | Tectonique / déformations |
| `svt-pli-faille` | plis et failles | Déformations et chaînes de montagnes |
| `svt-metamorphisme` | gradient métamorphique, minéraux index | Métamorphisme et granitisation |
| `svt-station-epuration` | étapes d'une station d'épuration | Qualité des milieux naturels |
| `svt-dechets` | tri et valorisation des déchets | Déchets / consommation |
| `svt-effet-serre` | effet de serre | Flux d'énergie / pollutions |

**Likely gaps worth requesting** (no figure yet — request via the patch format in §C): réplication semi-conservative de l'ADN, transcription + traduction (synthèse des protéines), tableau du code génétique, échiquier de croisement (mono/dihybridisme), arbre généalogique (génétique humaine), loi de Hardy-Weinberg, sarcomère + glissement des filaments, plaque motrice / synapse neuromusculaire, bilan respiration cellulaire (glycolyse → Krebs → chaîne respiratoire), pyramide / chaîne trophique et flux d'énergie, radiochronologie (droite isochrone), plasmide / transgenèse.

## A3. SVT spans both filière programs — just fill by id

The SVT scaffold contains **two programs interleaved**: a geology + énergie + muscle + écologie unit, and a heavier **génétique + immunologie** unit (nature/transmission/expression de l'information génétique, génie génétique, génétique humaine, génétique des populations, immunologie). They belong to different filière tracks. **You don't manage tracks** — each notion's `id` already carries its chapter/track. Just fill **every** slot by id; the app routes it. (The geology unit already has ~4 notions written — match their depth and extend.)

---

# PART B — SI (Sciences de l'Ingénieur)

## B1. SI structure — same template, diagram-driven

SI is not experiment-based; it is **analyse fonctionnelle et structurelle** of real systems (portail automatique, store, drone…). Keep the PC template, but the centre of gravity is the **schéma / diagramme**, not a worked calculation. For an SI notion:
- `:::definition` for the function/concept, a `:::propriete` for the relation/loi (e.g. fonction de transfert, rapport de transmission), a `:::methode` for the analysis method (tracer un GRAFCET, calculer un rapport de réduction, identifier une FT d'ordre 1), a `:::attention`, and `:::app`.
- Lead most notions with a **block/diagram figure** (`[[fig:…]]`).
- The experiment block is usually **not** needed for SI; use `:::document` when the notion analyses a real system's cahier des charges or performance curve.

## B2. SI visuals — reuse first

| Key | Shows | Fits |
|---|---|---|
| `si-chaine` | chaîne d'énergie + chaîne d'information | Analyse fonctionnelle, structure |
| `si-capteur` | capteur — chaîne d'acquisition | Chaîne d'info — Acquérir |
| `si-grafcet` | GRAFCET — étapes, transitions, réceptivités | Chaîne d'info — Traiter |
| `si-asservissement` | système asservi — boucle fermée | Systèmes asservis (SLCI) |

**Likely gaps worth requesting**: diagramme bête-à-cornes / pieuvre / FAST (analyse fonctionnelle), schéma-blocs avec fonction de transfert, moteur CC / vérin (convertir), engrenages-poulies-courroie (transmettre), redresseur / hacheur / onduleur (alimenter-distribuer), logigramme + table de vérité (traiter), réponse temporelle 1er et 2nd ordre (identification), diagramme de Bode si au programme.

---

# PART C — New figures: the patch format (unchanged from PC)

For a diagram that doesn't exist yet, deliver a **separate `.tsx` patch file** (like the PC ones) — Haytam splices it into `figures.tsx` and deploys. Until then the `[[fig:…]]` slot renders blank and everything else shows.

- One entry per figure: `"figure-key": ( <svg viewBox="0 0 W H" className="w-full max-w-[440px] mx-auto h-auto"> … </svg> ),`
- Use the shared constants at the top of `figures.tsx`: `AX` (axes), `CURVE` (main curve, cyan), `DASH` (dashed helper). For extra colours use Tailwind arbitrary classes (`stroke-[#f59e0b]`, `fill-[#10b981]`, `fill-[#0db8d3]/15`) so **dark mode is automatic** — never hard-code black/white.
- Keys kebab-case, unique, prefixed by subject: `svt-…` / `si-…` (e.g. `svt-replication-adn`, `svt-synthese-proteines`, `svt-sarcomere`, `si-fast`, `si-schema-blocs`).
- Reference each new key with `[[fig:key]]` in the course body.

# C1. Richness bar for SVT/SI
Same bar as PC: ≥2 `##` sections, ≥4 callouts, ≥1 worked/interpreted example, ≥1 `:::app`. For SVT the "≥1 worked example" is satisfied by a full **`:::experience`** (or a `:::document` interpretation). Use `$…$` only where real (ratios génétiques, `p² + 2pq + q² = 1`, radiochronologie `t = …`, rapport de transmission) — SVT/SI are not math-dense, so don't force equations where prose is clearer.
