# Libération de l'énergie (respiration, fermentation)

> Code `svtp-bioenergie` · SVT · pc · 2bac · unité « Flux d'énergie »
> Notions (= titres `##`, à recopier tels quels dans le champ `notion`) :
> - Une oxydation complète du glucose
> - Étape 1 — la glycolyse
> - Étape 2 — oxydation du pyruvate et cycle de Krebs
> - Étape 3 — la chaîne respiratoire
> - Le bilan énergétique
> - Une oxydation incomplète
> - Les deux fermentations au programme
> - À quoi sert vraiment le pyruvate ?
> - Comparer les deux voies
> - Méthode 1 — Identifier un métabolisme à partir de mesures
> - Méthode 2 — Le quotient respiratoire
> - Méthode 3 — Faire un bilan d'ATP
> - Méthode 4 — Calculer un rendement énergétique
> - L'ATP, monnaie énergétique de la cellule
> - Les autres substrats
> - Le flux d'énergie dans la biosphère
> - Le détail de la chimiosmose
> - Les compartiments cellulaires du métabolisme
> - La mitochondrie, une structure faite pour sa fonction
> - Le schéma bilan : l'ATP au centre
> - Le montage ExAO
> - L'expérience de référence
> - Les expériences complémentaires

---

<!-- leçon 1 · cours -->

# Leçon — La respiration cellulaire

**Objectifs :** Écrire l'équation bilan de la respiration cellulaire
Situer les trois étapes dans leurs compartiments cellulaires
Énoncer le bilan de la glycolyse, du cycle de Krebs et de la chaîne respiratoire
Expliquer la phosphorylation oxydative et le rôle du gradient de protons
Retrouver par le calcul le bilan de 38 ATP par molécule de glucose

## Une oxydation complète du glucose

:::definition Respiration cellulaire
La **respiration cellulaire** est l'oxydation **complète** de la matière organique en présence de **dioxygène**. Le glucose est dégradé jusqu'au $\mathrm{CO_2}$ et à l'eau, et l'énergie libérée sert à fabriquer de l'**ATP**.
:::

$$\mathrm{C_6H_{12}O_6 + 6\,O_2 + 38\,ADP + 38\,Pi \rightarrow 6\,CO_2 + 6\,H_2O + 38\,ATP}$$

:::propriete Où tout se passe
La respiration se déroule en **trois étapes**, réparties sur **trois sites** — l'hyaloplasme, puis deux compartiments de la mitochondrie :
- la **glycolyse**, dans l'**hyaloplasme** (le cytosol) ;
- l'**oxydation du pyruvate** et le **cycle de Krebs**, dans la **matrice** mitochondriale ;
- la **chaîne respiratoire**, dans la **membrane interne** de la mitochondrie.
:::

[[fig:svt-respiration-bilan]] Les trois étapes de la respiration cellulaire

## Étape 1 — la glycolyse

:::propriete La glycolyse
Dans l'**hyaloplasme**, une molécule de glucose en $\mathrm{C_6}$ est dégradée en **deux** molécules d'acide pyruvique en $\mathrm{C_3}$. Elle se fait en deux temps : d'abord une **consommation** d'ATP pour activer le glucose et le cliver en trioses, puis une **production** d'ATP et de coenzymes réduits.
$$\mathrm{C_6H_{12}O_6 + 2\,ADP + 2\,Pi + 2\,NAD^+ \rightarrow 2\,CH_3\text{–}CO\text{–}COOH + 2\,ATP + 2\,NADH,H^+}$$
:::

:::attention Deux points qui rapportent des points
- La glycolyse ne consomme **pas** de dioxygène : c'est un phénomène **anaérobie**.
- C'est l'étape **commune** à la respiration **et** à la fermentation. Tout se joue ensuite, sur le devenir du pyruvate.
:::

## Étape 2 — oxydation du pyruvate et cycle de Krebs

:::propriete Dans la matrice
Le pyruvate entre dans la **matrice** mitochondriale et y subit deux transformations :
1. Une **décarboxylation** (perte de $\mathrm{CO_2}$) et une **déshydrogénation** (perte de $\mathrm{H}$) qui donnent un groupement **acétyle**, fixé sur le coenzyme A : c'est l'**acétyl-CoA**.
2. L'acétyl-CoA se fixe sur un composé en $\mathrm{C_4}$ pour donner un composé en $\mathrm{C_6}$, qui subit une suite de décarboxylations et de déshydrogénations : le **cycle de Krebs**.
:::

$$\mathrm{CH_3\text{–}CO\text{–}COOH + 4\,NAD^+ + FAD + ADP + Pi \rightarrow 3\,CO_2 + 4\,NADH,H^+ + FADH_2 + ATP}$$

:::remarque Le bilan par pyruvate
Pour **une** molécule d'acide pyruvique : $4\ \mathrm{NADH,H^+}$, $1\ \mathrm{FADH_2}$, $1\ \mathrm{ATP}$ et $3\ \mathrm{CO_2}$. Comme un glucose donne **deux** pyruvates, il faut **tout doubler**.
:::

:::attention
C'est **ici** que sort tout le $\mathrm{CO_2}$ de la respiration : $2 \times 3 = 6\ \mathrm{CO_2}$, exactement les six carbones du glucose. Le $\mathrm{CO_2}$ ne vient **pas** de la chaîne respiratoire.
:::

## Étape 3 — la chaîne respiratoire

[[fig:svt-mitochondrie]] La mitochondrie et la phosphorylation oxydative

:::definition Chaîne respiratoire
La **chaîne respiratoire** est un ensemble de transporteurs d'électrons situés dans la **membrane interne**. Par oxydoréductions successives, elle transfère les électrons des coenzymes réduits jusqu'au **dioxygène**, accepteur **final**, qui est réduit en eau.
:::

$$\mathrm{NADH,H^+ \rightarrow NAD^+ + 2\,H^+ + 2\,e^-} \qquad\quad \mathrm{\tfrac{1}{2}\,O_2 + 2\,H^+ + 2\,e^- \rightarrow H_2O}$$

:::propriete La phosphorylation oxydative, en quatre temps
1. Les coenzymes réduits sont **oxydés** par les complexes de la chaîne.
2. Les électrons sont transférés de complexe en complexe jusqu'à l'**O₂**, qui devient de l'**eau**.
3. Ce transfert **expulse des protons** de la matrice vers l'espace intermembranaire : il se crée un **gradient de $\mathrm{H^+}$**.
4. Les protons **reviennent** dans la matrice en traversant les **sphères pédonculées**, et c'est cette énergie qui permet la synthèse d'**ATP** à partir d'ADP et de Pi.

Le couplage entre oxydoréductions et phosphorylation donne son nom à l'étape : la **phosphorylation oxydative**.
:::

:::propriete Le rendement des coenzymes
$$1\ \mathrm{NADH,H^+} \rightarrow 3\ \mathrm{ATP} \qquad\qquad 1\ \mathrm{FADH_2} \rightarrow 2\ \mathrm{ATP}$$
:::

## Le bilan énergétique

:::demonstration Retrouver les 38 ATP
**ATP produits directement :**
- glycolyse : $2\ \mathrm{ATP}$
- cycle de Krebs : $2 \times 1 = 2\ \mathrm{ATP}$
$$\text{soit } 4\ \mathrm{ATP}$$

**Coenzymes réduits :**
- glycolyse : $2\ \mathrm{NADH,H^+}$
- oxydation du pyruvate et Krebs : $2 \times 4 = 8\ \mathrm{NADH,H^+}$ et $2 \times 1 = 2\ \mathrm{FADH_2}$
$$\text{soit } 10\ \mathrm{NADH,H^+} \text{ et } 2\ \mathrm{FADH_2}$$

**Conversion par la chaîne respiratoire :**
$$10 \times 3 = 30\ \mathrm{ATP} \qquad 2 \times 2 = 4\ \mathrm{ATP} \qquad \text{soit } 34\ \mathrm{ATP}$$

**Total :**
$$4 + 34 = 38\ \mathrm{ATP}$$
:::

:::app Applique
**1.** Où sont produits les $\mathrm{CO_2}$ de la respiration, et combien ?
**2.** Un poison bloque la chaîne respiratoire sans toucher aux autres étapes. Combien d'ATP la cellule produit-elle encore par glucose ?
**3.** Pourquoi la cellule s'arrête-t-elle très vite malgré tout ?

:::solution
**1.** Tous dans la **matrice**, lors de l'oxydation du pyruvate et du cycle de Krebs : $3\ \mathrm{CO_2}$ par pyruvate, donc
$$2 \times 3 = 6\ \mathrm{CO_2}$$
soit les six carbones du glucose. Ni la glycolyse ni la chaîne respiratoire n'en produisent.

**2.** Seuls subsistent les ATP produits **directement**, c'est-à-dire $2$ (glycolyse) $+ 2$ (Krebs) $= 4\ \mathrm{ATP}$. Les $34$ ATP de la chaîne sont perdus : le rendement s'effondre de $38$ à $4$.

**3.** Parce que la chaîne respiratoire est aussi ce qui **réoxyde** les coenzymes. Bloquée, tout le $\mathrm{NAD^+}$ et le $\mathrm{FAD}$ restent sous forme réduite. Or la glycolyse et le cycle de Krebs **exigent** des coenzymes oxydés pour fonctionner : faute de $\mathrm{NAD^+}$, ils s'arrêtent à leur tour. Même les $4$ ATP disparaissent.
:::
:::

:::funnel La respiration cellulaire
:::

### Résumé de la leçon

:::aretenir L'équation à connaître
$$\mathrm{C_6H_{12}O_6 + 6\,O_2 + 38\,ADP + 38\,Pi \rightarrow 6\,CO_2 + 6\,H_2O + 38\,ATP}$$
Oxydation **complète** du glucose ; accepteur final d'électrons : l'**O₂**.
:::

:::aretenir Les trois étapes et leur lieu
| Étape | Lieu | Produit |
| --- | --- | --- |
| **Glycolyse** | hyaloplasme | 2 pyruvate · 2 ATP · 2 NADH,H⁺ |
| **Pyruvate + Krebs** | **matrice** | 6 CO₂ · 2 ATP · 8 NADH,H⁺ · 2 FADH₂ |
| **Chaîne respiratoire** | **membrane interne** | H₂O · 34 ATP |
:::

:::aretenir Le bilan, à savoir refaire
$$4\ \mathrm{ATP\ directs} + \underbrace{10 \times 3}_{30} + \underbrace{2 \times 2}_{4} = 38\ \mathrm{ATP}$$
$1\ \mathrm{NADH,H^+} \rightarrow 3\ \mathrm{ATP}$ · $1\ \mathrm{FADH_2} \rightarrow 2\ \mathrm{ATP}$
:::

:::attention
Le **CO₂** vient **uniquement** de la matrice (pyruvate + Krebs), jamais de la chaîne.
L'**eau** vient **uniquement** de la chaîne respiratoire.
La glycolyse est **anaérobie** et **commune** aux deux voies.
:::

:::aretenir La phosphorylation oxydative
e⁻ → O₂ ⇒ sortie de H⁺ ⇒ **gradient** ⇒ retour par les **sphères pédonculées** ⇒ ATP.
:::

---

<!-- leçon 2 · cours -->

# Leçon — La fermentation

**Objectifs :** Définir la fermentation et la situer dans la cellule
Écrire les équations bilans des fermentations alcoolique et lactique
Distinguer les deux fermentations par le dégagement de CO2
Expliquer que la réduction du pyruvate sert à régénérer le NAD+
Comparer les rendements énergétiques de la respiration et de la fermentation

## Une oxydation incomplète

:::definition Fermentation
La **fermentation** est l'oxydation **incomplète** de la matière organique, en **absence de dioxygène**. Elle se déroule entièrement dans l'**hyaloplasme** et ne fait pas intervenir la mitochondrie.
:::

[[fig:svt-fermentation]] Les deux fermentations

:::propriete Le point de départ est le même
La fermentation **commence par la glycolyse**, exactement comme la respiration : glucose → 2 pyruvate, avec $2\ \mathrm{ATP}$ et $2\ \mathrm{NADH,H^+}$.

Ce qui change, c'est le **devenir du pyruvate**. Faute de dioxygène, il ne peut pas entrer dans la mitochondrie : il reste dans l'hyaloplasme et y est **réduit**.
:::

## Les deux fermentations au programme

:::propriete La fermentation alcoolique
Réalisée par les **levures**. Le pyruvate est d'abord **décarboxylé** (il perd un $\mathrm{CO_2}$) puis **réduit** en **éthanol**.
$$\mathrm{C_6H_{12}O_6 + 2\,ADP + 2\,Pi \rightarrow 2\,CH_3\text{–}CH_2\text{–}OH + 2\,CO_2 + 2\,ATP}$$
:::

:::propriete La fermentation lactique
Réalisée par les **bactéries lactiques** et par la **cellule musculaire**. Le pyruvate est directement **réduit** en **acide lactique**, **sans** dégagement de $\mathrm{CO_2}$.
$$\mathrm{C_6H_{12}O_6 + 2\,ADP + 2\,Pi \rightarrow 2\,CH_3\text{–}CHOH\text{–}COOH + 2\,ATP}$$
:::

:::attention Le critère qui les distingue
La fermentation **alcoolique** dégage du $\mathrm{CO_2}$, la **lactique** non. C'est ce qui permet de les séparer expérimentalement : une eau de chaux qui se trouble en anaérobie signale une fermentation alcoolique.
:::

## À quoi sert vraiment le pyruvate ?

:::remarque La vraie fonction de la réduction du pyruvate
La réduction du pyruvate ne produit **aucun ATP**. Alors pourquoi la cellule la fait-elle ?

Parce qu'elle **réoxyde le $\mathrm{NADH,H^+}$** en $\mathrm{NAD^+}$. Or la glycolyse a besoin de $\mathrm{NAD^+}$ pour tourner. Sans cette régénération, tout le $\mathrm{NAD^+}$ serait consommé en quelques secondes et la glycolyse s'arrêterait — donc toute production d'ATP.

**Le pyruvate sert d'accepteur d'électrons de substitution**, à la place du dioxygène.
:::

:::attention C'est LA question de synthèse du chapitre
« Pourquoi la fermentation existe-t-elle, puisqu'elle ne rapporte que 2 ATP ? » Réponse : parce que $2\ \mathrm{ATP}$ valent mieux que zéro. En anaérobie, c'est la **seule** voie possible, et elle permet à la glycolyse de continuer en régénérant le $\mathrm{NAD^+}$.
:::

## Comparer les deux voies

:::propriete Le tableau de comparaison
| | Respiration | Fermentation |
| --- | --- | --- |
| Dioxygène | **indispensable** | **absent** |
| Lieu | hyaloplasme **+ mitochondrie** | hyaloplasme **seul** |
| Oxydation du glucose | **complète** | **incomplète** |
| Accepteur final d'électrons | **O₂** | le **pyruvate** (ou son dérivé) |
| Produits | $\mathrm{CO_2}$ et $\mathrm{H_2O}$ | éthanol $+\ \mathrm{CO_2}$, ou acide lactique |
| Bilan | $38\ \mathrm{ATP}$ | $2\ \mathrm{ATP}$ |
:::

:::remarque Pourquoi un tel écart
Parce que la fermentation laisse partir une molécule qui contient **encore beaucoup d'énergie** : l'éthanol ou l'acide lactique sont des composés organiques, encore oxydables. La respiration, elle, va jusqu'au $\mathrm{CO_2}$, qui n'est plus oxydable du tout.
:::

:::app Applique
Une culture de levures est placée dans un milieu sucré. On mesure la quantité de glucose consommée et l'ATP produit dans deux conditions.

| Condition | Glucose consommé (mmol) | ATP produit (mmol) |
| --- | --- | --- |
| Avec $\mathrm{O_2}$ | $1{,}0$ | $38$ |
| Sans $\mathrm{O_2}$ | $1{,}0$ | ? |

**1.** Complète le tableau et nomme le métabolisme de chaque condition.
**2.** Combien de glucose faudrait-il en anaérobie pour produire les mêmes $38\ \mathrm{mmol}$ d'ATP ?
**3.** Comment vérifierais-tu expérimentalement qu'il s'agit bien d'une fermentation alcoolique ?

:::solution
**1.** Sans $\mathrm{O_2}$ : $2\ \mathrm{mmol}$ d'ATP. Avec $\mathrm{O_2}$ c'est la **respiration**, sans $\mathrm{O_2}$ la **fermentation** (alcoolique, chez les levures).

**2.** Chaque millimole de glucose ne rapporte que $2\ \mathrm{mmol}$ d'ATP, donc
$$n = \frac{38}{2} = 19\ \mathrm{mmol\ de\ glucose}$$
Il en faudrait **19 fois plus** — ce qui explique la consommation massive de sucre des levures en anaérobie.

**3.** En cherchant les **deux produits** caractéristiques :
- le $\mathrm{CO_2}$, en faisant barboter le gaz dégagé dans de l'**eau de chaux**, qui se trouble ;
- l'**éthanol**, par un test chimique en fin d'expérience.

La présence des deux, en l'absence de $\mathrm{O_2}$, signe la fermentation **alcoolique**. S'il n'y avait **pas** de $\mathrm{CO_2}$, il s'agirait d'une fermentation **lactique**.
:::
:::

:::funnel La fermentation
:::

### Résumé de la leçon

:::aretenir Les deux équations
**Alcoolique** (levures) :
$$\mathrm{C_6H_{12}O_6 + 2\,ADP + 2\,Pi \rightarrow 2\,CH_3\text{–}CH_2\text{–}OH + 2\,CO_2 + 2\,ATP}$$
**Lactique** (bactéries, muscle) :
$$\mathrm{C_6H_{12}O_6 + 2\,ADP + 2\,Pi \rightarrow 2\,CH_3\text{–}CHOH\text{–}COOH + 2\,ATP}$$
:::

:::aretenir Le point clé
Seule la **glycolyse** produit de l&apos;ATP ⇒ **2 ATP** dans les deux cas.
La réduction du pyruvate ne rapporte rien : elle sert à **régénérer le NAD⁺** pour que la glycolyse continue.
:::

| | Respiration | Fermentation |
| --- | --- | --- |
| O₂ | indispensable | absent |
| Lieu | hyaloplasme + **mitochondrie** | hyaloplasme **seul** |
| Oxydation | **complète** | **incomplète** |
| Accepteur final | **O₂** | le **pyruvate** |
| Bilan | **38 ATP** | **2 ATP** |

:::attention
**Alcoolique → CO₂. Lactique → pas de CO₂.** C&apos;est le test de l&apos;eau de chaux qui tranche.
:::

---

<!-- leçon 50 · cours -->

# Leçon — Méthodes & exercices types — respiration et fermentation

**Objectifs :** Identifier un métabolisme énergétique à partir de mesures d'échanges gazeux
Calculer et interpréter un quotient respiratoire
Établir le bilan en ATP d'une molécule de glucose dans chaque voie
Prévoir l'effet d'un inhibiteur sur la production d'ATP
Calculer le rendement énergétique de la respiration et de la fermentation

## Méthode 1 — Identifier un métabolisme à partir de mesures

:::methode Les quatre indices, dans cet ordre
1. **Y a-t-il consommation de $\mathrm{O_2}$ ?** Oui ⇒ **respiration**. Non ⇒ fermentation.
2. **Y a-t-il rejet de $\mathrm{CO_2}$ ?** Avec consommation d'O₂ ⇒ respiration. Sans consommation d'O₂ ⇒ fermentation **alcoolique**.
3. **Quels produits organiques ?** Éthanol ⇒ alcoolique. Acide lactique ⇒ lactique. Ni l'un ni l'autre ⇒ respiration.
4. **Quel rendement ?** Environ $38\ \mathrm{ATP}$ par glucose ⇒ respiration. Environ $2$ ⇒ fermentation.
:::

:::attention Le piège du CO₂
Un dégagement de $\mathrm{CO_2}$ **ne prouve pas** la respiration : la fermentation alcoolique en produit aussi. Ce qui tranche, c'est la **consommation simultanée de $\mathrm{O_2}$**.
:::

## Méthode 2 — Le quotient respiratoire

:::definition Quotient respiratoire
$$QR = \frac{n(\mathrm{CO_2}\ \text{rejeté})}{n(\mathrm{O_2}\ \text{consommé})} = \frac{V(\mathrm{CO_2})}{V(\mathrm{O_2})}$$
(Les volumes sont pris dans les mêmes conditions, donc le rapport des volumes vaut celui des quantités de matière.)
:::

:::propriete Lire un QR
- $QR = 1$ ⇒ le substrat est un **glucide**. L'équation le montre : $6\ \mathrm{CO_2}$ pour $6\ \mathrm{O_2}$.
- $QR < 1$ (environ $0{,}7$) ⇒ **lipides**.
- $QR$ non défini (pas d'$\mathrm{O_2}$ consommé) ⇒ **fermentation**.
:::

:::exemple Calcul type
Une suspension de levures consomme $12\ \mathrm{mL}$ d'$\mathrm{O_2}$ et rejette $12\ \mathrm{mL}$ de $\mathrm{CO_2}$.
$$QR = \frac{12}{12} = 1$$
Le substrat est un **glucide** et le métabolisme est la **respiration**.
:::

## Méthode 3 — Faire un bilan d'ATP

:::methode La chaîne de calcul, à dérouler dans l'ordre
1. **ATP directs** : $2$ (glycolyse) $+\ 2$ (Krebs) $= 4$.
2. **Coenzymes** : $10\ \mathrm{NADH,H^+}$ et $2\ \mathrm{FADH_2}$ par glucose.
3. **Conversion** : $\mathrm{NADH,H^+} \times 3$, $\mathrm{FADH_2} \times 2$.
4. **Total** : $4 + 30 + 4 = 38\ \mathrm{ATP}$.
:::

:::attention Compter par glucose ou par pyruvate ?
Le cycle de Krebs se déroule **deux fois** par glucose, puisqu'un glucose donne **deux** pyruvates. Oublier ce facteur $2$ est l'erreur la plus fréquente du chapitre.
:::

:::exemple Exercice type — un inhibiteur
Un inhibiteur bloque l'**entrée du pyruvate dans la mitochondrie**, sans rien changer d'autre. Combien d'ATP par glucose ?

Seule la **glycolyse** fonctionne encore :
$$2\ \mathrm{ATP\ directs}$$
Les $2\ \mathrm{NADH,H^+}$ de la glycolyse ne peuvent plus être réoxydés par la chaîne. Pour que la glycolyse continue, la cellule doit **fermenter** : le pyruvate est réduit sur place, ce qui régénère le $\mathrm{NAD^+}$ sans produire d'ATP.

Bilan : **2 ATP par glucose**, soit $19$ fois moins qu'en respiration.
:::

## Méthode 4 — Calculer un rendement énergétique

:::methode Rendement de conversion
$$\rho = \frac{n(\mathrm{ATP}) \times \Delta E(\mathrm{ATP})}{\Delta E(\text{glucose})} \times 100$$
avec, aux valeurs usuelles, $\Delta E(\mathrm{ATP}) \approx 30{,}5\ \mathrm{kJ\cdot mol^{-1}}$ et $\Delta E(\text{glucose}) \approx 2\,840\ \mathrm{kJ\cdot mol^{-1}}$.
:::

:::exemple Les deux rendements
**Respiration :**
$$\rho = \frac{38 \times 30{,}5}{2\,840} \times 100 = \frac{1\,159}{2\,840} \times 100 = 40{,}8\ \%$$

**Fermentation :**
$$\rho = \frac{2 \times 30{,}5}{2\,840} \times 100 = \frac{61}{2\,840} \times 100 = 2{,}1\ \%$$

Le reste de l'énergie est **dissipé sous forme de chaleur** — ce qui explique d'ailleurs l'échauffement d'un muscle en activité.
:::

:::app Exercice de synthèse
On suit une suspension de levures dans une enceinte fermée. On mesure :

| Phase | $\mathrm{O_2}$ consommé (µmol) | $\mathrm{CO_2}$ rejeté (µmol) | Glucose consommé (µmol) |
| --- | --- | --- | --- |
| I | $60$ | $60$ | $10$ |
| II | $0$ | $40$ | $20$ |

**1.** Calcule le $QR$ de la phase I. Quel métabolisme, quel substrat ?
**2.** Que se passe-t-il en phase II ? Vérifie par le rapport $\mathrm{CO_2}$ / glucose.
**3.** Compare les ATP produits dans chaque phase.

:::solution
**1.** $$QR = \frac{60}{60} = 1$$
$QR = 1$ et il y a consommation d'$\mathrm{O_2}$ : c'est la **respiration**, sur un substrat **glucidique**.

Vérification par la stœchiométrie : $10\ \mathrm{µmol}$ de glucose devraient consommer $6 \times 10 = 60\ \mathrm{µmol}$ d'$\mathrm{O_2}$ — c'est exactement la valeur mesurée.

**2.** Plus aucune consommation d'$\mathrm{O_2}$, mais toujours du $\mathrm{CO_2}$ : le dioxygène de l'enceinte est **épuisé** et les levures sont passées en **fermentation alcoolique**.

Vérification : la fermentation alcoolique donne $2\ \mathrm{CO_2}$ par glucose, donc pour $20\ \mathrm{µmol}$ de glucose :
$$2 \times 20 = 40\ \mathrm{µmol\ de\ CO_2}$$
C'est bien la valeur mesurée. La fermentation alcoolique est confirmée.

**3.** Phase I : $$10 \times 38 = 380\ \mathrm{µmol\ d'ATP}$$
Phase II : $$20 \times 2 = 40\ \mathrm{µmol\ d'ATP}$$

Les levures ont consommé **deux fois plus** de glucose en phase II pour produire près de **dix fois moins** d'ATP : c'est tout le coût de l'absence de dioxygène.
:::
:::

:::funnel Méthodes et exercices types de la respiration
:::

### Résumé de la leçon

:::aretenir Identifier le métabolisme
O₂ consommé ⇒ **respiration**. Pas d&apos;O₂ mais du CO₂ ⇒ fermentation **alcoolique**. Ni O₂ ni CO₂ ⇒ fermentation **lactique**.
:::

:::aretenir Le quotient respiratoire
$$QR = \frac{V(\mathrm{CO_2})}{V(\mathrm{O_2})}$$
$QR = 1$ ⇒ **glucide** · $QR \approx 0{,}7$ ⇒ **lipide**.
:::

:::aretenir Le bilan ATP
$$\underbrace{2 + 2}_{\text{directs}} + \underbrace{10\times 3}_{30} + \underbrace{2\times 2}_{4} = 38$$
**Krebs tourne 2 fois par glucose** — ne jamais oublier le facteur 2.
:::

:::aretenir Les rendements
$$\rho = \frac{n(\mathrm{ATP}) \times 30{,}5}{2\,840}\times 100$$
Respiration $\approx 41\ \%$ · fermentation $\approx 2\ \%$. Le reste part en **chaleur**.
:::

:::attention
Un dégagement de CO₂ ne prouve **pas** la respiration : il faut la consommation simultanée d&apos;**O₂**.
:::

---

<!-- leçon 51 · cours -->

# Leçon — Approfondissement — ATP, compartiments cellulaires et flux d'énergie

**Objectifs :** Décrire la structure de l'ATP et justifier son rôle d'intermédiaire énergétique
Expliquer l'écart entre les bilans de 36 et de 38 ATP
Relier le quotient respiratoire à la nature du substrat oxydé
Énoncer les trois conditions expérimentales de la synthèse d'ATP
Situer respiration et photosynthèse dans le flux d'énergie de la biosphère
Distinguer organismes autotrophes et hétérotrophes

## L'ATP, monnaie énergétique de la cellule

:::definition ATP
L'**ATP** (adénosine triphosphate) est formé d'une **adénosine** liée à **trois** groupements phosphate. Les liaisons entre phosphates sont **riches en énergie** : leur hydrolyse en libère.
$$\mathrm{ATP + H_2O \rightarrow ADP + Pi} \qquad \Delta E \approx 30{,}5\ \mathrm{kJ\cdot mol^{-1}}$$
:::

:::propriete Pourquoi une monnaie
La cellule ne peut pas utiliser directement l'énergie du glucose : elle est libérée en une seule fois, en trop grande quantité. L'ATP joue le rôle d'**intermédiaire** :
- il est produit **en continu** par la respiration ou la fermentation ;
- il est **dépensé à la demande** par les réactions consommatrices (contraction, transport actif, synthèses).

C'est un **intermédiaire**, pas un **stock** : les réserves cellulaires en ATP sont très faibles et doivent être **renouvelées en permanence**.
:::

:::remarque Pourquoi 36 et non 38 dans certains manuels
Les $2\ \mathrm{NADH,H^+}$ produits par la **glycolyse** se trouvent dans l'**hyaloplasme**, alors que la chaîne respiratoire est dans la mitochondrie. Ils doivent y entrer par des **systèmes de navettes**, et certaines navettes **coûtent** de l'énergie : le rendement tombe alors à $2\ \mathrm{ATP}$ par $\mathrm{NADH,H^+}$ au lieu de $3$, d'où un total de $36$.

**Au BAC marocain, la valeur attendue est $38$.** Retiens $38$ ; sache simplement expliquer d'où vient l'écart si on te le demande.
:::

## Les autres substrats

:::propriete La cellule ne brûle pas que du glucose
| Substrat | Où il entre dans la voie | $QR$ |
| --- | --- | --- |
| **Glucides** | glycolyse | $1$ |
| **Lipides** | acides gras → acétyl-CoA, donc directement dans le **cycle de Krebs** | $\approx 0{,}7$ |
| **Protides** | acides aminés → intermédiaires de Krebs | $\approx 0{,}8$ |
:::

:::remarque Ce que le QR révèle
Comme les lipides sont **plus riches en hydrogène** et plus pauvres en oxygène que les glucides, leur oxydation exige **plus** de dioxygène pour la même quantité de $\mathrm{CO_2}$ produite : le $QR$ descend. Mesurer un $QR$ revient donc à identifier le **carburant** utilisé.
:::

:::attention
La cellule **musculaire** au repos comme en activité utilise essentiellement le **glucose**, pas les lipides ni les protides. C'est une observation expérimentale du cours, souvent demandée.
:::

## Le flux d'énergie dans la biosphère

:::propriete Autotrophes et hétérotrophes
- Les **autotrophes** (végétaux chlorophylliens) utilisent le $\mathrm{CO_2}$ atmosphérique et l'**énergie lumineuse** pour **produire** de la matière organique : c'est la photosynthèse.
- Les **hétérotrophes**, incapables d'utiliser la lumière, doivent **prélever** leur matière organique et en **extraire** l'énergie sous forme d'ATP.
:::

:::remarque Le couplage des deux
$$\text{photosynthèse} : \mathrm{6\,CO_2 + 6\,H_2O \rightarrow C_6H_{12}O_6 + 6\,O_2}$$
$$\text{respiration} : \mathrm{C_6H_{12}O_6 + 6\,O_2 \rightarrow 6\,CO_2 + 6\,H_2O}$$
Les deux équations sont **inverses** l'une de l'autre. La photosynthèse **stocke** l'énergie lumineuse dans la matière organique ; la respiration la **libère**. Entre les deux circule un **flux d'énergie** qui traverse toute la biosphère, en se dégradant en chaleur à chaque étape.
:::

## Le détail de la chimiosmose

:::demonstration Les conditions expérimentales de la synthèse d'ATP
On travaille sur des **vésicules** de membrane interne mitochondriale. La synthèse d'ATP n'a lieu que si **trois** conditions sont réunies :
1. la présence d'**ADP** et de **Pi** — ce sont les réactifs ;
2. un **gradient de protons** entre l'intérieur et l'extérieur des vésicules, avec $[\mathrm{H^+}]_{\text{int}} > [\mathrm{H^+}]_{\text{ext}}$, de sorte que les protons **tendent à sortir** ;
3. la présence des **sphères pédonculées**, qui sont l'enzyme de synthèse.

Retirer l'une des trois suffit à tout arrêter. C'est la preuve que l'énergie de la synthèse vient bien du **flux de protons**, et non directement des électrons.
:::

:::remarque La mesure qui le prouve
Si l'on injecte de l'$\mathrm{O_2}$ dans une suspension de mitochondries, on observe d'abord une **forte augmentation** de la concentration en $\mathrm{H^+}$ du milieu extérieur, puis une **diminution lente**. L'augmentation correspond à l'**expulsion** des protons par la chaîne ; la diminution, à leur **retour** par les sphères pédonculées, qui fabriquent alors l'ATP.
:::

:::app Applique
Un muscle au repos consomme $0{,}30\ \mathrm{µmol}$ d'$\mathrm{O_2}$ par minute et par gramme. On donne $\Delta E(\mathrm{ATP}) = 30{,}5\ \mathrm{kJ\cdot mol^{-1}}$.

**1.** Combien de glucose ce muscle oxyde-t-il par minute et par gramme ?
**2.** Combien d'ATP produit-il ?
**3.** Quelle énergie cela représente-t-il ?

:::solution
**1.** L'équation donne $6\ \mathrm{O_2}$ par glucose :
$$n(\text{glucose}) = \frac{0{,}30}{6} = 0{,}050\ \mathrm{µmol\cdot min^{-1}\cdot g^{-1}}$$

**2.** À raison de $38\ \mathrm{ATP}$ par glucose :
$$n(\mathrm{ATP}) = 38 \times 0{,}050 = 1{,}9\ \mathrm{µmol\cdot min^{-1}\cdot g^{-1}}$$

**3.** $$E = 1{,}9\times 10^{-6} \times 30{,}5 = 5{,}8\times 10^{-5}\ \mathrm{kJ\cdot min^{-1}\cdot g^{-1}}$$
soit environ $58\ \mathrm{mJ}$ par minute et par gramme de muscle — au **repos** seulement.
:::
:::

## Les compartiments cellulaires du métabolisme

[[fig:svt-cellule]] La cellule et sa mitochondrie

:::propriete Qui fait quoi, et où
| Compartiment | Ce qui s'y passe |
| --- | --- |
| **Hyaloplasme** (cytosol) | la **glycolyse** ; la **fermentation** en entier |
| **Matrice** mitochondriale | oxydation du pyruvate, **cycle de Krebs** |
| **Membrane interne** (crêtes) | la **chaîne respiratoire** et la synthèse d'ATP |
:::

:::observation Le lien entre mitochondries et respiration
Les cellules à forte activité — cellules musculaires, neurones, cellules du foie — sont **très riches en mitochondries**. À l'inverse, le **globule rouge** des mammifères, qui n'en possède **aucune**, est incapable de respirer : il tire toute son énergie de la **fermentation lactique**.

**Interprétation.** Cette corrélation entre **nombre de mitochondries** et **capacité respiratoire** est un argument expérimental direct : la mitochondrie est bien l'organite de la respiration.
:::

:::attention
Une cellule **sans** mitochondries n'est pas une cellule morte : elle fermente. Ce qu'elle perd, c'est le **rendement** — $2$ ATP au lieu de $38$.
:::

## La mitochondrie, une structure faite pour sa fonction

:::propriete Structure et fonction
| Caractère structural | Fonction qu'il permet |
| --- | --- |
| **Deux membranes** | délimiter deux compartiments et permettre un **gradient** entre eux |
| Membrane interne **repliée en crêtes** | multiplier la **surface** disponible pour la chaîne respiratoire |
| Membrane interne riche en **enzymes** | porter les transporteurs d'électrons |
| **Sphères pédonculées** tournées vers la matrice | synthétiser l'ATP à partir du flux de protons |
| **Matrice** enzymatique | abriter le cycle de Krebs |
:::

:::remarque Un raisonnement à réutiliser
« Plus de crêtes ⇒ plus de surface ⇒ plus de chaîne respiratoire ⇒ plus d'ATP. » C'est pour cela que les mitochondries des cellules très actives — muscle cardiaque, muscle de vol des insectes — ont des crêtes particulièrement nombreuses et serrées.
:::

## Le schéma bilan : l'ATP au centre

:::propriete Le bilan du domaine
D'un côté, les réactions qui **libèrent** de l'énergie : respiration et fermentation, qui dégradent la matière organique et **produisent** de l'ATP.

De l'autre, les réactions qui **consomment** de l'énergie : contraction musculaire, transport actif, synthèses, qui **hydrolysent** l'ATP.

Entre les deux, une seule molécule fait le lien :
$$\mathrm{ADP + Pi \;\rightleftharpoons\; ATP}$$
L'ATP est l'**intermédiaire énergétique** obligatoire. Rien ne passe directement du glucose au travail cellulaire.
:::

:::attention Ce schéma bilan est explicitement exigé
Le programme demande, en fin de domaine, un **schéma bilan** reliant les réactions qui libèrent l'énergie à celles qui la consomment, en montrant le rôle de l'ATP. Sache le construire : deux blocs, une flèche dans chaque sens, l'ATP au centre, et la **chaleur** comme perte à chaque conversion.
:::

:::app Applique
On compare trois types cellulaires :

| Cellule | Mitochondries | $\mathrm{O_2}$ consommé | Produit final du glucose |
| --- | --- | --- | --- |
| Cellule hépatique | très nombreuses | fort | $\mathrm{CO_2}$ et $\mathrm{H_2O}$ |
| Globule rouge | **aucune** | nul | acide lactique |
| Cellule musculaire au repos | nombreuses | modéré | $\mathrm{CO_2}$ et $\mathrm{H_2O}$ |

**1.** Quel métabolisme pour chaque cellule ?
**2.** Que démontre la comparaison entre la cellule hépatique et le globule rouge ?
**3.** Pour $1\ \mathrm{mmol}$ de glucose, combien d'ATP chacune produit-elle ?

:::solution
**1.** Cellule hépatique et cellule musculaire au repos : **respiration** — elles ont des mitochondries, consomment de l'$\mathrm{O_2}$ et oxydent le glucose **complètement**. Globule rouge : **fermentation lactique** — pas de mitochondries, pas d'$\mathrm{O_2}$ consommé, et un produit organique encore oxydable.

**2.** Elle démontre que la **mitochondrie est indispensable à la respiration**. Les deux cellules reçoivent le même glucose et le même dioxygène ; la seule différence est la présence de mitochondries, et c'est exactement celle qui sépare respiration et fermentation. C'est un raisonnement de **corrélation structure-fonction**.

**3.** Hépatique et musculaire : $$1 \times 38 = 38\ \mathrm{mmol\ d'ATP}$$
Globule rouge : $$1 \times 2 = 2\ \mathrm{mmol\ d'ATP}$$
:::
:::

:::funnel La cellule, siège du métabolisme
:::

:::funnel Approfondissement de la libération d'énergie
:::

### Résumé de la leçon

:::aretenir L'ATP
$$\mathrm{ATP \rightarrow ADP + Pi} \qquad \Delta E \approx 30{,}5\ \mathrm{kJ\cdot mol^{-1}}$$
C&apos;est un **intermédiaire**, pas un stock : réserves très faibles, renouvellement permanent.
:::

:::aretenir 36 ou 38 ?
Les 2 NADH,H⁺ de la **glycolyse** doivent entrer dans la mitochondrie par des **navettes**, qui peuvent coûter de l&apos;énergie ⇒ 36 au lieu de 38.
**Au BAC marocain : 38.**
:::

:::aretenir Le QR identifie le carburant
Glucides $QR = 1$ · protides $\approx 0{,}8$ · lipides $\approx 0{,}7$.
Le muscle, lui, utilise essentiellement le **glucose**.
:::

:::aretenir Les 3 conditions de la synthèse d'ATP
**ADP + Pi** · un **gradient de H⁺** exploitable (dans la mitochondrie : de l&apos;espace intermembranaire **vers la matrice**) · les **sphères pédonculées**.
Retirer l&apos;une des trois arrête tout.
:::

:::aretenir Le flux d'énergie
Photosynthèse (**stocke** l&apos;énergie lumineuse) et respiration (**libère**) sont deux équations inverses. L&apos;ATP est l&apos;intermédiaire ; la chaleur, la perte à chaque étape.
:::

:::aretenir Qui fait quoi
| Compartiment | Étape |
| --- | --- |
| **Hyaloplasme** | glycolyse · fermentation entière |
| **Matrice** | pyruvate + cycle de Krebs |
| **Membrane interne** | chaîne respiratoire + ATP |
:::

:::aretenir Structure et fonction
Deux membranes ⇒ **gradient** possible. Crêtes ⇒ **surface** multipliée. Sphères pédonculées ⇒ **ATP**. Matrice ⇒ **Krebs**.
Plus de crêtes ⇒ plus d&apos;ATP.
:::

:::attention Le schéma bilan exigé
Réactions **libérant** l&apos;énergie → **ATP** → réactions la **consommant**, avec la **chaleur** comme perte. L&apos;ATP est l&apos;intermédiaire obligatoire.
:::

---

<!-- leçon 60 · cours -->

# Leçon — Étude expérimentale : respiration et fermentation

**Objectifs :** Décrire un montage ExAO et justifier le rôle de chaque élément
Décrire et interpréter les courbes de O2 et de CO2 au cours du temps
Identifier le passage de la respiration à la fermentation sur une courbe
Calculer une vitesse de consommation de dioxygène
Interpréter l'expérience du broyat pour localiser les deux métabolismes

## Le montage ExAO

:::definition ExAO
L'**ExAO** — expérimentation assistée par ordinateur — permet de suivre **en continu** une grandeur au cours du temps grâce à des **sondes** reliées à un ordinateur. Pour la bioénergétique, on utilise une **sonde à dioxygène** (oxymètre) et une **sonde à $\mathrm{CO_2}$**, plongées dans une enceinte fermée contenant la suspension cellulaire.
:::

[[fig:svt-exao]] Montage ExAO pour l'étude de la respiration et de la fermentation

:::propriete Les éléments du montage et leur rôle
| Élément | Rôle |
| --- | --- |
| **Enceinte fermée** | éviter tout échange avec l'air extérieur, qui fausserait les mesures |
| **Sonde à O₂** | mesurer en continu la concentration en dioxygène |
| **Sonde à CO₂** | mesurer en continu le dioxyde de carbone rejeté |
| **Agitateur** | homogénéiser le milieu pour que la sonde mesure bien l'ensemble |
| **Thermostat** | maintenir la température constante, l'activité enzymatique en dépendant |
| **Suspension de levures** | le matériel vivant étudié |
:::

:::attention
Sans **agitation**, la sonde ne mesure que son voisinage immédiat et la courbe est fausse. Sans **enceinte fermée**, l'$\mathrm{O_2}$ de l'air compense la consommation et l'on ne voit rien. Ces deux justifications tombent régulièrement.
:::

## L'expérience de référence

:::experience Mise en évidence de la respiration puis de la fermentation
**Protocole.** On place une suspension de levures dans l'enceinte fermée, sans substrat. On enregistre $[\mathrm{O_2}]$ et $[\mathrm{CO_2}]$. À la date $t_1$, on **injecte du glucose**. On laisse l'expérience se poursuivre longtemps.

**Résultats.**
[[fig:svt-exao]]
- Avant $t_1$ : $[\mathrm{O_2}]$ diminue **lentement**, $[\mathrm{CO_2}]$ augmente lentement.
- Après $t_1$ : la pente de $[\mathrm{O_2}]$ devient **beaucoup plus forte**, et $[\mathrm{CO_2}]$ augmente rapidement.
- Plus tard, $[\mathrm{O_2}]$ atteint **zéro** et se stabilise : la courbe devient **horizontale**. Mais $[\mathrm{CO_2}]$ **continue d'augmenter**.

**Interprétation.** Avant l'injection, les levures respirent leurs faibles réserves. L'ajout de **glucose** accélère fortement la respiration : plus de substrat, donc plus d'oxydation. Quand tout l'$\mathrm{O_2}$ de l'enceinte est **épuisé**, la respiration devient impossible — et pourtant du $\mathrm{CO_2}$ continue d'apparaître : les levures sont passées en **fermentation alcoolique**, qui produit du $\mathrm{CO_2}$ sans consommer d'$\mathrm{O_2}$.
:::

:::methode Exploiter une courbe ExAO
1. **Décrire** chaque portion : la grandeur augmente-t-elle, diminue-t-elle, se stabilise-t-elle ? Repérer les **ruptures de pente** et les relier à ce qu'on a fait à cet instant (injection, épuisement).
2. **Calculer une vitesse** : c'est la **pente** de la tangente,
$$v = \frac{\Delta[\mathrm{O_2}]}{\Delta t}$$
3. **Interpréter** : une pente plus forte = une activité plus intense ; un plateau = un réactif épuisé ou une voie bloquée.
:::

:::exemple Calculer une vitesse de respiration
Entre $t = 2\ \mathrm{min}$ et $t = 6\ \mathrm{min}$, $[\mathrm{O_2}]$ passe de $260$ à $180\ \mathrm{µmol\cdot L^{-1}}$.
$$v = \frac{260 - 180}{6 - 2} = \frac{80}{4} = 20\ \mathrm{µmol\cdot L^{-1}\cdot min^{-1}}$$
:::

## Les expériences complémentaires

:::experience Le rôle de la mitochondrie
**Protocole.** On compare, dans le même montage, une suspension de cellules **intactes** et un **broyat** de ces cellules dont on a retiré les mitochondries par centrifugation, les deux avec du glucose et de l'$\mathrm{O_2}$.

**Résultats.** Les cellules intactes consomment de l'$\mathrm{O_2}$ et rejettent du $\mathrm{CO_2}$. Le broyat sans mitochondries **ne consomme pas d'$\mathrm{O_2}$** ; il produit tout de même un peu de $\mathrm{CO_2}$ et de l'éthanol.

**Interprétation.** La **respiration exige les mitochondries** : c'est là que se trouvent le cycle de Krebs et la chaîne respiratoire. La **fermentation**, elle, se poursuit sans elles, puisqu'elle est entièrement **hyaloplasmique**. L'expérience localise donc les deux métabolismes.
:::

:::app Étude documentaire
On suit à l'ExAO une suspension de levures en enceinte fermée. Le glucose est injecté à $t = 3\ \mathrm{min}$.

| $t$ (min) | $0$ | $3$ | $6$ | $9$ | $12$ | $15$ |
| --- | --- | --- | --- | --- | --- | --- |
| $[\mathrm{O_2}]$ (µmol·L⁻¹) | $250$ | $240$ | $150$ | $60$ | $0$ | $0$ |
| $[\mathrm{CO_2}]$ (µmol·L⁻¹) | $10$ | $20$ | $110$ | $200$ | $270$ | $320$ |

**1.** Décris l'évolution de $[\mathrm{O_2}]$ et justifie la rupture de pente.
**2.** Calcule la vitesse de consommation d'$\mathrm{O_2}$ avant et après l'injection.
**3.** Que se passe-t-il entre $12$ et $15\ \mathrm{min}$ ? Justifie par les deux courbes.
**4.** Comment confirmerais-tu ton interprétation ?

:::solution
**1.** $[\mathrm{O_2}]$ diminue **lentement** de $0$ à $3\ \mathrm{min}$, puis **beaucoup plus vite** de $3$ à $12\ \mathrm{min}$, puis reste **nulle**. La rupture de pente à $t = 3\ \mathrm{min}$ coïncide avec l'**injection de glucose** : le substrat étant devenu abondant, la respiration s'intensifie.

**2.** Avant l'injection :
$$v_1 = \frac{250 - 240}{3 - 0} = \frac{10}{3} = 3{,}3\ \mathrm{µmol\cdot L^{-1}\cdot min^{-1}}$$
Après :
$$v_2 = \frac{240 - 60}{9 - 3} = \frac{180}{6} = 30\ \mathrm{µmol\cdot L^{-1}\cdot min^{-1}}$$
La vitesse est multipliée par environ **9**.

**3.** $[\mathrm{O_2}]$ est **nulle** : la respiration est impossible. Pourtant $[\mathrm{CO_2}]$ continue de monter, de $270$ à $320\ \mathrm{µmol\cdot L^{-1}}$. Un métabolisme produit donc encore du $\mathrm{CO_2}$ **sans** dioxygène : c'est la **fermentation alcoolique**.

**4.** En cherchant l'**éthanol** en fin d'expérience — c'est le produit qui signe la fermentation alcoolique, et que la respiration ne produit jamais. On peut aussi faire barboter le gaz dégagé dans de l'**eau de chaux**, qui se troublera, confirmant qu'il s'agit bien de $\mathrm{CO_2}$.
:::
:::

:::funnel Étude expérimentale de la respiration
:::

### Résumé de la leçon

:::aretenir Le montage et les justifications
**Enceinte fermée** (pas d&apos;échange avec l&apos;air) · **agitateur** (homogénéiser) · **thermostat** (activité enzymatique) · sondes **O₂** et **CO₂**.
:::

:::aretenir La courbe de référence
Injection de glucose ⇒ la pente de $[\mathrm{O_2}]$ **s&apos;accentue**.
$[\mathrm{O_2}] = 0$ mais $[\mathrm{CO_2}]$ **continue de monter** ⇒ passage en **fermentation alcoolique**.
:::

:::aretenir Calculer une vitesse
$$v = \frac{\Delta[\mathrm{O_2}]}{\Delta t}$$
C&apos;est la **pente** : plus forte = activité plus intense ; plateau = réactif épuisé.
:::

:::aretenir L'expérience du broyat
Sans mitochondries : **plus de respiration**, mais la **fermentation continue**.
⇒ respiration = mitochondrie ; fermentation = hyaloplasme.
:::

:::attention
Toujours **décrire** la courbe (pentes, ruptures, plateaux) **avant** d&apos;interpréter.
:::
