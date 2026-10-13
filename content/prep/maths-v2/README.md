# Maths 2bac — packs v2 (nouvelle structure)

14 packs `bacup.prep/v2` : 6 chapitres Sc. Ex (filières PC + SVT) et 8 chapitres SM (SM-A + SM-B).
Le contenu est original (`origin: original`) : aucun texte n'est repris de MonBac ni d'un corrigé tiers.

## Structure de chaque chapitre

| Bloc | Dans le pack | Rôle pour l'élève |
|---|---|---|
| **Questions flash** (8) | `kind: "qcu"`, 1 question par exercice, ref `…-flash-qN` | « Je teste mes connaissances » : une notion par question |
| **Exercices** (4) | `kind: "probleme"`, titre « Exercice N — … », énoncé commun (`context`) + 4 à 8 sous-questions numérotées 1), 2)… | Ex. 1–2 : application (moyen) · Ex. 3–4 : type BAC (Partie A/B/C) |
| **Séries** (3, `kind: custom`) | voir ci-dessous | Une fiche de TD comme celles du prof |

Séries (des exercices entiers, jamais découpés) :
- **Série 1 — Les bases** : 4 questions flash + Exercice 1 (+20 XP)
- **Série 2 — Entraînement** : 4 questions flash + Exercice 2 (+30 XP)
- **Série 3 — Type BAC** : Exercice 3 + Exercice 4 (+50 XP)

Les questions flash sont placées avant les exercices, et la description de chaque série annonce « Partie I / Partie II ».

Total : 112 questions flash, 56 exercices (284 sous-questions), 42 séries, soit 396 questions avec indice, `why` sur chaque option, corrigé et méthode.

## Import

Dry-run :
```
npm run import:prep content/prep/maths-v2/
```
Puis :
```
npm run import:prep content/prep/maths-v2/ -- --commit --regen
```

Tu peux aussi passer par Admin → Préparation → Import JSON → Vérifier → Importer (en cochant « Régénérer les séries auto »).

Les refs commencent par `m2-` : elles ne touchent pas aux questions existantes (`maths-*-bank1`), et réimporter un pack est sans risque.
