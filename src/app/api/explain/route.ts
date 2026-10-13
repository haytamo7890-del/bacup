import { NextResponse } from "next/server";
import { askTutor } from "@/lib/ai/gateway";
import { guardAI } from "@/lib/ai/guard";
import { AI_ERROR_MESSAGE, EXPLAIN_MODES, explainPrompt } from "@/config/ai";

export async function POST(req: Request) {
  try {
    const g = await guardAI();
    if (!g.ok) return NextResponse.json({ text: null, error: g.message }, { status: g.status });

    const { question, options, choice, existing, mode } = await req.json();
    const optText = (options ?? [])
      .map((o: string, i: number) => `${String.fromCharCode(65 + i)}. ${o}`)
      .join("\n");

    const instruction = EXPLAIN_MODES[mode] ?? EXPLAIN_MODES.etapes;
    const prompt = explainPrompt({ question, optText, choice, existing, instruction });

    const { text } = await askTutor([{ role: "user", content: prompt }], { hard: false });
    return NextResponse.json({ text });
  } catch (e) {
    console.error("[api/explain]", e);
    return NextResponse.json({ text: null, error: AI_ERROR_MESSAGE }, { status: 500 });
  }
}
