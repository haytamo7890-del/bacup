-- =====================================================================
--  SVT (filière SVT) — approfondissement : "Méthodes & exercices types"
--  + "Approfondissement" pour les 6 chapitres génétique/immunologie.
--  Idempotent (garde position=50). Run ONCE dans Supabase → SQL Editor.
-- =====================================================================
do $seed$
declare ch uuid; svt uuid := '5f8ffc61-24f5-4cee-83c5-ab9121050196';
begin
  select id into ch from chapters where subject_id=svt and code='svtf-nature-ig';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=50) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'Méthodes & exercices types',$BODY$## Exploiter la complémentarité
:::methode Règle de Chargaff
Dans l'ADN : %A = %T et %G = %C. Connaissant un pourcentage, on déduit les autres.
:::
:::app Exercice type
Un ADN contient $30\%$ d'adénine. Donne T, G et C.
:::solution
$T=30\%$ ; G+C $=40\%$, donc $G=C=20\%$.
:::
:::methode Réplication
Chaque brin sert de matrice ; appliquer A–T, G–C pour écrire le brin fils.
:::$BODY$,'cours',50),
  (ch,'Approfondissement',$BODY$## Structure de l'ADN
:::propriete Détails
Nucléotide = phosphate + désoxyribose + base. Les brins sont **antiparallèles**, liés par des liaisons hydrogène (2 pour A–T, 3 pour G–C).
:::$BODY$,'cours',51);
  end if;

  select id into ch from chapters where subject_id=svt and code='svtf-expression-ig';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=50) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'Méthodes & exercices types',$BODY$## De la séquence à la protéine
:::methode Démarche
1. **Transcription** : écrire l'ARNm (T→A, A→U, G→C, C→G).
2. **Traduction** : découper en **codons**, lire le code → acides aminés.
:::
:::app Exercice type
Brin transcrit $\mathrm{TAC}$. Codon de l'ARNm ?
:::solution
$\mathrm{AUG}$ (codon initiateur).
:::
:::methode Effet d'une mutation
Comparer la séquence mutée à l'originale : substitution / addition / délétion.
:::$BODY$,'cours',50),
  (ch,'Approfondissement',$BODY$## Les mutations
:::propriete Types
- **Substitution** : effet parfois nul (code redondant).
- **Addition / délétion** : décalage du cadre de lecture.
Le code génétique est **universel** et **redondant**.
:::$BODY$,'cours',51);
  end if;

  select id into ch from chapters where subject_id=svt and code='svtf-genie';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=50) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'Méthodes & exercices types',$BODY$## Étapes de la transgenèse
:::methode Démarche
1. **Isoler** le gène (enzyme de restriction).
2. **Insérer** dans un plasmide (ligase) → ADN recombiné.
3. **Introduire** dans une bactérie hôte qui l'exprime.
:::
:::app Exercice type
Produire de l'insuline humaine par une bactérie ?
:::solution
Insérer le **gène de l'insuline** dans un **plasmide**, puis dans une **bactérie** transgénique.
:::$BODY$,'cours',50),
  (ch,'Approfondissement',$BODY$## PCR et électrophorèse
:::propriete Outils
- **PCR** : amplifie un fragment d'ADN.
- **Électrophorèse** : sépare les fragments selon leur **taille** (empreinte génétique).
:::$BODY$,'cours',51);
  end if;

  select id into ch from chapters where subject_id=svt and code='svtf-transmission';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=50) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'Méthodes & exercices types',$BODY$## Résoudre un croisement
:::methode Échiquier de croisement
1. Déterminer les **gamètes** de chaque parent.
2. Croiser dans un échiquier.
3. En déduire les proportions phénotypiques.
:::
:::app Exercice type
$\mathrm{Aa}\times\mathrm{Aa}$ (A dominant). Proportions ?
:::solution
$\tfrac34$ [A], $\tfrac14$ [a] (soit $3:1$).
:::
:::methode Test-cross
Croiser avec un **homozygote récessif** pour révéler le génotype.
:::$BODY$,'cours',50),
  (ch,'Approfondissement',$BODY$## Gènes liés et carte
:::propriete Liaison génétique
Deux gènes **liés** donnent des recombinés minoritaires (crossing-over). Le **% de recombinants** mesure la **distance** (centimorgans).
:::
:::app Application
$8\%$ de recombinants ⇒ $8$ centimorgans.
:::$BODY$,'cours',51);
  end if;

  select id into ch from chapters where subject_id=svt and code='svtf-population';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=50) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'Méthodes & exercices types',$BODY$## Calculs de Hardy-Weinberg
:::methode Démarche
1. De $q^{2}$ (homozygotes récessifs), tirer $q=\sqrt{q^{2}}$.
2. $p=1-q$.
3. Génotypes : $p^{2}$, $2pq$, $q^{2}$.
:::
:::app Exercice type
Maladie récessive : $1\%$ atteints. Fréquence de l'allèle et des porteurs sains ?
:::solution
$q^{2}=0{,}01\Rightarrow q=0{,}1$, $p=0{,}9$ ; porteurs $2pq=0{,}18$ (18 %).
:::$BODY$,'cours',50),
  (ch,'Approfondissement',$BODY$## Facteurs d'évolution
:::propriete Rupture de l'équilibre
Mutation, sélection naturelle, dérive génétique, migration modifient les fréquences : la population **évolue**.
:::$BODY$,'cours',51);
  end if;

  select id into ch from chapters where subject_id=svt and code='svtf-immuno';
  if ch is not null and not exists (select 1 from lessons where chapter_id=ch and position=50) then
  insert into lessons (chapter_id,title,body,kind,position) values
  (ch,'Méthodes & exercices types',$BODY$## Interpréter une réponse immunitaire
:::methode Lire une courbe d'anticorps
- 1er contact : réponse **primaire** (lente, faible).
- 2ᵉ contact : réponse **secondaire** (rapide, intense) grâce aux cellules mémoire.
:::
:::app Exercice type
Après une 2ᵉ injection, le taux d'anticorps monte plus vite et plus haut. Pourquoi ?
:::solution
Grâce à la **mémoire immunitaire** : principe de la **vaccination**.
:::$BODY$,'cours',50),
  (ch,'Approfondissement',$BODY$## Coopération cellulaire et VIH
:::propriete Rôle central des LT4
Les **LT4** coordonnent les réponses humorale (LB → anticorps) et cellulaire (LTc). Le **VIH** détruit les LT4 (**SIDA**).
:::
:::remarque Séropositivité
La présence d'anticorps anti-VIH dans le sang définit la **séropositivité**.
:::$BODY$,'cours',51);
  end if;
end $seed$;
