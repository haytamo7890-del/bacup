import { NextResponse } from "next/server";
import { askTutor } from "@/lib/ai/gateway";

export async function POST(req: Request) {
  try {
    const { question, options, choice, existing } = await req.json();
    const optText = (options ?? [])
      .map((o: string, i: number) => `${String.fromCharCode(65 + i)}. ${o}`)
      .join("\n");

    const prompt = `Voici une question à choix multiple du BAC marocain.

Question :
${question}

Options :
${optText}

Réponse choisie par l'élève : ${choice || "(aucune)"}
${existing ? `\nL'élève a déjà vu cette explication :\n"${existing}"\nIl n'a pas bien compris.` : ""}

Explique la bonne réponse ${existing ? "AUTREMENT" : ""} : plus simplement, avec
une autre approche, une image ou un exemple concret. En français clair,
comme un professeur bienveillant. Sois concis (4-6 lignes maximum).`;

    const { text } = await askTutor([{ role: "user", content: prompt }], { hard: false });
    return NextResponse.json({ text });
  } catch (e) {
    // Return 200 with an error field so the UI can show it gracefully
    return NextResponse.json({
      text: null,
      error: e instanceof Error ? e.message : "Erreur du coach IA",
    });
  }
}
