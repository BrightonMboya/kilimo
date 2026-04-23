import type {
  BufferStats,
  ForestAnalysisResult,
} from "~/lib/gee/forestAnalysis";

export type RiskTier = "low" | "medium" | "high";

export type RiskAssessment = {
  tier: RiskTier;
  // 0–100 composite score
  score: number;
  reasons: string[];
};

/**
 * Rule-based screening risk tier for EUDR-style pre-check.
 *
 * v0 thresholds (tunable):
 *   HIGH   — any post-2020 loss within 500m of the point, OR
 *            >5% canopy loss within the 1km buffer since 2020
 *   MEDIUM — any post-2020 loss within 1km, OR
 *            >2% loss within 1km since 2020
 *   LOW    — otherwise
 *
 * These are decision-support signals, not legal determinations.
 */
export function assessRisk(result: ForestAnalysisResult): RiskAssessment {
  const b500 = findBuffer(result.buffers, 500);
  const b1000 = findBuffer(result.buffers, 1000);
  const b5000 = findBuffer(result.buffers, 5000);

  const reasons: string[] = [];
  let score = 0;

  if (b500 && b500.lossSince2020Ha > 0) {
    reasons.push(
      `Forest loss within 500m since 2020: ${b500.lossSince2020Ha} ha`,
    );
    score += 60;
  }

  if (b1000) {
    const pct = percentOfBuffer(b1000.lossSince2020Ha, b1000.radiusMeters);
    if (pct >= 5) {
      reasons.push(`>${Math.round(pct)}% canopy loss in 1km buffer since 2020`);
      score += 40;
    } else if (pct >= 2) {
      reasons.push(
        `${pct.toFixed(1)}% canopy loss in 1km buffer since 2020`,
      );
      score += 20;
    } else if (b1000.lossSince2020Ha > 0) {
      reasons.push(
        `Minor loss in 1km buffer since 2020: ${b1000.lossSince2020Ha} ha`,
      );
      score += 10;
    }
  }

  if (b5000 && b5000.lossSince2020Ha > 0) {
    const pct = percentOfBuffer(b5000.lossSince2020Ha, b5000.radiusMeters);
    if (pct >= 1) {
      reasons.push(
        `Landscape pressure: ${pct.toFixed(1)}% loss in 5km buffer since 2020`,
      );
      score += 15;
    }
  }

  if (result.peakLossYear && result.peakLossYear >= 2021) {
    reasons.push(`Peak loss year in surrounding landscape: ${result.peakLossYear}`);
    score += 5;
  }

  if (reasons.length === 0) {
    reasons.push("No post-2020 forest loss detected in surrounding buffers.");
  }

  score = Math.min(100, score);

  const tier: RiskTier = score >= 60 ? "high" : score >= 20 ? "medium" : "low";
  return { tier, score, reasons };
}

function findBuffer(buffers: BufferStats[], radiusMeters: number) {
  return buffers.find((b) => b.radiusMeters === radiusMeters);
}

function percentOfBuffer(lossHa: number, radiusMeters: number): number {
  // Buffer area in hectares = π r² / 10000
  const areaHa = (Math.PI * radiusMeters * radiusMeters) / 10000;
  if (areaHa <= 0) return 0;
  return (lossHa / areaHa) * 100;
}
