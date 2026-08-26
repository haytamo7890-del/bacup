/**
 * AI GATEWAY — the single place the app talks to a model.
 * Features must call askTutor(), never the Anthropic SDK directly.
 * This keeps the provider swappable and lets us route cheap vs strong models.
 *
 * SERVER-ONLY: uses the secret ANTHROPIC_API_KEY. Never import from a
 * client component — call it from a route handler or server action.
 *
 * STATUS: set up but dormant. Nothing calls it yet. The tutor feature will.
 */
import Anthropic from "@anthropic-ai/sdk";

// TODO: confirm exact current model IDs at docs.anthropic.com before launch.
const MODELS = {
  fast: "claude-haiku-4-5-20251001", // cheap: intent, routine Q&A, formatting
  strong: "claude-sonnet-5", // strong: hard problems, step-by-step reasoning
} as const;

let client: Anthropic | null = null;
function getClient() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY manquante — ajoute-la à .env.local");
  client ??= new Anthropic({ apiKey: key });
  return client;
}

export type TutorTurn = { role: "user" | "assistant"; content: string };

const DEFAULT_SYSTEM = `Tu es le tuteur HSGenius, pour les élèves du BAC marocain.
Tu EXPLIQUES étape par étape au lieu de donner directement la réponse.
Tu t'adaptes au niveau de l'élève et peux répondre en français, en arabe ou en darija.
Tu poses des questions pour vérifier la compréhension.`;

/**
 * Ask the tutor. Routes to a cheap or strong model.
 * @param opts.hard  true = use the stronger model for difficult problems
 */
export async function askTutor(
  messages: TutorTurn[],
  opts: { hard?: boolean; system?: string } = {}
) {
  const model = opts.hard ? MODELS.strong : MODELS.fast;
  const res = await getClient().messages.create({
    model,
    max_tokens: 1024,
    system: opts.system ?? DEFAULT_SYSTEM,
    messages,
  });

  const text = res.content
    .filter((b) => b.type === "text")
    .map((b) => ("text" in b ? b.text : ""))
    .join("");

  // usage is logged so we can track AI cost per call (COGS discipline)
  return { text, model, usage: res.usage };
}
