import { cn, scoreTone } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ScoreBadge({ score, size = "md", className }: ScoreBadgeProps) {
  if (score === null) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-lg border border-white/10 bg-slate-950/50 px-2 py-1 text-xs font-medium text-slate-500 backdrop-blur",
          className,
        )}
        title="Sin reseñas todavía"
      >
        Sin nota
      </span>
    );
  }

  const tone = scoreTone(score);

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-0.5 rounded-lg border font-display font-bold tabular-nums backdrop-blur",
        tone.bg,
        tone.border,
        tone.text,
        size === "lg" && "px-2.5 py-1 text-2xl",
        size === "md" && "px-2 py-0.5 text-base",
        size === "sm" && "px-1.5 py-0.5 text-xs",
        className,
      )}
    >
      {score.toFixed(1)}
      <span className="text-[0.62em] font-medium opacity-60">/10</span>
    </span>
  );
}
