"use client";

import { useEffect, useState } from "react";
import { coverGradient, cn, initials } from "@/lib/utils";

interface CoverProps {
  title: string;
  coverUrl?: string | null;
  className?: string;
}

export function Cover({ title, coverUrl, className }: CoverProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [coverUrl]);

  const gradient = coverGradient(title || "juego");

  return (
    <div className={cn("relative isolate overflow-hidden bg-slate-900", className)}>
      <div className={cn("absolute inset-0 bg-linear-to-br", gradient)} />
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 15%, rgba(255,255,255,.5), transparent 42%), radial-gradient(circle at 85% 80%, rgba(0,0,0,.55), transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.9) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[7rem] font-bold leading-none tracking-tighter text-white/20"
      >
        {initials(title)}
      </span>

      {coverUrl && !failed ? (
        <img
          src={coverUrl}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
    </div>
  );
}
