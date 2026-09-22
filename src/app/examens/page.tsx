import Link from "next/link";
import type { Metadata } from "next";
import { FileText, CheckCircle2, BookOpen, CalendarDays, ChevronRight, Timer } from "lucide-react";
import { createPublicSupabase } from "@/lib/supabase-public";
import { PublicNav, PublicFooter, Breadcrumbs, JsonLd } from "@/components/public-shell";
import { SITE_URL, SITE_NAME, subjectSlug, levelLong, url } from "@/config/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Annales Bac Maroc — Examens Nationaux & Régionaux (1bac & 2bac) | Bac-up",
  description:
    "Tous les sujets du Bac marocain avec corrigés détaillés : Maths, Physique-Chimie, SVT et plus. 1ère et 2ème année Bac, sessions normale et rattrapage, entraînement chronométré et IA.",
  keywords: [
    "annales bac maroc", "sujet bac maroc", "examen national maroc", "1bac", "2bac",
    "examen régional", "maths bac maroc", "physique bac maroc", "svt bac maroc", "corrigé bac",
  ],
  alternates: { canonical: url("/examens") },
  openGraph: {
    title: "Annales Bac Maroc — Examens Nationaux & Régionaux (1bac & 2bac)",
    description: "Sujets et corrigés du Bac marocain, 1bac & 2bac, avec entraînement chronométré et IA.",
    url: url("/examens"),
    type: "website",
    locale: "fr_FR",
  },
  robots: { index: true, follow: true },
};

type ExamRow = {
  id: string;
  year: number;
  session: string;
  exam_type: string;
  levels: { code: string; name: string } | null;
  subjects: { code: string; name: string } | null;
};

export default async function ExamensHub() {
  const sb = createPublicSupabase();
  const { data } = await sb
    .from("exams")
    .select("id, year, session, exam_type, levels(code,name), subjects(code,name)")
    .order("year", { ascending: false });
  const exams = (data ?? []) as unknown as ExamRow[];

  const byLevel = new Map<string, { name: string; subjects: Map<string, { name: string; code: string; count: number; minY: number; maxY: number }> }>();
  const years = new Set<number>();
  const subjectCodes = new Set<string>();
  for (const e of exams) {
    const lc = e.levels?.code ?? "2bac";
    const ln = e.levels?.name ?? "Baccalauréat";
    const sc = e.subjects?.code ?? "?";
    const sn = e.subjects?.name ?? "Matière";
    years.add(e.year);
    subjectCodes.add(sc);
    if (!byLevel.has(lc)) byLevel.set(lc, { name: ln, subjects: new Map() });
    const lvl = byLevel.get(lc)!;
    if (!lvl.subjects.has(sc)) lvl.subjects.set(sc, { name: sn, code: sc, count: 0, minY: e.year, maxY: e.year });
    const sub = lvl.subjects.get(sc)!;
    sub.count++;
    sub.minY = Math.min(sub.minY, e.year);
    sub.maxY = Math.max(sub.maxY, e.year);
  }

  const yrs = [...years].sort();
  const stats = [
    { icon: FileText, v: exams.length, l: "sujets" },
    { icon: CheckCircle2, v: exams.length, l: "corrigés" },
    { icon: BookOpen, v: subjectCodes.size, l: "matières" },
    { icon: CalendarDays, v: yrs.length, l: "années" },
  ];

  const levelOrder = ["1bac", "2bac"];
  const levels = [...byLevel.entries()].sort((a, b) => levelOrder.indexOf(a[0]) - levelOrder.indexOf(b[0]));

  const faq = [
    { q: "Les sujets et corrigés sont-ils gratuits ?", a: "Oui, tu peux consulter les énoncés et les corrigés détaillés gratuitement. L'entraînement chronométré, l'IA et le suivi de progression sont inclus dans l'accès complet." },
    { q: "Bac-up couvre-t-il la 1ère année du Bac ?", a: "Oui. Contrairement à la plupart des plateformes, Bac-up couvre le 1bac (régional) et le 2bac (national) — pour construire tes bases avant l'examen national." },
    { q: "Puis-je m'entraîner dans les conditions de l'examen ?", a: "Oui. Chaque sujet peut être lancé en mode examen blanc chronométré, avec une note sur 20 et une correction détaillée à la fin." },
  ];

  return (
    <div className="c-page min-h-screen">
      <PublicNav />

      <main className="max-w-6xl mx-auto px-5 py-10">
        <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Espace préparation" }]} />

        <header className="mt-6 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wide c-accent">Espace préparation</span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Annales du Bac marocain — sujets & corrigés
          </h1>
          <p className="mt-4 c-sub">
            Examens nationaux et régionaux, 1bac et 2bac, avec corrections détaillées. Entraîne-toi
            dans les vraies conditions de l&apos;épreuve et comprends chaque erreur.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.l} className="c-card rounded-2xl p-5">
              <s.icon className="w-5 h-5 c-accent" />
              <div className="mt-3 text-3xl font-extrabold">{s.v}</div>
              <div className="text-sm c-dim">{s.l}</div>
            </div>
          ))}
        </div>

        {levels.length === 0 && <p className="mt-12 c-dim">Le contenu arrive très bientôt. ✨</p>}
        {levels.map(([lc, lvl]) => (
          <section key={lc} className="mt-14">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${lc === "1bac" ? "bg-arctic-cyan/15 c-accent" : "bg-arctic-blue/15 c-accent"}`}>
                {lc}
              </span>
              <h2 className="text-xl font-bold tracking-tight">{levelLong(lc)}</h2>
            </div>
            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...lvl.subjects.values()].sort((a, b) => a.name.localeCompare(b.name)).map((sub) => (
                <Link
                  key={sub.code}
                  href={`/examens/${lc}/${subjectSlug(sub.code)}`}
                  className="c-card rounded-2xl p-5 hover:-translate-y-1 transition duration-300 group block"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-arctic-cyan/25 to-arctic-blue/25 c-accent grid place-items-center">
                      <FileText className="w-5 h-5" />
                    </span>
                    <ChevronRight className="w-5 h-5 c-dim group-hover:c-accent transition" />
                  </div>
                  <div className="mt-4 font-bold tracking-tight">{sub.name}</div>
                  <div className="mt-1 text-xs c-dim">
                    {sub.count} examen{sub.count > 1 ? "s" : ""} · {sub.minY === sub.maxY ? sub.minY : `${sub.minY}–${sub.maxY}`}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-16 rounded-3xl p-8 border border-arctic-cyan/25 bg-gradient-to-br from-arctic-cyan/10 to-arctic-blue/5 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <Timer className="w-6 h-6 c-accent" /> Prêt à te tester ?
            </h2>
            <p className="mt-2 c-sub">Lance un examen blanc chronométré, note sur 20 et correction détaillée.</p>
          </div>
          <Link href="/signup" className="shrink-0 px-6 py-3.5 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-semibold hover:brightness-105 transition">
            Commencer gratuitement →
          </Link>
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-extrabold tracking-tight">Questions fréquentes</h2>
          <div className="mt-6 space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="c-card rounded-2xl p-5 group">
                <summary className="cursor-pointer font-semibold list-none flex items-center justify-between">
                  {f.q}
                  <ChevronRight className="w-4 h-4 c-dim group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-sm c-sub leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Espace préparation", item: url("/examens") },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          name: `Annales Bac Maroc — ${SITE_NAME}`,
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </div>
  );
}
