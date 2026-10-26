import type { GameStatus, Review } from "./types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function uid() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Minúsculas y sin acentos, para buscar de forma tolerante. */
export function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function averageScore(reviews: Review[]): number | null {
  if (reviews.length === 0) return null;
  return reviews.reduce((total, review) => total + review.score, 0) / reviews.length;
}

export function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function initials(value: string) {
  const words = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (words.length === 0) return "?";
  return words.map((word) => word[0]?.toUpperCase() ?? "").join("");
}

export function scoreTone(score: number) {
  if (score >= 9) {
    return {
      text: "text-emerald-300",
      border: "border-emerald-400/30",
      bg: "bg-emerald-400/10",
      solid: "bg-emerald-400",
    };
  }
  if (score >= 7) {
    return {
      text: "text-cyan-300",
      border: "border-cyan-400/30",
      bg: "bg-cyan-400/10",
      solid: "bg-cyan-400",
    };
  }
  if (score >= 5) {
    return {
      text: "text-amber-300",
      border: "border-amber-400/30",
      bg: "bg-amber-400/10",
      solid: "bg-amber-400",
    };
  }
  return {
    text: "text-rose-300",
    border: "border-rose-400/30",
    bg: "bg-rose-400/10",
    solid: "bg-rose-400",
  };
}

export const STATUS_STYLES: Record<
  GameStatus,
  { label: string; dot: string; chip: string }
> = {
  terminado: {
    label: "Terminado",
    dot: "bg-emerald-400",
    chip: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  },
  jugando: {
    label: "Jugando",
    dot: "bg-cyan-400",
    chip: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
  },
  pendiente: {
    label: "Pendiente",
    dot: "bg-amber-400",
    chip: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  },
};

const COVER_GRADIENTS = [
  "from-violet-500 via-purple-600 to-fuchsia-700",
  "from-sky-400 via-blue-600 to-indigo-700",
  "from-amber-300 via-orange-500 to-rose-600",
  "from-emerald-300 via-teal-500 to-cyan-700",
  "from-rose-400 via-pink-600 to-purple-700",
  "from-lime-300 via-emerald-500 to-teal-700",
  "from-indigo-400 via-violet-600 to-purple-800",
  "from-orange-300 via-red-500 to-rose-700",
];

export function coverGradient(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 100000;
  }
  return COVER_GRADIENTS[hash % COVER_GRADIENTS.length];
}

const fieldClass =
  "rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20";

export const inputClass = `w-full ${fieldClass}`;

export const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400";

export const selectClass = `${fieldClass} select-field appearance-none pr-9`;
