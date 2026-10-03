# Passation — Espace de préparation Bac-up (format `bacup.prep/v2`)

> Pour l'instance de Claude Code qui reprend le travail. **Lis ce fichier en entier avant d'écrire une seule question.**

## 1. Où en est le travail

**Fait et validé : 16 chapitres, 788 questions** — toute la physique de `pc-commun`.
Les 15 premiers sont complets (QCU à la cible + 2 problèmes + 3 séries) ; `pc-champ-pesanteur`
a ses 56 QCU mais pas ses problèmes ni sa série 3.

**Reste à faire sur le PC : 14 chapitres, ~500 questions** — voir `WORK_QUEUE.md`, qui donne
pour chacun la cible, l'état, et une **fiche scientifique** à respecter.

Au-delà du PC : `maths-scex` (6 ch.), `svt-pc` (10), `svt-svt` (11), puis en P2 `maths-sm` (8),
`si-smb` (8), `svt-sm` (4).

## 2. Les trois fichiers de ce paquet

| Fichier | À quoi il sert |
|---|---|
| `PREP_SPEC.md` | **Le contrat d'écriture.** Volume, qualité, règles non négociables, vérification. |
| `WORK_QUEUE.md` | La file de travail : un bloc par chapitre restant, avec sa fiche scientifique. |
| `tools/prepkit.py` | La boîte à outils d'écriture **et** le validateur du format. |

Copie `tools/prepkit.py` où tu veux dans le dépôt (par exemple `scripts/prepkit.py`).
Il trouve les scaffolds tout seul en remontant jusqu'à `content/prep/scaffolds`, et il
**remplit les scaffolds en place** — ce qui est exactement ce qu'attend `Admin → Préparation → Import JSON`.

## 3. La boucle de travail, chapitre par chapitre

```bash
# 1. voir l'état d'un chapitre
python3 scripts/prepkit.py content/prep/scaffolds/pc-commun/pc-dosage.json

# 2. écrire (script python qui utilise prepkit — voir PREP_SPEC.md §1)
python3 build_dosage.py

# 3. valider, et corriger jusqu'à zéro erreur
python3 scripts/prepkit.py content/prep/scaffolds/pc-commun/pc-dosage.json
```

Le validateur vérifie tout ce que vérifiera le bouton « Vérifier » de l'admin, **plus** les
règles du §4 du brief contenu : 4 options et une seule bonne, un `why` sur les quatre,
`hint`/`solution` non vides, `notion` présente dans `_scaffold.notions`, refs uniques et
bien préfixées, parité des `$`, problèmes à 5–8 sous-questions de difficulté croissante,
séries de 8–12 refs existantes, cible `target_new_questions` atteinte bloc par bloc,
et aucun `TODO` résiduel.

**Un chapitre par session de travail.** Sauvegarde avec `C.save()` au fur et à mesure :
si la session est coupée, le travail déjà écrit est conservé et un passage suivant peut
le reprendre avec `Chapter(rel, base=OUT)` sans rien écraser.

## 4. Un chapitre comme modèle

Avant d'écrire, lis **deux** fichiers déjà livrés, pour le ton et le niveau :

- `content/prep/examples/pc-rc-exemple-complet.json` — l'exemple de référence de l'équipe ;
- un chapitre livré proche du tien, par exemple `pc-rc.json` (gros chapitre bien structuré),
  `pc-radioactivite.json` (calculs et linéarisation) ou `pc-particule-chargee.json` (deux champs,
  problèmes à deux parties).

## 5. Ce qui a réellement cassé la qualité, et qu'il faut surveiller

Un relecteur indépendant a audité les trois premiers chapitres et trouvé **8 défauts réels**.
Aucun n'était une faute de calcul : tous relevaient de deux familles. Elles sont décrites en
détail dans `PREP_SPEC.md §3` ; en résumé :

1. **Un piège dont le `why` ne produit pas le nombre affiché.** Six cas sur huit. Exemple vécu :
   une option étiquetée `1,6×10⁻³ nm` avec pour justification « tu as calculé 2Da/L » — or
   `2Da/L` valait `1,05×10⁻² m`, soit dix-huit ordres de grandeur d'écart. L'élève ne peut
   rien apprendre d'un tel piège. **Construis le piège à partir de l'erreur : calcule d'abord,
   étiquette ensuite.**
2. **Un piège défendable.** Deux cas, les plus graves : un élève fort pouvait soutenir que
   l'option était vraie, donc être compté faux. Exemple vécu : avec λ = 2,5 cm et d = 10 cm,
   un distracteur disait « en phase, car 10 est un multiple de 2,5 » — ce qui **est** le critère
   d/λ entier, puisque 2,5 cm *est* λ. L'argument était correct et présenté comme faux.

Ajoute donc, à la fin de chaque chapitre, une **relecture adverse** : pour chaque piège,
demande-toi « un élève fort pourrait-il soutenir que c'est vrai ? » et « l'erreur nommée
donne-t-elle exactement ce nombre ? ». Si tu peux lancer un sous-agent de relecture qui n'a
pas écrit le contenu, fais-le : c'est ce qui a attrapé les huit défauts.

## 6. Sources et propriété intellectuelle

- Les problèmes livrés jusqu'ici sont **originaux** (`origin={"type":"original"}`), écrits dans
  le style de l'épreuve nationale. C'est explicitement autorisé par le §5 du brief contenu.
- Une **passe d'adaptation d'annales** reste à faire, séparément, sur les chapitres déjà livrés
  comme sur les suivants. Les annales légitimes de Bac-up sont les fichiers
  `Sujet-physique-chimie-svt-<année>-<session>.pdf` du Drive de l'équipe, avec leurs corrigés.
  Leur OCR est dégradé (arabe brouillé, figures perdues) : lis page par page plutôt que d'un bloc,
  et si un énoncé est illisible, écris original plutôt que de deviner.
- **Interdiction absolue** : tout document MonBac (`exam-pdfs/**` et les dossiers Drive
  nommés `monbac …`), y compris « pour s'en inspirer ».

## 7. Points laissés ouverts par les chapitres déjà livrés

À confronter au cours réel ; dans chaque cas la formule a été **donnée dans l'énoncé** plutôt que
supposée connue, donc rien n'est faux, mais ça mérite une relecture pédagogique :

- `pc-rlc-libre` : λ = RT/2L et R_c = 2√(L/C), énoncées comme admises.
- `pc-rlc-force` : décalage du maximum de U_C à N₀√(1 − 1/2Q²).
- `pc-energie-oscillations` : Q = 2π·E_m/|ΔE_m| (certaines versions omettent le 2π) et E_n = (n+½)hν.
- `pc-rc` : le bloc « filtre » est resté strictement qualitatif.
- `pc-noyau-energie` : l'énergie de fission est calculée via la courbe d'Aston (8,40 MeV/nucléon),
  d'où 174 MeV — cohérent pour un canal à 3 neutrons, mais un peu sous les ~190 MeV cités
  ailleurs dans le même chapitre. Si tu veux aligner les deux, quatre nombres du problème 1 bougent.
