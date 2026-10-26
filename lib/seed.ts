import type { Game } from "./types";
import { uid } from "./utils";

const DAY = 24 * 60 * 60 * 1000;

/**
 * Datos de ejemplo para que la primera visita no se vea vacía.
 * Se guardan una sola vez en el navegador y se pueden borrar desde la app.
 */
export function createSeedGames(): Game[] {
  const now = Date.now();
  const iso = (daysAgo: number) => new Date(now - daysAgo * DAY).toISOString();

  return [
    {
      id: uid(),
      title: "Elden Ring",
      platform: "PC",
      genre: "Soulslike",
      year: 2022,
      coverUrl: null,
      status: "terminado",
      createdAt: iso(1),
      reviews: [
        {
          id: uid(),
          author: "Franco",
          score: 10,
          text: "El mapa abierto mejor implementado que jugué. Cada rincón esconde algo y la sensación de descubrimiento no se pierde nunca. La curva de dificultad es dura, pero justa.",
          createdAt: iso(2),
        },
        {
          id: uid(),
          author: "Vale",
          score: 9,
          text: "Arte, música y combate de primer nivel. Le sacaría un poco de relleno en la recta final, pero igual es un juegazo.",
          createdAt: iso(1),
        },
      ],
    },
    {
      id: uid(),
      title: "Hollow Knight",
      platform: "Nintendo Switch",
      genre: "Metroidvania",
      year: 2017,
      coverUrl: null,
      status: "terminado",
      createdAt: iso(3),
      reviews: [
        {
          id: uid(),
          author: "Franco",
          score: 10,
          text: "Ambientación perfecta, controles precisos y un mundo que da ganas de explorar sin parar. Por este precio es casi un regalo.",
          createdAt: iso(4),
        },
      ],
    },
    {
      id: uid(),
      title: "Hades",
      platform: "PC",
      genre: "Roguelike",
      year: 2020,
      coverUrl: null,
      status: "terminado",
      createdAt: iso(6),
      reviews: [
        {
          id: uid(),
          author: "Vale",
          score: 9,
          text: "La mezcla de roguelike y narrativa está resuelta de forma brillante. Morir nunca se siente como perder el tiempo.",
          createdAt: iso(5),
        },
      ],
    },
    {
      id: uid(),
      title: "Baldur's Gate 3",
      platform: "PC",
      genre: "RPG",
      year: 2023,
      coverUrl: null,
      status: "jugando",
      createdAt: iso(8),
      reviews: [],
    },
    {
      id: uid(),
      title: "The Legend of Zelda: Tears of the Kingdom",
      platform: "Nintendo Switch",
      genre: "Aventura",
      year: 2023,
      coverUrl: null,
      status: "pendiente",
      createdAt: iso(10),
      reviews: [],
    },
  ];
}
