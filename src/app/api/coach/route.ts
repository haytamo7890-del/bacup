import { NextResponse } from "next/server";
import { askTutor } from "@/lib/ai/gateway";
import { guardAI } from "@/lib/ai/guard";
import { AI_ERROR_MESSAGE, coachPrompt } from "@/config/ai";

export async function POST(req: Request) {
  try {
    const g = await guardAI();
    if (!g.ok) return NextResponse.json({ text: null, error: g.message }, { status: g.status });

    const { name, subjects, mastery } = await req.json();

    const ctx =
      mastery && mastery.length
        ? `Maîtrise par chapitre : ${mastery
            .map((m: { chapter: string; pct: number }) => `${m.chapter} ${m.pct}%`)
            .join(", ")}`
        : "L'élève vient de commencer — pas encore de données de performance.";

    const prompt = coachPrompt({
      name: name || "un élève",
      subjects: (subjects || []).join(", ") || "BAC",
      ctx,
    });

    const { text } = await askTutor([{ role: "user", content: prompt }], { hard: false });
    return NextResponse.json({ text });
  } catch (e) {
    console.error("[api/coach]", e);
    return NextResponse.json({ text: null, error: AI_ERROR_MESSAGE }, { status: 500 });
  }
}
