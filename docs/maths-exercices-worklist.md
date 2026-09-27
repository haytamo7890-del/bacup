# Maths — worklist des séries d'exercices (2bac sc ex)

> But : donner à chaque notion de Maths une banque de QCM, pour que les **funnels "Teste-toi sur cette notion"** et la section **Examens → Par notion / Séries** s'allument. Aujourd'hui Maths a **0 exercice** en base — c'est le seul chaînon manquant.

## La règle qui fait tout marcher

Un funnel de cours résout vers un **slug**, puis tire les questions dont le champ `notion` **est égal à ce slug**. Donc :

> **Tag chaque question avec le SLUG indiqué ci-dessous — pas le titre de la notion.**

Exemple : les questions sur les suites arithmétiques/géométriques se taguent `notion: "arithgeo"`, pas `"Suites arithmétiques et géométriques"`.

## Format d'import (JSON, via `/admin` → Exercices)

Une série par chapitre. Chaque question :

```json
[
  {
    "statement": "La suite $u_n = 3n+2$ est arithmétique de raison :",
    "kind": "mcq",
    "notion": "arithgeo",
    "options": [
      { "label": "$r = 3$", "is_correct": true },
      { "label": "$r = 2$" },
      { "label": "$r = 5$" },
      { "label": "$r = n$" }
    ],
    "solution": "$u_{n+1}-u_n = 3$ (constante) → arithmétique de raison 3."
  }
]
```

**Dose** : vise **≥ 4 questions par slug** (pour qu'un funnel ait de quoi tirer), soit ~10–18 QCM par chapitre. Mélange les difficultés. Vérifie chaque réponse.

## Les slugs par chapitre (source de vérité)

### Suites numériques — slugs : `arithgeo`, `limite`, `convergence`
| Notion | `notion` à taguer |
|---|---|
| Récurrence et généralités | `convergence` |
| Suites arithmétiques et géométriques | `arithgeo` |
| Limite d'une suite | `limite` |
| Théorèmes de convergence | `convergence` |
| Suites récurrentes | `convergence` |
| Approfondissement : arithmético-géométriques & séries | `arithgeo` |

### Continuité, dérivation et étude de fonctions — slugs : `limite`, `continuite`, `tvi`, `derivee`, `logexp`, `primitive`
| Notion | `notion` |
|---|---|
| Limite d'une fonction & limites usuelles | `limite` |
| Opérations & formes indéterminées | `limite` |
| Comparaison & fonction composée | `limite` |
| Continuité & prolongement | `continuite` |
| TVI, image d'un intervalle & fonction réciproque | `tvi` |
| Dérivabilité et dérivée | `derivee` |
| Variations, extremums et convexité | `derivee` |
| Variations et inégalités | `derivee` |
| Fonction logarithme népérien | `logexp` |
| Fonction exponentielle | `logexp` |
| Primitives et équations différentielles | `primitive` |
| Approf. : image d'un intervalle, racine n-ième | `tvi` |
| Approf. : dérivabilité, branches & symétries | `derivee` |

### Calcul intégral — slugs : `propriete`, `calcul`, `application`
| Notion | `notion` |
|---|---|
| Intégrale et propriétés | `propriete` |
| Techniques de calcul | `calcul` |
| Applications : aires, volumes, fonctions intégrales | `application` |
| Approf. : parité, moyenne, fonction intégrale | `application` |

### Produit scalaire et géométrie dans l'espace — slugs : `pscal`, `plan`, `vect`, `geo`
| Notion | `notion` |
|---|---|
| Produit scalaire dans l'espace | `pscal` |
| Plans, droites et sphères | `plan` |
| Produit vectoriel | `vect` |
| Approf. : angle, positions relatives, distance | `geo` |

### Nombres complexes — slugs : `forme`, `trigo`, `equation`, `geo`
| Notion | `notion` |
|---|---|
| Forme algébrique, conjugué, module | `forme` |
| Forme trigonométrique et exponentielle | `trigo` |
| Équations dans ℂ | `equation` |
| Nombres complexes et géométrie | `geo` |
| Approf. : linéarisation et lieux géométriques | `geo` |

### Calcul des probabilités — slugs : `denom`, `proba`, `varia`
| Notion | `notion` |
|---|---|
| Dénombrement | `denom` |
| Probabilités, conditionnement, indépendance | `proba` |
| Variables aléatoires et loi binomiale | `varia` |
| Approf. : Bayes, variance, loi binomiale | `varia` |

> Les notions « Méthodes & exercices types » sont transversales : leur funnel retombe sur toute la banque du chapitre, donc pas de slug propre — elles profitent de toutes les questions du chapitre.

## Ce que ça allume, une fois importé
- Le funnel **« Teste-toi sur cette notion »** dans chaque cours (par notion).
- **Examens → Par notion** (par chapitre).
- **Examens → Séries d'exercices**.
