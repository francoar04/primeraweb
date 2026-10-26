"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, Send } from "lucide-react";
import { ScorePicker } from "@/components/score-picker";
import { readSavedAuthor } from "@/lib/storage";
import type { ReviewFormValues } from "@/lib/types";
import { inputClass, labelClass } from "@/lib/utils";

interface ReviewFormProps {
  onSubmit: (values: ReviewFormValues) => void;
}

export function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [score, setScore] = useState<number | null>(null);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthor(readSavedAuthor());
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (score === null) {
      setError("Elegí una puntuación del 1 al 10.");
      return;
    }

    onSubmit({
      score,
      author: author.trim() || "Anónimo",
      text: text.trim(),
    });

    setScore(null);
    setText("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
    >
      <h4 className="font-display text-sm font-semibold text-white">
        Dejá tu reseña
      </h4>
      <p className="mt-0.5 text-xs text-slate-500">
        La puntuación es obligatoria. El texto es opcional.
      </p>

      <div className="mt-4">
        <ScorePicker value={score} onChange={setScore} />
      </div>

      <div className="mt-4">
        <label htmlFor="review-author" className={labelClass}>
          Tu nombre
        </label>
        <input
          id="review-author"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          className={inputClass}
          placeholder="Anónimo"
          maxLength={40}
          autoComplete="nickname"
        />
      </div>

      <div className="mt-3">
        <label htmlFor="review-text" className={labelClass}>
          Reseña
        </label>
        <textarea
          id="review-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          className={`${inputClass} min-h-24 resize-y`}
          placeholder="¿Qué te pareció? Sin spoilers, por favor."
          maxLength={600}
        />
        <p className="mt-1 text-right text-[11px] text-slate-600">
          {text.length}/600
        </p>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-400/10 px-3 py-2.5 text-sm text-rose-200"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-violet-100"
      >
        <Send size={15} />
        Publicar reseña
      </button>
    </form>
  );
}
