# File de travail — ce qui reste sur le PC

14 chapitres, ~500 questions. Ordre conseillé : finir `pc-champ-pesanteur`, puis la chimie dans
l'ordre ci-dessous (il suit la progression du cours), puis les deux chapitres `pc-specifique`.

Chaque bloc donne la **cible**, l'**état**, et une **fiche scientifique** : les relations à
employer telles quelles, et les pièges classiques dont faire des distracteurs. **N'invente rien
hors de ces fiches** ; si une notion du scaffold demande davantage, donne la formule dans l'énoncé
et signale-le.

Pour tous : `g = 9{,}8\ \mathrm{m\,s^{-2}}`, `F = 9{,}65\times10^{4}\ \mathrm{C\,mol^{-1}}`,
`K_e = 10^{-14}` à 25 °C, sauf mention contraire dans l'énoncé.

---

## 0. `pc-commun/pc-champ-pesanteur.json` — **à finir**

Les **56 QCU sont écrites**. Il manque les **2 problèmes** et la **série 3**.
Recharge avec `Chapter('pc-commun/pc-champ-pesanteur.json', base=OUT)`, lis les QCU existantes
pour ne pas les dupliquer, et compose la série 3 avec `C.all_qrefs()`.

Rappels : $a_x = 0$, $a_y = -g$ ; $x = v_0\cos\alpha\,t$, $y = -\frac12 gt^2 + v_0\sin\alpha\,t + y_0$ ;
trajectoire $y = -\frac{g}{2v_0^2\cos^2\alpha}x^2 + x\tan\alpha + y_0$ ; sommet à $t_S = \frac{v_0\sin\alpha}{g}$,
$y_S = y_0 + \frac{v_0^2\sin^2\alpha}{2g}$ ; portée depuis le sol $x_P = \frac{v_0^2\sin 2\alpha}{g}$,
maximale à $45^\circ$. **La masse n'intervient pas.**

---

# Chimie de `pc-commun`

## 1. `pc-transfo-lente-rapide.json` — 38 QCU

Couples oxydant/réducteur, demi-équations électroniques, équation d'oxydoréduction obtenue en
égalisant les électrons échangés. Oxydant = capte des électrons (il est réduit) ; réducteur = cède
des électrons (il est oxydé).

Transformations **rapides** (quasi instantanées à notre échelle : précipitation, acide-base) et
**lentes** (suivi possible dans le temps). **Facteurs cinétiques** : température, concentrations
initiales des réactifs, catalyseur, parfois solvant. Un facteur cinétique agit sur la **vitesse**,
jamais sur l'état final. La **trempe** (refroidissement brusque, souvent avec dilution) **bloque**
l'évolution pour permettre un titrage.

*Pièges* : croire qu'un facteur cinétique change l'avancement final ; croire qu'un catalyseur
apparaît dans l'équation ou se consomme ; confondre « rapide » et « totale » ; oublier d'équilibrer
les charges dans une demi-équation ; oublier les H⁺ et H₂O en milieu acide.

## 2. `pc-vitesse-reaction.json` — 42 QCU

**Tableau d'avancement** : $n_i = n_{i,0} - \nu_i x$ pour un réactif, $+\nu_i x$ pour un produit.
$x_{max}$ est fixé par le **réactif limitant** ($x_{max} = \min(n_{i,0}/\nu_i)$).
**Mélange stœchiométrique** : tous les rapports $n_{i,0}/\nu_i$ sont égaux.

**Vitesse volumique de réaction** : $v = \frac{1}{V}\cdot\frac{dx}{dt}$, en $\mathrm{mol\,L^{-1}\,s^{-1}}$ ;
elle se lit comme la **pente de la tangente** à la courbe $x(t)$, divisée par $V$. Elle **décroît**
au cours du temps parce que les concentrations des réactifs diminuent.

**Temps de demi-réaction** $t_{1/2}$ : date à laquelle $x = \frac{x_f}{2}$ (prendre $x_f$, pas
$x_{max}$, si la réaction n'est pas totale).

Techniques de suivi : conductimétrie, pH-métrie, manométrie ($n = \frac{PV}{RT}$),
spectrophotométrie (loi de Beer-Lambert $A = k\ell C$), titrage après trempe.

*Pièges* : oublier le $\frac{1}{V}$ ; lire la pente d'une **corde** au lieu de la tangente ;
confondre $t_{1/2}$ et la durée totale ; croire la vitesse croissante ; se tromper de réactif
limitant en oubliant les coefficients stœchiométriques ; confondre vitesse de réaction et vitesse
de disparition d'un réactif (rapport $\nu_i$).

## 3. `pc-equilibre.json` — 34 QCU

Transformation **non totale** : les deux sens coexistent et le système atteint un **équilibre
dynamique** où les deux réactions opposées se poursuivent à la même vitesse — les quantités
n'évoluent plus, mais rien n'est arrêté. Réactifs **et** produits coexistent à l'état final.

**Taux d'avancement final** $\tau = \frac{x_f}{x_{max}}$, avec $0 < \tau \le 1$ ; $\tau = 1$ pour une
réaction totale. Une réaction limitée a $\tau < 1$.

*Pièges* : croire qu'à l'équilibre les réactions s'arrêtent ; croire que $\tau$ ne dépend que de la
réaction (il dépend aussi de l'état initial et de la dilution) ; calculer $\tau$ avec $x_f$ au
dénominateur ; croire que l'équilibre impose des concentrations égales.

## 4. `pc-quotient-reaction.json` — 38 QCU

Pour $a\mathrm{A} + b\mathrm{B} \rightleftharpoons c\mathrm{C} + d\mathrm{D}$ :
$$Q_r = \frac{[\mathrm{C}]^c\,[\mathrm{D}]^d}{[\mathrm{A}]^a\,[\mathrm{B}]^b}$$
concentrations en $\mathrm{mol\,L^{-1}}$. **N'y figurent pas** : les **solides**, ni l'**eau
solvant**. Les gaz, au niveau 2bac marocain, sont traités par leur concentration.
$Q_r$ est **sans unité**.

À l'équilibre, $Q_{r,\text{éq}} = K$, la **constante d'équilibre**, qui **ne dépend que de la
température** — ni de l'état initial, ni de la dilution. En revanche le **taux d'avancement final**
dépend, lui, de l'état initial et de la dilution.

*Pièges* : inclure un solide ou l'eau dans $Q_r$ ; oublier les exposants stœchiométriques ;
inverser numérateur et dénominateur ; donner une unité à $K$ ; croire que $K$ dépend des
concentrations initiales ; confondre $K$ et $\tau$.

## 5. `pc-acide-base.json` — 36 QCU

Acide de Brønsted = cède un proton ; base = capte un proton ; couple $\mathrm{AH}/\mathrm{A^-}$.
$$\mathrm{pH} = -\log[\mathrm{H_3O^+}] \qquad [\mathrm{H_3O^+}] = 10^{-\mathrm{pH}}$$
$$K_e = [\mathrm{H_3O^+}][\mathrm{HO^-}] = 10^{-14} \ \text{à } 25\,^\circ\mathrm{C}, \quad \mathrm{pK}_e = 14$$
Acide **fort** : totalement dissocié, $\tau = 1$, et $[\mathrm{H_3O^+}] = C$ donc $\mathrm{pH} = -\log C$.
Acide **faible** : $\tau < 1$, et $\mathrm{pH} > -\log C$.
$$K_A = \frac{[\mathrm{A^-}][\mathrm{H_3O^+}]}{[\mathrm{AH}]} \qquad \mathrm{pK}_A = -\log K_A$$
$$\mathrm{pH} = \mathrm{pK}_A + \log\frac{[\mathrm{A^-}]}{[\mathrm{AH}]}$$
**Diagramme de prédominance** : $\mathrm{AH}$ prédomine si $\mathrm{pH} < \mathrm{pK}_A$,
$\mathrm{A^-}$ si $\mathrm{pH} > \mathrm{pK}_A$, égalité des concentrations si $\mathrm{pH} = \mathrm{pK}_A$.
Plus $K_A$ est grand (donc $\mathrm{pK}_A$ petit), plus l'acide est fort.

*Pièges* : confondre « acide fort » et « solution concentrée » ; oublier le signe du log ;
intervertir $\mathrm{AH}$ et $\mathrm{A^-}$ dans la prédominance ; croire $\mathrm{pK}_A$ d'autant plus
grand que l'acide est fort ; utiliser $\mathrm{pH} = -\log C$ pour un acide faible ; oublier que
$K_e$ dépend de la température.

## 6. `pc-dosage.json` — 50 QCU

**Équivalence** : les réactifs ont été introduits dans les **proportions stœchiométriques** ; avant,
le réactif titré est en excès, après c'est le réactif titrant. Pour un dosage $1{:}1$ :
$$C_A V_A = C_B V_{B,E}$$
**Repérage** : pH-métrie (saut de pH, **point d'inflexion** repéré par la **méthode des tangentes**
ou par le maximum de la **courbe dérivée** $\frac{d\mathrm{pH}}{dV}$) ; conductimétrie (rupture de
pente de $\sigma = f(V)$) ; indicateur coloré.
**Choix de l'indicateur** : sa **zone de virage** doit contenir le pH à l'équivalence.
Acide fort / base forte : $\mathrm{pH}_E = 7$ à 25 °C. Acide faible / base forte : $\mathrm{pH}_E > 7$.
Base faible / acide fort : $\mathrm{pH}_E < 7$.
À la **demi-équivalence** d'un acide faible : $\mathrm{pH} = \mathrm{pK}_A$ — c'est ainsi qu'on
détermine un $\mathrm{pK}_A$.

*Pièges* : confondre équivalence et neutralité (pH = 7) ; croire $\mathrm{pH}_E = 7$ pour un acide
faible ; oublier les coefficients stœchiométriques dans $C_AV_A = C_BV_E$ ; prendre le volume total
au lieu du volume versé ; choisir un indicateur dont la zone de virage est hors du saut ; lire
$\mathrm{pK}_A$ à l'équivalence au lieu de la demi-équivalence ; oublier la dilution quand on prélève.

## 7. `pc-sens-evolution.json` — 28 QCU

**Critère d'évolution spontanée** : on compare le quotient de réaction **dans l'état initial**
$Q_{r,i}$ à la constante $K$.

| Comparaison | Évolution |
|---|---|
| $Q_{r,i} < K$ | sens **direct** (1), de gauche à droite : $Q_r$ augmente vers $K$ |
| $Q_{r,i} > K$ | sens **inverse** (2) : $Q_r$ diminue vers $K$ |
| $Q_{r,i} = K$ | système **à l'équilibre**, aucune évolution |

Dans tous les cas $Q_r$ **évolue vers $K$**. Application aux piles : le sens d'évolution donne la
polarité et le sens du courant.

*Pièges* : inverser le critère ; comparer $Q_{r,i}$ à $1$ au lieu de $K$ ; croire que l'évolution
dépend des quantités absolues plutôt que du quotient ; oublier d'exclure solides et eau de $Q_{r,i}$.

## 8. `pc-piles.json` — 14 QCU

Une pile exploite une transformation d'oxydoréduction **spontanée**.
**Anode** : siège de l'**oxydation**, pôle **négatif** d'une pile. **Cathode** : siège de la
**réduction**, pôle **positif**. (Moyen mnémotechnique : *an*ode / *ox*ydation.)
À l'extérieur, le courant va du **pôle + vers le pôle −** ; les **électrons** circulent en sens
inverse, de l'anode vers la cathode. Le **pont salin** assure la neutralité électrique et ferme le
circuit, sans y faire circuler d'électrons (ce sont des **ions** qui s'y déplacent).
$$Q = I\,\Delta t = n(e^-)\,F \qquad F = 9{,}65\times10^{4}\ \mathrm{C\,mol^{-1}}$$
La pile est **épuisée** quand le système atteint l'équilibre ($Q_r = K$), donc quand le réactif
limitant est consommé.

*Pièges* : placer l'oxydation à la cathode ; confondre sens du courant et sens des électrons ;
croire que les électrons traversent le pont salin ; oublier le nombre d'électrons échangés dans
$n(e^-)$ ; croire la pile épuisée quand la f.é.m. est encore non nulle.

## 9. `pc-electrolyse.json` — 33 QCU

Transformation **forcée** : un générateur impose au système d'évoluer **dans le sens inverse** de
son évolution spontanée, donc en **éloignant** $Q_r$ de $K$.
L'électrode reliée au **pôle + du générateur** est l'**anode**, siège de l'**oxydation** ;
celle reliée au **pôle −** est la **cathode**, siège de la **réduction**. (La règle
anode/oxydation est donc la **même** que pour une pile : ce qui change, c'est la polarité.)
$$Q = I\,\Delta t = n(e^-)\,F$$
et la masse déposée se déduit de $n(e^-)$ par la demi-équation, puis $m = n\,M$.
Applications : électrolyse de l'eau, dépôts électrolytiques (galvanoplastie), recharge
d'accumulateur, production industrielle d'aluminium et de dichlore.

*Pièges* : inverser anode et cathode à cause de la polarité ; croire que l'oxydation passe à la
cathode en électrolyse ; oublier le nombre d'électrons dans le calcul de masse ; confondre $Q$
(charge, en coulombs) et $Q_r$ (quotient de réaction) ; croire qu'une électrolyse rapproche
$Q_r$ de $K$.

## 10. `pc-ester-hydrolyse.json` — 48 QCU

$$\text{acide carboxylique} + \text{alcool} \rightleftharpoons \text{ester} + \text{eau}$$
Réaction **lente**, **limitée** (équilibre) et **athermique** : elle ne dégage ni n'absorbe de
chaleur de façon notable. L'**hydrolyse** de l'ester est la réaction **inverse**.
Nomenclature : l'ester s'écrit *…oate de …yle*.

**Ce qui accélère sans déplacer l'équilibre** : la **température** et le **catalyseur** (acide
sulfurique concentré), le **chauffage à reflux** (qui accélère sans perte de matière).
**Ce qui déplace l'équilibre** et augmente le rendement : l'**excès** d'un réactif, ou
l'**élimination** continue d'un produit (distiller l'ester, piéger l'eau).

Rendement $r = \frac{n_{\text{ester formé}}}{n_{\text{ester théorique}}}$. Pour un mélange
équimolaire d'acide et d'alcool **primaire**, le rendement d'équilibre vaut environ **67 %** ;
il est plus faible pour un alcool secondaire, et nettement plus faible pour un tertiaire.

**Réactions totales** : avec un **anhydride d'acide** ou un **chlorure d'acyle** au lieu de l'acide,
l'estérification devient rapide et **totale**. La **saponification** (ester + base forte) est
également **totale**.

*Pièges* : croire que le catalyseur augmente le rendement ; croire que le reflux déplace
l'équilibre ; croire la réaction exothermique ; confondre estérification et saponification ;
oublier que l'eau produite limite la réaction ; croire que doubler les deux réactifs change le
rendement (il faut un **excès de l'un**).

## 11. `pc-controle-evolution.json` — 35 QCU

Chapitre de synthèse : **comment agir** sur un système chimique.
- Changer de **réactif** pour rendre la réaction totale (anhydride d'acide, chlorure d'acyle).
- **Déplacer** un équilibre : excès d'un réactif, élimination d'un produit.
- **Catalyse** : homogène (même phase), hétérogène (phases différentes, catalyseur solide),
  **enzymatique** (très sélective). Un catalyseur accélère **les deux sens**, n'apparaît pas dans
  l'équation, n'est pas consommé, et **ne modifie pas** l'état d'équilibre.
- **Rendement** et **sélectivité**.
- **Corrosion** et protection : protection par **anode sacrificielle** (métal plus réducteur, qui
  s'oxyde à la place), protection par revêtement, protection cathodique par courant imposé.
- **Transformations forcées** : électrolyse, recharge d'accumulateur.

*Pièges* : croire qu'un catalyseur n'accélère qu'un sens ; croire qu'il déplace l'équilibre ;
confondre protection cathodique et anode sacrificielle, ou prendre pour anode sacrificielle un
métal **moins** réducteur que celui à protéger.

---

# `pc-specifique` (PC, SM-A, SM-B)

## 12. `pc-specifique/pc-modulation.json` — 27 QCU

Signal **modulant** $s(t)$ de basse fréquence $f$ ; **porteuse** $p(t) = P_m\cos(2\pi F t)$ de haute
fréquence $F$. Un **multiplieur** délivre
$$u(t) = k\,\bigl(s(t) + U_0\bigr)\,p(t)$$
**Taux de modulation** $m = \dfrac{S_m}{U_0}$, où $S_m$ est l'amplitude du signal modulant et $U_0$
la composante continue ajoutée.
**Condition de bonne modulation** : $m < 1$. Si $m > 1$ il y a **surmodulation**, et l'enveloppe ne
reproduit plus le signal : la démodulation par détection d'enveloppe devient impossible.
Deuxième condition : $F \gg f$ (en pratique $F$ au moins une centaine de fois $f$), sinon l'enveloppe
n'est pas lisible.
Mesure sur l'oscillogramme :
$$m = \frac{A_{max} - A_{min}}{A_{max} + A_{min}}$$
**Spectre** du signal modulé : la raie de la **porteuse** à $F$, et les deux raies latérales à
$F - f$ et $F + f$.
**Démodulation** en deux étapes : (1) **détection d'enveloppe** par diode suivie d'un filtre $RC$,
avec la condition $\dfrac{1}{F} \ll RC \ll \dfrac{1}{f}$ ; (2) **élimination de la composante
continue** par un condensateur de liaison (filtre passe-haut).

*Pièges* : confondre $F$ et $f$ ; croire la bonne modulation obtenue pour $m > 1$ ; inverser
numérateur et dénominateur dans $m$ ; oublier une raie latérale dans le spectre ; choisir un $RC$
hors de l'encadrement ; oublier la deuxième étape de la démodulation ; confondre amplitude du
modulant et composante continue.

## 13. `pc-specifique/pc-atome-newton.json` — 22 QCU

**Insuffisance de la mécanique de Newton** à l'échelle de l'atome : appliquée à l'électron, elle
prévoit un rayonnement continu et la chute de l'électron sur le noyau, et elle ne rend compte ni
de la stabilité de l'atome ni du caractère **discontinu** des spectres observés.

**Quantification** : l'énergie de l'atome ne prend que des valeurs **discrètes** $E_n$.
Pour l'atome d'hydrogène :
$$E_n = -\frac{E_0}{n^2}, \qquad E_0 = 13{,}6\ \mathrm{eV}, \qquad n \in \mathbb{N}^*$$
$n = 1$ est l'**état fondamental** ($-13{,}6\ \mathrm{eV}$), $n \ge 2$ les **états excités**,
$n \to \infty$ la limite d'**ionisation** ($E = 0$). L'**énergie d'ionisation** depuis le
fondamental vaut donc $13{,}6\ \mathrm{eV}$.

**Transition** entre deux niveaux : émission d'un photon lors d'une descente, absorption lors d'une
montée, avec
$$|\Delta E| = \bigl|E_p - E_n\bigr| = h\nu = \frac{hc}{\lambda}$$
$h = 6{,}63\times10^{-34}\ \mathrm{J\,s}$, $c = 3{,}00\times10^{8}\ \mathrm{m\,s^{-1}}$,
$1\ \mathrm{eV} = 1{,}6\times10^{-19}\ \mathrm{J}$.
**Spectres de raies** : d'émission (raies brillantes sur fond noir) et d'absorption (raies noires
sur fond continu) ; ils sont la **signature** de l'élément. Un photon n'est absorbé que si son
énergie correspond **exactement** à un écart entre deux niveaux.

*Pièges* : oublier de convertir les eV en joules avant d'utiliser $h$ ; oublier le signe moins de
$E_n$ ou le carré de $n$ ; confondre énergie du niveau et énergie de transition ; utiliser
$\lambda = h\nu$ au lieu de $\lambda = \frac{hc}{|\Delta E|}$ ; croire qu'un photon d'énergie
supérieure à l'écart peut être partiellement absorbé ; confondre état fondamental et niveau $n = 0$
(qui n'existe pas).
