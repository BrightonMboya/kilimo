"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, MapPin, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { RiskChip } from "~/components/ui/RiskChip";
import { cn } from "@kilimo/utils";

const MapView = dynamic(
  () => import("~/components/MapView").then((m) => m.MapView),
  { ssr: false, loading: () => <div className="h-full w-full bg-muted" /> },
);

type Point = { lat: number; lng: number };

type BufferStats = {
  radiusMeters: number;
  totalLossHa: number;
  lossSince2020Ha: number;
  lossByYear: Record<string, number>;
};

type AnalyzeResponse = {
  forest: {
    lat: number;
    lng: number;
    buffers: BufferStats[];
    peakLossYear: number | null;
    analyzedAt: string;
  };
  risk: {
    tier: "low" | "medium" | "high";
    score: number;
    reasons: string[];
  };
};

export function EarthWorkspace() {
  const [point, setPoint] = useState<Point | null>(null);
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [narrative, setNarrative] = useState("");
  const [narrating, setNarrating] = useState(false);

  function handlePick(p: Point) {
    setPoint(p);
    setLatInput(p.lat.toFixed(5));
    setLngInput(p.lng.toFixed(5));
  }

  async function handleAnalyze() {
    const lat = Number(latInput);
    const lng = Number(lngInput);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setError("Enter a valid latitude and longitude, or click the map.");
      return;
    }
    setError(null);
    setResult(null);
    setNarrative("");
    setLoading(true);
    setPoint({ lat, lng });
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lat, lng }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
          detail?: string;
        };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as AnalyzeResponse;
      setResult(data);
      void streamNarrative(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  async function streamNarrative(data: AnalyzeResponse) {
    setNarrating(true);
    setNarrative("");
    try {
      const res = await fetch("/api/narrate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 503) {
        setNarrative(
          "Llama narrative is disabled — set GROQ_API_KEY in .env.local to enable.",
        );
        return;
      }
      if (!res.ok || !res.body) {
        setNarrative(`Narrative unavailable (HTTP ${res.status}).`);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setNarrative(text);
      }
    } catch (e) {
      setNarrative(
        `Narrative failed: ${e instanceof Error ? e.message : "unknown error"}`,
      );
    } finally {
      setNarrating(false);
    }
  }

  return (
    <div id="workspace" className="flex h-screen w-full flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">JANI Earth</div>
            <div className="text-xs text-muted-foreground">
              Deforestation risk for farm coordinates · v0
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Built by JANI Labs
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-[380px] shrink-0 flex-col border-r">
          <div className="space-y-4 border-b p-6">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Farm coordinate
              </label>
              <p className="mt-1 text-xs text-muted-foreground">
                Click anywhere on the map, or paste lat/lng below.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <LabelledInput
                label="Latitude"
                value={latInput}
                onChange={setLatInput}
                placeholder="-0.5234"
              />
              <LabelledInput
                label="Longitude"
                value={lngInput}
                onChange={setLngInput}
                placeholder="35.7891"
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={loading || !latInput || !lngInput}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing…
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" /> Analyze location
                </>
              )}
            </Button>
            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {!result && !loading && (
              <EmptyState />
            )}
            {result && <ResultPanel data={result} narrative={narrative} narrating={narrating} />}
          </div>
        </aside>

        <main className="relative flex-1">
          <MapView point={point} onPick={handlePick} />
        </main>
      </div>
    </div>
  );
}

function LabelledInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

function EmptyState() {
  return (
    <div className="rounded-md border border-dashed p-4 text-xs text-muted-foreground">
      Pick a coordinate to screen for EUDR-style deforestation risk. We sample
      annual tree-cover loss at 500m, 1km, and 5km buffers, compare against the
      post-2020 cut-off, and summarize in plain English.
    </div>
  );
}

function ResultPanel({
  data,
  narrative,
  narrating,
}: {
  data: AnalyzeResponse;
  narrative: string;
  narrating: boolean;
}) {
  const { risk, forest } = data;
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <RiskChip tier={risk.tier} score={risk.score} />
        <span className="text-xs text-muted-foreground">
          {new Date(forest.analyzedAt).toLocaleString()}
        </span>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Summary
        </h3>
        <div
          className={cn(
            "rounded-md border bg-card p-3 text-sm leading-relaxed",
            narrating && "animate-pulse",
          )}
        >
          {narrative || (
            <span className="text-muted-foreground">
              Generating narrative…
            </span>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Signals
        </h3>
        <ul className="space-y-1 text-sm">
          {risk.reasons.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-muted-foreground">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Buffer analysis
        </h3>
        <div className="space-y-2">
          {forest.buffers.map((b) => (
            <BufferRow key={b.radiusMeters} b={b} />
          ))}
        </div>
      </div>

      {forest.peakLossYear && (
        <div className="text-xs text-muted-foreground">
          Peak year of loss in the 1km buffer:{" "}
          <span className="font-medium text-foreground">
            {forest.peakLossYear}
          </span>
        </div>
      )}
    </div>
  );
}

function BufferRow({ b }: { b: BufferStats }) {
  const radiusLabel =
    b.radiusMeters >= 1000 ? `${b.radiusMeters / 1000}km` : `${b.radiusMeters}m`;
  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center justify-between text-xs font-medium">
        <span>{radiusLabel} buffer</span>
        <span className="text-muted-foreground">
          total {b.totalLossHa} ha · post-2020 {b.lossSince2020Ha} ha
        </span>
      </div>
    </div>
  );
}
