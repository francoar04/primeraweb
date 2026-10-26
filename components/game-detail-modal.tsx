"use client";

import { MessageSquare, Pencil, Star, Trash2, X } from "lucide-react";
import { Cover } from "@/components/cover";
import { Modal } from "@/components/modal";
import { ReviewForm } from "@/components/review-form";
import { ScoreBadge } from "@/components/score-badge";
import type { Game, ReviewFormValues } from "@/lib/types";
import {
  averageScore,
  cn,
  formatDate,
  initials,
  scoreTone,
  STATUS_STYLES,
} from "@/lib/utils";

interface GameDetailModalProps {
  game: Game | null;
  onClose: () => void;
  onAddReview: (gameId: string, values: ReviewFormValues) => void;
  onDeleteReview: (gameId: string, reviewId: string) => void;
  onDeleteGame: (game: Game) => void;
  onEdit: (game: Game) => void;
}

export function GameDetailModal({
  game,
  onClose,
  onAddReview,
  onDeleteReview,
  onDeleteGame,
  onEdit,
}: GameDetailModalProps) {
  const average = game ? averageScore(game.reviews) : null;
  const status = game ? STATUS_STYLES[game.status] : null;

  return (
    <Modal
      open={Boolean(game)}
      onClose={onClose}
      title={game?.title ?? "Ficha del juego"}
      description="Tu puntuación y las reseñas guardadas."
      width="max-w-4xl"
    >
      {game && status ? (
        <div className="grid gap-6 md:grid-cols-[210px_1fr]">
          <aside>
            <Cover
              title={game.title}
              coverUrl={game.coverUrl}
              className="mx-auto aspect-[3/4] w-full max-w-[220px] rounded-2xl border border-white/10 md:max-w-none"
            />

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Promedio
              </p>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="font-display text-4xl font-bold tabular-nums text-white">
                  {average === null ? "—" : average.toFixed(1)}
                </span>
                <span className="text-sm text-slate-500">/10</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {game.reviews.length === 0
                  ? "Todavía sin reseñas"
                  : game.reviews.length === 1
                    ? "1 reseña"
                    : `${game.reviews.length} reseñas`}
              </p>
            </div>

            <dl className="mt-4 space-y-2 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Plataforma</dt>
                <dd className="text-right font-medium text-slate-200">
                  {game.platform}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Género</dt>
                <dd className="text-right font-medium text-slate-200">
                  {game.genre || "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Año</dt>
                <dd className="font-medium text-slate-200">{game.year ?? "—"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Estado</dt>
                <dd>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                      status.chip,
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                    {status.label}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(game)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-white/25 hover:bg-white/5 hover:text-white"
              >
                <Pencil size={14} />
                Editar
              </button>
              <button
                type="button"
                onClick={() => onDeleteGame(game)}
                aria-label="Eliminar juego"
                className="grid h-9 w-9 place-items-center rounded-xl border border-rose-400/20 text-rose-300 transition hover:border-rose-400/40 hover:bg-rose-400/10"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="inline-flex items-center gap-2 font-display text-base font-semibold text-white">
                <Star size={16} className="text-amber-300" />
                Reseñas
              </h3>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-slate-400">
                {game.reviews.length}
              </span>
            </div>

            {game.reviews.length === 0 ? (
              <div className="mb-4 rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center">
                <MessageSquare size={22} className="mx-auto text-slate-600" />
                <p className="mt-2 text-sm font-medium text-slate-300">
                  Todavía no hay reseñas
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Sé el primero en puntuar este juego.
                </p>
              </div>
            ) : (
              <ul className="mb-4 space-y-2.5">
                {game.reviews.map((review) => {
                  const tone = scoreTone(review.score);
                  return (
                    <li
                      key={review.id}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-[11px] font-semibold text-slate-300">
                            {initials(review.author)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-200">
                              {review.author}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <span
                            className={cn(
                              "rounded-lg border px-2 py-0.5 font-display text-sm font-bold tabular-nums",
                              tone.bg,
                              tone.border,
                              tone.text,
                            )}
                          >
                            {review.score}
                            <span className="text-[0.65em] font-medium opacity-60">
                              /10
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => onDeleteReview(game.id, review.id)}
                            aria-label={`Eliminar reseña de ${review.author}`}
                            className="grid h-7 w-7 place-items-center rounded-lg text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-300"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                      {review.text ? (
                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-300">
                          {review.text}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}

            <ReviewForm
              key={game.id}
              onSubmit={(values) => onAddReview(game.id, values)}
            />
          </section>
        </div>
      ) : null}
    </Modal>
  );
}
