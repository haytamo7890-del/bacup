"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

type Opt = { value: string; label: string };

/**
 * Fully-styled dropdown (replaces native <select> so the option list is
 * dark/glass in sombre mode instead of the browser's white popup).
 */
export function SelectMenu({
  value, onChange, options, placeholder = "Choisir…", disabled = false, className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: Opt[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const cur = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3.5 py-2.5 text-sm text-left outline-none focus:border-arctic-blue disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className={cur ? "" : "text-neutral-400"}>{cur ? cur.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-2xl p-1 max-h-64 overflow-y-auto">
          {options.length === 0 && <div className="px-3 py-2 text-sm text-neutral-400">Aucune option</div>}
          {options.map((o) => {
            const on = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => { onChange(o.value); setOpen(false); }}
                className={`w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-left transition ${on ? "bg-arctic-blue/12 text-arctic-blue dark:text-arctic-cyan font-semibold" : "text-neutral-700 dark:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"}`}
              >
                {o.label}
                {on && <Check className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
