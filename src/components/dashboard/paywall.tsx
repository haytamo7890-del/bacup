"use client";

import Link from "next/link";
import { Lock, ArrowRight, Sparkles } from "lucide-react";

/** Small "premium" pill for locked cards/rows. */
export function LockBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan ${className}`}>
      <Lock className="w-3 h-3" /> Accès complet
    </span>
  );
}

/** Full upgrade card (demo → paid). */
export function UpgradeCard({
  title = "Débloque tout Bac-up",
  sub = "Toutes les matières, examens, IA et coach — 220 DH pour toute l’année.",
  className = "",
}: {
  title?: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={`glass rounded-3xl p-7 text-center ${className}`}>
      <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center mx-auto"><Sparkles className="w-5 h-5" /></span>
      <h3 className="mt-4 text-lg font-bold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">{sub}</p>
      <Link href="/payment" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white px-6 py-3 hover:brightness-105 transition">
        Obtenir l’accès <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

/**
 * Wrap premium content. When `locked`, blurs the children and overlays a
 * lock + upgrade CTA. When unlocked, renders children normally.
 */
export function PremiumOverlay({
  locked,
  children,
  note = "Contenu réservé à l’accès complet",
}: {
  locked: boolean;
  children: React.ReactNode;
  note?: string;
}) {
  if (!locked) return <>{children}</>;
  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-[6px] opacity-50">{children}</div>
      <div className="absolute inset-0 grid place-items-center">
        <div className="glass rounded-2xl px-6 py-5 text-center max-w-xs">
          <span className="w-10 h-10 rounded-xl bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan grid place-items-center mx-auto"><Lock className="w-5 h-5" /></span>
          <p className="mt-3 text-sm font-semibold">{note}</p>
          <Link href="/payment" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white px-4 py-2 hover:brightness-105 transition">
            Obtenir l’accès <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
