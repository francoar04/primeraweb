export type GameStatus = "terminado" | "jugando" | "pendiente";

export interface Review {
  id: string;
  author: string;
  score: number;
  text: string;
  createdAt: string;
}

export interface Game {
  id: string;
  title: string;
  platform: string;
  genre: string;
  year: number | null;
  coverUrl: string | null;
  status: GameStatus;
  createdAt: string;
  reviews: Review[];
}

export interface ReviewFormValues {
  author: string;
  score: number;
  text: string;
}

export interface GameFormValues {
  title: string;
  platform: string;
  genre: string;
  year: number | null;
  coverUrl: string;
  status: GameStatus;
  review: ReviewFormValues | null;
}

export interface StatusOption {
  value: GameStatus;
  label: string;
}

export const PLATFORMS = [
  "PC",
  "PlayStation 5",
  "PlayStation 4",
  "Xbox Series X|S",
  "Xbox One",
  "Nintendo Switch",
  "Nintendo Switch 2",
  "Retro",
  "Mobile",
  "Otra",
] as const;

export const GENRES = [
  "Acción",
  "Aventura",
  "RPG",
  "Soulslike",
  "Metroidvania",
  "Roguelike",
  "Shooter",
  "Plataformas",
  "Estrategia",
  "Simulación",
  "Terror",
  "Deportes",
  "Carreras",
  "Indie",
  "Puzzle",
  "Sandbox",
  "MOBA",
] as const;

export const STATUS_OPTIONS: StatusOption[] = [
  { value: "terminado", label: "Terminado" },
  { value: "jugando", label: "Jugando" },
  { value: "pendiente", label: "Pendiente" },
];

export const STORAGE_KEYS = {
  games: "gamevault.games.v1",
  author: "gamevault.author.v1",
} as const;
