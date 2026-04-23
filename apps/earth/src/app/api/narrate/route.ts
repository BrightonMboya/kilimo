import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { z } from "zod";
import { env } from "~/lib/env";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  forest: z.unknown(),
  risk: z.object({
    tier: z.enum(["low", "medium", "high"]),
    score: z.number(),
    reasons: z.array(z.string()),
  }),
});

const SYSTEM_PROMPT = `You are JANI Earth, a geospatial screening assistant for agricultural supply chains in Africa.
You receive structured land-intelligence data derived from the Hansen Global Forest Change dataset (UMD v1.11) and a rule-based risk tier.

Your job: produce a concise, plain-English narrative (3–5 sentences) for a non-technical sourcing or compliance user. Cover:
1. What the surrounding landscape shows (historical loss, peak year, proximity to the point).
2. Whether there is a post-2020 EUDR signal at this location.
3. A single recommended next step (field verification, quarterly monitoring, low-risk accept, etc.).

Rules:
- Never claim legal compliance. Frame as "screening" / "decision support".
- Quote the real numbers from the input — do not invent figures.
- If data shows no recent loss, say so plainly; do not manufacture concern.
- Do not mention the dataset name or "Hansen" — the user doesn't care.
- No markdown headers, no bullet points. Flowing prose only.`;

export async function POST(req: Request) {
  if (!env.GROQ_API_KEY) {
    return Response.json(
      { error: "GROQ_API_KEY is not configured on the server." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const groq = createGroq({ apiKey: env.GROQ_API_KEY });

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: SYSTEM_PROMPT,
    prompt: `Here is the screening result:\n\n${JSON.stringify(parsed.data, null, 2)}\n\nWrite the narrative now.`,
    temperature: 0.3,
  });

  return result.toTextStreamResponse();
}
