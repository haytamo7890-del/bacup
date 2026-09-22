/**
 * Landing-page copy in 3 languages: French (default), Arabic (RTL), English.
 * Kept in config per project rule "content/config lives in src/config".
 * Graph metrics & testimonials are illustrative/aspirational (labelled in the UI).
 */

export type Lang = "fr" | "ar" | "en";
export const LANGS: { code: Lang; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "fr", label: "FR", dir: "ltr" },
  { code: "ar", label: "ع", dir: "rtl" },
  { code: "en", label: "EN", dir: "ltr" },
];

type Stat = { v: string; l: string };
type Item = { t: string; d: string };
type Testimonial = { name: string; meta: string; quote: string };

export type Dict = {
  nav: { features: string; impact: string; pricing: string; login: string; cta: string };
  hero: {
    badge: string;
    lead: string;
    rotate: string[];
    sub: string;
    cta: string;
    demo: string;
    ctaSub: string;
    social: string;
  };
  circuits: {
    eyebrow: string;
    title: string;
    sub: string;
    b1: { tag: string; name: string; desc: string; filieres: string[]; cta: string };
    b2: { tag: string; name: string; desc: string; filieres: string[]; cta: string };
  };
  dash: { caption: string; k1: string; k2: string; k3: string; k4: string; note: string; run: string };
  features: { eyebrow: string; title: string; sub: string; items: Item[]; edge: string };
  impact: {
    eyebrow: string;
    title: string;
    sub: string;
    tabPerf: string;
    tabProg: string;
    perf: Stat[];
    prog: Stat[];
    footnote: string;
  };
  compare: {
    eyebrow: string;
    title: string;
    sub: string;
    withoutTitle: string;
    without: string[];
    withTitle: string;
    withList: string[];
  };
  books: {
    eyebrow: string;
    title: string;
    sub: string;
    b1: string;
    b1sub: string;
    b2: string;
    b2sub: string;
    filieres: string[];
  };
  game: {
    eyebrow: string;
    title: string;
    sub: string;
    xp: string;
    level: string;
    streak: string;
    streakUnit: string;
    rank: string;
    note: string;
    mastery: string;
  };
  parent: {
    eyebrow: string;
    title: string;
    sub: string;
    cardTitle: string;
    student: string;
    noteLabel: string;
    streakLabel: string;
    progLabel: string;
    cta: string;
  };
  social2: { eyebrow: string; title: string; items: Testimonial[] };
  pricing: {
    eyebrow: string;
    title: string;
    sub: string;
    badge: string;
    per: string;
    trial: string;
    features: string[];
    cta: string;
    guarantee: string;
  };
  founder: { pre: string; quote: string; name: string; role: string };
  finalCta: { title: string; sub: string; cta: string; micro: string };
  footer: { tagline: string; rights: string; product: string; links: string[] };
};

const fr: Dict = {
  nav: { features: "Fonctionnalités", impact: "Impact", pricing: "Tarif", login: "Connexion", cta: "Commencer gratuitement" },
  hero: {
    badge: "1bac-up · 2bac-up — tout le BAC marocain en un seul espace",
    lead: "Le BAC marocain,",
    rotate: ["dans un seul espace.", "avec la mention en vue.", "coaché par l’IA, 24h/24."],
    sub: "Examens chronométrés notés /20, corrections détaillées, une IA qui t’explique tout et un coach qui te dit quoi réviser. 1bac et 2bac. Fini les PDF éparpillés.",
    cta: "Commencer gratuitement",
    demo: "Voir la démo",
    ctaSub: "Essai 3 jours · sans carte bancaire",
    social: "+1000 élèves révisent déjà avec Bac-up",
  },
  circuits: {
    eyebrow: "Choisis ton circuit",
    title: "Deux parcours. Ton BAC, du début à la fin.",
    sub: "On est les seuls à couvrir la 1ère année aussi. Ta base compte autant que l’examen national.",
    b1: {
      tag: "Régional",
      name: "1bac-up",
      desc: "Première année du Bac. Construis des bases solides avant le national — là où les autres t’abandonnent.",
      filieres: ["Sciences Maths", "Sciences Exp.", "Tronc commun"],
      cta: "Choisir 1bac-up",
    },
    b2: {
      tag: "National",
      name: "2bac-up",
      desc: "Deuxième année du Bac. Vrais sujets, examens blancs, corrections et coaching jusqu’au jour J.",
      filieres: ["Maths A/B", "PC", "SVT", "Éco"],
      cta: "Choisir 2bac-up",
    },
  },
  dash: {
    caption: "Ton tableau de bord — tout ce qui compte, en un coup d’œil.",
    k1: "Note estimée",
    k2: "Précision",
    k3: "Série",
    k4: "Rang",
    note: "Progression par matière",
    run: "Reprendre l’entraînement",
  },
  features: {
    eyebrow: "Le produit",
    title: "Tout pour comprendre, t’entraîner et progresser.",
    sub: "Un espace pensé pour le programme officiel marocain.",
    items: [
      { t: "Moteur d’examens /20", d: "Vrais sujets et examens blancs, chronométrés, notés sur 20 comme le jour J." },
      { t: "IA qui explique (5 modes)", d: "Explique autrement, Étapes, Cours, Erreurs, Méthode — jusqu’à ce que tu comprennes vraiment." },
      { t: "Coach IA", d: "Il analyse tes résultats et te dit précisément quoi réviser aujourd’hui." },
      { t: "Corrections détaillées", d: "Nos propres corrections, écrites étape par étape. Rigoureuses et claires." },
    ],
    edge: "Le seul à couvrir 1bac ET 2bac — ta base et ton examen, au même endroit.",
  },
  impact: {
    eyebrow: "L’impact",
    title: "Vois ce que Bac-up change.",
    sub: "Des gains de performance immédiats à la progression sur toute l’année.",
    tabPerf: "Performance",
    tabProg: "Progression",
    perf: [
      { v: "10×", l: "plus productif à la révision" },
      { v: "+4 pts", l: "de moyenne visée" },
      { v: "−70 %", l: "de temps perdu à chercher" },
    ],
    prog: [
      { v: "5×", l: "plus de chapitres maîtrisés" },
      { v: "95 %", l: "vont au bout de leur plan" },
      { v: "×3", l: "de régularité (série)" },
    ],
    footnote: "Objectifs illustratifs, basés sur l’usage type de la plateforme.",
  },
  compare: {
    eyebrow: "Avant / Après",
    title: "Fini le chaos. Tout au même endroit.",
    sub: "Là où ta révision est éparpillée aujourd’hui, Bac-up rassemble tout.",
    withoutTitle: "Sans Bac-up",
    without: ["PDF éparpillés partout", "Groupes WhatsApp bruyants", "ChatGPT payant à chaque question", "10 onglets, zéro plan"],
    withTitle: "Avec Bac-up",
    withList: ["Tous tes examens, un seul espace", "L’IA incluse, illimitée", "Un plan clair chaque jour", "Ta progression suivie /20"],
  },
  books: {
    eyebrow: "La bibliothèque",
    title: "Deux packs. Toutes les filières.",
    sub: "Cours, sujets et corrections — organisés, prêts, à jour.",
    b1: "Pack 1bac",
    b1sub: "Régional · les fondations",
    b2: "Pack 2bac",
    b2sub: "National · l’examen",
    filieres: ["Sciences Maths A/B", "Sciences Physiques", "SVT", "Sciences Éco"],
  },
  game: {
    eyebrow: "La motivation",
    title: "Réviser devient un jeu que tu veux gagner.",
    sub: "XP, séries, classement et maîtrise — pour revenir chaque jour.",
    xp: "XP",
    level: "Niveau",
    streak: "Série",
    streakUnit: "jours",
    rank: "Classement",
    note: "Note estimée",
    mastery: "Maîtrise des chapitres",
  },
  parent: {
    eyebrow: "Les parents",
    title: "Rassure tes parents en un partage.",
    sub: "Un rapport clair de ta progression, prêt à envoyer.",
    cardTitle: "Rapport parental",
    student: "Élève · 2bac PC",
    noteLabel: "Note estimée",
    streakLabel: "Série",
    progLabel: "Progression",
    cta: "Partager avec mes parents",
  },
  social2: {
    eyebrow: "Ils progressent",
    title: "Ce que disent les élèves de Bac-up.",
    items: [
      { name: "Yasmine", meta: "2bac SVT · Casablanca", quote: "Les corrections détaillées m’ont fait gagner 3 points en Physique. Enfin je comprends mes erreurs." },
      { name: "Mehdi", meta: "1bac SM · Rabat", quote: "Le seul qui couvre la 1ère année. J’ai construit mes bases au lieu de galérer sur YouTube." },
      { name: "Salma", meta: "2bac Maths A · Marrakech", quote: "Le coach me dit quoi réviser chaque jour. Je ne perds plus de temps à me demander par où commencer." },
      { name: "Anas", meta: "2bac PC · Fès", quote: "Les examens chronométrés notés /20, c’est exactement le jour J. J’arrive préparé, pas stressé." },
    ],
  },
  pricing: {
    eyebrow: "Le tarif",
    title: "Un prix. Tout inclus.",
    sub: "Moins cher qu’une seule séance de cours particulier — pour toute une année.",
    badge: "Accès complet",
    per: "/ an",
    trial: "Commence par 3 jours gratuits",
    features: ["Examens illimités, toutes filières", "IA illimitée (5 modes) + Coach IA", "Corrections détaillées + suivi /20", "1bac et 2bac inclus"],
    cta: "Commencer l’essai gratuit",
    guarantee: "Gratuit pour commencer · sans carte bancaire",
  },
  founder: {
    pre: "Pourquoi Bac-up",
    quote: "On a vu trop d’élèves brillants perdus entre des PDF, des groupes WhatsApp et dix vidéos. On a construit Bac-up pour que tout — comprendre, s’entraîner, progresser — tienne dans un seul espace.",
    name: "L’équipe HSGenius",
    role: "Créateurs de Bac-up",
  },
  finalCta: {
    title: "Ton BAC commence aujourd’hui.",
    sub: "Rejoins les élèves qui révisent plus intelligemment, pas plus longtemps.",
    cta: "Créer mon compte gratuit",
    micro: "Essai 3 jours · sans carte bancaire",
  },
  footer: {
    tagline: "Tout le BAC marocain, en un seul espace.",
    rights: "© 2026 HSGenius · Fait au Maroc 🇲🇦",
    product: "Produit",
    links: ["Fonctionnalités", "Impact", "Tarif", "Connexion"],
  },
};

const ar: Dict = {
  nav: { features: "المميزات", impact: "الأثر", pricing: "الأسعار", login: "تسجيل الدخول", cta: "ابدأ مجانًا" },
  hero: {
    badge: "1bac-up · 2bac-up — كل الباك المغربي في فضاء واحد",
    lead: "الباكالوريا المغربية،",
    rotate: ["في فضاء واحد.", "والميزة في الأفق.", "بمرافقة ذكاء اصطناعي، 24/24."],
    sub: "امتحانات مؤقتة بنقطة على 20، تصحيحات مفصّلة، ذكاء اصطناعي يشرح لك كل شيء ومدرّب يخبرك بما تراجعه. الأولى والثانية باك. وداعًا للملفات المبعثرة.",
    cta: "ابدأ مجانًا",
    demo: "شاهد العرض",
    ctaSub: "3 أيام مجانًا · بدون بطاقة بنكية",
    social: "أكثر من 1000 تلميذ يراجعون مع Bac-up",
  },
  circuits: {
    eyebrow: "اختر مسارك",
    title: "مساران. باكالورياك من البداية إلى النهاية.",
    sub: "نحن الوحيدون الذين يغطّون السنة الأولى أيضًا. أساسك لا يقلّ أهمية عن الامتحان الوطني.",
    b1: {
      tag: "جهوي",
      name: "1bac-up",
      desc: "السنة الأولى باك. ابنِ أساسًا متينًا قبل الوطني — حيث يتخلّى عنك الآخرون.",
      filieres: ["علوم رياضية", "علوم تجريبية", "جذع مشترك"],
      cta: "اختر 1bac-up",
    },
    b2: {
      tag: "وطني",
      name: "2bac-up",
      desc: "السنة الثانية باك. مواضيع حقيقية، امتحانات تجريبية، تصحيحات ومرافقة حتى يوم الامتحان.",
      filieres: ["رياضيات أ/ب", "فيزياء", "علوم الحياة", "اقتصاد"],
      cta: "اختر 2bac-up",
    },
  },
  dash: {
    caption: "لوحة تحكّمك — كل ما يهم، بنظرة واحدة.",
    k1: "النقطة المتوقعة",
    k2: "الدقّة",
    k3: "المتتالية",
    k4: "الترتيب",
    note: "التقدّم حسب المادة",
    run: "متابعة التمرين",
  },
  features: {
    eyebrow: "المنتج",
    title: "كل ما يلزم لتفهم، تتمرّن وتتقدّم.",
    sub: "فضاء مصمّم للبرنامج الرسمي المغربي.",
    items: [
      { t: "محرّك امتحانات على 20", d: "مواضيع حقيقية وامتحانات تجريبية، مؤقتة، بنقطة على 20 كيوم الامتحان." },
      { t: "ذكاء يشرح (5 أنماط)", d: "اشرح بطريقة أخرى، خطوات، درس، أخطاء، منهجية — حتى تفهم حقًا." },
      { t: "المدرّب الذكي", d: "يحلّل نتائجك ويخبرك بالضبط بما يجب مراجعته اليوم." },
      { t: "تصحيحات مفصّلة", d: "تصحيحاتنا الخاصة، خطوة بخطوة. دقيقة وواضحة." },
    ],
    edge: "الوحيد الذي يغطّي الأولى والثانية باك — أساسك وامتحانك في نفس المكان.",
  },
  impact: {
    eyebrow: "الأثر",
    title: "شاهد ما يغيّره Bac-up.",
    sub: "من مكاسب فورية في الأداء إلى تقدّم على مدار السنة.",
    tabPerf: "الأداء",
    tabProg: "التقدّم",
    perf: [
      { v: "×10", l: "إنتاجية أعلى في المراجعة" },
      { v: "4+ نقاط", l: "في المعدّل المستهدف" },
      { v: "−70٪", l: "من الوقت الضائع في البحث" },
    ],
    prog: [
      { v: "×5", l: "فصول مُتقنة أكثر" },
      { v: "95٪", l: "يكملون مخطّطهم" },
      { v: "×3", l: "انتظام أكبر (المتتالية)" },
    ],
    footnote: "أهداف توضيحية، مبنية على الاستعمال النموذجي للمنصة.",
  },
  compare: {
    eyebrow: "قبل / بعد",
    title: "لا فوضى بعد اليوم. كل شيء في مكان واحد.",
    sub: "حيث مراجعتك مبعثرة اليوم، يجمع Bac-up كل شيء.",
    withoutTitle: "بدون Bac-up",
    without: ["ملفات PDF مبعثرة", "مجموعات واتساب مزعجة", "ChatGPT مؤدّى عنه في كل سؤال", "10 نوافذ، بدون خطة"],
    withTitle: "مع Bac-up",
    withList: ["كل امتحاناتك في فضاء واحد", "الذكاء الاصطناعي مُضمّن، بلا حدود", "خطة واضحة كل يوم", "تقدّمك مُتابَع على 20"],
  },
  books: {
    eyebrow: "المكتبة",
    title: "حزمتان. كل الشُّعب.",
    sub: "دروس، مواضيع وتصحيحات — منظّمة، جاهزة، مُحدّثة.",
    b1: "حزمة الأولى باك",
    b1sub: "جهوي · الأسس",
    b2: "حزمة الثانية باك",
    b2sub: "وطني · الامتحان",
    filieres: ["علوم رياضية أ/ب", "علوم فيزيائية", "علوم الحياة والأرض", "علوم اقتصادية"],
  },
  game: {
    eyebrow: "التحفيز",
    title: "تصبح المراجعة لعبة تريد الفوز بها.",
    sub: "نقاط خبرة، متتاليات، ترتيب وإتقان — لتعود كل يوم.",
    xp: "خبرة",
    level: "المستوى",
    streak: "المتتالية",
    streakUnit: "أيام",
    rank: "الترتيب",
    note: "النقطة المتوقعة",
    mastery: "إتقان الفصول",
  },
  parent: {
    eyebrow: "الآباء",
    title: "طمئن والديك بمشاركة واحدة.",
    sub: "تقرير واضح عن تقدّمك، جاهز للإرسال.",
    cardTitle: "تقرير الأولياء",
    student: "تلميذ · ثانية باك فيزياء",
    noteLabel: "النقطة المتوقعة",
    streakLabel: "المتتالية",
    progLabel: "التقدّم",
    cta: "مشاركة مع والديّ",
  },
  social2: {
    eyebrow: "يتقدّمون",
    title: "ماذا يقول تلاميذ Bac-up.",
    items: [
      { name: "ياسمين", meta: "ثانية باك علوم الحياة · الدار البيضاء", quote: "التصحيحات المفصّلة ربّحتني 3 نقاط في الفيزياء. أخيرًا أفهم أخطائي." },
      { name: "مهدي", meta: "أولى باك علوم رياضية · الرباط", quote: "الوحيد الذي يغطّي السنة الأولى. بنيت أساسي بدل التعب على يوتيوب." },
      { name: "سلمى", meta: "ثانية باك رياضيات أ · مراكش", quote: "المدرّب يخبرني بما أراجعه كل يوم. لم أعد أضيّع الوقت في التساؤل من أين أبدأ." },
      { name: "أنس", meta: "ثانية باك فيزياء · فاس", quote: "امتحانات مؤقتة بنقطة على 20، تمامًا كيوم الامتحان. أصل مستعدًّا لا متوترًا." },
    ],
  },
  pricing: {
    eyebrow: "السعر",
    title: "سعر واحد. كل شيء مُضمّن.",
    sub: "أرخص من حصة دعم واحدة — لسنة كاملة.",
    badge: "وصول كامل",
    per: "/ سنة",
    trial: "ابدأ بـ 3 أيام مجانية",
    features: ["امتحانات بلا حدود، كل الشُّعب", "ذكاء بلا حدود (5 أنماط) + مدرّب", "تصحيحات مفصّلة + متابعة على 20", "الأولى والثانية باك مُضمّنتان"],
    cta: "ابدأ التجربة المجانية",
    guarantee: "مجاني للبدء · بدون بطاقة بنكية",
  },
  founder: {
    pre: "لماذا Bac-up",
    quote: "رأينا الكثير من التلاميذ النجباء تائهين بين ملفات PDF ومجموعات واتساب وعشرات الفيديوهات. بنينا Bac-up ليجتمع كل شيء — الفهم، التمرّن، التقدّم — في فضاء واحد.",
    name: "فريق HSGenius",
    role: "صنّاع Bac-up",
  },
  finalCta: {
    title: "باكالورياك تبدأ اليوم.",
    sub: "انضمّ إلى التلاميذ الذين يراجعون بذكاء، لا لوقت أطول.",
    cta: "إنشاء حسابي المجاني",
    micro: "3 أيام مجانًا · بدون بطاقة بنكية",
  },
  footer: {
    tagline: "كل الباك المغربي، في فضاء واحد.",
    rights: "© 2026 HSGenius · صُنع في المغرب 🇲🇦",
    product: "المنتج",
    links: ["المميزات", "الأثر", "الأسعار", "تسجيل الدخول"],
  },
};

const en: Dict = {
  nav: { features: "Features", impact: "Impact", pricing: "Pricing", login: "Log in", cta: "Start free" },
  hero: {
    badge: "1bac-up · 2bac-up — the whole Moroccan BAC in one space",
    lead: "The Moroccan BAC,",
    rotate: ["in one single space.", "with honours in sight.", "AI-coached, 24/7."],
    sub: "Timed exams graded out of 20, detailed corrections, an AI that explains everything and a coach that tells you what to revise. 1st and 2nd year. No more scattered PDFs.",
    cta: "Start free",
    demo: "Watch the demo",
    ctaSub: "3-day trial · no card required",
    social: "1000+ students already revise with Bac-up",
  },
  circuits: {
    eyebrow: "Choose your track",
    title: "Two paths. Your BAC, start to finish.",
    sub: "We’re the only ones covering the 1st year too. Your foundation matters as much as the national exam.",
    b1: {
      tag: "Regional",
      name: "1bac-up",
      desc: "First BAC year. Build a solid base before the national — where others leave you on your own.",
      filieres: ["Maths Sciences", "Exp. Sciences", "Common core"],
      cta: "Choose 1bac-up",
    },
    b2: {
      tag: "National",
      name: "2bac-up",
      desc: "Second BAC year. Real papers, mock exams, corrections and coaching all the way to exam day.",
      filieres: ["Maths A/B", "PC", "SVT", "Econ"],
      cta: "Choose 2bac-up",
    },
  },
  dash: {
    caption: "Your dashboard — everything that matters, at a glance.",
    k1: "Estimated grade",
    k2: "Accuracy",
    k3: "Streak",
    k4: "Rank",
    note: "Progress by subject",
    run: "Resume practice",
  },
  features: {
    eyebrow: "The product",
    title: "Everything to understand, practise and progress.",
    sub: "A space built around the official Moroccan curriculum.",
    items: [
      { t: "Exam engine /20", d: "Real papers and mock exams, timed, graded out of 20 just like the real day." },
      { t: "AI that explains (5 modes)", d: "Explain differently, Steps, Lesson, Mistakes, Method — until you truly get it." },
      { t: "AI Coach", d: "It analyses your results and tells you exactly what to revise today." },
      { t: "Detailed corrections", d: "Our own corrections, written step by step. Rigorous and clear." },
    ],
    edge: "The only one covering both 1st and 2nd year — your base and your exam, in one place.",
  },
  impact: {
    eyebrow: "The impact",
    title: "See what Bac-up changes.",
    sub: "From immediate performance wins to progress across the whole year.",
    tabPerf: "Performance",
    tabProg: "Progression",
    perf: [
      { v: "10×", l: "more productive revision" },
      { v: "+4 pts", l: "on your target average" },
      { v: "−70%", l: "less time lost searching" },
    ],
    prog: [
      { v: "5×", l: "more chapters mastered" },
      { v: "95%", l: "finish their plan" },
      { v: "×3", l: "more consistency (streak)" },
    ],
    footnote: "Illustrative targets, based on typical platform usage.",
  },
  compare: {
    eyebrow: "Before / After",
    title: "No more chaos. All in one place.",
    sub: "Where your revision is scattered today, Bac-up brings it all together.",
    withoutTitle: "Without Bac-up",
    without: ["Scattered PDFs everywhere", "Noisy WhatsApp groups", "Paid ChatGPT for every question", "10 tabs, zero plan"],
    withTitle: "With Bac-up",
    withList: ["All your exams, one space", "AI included, unlimited", "A clear plan every day", "Progress tracked /20"],
  },
  books: {
    eyebrow: "The library",
    title: "Two packs. Every track.",
    sub: "Lessons, papers and corrections — organised, ready, up to date.",
    b1: "1bac Pack",
    b1sub: "Regional · the foundations",
    b2: "2bac Pack",
    b2sub: "National · the exam",
    filieres: ["Maths Sciences A/B", "Physical Sciences", "Life Sciences", "Economics"],
  },
  game: {
    eyebrow: "The motivation",
    title: "Revision becomes a game you want to win.",
    sub: "XP, streaks, leaderboard and mastery — so you come back every day.",
    xp: "XP",
    level: "Level",
    streak: "Streak",
    streakUnit: "days",
    rank: "Rank",
    note: "Estimated grade",
    mastery: "Chapter mastery",
  },
  parent: {
    eyebrow: "Parents",
    title: "Reassure your parents in one share.",
    sub: "A clear report of your progress, ready to send.",
    cardTitle: "Parent report",
    student: "Student · 2bac PC",
    noteLabel: "Estimated grade",
    streakLabel: "Streak",
    progLabel: "Progress",
    cta: "Share with my parents",
  },
  social2: {
    eyebrow: "They’re progressing",
    title: "What Bac-up students say.",
    items: [
      { name: "Yasmine", meta: "2bac SVT · Casablanca", quote: "The detailed corrections gained me 3 points in Physics. I finally understand my mistakes." },
      { name: "Mehdi", meta: "1bac SM · Rabat", quote: "The only one covering 1st year. I built my base instead of struggling on YouTube." },
      { name: "Salma", meta: "2bac Maths A · Marrakech", quote: "The coach tells me what to revise each day. No more wondering where to start." },
      { name: "Anas", meta: "2bac PC · Fès", quote: "Timed exams graded /20 — exactly like the real day. I arrive prepared, not stressed." },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "One price. Everything included.",
    sub: "Cheaper than a single private lesson — for a whole year.",
    badge: "Full access",
    per: "/ year",
    trial: "Start with 3 free days",
    features: ["Unlimited exams, all tracks", "Unlimited AI (5 modes) + AI Coach", "Detailed corrections + /20 tracking", "1bac and 2bac included"],
    cta: "Start the free trial",
    guarantee: "Free to start · no card required",
  },
  founder: {
    pre: "Why Bac-up",
    quote: "We saw too many bright students lost between PDFs, WhatsApp groups and ten videos. We built Bac-up so that everything — understanding, practising, progressing — fits in one single space.",
    name: "The HSGenius team",
    role: "Makers of Bac-up",
  },
  finalCta: {
    title: "Your BAC starts today.",
    sub: "Join the students who revise smarter, not longer.",
    cta: "Create my free account",
    micro: "3-day trial · no card required",
  },
  footer: {
    tagline: "The whole Moroccan BAC, in one space.",
    rights: "© 2026 HSGenius · Made in Morocco 🇲🇦",
    product: "Product",
    links: ["Features", "Impact", "Pricing", "Log in"],
  },
};

export const LANDING: Record<Lang, Dict> = { fr, ar, en };
