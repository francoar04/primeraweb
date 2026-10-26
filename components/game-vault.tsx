"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Gamepad2,
  Library,
  MessageSquare,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { GameCard } from "@/components/game-card";
import { GameDetailModal } from "@/components/game-detail-modal";
import { GameFormModal } from "@/components/game-form-modal";
import { createSeedGames } from "@/lib/seed";
import {
  normalizeGames,
  readGames,
  saveAuthor,
  writeGames,
} from "@/lib/storage";
import {
  STATUS_OPTIONS,
  STORAGE_KEYS,
  type Game,
  type GameFormValues,
  type GameStatus,
  type ReviewFormValues,
} from "@/lib/types";
import {
  averageScore,
  cn,
  normalize,
  selectClass,
  uid,
} from "@/lib/utils";

type SortValue = "recientes" | "mejor" | "titulo";
type StatusFilter = GameStatus | "todos";

interface Toast {
  id: string;
  message: string;
  tone: "ok" | "error";
}

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "todos", label: "Todos" },
  ...STATUS_OPTIONS.map((option) => ({
    value: option.value as StatusFilter,
    label: option.label,
  })),
];

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "recientes", label: "Más recientes" },
  { value: "mejor", label: "Mejor puntuados" },
  { value: "titulo", label: "Título (A-Z)" },
];

function StatCard({
  icon,
  label,
  value,
  suffix,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-violet-300">{icon}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
          {label}
        </span>
      </div>
      <p className="mt-1.5 font-display text-2xl font-bold tabular-nums text-white">
        {value}
        {suffix ? (
          <span className="ml-0.5 text-sm font-medium text-slate-500">
            {suffix}
          </span>
        ) : null}
      </p>
    </div>
  );
}

export function GameVault() {
  const [games, setGames] = useState<Game[]>([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("todos");
  const [platform, setPlatform] = useState("todas");
  const [sort, setSort] = useState<SortValue>("recientes");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Game | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = readGames();
    if (stored === null) {
      const seed = createSeedGames();
      setGames(seed);
      writeGames(seed);
    } else {
      setGames(stored);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) writeGames(games);
  }, [games, ready]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEYS.games) return;
      const next = readGames();
      if (next) setGames(next);
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const platformOptions = useMemo(
    () =>
      Array.from(new Set(games.map((game) => game.platform))).sort((a, b) =>
        a.localeCompare(b, "es"),
      ),
    [games],
  );

  useEffect(() => {
    if (platform !== "todas" && !platformOptions.includes(platform)) {
      setPlatform("todas");
    }
  }, [platform, platformOptions]);

  const filteredGames = useMemo(() => {
    const term = normalize(query);

    const list = games.filter((game) => {
      const matchesQuery =
        !term ||
        normalize(`${game.title} ${game.genre} ${game.platform}`).includes(term);
      const matchesStatus = status === "todos" || game.status === status;
      const matchesPlatform = platform === "todas" || game.platform === platform;

      return matchesQuery && matchesStatus && matchesPlatform;
    });

    return list.sort((a, b) => {
      if (sort === "titulo") {
        return a.title.localeCompare(b.title, "es", { sensitivity: "base" });
      }
      if (sort === "mejor") {
        const scoreA = averageScore(a.reviews) ?? -1;
        const scoreB = averageScore(b.reviews) ?? -1;
        if (scoreB !== scoreA) return scoreB - scoreA;
        return b.createdAt.localeCompare(a.createdAt);
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [games, query, status, platform, sort]);

  const totalReviews = useMemo(
    () => games.reduce((total, game) => total + game.reviews.length, 0),
    [games],
  );

  const globalAverage = useMemo(() => {
    const scores = games.flatMap((game) =>
      game.reviews.map((review) => review.score),
    );
    if (scores.length === 0) return null;
    return scores.reduce((total, score) => total + score, 0) / scores.length;
  }, [games]);

  const playingCount = useMemo(
    () => games.filter((game) => game.status === "jugando").length,
    [games],
  );

  const selectedGame = games.find((game) => game.id === selectedId) ?? null;
  const hasFilters =
    query.trim() !== "" || status !== "todos" || platform !== "todas";

  function notify(message: string, tone: Toast["tone"] = "ok") {
    setToast({ id: uid(), message, tone });
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(game: Game) {
    setEditing(game);
    setSelectedId(null);
    setFormOpen(true);
  }

  function handleFormSubmit(values: GameFormValues) {
    if (editing) {
      setGames((previous) =>
        previous.map((game) =>
          game.id === editing.id
            ? {
                ...game,
                title: values.title,
                platform: values.platform,
                genre: values.genre,
                year: values.year,
                coverUrl: values.coverUrl || null,
                status: values.status,
              }
            : game,
        ),
      );
      notify(`"${values.title}" actualizado`);
    } else {
      const review = values.review
        ? {
            id: uid(),
            author: values.review.author || "Anónimo",
            score: values.review.score,
            text: values.review.text,
            createdAt: new Date().toISOString(),
          }
        : null;

      if (values.review?.author) saveAuthor(values.review.author);

      const newGame: Game = {
        id: uid(),
        title: values.title,
        platform: values.platform,
        genre: values.genre,
        year: values.year,
        coverUrl: values.coverUrl || null,
        status: values.status,
        createdAt: new Date().toISOString(),
        reviews: review ? [review] : [],
      };

      setGames((previous) => [newGame, ...previous]);
      notify(`"${newGame.title}" se agregó a tu biblioteca`);
    }

    setFormOpen(false);
    setEditing(null);
  }

  function handleAddReview(gameId: string, values: ReviewFormValues) {
    const cleanAuthor = values.author.trim();
    if (cleanAuthor) saveAuthor(cleanAuthor);

    const review = {
      id: uid(),
      author: cleanAuthor || "Anónimo",
      score: values.score,
      text: values.text,
      createdAt: new Date().toISOString(),
    };

    setGames((previous) =>
      previous.map((game) =>
        game.id === gameId
          ? { ...game, reviews: [review, ...game.reviews] }
          : game,
      ),
    );
    notify("Reseña guardada");
  }

  function handleDeleteReview(gameId: string, reviewId: string) {
    if (!window.confirm("¿Eliminar esta reseña? Esta acción no se puede deshacer.")) {
      return;
    }
    setGames((previous) =>
      previous.map((game) =>
        game.id === gameId
          ? {
              ...game,
              reviews: game.reviews.filter((review) => review.id !== reviewId),
            }
          : game,
      ),
    );
    notify("Reseña eliminada");
  }

  function handleDeleteGame(game: Game) {
    if (
      !window.confirm(
        `¿Eliminar "${game.title}" y sus ${game.reviews.length} reseñas? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    setGames((previous) => previous.filter((item) => item.id !== game.id));
    setSelectedId(null);
    notify(`"${game.title}" eliminado`);
  }

  function handleExport() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      games,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `gamevault-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    notify("Respaldo descargado");
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const parsed: unknown = JSON.parse(await file.text());
      const list = Array.isArray(parsed)
        ? parsed
        : parsed &&
            typeof parsed === "object" &&
            Array.isArray((parsed as { games?: unknown }).games)
          ? (parsed as { games: unknown[] }).games
          : null;

      if (!list) {
        notify("El archivo no tiene el formato de GameVault.", "error");
        return;
      }

      const imported = normalizeGames(list);
      if (imported.length === 0) {
        notify("No se encontraron juegos válidos en el archivo.", "error");
        return;
      }

      const confirmed = window.confirm(
        `Se van a reemplazar los ${games.length} juegos actuales por los ${imported.length} del archivo. ¿Continuar?`,
      );
      if (!confirmed) return;

      setGames(imported);
      notify(`${imported.length} juegos importados`);
    } catch {
      notify(
        "No pudimos leer el archivo. Tiene que ser un JSON exportado por GameVault.",
        "error",
      );
    }
  }

  function clearFilters() {
    setQuery("");
    setStatus("todos");
    setPlatform("todas");
  }

  function handleClearAll() {
    if (
      !window.confirm(
        `¿Borrar los ${games.length} juegos y todas sus reseñas? Esta acción no se puede deshacer. Te recomendamos exportar un respaldo antes.`,
      )
    ) {
      return;
    }
    setGames([]);
    notify("Biblioteca vaciada");
  }

  function handleLoadDemo() {
    setGames(createSeedGames());
    notify("Juegos de ejemplo cargados");
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-900/40">
              <Gamepad2 size={19} className="text-white" />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-base font-bold tracking-tight text-white">
                Game<span className="text-violet-400">Vault</span>
              </p>
              <p className="hidden text-[11px] text-slate-500 sm:block">
                Tu biblioteca de reseñas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Importar respaldo JSON"
              aria-label="Importar respaldo JSON"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-2.5 py-2 text-sm font-medium text-slate-400 transition hover:border-white/25 hover:bg-white/5 hover:text-white sm:px-3"
            >
              <Upload size={15} />
              <span className="hidden md:inline">Importar</span>
            </button>
            <button
              type="button"
              onClick={handleExport}
              title="Exportar respaldo JSON"
              aria-label="Exportar respaldo JSON"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-2.5 py-2 text-sm font-medium text-slate-400 transition hover:border-white/25 hover:bg-white/5 hover:text-white sm:px-3"
            >
              <Download size={15} />
              <span className="hidden md:inline">Exportar</span>
            </button>
            <button
              type="button"
              onClick={openCreate}
              aria-label="Agregar juego"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:from-violet-400 hover:to-fuchsia-500 sm:px-4"
            >
              <Plus size={16} />
              <span className="hidden min-[360px]:inline">
                Agregar<span className="hidden sm:inline"> juego</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-white/5">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-[-6rem] h-72 w-72 rounded-full bg-violet-600/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-[11px] font-medium text-violet-200">
              <Sparkles size={12} />
              Biblioteca personal
            </span>
            <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
              Tus juegos. Tus notas.{" "}
              <span className="bg-linear-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                Tus historias.
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Agregá juegos uno por uno, puntualos del 1 al 10 y guardá tus
              reseñas. Todo queda ordenado en una sola biblioteca.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard
                icon={<Library size={15} />}
                label="Juegos"
                value={ready ? games.length : "—"}
              />
              <StatCard
                icon={<MessageSquare size={15} />}
                label="Reseñas"
                value={ready ? totalReviews : "—"}
              />
              <StatCard
                icon={<Star size={15} />}
                label="Promedio"
                value={
                  ready && globalAverage !== null
                    ? globalAverage.toFixed(1)
                    : "—"
                }
                suffix={ready && globalAverage !== null ? "/10" : undefined}
              />
              <StatCard
                icon={<Gamepad2 size={15} />}
                label="Jugando"
                value={ready ? playingCount : "—"}
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative lg:max-w-xs lg:flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por título, género..."
                aria-label="Buscar juegos"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 pl-9 pr-9 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-slate-500 transition hover:bg-white/5 hover:text-white"
                >
                  <X size={14} />
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div
                role="group"
                aria-label="Filtrar por estado"
                className="flex flex-wrap gap-1.5"
              >
                {STATUS_FILTERS.map((filter) => {
                  const active = status === filter.value;
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setStatus(filter.value)}
                      aria-pressed={active}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                        active
                          ? "border-violet-400/50 bg-violet-500/15 text-violet-100"
                          : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white",
                      )}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative shrink-0">
                  <SlidersHorizontal
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <select
                    value={platform}
                    onChange={(event) => setPlatform(event.target.value)}
                    aria-label="Filtrar por plataforma"
                    className={`${selectClass} shrink-0 py-2 pl-8 pr-8 text-xs`}
                  >
                    <option value="todas">Todas las plataformas</option>
                    {platformOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortValue)}
                  aria-label="Ordenar juegos"
                  className={`${selectClass} shrink-0 py-2 pr-8 text-xs`}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
            <p>
              {ready
                ? `${filteredGames.length} de ${games.length} juegos`
                : "Cargando biblioteca..."}
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-slate-400 transition hover:text-white"
              >
                <RotateCcw size={12} />
                Limpiar filtros
              </button>
            ) : null}
          </div>

          {!ready ? (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                >
                  <div className="aspect-[4/5] bg-white/[0.05]" />
                  <div className="space-y-2 p-3.5">
                    <div className="h-4 w-2/3 rounded bg-white/10" />
                    <div className="h-3 w-1/3 rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredGames.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredGames.map((game, index) => (
                <GameCard
                  key={game.id}
                  game={game}
                  index={index}
                  onOpen={(selected) => setSelectedId(selected.id)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
                {games.length === 0 ? (
                  <Sparkles size={22} className="text-violet-300" />
                ) : (
                  <Search size={22} className="text-slate-500" />
                )}
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-white">
                {games.length === 0
                  ? "Tu biblioteca está vacía"
                  : "No encontramos juegos con esos filtros"}
              </h2>
              <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-400">
                {games.length === 0
                  ? "Empezá agregando el primer juego que quieras calificar y reseñar."
                  : "Probá con otra búsqueda o quitá los filtros para ver todo."}
              </p>
              <button
                type="button"
                onClick={games.length === 0 ? openCreate : clearFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-violet-400 hover:to-fuchsia-500"
              >
                {games.length === 0 ? (
                  <>
                    <Plus size={16} />
                    Agregar mi primer juego
                  </>
                ) : (
                  <>
                    <RotateCcw size={15} />
                    Limpiar filtros
                  </>
                )}
              </button>
              {games.length === 0 ? (
                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="mt-3 text-xs text-slate-500 underline-offset-4 transition hover:text-white hover:underline"
                >
                  Cargar juegos de ejemplo
                </button>
              ) : null}
            </div>
          )}
        </section>
      </main>

      <footer className="mt-10 border-t border-white/5 py-7">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center text-xs text-slate-500 sm:flex-row sm:px-6 sm:text-left">
          <p>
            <span className="font-medium text-slate-400">GameVault</span> · Tus
            juegos, tus notas, tus historias.
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <p>
              Los datos se guardan en este navegador. Exportá un respaldo para no
              perderlos.
            </p>
            {ready && games.length > 0 ? (
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-rose-400/20 px-2.5 py-1 text-rose-300/80 transition hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-200"
              >
                <Trash2 size={12} />
                Borrar todo
              </button>
            ) : null}
          </div>
        </div>
      </footer>

      <GameFormModal
        open={formOpen}
        initial={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <GameDetailModal
        game={selectedGame}
        onClose={() => setSelectedId(null)}
        onAddReview={handleAddReview}
        onDeleteReview={handleDeleteReview}
        onDeleteGame={handleDeleteGame}
        onEdit={openEdit}
      />

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "animate-toast fixed bottom-4 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-xl",
            toast.tone === "ok"
              ? "border-emerald-400/25 bg-emerald-950/90 text-emerald-100"
              : "border-rose-400/25 bg-rose-950/90 text-rose-100",
          )}
        >
          {toast.tone === "ok" ? (
            <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-300" />
          ) : (
            <AlertTriangle size={17} className="mt-0.5 shrink-0 text-rose-300" />
          )}
          <p className="flex-1">{toast.message}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Cerrar notificación"
            className="grid h-5 w-5 shrink-0 place-items-center rounded text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <X size={13} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
