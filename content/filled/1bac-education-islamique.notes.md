# 1BAC Éducation islamique — notes de livraison

Fichier : `content/filled/1bac-education-islamique.json` (pack `bacup.cours/v1`, `subject: islamique`, `level: 1bac`, `track: null`).
Structure du scaffold inchangée : 7 chapitres, 28 leçons, tous les `code` / `ref` / titres intacts. 28/28 leçons écrites en arabe,
28/28 au-dessus de la barre de richesse, `validate-pack.mjs` : **0 erreur**.

## Contenu

| Chapitre | Leçons | Notes |
|---|---|---|
| سورة يوسف | 6 أشطر | آيات groupées par unités de sens (2 à 6 versets), شرح المفردات, المعنى الإجمالي, القيم المستنبطة, tableau de liens avec les مداخل |
| مدخل التزكية | 4 | |
| مدخل الاقتداء | 4 | `timeline` pour الحديبية وفتح مكة |
| مدخل الاستجابة | 4 | tableaux أركان الزواج et أنواع العدة |
| مدخل القسط | 4 | |
| مدخل الحكمة | 4 | |
| منهجية | 2 | vraie structure de la وضعية مشكلة, exemple complet traité, règles de citation |

Chaque leçon de مدخل contient : نصوص الانطلاق (`aya` / `hadith`), `mafhoum`, un bloc visuel, « علاقة الدرس بسورة يوسف » (versets tirés de
`Alaqat-dourous-bi-sourat-Youssef`), `regional` + `modele`, `tanbih`, `app` + `solution`, et une fiche `resume`.
Toutes les formulations sont réécrites ; le contenu factuel suit la synthèse « session 2026 » du kit.

## Vérification des آيات et des أحاديث

- **Les 150 blocs `aya`** ne sont pas tapés à la main : ils sont générés par script depuis un texte coranique numérique (package npm `quran-json`,
  rasm uthmani), avec la référence calculée. Les signes de hizb (۞) ont été retirés.
- **Toutes les citations coraniques en ligne** (`﴿ … ﴾`) ont été comparées au même texte (comparaison tolérante à l'orthographe et aux voyelles).
  Deux erreurs ont ainsi été trouvées et corrigées pendant la rédaction (ex. « غيابت الجب », graphie du mushaf).
- **Les 37 blocs `hadith`** (et les citations en « » dans les `modele`) ont été comparés mot à mot, voyelles ignorées, à la base du package npm `hadith`
  (Bukhari, Muslim, Tirmidhi, Abu Dawud, Nasa'i, Ibn Majah, Muwatta, Ahmad, Adab al-Mufrad). Le rawi et le recueil indiqués en titre correspondent à cette base.
- Attention : la comparaison est automatique. Elle prouve que le texte existe dans la source, pas que l'attribution ou le degré est le bon dans chaque cas.

## À faire valider par une personne

1. **Atar et paroles sans source numérique** (reprises du manuel officiel du kit, non retrouvées dans la base) :
   - Ibn Mas'ud : « الصبر نصف الإيمان، واليقين الإيمان كله » (`qist-02`).
   - `iqtida-03` : « والله ما زنيت في جاهلية ولا في إسلام » (attribué à Othman), et la parole de Hasan al-Basri sur son hayâ'.
   - `qist-03` : deux paroles de `Ali b. Abi Talib` sur la hayâ' et la 'iffa.
   - `istijaba-03` : récit de `Omar` et de l'enfant trouvé (en `wathiqa`, reformulé).
2. **Degrés** : `iqtida-03` cite Bukhari en `ta'liq` (rumah, jaysh al-'usra) ; `iqtida-04` cite l'Adab al-Mufrad ; `qist-03` cite Ibn Majah ;
   `qist-02` cite Ahmad (hadith d'Abu Bakr). Le hadith de `istijaba-01` (« ترضون دينه وخلقه ») est discuté chez Tirmidhi (hasan, avec une variante mursal).
3. **Dates et chiffres** repris du manuel : Hudaybiya dhu al-qa'da 6 H ; Fath Makka 20 Ramadan 8 H ; 10 000 combattants ; durée et coefficient de l'examen
   (« ساعة ونصف », coefficient 2, lus dans l'en-tête de l'examen 2017).
4. **Désaccords d'exégèse signalés dans le texte** : qui prononce 12:52-53 ; le témoin de 12:26 (rapporté comme nourrisson dans le manuel).
5. **`bac_frequency`** : estimé par jugement à partir des annales lisibles en texte (3 sessions) et du cadre 2020. Ce ne sont pas des statistiques.

## Côté application (avant l'import)

- Le pack utilise des blocs que `src/` ne connaît pas encore : `aya`, `hadith`, `mafhoum`, `qaida`, `manhajiya`, `tanbih`, `khoulasa`, `wathiqa`,
  `mithal`, `parcoeur`, `regional`, `modele`, `timeline`, `schema`, `carte`. Un `grep` dans `src/` n'en trouve aucun.
- `src/app/admin/import-cours/page.tsx` attend aujourd'hui un **tableau JSON** de notions avec `id` / `chapter_id`, pas un pack `bacup.cours/v1`
  avec `code` / `ref`. Il faudra l'adapter (ou convertir le pack) avant d'importer.
- Les آيات sont en rasm uthmani (ex. `ٱلصَّلَوٰةَ`) : prévoir une police coranique pour les blocs `aya`.
