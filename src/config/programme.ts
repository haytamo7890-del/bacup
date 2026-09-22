/**
 * Programme officiel — chapitres par filière, d'après les Cadres de référence
 * de l'examen national (Mathématiques), option internationale FR, 2015.
 *   - Sciences Mathématiques (A & B)  → cadre "sciences-mathematiques"
 *   - Sciences Expérimentales (PC & SVT) → cadre "sciences-experimentales"
 * `taux` = taux d'importance officiel du sous-domaine/groupe dans l'examen.
 * Source de vérité : sert au seeding des chapitres et à l'affichage du poids.
 */

export type ProgChapter = { code: string; name: string; domaine: string; taux: number };

// Sciences Mathématiques A & B (Analyse 50% · Algèbre-géométrie 50%)
const SM: ProgChapter[] = [
  { code: "suites",       name: "Suites numériques",                    domaine: "Analyse", taux: 50 },
  { code: "limites",      name: "Limites et continuité",                domaine: "Analyse", taux: 50 },
  { code: "derivation",   name: "Dérivabilité et étude de fonctions",   domaine: "Analyse", taux: 50 },
  { code: "integrale",    name: "Calcul intégral",                      domaine: "Analyse", taux: 50 },
  { code: "complexes",    name: "Nombres complexes",                    domaine: "Algèbre et géométrie", taux: 35 },
  { code: "structures",   name: "Structures algébriques",               domaine: "Algèbre et géométrie", taux: 35 },
  { code: "arithmetique", name: "Arithmétique dans ℤ",                  domaine: "Algèbre et géométrie", taux: 15 },
  { code: "proba",        name: "Calcul des probabilités",              domaine: "Algèbre et géométrie", taux: 15 },
];

// Sciences Expérimentales — PC & SVT (Analyse 55% · Algèbre-géométrie 45%)
const SCEXP: ProgChapter[] = [
  { code: "suites",    name: "Suites numériques",                             domaine: "Analyse", taux: 55 },
  { code: "contderiv", name: "Continuité, dérivation et étude de fonctions",  domaine: "Analyse", taux: 55 },
  { code: "integrale", name: "Calcul intégral",                               domaine: "Analyse", taux: 55 },
  { code: "geoespace", name: "Produit scalaire et géométrie dans l'espace",   domaine: "Algèbre et géométrie", taux: 15 },
  { code: "complexes", name: "Nombres complexes",                             domaine: "Algèbre et géométrie", taux: 30 },
  { code: "proba",     name: "Calcul des probabilités",                       domaine: "Algèbre et géométrie", taux: 30 },
];

export const PROGRAMME: Record<string, ProgChapter[]> = {
  "2bac:sm_a": SM,
  "2bac:sm_b": SM,
  "2bac:pc": SCEXP,
  "2bac:svt": SCEXP,
};

export function programmeFor(levelCode: string | null, trackCode: string | null): ProgChapter[] | null {
  if (!levelCode || !trackCode) return null;
  return PROGRAMME[`${levelCode}:${trackCode}`] ?? null;
}
