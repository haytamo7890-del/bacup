import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Timer, ArrowRight, ListChecks } from "lucide-react";
import { createPublicSupabase } from "@/lib/supabase-public";
import { PublicNav, PublicFooter, Breadcrumbs, JsonLd } from "@/components/public-shell";
import { Tex } from "@/components/math";
import {
  SITE_URL, subjectSlug, subjectCodeFromSlug, parseExamSlug, examSlug,
  sessionLabel, examTypeLabel, levelLong, levelLabel, url, LEVEL_SLUGS,
} from "@/config/site";

export const revalidate = 3600;

type Params = { level: string; subject: string; exam: string };
type Opt = { id: string; label: string; position: number };
type Q = { id: string; statement: string; points: number; position: number; answer_options: Opt[] };
type Ex = { id: string; title: string | null; statement: string | null; position: number; questions: Q[] };

async function load(level: string, subjectSlugParam: string, examSlugParam: string) {
  const code = subjectCodeFromSlug(subjectSlugParam);
  const parsed = parseExamSlug(examSlugParam);
  if (!code || !parsed || !LEVEL_SLUGS.includes(level as (typeof LEVEL_SLUGS)[number])) return null;
  const sb = createPublicSupabase();
  const { data: lvl } = await sb.from("levels").select("id, code, name").eq("code", level).maybeSingle();
  const { data: subj } = await sb.from("subjects").select("id, code, name").eq("code", code).maybeSingle();
  if (!lvl || !subj) return null;
  const { data: exam } = await sb
    .from("exams")
    .select("id, year, session, exam_type, duration_minutes, title")
    .eq("level_id", lvl.id)
    .eq("subject_id", subj.id)
    .eq("year", parsed.year)
    .eq("session", parsed.session)
    .maybeSingle();
  if (!exam) return null;
  const { data: exercises } = await sb
    .from("exercises")
    .select("id, title, statement, position, questions(id, statement, points, position, answer_options(id, label, position))")
    .eq("exam_id", exam.id)
    .order("position");
  const list = ((exercises ?? []) as unknown as Ex[]).map((ex) => ({
    ...ex,
    questions: [...(ex.questions ?? [])]
      .sort((a, b) => a.position - b.position)
      .map((q) => ({ ...q, answer_options: [...(q.answer_options ?? [])].sort((a, b) => a.position - b.position) })),
  }));
  const total = list.reduce((s, ex) => s + ex.questions.reduce((t, q) => t + Number(q.points || 0), 0), 0);
  return { lvl, subj, exam, exercises: list, total };
}

export async function generateStaticParams() {
  const sb = createPublicSupabase();
  const { data } = await sb.from("exams").select("year, session, levels(code), subjects(code)");
  const params: Params[] = [];
  for (const row of (data ?? []) as unknown as { year: number; session: string; levels: { code: string } | null; subjects: { code: string } | null }[]) {
    const lc = row.levels?.code, sc = row.subjects?.code;
    if (!lc || !sc) continue;
    params.push({ level: lc, subject: subjectSlug(sc), exam: examSlug(row.year, row.session) });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { level, subject, exam } = await params;
  const d = await load(level, subject, exam);
  if (!d) return { title: "Introuvable | Bac-up" };
  const title = `${examTypeLabel(d.exam.exam_type)} ${d.subj.name} ${d.exam.year} (${levelLabel(level)}) — Énoncé | Bac-up`;
  const description = `Énoncé de l'${examTypeLabel(d.exam.exam_type).toLowerCase()} de ${d.subj.name} ${d.exam.year}, ${sessionLabel(d.exam.session).toLowerCase()}, ${levelLong(level)}. Sujet complet + corrigé détaillé et entraînement chronométré sur Bac-up.`;
  return {
    title,
    description,
    keywords: [`${d.subj.name.toLowerCase()} bac ${d.exam.year}`, `examen national ${d.exam.year}`, `sujet ${d.subj.name.toLowerCase()} ${d.exam.year}`, level],
    alternates: { canonical: url(`/examens/${level}/${subject}/${exam}`) },
    openGraph: { title, description, url: url(`/examens/${level}/${subject}/${exam}`), type: "article", locale: "fr_FR" },
    robots: { index: true, follow: true },
  };
}

export default async function ExamEnonce({ params }: { params: Promise<Params> }) {
  const { level, subject, exam } = await params;
  const d = await load(level, subject, exam);
  if (!d) notFound();
  const durationH = d.exam.duration_minutes ? `${Math.round(d.exam.duration_minutes / 60)}h` : null;

  return (
    <div className="c-page min-h-screen">
      <PublicNav />
      <main className="max-w-3xl mx-auto px-5 py-10">
        <Breadcrumbs
          items={[
            { label: "Accueil", href: "/" },
            { label: "Espace préparation", href: "/examens" },
            { label: `${d.subj.name} ${levelLabel(level)}`, href: `/examens/${level}/${subject}` },
            { label: `${d.exam.year}` },
          ]}
        />

        <header className="mt-6">
          <span className="text-xs font-bold uppercase tracking-wide c-accent">
            {examTypeLabel(d.exam.exam_type)} · {sessionLabel(d.exam.session)}
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
            {d.subj.name} — {examTypeLabel(d.exam.exam_type)} {d.exam.year}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full c-chip">{levelLong(level)}</span>
            {durationH && <span className="px-2.5 py-1 rounded-full c-chip inline-flex items-center gap-1"><Timer className="w-3 h-3" /> {durationH}</span>}
            {d.total > 0 && <span className="px-2.5 py-1 rounded-full c-chip">Barème {d.total % 1 === 0 ? d.total : d.total.toFixed(1)} pts</span>}
            <span className="px-2.5 py-1 rounded-full bg-arctic-cyan/15 c-accent">Énoncé officiel</span>
          </div>
        </header>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/signup" className="px-5 py-3 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-semibold hover:brightness-105 transition inline-flex items-center gap-2">
            <Timer className="w-4 h-4" /> Passer en examen blanc
          </Link>
          <Link href={`/examens/${level}/${subject}/${exam}/corrige`} className="px-5 py-3 rounded-full c-soft text-sm font-semibold hover:brightness-95 transition inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 c-accent" /> Voir le corrigé
          </Link>
        </div>

        <div className="mt-8 space-y-5">
          {d.exercises.map((ex, i) => (
            <article key={ex.id} className="c-card rounded-3xl p-6">
              <div className="flex items-center gap-2 c-accent text-sm font-bold">
                <ListChecks className="w-4 h-4" /> Exercice {i + 1}
              </div>
              {ex.title && <h2 className="mt-1 text-lg font-bold tracking-tight">{ex.title}</h2>}
              {ex.statement && <p className="mt-3 text-[15px] c-sub leading-relaxed"><Tex>{ex.statement}</Tex></p>}
              <ol className="mt-4 space-y-4">
                {ex.questions.map((q, qi) => (
                  <li key={q.id} className="rounded-2xl c-soft p-4">
                    <div className="flex justify-between gap-3">
                      <div className="text-[15px]"><span className="font-semibold c-dim">{qi + 1}.</span> <Tex>{q.statement}</Tex></div>
                      {q.points ? <span className="shrink-0 text-[11px] c-dim">{Number(q.points)} pt</span> : null}
                    </div>
                    {q.answer_options.length > 0 && (
                      <div className="mt-3 grid sm:grid-cols-2 gap-2">
                        {q.answer_options.map((o, oi) => (
                          <div key={o.id} className="flex items-center gap-2.5 rounded-xl c-soft px-3 py-2 text-sm c-sub">
                            <span className="w-5 h-5 rounded-md c-chip grid place-items-center text-[11px] font-bold">{String.fromCharCode(65 + oi)}</span>
                            <Tex>{o.label}</Tex>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </article>
          ))}
          {d.exercises.length === 0 && <p className="c-dim">L&apos;énoncé de ce sujet arrive bientôt. ✨</p>}
        </div>

        <section className="mt-10 rounded-3xl p-7 border border-arctic-cyan/25 bg-gradient-to-br from-arctic-cyan/10 to-arctic-blue/5 text-center">
          <h2 className="text-xl font-extrabold tracking-tight">Comprends chaque question, pas seulement la réponse</h2>
          <p className="mt-2 c-sub text-sm">Corrigé détaillé + IA qui réexplique à ton niveau, en 5 modes.</p>
          <Link href={`/examens/${level}/${subject}/${exam}/corrige`} className="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-semibold hover:brightness-105 transition">
            Voir le corrigé détaillé <ArrowRight className="w-4 h-4" />
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
            { "@type": "ListItem", position: 4, name: `${examTypeLabel(d.exam.exam_type)} ${d.exam.year}`, item: url(`/examens/${level}/${subject}/${exam}`) },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: `${examTypeLabel(d.exam.exam_type)} ${d.subj.name} ${d.exam.year}`,
          educationalLevel: levelLong(level),
          learningResourceType: "Exam",
          inLanguage: "fr",
          isAccessibleForFree: true,
          provider: { "@type": "Organization", name: "Bac-up", url: SITE_URL },
        }}
      />
    </div>
  );
}
