import type { Game, GameStatus, Review } from "./types";
import { STORAGE_KEYS } from "./types";
import { uid } from "./utils";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function cleanScore(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.min(10, Math.max(1, Math.round(number)));
}

function cleanDate(value: unknown) {
  if (typeof value === "string" && !Number.isNaN(new Date(value).getTime())) {
    return new Date(value).toISOString();
  }
  return new Date().toISOString();
}

function cleanStatus(value: unknown): GameStatus {
  if (value === "terminado" || value === "jugando" || value === "pendiente") {
    return value;
  }
  return "terminado";
}

function cleanReview(value: unknown): Review | null {
  if (!isRecord(value)) return null;
  const score = cleanScore(value.score);
  if (score === null) return null;

  return {
    id: cleanText(value.id) || uid(),
    author: cleanText(value.author) || "Anónimo",
    score,
    text: cleanText(value.text),
    createdAt: cleanDate(value.createdAt),
  };
}

export function normalizeGames(value: unknown): Game[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!isRecord(item)) return [];

    const title = cleanText(item.title);
    const platform = cleanText(item.platform);
    if (!title || !platform) return [];

    const yearNumber = typeof item.year === "number" ? item.year : Number(item.year);
    const year =
      Number.isFinite(yearNumber) && yearNumber >= 1950 && yearNumber <= 2100
        ? Math.round(yearNumber)
        : null;

    const reviews = Array.isArray(item.reviews)
      ? item.reviews.flatMap((review) => {
          const clean = cleanReview(review);
          return clean ? [clean] : [];
        })
      : [];

    return [
      {
        id: cleanText(item.id) || uid(),
        title,
        platform,
        genre: cleanText(item.genre),
        year,
        coverUrl: cleanText(item.coverUrl) || null,
        status: cleanStatus(item.status),
        createdAt: cleanDate(item.createdAt),
        reviews,
      },
    ];
  });
}

/** Devuelve null si el usuario todavía no guardó nada (primer ingreso). */
export function readGames(): Game[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.games);
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);
    const list = Array.isArray(parsed)
      ? parsed
      : isRecord(parsed) && Array.isArray(parsed.games)
        ? parsed.games
        : [];

    return normalizeGames(list);
  } catch {
    return [];
  }
}

export function writeGames(games: Game[]): boolean {
  if (typeof window === "undefined") return false;

  try {
    const serialized = JSON.stringify({ version: 1, games });
    if (window.localStorage.getItem(STORAGE_KEYS.games) === serialized) {
      return true;
    }
    window.localStorage.setItem(STORAGE_KEYS.games, serialized);
    return true;
  } catch {
    return false;
  }
}

export function readSavedAuthor(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(STORAGE_KEYS.author) ?? "";
  } catch {
    return "";
  }
}

export function saveAuthor(author: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.author, author);
  } catch {
    // Sin espacio o storage bloqueado: no es crítico.
  }
}
