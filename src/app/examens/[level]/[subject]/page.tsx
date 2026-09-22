import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FileText, ChevronRight, Timer, ArrowRight } from "lucide-react";
import { createPublicSupabase } from "@/lib/supabase-public";
import { PublicNav, PublicFooter, Breadcrumbs, JsonLd } from "@/components/public-shell";
import {
  SITE_URL, subjectSlug, subjectCodeFromSlug, examSlug, sessionShort,
  examTypeLabel, levelLong, levelLabel, url, LEVEL_SLUGS,
} from "@/config/site";

export const revalidate = 3600;

type Params = { level: string; subject: string };

async function load(level: string, subjectSlugParam: string) {
  const code = subjectCodeFromSlug(subjectSlugParam);
  if (!code || !LEVEL_SLUGS.includes(level as (typeof LEVEL_SLUGS)[number])) return null;
  const sb = createPublicSupabase();
  const { data: lvl } = await sb.from("levels").select("id, code, name").eq("code", level).maybeSingle();
  const { data: subj } = await sb.from("subjects").select("id, code, name").eq("code", code).maybeSingle();
  if (!lvl || !subj) return null;
  const { data: exams } = await sb
    .from("exams")
    .select("id, year, session, exam_type, duration_minutes, title")
    .eq("level_id", lvl.id)
    .eq("subject_id", subj.id)
    .order("year", { ascending: false });
  return { lvl, subj, exams: exams ?? [] };
}

export async function generateStaticParams() {
  const sb = createPublicSupabase();
  const { data } = await sb.from("exams").select("levels(code), subjects(code)");
  const seen = new Set<string>();
  const params: Params[] = [];
  for (const row of (data ?? []) as unknown as { levels: { code: string } | null; subjects: { code: string } | null }[]) {
    const lc = row.levels?.code;
    const sc = row.subjects?.code;
    if (!lc || !sc) continue;
    const key = `${lc}/${sc}`;
    if (seen.has(key)) continue;
    seen.add(key);
    params.push({ level: lc, subject: subjectSlug(sc) });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { level, subject } = await params;
  const d = await load(level, subject);
  if (!d) return { title: "Introuvable | Bac-up" };
  const title = `${d.subj.name} ${levelLabel(level)} — Sujets & Corrigés Bac Maroc | Bac-up`;
  const description = `Tous les sujets d'examen de ${d.subj.name} pour le ${levelLong(level)} au Maroc, avec corrigés détaillés. Sessions normale et rattrapage, entraînement chronométré et IA.`;
  return {
    title,
    description,
    keywords: [`${d.subj.name.toLowerCase()} bac maroc`, `sujet ${d.subj.name.toLowerCase()}`, `corrigé ${d.subj.name.toLowerCase()}`, level, "annales bac"],
    alternates: { canonical: url(`/examens/${level}/${subject}`) },
    openGraph: { title, description, url: url(`/examens/${level}/${subject}`), type: "website", locale: "fr_FR" },
    robots: { index: true, follow: true },
  };
}

export default async function SubjectHub({ params }: { params: Promise<Params> }) {
  const { level, subject } = await params;
  const d = await load(level, subject);
  if (!d) notFound();

  return (
    <div className="c-page min-h-screen">
      <PublicNav />
      <main className="max-w-5xl mx-auto px-5 py-10">
        <Breadcrumbs
          items={[
            { label: "Accueil", href: "/" },
            { label: "Espace préparation", href: "/examens" },
            { label: `${d.subj.name} · ${levelLabel(level)}` },
          ]}
        />

        <header className="mt-6 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wide c-accent">{levelLong(level)}</span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
            {d.subj.name} — sujets & corrigés
          </h1>
          <p className="mt-4 c-sub">
            Retrouve les examens de {d.subj.name} ({levelLabel(level)}), en session normale et de
            rattrapage. Chaque énoncé est accompagné de notre correction détaillée, étape par étape.
          </p>
        </header>

        <div className="mt-8 space-y-3">
          {d.exams.length === 0 && <p className="c-dim">Les sujets arrivent bientôt. ✨</p>}
          {d.exams.map((e) => {
            const slug = examSlug(e.year, e.session);
            return (
              <div key={e.id} className="c-card rounded-2xl p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold tracking-tight">{examTypeLabel(e.exam_type)} {e.year}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full c-chip">{sessionShort(e.session)}</span>
                    {e.duration_minutes ? <span className="text-[11px] c-dim">{Math.round(e.duration_minutes / 60)}h</span> : null}
                  </div>
                  <div className="mt-1 text-xs c-dim truncate">{e.title ?? `${d.subj.name} — ${e.year}`}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/examens/${level}/${subject}/${slug}`} className="text-sm font-semibold px-3.5 py-2 rounded-full c-soft hover:brightness-95 transition inline-flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Énoncé
                  </Link>
                  <Link href={`/examens/${level}/${subject}/${slug}/corrige`} className="text-sm font-semibold px-3.5 py-2 rounded-full bg-arctic-cyan/15 c-accent hover:brightness-95 transition inline-flex items-center gap-1.5">
                    Corrigé <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <section className="mt-14 rounded-3xl p-8 border border-arctic-cyan/25 bg-gradient-to-br from-arctic-cyan/10 to-arctic-blue/5 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
              <Timer className="w-5 h-5 c-accent" /> Entraîne-toi en conditions réelles
            </h2>
            <p className="mt-2 c-sub">Chronomètre officiel, note sur 20, correction et explications IA.</p>
          </div>
          <Link href="/signup" className="shrink-0 px-6 py-3.5 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-semibold hover:brightness-105 transition inline-flex items-center gap-2">
            Lancer un examen blanc <ArrowRight className="w-4 h-4" />
          </Link>
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
            { "@type": "ListItem", position: 3, name: `${d.subj.name} ${levelLabel(level)}`, item: url(`/examens/${level}/${subject}`) },
          ],
        }}
      />
    </div>
  );
}
