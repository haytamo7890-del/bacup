# Contrôle de la qualité des milieux naturels

> Code `svtp-qualite` · SVT · pc · 2bac · unité « Utilisation des substances »
> Notions (= titres `##`, à recopier tels quels dans le champ `notion`) :
> - Pourquoi contrôler
> - Les paramètres de la qualité de l'eau
> - Les deux critères du contrôle : physicochimiques et biologiques
> - Le contrôle de la qualité de l'air et du sol
> - L'eau potable
> - Les étapes de la potabilisation
> - Méthode 1 — Conclure sur la conformité
> - Méthode 2 — Localiser la source d'une pollution
> - Méthode 3 — Exploiter des bio-indicateurs
> - Méthode 4 — Interpréter un suivi dans le temps
> - Les normes : d'où viennent-elles ?
> - Les réseaux de surveillance
> - La station d'épuration, en détail
> - La gestion de l'eau au Maroc
> - Le document type
> - Exploiter un bilan de station
> - Ce que la station ne peut pas faire

---

<!-- leçon 1 · cours -->

# Leçon — Contrôle de la qualité des milieux

**Objectifs :** Justifier l'intérêt du contrôle de la qualité d'un milieu
Classer les paramètres de qualité de l'eau en physiques, chimiques et biologiques
Définir la DBO et la relier à la teneur en dioxygène dissous
Déterminer la potabilité d'une eau à partir de plusieurs paramètres et de normes
Distinguer potabilisation et épuration
Distinguer DBO₅ et DCO et calculer la matière oxydable MO
Classer une eau à l'aide de la grille de qualité à cinq niveaux
Exploiter le coefficient biologique (indice biotique) et l'IBQS
Décrire le contrôle de la qualité de l'air (seuils OMS, réseau de stations)

## Pourquoi contrôler

:::definition Contrôle de la qualité
Le **contrôle de la qualité** d'un milieu consiste à mesurer régulièrement un ensemble de **paramètres** et à les comparer à des **normes** établies scientifiquement, afin de détecter toute dégradation et d'en identifier la cause.
:::

:::propriete Les trois raisons de contrôler
1. **Détecter** une pollution, parfois avant qu'elle ne soit visible.
2. **Identifier** son origine, en comparant plusieurs points de mesure — en amont et en aval d'un rejet, par exemple.
3. **Vérifier l'efficacité** des mesures correctives mises en place.
:::

## Les paramètres de la qualité de l'eau

:::propriete Les trois familles
**Paramètres physiques** — **température**, **turbidité** (trouble de l'eau), couleur, odeur, conductivité.

**Paramètres chimiques** — **pH**, **dioxygène dissous**, **nitrates**, **phosphates**, **DBO**, métaux lourds, pesticides.

**Paramètres biologiques** — **germes** témoins de contamination fécale (*Escherichia coli*, coliformes), et **bio-indicateurs** (invertébrés, algues).
:::

:::definition DBO — demande biochimique (ou biologique) en oxygène
La **DBO** est la quantité de dioxygène consommée par les micro-organismes pour dégrader la **matière organique** contenue dans un litre d'eau. On la mesure sur **5 jours**, à une température de **20 °C** et à l'**obscurité** — on la note alors $\mathrm{DBO_5}$. Ces trois conditions font partie de la définition et sont attendues.

Plus l'eau contient de matière organique, plus la DBO est **élevée**. C'est donc un **indicateur direct** de la pollution organique.
:::

:::attention DBO élevée et dioxygène faible vont ensemble
Une eau à forte **DBO** contient beaucoup de matière organique ; sa dégradation par les bactéries **consomme** le dioxygène dissous, dont la teneur **chute**. Les deux paramètres évoluent donc en sens **inverse**, et c'est cette relation qu'on demande d'expliquer.
:::

:::propriete Les valeurs repères
| Paramètre | Eau de bonne qualité |
| --- | --- |
| Dioxygène dissous | $> 5\ \mathrm{mg\cdot L^{-1}}$ |
| $\mathrm{pH}$ | entre $6{,}5$ et $8{,}5$ |
| Nitrates | $< 50\ \mathrm{mg\cdot L^{-1}}$ (eau potable) |
| $\mathrm{DBO_5}$ | faible |
| Germes fécaux | **absence** dans une eau potable |
:::

## Les deux critères du contrôle : physicochimiques et biologiques

:::definition DCO — demande chimique en oxygène
La **DCO** est la quantité de dioxygène nécessaire pour oxyder **chimiquement** la totalité des produits oxydables contenus dans un litre d'eau, dans les mêmes conditions.

Elle englobe donc **plus** de choses que la $\mathrm{DBO_5}$ : tout ce qui est oxydable, et non seulement ce que les bactéries savent dégrader.
:::

:::attention DBO₅ ou DCO ? La question tombe
| | $\mathrm{DBO_5}$ | DCO |
| --- | --- | --- |
| Oxydation par | les **bactéries** (voie **biologique**) | un réactif (voie **chimique**) |
| Mesure | la matière organique **biodégradable** | **tout** l'oxydable |
| Valeur | toujours **inférieure** à la DCO | toujours la **plus grande** des deux |

D'où la règle : **DCO $>$ DBO₅** toujours. Un énoncé qui donne une DBO₅ supérieure à la DCO contient une erreur.
:::

:::propriete Le critère de matière oxydable
Les deux mesures se combinent en un seul indice :
$$\mathrm{MO} = \frac{2\,\mathrm{DBO_5} + \mathrm{DCO}}{2}$$
C'est la formule du programme. Elle pondère la $\mathrm{DBO_5}$ **deux fois** parce que la pollution biodégradable est celle qui consomme réellement le dioxygène du milieu.
:::

:::propriete La grille de qualité des eaux
Chaque paramètre est rangé dans l'une des **cinq** classes de qualité. Les valeurs à connaître, en $\mathrm{mg\cdot L^{-1}}$ :

| Paramètre | Très bonne | Bonne | Moyenne | Mauvaise | Très mauvaise |
| --- | --- | --- | --- | --- | --- |
| Matières en suspension | $< 25$ | $< 25$ | $25$ à $30$ | $30$ à $70$ | $> 70$ |
| $\mathrm{DBO_5}$ | $< 3$ | $3$ à $5$ | $5$ à $10$ | $10$ à $25$ | $> 25$ |
| DCO | $< 20$ | $20$ à $25$ | $25$ à $40$ | $40$ à $80$ | $> 80$ |
| Ammonium $\mathrm{NH_4^+}$ | $< 0{,}1$ | $0{,}1$ à $0{,}5$ | $0{,}5$ à $2$ | $2$ à $8$ | $> 8$ |
| Nitrates $\mathrm{NO_3^-}$ | $< 25$ | $25$ à $44$ | $44$ à $50$ | $50$ à $100$ | $> 100$ |
| Phosphore total | $< 0{,}1$ | $0{,}1$ à $0{,}3$ | $0{,}3$ à $0{,}5$ | $0{,}5$ à $3$ | $> 3$ |
| Dioxygène dissous | $> 7$ | $5$ à $7$ | $3$ à $5$ | $< 3$ | $< 3$ |

**Sens de lecture** : plus la $\mathrm{DBO_5}$ et la DCO sont **grandes**, plus l'eau est **mauvaise** ; le dioxygène dissous, lui, va dans le **sens contraire** — plus il est élevé, meilleure est l'eau.
:::

:::attention
Le dioxygène dissous, les MES, la DBO₅ et la DCO relèvent de la **qualité du milieu aquatique**. Ils ne sont pas des normes de **potabilité** : une eau de forage pauvre en dioxygène peut être parfaitement potable. Ne pas mélanger les deux grilles.
:::

:::definition Le coefficient biologique (indice biotique)
Les critères **biologiques** reposent sur le peuplement du milieu. On prélève un échantillon d'**invertébrés** vivant dans le cours d'eau, on identifie les espèces les plus **sensibles** à la pollution, et on en déduit le **coefficient biologique**, noté de **0 à 10**.

Un coefficient **élevé** signale une eau de bonne qualité ; un coefficient **bas** une eau polluée.
:::

:::remarque
Le coefficient biologique est le prolongement chiffré des **bio-indicateurs** : il ne mesure pas un polluant, il mesure la **réponse du vivant**, donc l'état du milieu **intégré dans le temps**.
:::

## Le contrôle de la qualité de l'air et du sol

:::propriete La qualité de l'air
L'**Organisation mondiale de la santé** (**OMS**) fixe, pour chaque polluant, une **concentration à ne pas dépasser** : particules en suspension, ozone $\mathrm{O_3}$, dioxyde d'azote $\mathrm{NO_2}$, dioxyde de soufre $\mathrm{SO_2}$.

Pour vérifier le respect de ces recommandations, chaque pays installe un **réseau de stations de mesure** réparties en **plusieurs points** du territoire — et non en un seul, car la pollution de l'air est très **inégale** selon les sources locales et les vents.
:::

:::definition IBQS — la qualité du sol
La qualité d'un **sol** s'estime à partir de la **biodiversité** des êtres vivants qui le peuplent, cette biodiversité étant elle-même un indicateur de son état. On la chiffre par l'**indice biologique de la qualité du sol**, l'**IBQS**.
:::

:::aretenir Les trois milieux, les trois outils
| Milieu | Critère physicochimique | Critère biologique |
| --- | --- | --- |
| **Eau** | MES, $\mathrm{DBO_5}$, DCO, MO, $\mathrm{O_2}$, $\mathrm{NO_3^-}$, pH | **coefficient biologique** (0–10), invertébrés |
| **Air** | seuils **OMS** ($\mathrm{O_3}$, $\mathrm{NO_2}$, $\mathrm{SO_2}$, particules) mesurés en réseau de stations | **lichens** |
| **Sol** | — | **IBQS**, biodiversité du sol |
:::

:::app Applique
Trois points d'un même oued sont analysés.

| Point | MES (mg·L⁻¹) | DBO₅ (mg·L⁻¹) | DCO (mg·L⁻¹) | O₂ dissous (mg·L⁻¹) | Coefficient biologique |
| --- | --- | --- | --- | --- | --- |
| **P1** (amont) | $18$ | $2$ | $14$ | $8{,}2$ | $9$ |
| **P2** (aval d'une ville) | $45$ | $18$ | $62$ | $2{,}4$ | $2$ |
| **P3** ($10\ \mathrm{km}$ plus bas) | $28$ | $7$ | $31$ | $5{,}6$ | $6$ |

**1.** Classe chaque point à l'aide de la grille de qualité, paramètre par paramètre.
**2.** Calcule la MO en $\mathrm{P2}$.
**3.** Les critères physicochimiques et le coefficient biologique concordent-ils ?
**4.** Comment expliques-tu la situation de $\mathrm{P3}$ par rapport à $\mathrm{P2}$ ?

:::solution
**1.**
- $\mathrm{P1}$ — MES $18$ : **très bonne** ; DBO₅ $2$ : **très bonne** ; DCO $14$ : **très bonne** ; $\mathrm{O_2}$ $8{,}2$ : **très bonne**. Eau de **très bonne qualité**.
- $\mathrm{P2}$ — MES $45$ : **mauvaise** ; DBO₅ $18$ : **mauvaise** ; DCO $62$ : **mauvaise** ; $\mathrm{O_2}$ $2{,}4$ : **très mauvaise**. Eau **mauvaise à très mauvaise**.
- $\mathrm{P3}$ — MES $28$ : **moyenne** ; DBO₅ $7$ : **moyenne** ; DCO $31$ : **moyenne** ; $\mathrm{O_2}$ $5{,}6$ : **bonne**. Eau de qualité **moyenne**.

**2.**
$$\mathrm{MO} = \frac{2 \times 18 + 62}{2} = \frac{36 + 62}{2} = \frac{98}{2} = 49$$

**3.** **Oui, parfaitement.** Le coefficient biologique suit exactement la dégradation physicochimique : $9$ en $\mathrm{P1}$ (eau très bonne), $2$ en $\mathrm{P2}$ (eau très mauvaise), $6$ en $\mathrm{P3}$ (eau moyenne).

C'est attendu : la chute du **dioxygène** élimine les invertébrés les plus **sensibles**, et ce sont précisément eux qui déterminent la valeur de l'indice. Les deux familles de critères se **confirment** mutuellement — c'est pourquoi on les utilise ensemble.

**4.** C'est l'**autoépuration**. Entre $\mathrm{P2}$ et $\mathrm{P3}$, les bactéries aérobies ont dégradé une partie de la matière organique, ce qui fait **baisser** la DBO₅ et la DCO ; les MES ont **sédimenté** ; et le brassage de l'eau avec l'air a **réoxygéné** le milieu, permettant le retour d'espèces plus exigeantes.

L'autoépuration a donc des **limites** : $\mathrm{P3}$ n'est revenu qu'à une qualité **moyenne**, pas au niveau de $\mathrm{P1}$. Un rejet plus important, ou trop rapproché du précédent, dépasserait cette capacité.
:::
:::

## L'eau potable

:::definition Eau potable
Une eau **potable** est une eau que l'on peut boire sans risque pour la santé, toute sa vie. Elle doit satisfaire **simultanément** des critères **physiques** (limpide, sans odeur ni saveur désagréable), **chimiques** (teneurs limitées en nitrates, métaux, pesticides) et **biologiques** (**absence** de germes pathogènes).
:::

:::attention
Une eau **limpide** n'est pas forcément potable : les germes et les nitrates sont **invisibles**. Inversement, une eau **trouble** peut être inoffensive. L'apparence ne prouve rien — seule l'analyse tranche. C'est une confusion fréquente.
:::

## Les étapes de la potabilisation

:::propriete Du captage au robinet
1. **Dégrillage et tamisage** — retenir les gros débris.
2. **Coagulation-floculation** — on ajoute un réactif qui agglomère les fines particules en **flocons**.
3. **Décantation** — les flocons, devenus lourds, sédimentent.
4. **Filtration** — sur sable, pour retenir les particules restantes.
5. **Désinfection** — au **chlore** ou à l'**ozone**, pour détruire les micro-organismes pathogènes.
:::

:::attention Potabilisation ou épuration ?
Ce sont deux traitements **opposés** dans la chaîne de l'eau :
| | **Potabilisation** | **Épuration** |
| --- | --- | --- |
| Traite | l'eau **avant** consommation | les eaux **usées** après usage |
| But | la rendre **buvable** | la rendre **rejetable** dans le milieu |
| Finit par | **désinfection** | rejet au milieu naturel |

Les confondre est une erreur classique.
:::

:::app Applique
On analyse trois eaux de surface destinées à l'alimentation d'une ville. Les quatre premiers paramètres sont des critères de **potabilité** ; le dioxygène dissous, lui, renseigne sur la **qualité du milieu** d'où l'eau est prélevée.

| Paramètre | Eau A | Eau B | Eau C | Norme |
| --- | --- | --- | --- | --- |
| Turbidité | faible | forte | faible | faible |
| $\mathrm{pH}$ | $7{,}2$ | $7{,}0$ | $7{,}4$ | $6{,}5$–$8{,}5$ |
| Nitrates (mg·L⁻¹) | $12$ | $20$ | $78$ | $< 50$ |
| $\mathrm{O_2}$ dissous (mg·L⁻¹) | $8{,}1$ | $3{,}2$ | $7{,}8$ | $> 5$ |
| *E. coli* (/100 mL) | $0$ | $240$ | $0$ | $0$ |

**1.** Quelle eau est potable ? Justifie paramètre par paramètre.
**2.** Quel problème présente l'eau B ? Quelle en est l'origine probable ?
**3.** Et l'eau C ? Peut-on la rendre potable par simple désinfection ?
**4.** Pourquoi l'eau C est-elle trompeuse à l'œil ?

:::solution
**1.** Seule l'**eau A** est potable : sa turbidité est faible, son $\mathrm{pH}$ de $7{,}2$ est dans la fourchette, ses nitrates sont à $12$ (bien en dessous de $50$), et elle ne contient **aucun** *E. coli*. **Tous** les critères de potabilité sont satisfaits simultanément. Son dioxygène à $8{,}1\ \mathrm{mg\cdot L^{-1}}$ ne juge pas sa potabilité, mais indique que le milieu d'où elle vient est en bon état.

**2.** L'eau **B** est **fortement contaminée** : turbidité élevée, dioxygène effondré à $3{,}2\ \mathrm{mg\cdot L^{-1}}$ — sous le seuil — et surtout **240** *E. coli* par $100\ \mathrm{mL}$, alors que la norme exige **zéro**.

La présence d'*E. coli* signe une **contamination fécale**, donc des rejets d'**eaux usées domestiques** non traitées. La matière organique qu'elles apportent explique aussi la chute du dioxygène : sa dégradation par les bactéries le consomme.

**3.** L'eau **C** dépasse la norme en **nitrates** :
$$\frac{78}{50} = 1{,}56$$
soit un dépassement d'un facteur **1,56**. Tous ses autres paramètres sont pourtant bons.

**Non**, une désinfection ne suffirait **pas** : le chlore ou l'ozone détruisent les **micro-organismes**, mais n'ont **aucun effet** sur les **nitrates**, qui sont des ions dissous. Il faudrait un traitement spécifique de dénitrification — ou, mieux, réduire les apports **à la source**, vraisemblablement agricoles.

**4.** Parce qu'elle est **limpide**, de $\mathrm{pH}$ normal et bien oxygénée : elle a **toutes les apparences** d'une bonne eau. Or les **nitrates** sont incolores, inodores et sans saveur. Seule l'**analyse chimique** révèle le problème — c'est exactement pourquoi le contrôle de la qualité ne peut pas reposer sur l'observation.
:::
:::

:::funnel Contrôle de la qualité des milieux
:::

### Résumé de la leçon

:::aretenir Les trois familles de paramètres
**Physiques** — température, **turbidité**, couleur, odeur.
**Chimiques** — **pH**, **O₂ dissous**, nitrates, phosphates, **DBO**, métaux.
**Biologiques** — germes fécaux (***E. coli***), **bio-indicateurs**.
:::

:::aretenir La DBO
Dioxygène consommé par les micro-organismes pour dégrader la matière organique d&apos;un litre d&apos;eau (sur 5 jours : **DBO₅**).
**DBO élevée ⇔ O₂ dissous faible** : la dégradation consomme l&apos;oxygène.
:::

:::aretenir Les repères
O₂ $> 5\ \mathrm{mg\cdot L^{-1}}$ · pH entre $6{,}5$ et $8{,}5$ · nitrates $< 50\ \mathrm{mg\cdot L^{-1}}$ · germes fécaux : **zéro**.
:::

:::attention
Une eau **limpide** n&apos;est pas forcément potable : germes et nitrates sont **invisibles**. L&apos;apparence ne prouve rien.
Tous les critères doivent être remplis **simultanément**.
:::

:::attention Potabilisation / épuration
**Potabilisation** — l&apos;eau **avant** consommation, pour la rendre **buvable**.
**Épuration** — les eaux **usées**, pour les rendre **rejetables**.
:::

:::aretenir DBO₅, DCO, MO
$\mathrm{DBO_5}$ = oxygène consommé par les **bactéries** en **5 jours**, à **20 °C**, à l'**obscurité** → matière **biodégradable**.
DCO = oxydation **chimique** de **tout** l'oxydable. Donc **DCO $>$ DBO₅** toujours.
$$\mathrm{MO} = \frac{2\,\mathrm{DBO_5} + \mathrm{DCO}}{2}$$
:::

:::aretenir La grille de qualité — les bornes de « bonne qualité »
MES $< 25$ · $\mathrm{DBO_5}$ : $3$ à $5$ · DCO : $20$ à $25$ · $\mathrm{NH_4^+}$ : $0{,}1$ à $0{,}5$ · $\mathrm{NO_3^-}$ : $25$ à $44$ · P total : $0{,}1$ à $0{,}3$ · $\mathrm{O_2}$ dissous : $5$ à $7$.
DBO₅ et DCO **montent** quand l'eau se dégrade ; le dioxygène **descend**.
:::

:::aretenir Les critères biologiques
**Eau** — **coefficient biologique** (indice biotique) noté de **0 à 10**, déterminé par les **invertébrés les plus sensibles**. Élevé = bonne eau.
**Air** — seuils **OMS** ($\mathrm{O_3}$, $\mathrm{NO_2}$, $\mathrm{SO_2}$, particules) + réseau de **stations** en plusieurs points ; **lichens** comme bio-indicateurs.
**Sol** — **IBQS**, fondé sur la **biodiversité** du sol.
:::

:::attention
Dioxygène dissous, MES, DBO₅ et DCO jugent la **qualité du milieu**, pas la **potabilité**. Deux grilles différentes.
:::

---

<!-- leçon 50 · cours -->

# Leçon — Méthodes & exercices types — qualité de l'eau et efficacité d'un traitement

**Objectifs :** Conclure sur la conformité d'une eau à partir de plusieurs paramètres et normes
Localiser la source d'une pollution par un profil amont-aval
Identifier l'origine d'une pollution à partir du polluant dominant
Calculer un rendement d'élimination et évaluer l'efficacité d'un traitement
Croiser données physico-chimiques et bio-indicateurs

## Méthode 1 — Conclure sur la conformité

:::methode La règle absolue
1. Comparer **chaque** paramètre à sa norme, **séparément**.
2. Calculer le **facteur de dépassement** pour ceux qui sortent des clous :
$$\text{dépassement} = \frac{\text{mesure}}{\text{limite}}$$
3. Conclure : l'eau est impropre dès qu'**un seul** paramètre est hors norme.
:::

:::attention
La conformité n'est **pas une moyenne**. Une eau parfaite sur neuf paramètres et catastrophique sur le dixième est **non conforme**. Ne jamais compenser un mauvais paramètre par un bon.

Attention aussi au **sens** de la norme : pour le dioxygène c'est un **minimum** ($> 5$), pour les nitrates un **maximum** ($< 50$). Lire la norme avant de conclure.
:::

## Méthode 2 — Localiser la source d'une pollution

:::methode Le profil amont-aval
On compare les mesures en plusieurs points le long d'un cours d'eau.
1. **Repérer** entre quels points la dégradation apparaît : la source du rejet est **entre ces deux points**.
2. **Identifier** le polluant dominant pour en déduire l'origine.
3. **Vérifier** plus en aval : une amélioration progressive traduit l'**autoépuration**.
:::

:::propriete Identifier l'origine par le polluant
| Polluant dominant | Origine probable |
| --- | --- |
| *E. coli*, forte **DBO**, matière organique | rejets **domestiques** non traités |
| **nitrates** et **phosphates** | rejets **agricoles** (engrais, élevage) |
| **métaux lourds**, pH anormal | rejets **industriels** |
| **température** élevée | rejet de refroidissement (centrale, industrie) |
:::

:::definition Autoépuration
L'**autoépuration** est la capacité naturelle d'un cours d'eau à **dégrader** la matière organique qu'il reçoit et à se **réoxygéner** par brassage, retrouvant progressivement sa qualité en aval du rejet.

Elle a des **limites** : au-delà d'une certaine charge, le milieu ne s'en remet plus.
:::

## Méthode 3 — Exploiter des bio-indicateurs

:::methode Le raisonnement
1. **Repérer** les espèces présentes et leur **degré de sensibilité**.
2. Présence d'espèces **sensibles** ⇒ milieu de **bonne** qualité.
3. Uniquement des espèces **tolérantes** ⇒ milieu **dégradé**.
4. **Croiser** avec les mesures physico-chimiques : les deux doivent concorder.
:::

:::attention
Le nombre **total** d'individus n'est pas un bon indicateur : une eau polluée peut abriter **énormément** d'individus, mais d'une ou deux espèces seulement. Ce qui compte est la **diversité** et la **sensibilité** des espèces présentes.
:::

## Méthode 4 — Interpréter un suivi dans le temps

:::methode Évaluer l'efficacité d'une mesure
Quand on donne des mesures **avant** et **après** l'installation d'un dispositif — une station d'épuration par exemple :
1. **Chiffrer** l'évolution de chaque paramètre.
2. Calculer le **rendement** d'élimination :
$$R = \frac{C_{\text{entrée}} - C_{\text{sortie}}}{C_{\text{entrée}}} \times 100$$
3. **Comparer** aux normes : la sortie est-elle conforme ?
4. **Conclure** sur l'efficacité, et signaler ce qui reste insuffisant.
:::

:::app Exercice de synthèse
Une station d'épuration a été mise en service sur une rivière. Voici les mesures en aval du rejet.

| Paramètre | Avant la station | Après la station | Norme |
| --- | --- | --- | --- |
| $\mathrm{DBO_5}$ (mg·L⁻¹) | $180$ | $18$ | $< 25$ |
| $\mathrm{O_2}$ dissous (mg·L⁻¹) | $1{,}8$ | $6{,}4$ | $> 5$ |
| *E. coli* (/100 mL) | $10^{5}$ | $10^{3}$ | $< 10^{4}$ |
| Nitrates (mg·L⁻¹) | $62$ | $58$ | $< 50$ |
| Espèces d'invertébrés | $3$ | $17$ | — |

**1.** Calcule le rendement d'élimination de la DBO et des *E. coli*.
**2.** La rivière est-elle conforme après la station ? Justifie paramètre par paramètre.
**3.** Explique le lien entre la baisse de la DBO et la remontée du dioxygène.
**4.** Que faudrait-il faire de plus ? Pourquoi la station n'y suffit-elle pas ?

:::solution
**1.** Pour la DBO :
$$R = \frac{180 - 18}{180} \times 100 = \frac{162}{180} \times 100 = 90\ \%$$
Pour les *E. coli* :
$$R = \frac{10^{5} - 10^{3}}{10^{5}} \times 100 = \frac{99\,000}{100\,000} \times 100 = 99\ \%$$

**2.** Paramètre par paramètre :
- **DBO₅** à $18$, norme $< 25$ → **conforme** ;
- **dioxygène** à $6{,}4$, norme $> 5$ → **conforme** ;
- ***E. coli*** à $10^{3}$, norme $< 10^{4}$ → **conforme**, avec un facteur $10$ de marge ;
- **nitrates** à $58$, norme $< 50$ → **NON conforme**, avec un dépassement de
$$\frac{58}{50} = 1{,}16$$

L'eau n'est donc **pas conforme**, à cause des **nitrates**. Il suffit d'un seul paramètre hors norme.

**3.** La **DBO** mesure la matière organique dégradable. En l'éliminant à $90\ \%$, la station a supprimé l'essentiel de ce que les bactéries de la rivière avaient à dégrader. Or c'est cette dégradation qui **consommait** le dioxygène dissous.

La consommation ayant chuté, la réoxygénation naturelle par brassage l'emporte et la teneur en $\mathrm{O_2}$ remonte de $1{,}8$ à $6{,}4\ \mathrm{mg\cdot L^{-1}}$. Le retour des invertébrés — de $3$ à $17$ espèces — **confirme** biologiquement cette amélioration.

**4.** Il faudrait agir sur les **nitrates**, seul paramètre encore non conforme, et qui n'a presque pas bougé ($62 \to 58$, soit à peine $6\ \%$ d'abattement).

La station n'y suffit pas pour deux raisons :
- elle est conçue pour traiter la **matière organique** et les germes, pas nécessairement l'azote, qui exige un traitement spécifique de **dénitrification** ;
- surtout, les nitrates sont probablement d'origine **agricole** et arrivent par **lessivage diffus** des sols sur tout le bassin versant — ils ne passent donc **pas** par la station, qui ne traite que les rejets collectés.

La solution est ici **à la source** : usage raisonné des engrais, bandes végétalisées le long du cours d'eau, alternance des cultures.
:::
:::

:::funnel Méthodes et exercices types du contrôle de la qualité
:::

### Résumé de la leçon

:::aretenir La conformité
$$\text{dépassement} = \frac{\text{mesure}}{\text{limite}} \qquad R = \frac{C_{\text{entrée}} - C_{\text{sortie}}}{C_{\text{entrée}}}\times 100$$
Impropre dès qu&apos;**UN SEUL** paramètre est hors norme. Ce n&apos;est **pas une moyenne**.
Vérifier le **sens** de la norme : O₂ c&apos;est un **minimum**, nitrates un **maximum**.
:::

:::aretenir Identifier l'origine
***E. coli*** + forte DBO ⇒ **domestique** · **nitrates / phosphates** ⇒ **agricole** · **métaux lourds** ⇒ **industriel** · **température** ⇒ refroidissement.
:::

:::aretenir Autoépuration
Capacité naturelle du cours d&apos;eau à dégrader la matière organique et à se **réoxygéner** en aval. Elle a des **limites**.
:::

:::attention Bio-indicateurs
Ce n&apos;est pas le **nombre d&apos;individus** qui compte, c&apos;est la **diversité** et la **sensibilité** des espèces présentes.
:::

---

<!-- leçon 51 · cours -->

# Leçon — Approfondissement — normes, surveillance et épuration

**Objectifs :** Expliquer comment une norme environnementale est établie
Justifier la complémentarité des méthodes de surveillance d'un milieu
Décrire les quatre étapes d'une station d'épuration
Relier le traitement secondaire à la respiration et la méthanisation des boues à la fermentation
Discuter les enjeux de la gestion de l'eau au Maroc

## Les normes : d'où viennent-elles ?

:::propriete Comment on fixe une norme
Une norme n'est pas un chiffre arbitraire. Elle résulte d'une démarche en trois temps :
1. On détermine expérimentalement la **dose sans effet observable** sur des organismes.
2. On applique un **facteur de sécurité**, pour couvrir les incertitudes et protéger les individus les plus sensibles — enfants, malades, personnes âgées.
3. On tient compte de la **faisabilité technique** et du **coût** du traitement.
:::

:::attention
Une norme protège donc **avec une marge**, mais elle n'est pas une frontière absolue entre le sain et le toxique. Un léger dépassement ponctuel n'est pas nécessairement dangereux ; un dépassement **chronique** l'est. Inversement, respecter la norme ne garantit pas un risque nul.

C'est exactement pourquoi le **principe de précaution** existe.
:::

## Les réseaux de surveillance

:::propriete Comment on surveille un territoire
- Des **stations de mesure** fixes, enregistrant en continu les principaux paramètres.
- Des **campagnes de prélèvement** périodiques, en des points choisis — amont et aval des rejets, points de captage.
- Un **suivi biologique** par les bio-indicateurs, qui révèle les pollutions **intermittentes**.
- La publication d'**indices** synthétiques, compréhensibles par le public.
:::

:::remarque Pourquoi combiner les approches
Chaque méthode a un angle mort. La mesure **continue** repère les pics mais coûte cher et ne porte que sur quelques paramètres. Le **prélèvement** ponctuel est complet mais ne voit qu'un instant. Le **suivi biologique** intègre le temps long mais ne dit pas **quel** polluant est en cause.

Les trois sont **complémentaires** : c'est leur croisement qui donne un diagnostic fiable.
:::

## La station d'épuration, en détail

:::propriete Les quatre étapes
1. **Prétraitement** — dégrillage (gros déchets), dessablage, déshuilage.
2. **Traitement primaire** — **décantation** : les matières en suspension sédimentent et forment les **boues primaires**.
3. **Traitement secondaire** — **biologique**. Des **bactéries aérobies**, maintenues en suspension dans des bassins **fortement aérés**, dégradent la matière organique dissoute. C'est l'étape qui fait chuter la **DBO**.
4. **Traitement tertiaire** — facultatif : élimination de l'**azote** et du **phosphore**, désinfection.

Les **boues** produites sont ensuite traitées : **méthanisation** produisant du biogaz, puis valorisation agricole du digestat si sa qualité le permet.
:::

:::attention Le lien avec le domaine 1
Le traitement secondaire est une **respiration cellulaire** à l'échelle industrielle : on fournit du **dioxygène** à des bactéries pour qu'elles **oxydent complètement** la matière organique en $\mathrm{CO_2}$ et en eau.

C'est pour cela que les bassins sont **aérés** en permanence. Sans $\mathrm{O_2}$, les bactéries basculeraient en **fermentation** — production de méthane et de composés malodorants, et dégradation **incomplète**.

À l'inverse, la **méthanisation des boues** exploite volontairement l'anaérobie pour produire du **biogaz**. Le même choix aérobie/anaérobie qu'entre respiration et fermentation, appliqué deux fois dans la même station, pour deux objectifs différents.
:::

## La gestion de l'eau au Maroc

:::remarque Un enjeu national
Le Maroc est un pays à **stress hydrique** : la ressource est limitée, inégalement répartie et soumise à des sécheresses récurrentes. Les enjeux du contrôle de la qualité y sont donc particulièrement forts :
- préserver la qualité des **nappes phréatiques**, très sollicitées par l'irrigation ;
- généraliser l'**assainissement** et l'épuration, y compris en milieu rural ;
- **réutiliser** les eaux épurées pour l'irrigation et l'arrosage des espaces verts ;
- lutter contre la **surexploitation** des nappes et l'intrusion saline sur le littoral.
:::

:::propriete La réutilisation des eaux épurées
Une eau **épurée** n'est pas potable, mais elle peut parfaitement servir à l'**irrigation**, à l'arrosage des golfs et espaces verts, ou à certains usages industriels. Cela **économise** l'eau potable pour les usages qui l'exigent réellement.

C'est une application directe de l'**économie circulaire** : l'eau usée cesse d'être un déchet pour redevenir une ressource.
:::

:::app Applique
Une station d'épuration traite $20\,000\ \mathrm{m^3}$ d'eaux usées par jour, avec une DBO d'entrée de $300\ \mathrm{mg\cdot L^{-1}}$ et un rendement d'élimination de $92\ \%$.

**1.** Quelle est la DBO en sortie ? Est-elle conforme à la norme de $25\ \mathrm{mg\cdot L^{-1}}$ ?
**2.** Quelle masse de matière organique, exprimée en DBO, est éliminée chaque jour ?
**3.** Pourquoi les bassins du traitement secondaire doivent-ils être aérés en permanence ?
**4.** Les boues sont méthanisées. Pourquoi ce traitement-là se fait-il, au contraire, sans dioxygène ?

:::solution
**1.** Il reste $100 - 92 = 8\ \%$ de la DBO d'entrée :
$$\mathrm{DBO_{sortie}} = 0{,}08 \times 300 = 24\ \mathrm{mg\cdot L^{-1}}$$
$24 < 25$ : la sortie est **conforme**, mais de justesse. Une baisse du rendement de quelques points suffirait à la faire dépasser la norme.

**2.** Masse éliminée par jour :
$$\Delta C = 300 - 24 = 276\ \mathrm{mg\cdot L^{-1}}$$
Volume traité : $20\,000\ \mathrm{m^3} = 2{,}0 \times 10^{7}\ \mathrm{L}$.
$$m = 276 \times 10^{-3} \times 2{,}0\times 10^{7} = 5{,}52 \times 10^{6}\ \mathrm{g} = 5{,}52\ \mathrm{tonnes\ par\ jour}$$

**3.** Parce que le traitement secondaire repose sur des bactéries **aérobies** qui dégradent la matière organique par **respiration cellulaire**. Elles ont besoin d'un apport continu de **dioxygène** comme accepteur final d'électrons pour oxyder **complètement** cette matière en $\mathrm{CO_2}$ et en eau.

Sans aération, l'oxygène serait rapidement épuisé et les bactéries basculeraient en **fermentation** : la dégradation deviendrait **incomplète**, le rendement s'effondrerait, et la station produirait du **méthane** et des composés malodorants.

**4.** Parce que l'objectif y est **inverse**. On ne cherche plus à dégrader complètement, mais à **produire du méthane** — un combustible. Or le méthane n'est justement obtenu que par **fermentation anaérobie** : en présence de dioxygène, les bactéries respireraient et produiraient du $\mathrm{CO_2}$, sans valeur énergétique.

La même station utilise donc les **deux** métabolismes du domaine 1, chacun pour ce qu'il sait faire : la **respiration** pour épurer, la **fermentation** pour produire de l'énergie.
:::
:::

:::funnel Approfondissement du contrôle de la qualité
:::

### Résumé de la leçon

:::aretenir D'où vient une norme
**Dose sans effet** → **facteur de sécurité** → **faisabilité** technique et coût.
Elle protège **avec une marge**, mais respecter la norme ne garantit pas un risque **nul** ⇒ d&apos;où le **principe de précaution**.
:::

:::aretenir Les trois approches de surveillance
**Mesure continue** (voit les pics) · **prélèvement ponctuel** (complet mais instantané) · **suivi biologique** (intègre le temps long, mais ne nomme pas le polluant).
Elles sont **complémentaires**.
:::

:::aretenir Les 4 étapes d'une station d'épuration
**Prétraitement** (dégrillage, dessablage) → **primaire** (décantation, boues) → **secondaire BIOLOGIQUE** (bactéries **aérobies**, fait chuter la **DBO**) → **tertiaire** (azote, phosphore, désinfection).
:::

:::attention Le lien avec le domaine 1
**Bassins aérés** = **respiration** (oxydation complète ⇒ épuration).
**Méthanisation des boues** = **fermentation** anaérobie (⇒ biogaz).
La même station utilise les **deux** métabolismes, pour deux objectifs opposés.
:::

:::aretenir Au Maroc
**Stress hydrique** ⇒ préserver les **nappes**, généraliser l&apos;**assainissement**, **réutiliser** les eaux épurées pour l&apos;irrigation.
:::

---

<!-- leçon 60 · cours -->

# Leçon — La station d'épuration

**Objectifs :** Décrire le parcours de l'eau dans une station d'épuration bassin par bassin
Justifier la nécessité de l'aération du traitement secondaire
Calculer un rendement d'élimination et une masse rejetée
Identifier les paramètres non conformes et le traitement manquant
Expliquer le risque d'eutrophisation lié à un rejet riche en azote et en phosphore

## Le document type

[[fig:svt-station-epuration]] Les étapes d'une station d'épuration

:::document Le schéma d'une station
**Le document.** Un schéma en coupe ou en blocs, montrant le parcours de l'eau depuis l'arrivée des eaux usées jusqu'au rejet dans le milieu naturel.

**Ce qu'il faut lire, bassin par bassin.**
- **Dégrilleur** — une grille retient les gros déchets solides.
- **Dessableur-déshuileur** — le sable sédimente au fond, les graisses remontent en surface.
- **Décanteur primaire** — les matières en suspension sédimentent lentement ; on récupère les **boues primaires**.
- **Bassin d'aération** — de l'air est insufflé en permanence ; des **bactéries aérobies** y dégradent la matière organique **dissoute**.
- **Clarificateur** — les bactéries, agglomérées en flocons, sédimentent à leur tour. Une partie est **recyclée** vers le bassin d'aération pour y maintenir la population bactérienne.
- **Sortie** — l'eau épurée, parfois désinfectée, est rejetée au milieu naturel.

**Ce qu'il faut en conclure.** La station enchaîne des traitements **physiques** (grille, décantation) et **biologiques** (bactéries). Ce sont les micro-organismes qui font le travail essentiel : la station ne fait que leur offrir les **conditions optimales** — oxygène, brassage, temps de séjour.
:::

:::attention La question qui tombe toujours
« Justifiez la présence du système d'aération. » La réponse complète tient en trois maillons : les bactéries du bassin sont **aérobies** → elles dégradent la matière organique par **respiration** → il leur faut du **dioxygène** comme accepteur final. Sans lui, la dégradation serait **incomplète** et le rendement s'effondrerait.
:::

## Exploiter un bilan de station

:::methode Les calculs attendus
$$R = \frac{C_{\text{entrée}} - C_{\text{sortie}}}{C_{\text{entrée}}} \times 100$$
$$m_{\text{éliminée}} = (C_{\text{entrée}} - C_{\text{sortie}}) \times V$$
en veillant aux unités : $1\ \mathrm{m^3} = 10^{3}\ \mathrm{L}$ et $1\ \mathrm{mg\cdot L^{-1}} = 1\ \mathrm{g\cdot m^{-3}}$.
:::

:::attention
Le rendement se calcule **paramètre par paramètre**. Une station peut très bien éliminer $95\ \%$ de la DBO et seulement $20\ \%$ des nitrates : ce sont des traitements **différents**. Ne jamais parler d'un « rendement de la station » global.
:::

## Ce que la station ne peut pas faire

:::propriete Les limites à connaître
- Elle ne traite que les eaux **collectées** par le réseau. Les pollutions **diffuses** — lessivage des engrais sur les champs — lui échappent totalement.
- Sans **traitement tertiaire**, elle élimine mal l'**azote** et le **phosphore**, donc ne prévient pas l'**eutrophisation**.
- Elle n'**élimine** pas les **métaux lourds** : elle les **transfère aux boues**, où ils s'adsorbent — c'est précisément ce qui limite la valorisation agricole de ces boues. Elle ne retient pas non plus la plupart des **micropolluants** (médicaments, pesticides), qui perturbent en outre les bactéries du bassin.
- Elle produit des **boues**, qu'il faut à leur tour traiter et valoriser.
:::

:::remarque La conclusion attendue
Une station d'épuration est un traitement **en aval**, indispensable mais **insuffisant**. Elle ne dispense pas d'agir **à la source** : réduire les rejets industriels avant qu'ils n'entrent dans le réseau, et limiter les apports agricoles qui ne passent jamais par elle.
:::

:::app Étude documentaire
Une station reçoit $15\,000\ \mathrm{m^3}$ d'eaux usées par jour. Voici le bilan.

| Paramètre | Entrée (mg·L⁻¹) | Sortie (mg·L⁻¹) | Norme de rejet |
| --- | --- | --- | --- |
| Matières en suspension | $350$ | $21$ | $< 35$ |
| $\mathrm{DBO_5}$ | $280$ | $14$ | $< 25$ |
| Azote total | $60$ | $45$ | $< 15$ |
| Phosphore total | $12$ | $9$ | $< 2$ |

**1.** Calcule le rendement pour chacun des quatre paramètres.
**2.** Quels paramètres sont conformes ? Lesquels ne le sont pas ?
**3.** Quel risque le rejet fait-il courir au cours d'eau ? Justifie par le mécanisme.
**4.** Quelle étape manque-t-il à cette station ? Quelle masse d'azote rejette-t-elle chaque jour ?

:::solution
**1.**
$$\text{MES} : \frac{350 - 21}{350} \times 100 = 94\ \%$$
$$\mathrm{DBO_5} : \frac{280 - 14}{280} \times 100 = 95\ \%$$
$$\text{azote} : \frac{60 - 45}{60} \times 100 = 25\ \%$$
$$\text{phosphore} : \frac{12 - 9}{12} \times 100 = 25\ \%$$

**2.** **Conformes** : les matières en suspension ($21 < 35$) et la $\mathrm{DBO_5}$ ($14 < 25$) — avec d'excellents rendements, supérieurs à $94\ \%$.

**Non conformes** : l'**azote** ($45$ contre $< 15$, soit un dépassement d'un facteur $3$) et le **phosphore** ($9$ contre $< 2$, soit un facteur $4{,}5$). Leurs rendements ne sont que de $25\ \%$.

**3.** Le risque est l'**eutrophisation** du cours d'eau récepteur.

L'azote et le phosphore sont précisément les deux **matières nutritives** qui la déclenchent. Rejetés en excès, ils permettent aux **algues** de proliférer ; celles-ci meurent en masse et leur **décomposition** par les bactéries **consomme le dioxygène** dissous. L'eau s'appauvrit en $\mathrm{O_2}$, la faune **asphyxie** et la biodiversité s'effondre.

Le paradoxe mérite d'être souligné : la station a excellemment traité la matière organique — la DBO du rejet est faible — mais les nutriments qu'elle laisse passer vont **recréer** en aval une forte consommation d'oxygène.

**4.** Il manque le **traitement tertiaire**, seul capable d'éliminer l'azote (par **dénitrification**) et le phosphore (par précipitation).

Masse d'azote rejetée par jour :
$$m = 45\ \mathrm{mg\cdot L^{-1}} \times 15\,000\ \mathrm{m^3} = 45\ \mathrm{g\cdot m^{-3}} \times 15\,000\ \mathrm{m^3} = 675\,000\ \mathrm{g} = 675\ \mathrm{kg\ par\ jour}$$

Il faudrait en outre agir **à la source** sur les apports agricoles du bassin versant, qui arrivent au cours d'eau par **lessivage diffus** sans jamais passer par la station.
:::
:::

:::funnel La station d'épuration
:::

### Résumé de la leçon

:::aretenir Le parcours de l'eau
**Dégrilleur** → **dessableur-déshuileur** → **décanteur primaire** (boues) → **bassin d&apos;aération** (bactéries **aérobies**) → **clarificateur** (boues recyclées) → rejet.
Traitements **physiques** puis **biologiques**. Ce sont les **bactéries** qui font le travail essentiel.
:::

:::attention Justifier l'aération
Bactéries **aérobies** → dégradation par **respiration** → besoin d&apos;**O₂** comme accepteur final.
Sans aération : dégradation **incomplète**, rendement effondré, méthane et odeurs.
:::

:::aretenir Les calculs
$$R = \frac{C_e - C_s}{C_e}\times 100 \qquad m = (C_e - C_s)\times V$$
$1\ \mathrm{mg\cdot L^{-1}} = 1\ \mathrm{g\cdot m^{-3}}$ · $1\ \mathrm{m^3} = 10^3\ \mathrm{L}$.
Le rendement se calcule **paramètre par paramètre**.
:::

:::aretenir Ce que la station ne fait pas
Pollutions **diffuses** (engrais lessivés) · **azote** et **phosphore** sans traitement tertiaire ⇒ **eutrophisation** · **métaux lourds** non éliminés mais **transférés aux boues** · micropolluants · et elle produit des **boues** à gérer.
C&apos;est un traitement **en aval** : indispensable mais **insuffisant**.
:::
