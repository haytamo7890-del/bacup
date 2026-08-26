import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { PRICING } from "@/config";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-neutral-950/70 border-b border-neutral-200/70 dark:border-neutral-800/70">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 grid place-items-center font-extrabold text-sm">
              H
            </span>
            <span className="font-bold tracking-tight">HSGenius</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-neutral-600 dark:text-neutral-300">
            <a href="#features" className="hover:text-neutral-900 dark:hover:text-white transition">Produit</a>
            <a href="#how" className="hover:text-neutral-900 dark:hover:text-white transition">Comment ça marche</a>
            <a href="#pricing" className="hover:text-neutral-900 dark:hover:text-white transition">Tarif</a>
          </div>
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:inline text-sm font-medium px-3 py-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
              Se connecter
            </Link>
            <Link href="/signup" className="text-sm font-semibold px-4 py-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition">
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative overflow-hidden text-center px-6 pt-20 pb-16">
        <div className="absolute inset-x-0 -top-32 h-72 bg-gradient-to-b from-blue-500/10 to-transparent blur-2xl -z-10" />
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Nouveau · Coach IA pour le BAC marocain
          </span>
          <h1 className="mt-6 text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Ton professeur particulier,
            <br />
            <span className="text-blue-600 dark:text-blue-400">disponible 24h/24.</span>
          </h1>
          <p className="mt-6 text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
            HSGenius t&apos;explique chaque leçon, corrige tes exercices et
            t&apos;entraîne sur les vrais sujets du BAC — jusqu&apos;à ce que tu
            comprennes vraiment.
          </p>
          <div className="mt-8 flex gap-3 justify-center flex-wrap">
            <Link href="/signup" className="px-6 py-3 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-semibold hover:opacity-90 transition">
              Essayer gratuitement →
            </Link>
            <a href="#features" className="px-6 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
              Découvrir
            </a>
          </div>
          <p className="mt-6 text-sm text-neutral-400 dark:text-neutral-500">
            ★★★★★ &nbsp;Conçu pour les élèves marocains, autour du programme officiel.
          </p>
        </div>
      </header>

      {/* TRUST STRIP */}
      <div className="border-y border-neutral-200 dark:border-neutral-800 py-8">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-wide text-neutral-400 mb-4">
            Toutes les filières du BAC
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-semibold text-neutral-400 dark:text-neutral-500">
            <span>Sciences Maths</span><span>Sciences Physiques</span><span>SVT</span><span>Sciences Éco.</span><span>Lettres</span>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Le produit</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight">
              Tout ce qu&apos;il te faut pour réussir.
            </h2>
            <p className="mt-4 text-neutral-500 dark:text-neutral-400">
              Comprendre, s&apos;entraîner, progresser — dans un seul espace.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { t: "Tuteur IA", d: "Pose n'importe quelle question. L'IA explique le concept, résout étape par étape, et s'adapte à ton niveau — en français, arabe ou darija." },
              { t: "Bibliothèque d'examens", d: "Tous les sujets du BAC, filtrables par matière, année et chapitre. Entraîne-toi et obtiens la correction." },
              { t: "Corrections expliquées", d: "Chaque correction est détaillée. Tu ne comprends pas une étape ? Demande au tuteur directement." },
              { t: "Suivi personnalisé", d: "HSGenius identifie tes forces et tes lacunes chapitre par chapitre, et te dit quoi réviser aujourd'hui." },
            ].map((f) => (
              <div key={f.t} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-7 hover:shadow-lg hover:-translate-y-0.5 transition">
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 grid place-items-center text-lg mb-5">✳</div>
                <h3 className="text-lg font-bold tracking-tight">{f.t}</h3>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Comment ça marche</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight">Prêt en deux minutes.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { n: "1", t: "Choisis ta filière", d: "Le contenu s'adapte à ton programme et ton niveau (1bac ou 2bac)." },
              { n: "2", t: "Apprends & entraîne-toi", d: "Pose tes questions au tuteur, travaille les vrais sujets, comprends chaque correction." },
              { n: "3", t: "Progresse & grimpe", d: "Suis ta maîtrise en temps réel et grimpe dans le classement." },
            ].map((s) => (
              <div key={s.n}>
                <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 grid place-items-center font-bold mb-4">{s.n}</div>
                <h3 className="text-lg font-bold tracking-tight">{s.t}</h3>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-md mx-auto text-center">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Tarif</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight">Un prix. Tout inclus.</h2>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400">
            Moins cher qu&apos;une seule séance de cours particulier — pour toute une année.
          </p>
          <div className="mt-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 text-left shadow-sm">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">Accès complet</span>
            <div className="mt-4 text-5xl font-extrabold tracking-tight">
              {PRICING.pro.price} DH <span className="text-lg font-medium text-neutral-400">/ an</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Tuteur IA illimité, toutes matières",
                "Toute la bibliothèque de sujets du BAC",
                "Corrections expliquées + suivi personnalisé",
                "Accès sur mobile et ordinateur",
              ].map((li) => (
                <li key={li} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 grid place-items-center text-xs">✓</span>
                  <span className="text-neutral-700 dark:text-neutral-300">{li}</span>
                </li>
              ))}
            </ul>
            <Link href="/signup" className="mt-7 block text-center px-6 py-3 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-sm font-semibold hover:opacity-90 transition">
              Commencer l&apos;essai gratuit
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto rounded-3xl bg-neutral-900 dark:bg-neutral-900 border border-neutral-800 text-white text-center px-8 py-16 relative overflow-hidden">
          <div className="absolute -top-16 right-0 w-72 h-72 bg-blue-500/30 blur-3xl rounded-full" />
          <h2 className="relative text-4xl font-extrabold tracking-tight">Ton BAC commence aujourd&apos;hui.</h2>
          <p className="relative mt-4 text-neutral-300">Rejoins les élèves qui révisent plus intelligemment, pas plus longtemps.</p>
          <Link href="/signup" className="relative inline-block mt-8 px-7 py-3 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition">
            Créer mon compte gratuit →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 grid place-items-center font-extrabold text-xs">H</span>
            <span className="font-semibold text-neutral-600 dark:text-neutral-300">HSGenius</span>
          </div>
          <span>© 2026 HSGenius · Fait au Maroc 🇲🇦</span>
        </div>
      </footer>
    </div>
  );
}
