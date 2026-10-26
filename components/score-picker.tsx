"use client";

import { cn, scoreTone } from "@/lib/utils";

const SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

interface ScorePickerProps {
  value: number | null;
  onChange: (value: number | null) => void;
  className?: string;
}

export function ScorePicker({ value, onChange, className }: ScorePickerProps) {
  return (
    <div className={className}>
      <div
        role="radiogroup"
        aria-label="Puntuación del 1 al 10"
        className="grid grid-cols-5 gap-1.5 sm:grid-cols-10"
      >
        {SCORES.map((score) => {
          const active = value === score;
          const tone = scoreTone(score);

          return (
            <button
              key={score}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={`${score} de 10`}
              onClick={() => onChange(active ? null : score)}
              className={cn(
                "h-9 rounded-lg border text-sm font-semibold tabular-nums transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60",
                active
                  ? `${tone.bg} ${tone.border} ${tone.text} scale-105`
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25 hover:text-white",
              )}
            >
              {score}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {value === null
          ? "Tocá un número para puntuar (1 = malo, 10 = obra maestra)."
          : `Vas a puntuar con ${value}/10. Tocá el mismo número para quitarlo.`}
      </p>
    </div>
  );
}
