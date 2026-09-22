import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

/** Shared chrome for the public marketing + SEO pages. Theme-aware (light/dark). */

export function PublicNav() {
  return (
    <nav className="c-nav sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center font-extrabold">B</span>
          <span className="font-extrabold tracking-tight">Bac<span className="c-accent">-up</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm font-medium c-sub">
          <Link href="/examens" className="hover:c-accent transition">Espace préparation</Link>
          <Link href="/defi" className="hover:c-accent transition inline-flex items-center gap-1.5">
            Défi National
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </Link>
          <Link href="/dashboard/calculette" className="hover:c-accent transition">Calculer ma note</Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className="hidden sm:inline text-sm font-semibold px-3 py-2 rounded-full c-sub hover:c-accent transition">
            Se connecter
          </Link>
          <Link href="/signup" className="text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition">
            Commencer
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function PublicFooter() {
  return (
    <footer className="c-surface border-t c-line py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center font-extrabold">B</span>
            <div>
              <div className="font-extrabold tracking-tight text-sm">Bac<span className="c-accent">-up</span></div>
              <div className="text-xs c-dim">Tout le BAC marocain, 1bac & 2bac, en un seul espace.</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm c-sub">
            <Link href="/examens" className="hover:c-accent transition">Annales</Link>
            <Link href="/signup" className="hover:c-accent transition">Examens blancs</Link>
            <Link href="/dashboard/calculette" className="hover:c-accent transition">Calcul note Bac</Link>
            <Link href="/login" className="hover:c-accent transition">Connexion</Link>
          </div>
        </div>
        <div className="mt-6 text-center text-xs c-dim">© 2026 HSGenius · Fait au Maroc 🇲🇦</div>
      </div>
    </footer>
  );
}

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="text-sm c-dim">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {c.href ? (
              <Link href={c.href} className="hover:c-accent transition">{c.label}</Link>
            ) : (
              <span className="c-sub">{c.label}</span>
            )}
            {i < items.length - 1 && <span className="opacity-40">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Renders a JSON-LD block. `data` must be a plain serialisable object. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
