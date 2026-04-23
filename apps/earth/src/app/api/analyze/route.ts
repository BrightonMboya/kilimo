import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzePoint } from "~/lib/gee/forestAnalysis";
import { assessRisk } from "~/lib/risk";

export const runtime = "nodejs";
// Earth Engine calls can take a few seconds each; allow generous timeout.
export const maxDuration = 60;

const bodySchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid coordinates", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { lat, lng } = parsed.data;

  try {
    const forest = await analyzePoint(lng, lat);
    const risk = assessRisk(forest);
    return NextResponse.json({ forest, risk });
  } catch (err) {
    console.error("[/api/analyze] failed", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Earth Engine call failed", detail: message },
      { status: 500 },
    );
  }
}
