import { NextResponse } from "next/server";
import { askTutor } from "@/lib/ai/gateway";
import { guardAI } from "@/lib/ai/guard";

const MODES: Record<string, string> = {
  autrement:
    "Explique la bonne réponse AUTREMENT : plus simplement, avec une autre approche ou un exemple concret.",
  etapes: "Détaille la solution ÉTAPE PAR ÉTAPE, clairement.",
  cours: "Rappelle le COURS et les formules indispensables pour répondre à cette question.",
  erreurs:
    "Explique les ERREURS FRÉQUENTES sur ce type de question, et pourquoi les autres options sont fausses.",
  methode: "Donne la MÉTHODE GÉNÉRALE pour résoudre ce type de question.",
};

export async function POST(req: Request) {
  try {
    const g = await guardAI();
    if (!g.ok) return NextResponse.json({ text: null, error: g.message }, { status: g.status });

    const { question, options, choice, existing, mode } = await req.json();
    const optText = (options ?? [])
      .map((o: string, i: number) => `${String.fromCharCode(65 + i)}. ${o}`)
      .join("\n");

    const instruction = MODES[mode] ?? MODES.etapes;

    const prompt = `Question à choix multiple du BAC marocain.

Question :
${question}

Options :
${optText}

Réponse choisie par l'élève : ${choice || "(aucune)"}
${existing ? `\nCorrection de référence :\n"${existing}"` : ""}

${instruction}
Réponds en français clair, comme un professeur bienveillant. Concis (4-6 lignes).`;

    const { text } = await askTutor([{ role: "user", content: prompt }], { hard: false });
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({
      text: null,
      error: e instanceof Error ? e.message : "Erreur du coach IA",
    });
  }
}
