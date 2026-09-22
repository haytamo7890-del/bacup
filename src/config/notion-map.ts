// Maps a cours section heading (the string a funnel emits) to the notion slug
// used to tag QCU questions, so each funnel pulls ONLY its notion's exercises.
//
// The QCU questions are tagged in the DB (questions.notion) per chapter+position.
// Filtering is always scoped to one chapter's loaded questions, so an imperfect
// match degrades gracefully: if the resolved slug isn't among the chapter's
// available slugs, the caller falls back to the full chapter bank (never empty).

/** lowercase + strip accents, for robust keyword matching. */
function norm(s: string): string {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Ordered rules: [keyword, candidate slugs in priority order].
// A heading collects candidates from every matching rule (in order); the first
// candidate that exists in the chapter's available slugs wins. Ambiguous words
// (e.g. "géométrique" → arithgeo in Suites, but "géométrie" → geo in Complexes)
// list several candidates and let the chapter's own slug set disambiguate.
const RULES: [string, string[]][] = [
  // --- suites ---
  ["arithmetico", ["arithgeo"]],
  ["arithmetiqu", ["arithgeo"]],
  ["serie", ["arithgeo"]],
  ["somme", ["arithgeo"]],
  ["geometr", ["geo", "arithgeo"]],
  ["recurren", ["convergence"]],
  ["adjacent", ["convergence"]],
  ["convergence", ["convergence"]],
  ["monoton", ["convergence", "derivee"]],
  ["borne", ["convergence"]],
  ["croissance", ["limite"]],
  // --- limites / continuité ---
  ["indetermin", ["limite"]],
  ["valeurs intermediaires", ["tvi"]],
  ["dichotomie", ["tvi"]],
  ["intervalle", ["tvi"]],
  ["reciproque", ["tvi", "derivee"]],
  ["prolongement", ["continuite"]],
  ["continu", ["continuite"]],
  ["reference", ["limite"]],
  ["comparaison", ["limite"]],
  // --- dérivation / log-exp / primitives ---
  ["logarithme", ["logexp"]],
  ["exponentielle", ["logexp", "trigo"]],
  ["primitive", ["primitive"]],
  ["differentielle", ["primitive"]],
  ["tangente", ["derivee"]],
  ["extremum", ["derivee"]],
  ["convexite", ["derivee"]],
  ["inflexion", ["derivee"]],
  ["rolle", ["derivee"]],
  ["accroissement", ["derivee"]],
  ["asymptote", ["derivee"]],
  ["branches", ["derivee"]],
  ["etude", ["derivee"]],
  ["inegalite", ["propriete", "derivee"]],
  // --- intégrale ---
  ["aire", ["application", "vect"]],
  ["volume", ["application"]],
  ["fonction definie par une integrale", ["application"]],
  ["fonction integrale", ["application"]],
  ["partie", ["calcul"]],
  ["composee", ["calcul", "derivee", "limite"]],
  ["technique", ["calcul", "limite"]],
  ["positivite", ["propriete"]],
  ["moyenne", ["propriete"]],
  ["parite", ["propriete"]],
  ["symetries", ["propriete", "derivee"]],
  ["encadrement", ["propriete", "limite"]],
  ["ordre", ["propriete", "limite"]],
  // --- limites (calc) & derivée (must come after log/exp + intégral rules) ---
  ["limite", ["logexp", "limite"]],
  ["operation", ["limite", "derivee"]],
  ["deriv", ["derivee"]],
  // --- complexes ---
  ["argument", ["trigo"]],
  ["trigonometrique", ["trigo"]],
  ["moivre", ["trigo"]],
  ["linearisation", ["trigo"]],
  ["module", ["forme", "trigo"]],
  ["conjugue", ["forme"]],
  ["algebrique", ["forme"]],
  ["ensemble des nombres complexes", ["forme"]],
  ["second degre", ["equation"]],
  ["equation", ["equation"]],
  ["racine", ["equation"]],
  ["affixe", ["geo"]],
  ["distance", ["geo", "plan"]],
  ["angle", ["geo", "pscal"]],
  ["transformation", ["geo"]],
  ["lieux", ["geo"]],
  ["aligne", ["geo"]],
  // --- structures ---
  ["espace", ["ev"]],
  ["famille", ["ev"]],
  ["libre", ["ev"]],
  ["generatrice", ["ev"]],
  ["base", ["ev"]],
  ["homomorphisme", ["ev"]],
  ["dependance", ["ev"]],
  ["groupe", ["groupe"]],
  ["anneau", ["groupe"]],
  ["corps", ["groupe"]],
  ["inversible", ["groupe"]],
  ["integrite", ["groupe"]],
  ["loi", ["loi"]],
  ["composition", ["loi"]],
  ["distributivite", ["loi"]],
  // --- arithmétique ---
  ["divisibilite", ["divis"]],
  ["division", ["divis"]],
  ["premier", ["divis"]],
  ["decomposition", ["divis"]],
  ["pgcd", ["pgcd"]],
  ["euclide", ["pgcd"]],
  ["bezout", ["pgcd"]],
  ["gauss", ["pgcd"]],
  ["ppcm", ["pgcd"]],
  ["diophantienne", ["pgcd"]],
  ["congruence", ["cong"]],
  ["fermat", ["cong"]],
  ["numeration", ["cong"]],
  ["reste", ["cong"]],
  ["puissance", ["cong"]],
  // --- probabilités ---
  ["denombrement", ["denom"]],
  ["permutation", ["denom"]],
  ["arrangement", ["denom"]],
  ["combinaison", ["denom"]],
  ["principe fondamental", ["denom"]],
  ["variable", ["varia"]],
  ["binomiale", ["varia"]],
  ["esperance", ["varia"]],
  ["variance", ["varia"]],
  ["au moins un", ["varia"]],
  ["conditionnelle", ["proba"]],
  ["independance", ["proba"]],
  ["bayes", ["proba"]],
  ["arbre", ["proba"]],
  ["totales", ["proba"]],
  ["vocabulaire", ["proba"]],
  ["probabilite", ["proba"]],
  // --- géométrie dans l'espace (produit scalaire) ---
  ["produit scalaire", ["pscal"]],
  ["scalaire", ["pscal"]],
  ["norme", ["pscal"]],
  ["orthogon", ["pscal"]],
  ["produit vectoriel", ["vect"]],
  ["vectoriel", ["vect"]],
  ["colineaire", ["vect"]],
  ["determinant", ["vect"]],
  ["sphere", ["plan"]],
  ["plan", ["plan"]],
  ["droite", ["plan"]],
];

/**
 * Resolve a section heading to a notion slug, constrained to the slugs that
 * actually exist in the current chapter. Returns null when nothing matches
 * (the caller should then show the full chapter bank).
 */
export function notionSlug(heading: string, available: Set<string>): string | null {
  const h = norm(heading);
  const candidates: string[] = [];
  for (const [kw, slugs] of RULES) {
    if (h.includes(kw)) for (const s of slugs) if (!candidates.includes(s)) candidates.push(s);
  }
  for (const c of candidates) if (available.has(c)) return c;
  return null;
}
