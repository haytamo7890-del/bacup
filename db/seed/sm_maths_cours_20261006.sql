-- SM maths cours rewrite (2026-10-06), sm_a and sm_b share the same content.
-- Idempotent: updates lessons in place by (chapter code, position). Backup of the previous text: table lessons_backup_20261006.

update lessons l set title=$T$Divisibilité, division euclidienne, nombres premiers$T$, kind='cours', body=$L$## Divisibilité et division euclidienne

:::definition
Soient $a, b \in \mathbb{Z}$. On dit que $a$ **divise** $b$ (noté $a \mid b$) s'il existe $k \in \mathbb{Z}$ tel que $b = ka$. On dit aussi que $b$ est un **multiple** de $a$.
:::

:::propriete
- $a \mid a$ ; si $a \mid b$ et $b \mid c$, alors $a \mid c$.
- Si $a \mid b$ et $b \mid a$, alors $a = \pm b$.
- Si $a \mid b$ et $a \mid c$, alors $a \mid (\alpha b + \beta c)$ pour tous $\alpha, \beta \in \mathbb{Z}$.
:::

:::exemple Utiliser une combinaison
Trouvons les entiers $n$ tels que $n + 2$ divise $3n + 11$. Comme $n + 2 \mid 3(n + 2) = 3n + 6$, on a $n + 2 \mid (3n + 11) - (3n + 6) = 5$. Donc $n + 2 \in \{-5, -1, 1, 5\}$, soit $n \in \{-7, -3, -1, 3\}$, et l'on vérifie que ces valeurs conviennent.
:::

:::theoreme Division euclidienne
Pour tout $a \in \mathbb{Z}$ et tout $b \in \mathbb{N}^*$, il existe un **unique** couple $(q, r) \in \mathbb{Z} \times \mathbb{N}$ tel que
$$a = bq + r \qquad\text{et}\qquad 0 \leqslant r < b.$$
$q$ est le **quotient** et $r$ le **reste**. $b \mid a \iff r = 0$.
:::

:::exemple
$-17 = 5 \times (-4) + 3$ : quotient $-4$, reste $3$ (et non $-17 = 5 \times (-3) - 2$, car un reste doit être positif).
:::

:::methode Raisonner sur les restes
Tout entier s'écrit $n = bq + r$ avec $r \in \{0, \ldots, b - 1\}$. Pour démontrer une propriété, on peut étudier les $b$ cas. Exemple : $n(n + 1)(n + 2)$ est divisible par $3$ car l'un des trois facteurs consécutifs est multiple de $3$ (un raisonnement selon le reste de $n$ modulo $3$ le confirme).
:::

## Nombres premiers et décomposition

:::definition
Un entier $p \geqslant 2$ est **premier** s'il n'a que deux diviseurs positifs : $1$ et $p$. Les premiers sont $2, 3, 5, 7, 11, 13, \ldots$ ; $1$ n'est pas premier.
:::

:::theoreme
1. Tout entier $n \geqslant 2$ admet au moins un diviseur premier.
2. Si $n \geqslant 2$ n'est pas premier, il admet un diviseur premier $p$ tel que $p^2 \leqslant n$.
3. Il existe une infinité de nombres premiers.
:::

:::demonstration Infinité des nombres premiers
Supposons qu'il n'y en ait qu'un nombre fini $p_1, \ldots, p_k$, et posons $N = p_1p_2\cdots p_k + 1$. $N \geqslant 2$ admet un diviseur premier $p_i$. Alors $p_i \mid N$ et $p_i \mid p_1\cdots p_k$, donc $p_i \mid 1$ : absurde.
:::

:::methode Tester si $n$ est premier
Tester la divisibilité de $n$ par tous les nombres premiers $p$ tels que $p^2 \leqslant n$. Si aucun ne divise $n$, alors $n$ est premier. Exemple : $211$ ; $\sqrt{211} \approx 14{,}5$ ; ni $2$, $3$, $5$, $7$, $11$, $13$ ne divisent $211$ : il est premier.
:::

:::theoreme Décomposition en facteurs premiers
Tout entier $n \geqslant 2$ s'écrit de façon unique (à l'ordre près) $n = p_1^{\alpha_1}p_2^{\alpha_2}\cdots p_k^{\alpha_k}$, avec $p_1 < \cdots < p_k$ premiers et $\alpha_i \geqslant 1$.
:::

:::propriete Diviseurs
Les diviseurs positifs de $n$ sont les $p_1^{\beta_1}\cdots p_k^{\beta_k}$ avec $0 \leqslant \beta_i \leqslant \alpha_i$ ; leur nombre est $(\alpha_1 + 1)(\alpha_2 + 1)\cdots(\alpha_k + 1)$.
:::

:::exemple
$360 = 2^3 \times 3^2 \times 5$ a $(3 + 1)(2 + 1)(1 + 1) = 24$ diviseurs positifs.
:::

:::app Applique
Montre que pour tout entier $n$, $n^3 - n$ est divisible par $6$.
:::solution Correction
$n^3 - n = (n - 1)n(n + 1)$ est le produit de trois entiers consécutifs. Parmi eux, l'un est pair et l'un est multiple de $3$. Le produit est donc divisible par $2$ et par $3$, qui sont premiers entre eux, donc par $6$.
:::
:::

:::aretenir
- $a \mid b$ et $a \mid c$ $\Rightarrow$ $a$ divise toute combinaison $\alpha b + \beta c$.
- Division euclidienne : reste $0 \leqslant r < b$, couple unique.
- $n$ premier si aucun premier $p \leqslant \sqrt{n}$ ne le divise ; infinité de premiers.
- Décomposition unique ; nombre de diviseurs $\prod(\alpha_i + 1)$.
:::

:::funnel Divisibilité et nombres premiers
:::$L$, resume=$R$## Divisibilité et nombres premiers — l'essentiel

:::aretenir Divisibilité
$a \mid b \iff \exists k \in \mathbb{Z},\ b = ka$. Si $a \mid b$ et $a \mid c$, alors $a \mid (\alpha b + \beta c)$ pour tous entiers $\alpha$, $\beta$.
:::

:::aretenir Division euclidienne
Pour $a \in \mathbb{Z}$ et $b \in \mathbb{N}^*$ : il existe un **unique** couple $(q, r)$ avec $a = bq + r$ et $0 \leqslant r < b$.
:::

:::aretenir Nombres premiers
$p \geqslant 2$ premier : ses seuls diviseurs positifs sont $1$ et $p$. Test : aucun premier $\leqslant \sqrt{n}$ ne divise $n$ $\Rightarrow$ $n$ premier. Décomposition unique $n = p_1^{\alpha_1}\cdots p_k^{\alpha_k}$ ; nombre de diviseurs positifs $(\alpha_1 + 1)\cdots(\alpha_k + 1)$.
:::

:::attention Les 3 pièges du BAC
1. Donner un reste négatif ou supérieur ou égal au diviseur.
2. Oublier que $1$ n'est **pas** premier.
3. Tester la primalité au-delà de $\sqrt{n}$ (inutile) ou en deçà (insuffisant).
:::$R$, objectives=$O$Utiliser la définition et les propriétés de la divisibilité dans $\mathbb{Z}$.
Effectuer une division euclidienne et exploiter l'unicité du quotient et du reste.
Reconnaître un nombre premier et démontrer qu'il existe une infinité de nombres premiers.
Décomposer un entier en produit de facteurs premiers et en déduire ses diviseurs.$O$, difficulty=2, duration_min=50, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='arithmetique' and l.position=1;

update lessons l set title=$T$PGCD, théorèmes de Bézout et de Gauss$T$, kind='cours', body=$L$## PGCD et algorithme d'Euclide

:::definition
Pour $a, b$ entiers non tous deux nuls, le **PGCD** de $a$ et $b$, noté $a \wedge b$, est le plus grand entier positif qui divise à la fois $a$ et $b$. On dit que $a$ et $b$ sont **premiers entre eux** si $a \wedge b = 1$.
:::

:::propriete
- $a \wedge b = b \wedge a = |a| \wedge |b|$ ; $a \wedge 0 = |a|$.
- Si $a = bq + r$, alors $a \wedge b = b \wedge r$.
- Les diviseurs communs à $a$ et $b$ sont exactement les diviseurs de $a \wedge b$.
- $(ka) \wedge (kb) = k(a \wedge b)$ pour $k \in \mathbb{N}^*$.
:::

:::methode Algorithme d'Euclide
On effectue des divisions euclidiennes successives : $a = bq_1 + r_1$, $b = r_1q_2 + r_2$, $r_1 = r_2q_3 + r_3$, … Les restes décroissent strictement ; le **dernier reste non nul** est $a \wedge b$.
:::

:::exemple
$a = 1078$, $b = 322$ : $1078 = 322 \times 3 + 112$ ; $322 = 112 \times 2 + 98$ ; $112 = 98 \times 1 + 14$ ; $98 = 14 \times 7 + 0$. Donc $1078 \wedge 322 = 14$.
:::

:::methode Par la décomposition
Le PGCD est le produit des facteurs premiers communs, chacun avec le **plus petit** exposant. $360 = 2^3 \cdot 3^2 \cdot 5$ et $84 = 2^2 \cdot 3 \cdot 7$ : $360 \wedge 84 = 2^2 \cdot 3 = 12$.
:::

:::app PGCD dépendant de $n$
Soit $n \in \mathbb{N}$. Montre que $(3n + 1) \wedge (n + 2)$ divise $5$, puis détermine les $n$ pour lesquels ce PGCD vaut $5$.
:::solution Correction
Soit $d = (3n + 1) \wedge (n + 2)$. $d$ divise $3(n + 2) - (3n + 1) = 5$, donc $d \in \{1, 5\}$.

$d = 5 \iff 5 \mid n + 2$ (et alors $3n + 1 = 3(n + 2) - 5$ est aussi multiple de $5$) $\iff n \equiv 3\ [5]$.
:::
:::

## Bézout et Gauss

:::theoreme Identité de Bézout
Pour tous entiers $a$, $b$ non tous deux nuls, il existe $u, v \in \mathbb{Z}$ tels que $au + bv = a \wedge b$.
:::

:::theoreme Théorème de Bézout
$a$ et $b$ sont premiers entre eux si et seulement s'il existe $u, v \in \mathbb{Z}$ tels que $au + bv = 1$.
:::

:::methode Trouver $u$ et $v$ : remonter l'algorithme d'Euclide
Avec l'exemple précédent : $14 = 112 - 98 = 112 - (322 - 2 \times 112) = 3 \times 112 - 322 = 3(1078 - 3 \times 322) - 322 = 3 \times 1078 - 10 \times 322$. Donc $u = 3$, $v = -10$.
:::

:::exemple Deux entiers consécutifs
Pour tout $n$ : $(n + 1) \times 1 + n \times (-1) = 1$, donc $n \wedge (n + 1) = 1$. De même $(2n + 1) - 2n = 1$ montre que $2n$ et $2n + 1$ sont premiers entre eux.
:::

:::theoreme Théorème de Gauss
Si $a \mid bc$ et $a \wedge b = 1$, alors $a \mid c$.
:::

:::demonstration
Par Bézout, $au + bv = 1$, donc $c = acu + bcv$. Or $a \mid acu$ et $a \mid bc$, donc $a$ divise $c$.
:::

:::propriete Corollaires
1. Si $p$ est premier et $p \mid ab$, alors $p \mid a$ ou $p \mid b$.
2. Si $a \mid n$, $b \mid n$ et $a \wedge b = 1$, alors $ab \mid n$.
3. Si $a \wedge b = 1$ et $a \wedge c = 1$, alors $a \wedge bc = 1$.
:::

:::app Applique
Montre que pour tout entier $n$, $(2n + 3) \wedge (5n + 7) = 1$.
:::solution Correction
$5(2n + 3) - 2(5n + 7) = 15 - 14 = 1$. Par le théorème de Bézout (avec $u = 5$, $v = -2$), $2n + 3$ et $5n + 7$ sont premiers entre eux.
:::
:::

:::exemple Gauss en action
Si $5 \mid 7k$, alors $5 \mid k$, car $5 \wedge 7 = 1$. Et si un entier est divisible par $4$ et par $9$, il l'est par $36$, car $4 \wedge 9 = 1$ ; ce n'est pas le cas avec $4$ et $6$ : $12$ est divisible par $4$ et $6$, mais pas par $24$.
:::

:::app Bézout à la main
Trouve des entiers $u$ et $v$ tels que $17u + 5v = 1$.
:::solution Correction
$17 = 5 \times 3 + 2$ et $5 = 2 \times 2 + 1$. En remontant : $1 = 5 - 2 \times 2 = 5 - 2(17 - 3 \times 5) = 7 \times 5 - 2 \times 17$. Donc $u = -2$ et $v = 7$.
:::
:::

:::aretenir
- PGCD : dernier reste non nul de l'algorithme d'Euclide.
- Bézout : $a \wedge b = 1 \iff au + bv = 1$ ; $u$, $v$ par remontée de l'algorithme.
- Gauss : $a \mid bc$ et $a \wedge b = 1$ $\Rightarrow$ $a \mid c$.
:::

:::funnel PGCD, Bézout et Gauss
:::$L$, resume=$R$## PGCD, Bézout, Gauss — l'essentiel

:::aretenir PGCD
$a \wedge b$ = plus grand diviseur commun. Euclide : $a \wedge b = b \wedge r$ où $r$ est le reste de $a$ par $b$ ; le PGCD est le dernier reste non nul.
Les diviseurs communs de $a$ et $b$ sont les diviseurs de $a \wedge b$.
:::

:::aretenir Bézout
Identité : il existe $u, v \in \mathbb{Z}$ avec $au + bv = a \wedge b$.
Théorème : $a \wedge b = 1 \iff \exists u, v \in \mathbb{Z},\ au + bv = 1$.
:::

:::aretenir Gauss
$a \mid bc$ et $a \wedge b = 1$ $\Rightarrow$ $a \mid c$.
Corollaires : $p$ premier et $p \mid ab$ $\Rightarrow$ $p \mid a$ ou $p \mid b$ ; $a \mid n$, $b \mid n$, $a \wedge b = 1$ $\Rightarrow$ $ab \mid n$.
:::

:::attention Les 3 pièges du BAC
1. Appliquer Gauss sans vérifier $a \wedge b = 1$.
2. Croire que $au + bv = d$ implique $d = a \wedge b$ (seulement si $d = 1$ ou $d$ divise $a$ et $b$).
3. Oublier que $u$ et $v$ de Bézout ne sont pas uniques.
:::$R$, objectives=$O$Calculer un PGCD par l'algorithme d'Euclide ou par la décomposition en facteurs premiers.
Énoncer et utiliser le théorème de Bézout et l'identité de Bézout.
Appliquer le théorème de Gauss et ses corollaires.
Démontrer que deux entiers sont premiers entre eux.$O$, difficulty=3, duration_min=60, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='arithmetique' and l.position=2;

update lessons l set title=$T$Congruences et systèmes de numération$T$, kind='cours', body=$L$## Congruences modulo n

:::definition
Soit $n \in \mathbb{N}^*$. Deux entiers $a$ et $b$ sont **congrus** modulo $n$, noté $a \equiv b\ [n]$, si $n$ divise $a - b$. De façon équivalente, $a$ et $b$ ont le même reste dans la division euclidienne par $n$. En particulier, $a \equiv r\ [n]$ où $r$ est le reste de $a$ par $n$.
:::

:::propriete Relation d'équivalence
$a \equiv a$ ; $a \equiv b \Rightarrow b \equiv a$ ; $a \equiv b$ et $b \equiv c \Rightarrow a \equiv c$ (modulo $n$).
:::

:::theoreme Compatibilité avec les opérations
Si $a \equiv b\ [n]$ et $c \equiv d\ [n]$, alors
$$a + c \equiv b + d, \qquad a - c \equiv b - d, \qquad ac \equiv bd, \qquad a^k \equiv b^k\ [n] \ (k \in \mathbb{N}).$$
:::

:::attention On ne divise pas une congruence
$2 \times 4 \equiv 2 \times 1\ [6]$ car $8 - 2 = 6$, mais $4 \not\equiv 1\ [6]$. On peut simplifier par $c$ seulement si $c \wedge n = 1$ (théorème de Gauss).
:::

:::methode Reste d'une grande puissance
1. Chercher une petite puissance congrue à $1$ (ou à $-1$) modulo $n$.
2. Écrire l'exposant en division euclidienne par cette période.
3. Conclure avec les règles de calcul.
:::

:::exemple
Reste de $3^{2026}$ par $7$ : $3^3 = 27 \equiv -1\ [7]$, donc $3^6 \equiv 1\ [7]$. $2026 = 6 \times 337 + 4$, d'où $3^{2026} \equiv 3^4 = 81 \equiv 4\ [7]$. Le reste est $4$.
:::

:::exemple Divisibilité
Pour tout $n$, $7 \mid 3^{2n+1} + 2^{n+2}$ : $3^{2n+1} = 3 \cdot 9^n \equiv 3 \cdot 2^n\ [7]$ et $2^{n+2} = 4 \cdot 2^n$. La somme est congrue à $7 \cdot 2^n \equiv 0\ [7]$.
:::

## Petit théorème de Fermat

:::theoreme
Soit $p$ un nombre premier et $a$ un entier.
1. Si $p$ ne divise pas $a$ : $a^{p - 1} \equiv 1\ [p]$.
2. Pour tout $a$ : $a^p \equiv a\ [p]$.
:::

:::exemple
$2^{100} \bmod 11$ : $11$ est premier et ne divise pas $2$, donc $2^{10} \equiv 1\ [11]$, d'où $2^{100} = (2^{10})^{10} \equiv 1\ [11]$.
:::

:::exemple Montrer une divisibilité
Pour tout entier $n$, $n^5 - n$ est divisible par $5$ (Fermat avec $p = 5$). Comme il est aussi divisible par $6$ (produit $(n - 1)n(n + 1)(n^2 + 1)$ contenant trois entiers consécutifs), et $5 \wedge 6 = 1$, il est divisible par $30$.
:::

## Systèmes de numération

:::theoreme
Soit $b \geqslant 2$. Tout entier $n \geqslant 1$ s'écrit de façon unique
$$n = a_kb^k + a_{k-1}b^{k-1} + \cdots + a_1b + a_0, \qquad 0 \leqslant a_i \leqslant b - 1,\ a_k \neq 0.$$
On note $n = \overline{a_ka_{k-1}\ldots a_0}^{(b)}$ : c'est l'écriture de $n$ en base $b$.
:::

:::methode Passer de la base $10$ à la base $b$
Diviser successivement par $b$ et lire les restes de bas en haut. Exemple : $45 = 2 \times 22 + 1$, $22 = 2 \times 11 + 0$, $11 = 2 \times 5 + 1$, $5 = 2 \times 2 + 1$, $2 = 2 \times 1 + 0$, $1 = 2 \times 0 + 1$ : $45 = \overline{101101}^{(2)}$.
:::

:::propriete Critères de divisibilité en base $10$
Comme $10 \equiv 1\ [9]$ et $10 \equiv -1\ [11]$ :
- $n$ est divisible par $3$ (resp. $9$) si et seulement si la somme de ses chiffres l'est ;
- $n$ est divisible par $11$ si et seulement si la somme alternée $a_0 - a_1 + a_2 - \cdots$ l'est.
:::

:::app Applique
Détermine le reste de $2^{2026}$ dans la division par $13$.
:::solution Correction
$13$ est premier et ne divise pas $2$ : par Fermat, $2^{12} \equiv 1\ [13]$. $2026 = 12 \times 168 + 10$, donc $2^{2026} \equiv 2^{10} = 1024\ [13]$. Or $1024 = 13 \times 78 + 10$ : le reste est $10$.
:::
:::

:::aretenir
- $a \equiv b\ [n] \iff n \mid a - b$ ; compatible avec $+$, $\times$, puissances ; pas de division sans $c \wedge n = 1$.
- Grandes puissances : période puis division euclidienne de l'exposant.
- Fermat : $a^{p - 1} \equiv 1\ [p]$ si $p \nmid a$.
- Base $b$ : divisions successives ; critères par $10 \equiv 1\ [9]$ et $10 \equiv -1\ [11]$.
:::

:::funnel Congruences et numération
:::$L$, resume=$R$## Congruences — l'essentiel

:::aretenir Définition et règles
$a \equiv b\ [n] \iff n \mid (a - b)$ $\iff$ $a$ et $b$ ont le même reste dans la division par $n$.
Compatible avec $+$, $-$, $\times$ et les puissances : $a \equiv b \Rightarrow a^k \equiv b^k\ [n]$.
:::

:::aretenir Petit théorème de Fermat
$p$ premier, $a \wedge p = 1$ $\Rightarrow$ $a^{p - 1} \equiv 1\ [p]$. Pour tout $a$ : $a^p \equiv a\ [p]$.
:::

:::aretenir Numération
$n = \overline{a_k\ldots a_1a_0}^{(b)} = a_kb^k + \cdots + a_1b + a_0$, avec $0 \leqslant a_i < b$, $a_k \neq 0$.
:::

:::attention Les 3 pièges du BAC
1. Diviser une congruence : $2a \equiv 2b\ [6]$ n'entraîne pas $a \equiv b\ [6]$.
2. Appliquer Fermat avec $p$ non premier ou $a$ multiple de $p$.
3. Donner un reste négatif : $-1 \equiv n - 1\ [n]$.
:::$R$, objectives=$O$Utiliser la relation de congruence modulo $n$ et ses règles de calcul.
Déterminer le reste d'une puissance par une division euclidienne grâce aux congruences.
Énoncer et appliquer le petit théorème de Fermat.
Écrire un entier dans une base $b$ et utiliser les critères de divisibilité.$O$, difficulty=3, duration_min=60, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='arithmetique' and l.position=3;

update lessons l set title=$T$Fiche de révision — Arithmétique dans ℤ$T$, kind='resume', body=$L$:::aretenir Divisibilité
$a \mid b$ et $a \mid c$ $\Rightarrow$ $a \mid \alpha b + \beta c$. Division euclidienne : $a = bq + r$, $0 \leqslant r < b$. Premier : pas de diviseur premier $\leqslant \sqrt{n}$. Décomposition unique ; nombre de diviseurs $\prod(\alpha_i + 1)$.
:::

:::aretenir PGCD, PPCM
Euclide : dernier reste non nul. $a \wedge b \times a \vee b = |ab|$. Bézout : $a \wedge b = 1 \iff au + bv = 1$. Gauss : $a \mid bc$ et $a \wedge b = 1$ $\Rightarrow$ $a \mid c$.
:::

:::aretenir Congruences
$a \equiv b\ [n] \iff n \mid a - b$. Compatibles avec $+$, $\times$, puissances. Fermat : $a^{p - 1} \equiv 1\ [p]$ si $p$ premier ne divise pas $a$ ; $a^p \equiv a\ [p]$.
:::

:::aretenir Équations
$ax + by = c$ : solutions $\iff a \wedge b \mid c$ ; solution particulière (Bézout), puis Gauss : $x = x_0 + \frac{b}{d}k$, $y = y_0 - \frac{a}{d}k$.
$ax \equiv b\ [n]$ avec $a \wedge n = 1$ : multiplier par un inverse de $a$ modulo $n$.
:::$L$, resume=null, objectives=null, difficulty=1, duration_min=15, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='arithmetique' and l.position=4;

update lessons l set title=$T$Méthodes & exercices types$T$, kind='cours', body=$L$## Comment lire cette notion

L'exercice d'arithmétique du BAC SM combine souvent : une équation diophantienne, un calcul de restes par les congruences, et le petit théorème de Fermat. Il faut des rédactions précises : chaque implication doit être justifiée par un théorème nommé (Bézout, Gauss, Fermat).

## Résoudre une équation diophantienne

:::methode $ax + by = c$
1. **Existence** : il y a des solutions si et seulement si $d = a \wedge b$ divise $c$.
2. **Simplifier** : diviser par $d$ pour obtenir $a'x + b'y = c'$ avec $a' \wedge b' = 1$.
3. **Solution particulière** $(x_0, y_0)$ : évidente, ou par l'algorithme d'Euclide.
4. **Soustraire** : $a'(x - x_0) = b'(y_0 - y)$. Comme $a' \wedge b' = 1$, Gauss donne $b' \mid x - x_0$.
5. **Conclure** : $x = x_0 + b'k$ et $y = y_0 - a'k$, $k \in \mathbb{Z}$, puis vérifier la réciproque.
:::

:::exemple Traité
$7x - 5y = 3$. $7 \wedge 5 = 1$ divise $3$. Solution particulière : $(4, 5)$ car $28 - 25 = 3$. En soustrayant : $7(x - 4) = 5(y - 5)$. $5$ divise $7(x - 4)$ et $5 \wedge 7 = 1$, donc $5 \mid x - 4$ : $x = 4 + 5k$, puis $7 \times 5k = 5(y - 5)$ donne $y = 5 + 7k$. Réciproquement, $7(4 + 5k) - 5(5 + 7k) = 3$. Solutions : $(4 + 5k, 5 + 7k)$, $k \in \mathbb{Z}$.
:::

:::app Applique
Résous dans $\mathbb{Z}^2$ l'équation $12x + 18y = 30$.
:::solution Correction
$12 \wedge 18 = 6$ divise $30$ : on divise par $6$, $2x + 3y = 5$. Solution particulière : $(1, 1)$. Alors $2(x - 1) = 3(1 - y)$ ; $3 \mid 2(x - 1)$ et $3 \wedge 2 = 1$, donc $x = 1 + 3k$, puis $y = 1 - 2k$. Solutions : $(1 + 3k, 1 - 2k)$, $k \in \mathbb{Z}$.
:::
:::

## Congruences et restes

:::methode Disjonction des cas
Pour étudier $f(n)$ modulo $m$, dresser le tableau des restes de $n$ modulo $m$ et calculer le reste de $f(n)$ dans chaque cas.
:::

:::exemple
Restes de $n^2$ modulo $4$ : si $n \equiv 0, 1, 2, 3$, alors $n^2 \equiv 0, 1, 0, 1$. Un carré est donc congru à $0$ ou $1$ modulo $4$ ; par suite, un entier congru à $3$ modulo $4$ n'est jamais somme de deux carrés.
:::

:::methode Un système de congruences
Pour $x \equiv a\ [m]$ et $x \equiv b\ [n]$ avec $m \wedge n = 1$ : écrire $x = a + mk$, reporter dans la seconde congruence, résoudre en $k$, puis exprimer $x$ modulo $mn$.
:::

:::exemple
$x \equiv 2\ [3]$ et $x \equiv 3\ [5]$ : $x = 2 + 3k$ et $2 + 3k \equiv 3\ [5]$, soit $3k \equiv 1\ [5]$. Comme $3 \times 2 = 6 \equiv 1\ [5]$, $k \equiv 2\ [5]$, $k = 2 + 5j$, et $x = 8 + 15j$ : $x \equiv 8\ [15]$.
:::

:::app Disjonction des cas
Montre que pour tout entier $n$, $n^3 + 2n$ est divisible par $3$.
:::solution Correction
Modulo $3$ : si $n \equiv 0$, $n^3 + 2n \equiv 0$ ; si $n \equiv 1$, $n^3 + 2n \equiv 1 + 2 = 3 \equiv 0$ ; si $n \equiv 2$, $n^3 + 2n \equiv 8 + 4 = 12 \equiv 0$. Dans tous les cas, $3 \mid n^3 + 2n$.
:::
:::

## Utiliser Fermat dans un problème

:::methode
Pour un reste de $a^N$ modulo $p$ premier ($p \nmid a$) : réduire l'exposant modulo $p - 1$, puisque $a^{p-1} \equiv 1\ [p]$. Si une puissance plus petite vaut déjà $1$, l'utiliser.
:::

:::exemple
Pour tout entier $n$ non multiple de $7$ : $n^6 \equiv 1\ [7]$, donc $n^{12} - 1$ est divisible par $7$.
:::

:::aretenir
- Diophantienne : existence, division par le PGCD, solution particulière, Gauss, réciproque.
- Restes : tableau de cas, puissance $\equiv \pm 1$.
- Système de congruences : $x = a + mk$, puis résoudre en $k$.
- Fermat : réduire l'exposant modulo $p - 1$.
:::

:::funnel Méthodes en arithmétique
:::$L$, resume=$R$## Méthodes en arithmétique — l'essentiel

:::aretenir Équation $ax + by = c$
1. $d = a \wedge b$ ; si $d \nmid c$, pas de solution.
2. Diviser par $d$, trouver une solution particulière $(x_0, y_0)$.
3. Soustraire, appliquer Gauss : $x = x_0 + b'k$, $y = y_0 - a'k$, $k \in \mathbb{Z}$.
:::

:::aretenir Restes et congruences
Chercher une puissance $\equiv \pm 1$ ; tableau des restes pour une disjonction de cas.
:::

:::attention Les 3 pièges du BAC
1. Oublier la **réciproque** : vérifier que les couples trouvés sont bien solutions.
2. Appliquer Gauss avant de diviser par le PGCD.
3. Inverser le signe dans la solution générale ($x$ et $y$ varient en sens contraires).
:::$R$, objectives=$O$Résoudre complètement une équation diophantienne $ax + by = c$.
Déterminer le reste d'une division par la méthode des congruences.
Résoudre un système de congruences simple.
Rédiger un raisonnement par disjonction des cas sur les restes.$O$, difficulty=3, duration_min=60, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='arithmetique' and l.position=50;

update lessons l set title=$T$Approfondissement : PPCM, ordre, congruences linéaires$T$, kind='cours', body=$L$## Relation PGCD - PPCM

:::definition
Pour $a, b \in \mathbb{Z}^*$, le **PPCM** de $a$ et $b$, noté $a \vee b$, est le plus petit entier strictement positif multiple à la fois de $a$ et de $b$.
:::

:::propriete
- Les multiples communs de $a$ et $b$ sont exactement les multiples de $a \vee b$.
- $(a \wedge b) \times (a \vee b) = |ab|$ ; en particulier, si $a \wedge b = 1$, $a \vee b = |ab|$.
- Par décomposition : le PPCM est le produit des facteurs premiers apparaissant dans $a$ ou $b$, chacun avec le **plus grand** exposant.
:::

:::exemple
$360 = 2^3 \cdot 3^2 \cdot 5$ et $84 = 2^2 \cdot 3 \cdot 7$ : $360 \vee 84 = 2^3 \cdot 3^2 \cdot 5 \cdot 7 = 2520$. Vérification : $12 \times 2520 = 30\,240 = 360 \times 84$.
:::

:::app Applique
Trouve deux entiers naturels $a < b$ tels que $a \wedge b = 6$ et $a \vee b = 72$.
:::solution Correction
$a = 6a'$, $b = 6b'$ avec $a' \wedge b' = 1$ et $6a'b' = 72$, soit $a'b' = 12$. Couples premiers entre eux avec $a' < b'$ : $(1, 12)$ et $(3, 4)$. D'où $(a, b) = (6, 72)$ ou $(18, 24)$.
:::
:::

## Restes de puissances (ordre)

:::definition
Soit $n \geqslant 2$ et $a$ premier avec $n$. L'**ordre** de $a$ modulo $n$ est le plus petit entier $k \geqslant 1$ tel que $a^k \equiv 1\ [n]$.
:::

:::propriete
Si $k$ est l'ordre de $a$ modulo $n$ : $a^m \equiv 1\ [n] \iff k \mid m$, et les restes de $a^m$ se répètent avec la période $k$. Si $n = p$ est premier, $k$ divise $p - 1$ (conséquence du petit théorème de Fermat).
:::

:::exemple
Modulo $7$ : $2^1 = 2$, $2^2 = 4$, $2^3 = 8 \equiv 1$. L'ordre de $2$ est $3$ (un diviseur de $6$). Donc $2^{2026} = 2^{3 \times 675 + 1} \equiv 2\ [7]$.
:::

:::methode Tableau des restes
Pour $a^n$ modulo $m$ : calculer les restes de $a^1, a^2, \ldots$ jusqu'à retomber sur $1$ ; la période trouvée donne le reste de toute puissance par division euclidienne de l'exposant.
:::

## Congruence linéaire

:::theoreme
Soit $n \geqslant 2$ et $a$ tel que $a \wedge n = 1$. L'équation $ax \equiv b\ [n]$ a une unique solution modulo $n$ : si $a'$ vérifie $aa' \equiv 1\ [n]$ (un tel $a'$ existe par Bézout), alors $x \equiv a'b\ [n]$.
:::

:::exemple
$5x \equiv 3\ [7]$ : $5 \times 3 = 15 \equiv 1\ [7]$, donc l'inverse de $5$ modulo $7$ est $3$, et $x \equiv 3 \times 3 = 9 \equiv 2\ [7]$. Vérification : $5 \times 2 = 10 \equiv 3\ [7]$.
:::

:::propriete Cas général
Si $d = a \wedge n$ : l'équation $ax \equiv b\ [n]$ a des solutions si et seulement si $d \mid b$ ; on se ramène alors à $\frac{a}{d}x \equiv \frac{b}{d}\ \left[\frac{n}{d}\right]$.
:::

:::exemple
$6x \equiv 4\ [10]$ : $6 \wedge 10 = 2$ divise $4$, donc $3x \equiv 2\ [5]$. L'inverse de $3$ modulo $5$ est $2$, d'où $x \equiv 4\ [5]$, soit $x \equiv 4$ ou $9\ [10]$.
:::

:::aretenir
- $(a \wedge b)(a \vee b) = |ab|$ ; PPCM par exposants maximaux.
- Ordre $k$ : $a^m \equiv 1 \iff k \mid m$ ; modulo $p$ premier, $k \mid p - 1$.
- $ax \equiv b\ [n]$ avec $a \wedge n = 1$ : multiplier par l'inverse de $a$.
:::

:::funnel PPCM, ordre et congruences linéaires
:::$L$, resume=$R$## Approfondissement — l'essentiel

:::aretenir PPCM
$a \vee b$ = plus petit multiple commun strictement positif. $(a \wedge b)(a \vee b) = |ab|$. Les multiples communs sont les multiples de $a \vee b$.
:::

:::aretenir Ordre modulo $n$
Ordre de $a$ ($a \wedge n = 1$) : plus petit $k \geqslant 1$ tel que $a^k \equiv 1\ [n]$. Alors $a^m \equiv 1\ [n] \iff k \mid m$. Si $n = p$ premier, $k \mid p - 1$.
:::

:::aretenir Congruence linéaire $ax \equiv b\ [n]$
Si $a \wedge n = 1$ : solution unique modulo $n$, $x \equiv a'b$ où $aa' \equiv 1\ [n]$. Si $d = a \wedge n$ : solutions $\iff d \mid b$, et il y en a $d$ modulo $n$.
:::

:::attention Les 3 pièges du BAC
1. Croire que l'ordre vaut toujours $p - 1$ : il en est seulement un diviseur.
2. Diviser une congruence par un entier non premier avec le module.
3. Oublier la valeur absolue dans $(a \wedge b)(a \vee b) = |ab|$.
:::$R$, objectives=$O$Calculer un PPCM et utiliser la relation entre PGCD et PPCM.
Déterminer l'ordre d'un entier modulo $n$ et l'utiliser pour des restes de puissances.
Résoudre une congruence linéaire $ax \equiv b\ [n]$.$O$, difficulty=3, duration_min=45, bac_frequency=2
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='arithmetique' and l.position=60;

update lessons l set title=$T$Forme algébrique, conjugué, module$T$, kind='cours', body=$L$## L'ensemble des nombres complexes

:::definition
Il existe un ensemble $\mathbb{C}$, contenant $\mathbb{R}$, muni d'une addition et d'une multiplication qui prolongent celles de $\mathbb{R}$ avec les mêmes règles de calcul, et contenant un élément $i$ tel que $i^2 = -1$. Tout $z \in \mathbb{C}$ s'écrit de façon **unique**
$$z = a + ib, \qquad a, b \in \mathbb{R}.$$
$a = \mathrm{Re}(z)$ est la **partie réelle**, $b = \mathrm{Im}(z)$ la **partie imaginaire**. Si $b = 0$, $z$ est réel ; si $a = 0$, $z$ est **imaginaire pur**.
:::

:::propriete Unicité de l'écriture
$a + ib = a' + ib' \iff (a = a' \text{ et } b = b')$. En particulier $a + ib = 0 \iff a = b = 0$.
:::

:::attention
$\mathrm{Im}(3 - 2i) = -2$, et non $-2i$. La partie imaginaire est un **nombre réel**.
:::

## Opérations sous forme algébrique

:::propriete
$(a + ib) + (a' + ib') = (a + a') + i(b + b')$ et $(a + ib)(a' + ib') = (aa' - bb') + i(ab' + a'b)$. Les identités remarquables restent valables ; puissances de $i$ : $i^2 = -1$, $i^3 = -i$, $i^4 = 1$, puis le cycle se répète.
:::

:::exemple
$(2 + 3i)(1 - i) = 2 - 2i + 3i - 3i^2 = 5 + i$. $\quad (1 + i)^2 = 2i$, donc $(1 + i)^8 = (2i)^4 = 16$.
:::

## Le conjugué

:::definition
Le **conjugué** de $z = a + ib$ est $\bar z = a - ib$. Dans le plan, $\bar z$ est le symétrique de $z$ par rapport à l'axe des abscisses.
:::

:::propriete
$\overline{z + z'} = \bar z + \bar z'$, $\;\overline{zz'} = \bar z\,\bar z'$, $\;\overline{\left(\frac{z}{z'}\right)} = \frac{\bar z}{\bar z'}$, $\;\overline{z^n} = \bar z^n$, $\;\bar{\bar z} = z$.
$z + \bar z = 2\,\mathrm{Re}(z)$, $\;z - \bar z = 2i\,\mathrm{Im}(z)$, $\;z\bar z = a^2 + b^2 \in \mathbb{R}_+$.
:::

:::methode Écrire un quotient sous forme algébrique
Multiplier numérateur et dénominateur par le **conjugué du dénominateur** :
$$\frac{2 + i}{1 - 2i} = \frac{(2 + i)(1 + 2i)}{(1 - 2i)(1 + 2i)} = \frac{2 + 4i + i + 2i^2}{1 + 4} = \frac{5i}{5} = i.$$
:::

:::propriete Caractérisations
$z \in \mathbb{R} \iff \bar z = z$ ; $\;z$ imaginaire pur $\iff \bar z = -z$.
:::

:::exemple
Pour $z \neq -i$, posons $Z = \dfrac{z - i}{z + i}$. Si $z$ est réel, alors $\bar Z = \dfrac{z + i}{z - i} = \dfrac{1}{Z}$, donc $|Z|^2 = Z\bar Z = 1$.
:::

:::methode Résoudre une équation faisant intervenir $\bar z$
Poser $z = x + iy$, remplacer $\bar z$ par $x - iy$, puis identifier parties réelles et imaginaires : on obtient un système de deux équations réelles.
:::

:::exemple
$z + 2\bar z = 3 - i$ : avec $z = x + iy$, $x + iy + 2x - 2iy = 3x - iy = 3 - i$. Donc $3x = 3$ et $-y = -1$ : $z = 1 + i$.
:::

## Le module

:::definition
Le **module** de $z = a + ib$ est le réel positif $|z| = \sqrt{a^2 + b^2} = \sqrt{z\bar z}$. Si $M$ a pour affixe $z$, $|z| = OM$.
:::

:::propriete
Pour $z, z' \in \mathbb{C}$ et $n \in \mathbb{N}$ :
$$|z| = 0 \iff z = 0, \qquad |zz'| = |z||z'|, \qquad \left|\frac{z}{z'}\right| = \frac{|z|}{|z'|}, \qquad |z^n| = |z|^n, \qquad |\bar z| = |z|.$$
**Inégalité triangulaire** : $\big||z| - |z'|\big| \leqslant |z + z'| \leqslant |z| + |z'|$.
:::

:::exemple
$\left|\dfrac{(1 + i)^4}{(\sqrt{3} - i)^3}\right| = \dfrac{(\sqrt{2})^4}{2^3} = \dfrac{4}{8} = \dfrac{1}{2}$, sans développer.
:::

:::app Applique
Écris sous forme algébrique $z = \dfrac{3 - i}{1 + i} + \dfrac{4i}{1 - i}$, puis calcule $|z|$.
:::solution Correction
$\dfrac{3 - i}{1 + i} = \dfrac{(3 - i)(1 - i)}{2} = \dfrac{3 - 3i - i + i^2}{2} = \dfrac{2 - 4i}{2} = 1 - 2i$.

$\dfrac{4i}{1 - i} = \dfrac{4i(1 + i)}{2} = 2i + 2i^2 = -2 + 2i$.

Donc $z = -1$ et $|z| = 1$.
:::
:::

:::aretenir
- $z = a + ib$, écriture unique ; $\mathrm{Re}$ et $\mathrm{Im}$ sont réels.
- Quotient : multiplier par le conjugué du dénominateur.
- $z$ réel $\iff \bar z = z$ ; imaginaire pur $\iff \bar z = -z$.
- $|z|^2 = z\bar z$ ; le module est multiplicatif, pas additif.
:::

:::funnel Forme algébrique, conjugué, module
:::$L$, resume=$R$## Forme algébrique — l'essentiel

:::aretenir Forme algébrique
$z = a + ib$ avec $a = \mathrm{Re}(z)$, $b = \mathrm{Im}(z)$ réels, $i^2 = -1$. Écriture **unique** : $a + ib = a' + ib' \iff a = a'$ et $b = b'$.
:::

:::aretenir Conjugué
$\bar z = a - ib$. $\;z + \bar z = 2\,\mathrm{Re}(z)$, $\;z - \bar z = 2i\,\mathrm{Im}(z)$, $\;z\bar z = a^2 + b^2$.
$z \in \mathbb{R} \iff \bar z = z$ ; $\;z \in i\mathbb{R} \iff \bar z = -z$.
:::

:::aretenir Module
$|z| = \sqrt{a^2 + b^2} = \sqrt{z\bar z}$. $\;|zz'| = |z||z'|$, $\;\left|\frac{z}{z'}\right| = \frac{|z|}{|z'|}$, $\;|z + z'| \leqslant |z| + |z'|$.
:::

:::attention Les 3 pièges du BAC
1. Écrire $\mathrm{Im}(a + ib) = ib$ : la partie imaginaire est le **réel** $b$.
2. Croire que $|z + z'| = |z| + |z'|$.
3. Oublier de multiplier **numérateur et dénominateur** par le conjugué.
:::$R$, objectives=$O$Écrire un nombre complexe sous forme algébrique et identifier ses parties réelle et imaginaire.
Calculer avec les complexes : somme, produit, inverse, quotient.
Utiliser le conjugué pour rendre un dénominateur réel et caractériser réels et imaginaires purs.
Calculer un module et utiliser ses propriétés.$O$, difficulty=1, duration_min=45, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='complexes' and l.position=1;

update lessons l set title=$T$Forme trigonométrique et exponentielle$T$, kind='cours', body=$L$## Argument d'un nombre complexe

:::definition
Soit $z \neq 0$ d'image $M$. Un **argument** de $z$ est une mesure $\theta$ de l'angle orienté $(\vec{u}, \overrightarrow{OM})$. Il est défini modulo $2\pi$ : on note $\arg z \equiv \theta\ [2\pi]$.
:::

[[fig:plan-complexe]] Module et argument : coordonnées polaires du point $M$.

:::propriete
Si $z = a + ib \neq 0$ et $r = |z|$, alors $\theta$ est un argument de $z$ si et seulement si $\cos\theta = \dfrac{a}{r}$ et $\sin\theta = \dfrac{b}{r}$.
:::

:::exemple
$z = -1 + i\sqrt{3}$ : $r = 2$, $\cos\theta = -\frac{1}{2}$, $\sin\theta = \frac{\sqrt{3}}{2}$, donc $\theta \equiv \frac{2\pi}{3}\ [2\pi]$.
:::

## Module, argument, forme trigonométrique

:::definition
Tout $z \neq 0$ s'écrit $z = r(\cos\theta + i\sin\theta)$ avec $r = |z| > 0$ et $\theta \equiv \arg z\ [2\pi]$ : c'est la **forme trigonométrique**. On note aussi $z = [r, \theta]$.
:::

:::propriete
- $z$ réel strictement positif $\iff \arg z \equiv 0$ ; réel strictement négatif $\iff \arg z \equiv \pi$.
- $z$ imaginaire pur non nul $\iff \arg z \equiv \frac{\pi}{2}\ [\pi]$.
- $[r, \theta] = [r', \theta'] \iff r = r'$ et $\theta \equiv \theta'\ [2\pi]$.
:::

## Forme exponentielle

:::definition
Pour tout réel $\theta$, on note $\mathrm{e}^{i\theta} = \cos\theta + i\sin\theta$. Tout complexe non nul s'écrit $z = r\mathrm{e}^{i\theta}$ avec $r = |z|$ et $\theta \equiv \arg z$.
:::

:::exemple
$1 + i = \sqrt{2}\,\mathrm{e}^{i\pi/4}$ ; $\;-3 = 3\mathrm{e}^{i\pi}$ ; $\;-2i = 2\mathrm{e}^{-i\pi/2}$ ; $\;\sqrt{3} - i = 2\mathrm{e}^{-i\pi/6}$.
:::

## Opérations sous forme exponentielle

:::propriete
$$r\mathrm{e}^{i\theta} \times r'\mathrm{e}^{i\theta'} = rr'\,\mathrm{e}^{i(\theta + \theta')}, \qquad \frac{r\mathrm{e}^{i\theta}}{r'\mathrm{e}^{i\theta'}} = \frac{r}{r'}\,\mathrm{e}^{i(\theta - \theta')}, \qquad \left(r\mathrm{e}^{i\theta}\right)^n = r^n\mathrm{e}^{in\theta}, \qquad \overline{r\mathrm{e}^{i\theta}} = r\mathrm{e}^{-i\theta}.$$
:::

:::methode Calculer une grande puissance
Mettre sous forme exponentielle, élever à la puissance, puis revenir à la forme algébrique.
:::

:::exemple
$(1 + i)^{10} = \left(\sqrt{2}\,\mathrm{e}^{i\pi/4}\right)^{10} = 2^5\,\mathrm{e}^{i10\pi/4} = 32\,\mathrm{e}^{i5\pi/2} = 32\,\mathrm{e}^{i\pi/2} = 32i$.
:::

## Formule de Moivre

:::theoreme
Pour tout réel $\theta$ et tout entier $n$ : $\left(\cos\theta + i\sin\theta\right)^n = \cos(n\theta) + i\sin(n\theta)$.
:::

:::exemple
Avec $n = 3$ et en développant : $\cos 3\theta = \cos^3\theta - 3\cos\theta\sin^2\theta = 4\cos^3\theta - 3\cos\theta$.
:::

## Formules d'Euler et linéarisation

:::theoreme Formules d'Euler
$$\cos\theta = \frac{\mathrm{e}^{i\theta} + \mathrm{e}^{-i\theta}}{2}, \qquad \sin\theta = \frac{\mathrm{e}^{i\theta} - \mathrm{e}^{-i\theta}}{2i}.$$
:::

:::methode Linéariser $\cos^n\theta$ ou $\sin^n\theta$
Remplacer par la formule d'Euler, développer avec le binôme, regrouper les termes conjugués $\mathrm{e}^{ik\theta} + \mathrm{e}^{-ik\theta} = 2\cos(k\theta)$.
:::

:::exemple
$\cos^3\theta = \dfrac{(\mathrm{e}^{i\theta} + \mathrm{e}^{-i\theta})^3}{8} = \dfrac{\mathrm{e}^{3i\theta} + 3\mathrm{e}^{i\theta} + 3\mathrm{e}^{-i\theta} + \mathrm{e}^{-3i\theta}}{8} = \dfrac{\cos 3\theta + 3\cos\theta}{4}$.
:::

:::methode Factoriser par l'angle moitié
$\mathrm{e}^{ia} + \mathrm{e}^{ib} = \mathrm{e}^{i\frac{a+b}{2}}\left(\mathrm{e}^{i\frac{a-b}{2}} + \mathrm{e}^{-i\frac{a-b}{2}}\right) = 2\cos\left(\frac{a - b}{2}\right)\mathrm{e}^{i\frac{a+b}{2}}$. Exemple : $1 + \mathrm{e}^{i\theta} = 2\cos\frac{\theta}{2}\,\mathrm{e}^{i\theta/2}$.
:::

:::app Applique
Écris $z = \dfrac{(1 - i)^5}{(\sqrt{3} + i)^2}$ sous forme exponentielle.
:::solution Correction
$1 - i = \sqrt{2}\,\mathrm{e}^{-i\pi/4}$ et $\sqrt{3} + i = 2\mathrm{e}^{i\pi/6}$. Donc
$$z = \frac{(\sqrt{2})^5\mathrm{e}^{-i5\pi/4}}{4\mathrm{e}^{i\pi/3}} = \frac{4\sqrt{2}}{4}\,\mathrm{e}^{-i\left(\frac{5\pi}{4} + \frac{\pi}{3}\right)} = \sqrt{2}\,\mathrm{e}^{-i\frac{19\pi}{12}} = \sqrt{2}\,\mathrm{e}^{i\frac{5\pi}{12}}.$$
:::
:::

:::aretenir
- $z = r\mathrm{e}^{i\theta}$, $r > 0$, $\theta$ modulo $2\pi$, fixé par $\cos\theta$ **et** $\sin\theta$.
- Les modules se multiplient, les arguments s'additionnent.
- Moivre pour les formules trigonométriques ; Euler pour linéariser.
- $1 + \mathrm{e}^{i\theta} = 2\cos\frac{\theta}{2}\mathrm{e}^{i\theta/2}$.
:::

:::funnel Forme trigonométrique et exponentielle
:::$L$, resume=$R$## Forme trigonométrique et exponentielle — l'essentiel

:::aretenir Les trois écritures
$z = a + ib = r(\cos\theta + i\sin\theta) = r\mathrm{e}^{i\theta}$, avec $r = |z| > 0$, $\theta = \arg z\ [2\pi]$, $\cos\theta = \frac{a}{r}$, $\sin\theta = \frac{b}{r}$.
:::

:::aretenir Règles sur les arguments
$\arg(zz') = \arg z + \arg z'$, $\;\arg\frac{z}{z'} = \arg z - \arg z'$, $\;\arg(z^n) = n\arg z$, $\;\arg\bar z = -\arg z$ (modulo $2\pi$).
:::

:::aretenir Moivre et Euler
$(\cos\theta + i\sin\theta)^n = \cos(n\theta) + i\sin(n\theta)$.
$\cos\theta = \dfrac{\mathrm{e}^{i\theta} + \mathrm{e}^{-i\theta}}{2}$, $\;\sin\theta = \dfrac{\mathrm{e}^{i\theta} - \mathrm{e}^{-i\theta}}{2i}$.
:::

:::attention Les 3 pièges du BAC
1. Déterminer $\theta$ par $\tan\theta = \frac{b}{a}$ seul, sans regarder les signes de $a$ et $b$.
2. Écrire $-2\mathrm{e}^{i\theta}$ comme forme exponentielle : le module doit être positif, c'est $2\mathrm{e}^{i(\theta + \pi)}$.
3. Oublier « modulo $2\pi$ ».
:::$R$, objectives=$O$Déterminer un argument d'un nombre complexe non nul.
Passer de la forme algébrique à la forme trigonométrique ou exponentielle, et inversement.
Calculer produits, quotients et puissances sous forme exponentielle (formule de Moivre).
Utiliser les formules d'Euler pour linéariser $\cos^n x$ et $\sin^n x$.$O$, difficulty=2, duration_min=55, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='complexes' and l.position=2;

update lessons l set title=$T$Équations et racines n-ièmes$T$, kind='cours', body=$L$## Équation du second degré à coefficients réels

:::theoreme
Soit $az^2 + bz + c = 0$ avec $a, b, c$ réels, $a \neq 0$, et $\Delta = b^2 - 4ac$.
- $\Delta > 0$ : deux solutions réelles $\dfrac{-b \pm \sqrt{\Delta}}{2a}$.
- $\Delta = 0$ : une solution réelle double $-\dfrac{b}{2a}$.
- $\Delta < 0$ : deux solutions complexes conjuguées $\dfrac{-b \pm i\sqrt{-\Delta}}{2a}$.
:::

:::propriete Somme et produit
Dans tous les cas, si $z_1$ et $z_2$ sont les solutions : $z_1 + z_2 = -\dfrac{b}{a}$, $z_1z_2 = \dfrac{c}{a}$, et $az^2 + bz + c = a(z - z_1)(z - z_2)$.
:::

:::exemple
$z^2 - 2z + 5 = 0$ : $\Delta = -16$, $z = \dfrac{2 \pm 4i}{2} = 1 \pm 2i$.
:::

:::methode Polynôme de degré 3 à coefficients réels
1. Trouver une racine évidente $z_0$ (souvent réelle ou imaginaire pure, donnée par l'énoncé).
2. Factoriser : $P(z) = (z - z_0)(az^2 + \beta z + \gamma)$ par identification.
3. Résoudre l'équation du second degré.
:::

:::exemple
$P(z) = z^3 - 3z^2 + 4z - 2$ : $P(1) = 0$, donc $P(z) = (z - 1)(z^2 - 2z + 2)$, et $z^2 - 2z + 2 = 0$ donne $1 \pm i$. Solutions : $1$, $1 + i$, $1 - i$.
:::

## Racines carrées d'un nombre complexe

:::methode Racines carrées de $Z = X + iY$
On cherche $\delta = x + iy$ tel que $\delta^2 = Z$, ce qui équivaut à
$$\begin{cases} x^2 - y^2 = X \\ x^2 + y^2 = |Z| \\ 2xy = Y \end{cases}$$
Les deux premières équations donnent $x^2$ et $y^2$ ; la troisième fixe le **signe** de $xy$. On obtient deux racines opposées $\pm\delta$.
:::

:::exemple
Racines carrées de $Z = 3 + 4i$ : $|Z| = 5$, donc $x^2 - y^2 = 3$ et $x^2 + y^2 = 5$, d'où $x^2 = 4$, $y^2 = 1$. Comme $2xy = 4 > 0$, $x$ et $y$ ont le même signe : $\delta = \pm(2 + i)$.
:::

## Équation du second degré à coefficients complexes

:::theoreme
Soit $az^2 + bz + c = 0$ avec $a, b, c \in \mathbb{C}$, $a \neq 0$, et $\Delta = b^2 - 4ac$. Si $\delta$ est une racine carrée de $\Delta$, les solutions sont
$$z_1 = \frac{-b + \delta}{2a}, \qquad z_2 = \frac{-b - \delta}{2a}.$$
:::

:::exemple
$z^2 - (3 + i)z + 2 + 2i = 0$ : $\Delta = (3 + i)^2 - 4(2 + 2i) = 8 + 6i - 8 - 8i = -2i$. Racine carrée : $x^2 - y^2 = 0$, $x^2 + y^2 = 2$, $2xy = -2$, d'où $\delta = 1 - i$. Solutions : $z = \dfrac{3 + i \pm (1 - i)}{2}$, soit $2$ et $1 + i$.
:::

## Racines n-ièmes

:::theoreme
Soit $Z = r\mathrm{e}^{i\theta}$ avec $r > 0$ et $n \geqslant 1$. L'équation $z^n = Z$ admet exactement $n$ solutions distinctes :
$$z_k = \sqrt[n]{r}\;\mathrm{e}^{i\frac{\theta + 2k\pi}{n}}, \qquad k \in \{0, 1, \ldots, n - 1\}.$$
:::

:::demonstration
Avec $z = \rho\mathrm{e}^{i\varphi}$ : $z^n = Z \iff \rho^n = r$ et $n\varphi \equiv \theta\ [2\pi]$, soit $\rho = \sqrt[n]{r}$ et $\varphi = \frac{\theta + 2k\pi}{n}$. Les valeurs $k = 0, \ldots, n - 1$ donnent des points distincts ; $k = n$ redonne $k = 0$.
:::

:::propriete Racines $n$-ièmes de l'unité
Les solutions de $z^n = 1$ sont $\omega_k = \mathrm{e}^{\frac{2ik\pi}{n}} = \omega^k$ avec $\omega = \mathrm{e}^{\frac{2i\pi}{n}}$. Pour $n \geqslant 2$ :
$$1 + \omega + \omega^2 + \cdots + \omega^{n-1} = \frac{1 - \omega^n}{1 - \omega} = 0.$$
Leurs images sont les sommets d'un polygone régulier à $n$ côtés inscrit dans le cercle unité.
:::

:::exemple Racines cubiques de l'unité
$1$, $j = \mathrm{e}^{2i\pi/3} = -\frac{1}{2} + i\frac{\sqrt{3}}{2}$ et $j^2 = \bar j$. On a $1 + j + j^2 = 0$ et $j^3 = 1$ : leurs images forment un triangle équilatéral.
:::

:::app Applique
Résous dans $\mathbb{C}$ l'équation $z^4 = -16$.
:::solution Correction
$-16 = 16\mathrm{e}^{i\pi}$ et $\sqrt[4]{16} = 2$. Les solutions sont $z_k = 2\mathrm{e}^{i\frac{\pi + 2k\pi}{4}}$, $k \in \{0, 1, 2, 3\}$ :
$$2\mathrm{e}^{i\pi/4} = \sqrt{2} + i\sqrt{2}, \quad 2\mathrm{e}^{3i\pi/4} = -\sqrt{2} + i\sqrt{2}, \quad 2\mathrm{e}^{5i\pi/4} = -\sqrt{2} - i\sqrt{2}, \quad 2\mathrm{e}^{7i\pi/4} = \sqrt{2} - i\sqrt{2}.$$
:::
:::

:::aretenir
- Coefficients réels, $\Delta < 0$ : solutions conjuguées $\frac{-b \pm i\sqrt{-\Delta}}{2a}$.
- Coefficients complexes : $\delta^2 = \Delta$ par le système à trois équations.
- $z^n = r\mathrm{e}^{i\theta}$ : $n$ solutions $\sqrt[n]{r}\,\mathrm{e}^{i(\theta + 2k\pi)/n}$.
- Racines de l'unité : somme nulle, polygone régulier.
:::

:::funnel Équations et racines n-ièmes
:::$L$, resume=$R$## Équations et racines n-ièmes — l'essentiel

:::aretenir Second degré à coefficients réels
$az^2 + bz + c = 0$, $\Delta = b^2 - 4ac$. Si $\Delta < 0$ : $z = \dfrac{-b \pm i\sqrt{-\Delta}}{2a}$ (solutions conjuguées).
:::

:::aretenir Coefficients complexes
On cherche $\delta$ tel que $\delta^2 = \Delta$, puis $z = \dfrac{-b \pm \delta}{2a}$.
Racines carrées de $Z = X + iY$ : $\delta = x + iy$ avec $x^2 - y^2 = X$, $x^2 + y^2 = |Z|$, $2xy = Y$.
:::

:::aretenir Racines $n$-ièmes
$z^n = r\mathrm{e}^{i\theta}$ ($r > 0$) a exactement $n$ solutions : $z_k = \sqrt[n]{r}\,\mathrm{e}^{i\frac{\theta + 2k\pi}{n}}$, $k \in \{0, \ldots, n - 1\}$.
Racines de l'unité : $\omega_k = \mathrm{e}^{\frac{2ik\pi}{n}}$, de somme nulle pour $n \geqslant 2$ ; sommets d'un polygone régulier.
:::

:::attention Les 3 pièges du BAC
1. Écrire $\sqrt{\Delta}$ quand $\Delta$ est complexe : il faut chercher $\delta$ tel que $\delta^2 = \Delta$.
2. Oublier l'équation $x^2 + y^2 = |Z|$ qui simplifie le système.
3. Donner $n + 1$ racines $n$-ièmes ($k$ va de $0$ à $n - 1$).
:::$R$, objectives=$O$Résoudre dans $\mathbb{C}$ une équation du second degré à coefficients réels.
Calculer les racines carrées d'un nombre complexe sous forme algébrique.
Résoudre une équation du second degré à coefficients complexes.
Déterminer et représenter les racines $n$-ièmes d'un nombre complexe, en particulier de l'unité.$O$, difficulty=3, duration_min=55, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='complexes' and l.position=3;

update lessons l set title=$T$Nombres complexes et géométrie$T$, kind='cours', body=$L$## Affixe, distance, angle

:::definition
Dans un repère orthonormé direct $(O ; \vec u, \vec v)$, le point $M(a ; b)$ et le vecteur $\vec w(a ; b)$ ont pour **affixe** $z = a + ib$.
:::

:::propriete Le dictionnaire
- Affixe de $\overrightarrow{AB}$ : $z_B - z_A$. Milieu de $[AB]$ : $\frac{z_A + z_B}{2}$.
- **Distance** : $AB = |z_B - z_A|$.
- **Angle** : $(\vec u, \overrightarrow{AB}) \equiv \arg(z_B - z_A)\ [2\pi]$, et pour $A \neq B$, $A \neq C$ :
$$(\overrightarrow{AB}, \overrightarrow{AC}) \equiv \arg\left(\frac{z_C - z_A}{z_B - z_A}\right)\ [2\pi].$$
:::

## L'outil central : le quotient de deux différences

:::propriete
Soit $q = \dfrac{z_C - z_A}{z_B - z_A}$, avec $A$, $B$, $C$ distincts.
- $A$, $B$, $C$ **alignés** $\iff q \in \mathbb{R}$.
- $(AB) \perp (AC)$ $\iff q \in i\mathbb{R}$.
- $AB = AC$ $\iff |q| = 1$.
- $ABC$ **isocèle rectangle** en $A$ $\iff q = \pm i$.
- $ABC$ **équilatéral** $\iff q = \mathrm{e}^{\pm i\pi/3}$.
:::

:::exemple
$A(1)$, $B(3 + i)$ et $C(2 - i)$ : $q = \dfrac{1 - i}{2 + i} = \dfrac{(1 - i)(2 - i)}{5} = \dfrac{1 - 3i}{5}$. Ni réel ni imaginaire pur : le triangle n'est ni aplati ni rectangle en $A$.
:::

:::methode Points cocycliques
Quatre points distincts $A$, $B$, $C$, $D$ sont cocycliques ou alignés si et seulement si $\dfrac{z_C - z_A}{z_D - z_A} \times \dfrac{z_D - z_B}{z_C - z_B}$ est réel.
:::

## Transformations du plan

:::propriete Écritures complexes
| Transformation | Écriture complexe |
| --- | --- |
| Translation de vecteur d'affixe $b$ | $z' = z + b$ |
| Homothétie de centre $\Omega(\omega)$, de rapport $k \in \mathbb{R}^*$ | $z' - \omega = k(z - \omega)$ |
| Rotation de centre $\Omega(\omega)$, d'angle $\theta$ | $z' - \omega = \mathrm{e}^{i\theta}(z - \omega)$ |
:::

[[fig:complexe-rotation]] Rotation : $\Omega M' = \Omega M$ et $(\overrightarrow{\Omega M}, \overrightarrow{\Omega M'}) \equiv \theta$.

:::methode Identifier $z' = az + b$
- $a = 1$ : translation de vecteur d'affixe $b$.
- $a \neq 1$ : un unique point fixe $\omega = \dfrac{b}{1 - a}$, et $z' - \omega = a(z - \omega)$.
  - $a$ réel : homothétie de centre $\omega$ et de rapport $a$.
  - $|a| = 1$, $a \neq 1$ : rotation de centre $\omega$ et d'angle $\arg a$.
:::

:::exemple
$z' = iz + 1 + i$ : $a = i$, $|a| = 1$, $\omega = \dfrac{1 + i}{1 - i} = i$. C'est la rotation de centre $\Omega(i)$ et d'angle $\frac{\pi}{2}$.
:::

:::exemple Homothétie et rotation
- $z' = -2z + 3$ : $a = -2$ réel, $\omega = \frac{3}{1 - (-2)} = 1$ ; homothétie de centre $\Omega(1)$ et de rapport $-2$.
- $z' = \mathrm{e}^{i\pi/3}z$ : rotation de centre $O$ et d'angle $\frac{\pi}{3}$ ; l'image de $A(2)$ est $A'(1 + i\sqrt{3})$, et $OAA'$ est équilatéral.
:::

:::app Écriture complexe d'une rotation
Donne l'écriture complexe de la rotation de centre $\Omega(1 + i)$ et d'angle $-\frac{\pi}{2}$, puis l'image de $O$.
:::solution Correction
$z' - (1 + i) = \mathrm{e}^{-i\pi/2}\big(z - (1 + i)\big) = -i(z - 1 - i)$, soit $z' = -iz + i - 1 + 1 + i = -iz + 2i$. Image de $O$ : $z' = 2i$.
:::
:::

## Ensembles de points

:::methode
Pour un point $M(z)$ :
- $|z - z_A| = r$ : cercle de centre $A$ et de rayon $r$.
- $|z - z_A| = |z - z_B|$ : médiatrice de $[AB]$.
- $\arg(z - z_A) \equiv \theta\ [2\pi]$ : demi-droite d'origine $A$ privée de $A$.
- $\dfrac{z - z_A}{z - z_B}$ réel : droite $(AB)$ privée de $B$ ; imaginaire pur : cercle de diamètre $[AB]$ privé de $B$.
:::

:::app Applique
Soient $A(2)$, $B(2i)$ et $R$ la rotation de centre $O$ et d'angle $\frac{\pi}{2}$. Détermine l'image de $A$ par $R$ et montre que le triangle $OAB$ est isocèle rectangle en $O$.
:::solution Correction
$R : z' = \mathrm{e}^{i\pi/2}z = iz$. Image de $A$ : $i \times 2 = 2i = z_B$, donc $R(A) = B$. Une rotation conserve les distances : $OA = OB$ ; et $(\overrightarrow{OA}, \overrightarrow{OB}) \equiv \frac{\pi}{2}$. Équivalemment, $\dfrac{z_B - z_O}{z_A - z_O} = i$ : $OAB$ est isocèle rectangle en $O$.
:::
:::

:::aretenir
- $AB = |z_B - z_A|$ ; angles par l'argument d'un quotient.
- $q = \frac{z_C - z_A}{z_B - z_A}$ : réel (alignés), imaginaire pur (perpendiculaires), module $1$ (isocèle).
- $z' = az + b$ : translation si $a = 1$, sinon centre $\frac{b}{1 - a}$, homothétie si $a$ réel, rotation si $|a| = 1$.
:::

:::funnel Nombres complexes et géométrie
:::$L$, resume=$R$## Complexes et géométrie — l'essentiel

:::aretenir Dictionnaire
$AB = |z_B - z_A|$ ; $\;(\vec u, \overrightarrow{AB}) \equiv \arg(z_B - z_A)$ ; $\;(\overrightarrow{AB}, \overrightarrow{AC}) \equiv \arg\dfrac{z_C - z_A}{z_B - z_A}\ [2\pi]$.
:::

:::aretenir Le quotient $q = \frac{z_C - z_A}{z_B - z_A}$
$q$ réel : $A, B, C$ alignés. $q$ imaginaire pur : $(AB) \perp (AC)$. $|q| = 1$ : $AB = AC$. $q = \mathrm{e}^{\pm i\pi/3}$ : $ABC$ équilatéral.
:::

:::aretenir Transformations
Translation $z' = z + b$. Homothétie $z' - \omega = k(z - \omega)$. Rotation $z' - \omega = \mathrm{e}^{i\theta}(z - \omega)$.
$z' = az + b$, $a \neq 1$ : centre $\omega = \frac{b}{1 - a}$ ; $a$ réel : homothétie de rapport $a$ ; $|a| = 1$ : rotation d'angle $\arg a$.
:::

:::attention Les 3 pièges du BAC
1. Inverser numérateur et dénominateur du quotient : l'angle change de signe.
2. Oublier le centre $\omega$ dans l'écriture d'une rotation.
3. Conclure « isocèle rectangle » sans vérifier à la fois $|q| = 1$ et $\arg q \equiv \pm\frac{\pi}{2}$.
:::$R$, objectives=$O$Traduire distances et angles orientés en termes de modules et d'arguments.
Utiliser le quotient $\frac{z_C - z_A}{z_B - z_A}$ pour établir alignement, orthogonalité ou nature d'un triangle.
Reconnaître l'écriture complexe d'une translation, d'une homothétie, d'une rotation.
Identifier la transformation $z' = az + b$ et déterminer ses éléments caractéristiques.$O$, difficulty=3, duration_min=60, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='complexes' and l.position=4;

update lessons l set title=$T$Fiche de révision — Nombres complexes$T$, kind='resume', body=$L$:::aretenir Écritures
$z = a + ib = r(\cos\theta + i\sin\theta) = r\mathrm{e}^{i\theta}$, $r = |z| = \sqrt{a^2 + b^2}$, $\cos\theta = \frac{a}{r}$, $\sin\theta = \frac{b}{r}$.
$\bar z = a - ib$, $z\bar z = |z|^2$. $z$ réel $\iff \bar z = z$ ; imaginaire pur $\iff \bar z = -z$.
:::

:::aretenir Calculs
Modules multiplicatifs ; arguments additifs ; $(r\mathrm{e}^{i\theta})^n = r^n\mathrm{e}^{in\theta}$ (Moivre).
Euler : $\cos\theta = \frac{\mathrm{e}^{i\theta} + \mathrm{e}^{-i\theta}}{2}$, $\sin\theta = \frac{\mathrm{e}^{i\theta} - \mathrm{e}^{-i\theta}}{2i}$. Angle moitié : $\mathrm{e}^{ia} + \mathrm{e}^{ib} = 2\cos\frac{a - b}{2}\mathrm{e}^{i\frac{a + b}{2}}$.
:::

:::aretenir Équations
$\Delta < 0$ réel : $\frac{-b \pm i\sqrt{-\Delta}}{2a}$. $\Delta$ complexe : $\delta^2 = \Delta$ avec $x^2 - y^2 = X$, $x^2 + y^2 = |\Delta|$, $2xy = Y$.
$z^n = r\mathrm{e}^{i\theta}$ : $z_k = \sqrt[n]{r}\,\mathrm{e}^{i(\theta + 2k\pi)/n}$, $0 \leqslant k \leqslant n - 1$. $\sum \omega_k = 0$.
:::

:::aretenir Géométrie
$AB = |z_B - z_A|$ ; $(\overrightarrow{AB}, \overrightarrow{AC}) \equiv \arg\frac{z_C - z_A}{z_B - z_A}$.
Quotient réel : alignés ; imaginaire pur : perpendiculaires ; $\pm i$ : isocèle rectangle ; $\mathrm{e}^{\pm i\pi/3}$ : équilatéral.
:::

:::aretenir Transformations
$z' = z + b$ translation ; $z' - \omega = k(z - \omega)$ homothétie ; $z' - \omega = \mathrm{e}^{i\theta}(z - \omega)$ rotation. Pour $z' = az + b$ avec $a \neq 1$ : $\omega = \frac{b}{1 - a}$.
:::$L$, resume=null, objectives=null, difficulty=1, duration_min=15, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='complexes' and l.position=5;

update lessons l set title=$T$Méthodes & exercices types$T$, kind='cours', body=$L$## Comment lire cette notion

L'exercice de nombres complexes du BAC SM enchaîne en général : une équation dans $\mathbb{C}$, l'écriture exponentielle des solutions, puis une partie géométrique (transformation, nature d'une figure, ensemble de points). Voici les réflexes pour chacune de ces étapes.

## Formes et linéarisation

:::methode Passer en forme exponentielle
1. Calculer $r = |z|$.
2. Factoriser : $z = r\left(\frac{a}{r} + i\frac{b}{r}\right)$.
3. Reconnaître $\cos\theta$ et $\sin\theta$ dans les valeurs usuelles.
:::

:::exemple Puissance et forme algébrique
$\left(\dfrac{1 + i\sqrt{3}}{1 - i}\right)^{12}$ : $1 + i\sqrt{3} = 2\mathrm{e}^{i\pi/3}$, $1 - i = \sqrt{2}\mathrm{e}^{-i\pi/4}$, donc le quotient vaut $\sqrt{2}\,\mathrm{e}^{i7\pi/12}$, et sa puissance $12$ vaut $2^6\mathrm{e}^{i7\pi} = -64$.
:::

:::methode Calculer $\cos\frac{\pi}{12}$ avec les complexes
$\mathrm{e}^{i\pi/12} = \mathrm{e}^{i\pi/3}\mathrm{e}^{-i\pi/4} = \left(\frac{1}{2} + i\frac{\sqrt{3}}{2}\right)\left(\frac{\sqrt{2}}{2} - i\frac{\sqrt{2}}{2}\right)$. En identifiant la partie réelle : $\cos\dfrac{\pi}{12} = \dfrac{\sqrt{2} + \sqrt{6}}{4}$.
:::

:::app Linéariser
Linéarise $\sin^2\theta\cos\theta$.
:::solution Correction
$\sin^2\theta = \frac{1 - \cos 2\theta}{2}$, donc $\sin^2\theta\cos\theta = \frac{\cos\theta}{2} - \frac{\cos 2\theta\cos\theta}{2}$. Avec $\cos a\cos b = \frac{1}{2}[\cos(a + b) + \cos(a - b)]$ : $\cos 2\theta\cos\theta = \frac{\cos 3\theta + \cos\theta}{2}$. Finalement $\sin^2\theta\cos\theta = \dfrac{\cos\theta - \cos 3\theta}{4}$.
:::
:::

## Géométrie complexe

:::methode Nature d'un triangle $ABC$
1. Calculer $q = \dfrac{z_C - z_A}{z_B - z_A}$ sous forme algébrique ou exponentielle.
2. Lire $|q|$ (rapport $\frac{AC}{AB}$) et $\arg q$ (angle en $A$).
3. Conclure : $q = \pm i$ isocèle rectangle, $q = \mathrm{e}^{\pm i\pi/3}$ équilatéral, $q$ réel alignés.
:::

:::exemple
$A(1 + i)$, $B(3 + 2i)$, $C(2 - i)$ : $z_B - z_A = 2 + i$ et $z_C - z_A = 1 - 2i = -i(2 + i)$. Donc $q = -i$ : $ABC$ est isocèle rectangle en $A$.
:::

:::methode Nature d'un quadrilatère $ABCD$
- Parallélogramme : $z_B - z_A = z_C - z_D$ (milieux des diagonales confondus).
- Losange : parallélogramme avec $AB = AD$.
- Rectangle : parallélogramme avec $\frac{z_D - z_A}{z_B - z_A}$ imaginaire pur.
- Carré : $\frac{z_D - z_A}{z_B - z_A} = \pm i$ et parallélogramme.
:::

## Équation et interprétation géométrique

:::exemple Traité
Résoudre $z^2 - 2\sqrt{3}z + 4 = 0$ et interpréter. $\Delta = 12 - 16 = -4$, d'où $z_1 = \sqrt{3} + i = 2\mathrm{e}^{i\pi/6}$ et $z_2 = \bar z_1 = 2\mathrm{e}^{-i\pi/6}$. Les points $M_1$, $M_2$ sont sur le cercle de centre $O$ et de rayon $2$, symétriques par rapport à l'axe réel, et $(\overrightarrow{OM_2}, \overrightarrow{OM_1}) \equiv \frac{\pi}{3}$ : le triangle $OM_1M_2$ est équilatéral.
:::

## Transformations et ensembles de points

:::methode Image d'un point, éléments d'une transformation
- Image : remplacer $z$ par $z_M$ dans l'écriture complexe.
- Pour $z' = az + b$ : point fixe $\omega = \frac{b}{1 - a}$, puis nature selon $a$.
- Composer deux rotations : multiplier les coefficients $a$ ; les angles s'additionnent.
:::

:::app Applique
Soit $f$ la transformation d'écriture $z' = (1 + i)z - i$. Montre que $f$ a un unique point fixe et décris $f$ comme la composée d'une rotation et d'une homothétie de même centre.
:::solution Correction
$a = 1 + i \neq 1$ : point fixe $\omega = \dfrac{-i}{1 - (1 + i)} = \dfrac{-i}{-i} = 1$. Donc $z' - 1 = (1 + i)(z - 1) = \sqrt{2}\,\mathrm{e}^{i\pi/4}(z - 1)$ : $f$ est la composée de la rotation de centre $\Omega(1)$ et d'angle $\frac{\pi}{4}$ et de l'homothétie de centre $\Omega$ et de rapport $\sqrt{2}$.
:::
:::

:::aretenir
- Forme exponentielle pour les puissances ; Euler pour linéariser.
- Triangle : un quotient, son module et son argument.
- Quadrilatère : parallélogramme d'abord, puis angle droit et longueurs.
- $z' = az + b$ : point fixe puis lecture de $a = |a|\mathrm{e}^{i\theta}$.
:::

:::funnel Méthodes sur les nombres complexes
:::$L$, resume=$R$## Méthodes sur les complexes — l'essentiel

:::aretenir Choisir la forme
| Opération | Forme la plus adaptée |
| --- | --- |
| somme, différence | algébrique |
| produit, quotient, puissance | exponentielle |
| distance, angle | module et argument d'un quotient |
:::

:::attention Les 3 pièges du BAC
1. Développer $(1 + i)^{20}$ au lieu de passer en forme exponentielle.
2. Donner un argument faux en lisant seulement $\tan\theta$.
3. Confondre l'angle de la rotation avec l'argument de $b$ dans $z' = az + b$.
:::$R$, objectives=$O$Passer efficacement d'une forme à l'autre et calculer une puissance.
Linéariser et exprimer des formules trigonométriques avec Euler et Moivre.
Résoudre une équation et interpréter géométriquement ses solutions.
Déterminer la nature d'un triangle ou d'un quadrilatère et identifier une transformation.$O$, difficulty=3, duration_min=55, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='complexes' and l.position=50;

update lessons l set title=$T$Approfondissement : racines carrées, lieux géométriques$T$, kind='cours', body=$L$## Racine carrée algébrique d'un complexe

:::methode
Pour $Z = X + iY$, les racines carrées $\pm(x + iy)$ s'obtiennent par
$$x^2 = \frac{|Z| + X}{2}, \qquad y^2 = \frac{|Z| - X}{2}, \qquad xy \text{ du signe de } Y.$$
:::

:::exemple Valeurs exactes de $\cos\frac{\pi}{8}$ et $\sin\frac{\pi}{8}$
$\mathrm{e}^{i\pi/8}$ est une racine carrée de $\mathrm{e}^{i\pi/4} = \frac{\sqrt{2}}{2} + i\frac{\sqrt{2}}{2}$, de module $1$. Donc $\cos^2\frac{\pi}{8} = \dfrac{1 + \frac{\sqrt{2}}{2}}{2} = \dfrac{2 + \sqrt{2}}{4}$, et, comme $\cos\frac{\pi}{8} > 0$ : $\cos\dfrac{\pi}{8} = \dfrac{\sqrt{2 + \sqrt{2}}}{2}$, $\;\sin\dfrac{\pi}{8} = \dfrac{\sqrt{2 - \sqrt{2}}}{2}$.
:::

:::app Applique
Détermine les racines carrées de $-5 + 12i$.
:::solution Correction
$|Z| = 13$ : $x^2 = \frac{13 - 5}{2} = 4$, $y^2 = \frac{13 + 5}{2} = 9$, et $xy > 0$ car $Y = 12 > 0$. Racines : $\pm(2 + 3i)$. Vérification : $(2 + 3i)^2 = 4 + 12i - 9 = -5 + 12i$.
:::
:::

## Propriétés du module et de l'argument

:::propriete Inégalité triangulaire et cas d'égalité
Pour $z, z' \neq 0$ : $|z + z'| = |z| + |z'|$ si et seulement si $z$ et $z'$ ont le même argument (ils sont « positivement colinéaires »).
:::

:::propriete Module et conjugué
$|z|^2 = z\bar z$, d'où $|z + z'|^2 = |z|^2 + |z'|^2 + 2\,\mathrm{Re}(z\bar z')$. Si $|z| = 1$, alors $\bar z = \dfrac{1}{z}$.
:::

:::exemple
Si $|z| = 1$ et $z \neq 1$, alors $\dfrac{1 + z}{1 - z}$ est imaginaire pur. En effet, avec $\bar z = \frac{1}{z}$ : $\overline{\left(\dfrac{1 + z}{1 - z}\right)} = \dfrac{1 + \frac{1}{z}}{1 - \frac{1}{z}} = \dfrac{z + 1}{z - 1} = -\dfrac{1 + z}{1 - z}$.
:::

:::app Utiliser $|z| = 1$
Soit $z$ un complexe de module $1$, $z \neq -1$. Montre que $\dfrac{z}{(1 + z)^2}$ est réel.
:::solution Correction
Avec $\bar z = \frac{1}{z}$ : $\overline{\left(\dfrac{z}{(1 + z)^2}\right)} = \dfrac{\frac{1}{z}}{\left(1 + \frac{1}{z}\right)^2} = \dfrac{\frac{1}{z}}{\frac{(z + 1)^2}{z^2}} = \dfrac{z}{(1 + z)^2}$. Le nombre est égal à son conjugué : il est réel.
:::
:::

## Lieux géométriques

:::methode Deux méthodes
1. **Géométrique** : traduire la condition en distances ou angles ($|z - a| = AM$, $\arg\frac{z - a}{z - b} = (\overrightarrow{MB}, \overrightarrow{MA})$).
2. **Analytique** : poser $z = x + iy$, développer, reconnaître l'équation d'un cercle ou d'une droite.
:::

:::exemple Analytique
Ensemble des points $M(z)$ tels que $|z - 2| = 2|z + 1|$. Avec $z = x + iy$ : $(x - 2)^2 + y^2 = 4[(x + 1)^2 + y^2]$, soit $3x^2 + 3y^2 + 12x = 0$, soit $(x + 2)^2 + y^2 = 4$ : cercle de centre $(-2 ; 0)$ et de rayon $2$.
:::

:::exemple Avec un quotient
$Z = \dfrac{z - i}{z + 1}$ est réel $\iff M \in (AB)$ privée de $B$, avec $A(i)$ et $B(-1)$. $Z$ est imaginaire pur $\iff (\overrightarrow{MB}, \overrightarrow{MA}) \equiv \frac{\pi}{2}\ [\pi]$ ou $M = A$ : cercle de diamètre $[AB]$ privé de $B$.
:::

:::app Lieu défini par un argument
Détermine l'ensemble des points $M(z)$ tels que $\arg(z - 2i) \equiv \frac{\pi}{4}\ [2\pi]$.
:::solution Correction
$\arg(z - 2i) = (\vec u, \overrightarrow{AM})$ avec $A(2i)$. La condition décrit la demi-droite d'origine $A$, privée de $A$, dirigée par le vecteur d'affixe $1 + i$ : c'est $\{2i + t(1 + i),\ t > 0\}$.
:::
:::

:::aretenir
- Racine carrée : $x^2 = \frac{|Z| + X}{2}$, $y^2 = \frac{|Z| - X}{2}$, signe de $xy$.
- $|z| = 1 \Rightarrow \bar z = \frac{1}{z}$ ; égalité triangulaire si même argument.
- Lieux : géométrique (distances, angles) ou analytique ($z = x + iy$) ; retirer les points interdits.
:::

:::funnel Racines carrées et lieux géométriques
:::$L$, resume=$R$## Approfondissement — l'essentiel

:::aretenir Racine carrée algébrique
$\delta^2 = X + iY$ : $x^2 = \frac{|Z| + X}{2}$, $y^2 = \frac{|Z| - X}{2}$, signe de $xy$ = signe de $Y$.
:::

:::aretenir Lieux usuels
$|z - a| = r$ : cercle. $|z - a| = |z - b|$ : médiatrice. $\frac{z - a}{z - b} \in \mathbb{R}$ : droite $(AB)$ privée de $B$. $\frac{z - a}{z - b} \in i\mathbb{R}$ : cercle de diamètre $[AB]$ privé de $B$.
:::

:::attention Les 3 pièges du BAC
1. Oublier de retirer les points interdits (où le quotient n'est pas défini).
2. Écrire $|z + z'| = |z| + |z'|$ sans vérifier que $z$ et $z'$ ont le même argument.
3. Confondre $\arg(z - a) \equiv \theta$ (demi-droite) et $\arg(z - a) \equiv \theta\ [\pi]$ (droite).
:::$R$, objectives=$O$Calculer une racine carrée algébrique d'un complexe et l'utiliser pour en déduire des valeurs trigonométriques.
Exploiter les propriétés fines du module et de l'argument (inégalité triangulaire, cas d'égalité).
Déterminer un lieu géométrique défini par une condition sur un module ou un argument.$O$, difficulty=3, duration_min=45, bac_frequency=2
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='complexes' and l.position=60;

update lessons l set title=$T$Dérivabilité et dérivée$T$, kind='cours', body=$L$## Nombre dérivé et tangente

:::definition Dérivabilité en un point
$f$ est **dérivable** en $a$ si le taux d'accroissement $\dfrac{f(x) - f(a)}{x - a}$ admet une limite **finie** quand $x \to a$. Cette limite est le **nombre dérivé** $f'(a)$ :
$$f'(a) = \lim_{x \to a} \frac{f(x) - f(a)}{x - a} = \lim_{h \to 0} \frac{f(a + h) - f(a)}{h}.$$
:::

:::propriete Tangente
Si $f$ est dérivable en $a$, la courbe admet au point $A(a ; f(a))$ une tangente de coefficient directeur $f'(a)$ :
$$(T) : y = f'(a)(x - a) + f(a).$$
La fonction affine $x \mapsto f'(a)(x - a) + f(a)$ est l'**approximation affine** de $f$ au voisinage de $a$.
:::

:::theoreme Dérivable implique continue
Si $f$ est dérivable en $a$, alors $f$ est continue en $a$.
:::

:::demonstration
Pour $x \neq a$ : $f(x) - f(a) = (x - a) \times \dfrac{f(x) - f(a)}{x - a} \to 0 \times f'(a) = 0$. Donc $\lim\limits_{x \to a} f(x) = f(a)$.
:::

:::attention
La réciproque est fausse : $x \mapsto |x|$ est continue en $0$ mais pas dérivable (taux d'accroissement $\pm 1$ selon le côté).
:::

## Dérivabilité à gauche et à droite

:::definition
$f$ est dérivable **à droite** en $a$ si $\lim\limits_{x \to a^+} \dfrac{f(x) - f(a)}{x - a} = f'_d(a)$ existe et est finie ; **à gauche** de même avec $x \to a^-$.
:::

:::propriete
$f$ est dérivable en $a$ si et seulement si elle est dérivable à gauche et à droite en $a$ et $f'_g(a) = f'_d(a)$.
:::

:::propriete Interprétation géométrique
- $f'_d(a)$ existe : demi-tangente à droite de pente $f'_d(a)$.
- $f'_g(a) \neq f'_d(a)$ : **point anguleux** (deux demi-tangentes).
- Taux d'accroissement $\to \pm\infty$ : demi-tangente **verticale**.
:::

:::exemple
$f(x) = \sqrt{x}$ en $0$ : $\dfrac{\sqrt{x} - 0}{x} = \dfrac{1}{\sqrt{x}} \to +\infty$ quand $x \to 0^+$. $f$ n'est pas dérivable à droite en $0$ ; la courbe admet une demi-tangente verticale à l'origine.
:::

:::exemple Fonction définie par morceaux
$f(x) = x^2 + x$ si $x \leqslant 0$ et $f(x) = \sin x$ si $x > 0$. À gauche : $\dfrac{x^2 + x}{x} = x + 1 \to 1$. À droite : $\dfrac{\sin x}{x} \to 1$. Donc $f$ est dérivable en $0$ et $f'(0) = 1$.
:::

## Dérivées usuelles et opérations

:::aretenir Fonctions usuelles
| $f(x)$ | $f'(x)$ | Domaine de dérivabilité |
| --- | --- | --- |
| $k$ (constante) | $0$ | $\mathbb{R}$ |
| $x^n$ ($n \in \mathbb{Z}^*$) | $n x^{n-1}$ | $\mathbb{R}$ (ou $\mathbb{R}^*$ si $n < 0$) |
| $\sqrt{x}$ | $\dfrac{1}{2\sqrt{x}}$ | $]0 ; +\infty[$ |
| $\sin x$ | $\cos x$ | $\mathbb{R}$ |
| $\cos x$ | $-\sin x$ | $\mathbb{R}$ |
| $\tan x$ | $1 + \tan^2 x = \dfrac{1}{\cos^2 x}$ | $x \neq \frac{\pi}{2} + k\pi$ |
:::

:::aretenir Opérations
$(u + v)' = u' + v'$, $\;(ku)' = ku'$, $\;(uv)' = u'v + uv'$, $\;\left(\dfrac{u}{v}\right)' = \dfrac{u'v - uv'}{v^2}$, $\;\left(\dfrac{1}{v}\right)' = -\dfrac{v'}{v^2}$, $\;(u^n)' = n u' u^{n-1}$, $\;(\sqrt{u})' = \dfrac{u'}{2\sqrt{u}}$ ($u > 0$).
:::

:::exemple
$f(x) = \dfrac{x^2 + 1}{2x - 1}$ : $f'(x) = \dfrac{2x(2x - 1) - 2(x^2 + 1)}{(2x - 1)^2} = \dfrac{2x^2 - 2x - 2}{(2x - 1)^2}$.
:::

## Dérivée d'une composée et d'une réciproque

:::theoreme Composée
Si $u$ est dérivable en $x$ et $v$ dérivable en $u(x)$, alors $v \circ u$ est dérivable en $x$ et
$$(v \circ u)'(x) = u'(x) \times v'\big(u(x)\big).$$
:::

:::exemple
$f(x) = \sin(x^2 + 1)$ : $f'(x) = 2x\cos(x^2 + 1)$. $\quad g(x) = \cos^3 x = (\cos x)^3$ : $g'(x) = -3\sin x\cos^2 x$.
:::

:::theoreme Dérivée d'une fonction réciproque
Soit $f$ continue et strictement monotone sur $I$, dérivable en $x_0 \in I$ avec $f'(x_0) \neq 0$. Alors $f^{-1}$ est dérivable en $y_0 = f(x_0)$ et
$$\left(f^{-1}\right)'(y_0) = \frac{1}{f'(x_0)} = \frac{1}{f'\big(f^{-1}(y_0)\big)}.$$
Si $f'(x_0) = 0$, la courbe de $f^{-1}$ admet une tangente verticale au point d'abscisse $y_0$.
:::

:::demonstration
On dérive l'identité $f\big(f^{-1}(y)\big) = y$ : $\left(f^{-1}\right)'(y) \times f'\big(f^{-1}(y)\big) = 1$.
:::

:::propriete Deux dérivées obtenues ainsi
- Racine $n$-ième : pour $x > 0$, $\left(\sqrt[n]{x}\right)' = \dfrac{1}{n\sqrt[n]{x^{n-1}}}$ ; plus généralement $\left(\sqrt[n]{u}\right)' = \dfrac{u'}{n\sqrt[n]{u^{n-1}}}$ pour $u > 0$.
- Arctangente : $\arctan'(x) = \dfrac{1}{1 + \tan^2(\arctan x)} = \dfrac{1}{1 + x^2}$ ; et $\left(\arctan u\right)' = \dfrac{u'}{1 + u^2}$.
:::

:::app Applique
Soit $f(x) = x^3 + x$ sur $\mathbb{R}$. Montre que $f$ admet une réciproque dérivable sur $\mathbb{R}$ et calcule $(f^{-1})'(2)$.
:::solution Correction
$f'(x) = 3x^2 + 1 > 0$ : $f$ est continue, strictement croissante, de limites $\mp\infty$ en $\mp\infty$ : bijection de $\mathbb{R}$ sur $\mathbb{R}$. Comme $f'$ ne s'annule pas, $f^{-1}$ est dérivable sur $\mathbb{R}$.

$f(1) = 2$, donc $f^{-1}(2) = 1$ et $(f^{-1})'(2) = \dfrac{1}{f'(1)} = \dfrac{1}{4}$.
:::
:::

:::aretenir
- $f'(a)$ = limite finie du taux d'accroissement ; tangente $y = f'(a)(x - a) + f(a)$.
- Gauche et droite égales $\Rightarrow$ dérivable ; sinon point anguleux ou demi-tangente verticale.
- Composée : $(v \circ u)' = u' \times v' \circ u$.
- Réciproque : $(f^{-1})' = \dfrac{1}{f' \circ f^{-1}}$ ; $\arctan' = \dfrac{1}{1 + x^2}$.
:::

:::funnel Dérivabilité et dérivée
:::$L$, resume=$R$## Dérivabilité — l'essentiel

:::aretenir Nombre dérivé et tangente
$f'(a) = \lim\limits_{h \to 0} \dfrac{f(a + h) - f(a)}{h}$ (limite **finie**).
Tangente en $a$ : $y = f'(a)(x - a) + f(a)$.
Dérivable en $a$ $\iff$ dérivable à gauche et à droite avec $f'_g(a) = f'_d(a)$.
:::

:::aretenir Dérivées à connaître
| $f(x)$ | $f'(x)$ |
| --- | --- |
| $x^n$ | $n x^{n-1}$ |
| $\sqrt{x}$ | $\dfrac{1}{2\sqrt{x}}$ |
| $\sqrt[n]{x}$ | $\dfrac{1}{n\sqrt[n]{x^{n-1}}}$ ($x > 0$) |
| $\tan x$ | $1 + \tan^2 x$ |
| $\arctan x$ | $\dfrac{1}{1 + x^2}$ |
| $v(u(x))$ | $u'(x)\,v'(u(x))$ |
| $f^{-1}(y)$ | $\dfrac{1}{f'(f^{-1}(y))}$ |
:::

:::attention Les 3 pièges du BAC
1. Dérivable $\Rightarrow$ continue, mais la réciproque est fausse ($|x|$ en $0$).
2. Oublier le facteur $u'$ dans la dérivée d'une composée.
3. Dériver $f^{-1}$ là où $f'$ s'annule : la réciproque n'y est pas dérivable.
:::$R$, objectives=$O$Étudier la dérivabilité en un point à l'aide du taux d'accroissement, à gauche et à droite.
Écrire l'équation de la tangente et de la demi-tangente.
Calculer des dérivées avec les formules usuelles et les opérations.
Dériver une fonction composée et une fonction réciproque (racine $n$-ième, arctangente).$O$, difficulty=2, duration_min=50, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='derivation' and l.position=1;

update lessons l set title=$T$Variations, extremums et convexité$T$, kind='cours', body=$L$## Le rôle de la dérivée

Ce chapitre exploite la dérivée pour **décrire** une fonction : sens de variation, extremums, forme de la courbe et comportement à l'infini. C'est le cœur de l'« étude de fonction » qui structure le problème d'analyse du BAC.

## Monotonie et extremums

:::theoreme Signe de la dérivée et variations
Soit $f$ dérivable sur un **intervalle** $I$.
- $f' = 0$ sur $I$ $\iff$ $f$ est constante sur $I$.
- $f' \geqslant 0$ sur $I$ $\iff$ $f$ est croissante sur $I$.
- Si $f' > 0$ sur $I$, sauf éventuellement en des points isolés où elle s'annule, alors $f$ est **strictement** croissante sur $I$.
:::

:::attention
L'hypothèse « intervalle » est indispensable : $x \mapsto -\dfrac{1}{x}$ a une dérivée positive sur $\mathbb{R}^*$, mais n'est pas croissante sur $\mathbb{R}^*$ ($-\frac{1}{-1} = 1 > -1 = -\frac{1}{1}$).
:::

:::definition Extremum local
$f$ admet un **maximum local** en $a$ s'il existe un intervalle ouvert $J$ contenant $a$ tel que $f(x) \leqslant f(a)$ pour tout $x \in J$. Définition analogue pour un minimum local.
:::

:::theoreme
Si $f$ est dérivable sur un intervalle ouvert $I$ et admet un extremum local en $a \in I$, alors $f'(a) = 0$. Réciproquement, si $f'$ s'annule en $a$ **en changeant de signe**, $f$ admet un extremum local en $a$.
:::

:::exemple
$f(x) = x^3$ : $f'(0) = 0$ mais $f' \geqslant 0$ de part et d'autre : pas d'extremum en $0$. $\quad g(x) = x^3 - 3x$ : $g'(x) = 3(x - 1)(x + 1)$ change de signe en $-1$ (maximum local $g(-1) = 2$) et en $1$ (minimum local $g(1) = -2$).
:::

## Convexité et points d'inflexion

:::definition
Une fonction $f$ dérivable sur $I$ est **convexe** sur $I$ si sa courbe est au-dessus de chacune de ses tangentes ; **concave** si elle est au-dessous.
:::

:::theoreme
Si $f$ est deux fois dérivable sur $I$ :
- $f'' \geqslant 0$ sur $I$ $\iff$ $f$ est convexe sur $I$ ($f'$ croissante) ;
- $f'' \leqslant 0$ sur $I$ $\iff$ $f$ est concave sur $I$ ($f'$ décroissante).
:::

[[fig:convexite-inflexion]] Au point d'inflexion, la courbe traverse sa tangente.

:::definition Point d'inflexion
Le point $A(a ; f(a))$ est un **point d'inflexion** si la courbe traverse sa tangente en $A$, c'est-à-dire si la convexité change en $a$. Si $f''$ s'annule en $a$ **en changeant de signe**, $A$ est un point d'inflexion.
:::

:::exemple
$f(x) = x^3 - 3x^2 + 2$ : $f''(x) = 6x - 6$ s'annule en changeant de signe en $1$. Le point $(1 ; 0)$ est un point d'inflexion ; $f$ est concave sur $]-\infty ; 1]$ et convexe sur $[1 ; +\infty[$.
:::

:::methode Position relative courbe-tangente
Étudier le signe de $d(x) = f(x) - [f'(a)(x - a) + f(a)]$, ou utiliser la convexité : si $f$ est convexe, $d(x) \geqslant 0$.
:::

## Branches infinies et asymptotes

:::definition Asymptotes
- **Verticale** $x = a$ si $\lim\limits_{x \to a^\pm} f(x) = \pm\infty$.
- **Horizontale** $y = \ell$ en $\pm\infty$ si $\lim\limits_{x \to \pm\infty} f(x) = \ell$.
- **Oblique** $y = ax + b$ ($a \neq 0$) en $\pm\infty$ si $\lim\limits_{x \to \pm\infty} \big[f(x) - (ax + b)\big] = 0$.
:::

:::methode Chercher une asymptote oblique
Quand $\lim\limits_{+\infty} f = \pm\infty$ :
1. $a = \lim\limits_{x \to +\infty} \dfrac{f(x)}{x}$ (si finie et non nulle) ;
2. $b = \lim\limits_{x \to +\infty} \big[f(x) - ax\big]$ (si finie).
Alors $y = ax + b$ est asymptote oblique. Le signe de $f(x) - (ax + b)$ donne la position relative.
:::

:::exemple
$f(x) = \dfrac{x^2 + x + 1}{x - 1}$. Division euclidienne : $f(x) = x + 2 + \dfrac{3}{x - 1}$. Comme $\dfrac{3}{x - 1} \to 0$ en $\pm\infty$, la droite $y = x + 2$ est asymptote oblique ; la courbe est au-dessus pour $x > 1$, au-dessous pour $x < 1$. De plus $x = 1$ est asymptote verticale.
:::

:::app Applique
Soit $f(x) = x - 1 + \dfrac{4}{x}$ sur $]0 ; +\infty[$. Étudie les variations de $f$, sa convexité et ses asymptotes.
:::solution Correction
$f'(x) = 1 - \dfrac{4}{x^2} = \dfrac{(x - 2)(x + 2)}{x^2}$ : négative sur $]0 ; 2]$, positive sur $[2 ; +\infty[$. Minimum $f(2) = 3$.

$f''(x) = \dfrac{8}{x^3} > 0$ : $f$ est convexe sur $]0 ; +\infty[$.

$\lim\limits_{0^+} f = +\infty$ : asymptote verticale $x = 0$. $f(x) - (x - 1) = \dfrac{4}{x} \to 0$ en $+\infty$ : asymptote oblique $y = x - 1$, la courbe étant au-dessus.
:::
:::

## Réciproque et convexité

Les résultats sur les variations se transmettent à la réciproque : si $f$ est strictement croissante et convexe, $f^{-1}$ est strictement croissante et **concave** (leurs courbes sont symétriques par rapport à $y = x$). C'est le cas de $\exp$ et $\ln$, ou de $x^2$ et $\sqrt{x}$ sur $[0 ; +\infty[$.

:::aretenir
- Signe de $f'$ sur un **intervalle** $\Rightarrow$ variations ; extremum si $f'$ change de signe.
- Signe de $f''$ $\Rightarrow$ convexité ; inflexion si $f''$ change de signe.
- Oblique : $a = \lim \frac{f(x)}{x}$, $b = \lim [f(x) - ax]$, puis signe de $f(x) - (ax + b)$.
:::

:::funnel Variations, extremums et convexité
:::$L$, resume=$R$## Variations et convexité — l'essentiel

:::aretenir Dérivée et variations
Sur un **intervalle** : $f' \geqslant 0$ $\Rightarrow$ $f$ croissante ; $f' > 0$ sauf en des points isolés $\Rightarrow$ strictement croissante.
$f'$ s'annule **en changeant de signe** en $a$ $\Rightarrow$ extremum local en $a$.
:::

:::aretenir Convexité
$f'' \geqslant 0$ : convexe (courbe au-dessus de ses tangentes). $f'' \leqslant 0$ : concave.
$f''$ s'annule en changeant de signe en $a$ : point d'inflexion (la tangente traverse la courbe).
:::

:::aretenir Asymptotes
Verticale $x = a$ : $\lim\limits_{a} f = \pm\infty$. Horizontale $y = \ell$ : $\lim\limits_{\pm\infty} f = \ell$.
Oblique $y = ax + b$ : $\lim\limits_{\pm\infty} [f(x) - (ax + b)] = 0$.
:::

:::attention Les 3 pièges du BAC
1. $f'(a) = 0$ ne suffit pas pour un extremum ($x^3$ en $0$).
2. Conclure aux variations sur une réunion d'intervalles.
3. Confondre point d'inflexion ($f''$ change de signe) et extremum ($f'$ change de signe).
:::$R$, objectives=$O$Déduire le sens de variation d'une fonction du signe de sa dérivée.
Identifier un extremum local à l'aide du changement de signe de la dérivée.
Étudier la concavité d'une courbe et déterminer ses points d'inflexion.
Déterminer les asymptotes et les branches paraboliques d'une courbe.$O$, difficulty=2, duration_min=55, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='derivation' and l.position=2;

update lessons l set title=$T$Théorèmes de Rolle et des accroissements finis$T$, kind='cours', body=$L$## Théorème de Rolle

:::theoreme Théorème de Rolle
Soit $f$ une fonction **continue** sur $[a ; b]$ et **dérivable** sur $]a ; b[$, avec $f(a) = f(b)$. Alors il existe au moins un réel $c \in ]a ; b[$ tel que $f'(c) = 0$.
:::

Géométriquement : une courbe lisse qui part et arrive à la même hauteur possède au moins une tangente horizontale entre les deux.

:::demonstration
Sur le segment $[a ; b]$, $f$ continue est bornée et atteint ses bornes $m$ et $M$. Si $m = M$, $f$ est constante et $f' = 0$ partout sur $]a ; b[$. Sinon, l'une des bornes, disons $M$, est différente de $f(a) = f(b)$ : elle est atteinte en un point $c \in ]a ; b[$. En $c$, $f$ admet un maximum ; donc, pour $h > 0$ petit, $\dfrac{f(c + h) - f(c)}{h} \leqslant 0$ et $\dfrac{f(c - h) - f(c)}{-h} \geqslant 0$. En passant à la limite : $f'(c) \leqslant 0$ et $f'(c) \geqslant 0$, d'où $f'(c) = 0$.
:::

:::attention Les trois hypothèses sont nécessaires
- Sans continuité en $b$ : $f(x) = x$ sur $[0 ; 1[$ et $f(1) = 0$.
- Sans dérivabilité : $f(x) = |x|$ sur $[-1 ; 1]$, $f(-1) = f(1)$ mais $f'$ ne s'annule jamais.
- Sans $f(a) = f(b)$ : $f(x) = x$ sur $[0 ; 1]$.
:::

:::exemple Majorer le nombre de racines
Soit $P$ un polynôme de degré $n$. Entre deux racines consécutives de $P$, Rolle donne une racine de $P'$. Si $P$ avait $n + 1$ racines distinctes, $P'$ (de degré $n - 1$) en aurait $n$ : contradiction. Plus généralement, si $f'$ ne s'annule pas sur $I$, l'équation $f(x) = k$ a **au plus une** solution sur $I$.
:::

## Théorème des accroissements finis

:::theoreme TAF
Soit $f$ continue sur $[a ; b]$ et dérivable sur $]a ; b[$. Il existe au moins un réel $c \in ]a ; b[$ tel que
$$\frac{f(b) - f(a)}{b - a} = f'(c).$$
:::

Géométriquement : il existe un point où la tangente est **parallèle à la corde** $[AB]$, avec $A(a ; f(a))$ et $B(b ; f(b))$.

:::demonstration
On applique Rolle à $g(x) = f(x) - \dfrac{f(b) - f(a)}{b - a}(x - a)$, continue sur $[a ; b]$, dérivable sur $]a ; b[$, avec $g(a) = g(b) = f(a)$. Il existe $c$ tel que $g'(c) = 0$, soit $f'(c) = \dfrac{f(b) - f(a)}{b - a}$.
:::

:::exemple
$f(x) = x^2$ sur $[1 ; 3]$ : $\dfrac{9 - 1}{3 - 1} = 4 = f'(c) = 2c$, d'où $c = 2 \in ]1 ; 3[$.
:::

## Inégalité des accroissements finis

:::theoreme IAF
Soit $f$ continue sur $[a ; b]$ et dérivable sur $]a ; b[$.
1. Si $m \leqslant f'(x) \leqslant M$ pour tout $x \in ]a ; b[$, alors $m(b - a) \leqslant f(b) - f(a) \leqslant M(b - a)$.
2. Si $|f'(x)| \leqslant k$ pour tout $x$ d'un intervalle $I$, alors pour tous $x, y \in I$ : $|f(x) - f(y)| \leqslant k\,|x - y|$.
:::

:::demonstration
Par le TAF, $f(b) - f(a) = f'(c)(b - a)$ avec $m \leqslant f'(c) \leqslant M$ et $b - a > 0$.
:::

:::methode Démontrer un encadrement avec l'IAF
1. Choisir la fonction $f$ et l'intervalle $[a ; b]$ adaptés à l'inégalité visée.
2. Encadrer $f'$ sur $]a ; b[$ (monotonie de $f'$).
3. Appliquer l'IAF et réarranger.
:::

:::exemple Encadrer $\ln$
Pour $x > 0$, appliquons l'IAF à $\ln$ sur $[x ; x + 1]$ : $\ln'(t) = \dfrac{1}{t}$ est comprise entre $\dfrac{1}{x + 1}$ et $\dfrac{1}{x}$. Donc
$$\frac{1}{x + 1} \leqslant \ln(x + 1) - \ln x \leqslant \frac{1}{x}.$$
:::

:::exemple Encadrer $\sin$
Pour $x > 0$ : $|\sin x - \sin 0| \leqslant 1 \times |x - 0|$ car $|\cos| \leqslant 1$, donc $|\sin x| \leqslant x$.
:::

## Application aux suites récurrentes

:::methode
Si $u_{n+1} = f(u_n)$, $\ell = f(\ell)$ et $|f'| \leqslant k < 1$ sur un intervalle stable contenant $\ell$ et les $u_n$, l'IAF donne $|u_{n+1} - \ell| = |f(u_n) - f(\ell)| \leqslant k|u_n - \ell|$, puis $|u_n - \ell| \leqslant k^n|u_0 - \ell|$ : la suite converge vers $\ell$.
:::

:::app Applique
Montre que pour tous réels $a < b$ : $|\arctan b - \arctan a| \leqslant b - a$, puis que pour tout $x > 0$, $\dfrac{x}{1 + x^2} < \arctan x < x$.
:::solution Correction
**1.** $\arctan'(t) = \dfrac{1}{1 + t^2} \in ]0 ; 1]$ ; par l'IAF, $0 \leqslant \arctan b - \arctan a \leqslant b - a$.

**2.** Sur $[0 ; x]$, le TAF donne $c \in ]0 ; x[$ avec $\arctan x = \dfrac{x}{1 + c^2}$. Comme $0 < c < x$ : $\dfrac{1}{1 + x^2} < \dfrac{1}{1 + c^2} < 1$, d'où $\dfrac{x}{1 + x^2} < \arctan x < x$.
:::
:::

:::aretenir
- Rolle : continue sur $[a ; b]$, dérivable sur $]a ; b[$, $f(a) = f(b)$ $\Rightarrow$ $f'(c) = 0$.
- TAF : $f(b) - f(a) = f'(c)(b - a)$, tangente parallèle à la corde.
- IAF : un encadrement de $f'$ donne un encadrement de $f(b) - f(a)$.
- $c$ existe, il n'est ni unique ni explicite en général.
:::

:::funnel Théorèmes de Rolle et des accroissements finis
:::$L$, resume=$R$## Rolle et accroissements finis — l'essentiel

:::aretenir Théorème de Rolle
$f$ continue sur $[a ; b]$, dérivable sur $]a ; b[$, $f(a) = f(b)$ $\Rightarrow$ il existe $c \in ]a ; b[$ tel que $f'(c) = 0$.
:::

:::aretenir Théorème des accroissements finis (TAF)
$f$ continue sur $[a ; b]$, dérivable sur $]a ; b[$ $\Rightarrow$ il existe $c \in ]a ; b[$ tel que
$$f(b) - f(a) = f'(c)(b - a).$$
:::

:::aretenir Inégalité des accroissements finis (IAF)
Si $m \leqslant f'(x) \leqslant M$ sur $]a ; b[$ : $m(b - a) \leqslant f(b) - f(a) \leqslant M(b - a)$.
Si $|f'| \leqslant k$ sur $I$ : $|f(x) - f(y)| \leqslant k|x - y|$ pour tous $x, y \in I$.
:::

:::attention Les 3 pièges du BAC
1. Oublier une hypothèse (continuité sur le **fermé**, dérivabilité sur l'**ouvert**).
2. Affirmer que $c$ est unique : le théorème ne donne que l'existence.
3. Écrire $c \in [a ; b]$ au lieu de $c \in ]a ; b[$.
:::$R$, objectives=$O$Énoncer et appliquer le théorème de Rolle, en vérifiant chacune de ses hypothèses.
Énoncer et interpréter géométriquement le théorème des accroissements finis.
Utiliser l'inégalité des accroissements finis pour établir des encadrements.
Exploiter ces théorèmes pour l'étude des suites récurrentes et l'existence de solutions.$O$, difficulty=3, duration_min=55, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='derivation' and l.position=3;

update lessons l set title=$T$Fonction logarithme népérien$T$, kind='cours', body=$L$## Définition et propriétés du logarithme

:::definition
La fonction **logarithme népérien**, notée $\ln$, est l'unique primitive sur $]0 ; +\infty[$ de la fonction $x \mapsto \dfrac{1}{x}$ qui s'annule en $1$ :
$$\ln 1 = 0, \qquad \ln'(x) = \frac{1}{x} \quad (x > 0).$$
Le réel $\mathrm{e}$ est l'unique réel tel que $\ln \mathrm{e} = 1$ ; $\mathrm{e} \approx 2{,}718$.
:::

:::theoreme Relation fondamentale
Pour tous $a, b > 0$ : $\ln(ab) = \ln a + \ln b$.
:::

:::demonstration
Fixons $b > 0$ et posons $g(x) = \ln(bx) - \ln x$ sur $]0 ; +\infty[$. Alors $g'(x) = \dfrac{b}{bx} - \dfrac{1}{x} = 0$ : $g$ est constante, égale à $g(1) = \ln b$. Donc $\ln(bx) = \ln x + \ln b$.
:::

:::propriete Conséquences
Pour $a, b > 0$ et $n \in \mathbb{Z}$, $r \in \mathbb{Q}$ :
$$\ln\frac{1}{b} = -\ln b, \qquad \ln\frac{a}{b} = \ln a - \ln b, \qquad \ln(a^n) = n\ln a, \qquad \ln\sqrt{a} = \frac{1}{2}\ln a, \qquad \ln(a^r) = r\ln a.$$
:::

:::exemple
$\ln 8 - 2\ln 2 = 3\ln 2 - 2\ln 2 = \ln 2$. $\quad \ln\dfrac{\sqrt{\mathrm{e}}}{\mathrm{e}^3} = \dfrac{1}{2} - 3 = -\dfrac{5}{2}$.
:::

## Étude de la fonction

:::propriete Variations et signe
$\ln$ est strictement croissante sur $]0 ; +\infty[$ (dérivée $\frac{1}{x} > 0$) et concave (dérivée seconde $-\frac{1}{x^2} < 0$). Elle est négative sur $]0 ; 1[$, nulle en $1$, positive sur $]1 ; +\infty[$. Pour $a, b > 0$ : $\ln a < \ln b \iff a < b$ et $\ln a = \ln b \iff a = b$.
:::

:::propriete Inégalité de convexité
Pour tout $x > 0$ : $\ln x \leqslant x - 1$, avec égalité si et seulement si $x = 1$ (la courbe est sous sa tangente en $1$).
:::

## Limites et dérivée du logarithme

:::theoreme Limites de référence
$$\lim_{x \to +\infty} \ln x = +\infty, \qquad \lim_{x \to 0^+} \ln x = -\infty, \qquad \lim_{x \to +\infty} \frac{\ln x}{x} = 0, \qquad \lim_{x \to 0^+} x\ln x = 0, \qquad \lim_{x \to 0} \frac{\ln(1 + x)}{x} = 1.$$
Plus généralement, pour $n \in \mathbb{N}^*$ : $\dfrac{\ln x}{x^n} \to 0$ en $+\infty$ et $x^n \ln x \to 0$ en $0^+$.
:::

:::demonstration $\dfrac{\ln x}{x} \to 0$
Pour $t > 0$, $\ln t \leqslant t - 1 < t$. Avec $t = \sqrt{x}$ : $\dfrac{1}{2}\ln x < \sqrt{x}$, donc pour $x > 1$, $0 < \dfrac{\ln x}{x} < \dfrac{2}{\sqrt{x}} \to 0$.
:::

:::remarque
$\dfrac{\ln(1 + x)}{x} \to 1$ est le nombre dérivé de $\ln$ en $1$. L'axe des ordonnées est asymptote verticale ; en $+\infty$, la courbe a une branche parabolique de direction l'axe des abscisses.
:::

:::propriete Dérivée d'une composée
Si $u$ est dérivable et strictement positive sur $I$, $\big(\ln u\big)' = \dfrac{u'}{u}$. Si $u$ ne s'annule pas sur $I$, $\big(\ln|u|\big)' = \dfrac{u'}{u}$.
:::

:::exemple
$f(x) = \ln(x^2 + 1)$ : $f'(x) = \dfrac{2x}{x^2 + 1}$. $\quad g(x) = \ln\left|\dfrac{x - 1}{x + 1}\right|$ : $g'(x) = \dfrac{1}{x - 1} - \dfrac{1}{x + 1} = \dfrac{2}{x^2 - 1}$.
:::

## Équations et logarithme décimal

:::methode Équations et inéquations
1. **Domaine** : écrire les conditions d'existence (chaque argument de $\ln$ strictement positif).
2. **Transformer** avec les règles algébriques pour obtenir $\ln A = \ln B$ ou $\ln A < \ln B$.
3. **Conclure** avec la stricte croissance : $A = B$ ou $A < B$.
4. **Vérifier** que les solutions sont dans le domaine.
:::

:::exemple
$\ln x + \ln(x - 1) = \ln 6$ sur $]1 ; +\infty[$ : $\ln(x(x - 1)) = \ln 6 \iff x^2 - x - 6 = 0 \iff x = 3$ ou $x = -2$. Seul $3$ est dans le domaine : $S = \{3\}$.
:::

:::exemple Inéquation
$\ln(2x - 1) < 0$ : domaine $x > \frac{1}{2}$ ; $\ln(2x - 1) < \ln 1 \iff 2x - 1 < 1 \iff x < 1$. $S = \left]\frac{1}{2} ; 1\right[$.
:::

:::definition Logarithme de base $a$
Pour $a > 0$, $a \neq 1$ : $\log_a x = \dfrac{\ln x}{\ln a}$. Il vérifie les mêmes règles que $\ln$ et $\log_a a = 1$. Le **logarithme décimal** est $\log = \log_{10}$ : $\log(10^n) = n$.
:::

:::exemple
$\log x = 2 \iff \dfrac{\ln x}{\ln 10} = 2 \iff x = 10^2 = 100$. Le nombre de chiffres d'un entier $N \geqslant 1$ vaut $E(\log N) + 1$.
:::

:::app Applique
Résous dans $\mathbb{R}$ l'inéquation $\ln(x + 3) + \ln(x - 1) \leqslant \ln(x + 9)$.
:::solution Correction
Domaine : $x > 1$. L'inéquation équivaut à $(x + 3)(x - 1) \leqslant x + 9$, soit $x^2 + x - 12 \leqslant 0$, soit $(x + 4)(x - 3) \leqslant 0$, d'où $-4 \leqslant x \leqslant 3$. Avec le domaine : $S = ]1 ; 3]$.
:::
:::

:::aretenir
- $\ln$ : primitive de $\frac{1}{x}$ nulle en $1$ ; transforme produits en sommes.
- Croissante, concave, $\ln x \leqslant x - 1$.
- $\frac{\ln x}{x} \to 0$, $x\ln x \to 0$, $\frac{\ln(1 + x)}{x} \to 1$.
- $(\ln u)' = \frac{u'}{u}$. Toujours fixer le domaine avant de résoudre.
:::

:::funnel Fonction logarithme népérien
:::$L$, resume=$R$## Logarithme népérien — l'essentiel

:::aretenir Définition et règles
$\ln$ est l'unique primitive de $x \mapsto \frac{1}{x}$ sur $]0 ; +\infty[$ qui s'annule en $1$. $\ln \mathrm{e} = 1$.
$\ln(ab) = \ln a + \ln b$, $\;\ln\frac{a}{b} = \ln a - \ln b$, $\;\ln(a^n) = n \ln a$, $\;\ln\sqrt{a} = \frac{1}{2}\ln a$.
:::

:::aretenir Limites
$\lim\limits_{0^+} \ln = -\infty$, $\;\lim\limits_{+\infty} \ln = +\infty$, $\;\dfrac{\ln x}{x} \to 0$ en $+\infty$, $\;x\ln x \to 0$ en $0^+$, $\;\dfrac{\ln(1 + x)}{x} \to 1$ en $0$.
:::

:::aretenir Dérivée
$(\ln x)' = \dfrac{1}{x}$, $\;(\ln u)' = \dfrac{u'}{u}$ ($u > 0$), $\;(\ln|u|)' = \dfrac{u'}{u}$ ($u \neq 0$).
:::

:::attention Les 3 pièges du BAC
1. Résoudre sans fixer le domaine : $\ln u$ n'existe que si $u > 0$.
2. Écrire $\ln(a + b) = \ln a + \ln b$.
3. Oublier que $\ln x < 0$ pour $0 < x < 1$.
:::$R$, objectives=$O$Connaître la définition de $\ln$ comme primitive de $x \mapsto \frac{1}{x}$ et ses propriétés algébriques.
Calculer les limites de référence, dont les croissances comparées.
Dériver $\ln u$ et étudier des fonctions faisant intervenir $\ln$.
Résoudre des équations et inéquations logarithmiques en contrôlant le domaine.
Utiliser le logarithme de base $a$, en particulier le logarithme décimal.$O$, difficulty=2, duration_min=55, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='derivation' and l.position=4;

update lessons l set title=$T$Fonction exponentielle$T$, kind='cours', body=$L$## Définition et propriétés de l'exponentielle

:::definition
$\ln$ est continue et strictement croissante de $]0 ; +\infty[$ sur $\mathbb{R}$ : c'est une bijection. Sa réciproque est la fonction **exponentielle** $\exp : \mathbb{R} \to ]0 ; +\infty[$, notée $x \mapsto \mathrm{e}^x$ :
$$y = \mathrm{e}^x \iff x = \ln y \quad (x \in \mathbb{R},\ y > 0).$$
Ainsi $\ln(\mathrm{e}^x) = x$ pour tout réel $x$ et $\mathrm{e}^{\ln y} = y$ pour tout $y > 0$.
:::

:::propriete Règles de calcul
Pour tous réels $a$, $b$ et tout entier $n$ :
$$\mathrm{e}^{a + b} = \mathrm{e}^a\mathrm{e}^b, \qquad \mathrm{e}^{a - b} = \frac{\mathrm{e}^a}{\mathrm{e}^b}, \qquad \mathrm{e}^{-a} = \frac{1}{\mathrm{e}^a}, \qquad \left(\mathrm{e}^a\right)^n = \mathrm{e}^{na}.$$
$\mathrm{e}^0 = 1$, $\mathrm{e}^1 = \mathrm{e}$ et $\mathrm{e}^x > 0$ pour tout $x$.
:::

[[fig:ln-exp-symetrie]] Les courbes de $\ln$ et $\exp$ sont symétriques par rapport à la droite $y = x$.

:::propriete Variations
$\exp$ est strictement croissante et convexe sur $\mathbb{R}$ : $\mathrm{e}^a < \mathrm{e}^b \iff a < b$. Pour tout $x$ : $\mathrm{e}^x \geqslant 1 + x$ (courbe au-dessus de sa tangente en $0$).
:::

## Limites et dérivée de l'exponentielle

:::theoreme Dérivée
$\exp$ est dérivable sur $\mathbb{R}$ et $\exp' = \exp$. Pour $u$ dérivable : $\left(\mathrm{e}^{u}\right)' = u'\,\mathrm{e}^{u}$.
:::

:::demonstration
Par la dérivée d'une réciproque : $\exp'(x) = \dfrac{1}{\ln'(\mathrm{e}^x)} = \dfrac{1}{1/\mathrm{e}^x} = \mathrm{e}^x$.
:::

:::theoreme Limites de référence
$$\lim_{x \to +\infty} \mathrm{e}^x = +\infty, \qquad \lim_{x \to -\infty} \mathrm{e}^x = 0, \qquad \lim_{x \to 0} \frac{\mathrm{e}^x - 1}{x} = 1,$$
$$\lim_{x \to +\infty} \frac{\mathrm{e}^x}{x^n} = +\infty, \qquad \lim_{x \to -\infty} x^n\mathrm{e}^x = 0 \quad (n \in \mathbb{N}^*).$$
:::

:::exemple
$\lim\limits_{x \to +\infty} x\mathrm{e}^{-x} = \lim\limits_{x \to +\infty} \dfrac{x}{\mathrm{e}^x} = 0$. $\quad \lim\limits_{x \to 0} \dfrac{\mathrm{e}^{2x} - 1}{x} = 2 \times \lim\limits_{x \to 0} \dfrac{\mathrm{e}^{2x} - 1}{2x} = 2$.
:::

:::exemple
$f(x) = (x - 1)\mathrm{e}^{-x}$ : $f'(x) = \mathrm{e}^{-x} - (x - 1)\mathrm{e}^{-x} = (2 - x)\mathrm{e}^{-x}$. $f$ croît sur $]-\infty ; 2]$, décroît ensuite, maximum $f(2) = \mathrm{e}^{-2}$.
:::

## Résolution d'équations et d'inéquations

:::methode
- $\mathrm{e}^{A} = \mathrm{e}^{B} \iff A = B$ et $\mathrm{e}^A < \mathrm{e}^B \iff A < B$.
- $\mathrm{e}^{A} = k$ : solution $A = \ln k$ si $k > 0$, aucune si $k \leqslant 0$.
- Équation en $\mathrm{e}^{2x}$ et $\mathrm{e}^x$ : poser $X = \mathrm{e}^x > 0$.
:::

:::exemple
$\mathrm{e}^{2x} - 3\mathrm{e}^x + 2 = 0$ : avec $X = \mathrm{e}^x$, $X^2 - 3X + 2 = 0 \iff X = 1$ ou $X = 2$. Donc $x = 0$ ou $x = \ln 2$.
:::

:::exemple Inéquation
$\mathrm{e}^{2x} - \mathrm{e}^{x} - 6 > 0 \iff (X - 3)(X + 2) > 0$ avec $X > 0$ $\iff X > 3 \iff x > \ln 3$.
:::

## Fonctions puissances et exponentielle de base a

:::definition
Pour $x > 0$ et $\alpha \in \mathbb{R}$ : $x^\alpha = \mathrm{e}^{\alpha\ln x}$. Pour $a > 0$ et $x \in \mathbb{R}$ : $a^x = \mathrm{e}^{x\ln a}$.
:::

:::propriete
- $(x^\alpha)' = \alpha x^{\alpha - 1}$ sur $]0 ; +\infty[$ ; mêmes règles algébriques que les puissances entières.
- $(a^x)' = \ln a \times a^x$ ; $x \mapsto a^x$ est croissante si $a > 1$, décroissante si $0 < a < 1$.
- Croissances comparées : pour $\alpha > 0$, $\dfrac{\ln x}{x^\alpha} \to 0$ et $\dfrac{\mathrm{e}^x}{x^\alpha} \to +\infty$ en $+\infty$.
:::

:::exemple
$f(x) = x^x = \mathrm{e}^{x\ln x}$ sur $]0 ; +\infty[$ : $f'(x) = (\ln x + 1)\,x^x$, minimum en $x = \mathrm{e}^{-1}$. Et $\lim\limits_{0^+} x^x = \mathrm{e}^0 = 1$ car $x\ln x \to 0$.
:::

:::app Applique
Résous $2^{x + 1} = 3^x$ puis calcule $\lim\limits_{x \to +\infty} \left(1 + \dfrac{1}{x}\right)^x$.
:::solution Correction
**1.** En passant au $\ln$ : $(x + 1)\ln 2 = x\ln 3 \iff x(\ln 3 - \ln 2) = \ln 2 \iff x = \dfrac{\ln 2}{\ln 3 - \ln 2} = \dfrac{\ln 2}{\ln(3/2)}$.

**2.** $\left(1 + \frac{1}{x}\right)^x = \mathrm{e}^{x\ln(1 + \frac{1}{x})}$. Avec $h = \frac{1}{x} \to 0$ : $x\ln\left(1 + \frac{1}{x}\right) = \dfrac{\ln(1 + h)}{h} \to 1$. La limite vaut $\mathrm{e}$.
:::
:::

:::aretenir
- $\exp$ : réciproque de $\ln$, strictement positive, croissante, convexe, $\exp' = \exp$.
- $\mathrm{e}^x/x^n \to +\infty$, $x^n\mathrm{e}^{-x} \to 0$, $\frac{\mathrm{e}^x - 1}{x} \to 1$.
- Équations : $X = \mathrm{e}^x > 0$.
- $x^\alpha = \mathrm{e}^{\alpha\ln x}$, $a^x = \mathrm{e}^{x\ln a}$.
:::

:::funnel Fonction exponentielle
:::$L$, resume=$R$## Fonction exponentielle — l'essentiel

:::aretenir Définition et règles
$\exp$ : réciproque de $\ln$, de $\mathbb{R}$ sur $]0 ; +\infty[$. $\;y = \mathrm{e}^x \iff x = \ln y$.
$\mathrm{e}^{a + b} = \mathrm{e}^a\mathrm{e}^b$, $\;\mathrm{e}^{-a} = \dfrac{1}{\mathrm{e}^a}$, $\;(\mathrm{e}^a)^n = \mathrm{e}^{na}$, $\;\mathrm{e}^x > 0$.
:::

:::aretenir Limites
$\mathrm{e}^x \to +\infty$ en $+\infty$, $\to 0$ en $-\infty$ ; $\;\dfrac{\mathrm{e}^x}{x^n} \to +\infty$ ; $\;x^n\mathrm{e}^{-x} \to 0$ ; $\;\dfrac{\mathrm{e}^x - 1}{x} \to 1$ en $0$.
:::

:::aretenir Dérivée et puissances
$(\mathrm{e}^u)' = u'\mathrm{e}^u$. $\;x^\alpha = \mathrm{e}^{\alpha\ln x}$ ($x > 0$), $(x^\alpha)' = \alpha x^{\alpha - 1}$. $\;a^x = \mathrm{e}^{x\ln a}$.
:::

:::attention Les 3 pièges du BAC
1. Chercher une solution à $\mathrm{e}^{x} = k$ avec $k \leqslant 0$.
2. Oublier le changement de variable $X = \mathrm{e}^x$ et la condition $X > 0$.
3. Croire que $x^n$ l'emporte sur $\mathrm{e}^x$ en $+\infty$.
:::$R$, objectives=$O$Définir l'exponentielle comme réciproque de $\ln$ et connaître ses propriétés algébriques.
Calculer les limites de référence et les croissances comparées.
Dériver $\mathrm{e}^{u}$ et étudier des fonctions faisant intervenir l'exponentielle.
Résoudre des équations et inéquations exponentielles, par changement de variable si besoin.
Manipuler les fonctions puissances $x^\alpha$ et exponentielles de base $a$.$O$, difficulty=2, duration_min=55, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='derivation' and l.position=5;

update lessons l set title=$T$Primitives et équations différentielles$T$, kind='cours', body=$L$## Primitives

:::definition
Soit $f$ définie sur un intervalle $I$. Une **primitive** de $f$ sur $I$ est une fonction $F$ dérivable sur $I$ telle que $F' = f$.
:::

:::theoreme
- Toute fonction continue sur un intervalle admet des primitives.
- Si $F$ est une primitive de $f$ sur $I$, les primitives de $f$ sur $I$ sont exactement les fonctions $F + C$, $C \in \mathbb{R}$.
- Pour $x_0 \in I$ et $y_0 \in \mathbb{R}$, il existe une **unique** primitive $G$ de $f$ telle que $G(x_0) = y_0$.
:::

:::aretenir Primitives usuelles
| $f(x)$ | $F(x)$ | Intervalle |
| --- | --- | --- |
| $x^n$ ($n \neq -1$) | $\dfrac{x^{n+1}}{n+1}$ | $\mathbb{R}$ ou $]0 ; +\infty[$ |
| $\dfrac{1}{x}$ | $\ln\lvert x \rvert$ | $]0 ; +\infty[$ ou $]-\infty ; 0[$ |
| $\dfrac{1}{\sqrt{x}}$ | $2\sqrt{x}$ | $]0 ; +\infty[$ |
| $\mathrm{e}^{x}$ | $\mathrm{e}^{x}$ | $\mathbb{R}$ |
| $\cos x$ | $\sin x$ | $\mathbb{R}$ |
| $\sin x$ | $-\cos x$ | $\mathbb{R}$ |
| $1 + \tan^2 x$ | $\tan x$ | $\left]-\frac{\pi}{2} ; \frac{\pi}{2}\right[$ |
| $\dfrac{1}{1 + x^2}$ | $\arctan x$ | $\mathbb{R}$ |
:::

:::methode Reconnaître une forme composée
Repérer une fonction $u$ et sa dérivée $u'$ dans l'expression, en ajustant les constantes. Exemples :
- $\dfrac{x}{x^2 + 1} = \dfrac{1}{2} \cdot \dfrac{2x}{x^2 + 1}$, primitive $\dfrac{1}{2}\ln(x^2 + 1)$.
- $x\mathrm{e}^{x^2} = \dfrac{1}{2} \cdot 2x\,\mathrm{e}^{x^2}$, primitive $\dfrac{1}{2}\mathrm{e}^{x^2}$.
- $\dfrac{\ln x}{x} = \dfrac{1}{x} \cdot \ln x$, forme $u'u$, primitive $\dfrac{1}{2}(\ln x)^2$.
- $\dfrac{1}{4 + x^2} = \dfrac{1}{4} \cdot \dfrac{1}{1 + (x/2)^2} = \dfrac{1}{2} \cdot \dfrac{1/2}{1 + (x/2)^2}$, primitive $\dfrac{1}{2}\arctan\dfrac{x}{2}$.
:::

:::exemple Avec une condition
La primitive de $f(x) = 3x^2 - \dfrac{2}{x}$ sur $]0 ; +\infty[$ qui s'annule en $1$ : $F(x) = x^3 - 2\ln x + C$, et $F(1) = 1 + C = 0$, donc $F(x) = x^3 - 2\ln x - 1$.
:::

## Équations différentielles $y' = ay + b$

:::theoreme
Soient $a \neq 0$ et $b$ deux réels.
- Les solutions sur $\mathbb{R}$ de $y' = ay$ sont les fonctions $x \mapsto C\mathrm{e}^{ax}$, $C \in \mathbb{R}$.
- Les solutions de $y' = ay + b$ sont les fonctions $x \mapsto C\mathrm{e}^{ax} - \dfrac{b}{a}$, $C \in \mathbb{R}$.
- Pour une condition initiale $y(x_0) = y_0$, la solution est unique.
:::

:::demonstration $y' = ay$
$x \mapsto C\mathrm{e}^{ax}$ est solution. Réciproquement, si $y$ est solution, posons $z(x) = y(x)\mathrm{e}^{-ax}$ : $z' = (y' - ay)\mathrm{e}^{-ax} = 0$, donc $z$ est constante, égale à $C$, et $y = C\mathrm{e}^{ax}$.
:::

:::exemple
$2y' + y = 4$, $y(0) = 1$ : $y' = -\frac{1}{2}y + 2$, solutions $y = C\mathrm{e}^{-x/2} + 4$ ; $y(0) = C + 4 = 1$ donne $C = -3$. Donc $y(x) = 4 - 3\mathrm{e}^{-x/2}$.
:::

## Équations différentielles $y'' + ay' + by = 0$

:::theoreme
On associe à $y'' + ay' + by = 0$ l'**équation caractéristique** $r^2 + ar + b = 0$, de discriminant $\Delta = a^2 - 4b$.
- Si $\Delta > 0$, racines réelles $r_1 \neq r_2$ : $y(x) = \alpha\mathrm{e}^{r_1x} + \beta\mathrm{e}^{r_2x}$.
- Si $\Delta = 0$, racine double $r$ : $y(x) = (\alpha x + \beta)\mathrm{e}^{rx}$.
- Si $\Delta < 0$, racines complexes $p \pm iq$ ($q > 0$) : $y(x) = \mathrm{e}^{px}\big(\alpha\cos(qx) + \beta\sin(qx)\big)$.

avec $\alpha, \beta \in \mathbb{R}$. Deux conditions (par exemple $y(0)$ et $y'(0)$) déterminent une unique solution.
:::

:::exemple $\Delta < 0$
$y'' + 2y' + 5y = 0$ : $r^2 + 2r + 5 = 0$, $\Delta = -16$, $r = -1 \pm 2i$. Solutions : $y = \mathrm{e}^{-x}(\alpha\cos 2x + \beta\sin 2x)$.
:::

:::exemple Cas particulier $y'' + \omega^2y = 0$
Solutions $y = \alpha\cos(\omega x) + \beta\sin(\omega x)$, qu'on peut écrire $A\cos(\omega x + \varphi)$ : c'est l'équation de l'oscillateur harmonique.
:::

:::app Applique
Résous $y'' - 3y' + 2y = 0$ avec $y(0) = 0$ et $y'(0) = 1$.
:::solution Correction
$r^2 - 3r + 2 = 0$ a pour racines $1$ et $2$ : $y = \alpha\mathrm{e}^{x} + \beta\mathrm{e}^{2x}$. Conditions : $\alpha + \beta = 0$ et $\alpha + 2\beta = 1$, d'où $\beta = 1$ et $\alpha = -1$. Donc $y(x) = \mathrm{e}^{2x} - \mathrm{e}^{x}$.
:::
:::

:::aretenir
- Primitives : tableau usuel + formes composées $u'u^n$, $\frac{u'}{u}$, $u'\mathrm{e}^u$, $\frac{u'}{1 + u^2}$.
- $y' = ay + b$ : $C\mathrm{e}^{ax} - \frac{b}{a}$.
- $y'' + ay' + by = 0$ : trois cas selon $\Delta$ de $r^2 + ar + b = 0$.
:::

:::funnel Primitives et équations différentielles
:::$L$, resume=$R$## Primitives et équations différentielles — l'essentiel

:::aretenir Primitives des formes composées
| $f$ | Primitive $F$ |
| --- | --- |
| $u'u^n$ ($n \neq -1$) | $\dfrac{u^{n+1}}{n+1}$ |
| $\dfrac{u'}{u}$ | $\ln\lvert u \rvert$ |
| $\dfrac{u'}{\sqrt{u}}$ | $2\sqrt{u}$ |
| $u'\mathrm{e}^{u}$ | $\mathrm{e}^{u}$ |
| $\dfrac{u'}{1 + u^2}$ | $\arctan u$ |
| $u'\cos u$, $u'\sin u$ | $\sin u$, $-\cos u$ |
:::

:::aretenir Équations différentielles
$y' = ay$ : $y = C\mathrm{e}^{ax}$. $\quad y' = ay + b$ ($a \neq 0$) : $y = C\mathrm{e}^{ax} - \frac{b}{a}$.
$y'' + ay' + by = 0$ : équation caractéristique $r^2 + ar + b = 0$, de discriminant $\Delta$.
- $\Delta > 0$ : $y = \alpha\mathrm{e}^{r_1x} + \beta\mathrm{e}^{r_2x}$.
- $\Delta = 0$ : $y = (\alpha x + \beta)\mathrm{e}^{rx}$.
- $\Delta < 0$, $r = p \pm iq$ : $y = \mathrm{e}^{px}(\alpha\cos qx + \beta\sin qx)$.
:::

:::attention Les 3 pièges du BAC
1. Oublier la constante : une primitive n'est définie qu'à une constante près.
2. Écrire $-\frac{b}{a}$ avec le mauvais signe pour $y' = ay + b$.
3. Oublier le facteur $\mathrm{e}^{px}$ dans le cas $\Delta < 0$.
:::$R$, objectives=$O$Déterminer une primitive à l'aide du tableau des primitives usuelles et des formes composées.
Trouver la primitive qui prend une valeur donnée en un point.
Résoudre les équations différentielles $y' = ay + b$ et leur associer une condition initiale.
Résoudre les équations différentielles linéaires du second ordre $y'' + ay' + by = 0$.$O$, difficulty=2, duration_min=55, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='derivation' and l.position=6;

update lessons l set title=$T$Fiche de révision — Dérivation & étude de fonctions$T$, kind='resume', body=$L$:::aretenir Dérivabilité
$f'(a) = \lim\limits_{x \to a} \frac{f(x) - f(a)}{x - a}$ finie. Tangente $y = f'(a)(x - a) + f(a)$. Gauche $\neq$ droite : point anguleux ; taux $\to \pm\infty$ : demi-tangente verticale.
$(v \circ u)' = u' \cdot v' \circ u$ ; $(f^{-1})' = \frac{1}{f' \circ f^{-1}}$ ; $\arctan' = \frac{1}{1 + x^2}$ ; $(\sqrt[n]{x})' = \frac{1}{n\sqrt[n]{x^{n-1}}}$.
:::

:::aretenir Étude de fonction
Signe de $f'$ sur un intervalle $\Rightarrow$ variations ; changement de signe $\Rightarrow$ extremum. Signe de $f''$ $\Rightarrow$ convexité ; changement de signe $\Rightarrow$ inflexion. Oblique : $a = \lim \frac{f(x)}{x}$, $b = \lim [f(x) - ax]$.
:::

:::aretenir Rolle, TAF, IAF
Rolle : $f(a) = f(b)$ $\Rightarrow$ $f'(c) = 0$. TAF : $f(b) - f(a) = f'(c)(b - a)$. IAF : $m \leqslant f' \leqslant M$ $\Rightarrow$ $m(b - a) \leqslant f(b) - f(a) \leqslant M(b - a)$.
:::

:::aretenir ln et exp
$\ln(ab) = \ln a + \ln b$ ; $(\ln u)' = \frac{u'}{u}$ ; $\frac{\ln x}{x} \to 0$ ; $x\ln x \to 0$. $\mathrm{e}^{a + b} = \mathrm{e}^a\mathrm{e}^b$ ; $(\mathrm{e}^u)' = u'\mathrm{e}^u$ ; $\frac{\mathrm{e}^x}{x^n} \to +\infty$ ; $\frac{\mathrm{e}^x - 1}{x} \to 1$. $x^\alpha = \mathrm{e}^{\alpha\ln x}$.
:::

:::aretenir Équations différentielles
$y' = ay + b$ : $C\mathrm{e}^{ax} - \frac{b}{a}$. $y'' + ay' + by = 0$ : $\Delta > 0$, $\Delta = 0$, $\Delta < 0$ (avec $\mathrm{e}^{px}$, $\cos qx$, $\sin qx$).
:::$L$, resume=null, objectives=null, difficulty=1, duration_min=15, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='derivation' and l.position=7;

update lessons l set title=$T$Méthodes & exercices types$T$, kind='cours', body=$L$## Comment lire cette notion

Le problème d'analyse du BAC SM suit presque toujours le même canevas : une **fonction auxiliaire** $g$ dont on étudie le signe, puis la **fonction principale** $f$ dont la dérivée s'exprime avec $g$, puis une **suite** ou une **intégrale** liée à $f$. Cette notion entraîne aux deux premières parties.

## Étude complète d'une fonction

:::methode Le canevas
1. **Ensemble de définition**, et éventuellement parité ou périodicité pour réduire l'étude.
2. **Limites** aux bornes ; interprétation géométrique (asymptotes).
3. **Dérivabilité** aux points délicats (bornes fermées, raccords) avec le taux d'accroissement.
4. **Dérivée** et son signe ; **tableau de variations** complet avec les limites.
5. **Branches infinies** : asymptote oblique ou branche parabolique.
6. **Convexité** et points d'inflexion si demandé.
7. **Tracé** : asymptotes, tangentes remarquables, points particuliers.
:::

:::exemple Traité
Soit $f(x) = x - 2 + \dfrac{\ln x}{x}$ sur $]0 ; +\infty[$.

**Fonction auxiliaire.** $f'(x) = 1 + \dfrac{1 - \ln x}{x^2} = \dfrac{g(x)}{x^2}$ avec $g(x) = x^2 + 1 - \ln x$. $g'(x) = 2x - \dfrac{1}{x} = \dfrac{2x^2 - 1}{x}$ : minimum en $x = \frac{1}{\sqrt{2}}$, de valeur $g\left(\frac{1}{\sqrt{2}}\right) = \frac{3}{2} + \frac{1}{2}\ln 2 > 0$. Donc $g > 0$ et $f' > 0$ : $f$ est strictement croissante.

**Limites.** En $0^+$ : $\frac{\ln x}{x} \to -\infty$, donc $f \to -\infty$ (asymptote verticale $x = 0$). En $+\infty$ : $\frac{\ln x}{x} \to 0$, donc $f(x) - (x - 2) \to 0$ : asymptote oblique $y = x - 2$.

**Position.** $f(x) - (x - 2) = \dfrac{\ln x}{x}$ : la courbe est sous l'asymptote sur $]0 ; 1[$, au-dessus sur $]1 ; +\infty[$, et la coupe en $x = 1$.
:::

## Dérivée pour prouver une inégalité

:::methode
Pour montrer $f(x) \geqslant g(x)$ sur $I$ :
1. Poser $h(x) = f(x) - g(x)$.
2. Étudier les variations de $h$ (parfois avec $h''$ si le signe de $h'$ n'est pas immédiat).
3. Montrer que le minimum de $h$ sur $I$ est positif, ou que $h(a) = 0$ avec $h$ croissante sur $[a ; +\infty[$.
:::

:::exemple
Montrons que $\mathrm{e}^x \geqslant 1 + x + \dfrac{x^2}{2}$ pour $x \geqslant 0$. Soit $h(x) = \mathrm{e}^x - 1 - x - \frac{x^2}{2}$. Alors $h'(x) = \mathrm{e}^x - 1 - x$ et $h''(x) = \mathrm{e}^x - 1 \geqslant 0$ sur $[0 ; +\infty[$. Donc $h'$ est croissante, $h'(x) \geqslant h'(0) = 0$, donc $h$ est croissante et $h(x) \geqslant h(0) = 0$.
:::

:::app Applique
Montre que pour tout $x > 0$ : $1 - \dfrac{1}{x} \leqslant \ln x \leqslant x - 1$.
:::solution Correction
**Droite.** $h(x) = x - 1 - \ln x$ : $h'(x) = 1 - \frac{1}{x} = \frac{x - 1}{x}$, minimum en $1$, $h(1) = 0$. Donc $h \geqslant 0$.

**Gauche.** On applique l'inégalité de droite à $\frac{1}{x}$ : $\ln\frac{1}{x} \leqslant \frac{1}{x} - 1$, soit $-\ln x \leqslant \frac{1}{x} - 1$, c'est-à-dire $\ln x \geqslant 1 - \frac{1}{x}$.
:::
:::

## Le signe d'une fonction auxiliaire et le réel alpha

:::methode Quand le signe de $g$ change en un réel $\alpha$
1. Montrer, par le théorème de la bijection, que $g(x) = 0$ a une unique solution $\alpha$, et l'encadrer.
2. En déduire le signe de $g$ de part et d'autre de $\alpha$.
3. Exprimer $f(\alpha)$ **sans** $\ln$ ou $\mathrm{e}$ grâce à $g(\alpha) = 0$.
:::

:::exemple
$g(x) = \mathrm{e}^x + x$ s'annule en un unique $\alpha \in ]-1 ; 0[$ (strictement croissante, $g(-1) = \mathrm{e}^{-1} - 1 < 0$, $g(0) = 1 > 0$). Comme $\mathrm{e}^\alpha = -\alpha$, une expression comme $f(\alpha) = \alpha\mathrm{e}^\alpha + 1$ se réécrit $f(\alpha) = 1 - \alpha^2$.
:::

## Nombre de solutions d'une équation

:::methode
Pour discuter selon $m$ le nombre de solutions de $f(x) = m$ : lire le tableau de variations de $f$ (chaque branche strictement monotone donne au plus une solution, et en donne une si $m$ est dans l'image de cette branche). Graphiquement, c'est le nombre d'intersections de la courbe avec la droite $y = m$.
:::

:::exemple
$f(x) = x\mathrm{e}^{-x}$ croît sur $]-\infty ; 1]$ de $-\infty$ à $\mathrm{e}^{-1}$, puis décroît vers $0$. Donc $f(x) = m$ a : une solution si $m \leqslant 0$ ou $m = \mathrm{e}^{-1}$ ; deux solutions si $0 < m < \mathrm{e}^{-1}$ ; aucune si $m > \mathrm{e}^{-1}$.
:::

:::aretenir
- Canevas : domaine, limites, dérivée, variations, branches, convexité, tracé.
- Inégalité : étudier la différence, au besoin avec la dérivée seconde.
- Réel $\alpha$ : bijection, encadrement, puis simplification exacte par $g(\alpha) = 0$.
- Nombre de solutions : tableau de variations et images de chaque branche.
:::

:::funnel Méthodes d'étude de fonction
:::$L$, resume=$R$## Méthodes d'étude de fonction — l'essentiel

:::aretenir Le plan d'une étude complète
1. Domaine, parité éventuelle.
2. Limites aux bornes, asymptotes.
3. Dérivée, signe, tableau de variations.
4. Convexité, points d'inflexion (si demandé).
5. Branches infinies, position relative, tracé.
:::

:::aretenir Prouver $f(x) \geqslant g(x)$
Étudier $h = f - g$ : variations, minimum, signe du minimum.
:::

:::attention Les 3 pièges du BAC
1. Remplir un tableau de variations sans justifier le signe de $f'$.
2. Utiliser une valeur approchée de $\alpha$ là où l'énoncé attend la relation exacte $g(\alpha) = 0$.
3. Oublier d'étudier la position relative courbe-asymptote quand elle est demandée.
:::$R$, objectives=$O$Mener une étude complète de fonction dans l'ordre attendu au BAC.
Démontrer une inégalité en étudiant une fonction auxiliaire.
Étudier le signe d'une fonction à l'aide d'une fonction auxiliaire $g$ et d'une solution $\alpha$.
Exploiter une étude de fonction pour discuter le nombre de solutions d'une équation.$O$, difficulty=3, duration_min=60, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='derivation' and l.position=50;

update lessons l set title=$T$Approfondissement : dérivabilité, branches & symétries$T$, kind='cours', body=$L$## Interprétation géométrique de la dérivabilité

:::propriete
Soit $f$ continue en $a$ et $\tau(x) = \dfrac{f(x) - f(a)}{x - a}$.
- $\tau(x) \to \ell$ (finie) en $a^+$ : demi-tangente à droite de pente $\ell$.
- Limites finies **différentes** à gauche et à droite : **point anguleux**, deux demi-tangentes.
- $\tau(x) \to \pm\infty$ : demi-tangente **verticale** au point $(a ; f(a))$.
:::

:::exemple
$f(x) = x\sqrt{x}$ en $0^+$ : $\tau(x) = \sqrt{x} \to 0$ : demi-tangente horizontale. $\quad g(x) = \sqrt{1 - x^2}$ en $1^-$ : $\tau(x) = \dfrac{\sqrt{1 - x^2}}{x - 1} = -\dfrac{\sqrt{1 + x}}{\sqrt{1 - x}} \to -\infty$ : demi-tangente verticale.
:::

:::app Point anguleux
Étudie la dérivabilité en $0$ de $f(x) = |x|\,\mathrm{e}^{x}$.
:::solution Correction
$\tau(x) = \dfrac{|x|\mathrm{e}^x}{x}$ vaut $\mathrm{e}^x \to 1$ à droite et $-\mathrm{e}^x \to -1$ à gauche. Les deux demi-tangentes ont des pentes $1$ et $-1$ : $f$ n'est pas dérivable en $0$, la courbe présente un point anguleux.
:::
:::

## Branches infinies (classification complète)

:::methode En $+\infty$ quand $\lim f = \pm\infty$
1. Calculer $\lim \dfrac{f(x)}{x}$.
   - $\pm\infty$ : branche parabolique de direction l'axe des ordonnées (cas de $x^2$, $\mathrm{e}^x$).
   - $0$ : branche parabolique de direction l'axe des abscisses (cas de $\sqrt{x}$, $\ln x$).
   - $a \neq 0$ : passer à l'étape 2.
2. Calculer $\lim [f(x) - ax]$.
   - $b$ fini : asymptote oblique $y = ax + b$.
   - $\pm\infty$ : branche parabolique de direction la droite $y = ax$ (cas de $x + \ln x$).
:::

:::exemple
$f(x) = x + \sqrt{x}$ : $\frac{f(x)}{x} \to 1$ et $f(x) - x = \sqrt{x} \to +\infty$ : branche parabolique de direction $y = x$, pas d'asymptote.
:::

## Symétries et position relative

:::propriete Axe et centre de symétrie
- La droite $x = a$ est axe de symétrie de $\mathcal{C}_f$ si, pour tout $x \in D_f$, $2a - x \in D_f$ et $f(2a - x) = f(x)$.
- Le point $\Omega(a ; b)$ est centre de symétrie si, pour tout $x \in D_f$, $2a - x \in D_f$ et $f(2a - x) + f(x) = 2b$.
:::

:::exemple
$f(x) = \dfrac{2x + 1}{x - 1}$ : $f(2 - x) = \dfrac{5 - 2x}{1 - x}$ et $f(x) + f(2 - x) = \dfrac{2x + 1}{x - 1} + \dfrac{2x - 5}{x - 1} = \dfrac{4x - 4}{x - 1} = 4$. Le point $\Omega(1 ; 2)$ est centre de symétrie.
:::

:::methode Position relative de deux courbes
Étudier le signe de $d(x) = f(x) - g(x)$ : $\mathcal{C}_f$ est au-dessus de $\mathcal{C}_g$ là où $d(x) > 0$, et les points d'intersection correspondent à $d(x) = 0$.
:::

:::app Applique
Montre que la droite $x = \dfrac{\pi}{2}$ est axe de symétrie de la courbe de $f(x) = \sin x + \sin^3 x$ sur $[0 ; \pi]$.
:::solution Correction
Pour $x \in [0 ; \pi]$, $\pi - x \in [0 ; \pi]$ et $\sin(\pi - x) = \sin x$, donc $f(\pi - x) = \sin x + \sin^3 x = f(x)$. Comme $\pi - x = 2 \cdot \frac{\pi}{2} - x$, la droite $x = \frac{\pi}{2}$ est axe de symétrie.
:::
:::

:::aretenir
- Taux d'accroissement : tangente, point anguleux ou demi-tangente verticale.
- Branches : étudier $\frac{f(x)}{x}$, puis $f(x) - ax$.
- Symétries : $f(2a - x) = f(x)$ (axe), $f(2a - x) + f(x) = 2b$ (centre).
:::

:::funnel Dérivabilité, branches et symétries
:::$L$, resume=$R$## Approfondissement — l'essentiel

:::aretenir Lecture du taux d'accroissement en $a$
| Limite du taux | Interprétation |
| --- | --- |
| finie $\ell$ | tangente de pente $\ell$ |
| finie, différente à gauche et à droite | point anguleux |
| $\pm\infty$ | demi-tangente verticale |
:::

:::aretenir Branches infinies en $+\infty$ (avec $f \to \pm\infty$)
$\frac{f(x)}{x} \to \pm\infty$ : branche parabolique de direction $(Oy)$. $\frac{f(x)}{x} \to 0$ : direction $(Ox)$. $\frac{f(x)}{x} \to a \neq 0$ puis $f(x) - ax \to b$ : asymptote $y = ax + b$ ; $f(x) - ax \to \pm\infty$ : direction $y = ax$.
:::

:::aretenir Symétries
$x = a$ axe de symétrie $\iff$ $f(2a - x) = f(x)$. $\Omega(a ; b)$ centre $\iff$ $f(2a - x) + f(x) = 2b$.
:::

:::attention Les 3 pièges du BAC
1. Conclure « asymptote oblique » dès que $\frac{f(x)}{x}$ a une limite finie.
2. Oublier de vérifier que $2a - x$ est dans le domaine.
3. Confondre demi-tangente verticale et asymptote verticale.
:::$R$, objectives=$O$Interpréter géométriquement la dérivabilité, la non-dérivabilité et les demi-tangentes.
Classer toutes les branches infinies d'une courbe.
Démontrer qu'une droite est axe de symétrie ou qu'un point est centre de symétrie.
Étudier la position relative de deux courbes.$O$, difficulty=3, duration_min=45, bac_frequency=2
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='derivation' and l.position=60;

update lessons l set title=$T$Intégrale et propriétés$T$, kind='cours', body=$L$## Définition de l'intégrale

:::definition
Soit $f$ continue sur un intervalle $I$, $F$ une primitive de $f$ sur $I$, et $a, b \in I$. L'**intégrale** de $f$ de $a$ à $b$ est le réel
$$\int_a^b f(x)\,\mathrm{d}x = F(b) - F(a), \qquad \text{noté aussi } \big[F(x)\big]_a^b.$$
Ce nombre ne dépend pas de la primitive choisie (deux primitives diffèrent d'une constante, qui s'élimine). La variable $x$ est **muette** : $\int_a^b f(x)\,\mathrm{d}x = \int_a^b f(t)\,\mathrm{d}t$.
:::

:::exemple
$\displaystyle\int_1^{\mathrm{e}} \frac{1}{x}\,\mathrm{d}x = \big[\ln x\big]_1^{\mathrm{e}} = 1$. $\quad \displaystyle\int_0^{\pi/2} \cos x\,\mathrm{d}x = \big[\sin x\big]_0^{\pi/2} = 1$. $\quad \displaystyle\int_0^1 \frac{\mathrm{d}x}{1 + x^2} = \big[\arctan x\big]_0^1 = \frac{\pi}{4}$.
:::

:::theoreme Lien avec les primitives
Si $f$ est continue sur $I$ et $a \in I$, la fonction $F : x \mapsto \displaystyle\int_a^x f(t)\,\mathrm{d}t$ est l'**unique primitive** de $f$ sur $I$ qui s'annule en $a$.
:::

## Interprétation géométrique : l'aire

:::propriete
Si $f$ est continue et **positive** sur $[a ; b]$ ($a < b$), $\displaystyle\int_a^b f(x)\,\mathrm{d}x$ est l'aire, en unités d'aire, du domaine compris entre la courbe, l'axe des abscisses et les droites $x = a$ et $x = b$. Si $f$ est négative, l'intégrale est l'**opposé** de cette aire.
:::

:::remarque Unité d'aire
Si le repère a pour unités $2$ cm et $3$ cm, une unité d'aire vaut $6\ \text{cm}^2$ : il faut multiplier le résultat de l'intégrale.
:::

## Propriétés algébriques

:::propriete
Pour $f$, $g$ continues sur $I$, $a, b, c \in I$ et $\alpha, \beta$ réels :
- $\displaystyle\int_a^a f = 0$ et $\displaystyle\int_b^a f = -\int_a^b f$ ;
- **Chasles** : $\displaystyle\int_a^b f + \int_b^c f = \int_a^c f$ ;
- **linéarité** : $\displaystyle\int_a^b (\alpha f + \beta g) = \alpha\int_a^b f + \beta\int_a^b g$.
:::

:::exemple Chasles avec une valeur absolue
$$\int_{-1}^{2} |x|\,\mathrm{d}x = \int_{-1}^{0} (-x)\,\mathrm{d}x + \int_0^2 x\,\mathrm{d}x = \frac{1}{2} + 2 = \frac{5}{2}.$$
:::

:::app Chasles et linéarité
On sait que $\displaystyle\int_0^2 f = 5$, $\displaystyle\int_1^2 f = 3$ et $\displaystyle\int_0^1 g = -1$. Calcule $\displaystyle\int_0^1 (2f - 3g)$.
:::solution Correction
Chasles : $\displaystyle\int_0^1 f = \int_0^2 f - \int_1^2 f = 2$. Linéarité : $\displaystyle\int_0^1 (2f - 3g) = 2 \times 2 - 3 \times (-1) = 7$.
:::
:::

## Positivité, ordre et valeur moyenne

:::theoreme Positivité et croissance
Soient $f$, $g$ continues sur $[a ; b]$ avec $a \leqslant b$.
- Si $f \geqslant 0$ sur $[a ; b]$, alors $\displaystyle\int_a^b f \geqslant 0$.
- Si $f \leqslant g$ sur $[a ; b]$, alors $\displaystyle\int_a^b f \leqslant \int_a^b g$.
- $\left|\displaystyle\int_a^b f\right| \leqslant \displaystyle\int_a^b |f|$.
:::

:::attention
Ces inégalités exigent les bornes **dans l'ordre** $a \leqslant b$. Pour $a > b$, le sens s'inverse.
:::

:::theoreme Inégalité de la moyenne
Si $m \leqslant f(x) \leqslant M$ pour tout $x \in [a ; b]$ ($a < b$), alors
$$m(b - a) \leqslant \int_a^b f(x)\,\mathrm{d}x \leqslant M(b - a).$$
:::

:::definition Valeur moyenne
La **valeur moyenne** de $f$ sur $[a ; b]$ ($a < b$) est $\mu = \dfrac{1}{b - a}\displaystyle\int_a^b f(x)\,\mathrm{d}x$. Si $f$ est positive, c'est la hauteur du rectangle de base $[a ; b]$ ayant la même aire que le domaine sous la courbe.
:::

:::theoreme Valeur moyenne atteinte
Si $f$ est continue sur $[a ; b]$, il existe $c \in [a ; b]$ tel que $f(c) = \mu$.
:::

:::app Applique
Montre que $\dfrac{1}{2} \leqslant \displaystyle\int_0^1 \frac{\mathrm{d}x}{1 + x^3} \leqslant 1$, puis calcule la valeur moyenne de $\sin$ sur $[0 ; \pi]$.
:::solution Correction
**1.** Pour $x \in [0 ; 1]$ : $1 \leqslant 1 + x^3 \leqslant 2$, donc $\frac{1}{2} \leqslant \frac{1}{1 + x^3} \leqslant 1$. Par l'inégalité de la moyenne sur un intervalle de longueur $1$, on obtient l'encadrement.

**2.** $\mu = \dfrac{1}{\pi}\displaystyle\int_0^\pi \sin x\,\mathrm{d}x = \dfrac{1}{\pi}\big[-\cos x\big]_0^\pi = \dfrac{2}{\pi}$.
:::
:::

:::aretenir
- $\int_a^b f = F(b) - F(a)$ ; $x \mapsto \int_a^x f$ est la primitive nulle en $a$.
- Aire si $f \geqslant 0$, opposé de l'aire si $f \leqslant 0$.
- Chasles, linéarité ; positivité et croissance pour $a \leqslant b$.
- Valeur moyenne $\frac{1}{b - a}\int_a^b f$, atteinte par une fonction continue.
:::

:::funnel Intégrale et propriétés
:::$L$, resume=$R$## Intégrale et propriétés — l'essentiel

:::aretenir Définition
$\displaystyle\int_a^b f(x)\,\mathrm{d}x = F(b) - F(a) = \big[F(x)\big]_a^b$, où $F$ est une primitive de $f$ continue sur $I \ni a, b$.
$\displaystyle\int_a^a f = 0$, $\;\displaystyle\int_b^a f = -\int_a^b f$.
:::

:::aretenir Propriétés
| Propriété | Énoncé |
| --- | --- |
| Linéarité | $\int (\alpha f + \beta g) = \alpha\int f + \beta\int g$ |
| Chasles | $\int_a^b f + \int_b^c f = \int_a^c f$ |
| Positivité ($a \leqslant b$) | $f \geqslant 0 \Rightarrow \int_a^b f \geqslant 0$ |
| Croissance ($a \leqslant b$) | $f \leqslant g \Rightarrow \int_a^b f \leqslant \int_a^b g$ |
| Valeur moyenne | $\mu = \frac{1}{b - a}\int_a^b f$ |
:::

:::attention Les 3 pièges du BAC
1. Appliquer positivité ou croissance avec $a > b$ : il faut $a \leqslant b$.
2. Confondre intégrale et aire quand $f$ change de signe.
3. Oublier le facteur $\frac{1}{b - a}$ dans la valeur moyenne.
:::$R$, objectives=$O$Définir l'intégrale d'une fonction continue à l'aide d'une primitive.
Interpréter l'intégrale d'une fonction positive comme une aire.
Utiliser la linéarité et la relation de Chasles.
Exploiter la positivité et la croissance de l'intégrale pour encadrer.
Calculer et interpréter la valeur moyenne d'une fonction.$O$, difficulty=2, duration_min=50, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='integrale' and l.position=1;

update lessons l set title=$T$Techniques de calcul$T$, kind='cours', body=$L$## Intégrales de fonctions composées

:::methode Reconnaître une primitive
Avant tout calcul, chercher si la fonction est de la forme $u' \times (\text{fonction de } u)$ :
$$u'u^n \to \frac{u^{n+1}}{n+1}, \qquad \frac{u'}{u} \to \ln|u|, \qquad \frac{u'}{\sqrt{u}} \to 2\sqrt{u}, \qquad u'\mathrm{e}^u \to \mathrm{e}^u, \qquad \frac{u'}{1 + u^2} \to \arctan u.$$
:::

:::exemple
$$\int_0^1 \frac{x}{x^2 + 1}\,\mathrm{d}x = \frac{1}{2}\big[\ln(x^2 + 1)\big]_0^1 = \frac{\ln 2}{2}, \qquad \int_1^{\mathrm{e}} \frac{\ln x}{x}\,\mathrm{d}x = \left[\frac{(\ln x)^2}{2}\right]_1^{\mathrm{e}} = \frac{1}{2}.$$
:::

:::exemple
$$\int_0^{\pi/4} \tan x\,\mathrm{d}x = \int_0^{\pi/4} \frac{\sin x}{\cos x}\,\mathrm{d}x = \big[-\ln(\cos x)\big]_0^{\pi/4} = -\ln\frac{\sqrt{2}}{2} = \frac{\ln 2}{2}.$$
:::

## Transformer l'écriture

:::methode Linéariser
$\cos^2 x = \dfrac{1 + \cos 2x}{2}$ et $\sin^2 x = \dfrac{1 - \cos 2x}{2}$. Pour des puissances plus élevées, utiliser les formules d'Euler.
:::

:::exemple
$$\int_0^{\pi} \sin^2 x\,\mathrm{d}x = \int_0^{\pi} \frac{1 - \cos 2x}{2}\,\mathrm{d}x = \left[\frac{x}{2} - \frac{\sin 2x}{4}\right]_0^{\pi} = \frac{\pi}{2}.$$
:::

:::methode Fractions rationnelles
Décomposer en éléments simples : par exemple $\dfrac{1}{x(x + 1)} = \dfrac{1}{x} - \dfrac{1}{x + 1}$, ou faire une division euclidienne quand le degré du numérateur est supérieur ou égal à celui du dénominateur.
:::

:::exemple
$$\int_1^2 \frac{\mathrm{d}x}{x(x + 1)} = \big[\ln x - \ln(x + 1)\big]_1^2 = \ln\frac{2}{3} - \ln\frac{1}{2} = \ln\frac{4}{3}.$$
:::

## Intégration par parties

:::theoreme
Si $u$ et $v$ sont dérivables sur $[a ; b]$ à dérivées continues :
$$\int_a^b u(x)\,v'(x)\,\mathrm{d}x = \big[u(x)\,v(x)\big]_a^b - \int_a^b u'(x)\,v(x)\,\mathrm{d}x.$$
:::

:::demonstration
$(uv)' = u'v + uv'$ ; en intégrant de $a$ à $b$ : $[uv]_a^b = \int_a^b u'v + \int_a^b uv'$.
:::

:::methode Choisir $u$ et $v'$
- Polynôme $\times$ $\mathrm{e}^{kx}$, $\sin$, $\cos$ : $u$ = le polynôme.
- Polynôme $\times$ $\ln$ : $u = \ln$, $v'$ = le polynôme.
- $\ln x$ seul ou $\arctan x$ seul : écrire $1 \times \ln x$, avec $u = \ln x$ et $v' = 1$.
:::

:::exemple
$$\int_0^1 x\mathrm{e}^{x}\,\mathrm{d}x = \big[x\mathrm{e}^{x}\big]_0^1 - \int_0^1 \mathrm{e}^{x}\,\mathrm{d}x = \mathrm{e} - (\mathrm{e} - 1) = 1.$$
:::

:::exemple $\ln x$ seul
$$\int_1^{\mathrm{e}} \ln x\,\mathrm{d}x = \big[x\ln x\big]_1^{\mathrm{e}} - \int_1^{\mathrm{e}} x \cdot \frac{1}{x}\,\mathrm{d}x = \mathrm{e} - (\mathrm{e} - 1) = 1.$$
:::

:::exemple Double IPP
$I = \displaystyle\int_0^{\pi} \mathrm{e}^{x}\sin x\,\mathrm{d}x$. Deux IPP successives (avec $u = \sin$, puis $u = \cos$) donnent $I = \mathrm{e}^{\pi} + 1 - I$, d'où $I = \dfrac{\mathrm{e}^{\pi} + 1}{2}$.
:::

:::exemple IPP avec l'arctangente
$$\int_0^1 \arctan x\,\mathrm{d}x = \big[x\arctan x\big]_0^1 - \int_0^1 \frac{x}{1 + x^2}\,\mathrm{d}x = \frac{\pi}{4} - \frac{1}{2}\big[\ln(1 + x^2)\big]_0^1 = \frac{\pi}{4} - \frac{\ln 2}{2}.$$
:::

:::app IPP
Calcule $\displaystyle\int_0^{\pi/2} x\cos x\,\mathrm{d}x$ et $\displaystyle\int_1^{\mathrm{e}} x^2\ln x\,\mathrm{d}x$.
:::solution Correction
**1.** $u = x$, $v' = \cos x$ : $\big[x\sin x\big]_0^{\pi/2} - \displaystyle\int_0^{\pi/2} \sin x\,\mathrm{d}x = \dfrac{\pi}{2} - 1$.

**2.** $u = \ln x$, $v' = x^2$ : $\left[\dfrac{x^3}{3}\ln x\right]_1^{\mathrm{e}} - \displaystyle\int_1^{\mathrm{e}} \frac{x^2}{3}\,\mathrm{d}x = \dfrac{\mathrm{e}^3}{3} - \dfrac{\mathrm{e}^3 - 1}{9} = \dfrac{2\mathrm{e}^3 + 1}{9}$.
:::
:::

## Utiliser une relation de récurrence

:::methode
Pour une famille $I_n = \int_a^b f_n$, une IPP relie souvent $I_{n+1}$ à $I_n$. On calcule $I_0$ directement, puis on déroule la relation.
:::

:::app Applique
Pour $n \in \mathbb{N}$, on pose $I_n = \displaystyle\int_0^1 x^n\mathrm{e}^{x}\,\mathrm{d}x$. Montre que $I_{n+1} = \mathrm{e} - (n + 1)I_n$ et calcule $I_2$.
:::solution Correction
IPP avec $u = x^{n+1}$, $v' = \mathrm{e}^x$ : $I_{n+1} = \big[x^{n+1}\mathrm{e}^x\big]_0^1 - (n + 1)\displaystyle\int_0^1 x^n\mathrm{e}^x\,\mathrm{d}x = \mathrm{e} - (n + 1)I_n$.

$I_0 = \mathrm{e} - 1$, $I_1 = \mathrm{e} - I_0 = 1$, $I_2 = \mathrm{e} - 2I_1 = \mathrm{e} - 2$.
:::
:::

:::aretenir
- D'abord chercher une forme composée $u' \times g(u)$.
- Linéariser $\cos^2$, $\sin^2$ ; décomposer les fractions.
- IPP : $u$ se simplifie en dérivant ; $\ln$ seul via $1 \times \ln x$.
- Familles $I_n$ : relation de récurrence par IPP.
:::

:::funnel Techniques de calcul intégral
:::$L$, resume=$R$## Techniques de calcul — l'essentiel

:::aretenir Les 4 techniques
| Situation | Technique |
| --- | --- |
| forme $u'u^n$, $\frac{u'}{u}$, $u'\mathrm{e}^u$, $\frac{u'}{1+u^2}$ | primitive directe |
| $\cos^2$, $\sin^2$, fraction rationnelle | transformer l'écriture |
| produit polynôme $\times$ $\mathrm{e}$, $\ln$, $\sin$, $\cos$ | intégration par parties |
| $I_n$ dépendant de $n$ | relation de récurrence par IPP |
:::

:::aretenir Intégration par parties
$$\int_a^b u(x)v'(x)\,\mathrm{d}x = \big[u(x)v(x)\big]_a^b - \int_a^b u'(x)v(x)\,\mathrm{d}x$$
Choix : $u$ = la fonction qui se **simplifie** en la dérivant (polynôme, $\ln$).
:::

:::attention Les 3 pièges du BAC
1. Oublier le crochet $[uv]_a^b$ ou son signe.
2. Choisir $u = \mathrm{e}^x$ et $v' = x$ : l'intégrale devient plus compliquée.
3. Intégrer $\ln x$ directement : il faut écrire $\ln x = 1 \times \ln x$ et faire une IPP.
:::$R$, objectives=$O$Calculer une intégrale en reconnaissant une primitive, y compris d'une forme composée.
Transformer l'écriture d'une fonction (linéarisation, décomposition) avant d'intégrer.
Appliquer l'intégration par parties, une ou plusieurs fois.
Utiliser une relation de récurrence entre intégrales.$O$, difficulty=3, duration_min=55, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='integrale' and l.position=2;

update lessons l set title=$T$Applications : aires, volumes, fonctions intégrales$T$, kind='cours', body=$L$## Aire entre une courbe et l'axe des abscisses

:::propriete
Soit $f$ continue sur $[a ; b]$ ($a < b$). L'aire du domaine compris entre $\mathcal{C}_f$, l'axe des abscisses et les droites $x = a$, $x = b$ vaut, en unités d'aire,
$$\mathcal{A} = \int_a^b |f(x)|\,\mathrm{d}x.$$
Si $f$ change de signe, on découpe l'intervalle aux zéros de $f$ avec la relation de Chasles.
:::

:::exemple
Aire entre la courbe de $\sin$ et l'axe sur $[0 ; 2\pi]$ : $\displaystyle\int_0^{\pi} \sin x\,\mathrm{d}x - \int_{\pi}^{2\pi} \sin x\,\mathrm{d}x = 2 + 2 = 4$ u.a., alors que $\displaystyle\int_0^{2\pi} \sin x\,\mathrm{d}x = 0$.
:::

## Aire entre deux courbes

:::propriete
Si $f$ et $g$ sont continues sur $[a ; b]$ et $g \leqslant f$, l'aire du domaine compris entre les deux courbes et les droites $x = a$, $x = b$ vaut
$$\mathcal{A} = \int_a^b \big(f(x) - g(x)\big)\,\mathrm{d}x.$$
:::

:::methode
1. Étudier le signe de $f - g$ (position relative) et trouver les points d'intersection.
2. Intégrer « courbe du dessus moins courbe du dessous » sur chaque intervalle.
3. Convertir en $\text{cm}^2$ si l'énoncé donne les unités graphiques.
:::

:::exemple Avec une asymptote
$f(x) = x + 1 + \dfrac{\ln x}{x}$ et sa droite asymptote $y = x + 1$. Sur $[1 ; \mathrm{e}]$, $f(x) - (x + 1) = \dfrac{\ln x}{x} \geqslant 0$, donc
$$\mathcal{A} = \int_1^{\mathrm{e}} \frac{\ln x}{x}\,\mathrm{d}x = \left[\frac{(\ln x)^2}{2}\right]_1^{\mathrm{e}} = \frac{1}{2}\ \text{u.a.}$$
Avec un repère de $2$ cm par unité, cela fait $\frac{1}{2} \times 4 = 2\ \text{cm}^2$.
:::

:::app Aire entre deux courbes
Calcule l'aire du domaine compris entre les courbes de $f(x) = x^2$ et $g(x) = \sqrt{x}$.
:::solution Correction
Les courbes se coupent pour $x^2 = \sqrt{x}$, soit $x = 0$ ou $x = 1$. Sur $[0 ; 1]$, $\sqrt{x} \geqslant x^2$, donc
$$\mathcal{A} = \int_0^1 \left(\sqrt{x} - x^2\right)\mathrm{d}x = \left[\frac{2}{3}x^{3/2} - \frac{x^3}{3}\right]_0^1 = \frac{2}{3} - \frac{1}{3} = \frac{1}{3}\ \text{u.a.}$$
:::
:::

## Volume de révolution

:::propriete
Soit $f$ continue sur $[a ; b]$. Le solide engendré par la rotation, autour de l'axe des abscisses, du domaine délimité par $\mathcal{C}_f$, l'axe et les droites $x = a$, $x = b$ a pour volume, en unités de volume,
$$V = \pi\int_a^b \big(f(x)\big)^2\,\mathrm{d}x.$$
:::

:::exemple Le cône et la boule
- Cône : $f(x) = \frac{r}{h}x$ sur $[0 ; h]$ donne $V = \pi\dfrac{r^2}{h^2}\cdot\dfrac{h^3}{3} = \dfrac{1}{3}\pi r^2 h$.
- Boule : $f(x) = \sqrt{R^2 - x^2}$ sur $[-R ; R]$ donne $V = \pi\left[R^2x - \dfrac{x^3}{3}\right]_{-R}^{R} = \dfrac{4}{3}\pi R^3$.
:::

:::exemple
$f(x) = \sqrt{x}\,\mathrm{e}^{-x/2}$ sur $[0 ; 1]$ : $V = \pi\displaystyle\int_0^1 x\mathrm{e}^{-x}\,\mathrm{d}x$. Par IPP : $\displaystyle\int_0^1 x\mathrm{e}^{-x}\,\mathrm{d}x = \big[-x\mathrm{e}^{-x}\big]_0^1 + \int_0^1 \mathrm{e}^{-x}\,\mathrm{d}x = -\mathrm{e}^{-1} + 1 - \mathrm{e}^{-1} = 1 - \dfrac{2}{\mathrm{e}}$. Donc $V = \pi\left(1 - \dfrac{2}{\mathrm{e}}\right)$.
:::

## Fonction définie par une intégrale

:::theoreme
Soit $f$ continue sur $I$ et $a \in I$. La fonction $F(x) = \displaystyle\int_a^x f(t)\,\mathrm{d}t$ est dérivable sur $I$, avec $F' = f$ et $F(a) = 0$.

Plus généralement, si $u$ et $v$ sont dérivables à valeurs dans $I$ :
$$G(x) = \int_{u(x)}^{v(x)} f(t)\,\mathrm{d}t \implies G'(x) = v'(x)\,f\big(v(x)\big) - u'(x)\,f\big(u(x)\big).$$
:::

:::demonstration
Si $\Phi$ est une primitive de $f$, $G(x) = \Phi(v(x)) - \Phi(u(x))$ ; on dérive les deux composées.
:::

:::methode Étudier $F(x) = \int_a^x f(t)\,\mathrm{d}t$ sans calculer de primitive
- **Variations** : signe de $F'(x) = f(x)$.
- **Signe** : $F(a) = 0$ et le sens de variation.
- **Limites** : encadrer $f$ puis intégrer l'encadrement.
:::

:::exemple
$F(x) = \displaystyle\int_0^x \mathrm{e}^{-t^2}\,\mathrm{d}t$ : $F'(x) = \mathrm{e}^{-x^2} > 0$, $F$ est strictement croissante et impaire. Pour $t \geqslant 1$, $\mathrm{e}^{-t^2} \leqslant \mathrm{e}^{-t}$, ce qui permet de montrer que $F$ est majorée sur $[0 ; +\infty[$, donc admet une limite finie en $+\infty$.
:::

:::app Applique
Soit $G(x) = \displaystyle\int_x^{2x} \frac{\mathrm{d}t}{t}$ pour $x > 0$. Calcule $G'(x)$ et conclus.
:::solution Correction
$G'(x) = 2 \cdot \dfrac{1}{2x} - 1 \cdot \dfrac{1}{x} = 0$ : $G$ est constante sur $]0 ; +\infty[$. Par le calcul direct, $G(x) = \ln(2x) - \ln x = \ln 2$ : on retrouve une constante.
:::
:::

:::aretenir
- Aire : $\int |f|$, découpage aux zéros ; entre deux courbes : $\int(\text{haut} - \text{bas})$.
- Volume autour de $(Ox)$ : $\pi\int f^2$.
- $\left(\int_a^x f\right)' = f(x)$ ; bornes variables : $v'f(v) - u'f(u)$.
:::

:::funnel Aires, volumes et fonctions intégrales
:::$L$, resume=$R$## Applications — l'essentiel

:::aretenir Aires (en unités d'aire)
- Entre $\mathcal{C}_f$ et l'axe, sur $[a ; b]$ : $\mathcal{A} = \int_a^b |f(x)|\,\mathrm{d}x$.
- Entre $\mathcal{C}_f$ et $\mathcal{C}_g$, avec $f \geqslant g$ : $\mathcal{A} = \int_a^b \big(f(x) - g(x)\big)\,\mathrm{d}x$.
:::

:::aretenir Volume de révolution autour de $(Ox)$
$$V = \pi\int_a^b f(x)^2\,\mathrm{d}x \quad \text{(en unités de volume)}$$
:::

:::aretenir Fonction intégrale
$F(x) = \int_a^x f(t)\,\mathrm{d}t$ : $F' = f$, $F(a) = 0$. $G(x) = \int_{u(x)}^{v(x)} f(t)\,\mathrm{d}t$ : $G'(x) = v'(x)f(v(x)) - u'(x)f(u(x))$.
:::

:::attention Les 3 pièges du BAC
1. Calculer $\int_a^b f$ comme une aire alors que $f$ change de signe.
2. Oublier $\pi$ ou le carré dans le volume.
3. Oublier de convertir les unités d'aire en $\text{cm}^2$.
:::$R$, objectives=$O$Calculer l'aire d'un domaine délimité par une courbe et l'axe des abscisses, en tenant compte du signe.
Calculer l'aire entre deux courbes après avoir étudié leur position relative.
Calculer le volume d'un solide de révolution autour de l'axe des abscisses.
Étudier une fonction définie par une intégrale : dérivée, variations, limites.$O$, difficulty=3, duration_min=55, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='integrale' and l.position=3;

update lessons l set title=$T$Fiche de révision — Calcul intégral$T$, kind='resume', body=$L$:::aretenir Définition et propriétés
$\int_a^b f = F(b) - F(a)$. Chasles, linéarité. Pour $a \leqslant b$ : $f \geqslant 0 \Rightarrow \int_a^b f \geqslant 0$ ; $f \leqslant g \Rightarrow \int_a^b f \leqslant \int_a^b g$ ; $\left|\int_a^b f\right| \leqslant \int_a^b |f|$.
Moyenne : $m \leqslant f \leqslant M \Rightarrow m(b - a) \leqslant \int_a^b f \leqslant M(b - a)$ ; $\mu = \frac{1}{b - a}\int_a^b f$.
:::

:::methode Calculer
1. Forme $u' \times g(u)$ : primitive directe.
2. $\cos^2$, $\sin^2$ : linéariser ; fractions : décomposer.
3. Produits : IPP $\int_a^b uv' = [uv]_a^b - \int_a^b u'v$, avec $u$ qui se simplifie.
:::

:::aretenir Applications
Aire $= \int_a^b |f|$ ; entre deux courbes $\int_a^b (f - g)$ si $f \geqslant g$. Volume $= \pi\int_a^b f^2$. Unité d'aire $=$ produit des unités graphiques.
:::

:::aretenir Fonctions intégrales et suites
$\left(\int_a^x f\right)' = f$. $\left(\int_{u(x)}^{v(x)} f\right)' = v'f(v) - u'f(u)$.
Sommes de Riemann : $\frac{b - a}{n}\sum_{k=0}^{n-1} f\left(a + k\frac{b - a}{n}\right) \to \int_a^b f$.
:::

:::attention Réflexes
Bornes dans l'ordre pour comparer. Parité : $\int_{-a}^a f = 0$ si $f$ impaire, $= 2\int_0^a f$ si $f$ paire.
:::$L$, resume=null, objectives=null, difficulty=1, duration_min=15, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='integrale' and l.position=4;

update lessons l set title=$T$Méthodes & exercices types$T$, kind='cours', body=$L$## Comment lire cette notion

La dernière partie du problème d'analyse au BAC SM porte presque toujours sur une intégrale : un calcul d'aire, puis une suite $(I_n)$ définie par une intégrale ou une somme de Riemann. Les méthodes ci-dessous couvrent ces questions.

## Techniques de calcul

:::methode L'ordre des réflexes
1. Forme $u' \times g(u)$ : primitive directe.
2. Fraction rationnelle : décomposition ou division.
3. Puissance de $\cos$ ou $\sin$ : linéarisation.
4. Produit de deux fonctions de natures différentes : IPP.
:::

:::app Choisir sa technique
Calcule $A = \displaystyle\int_0^1 \frac{2x + 1}{x^2 + x + 1}\,\mathrm{d}x$, $\;B = \displaystyle\int_1^{\mathrm{e}} x\ln x\,\mathrm{d}x$ et $\;C = \displaystyle\int_0^{\pi/2} \cos^2 x\,\mathrm{d}x$.
:::solution Correction
**A.** Forme $\frac{u'}{u}$ : $A = \big[\ln(x^2 + x + 1)\big]_0^1 = \ln 3$.

**B.** IPP avec $u = \ln x$, $v' = x$ : $B = \left[\dfrac{x^2}{2}\ln x\right]_1^{\mathrm{e}} - \displaystyle\int_1^{\mathrm{e}} \frac{x}{2}\,\mathrm{d}x = \dfrac{\mathrm{e}^2}{2} - \dfrac{\mathrm{e}^2 - 1}{4} = \dfrac{\mathrm{e}^2 + 1}{4}$.

**C.** $\cos^2 x = \frac{1 + \cos 2x}{2}$ : $C = \left[\dfrac{x}{2} + \dfrac{\sin 2x}{4}\right]_0^{\pi/2} = \dfrac{\pi}{4}$.
:::
:::

## Encadrement d'une intégrale

:::methode
1. Encadrer l'intégrande sur l'intervalle d'intégration : $g(x) \leqslant f(x) \leqslant h(x)$ (souvent via les variations ou $0 \leqslant x \leqslant 1$).
2. Intégrer l'encadrement, bornes dans l'ordre croissant.
3. Calculer les intégrales des bornes.
:::

:::exemple
Pour $x \in [0 ; 1]$ : $\dfrac{x^n}{2} \leqslant \dfrac{x^n}{1 + x} \leqslant x^n$. En intégrant : $\dfrac{1}{2(n + 1)} \leqslant \displaystyle\int_0^1 \frac{x^n}{1 + x}\,\mathrm{d}x \leqslant \dfrac{1}{n + 1}$. Les deux bornes tendent vers $0$, donc l'intégrale aussi.
:::

## Suites définies par une intégrale

:::methode Le schéma classique
1. **Premier terme** : calculer $I_0$ ou $I_1$ directement.
2. **Signe** de $I_n$ à partir du signe de l'intégrande.
3. **Monotonie** : $I_{n+1} - I_n = \int_a^b \big(f_{n+1}(x) - f_n(x)\big)\,\mathrm{d}x$, puis signe de l'intégrande.
4. **Convergence** : monotone et bornée ; ou encadrement puis gendarmes.
5. **Relation de récurrence** par IPP, utilisée pour trouver la limite ou calculer les premiers termes.
:::

:::exemple Traité
$I_n = \displaystyle\int_0^1 x^n\mathrm{e}^{-x}\,\mathrm{d}x$.

**Signe.** $x^n\mathrm{e}^{-x} \geqslant 0$ sur $[0 ; 1]$ : $I_n \geqslant 0$.

**Monotonie.** $I_{n+1} - I_n = \displaystyle\int_0^1 x^n(x - 1)\mathrm{e}^{-x}\,\mathrm{d}x \leqslant 0$ car $x - 1 \leqslant 0$ : $(I_n)$ est décroissante.

**Limite.** $0 \leqslant x^n\mathrm{e}^{-x} \leqslant x^n$, d'où $0 \leqslant I_n \leqslant \dfrac{1}{n + 1}$ : $\lim I_n = 0$.

**Récurrence.** IPP : $I_{n+1} = (n + 1)I_n - \mathrm{e}^{-1}$.
:::

## Sommes de Riemann

:::theoreme
Si $f$ est continue sur $[a ; b]$, alors
$$\lim_{n \to +\infty} \frac{b - a}{n}\sum_{k=0}^{n-1} f\left(a + k\,\frac{b - a}{n}\right) = \lim_{n \to +\infty} \frac{b - a}{n}\sum_{k=1}^{n} f\left(a + k\,\frac{b - a}{n}\right) = \int_a^b f(x)\,\mathrm{d}x.$$
:::

:::methode Reconnaître une somme de Riemann
Mettre la somme sous la forme $\dfrac{1}{n}\displaystyle\sum_{k} f\left(\dfrac{k}{n}\right)$ : on identifie $f$, et la limite est $\displaystyle\int_0^1 f(x)\,\mathrm{d}x$.
:::

:::exemple
$S_n = \displaystyle\sum_{k=1}^{n} \frac{1}{n + k} = \frac{1}{n}\sum_{k=1}^{n} \frac{1}{1 + \frac{k}{n}} \xrightarrow[n \to +\infty]{} \int_0^1 \frac{\mathrm{d}x}{1 + x} = \ln 2.$
:::

:::app Applique
Détermine $\lim\limits_{n \to +\infty} \dfrac{1}{n^3}\displaystyle\sum_{k=1}^{n} k^2$ à l'aide d'une somme de Riemann.
:::solution Correction
$\dfrac{1}{n^3}\displaystyle\sum_{k=1}^{n} k^2 = \dfrac{1}{n}\sum_{k=1}^{n} \left(\dfrac{k}{n}\right)^2 \to \displaystyle\int_0^1 x^2\,\mathrm{d}x = \dfrac{1}{3}$.
:::
:::

:::aretenir
- Réflexes de calcul : composée, décomposition, linéarisation, IPP.
- Encadrer l'intégrande puis intégrer ; gendarmes pour la limite.
- Suites $I_n$ : signe, monotonie, encadrement, relation par IPP.
- Riemann : $\frac{1}{n}\sum f\left(\frac{k}{n}\right) \to \int_0^1 f$.
:::

:::funnel Méthodes sur les intégrales
:::$L$, resume=$R$## Méthodes sur les intégrales — l'essentiel

:::aretenir Suite d'intégrales $I_n = \int_a^b f_n$
- Signe : signe de $f_n$ (avec $a \leqslant b$).
- Monotonie : signe de $f_{n+1} - f_n$, puis $I_{n+1} - I_n = \int_a^b (f_{n+1} - f_n)$.
- Limite : encadrer $f_n$, intégrer, gendarmes.
:::

:::attention Les 3 pièges du BAC
1. Encadrer l'intégrande sur un mauvais intervalle.
2. Calculer $I_{n+1} - I_n$ sans regrouper sous une seule intégrale.
3. Oublier la conversion des unités d'aire.
:::$R$, objectives=$O$Choisir la technique adaptée pour calculer une intégrale.
Encadrer une intégrale sans la calculer et en déduire une limite.
Étudier une suite définie par une intégrale : signe, monotonie, limite.
Mener le calcul d'aire d'un problème d'analyse jusqu'à la conversion en $\text{cm}^2$.$O$, difficulty=3, duration_min=55, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='integrale' and l.position=50;

update lessons l set title=$T$Approfondissement : parité, moyenne, fonction intégrale$T$, kind='cours', body=$L$## Intégrale et symétries

:::propriete Parité
Soit $f$ continue sur $[-a ; a]$.
- Si $f$ est **paire** : $\displaystyle\int_{-a}^{a} f(x)\,\mathrm{d}x = 2\int_0^{a} f(x)\,\mathrm{d}x$.
- Si $f$ est **impaire** : $\displaystyle\int_{-a}^{a} f(x)\,\mathrm{d}x = 0$.
:::

:::exemple
$\displaystyle\int_{-1}^{1} x^3\cos x\,\mathrm{d}x = 0$ (fonction impaire), sans aucun calcul de primitive. $\quad \displaystyle\int_{-\pi}^{\pi} |\sin x|\,\mathrm{d}x = 2\int_0^{\pi} \sin x\,\mathrm{d}x = 4$.
:::

:::propriete Périodicité
Si $f$ est continue et $T$-périodique, pour tout réel $a$ : $\displaystyle\int_a^{a+T} f(x)\,\mathrm{d}x = \int_0^{T} f(x)\,\mathrm{d}x$.
:::

:::propriete Changement de variable affine
Pour $\alpha \neq 0$ : $\displaystyle\int_a^b f(\alpha x + \beta)\,\mathrm{d}x = \frac{1}{\alpha}\int_{\alpha a + \beta}^{\alpha b + \beta} f(t)\,\mathrm{d}t$. Cas utile : $\displaystyle\int_0^a f(a - x)\,\mathrm{d}x = \int_0^a f(t)\,\mathrm{d}t$.
:::

:::exemple Une astuce de symétrie
$I = \displaystyle\int_0^{\pi/2} \frac{\sin x}{\sin x + \cos x}\,\mathrm{d}x$ et $J = \displaystyle\int_0^{\pi/2} \frac{\cos x}{\sin x + \cos x}\,\mathrm{d}x$. Le changement $x \mapsto \frac{\pi}{2} - x$ échange $\sin$ et $\cos$, donc $I = J$. Or $I + J = \frac{\pi}{2}$ : $I = \frac{\pi}{4}$.
:::

## Inégalité de la moyenne

:::theoreme
Soit $f$ continue sur $[a ; b]$, $a < b$.
1. Si $m \leqslant f \leqslant M$ sur $[a ; b]$ : $m \leqslant \dfrac{1}{b - a}\displaystyle\int_a^b f \leqslant M$.
2. Si $|f| \leqslant M$ sur $[a ; b]$ : $\left|\displaystyle\int_a^b f\right| \leqslant M(b - a)$.
3. Il existe $c \in [a ; b]$ tel que $\displaystyle\int_a^b f(x)\,\mathrm{d}x = (b - a)\,f(c)$.
:::

:::demonstration Point 3
$f$ continue sur le segment atteint son minimum $m$ et son maximum $M$. Par le point 1, $\mu = \frac{1}{b - a}\int_a^b f \in [m ; M]$ ; par le TVI, $\mu$ est atteinte en un point $c$.
:::

:::exemple Limite d'une moyenne
$\lim\limits_{x \to 0} \dfrac{1}{x}\displaystyle\int_0^x \mathrm{e}^{t^2}\,\mathrm{d}t$ : il existe $c_x$ entre $0$ et $x$ avec $\frac{1}{x}\int_0^x \mathrm{e}^{t^2}\,\mathrm{d}t = \mathrm{e}^{c_x^2}$. Comme $c_x \to 0$, la limite vaut $1$.
:::

## Fonctions définies par une intégrale : étude approfondie

:::methode Limite en $+\infty$ de $F(x) = \int_a^x f(t)\,\mathrm{d}t$
- Si $f(t) \geqslant g(t) > 0$ avec $\int_a^x g \to +\infty$, alors $F \to +\infty$.
- Si $0 \leqslant f(t) \leqslant g(t)$ avec $\int_a^x g$ majorée, alors $F$ est croissante et majorée, donc converge.
:::

:::exemple
$F(x) = \displaystyle\int_1^x \frac{\mathrm{e}^{t}}{t}\,\mathrm{d}t$ : pour $t \geqslant 1$, $\frac{\mathrm{e}^t}{t} \geqslant \frac{\mathrm{e}^t}{\mathrm{e}^{t-1}} = \mathrm{e}$ car $t \leqslant \mathrm{e}^{t-1}$. Donc $F(x) \geqslant \mathrm{e}(x - 1) \to +\infty$.
:::

:::app Applique
Soit $F(x) = \displaystyle\int_0^x \frac{\mathrm{d}t}{1 + t^4}$. Montre que $F$ est croissante, puis que $F(x) \leqslant 1 + \dfrac{1}{3}$ pour tout $x \geqslant 1$.
:::solution Correction
$F'(x) = \dfrac{1}{1 + x^4} > 0$ : $F$ est strictement croissante.

Pour $x \geqslant 1$ : $F(x) = \displaystyle\int_0^1 \frac{\mathrm{d}t}{1 + t^4} + \int_1^x \frac{\mathrm{d}t}{1 + t^4} \leqslant \int_0^1 1\,\mathrm{d}t + \int_1^x \frac{\mathrm{d}t}{t^4} = 1 + \frac{1}{3}\left(1 - \frac{1}{x^3}\right) \leqslant \frac{4}{3}$.
:::
:::

:::aretenir
- Parité et périodicité simplifient avant de calculer.
- Changement affine : facteur $\frac{1}{\alpha}$ et nouvelles bornes.
- Moyenne : $\int_a^b f = (b - a)f(c)$ pour $f$ continue.
- $\int_a^x f$ : comparer $f$ à une fonction dont on connaît l'intégrale.
:::

:::funnel Parité, moyenne et fonctions intégrales
:::$L$, resume=$R$## Approfondissement — l'essentiel

:::aretenir Symétries
$f$ paire : $\int_{-a}^{a} f = 2\int_0^a f$. $\;f$ impaire : $\int_{-a}^{a} f = 0$. $\;f$ $T$-périodique : $\int_a^{a+T} f = \int_0^T f$.
:::

:::aretenir Moyenne
$m \leqslant f \leqslant M$ sur $[a ; b]$ $\Rightarrow$ $m \leqslant \frac{1}{b - a}\int_a^b f \leqslant M$. Si $f$ continue : il existe $c$ avec $\int_a^b f = (b - a)f(c)$.
:::

:::aretenir Changement de variable affine
$\int_a^b f(\alpha x + \beta)\,\mathrm{d}x = \frac{1}{\alpha}\int_{\alpha a + \beta}^{\alpha b + \beta} f(t)\,\mathrm{d}t$ ($\alpha \neq 0$).
:::

:::attention Les 3 pièges du BAC
1. Utiliser la parité sur un intervalle non symétrique.
2. Oublier le facteur $\frac{1}{\alpha}$ dans un changement de variable.
3. Croire que $\int_0^x f$ a forcément une limite finie en $+\infty$.
:::$R$, objectives=$O$Simplifier une intégrale grâce à la parité ou à la périodicité.
Utiliser l'inégalité de la moyenne et le théorème de la moyenne.
Étudier finement une fonction définie par une intégrale, y compris ses limites.
Effectuer un changement de variable affine dans une intégrale.$O$, difficulty=3, duration_min=45, bac_frequency=2
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='integrale' and l.position=60;

update lessons l set title=$T$Limite d'une fonction & limites usuelles$T$, kind='cours', body=$L$La notion de limite décrit le comportement de $f(x)$ lorsque $x$ se rapproche d'un réel $a$ ou tend vers l'infini. C'est l'outil fondateur de toute l'analyse : continuité, dérivation, intégration et étude de fonctions en découlent.

## Limite finie ou infinie en un point

:::definition Limite finie en un point
Soit $f$ définie sur un intervalle ouvert contenant $a$, sauf peut-être en $a$. On dit que $f$ admet pour limite le réel $\ell$ en $a$ si $f(x)$ est aussi proche de $\ell$ qu'on le souhaite dès que $x$ est assez proche de $a$ :
$$\forall \varepsilon > 0,\ \exists \delta > 0,\ \forall x \in D_f,\ 0 < |x - a| < \delta \implies |f(x) - \ell| < \varepsilon.$$
On note $\lim\limits_{x \to a} f(x) = \ell$.
:::

:::definition Limite infinie en un point
$\lim\limits_{x \to a} f(x) = +\infty$ signifie : pour tout $A > 0$, il existe $\delta > 0$ tel que $0 < |x - a| < \delta \implies f(x) > A$. La droite d'équation $x = a$ est alors **asymptote verticale** à la courbe.
:::

[[fig:asymptote]] Limite infinie en $a$ : la courbe longe la droite $x = a$.

:::theoreme Unicité de la limite
Si $f$ admet une limite en $a$, cette limite est unique.
:::

:::demonstration
Supposons $f \to \ell$ et $f \to \ell'$ en $a$ avec $\ell \neq \ell'$. Avec $\varepsilon = \frac{|\ell - \ell'|}{2}$, pour $x$ assez proche de $a$ on aurait $|\ell - \ell'| \leqslant |f(x) - \ell| + |f(x) - \ell'| < 2\varepsilon = |\ell - \ell'|$ : absurde.
:::

:::exemple Utiliser la définition
Montrons que $\lim\limits_{x \to 2} (3x - 1) = 5$. On a $|(3x - 1) - 5| = 3|x - 2|$. Pour $\varepsilon > 0$ donné, il suffit de prendre $\delta = \frac{\varepsilon}{3}$ : si $|x - 2| < \delta$ alors $|(3x-1) - 5| < \varepsilon$.
:::

## Limites à gauche et à droite

:::definition Limites latérales
La limite à droite $\lim\limits_{x \to a^+} f(x)$ ne considère que les $x > a$ ; la limite à gauche $\lim\limits_{x \to a^-} f(x)$ que les $x < a$.
:::

:::propriete
$f$ admet une limite $\ell$ en $a$ si et seulement si $\lim\limits_{x \to a^-} f(x) = \lim\limits_{x \to a^+} f(x) = \ell$.
:::

:::exemple
Pour $f(x) = \dfrac{|x|}{x}$ : $\lim\limits_{x \to 0^+} f(x) = 1$ et $\lim\limits_{x \to 0^-} f(x) = -1$. Les limites latérales diffèrent : $f$ n'a pas de limite en $0$.
:::

:::exemple Fonction partie entière
Pour $E(x) = \lfloor x \rfloor$ et $n \in \mathbb{Z}$ : $\lim\limits_{x \to n^-} E(x) = n - 1$ et $\lim\limits_{x \to n^+} E(x) = n$. La partie entière n'a de limite en aucun entier.
:::

:::methode Limite d'un quotient de la forme $\dfrac{\ell}{0}$
Si le numérateur tend vers $\ell \neq 0$ et le dénominateur vers $0$, la limite est infinie ; son **signe** se lit dans un tableau de signes du dénominateur, d'où la nécessité de distinguer $a^-$ et $a^+$.
:::

:::exemple
$\lim\limits_{x \to 1^+} \dfrac{2x + 1}{x - 1}$ : numérateur $\to 3$, dénominateur $\to 0^+$, donc $+\infty$. En $1^-$, dénominateur $\to 0^-$, donc $-\infty$. La droite $x = 1$ est asymptote verticale.
:::

## Limites à l'infini

:::definition
$\lim\limits_{x \to +\infty} f(x) = \ell$ signifie : pour tout $\varepsilon > 0$, il existe $B$ tel que $x > B \implies |f(x) - \ell| < \varepsilon$. La droite $y = \ell$ est alors **asymptote horizontale** en $+\infty$.

$\lim\limits_{x \to +\infty} f(x) = +\infty$ signifie : pour tout $A$, il existe $B$ tel que $x > B \implies f(x) > A$.
:::

:::remarque
Une fonction peut n'avoir aucune limite en $+\infty$ : $\sin x$ oscille entre $-1$ et $1$ sans se stabiliser.
:::

## Limites de référence

:::aretenir Puissances et inverses
Pour $n \in \mathbb{N}^*$ :
$$\lim_{x \to +\infty} x^n = +\infty, \qquad \lim_{x \to -\infty} x^n = \begin{cases} +\infty & n \text{ pair} \\ -\infty & n \text{ impair} \end{cases}, \qquad \lim_{x \to \pm\infty} \frac{1}{x^n} = 0.$$
$$\lim_{x \to +\infty} \sqrt{x} = +\infty, \qquad \lim_{x \to 0^+} \frac{1}{x} = +\infty, \qquad \lim_{x \to 0^-} \frac{1}{x} = -\infty.$$
:::

:::theoreme Limites trigonométriques
$$\lim_{x \to 0} \frac{\sin x}{x} = 1, \qquad \lim_{x \to 0} \frac{\tan x}{x} = 1, \qquad \lim_{x \to 0} \frac{1 - \cos x}{x^2} = \frac{1}{2}.$$
:::

:::demonstration $\dfrac{\sin x}{x} \to 1$
Pour $0 < x < \frac{\pi}{2}$, la comparaison des aires du triangle inscrit, du secteur et du triangle circonscrit donne $\sin x < x < \tan x$. En divisant par $\sin x > 0$ : $1 < \dfrac{x}{\sin x} < \dfrac{1}{\cos x}$, d'où $\cos x < \dfrac{\sin x}{x} < 1$. Comme $\cos x \to 1$, les gendarmes donnent la limite $1$ ; la fonction étant paire, la limite à gauche est la même.

Pour la troisième : $1 - \cos x = 2\sin^2\frac{x}{2}$, donc $\dfrac{1 - \cos x}{x^2} = \dfrac{1}{2}\left(\dfrac{\sin (x/2)}{x/2}\right)^2 \to \dfrac{1}{2}$.
:::

:::remarque Lien avec la dérivée
$\dfrac{\sin x}{x} = \dfrac{\sin x - \sin 0}{x - 0}$ : cette limite n'est autre que $\sin'(0) = \cos 0 = 1$.
:::

:::app Applique
Détermine $\lim\limits_{x \to 0} \dfrac{\sin(4x)}{\tan(2x)}$.
:::solution Correction
On écrit $\dfrac{\sin(4x)}{\tan(2x)} = \dfrac{\sin(4x)}{4x} \times \dfrac{2x}{\tan(2x)} \times \dfrac{4x}{2x}$. Les deux premiers facteurs tendent vers $1$ et le troisième vaut $2$ : la limite est $2$.
:::
:::

:::aretenir
- Limite en $a$ : $\varepsilon$–$\delta$ ; en $+\infty$ : $\varepsilon$–$B$. La limite est unique.
- Limite en $a$ $\iff$ limites à gauche et à droite égales.
- $\dfrac{\ell}{0}$ avec $\ell \neq 0$ : limite infinie, signe par tableau.
- Trois limites trigonométriques à connaître : $1$, $1$ et $\frac{1}{2}$.
:::

:::funnel Limite d'une fonction
:::$L$, resume=$R$## Limite d'une fonction — l'essentiel

:::aretenir Les quatre situations
| Écriture | Signification | Lecture graphique |
| --- | --- | --- |
| $\lim\limits_{x \to a} f(x) = \ell$ | $f(x)$ aussi proche de $\ell$ qu'on veut pour $x$ proche de $a$ | point limite |
| $\lim\limits_{x \to a} f(x) = \pm\infty$ | $f(x)$ dépasse tout réel | asymptote verticale $x = a$ |
| $\lim\limits_{x \to \pm\infty} f(x) = \ell$ | $f(x)$ se rapproche de $\ell$ | asymptote horizontale $y = \ell$ |
| $\lim\limits_{x \to \pm\infty} f(x) = \pm\infty$ | $f(x)$ dépasse tout réel | branche infinie |
:::

:::aretenir Limites de référence
$$\lim_{x \to 0} \frac{\sin x}{x} = 1, \qquad \lim_{x \to 0} \frac{\tan x}{x} = 1, \qquad \lim_{x \to 0} \frac{1 - \cos x}{x^2} = \frac{1}{2}$$
$\dfrac{1}{x^n} \to 0$ en $\pm\infty$ ; $\dfrac{1}{x} \to +\infty$ en $0^+$ et $-\infty$ en $0^-$.
:::

:::attention Les 3 pièges du BAC
1. Conclure à une limite en $a$ alors que les limites à gauche et à droite diffèrent.
2. Oublier le signe de $0$ dans $\dfrac{\ell}{0}$ : il faut $0^+$ ou $0^-$.
3. Confondre $\dfrac{\sin x}{x} \to 1$ en $0$ et $\dfrac{\sin x}{x} \to 0$ en $+\infty$.
:::$R$, objectives=$O$Interpréter et écrire avec des quantificateurs une limite finie ou infinie en un point et à l'infini.
Distinguer limite à gauche et limite à droite, et en déduire l'existence d'une limite.
Reconnaître les asymptotes verticales et horizontales associées aux limites.
Connaître par cœur les limites de référence, y compris les limites trigonométriques.$O$, difficulty=1, duration_min=45, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='limites' and l.position=1;

update lessons l set title=$T$Opérations & formes indéterminées$T$, kind='cours', body=$L$## Opérations sur les limites

:::propriete Somme, produit, quotient de limites finies
Si $\lim f = \ell$ et $\lim g = \ell'$ (au même point), alors $\lim (f + g) = \ell + \ell'$, $\lim (fg) = \ell\ell'$, et $\lim \dfrac{f}{g} = \dfrac{\ell}{\ell'}$ si $\ell' \neq 0$.
:::

:::aretenir Règles avec l'infini
| Somme | Résultat |
| --- | --- |
| $\ell + (+\infty)$ | $+\infty$ |
| $(+\infty) + (+\infty)$ | $+\infty$ |
| $(+\infty) + (-\infty)$ | **FI** |

| Produit | Résultat |
| --- | --- |
| $\ell \times (+\infty)$, $\ell > 0$ | $+\infty$ |
| $\ell \times (+\infty)$, $\ell < 0$ | $-\infty$ |
| $0 \times \infty$ | **FI** |

| Quotient | Résultat |
| --- | --- |
| $\dfrac{\ell}{\pm\infty}$ | $0$ |
| $\dfrac{\ell}{0^+}$, $\ell > 0$ | $+\infty$ |
| $\dfrac{\infty}{\infty}$ et $\dfrac{0}{0}$ | **FI** |
:::

## Les formes indéterminées

:::attention Ce qu'une FI signifie
Les quatre formes $\infty - \infty$, $0 \times \infty$, $\dfrac{\infty}{\infty}$, $\dfrac{0}{0}$ disent seulement que les règles ne permettent pas de conclure **en l'état**. Selon l'expression, la limite peut être finie, infinie ou ne pas exister :
- $x^2 - x \to +\infty$, $\;(x + 1) - x \to 1$, $\;x - x^2 \to -\infty$ : trois FI $\infty - \infty$, trois résultats différents.
:::

## Techniques de levée

:::methode Polynômes et fonctions rationnelles en $\pm\infty$
1. Factoriser numérateur et dénominateur par leur terme de plus haut degré.
2. Simplifier : les termes en $\frac{1}{x^k}$ tendent vers $0$.
3. Conclure : la limite est celle du quotient des termes dominants.
:::

:::exemple
$$\lim_{x \to -\infty} \frac{2x^3 - x + 4}{5x^2 + 1} = \lim_{x \to -\infty} \frac{2x^3}{5x^2} = \lim_{x \to -\infty} \frac{2x}{5} = -\infty.$$
:::

:::methode Racines : la quantité conjuguée
Pour $\sqrt{A} - B$ en forme $\infty - \infty$ ou $\frac{0}{0}$, multiplier et diviser par $\sqrt{A} + B$ :
$$\sqrt{A} - B = \frac{A - B^2}{\sqrt{A} + B}.$$
:::

:::exemple En $-\infty$, attention au signe
$\lim\limits_{x \to -\infty} \left(\sqrt{x^2 + x} + x\right)$. Conjuguée : $\dfrac{x^2 + x - x^2}{\sqrt{x^2 + x} - x} = \dfrac{x}{\sqrt{x^2 + x} - x}$. Pour $x < 0$, $\sqrt{x^2 + x} = |x|\sqrt{1 + \frac{1}{x}} = -x\sqrt{1 + \frac{1}{x}}$, d'où
$$\frac{x}{-x\sqrt{1 + \frac{1}{x}} - x} = \frac{1}{-\sqrt{1 + \frac{1}{x}} - 1} \xrightarrow[x \to -\infty]{} -\frac{1}{2}.$$
:::

:::methode Forme $\frac{0}{0}$ en un réel $a$
- **Polynômes** : $a$ est racine du numérateur et du dénominateur ; factoriser par $(x - a)$ et simplifier.
- **Taux d'accroissement** : reconnaître $\dfrac{f(x) - f(a)}{x - a} \to f'(a)$.
- **Trigonométrie** : faire apparaître $\dfrac{\sin u}{u}$, $\dfrac{\tan u}{u}$ ou $\dfrac{1 - \cos u}{u^2}$.
:::

:::exemple Taux d'accroissement
$$\lim_{x \to \frac{\pi}{3}} \frac{2\cos x - 1}{x - \frac{\pi}{3}} = 2 \times \cos'\left(\frac{\pi}{3}\right) = -2\sin\frac{\pi}{3} = -\sqrt{3}.$$
:::

:::aretenir Polynôme en l'infini
Un polynôme a, en $\pm\infty$, la limite de son terme de plus haut degré : $\lim\limits_{x \to \pm\infty} (a_n x^n + \cdots + a_0) = \lim\limits_{x \to \pm\infty} a_n x^n$.
:::

:::app Applique
Calcule $\lim\limits_{x \to 2} \dfrac{x^3 - 8}{x^2 - 4}$ puis $\lim\limits_{x \to +\infty} \left(\sqrt{4x^2 + x} - 2x\right)$.
:::solution Correction
**1.** $x^3 - 8 = (x - 2)(x^2 + 2x + 4)$ et $x^2 - 4 = (x - 2)(x + 2)$. Pour $x \neq 2$ : $\dfrac{x^2 + 2x + 4}{x + 2} \to \dfrac{12}{4} = 3$.

**2.** Conjuguée : $\dfrac{4x^2 + x - 4x^2}{\sqrt{4x^2 + x} + 2x} = \dfrac{x}{x\left(\sqrt{4 + \frac{1}{x}} + 2\right)} \to \dfrac{1}{4}$.
:::
:::

:::app Applique — trois FI, trois techniques
Calcule $\lim\limits_{x \to +\infty} \dfrac{3x - \sqrt{x}}{2x + 1}$, $\;\lim\limits_{x \to 0} \dfrac{x^2 + 3x}{\sin x}$ et $\;\lim\limits_{x \to -\infty} \left(x + \sqrt{x^2 - 2x}\right)$.
:::solution Correction
**1.** On factorise par $x$ : $\dfrac{3 - \frac{1}{\sqrt{x}}}{2 + \frac{1}{x}} \to \dfrac{3}{2}$.

**2.** $\dfrac{x^2 + 3x}{\sin x} = \dfrac{x}{\sin x}(x + 3) \to 1 \times 3 = 3$.

**3.** Conjuguée : $x + \sqrt{x^2 - 2x} = \dfrac{x^2 - (x^2 - 2x)}{x - \sqrt{x^2 - 2x}} = \dfrac{2x}{x - \sqrt{x^2 - 2x}}$. Pour $x < 0$, $\sqrt{x^2 - 2x} = -x\sqrt{1 - \frac{2}{x}}$, d'où $\dfrac{2x}{x\left(1 + \sqrt{1 - \frac{2}{x}}\right)} = \dfrac{2}{1 + \sqrt{1 - \frac{2}{x}}} \to 1$.
:::
:::

:::aretenir
- Règles de calcul : connaître les cas avec $\infty$ et $0^\pm$.
- FI : $\infty - \infty$, $0 \times \infty$, $\frac{\infty}{\infty}$, $\frac{0}{0}$.
- Terme dominant (en $\pm\infty$ seulement), conjuguée, factorisation par $(x - a)$, nombre dérivé, limites trigonométriques.
- En $-\infty$ : $\sqrt{x^2} = -x$.
:::

:::funnel Opérations et formes indéterminées
:::$L$, resume=$R$## Opérations et formes indéterminées — l'essentiel

:::aretenir Les 4 formes indéterminées
$$\infty - \infty, \qquad 0 \times \infty, \qquad \frac{\infty}{\infty}, \qquad \frac{0}{0}$$
Une FI ne veut pas dire « pas de limite » : il faut **transformer** l'expression.
:::

:::aretenir Les techniques de levée
| Situation | Technique |
| --- | --- |
| Polynôme ou rationnelle en $\pm\infty$ | terme de plus haut degré |
| Différence de racines | quantité conjuguée |
| $\frac{0}{0}$ en $a$, polynômes | factoriser par $(x - a)$ |
| $\frac{0}{0}$ avec $\sin$, $\tan$, $\cos$ | limites trigonométriques |
| $\frac{f(x) - f(a)}{x - a}$ | nombre dérivé $f'(a)$ |
:::

:::attention Les 3 pièges du BAC
1. Utiliser le terme dominant pour une limite en un réel $a$ (il ne vaut qu'en $\pm\infty$).
2. Oublier que $\sqrt{x^2} = |x|$ : en $-\infty$, $\sqrt{x^2} = -x$.
3. Écrire $\frac{\infty}{\infty} = 1$ ou $\infty - \infty = 0$.
:::$R$, objectives=$O$Appliquer les règles de calcul sur les limites (somme, produit, quotient).
Reconnaître les quatre formes indéterminées.
Lever une indétermination par factorisation, quantité conjuguée ou limite usuelle.
Calculer la limite d'un polynôme ou d'une fonction rationnelle en l'infini.$O$, difficulty=2, duration_min=50, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='limites' and l.position=2;

update lessons l set title=$T$Comparaison & fonction composée$T$, kind='cours', body=$L$## Théorèmes de comparaison

:::theoreme Comparaison vers l'infini
Soient $f$ et $g$ définies au voisinage de $a$ ($a$ réel ou infini).
- Si $f(x) \geqslant g(x)$ au voisinage de $a$ et $\lim\limits_{x \to a} g(x) = +\infty$, alors $\lim\limits_{x \to a} f(x) = +\infty$.
- Si $f(x) \leqslant g(x)$ au voisinage de $a$ et $\lim\limits_{x \to a} g(x) = -\infty$, alors $\lim\limits_{x \to a} f(x) = -\infty$.
:::

:::exemple
Pour $x > 0$ : $x + \cos x \geqslant x - 1$, et $x - 1 \to +\infty$, donc $\lim\limits_{x \to +\infty} (x + \cos x) = +\infty$.
:::

:::theoreme Théorème d'encadrement (des gendarmes)
Si, au voisinage de $a$, $g(x) \leqslant f(x) \leqslant h(x)$ et $\lim\limits_{x \to a} g(x) = \lim\limits_{x \to a} h(x) = \ell$, alors $\lim\limits_{x \to a} f(x) = \ell$.
:::

[[fig:gendarmes]] Encadrée par deux fonctions de même limite, $f$ partage cette limite.

:::propriete Forme pratique
Si $|f(x) - \ell| \leqslant u(x)$ au voisinage de $a$ et $\lim\limits_{x \to a} u(x) = 0$, alors $\lim\limits_{x \to a} f(x) = \ell$.
:::

:::exemple Fonction bornée multipliée par une fonction qui tend vers $0$
Pour $x \neq 0$ : $\left|x \sin\dfrac{1}{x}\right| \leqslant |x|$, et $|x| \to 0$, donc $\lim\limits_{x \to 0} x \sin\dfrac{1}{x} = 0$. En revanche, $\sin\dfrac{1}{x}$ seul n'a pas de limite en $0$.
:::

:::exemple Partie entière
Pour tout $x$ : $x - 1 < E(x) \leqslant x$. Pour $x > 0$, en divisant par $x$ : $1 - \dfrac{1}{x} < \dfrac{E(x)}{x} \leqslant 1$, donc $\lim\limits_{x \to +\infty} \dfrac{E(x)}{x} = 1$.
:::

## Limite d'une fonction composée

:::theoreme
Soient $a$, $b$, $\ell$ des réels ou des infinis. Si $\lim\limits_{x \to a} u(x) = b$ et $\lim\limits_{y \to b} v(y) = \ell$, alors $\lim\limits_{x \to a} v\big(u(x)\big) = \ell$.
:::

:::methode Changement de variable
1. Repérer la fonction « intérieure » $u(x)$.
2. Poser $y = u(x)$ et calculer la limite $b$ de $y$ quand $x \to a$.
3. Calculer $\lim\limits_{y \to b} v(y)$.
:::

:::exemple
$\lim\limits_{x \to +\infty} \sqrt{\dfrac{9x + 1}{x + 3}}$ : $y = \dfrac{9x + 1}{x + 3} \to 9$ et $\sqrt{y} \to 3$. La limite vaut $3$.
:::

:::exemple Changement de variable trigonométrique
$\lim\limits_{x \to +\infty} x \sin\dfrac{1}{x}$ : on pose $y = \frac{1}{x} \to 0^+$, et $x \sin\frac{1}{x} = \dfrac{\sin y}{y} \to 1$.
:::

:::exemple Avec un décalage
$\lim\limits_{x \to \pi} \dfrac{\sin x}{x - \pi}$ : on pose $h = x - \pi \to 0$. Alors $\sin x = \sin(\pi + h) = -\sin h$, et $\dfrac{-\sin h}{h} \to -1$.
:::

## Passage aux suites

:::propriete Suites $u_n = f(n)$
Si $\lim\limits_{x \to +\infty} f(x) = \ell$, alors la suite $u_n = f(n)$ a la même limite $\ell$.
:::

:::propriete Suites $f(u_n)$
Si $\lim u_n = a$ et $\lim\limits_{x \to a} f(x) = \ell$, alors $\lim f(u_n) = \ell$.
:::

:::attention La réciproque est fausse
$\sin(n\pi) = 0$ pour tout entier $n$, donc la suite tend vers $0$, alors que $\sin x$ n'a pas de limite en $+\infty$. Une suite ne « voit » la fonction qu'aux entiers.
:::

:::app Applique
Détermine $\lim\limits_{x \to +\infty} \dfrac{2x + \sin x}{x + 1}$ et $\lim\limits_{n \to +\infty} n\left(1 - \cos\dfrac{1}{n}\right)$.
:::solution Correction
**1.** $\dfrac{2x + \sin x}{x + 1} = \dfrac{2 + \frac{\sin x}{x}}{1 + \frac{1}{x}}$. Comme $\left|\frac{\sin x}{x}\right| \leqslant \frac{1}{x} \to 0$, la limite vaut $2$.

**2.** On pose $y = \frac{1}{n} \to 0$ : $n(1 - \cos\frac{1}{n}) = \dfrac{1 - \cos y}{y} = y \times \dfrac{1 - \cos y}{y^2} \to 0 \times \frac{1}{2} = 0$.
:::
:::

:::app Applique — encadrement
Soit $f(x) = \dfrac{x + 2\sin x}{x - \cos x}$ pour $x > 1$. Montre que $\lim\limits_{x \to +\infty} f(x) = 1$.
:::solution Correction
Pour $x > 1$ : $x - 2 \leqslant x + 2\sin x \leqslant x + 2$ et $0 < x - 1 \leqslant x - \cos x \leqslant x + 1$. Donc, pour $x > 2$ (numérateur positif) :
$$\frac{x - 2}{x + 1} \leqslant f(x) \leqslant \frac{x + 2}{x - 1}.$$
Les deux bornes tendent vers $1$ : par les gendarmes, $\lim\limits_{x \to +\infty} f(x) = 1$.
:::
:::

:::aretenir
- Minorer par une fonction qui tend vers $+\infty$ ; encadrer par deux fonctions de même limite.
- Fonction bornée $\times$ fonction qui tend vers $0$ $\to 0$.
- Composée : poser $y = u(x)$, calculer la limite de $y$, conclure.
- Les fonctions donnent les limites des suites $f(n)$ et $f(u_n)$, pas l'inverse.
:::

:::funnel Comparaison et fonction composée
:::$L$, resume=$R$## Comparaison et composée — l'essentiel

:::aretenir Comparaison et encadrement
- $f \geqslant g$ et $g \to +\infty$ $\Rightarrow$ $f \to +\infty$.
- $f \leqslant g$ et $g \to -\infty$ $\Rightarrow$ $f \to -\infty$.
- $g \leqslant f \leqslant h$ et $g, h \to \ell$ $\Rightarrow$ $f \to \ell$.
- $|f(x) - \ell| \leqslant u(x)$ et $u \to 0$ $\Rightarrow$ $f \to \ell$.
:::

:::aretenir Composée
$u(x) \to b$ quand $x \to a$, et $v(y) \to \ell$ quand $y \to b$ $\Rightarrow$ $v(u(x)) \to \ell$.
Réflexe : poser $y = u(x)$ et se ramener à une limite connue.
:::

:::attention Les 3 pièges du BAC
1. Encadrer par deux fonctions de limites différentes et conclure quand même.
2. Changer de variable sans recalculer la limite de la nouvelle variable.
3. Croire qu'une fonction bornée a une limite.
:::$R$, objectives=$O$Appliquer les théorèmes de comparaison pour obtenir une limite infinie.
Utiliser le théorème d'encadrement, en particulier avec des fonctions bornées.
Calculer la limite d'une fonction composée par changement de variable.
Passer des limites de fonctions aux limites de suites $u_n = f(n)$ et $f(u_n)$.$O$, difficulty=2, duration_min=45, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='limites' and l.position=3;

update lessons l set title=$T$Continuité & prolongement$T$, kind='cours', body=$L$## Continuité en un point

:::definition
Soit $f$ définie sur un intervalle ouvert contenant $a$. On dit que $f$ est **continue** en $a$ si $\lim\limits_{x \to a} f(x) = f(a)$.
:::

Graphiquement, la courbe de $f$ se trace « sans lever le crayon » au voisinage de $a$ : il n'y a ni saut ni trou.

:::definition Continuité à gauche et à droite
$f$ est **continue à droite** en $a$ si $\lim\limits_{x \to a^+} f(x) = f(a)$, **continue à gauche** si $\lim\limits_{x \to a^-} f(x) = f(a)$.
:::

:::propriete
$f$ est continue en $a$ si et seulement si elle est continue à gauche et à droite en $a$.
:::

:::methode Fonction définie par morceaux
Pour $f(x) = g(x)$ si $x < a$ et $f(x) = h(x)$ si $x \geqslant a$ :
1. Calculer $f(a) = h(a)$.
2. Calculer $\lim\limits_{x \to a^-} g(x)$ et $\lim\limits_{x \to a^+} h(x)$.
3. $f$ est continue en $a$ si et seulement si les trois valeurs sont égales.
:::

:::exemple Déterminer un paramètre
Soit $f(x) = \dfrac{\sin(3x)}{x}$ pour $x < 0$ et $f(x) = x^2 + m$ pour $x \geqslant 0$. À gauche : $\dfrac{\sin(3x)}{x} = 3 \cdot \dfrac{\sin(3x)}{3x} \to 3$. À droite et en $0$ : $f(0) = m$. $f$ est continue en $0$ si et seulement si $m = 3$.
:::

:::exemple Partie entière
$E$ est continue à droite en tout entier $n$ ($E(n) = n = \lim\limits_{x \to n^+} E(x)$) mais pas à gauche ($\lim\limits_{x \to n^-} E(x) = n - 1$). Elle est continue sur chaque intervalle $[n ; n + 1[$, mais discontinue en chaque entier.
:::

## Continuité sur un intervalle

:::definition
$f$ est continue sur un intervalle ouvert $I$ si elle est continue en tout point de $I$. Sur $[a ; b]$, on demande en outre la continuité à droite en $a$ et à gauche en $b$.
:::

## Opérations et fonctions usuelles

:::propriete Opérations
Si $f$ et $g$ sont continues sur $I$, alors $f + g$, $\lambda f$, $f g$ sont continues sur $I$, et $\dfrac{f}{g}$ est continue en tout point où $g$ ne s'annule pas. Si $f$ est continue sur $I$ et $g$ continue sur un intervalle $J$ contenant $f(I)$, alors $g \circ f$ est continue sur $I$.
:::

:::aretenir Fonctions usuelles continues
- Les polynômes sur $\mathbb{R}$ ; les fonctions rationnelles sur chaque intervalle de leur domaine.
- $x \mapsto \sqrt{x}$ sur $[0 ; +\infty[$ ; $x \mapsto \sqrt[n]{x}$ sur $[0 ; +\infty[$.
- $\sin$ et $\cos$ sur $\mathbb{R}$ ; $\tan$ sur chaque intervalle $\left]-\frac{\pi}{2} + k\pi ; \frac{\pi}{2} + k\pi\right[$.
- $x \mapsto |x|$ sur $\mathbb{R}$.
:::

:::exemple
$f(x) = \sqrt{\dfrac{x^2 + 1}{x - 2}}$ est la composée de $x \mapsto \dfrac{x^2+1}{x-2}$, continue sur $]2 ; +\infty[$ et strictement positive, et de la racine, continue sur $[0 ; +\infty[$ : $f$ est continue sur $]2 ; +\infty[$.
:::

## Prolongement par continuité

:::definition
Soit $f$ définie au voisinage de $a$ mais pas en $a$. Si $\lim\limits_{x \to a} f(x) = \ell$ avec $\ell$ **réel**, la fonction
$$\tilde f(x) = \begin{cases} f(x) & \text{si } x \neq a \\ \ell & \text{si } x = a \end{cases}$$
est continue en $a$ : c'est le **prolongement par continuité** de $f$ en $a$.
:::

:::exemple
$f(x) = \dfrac{1 - \cos x}{x^2}$ n'est pas définie en $0$, mais $\lim\limits_{x \to 0} f(x) = \frac{1}{2}$. On la prolonge par $\tilde f(0) = \frac{1}{2}$.
:::

:::attention
Le prolongement exige une limite **finie**, et la même à gauche et à droite. $\frac{1}{x}$ (limite infinie) et $\frac{|x|}{x}$ (limites latérales différentes) ne se prolongent pas en $0$.
:::

:::app Applique
Soit $f(x) = \dfrac{\sqrt{x + 4} - 2}{x}$ pour $x \in [-4 ; 0[ \cup ]0 ; +\infty[$. Montre que $f$ admet un prolongement par continuité en $0$ et donne-le.
:::solution Correction
Conjuguée : $f(x) = \dfrac{(x + 4) - 4}{x(\sqrt{x + 4} + 2)} = \dfrac{1}{\sqrt{x + 4} + 2}$ pour $x \neq 0$. Cette expression tend vers $\dfrac{1}{4}$ quand $x \to 0$. La limite est finie : on pose $\tilde f(0) = \dfrac{1}{4}$, et $\tilde f$ est continue en $0$.
:::
:::

:::app Applique — continuité et paramètres
Soit $f(x) = \dfrac{\sqrt{1 + x} - 1}{x}$ si $x > 0$, $f(0) = b$ et $f(x) = ax + \dfrac{1}{2}$ si $x < 0$. Pour quelles valeurs de $a$ et $b$ la fonction $f$ est-elle continue en $0$ ?
:::solution Correction
À droite : $\dfrac{\sqrt{1 + x} - 1}{x} = \dfrac{1}{\sqrt{1 + x} + 1} \to \dfrac{1}{2}$. À gauche : $ax + \dfrac{1}{2} \to \dfrac{1}{2}$, quel que soit $a$. La continuité en $0$ exige $b = \dfrac{1}{2}$ ; le réel $a$ est quelconque.
:::
:::

:::aretenir
- Continue en $a$ : $\lim\limits_{a} f = f(a)$ ; vérifier les deux côtés pour une fonction par morceaux.
- Les opérations et la composition conservent la continuité.
- Prolongement : uniquement si la limite est finie ; on pose $\tilde f(a) = \ell$.
:::

:::funnel Continuité et prolongement
:::$L$, resume=$R$## Continuité — l'essentiel

:::aretenir Définitions
$f$ continue en $a$ $\iff$ $f$ définie en $a$ et $\lim\limits_{x \to a} f(x) = f(a)$.
$f$ continue en $a$ $\iff$ continue à gauche **et** à droite en $a$.
$f$ continue sur $I$ $\iff$ continue en tout point de $I$.
:::

:::aretenir Prolongement par continuité
$a \notin D_f$ et $\lim\limits_{x \to a} f(x) = \ell$ **finie** : on définit $\tilde f(a) = \ell$, et $\tilde f$ est continue en $a$.
:::

:::aretenir Fonctions continues
Polynômes, rationnelles, $\sqrt{\ }$, $\sin$, $\cos$, $\tan$, $|\cdot|$, racine $n$-ième : continues sur tout intervalle de leur domaine. Somme, produit, quotient (dénominateur non nul), composée de fonctions continues : continues.
:::

:::attention Les 3 pièges du BAC
1. Vérifier seulement une limite latérale pour une fonction définie par morceaux.
2. Prolonger alors que la limite est infinie.
3. Oublier que la partie entière est discontinue en chaque entier.
:::$R$, objectives=$O$Définir la continuité en un point, à gauche et à droite, et la vérifier par le calcul.
Étudier la continuité d'une fonction définie par morceaux et déterminer un paramètre.
Construire le prolongement par continuité d'une fonction en un point.
Utiliser les opérations sur les fonctions continues et la continuité des fonctions usuelles.$O$, difficulty=2, duration_min=45, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='limites' and l.position=4;

update lessons l set title=$T$TVI, image d'un intervalle & fonction réciproque$T$, kind='cours', body=$L$## Théorème des valeurs intermédiaires

:::theoreme TVI
Si $f$ est continue sur $[a ; b]$, alors pour tout réel $k$ compris entre $f(a)$ et $f(b)$, il existe au moins un réel $c \in [a ; b]$ tel que $f(c) = k$.
:::

[[fig:tvi]] Toute valeur $k$ comprise entre $f(a)$ et $f(b)$ est atteinte au moins une fois.

:::propriete Corollaire — existence d'une racine
Si $f$ est continue sur $[a ; b]$ et $f(a) \times f(b) < 0$, l'équation $f(x) = 0$ admet au moins une solution dans $]a ; b[$.
:::

:::theoreme Unicité
Si de plus $f$ est **strictement monotone** sur $[a ; b]$, cette solution est **unique**.
:::

:::methode Montrer que $f(x) = 0$ a une unique solution $\alpha$ dans $]a ; b[$
1. $f$ est continue sur $[a ; b]$ (justifier : opérations sur des fonctions continues).
2. $f$ est strictement monotone sur $[a ; b]$ (signe de $f'$).
3. $f(a) \times f(b) < 0$.
4. Conclure : par le TVI et la stricte monotonie, il existe un unique $\alpha \in ]a ; b[$ tel que $f(\alpha) = 0$.
:::

:::exemple
$g(x) = x^3 + 3x - 5$ sur $[1 ; 2]$ : $g$ est un polynôme, donc continue ; $g'(x) = 3x^2 + 3 > 0$, donc $g$ est strictement croissante ; $g(1) = -1 < 0$ et $g(2) = 9 > 0$. L'équation $g(x) = 0$ a une unique solution $\alpha \in ]1 ; 2[$.
:::

:::attention
Sans continuité, le TVI tombe : $E(x)$ vaut $0$ en $0{,}5$ et $1$ en $1{,}5$, mais ne prend jamais la valeur $0{,}5$.
:::

## Image d'un intervalle et d'un segment

:::theoreme
L'image d'un intervalle par une fonction continue est un intervalle. L'image d'un segment $[a ; b]$ par une fonction continue est un segment $[m ; M]$ : $f$ est bornée sur $[a ; b]$ et y atteint ses bornes.
:::

:::propriete Fonction continue et strictement monotone
| Intervalle $I$ | $f$ strictement croissante | $f$ strictement décroissante |
| --- | --- | --- |
| $[a ; b]$ | $[f(a) ; f(b)]$ | $[f(b) ; f(a)]$ |
| $[a ; b[$ | $\left[f(a) ; \lim\limits_{b^-} f\right[$ | $\left]\lim\limits_{b^-} f ; f(a)\right]$ |
| $]a ; +\infty[$ | $\left]\lim\limits_{a^+} f ; \lim\limits_{+\infty} f\right[$ | $\left]\lim\limits_{+\infty} f ; \lim\limits_{a^+} f\right[$ |
:::

:::exemple
$f(x) = \dfrac{x}{x + 1}$ sur $[0 ; +\infty[$ : $f'(x) = \dfrac{1}{(x+1)^2} > 0$, $f(0) = 0$ et $\lim\limits_{+\infty} f = 1$. Donc $f([0 ; +\infty[) = [0 ; 1[$.
:::

## Fonction réciproque

:::theoreme Théorème de la bijection
Si $f$ est continue et strictement monotone sur un intervalle $I$, alors $f$ réalise une bijection de $I$ sur l'intervalle $J = f(I)$. Sa réciproque $f^{-1} : J \to I$ vérifie :
- $f^{-1}$ est continue sur $J$ ;
- $f^{-1}$ est strictement monotone, de même sens que $f$ ;
- pour $x \in I$ et $y \in J$ : $y = f(x) \iff x = f^{-1}(y)$ ;
- les courbes de $f$ et $f^{-1}$ sont symétriques par rapport à la droite $y = x$.
:::

:::methode Expliciter $f^{-1}$
Pour $y \in J$, résoudre l'équation $f(x) = y$ d'inconnue $x \in I$ ; la solution unique est $x = f^{-1}(y)$. Renommer ensuite la variable.
:::

:::exemple
$f(x) = \dfrac{2x - 1}{x + 1}$ sur $I = ]-1 ; +\infty[$ : $f'(x) = \dfrac{3}{(x+1)^2} > 0$, $\lim\limits_{-1^+} f = -\infty$, $\lim\limits_{+\infty} f = 2$, donc $J = ]-\infty ; 2[$. Pour $y \in J$ : $y(x + 1) = 2x - 1 \iff x(y - 2) = -1 - y \iff x = \dfrac{1 + y}{2 - y}$. Donc $f^{-1}(x) = \dfrac{1 + x}{2 - x}$ pour $x < 2$.
:::

## La fonction arctangente

:::definition
La fonction $\tan$ est continue et strictement croissante sur $\left]-\frac{\pi}{2} ; \frac{\pi}{2}\right[$, avec des limites $-\infty$ et $+\infty$ aux bornes. Elle réalise donc une bijection de $\left]-\frac{\pi}{2} ; \frac{\pi}{2}\right[$ sur $\mathbb{R}$. Sa réciproque est la fonction **arctangente**, notée $\arctan$ :
$$y = \arctan x \iff \left(x = \tan y \ \text{ et } \ y \in \left]-\tfrac{\pi}{2} ; \tfrac{\pi}{2}\right[\right).$$
:::

:::propriete
- $\arctan$ est définie, continue et strictement croissante sur $\mathbb{R}$.
- Elle est impaire : $\arctan(-x) = -\arctan x$.
- $\lim\limits_{x \to +\infty} \arctan x = \dfrac{\pi}{2}$ et $\lim\limits_{x \to -\infty} \arctan x = -\dfrac{\pi}{2}$ : deux asymptotes horizontales.
- Valeurs : $\arctan 0 = 0$, $\arctan 1 = \dfrac{\pi}{4}$, $\arctan \sqrt{3} = \dfrac{\pi}{3}$, $\arctan \dfrac{1}{\sqrt{3}} = \dfrac{\pi}{6}$.
- Pour tout $x \in \mathbb{R}$ : $\tan(\arctan x) = x$ ; pour $x \in \left]-\frac{\pi}{2} ; \frac{\pi}{2}\right[$ : $\arctan(\tan x) = x$.
:::

:::propriete Une identité classique
Pour tout $x > 0$ : $\arctan x + \arctan \dfrac{1}{x} = \dfrac{\pi}{2}$ (et $-\dfrac{\pi}{2}$ pour $x < 0$).
:::

:::attention
$\arctan\left(\tan \dfrac{3\pi}{4}\right) = \arctan(-1) = -\dfrac{\pi}{4}$, et non $\dfrac{3\pi}{4}$ : la réponse doit être dans $\left]-\frac{\pi}{2} ; \frac{\pi}{2}\right[$.
:::

:::app Applique
Montre que l'équation $x^3 + x = 1$ admet une unique solution $\alpha$ dans $\mathbb{R}$, puis donne un encadrement de $\alpha$ d'amplitude $0{,}25$.
:::solution Correction
$f(x) = x^3 + x - 1$ est continue sur $\mathbb{R}$ et $f'(x) = 3x^2 + 1 > 0$ : $f$ est strictement croissante, avec $\lim\limits_{-\infty} f = -\infty$ et $\lim\limits_{+\infty} f = +\infty$. Elle réalise une bijection de $\mathbb{R}$ sur $\mathbb{R}$, donc $0$ a un unique antécédent $\alpha$.

$f(0{,}5) = -0{,}375 < 0$ et $f(0{,}75) = 0{,}171875 > 0$, donc $0{,}5 < \alpha < 0{,}75$.
:::
:::

:::aretenir
- TVI : continuité + changement de signe $\Rightarrow$ existence ; + stricte monotonie $\Rightarrow$ unicité.
- Image d'un intervalle par $f$ continue strictement monotone : bornes = images ou limites aux bornes.
- Bijection : $f^{-1}$ continue, même sens de variation, courbe symétrique par rapport à $y = x$.
- $\arctan$ : de $\mathbb{R}$ dans $\left]-\frac{\pi}{2} ; \frac{\pi}{2}\right[$, impaire, croissante.
:::

:::funnel TVI et fonction réciproque
:::$L$, resume=$R$## TVI et fonction réciproque — l'essentiel

:::aretenir Théorème des valeurs intermédiaires
$f$ continue sur $[a ; b]$ : toute valeur $k$ entre $f(a)$ et $f(b)$ est atteinte au moins une fois.
Corollaire : $f$ continue, $f(a)f(b) < 0$ $\Rightarrow$ $f(x) = 0$ a au moins une solution dans $]a ; b[$.
Avec $f$ **strictement monotone** : la solution est **unique**.
:::

:::aretenir Théorème de la bijection
$f$ continue et strictement monotone sur $I$ $\Rightarrow$ $f$ bijection de $I$ sur $J = f(I)$.
$f^{-1}$ est continue, strictement monotone de **même sens**, et $\mathcal{C}_{f^{-1}}$ est symétrique de $\mathcal{C}_f$ par rapport à $y = x$.
:::

:::aretenir La fonction arctangente
$\arctan$ : réciproque de $\tan$ restreinte à $\left]-\frac{\pi}{2} ; \frac{\pi}{2}\right[$. Définie sur $\mathbb{R}$, impaire, strictement croissante, $\lim\limits_{+\infty} \arctan = \frac{\pi}{2}$, $\lim\limits_{-\infty} \arctan = -\frac{\pi}{2}$.
:::

:::attention Les 3 pièges du BAC
1. Conclure à l'unicité sans stricte monotonie.
2. Oublier la continuité dans l'hypothèse du TVI.
3. Écrire $\arctan(\tan x) = x$ pour tout $x$ : vrai seulement si $x \in \left]-\frac{\pi}{2} ; \frac{\pi}{2}\right[$.
:::$R$, objectives=$O$Énoncer et appliquer le théorème des valeurs intermédiaires et son corollaire.
Démontrer qu'une équation admet une unique solution dans un intervalle.
Déterminer l'image d'un intervalle par une fonction continue et strictement monotone.
Établir qu'une fonction réalise une bijection, étudier sa réciproque et tracer sa courbe.
Connaître la fonction arctangente et ses propriétés.$O$, difficulty=3, duration_min=60, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='limites' and l.position=5;

update lessons l set title=$T$Fiche de révision — tout le chapitre$T$, kind='resume', body=$L$:::aretenir Limites usuelles
$x^n \to +\infty$ en $+\infty$ ; $\dfrac{1}{x^n} \to 0$ en $\pm\infty$ ; $\dfrac{1}{x} \to \pm\infty$ en $0^\pm$.
Trigonométrie en $0$ : $\dfrac{\sin x}{x} \to 1$, $\dfrac{\tan x}{x} \to 1$, $\dfrac{1 - \cos x}{x^2} \to \dfrac{1}{2}$.
$\arctan x \to \pm\dfrac{\pi}{2}$ en $\pm\infty$.
:::

:::attention Formes indéterminées
$\infty - \infty$, $0 \times \infty$, $\dfrac{\infty}{\infty}$, $\dfrac{0}{0}$ : toujours transformer avant de conclure.
:::

:::methode Lever une FI
Rationnelle en $\pm\infty$ : terme dominant. Racines : conjuguée (et $\sqrt{x^2} = |x|$). $\frac{0}{0}$ en $a$ : factoriser par $(x - a)$ ou reconnaître un nombre dérivé. Trigonométrie : limites usuelles après changement de variable.
:::

:::aretenir Comparaison, composée
Minoration par une fonction qui tend vers $+\infty$ ; gendarmes ; bornée $\times$ tend vers $0$ $= 0$. Composée : poser $y = u(x)$.
:::

:::aretenir Continuité
Continue en $a$ : $\lim\limits_{a} f = f(a)$. Par morceaux : comparer les deux limites latérales et $f(a)$. Prolongement si limite **finie**.
:::

:::aretenir TVI et bijection
Continue et $f(a)f(b) < 0$ $\Rightarrow$ une racine ; strictement monotone $\Rightarrow$ unique. Image d'un segment par une fonction continue : un segment. Continue et strictement monotone $\Rightarrow$ bijection, $f^{-1}$ continue de même sens, courbes symétriques par rapport à $y = x$.
:::

:::aretenir Racine $n$-ième
$\sqrt[n]{x}$ : réciproque de $x^n$ sur $[0 ; +\infty[$. $x^{p/q} = \sqrt[q]{x^p}$ pour $x > 0$ ; mêmes règles que les puissances entières.
:::$L$, resume=null, objectives=null, difficulty=1, duration_min=15, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='limites' and l.position=6;

update lessons l set title=$T$Méthodes & exercices types$T$, kind='cours', body=$L$## Comment lire cette notion

Les questions de limites et de continuité ouvrent presque tous les problèmes d'analyse du BAC SM. Elles rapportent des points rapides à condition de connaître le réflexe et la rédaction attendue.

## Formes indéterminées : les techniques

:::methode $\frac{0}{0}$ avec une racine en un point
Multiplier par la quantité conjuguée, puis simplifier par $(x - a)$.
:::

:::exemple
$$\lim_{x \to 3} \frac{\sqrt{x + 1} - 2}{x - 3} = \lim_{x \to 3} \frac{(x + 1) - 4}{(x - 3)(\sqrt{x + 1} + 2)} = \lim_{x \to 3} \frac{1}{\sqrt{x + 1} + 2} = \frac{1}{4}.$$
:::

:::methode Limites trigonométriques combinées
Faire apparaître $\dfrac{\sin u}{u}$, $\dfrac{\tan u}{u}$ ou $\dfrac{1 - \cos u}{u^2}$ par factorisation, en adaptant les coefficients.
:::

:::exemple
$$\lim_{x \to 0} \frac{\tan x - \sin x}{x^3} = \lim_{x \to 0} \frac{\sin x\,(1 - \cos x)}{x^3 \cos x} = \lim_{x \to 0} \frac{\sin x}{x} \cdot \frac{1 - \cos x}{x^2} \cdot \frac{1}{\cos x} = 1 \cdot \frac{1}{2} \cdot 1 = \frac{1}{2}.$$
:::

:::methode Racine $n$-ième : la conjuguée généralisée
Pour $\sqrt[3]{A} - \sqrt[3]{B}$, utiliser $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$ avec $a = \sqrt[3]{A}$, $b = \sqrt[3]{B}$.
:::

:::exemple
$$\lim_{x \to 1} \frac{\sqrt[3]{x} - 1}{x - 1} = \lim_{x \to 1} \frac{\sqrt[3]{x} - 1}{(\sqrt[3]{x} - 1)(\sqrt[3]{x^2} + \sqrt[3]{x} + 1)} = \frac{1}{3}.$$
:::

:::app FI conjuguée
Calcule $\lim\limits_{x \to 2} \dfrac{\sqrt{x + 2} - 2}{x - 2}$.
:::solution Correction
$\dfrac{\sqrt{x + 2} - 2}{x - 2} = \dfrac{(x + 2) - 4}{(x - 2)(\sqrt{x + 2} + 2)} = \dfrac{1}{\sqrt{x + 2} + 2} \to \dfrac{1}{4}$.
:::
:::

## TVI et encadrement par dichotomie

:::methode Encadrer une solution $\alpha$
Une fois l'existence de $\alpha \in ]a ; b[$ établie avec $f(a) < 0 < f(b)$ :
1. Calculer $f(m)$ avec $m = \frac{a + b}{2}$.
2. Si $f(m) < 0$, alors $\alpha \in ]m ; b[$ ; sinon $\alpha \in ]a ; m[$.
3. Recommencer : l'amplitude est divisée par $2$ à chaque étape. Après $n$ étapes, elle vaut $\dfrac{b - a}{2^n}$.
:::

:::exemple
$g(x) = x^3 + x - 1$, $\alpha \in ]0 ; 1[$. $g(0{,}5) = -0{,}375 < 0$ : $\alpha \in ]0{,}5 ; 1[$. $g(0{,}75) \approx 0{,}17 > 0$ : $\alpha \in ]0{,}5 ; 0{,}75[$. $g(0{,}625) \approx -0{,}13 < 0$ : $\alpha \in ]0{,}625 ; 0{,}75[$, amplitude $0{,}125$.
:::

:::methode Combien d'étapes ?
Pour une amplitude inférieure à $10^{-p}$ en partant de $[a ; b]$, il faut $\dfrac{b - a}{2^n} < 10^{-p}$. Depuis $[0 ; 1]$ et pour $10^{-2}$ : $2^n > 100$, soit $n \geqslant 7$.
:::

:::methode Utiliser $\alpha$ dans la suite d'un problème
La relation $f(\alpha) = 0$ sert à **simplifier** des expressions de $\alpha$. Avec $\alpha^3 + \alpha - 1 = 0$ : $\alpha^3 = 1 - \alpha$, donc $\dfrac{1}{\alpha} = \dfrac{\alpha^3 + \alpha}{\alpha} = \alpha^2 + 1$.
:::

## Continuité d'une fonction par morceaux

:::exemple Traité
Soit $f(x) = \dfrac{x^2 - 1}{x - 1}$ si $x < 1$, $f(1) = 2$, et $f(x) = \dfrac{\sqrt{x} - 1}{x - 1} \times a$ si $x > 1$.

À gauche : $\dfrac{x^2 - 1}{x - 1} = x + 1 \to 2 = f(1)$ : $f$ est continue à gauche en $1$.

À droite : $\dfrac{\sqrt{x} - 1}{x - 1} = \dfrac{1}{\sqrt{x} + 1} \to \dfrac{1}{2}$, donc $f(x) \to \dfrac{a}{2}$. La continuité à droite exige $\dfrac{a}{2} = 2$, soit $a = 4$.
:::

## Étudier une fonction réciproque

:::methode Problème type
1. Montrer que $f$ est continue et strictement monotone sur $I$.
2. Déterminer $J = f(I)$ avec les limites aux bornes.
3. Conclure à la bijection de $I$ sur $J$.
4. Si demandé, expliciter $f^{-1}$ en résolvant $f(x) = y$.
5. Tracer $\mathcal{C}_{f^{-1}}$ par symétrie par rapport à $y = x$.
:::

:::app Applique
Soit $f(x) = x + \sqrt{x}$ sur $[0 ; +\infty[$. Montre que $f$ réalise une bijection de $[0 ; +\infty[$ sur un intervalle à préciser et explicite $f^{-1}$.
:::solution Correction
$f$ est continue (somme de fonctions continues) et strictement croissante (somme de deux fonctions strictement croissantes). $f(0) = 0$ et $\lim\limits_{+\infty} f = +\infty$ : $f$ est une bijection de $[0 ; +\infty[$ sur $[0 ; +\infty[$.

Pour $y \geqslant 0$, on pose $t = \sqrt{x} \geqslant 0$ : $t^2 + t - y = 0$, de solution positive $t = \dfrac{-1 + \sqrt{1 + 4y}}{2}$. Donc $f^{-1}(y) = \left(\dfrac{\sqrt{1 + 4y} - 1}{2}\right)^2$.
:::
:::

:::aretenir
- FI : terme dominant, conjuguée (classique ou cubique), factorisation, limites trigonométriques.
- TVI : continuité, stricte monotonie, signes contraires, « unique ».
- Dichotomie : amplitude $\frac{b - a}{2^n}$ ; utiliser $f(\alpha) = 0$ pour simplifier.
- Par morceaux : limites latérales et valeur au point, puis le paramètre.
:::

:::funnel Méthodes sur les limites et la continuité
:::$L$, resume=$R$## Méthodes sur les limites et la continuité — l'essentiel

:::aretenir L'arbre de décision des FI
| Forme rencontrée | Premier réflexe |
| --- | --- |
| $\frac{\infty}{\infty}$ avec polynômes | termes dominants |
| $\infty - \infty$ avec racines | conjuguée |
| $\frac{0}{0}$ en $a$ avec polynômes | factoriser $(x - a)$ |
| $\frac{0}{0}$ avec $\sin$, $\cos$, $\tan$ | $\frac{\sin u}{u}$, $\frac{1 - \cos u}{u^2}$ |
| $\frac{f(x) - f(a)}{x - a}$ | nombre dérivé |
:::

:::aretenir La rédaction TVI en 4 lignes
Continuité, stricte monotonie, valeurs aux bornes de signes contraires, conclusion « il existe un **unique** $\alpha$ ».
:::

:::attention Les 3 pièges du BAC
1. Rédiger le TVI sans citer la continuité.
2. Donner un encadrement par dichotomie sans vérifier le signe de $f$ au milieu.
3. Oublier les valeurs absolues après une conjuguée en $-\infty$.
:::$R$, objectives=$O$Choisir la bonne technique pour lever une forme indéterminée.
Rédiger une démonstration d'existence et d'unicité de solution avec le TVI.
Encadrer une solution par dichotomie ou par balayage.
Étudier complètement la continuité d'une fonction définie par morceaux.$O$, difficulty=2, duration_min=50, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='limites' and l.position=50;

update lessons l set title=$T$Approfondissement : image d'un intervalle, racine n-ième$T$, kind='cours', body=$L$## Image d'un intervalle par une fonction monotone

:::propriete
Soit $f$ continue et strictement monotone sur un intervalle $I$ d'extrémités $a$ et $b$ (finies ou infinies). Alors $f(I)$ est l'intervalle d'extrémités $\lim\limits_{a} f$ et $\lim\limits_{b} f$ (ou $f(a)$, $f(b)$ si $a$, $b$ sont dans $I$), avec :
- les crochets de $I$ si $f$ est croissante ;
- les crochets échangés si $f$ est décroissante.
:::

:::exemple
$f(x) = \dfrac{1}{x^2 + 1}$ sur $[0 ; +\infty[$ est strictement décroissante, $f(0) = 1$ et $\lim\limits_{+\infty} f = 0$ : $f([0 ; +\infty[) = ]0 ; 1]$.
:::

:::attention
Si $f$ n'est pas monotone, on découpe $I$ selon le tableau de variations : $x^2$ sur $[-1 ; 2]$ donne $[0 ; 4]$, et non $[1 ; 4]$.
:::

:::app Image d'un intervalle
$f(x) = x^2$ sur $[1 ; 3]$ (croissante). Détermine $f([1 ; 3])$ et $f(]1 ; 3[)$.
:::solution Correction
$f$ est continue et strictement croissante sur $[1 ; 3]$ : $f([1 ; 3]) = [1 ; 9]$ et $f(]1 ; 3[) = ]1 ; 9[$.
:::
:::

## Conséquences des limites trigonométriques

:::propriete
Pour tout réel $a \neq 0$ :
$$\lim_{x \to 0} \frac{\sin(ax)}{ax} = 1, \qquad \lim_{x \to 0} \frac{\tan(ax)}{ax} = 1, \qquad \lim_{x \to 0} \frac{1 - \cos(ax)}{(ax)^2} = \frac{1}{2}.$$
:::

:::demonstration
Changement de variable $y = ax \to 0$ dans les limites de référence.
:::

:::exemple
$$\lim_{x \to 0} \frac{1 - \cos(3x)}{x^2} = \lim_{x \to 0} 9 \times \frac{1 - \cos(3x)}{(3x)^2} = \frac{9}{2}.$$
:::

:::app Rapport de sinus
Calcule $\lim\limits_{x \to 0} \dfrac{\sin(5x)}{\sin(3x)}$.
:::solution Correction
$\dfrac{\sin(5x)}{\sin(3x)} = \dfrac{5}{3} \cdot \dfrac{\sin(5x)}{5x} \cdot \dfrac{3x}{\sin(3x)} \to \dfrac{5}{3}$.
:::
:::

## Fonction racine n-ième et puissances rationnelles

:::definition Racine $n$-ième
Soit $n \in \mathbb{N}^*$. La fonction $x \mapsto x^n$ est continue et strictement croissante sur $[0 ; +\infty[$, de $0$ à $+\infty$ : c'est une bijection de $[0 ; +\infty[$ sur lui-même. Sa réciproque est la fonction **racine n-ième**, notée $x \mapsto \sqrt[n]{x}$ :
$$\text{pour } x, y \geqslant 0 : \quad \sqrt[n]{x} = y \iff y^n = x.$$
:::

:::propriete
$\sqrt[n]{\ }$ est continue et strictement croissante sur $[0 ; +\infty[$, avec $\lim\limits_{x \to +\infty} \sqrt[n]{x} = +\infty$. Pour $x, y \geqslant 0$ et $n, m \in \mathbb{N}^*$ :
$$\left(\sqrt[n]{x}\right)^n = x, \qquad \sqrt[n]{x^n} = x, \qquad \sqrt[n]{xy} = \sqrt[n]{x}\,\sqrt[n]{y}, \qquad \sqrt[n]{\sqrt[m]{x}} = \sqrt[nm]{x}.$$
:::

:::definition Puissance rationnelle
Pour $x > 0$ et $r = \dfrac{p}{q}$ avec $p \in \mathbb{Z}$, $q \in \mathbb{N}^*$ : $x^{r} = \sqrt[q]{x^p}$. Les règles $x^r x^{r'} = x^{r + r'}$, $(x^r)^{r'} = x^{rr'}$, $(xy)^r = x^r y^r$ et $x^{-r} = \dfrac{1}{x^r}$ restent valables.
:::

:::exemple
$8^{2/3} = \sqrt[3]{64} = 4$ ; $\;\dfrac{\sqrt[3]{4} \times \sqrt[6]{4}}{\sqrt{2}} = \dfrac{2^{2/3} \times 2^{1/3}}{2^{1/2}} = 2^{1/2} = \sqrt{2}$.
:::

:::methode Résoudre $x^n = a$
- Si $a > 0$ : $x = \sqrt[n]{a}$ si $n$ est impair ; $x = \pm\sqrt[n]{a}$ si $n$ est pair.
- Si $a < 0$ et $n$ impair : $x = -\sqrt[n]{-a}$.
- Si $a < 0$ et $n$ pair : pas de solution réelle.
:::

:::exemple
$x^3 = -27 \iff x = -\sqrt[3]{27} = -3$. $\quad x^4 = 16 \iff x = 2$ ou $x = -2$.
:::

:::propriete Limites utiles
$\lim\limits_{x \to +\infty} \dfrac{\sqrt[n]{x}}{x} = 0$ pour $n \geqslant 2$ ; et pour $a > 0$, $\lim\limits_{x \to a} \dfrac{\sqrt[n]{x} - \sqrt[n]{a}}{x - a} = \dfrac{1}{n\sqrt[n]{a^{n-1}}}$ (dérivée de la racine $n$-ième en $a$).
:::

:::app Puissance rationnelle
Simplifie $A = \dfrac{\sqrt[3]{9} \times \sqrt[3]{3}}{\sqrt[4]{81}}$.
:::solution Correction
$\sqrt[3]{9} \times \sqrt[3]{3} = \sqrt[3]{27} = 3$ et $\sqrt[4]{81} = 3$. Donc $A = 1$.
:::
:::

:::aretenir
- Image : bornes = images ou limites ; crochets selon $I$ et le sens de variation.
- Coefficients : $\frac{\sin(ax)}{x} \to a$, $\frac{1 - \cos(ax)}{x^2} \to \frac{a^2}{2}$.
- $\sqrt[n]{\ }$ : réciproque de $x^n$ sur $[0 ; +\infty[$ ; $x^{p/q} = \sqrt[q]{x^p}$.
:::

:::funnel Image d'un intervalle et racine n-ième
:::$L$, resume=$R$## Approfondissement — l'essentiel

:::aretenir Image par une fonction strictement monotone
Les bornes de $f(I)$ sont les images ou les **limites** de $f$ aux bornes de $I$ ; les crochets suivent ceux de $I$ (inversés si $f$ décroît).
:::

:::aretenir Limites trigonométriques avec coefficient
$$\lim_{x \to 0} \frac{\sin(ax)}{x} = a, \qquad \lim_{x \to 0} \frac{\tan(ax)}{x} = a, \qquad \lim_{x \to 0} \frac{1 - \cos(ax)}{x^2} = \frac{a^2}{2}$$
:::

:::aretenir Racine $n$-ième et puissances rationnelles
Pour $x, y \geqslant 0$ : $\sqrt[n]{x} = y \iff y^n = x$. Pour $x > 0$ : $x^{p/q} = \sqrt[q]{x^p}$.
$\sqrt[n]{xy} = \sqrt[n]{x}\sqrt[n]{y}$, $\sqrt[n]{\sqrt[m]{x}} = \sqrt[nm]{x}$, $\left(\sqrt[n]{x}\right)^n = x$.
:::

:::attention Les 3 pièges du BAC
1. Écrire $\sqrt[n]{x}$ pour $x < 0$ : au programme, la racine $n$-ième n'est définie que sur $[0 ; +\infty[$.
2. Oublier le carré du coefficient dans $\frac{1 - \cos(ax)}{x^2} \to \frac{a^2}{2}$.
3. Fermer un crochet sur une limite : une limite n'est pas atteinte.
:::$R$, objectives=$O$Déterminer l'image d'un intervalle quelconque par une fonction continue et strictement monotone.
Généraliser les limites trigonométriques avec un coefficient.
Définir la fonction racine $n$-ième, connaître ses propriétés et calculer avec des puissances rationnelles.
Résoudre des équations et inéquations faisant intervenir des racines $n$-ièmes.$O$, difficulty=3, duration_min=45, bac_frequency=2
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='limites' and l.position=60;

update lessons l set title=$T$Dénombrement$T$, kind='cours', body=$L$## Principe fondamental

:::theoreme Principe multiplicatif
Si une expérience se déroule en $k$ étapes, avec $n_1$ issues possibles pour la première, $n_2$ pour la deuxième, …, $n_k$ pour la dernière (le nombre d'issues d'une étape ne dépendant pas des choix précédents), alors le nombre total d'issues est
$$n_1 \times n_2 \times \cdots \times n_k.$$
:::

:::propriete Principe additif
Si un ensemble est réuni de parties deux à deux **disjointes**, son cardinal est la somme des cardinaux des parties : $\mathrm{card}(A \cup B) = \mathrm{card}\,A + \mathrm{card}\,B$ si $A \cap B = \varnothing$, et en général $\mathrm{card}(A \cup B) = \mathrm{card}\,A + \mathrm{card}\,B - \mathrm{card}(A \cap B)$.
:::

:::exemple
Un code est formé d'une lettre (parmi $26$) suivie de $3$ chiffres : $26 \times 10^3 = 26\,000$ codes. Si les trois chiffres doivent être distincts : $26 \times 10 \times 9 \times 8 = 18\,720$.
:::

## Permutations, arrangements, combinaisons

:::definition Factorielle et permutations
Pour $n \in \mathbb{N}^*$, $n! = 1 \times 2 \times \cdots \times n$, et $0! = 1$. Une **permutation** de $n$ objets est un rangement de ces $n$ objets : il y en a $n!$.
:::

:::definition Arrangements
Un **arrangement** de $p$ éléments parmi $n$ ($p \leqslant n$) est une liste **ordonnée** de $p$ éléments **distincts**. Leur nombre est
$$A_n^p = n(n - 1)\cdots(n - p + 1) = \frac{n!}{(n - p)!}.$$
:::

:::definition Combinaisons
Une **combinaison** de $p$ éléments parmi $n$ est une partie à $p$ éléments (sans ordre). Leur nombre est
$$C_n^p = \binom{n}{p} = \frac{A_n^p}{p!} = \frac{n!}{p!\,(n - p)!}.$$
:::

:::propriete
$C_n^0 = C_n^n = 1$, $\;C_n^1 = n$, $\;C_n^p = C_n^{n - p}$, $\;C_n^{p} + C_n^{p+1} = C_{n+1}^{p+1}$ (triangle de Pascal).
**Binôme de Newton** : $(a + b)^n = \displaystyle\sum_{p=0}^{n} C_n^p\,a^p b^{n-p}$ ; en particulier $\displaystyle\sum_{p=0}^{n} C_n^p = 2^n$.
:::

:::exemple
$A_5^3 = 5 \times 4 \times 3 = 60$ ; $C_5^3 = \dfrac{60}{3!} = 10$ ; $C_{10}^{8} = C_{10}^{2} = 45$.
:::

## Les trois situations du programme

| On tire $p$ objets parmi $n$… | Modèle | Nombre de tirages |
| --- | --- | --- |
| un par un, **avec remise** | $p$-uplets | $n^p$ |
| un par un, **sans remise** | arrangements | $A_n^p$ |
| **simultanément** | combinaisons | $C_n^p$ |

:::exemple Une urne
Urne de $5$ boules rouges et $3$ noires, on tire $3$ boules.
- Simultanément : $C_8^3 = 56$ tirages ; exactement $2$ rouges : $C_5^2 \times C_3^1 = 10 \times 3 = 30$.
- Successivement sans remise : $A_8^3 = 336$ ; exactement $2$ rouges : $C_3^2 \times A_5^2 \times A_3^1 = 3 \times 20 \times 3 = 180$ (le facteur $C_3^2$ choisit les rangs des rouges).
- Successivement avec remise : $8^3 = 512$ ; exactement $2$ rouges : $C_3^2 \times 5^2 \times 3 = 225$.
:::

## Dénombrer sous contrainte

:::methode
- « **Exactement** $k$ » : choisir les $k$ éléments du type voulu **et** les autres du type contraire, puis multiplier.
- « **Au moins un** » : nombre total moins le nombre de tirages ne contenant **aucun** élément du type voulu.
- « **Au plus** $k$ » : somme des cas « exactement $0$ », …, « exactement $k$ ».
:::

:::exemple
Dans l'urne précédente (tirage simultané de $3$ boules), « au moins une noire » : $C_8^3 - C_5^3 = 56 - 10 = 46$.
:::

:::methode Anagrammes et répétitions
Le nombre de mots formés avec toutes les lettres d'un mot où une lettre apparaît $n_1$ fois, une autre $n_2$ fois, etc. est $\dfrac{n!}{n_1!\,n_2!\cdots}$. Exemple : « BACCALAUREAT » compte $12$ lettres dont $A$ quatre fois et $C$ deux fois : $\dfrac{12!}{4!\,2!}$ anagrammes.
:::

:::app Applique
Un comité de $4$ personnes est choisi parmi $6$ filles et $5$ garçons. Combien de comités comportent au moins une fille ? Exactement deux garçons ?
:::solution Correction
Total : $C_{11}^4 = 330$. Sans fille : $C_5^4 = 5$. Au moins une fille : $330 - 5 = 325$.

Exactement deux garçons : $C_5^2 \times C_6^2 = 10 \times 15 = 150$.
:::
:::

:::aretenir
- Étapes successives : on multiplie ; cas disjoints : on additionne.
- Avec remise $n^p$, sans remise $A_n^p$, simultané $C_n^p$.
- « Au moins un » par l'événement contraire.
:::

:::funnel Dénombrement
:::$L$, resume=$R$## Dénombrement — l'essentiel

:::aretenir Les trois situations de tirage ($p$ éléments parmi $n$)
| Tirage | Ordre | Répétition | Nombre |
| --- | --- | --- | --- |
| successif avec remise | oui | oui | $n^p$ |
| successif sans remise | oui | non | $A_n^p = \dfrac{n!}{(n - p)!}$ |
| simultané | non | non | $C_n^p = \dfrac{n!}{p!(n - p)!}$ |
:::

:::aretenir Formules
$n! = 1 \times 2 \times \cdots \times n$, $0! = 1$. Permutations de $n$ objets : $n!$. $C_n^p = C_n^{n - p}$, $C_n^0 = C_n^n = 1$, $C_n^{p} + C_n^{p+1} = C_{n+1}^{p+1}$.
Anagrammes avec répétitions : $\dfrac{n!}{n_1!\,n_2!\cdots}$.
:::

:::attention Les 3 pièges du BAC
1. Utiliser $A_n^p$ pour un tirage simultané (l'ordre ne compte pas).
2. « Au moins un » : passer par l'événement contraire « aucun ».
3. Additionner au lieu de multiplier (ou l'inverse) : « et » successifs multiplient, cas disjoints s'additionnent.
:::$R$, objectives=$O$Utiliser le principe fondamental du dénombrement (principe multiplicatif).
Reconnaître la situation de tirage : successif avec remise, successif sans remise, simultané.
Calculer avec les factorielles, les arrangements $A_n^p$ et les combinaisons $C_n^p$.
Dénombrer sous contrainte (« au moins », « exactement », « au plus »).$O$, difficulty=2, duration_min=50, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='proba' and l.position=1;

update lessons l set title=$T$Probabilités, conditionnement, indépendance$T$, kind='cours', body=$L$## Vocabulaire et probabilité

:::definition
- L'**univers** $\Omega$ est l'ensemble des issues d'une expérience aléatoire.
- Un **événement** est une partie de $\Omega$ ; un événement **élémentaire** contient une seule issue.
- $A \cap B$ : « $A$ et $B$ » ; $A \cup B$ : « $A$ ou $B$ » ; $\bar A$ : contraire de $A$.
- $A$ et $B$ sont **incompatibles** si $A \cap B = \varnothing$.
:::

:::propriete Règles de calcul
$0 \leqslant P(A) \leqslant 1$, $P(\Omega) = 1$, $P(\varnothing) = 0$,
$$P(\bar A) = 1 - P(A), \qquad P(A \cup B) = P(A) + P(B) - P(A \cap B).$$
:::

:::propriete Équiprobabilité
Si toutes les issues ont la même probabilité : $P(A) = \dfrac{\mathrm{card}\,A}{\mathrm{card}\,\Omega}$ (« cas favorables sur cas possibles »).
:::

:::exemple
On tire simultanément $2$ cartes d'un jeu de $32$ (dont $4$ as). $P(\text{deux as}) = \dfrac{C_4^2}{C_{32}^2} = \dfrac{6}{496} = \dfrac{3}{248}$. $P(\text{au moins un as}) = 1 - \dfrac{C_{28}^2}{C_{32}^2} = 1 - \dfrac{378}{496} = \dfrac{59}{248}$.
:::

## Probabilité conditionnelle et indépendance

:::definition Probabilité conditionnelle
Soit $B$ tel que $P(B) \neq 0$. La probabilité de $A$ **sachant** $B$ est
$$P_B(A) = \frac{P(A \cap B)}{P(B)}.$$
On en déduit la **formule des probabilités composées** : $P(A \cap B) = P(B) \times P_B(A)$.
:::

:::methode L'arbre pondéré
- La somme des probabilités issues d'un même nœud vaut $1$.
- La probabilité d'un chemin est le **produit** des probabilités de ses branches.
- La probabilité d'un événement est la **somme** des probabilités des chemins qui y mènent.
:::

:::theoreme Formule des probabilités totales
Si $B_1, \ldots, B_n$ forment une **partition** de $\Omega$ (deux à deux incompatibles, de réunion $\Omega$, de probabilités non nulles) :
$$P(A) = \sum_{i=1}^{n} P(B_i)\,P_{B_i}(A).$$
:::

:::exemple
Une usine a deux machines : $M_1$ produit $60\,\%$ des pièces avec $2\,\%$ de défauts, $M_2$ produit $40\,\%$ avec $5\,\%$ de défauts. $P(D) = 0{,}6 \times 0{,}02 + 0{,}4 \times 0{,}05 = 0{,}032$. Sachant qu'une pièce est défectueuse, $P_D(M_1) = \dfrac{0{,}012}{0{,}032} = 0{,}375$.
:::

:::definition Indépendance
$A$ et $B$ sont **indépendants** si $P(A \cap B) = P(A) \times P(B)$. Si $P(B) \neq 0$, cela équivaut à $P_B(A) = P(A)$ : savoir que $B$ est réalisé ne change pas la probabilité de $A$.
:::

:::propriete
Si $A$ et $B$ sont indépendants, alors $\bar A$ et $B$, $A$ et $\bar B$, $\bar A$ et $\bar B$ le sont aussi. Des épreuves répétées dans les mêmes conditions (tirages avec remise, lancers successifs) sont indépendantes.
:::

:::attention Incompatibles n'est pas indépendants
Si $A$ et $B$ sont incompatibles avec $P(A) > 0$ et $P(B) > 0$, alors $P(A \cap B) = 0 \neq P(A)P(B)$ : ils ne sont **pas** indépendants.
:::

:::app Applique
On lance un dé équilibré. $A$ : « le résultat est pair », $B$ : « le résultat est inférieur ou égal à $4$ ». $A$ et $B$ sont-ils indépendants ?
:::solution Correction
$P(A) = \frac{1}{2}$, $P(B) = \frac{4}{6} = \frac{2}{3}$, $A \cap B = \{2, 4\}$ donc $P(A \cap B) = \frac{1}{3}$. Or $P(A)P(B) = \frac{1}{2} \times \frac{2}{3} = \frac{1}{3}$ : $A$ et $B$ sont indépendants.
:::
:::

:::app Arbre pondéré
Dans un lycée, $40\,\%$ des élèves sont en SM et $60\,\%$ en PC. $70\,\%$ des élèves de SM et $45\,\%$ des élèves de PC font du sport. On choisit un élève au hasard. Calcule la probabilité qu'il fasse du sport, puis la probabilité qu'il soit en SM sachant qu'il fait du sport.
:::solution Correction
$P(S) = 0{,}4 \times 0{,}7 + 0{,}6 \times 0{,}45 = 0{,}28 + 0{,}27 = 0{,}55$.

$P_S(SM) = \dfrac{P(SM \cap S)}{P(S)} = \dfrac{0{,}28}{0{,}55} = \dfrac{28}{55} \approx 0{,}51$.
:::
:::

:::aretenir
- $P(\bar A) = 1 - P(A)$ ; équiprobabilité : favorables sur possibles.
- $P_B(A) = \frac{P(A \cap B)}{P(B)}$ ; arbre : produit le long d'un chemin, somme des chemins.
- Probabilités totales sur une partition.
- Indépendants : $P(A \cap B) = P(A)P(B)$ ; incompatibles est une autre notion.
:::

:::funnel Probabilités, conditionnement, indépendance
:::$L$, resume=$R$## Probabilités — l'essentiel

:::aretenir Règles
$P(\bar A) = 1 - P(A)$ ; $P(A \cup B) = P(A) + P(B) - P(A \cap B)$. Équiprobabilité : $P(A) = \dfrac{\mathrm{card}\,A}{\mathrm{card}\,\Omega}$.
:::

:::aretenir Conditionnement
$P_B(A) = \dfrac{P(A \cap B)}{P(B)}$ ; $\;P(A \cap B) = P(B)P_B(A)$.
Probabilités totales : si $B_1, \ldots, B_n$ partitionnent $\Omega$, $P(A) = \sum P(B_i)P_{B_i}(A)$.
:::

:::aretenir Indépendance
$A$ et $B$ indépendants $\iff P(A \cap B) = P(A)P(B)$ $\iff P_B(A) = P(A)$ (si $P(B) \neq 0$).
:::

:::attention Les 3 pièges du BAC
1. Confondre $P_B(A)$ et $P_A(B)$.
2. Confondre incompatibles ($A \cap B = \varnothing$) et indépendants.
3. Oublier une branche dans la formule des probabilités totales.
:::$R$, objectives=$O$Modéliser une expérience aléatoire : univers, événements, opérations sur les événements.
Calculer une probabilité en situation d'équiprobabilité.
Calculer et interpréter une probabilité conditionnelle, construire un arbre pondéré.
Appliquer la formule des probabilités totales.
Reconnaître et utiliser l'indépendance de deux événements ou d'épreuves.$O$, difficulty=2, duration_min=55, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='proba' and l.position=2;

update lessons l set title=$T$Variables aléatoires et loi binomiale$T$, kind='cours', body=$L$## Variable aléatoire

:::definition
Une **variable aléatoire** $X$ sur $\Omega$ (fini) est une fonction qui associe un réel à chaque issue. Si $X(\Omega) = \{x_1, \ldots, x_n\}$, la **loi de probabilité** de $X$ est la donnée des $p_i = P(X = x_i)$, avec $\sum p_i = 1$.
:::

:::exemple
On lance deux pièces ; $X$ = nombre de « pile ». $X(\Omega) = \{0, 1, 2\}$, avec $P(X = 0) = \frac{1}{4}$, $P(X = 1) = \frac{1}{2}$, $P(X = 2) = \frac{1}{4}$.
:::

## Espérance, variance, écart-type

:::definition
$$E(X) = \sum_{i=1}^{n} x_i\,p_i, \qquad V(X) = \sum_{i=1}^{n} p_i\,\big(x_i - E(X)\big)^2 = E(X^2) - E(X)^2, \qquad \sigma(X) = \sqrt{V(X)}.$$
L'espérance est la valeur moyenne de $X$ sur un grand nombre de répétitions ; la variance et l'écart-type mesurent la dispersion autour de cette moyenne.
:::

:::propriete Linéarité
Pour des réels $a$, $b$ : $E(aX + b) = aE(X) + b$ et $V(aX + b) = a^2\,V(X)$, donc $\sigma(aX + b) = |a|\,\sigma(X)$.
:::

:::exemple Un jeu
On mise $2$ DH et on lance un dé : on gagne $10$ DH si le $6$ sort, rien sinon. Gain algébrique $G$ : $G = 8$ avec probabilité $\frac{1}{6}$, $G = -2$ avec probabilité $\frac{5}{6}$. $E(G) = \frac{8}{6} - \frac{10}{6} = -\frac{1}{3}$ : le jeu est défavorable au joueur.
:::

## Fonction de répartition

:::definition
La **fonction de répartition** de $X$ est la fonction $F$ définie sur $\mathbb{R}$ par $F(x) = P(X \leqslant x)$.
:::

:::propriete
Si $x_1 < x_2 < \cdots < x_n$ sont les valeurs de $X$ :
- $F(x) = 0$ pour $x < x_1$ et $F(x) = 1$ pour $x \geqslant x_n$ ;
- $F(x) = p_1 + \cdots + p_k$ pour $x_k \leqslant x < x_{k+1}$ ;
- $F$ est croissante, en escalier, et fait un saut de hauteur $p_k$ en $x_k$.

On a $P(a < X \leqslant b) = F(b) - F(a)$.
:::

:::exemple
Pour le nombre de « pile » en deux lancers : $F(x) = 0$ si $x < 0$ ; $\frac{1}{4}$ si $0 \leqslant x < 1$ ; $\frac{3}{4}$ si $1 \leqslant x < 2$ ; $1$ si $x \geqslant 2$.
:::

## Épreuve de Bernoulli

:::definition
Une **épreuve de Bernoulli** de paramètre $p$ a deux issues : succès (probabilité $p$) et échec (probabilité $1 - p$). Un **schéma de Bernoulli** est la répétition de $n$ épreuves de Bernoulli identiques et **indépendantes**.
:::

## Loi binomiale

:::theoreme
Dans un schéma de Bernoulli de paramètres $n$ et $p$, la variable $X$ égale au nombre de succès suit la **loi binomiale** $\mathcal{B}(n, p)$ :
$$P(X = k) = C_n^k\,p^k\,(1 - p)^{n - k}, \qquad k \in \{0, 1, \ldots, n\}.$$
De plus $E(X) = np$ et $V(X) = np(1 - p)$.
:::

:::demonstration Formule de $P(X = k)$
Une issue avec exactement $k$ succès est un chemin de l'arbre comportant $k$ succès et $n - k$ échecs : par indépendance, sa probabilité vaut $p^k(1 - p)^{n - k}$. Il y a $C_n^k$ façons de placer les $k$ succès parmi les $n$ épreuves.
:::

:::methode Justifier une loi binomiale
1. Identifier l'épreuve et le **succès**, et sa probabilité $p$.
2. Justifier la répétition de $n$ épreuves **identiques et indépendantes** (tirages avec remise, lancers…).
3. Conclure : $X$ = nombre de succès suit $\mathcal{B}(n, p)$.
:::

:::exemple
On lance $5$ fois un dé ; $X$ = nombre de $6$. $X \sim \mathcal{B}\left(5, \frac{1}{6}\right)$. $P(X = 2) = C_5^2\left(\frac{1}{6}\right)^2\left(\frac{5}{6}\right)^3 = 10 \times \frac{125}{7776} = \frac{1250}{7776} \approx 0{,}161$. $E(X) = \frac{5}{6}$.
:::

:::app Applique
Un QCM comporte $10$ questions à $4$ propositions dont une seule est juste. Un candidat répond au hasard. Calcule la probabilité qu'il obtienne au moins une bonne réponse, puis l'espérance du nombre de bonnes réponses.
:::solution Correction
$X \sim \mathcal{B}\left(10, \frac{1}{4}\right)$ (réponses indépendantes, même probabilité de succès).

$P(X \geqslant 1) = 1 - P(X = 0) = 1 - \left(\frac{3}{4}\right)^{10} \approx 1 - 0{,}056 = 0{,}944$.

$E(X) = 10 \times \frac{1}{4} = 2{,}5$.
:::
:::

:::aretenir
- Loi de $X$ : valeurs et probabilités, de somme $1$.
- $E(X) = \sum x_ip_i$, $V(X) = E(X^2) - E(X)^2$.
- $F(x) = P(X \leqslant x)$, fonction en escalier.
- $\mathcal{B}(n, p)$ : $C_n^kp^k(1 - p)^{n - k}$, $E = np$, $V = np(1 - p)$.
:::

:::funnel Variables aléatoires et loi binomiale
:::$L$, resume=$R$## Variables aléatoires — l'essentiel

:::aretenir Loi, espérance, variance
Loi : les couples $(x_i, p_i)$ avec $\sum p_i = 1$.
$E(X) = \sum x_ip_i$ ; $\;V(X) = E(X^2) - E(X)^2$ ; $\;\sigma(X) = \sqrt{V(X)}$.
$E(aX + b) = aE(X) + b$ ; $\;V(aX + b) = a^2V(X)$.
:::

:::aretenir Fonction de répartition
$F(x) = P(X \leqslant x)$ : en escalier, croissante, de $0$ à $1$, sauts de hauteur $p_i$ en chaque $x_i$.
:::

:::aretenir Loi binomiale $\mathcal{B}(n, p)$
$n$ épreuves de Bernoulli identiques et indépendantes, $X$ = nombre de succès.
$P(X = k) = C_n^k\,p^k(1 - p)^{n - k}$, $\;E(X) = np$, $\;V(X) = np(1 - p)$.
:::

:::attention Les 3 pièges du BAC
1. Oublier de vérifier que la somme des probabilités vaut $1$.
2. Appliquer la loi binomiale à des tirages **sans remise**.
3. Écrire $V(aX + b) = aV(X) + b$.
:::$R$, objectives=$O$Déterminer la loi de probabilité d'une variable aléatoire discrète.
Calculer l'espérance, la variance et l'écart-type d'une variable aléatoire.
Construire et exploiter la fonction de répartition.
Reconnaître un schéma de Bernoulli et la loi binomiale $\mathcal{B}(n, p)$, et calculer ses probabilités.$O$, difficulty=2, duration_min=55, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='proba' and l.position=3;

update lessons l set title=$T$Fiche de révision — Probabilités$T$, kind='resume', body=$L$:::aretenir Dénombrement
Avec remise $n^p$ ; sans remise $A_n^p = \frac{n!}{(n - p)!}$ ; simultané $C_n^p = \frac{n!}{p!(n - p)!}$. Permutations $n!$. « Au moins un » : par le contraire.
:::

:::aretenir Probabilités
$P(\bar A) = 1 - P(A)$, $P(A \cup B) = P(A) + P(B) - P(A \cap B)$. $P_B(A) = \frac{P(A \cap B)}{P(B)}$. Totales : $P(A) = \sum P(B_i)P_{B_i}(A)$. Bayes : $P_A(B) = \frac{P(B)P_B(A)}{P(A)}$.
Indépendance : $P(A \cap B) = P(A)P(B)$.
:::

:::aretenir Variables aléatoires
$E(X) = \sum x_ip_i$ ; $V(X) = E(X^2) - E(X)^2$ ; $\sigma = \sqrt{V}$ ; $E(aX + b) = aE(X) + b$ ; $V(aX + b) = a^2V(X)$. $F(x) = P(X \leqslant x)$.
:::

:::aretenir Loi binomiale
$\mathcal{B}(n, p)$ : $P(X = k) = C_n^kp^k(1 - p)^{n - k}$, $E = np$, $V = np(1 - p)$, $P(X \geqslant 1) = 1 - (1 - p)^n$.
:::$L$, resume=null, objectives=null, difficulty=1, duration_min=15, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='proba' and l.position=4;

update lessons l set title=$T$Méthodes & exercices types$T$, kind='cours', body=$L$## Comment lire cette notion

L'exercice de probabilités du BAC SM est en général une urne ou un jeu : on dénombre l'univers, on calcule quelques probabilités, on définit une variable aléatoire et on donne sa loi, puis on répète l'épreuve (loi binomiale). Chaque étape a son réflexe.

## Choisir le bon dénombrement

:::methode
1. Lire le **mode de tirage** et choisir le modèle ($n^p$, $A_n^p$, $C_n^p$).
2. Calculer $\mathrm{card}\,\Omega$ avec ce modèle.
3. Dénombrer chaque événement **avec le même modèle**.
4. Diviser (équiprobabilité).
:::

:::exemple Traité
Une urne contient $4$ boules blanches, $3$ rouges et $2$ vertes. On tire simultanément $3$ boules. $\mathrm{card}\,\Omega = C_9^3 = 84$.
- $A$ « trois boules de même couleur » : $C_4^3 + C_3^3 = 4 + 1 = 5$, donc $P(A) = \frac{5}{84}$.
- $B$ « trois couleurs différentes » : $4 \times 3 \times 2 = 24$, donc $P(B) = \frac{24}{84} = \frac{2}{7}$.
- $C$ « au moins une verte » : $1 - \frac{C_7^3}{84} = 1 - \frac{35}{84} = \frac{7}{12}$.
:::

## Arbre et probabilités totales

:::methode
1. Nommer les événements de chaque étape.
2. Placer sur les branches les probabilités **conditionnelles** de l'énoncé.
3. Probabilité d'un chemin : produit ; d'un événement : somme des chemins.
4. Question « sachant que… » posée à l'envers : formule de Bayes.
:::

:::exemple
Une urne $U_1$ contient $2$ rouges et $3$ noires, une urne $U_2$ $4$ rouges et $1$ noire. On lance un dé : si on obtient $6$ on tire dans $U_1$, sinon dans $U_2$. $P(R) = \frac{1}{6} \times \frac{2}{5} + \frac{5}{6} \times \frac{4}{5} = \frac{2}{30} + \frac{20}{30} = \frac{11}{15}$.
:::

## Déterminer une loi de probabilité

:::methode
1. Lister les valeurs possibles de $X$.
2. Calculer chaque $P(X = x_i)$ par dénombrement ou arbre.
3. **Vérifier** que la somme vaut $1$.
4. Présenter la loi dans un tableau, puis $E(X)$ et $V(X)$ si demandé.
:::

:::app Applique
On tire simultanément $2$ boules d'une urne contenant $3$ boules numérotées $1$ et $2$ boules numérotées $2$. $X$ = somme des numéros. Donne la loi de $X$ et $E(X)$.
:::solution Correction
$\mathrm{card}\,\Omega = C_5^2 = 10$. $X = 2$ (deux « 1 ») : $C_3^2 = 3$ ; $X = 3$ (un « 1 », un « 2 ») : $3 \times 2 = 6$ ; $X = 4$ (deux « 2 ») : $C_2^2 = 1$.

Loi : $P(X = 2) = 0{,}3$, $P(X = 3) = 0{,}6$, $P(X = 4) = 0{,}1$ (somme $1$).

$E(X) = 0{,}6 + 1{,}8 + 0{,}4 = 2{,}8$.
:::
:::

## Reconnaître et exploiter une loi binomiale

:::methode Les trois formulations
- « Exactement $k$ » : $P(X = k) = C_n^kp^k(1 - p)^{n - k}$.
- « Au moins un » : $1 - P(X = 0) = 1 - (1 - p)^n$.
- « Au moins deux » : $1 - P(X = 0) - P(X = 1)$.
:::

:::exemple Trouver $n$
Combien de lancers d'un dé faut-il pour que la probabilité d'obtenir au moins un $6$ dépasse $0{,}9$ ? $1 - \left(\frac{5}{6}\right)^n > 0{,}9 \iff \left(\frac{5}{6}\right)^n < 0{,}1 \iff n > \dfrac{\ln 0{,}1}{\ln(5/6)} \approx 12{,}6$. Il faut au moins $13$ lancers.
:::

## Espérance d'un jeu

:::methode
1. Définir le **gain algébrique** $G$ = gain $-$ mise, pour chaque issue.
2. Donner la loi de $G$, puis $E(G)$.
3. Interpréter : $E(G) > 0$ favorable au joueur, $E(G) < 0$ défavorable, $E(G) = 0$ jeu **équitable**.
4. Pour rendre un jeu équitable, résoudre $E(G) = 0$ en la mise ou en un gain inconnu.
:::

:::app Applique
On tire une carte dans un jeu de $32$. Un as rapporte $10$ DH, une figure (roi, dame, valet) $4$ DH, une autre carte rien. La mise est $m$ DH. Pour quelle mise le jeu est-il équitable ?
:::solution Correction
$4$ as, $12$ figures, $16$ autres cartes. Gain moyen hors mise : $\dfrac{4 \times 10 + 12 \times 4}{32} = \dfrac{88}{32} = 2{,}75$ DH. $E(G) = 2{,}75 - m = 0 \iff m = 2{,}75$ DH.
:::
:::

:::aretenir
- Même modèle pour l'univers et pour l'événement.
- Arbre : conditionnelles sur les branches ; totales ; Bayes à l'envers.
- Loi : valeurs, probabilités, somme égale à $1$.
- Binomiale : « au moins » par le contraire ; inéquation en $n$ par $\ln$.
:::

:::funnel Méthodes en probabilités
:::$L$, resume=$R$## Méthodes en probabilités — l'essentiel

:::aretenir Lire l'énoncé
| Mot de l'énoncé | Modèle |
| --- | --- |
| « simultanément », « une poignée » | combinaisons |
| « successivement sans remise » | arrangements |
| « successivement avec remise », « $n$ fois de suite » | $n^p$, souvent binomiale |
| « sachant que » | probabilité conditionnelle |
:::

:::attention Les 3 pièges du BAC
1. Mélanger les modèles : même modèle au numérateur et au dénominateur.
2. Oublier de vérifier que la loi trouvée a une somme égale à $1$.
3. Répondre à « au moins deux » avec $1 - P(X = 0)$.
:::$R$, objectives=$O$Choisir le bon modèle de dénombrement à partir de l'énoncé.
Construire et exploiter un arbre pondéré avec la formule des probabilités totales.
Déterminer la loi d'une variable aléatoire dans une situation de tirage.
Reconnaître une loi binomiale et répondre aux questions « exactement », « au moins », « au plus ».$O$, difficulty=2, duration_min=50, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='proba' and l.position=50;

update lessons l set title=$T$Approfondissement : Bayes, variance, loi binomiale$T$, kind='cours', body=$L$## Formule de Bayes

:::theoreme
Soit $(B_1, \ldots, B_n)$ une partition de $\Omega$ et $A$ un événement de probabilité non nulle. Pour tout $i$ :
$$P_A(B_i) = \frac{P(B_i)\,P_{B_i}(A)}{P(A)} = \frac{P(B_i)\,P_{B_i}(A)}{\displaystyle\sum_{j=1}^{n} P(B_j)\,P_{B_j}(A)}.$$
:::

:::exemple Test de dépistage
Une maladie touche $1\,\%$ d'une population. Un test est positif pour $99\,\%$ des malades et pour $2\,\%$ des non-malades. $P(T) = 0{,}01 \times 0{,}99 + 0{,}99 \times 0{,}02 = 0{,}0099 + 0{,}0198 = 0{,}0297$. Donc
$$P_T(M) = \frac{0{,}0099}{0{,}0297} = \frac{1}{3}.$$
Un test positif ne donne qu'une chance sur trois d'être malade : la maladie est rare, les faux positifs sont nombreux.
:::

:::methode Bayes avec un arbre
1. Construire l'arbre « cause puis effet » avec les données de l'énoncé.
2. Calculer $P(\text{effet})$ par les probabilités totales.
3. Diviser la probabilité du chemin « cause et effet » par $P(\text{effet})$.
:::

:::app Applique
Deux urnes : $U_1$ ($3$ blanches, $2$ noires) et $U_2$ ($1$ blanche, $4$ noires). On choisit une urne au hasard puis on tire une boule, qui est blanche. Quelle est la probabilité qu'elle vienne de $U_1$ ?
:::solution Correction
$P(B) = \frac{1}{2} \times \frac{3}{5} + \frac{1}{2} \times \frac{1}{5} = \frac{2}{5}$. Donc $P_B(U_1) = \dfrac{\frac{1}{2} \times \frac{3}{5}}{\frac{2}{5}} = \dfrac{3}{10} \times \dfrac{5}{2} = \dfrac{3}{4}$.
:::
:::

## Espérance et variance sur un exemple

:::propriete Deux formules
$$V(X) = \sum_{i} p_i\big(x_i - E(X)\big)^2 = \sum_i p_i x_i^2 - E(X)^2.$$
La seconde (König-Huygens) est en général plus rapide.
:::

:::exemple
$X$ prend les valeurs $-1$, $0$, $2$ avec les probabilités $0{,}2$, $0{,}5$, $0{,}3$. $E(X) = -0{,}2 + 0{,}6 = 0{,}4$ ; $E(X^2) = 0{,}2 + 1{,}2 = 1{,}4$ ; $V(X) = 1{,}4 - 0{,}16 = 1{,}24$ ; $\sigma(X) = \sqrt{1{,}24} \approx 1{,}11$.
:::

:::app Applique
Un jeu rapporte $X$ points avec $P(X = 0) = \frac{1}{2}$, $P(X = 2) = \frac{1}{3}$, $P(X = a) = \frac{1}{6}$. Détermine $a$ pour que $E(X) = 2$, puis calcule $V(X)$.
:::solution Correction
$E(X) = \frac{2}{3} + \frac{a}{6} = 2 \iff \frac{a}{6} = \frac{4}{3} \iff a = 8$.

$E(X^2) = \frac{4}{3} + \frac{64}{6} = \frac{4}{3} + \frac{32}{3} = 12$, donc $V(X) = 12 - 4 = 8$.
:::
:::

## Loi binomiale : « au moins un »

:::methode
Pour $X \sim \mathcal{B}(n, p)$ : $P(X \geqslant 1) = 1 - (1 - p)^n$. Pour trouver le plus petit $n$ tel que $P(X \geqslant 1) \geqslant 1 - \alpha$ :
$$(1 - p)^n \leqslant \alpha \iff n\ln(1 - p) \leqslant \ln\alpha \iff n \geqslant \frac{\ln\alpha}{\ln(1 - p)},$$
le sens change car $\ln(1 - p) < 0$.
:::

:::propriete Valeur la plus probable
Pour $X \sim \mathcal{B}(n, p)$, $\dfrac{P(X = k + 1)}{P(X = k)} = \dfrac{(n - k)\,p}{(k + 1)(1 - p)}$. Ce rapport est supérieur à $1$ tant que $k < (n + 1)p - 1$ : la probabilité croît puis décroît, et le mode est proche de $np$.
:::

:::exemple
Un tireur atteint la cible avec probabilité $0{,}3$. Combien de tirs pour atteindre la cible au moins une fois avec une probabilité d'au moins $0{,}99$ ? $0{,}7^n \leqslant 0{,}01 \iff n \geqslant \dfrac{\ln 0{,}01}{\ln 0{,}7} \approx 12{,}9$ : $13$ tirs.
:::

:::aretenir
- Bayes : cause sachant effet = chemin favorable sur probabilité totale.
- Variance : $E(X^2) - E(X)^2$.
- $P(X \geqslant 1) = 1 - (1 - p)^n$ ; résoudre en $n$ avec $\ln$ en inversant le sens.
:::

:::funnel Bayes, variance et loi binomiale
:::$L$, resume=$R$## Approfondissement — l'essentiel

:::aretenir Formule de Bayes
$$P_A(B_i) = \frac{P(B_i)\,P_{B_i}(A)}{\sum_j P(B_j)\,P_{B_j}(A)}$$
:::

:::aretenir Variance
$V(X) = \sum p_i(x_i - E(X))^2 = E(X^2) - E(X)^2$ (König-Huygens), toujours $\geqslant 0$.
:::

:::aretenir Loi binomiale, aller plus loin
$P(X \geqslant 1) = 1 - (1 - p)^n$. Pour trouver $n$ : résoudre $(1 - p)^n < \alpha$ avec $\ln$ (attention : $\ln(1 - p) < 0$ inverse le sens).
:::

:::attention Les 3 pièges du BAC
1. Confondre $P_A(B)$ (cause sachant l'effet) et $P_B(A)$.
2. Obtenir une variance négative : erreur de calcul à chercher.
3. Diviser par $\ln(1 - p)$ sans changer le sens de l'inégalité.
:::$R$, objectives=$O$Inverser un conditionnement avec la formule de Bayes.
Calculer une variance par les deux formules et choisir la plus efficace.
Exploiter une loi binomiale : mode, probabilités cumulées, choix d'un nombre d'épreuves.$O$, difficulty=3, duration_min=45, bac_frequency=2
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='proba' and l.position=60;

update lessons l set title=$T$Lois de composition interne$T$, kind='cours', body=$L$## Définition

:::definition Loi de composition interne
Soit $E$ un ensemble non vide. Une **loi de composition interne** sur $E$ est une application $* : E \times E \to E$, $(x, y) \mapsto x * y$. On note $(E, *)$ l'ensemble muni de cette loi.
:::

:::exemple
- $+$ et $\times$ sont des lois internes sur $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{R}$, $\mathbb{C}$ ; la soustraction n'est pas interne sur $\mathbb{N}$ ($2 - 5 \notin \mathbb{N}$).
- Sur $\mathbb{R}$, $x * y = x + y - xy$ est une loi interne.
- La composition $\circ$ est une loi interne sur l'ensemble des applications de $E$ dans $E$.
:::

:::definition Partie stable
Une partie $F$ de $E$ est **stable** par $*$ si pour tous $x, y \in F$, $x * y \in F$. La loi $*$ induit alors une loi interne sur $F$.
:::

:::exemple
$\mathbb{U} = \{z \in \mathbb{C} \mid |z| = 1\}$ est stable par la multiplication : $|zz'| = |z||z'| = 1$. L'ensemble $2\mathbb{Z}$ des entiers pairs est stable par $+$ et par $\times$.
:::

## Associativité et commutativité

:::definition
La loi $*$ est **associative** si $(x * y) * z = x * (y * z)$ pour tous $x, y, z \in E$ ; **commutative** si $x * y = y * x$ pour tous $x, y \in E$.
:::

:::exemple
$x * y = x + y - xy$ sur $\mathbb{R}$ : commutative (évident). Associative : $(x * y) * z = x + y + z - xy - xz - yz + xyz$, expression symétrique en $x$, $y$, $z$, donc égale à $x * (y * z)$.
:::

:::attention
$x * y = \frac{x + y}{2}$ sur $\mathbb{R}$ est commutative mais **pas** associative : $(0 * 0) * 4 = 2$ alors que $0 * (0 * 4) = 1$. Un contre-exemple suffit à réfuter ; un exemple ne suffit jamais à prouver.
:::

## Élément neutre et symétrique

:::definition
$e \in E$ est un **élément neutre** pour $*$ si $x * e = e * x = x$ pour tout $x \in E$. Un élément $x$ est **symétrisable** s'il existe $x' \in E$ tel que $x * x' = x' * x = e$ ; $x'$ est le **symétrique** de $x$.
:::

:::propriete
- Si un élément neutre existe, il est unique.
- Si $*$ est associative, le symétrique d'un élément, s'il existe, est unique, et $(x * y)' = y' * x'$.
:::

:::demonstration Unicité du neutre
Si $e$ et $e'$ sont neutres : $e = e * e'$ (car $e'$ est neutre) et $e * e' = e'$ (car $e$ est neutre), donc $e = e'$.
:::

:::exemple
Pour $x * y = x + y - xy$ : $x * e = x \iff e(1 - x) = 0$ pour tout $x$, donc $e = 0$. Symétrique de $x$ : $x + x' - xx' = 0 \iff x'(1 - x) = -x \iff x' = \dfrac{x}{x - 1}$, défini pour $x \neq 1$. Tout réel sauf $1$ est symétrisable.
:::

## Distributivité

:::definition
Soient $*$ et $\top$ deux lois internes sur $E$. On dit que $\top$ est **distributive** par rapport à $*$ si, pour tous $x, y, z \in E$ :
$$x \top (y * z) = (x \top y) * (x \top z) \qquad\text{et}\qquad (y * z) \top x = (y \top x) * (z \top x).$$
Si $\top$ est commutative, une seule égalité suffit.
:::

:::exemple
Dans $\mathbb{R}$, $\times$ est distributive par rapport à $+$, mais $+$ n'est pas distributive par rapport à $\times$ : $1 + (2 \times 3) = 7 \neq (1 + 2)(1 + 3) = 12$.
:::

:::app Applique
Sur $E = ]1 ; +\infty[$, on pose $x * y = xy - x - y + 2$. Montre que $*$ est une loi interne, commutative et associative, puis détermine son élément neutre.
:::solution Correction
**Interne.** $x * y - 1 = xy - x - y + 1 = (x - 1)(y - 1) > 0$ pour $x, y > 1$, donc $x * y \in E$.

**Commutative** : évident. **Associative** : $(x * y) * z - 1 = \big((x * y) - 1\big)(z - 1) = (x - 1)(y - 1)(z - 1)$, expression symétrique, donc égale à $x * (y * z) - 1$.

**Neutre** : $(x - 1)(e - 1) = x - 1$ pour tout $x \in E$ $\iff e - 1 = 1 \iff e = 2$, et $2 \in E$.
:::
:::

:::aretenir
- Interne : le résultat reste dans $E$ ; stable : idem sur une partie.
- Associativité et commutativité se prouvent pour **tous** $x, y, z$.
- Neutre unique ; symétrique unique si la loi est associative.
- Distributivité des deux côtés si la loi n'est pas commutative.
:::

:::funnel Lois de composition interne
:::$L$, resume=$R$## Lois de composition interne — l'essentiel

:::aretenir Définitions
$*$ est une **loi de composition interne** (LCI) sur $E$ si $x * y \in E$ pour tous $x, y \in E$.
$F \subset E$ est **stable** par $*$ si $x, y \in F \Rightarrow x * y \in F$.
:::

:::aretenir Propriétés d'une loi
| Propriété | Définition |
| --- | --- |
| associative | $(x * y) * z = x * (y * z)$ |
| commutative | $x * y = y * x$ |
| élément neutre $e$ | $x * e = e * x = x$ |
| symétrique $x'$ de $x$ | $x * x' = x' * x = e$ |
| $\top$ distributive sur $*$ | $x \top (y * z) = (x \top y) * (x \top z)$ et à droite |
:::

:::attention Les 3 pièges du BAC
1. Vérifier le neutre d'un seul côté pour une loi non commutative.
2. Oublier de montrer que $x * y$ reste **dans** $E$.
3. Conclure à l'associativité sur un exemple numérique.
:::$R$, objectives=$O$Reconnaître une loi de composition interne et une partie stable.
Étudier l'associativité et la commutativité d'une loi.
Déterminer l'élément neutre et les éléments symétrisables.
Vérifier la distributivité d'une loi par rapport à une autre.$O$, difficulty=2, duration_min=50, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='structures' and l.position=1;

update lessons l set title=$T$Groupes, anneaux et corps$T$, kind='cours', body=$L$## Groupe

:::definition
On appelle **groupe** un ensemble $G$ muni d'une loi interne $*$ telle que :
1. $*$ est **associative** ;
2. $*$ admet un **élément neutre** $e$ ;
3. **tout** élément de $G$ admet un **symétrique** dans $G$.

Si de plus $*$ est commutative, le groupe est dit **commutatif** ou **abélien**.
:::

:::exemple
- $(\mathbb{Z}, +)$, $(\mathbb{Q}, +)$, $(\mathbb{R}, +)$, $(\mathbb{C}, +)$ sont des groupes abéliens.
- $(\mathbb{R}^*, \times)$, $(\mathbb{C}^*, \times)$, $(]0 ; +\infty[, \times)$ sont des groupes abéliens.
- $(\mathbb{N}, +)$ n'est pas un groupe : $1$ n'a pas de symétrique dans $\mathbb{N}$.
- $(\mathbb{U}, \times)$, avec $\mathbb{U}$ l'ensemble des complexes de module $1$, est un groupe abélien.
:::

:::propriete Règles de calcul dans un groupe
Dans un groupe $(G, *)$ : le neutre et le symétrique sont uniques ; $(x')' = x$ ; $(x * y)' = y' * x'$ ; tout élément est **régulier** : $a * x = a * y \Rightarrow x = y$, et l'équation $a * x = b$ a une unique solution $x = a' * b$.
:::

## Groupes et sous-groupes

:::definition
Une partie $H$ d'un groupe $(G, *)$ est un **sous-groupe** si $H$ est stable par $*$ et si $(H, *)$ est un groupe.
:::

:::theoreme Caractérisation
$H$ est un sous-groupe de $(G, *)$ si et seulement si :
1. $H \neq \varnothing$ (en pratique : $e \in H$) ;
2. pour tous $x, y \in H$ : $x * y' \in H$.
:::

:::exemple
Pour $n \in \mathbb{N}$, $n\mathbb{Z} = \{nk \mid k \in \mathbb{Z}\}$ est un sous-groupe de $(\mathbb{Z}, +)$ : $0 \in n\mathbb{Z}$ et $nk - nk' = n(k - k') \in n\mathbb{Z}$.
:::

## Homomorphismes

:::definition
Soient $(G, *)$ et $(G', \top)$ deux ensembles munis de lois internes. Une application $f : G \to G'$ est un **homomorphisme** (ou morphisme) si, pour tous $x, y \in G$ : $f(x * y) = f(x) \top f(y)$. Un homomorphisme bijectif est un **isomorphisme**.
:::

:::theoreme Transfert de structure
Si $f : (G, *) \to (G', \top)$ est un **isomorphisme** et si $(G, *)$ est un groupe (abélien), alors $(G', \top)$ est un groupe (abélien). De plus $f(e) = e'$ et $f(x') = \big(f(x)\big)'$.
:::

:::exemple Le cas type du BAC
$\ln : (]0 ; +\infty[, \times) \to (\mathbb{R}, +)$ est un isomorphisme : $\ln(xy) = \ln x + \ln y$ et $\ln$ est bijective. Réciproquement, $\exp$ est un isomorphisme de $(\mathbb{R}, +)$ sur $(]0 ; +\infty[, \times)$.
:::

:::methode Montrer que $(E, *)$ est un groupe par isomorphisme
1. Trouver une bijection $f$ d'un groupe connu $(G, \cdot)$ vers $E$.
2. Vérifier $f(x \cdot y) = f(x) * f(y)$.
3. Conclure par transfert de structure ; le neutre de $E$ est $f(e)$ et le symétrique de $f(x)$ est $f(x')$.
:::

:::exemple
Sur $E = ]1 ; +\infty[$ avec $x * y = (x - 1)(y - 1) + 1$, l'application $f : x \mapsto x + 1$ de $(]0 ; +\infty[, \times)$ vers $E$ est bijective et $f(ab) = ab + 1 = (f(a) - 1)(f(b) - 1) + 1 = f(a) * f(b)$. Donc $(E, *)$ est un groupe abélien, de neutre $f(1) = 2$.
:::

## Anneau et corps

:::definition Anneau
Un **anneau** est un ensemble $A$ muni de deux lois internes $+$ et $\times$ telles que :
1. $(A, +)$ est un groupe abélien (neutre noté $0$) ;
2. $\times$ est associative ;
3. $\times$ est distributive par rapport à $+$ (à gauche et à droite).

L'anneau est **commutatif** si $\times$ l'est, **unitaire** si $\times$ a un neutre (noté $1$).
:::

:::exemple
$(\mathbb{Z}, +, \times)$, $(\mathbb{R}, +, \times)$ sont des anneaux commutatifs unitaires. $(\mathcal{M}_2(\mathbb{R}), +, \times)$ est un anneau unitaire **non commutatif**, de neutre $I = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}$.
:::

:::definition Corps
Un **corps** est un anneau commutatif unitaire $(K, +, \times)$, avec $1 \neq 0$, dans lequel **tout élément non nul est inversible** pour $\times$ : $(K^*, \times)$ est un groupe.
:::

:::exemple
$\mathbb{Q}$, $\mathbb{R}$, $\mathbb{C}$ sont des corps ; $\mathbb{Z}$ n'en est pas un ($2$ n'a pas d'inverse dans $\mathbb{Z}$).
:::

:::app Applique
Montre que $H = \{a + b\sqrt{2} \mid a, b \in \mathbb{Z}\}$ est un sous-groupe de $(\mathbb{R}, +)$, et qu'il est stable par la multiplication.
:::solution Correction
$0 = 0 + 0\sqrt{2} \in H$. Pour $x = a + b\sqrt{2}$ et $y = c + d\sqrt{2}$ dans $H$ : $x - y = (a - c) + (b - d)\sqrt{2} \in H$. Donc $H$ est un sous-groupe de $(\mathbb{R}, +)$.

$xy = (ac + 2bd) + (ad + bc)\sqrt{2}$ avec $ac + 2bd$ et $ad + bc$ entiers : $xy \in H$.
:::
:::

:::aretenir
- Groupe : associativité, neutre, symétriques.
- Sous-groupe : $e \in H$ et $x * y' \in H$.
- Isomorphisme : homomorphisme bijectif ; il transfère la structure de groupe.
- Anneau : $(A, +)$ groupe abélien, $\times$ associative et distributive ; corps : en plus tout non nul est inversible.
:::

:::funnel Groupes, anneaux et corps
:::$L$, resume=$R$## Groupes, anneaux, corps — l'essentiel

:::aretenir Groupe $(G, *)$
Loi interne, **associative**, **élément neutre**, **tout élément symétrisable**. Abélien si $*$ commutative.
Sous-groupe $H$ : $H \neq \varnothing$ (souvent $e \in H$) et $x, y \in H \Rightarrow x * y' \in H$.
:::

:::aretenir Homomorphisme
$f : (G, *) \to (G', \top)$ avec $f(x * y) = f(x) \top f(y)$. Alors $f(e) = e'$, $f(x') = f(x)'$. Si $f$ est bijectif (isomorphisme) et $(G, *)$ est un groupe, $(G', \top)$ en est un.
:::

:::aretenir Anneau et corps
$(A, +, \times)$ anneau : $(A, +)$ groupe abélien, $\times$ associative et distributive sur $+$.
Corps : anneau commutatif unitaire où tout élément non nul est inversible.
:::

:::attention Les 3 pièges du BAC
1. Oublier l'associativité dans la liste des axiomes du groupe.
2. Utiliser un isomorphisme sans avoir montré la bijectivité.
3. Croire que tout anneau est intègre : $(\mathcal{M}_2(\mathbb{R}), +, \times)$ ne l'est pas.
:::$R$, objectives=$O$Montrer qu'un ensemble muni d'une loi est un groupe, éventuellement commutatif.
Montrer qu'une partie est un sous-groupe à l'aide de la caractérisation.
Utiliser un homomorphisme ou un isomorphisme pour transférer une structure.
Reconnaître un anneau, un anneau commutatif unitaire, un corps.$O$, difficulty=3, duration_min=60, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='structures' and l.position=2;

update lessons l set title=$T$Espaces vectoriels$T$, kind='cours', body=$L$## Espace vectoriel et sous-espace

:::definition Espace vectoriel réel
Un **espace vectoriel réel** est un ensemble $E$ muni d'une loi interne $+$ et d'une loi externe $\cdot : \mathbb{R} \times E \to E$ telles que :
1. $(E, +)$ est un groupe abélien (neutre $0_E$) ;
2. pour tous $\alpha, \beta \in \mathbb{R}$ et $u, v \in E$ :
$$\alpha \cdot (u + v) = \alpha u + \alpha v, \quad (\alpha + \beta)u = \alpha u + \beta u, \quad \alpha(\beta u) = (\alpha\beta)u, \quad 1 \cdot u = u.$$
Les éléments de $E$ sont des **vecteurs**, les réels des **scalaires**.
:::

:::exemple
- $\mathbb{R}^2$ et $\mathbb{R}^3$ avec les opérations composante par composante.
- $(\mathbb{C}, +, \cdot)$ est un espace vectoriel réel.
- $\mathcal{M}_2(\mathbb{R})$, ensemble des matrices carrées d'ordre $2$, avec l'addition des matrices et la multiplication par un réel.
- L'ensemble des fonctions de $\mathbb{R}$ dans $\mathbb{R}$, l'ensemble des suites réelles.
:::

:::propriete Règles de calcul
$0 \cdot u = 0_E$ ; $\alpha \cdot 0_E = 0_E$ ; $(-1)u = -u$ ; $\alpha u = 0_E \iff (\alpha = 0 \text{ ou } u = 0_E)$.
:::

:::definition Sous-espace vectoriel
Une partie $F$ de $E$ est un **sous-espace vectoriel** si elle contient $0_E$ et si elle est stable par combinaison linéaire : pour tous $u, v \in F$ et $\alpha, \beta \in \mathbb{R}$, $\alpha u + \beta v \in F$. Alors $(F, +, \cdot)$ est lui-même un espace vectoriel.
:::

:::exemple
$F = \{(x, y, z) \in \mathbb{R}^3 \mid x + y - 2z = 0\}$ est un sous-espace de $\mathbb{R}^3$ : $(0, 0, 0) \in F$, et si $u, v \in F$, la combinaison $\alpha u + \beta v$ vérifie encore l'équation par linéarité. En revanche, $\{(x, y) \mid x + y = 1\}$ n'en est pas un : il ne contient pas $(0, 0)$.
:::

## Familles libres, génératrices, bases

:::definition Combinaison linéaire
Une **combinaison linéaire** des vecteurs $u_1, \ldots, u_n$ est un vecteur de la forme $\lambda_1u_1 + \cdots + \lambda_nu_n$ avec $\lambda_i \in \mathbb{R}$.
:::

:::definition
- La famille $(u_1, \ldots, u_n)$ est **libre** si $\lambda_1u_1 + \cdots + \lambda_nu_n = 0_E \implies \lambda_1 = \cdots = \lambda_n = 0$. Sinon elle est **liée**.
- Elle est **génératrice** de $E$ si tout vecteur de $E$ est combinaison linéaire des $u_i$.
- C'est une **base** de $E$ si elle est libre et génératrice : tout vecteur s'écrit alors de **façon unique** $u = \sum \lambda_iu_i$ ; les $\lambda_i$ sont ses **coordonnées**.
:::

:::propriete Dimension
Toutes les bases d'un espace vectoriel (de dimension finie) ont le même nombre de vecteurs : c'est la **dimension** de $E$. Dans un espace de dimension $n$, une famille libre de $n$ vecteurs est une base, et une famille génératrice de $n$ vecteurs est une base.
:::

:::exemple Bases usuelles
- $\mathbb{R}^2$ : base $\big((1, 0), (0, 1)\big)$, dimension $2$.
- $\mathbb{C}$ (réel) : base $(1, i)$, dimension $2$.
- $\mathcal{M}_2(\mathbb{R})$ : base $(E_{11}, E_{12}, E_{21}, E_{22})$ où $E_{ij}$ a un $1$ en position $(i, j)$ et des $0$ ailleurs ; dimension $4$.
:::

:::methode Montrer qu'une famille est libre
Écrire $\lambda_1u_1 + \cdots + \lambda_nu_n = 0_E$, traduire en système (composante par composante), et montrer que la seule solution est $\lambda_1 = \cdots = \lambda_n = 0$. Deux vecteurs non nuls sont liés si et seulement s'ils sont colinéaires.
:::

:::exemple
Dans $\mathbb{R}^2$, $u = (1, 2)$ et $v = (3, 1)$ : $\alpha u + \beta v = 0$ donne $\alpha + 3\beta = 0$ et $2\alpha + \beta = 0$, d'où $\alpha = \beta = 0$. La famille $(u, v)$ est libre ; comme $\dim\mathbb{R}^2 = 2$, c'est une base.
:::

## Sous-espace engendré

:::definition
L'ensemble des combinaisons linéaires de $u_1, \ldots, u_n$ est un sous-espace vectoriel de $E$, noté $\mathrm{Vect}(u_1, \ldots, u_n)$ : c'est le plus petit sous-espace contenant ces vecteurs.
:::

:::exemple
$F = \left\{\begin{pmatrix} a & b \\ -b & a \end{pmatrix} \Bigm| a, b \in \mathbb{R}\right\} = \mathrm{Vect}(I, J)$ avec $I = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}$ et $J = \begin{pmatrix} 0 & 1 \\ -1 & 0 \end{pmatrix}$. La famille $(I, J)$ est libre, donc $F$ est un sous-espace de $\mathcal{M}_2(\mathbb{R})$ de dimension $2$.
:::

:::app Applique
Montre que $F = \{(x, y, z) \in \mathbb{R}^3 \mid x - y + z = 0\}$ est un sous-espace vectoriel de $\mathbb{R}^3$ et donnes-en une base.
:::solution Correction
$(0, 0, 0) \in F$. Si $u = (x, y, z)$ et $v = (x', y', z')$ sont dans $F$, alors $\alpha u + \beta v$ vérifie $(\alpha x + \beta x') - (\alpha y + \beta y') + (\alpha z + \beta z') = \alpha \cdot 0 + \beta \cdot 0 = 0$. Donc $F$ est un sous-espace.

$(x, y, z) \in F \iff y = x + z \iff (x, y, z) = x(1, 1, 0) + z(0, 1, 1)$. La famille $\big((1, 1, 0), (0, 1, 1)\big)$ est génératrice de $F$ et libre (vecteurs non colinéaires) : c'est une base, et $\dim F = 2$.
:::
:::

:::aretenir
- Espace vectoriel : groupe abélien + quatre règles de la loi externe.
- Sous-espace : contient $0_E$ et stable par combinaison linéaire.
- Libre : seule la combinaison nulle donne $0$ ; génératrice : engendre tout ; base : les deux.
- En dimension $n$, $n$ vecteurs libres forment une base.
:::

:::funnel Espaces vectoriels
:::$L$, resume=$R$## Espaces vectoriels — l'essentiel

:::aretenir Espace vectoriel réel $(E, +, \cdot)$
$(E, +)$ groupe abélien, et pour $\alpha, \beta \in \mathbb{R}$, $u, v \in E$ : $\alpha(u + v) = \alpha u + \alpha v$, $(\alpha + \beta)u = \alpha u + \beta u$, $\alpha(\beta u) = (\alpha\beta)u$, $1 \cdot u = u$.
:::

:::aretenir Sous-espace vectoriel
$F \subset E$ : $0_E \in F$ et $\alpha u + \beta v \in F$ pour tous $u, v \in F$, $\alpha, \beta \in \mathbb{R}$.
:::

:::aretenir Familles
Libre : $\sum \lambda_iu_i = 0 \Rightarrow$ tous les $\lambda_i = 0$. Génératrice : tout vecteur est combinaison linéaire. Base : libre et génératrice. Dimension : nombre de vecteurs d'une base.
:::

:::attention Les 3 pièges du BAC
1. Oublier de vérifier que $0_E \in F$.
2. Déclarer une famille libre parce qu'aucun vecteur n'est nul.
3. Confondre « génératrice » et « libre » ; une base est les deux à la fois.
:::$R$, objectives=$O$Reconnaître un espace vectoriel réel et vérifier ses axiomes sur des exemples ($\mathbb{R}^2$, $\mathcal{M}_2(\mathbb{R})$, $\mathbb{C}$).
Montrer qu'une partie est un sous-espace vectoriel.
Étudier une famille de vecteurs : combinaison linéaire, famille libre, famille génératrice.
Déterminer une base et la dimension d'un espace vectoriel.$O$, difficulty=3, duration_min=60, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='structures' and l.position=3;

update lessons l set title=$T$Fiche de révision — Structures algébriques$T$, kind='resume', body=$L$:::aretenir Lois
Interne : $x * y \in E$. Associative, commutative, neutre $e$ (unique), symétrique $x'$ (unique si associative), $(x * y)' = y' * x'$. $\top$ distributive sur $*$ des deux côtés.
:::

:::aretenir Groupes
Associativité, neutre, symétriques. Sous-groupe : $e \in H$ et $x * y' \in H$. Dans un groupe, tout élément est régulier et $a * x = b$ a une solution unique.
:::

:::aretenir Homomorphismes
$f(x * y) = f(x) \top f(y)$ ; $f(e) = e'$ ; $f(x') = f(x)'$. Isomorphisme = homomorphisme bijectif ; il transfère la structure de groupe (et la commutativité).
:::

:::aretenir Anneaux et corps
Anneau : $(A, +)$ groupe abélien, $\times$ associative et distributive. Intègre : $ab = 0 \Rightarrow a = 0$ ou $b = 0$. Corps : commutatif unitaire, tout non nul inversible.
$(\mathcal{M}_2(\mathbb{R}), +, \times)$ : anneau unitaire non commutatif, non intègre. $(\mathbb{Z}/n\mathbb{Z}, +, \times)$ est un corps si et seulement si $n$ est premier.
:::

:::aretenir Espaces vectoriels
Sous-espace : $0_E \in F$ et $\alpha u + \beta v \in F$. Libre, génératrice, base, dimension. $\dim\mathbb{R}^n = n$, $\dim\mathbb{C} = 2$, $\dim\mathcal{M}_2(\mathbb{R}) = 4$.
:::$L$, resume=null, objectives=null, difficulty=1, duration_min=15, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='structures' and l.position=4;

update lessons l set title=$T$Méthodes & exercices types$T$, kind='cours', body=$L$## Comment lire cette notion

L'exercice de structures algébriques du BAC SM suit un schéma presque fixe : un ensemble $E$ (souvent de matrices ou de nombres) muni d'une loi, la stabilité, un isomorphisme avec un groupe connu, puis une structure d'anneau ou de corps et parfois d'espace vectoriel.

## Montrer qu'une partie est un sous-groupe

:::methode
1. Montrer que $e \in H$.
2. Prendre $x, y \in H$ quelconques et montrer $x * y' \in H$.
3. Conclure : $H$ est un sous-groupe, donc un groupe pour la loi induite.
:::

:::exemple
$H = \{2^n \mid n \in \mathbb{Z}\}$ est un sous-groupe de $(\mathbb{R}^*, \times)$ : $1 = 2^0 \in H$ et $2^n \times (2^m)^{-1} = 2^{n - m} \in H$.
:::

## Ensembles de matrices : l'exercice type

:::methode
Soit $E = \{M(x) \mid x \in \mathbb{R}\}$ avec $M(x)$ une matrice dépendant de $x$.
1. **Stabilité** : calculer $M(x) \times M(y)$ et l'écrire sous la forme $M(\varphi(x, y))$.
2. **Isomorphisme** : l'application $x \mapsto M(x)$ transporte une loi connue sur $\mathbb{R}$ vers $\times$.
3. **Conclusion** : par transfert, $(E, \times)$ est un groupe ; neutre et inverses se lisent sur l'isomorphisme.
:::

:::exemple Traité
$M(x) = \begin{pmatrix} 1 & x \\ 0 & 1 \end{pmatrix}$. On a $M(x)M(y) = \begin{pmatrix} 1 & x + y \\ 0 & 1 \end{pmatrix} = M(x + y)$ : $E$ est stable par $\times$. L'application $f : x \mapsto M(x)$ est une bijection de $\mathbb{R}$ sur $E$ et vérifie $f(x + y) = f(x)f(y)$ : c'est un isomorphisme de $(\mathbb{R}, +)$ sur $(E, \times)$. Donc $(E, \times)$ est un groupe abélien, de neutre $M(0) = I$, et $M(x)^{-1} = M(-x)$.
:::

## Groupes et sous-groupes : rédaction complète

:::app Applique
Sur $\mathbb{R}$, on pose $x * y = x + y + 3$. Montre que $(\mathbb{R}, *)$ est un groupe abélien.
:::solution Correction
**Interne et commutative** : évident.

**Associative** : $(x * y) * z = x + y + z + 6 = x * (y * z)$.

**Neutre** : $x * e = x \iff e = -3$.

**Symétrique** : $x * x' = -3 \iff x' = -x - 6 \in \mathbb{R}$.

$(\mathbb{R}, *)$ est donc un groupe abélien. (Remarque : $f(x) = x - 3$ est un isomorphisme de $(\mathbb{R}, +)$ sur $(\mathbb{R}, *)$.)
:::
:::

## Espaces vectoriels

:::methode Montrer qu'un ensemble de matrices est un espace vectoriel
Montrer que c'est un sous-espace vectoriel de $\mathcal{M}_2(\mathbb{R})$ ou $\mathcal{M}_3(\mathbb{R})$ : il contient la matrice nulle et toute combinaison linéaire $\alpha A + \beta B$ garde la forme imposée. Pour la dimension, écrire la matrice générale comme combinaison linéaire de matrices fixes et vérifier qu'elles forment une famille libre.
:::

:::exemple
$F = \left\{\begin{pmatrix} a & b \\ 0 & a \end{pmatrix} \Bigm| a, b \in \mathbb{R}\right\}$ : $\alpha\begin{pmatrix} a & b \\ 0 & a \end{pmatrix} + \beta\begin{pmatrix} a' & b' \\ 0 & a' \end{pmatrix}$ a la même forme, et la matrice nulle est dans $F$. On écrit $\begin{pmatrix} a & b \\ 0 & a \end{pmatrix} = aI + bN$ avec $N = \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix}$ : $(I, N)$ est une base, $\dim F = 2$.
:::

## Construire un corps par isomorphisme

:::methode
Si $f : (\mathbb{C}, +, \times) \to (E, +, \times)$ est bijective et vérifie $f(z + z') = f(z) + f(z')$ et $f(zz') = f(z)f(z')$, alors $(E, +, \times)$ est un corps, comme $\mathbb{C}$.
:::

:::exemple
$f(a + ib) = \begin{pmatrix} a & -b \\ b & a \end{pmatrix}$ réalise un tel isomorphisme sur l'ensemble de ces matrices : c'est une copie de $\mathbb{C}$ à l'intérieur de $\mathcal{M}_2(\mathbb{R})$.
:::

:::aretenir
- Sous-groupe : $e \in H$ et $x * y' \in H$.
- Matrices $M(x)$ : produit $M(x)M(y) = M(\varphi(x, y))$, puis isomorphisme.
- Rédaction d'un groupe : interne, associative, neutre, symétriques (dans $E$).
- Sous-espace de matrices : forme conservée par combinaison linéaire ; base par décomposition.
:::

:::funnel Méthodes sur les structures algébriques
:::$L$, resume=$R$## Méthodes sur les structures — l'essentiel

:::aretenir Les trois stratégies pour « $(E, *)$ est un groupe »
| Stratégie | Quand l'utiliser |
| --- | --- |
| vérifier les axiomes un par un | loi simple, calculs courts |
| montrer que $E$ est un sous-groupe d'un groupe connu | $E \subset G$ et même loi |
| isomorphisme depuis un groupe connu | l'énoncé fournit une application $f$ |
:::

:::attention Les 3 pièges du BAC
1. Démontrer la stabilité d'une matrice produit sans montrer qu'elle a la forme voulue.
2. Oublier de prouver que $f$ est **bijective** avant le transfert de structure.
3. Écrire le symétrique sans vérifier qu'il appartient à $E$.
:::$R$, objectives=$O$Rédiger complètement la preuve qu'un ensemble muni d'une loi est un groupe.
Montrer qu'une partie est un sous-groupe ou un sous-espace vectoriel.
Utiliser un isomorphisme pour obtenir une structure de groupe ou de corps.
Traiter l'exercice type du BAC SM sur un ensemble de matrices.$O$, difficulty=3, duration_min=60, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='structures' and l.position=50;

update lessons l set title=$T$Approfondissement : propriétés des groupes et anneaux$T$, kind='cours', body=$L$## Propriétés fondamentales des groupes

:::theoreme
Dans un groupe $(G, *)$ de neutre $e$ :
1. le neutre est unique et le symétrique de chaque élément est unique ;
2. $(x')' = x$ et $(x * y)' = y' * x'$ ;
3. tout élément est **régulier** : $a * x = a * y \Rightarrow x = y$ et $x * a = y * a \Rightarrow x = y$ ;
4. pour tous $a, b$, l'équation $a * x = b$ a une unique solution $x = a' * b$.
:::

:::demonstration Point 2
$(x * y) * (y' * x') = x * (y * y') * x' = x * e * x' = x * x' = e$, et de même dans l'autre sens. Par unicité du symétrique, $(x * y)' = y' * x'$.
:::

:::exemple Ordre d'un élément
Dans $(\mathbb{U}, \times)$, $j = \mathrm{e}^{2i\pi/3}$ vérifie $j^3 = 1$ et $j, j^2 \neq 1$ : on dit que $j$ est d'ordre $3$. L'ensemble $\{1, j, j^2\}$ est un sous-groupe de $(\mathbb{U}, \times)$.
:::

## Anneaux : inversibles et intégrité

:::definition
Dans un anneau unitaire $(A, +, \times)$ :
- $a$ est **inversible** s'il existe $b$ tel que $ab = ba = 1$ ;
- $a \neq 0$ est un **diviseur de zéro** s'il existe $b \neq 0$ tel que $ab = 0$ ou $ba = 0$ ;
- un anneau commutatif est **intègre** s'il n'a pas de diviseur de zéro : $ab = 0 \Rightarrow a = 0$ ou $b = 0$.
:::

:::propriete
Les inversibles d'un anneau unitaire forment un groupe pour $\times$. Un inversible n'est jamais diviseur de zéro. Dans un anneau intègre, on peut simplifier : $ab = ac$ et $a \neq 0 \Rightarrow b = c$.
:::

:::exemple $\mathcal{M}_2(\mathbb{R})$
Avec $A = \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix}$ : $A \neq 0$ et $A^2 = 0$. $A$ est un diviseur de zéro, donc $\mathcal{M}_2(\mathbb{R})$ n'est pas intègre. Une matrice $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$ est inversible si et seulement si $ad - bc \neq 0$.
:::

:::propriete L'anneau $\mathbb{Z}/n\mathbb{Z}$
$\mathbb{Z}/n\mathbb{Z} = \{\bar 0, \bar 1, \ldots, \overline{n - 1}\}$, muni des lois $\bar a + \bar b = \overline{a + b}$ et $\bar a \times \bar b = \overline{ab}$, est un anneau commutatif unitaire. $\bar a$ est inversible si et seulement si $a \wedge n = 1$. En particulier, $\mathbb{Z}/n\mathbb{Z}$ est un **corps** si et seulement si $n$ est **premier**.
:::

:::exemple
Dans $\mathbb{Z}/6\mathbb{Z}$ : $\bar 2 \times \bar 3 = \bar 0$, donc $\bar 2$ et $\bar 3$ sont des diviseurs de zéro. Dans $\mathbb{Z}/7\mathbb{Z}$ : $\bar 3 \times \bar 5 = \overline{15} = \bar 1$, donc $\bar 3^{-1} = \bar 5$.
:::

## Espaces vectoriels : dépendance

:::propriete
Une famille $(u_1, \ldots, u_n)$ est liée si et seulement si l'un des vecteurs est combinaison linéaire des autres. Toute famille contenant le vecteur nul, ou deux vecteurs égaux, est liée. Dans un espace de dimension $n$, toute famille de plus de $n$ vecteurs est liée.
:::

:::exemple
Dans $\mathbb{R}^3$ : $u = (1, 0, 1)$, $v = (0, 1, 1)$, $w = (1, 1, 2)$. On a $w = u + v$, donc $(u, v, w)$ est liée et n'est pas une base de $\mathbb{R}^3$.
:::

:::app Applique
Dans $\mathcal{M}_2(\mathbb{R})$, on pose $I = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}$ et $J = \begin{pmatrix} 0 & -1 \\ 1 & 0 \end{pmatrix}$. Calcule $J^2$ et montre que $(I, J)$ est libre.
:::solution Correction
$J^2 = \begin{pmatrix} -1 & 0 \\ 0 & -1 \end{pmatrix} = -I$.

Si $\alpha I + \beta J = 0$, alors $\begin{pmatrix} \alpha & -\beta \\ \beta & \alpha \end{pmatrix} = 0$, donc $\alpha = \beta = 0$ : la famille est libre. ($J$ joue le rôle de $i$, puisque $J^2 = -I$.)
:::
:::

:::aretenir
- Groupe : unicités, régularité, $(x * y)' = y' * x'$.
- Anneau : inversibles (groupe), diviseurs de zéro, intégrité ; $\mathbb{Z}/n\mathbb{Z}$ corps $\iff n$ premier.
- Famille liée $\iff$ un vecteur dépend des autres ; plus de $n$ vecteurs en dimension $n$ : liée.
:::

:::funnel Propriétés des groupes et des anneaux
:::$L$, resume=$R$## Approfondissement — l'essentiel

:::aretenir Dans un groupe
Neutre unique, symétrique unique, $(x * y)' = y' * x'$, $(x')' = x$, simplification : $a * x = a * y \Rightarrow x = y$.
:::

:::aretenir Anneaux
Inversible : $a$ tel que $ab = ba = 1$. Diviseur de zéro : $a \neq 0$ avec $ab = 0$ pour un $b \neq 0$. Intègre : commutatif, sans diviseur de zéro. $\mathbb{Z}/n\mathbb{Z}$ corps $\iff n$ premier.
:::

:::aretenir Dépendance linéaire
Famille liée $\iff$ un vecteur est combinaison linéaire des autres. Deux vecteurs : liés $\iff$ colinéaires.
:::

:::attention Les 3 pièges du BAC
1. Simplifier $AB = AC$ en $B = C$ dans un anneau de matrices (faux si $A$ n'est pas inversible).
2. Croire que $\mathbb{Z}/6\mathbb{Z}$ est un corps.
3. Conclure « liée » sans exhiber une combinaison non triviale nulle.
:::$R$, objectives=$O$Démontrer les propriétés fondamentales d'un groupe (unicités, régularité, symétrique d'un produit).
Déterminer les éléments inversibles d'un anneau et reconnaître un anneau intègre.
Étudier l'anneau $\mathbb{Z}/n\mathbb{Z}$ et savoir quand c'est un corps.
Étudier la dépendance linéaire d'une famille de vecteurs.$O$, difficulty=3, duration_min=45, bac_frequency=2
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='structures' and l.position=60;

update lessons l set title=$T$Récurrence et généralités$T$, kind='cours', body=$L$## Suites numériques : vocabulaire

:::definition Suite numérique
Une **suite numérique** $(u_n)_{n \geqslant n_0}$ est une application de $\{n \in \mathbb{N} \mid n \geqslant n_0\}$ dans $\mathbb{R}$. L'image de $n$ est notée $u_n$ : c'est le **terme général**, ou terme d'indice $n$.
:::

- $(u_n)$, **avec les parenthèses**, désigne la suite entière : $u_{n_0}, u_{n_0+1}, \ldots$
- $u_n$, **sans parenthèses**, désigne un seul nombre.

On écrit donc « la suite $(u_n)$ est croissante », jamais « la suite $u_n$ est croissante ».

| | Définition **explicite** | Définition **par récurrence** |
| --- | --- | --- |
| Forme | $u_n = f(n)$ | $u_{n_0}$ donné et $u_{n+1} = f(u_n)$ |
| Exemple | $u_n = \dfrac{2n+1}{n+3}$ | $u_0 = 2$ et $u_{n+1} = \dfrac{u_n}{2} + 1$ |
| Calcul de $u_{10}$ | on remplace $n$ par $10$ | il faut $u_1, u_2, \ldots, u_9$ |

:::attention
Dans $u_{n+1} = f(u_n)$, l'écriture $u_{n+1}$ désigne le terme **suivant**, pas $u_n + 1$. De même $u_{2n}$ est le terme d'indice $2n$ et non $2u_n$.
:::

## Raisonnement par récurrence

C'est l'outil de démonstration propre aux entiers : il sert dès qu'une propriété doit être établie **pour tout entier** à partir d'un certain rang.

:::theoreme Principe de récurrence
Soit $P(n)$ une propriété dépendant de l'entier $n$ et $n_0 \in \mathbb{N}$. Si :
1. **(initialisation)** $P(n_0)$ est vraie ;
2. **(hérédité)** pour tout entier $n \geqslant n_0$, $P(n) \implies P(n+1)$ ;

alors $P(n)$ est vraie pour tout entier $n \geqslant n_0$.
:::

:::demonstration Pourquoi le principe est vrai
Supposons qu'il existe un entier $n \geqslant n_0$ pour lequel $P(n)$ est fausse. L'ensemble $A = \{n \geqslant n_0 \mid P(n) \text{ fausse}\}$ est alors une partie non vide de $\mathbb{N}$ : il admet un plus petit élément $m$. Comme $P(n_0)$ est vraie, $m > n_0$, donc $m - 1 \geqslant n_0$ et $P(m-1)$ est vraie (car $m-1 \notin A$). Par hérédité, $P(m)$ est vraie : contradiction. Le principe repose donc sur le fait que toute partie non vide de $\mathbb{N}$ a un plus petit élément.
:::

:::methode Rédiger une récurrence
**Étape 0 — Énoncer.** « Pour tout $n \geqslant n_0$, notons $P(n)$ : … ».

**Étape 1 — Initialisation.** Calculer séparément les deux membres pour $n = n_0$.

**Étape 2 — Hérédité.** « Soit $n \geqslant n_0$ **fixé** ; supposons $P(n)$ vraie (hypothèse de récurrence). Montrons $P(n+1)$. » On part de l'expression au rang $n+1$ et on utilise l'hypothèse **au moment précis** où l'on remplace le terme de rang $n$.

**Étape 3 — Conclusion.** « D'après le principe de récurrence, $P(n)$ est vraie pour tout $n \geqslant n_0$. »
:::

:::exemple Une formule de somme
Montrons que pour tout $n \geqslant 1$, $\displaystyle\sum_{k=1}^{n} k^2 = \frac{n(n+1)(2n+1)}{6}$.

**Initialisation.** $n = 1$ : à gauche $1$, à droite $\dfrac{1 \times 2 \times 3}{6} = 1$.

**Hérédité.** Supposons la formule vraie au rang $n$. Alors
$$\sum_{k=1}^{n+1} k^2 = \frac{n(n+1)(2n+1)}{6} + (n+1)^2 = \frac{(n+1)\big[n(2n+1) + 6(n+1)\big]}{6} = \frac{(n+1)(2n^2 + 7n + 6)}{6}.$$
Or $2n^2 + 7n + 6 = (n+2)(2n+3)$, d'où $\dfrac{(n+1)(n+2)(2n+3)}{6}$ : c'est la formule au rang $n+1$.
:::

:::exemple Une inégalité (inégalité de Bernoulli)
Soit $a > -1$. Montrons que pour tout $n \in \mathbb{N}$, $(1 + a)^n \geqslant 1 + na$.

**Initialisation.** $(1+a)^0 = 1 \geqslant 1 + 0$.

**Hérédité.** Supposons $(1+a)^n \geqslant 1 + na$. Comme $1 + a > 0$, on peut multiplier sans changer le sens :
$$(1+a)^{n+1} \geqslant (1 + na)(1 + a) = 1 + (n+1)a + na^2 \geqslant 1 + (n+1)a.$$
:::

:::remarque Récurrence à deux pas
Pour une suite définie par $u_0$, $u_1$ et $u_{n+2} = a\,u_{n+1} + b\,u_n$, l'hérédité utilise **deux** rangs : on pose $P(n)$ : « la propriété est vraie aux rangs $n$ et $n+1$ », et l'initialisation vérifie les rangs $0$ **et** $1$.
:::

:::attention Les deux fautes qui annulent une récurrence
1. **Oublier l'initialisation.** La propriété « $10^n + 1$ est divisible par $9$ » est héréditaire, mais fausse pour tout $n$ : sans initialisation, l'hérédité ne prouve rien.
2. **Supposer la propriété « pour tout entier ».** Écrire « supposons $P(n)$ vraie pour tout $n$ », c'est ce qu'on veut démontrer : l'hypothèse porte sur **un** entier $n$ fixé.
:::

:::app Applique
Soit $(u_n)$ définie par $u_0 = 3$ et $u_{n+1} = 2u_n - 1$. Démontre que $u_n = 2^{n+1} + 1$ pour tout $n \in \mathbb{N}$.
:::solution Correction
Notons $P(n)$ : « $u_n = 2^{n+1} + 1$ ».

**Initialisation.** $u_0 = 3$ et $2^{1} + 1 = 3$ : $P(0)$ est vraie.

**Hérédité.** Supposons $u_n = 2^{n+1} + 1$ pour un $n$ fixé. Alors $u_{n+1} = 2(2^{n+1} + 1) - 1 = 2^{n+2} + 1$ : c'est $P(n+1)$.

**Conclusion.** $u_n = 2^{n+1} + 1$ pour tout $n \in \mathbb{N}$.
:::
:::

## Monotonie et bornes

:::definition Sens de variation
$(u_n)$ est **croissante** (resp. **décroissante**) si $u_{n+1} \geqslant u_n$ (resp. $u_{n+1} \leqslant u_n$) pour tout $n$ ; **strictement** avec des inégalités strictes ; **monotone** si elle est croissante ou décroissante ; **stationnaire** si elle est constante à partir d'un certain rang.
:::

:::definition Suite majorée, minorée, bornée
$(u_n)$ est **majorée** s'il existe $M \in \mathbb{R}$ tel que $u_n \leqslant M$ pour tout $n$ ; **minorée** s'il existe $m$ tel que $u_n \geqslant m$ pour tout $n$ ; **bornée** si elle est majorée et minorée, c'est-à-dire s'il existe $K \geqslant 0$ tel que $|u_n| \leqslant K$ pour tout $n$.
:::

:::methode Les quatre techniques pour la monotonie
**1. Différence.** Étudier le signe de $u_{n+1} - u_n$ : méthode universelle, à essayer en premier.

**2. Quotient.** Si $u_n > 0$ pour tout $n$, comparer $\dfrac{u_{n+1}}{u_n}$ à $1$. Efficace pour les produits, puissances, factorielles.

**3. Fonction associée.** Si $u_n = f(n)$ et $f$ est monotone sur $[n_0 ; +\infty[$, $(u_n)$ a le même sens de variation. **Réservé aux suites explicites.**

**4. Récurrence.** Si $u_{n+1} = f(u_n)$ avec $f$ **croissante** sur un intervalle stable, on montre par récurrence que $u_n \leqslant u_{n+1}$ (ou $\geqslant$) se propage : il suffit de comparer $u_0$ et $u_1$.
:::

:::exemple Technique 2
Soit $u_n = \dfrac{2^n}{n!}$ pour $n \geqslant 1$. Alors $u_n > 0$ et
$$\frac{u_{n+1}}{u_n} = \frac{2^{n+1}}{(n+1)!} \times \frac{n!}{2^n} = \frac{2}{n+1}.$$
Pour $n \geqslant 1$, $\dfrac{2}{n+1} \leqslant 1$ : la suite est décroissante (et strictement à partir de $n = 2$).
:::

:::exemple Technique 4
Soit $u_0 = 1$ et $u_{n+1} = \sqrt{2 + u_n}$. La fonction $f : x \mapsto \sqrt{2+x}$ est croissante sur $[-2 ; +\infty[$. On a $u_1 = \sqrt{3} > u_0$. Si $u_{n+1} \geqslant u_n$, alors $f(u_{n+1}) \geqslant f(u_n)$, soit $u_{n+2} \geqslant u_{n+1}$ : par récurrence, $(u_n)$ est croissante.
:::

:::attention
Si $f$ est **décroissante**, la suite $u_{n+1} = f(u_n)$ n'est en général **pas** monotone : elle oscille. On étudie alors les suites $(u_{2n})$ et $(u_{2n+1})$ (voir la leçon sur les suites récurrentes).
:::

:::remarque Majorant et borne supérieure
Un majorant n'est pas unique : tout réel plus grand convient aussi. L'énoncé demande « un » majorant. Le **plus petit** des majorants, quand il existe, s'appelle la borne supérieure ; pour une suite croissante convergente, c'est sa limite.
:::

:::aretenir
- $(u_n)$ = la suite, $u_n$ = un nombre. Explicite : calcul direct ; récurrente : dérouler.
- Récurrence = énoncé + initialisation + hérédité (pour **un** $n$ fixé) + conclusion.
- Monotonie : différence (toujours), quotient (si $u_n > 0$), fonction (si explicite), récurrence (si $f$ croissante).
- Bornée $\iff$ il existe $K$ tel que $|u_n| \leqslant K$. Pour une suite récurrente : par récurrence.
:::

:::funnel Récurrence et généralités
:::$L$, resume=$R$## Récurrence et généralités — l'essentiel

:::aretenir Les deux modes de définition
| | Explicite | Récurrente |
| --- | --- | --- |
| Forme | $u_n = f(n)$ | $u_{n_0}$ donné et $u_{n+1} = f(u_n)$ |
| Calcul de $u_{10}$ | direct | dérouler depuis $u_{n_0}$ |
| Monotonie | variations de $f$ possible | signe de $u_{n+1} - u_n$, récurrence |
:::

:::aretenir Le raisonnement par récurrence
1. **Énoncer** $P(n)$.
2. **Initialisation** : vérifier $P(n_0)$ par le calcul.
3. **Hérédité** : supposer $P(n)$ pour **un** $n \geqslant n_0$ fixé, démontrer $P(n+1)$.
4. **Conclusion** : $P(n)$ est vraie pour tout $n \geqslant n_0$.

Variante à deux pas (suites du type $u_{n+2} = a u_{n+1} + b u_n$) : initialiser $P(n_0)$ **et** $P(n_0 + 1)$.
:::

:::aretenir Monotonie et bornes
| Technique | Condition d'emploi |
| --- | --- |
| Signe de $u_{n+1} - u_n$ | toujours |
| $\dfrac{u_{n+1}}{u_n}$ comparé à $1$ | si $u_n > 0$ pour tout $n$ |
| Variations de $f$ | si $u_n = f(n)$ (explicite) |
| Récurrence | si $u_{n+1} = f(u_n)$ avec $f$ croissante |

Bornée = majorée **et** minorée. Pour une suite récurrente : par récurrence.
:::

:::attention Les 3 pièges du BAC
1. Supposer $P(n)$ « pour tout $n$ » dans l'hérédité : raisonnement circulaire.
2. Utiliser les variations de $f$ pour une suite **récurrente** : faux en général.
3. Oublier de préciser à partir de quel rang une propriété est vraie.
:::$R$, objectives=$O$Distinguer une suite définie explicitement d'une suite définie par récurrence.
Rédiger un raisonnement par récurrence complet (simple, à deux pas, à partir d'un rang $n_0$).
Étudier le sens de variation d'une suite par la différence, le quotient ou la fonction associée.
Montrer qu'une suite est majorée, minorée ou bornée, y compris par récurrence.
Utiliser une récurrence pour établir une inégalité ou un encadrement.$O$, difficulty=1, duration_min=45, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='suites' and l.position=1;

update lessons l set title=$T$Suites arithmétiques et géométriques$T$, kind='cours', body=$L$## Suites arithmétiques

:::definition
$(u_n)$ est **arithmétique** s'il existe un réel $r$, appelé **raison**, tel que pour tout $n$ : $u_{n+1} = u_n + r$.
:::

:::propriete Terme général
Si $(u_n)$ est arithmétique de raison $r$, alors pour tous entiers $n$ et $p$ :
$$u_n = u_p + (n - p)\,r \qquad\text{en particulier}\qquad u_n = u_0 + n\,r.$$
:::

:::methode Prouver qu'une suite est arithmétique
Calculer $u_{n+1} - u_n$ pour tout entier $n$ et montrer que le résultat est une constante $r$ (indépendante de $n$). Calculer $u_1 - u_0$ et $u_2 - u_1$ ne suffit jamais.
:::

:::exemple
Soit $u_n = 5 - 3n$. Alors $u_{n+1} - u_n = 5 - 3(n+1) - 5 + 3n = -3$ : la suite est arithmétique de raison $-3$, de premier terme $u_0 = 5$. Elle est strictement décroissante, car $r < 0$.
:::

:::propriete Sens de variation
Une suite arithmétique est strictement croissante si $r > 0$, strictement décroissante si $r < 0$, constante si $r = 0$. Si $r \neq 0$, elle diverge vers $\pm\infty$ selon le signe de $r$.
:::

## Suites géométriques

:::definition
$(u_n)$ est **géométrique** s'il existe un réel $q \neq 0$, appelé **raison**, tel que pour tout $n$ : $u_{n+1} = q\,u_n$.
:::

:::propriete Terme général
Si $(u_n)$ est géométrique de raison $q$, alors pour tous entiers $n \geqslant p$ :
$$u_n = u_p\,q^{\,n-p} \qquad\text{en particulier}\qquad u_n = u_0\,q^{n}.$$
:::

:::methode Prouver qu'une suite est géométrique
Exprimer $u_{n+1}$ en fonction de $u_n$ et obtenir $u_{n+1} = q\,u_n$ avec $q$ constant. Si l'on passe par le quotient $\dfrac{u_{n+1}}{u_n}$, il faut d'abord justifier que $u_n \neq 0$ pour tout $n$.
:::

:::exemple Suite auxiliaire
Soit $u_0 = 4$ et $u_{n+1} = \dfrac{1}{3}u_n + 2$. On pose $v_n = u_n - 3$. Alors
$$v_{n+1} = u_{n+1} - 3 = \frac{1}{3}u_n + 2 - 3 = \frac{1}{3}(u_n - 3) = \frac{1}{3}v_n.$$
$(v_n)$ est géométrique de raison $\frac{1}{3}$ et de premier terme $v_0 = 1$. Donc $v_n = \left(\frac{1}{3}\right)^n$ et $u_n = 3 + \left(\frac{1}{3}\right)^n$.
:::

:::propriete Sens de variation de $q^n$
- Si $q > 1$ : $(q^n)$ est strictement croissante.
- Si $0 < q < 1$ : $(q^n)$ est strictement décroissante.
- Si $q < 0$ : les termes changent de signe à chaque rang, la suite n'est pas monotone.

Pour $u_n = u_0 q^n$, le sens dépend aussi du signe de $u_0$.
:::

## Sommes de termes consécutifs

:::theoreme Somme des premiers entiers et somme géométrique
$$1 + 2 + \cdots + n = \frac{n(n+1)}{2}, \qquad 1 + q + q^2 + \cdots + q^{n} = \frac{1 - q^{n+1}}{1 - q} \quad (q \neq 1).$$
:::

:::demonstration Somme géométrique
Posons $S = 1 + q + \cdots + q^n$. Alors $qS = q + q^2 + \cdots + q^{n+1}$. En soustrayant, tous les termes intermédiaires disparaissent : $S - qS = 1 - q^{n+1}$, d'où $S = \dfrac{1 - q^{n+1}}{1 - q}$ pour $q \neq 1$.
:::

:::propriete Sommes de termes d'une suite
Pour $p \leqslant n$, la somme $u_p + u_{p+1} + \cdots + u_n$ comporte $N = n - p + 1$ termes et vaut :
- si $(u_n)$ est arithmétique : $N \times \dfrac{u_p + u_n}{2}$ ;
- si $(u_n)$ est géométrique de raison $q \neq 1$ : $u_p \times \dfrac{1 - q^{N}}{1 - q}$.
:::

:::exemple
Calculons $S = 3^2 + 3^3 + \cdots + 3^{10}$. Premier terme $3^2 = 9$, raison $3$, nombre de termes $10 - 2 + 1 = 9$ :
$$S = 9 \times \frac{1 - 3^9}{1 - 3} = \frac{9\,(3^9 - 1)}{2} = \frac{3^{11} - 9}{2}.$$
:::

:::attention
Le nombre de termes de $u_p$ à $u_n$ est $n - p + 1$, pas $n - p$. Vérifie toujours sur un petit cas : de $u_2$ à $u_4$ il y a $3$ termes.
:::

:::app Applique
Soit $(u_n)$ arithmétique avec $u_3 = 11$ et $u_8 = 26$. Détermine la raison, puis $S = u_3 + u_4 + \cdots + u_{20}$.
:::solution Correction
$u_8 = u_3 + 5r$, donc $26 = 11 + 5r$ et $r = 3$. Puis $u_{20} = u_3 + 17r = 11 + 51 = 62$. La somme compte $20 - 3 + 1 = 18$ termes :
$$S = 18 \times \frac{11 + 62}{2} = 9 \times 73 = 657.$$
:::
:::

## Comparaison des deux modèles

| Phénomène | Modèle | Pourquoi |
| --- | --- | --- |
| Augmentation d'un montant fixe à chaque étape | arithmétique | l'écart $u_{n+1} - u_n$ est constant |
| Augmentation d'un pourcentage fixe à chaque étape | géométrique | le rapport $\dfrac{u_{n+1}}{u_n}$ est constant |

Une évolution de $t\,\%$ correspond à la raison $q = 1 + \dfrac{t}{100}$ ; une baisse de $t\,\%$ à $q = 1 - \dfrac{t}{100}$.

:::aretenir
- Arithmétique : $u_{n+1} = u_n + r$, $u_n = u_p + (n-p)r$.
- Géométrique : $u_{n+1} = q u_n$, $u_n = u_p q^{n-p}$.
- La nature se prouve pour tout entier $n$, jamais sur des exemples.
- Somme : nombre de termes $n - p + 1$ ; formule « premier $\times \dfrac{1 - q^N}{1 - q}$ ».
- Une suite auxiliaire $v_n = u_n - \ell$ transforme souvent une relation affine en suite géométrique.
:::

:::funnel Suites arithmétiques et géométriques
:::$L$, resume=$R$## Suites arithmétiques et géométriques — l'essentiel

:::aretenir Les deux modèles
| | Arithmétique (raison $r$) | Géométrique (raison $q \neq 0$) |
| --- | --- | --- |
| Relation | $u_{n+1} = u_n + r$ | $u_{n+1} = q\,u_n$ |
| Terme général | $u_n = u_p + (n-p)\,r$ | $u_n = u_p\,q^{\,n-p}$ |
| Preuve de nature | $u_{n+1} - u_n$ constant | $\dfrac{u_{n+1}}{u_n}$ constant (ou $u_{n+1} = q u_n$) |
:::

:::aretenir Sommes de termes consécutifs
- Arithmétique : $S = \text{(nombre de termes)} \times \dfrac{\text{premier} + \text{dernier}}{2}$.
- Géométrique ($q \neq 1$) : $S = \text{premier} \times \dfrac{1 - q^{\text{nombre de termes}}}{1 - q}$.
- De $u_p$ à $u_n$ : il y a $n - p + 1$ termes.
:::

:::attention Les 3 pièges du BAC
1. Compter $n - p$ termes au lieu de $n - p + 1$.
2. Prouver la nature d'une suite sur les premiers termes seulement : il faut un calcul pour tout entier $n$.
3. Écrire $\dfrac{u_{n+1}}{u_n}$ sans avoir vérifié que $u_n \neq 0$.
:::$R$, objectives=$O$Reconnaître une suite arithmétique ou géométrique et justifier sa nature.
Exprimer le terme général en fonction de $n$ à partir de n'importe quel rang.
Calculer la somme de termes consécutifs, quel que soit le premier indice.
Utiliser une suite auxiliaire pour se ramener à une suite géométrique.$O$, difficulty=1, duration_min=40, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='suites' and l.position=2;

update lessons l set title=$T$Limite d'une suite$T$, kind='cours', body=$L$## Définitions

:::definition Suite convergente
On dit que $(u_n)$ **converge** vers le réel $\ell$ si tout intervalle ouvert contenant $\ell$ contient tous les termes $u_n$ à partir d'un certain rang. En langage quantifié :
$$\forall \varepsilon > 0,\ \exists N \in \mathbb{N},\ \forall n \geqslant N,\ |u_n - \ell| < \varepsilon.$$
On note $\lim\limits_{n \to +\infty} u_n = \ell$. Une suite qui ne converge pas est dite **divergente**.
:::

:::definition Limite infinie
$\lim u_n = +\infty$ si pour tout réel $A$, il existe un rang $N$ tel que $u_n > A$ pour tout $n \geqslant N$. Définition analogue pour $-\infty$.
:::

:::theoreme Unicité et caractère borné
1. Si $(u_n)$ converge, sa limite est unique.
2. Toute suite convergente est bornée.
:::

:::demonstration Une suite convergente est bornée
Avec $\varepsilon = 1$ : il existe $N$ tel que $|u_n - \ell| < 1$ pour $n \geqslant N$, donc $|u_n| < |\ell| + 1$. Les termes $u_0, \ldots, u_{N-1}$ sont en nombre fini. En posant $K = \max(|u_0|, \ldots, |u_{N-1}|, |\ell| + 1)$, on obtient $|u_n| \leqslant K$ pour tout $n$.
:::

:::attention
La réciproque est fausse : $u_n = (-1)^n$ est bornée mais diverge. Une suite divergente peut tendre vers l'infini **ou** n'avoir aucune limite.
:::

## Suites de référence

:::aretenir À connaître sans hésiter
Pour $k > 0$ :
$$\lim_{n \to +\infty} n^k = +\infty, \qquad \lim_{n \to +\infty} \sqrt{n} = +\infty, \qquad \lim_{n \to +\infty} \frac{1}{n^k} = 0.$$
:::

:::theoreme Limite de $(q^n)$
- Si $q > 1$ : $\lim q^n = +\infty$.
- Si $q = 1$ : $q^n = 1$ pour tout $n$.
- Si $-1 < q < 1$ : $\lim q^n = 0$.
- Si $q \leqslant -1$ : $(q^n)$ n'a pas de limite.
:::

:::demonstration Cas $q > 1$
Posons $q = 1 + a$ avec $a > 0$. D'après l'inégalité de Bernoulli, $q^n \geqslant 1 + na$. Comme $1 + na \to +\infty$, le théorème de comparaison donne $q^n \to +\infty$. Pour $0 < |q| < 1$, on applique ce résultat à $\dfrac{1}{|q|} > 1$ : $|q|^n = \dfrac{1}{(1/|q|)^n} \to 0$.
:::

:::exemple
$\lim \left(\dfrac{2}{3}\right)^n = 0$ ; $\lim (1{,}01)^n = +\infty$ ; $\left(-\dfrac{3}{2}\right)^n$ n'a pas de limite (ses termes alternent de signe avec une valeur absolue qui tend vers $+\infty$).
:::

## Opérations et ordre

:::propriete Opérations
Les règles sur les limites de sommes, produits et quotients sont les mêmes que pour les fonctions. Les **formes indéterminées** sont :
$$+\infty - \infty, \qquad 0 \times \infty, \qquad \frac{\infty}{\infty}, \qquad \frac{0}{0}.$$
:::

:::propriete Passage à la limite dans les inégalités
Si $u_n \leqslant v_n$ à partir d'un certain rang et si $(u_n)$ et $(v_n)$ convergent, alors $\lim u_n \leqslant \lim v_n$.
:::

:::attention
Les inégalités strictes deviennent larges : $\dfrac{1}{n} > 0$ pour tout $n \geqslant 1$, mais $\lim \dfrac{1}{n} = 0$.
:::

## Lever une forme indéterminée

:::methode Les trois réflexes
1. **Polynôme ou quotient de polynômes** : factoriser par le terme de plus haut degré.
2. **Différence de racines** ($\infty - \infty$) : multiplier par la quantité conjuguée.
3. **Puissances** $a^n$ et $b^n$ : factoriser par la puissance de plus grande base.
:::

:::exemple Quantité conjuguée
$$\sqrt{n+1} - \sqrt{n} = \frac{(n+1) - n}{\sqrt{n+1} + \sqrt{n}} = \frac{1}{\sqrt{n+1} + \sqrt{n}} \xrightarrow[n \to +\infty]{} 0.$$
:::

:::exemple Puissances
$$\frac{3^n - 2^n}{3^n + 2^n} = \frac{1 - \left(\frac{2}{3}\right)^n}{1 + \left(\frac{2}{3}\right)^n} \xrightarrow[n \to +\infty]{} \frac{1 - 0}{1 + 0} = 1.$$
:::

## Limite d'une suite composée

:::theoreme
Si $\lim u_n = \ell$ (fini ou infini) et si $\lim\limits_{x \to \ell} f(x) = L$, alors $\lim f(u_n) = L$. En particulier, si $u_n \to \ell$ et $f$ est continue en $\ell$, alors $f(u_n) \to f(\ell)$.
:::

:::exemple
$u_n = \sqrt{\dfrac{4n + 1}{n + 2}}$ : on a $\dfrac{4n+1}{n+2} \to 4$ et la racine est continue en $4$, donc $u_n \to 2$.
:::

:::app Applique
Détermine $\lim\limits_{n \to +\infty} \left(\sqrt{n^2 + 3n} - n\right)$.
:::solution Correction
Forme $\infty - \infty$ : on multiplie par la conjuguée.
$$\sqrt{n^2 + 3n} - n = \frac{3n}{\sqrt{n^2 + 3n} + n} = \frac{3}{\sqrt{1 + \frac{3}{n}} + 1}.$$
Comme $\sqrt{1 + \frac{3}{n}} \to 1$, la limite vaut $\dfrac{3}{2}$.
:::
:::

:::aretenir
- Convergente $\Rightarrow$ bornée ; la réciproque est fausse.
- $(q^n)$ : $+\infty$ si $q > 1$, $0$ si $|q| < 1$, pas de limite si $q \leqslant -1$.
- Forme indéterminée : factoriser, conjuguer, ou factoriser par la plus grande puissance.
- $u_n \to \ell$ et $f$ continue en $\ell$ $\Rightarrow$ $f(u_n) \to f(\ell)$.
:::

:::funnel Limite d'une suite
:::$L$, resume=$R$## Limite d'une suite — l'essentiel

:::aretenir Définitions
$\lim u_n = \ell$ : tout intervalle ouvert contenant $\ell$ contient tous les $u_n$ à partir d'un certain rang.
$\lim u_n = +\infty$ : tout intervalle $]A ; +\infty[$ contient tous les $u_n$ à partir d'un certain rang.
Une suite convergente est **bornée** ; sa limite est **unique**.
:::

:::aretenir Limites de référence
| Suite | Limite |
| --- | --- |
| $n^k$, $\sqrt{n}$ ($k > 0$) | $+\infty$ |
| $\dfrac{1}{n^k}$, $\dfrac{1}{\sqrt{n}}$ ($k > 0$) | $0$ |
| $q^n$, $q > 1$ | $+\infty$ |
| $q^n$, $-1 < q < 1$ | $0$ |
| $q^n$, $q \leqslant -1$ | pas de limite |
:::

:::attention Les 3 pièges du BAC
1. Conclure « pas de limite » devant une forme indéterminée.
2. Oublier le cas $q \leqslant -1$ : $(q^n)$ n'a pas de limite.
3. Passer à la limite dans une inégalité **stricte** en la gardant stricte.
:::$R$, objectives=$O$Énoncer la définition d'une suite convergente et d'une suite tendant vers l'infini.
Connaître les limites des suites de référence, en particulier celle de $(q^n)$.
Appliquer les opérations sur les limites et reconnaître une forme indéterminée.
Lever une indétermination par factorisation ou quantité conjuguée.
Calculer la limite de $f(u_n)$ quand $f$ est continue.$O$, difficulty=2, duration_min=50, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='suites' and l.position=3;

update lessons l set title=$T$Théorèmes de convergence$T$, kind='cours', body=$L$## Pourquoi des théorèmes de convergence

Les calculs directs exigent une formule explicite de $u_n$. Beaucoup de suites n'en ont pas : celles définies par récurrence, ou celles qu'on sait seulement encadrer. Les théorèmes de ce chapitre permettent de conclure **sans calculer la limite**, parfois même sans la connaître.

## Théorèmes de comparaison

:::theoreme Comparaison vers l'infini
Si $u_n \leqslant v_n$ à partir d'un certain rang :
- si $\lim u_n = +\infty$, alors $\lim v_n = +\infty$ ;
- si $\lim v_n = -\infty$, alors $\lim u_n = -\infty$.
:::

:::exemple
$u_n = n + (-1)^n$ : comme $(-1)^n \geqslant -1$, on a $u_n \geqslant n - 1 \to +\infty$, donc $u_n \to +\infty$.
:::

:::propriete Majoration de l'écart
Si $|u_n - \ell| \leqslant w_n$ à partir d'un certain rang et $\lim w_n = 0$, alors $\lim u_n = \ell$. C'est la forme la plus utile pour les suites récurrentes contractantes.
:::

## Théorème d'encadrement

:::theoreme Théorème des gendarmes
Si, à partir d'un certain rang, $u_n \leqslant v_n \leqslant w_n$, et si $(u_n)$ et $(w_n)$ convergent **vers la même limite** $\ell$, alors $(v_n)$ converge et $\lim v_n = \ell$.
:::

[[fig:gendarmes]] La suite encadrée est contrainte de suivre ses deux bornes.

:::demonstration
Soit $\varepsilon > 0$. Il existe un rang à partir duquel $\ell - \varepsilon < u_n$ et un rang à partir duquel $w_n < \ell + \varepsilon$. Au-delà du plus grand de ces rangs (et de celui de l'encadrement), $\ell - \varepsilon < u_n \leqslant v_n \leqslant w_n < \ell + \varepsilon$, soit $|v_n - \ell| < \varepsilon$.
:::

:::methode Encadrer
1. Encadrer le terme qui oscille : $-1 \leqslant \sin n \leqslant 1$, $-1 \leqslant (-1)^n \leqslant 1$, $0 \leqslant \sin^2 n \leqslant 1$.
2. Reconstruire $v_n$ au milieu, en surveillant le **sens des inégalités** (diviser par un positif, multiplier par un négatif inverse le sens).
3. Vérifier que les deux bornes ont la **même** limite.
:::

:::exemple Une somme encadrée
Soit $S_n = \displaystyle\sum_{k=1}^{n} \frac{n}{n^2 + k}$. Chacun des $n$ termes vérifie $\dfrac{n}{n^2 + n} \leqslant \dfrac{n}{n^2 + k} \leqslant \dfrac{n}{n^2 + 1}$, donc
$$\frac{n^2}{n^2 + n} \leqslant S_n \leqslant \frac{n^2}{n^2 + 1}.$$
Les deux bornes tendent vers $1$ : $\lim S_n = 1$.
:::

## Convergence monotone

:::theoreme Théorème de la limite monotone
- Toute suite **croissante et majorée** converge.
- Toute suite **décroissante et minorée** converge.
- Toute suite croissante non majorée tend vers $+\infty$ ; décroissante non minorée vers $-\infty$.
:::

[[fig:suite-monotone-bornee]] Une suite croissante bloquée sous un plafond s'accumule sous ce plafond.

:::remarque Ce que le théorème ne dit pas
Il garantit l'**existence** de la limite $\ell$, et si $u_n \leqslant M$ pour tout $n$, alors $\ell \leqslant M$. Il ne dit **pas** que $\ell = M$ : $1 - \frac{1}{n}$ est croissante, majorée par $5$, et converge vers $1$.
:::

:::exemple
$u_n = \displaystyle\sum_{k=1}^{n} \frac{1}{k^2}$ est croissante (on ajoute un terme positif). Pour $k \geqslant 2$, $\dfrac{1}{k^2} \leqslant \dfrac{1}{k(k-1)} = \dfrac{1}{k-1} - \dfrac{1}{k}$, d'où, par télescopage, $u_n \leqslant 1 + 1 - \dfrac{1}{n} < 2$. Croissante et majorée : $(u_n)$ converge.
:::

## Suites adjacentes

:::definition
Deux suites $(u_n)$ et $(v_n)$ sont **adjacentes** si :
1. l'une est croissante et l'autre décroissante ;
2. $\lim (v_n - u_n) = 0$.
:::

:::theoreme
Deux suites adjacentes convergent vers la **même** limite $\ell$. Si $(u_n)$ est la croissante, alors pour tout $n$ : $u_n \leqslant \ell \leqslant v_n$.
:::

:::demonstration
Posons $w_n = v_n - u_n$ : $(w_n)$ est décroissante (différence d'une décroissante et d'une croissante) et tend vers $0$, donc $w_n \geqslant 0$, soit $u_n \leqslant v_n$. Alors $u_0 \leqslant u_n \leqslant v_n \leqslant v_0$ : $(u_n)$ est croissante et majorée par $v_0$, $(v_n)$ décroissante et minorée par $u_0$. Les deux convergent, vers $\ell$ et $\ell'$, et $\ell' - \ell = \lim w_n = 0$.
:::

:::exemple Approcher $\mathrm{e}$
Soit $u_n = \displaystyle\sum_{k=0}^{n} \frac{1}{k!}$ et $v_n = u_n + \dfrac{1}{n \cdot n!}$ pour $n \geqslant 1$. $(u_n)$ est croissante ; un calcul donne $v_{n+1} - v_n = \dfrac{-1}{n(n+1)(n+1)!} < 0$ ; et $v_n - u_n = \dfrac{1}{n \cdot n!} \to 0$. Les suites sont adjacentes : elles encadrent leur limite commune, qui est le nombre $\mathrm{e}$.
:::

:::attention
Si l'on ne vérifie pas $\lim (v_n - u_n) = 0$, les deux suites peuvent converger vers des limites différentes : $u_n = -\frac{1}{n}$ et $v_n = 1 + \frac{1}{n}$.
:::

## Limite et fonction continue

:::theoreme
Si $\lim u_n = \ell$ et si $f$ est continue en $\ell$, alors $\lim f(u_n) = f(\ell)$.
:::

C'est l'argument qui permet, pour une suite récurrente $u_{n+1} = f(u_n)$ convergente vers $\ell$ avec $f$ continue en $\ell$, de passer à la limite des deux côtés : $\ell = f(\ell)$.

:::app Applique
Soit $u_1 = 1$ et $u_{n+1} = u_n + \dfrac{1}{(n+1)^2}$. On pose $v_n = u_n + \dfrac{1}{n}$. Montre que $(u_n)$ et $(v_n)$ sont adjacentes.
:::solution Correction
$u_{n+1} - u_n = \dfrac{1}{(n+1)^2} > 0$ : $(u_n)$ est croissante.

$v_{n+1} - v_n = \dfrac{1}{(n+1)^2} + \dfrac{1}{n+1} - \dfrac{1}{n} = \dfrac{1}{(n+1)^2} - \dfrac{1}{n(n+1)} = \dfrac{n - (n+1)}{n(n+1)^2} = \dfrac{-1}{n(n+1)^2} < 0$ : $(v_n)$ est décroissante.

$v_n - u_n = \dfrac{1}{n} \to 0$. Les suites sont adjacentes : elles convergent vers une même limite.
:::
:::

:::aretenir
- Comparaison : un minorant qui tend vers $+\infty$ entraîne la suite.
- Gendarmes : deux bornes de **même** limite. Réflexe devant $\sin$, $\cos$, $(-1)^n$, ou une somme de $n$ termes.
- Monotone + bornée $\Rightarrow$ convergente (existence seulement).
- Adjacentes : une croissante, une décroissante, écart vers $0$ $\Rightarrow$ même limite, encadrée.
:::

:::funnel Théorèmes de convergence
:::$L$, resume=$R$## Théorèmes de convergence — l'essentiel

:::aretenir Comparaison et encadrement
- $u_n \leqslant v_n$ et $u_n \to +\infty$ $\Rightarrow$ $v_n \to +\infty$.
- $u_n \leqslant v_n \leqslant w_n$ et $u_n, w_n \to \ell$ $\Rightarrow$ $v_n \to \ell$.
- $|u_n - \ell| \leqslant w_n$ et $w_n \to 0$ $\Rightarrow$ $u_n \to \ell$.
:::

:::aretenir Convergence monotone
Croissante et majorée $\Rightarrow$ converge ; décroissante et minorée $\Rightarrow$ converge.
Croissante non majorée $\Rightarrow$ $+\infty$. Le théorème donne l'**existence**, pas la valeur.
:::

:::aretenir Suites adjacentes
$(u_n)$ croissante, $(v_n)$ décroissante, $\lim (v_n - u_n) = 0$ $\Rightarrow$ même limite $\ell$, et $u_n \leqslant \ell \leqslant v_n$ pour tout $n$.
:::

:::attention Les 3 pièges du BAC
1. Croire que la limite d'une suite croissante majorée par $M$ vaut $M$.
2. Appliquer les gendarmes avec deux bornes de limites différentes.
3. Pour des suites adjacentes, oublier de vérifier $\lim (v_n - u_n) = 0$.
:::$R$, objectives=$O$Utiliser les théorèmes de comparaison pour établir une limite infinie.
Appliquer le théorème d'encadrement, notamment avec $\sin n$, $\cos n$ ou $(-1)^n$.
Démontrer la convergence d'une suite monotone bornée.
Reconnaître et exploiter deux suites adjacentes.
Passer à la limite dans une relation de récurrence grâce à la continuité.$O$, difficulty=2, duration_min=55, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='suites' and l.position=4;

update lessons l set title=$T$Suites récurrentes $u_{n+1}=f(u_n)$$T$, kind='cours', body=$L$## Le problème posé

Une suite récurrente est définie par $u_0 \in I$ et $u_{n+1} = f(u_n)$, où $f$ est une fonction définie sur un intervalle $I$. On ne dispose d'aucune formule explicite : tout se démontre **par récurrence** et par les théorèmes de convergence.

[[fig:suite-escalier]] Construction graphique : on monte à la courbe de $f$, on se reporte sur la droite $y = x$, et on recommence.

## Méthode d'étude

:::methode Étudier $u_{n+1} = f(u_n)$
1. **Intervalle stable.** Chercher $I$ tel que $f(I) \subset I$ et $u_0 \in I$. Alors, par récurrence, $u_n \in I$ pour tout $n$ : la suite est bien définie et bornée si $I$ est borné.
2. **Monotonie.** Étudier le signe de $u_{n+1} - u_n = f(u_n) - u_n$, c'est-à-dire le signe de $g(x) = f(x) - x$ sur $I$ ; ou, si $f$ est croissante sur $I$, comparer $u_0$ et $u_1$ puis propager par récurrence.
3. **Convergence.** Monotone et bornée $\Rightarrow$ convergente.
4. **Limite.** Si $f$ est continue sur $I$ fermé, la limite $\ell$ vérifie $f(\ell) = \ell$ et $\ell \in I$.
:::

## Étape 1 — L'intervalle stable

:::propriete
Si $f$ est **croissante** sur $[a ; b]$, alors $f([a ; b]) = [f(a) ; f(b)]$. Pour prouver la stabilité, il suffit donc de vérifier $f(a) \geqslant a$ et $f(b) \leqslant b$.
:::

:::exemple
$f(x) = \dfrac{3x + 2}{x + 2}$ sur $[1 ; 2]$. On a $f'(x) = \dfrac{4}{(x+2)^2} > 0$, $f(1) = \dfrac{5}{3} \in [1 ; 2]$ et $f(2) = 2$. Donc $f([1;2]) = [\frac{5}{3} ; 2] \subset [1 ; 2]$ : l'intervalle est stable.
:::

## Étape 2 — La monotonie

:::propriete Le signe de $f(x) - x$
Si $f(x) - x \geqslant 0$ sur $I$ et $u_n \in I$ pour tout $n$, alors $u_{n+1} - u_n = f(u_n) - u_n \geqslant 0$ : la suite est croissante.
:::

:::propriete $f$ croissante sur $I$ stable
Si $u_0 \leqslant u_1$, alors $(u_n)$ est croissante ; si $u_0 \geqslant u_1$, elle est décroissante. (Récurrence : $u_n \leqslant u_{n+1} \Rightarrow f(u_n) \leqslant f(u_{n+1})$.)
:::

:::attention
Une fonction $f$ **croissante** ne rend pas la suite croissante : $u_{n+1} = \frac{1}{2}u_n$ avec $u_0 = 1$ a $f$ croissante et une suite décroissante. Seule la comparaison de $u_0$ et $u_1$ fixe le sens.
:::

## Étape 3 — Le calcul de la limite

:::theoreme Point fixe
Si $u_n \to \ell$, si $f$ est continue en $\ell$ et si $u_{n+1} = f(u_n)$, alors $\ell = f(\ell)$.
:::

:::demonstration
$(u_{n+1})$ a la même limite que $(u_n)$, soit $\ell$. Par continuité, $f(u_n) \to f(\ell)$. Par unicité de la limite de la suite $(u_{n+1}) = (f(u_n))$, $\ell = f(\ell)$.
:::

:::exemple Suite de l'exemple
Pour $f(x) = \dfrac{3x+2}{x+2}$ et $u_0 = 1$ : $u_1 = \frac{5}{3} > u_0$ et $f$ croissante, donc $(u_n)$ est croissante, majorée par $2$ : elle converge vers $\ell \in [1 ; 2]$. Puis $\ell = \dfrac{3\ell+2}{\ell+2}$ donne $\ell^2 - \ell - 2 = 0$, soit $\ell = 2$ ou $\ell = -1$. Comme $\ell \in [1 ; 2]$ : $\ell = 2$.
:::

## Cas où $f$ est décroissante : suites extraites

:::propriete
Si $f$ est décroissante sur $I$ stable, alors $g = f \circ f$ est croissante sur $I$. Les suites $a_n = u_{2n}$ et $b_n = u_{2n+1}$ vérifient $a_{n+1} = g(a_n)$ et $b_{n+1} = g(b_n)$ : elles sont monotones, et de **sens contraires**.
:::

:::theoreme Suites extraites
Si $(u_{2n})$ et $(u_{2n+1})$ convergent vers la **même** limite $\ell$, alors $(u_n)$ converge vers $\ell$.
:::

:::exemple
$u_0 = 1$, $u_{n+1} = \dfrac{1}{1 + u_n}$ sur $I = [\frac{1}{2} ; 1]$ : $f$ est décroissante, la suite oscille autour de $\ell = \dfrac{\sqrt{5} - 1}{2}$. On montre que $(u_{2n})$ décroît, $(u_{2n+1})$ croît, et que les deux tendent vers $\ell$ (unique point fixe de $g$ dans $I$).
:::

## Majorer l'écart à la limite

:::theoreme Inégalité des accroissements finis appliquée aux suites
Si $f$ est dérivable sur $I$ stable, si $|f'(x)| \leqslant k$ pour tout $x \in I$ avec $0 \leqslant k < 1$, et si $\ell \in I$ vérifie $f(\ell) = \ell$, alors pour tout $n$ :
$$|u_{n+1} - \ell| \leqslant k\,|u_n - \ell| \qquad\text{puis}\qquad |u_n - \ell| \leqslant k^n\,|u_0 - \ell|.$$
Comme $0 \leqslant k < 1$, $k^n \to 0$ : la suite converge vers $\ell$, sans étude de monotonie.
:::

:::methode Cette méthode au BAC SM
1. Montrer $|f'(x)| \leqslant k$ sur $I$ (étude de $f'$).
2. Appliquer l'inégalité des accroissements finis entre $u_n$ et $\ell$ : $|f(u_n) - f(\ell)| \leqslant k |u_n - \ell|$.
3. Récurrence : $|u_n - \ell| \leqslant k^n |u_0 - \ell|$.
4. Conclure par comparaison, et, si demandé, trouver un rang $n$ tel que $k^n |u_0 - \ell| \leqslant 10^{-p}$.
:::

:::app Applique
Soit $u_0 = 0$ et $u_{n+1} = \dfrac{1}{4}\cos(u_n) + 1$. On admet que $u_n \in [1 ; \frac{5}{4}]$ pour $n \geqslant 1$ et que l'équation $x = \frac{1}{4}\cos x + 1$ a une unique solution $\ell$. Montre que $|u_{n+1} - \ell| \leqslant \frac{1}{4}|u_n - \ell|$ et conclus.
:::solution Correction
$f(x) = \frac{1}{4}\cos x + 1$ est dérivable et $|f'(x)| = \frac{1}{4}|\sin x| \leqslant \frac{1}{4}$. Par l'inégalité des accroissements finis : $|f(u_n) - f(\ell)| \leqslant \frac{1}{4}|u_n - \ell|$, c'est-à-dire $|u_{n+1} - \ell| \leqslant \frac{1}{4}|u_n - \ell|$.

Par récurrence, $|u_n - \ell| \leqslant \left(\frac{1}{4}\right)^n |u_0 - \ell|$. Comme $\left(\frac{1}{4}\right)^n \to 0$, on obtient $\lim u_n = \ell$.
:::
:::

:::aretenir
- Intervalle stable $\to$ monotonie $\to$ convergence $\to$ point fixe dans $I$.
- $f$ croissante : comparer $u_0$ et $u_1$. $f$ décroissante : étudier $(u_{2n})$ et $(u_{2n+1})$.
- $|f'| \leqslant k < 1$ : $|u_n - \ell| \leqslant k^n |u_0 - \ell|$, convergence et vitesse en même temps.
:::

:::funnel Suites récurrentes
:::$L$, resume=$R$## Suites récurrentes — l'essentiel

:::aretenir La méthode en 4 étapes
1. **Intervalle stable** : $f(I) \subset I$ et $u_0 \in I$ $\Rightarrow$ $u_n \in I$ pour tout $n$.
2. **Monotonie** : signe de $u_{n+1} - u_n$, ou, si $f$ croissante sur $I$, comparer $u_0$ et $u_1$.
3. **Convergence** : monotone et bornée.
4. **Limite** : $f$ continue $\Rightarrow$ $\ell = f(\ell)$, on garde la solution qui est dans $I$.
:::

:::aretenir Si $f$ est décroissante sur $I$
$g = f \circ f$ est croissante : $(u_{2n})$ et $(u_{2n+1})$ sont monotones de sens contraires. Si elles ont la même limite, $(u_n)$ converge vers elle.
:::

:::aretenir Majoration de l'écart (niveau SM)
Si $|f'(x)| \leqslant k < 1$ sur $I$ et $f(\ell) = \ell$, alors $|u_{n+1} - \ell| \leqslant k\,|u_n - \ell|$, d'où $|u_n - \ell| \leqslant k^n |u_0 - \ell| \to 0$.
:::

:::attention Les 3 pièges du BAC
1. Résoudre $\ell = f(\ell)$ **avant** d'avoir prouvé la convergence.
2. Oublier d'éliminer la solution parasite qui n'est pas dans l'intervalle stable.
3. Déduire la monotonie de $(u_n)$ des variations de $f$ seules.
:::$R$, objectives=$O$Trouver un intervalle stable par $f$ et l'exploiter par récurrence.
Déterminer la monotonie d'une suite récurrente quand $f$ est croissante.
Prouver la convergence puis calculer la limite comme point fixe de $f$.
Traiter le cas où $f$ est décroissante à l'aide des suites extraites $(u_{2n})$ et $(u_{2n+1})$.
Utiliser l'inégalité des accroissements finis pour majorer $|u_n - \ell|$.$O$, difficulty=3, duration_min=60, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='suites' and l.position=5;

update lessons l set title=$T$Fiche de révision — Suites$T$, kind='resume', body=$L$:::aretenir Définitions et monotonie
Récurrence : énoncer $P(n)$, initialiser, hériter pour **un** $n$ fixé, conclure.
Monotonie : signe de $u_{n+1} - u_n$ ; quotient à $1$ si $u_n > 0$ ; variations de $f$ si $u_n = f(n)$ ; récurrence si $u_{n+1} = f(u_n)$ avec $f$ croissante.
:::

:::aretenir Suites de référence
Arithmétique : $u_n = u_p + (n-p)r$ ; somme $= N \times \dfrac{\text{premier} + \text{dernier}}{2}$.
Géométrique : $u_n = u_p q^{n-p}$ ; somme $= \text{premier} \times \dfrac{1 - q^N}{1 - q}$ ($q \neq 1$), avec $N = n - p + 1$.
$q^n \to +\infty$ ($q > 1$), $\to 0$ ($|q| < 1$), pas de limite ($q \leqslant -1$).
:::

:::aretenir Prouver la convergence
| Outil | Hypothèses | Donne |
| --- | --- | --- |
| Gendarmes | $u_n \leqslant v_n \leqslant w_n$, même limite | la limite |
| Limite monotone | monotone et bornée | l'existence |
| Adjacentes | croissante, décroissante, écart $\to 0$ | même limite, encadrée |
| Contraction | $\lvert u_n - \ell \rvert \leqslant k^n \lvert u_0 - \ell \rvert$, $k < 1$ | limite et vitesse |
:::

:::aretenir Suites récurrentes
Intervalle stable, monotonie, convergence, puis $\ell = f(\ell)$ avec $\ell \in I$. Si $f$ décroît : $(u_{2n})$ et $(u_{2n+1})$.
Arithmético-géométrique $u_{n+1} = a u_n + b$ ($a \neq 1$) : $v_n = u_n - \dfrac{b}{1-a}$ est géométrique de raison $a$.
:::

:::attention Réflexes anti-pièges
Une suite bornée ne converge pas forcément. La limite d'une suite croissante majorée par $M$ n'est pas forcément $M$. Les inégalités strictes deviennent larges à la limite.
:::$L$, resume=null, objectives=null, difficulty=1, duration_min=15, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='suites' and l.position=6;

update lessons l set title=$T$Méthodes & exercices types$T$, kind='cours', body=$L$## Comment lire cette notion

Chaque type ci-dessous correspond à une question qui revient au BAC SM. Pour chacun : le réflexe, la rédaction attendue, un exemple traité. Les numéros de questions suivent l'ordre habituel des sujets nationaux.

## Suites récurrentes et récurrence

:::methode Problème complet sur $u_{n+1} = f(u_n)$
1. Étudier $f$ sur $I$ (variations, signe de $f(x) - x$).
2. Montrer par récurrence que $u_n \in I$.
3. Monotonie : signe de $f(u_n) - u_n$.
4. Convergence, puis $\ell = f(\ell)$ avec $\ell \in I$.
:::

:::exemple Traité
Soit $f(x) = x - \ln(1 + x)$ sur $[0 ; +\infty[$ et $u_0 = 1$, $u_{n+1} = f(u_n)$.

**(a)** $f'(x) = 1 - \dfrac{1}{1+x} = \dfrac{x}{1+x} \geqslant 0$ : $f$ est croissante, $f(0) = 0$, donc $f(x) \geqslant 0$ pour $x \geqslant 0$.

**(b)** Par récurrence, $u_n \geqslant 0$ : vrai pour $n = 0$, et $u_n \geqslant 0 \Rightarrow u_{n+1} = f(u_n) \geqslant 0$.

**(c)** $u_{n+1} - u_n = -\ln(1 + u_n) \leqslant 0$ : la suite est décroissante.

**(d)** Décroissante et minorée par $0$ : elle converge vers $\ell \geqslant 0$. Par continuité, $\ell = \ell - \ln(1 + \ell)$, d'où $\ln(1+\ell) = 0$ et $\ell = 0$.
:::

:::app Applique
Soit $u_0 = 2$ et $u_{n+1} = \dfrac{u_n^2 + 4}{2u_n}$. Montre par récurrence que $u_n \geqslant 2$, puis que $(u_n)$ converge et donne sa limite.
:::solution Correction
**Minoration.** $u_0 = 2$. Si $u_n \geqslant 2 > 0$, alors $u_{n+1} - 2 = \dfrac{u_n^2 - 4u_n + 4}{2u_n} = \dfrac{(u_n - 2)^2}{2u_n} \geqslant 0$. Donc $u_n \geqslant 2$ pour tout $n$.

**Monotonie.** $u_{n+1} - u_n = \dfrac{4 - u_n^2}{2u_n} \leqslant 0$ car $u_n \geqslant 2$ : la suite est décroissante.

**Limite.** Décroissante et minorée par $2$ : elle converge vers $\ell \geqslant 2$, avec $\ell = \dfrac{\ell^2 + 4}{2\ell}$, soit $\ell^2 = 4$ et $\ell = 2$.
:::
:::

## Limites par comparaison

:::methode Encadrer une somme de $n$ termes
Encadrer chaque terme $a_k$ entre le plus petit et le plus grand d'entre eux, puis multiplier par le nombre de termes.
:::

:::exemple
$S_n = \displaystyle\sum_{k=n+1}^{2n} \frac{1}{k}$ comporte $n$ termes, chacun compris entre $\frac{1}{2n}$ et $\frac{1}{n+1}$. Donc $\frac{1}{2} \leqslant S_n \leqslant \frac{n}{n+1} < 1$ : $(S_n)$ est bornée. On montre de plus que $S_{n+1} - S_n = \dfrac{1}{2n+1} - \dfrac{1}{2n+2} > 0$ : croissante et majorée, elle converge, vers une limite comprise entre $\frac{1}{2}$ et $1$.
:::

:::methode Comparer à une suite divergente
Pour montrer $u_n \to +\infty$, trouver une minoration $u_n \geqslant v_n$ avec $v_n \to +\infty$. Exemple classique : $\sqrt{n} \leqslant \displaystyle\sum_{k=1}^{n} \frac{1}{\sqrt{k}}$, car chaque terme est supérieur ou égal à $\frac{1}{\sqrt{n}}$.
:::

## Démontrer que deux suites sont adjacentes

:::methode Les trois vérifications, dans l'ordre
1. $u_{n+1} - u_n \geqslant 0$ : $(u_n)$ croissante.
2. $v_{n+1} - v_n \leqslant 0$ : $(v_n)$ décroissante.
3. $\lim (v_n - u_n) = 0$.

Conclure : elles convergent vers une même limite $\ell$, avec $u_n \leqslant \ell \leqslant v_n$. Cet encadrement donne une **valeur approchée** de $\ell$ à $v_n - u_n$ près.
:::

:::exemple Moyennes arithmético-harmoniques
$0 < a_0 < b_0$, $b_{n+1} = \dfrac{a_n + b_n}{2}$, $a_{n+1} = \dfrac{2a_n b_n}{a_n + b_n}$. On montre $a_n \leqslant b_n$, puis $(a_n)$ croissante, $(b_n)$ décroissante, et $b_{n+1} - a_{n+1} \leqslant \frac{1}{2}(b_n - a_n)$, d'où $b_n - a_n \leqslant \frac{b_0 - a_0}{2^n} \to 0$. Comme $a_{n+1} b_{n+1} = a_n b_n$, la limite commune $\ell$ vérifie $\ell^2 = a_0 b_0$ : $\ell = \sqrt{a_0 b_0}$.
:::

## Suite auxiliaire géométrique

:::methode
Pour $u_{n+1} = a u_n + b$ avec $a \neq 1$ : chercher $\ell$ tel que $\ell = a\ell + b$, poser $v_n = u_n - \ell$ et montrer $v_{n+1} = a v_n$. Pour une suite homographique $u_{n+1} = \dfrac{\alpha u_n + \beta}{\gamma u_n + \delta}$, l'énoncé propose en général $v_n = \dfrac{u_n - \ell_1}{u_n - \ell_2}$, où $\ell_1$ et $\ell_2$ sont les points fixes.
:::

## Suites définies par une somme

:::methode Étudier $S_n = \displaystyle\sum_{k=1}^{n} a_k$
1. **Monotonie** : $S_{n+1} - S_n = a_{n+1}$, donc $(S_n)$ est croissante si les $a_k$ sont positifs.
2. **Majoration** : comparer $a_k$ à un terme qui se **télescope**, du type $b_{k-1} - b_k$.
3. **Conclusion** : croissante et majorée, donc convergente.
:::

:::exemple Télescopage
$\dfrac{1}{k(k+1)} = \dfrac{1}{k} - \dfrac{1}{k+1}$, donc
$$\sum_{k=1}^{n} \frac{1}{k(k+1)} = \left(1 - \frac{1}{2}\right) + \left(\frac{1}{2} - \frac{1}{3}\right) + \cdots + \left(\frac{1}{n} - \frac{1}{n+1}\right) = 1 - \frac{1}{n+1} \xrightarrow[n \to +\infty]{} 1.$$
:::

:::app Applique
Soit $S_n = \displaystyle\sum_{k=1}^{n} \frac{1}{\sqrt{k}}$. Montre que $S_n \geqslant \sqrt{n}$ pour tout $n \geqslant 1$, puis déduis-en $\lim S_n$.
:::solution Correction
Pour $1 \leqslant k \leqslant n$, on a $\sqrt{k} \leqslant \sqrt{n}$, donc $\dfrac{1}{\sqrt{k}} \geqslant \dfrac{1}{\sqrt{n}}$. En sommant les $n$ inégalités : $S_n \geqslant n \times \dfrac{1}{\sqrt{n}} = \sqrt{n}$. Comme $\sqrt{n} \to +\infty$, par comparaison $S_n \to +\infty$.
:::
:::

:::aretenir
- Problème récurrent : stabilité, monotonie, convergence, point fixe dans $I$.
- Somme de $n$ termes : encadrer chaque terme puis multiplier par $n$.
- Adjacentes : croissante, décroissante, écart $\to 0$ ; encadrement de la limite.
- Relation affine : suite auxiliaire géométrique.
:::

:::funnel Méthodes & exercices types
:::$L$, resume=$R$## Méthodes sur les suites — l'essentiel

:::aretenir Choisir son outil
| L'énoncé contient… | Outil |
| --- | --- |
| « montrer que pour tout $n$ » | récurrence |
| $u_{n+1} = f(u_n)$ | intervalle stable, monotonie, point fixe |
| $\sin n$, $(-1)^n$, une somme de $n$ termes | encadrement |
| deux suites $(u_n)$ et $(v_n)$ couplées | suites adjacentes |
| $u_{n+1} = a u_n + b$ | suite auxiliaire géométrique |
:::

:::attention Les 3 pièges du BAC
1. Sauter l'étape « intervalle stable » : la suite n'est alors ni bornée ni bien définie.
2. Encadrer avec deux bornes de limites différentes.
3. Oublier, pour des suites adjacentes, l'une des trois conditions.
:::$R$, objectives=$O$Reconnaître le type d'un exercice de suites et choisir l'outil adapté.
Enchaîner récurrence, monotonie, convergence et limite dans un problème complet.
Conclure une limite par comparaison ou encadrement.
Démontrer que deux suites sont adjacentes et exploiter l'encadrement de la limite.$O$, difficulty=2, duration_min=50, bac_frequency=3
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='suites' and l.position=50;

update lessons l set title=$T$Approfondissement : arithmético-géométriques & séries$T$, kind='cours', body=$L$## Pourquoi cette notion

Les suites arithmético-géométriques et les sommes géométriques modélisent les remboursements, les populations avec apport constant, les concentrations avec injection régulière. Au BAC SM, elles servent aussi de brique dans les problèmes d'analyse (sommes de Riemann, suites définies par une intégrale).

## Suites arithmético-géométriques

:::theoreme
Soit $u_{n+1} = a u_n + b$ avec $a \neq 1$ et $\ell = \dfrac{b}{1 - a}$ (l'unique point fixe). Alors la suite $v_n = u_n - \ell$ est géométrique de raison $a$ et
$$u_n = \ell + (u_0 - \ell)\,a^n.$$
:::

:::demonstration
$v_{n+1} = u_{n+1} - \ell = a u_n + b - (a\ell + b) = a(u_n - \ell) = a v_n$, car $\ell = a\ell + b$.
:::

:::propriete Comportement
- Si $|a| < 1$ : $u_n \to \ell$ pour tout $u_0$.
- Si $a > 1$ : $u_n \to +\infty$ si $u_0 > \ell$, $u_n \to -\infty$ si $u_0 < \ell$, et $u_n = \ell$ si $u_0 = \ell$.
- Si $a \leqslant -1$ et $u_0 \neq \ell$ : pas de limite.
:::

:::exemple Un médicament
On injecte $2$ mL d'un produit chaque heure, et l'organisme en élimine $20\,\%$ par heure. Avec $u_0 = 0$ : $u_{n+1} = 0{,}8\,u_n + 2$. Point fixe : $\ell = \dfrac{2}{0{,}2} = 10$. Donc $u_n = 10 - 10 \times 0{,}8^n$ et la quantité se stabilise vers $10$ mL.
:::

## Suites homographiques

:::methode
Pour $u_{n+1} = \dfrac{\alpha u_n + \beta}{\gamma u_n + \delta}$ avec deux points fixes distincts $\ell_1$ et $\ell_2$, la suite $v_n = \dfrac{u_n - \ell_1}{u_n - \ell_2}$ est géométrique. On en déduit $v_n$, puis $u_n$ en inversant : $u_n = \dfrac{\ell_1 - \ell_2 v_n}{1 - v_n}$.
:::

:::exemple
$u_0 = 0$, $u_{n+1} = \dfrac{2u_n + 3}{u_n + 4}$. Points fixes : $\ell^2 + 2\ell - 3 = 0$, soit $\ell_1 = 1$ et $\ell_2 = -3$. On pose $v_n = \dfrac{u_n - 1}{u_n + 3}$ :
$$v_{n+1} = \frac{\frac{2u_n + 3}{u_n + 4} - 1}{\frac{2u_n + 3}{u_n + 4} + 3} = \frac{u_n - 1}{5u_n + 15} = \frac{1}{5}v_n.$$
$v_0 = -\frac{1}{3}$, donc $v_n = -\frac{1}{3}\left(\frac{1}{5}\right)^n \to 0$ et $u_n \to 1$.
:::

## Somme d'une série géométrique

:::theoreme
Pour $q \neq 1$ : $\displaystyle S_n = \sum_{k=0}^{n} q^k = \frac{1 - q^{n+1}}{1 - q}$. Si $|q| < 1$, alors $q^{n+1} \to 0$ et
$$\lim_{n \to +\infty} S_n = \frac{1}{1 - q}.$$
:::

:::exemple Un nombre décimal périodique
$0{,}\overline{7} = 0{,}777\ldots = \displaystyle\sum_{k=1}^{+\infty} \frac{7}{10^k} = \frac{7}{10} \times \frac{1}{1 - \frac{1}{10}} = \frac{7}{9}.$
:::

:::attention Quand la somme ne commence pas à $0$
$\displaystyle\sum_{k=p}^{n} q^k = q^p \times \frac{1 - q^{n-p+1}}{1 - q}$, qui tend vers $\dfrac{q^p}{1 - q}$ si $|q| < 1$. Le premier terme est $q^p$, pas $1$.
:::

## Croissances comparées

:::theoreme
Pour tout $k > 0$ et tout $q > 1$ :
$$\lim_{n \to +\infty} \frac{n^k}{q^n} = 0, \qquad \lim_{n \to +\infty} \frac{q^n}{n!} = 0, \qquad \lim_{n \to +\infty} \frac{\ln n}{n^k} = 0.$$
:::

:::demonstration Cas $\dfrac{q^n}{n!}$
Soit $N$ un entier tel que $N \geqslant 2q$. Pour $n > N$ : $\dfrac{q^n}{n!} = \dfrac{q^N}{N!} \times \displaystyle\prod_{k=N+1}^{n} \frac{q}{k} \leqslant \frac{q^N}{N!} \left(\frac{1}{2}\right)^{n-N}$, qui tend vers $0$. Les gendarmes concluent.
:::

:::exemple
$\dfrac{n^3 + 2^n}{3^n} = \dfrac{n^3}{3^n} + \left(\dfrac{2}{3}\right)^n \to 0 + 0 = 0$.
:::

## Sommes télescopiques

:::propriete
Si $a_k = b_k - b_{k+1}$ pour tout $k$, alors $\displaystyle\sum_{k=p}^{n} a_k = b_p - b_{n+1}$. La somme converge si et seulement si $(b_n)$ converge, et sa limite vaut $b_p - \lim b_n$.
:::

:::methode Faire apparaître un télescopage
- Fraction rationnelle : décomposer, par exemple $\dfrac{1}{k(k+2)} = \dfrac{1}{2}\left(\dfrac{1}{k} - \dfrac{1}{k+2}\right)$ (le télescopage saute alors un rang).
- Logarithme : $\ln\left(1 + \dfrac{1}{k}\right) = \ln(k+1) - \ln k$.
- Racines : $\sqrt{k+1} - \sqrt{k}$.
:::

:::exemple Un produit qui se télescope
$P_n = \displaystyle\prod_{k=2}^{n} \left(1 - \frac{1}{k^2}\right) = \prod_{k=2}^{n} \frac{(k-1)(k+1)}{k \cdot k} = \frac{1}{2} \times \frac{n+1}{n}$, donc $\lim P_n = \dfrac{1}{2}$.
:::

## Applications concrètes

:::app Applique
Un capital de $10\,000$ DH est placé à $5\,\%$ par an et l'on retire $800$ DH à la fin de chaque année. On note $C_n$ le capital après $n$ années. Exprime $C_n$ et indique si le capital s'épuise.
:::solution Correction
$C_{n+1} = 1{,}05\,C_n - 800$ et $C_0 = 10\,000$. Point fixe : $\ell = \dfrac{-800}{1 - 1{,}05} = 16\,000$. Donc $C_n = 16\,000 + (10\,000 - 16\,000) \times 1{,}05^n = 16\,000 - 6\,000 \times 1{,}05^n$.

Comme $1{,}05^n \to +\infty$, $C_n \to -\infty$ : le capital finit par s'épuiser. Il devient négatif dès que $1{,}05^n > \frac{8}{3}$, soit $n > \dfrac{\ln(8/3)}{\ln 1{,}05} \approx 20{,}1$, donc au cours de la 21ᵉ année.
:::
:::

:::aretenir
- $u_{n+1} = au_n + b$ : $u_n = \ell + (u_0 - \ell)a^n$, $\ell = \dfrac{b}{1-a}$.
- Homographique : $v_n = \dfrac{u_n - \ell_1}{u_n - \ell_2}$ géométrique.
- $\sum q^k \to \dfrac{1}{1-q}$ si $|q| < 1$ (attention au premier terme).
- $\ln n \ll n^k \ll q^n \ll n!$.
:::

:::funnel Suites arithmético-géométriques et sommes
:::$L$, resume=$R$## Approfondissement — l'essentiel

:::aretenir Arithmético-géométrique
$u_{n+1} = a u_n + b$, $a \neq 1$ : $\ell = \dfrac{b}{1-a}$ et $u_n = \ell + (u_0 - \ell)\,a^n$.
Si $|a| < 1$, $u_n \to \ell$ quel que soit $u_0$.
:::

:::aretenir Série géométrique
Pour $|q| < 1$ : $\displaystyle\lim_{n \to +\infty} \sum_{k=0}^{n} q^k = \frac{1}{1-q}$. Si $|q| \geqslant 1$, la somme n'a pas de limite finie.
:::

:::aretenir Croissances comparées
Pour $q > 1$ et $k > 0$ : $\dfrac{n^k}{q^n} \to 0$ et $\dfrac{q^n}{n!} \to 0$. Hiérarchie : $\ln n \ll n^k \ll q^n \ll n!$.
:::

:::attention Les 3 pièges du BAC
1. Appliquer la formule de la série avec $|q| \geqslant 1$.
2. Oublier le premier terme quand la somme ne commence pas à $k = 0$.
3. Inverser la hiérarchie entre $n^k$ et $q^n$.
:::$R$, objectives=$O$Résoudre complètement une suite arithmético-géométrique.
Calculer la limite de la somme des termes d'une suite géométrique.
Utiliser les croissances comparées pour lever une indétermination entre puissances, factorielles et exponentielles.
Exploiter une suite homographique à l'aide d'une suite auxiliaire.$O$, difficulty=3, duration_min=45, bac_frequency=2
from chapters c join tracks t on t.id=c.track_id join subjects s on s.id=c.subject_id
where l.chapter_id=c.id and s.code='maths' and t.code in ('sm_a','sm_b') and c.code='suites' and l.position=60;
