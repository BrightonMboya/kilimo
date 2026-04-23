import { cn } from "@kilimo/utils";

type Tier = "low" | "medium" | "high";

export function RiskChip({
  tier,
  score,
  className,
}: {
  tier: Tier;
  score: number;
  className?: string;
}) {
  const tone = {
    low: "bg-risk-low/10 text-risk-low ring-risk-low/30",
    medium: "bg-risk-medium/10 text-risk-medium ring-risk-medium/30",
    high: "bg-risk-high/10 text-risk-high ring-risk-high/30",
  }[tier];

  const label = {
    low: "Low risk",
    medium: "Medium risk",
    high: "High risk",
  }[tier];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
        tone,
        className,
      )}
    >
      <span className="inline-block h-2 w-2 rounded-full bg-current" />
      {label}
      <span className="text-muted-foreground font-normal">· score {score}</span>
    </span>
  );
}
