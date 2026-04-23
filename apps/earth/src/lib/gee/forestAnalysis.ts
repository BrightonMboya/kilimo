import { computeValue } from "~/lib/gee/client";
import {
  buffer,
  expression,
  loadImage,
  point,
  Reducer,
  reduceRegion,
  selectBands,
  updateMask,
} from "~/lib/gee/expr";

/**
 * Hansen Global Forest Change v1.11 (2023 update). Annual tree-cover loss
 * from 2001 to 2023. `loss` is a 0/1 mask; `lossyear` is 0 or year offset
 * from 2000 (e.g. 21 = year 2021).
 *
 * Dataset page: https://developers.google.com/earth-engine/datasets/catalog/UMD_hansen_global_forest_change_2023_v1_11
 */
const HANSEN_ASSET = "UMD/hansen/global_forest_change_2023_v1_11";
const HANSEN_BASE_YEAR = 2000;

// Hansen native resolution is 30m (Landsat). One pixel = 900 m² = 0.09 ha.
const HANSEN_SCALE = 30;
const PIXEL_HA = 0.09;

export type BufferStats = {
  radiusMeters: number;
  totalLossHa: number;
  lossSince2020Ha: number;
  lossByYear: Record<number, number>; // { 2001: ha, ..., 2023: ha }
};

export type ForestAnalysisResult = {
  lat: number;
  lng: number;
  buffers: BufferStats[];
  peakLossYear: number | null;
  datasetVersion: string;
  analyzedAt: string;
};

/**
 * Queries EE for tree-cover loss histograms at 500m / 1km / 5km buffers
 * around the given point, using the Hansen annual forest change dataset.
 */
export async function analyzePoint(
  lng: number,
  lat: number,
  radii: number[] = [500, 1000, 5000],
): Promise<ForestAnalysisResult> {
  const hansen = loadImage(HANSEN_ASSET);
  const lossBand = selectBands(hansen, ["loss"]);
  const yearBand = selectBands(hansen, ["lossyear"]);
  // lossyear masked by loss -> histogram keys are the years with actual loss
  const maskedYear = updateMask(yearBand, lossBand);

  const pt = point(lng, lat);

  const buffers: BufferStats[] = await Promise.all(
    radii.map(async (r) => {
      const region = buffer(pt, r);
      const expr = expression(
        reduceRegion({
          image: maskedYear,
          reducer: Reducer.frequencyHistogram(),
          geometry: region,
          scale: HANSEN_SCALE,
        }),
      );
      // frequencyHistogram returns { lossyear: { "21": count, "22": count, ... } }
      const raw = await computeValue<{ lossyear?: Record<string, number> | null }>(
        expr,
      );
      const histo = raw.lossyear ?? {};

      const lossByYear: Record<number, number> = {};
      let totalPixels = 0;
      let since2020Pixels = 0;
      for (const [k, count] of Object.entries(histo)) {
        const yearOffset = Number(k);
        if (!Number.isFinite(yearOffset) || yearOffset <= 0) continue;
        const year = HANSEN_BASE_YEAR + yearOffset;
        const ha = round2(count * PIXEL_HA);
        lossByYear[year] = ha;
        totalPixels += count;
        if (year > 2020) since2020Pixels += count;
      }

      return {
        radiusMeters: r,
        totalLossHa: round2(totalPixels * PIXEL_HA),
        lossSince2020Ha: round2(since2020Pixels * PIXEL_HA),
        lossByYear,
      };
    }),
  );

  const peakLossYear = pickPeakYear(buffers);

  return {
    lat,
    lng,
    buffers,
    peakLossYear,
    datasetVersion: HANSEN_ASSET,
    analyzedAt: new Date().toISOString(),
  };
}

function pickPeakYear(buffers: BufferStats[]): number | null {
  // Use the 1km buffer if available; fall back to the largest.
  const target =
    buffers.find((b) => b.radiusMeters === 1000) ??
    buffers[buffers.length - 1];
  if (!target) return null;
  let peak: { year: number; ha: number } | null = null;
  for (const [yearStr, ha] of Object.entries(target.lossByYear)) {
    const year = Number(yearStr);
    if (!peak || ha > peak.ha) peak = { year, ha };
  }
  return peak && peak.ha > 0 ? peak.year : null;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
