import { NextResponse } from "next/server";
import { askTutor } from "@/lib/ai/gateway";
import { guardAI } from "@/lib/ai/guard";
import { AI_ERROR_MESSAGE, RESUME_SOURCE_MAX_CHARS, resumePrompt } from "@/config/ai";

// Instant AI résumé of a chapter's cours — key ideas, formulas, method.
// Used when a chapter has no author-written résumé yet.
export async function POST(req: Request) {
  try {
    const g = await guardAI();
    if (!g.ok) return NextResponse.json({ text: null, error: g.message }, { status: g.status });

    const { subject, chapter, body } = await req.json();
    const source = String(body ?? "").slice(0, RESUME_SOURCE_MAX_CHARS);
    const prompt = resumePrompt({ chapter, subject, source });

    const { text } = await askTutor([{ role: "user", content: prompt }], { hard: false });
    return NextResponse.json({ text });
  } catch (e) {
    console.error("[api/resume]", e);
    return NextResponse.json({ text: null, error: AI_ERROR_MESSAGE }, { status: 500 });
  }
}
