"use client";

import { MessageSquare } from "lucide-react";
import { Cover } from "@/components/cover";
import { ScoreBadge } from "@/components/score-badge";
import type { Game } from "@/lib/types";
import { averageScore, cn, STATUS_STYLES } from "@/lib/utils";

interface GameCardProps {
  game: Game;
  index?: number;
  onOpen: (game: Game) => void;
}

export function GameCard({ game, index = 0, onOpen }: GameCardProps) {
  const average = averageScore(game.reviews);
  const status = STATUS_STYLES[game.status];
  const reviewLabel =
    game.reviews.length === 1 ? "1 reseña" : `${game.reviews.length} reseñas`;

  return (
    <button
      type="button"
      onClick={() => onOpen(game)}
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
      className="animate-rise group relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/[0.06] hover:shadow-[0_18px_40px_-20px_rgba(139,92,246,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70"
    >
      <div className="relative">
        <Cover
          title={game.title}
          coverUrl={game.coverUrl}
          className="aspect-[4/5] w-full transition duration-500 group-hover:scale-[1.03]"
        />
        <span
          className={cn(
            "absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur",
            status.chip,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
          {status.label}
        </span>
        <ScoreBadge score={average} className="absolute right-2.5 top-2.5" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div>
          <h3 className="font-display text-base font-semibold leading-tight text-white line-clamp-1">
            {game.title}
          </h3>
          <p className="mt-0.5 text-xs text-slate-400">
            {game.platform}
            {game.year ? ` · ${game.year}` : ""}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/5 pt-2.5 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare size={12} className="text-slate-500" />
            {reviewLabel}
          </span>
          <span className="max-w-[55%] truncate rounded-full border border-white/5 bg-white/[0.04] px-2 py-0.5">
            {game.genre || "Sin género"}
          </span>
        </div>
      </div>
    </button>
  );
}
