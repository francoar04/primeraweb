import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GameVault — Calificá y reseñá tus juegos",
  description:
    "Tu biblioteca personal de videojuegos: agregá títulos, puntualos del 1 al 10 y guardá tus reseñas.",
  keywords: ["videojuegos", "reseñas", "calificaciones", "biblioteca", "gaming"],
  applicationName: "GameVault",
  openGraph: {
    type: "website",
    locale: "es_AR",
    title: "GameVault — Calificá y reseñá tus juegos",
    description:
      "Tu biblioteca personal de videojuegos: agregá títulos, puntualos del 1 al 10 y guardá tus reseñas.",
    siteName: "GameVault",
  },
  twitter: {
    card: "summary",
    title: "GameVault — Calificá y reseñá tus juegos",
    description:
      "Agregá juegos, puntualos del 1 al 10 y guardá tus reseñas en una sola biblioteca.",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-[#05060a] font-sans text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
