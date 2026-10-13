# L'information génétique et le génie génétique

> Code `svtp-info-genetique` · SVT · pc · 2bac · unité « Génétique »
> Notions (= titres `##`, à recopier tels quels dans le champ `notion`) :
> - Où se trouve l'information génétique ?
> - Trois expériences qui ont tout démontré
> - La composition chimique de l'ADN
> - La structure en double hélice
> - De l'ADN au chromosome
> - Quand l'ADN se réplique-t-il ?
> - L'expérience de Meselson et Stahl
> - Le mécanisme
> - Le problème : l'ADN ne sort pas du noyau
> - L'ARN messager
> - Le mécanisme de la transcription
> - Les acteurs de la traduction
> - Le code génétique
> - Les trois étapes de la traduction
> - Le principe : la transformation génétique
> - Le modèle naturel : *Agrobacterium tumefaciens*
> - Les trois outils
> - Les étapes d'une transgenèse
> - La production industrielle de l'insuline humaine
> - Les plantes transgéniques
> - Une question de société
> - Méthode 1 — Les calculs de composition
> - Méthode 2 — Écrire un brin complémentaire
> - Méthode 3 — Exploiter une expérience de transformation
> - Méthode 4 — Exploiter Meselson et Stahl et généraliser
> - Méthode 5 — Lire une courbe Q(ADN)
> - Méthode 1 — Naviguer entre ADN, ARNm, anticodons et protéine
> - Méthode 2 — Compter
> - Méthode 3 — Analyser l'effet d'une mutation
> - Méthode 4 — Relier une mutation à un phénotype
> - Méthode 1 — Exploiter une carte de restriction
> - Méthode 2 — Justifier chaque étape d'un protocole
> - Méthode 3 — Lire une électrophorèse
> - Méthode 4 — Détecter un allèle muté
> - La reproduction conforme
> - Les mutations : quand la copie n'est pas conforme
> - Gène, allèle, caractère
> - Le paradoxe du niveau de condensation
> - Relation gène-protéine, relation gène-caractère
> - L'universalité du code et ses conséquences
> - La spécificité cellulaire : toutes les cellules, tous les gènes
> - Chez les procaryotes : tout au même endroit
> - Le polysome
> - Le clonage d'un gène
> - Sélectionner les bactéries transformées
> - L'empreinte génétique
> - Thérapie génique et limites
> - Le raisonnement historique, document par document
> - Mettre en évidence l'ADN au laboratoire
> - Exploiter un modèle moléculaire
> - Le principe de la technique
> - Utiliser un marqueur de taille
> - L'empreinte génétique
> - Deux applications, deux raisonnements

---

<!-- leçon 1 · cours -->

# Leçon — ADN et réplication

**Objectifs :** Localiser l'information génétique chez les eucaryotes et les procaryotes
Analyser les expériences de Griffith, d'Avery et de Hershey et Chase
Décrire la composition chimique d'un nucléotide et de l'ADN
Exploiter les règles de Chargaff et les clichés de Franklin
Décrire le modèle de la double hélice et l'appariement des bases
Situer la réplication dans le cycle cellulaire à partir de la courbe Q(ADN)

## Où se trouve l'information génétique ?

:::definition Information génétique
L'**information génétique** est l'ensemble des instructions qui déterminent les caractères d'un être vivant et qui se transmettent de génération en génération. Chez tous les êtres vivants, elle est portée par l'**ADN**.
:::

:::propriete Sa localisation
- Chez les **eucaryotes**, l'ADN est dans le **noyau**, sous forme de **chromatine** pendant l'interphase et de **chromosomes** pendant la division.
- Chez les **procaryotes** (bactéries), il n'y a pas de noyau : l'ADN forme un **chromosome circulaire** libre dans le cytoplasme.
:::

[[fig:svt-cycle-cellulaire]] Le cycle cellulaire et la quantité d'ADN

## Trois expériences qui ont tout démontré

:::experience Griffith (1928) — il existe un principe transformant
**Protocole.** On travaille sur deux souches de pneumocoques : la souche **S**, à capsule, **virulente**, et la souche **R**, sans capsule, **inoffensive**. Quatre injections à des souris :
1. bactéries **R** vivantes ;
2. bactéries **S** vivantes ;
3. bactéries **S** **tuées** par la chaleur ;
4. bactéries **S tuées** **+** bactéries **R** vivantes.

**Résultats.** La souris survit dans les cas 1 et 3, meurt dans le cas 2. Dans le cas 4, elle **meurt**, et on retrouve dans son sang des bactéries **S vivantes**.

**Interprétation.** Les bactéries S tuées ont libéré une substance que les bactéries R ont **intégrée**, et qui leur a donné la capacité de fabriquer une capsule : elles se sont **transformées** en S. Griffith nomme cette substance le **facteur transformant**, mais il n'en détermine pas la nature chimique.
:::

:::experience Avery (1944) — ce principe transformant est l'ADN
**Protocole.** On reprend l'expérience de Griffith, mais on **détruit sélectivement** chaque type de molécule de l'extrait de bactéries S, à l'aide d'enzymes spécifiques : **protéase** (détruit les protéines), **ribonucléase** (détruit l'ARN), **ADNase** (détruit l'ADN).

**Résultats.** Avec la protéase et avec la ribonucléase, la transformation a **toujours lieu** : la souris meurt. Avec l'**ADNase**, la transformation **n'a plus lieu** : la souris **survit**.

**Interprétation.** Ni les protéines ni l'ARN ne sont responsables. Seule la destruction de l'**ADN** supprime la transformation : le principe transformant **est l'ADN**. L'ADN est donc le support de l'information génétique.
:::

:::experience Hershey et Chase (1952) — la confirmation par le bactériophage
**Protocole.** Un **bactériophage** est un virus qui parasite les bactéries ; il est fait d'une **capside protéique** et d'**ADN**. On marque radioactivement soit les protéines, soit l'ADN, puis on laisse les phages infecter des bactéries, et on sépare ce qui est entré de ce qui est resté dehors.

**Résultats.** La **capside protéique reste à l'extérieur** de la bactérie ; seul l'**ADN pénètre** à l'intérieur. Or de nouveaux virus complets sont bel et bien fabriqués dans la bactérie.

**Interprétation.** Puisque seul l'ADN entre et que toute l'information nécessaire à fabriquer de nouveaux virus se trouve à l'intérieur, c'est bien l'**ADN** qui porte l'information génétique du bactériophage.
:::

:::attention La logique des trois expériences
Elles forment une **progression**, et l'examen attend qu'on la restitue :
Griffith montre qu'**il existe** un facteur transformant → Avery montre **de quoi il est fait** → Hershey et Chase le **confirment** sur un autre matériel biologique. Citer une seule des trois ne suffit jamais à répondre à « comment a-t-on démontré que l'ADN est le support de l'information génétique ? ».
:::

## La composition chimique de l'ADN

:::definition Nucléotide
L'ADN est un **polynucléotide** : un enchaînement de **nucléotides**. Chaque nucléotide associe trois molécules :
- un **acide phosphorique** $\mathrm{H_3PO_4}$ ;
- un sucre en $\mathrm{C_5}$, le **désoxyribose** ;
- une **base azotée** parmi quatre : **adénine (A)**, **thymine (T)**, **guanine (G)** et **cytosine (C)**.
:::

:::remarque Une molécule orientée
Un brin d'ADN possède deux extrémités différentes, notées **5'** et **3'** : il est **polarisé**. C'est ce qui donnera un sens de lecture et un sens de synthèse.
:::

## La structure en double hélice

:::observation Les règles de Chargaff
Quelle que soit l'espèce d'où provient l'ADN, on mesure toujours :
$$\%A = \%T \qquad\text{et}\qquad \%G = \%C$$
En revanche, le rapport $\dfrac{A+T}{G+C}$ **varie d'une espèce à l'autre** et lui est caractéristique.

**Interprétation.** Si A est toujours en quantité égale à T, et G à C, c'est que ces bases vont **par paires**. Cette régularité impose l'idée d'un **appariement** : A avec T, G avec C.
:::

:::observation Les clichés de Rosalind Franklin (1951)
La diffraction des rayons X par une fibre d'ADN donne une figure **en croix**, caractéristique d'une structure **hélicoïdale**, et permet d'en mesurer le pas.

**Interprétation.** L'ADN est enroulé en **hélice**. Combinée aux règles de Chargaff, cette donnée conduit Watson et Crick au modèle de la **double hélice**.
:::

[[fig:svt-adn]] Le modèle de la double hélice et l'appariement des bases

:::theoreme Le modèle de la double hélice
L'ADN est formé de **deux chaînes de nucléotides** enroulées l'une autour de l'autre.
- Elles sont reliées au niveau des **bases azotées** par des **liaisons hydrogène** : **2** entre A et T, **3** entre G et C.
- L'adénine est **complémentaire** de la thymine, la guanine de la cytosine.
- Les deux chaînes sont orientées en sens **opposés** : elles sont **antiparallèles**.
:::

:::attention
Le nombre de liaisons hydrogène ($2$ pour A–T, $3$ pour G–C) est régulièrement demandé, et il explique pourquoi un ADN riche en G–C est plus **difficile à séparer** par la chaleur.
:::

## De l'ADN au chromosome

:::propriete La condensation
Chez les eucaryotes, l'ADN est bien trop long pour tenir dans le noyau sans être replié. Il s'associe à des **protéines** structurales :
- pendant l'**interphase**, il forme la **chromatine**, dont l'observation au microscope électronique révèle un aspect en **collier de perles** ;
- pendant la **division**, il se condense au maximum et devient visible sous forme de **chromosomes**.

Un chromosome est donc constitué d'**ADN et de protéines**.
:::

:::app Applique
Un fragment d'ADN double brin contient $1\,200$ nucléotides au total, dont $360$ adénines.

**1.** Combien contient-il de thymines, de guanines et de cytosines ?
**2.** Combien de liaisons hydrogène assurent la cohésion de ce fragment ?
**3.** Un autre ADN a un rapport $\dfrac{A+T}{G+C} = 0{,}5$. Est-il plus ou moins résistant à la chaleur que le premier ? Justifie.

:::solution
**1.** Par les règles de Chargaff, $T = A = 360$.
Il reste donc pour G et C :
$$1\,200 - 360 - 360 = 480$$
Comme $G = C$ :
$$G = C = \frac{480}{2} = 240$$

**2.** Chaque paire A–T compte $2$ liaisons, chaque paire G–C en compte $3$. Il y a $360$ paires A–T et $240$ paires G–C :
$$360 \times 2 + 240 \times 3 = 720 + 720 = 1\,440\ \text{liaisons hydrogène}$$

**3.** Pour le premier ADN :
$$\frac{A+T}{G+C} = \frac{360+360}{240+240} = \frac{720}{480} = 1{,}5$$
Le second a un rapport de $0{,}5$, donc **beaucoup plus de paires G–C**. Or chaque paire G–C est tenue par **3** liaisons hydrogène au lieu de $2$ : le second ADN est **plus résistant à la chaleur**, il faut une température plus élevée pour séparer ses deux brins.
:::
:::

## Quand l'ADN se réplique-t-il ?

:::observation L'évolution de la quantité d'ADN au cours du cycle
On mesure la quantité d'ADN d'une cellule au cours du temps. Elle reste **constante à $Q$** pendant la phase $\mathrm{G_1}$, **double** pendant une phase intermédiaire pour atteindre $2Q$, reste constante pendant $\mathrm{G_2}$, puis **retombe à $Q$** lors de la division.

**Interprétation.** La phase pendant laquelle la quantité d'ADN double est la phase **S** (synthèse) : c'est là que l'ADN se **réplique**. Le retour à $Q$ correspond au partage de l'ADN entre les deux cellules filles lors de la **mitose**.
:::

[[fig:svt-cycle-cellulaire]] Le cycle cellulaire et l'évolution de la quantité d'ADN

:::attention La confusion à éviter absolument
Pendant la phase S, la **quantité d'ADN double**, mais le **nombre de chromosomes ne change pas**. Chaque chromosome passe simplement de **une** à **deux chromatides**. C'est une des erreurs les plus fréquentes de tout le programme.
:::

## L'expérience de Meselson et Stahl

:::experience Trois hypothèses, une seule survit
**Protocole.** On cultive des bactéries pendant de nombreuses générations sur un milieu contenant de l'azote **lourd** $\mathrm{^{15}N}$ : tout leur ADN devient **lourd**. On les transfère ensuite sur un milieu à azote **léger** $\mathrm{^{14}N}$ et on prélève à chaque génération. L'ADN est séparé par **centrifugation** selon sa densité.

Trois modèles sont en concurrence :
- **conservatif** — la molécule mère reste intacte, une molécule entièrement neuve est fabriquée ;
- **semi-conservatif** — chaque molécule fille garde **un** brin de la mère ;
- **dispersif** — les brins neufs et anciens sont mélangés par fragments dans les deux molécules.

**Résultats.**
- Après **une** génération : une seule bande, de densité **intermédiaire** — $100\ \%$ d'ADN **hybride**.
- Après **deux** générations : deux bandes — $50\ \%$ d'ADN **léger** et $50\ \%$ d'ADN **hybride**.

**Interprétation.** Le modèle **conservatif** est réfuté : il prévoyait, dès la première génération, $50\ \%$ de lourd et $50\ \%$ de léger, jamais d'hybride. Le modèle **dispersif** est réfuté à son tour : il prévoyait de l'hybride à **toutes** les générations, jamais d'ADN purement léger. Seul le modèle **semi-conservatif** rend compte des deux résultats.
:::

:::theoreme La réplication semi-conservative
La réplication de l'ADN est **semi-conservative** : les deux brins de la molécule mère se **séparent**, et **chacun sert de matrice** pour la synthèse d'un brin complémentaire.

Chaque molécule fille est donc formée d'**un brin ancien** et d'**un brin néoformé**, et les deux molécules filles sont **strictement identiques** à la molécule mère.
:::

[[fig:svt-replication-adn]] La réplication semi-conservative

## Le mécanisme

:::propriete Les yeux de réplication
Au microscope électronique, on observe pendant la phase S des structures appelées **yeux de réplication** : des zones où les deux brins se sont écartés.

Chaque œil comporte **deux fourches de réplication**, en forme de **Y**, qui progressent en **sens inverses** : la réplication est **bidirectionnelle**. C'est à chaque fourche qu'agit l'**ADN polymérase**.
:::

:::propriete Le déroulement
1. Les **liaisons hydrogène** entre les bases sont rompues : les deux brins s'**écartent**, formant la fourche.
2. L'**ADN polymérase** parcourt chaque brin matrice et y place, en face de chaque base, le **nucléotide complémentaire** prélevé dans le stock de nucléotides libres — A face à T, G face à C.
3. Les deux molécules filles obtenues sont identiques entre elles et identiques à la molécule mère.
:::

:::remarque Pourquoi la fidélité est totale
C'est la **complémentarité des bases** qui garantit la copie conforme. Chaque brin ancien **impose** la séquence du brin neuf : il n'y a aucune liberté. C'est le fondement moléculaire de la **reproduction conforme**.
:::

:::attention
Une réplication **puis** une mitose donnent deux cellules filles génétiquement **identiques** à la cellule mère. C'est le principe de la reproduction conforme, et le lien direct entre ce chapitre et celui sur la mitose.
:::

:::app Applique
Une cellule contient $2n = 8$ chromosomes et une quantité d'ADN égale à $Q$ en début de phase $\mathrm{G_1}$.

**1.** Quelle quantité d'ADN et combien de chromosomes en fin de phase S ? Combien de chromatides ?
**2.** On place des bactéries à ADN lourd sur milieu léger. Quelle proportion d'ADN hybride après trois générations ?
**3.** Un fragment d'ADN de $3\,000$ paires de bases est répliqué. Combien de nucléotides libres sont consommés ?

:::solution
**1.** En fin de phase S, la quantité d'ADN est **$2Q$** : elle a doublé. Mais le nombre de chromosomes est **toujours $8$** — il n'a pas changé. Chaque chromosome porte désormais **deux** chromatides, soit
$$8 \times 2 = 16\ \text{chromatides}$$

**2.** À chaque génération, chaque molécule hybride donne une molécule hybride et une molécule légère, et chaque molécule légère donne deux molécules légères. Le nombre de molécules **hybrides** reste constant et égal à **2** (les deux brins lourds d'origine, chacun dans sa molécule), tandis que le nombre total de molécules double :

| Génération | Molécules totales | Hybrides | Proportion |
| --- | --- | --- | --- |
| $1$ | $2$ | $2$ | $100\ \%$ |
| $2$ | $4$ | $2$ | $50\ \%$ |
| $3$ | $8$ | $2$ | $25\ \%$ |

Après trois générations : **$25\ \%$ d'ADN hybride** et $75\ \%$ d'ADN léger.

**3.** Chaque molécule fille reçoit un brin neuf de $3\,000$ nucléotides. Il y a deux molécules filles, donc deux brins neufs :
$$2 \times 3\,000 = 6\,000\ \text{nucléotides libres consommés}$$
:::
:::

:::funnel ADN et réplication
:::

### Résumé de la leçon

:::aretenir Les trois expériences, dans l'ordre
**Griffith** (1928) — il existe un **facteur transformant** (nature inconnue).
**Avery** (1944) — l&apos;ADNase seule supprime la transformation ⇒ c&apos;est l&apos;**ADN**.
**Hershey et Chase** (1952) — seul l&apos;**ADN** du phage entre dans la bactérie ⇒ confirmation.
:::

:::aretenir Le nucléotide
**acide phosphorique + désoxyribose + une base** (A, T, G ou C). L&apos;ADN est un **polynucléotide**, **polarisé** (5&apos; et 3&apos;).
:::

:::aretenir Chargaff et Franklin
$$\%A = \%T \quad ; \quad \%G = \%C \quad ; \quad \frac{A+T}{G+C}\ \text{caractérise l&apos;espèce}$$
Franklin : figure **en croix** aux rayons X ⇒ structure **hélicoïdale**.
:::

:::aretenir La double hélice
Deux chaînes **antiparallèles**, reliées par des **liaisons hydrogène** entre bases complémentaires :
**A–T : 2 liaisons · G–C : 3 liaisons.**
Plus il y a de G–C, plus l&apos;ADN résiste à la chaleur.
:::

:::attention
**Chromosome = ADN + protéines.** Interphase ⇒ **chromatine** (collier de perles) ; division ⇒ **chromosomes** condensés.
:::

:::aretenir Quand ?
En **phase S** de l&apos;interphase. La quantité d&apos;ADN passe de $Q$ à $2Q$.
:::

:::attention L'erreur classique
En phase S, la **quantité d&apos;ADN double** mais le **nombre de chromosomes ne change pas** : chaque chromosome passe de **1 à 2 chromatides**.
:::

:::aretenir Meselson et Stahl
| Génération | Résultat | Modèle réfuté |
| --- | --- | --- |
| 1 | 100 % **hybride** | **conservatif** (prévoyait lourd + léger) |
| 2 | 50 % léger + 50 % hybride | **dispersif** (prévoyait tout hybride) |

⇒ la réplication est **semi-conservative**.
:::

:::aretenir Le mécanisme
Rupture des **liaisons hydrogène** → **fourche** en Y → l&apos;**ADN polymérase** place les nucléotides **complémentaires**.
Un **œil** de réplication = **deux fourches** progressant en sens inverses ⇒ réplication **bidirectionnelle**.
:::

:::aretenir La proportion d'hybride
Elle vaut $\dfrac{2}{2^n}$ à la génération $n$ : $100\ \%$, $50\ \%$, $25\ \%$, $12{,}5\ \%$…
:::

---

<!-- leçon 2 · cours -->

# Leçon — Transcription et traduction

**Objectifs :** Justifier la nécessité d'un intermédiaire informationnel entre l'ADN et les protéines
Comparer la structure de l'ADN et celle de l'ARN messager
Décrire le mécanisme de la transcription et nommer l'enzyme responsable
Écrire la séquence d'un ARNm à partir du brin transcrit d'un gène
Distinguer brin transcrit et brin non transcrit
Nommer les acteurs de la traduction et préciser le rôle de chacun

## Le problème : l'ADN ne sort pas du noyau

:::observation Un intermédiaire est nécessaire
Chez les eucaryotes, l'**ADN** reste dans le **noyau**, alors que les **protéines** sont fabriquées dans le **cytoplasme**, sur les ribosomes. L'information doit donc franchir l'enveloppe nucléaire.

On observe qu'une molécule apparaît dans le noyau, puis **migre** vers le cytoplasme, et que sa quantité augmente quand un gène est activé.

**Interprétation.** Il existe un **intermédiaire informationnel** entre l'ADN et la protéine : c'est l'**ARN messager** (**ARNm**), qui porte au cytoplasme une copie de l'information du gène.
:::

## L'ARN messager

:::definition ARN messager
L'**ARNm** est un acide nucléique **monocaténaire** — formé d'un **seul brin**. Comme l'ADN, c'est un polynucléotide, mais il en diffère sur trois points.
:::

:::propriete ADN et ARNm : les trois différences
| | ADN | ARNm |
| --- | --- | --- |
| Nombre de brins | **deux** (double hélice) | **un** seul |
| Sucre | **désoxyribose** | **ribose** |
| Bases | A, T, G, C | A, **U** (uracile), G, C |
:::

:::attention
Dans l'ARN, la thymine est remplacée par l'**uracile**. Écrire un T dans une séquence d'ARNm est une faute qui se voit immédiatement.
:::

## Le mécanisme de la transcription

:::definition Transcription
La **transcription** est la synthèse d'une molécule d'**ARNm** à partir du **brin transcrit** d'un gène. Elle a lieu dans le **noyau** et est catalysée par l'**ARN polymérase**.
:::

[[fig:svt-transcription-traduction]] De l'ADN à la protéine

:::propriete Le déroulement
1. L'**ARN polymérase** se fixe sur le gène et provoque l'**ouverture** locale de la double hélice sur une petite portion.
2. Elle parcourt le **brin transcrit** et assemble, face à chaque base, le **ribonucléotide complémentaire**.
3. Au fur et à mesure de sa progression, la molécule d'ARNm s'**allonge**, et la double hélice se **referme** derrière elle.
4. La transcription achevée, l'ARNm **migre** vers le cytoplasme en passant par les **pores nucléaires**.
:::

:::propriete Les règles de complémentarité en transcription
$$\mathrm{A} \rightarrow \mathrm{U} \qquad \mathrm{T} \rightarrow \mathrm{A} \qquad \mathrm{G} \rightarrow \mathrm{C} \qquad \mathrm{C} \rightarrow \mathrm{G}$$
En lisant le **brin transcrit**. Attention au sens : c'est l'adénine **de l'ADN** qui donne un uracile dans l'ARNm.
:::

:::attention Brin transcrit et brin non transcrit
Sur les deux brins du gène, un seul est lu : le **brin transcrit** (dit aussi brin matrice). L'autre, le **brin non transcrit**, a exactement la **même séquence que l'ARNm** — à ceci près qu'il porte un **T** là où l'ARNm porte un **U**. C'est un raccourci très pratique en exercice, mais il faut savoir lequel on manipule.
:::

:::remarque Plusieurs copies à la fois
Sur les photographies au microscope électronique, on voit **plusieurs ARN polymérases** transcrire **simultanément** le même gène, chacune portant un ARNm de longueur croissante. La transcription commence là où l'ARNm est le **plus court** et se termine là où il est le **plus long** : c'est ainsi qu'on lit le **sens** de la transcription sur un document.
:::

:::app Applique
Voici un fragment du **brin transcrit** d'un gène :
$$3'\;\text{— T A C  G G A  C T T  A T T —}\;5'$$

**1.** Écris la séquence de l'ARNm correspondant.
**2.** Écris la séquence du **brin non transcrit**.
**3.** Compare-la à celle de l'ARNm. Que constates-tu ?
**4.** Où se déroule cette étape, et quelle enzyme la catalyse ?

:::solution
**1.** On applique A→U, T→A, G→C, C→G :
$$5'\;\text{— A U G  C C U  G A A  U A A —}\;3'$$

**2.** Le brin non transcrit est le **complémentaire** du brin transcrit, dans l'ADN (donc avec des T) :
$$5'\;\text{— A T G  C C T  G A A  T A A —}\;3'$$

**3.** Les deux séquences sont **identiques**, à une seule différence près : là où l'ARNm porte un **U**, le brin non transcrit porte un **T**. C'est normal, puisque tous deux sont complémentaires du **même** brin transcrit.

**4.** Dans le **noyau**, catalysée par l'**ARN polymérase**.
:::
:::

## Les acteurs de la traduction

:::definition Traduction
La **traduction** est la synthèse d'une **protéine** à partir de la séquence d'un **ARNm**. Elle se déroule dans le **cytoplasme**, sur les **ribosomes**.
:::

:::propriete Le ribosome
Le ribosome est un organite formé de **protéines** (environ $20\ \%$) et d'**ARN ribosomique** (environ $80\ \%$). Il comporte **deux sous-unités**, une **petite** et une **grande**, qui ne s'assemblent qu'au moment de traduire.

Son rôle est de **lire** l'ARNm codon par codon et d'**assembler** les acides aminés par des **liaisons peptidiques**.
:::

:::propriete L'ARN de transfert
Chaque **ARNt** possède deux sites essentiels :
- un site qui fixe un **acide aminé** bien déterminé ;
- un **anticodon** — un triplet de bases **complémentaire** d'un codon de l'ARNm.

C'est l'ARNt qui fait le lien physique entre le langage des **nucléotides** et celui des **acides aminés** : il **transfère** au ribosome l'acide aminé correspondant au codon lu.
:::

:::experience La preuve du rôle de l'ARNm
**Protocole.** On injecte de l'ARNm dans un milieu contenant des ribosomes et des acides aminés marqués, et on suit deux grandeurs : la quantité d'acides aminés incorporés dans des protéines, et la quantité d'ARNm restant.

**Résultats.** L'incorporation d'acides aminés **augmente** progressivement, tandis que la quantité d'ARNm **diminue**. Quand l'ARNm est épuisé, l'incorporation **s'arrête**.

**Interprétation.** L'ARNm est bien ce qui **commande** l'assemblage des acides aminés : sans lui, la synthèse cesse. Il est donc le support de l'information utilisée par le ribosome.
:::

## Le code génétique

[[fig:svt-code-genetique]] Le tableau du code génétique

:::definition Code génétique
Le **code génétique** est le système de correspondance entre les **codons** de l'ARNm et les **acides aminés** de la protéine. Un **codon** est un **triplet** de nucléotides.
:::

:::propriete Les quatre propriétés du code
- **Il fonctionne par triplets** — trois nucléotides pour un acide aminé. Avec $4$ bases, cela fait $4^3 = 64$ codons.
- **Il est redondant** — un même acide aminé peut être codé par **plusieurs** codons différents. C'est logique : $64$ codons pour seulement $20$ acides aminés.
- **Il est non ambigu** — un codon donné ne code **jamais** deux acides aminés différents. Le sens de lecture ARNm → protéine est sans équivoque.
- **Il est universel** — il est pratiquement **le même** chez tous les êtres vivants. C'est ce qui rend le génie génétique possible.
:::

:::propriete Les codons particuliers
- **AUG** est le codon **initiateur** : il marque le début de la traduction et code la **méthionine**.
- **UAA**, **UAG** et **UGA** sont les **codons stop** : ils ne codent **aucun** acide aminé et provoquent l'arrêt de la synthèse.

Il reste donc $64 - 3 = 61$ codons **codants**.
:::

:::attention La redondance n'est pas l'ambiguïté
**Redondant** : plusieurs codons → un même acide aminé. C'est vrai.
**Ambigu** : un codon → plusieurs acides aminés. C'est **faux**.
On peut aller de l'ARNm à la protéine sans hésitation, mais **pas** l'inverse. C'est une question de cours classique.
:::

## Les trois étapes de la traduction

:::propriete Initiation
1. La **petite sous-unité** du ribosome se place sur l'ARNm, au niveau du codon **AUG**.
2. La lecture de ce codon appelle un **ARNt** à anticodon complémentaire (**UAC**), porteur de la **méthionine**.
3. Cet ARNt se fixe sur le **site P** du ribosome.
4. La **grande sous-unité** s'associe alors à la petite.
:::

:::propriete Élongation
1. La lecture du codon suivant fait venir un **deuxième ARNt**, porteur de l'acide aminé désigné par le code génétique.
2. Il se fixe sur le **site A**.
3. Une **liaison peptidique** s'établit entre les deux acides aminés.
4. Le premier ARNt est **libéré** dans le cytoplasme.
5. Le ribosome **se déplace** d'un codon sur l'ARNm, et le cycle recommence.
:::

:::propriete Terminaison
La traduction s'arrête lorsque le ribosome atteint un **codon stop**. Les deux sous-unités se **dissocient** et le **polypeptide** est libéré dans le cytoplasme.
:::

:::remarque La chaîne complète, à savoir réciter
$$\text{ADN} \xrightarrow{\ \text{transcription}\ } \text{ARNm} \xrightarrow{\ \text{traduction}\ } \text{protéine} \longrightarrow \text{caractère}$$
:::

:::app Applique
Soit l'ARNm suivant :
$$5'\;\text{— A U G  G C A  U U C  G G U  U A A —}\;3'$$
Extrait du code génétique : AUG = Met · GCA = Ala · UUC = Phe · GGU = Gly · UAA = STOP.

**1.** Combien d'acides aminés compte la protéine obtenue ? Donne sa séquence.
**2.** Donne les anticodons des ARNt intervenus.
**3.** Une substitution transforme le quatrième codon GGU en GGC. Sachant que GGC code aussi la glycine, la protéine change-t-elle ? Comment nomme-t-on ce cas ?
**4.** Une délétion supprime la première base du deuxième codon. Que devient la protéine ?

:::solution
**1.** On lit les codons jusqu'au stop : AUG · GCA · UUC · GGU, puis UAA qui arrête. Le codon stop ne code aucun acide aminé.
La protéine compte donc **4 acides aminés** :
$$\text{Met — Ala — Phe — Gly}$$

**2.** L'anticodon est le **complémentaire** du codon (avec U face à A) :
| Codon | Anticodon |
| --- | --- |
| AUG | **UAC** |
| GCA | **CGU** |
| UUC | **AAG** |
| GGU | **CCA** |

**3.** **Non, la protéine est identique.** GGU et GGC codent tous deux la glycine : le changement de base ne change pas l'acide aminé. C'est une conséquence directe de la **redondance** du code génétique. On parle de **mutation silencieuse** (ou muette).

**4.** La délétion de la première base de GCA **décale tout le cadre de lecture**. L'ARNm devient :
$$\text{AUG · CAU · UCG · GUU · AA…}$$
Seul le premier codon est conservé. **Tous** les suivants sont différents, donc tous les acides aminés à partir du deuxième changent. La protéine obtenue n'a plus rien à voir avec la protéine normale et sera très probablement **non fonctionnelle**.
:::
:::

:::funnel Transcription et traduction
:::

### Résumé de la leçon

:::aretenir Pourquoi un intermédiaire
L&apos;**ADN** reste dans le **noyau**, les protéines se font dans le **cytoplasme** ⇒ il faut un messager : l&apos;**ARNm**.
:::

:::aretenir ADN vs ARNm — les 3 différences
| | ADN | ARNm |
| --- | --- | --- |
| Brins | **2** | **1** |
| Sucre | désoxyribose | **ribose** |
| Bases | A T G C | A **U** G C |
:::

:::aretenir La transcription
Dans le **noyau**, par l&apos;**ARN polymérase**, à partir du **brin transcrit**.
$$\mathrm{A \rightarrow U} \quad \mathrm{T \rightarrow A} \quad \mathrm{G \rightarrow C} \quad \mathrm{C \rightarrow G}$$
Puis l&apos;ARNm sort par les **pores nucléaires**.
:::

:::attention
Le **brin non transcrit** a la même séquence que l&apos;ARNm, avec des **T** à la place des **U**.
Jamais de **T** dans un ARNm.
:::

:::aretenir Les acteurs
**Ribosome** (2 sous-unités, protéines + ARNr) — lit l&apos;ARNm, forme les **liaisons peptidiques**.
**ARNt** — un site pour l&apos;**acide aminé**, un **anticodon** complémentaire du codon.
:::

:::aretenir Les 4 propriétés du code
**Par triplets** ($4^3 = 64$ codons) · **redondant** · **non ambigu** · **universel**.
**AUG** = initiateur (Met) · **UAA, UAG, UGA** = stop ⇒ **61 codons codants**.
:::

:::attention
**Redondant** (plusieurs codons → 1 acide aminé) ≠ **ambigu** (1 codon → plusieurs acides aminés, ce qui est **faux**).
On va de l&apos;ARNm à la protéine sans hésiter, mais **pas** l&apos;inverse.
:::

:::aretenir Les 3 étapes
**Initiation** — petite sous-unité sur **AUG**, ARNt-Met sur le site **P**, puis grande sous-unité.
**Élongation** — ARNt suivant sur le site **A**, **liaison peptidique**, libération du 1ᵉʳ ARNt, déplacement d&apos;un codon.
**Terminaison** — **codon stop**, dissociation, libération du polypeptide.
:::

:::aretenir La chaîne complète
$$\text{ADN} \rightarrow \text{ARNm} \rightarrow \text{protéine} \rightarrow \text{caractère}$$
:::

---

<!-- leçon 3 · cours -->

# Leçon — Le génie génétique

**Objectifs :** Définir le génie génétique et justifier sa possibilité par l'universalité du code
Analyser le transfert naturel de gènes par Agrobacterium tumefaciens
Nommer les trois outils du génie génétique et le rôle de chacun
Justifier l'emploi d'une même enzyme de restriction pour le gène et le vecteur
Ordonner les étapes d'une transgenèse
Décrire la production industrielle d'insuline humaine par transgenèse

## Le principe : la transformation génétique

:::definition Génie génétique
Le **génie génétique** est l'ensemble des techniques permettant de **transférer** un gène d'un organisme à un autre, et de le faire **exprimer** par l'organisme receveur.
:::

:::propriete Pourquoi c'est possible
Deux propriétés de l'information génétique rendent tout cela réalisable :
- l'**ADN a la même structure** chez tous les êtres vivants — un gène humain est chimiquement identique à un gène bactérien ;
- le **code génétique est universel** — une bactérie sait **lire** un gène humain et fabriquer la protéine correspondante.

Sans ces deux propriétés, aucun transfert ne donnerait de résultat.
:::

## Le modèle naturel : *Agrobacterium tumefaciens*

:::observation Un transfert de gènes qui existe dans la nature
*Agrobacterium tumefaciens* est une bactérie du sol qui provoque chez certaines plantes une tumeur, la **galle du collet**. On constate que les cellules de la tumeur contiennent un fragment d'ADN **bactérien**, intégré à leur propre ADN, et qu'elles fabriquent des substances qu'une cellule végétale normale ne produit pas.

**Interprétation.** La bactérie a **transféré** une partie de son ADN — porté par un **plasmide** — dans la cellule végétale, où il s'est **intégré** et s'**exprime**. C'est une **transformation génétique naturelle**, et c'est le modèle dont s'inspire tout le génie génétique.
:::

:::attention
Ce n'est pas une curiosité : le programme demande explicitement d'établir le principe de la transformation génétique **à partir de cet exemple naturel**, avant d'en déduire les techniques. Il faut donc savoir raconter *Agrobacterium* avant de parler d'insuline.
:::

## Les trois outils

:::definition Les enzymes de restriction
Les **enzymes de restriction** sont des « ciseaux moléculaires » : elles coupent l'ADN à des endroits **précis**, reconnaissables à une courte séquence de bases appelée **site de restriction**.

Une même enzyme coupe **toujours** au même site, ce qui permet de découper de façon reproductible.
:::

:::definition L'ADN ligase
L'**ADN ligase** est la « colle moléculaire » : elle **soude** deux fragments d'ADN en rétablissant la liaison entre nucléotides.
:::

:::definition Le plasmide
Un **plasmide** est un petit ADN **circulaire**, présent chez les bactéries indépendamment de leur chromosome, et capable de se **répliquer** seul. On l'utilise comme **vecteur** : c'est lui qui transporte le gène dans la cellule receveuse.
:::

[[fig:svt-transgenese]] Les outils du génie génétique

:::propriete Pourquoi les extrémités « collantes » sont décisives
Beaucoup d'enzymes de restriction coupent les deux brins **en décalé**, laissant à chaque extrémité un court fragment simple brin : ce sont les **extrémités cohésives** (ou collantes).

Si l'on coupe le gène **et** le plasmide avec **la même** enzyme, les extrémités obtenues sont **complémentaires** : elles s'apparient spontanément, et il ne reste plus qu'à les souder à la ligase. C'est pour cela qu'on utilise **la même enzyme des deux côtés** — une question qui tombe régulièrement.
:::

## Les étapes d'une transgenèse

:::methode Les cinq étapes, dans l'ordre
1. **Isoler** le gène d'intérêt, en le découpant à l'enzyme de restriction.
2. **Ouvrir** le plasmide avec **la même** enzyme.
3. **Insérer** le gène dans le plasmide et souder à l'**ADN ligase** → on obtient un **ADN recombiné**.
4. **Introduire** le plasmide recombiné dans la bactérie : elle est **transformée**, c'est un **OGM**.
5. **Cultiver** les bactéries transformées : elles se multiplient et **produisent la protéine** en grande quantité.
:::

:::definition ADN recombiné et OGM
Un **ADN recombiné** est une molécule d'ADN artificielle, formée de fragments d'**origines différentes**.

Un **OGM** — organisme génétiquement modifié — est un organisme dont le patrimoine génétique a été modifié par l'introduction d'un gène étranger. On parle aussi d'organisme **transgénique**.
:::

:::app Applique
On veut faire produire une hormone humaine par une bactérie.

**1.** Quelles sont les trois molécules-outils indispensables, et le rôle de chacune ?
**2.** Pourquoi faut-il utiliser la **même** enzyme de restriction pour le gène et pour le plasmide ?
**3.** Pourquoi la bactérie est-elle capable de fabriquer une hormone **humaine** ?
**4.** Que se passerait-il si l'on utilisait une ADN ligase sans avoir coupé le plasmide ?

:::solution
**1.**
- L'**enzyme de restriction** — couper l'ADN en des sites précis, pour isoler le gène et ouvrir le plasmide.
- L'**ADN ligase** — souder le gène dans le plasmide ouvert.
- Le **plasmide** — servir de **vecteur**, transporter le gène dans la bactérie et s'y répliquer.

**2.** Parce qu'une enzyme donnée produit toujours **les mêmes extrémités cohésives**. En coupant le gène et le plasmide avec la même enzyme, on obtient des extrémités **complémentaires** qui s'apparient spontanément. Avec deux enzymes différentes, les extrémités ne correspondraient pas et l'insertion serait impossible.

**3.** Parce que le **code génétique est universel**. La bactérie lit les codons du gène humain exactement comme elle lirait les siens, et assemble les mêmes acides aminés dans le même ordre : elle produit donc la **même** protéine.

**4.** Rien d'utile. Le plasmide étant resté **fermé**, il n'y a aucune ouverture où insérer le gène. La ligase, qui ne fait que souder, n'a rien à souder : on n'obtiendrait pas d'ADN recombiné.
:::
:::

## La production industrielle de l'insuline humaine

:::definition Le problème à résoudre
L'**insuline** est une hormone qui abaisse la glycémie. Les diabétiques de type 1 n'en produisent plus et doivent s'en injecter à vie.

Avant le génie génétique, on l'extrayait du **pancréas de porc ou de bœuf** : en très petite quantité, à un coût élevé, et avec des risques de **réactions immunitaires**, car l'insuline animale n'est pas exactement identique à l'insuline humaine.
:::

[[fig:svt-transgenese]] La production d'insuline humaine par transgenèse

:::propriete La solution
On introduit le **gène humain de l'insuline** dans une **bactérie**, à l'aide d'un plasmide. La bactérie transformée fabrique alors une insuline **strictement identique** à l'insuline humaine.

Cultivée en fermenteur, elle se multiplie très vite : on obtient des quantités industrielles, à bas coût, sans risque immunitaire.
:::

:::attention Les trois avantages à citer
1. L'insuline obtenue est **humaine**, donc **sans risque immunitaire**.
2. La production est **massive** — les bactéries se multiplient très rapidement.
3. Le coût est **bas** et l'approvisionnement **illimité**, sans dépendre d'abattoirs.
:::

## Les plantes transgéniques

:::propriete Les protéines insecticides
Certaines plantes sont modifiées pour porter un gène de la bactérie *Bacillus thuringiensis*, qui code une **protéine toxique** pour des insectes ravageurs. La plante fabrique alors elle-même son insecticide.

**Avantage** : moins de pesticides répandus dans l'environnement, et un meilleur rendement.
**Limites** : on craint l'apparition d'insectes **résistants**, des effets sur les insectes **non visés**, et la **dissémination** du transgène vers des plantes sauvages apparentées par le pollen.
:::

:::remarque Les autres applications
- **Médecine** — production d'hormone de croissance, de facteurs de coagulation, de vaccins.
- **Diagnostic** — détection de gènes responsables de maladies héréditaires.
- **Agronomie** — résistance à la sécheresse, aux herbicides, amélioration de la valeur nutritive.
:::

## Une question de société

:::propriete Le débat, honnêtement posé
Le programme demande de savoir **discuter** les applications, pas seulement de les décrire.

| Arguments favorables | Réserves exprimées |
| --- | --- |
| médicaments inaccessibles autrement | dissémination possible des transgènes |
| production massive et peu coûteuse | apparition de résistances chez les ravageurs |
| réduction des pesticides répandus | effets à long terme mal connus |
| rendements agricoles accrus | dépendance économique aux semenciers |
:::

:::attention
Une bonne réponse **argumente des deux côtés** et conclut sur la nécessité d'une **évaluation au cas par cas** et d'un **encadrement**. Un avis tranché, dans un sens ou dans l'autre, n'est pas ce qui est attendu.
:::

:::app Applique
Un laboratoire veut produire l'**hormone de croissance humaine** par transgenèse bactérienne.

**1.** Décris les étapes, en nommant les outils.
**2.** Pourquoi l'hormone obtenue est-elle préférable à une hormone extraite de cadavres humains, méthode employée autrefois ?
**3.** Cite deux limites que pose l'usage de plantes transgéniques en agriculture.

:::solution
**1.**
1. **Isoler** le gène humain de l'hormone de croissance à l'aide d'une **enzyme de restriction**.
2. **Ouvrir** un **plasmide** bactérien avec **la même** enzyme, pour obtenir des extrémités cohésives complémentaires.
3. **Insérer** le gène et **souder** à l'**ADN ligase** → **ADN recombiné**.
4. **Introduire** le plasmide dans des bactéries → bactéries **transformées**, OGM.
5. **Cultiver** en fermenteur et **purifier** l'hormone produite.

**2.** Pour trois raisons :
- l'hormone est produite en quantité **illimitée**, alors que l'extraction dépendait du nombre de donneurs ;
- elle est **pure** et exempte d'agents infectieux — l'extraction sur cadavres a effectivement transmis des maladies ;
- le **coût** est bien moindre.

**3.** Par exemple :
- la **dissémination du transgène** vers des plantes sauvages apparentées, par le pollen, avec des conséquences imprévisibles sur les écosystèmes ;
- l'apparition d'**insectes résistants** à la protéine insecticide, ce qui annulerait à terme le bénéfice, comme cela se produit avec les pesticides classiques.

*(On peut aussi citer les effets sur les insectes non ciblés, ou la dépendance des agriculteurs aux semenciers.)*
:::
:::

:::funnel Le génie génétique
:::

### Résumé de la leçon

:::aretenir Pourquoi ça marche
**Même structure d&apos;ADN** chez tous les êtres vivants **+ code génétique universel** ⇒ une bactérie sait lire un gène humain.
:::

:::aretenir Le modèle naturel
***Agrobacterium tumefaciens*** transfère naturellement un fragment de son **plasmide** dans une cellule végétale, où il s&apos;**intègre** et s&apos;**exprime** (galle du collet).
:::

:::aretenir Les trois outils
| Outil | Rôle |
| --- | --- |
| **Enzyme de restriction** | **couper** en des sites précis |
| **ADN ligase** | **souder** |
| **Plasmide** | **vecteur**, transporte et se réplique |
:::

:::attention
On utilise la **même** enzyme pour le gène et le plasmide : elle donne des **extrémités cohésives complémentaires** qui s&apos;apparient spontanément.
:::

:::aretenir Les 5 étapes
isoler → ouvrir le plasmide → **insérer + liguer** (ADN **recombiné**) → introduire dans la bactérie (**OGM**) → cultiver et récolter la protéine.
:::

:::aretenir L'insuline — les 3 avantages
Insuline **humaine** (pas de risque immunitaire) · production **massive** · coût **bas** et illimité.
Avant : extraction sur pancréas de **porc ou de bœuf**, rare, chère, immunogène.
:::

:::aretenir Les plantes transgéniques
Gène de ***Bacillus thuringiensis*** ⇒ protéine **insecticide** produite par la plante.
**Avantage** : moins de pesticides. **Limites** : résistances, insectes non visés, **dissémination** du transgène.
:::

:::aretenir Les autres applications
Médecine (hormone de croissance, vaccins, facteurs de coagulation) · **diagnostic** de maladies héréditaires · agronomie (sécheresse, herbicides).
:::

:::attention
Sur le débat OGM, on attend une argumentation **des deux côtés** et une conclusion nuancée — pas un avis tranché.
:::

---

<!-- leçon 50 · cours -->

# Leçon — Méthodes & exercices types — ADN, expression et génie génétique

**Objectifs :** Appliquer les règles de Chargaff pour calculer une composition en bases
Distinguer paires de bases et nucléotides dans un calcul
Écrire le brin complémentaire d'une séquence en respectant l'antiparallélisme
Exploiter une expérience de transformation enzymatique
Prévoir la proportion d'ADN hybride à une génération donnée
Convertir une séquence entre brin transcrit, brin non transcrit, ARNm, anticodons et protéine

## Méthode 1 — Les calculs de composition

:::methode Les relations de Chargaff, à manipuler sans hésiter
Pour un ADN **double brin** de $N$ nucléotides au total :
$$A = T \qquad G = C \qquad A + T + G + C = N$$
d'où, si l'on connaît $A$ :
$$G = C = \frac{N - 2A}{2}$$
Et pour les liaisons hydrogène :
$$n(\text{liaisons}) = 2 \times n(\text{paires A–T}) + 3 \times n(\text{paires G–C})$$
:::

:::attention Nucléotides ou paires de bases ?
Un ADN de $1\,000$ **paires de bases** contient $2\,000$ **nucléotides**. Lis toujours l'énoncé deux fois : la moitié des erreurs de ce type de question vient de là.
:::

:::attention Les règles de Chargaff ne valent que pour un ADN double brin
Sur un **seul brin**, ou sur de l'**ARN**, il n'y a aucune raison d'avoir $A = T$. Un énoncé qui donne $A \neq T$ te dit implicitement que la molécule est **simple brin**.
:::

:::exemple Calcul type
Un ADN double brin contient $30\ \%$ d'adénine. Quelles sont les proportions des trois autres bases ?

$$T = A = 30\ \%$$
$$G + C = 100 - 30 - 30 = 40\ \% \qquad\Longrightarrow\qquad G = C = 20\ \%$$
:::

## Méthode 2 — Écrire un brin complémentaire

:::methode La règle
On remplace chaque base par sa complémentaire : **A ↔ T**, **G ↔ C**. Et l'on n'oublie pas que les brins sont **antiparallèles** : si le brin donné va de $5'$ vers $3'$, le brin complémentaire s'écrit de $3'$ vers $5'$.
:::

:::exemple
Brin matrice : $5'$ — **A T G C C T A G** — $3'$
Brin complémentaire : $3'$ — **T A C G G A T C** — $5'$
:::

:::attention
Dans l'ADN, jamais d'**uracile** : c'est T. L'uracile n'apparaît que dans l'**ARN**, au chapitre suivant.
:::

## Méthode 3 — Exploiter une expérience de transformation

:::methode Le raisonnement « on détruit, on observe »
1. Repérer ce que chaque **enzyme** détruit : protéase → protéines ; ribonucléase → ARN ; ADNase → ADN.
2. Noter dans **quel** cas la transformation **disparaît**.
3. Conclure : la molécule détruite dans ce cas-là est celle qui portait l'information.
4. Noter que dans les **autres** cas la transformation persiste : cela **élimine** les autres molécules.
:::

:::attention
Une réponse complète cite **les deux faces** : ce qui a disparu **et** ce qui a persisté. Dire seulement « l'ADNase empêche la transformation donc c'est l'ADN » laisse la moitié des points.
:::

## Méthode 4 — Exploiter Meselson et Stahl et généraliser

:::methode Prévoir la composition à la génération n
En partant d'une molécule **entièrement lourde** placée sur milieu léger :
- le nombre total de molécules vaut $2^n$ ;
- le nombre de molécules **hybrides** reste **constant et égal à $2$** (les deux brins lourds initiaux, chacun dans une molécule différente) ;
- toutes les autres sont **légères**.

$$\%\,\text{hybride} = \frac{2}{2^n} \times 100 \qquad \%\,\text{léger} = \left(1 - \frac{2}{2^n}\right) \times 100$$
:::

:::exemple Le tableau à savoir reconstruire
| Génération | Molécules | Hybrides | Légères | % hybride |
| --- | --- | --- | --- | --- |
| $0$ | $1$ | $0$ (toute lourde) | $0$ | — |
| $1$ | $2$ | $2$ | $0$ | $100\ \%$ |
| $2$ | $4$ | $2$ | $2$ | $50\ \%$ |
| $3$ | $8$ | $2$ | $6$ | $25\ \%$ |
| $4$ | $16$ | $2$ | $14$ | $12{,}5\ \%$ |
:::

:::attention
Il n'y a **jamais** d'ADN purement **lourd** après la première génération : chaque brin lourd reste associé à un brin neuf, donc dans une molécule **hybride**. C'est exactement ce qui réfute le modèle conservatif.
:::

## Méthode 5 — Lire une courbe Q(ADN)

:::methode Ce que chaque portion signifie
| Sur la courbe | Phase | Chromosomes |
| --- | --- | --- |
| plateau à $Q$ | $\mathrm{G_1}$ | $2n$, à **1** chromatide |
| montée de $Q$ à $2Q$ | **S** | $2n$, passage à **2** chromatides |
| plateau à $2Q$ | $\mathrm{G_2}$ | $2n$, à **2** chromatides |
| chute de $2Q$ à $Q$ | **mitose** | séparation des chromatides, retour à **1** |
:::

:::app Exercice de synthèse
Un ADN double brin de $4\,000$ paires de bases contient $2\,400$ adénines.

**1.** Combien de nucléotides au total ? Combien de thymines, guanines, cytosines ?
**2.** Combien de liaisons hydrogène ?
**3.** Cet ADN est répliqué en milieu marqué. Combien de nucléotides libres sont consommés ?
**4.** Une cellule contenant cet ADN passe de $\mathrm{G_1}$ à $\mathrm{G_2}$. Qu'advient-il de sa quantité d'ADN et de son nombre de chromosomes ?

:::solution
**1.** $4\,000$ paires de bases, donc
$$N = 2 \times 4\,000 = 8\,000\ \text{nucléotides}$$
$$T = A = 2\,400$$
$$G + C = 8\,000 - 2\,400 - 2\,400 = 3\,200 \qquad\Longrightarrow\qquad G = C = 1\,600$$

**2.** Il y a $2\,400$ paires A–T et $1\,600$ paires G–C :
$$2\,400 \times 2 + 1\,600 \times 3 = 4\,800 + 4\,800 = 9\,600\ \text{liaisons hydrogène}$$

**3.** La réplication fabrique **deux brins neufs**, de $4\,000$ nucléotides chacun :
$$2 \times 4\,000 = 8\,000\ \text{nucléotides libres}$$
(Autrement dit, autant que la molécule entière en contient.)

**4.** La quantité d'ADN **double**, passant de $Q$ à $2Q$, puisque la phase S est traversée. Le **nombre de chromosomes ne change pas** : chaque chromosome passe simplement de **une** à **deux chromatides**.
:::
:::

## Méthode 1 — Naviguer entre ADN, ARNm, anticodons et protéine

:::methode Le tableau de conversion, à poser systématiquement
Devant toute séquence, construis ce tableau à cinq lignes :

| Ligne | Contenu |
| --- | --- |
| **Brin transcrit** | celui qui est lu |
| **Brin non transcrit** | = ARNm, avec T au lieu de U |
| **ARNm** | complémentaire du brin transcrit |
| **Anticodons** | complémentaires des codons |
| **Protéine** | par le code génétique |
:::

:::propriete Les règles, dans les deux sens
$$\text{ADN} \rightarrow \text{ARNm} : \quad \mathrm{A \rightarrow U},\ \mathrm{T \rightarrow A},\ \mathrm{G \rightarrow C},\ \mathrm{C \rightarrow G}$$
$$\text{ARNm} \rightarrow \text{anticodon} : \quad \mathrm{A \rightarrow U},\ \mathrm{U \rightarrow A},\ \mathrm{G \rightarrow C},\ \mathrm{C \rightarrow G}$$
:::

:::attention Les trois pièges
1. **Pas de T dans l'ARNm**, pas de U dans l'ADN.
2. L'**anticodon** est complémentaire du **codon**, donc **identique au brin transcrit** sur ce triplet (en remplaçant T par U). On peut l'utiliser pour vérifier son tableau.
3. Toujours découper en **triplets à partir du AUG**, jamais à partir du début de la séquence donnée.
:::

## Méthode 2 — Compter

:::methode Les relations à connaître
Pour un gène codant une protéine de $n$ acides aminés :
$$n(\text{codons codants}) = n \qquad n(\text{nucléotides de l'ARNm}) = 3n + 3$$
(le $+3$ pour le codon **stop**)
$$n(\text{paires de bases du gène}) = 3n + 3 \qquad n(\text{nucléotides du gène}) = 2\,(3n + 3)$$
$$n(\text{ARNt intervenus}) = n \qquad n(\text{liaisons peptidiques}) = n - 1$$
:::

:::attention
Le nombre de **liaisons peptidiques** est $n - 1$, pas $n$ : pour relier $n$ maillons, il faut $n - 1$ liens. C'est une question qui tombe souvent et qui se perd bêtement.
:::

:::exemple Calcul type
Une protéine compte $150$ acides aminés.
- Codons codants : $150$.
- Nucléotides de l'ARNm : $3 \times 150 + 3 = 453$.
- Paires de bases du gène : $453$, soit $2 \times 453 = 906$ nucléotides.
- ARNt intervenus : $150$.
- Liaisons peptidiques : $150 - 1 = 149$.
:::

## Méthode 3 — Analyser l'effet d'une mutation

:::methode Le raisonnement en quatre temps
1. **Identifier le type** : substitution, délétion ou addition.
2. **Réécrire** la séquence mutée en triplets, **en repartant du AUG**.
3. **Comparer** codon par codon avec la séquence normale.
4. **Conclure** sur la protéine, en choisissant le bon nom :
:::

:::propriete Les issues possibles d'une mutation ponctuelle
| Mutation | Effet sur la protéine | Nom |
| --- | --- | --- |
| **substitution** — le nouveau codon code le **même** acide aminé | **aucun** changement | mutation **silencieuse** |
| **substitution** — il code un **autre** acide aminé | **un** acide aminé changé | mutation **faux-sens** |
| **substitution** — il devient un **codon stop** | protéine **raccourcie** | mutation **non-sens** |
| **délétion** ou **addition** | **tout** change en aval | **décalage du cadre de lecture** |
:::

:::attention
Un décalage du cadre de lecture peut aussi faire apparaître un **codon stop prématuré**, et donc raccourcir brutalement la protéine. Pense toujours à relire la séquence mutée jusqu'au bout : un stop peut surgir là où on ne l'attend pas.
:::

## Méthode 4 — Relier une mutation à un phénotype

:::methode La chaîne d'explication complète
C'est **la** rédaction attendue en fin d'exercice, et il ne faut sauter aucun maillon :
$$\text{mutation de l'ADN} \rightarrow \text{ARNm modifié} \rightarrow \text{protéine modifiée} \rightarrow \text{fonction modifiée} \rightarrow \text{caractère modifié}$$
:::

:::exemple L'exemple type — la drépanocytose
Une **substitution** dans le gène de la $\beta$-globine remplace un codon **GAG** par **GUG**. L'acide aminé passe de l'**acide glutamique** à la **valine**. L'hémoglobine modifiée (HbS) **précipite** en fibres quand l'oxygène manque, ce qui déforme le globule rouge en **faucille**. Le globule rouge devient fragile et bouche les capillaires : c'est la **drépanocytose**.

Une seule base changée sur des milliers, et tout le phénotype bascule : cet exemple illustre à lui seul toute la chaîne.
:::

:::app Exercice de synthèse
Fragment du **brin non transcrit** d'un gène :
$$\text{A T G  A A A  C C T  G G A  T A A}$$
Code génétique : AUG = Met · AAA = Lys · CCU = Pro · GGA = Gly · UAA = STOP · UAA/UAG/UGA = STOP · AAG = Lys.

**1.** Écris l'ARNm et la protéine normale.
**2.** Une substitution change le troisième A du deuxième triplet en G. Quel est l'effet ? Comment nommes-tu cette mutation ?
**3.** Combien de liaisons peptidiques dans la protéine normale ?
**4.** Combien de nucléotides compte ce fragment de gène ?

:::solution
**1.** Le brin **non transcrit** a la même séquence que l'ARNm, avec T au lieu de U. Il suffit donc de remplacer les T par des U :
$$\text{AUG · AAA · CCU · GGA · UAA}$$
Lecture jusqu'au stop :
$$\text{Met — Lys — Pro — Gly}$$
soit **4 acides aminés**.

**2.** Le deuxième triplet **AAA** devient **AAG**. Or AAG code aussi la **lysine** : l'acide aminé est **inchangé**, et la protéine est strictement **identique**. C'est une mutation **silencieuse**, rendue possible par la **redondance** du code génétique.

**3.** Pour relier $4$ acides aminés :
$$4 - 1 = 3\ \text{liaisons peptidiques}$$

**4.** Le fragment compte $15$ paires de bases (5 triplets), donc
$$2 \times 15 = 30\ \text{nucléotides}$$
:::
:::

## Méthode 1 — Exploiter une carte de restriction

:::methode Lire une carte
Une **carte de restriction** indique, sur un fragment d'ADN, la position des **sites** reconnus par chaque enzyme.
1. **Repérer** les sites de l'enzyme utilisée.
2. **Compter** : $n$ sites sur un ADN **linéaire** donnent $n + 1$ fragments ; sur un ADN **circulaire** (plasmide), ils en donnent $n$.
3. **Calculer** la taille de chaque fragment par différence entre les positions.
:::

:::attention La différence linéaire / circulaire
C'est la source d'erreur numéro un de ce chapitre. Sur un cercle, **un seul** site ne donne pas deux morceaux : il **ouvre** le cercle et donne **un** fragment linéaire. Sur une droite, un site donne bien **deux** morceaux.
:::

:::exemple Calcul type
Un plasmide **circulaire** de $5\,000$ paires de bases porte trois sites pour une enzyme, aux positions $500$, $2\,000$ et $3\,500$.

Nombre de fragments : $3$ sites sur un cercle → **3 fragments**.

Tailles :
$$2\,000 - 500 = 1\,500 \qquad 3\,500 - 2\,000 = 1\,500$$
$$(5\,000 - 3\,500) + 500 = 2\,000$$
Vérification : $1\,500 + 1\,500 + 2\,000 = 5\,000$ ✔
:::

## Méthode 2 — Justifier chaque étape d'un protocole

:::methode Les questions qui tombent, et leurs réponses
| Question | Réponse attendue |
| --- | --- |
| Pourquoi la **même** enzyme des deux côtés ? | pour obtenir des **extrémités cohésives complémentaires** |
| Pourquoi une **ligase** ? | pour **souder** le gène au plasmide et fermer l'ADN recombiné |
| Pourquoi un **plasmide** ? | c'est un **vecteur** : il entre dans la bactérie et s'y **réplique** |
| Pourquoi une **bactérie** ? | elle se **multiplie vite** et sait lire le gène grâce à l'**universalité du code** |
| Pourquoi la protéine est-elle **identique** à l'humaine ? | même gène + **code universel** ⇒ même séquence d'acides aminés |
:::

:::attention
On ne demande presque jamais de **réciter** le protocole, mais de **justifier** une étape. Apprends les réponses de la colonne de droite, pas la liste des étapes.
:::

## Méthode 3 — Lire une électrophorèse

:::definition Électrophorèse
L'**électrophorèse** sépare des fragments d'ADN selon leur **taille**. Déposés dans des puits, ils migrent dans un gel sous l'effet d'un champ électrique : l'ADN étant chargé **négativement**, il migre vers l'**anode** (pôle +).
:::

[[fig:svt-electrophorese]] Principe de l'électrophorèse

:::propriete La règle de lecture
Les **petits** fragments migrent **vite** et **loin** ; les **gros** migrent **lentement** et restent **près du puits**.

La distance de migration est donc d'autant plus **grande** que le fragment est **petit** — mais la relation n'est pas proportionnelle : la taille exacte d'un fragment s'obtient toujours par **comparaison avec un marqueur de taille**, jamais par un calcul direct.
:::

:::methode Exploiter un gel
1. **Compter** les bandes de chaque piste : cela donne le nombre de fragments.
2. **Comparer** aux tailles d'un **marqueur de taille** déposé en parallèle.
3. **Comparer les pistes entre elles** : deux pistes identiques = mêmes fragments = mêmes ADN.
4. **Conclure** selon la question posée : identification, comparaison de séquences, recherche d'un allèle muté.
:::

:::attention
Une bande **plus basse** sur le gel signifie un fragment **plus petit**, pas « moins d'ADN ». L'**intensité** d'une bande renseigne sur la **quantité**, sa **position** sur la **taille**. Ne pas confondre les deux.
:::

## Méthode 4 — Détecter un allèle muté

:::methode Le principe
Si une mutation **crée** ou **supprime** un site de restriction, le découpage de l'allèle muté ne donne pas les mêmes fragments que celui de l'allèle normal. Le **profil** sur le gel change.
- Mutation qui **supprime** un site → **moins** de fragments, dont un **plus grand**.
- Mutation qui **crée** un site → **plus** de fragments, dont deux **plus petits**.

En comparant le profil d'un individu à ceux d'un individu sain et d'un individu malade, on établit son **génotype**.
:::

:::app Exercice de synthèse
Un gène de $3\,000$ paires de bases existe en deux allèles. L'enzyme utilisée coupe l'allèle **normal** en deux sites, aux positions $1\,000$ et $2\,200$. Chez l'allèle **muté**, le site situé en $2\,200$ a **disparu**.

On réalise l'électrophorèse de trois individus : A, B et C.

| Individu | Bandes observées (en paires de bases) |
| --- | --- |
| A | $1\,000$ · $1\,200$ · $800$ |
| B | $1\,000$ · $2\,000$ |
| C | $1\,000$ · $1\,200$ · $800$ · $2\,000$ |

**1.** Quels fragments donne l'allèle normal ? l'allèle muté ?
**2.** Détermine le génotype de A, B et C.
**3.** Sur le gel, quelle bande a le moins migré ? Justifie.

:::solution
**1.** L'ADN est **linéaire**, donc $n$ sites donnent $n+1$ fragments.

**Allèle normal** — deux sites, donc **trois** fragments :
$$1\,000 \qquad 2\,200 - 1\,000 = 1\,200 \qquad 3\,000 - 2\,200 = 800$$

**Allèle muté** — le site en $2\,200$ a disparu, il ne reste qu'un site en $1\,000$, donc **deux** fragments :
$$1\,000 \qquad 3\,000 - 1\,000 = 2\,000$$

**2.**
- **A** présente exactement les trois bandes de l'allèle normal, et pas la bande $2\,000$ : il est **homozygote normal**.
- **B** présente les deux bandes de l'allèle muté seulement : il est **homozygote muté**.
- **C** présente **toutes** les bandes des deux allèles : il est **hétérozygote**, porteur d'un allèle de chaque type.

**3.** La bande de **$2\,000$ paires de bases**, celle de l'allèle muté. C'est le **plus gros** fragment de tous, et la distance de migration est d'autant plus faible que le fragment est **grand** : il reste donc le plus près du puits.
:::
:::

:::funnel Méthodes et exercices types de l'information génétique
:::

### Résumé de la leçon

:::aretenir Les calculs de composition
$$A = T \quad ; \quad G = C \quad ; \quad G = C = \frac{N - 2A}{2}$$
$$n(\text{liaisons H}) = 2\,n_{A\text{–}T} + 3\,n_{G\text{–}C}$$
**1 paire de bases = 2 nucléotides.**
:::

:::attention
Chargaff ne vaut que pour l&apos;ADN **double brin**. $A \neq T$ ⇒ molécule **simple brin**.
Dans l&apos;ADN : **jamais d&apos;uracile**.
:::

:::aretenir Meselson — la formule
$$\%\,\text{hybride} = \frac{2}{2^n}\times 100$$
$100\ \%$, $50\ \%$, $25\ \%$, $12{,}5\ \%$… et **jamais** d&apos;ADN purement lourd après la 1ʳᵉ génération.
:::

:::aretenir Lire Q(ADN)
| Portion | Phase | Chromatides |
| --- | --- | --- |
| plateau $Q$ | G₁ | 1 |
| montée $Q \to 2Q$ | **S** | 1 → 2 |
| plateau $2Q$ | G₂ | 2 |
| chute $2Q \to Q$ | **mitose** | 2 → 1 |
:::

:::aretenir Transformation
Citer **les deux faces** : l&apos;enzyme qui **supprime** la transformation désigne la molécule ; celles qui ne la suppriment **pas** éliminent les autres.
:::

:::aretenir Les deux conversions
$$\text{ADN} \rightarrow \text{ARNm} : \mathrm{A \rightarrow U},\ \mathrm{T \rightarrow A},\ \mathrm{G \rightarrow C},\ \mathrm{C \rightarrow G}$$
$$\text{codon} \rightarrow \text{anticodon} : \mathrm{A \rightarrow U},\ \mathrm{U \rightarrow A},\ \mathrm{G \rightarrow C},\ \mathrm{C \rightarrow G}$$
Le **brin non transcrit** = l&apos;ARNm avec des T. L&apos;**anticodon** = le brin transcrit avec des U.
:::

:::aretenir Les comptages
Pour $n$ acides aminés :
$$\text{ARNm} = 3n + 3 \text{ nucléotides} \quad ; \quad \text{gène} = 2(3n+3) \text{ nucléotides}$$
$$n\ \text{ARNt} \quad ; \quad \boxed{n - 1}\ \text{liaisons peptidiques}$$
:::

:::aretenir Les issues d'une mutation ponctuelle
| Mutation | Effet |
| --- | --- |
| **substitution** silencieuse | même acide aminé (redondance) |
| **substitution** faux-sens | un acide aminé changé |
| **substitution** non-sens | stop prématuré, protéine **raccourcie** |
| **délétion / addition** | **décalage**, tout change en aval |
:::

:::aretenir La chaîne d'explication
$$\text{mutation} \rightarrow \text{ARNm} \rightarrow \text{protéine} \rightarrow \text{fonction} \rightarrow \text{caractère}$$
Exemple type : **drépanocytose** (GAG → GUG, glutamique → valine).
:::

:::attention
Découper en triplets **à partir du AUG**, jamais du début de la séquence donnée.
:::

:::aretenir Compter les fragments
ADN **linéaire** : $n$ sites ⇒ $n + 1$ fragments.
ADN **circulaire** (plasmide) : $n$ sites ⇒ $n$ fragments.
:::

:::aretenir Électrophorèse
L&apos;ADN est **négatif** ⇒ il migre vers l&apos;**anode (+)**.
**Petit fragment ⇒ migre loin.** Gros fragment ⇒ reste près du puits.
**Position** = taille · **intensité** = quantité.
:::

:::aretenir Détecter un allèle muté
Site **supprimé** ⇒ **moins** de fragments, un plus **grand**.
Site **créé** ⇒ **plus** de fragments, deux plus **petits**.
Toutes les bandes des deux allèles ⇒ **hétérozygote**.
:::

:::aretenir Les justifications à connaître
Même enzyme ⇒ **extrémités cohésives complémentaires** · ligase ⇒ **souder** · plasmide ⇒ **vecteur réplicatif** · bactérie ⇒ **multiplication rapide** + **code universel**.
:::

---

<!-- leçon 51 · cours -->

# Leçon — Approfondissement — mutations, universalité du code et empreinte génétique

**Objectifs :** Expliquer la reproduction conforme par l'enchaînement réplication-mitose
Définir une mutation et distinguer substitution, délétion et addition
Justifier la plus grande gravité d'une délétion ou d'une addition
Distinguer mutation somatique et mutation germinale
Distinguer gène, allèle et caractère et énoncer la relation gène-protéine-caractère
Expliquer la relation gène-protéine-caractère et le rôle d'un allèle

## La reproduction conforme

:::definition Reproduction conforme
La **reproduction conforme** est la production, à partir d'une cellule mère, de deux cellules filles génétiquement **identiques** entre elles et identiques à la mère. Elle repose sur l'enchaînement de deux événements : la **réplication** de l'ADN en phase S, puis sa **répartition égale** lors de la **mitose**.
:::

[[fig:svt-mitose]] La mitose, division conforme

:::propriete Pourquoi les deux étapes sont indispensables
- La **réplication** garantit que chaque chromosome possède **deux chromatides identiques**. C'est la **complémentarité des bases** qui assure cette identité.
- La **mitose** sépare ces deux chromatides et en envoie **une dans chaque** cellule fille.

Enlève l'une des deux : sans réplication, les cellules filles n'auraient que la moitié de l'information ; sans mitose ordonnée, la répartition serait aléatoire.
:::

:::remarque Le clone
L'ensemble des cellules issues d'une même cellule par mitoses successives forme un **clone** : toutes portent la **même** information génétique. C'est le fondement de la croissance d'un organisme pluricellulaire — toutes tes cellules descendent d'une seule cellule-œuf.
:::

## Les mutations : quand la copie n'est pas conforme

:::definition Mutation
Une **mutation** est une modification **accidentelle** et **héréditaire** de la séquence de nucléotides de l'ADN.
:::

:::propriete Les trois types ponctuels
| Type | Ce qui se passe | Effet sur la séquence |
| --- | --- | --- |
| **Substitution** | un nucléotide est remplacé par un autre | un seul codon modifié |
| **Délétion** | un nucléotide est **perdu** | **décalage** de tout le cadre de lecture |
| **Addition** (insertion) | un nucléotide est **ajouté** | **décalage** de tout le cadre de lecture |
:::

:::attention La hiérarchie de gravité
Une **substitution** ne touche qu'**un** codon : la protéine change au plus d'un acide aminé, et parfois de rien du tout. Une **délétion** ou une **addition** **décale le cadre de lecture** : tous les codons situés en aval sont modifiés, et la protéine est généralement complètement différente, souvent non fonctionnelle. Ce raisonnement est systématiquement attendu.
:::

:::remarque L'origine des mutations
Elles surviennent surtout lors des **erreurs de réplication**, et leur fréquence est augmentée par des **agents mutagènes** : rayons UV, rayons X, substances chimiques. La cellule possède des systèmes de **réparation**, mais ils ne sont pas parfaits.
:::

:::propriete Mutation somatique ou germinale
- Dans une cellule **somatique** (du corps) : la mutation n'affecte que le clone issu de cette cellule, elle **n'est pas transmise** à la descendance.
- Dans une cellule **germinale** (à l'origine des gamètes) : elle est **transmise** à la descendance et devient une source de **diversité génétique**.
:::

## Gène, allèle, caractère

:::definition Les trois notions à distinguer
- Un **gène** est une portion d'ADN qui porte l'information nécessaire à un caractère.
- Un **allèle** est une **version** d'un gène, née d'une mutation. Un même gène peut exister en plusieurs allèles.
- Un **caractère** est la manifestation observable.
:::

:::remarque Le lien de cause à effet
$$\text{gène} \longrightarrow \text{protéine} \longrightarrow \text{caractère}$$
Un allèle différent donne une protéine différente, donc un caractère différent. Cette chaîne est la clé de tout le chapitre suivant.
:::

## Le paradoxe du niveau de condensation

:::propriete Condenser pour ranger, décondenser pour lire
L'ADN d'une seule cellule humaine mesurerait environ **2 mètres** mis bout à bout, pour un noyau de quelques micromètres. D'où la nécessité d'une condensation extrême.

Mais un ADN **trop condensé** ne peut être ni **lu** ni **répliqué** : les enzymes n'y ont pas accès. D'où l'alternance :
- **interphase** — ADN décondensé en **chromatine** : il peut être **transcrit** et **répliqué** ;
- **division** — ADN condensé en **chromosomes** : il peut être **déplacé et réparti** sans s'emmêler.

Chaque état sert une fonction, et la cellule passe de l'un à l'autre selon ce qu'elle doit faire.
:::

:::attention
« Pourquoi les chromosomes ne sont-ils visibles que pendant la division ? » La réponse n'est pas « ils n'existent pas le reste du temps », mais « ils sont **décondensés** en chromatine, donc invisibles au microscope optique ».
:::

:::app Applique
Soit le brin non transcrit d'un fragment de gène :
$$5'\;\text{— A T G  C C A  G T T  A A G —}\;3'$$

**1.** Écris le brin complémentaire.
**2.** Une substitution remplace la première base du **troisième** triplet (un **G**) par un **C**. Combien de triplets sont modifiés ?
**3.** Une délétion supprime la première **C** du deuxième triplet. Réécris la séquence en triplets et compte les triplets modifiés.
**4.** Laquelle des deux mutations est la plus grave ? Justifie.

:::solution
**1.** Par complémentarité A↔T et G↔C, et en respectant l'antiparallélisme :
$$3'\;\text{— T A C  G G T  C A A  T T C —}\;5'$$

**2.** Les triplets sont **ATG · CCA · GTT · AAG**. Le troisième, **GTT**, devient **CTT** :
$$\text{ATG · CCA · CTT · AAG}$$
**Un seul triplet** est modifié. Tous les autres sont intacts, car une substitution ne change qu&apos;une base **à sa place**, sans rien décaler.

**3.** On supprime la première C de **CCA**. La séquence devient, d'un seul tenant :
$$\text{ATG · CAG · TTA · AG…}$$
Le premier triplet **ATG** est inchangé, mais **tous les suivants** sont modifiés : $\text{CCA} \to \text{CAG}$, $\text{GTT} \to \text{TTA}$, et ainsi de suite jusqu'au bout du gène.

**4.** La **délétion**, de très loin. La substitution ne change **qu'un** triplet, donc au plus **un** acide aminé de la protéine. La délétion **décale le cadre de lecture** : tous les triplets en aval sont modifiés, la protéine obtenue est entièrement différente à partir du point de mutation, et elle est presque toujours **non fonctionnelle**.
:::
:::

## Relation gène-protéine, relation gène-caractère

:::propriete La chaîne causale
$$\text{gène} \longrightarrow \text{ARNm} \longrightarrow \text{protéine} \longrightarrow \text{caractère}$$
Un gène ne « fabrique » pas un caractère : il commande la synthèse d'une **protéine**, et c'est cette protéine — souvent une **enzyme** — qui réalise la fonction dont dépend le caractère.
:::

:::remarque Pourquoi un allèle change le caractère
Un **allèle** diffère d'un autre par sa **séquence de nucléotides**. Il donne donc un ARNm différent, donc une protéine de **séquence différente**, donc de **forme** différente — et la forme d'une protéine détermine sa fonction. Une protéine mal repliée ne remplit plus son rôle : le caractère change.
:::

:::attention
« Le gène de la couleur des yeux » est un raccourci commode mais faux si on le prend au pied de la lettre. Le gène code une **enzyme** de la chaîne de synthèse d'un **pigment** ; c'est la quantité et le type de pigment produits qui donnent la couleur.
:::

## L'universalité du code et ses conséquences

:::propriete Ce que l'universalité rend possible
Le code génétique étant pratiquement **le même** chez tous les êtres vivants, une bactérie sait **lire** un gène humain et fabriquer la protéine correspondante. C'est exactement le fondement du **génie génétique** — et le sujet du chapitre suivant.
:::

:::remarque L'universalité est aussi un argument d'évolution
Si toutes les espèces, de la bactérie à l'homme, utilisent le **même** code, c'est vraisemblablement qu'elles l'ont **hérité d'un ancêtre commun**. L'universalité du code génétique est l'un des arguments les plus forts en faveur de l'**unité du monde vivant**.
:::

## La spécificité cellulaire : toutes les cellules, tous les gènes

:::propriete Le paradoxe et sa résolution
Toutes les cellules d'un organisme possèdent **le même ADN**, donc **tous** les gènes. Pourtant une cellule musculaire ne ressemble pas à un neurone.

La raison : dans une cellule donnée, seule une **partie** des gènes est **transcrite**. Les autres restent silencieux. C'est l'**expression sélective** des gènes qui fait la spécialisation cellulaire.
:::

:::remarque Un exemple simple
Le gène de l'**hémoglobine** est présent dans **toutes** tes cellules — y compris dans tes neurones et tes cellules de peau. Mais il n'est **transcrit** que dans les cellules précurseurs des globules rouges. Partout ailleurs, il est présent mais **non exprimé**.
:::

## Chez les procaryotes : tout au même endroit

:::propriete Une différence majeure avec les eucaryotes
| | Eucaryotes | Procaryotes |
| --- | --- | --- |
| Noyau | **oui** | **non** |
| Lieu de la transcription | **noyau** | cytoplasme |
| Lieu de la traduction | **cytoplasme** | cytoplasme |
| Enchaînement | transcription, **migration**, puis traduction | transcription et traduction **simultanées** |
:::

:::remarque Pourquoi c'est possible
Sans enveloppe nucléaire, rien ne sépare l'ADN des ribosomes. Ceux-ci peuvent donc commencer à **traduire** l'ARNm alors que l'**ARN polymérase** est encore en train de le **transcrire**. On observe au microscope électronique des ARNm en cours de synthèse déjà couverts de ribosomes.
:::

## Le polysome

:::definition Polysome
Un **polysome** est un ensemble de **plusieurs ribosomes** traduisant **simultanément** le **même** ARNm, décalés les uns par rapport aux autres.
:::

:::remarque L'intérêt et la lecture d'un document
Le polysome permet de fabriquer **beaucoup** de copies de la même protéine à partir d'un **seul** ARNm, donc très rapidement.

Sur une photographie, les chaînes polypeptidiques attachées aux ribosomes sont de **longueur croissante** : cela indique le **sens de lecture** de l'ARNm, du ribosome à chaîne la plus courte vers celui à chaîne la plus longue. C'est le même raisonnement que pour lire le sens d'une transcription.
:::

:::app Applique
On étudie une protéine enzymatique de $99$ acides aminés, chez une bactérie.

**1.** Combien de nucléotides compte l'ARNm correspondant ? Et le gène ?
**2.** Combien de liaisons peptidiques dans cette protéine ?
**3.** Un individu porte un allèle muté : son enzyme compte $40$ acides aminés et est non fonctionnelle. Propose une explication.
**4.** Pourquoi peut-on, chez cette bactérie, observer des ribosomes sur un ARNm en cours de transcription ?

:::solution
**1.** ARNm :
$$3 \times 99 + 3 = 300\ \text{nucléotides}$$
Le gène est double brin, avec $300$ paires de bases :
$$2 \times 300 = 600\ \text{nucléotides}$$

**2.** $$99 - 1 = 98\ \text{liaisons peptidiques}$$

**3.** Une mutation a fait apparaître un **codon stop prématuré**, au niveau du $41^\text{e}$ codon. La traduction s'arrête donc là, et la protéine obtenue est **tronquée** : $40$ acides aminés au lieu de $99$. Amputée de près de $60\ \%$ de sa séquence, elle ne peut plus adopter la forme correcte et perd sa fonction.

Deux mutations peuvent produire ce résultat : une **mutation non-sens** (substitution transformant directement un codon en stop), ou une **délétion / addition** provoquant un **décalage du cadre de lecture** qui fait surgir un stop plus loin.

**4.** Parce qu'une bactérie est un **procaryote** : elle n'a **pas de noyau**. Rien ne sépare l'ADN des ribosomes, si bien que la **traduction peut commencer avant la fin de la transcription**. Chez un eucaryote, ce serait impossible : l'ARNm doit d'abord **sortir du noyau** par les pores nucléaires.
:::
:::

## Le clonage d'un gène

:::definition Clonage moléculaire
**Cloner** un gène, c'est en obtenir un très grand nombre de copies **identiques**. On y parvient en l'insérant dans un plasmide puis en laissant la bactérie se multiplier : à chaque division, le plasmide est **répliqué** et transmis aux deux cellules filles.
:::

:::remarque Une croissance exponentielle
Une bactérie se divise toutes les $20$ minutes environ. Partant d'une seule bactérie transformée, on en obtient $2^n$ après $n$ divisions. En une dizaine d'heures, cela fait $30$ divisions, soit
$$2^{30} \approx 1 \times 10^{9}$$
un **milliard** de bactéries — le million étant déjà atteint en moins de $7$ heures. Chacune contient le gène et fabrique la protéine.
:::

:::attention Deux sens du mot « clonage »
- Le **clonage moléculaire** — multiplier un **gène**. C'est ce dont il est question ici.
- Le **clonage d'organisme** — obtenir un individu génétiquement identique à un autre.

Ne pas les confondre : la question porte presque toujours sur le premier.
:::

## Sélectionner les bactéries transformées

:::propriete Le problème pratique
Quand on met des plasmides en présence de bactéries, **toutes** ne les absorbent pas. Comment repérer celles qui l'ont fait ?

On utilise un **gène marqueur**, placé sur le plasmide à côté du gène d'intérêt — par exemple un gène de **résistance à un antibiotique**. On cultive ensuite toutes les bactéries sur un milieu **contenant cet antibiotique** : seules celles qui ont reçu le plasmide **survivent**. La sélection est automatique.
:::

:::remarque Le raisonnement à reproduire
C'est un raisonnement de **sélection par la survie** : on crée des conditions où **seul** ce qu'on cherche peut vivre. On le retrouve dans de nombreux protocoles de biologie.
:::

## L'empreinte génétique

:::definition Empreinte génétique
L'**empreinte génétique** est un profil, obtenu par électrophorèse, de régions de l'ADN dont la longueur **varie beaucoup d'un individu à l'autre**. Ce profil est **propre à chaque individu** — sauf pour les **vrais jumeaux**, qui ont le même.
:::

:::propriete Ses deux usages
- **Identification** — comparer l'ADN d'une trace à celui de suspects, en médecine légale.
- **Filiation** — établir une parenté : chaque bande de l'enfant doit se retrouver **chez l'un ou l'autre** de ses parents, puisqu'il reçoit la moitié de ses allèles de chacun.
:::

:::attention La règle de lecture d'une recherche de paternité
L'enfant hérite de **la moitié** de ses allèles de sa mère et de l'autre moitié de son père. Donc :
1. on **élimine** d'abord les bandes de l'enfant qui viennent de la **mère** ;
2. les bandes **restantes** doivent obligatoirement se retrouver chez le **père** ;
3. si **une seule** bande de l'enfant ne se retrouve ni chez la mère ni chez l'homme testé, il **n'est pas** le père.

Une seule bande discordante suffit à exclure. En revanche, la concordance de toutes les bandes rend la paternité extrêmement probable, sans être une certitude absolue.
:::

## Thérapie génique et limites

:::definition Thérapie génique
La **thérapie génique** consiste à introduire un gène **fonctionnel** dans les cellules d'un malade, pour compenser un gène défectueux. On utilise souvent comme vecteur un **virus** rendu inoffensif.
:::

:::propriete Pourquoi c'est difficile
- Il faut atteindre les **bonnes cellules**, en nombre suffisant.
- Le gène doit s'**intégrer** sans perturber d'autres gènes — s'il se place au mauvais endroit, il peut en désactiver un et provoquer un cancer.
- Il doit rester **exprimé** durablement.
- Le vecteur viral peut déclencher une **réaction immunitaire**.
:::

:::remarque Ce qui est transmis, ce qui ne l'est pas
Si l'on modifie des cellules **somatiques**, la correction bénéficie au patient mais **n'est pas transmise** à ses enfants. Modifier des cellules **germinales** la rendrait héréditaire — ce qui soulève des questions éthiques majeures et n'est pas pratiqué chez l'Homme.
:::

:::app Applique
Une mère, son enfant et deux hommes A et B sont testés. Les bandes obtenues :

| | Bandes |
| --- | --- |
| Mère | $1$ · $4$ |
| Enfant | $1$ · $6$ |
| Homme A | $2$ · $5$ |
| Homme B | $3$ · $6$ |

**1.** Quelle bande l'enfant tient-il de sa mère ?
**2.** Lequel des deux hommes peut être le père ? Justifie.
**3.** Peut-on affirmer avec **certitude** qu'il l'est ?

:::solution
**1.** La bande **1**, que l'on retrouve chez la mère. C'est l'allèle d'origine maternelle.

**2.** Il reste à l'enfant la bande **6**, qui ne vient pas de sa mère : elle doit donc venir de son **père**.
- L'**homme A** possède les bandes $2$ et $5$ : il n'a **pas** la bande $6$. Il est **exclu**.
- L'**homme B** possède les bandes $3$ et $6$ : il a bien la bande **6**. Il **peut** être le père.

**3.** **Non, pas avec une certitude absolue.** La concordance montre seulement que B **peut** être le père : un autre homme porteur de la bande $6$ conviendrait tout aussi bien. Ce test permet d'**exclure** avec certitude (une bande discordante suffit), mais seulement de rendre la paternité **très probable**. C'est pourquoi on analyse en pratique **de nombreuses** régions de l'ADN à la fois : la probabilité qu'un autre homme présente toutes les mêmes bandes devient alors infime.
:::
:::

:::funnel Approfondissement de l'information génétique
:::

### Résumé de la leçon

:::aretenir La reproduction conforme
**Réplication** (phase S, chromosomes à 2 chromatides identiques) **+ mitose** (répartition égale) ⇒ deux cellules filles **identiques** ⇒ un **clone**.
:::

:::aretenir Les trois mutations ponctuelles
| Type | Effet |
| --- | --- |
| **Substitution** | **un seul** codon modifié |
| **Délétion** | **décalage** du cadre de lecture |
| **Addition** | **décalage** du cadre de lecture |

⇒ délétion et addition sont bien **plus graves** qu&apos;une substitution.
:::

:::aretenir Somatique ou germinale
**Somatique** : non transmise à la descendance. **Germinale** : transmise, source de **diversité**.
:::

:::aretenir Les trois notions
**Gène** (portion d&apos;ADN) → **allèle** (version du gène, née d&apos;une mutation) → **caractère** (manifestation).
$$\text{gène} \rightarrow \text{protéine} \rightarrow \text{caractère}$$
:::

:::attention
Les chromosomes ne sont pas absents en interphase : ils sont **décondensés** en **chromatine**. Condensé pour se **déplacer**, décondensé pour être **lu** et **répliqué**.
:::

:::aretenir La chaîne causale
$$\text{gène} \rightarrow \text{ARNm} \rightarrow \text{protéine} \rightarrow \text{caractère}$$
Un allèle différent ⇒ séquence différente ⇒ protéine de **forme** différente ⇒ fonction différente ⇒ caractère différent.
:::

:::aretenir L'universalité du code
Elle rend possible le **génie génétique** (une bactérie lit un gène humain) et constitue un argument fort en faveur de l&apos;**unité du monde vivant**.
:::

:::aretenir La spécialisation cellulaire
Toutes les cellules ont **tous** les gènes ; seule une **partie** est **transcrite** dans chacune. C&apos;est l&apos;**expression sélective** qui les différencie.
:::

:::aretenir Eucaryotes / procaryotes
| | Eucaryote | Procaryote |
| --- | --- | --- |
| Transcription | **noyau** | cytoplasme |
| Traduction | cytoplasme | cytoplasme |
| Enchaînement | successif, avec **migration** | **simultané** |
:::

:::aretenir Le polysome
Plusieurs ribosomes sur **un seul** ARNm ⇒ beaucoup de protéines, vite.
Chaînes de **longueur croissante** ⇒ donne le **sens de lecture**.
:::

:::aretenir Le clonage moléculaire
Insérer le gène dans un **plasmide** + laisser la bactérie se **multiplier** ⇒ $2^n$ copies identiques.
**Clonage moléculaire** (un gène) ≠ **clonage d&apos;organisme** (un individu).
:::

:::aretenir Sélectionner les transformées
Un **gène marqueur** de **résistance à un antibiotique** sur le plasmide + culture **avec** cet antibiotique ⇒ seules les bactéries transformées survivent.
:::

:::aretenir L'empreinte génétique — la règle
1. Retirer les bandes venues de la **mère**.
2. Les bandes **restantes** doivent être chez le **père**.
3. **Une seule** bande discordante ⇒ paternité **exclue**.

Le test **exclut** avec certitude, il ne fait que rendre la paternité **très probable**.
:::

:::aretenir Thérapie génique
Introduire un gène **fonctionnel** (souvent par vecteur **viral**). Difficultés : atteindre les bonnes cellules, intégration au bon endroit, expression durable, réaction immunitaire.
**Somatique** ⇒ non transmis · **germinale** ⇒ héréditaire, non pratiqué chez l&apos;Homme.
:::

---

<!-- leçon 60 · cours -->

# Leçon — Mise en évidence : structure de l'ADN et empreinte génétique

**Objectifs :** Exploiter un tableau d'analyse des bases pour démontrer l'appariement complémentaire
Distinguer les deux conclusions tirées des données de Chargaff
Interpréter un cliché de diffraction aux rayons X
Justifier chaque étape d'un protocole d'extraction de l'ADN
Légender un schéma de la double hélice
Expliquer le principe de l'électrophorèse et justifier le sens de migration

## Le raisonnement historique, document par document

La structure de l'ADN n'a pas été vue : elle a été **déduite** de résultats expérimentaux. C'est exactement ce que l'examen demande de refaire.

:::document Les analyses de Chargaff
**Le document.** Un tableau donnant, pour plusieurs espèces, les pourcentages des quatre bases dans l'ADN.

| Espèce | A | T | G | C | $\dfrac{A+T}{G+C}$ |
| --- | --- | --- | --- | --- | --- |
| Homme | $30{,}4$ | $30{,}1$ | $19{,}6$ | $19{,}9$ | $1{,}53$ |
| Levure | $31{,}3$ | $32{,}9$ | $18{,}7$ | $17{,}1$ | $1{,}79$ |
| *E. coli* | $24{,}7$ | $23{,}6$ | $26{,}0$ | $25{,}7$ | $0{,}93$ |

**Ce qu'il faut lire.**
- Dans **chaque** espèce, $\%A \approx \%T$ et $\%G \approx \%C$.
- Le rapport $\dfrac{A+T}{G+C}$, lui, **change** d'une espèce à l'autre.

**Ce qu'il faut en conclure.** L'égalité $A = T$ et $G = C$, valable partout, ne peut pas être un hasard : elle impose que ces bases soient **associées deux à deux**. C'est l'argument qui fonde l'**appariement complémentaire** A–T et G–C.

Et puisque le rapport $\dfrac{A+T}{G+C}$ varie selon l'espèce, la **séquence** des bases est, elle, **propre à chaque espèce** : c'est là que réside l'information.
:::

:::attention
Deux conclusions distinctes sortent du même tableau, et l'examen les demande souvent toutes les deux : l'**égalité** prouve l'appariement, la **variation du rapport** prouve la spécificité de l'ADN.
:::

:::document Le cliché de diffraction de Rosalind Franklin
**Le document.** Une photographie de diffraction des rayons X par une fibre d'ADN, montrant une figure **en croix** avec des taches régulièrement espacées.

**Ce qu'il faut lire.** La figure en croix est la signature d'une structure **hélicoïdale**. L'espacement régulier des taches permet de calculer le **pas de l'hélice** et le **diamètre** de la molécule. Le diamètre mesuré est **constant** sur toute la longueur.

**Ce qu'il faut en conclure.** L'ADN est enroulé en **hélice**. Le diamètre constant impose que chaque « barreau » de l'échelle ait la **même largeur** — donc qu'une **grosse** base soit toujours appariée à une **petite**, ce qui confirme A–T et G–C.
:::

:::remarque Comment les deux documents se complètent
Chargaff donne les **paires** ; Franklin donne la **forme**. Ni l'un ni l'autre ne suffit. C'est en les combinant que Watson et Crick construisent en 1953 le modèle de la **double hélice** — un modèle qui, en plus, **explique immédiatement** comment l'ADN peut se répliquer.
:::

## Mettre en évidence l'ADN au laboratoire

:::experience L'extraction de l'ADN
**Protocole.** À partir d'un matériel riche en cellules (oignon, banane, cellules buccales) :
1. **Broyer** — libérer les cellules.
2. Ajouter du **liquide vaisselle** — les lipides des membranes sont dissous, les cellules et les noyaux s'ouvrent.
3. Ajouter du **sel** — il neutralise les charges de l'ADN et le sépare des protéines.
4. Verser doucement de l'**alcool froid** — l'ADN, insoluble dans l'alcool, précipite.

**Résultats.** Une **méduse blanchâtre et filamenteuse** apparaît à l'interface entre les deux liquides. On peut l'enrouler autour d'une tige de verre.

**Interprétation.** Cette masse est l'**ADN précipité**. Chaque étape a un rôle précis : le détergent ouvre les membranes, le sel détache les protéines, l'alcool fait précipiter. L'aspect **filamenteux** est cohérent avec une molécule très **longue** et **fine**.
:::

:::attention
On demande presque toujours de **justifier chaque étape**, pas de réciter le protocole. Détergent → **lipides** des membranes. Sel → **protéines**. Alcool → **insolubilité** de l'ADN.
:::

## Exploiter un modèle moléculaire

[[fig:svt-adn]] Le modèle de la double hélice

:::methode Légender un schéma d'ADN
Les éléments attendus, et dans cet ordre de lecture :
1. les deux **chaînes** (brins) **antiparallèles**, orientées $5' \to 3'$ ;
2. le **squelette** de chaque brin : alternance **phosphate – désoxyribose** ;
3. les **bases azotées**, tournées vers l'intérieur ;
4. les **liaisons hydrogène** : **2** entre A et T, **3** entre G et C ;
5. un **nucléotide** entouré : phosphate + désoxyribose + une base.
:::

:::app Étude documentaire
On analyse l'ADN de trois échantillons.

| Échantillon | A (%) | T (%) | G (%) | C (%) |
| --- | --- | --- | --- | --- |
| X | $28$ | $28$ | $22$ | $22$ |
| Y | $32$ | $18$ | $27$ | $23$ |
| Z | $18$ | $18$ | $32$ | $32$ |

**1.** Lesquels sont des ADN **double brin** ? Justifie.
**2.** Calcule le rapport $\dfrac{A+T}{G+C}$ pour X et Z. Proviennent-ils de la même espèce ?
**3.** Lequel de X et Z résiste le mieux à une élévation de température ? Justifie.
**4.** Que peut-on dire de l'échantillon Y ?

:::solution
**1.** **X et Z.** Dans les deux, $\%A = \%T$ et $\%G = \%C$ : les règles de Chargaff sont vérifiées, ce qui n'est possible que si les bases sont **appariées** deux à deux, donc sur une molécule **double brin**.

**2.** Pour X :
$$\frac{28+28}{22+22} = \frac{56}{44} = 1{,}27$$
Pour Z :
$$\frac{18+18}{32+32} = \frac{36}{64} = 0{,}56$$
Les deux rapports sont **très différents** : X et Z ne proviennent **pas** de la même espèce, puisque ce rapport est caractéristique de l'espèce.

**3.** **Z.** Il contient $64\ \%$ de bases G et C, contre seulement $44\ \%$ pour X. Or chaque paire G–C est tenue par **3** liaisons hydrogène au lieu de **2** pour A–T. Il faut donc une énergie — donc une température — **plus élevée** pour séparer les deux brins de Z.

**4.** Chez Y, $\%A \neq \%T$ ($32$ contre $18$) et $\%G \neq \%C$ ($27$ contre $23$) : les règles de Chargaff ne sont **pas** respectées. Cet ADN ne peut donc pas être double brin : c'est un ADN **simple brin**, où rien n'impose l'égalité des bases complémentaires.
:::
:::

## Le principe de la technique

:::experience L'électrophorèse sur gel
**Protocole.** On dépose les échantillons d'ADN dans des **puits** creusés à une extrémité d'un gel. On plonge le gel dans un tampon conducteur et on applique une **différence de potentiel** entre ses deux extrémités. Après migration, on **colore** l'ADN pour révéler les bandes.

**Résultats.**
[[fig:svt-electrophorese]]
L'ADN migre **du puits vers l'anode** (pôle **+**). Chaque échantillon donne une ou plusieurs **bandes**, situées à des distances variables du puits.

**Interprétation.** L'ADN est chargé **négativement** — à cause de ses groupements **phosphate** — ce qui explique qu'il migre vers le pôle **positif**. Le gel agit comme un tamis : les **petits** fragments s'y faufilent facilement et vont **loin**, les **gros** sont freinés et restent **près du puits**. La séparation se fait donc selon la **taille**.
:::

:::attention Les deux justifications à savoir
- « Pourquoi l'ADN migre-t-il vers le **+** ? » → il est chargé **négativement**, à cause des groupements **phosphate**.
- « Pourquoi les fragments se séparent-ils ? » → le gel **freine** d'autant plus que le fragment est **gros**.
:::

## Utiliser un marqueur de taille

:::methode Mesurer un fragment inconnu
On dépose, dans un puits à part, un **marqueur de taille** : un mélange de fragments dont les tailles sont **connues**.
1. Repérer les bandes du marqueur et leurs tailles.
2. Situer la bande inconnue **entre** deux bandes du marqueur.
3. Encadrer sa taille, ou l'estimer par comparaison directe si elle est à la même hauteur qu'une bande connue.
:::

:::exemple Lecture
Le marqueur donne des bandes à $3\,000$, $2\,000$, $1\,000$ et $500$ paires de bases. Un fragment inconnu migre **entre** les bandes $2\,000$ et $1\,000$, plus près de celle de $1\,000$.

On conclut : sa taille est comprise **entre $1\,000$ et $2\,000$ paires de bases**, et probablement de l'ordre de $1\,200$ à $1\,400$.
:::

## L'empreinte génétique

:::definition Ce qu'on analyse
On n'analyse pas tout le génome : on cible des régions dont la **longueur varie fortement** d'un individu à l'autre. Après découpage et électrophorèse, chaque individu donne un profil de bandes **qui lui est propre** — son **empreinte génétique**.
:::

:::propriete Les deux propriétés qui fondent la technique
1. L'empreinte est **individuelle** — la probabilité que deux personnes aient la même est infime, sauf pour les **vrais jumeaux**.
2. L'empreinte est **héritée** — chaque individu reçoit **la moitié** de ses allèles de sa mère et l'autre moitié de son père. Toute bande de l'enfant doit donc se retrouver chez **l'un** de ses deux parents.
:::

## Deux applications, deux raisonnements

:::methode Identification — médecine légale
On compare le profil d'une **trace** retrouvée sur les lieux à ceux de plusieurs **suspects**.
- Profils **identiques** sur toutes les bandes ⇒ l'ADN provient très probablement de ce suspect.
- **Une seule** bande différente ⇒ le suspect est **exclu**.
:::

:::methode Filiation — recherche de paternité
1. Identifier les bandes de l'enfant présentes **chez la mère** : ce sont les allèles **maternels**.
2. Les bandes **restantes** sont nécessairement d'origine **paternelle**.
3. Vérifier si l'homme testé les possède **toutes**.
   - Il lui en manque **une** ⇒ **exclu**.
   - Il les possède toutes ⇒ paternité **compatible**, et d'autant plus probable qu'on a analysé de régions.
:::

:::attention La formulation qui rapporte les points
On n'écrit jamais « ce test prouve que X est le père ». On écrit : « le test **exclut** A, et la paternité de B est **compatible** avec les résultats ». L'électrophorèse **exclut** avec certitude ; elle ne **prouve** jamais à elle seule.
:::

:::app Étude documentaire
Une scène de crime livre une trace de sang. On compare son profil à celui de trois suspects, avec un marqueur de taille.

| Piste | Bandes (paires de bases) |
| --- | --- |
| Marqueur | $4\,000$ · $3\,000$ · $2\,000$ · $1\,000$ |
| Trace | $3\,000$ · $1\,000$ |
| Suspect 1 | $3\,000$ · $2\,000$ |
| Suspect 2 | $3\,000$ · $1\,000$ |
| Suspect 3 | $4\,000$ · $1\,000$ |

**1.** Dans quel sens les fragments ont-ils migré, et pourquoi ?
**2.** Quelle bande de la trace a le **moins** migré ?
**3.** Quel suspect ne peut pas être exclu ? Justifie pour chacun.
**4.** Peut-on affirmer que ce suspect est le coupable ?

:::solution
**1.** Du **puits vers l'anode**, le pôle **+**. L'ADN porte des groupements **phosphate** chargés **négativement** : il est donc attiré par le pôle positif.

**2.** La bande de **$3\,000$ paires de bases**. C'est le plus **gros** des deux fragments de la trace, et plus un fragment est gros, plus le gel le **freine** : il reste donc le plus près du puits.

**3.**
- **Suspect 1** — il a la bande $3\,000$ mais pas la bande $1\,000$ ; il a en revanche une bande $2\,000$ absente de la trace. **Exclu.**
- **Suspect 2** — il a **exactement** les deux bandes de la trace, $3\,000$ et $1\,000$, et aucune autre. **Non exclu** : son profil est compatible.
- **Suspect 3** — il a bien la bande $1\,000$, mais sa seconde bande est à $4\,000$ et non à $3\,000$. **Exclu.**

**4.** **Non.** Le test montre seulement que le profil du suspect 2 est **compatible** avec la trace. Avec seulement **deux** bandes analysées, d'autres personnes peuvent présenter le même profil. Pour que la conclusion soit solide, il faut analyser **de nombreuses** régions de l'ADN : la probabilité qu'un autre individu présente toutes les mêmes bandes devient alors négligeable. L'électrophorèse permet d'**exclure** avec certitude, jamais d'**accuser** à elle seule.
:::
:::

:::funnel Mise en évidence de la structure de l'ADN
:::

### Résumé de la leçon

:::aretenir Chargaff — deux conclusions distinctes
$\%A = \%T$ et $\%G = \%C$ **partout** ⇒ les bases sont **appariées** (A–T, G–C).
$\dfrac{A+T}{G+C}$ **varie selon l&apos;espèce** ⇒ la **séquence** est spécifique : c&apos;est là qu&apos;est l&apos;information.
:::

:::aretenir Franklin
Figure **en croix** aux rayons X ⇒ structure **hélicoïdale**. **Diamètre constant** ⇒ une grosse base toujours face à une petite.
Chargaff donne les **paires**, Franklin la **forme** : ensemble ⇒ la **double hélice** (1953).
:::

:::aretenir L'extraction — justifier chaque étape
**Broyage** → libérer les cellules · **détergent** → dissoudre les **lipides** membranaires · **sel** → détacher les **protéines** · **alcool froid** → l&apos;ADN y est **insoluble**, il précipite.
:::

:::attention
$A \neq T$ ⇒ la molécule est **simple brin** (ou c&apos;est de l&apos;ARN). Chargaff ne s&apos;applique qu&apos;au **double brin**.
:::

:::aretenir Les deux justifications
L&apos;ADN migre vers l&apos;**anode (+)** car ses **phosphates** sont chargés **négativement**.
Le gel **freine** les gros fragments ⇒ séparation par la **taille**.
:::

:::aretenir La règle de lecture
**Petit fragment ⇒ migre loin** (bande basse).
**Gros fragment ⇒ reste près du puits** (bande haute).
Le **marqueur de taille** sert à encadrer la taille d&apos;un fragment inconnu.
:::

:::aretenir L'empreinte génétique
**Individuelle** (sauf vrais jumeaux) et **héritée** : chaque bande de l&apos;enfant vient de **l&apos;un** de ses deux parents.
:::

:::aretenir Recherche de paternité — la méthode
Retirer les bandes **maternelles** → les restantes doivent être chez le **père** → **une** bande manquante ⇒ **exclu**.
:::

:::attention
On écrit « **exclu** » ou « **compatible** », jamais « prouvé ». Le test exclut avec certitude ; il ne prouve pas.
:::
