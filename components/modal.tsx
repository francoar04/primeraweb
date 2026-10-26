"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  width?: string;
  children: ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  width = "max-w-lg",
  children,
}: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="animate-fade fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "animate-pop relative mx-auto w-full rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/60 outline-none sm:my-4",
          width,
        )}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-3xl border-b border-white/5 bg-slate-900/95 px-5 py-4 backdrop-blur sm:px-6">
          <div>
            <h2 id={titleId} className="font-display text-lg font-semibold text-white">
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-xs text-slate-400">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-white/25 hover:bg-white/5 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
