"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Modal } from "@/components/modal";
import { ScorePicker } from "@/components/score-picker";
import { readSavedAuthor } from "@/lib/storage";
import {
  GENRES,
  PLATFORMS,
  STATUS_OPTIONS,
  type Game,
  type GameFormValues,
  type GameStatus,
} from "@/lib/types";
import { inputClass, labelClass, selectClass } from "@/lib/utils";

interface GameFormModalProps {
  open: boolean;
  initial: Game | null;
  onClose: () => void;
  onSubmit: (values: GameFormValues) => void;
}

export function GameFormModal({
  open,
  initial,
  onClose,
  onSubmit,
}: GameFormModalProps) {
  const editing = Boolean(initial);

  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<string>(PLATFORMS[0]);
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [status, setStatus] = useState<GameStatus>("terminado");
  const [score, setScore] = useState<number | null>(null);
  const [author, setAuthor] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setTitle(initial?.title ?? "");
    setPlatform(initial?.platform ?? PLATFORMS[0]);
    setGenre(initial?.genre ?? "");
    setYear(initial?.year ? String(initial.year) : "");
    setCoverUrl(initial?.coverUrl ?? "");
    setStatus(initial?.status ?? "terminado");
    setScore(null);
    setAuthor(readSavedAuthor());
    setReviewText("");
    setError("");
    setSaving(false);
  }, [open, initial]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("El título del juego es obligatorio.");
      return;
    }
    if (!platform) {
      setError("Elegí una plataforma.");
      return;
    }

    const cleanYear = year.trim();
    if (cleanYear) {
      const parsedYear = Number(cleanYear);
      if (!Number.isInteger(parsedYear) || parsedYear < 1950 || parsedYear > 2100) {
        setError("El año tiene que estar entre 1950 y 2100.");
        return;
      }
    }

    const cleanCover = coverUrl.trim();
    if (cleanCover && !/^https?:\/\//i.test(cleanCover)) {
      setError("La URL de la portada tiene que empezar con http:// o https://");
      return;
    }

    const cleanReview = reviewText.trim();
    if (!editing && cleanReview && score === null) {
      setError("Elegí una puntuación para acompañar tu reseña.");
      return;
    }

    const values: GameFormValues = {
      title: cleanTitle,
      platform,
      genre: genre.trim(),
      year: cleanYear ? Number(cleanYear) : null,
      coverUrl: cleanCover,
      status,
      review:
        !editing && score !== null
          ? {
              score,
              author: author.trim(),
              text: cleanReview,
            }
          : null,
    };

    setSaving(true);
    onSubmit(values);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Editar juego" : "Agregar juego"}
      description={
        editing
          ? "Actualizá los datos del juego."
          : "Cargá el juego y, si querés, dejá tu primera reseña con puntuación."
      }
      width="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="space-y-3.5">
          <div>
            <label htmlFor="game-title" className={labelClass}>
              Título *
            </label>
            <input
              id="game-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={inputClass}
              placeholder="Ej: The Witcher 3"
              autoComplete="off"
              autoFocus
              required
              maxLength={120}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="game-platform" className={labelClass}>
                Plataforma *
              </label>
              <select
                id="game-platform"
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
                className={`${selectClass} w-full`}
              >
                {PLATFORMS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="game-year" className={labelClass}>
                Año
              </label>
              <input
                id="game-year"
                type="number"
                inputMode="numeric"
                min={1950}
                max={2100}
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className={inputClass}
                placeholder="2024"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="game-genre" className={labelClass}>
                Género
              </label>
              <input
                id="game-genre"
                list="game-genres"
                value={genre}
                onChange={(event) => setGenre(event.target.value)}
                className={inputClass}
                placeholder="RPG"
                maxLength={40}
              />
              <datalist id="game-genres">
                {GENRES.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
            </div>
            <div>
              <label htmlFor="game-status" className={labelClass}>
                Estado
              </label>
              <select
                id="game-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as GameStatus)}
                className={`${selectClass} w-full`}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="game-cover" className={labelClass}>
              Portada (URL opcional)
            </label>
            <input
              id="game-cover"
              type="url"
              value={coverUrl}
              onChange={(event) => setCoverUrl(event.target.value)}
              className={inputClass}
              placeholder="https://.../portada.jpg"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Si la dejás vacía, generamos una portada con el color y las iniciales
              del juego.
            </p>
          </div>
        </section>

        {!editing ? (
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="mb-3">
              <h3 className="font-display text-sm font-semibold text-white">
                Tu reseña{" "}
                <span className="font-sans text-xs font-normal text-slate-500">
                  (opcional)
                </span>
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Podés agregar la puntuación ahora o más tarde desde la ficha del
                juego.
              </p>
            </div>

            <ScorePicker value={score} onChange={setScore} />

            <div className="mt-4 grid gap-3">
              <div>
                <label htmlFor="game-review-author" className={labelClass}>
                  Tu nombre
                </label>
                <input
                  id="game-review-author"
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  className={inputClass}
                  placeholder="Anónimo"
                  maxLength={40}
                  autoComplete="nickname"
                />
              </div>
              <div>
                <label htmlFor="game-review-text" className={labelClass}>
                  Reseña
                </label>
                <textarea
                  id="game-review-text"
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                  className={`${inputClass} min-h-24 resize-y`}
                  placeholder="¿Qué te pareció el juego? Contá lo mejor y lo peor sin spoilers."
                  maxLength={600}
                />
                <p className="mt-1 text-right text-[11px] text-slate-600">
                  {reviewText.length}/600
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {error ? (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-400/10 px-3 py-2.5 text-sm text-rose-200"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/25 hover:bg-white/5 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:from-violet-400 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            {editing ? "Guardar cambios" : "Agregar juego"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
