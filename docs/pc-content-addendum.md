# Bac-up — PC (Physique-Chimie) content addendum

> Read this **in addition to** `context-for-claude-content.md`. Same model, same syntax, same richness bar, same scaffold-fill workflow. This file covers what's **different for PC**: illustrations, and the physics figure bank you can reuse.

## 1. PC is visual — lean on figures

Physique-chimie is experimental. A student understands RC charge, a titration, or a projectile by **seeing** the montage, the curve, the trajectory — not from text alone. So for PC, **most notions should carry at least one figure**, and a "montage / dispositif expérimental" notion should open with one.

You embed a figure with `[[fig:NAME]]` on its own line (optionally followed by a caption). Two sources:
- **Reuse** an existing figure from the bank below — just reference its key.
- **Request a new one**: when a notion needs an experiment/diagram that doesn't exist, add it to a **figures patch** (see §3). It renders after the next deploy; until then the `[[fig:…]]` slot is simply blank, everything else shows.

**Adapt to the source files.** Follow the notation, montages, and worked examples in the PC source corpus provided — schematic conventions (sens du courant, conventions de signe), the exact experimental setups, and the units used. The course should feel like the source, expressed in our own words and cleared to the richness bar.

## 2. Figures already in the app — reuse these

Reference by key with `[[fig:key]]`. Available now:

| Key | Shows | Fits chapter |
|---|---|---|
| `onde-transversale` | onde périodique, longueur d'onde λ | Ondes méc. périodiques |
| `onde-corde` | déformation qui se propage à v | Ondes méc. progressives |
| `cuve-ondes` | ondes circulaires (cuve à ondes) | Ondes méc. périodiques |
| `diffraction` | diffraction par une fente a | Ondes lumineuses / méc. |
| `radioactivite` | N(t), demi-vie t½ | Décroissance radioactive |
| `rc-charge` | u_C(t) croît vers E, τ | Dipôle RC |
| `rc-decharge` | u_C(t) décroît | Dipôle RC |
| `montage-rc` | montage du circuit RC | Dipôle RC (étude expérimentale) |
| `rl-etablissement` | i(t) croît vers E/R | Dipôle RL |
| `rlc-oscillation` | oscillations amorties (pseudo-périodique) | Oscillations RLC |
| `projectile` | trajectoire parabolique | Mouvements plans |
| `pendule-elastique` | masse-ressort horizontal | Oscillateurs mécaniques |
| `cinetique` | [réactif]↓ [produit]↑, t½ | Suivi temporel — vitesse |
| `titrage-ph` | pH = f(V), saut à l'équivalence | Dosage acido-basique |
| `montage-titrage` | montage du dosage | Dosage acido-basique |
| `pile` | pile Daniell, pont salin, voltmètre | Piles |
| `moteur-cc` | moteur à courant continu | Piles / électrolyse (moteur) |

Reference exactly the key (lowercase, hyphens). If unsure a key exists, ask before relying on it.

## 3. New figures — the patch format

For a diagram that doesn't exist yet, deliver a **separate `.tsx` patch file** (like the Maths ones), and it gets spliced into `figures.tsx`. Rules:
- One entry per figure: `"figure-key": ( <svg viewBox="0 0 W H" className="w-full max-w-[440px] mx-auto h-auto"> … </svg> ),`
- Use the shared constants already defined at the top of `figures.tsx`: `AX` (axes), `CURVE` (main curve, cyan), `DASH` (dashed helper). For extra colours use Tailwind classes like `stroke-[#f59e0b]`, `fill-[#10b981]` so **dark mode is automatic** — never hard-code black/white.
- Keep keys kebab-case and unique (e.g. `newton-forces`, `champ-magnetique-trajectoire`, `resonance-intensite`, `oscilloscope-trace`, `modulation-signal`, `atome-niveaux`, `chute-verticale-regimes`, `dispersion-prisme`).
- Reference each new key with `[[fig:key]]` in the course body.

Likely gaps worth drawing (no existing figure): bilan des forces / lois de Newton, chute verticale (régimes + v(t) vers v_limite), particule chargée dans E et dans B (déviation / trajectoire circulaire), satellite en orbite + Kepler, courbe de résonance I=f(N), trace d'oscilloscope, signal modulé en amplitude, niveaux d'énergie de l'atome, dispersion par un prisme, électrolyse (montage).

## 4. Everything else is unchanged

- **Scaffold-fill**: fill `body`, `resume`, `objectives`, `difficulty` (1–3), `duration_min`, `bac_frequency` (0–3) for each entry; keep `id`, `chapter`, `notion` untouched; return the same JSON array.
- **Richness bar**: ≥2 `##` sections, ≥4 callouts (incl. `:::definition`, a `:::theoreme`/`:::propriete` — here often a **loi** or **relation**, a `:::methode`, and a `:::attention` pitfall), ≥1 worked example, ≥1 `:::app`, real math in `$…$`.
- **Chimie** notions (Transformations, Vitesse de réaction, Équilibre, Acide-base, Dosage, Piles, Électrolyse, Estérification…) come in the separate `pc-chimie` scaffold — same rules, figures `cinetique` / `titrage-ph` / `montage-titrage` / `pile` reused there.
- Load via **`/admin` → Import cours** (browser) — PC has no twin-mirror, so it just updates by id. Figures patches go to Haytam to splice + deploy.
