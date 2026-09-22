import { NextResponse } from "next/server";
import { askTutor } from "@/lib/ai/gateway";
import { guardAI } from "@/lib/ai/guard";

// Instant AI résumé of a chapter's cours — key ideas, formulas, method.
// Used when a chapter has no author-written résumé yet.
export async function POST(req: Request) {
  try {
    const g = await guardAI();
    if (!g.ok) return NextResponse.json({ text: null, error: g.message }, { status: g.status });

    const { subject, chapter, body } = await req.json();
    const source = String(body ?? "").slice(0, 12000);

    const prompt = `Tu es un professeur du BAC marocain. Voici le cours du chapitre « ${chapter} »${
      subject ? ` (${subject})` : ""
    } :

"""
${source}
"""

Rédige un RÉSUMÉ clair et fluide de ce chapitre pour un élève qui révise avant l'examen.
- Va à l'essentiel : les idées clés, les définitions, et surtout les FORMULES à retenir.
- Structure en petites sections avec des titres courts (une ligne chacun).
- Utilise les délimiteurs $...$ pour les maths.
- Français simple et motivant. Pas de blabla.`;

    const { text } = await askTutor([{ role: "user", content: prompt }], { hard: false });
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({
      text: null,
      error: e instanceof Error ? e.message : "Erreur du générateur de résumé",
    });
  }
}
