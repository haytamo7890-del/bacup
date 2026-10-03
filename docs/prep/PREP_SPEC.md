# Contrat d'écriture — Espace de préparation Bac-up (`bacup.prep/v2`)

Tu remplis **un** fichier scaffold. Public : élèves marocains de 2bac. Langue : **français**,
tutoiement dans les `why`. **La correction est l'exigence absolue** : c'est de la préparation
au BAC, un corrigé faux coûte plus cher qu'une question manquante.

---

## 1. Outillage — utilise-le, n'écris jamais le JSON à la main

```python
import sys; sys.path.insert(0, 'scripts')      # là où tu as copié prepkit.py
from prepkit import Chapter, Q, OUT

C = Chapter('pc-commun/pc-dosage.json')        # chemin relatif à content/prep/scaffolds/
# passages suivants (reprise après coupure) :
# C = Chapter('pc-commun/pc-dosage.json', base=OUT)

N = None   # la notion est reprise automatiquement du _brief du bloc
```

**Inspecte toujours le scaffold avant d'écrire :**

```python
for x in C.data['exercises']:
    b = x.get('_brief', {})
    print(x['kind'], x['ref'],
          'TODO' if x.get('_todo') else 'fait',
          '|', b.get('notion'), b.get('target_new_questions'), b.get('difficulty_mix'))
print(C.sc['notions'])
print(C.sc['suggested_figures'])
print(C.all_qrefs())      # refs déjà écrites, pour composer les séries
```

### API

| Appel | Effet |
|---|---|
| `Q(notion, difficulty, statement, opts, hint, solution, methode=None, points=1, part=None)` | fabrique une question |
| `C.fill(ref_bloc, [Q, Q, …])` | remplit un bloc QCU : enlève `_todo`, numérote `-q1 -q2 …`, recalcule la difficulté du bloc |
| `C.fill_probleme(ref, titre, context, [Q, …], figure=None, origin=None)` | remplit un problème |
| `C.serie(slug, [refs], description=None)` | remplit une série |
| `C.all_qrefs()` | toutes les refs de questions déjà écrites |
| `C.save()` | écrit le fichier |

- `opts` = liste de **4** tuples `(label, why)`. **Le premier est la bonne réponse** (l'appli mélange l'ordre).
- `notion=None` reprend la notion du `_brief` : utilise-le pour les QCU. Pour les sous-questions
  de problème, passe la notion **explicitement** (texte exact de `_scaffold.notions`).
- Sur un problème, chaque sous-question porte `part="Partie A — …"`.
- **Ne touche jamais** aux `ref`, `chapter`, `_brief`, ni à la liste `_scaffold.notions`.

### Reprise après une coupure

`C.save()` souvent. Si la session est interrompue, recharge avec `base=OUT` : les blocs déjà
remplis sont conservés, et tu ne complètes que ceux encore marqués `_todo`.

---

## 2. Volume exigé (non négociable)

- Chaque bloc `kind: "qcu"` reçoit **exactement** `_brief.target_new_questions` questions.
- Respecte `_brief.difficulty_mix` quand sa somme égale la cible (ex. `{1:1, 2:2, 3:1}` pour 4).
  Si la somme diffère, couvre 1, 2 et 3 dans la mesure du possible.
  Si la cible vaut `0` mais que le gabarit est `_todo`, écris **une** question : un bloc laissé
  `_todo` est ignoré à l'import, donc perdu.
- **2 problèmes**, **5 à 8** sous-questions chacun, difficultés **croissantes de 1 à 3**,
  réparties en `Partie A` / `Partie B`. Le `context` contient **toutes** les données nécessaires.
- **3 séries**, **8 à 12** refs chacune, de la plus facile à la plus dure :
  `serie-1` Échauffement (difficultés 1–2) · `serie-2` Entraînement (toutes les notions) ·
  `serie-3` Type BAC (difficulté 3 + sous-questions de problèmes).

---

## 3. Qualité des questions

**Énoncé** — une question = une idée. Précis, sans ambiguïté, unités toujours données.
Maths en `$…$`. **Virgule décimale française** écrite `2{,}0` en LaTeX. Unités dans `\mathrm{}`.
En Python, écris `"\\tau"`, `"\\mathrm{m\\,s^{-1}}"` (double antislash), ou une chaîne brute `r"…"`.
**Aucun caractère non-ASCII dans `\mathrm{}`** : `\mathrm{\mu A}`, jamais `\mathrm{µA}`.

**Options** — exactement une bonne. Les 4 ont le **même format et une longueur comparable**,
pour qu'on ne devine pas la réponse à sa forme. Interdit : « aucune des réponses », « toutes les réponses ».

**`why` obligatoire sur les quatre options.** Sur la bonne : la justification clé en une phrase,
avec le calcul. Sur un piège : **nomme l'erreur exacte** de l'élève
(« Tu as calculé $C/R$ au lieu de $R\times C$. »).

### Les deux règles qui ont réellement cassé la qualité

Un relecteur indépendant a audité les trois premiers chapitres et trouvé 8 défauts réels.
**Aucun n'était une faute de calcul.** Tous relevaient de ces deux règles.

> ### RÈGLE 1 — l'erreur nommée doit produire exactement le nombre affiché
>
> Pour chaque piège, l'opération décrite dans le `why` doit donner **exactement** la valeur
> écrite dans son propre `label`. **Vérifie-le en python, piège par piège.**
>
> **Construis le piège à partir de l'erreur** : calcule d'abord le résultat de l'erreur, écris
> l'étiquette ensuite. Jamais l'inverse.
>
> *Cas réels rencontrés :*
> - étiquette `1,6×10⁻³ nm`, `why` « tu as calculé $2Da/L$ » — or $2Da/L = 1{,}05\times10^{-2}\ \mathrm{m}$. Le nombre avait été inventé en gardant la mantisse d'un autre calcul.
> - étiquette `0,67 m/s`, `why` « tu as multiplié $12\ \mathrm{cm}$ par 3 au lieu de diviser » — or ce calcul donne $7{,}2\times10^{-3}$. La vraie erreur était « divisé une fois de trop par 3 ».
> - `why` « tu as additionné le retard de $M_1$ et le décalage » sur une **mauvaise** réponse — alors que cette addition donne la **bonne**. Le `why` décrivait un raisonnement correct pour justifier une erreur.
> - `why` « $\lambda/f$ donne une distance par période au carré » — faux : $\lambda/f$ est en $\mathrm{m\cdot s}$.

> ### RÈGLE 2 — aucun piège ne doit être défendable
>
> Relis chaque piège en te demandant : **« un élève fort pourrait-il soutenir que cette option
> est vraie ? »** Si oui, jette le piège.
>
> En particulier : ne qualifie **jamais** de « faux raisonnement » un raisonnement correct, et ne
> dis **jamais** d'un résultat juste qu'il est « juste par hasard ».
>
> *Cas réels rencontrés :*
> - avec $\lambda = 2{,}5\ \mathrm{cm}$ et $d = 10\ \mathrm{cm}$, un piège disait « en phase, car 10 est un multiple de 2,5 » — c'est **exactement** le critère $d/\lambda$ entier, puisque $2{,}5\ \mathrm{cm}$ *est* $\lambda$. Argument correct, présenté comme faux.
> - un piège disait « le même mouvement, $40\ \mathrm{ms}$ après $M$ », avec pour `why` « juste par hasard ». Ce n'était pas par hasard : le retard est proportionnel à la distance, donc l'option était **vraie**.
>
> Un piège par **mauvaise raison** reste permis — option dont la conclusion est juste mais dont
> la justification est fausse — à condition que la justification soit réellement fausse, et que
> le `why` dise laquelle.

**`hint`** — oriente sans donner la réponse.

**`solution`** — corrigé complet, calculs posés, résultat avec son unité, rédigé **avec nos mots**.
Termine par un **contrôle** dès que possible : ordre de grandeur, vérification par une seconde
voie, ou cohérence avec une question précédente. C'est ce qui attrape les erreurs.

**`methode`** — le réflexe réutilisable, en 1–2 lignes. Sur **chaque** question.

**Difficultés** — 1 : application directe en une étape · 2 : 2–3 étapes, ou un graphe à lire ·
3 : raisonnement, piège classique de l'examen, plusieurs étapes.

---

## 4. Vérification — tu ne livres pas sans l'avoir faite

1. **Recalcule en python chaque nombre** : bonnes réponses, pièges, et chaque valeur des `solution`.
2. **Applique les règles 1 et 2** ci-dessus, piège par piège.
3. ```bash
   python3 scripts/prepkit.py content/prep/scaffolds/<pack>/<fichier>.json
   ```
   Corrige **toutes** les erreurs `✗`. Lis les avertissements `~` et traite ceux qui sont réels.
4. Cherche les **contradictions internes** : `statement` vs `why` de la bonne réponse vs
   `solution` vs `methode`, et entre deux questions du même fichier.
5. Si tu peux lancer un **sous-agent de relecture** qui n'a pas écrit le contenu, fais-le, en lui
   donnant les règles 1 et 2 comme grille. C'est ce qui a attrapé les 8 défauts.

---

## 5. Sources et propriété intellectuelle

- Problèmes **originaux** : `origin={"type":"original"}` (c'est le défaut de `fill_probleme`).
  Inspire-toi du **style** de l'épreuve nationale marocaine — énoncé commun, données listées,
  parties A/B, questions qui s'enchaînent — sans copier aucun énoncé existant.
- Problème adapté d'une annale : change les **valeurs** et le **contexte**, réécris énoncé et
  corrigé avec nos mots, recalcule tout, puis
  `origin={"type":"annale","ref":"pc-svt-2026-rattrapage","exercise":"Exercice 1","reexpressed":True}`.
- **Interdiction absolue** : tout document MonBac, et toute reprise de la rédaction d'un corrigé tiers.
- `figure=` : uniquement un nom de `_scaffold.suggested_figures`, et seulement si la figure
  correspond **vraiment** à ton problème. **En cas de doute, n'en mets pas.** Une figure qui
  contredit l'énoncé est pire que pas de figure — par exemple `rl-etablissement`, dessinée avec
  $\tau = L/R$ et une asymptote $E/R$, ne convient pas à un énoncé où la bobine a une résistance $r$.

---

## 6. Contenu : conforme au programme marocain 2bac

Le polycopié marocain est **la** référence de l'examen. N'invente aucune formule ni notation,
et emploie celles des épreuves nationales. Si une convention locale diffère de l'usage
international, suis la convention marocaine.

Si une notion du scaffold demande une relation qui n'est pas clairement au programme,
**donne la formule dans l'énoncé** plutôt que de la supposer connue, et signale-le dans ton
rapport. C'est ce qui a été fait pour $Q = 2\pi E_m/|\Delta E_m|$, $R_c = 2\sqrt{L/C}$ et
$E_n = (n+\frac12)h\nu$.

**N'écris jamais un résultat dont tu n'es pas certain.**

---

## 7. Ce que tu rends

Un message court : le chemin du fichier, le nombre de QCU par bloc et le total, le nombre de
sous-questions par problème, la confirmation que le validateur passe sans erreur, et la liste
des points sur lesquels tu as un **doute scientifique**. Ne recopie pas le JSON.
