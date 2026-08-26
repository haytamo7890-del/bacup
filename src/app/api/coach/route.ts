import { NextResponse } from "next/server";
import { askTutor } from "@/lib/ai/gateway";

export async function POST(req: Request) {
  try {
    const { name, subjects, mastery } = await req.json();

    const ctx =
      mastery && mastery.length
        ? `Maîtrise par chapitre : ${mastery
            .map((m: { chapter: string; pct: number }) => `${m.chapter} ${m.pct}%`)
            .join(", ")}`
        : "L'élève vient de commencer — pas encore de données de performance.";

    const prompt = `Tu es le coach scolaire IA de Bac-up, bienveillant et motivant, pour le BAC marocain.

Élève : ${name || "un élève"}
Matières : ${(subjects || []).join(", ") || "BAC"}
${ctx}

Rédige une analyse courte et chaleureuse, en français, avec EXACTEMENT ces trois sections :

FORCES :
(ce qui va bien — ou, s'il n'y a pas de données, encourage le démarrage)

À TRAVAILLER :
(les points faibles — ou, sans données, ce sur quoi commencer)

TON PLAN CETTE SEMAINE :
(3 actions concrètes et réalistes)

Sois concret et positif. Maximum 10 lignes au total.`;

    const { text } = await askTutor([{ role: "user", content: prompt }], { hard: false });
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({
      text: null,
      error: e instanceof Error ? e.message : "Erreur du coach IA",
    });
  }
}
