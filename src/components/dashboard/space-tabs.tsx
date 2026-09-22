import Link from "next/link";
import { BookOpen, Timer } from "lucide-react";

/** Toggle between the two exam spaces: Préparation (study) and Examen blanc (timed). */
export function SpaceTabs({ active }: { active: "prepa" | "blanc" }) {
  const base = "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition";
  const on = "bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white shadow-lg shadow-arctic-blue/20";
  const off = "text-neutral-500 dark:text-neutral-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.05]";
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-full glass">
      <Link href="/dashboard/examens/preparation" className={`${base} ${active === "prepa" ? on : off}`}>
        <BookOpen className="w-4 h-4" /> Espace préparation
      </Link>
      <Link href="/dashboard/examens" className={`${base} ${active === "blanc" ? on : off}`}>
        <Timer className="w-4 h-4" /> Examen blanc
      </Link>
    </div>
  );
}
