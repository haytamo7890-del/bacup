/**
 * AI GATEWAY — the single place the app talks to a model.
 * Features must call askTutor(), never the Anthropic SDK directly.
 * This keeps the provider swappable and lets us route cheap vs strong models.
 *
 * SERVER-ONLY: uses the secret ANTHROPIC_API_KEY. Never import from a
 * client component — call it from a route handler or server action.
 *
 * Callers: /api/explain, /api/coach, /api/resume (all gated by guardAI()).
 * Models and prompts live in src/config/ai.ts.
 */
import Anthropic from "@anthropic-ai/sdk";
import { AI_MAX_TOKENS, AI_MODELS, TUTOR_SYSTEM } from "@/config/ai";

let client: Anthropic | null = null;
function getClient() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY manquante — ajoute-la à .env.local");
  client ??= new Anthropic({ apiKey: key });
  return client;
}

export type TutorTurn = { role: "user" | "assistant"; content: string };

/**
 * Ask the tutor. Routes to a cheap or strong model.
 * @param opts.hard  true = use the stronger model for difficult problems
 */
export async function askTutor(
  messages: TutorTurn[],
  opts: { hard?: boolean; system?: string } = {}
) {
  const model = opts.hard ? AI_MODELS.strong : AI_MODELS.fast;
  const res = await getClient().messages.create({
    model,
    max_tokens: AI_MAX_TOKENS,
    system: opts.system ?? TUTOR_SYSTEM,
    messages,
  });

  const text = res.content
    .filter((b) => b.type === "text")
    .map((b) => ("text" in b ? b.text : ""))
    .join("");

  // usage is logged so we can track AI cost per call (COGS discipline)
  return { text, model, usage: res.usage };
}
