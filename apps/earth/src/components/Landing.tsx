"use client";

import { ChevronDown, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/Button";

export function Landing() {
  function scrollToWorkspace() {
    const el = document.getElementById("workspace");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="relative flex h-screen w-full flex-col overflow-hidden bg-background">
      <header className="flex items-center justify-between px-6 py-4">
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
        <div className="text-xs text-muted-foreground">Built by JANI Labs</div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          EUDR-aligned forest screening
        </div>

        <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl md:leading-[1] lg:max-w-6xl lg:text-8xl lg:leading-[0.95] lg:tracking-tighter xl:max-w-7xl xl:text-[7.5rem]">
          Prove your farms are deforestation-free.
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg lg:mt-8 lg:max-w-4xl">
          Drop a coordinate and JANI Earth samples tree-cover loss at 500m,
          1km, and 5km around the farm, flags anything after the EUDR 2020
          cutoff, and writes it up in plain English.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Button
            onClick={scrollToWorkspace}
            className="h-12 px-6 text-base"
          >
            Screen a farm
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <div className="text-xs text-muted-foreground">
            No sign-up. Click the map or paste lat/lng.
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToWorkspace}
        aria-label="Scroll to map"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </button>
    </section>
  );
}
