/**
 * AI config — models and prompts. The gateway (src/lib/ai/gateway.ts) and the
 * /api routes read from here; no prompt or model id is hardcoded elsewhere.
 */

export const AI_MODELS = {
  fast: "claude-haiku-4-5-20251001", // cheap: intent, routine Q&A, formatting
  strong: "claude-sonnet-5-5", // strong: hard problems, step-by-step reasoning
} as const;

export const AI_MAX_TOKENS = 1024;

export const TUTOR_SYSTEM = `Tu es le tuteur HSGenius, pour les élèves du BAC marocain.
Tu EXPLIQUES étape par étape au lieu de donner directement la réponse.
Tu t'adaptes au niveau de l'élève et peux répondre en français, en arabe ou en darija.
Tu poses des questions pour vérifier la compréhension.`;

/** Generic message sent to the student when the model call fails (details go to the server log). */
export const AI_ERROR_MESSAGE = "L'IA est momentanément indisponible. Réessaie dans un instant.";

/* --------------------------- /api/explain --------------------------- */

export const EXPLAIN_MODES: Record<string, string> = {
  autrement:
    "Explique la bonne réponse AUTREMENT : plus simplement, avec une autre approche ou un exemple concret.",
  etapes: "Détaille la solution ÉTAPE PAR ÉTAPE, clairement.",
  cours: "Rappelle le COURS et les formules indispensables pour répondre à cette question.",
  erreurs:
    "Explique les ERREURS FRÉQUENTES sur ce type de question, et pourquoi les autres options sont fausses.",
  methode: "Donne la MÉTHODE GÉNÉRALE pour résoudre ce type de question.",
};

export function explainPrompt(p: {
  question: string;
  optText: string;
  choice: string;
  existing?: string;
  instruction: string;
}): string {
  return `Question à choix multiple du BAC marocain.

Question :
${p.question}

Options :
${p.optText}

Réponse choisie par l'élève : ${p.choice || "(aucune)"}
${p.existing ? `\nCorrection de référence :\n"${p.existing}"` : ""}

${p.instruction}
Réponds en français clair, comme un professeur bienveillant. Concis (4-6 lignes).`;
}

/* ---------------------------- /api/coach ---------------------------- */

export function coachPrompt(p: { name: string; subjects: string; ctx: string }): string {
  return `Tu es le coach scolaire IA de Bac-up, bienveillant et motivant, pour le BAC marocain.

Élève : ${p.name}
Matières : ${p.subjects}
${p.ctx}

Rédige une analyse courte et chaleureuse, en français, avec EXACTEMENT ces trois sections :

FORCES :
(ce qui va bien — ou, s'il n'y a pas de données, encourage le démarrage)

À TRAVAILLER :
(les points faibles — ou, sans données, ce sur quoi commencer)

TON PLAN CETTE SEMAINE :
(3 actions concrètes et réalistes)

Sois concret et positif. Maximum 10 lignes au total.`;
}

/* ---------------------------- /api/resume --------------------------- */

export const RESUME_SOURCE_MAX_CHARS = 12000;

export function resumePrompt(p: { chapter: string; subject?: string; source: string }): string {
  return `Tu es un professeur du BAC marocain. Voici le cours du chapitre « ${p.chapter} »${
    p.subject ? ` (${p.subject})` : ""
  } :

"""
${p.source}
"""

Rédige un RÉSUMÉ clair et fluide de ce chapitre pour un élève qui révise avant l'examen.
- Va à l'essentiel : les idées clés, les définitions, et surtout les FORMULES à retenir.
- Structure en petites sections avec des titres courts (une ligne chacun).
- Utilise les délimiteurs $...$ pour les maths.
- Français simple et motivant. Pas de blabla.`;
}
