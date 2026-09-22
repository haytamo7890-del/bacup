import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, FileText, Sparkles, ListChecks } from "lucide-react";
import { createPublicSupabase } from "@/lib/supabase-public";
import { PublicNav, PublicFooter, Breadcrumbs, JsonLd } from "@/components/public-shell";
import { Tex } from "@/components/math";
import {
  SITE_URL, subjectSlug, subjectCodeFromSlug, parseExamSlug, examSlug,
  sessionLabel, examTypeLabel, levelLong, levelLabel, url, LEVEL_SLUGS,
} from "@/config/site";

export const revalidate = 3600;

type Params = { level: string; subject: string; exam: string };
type Opt = { id: string; label: string; is_correct: boolean; position: number };
type Sol = { body: string; author: string };
type Q = { id: string; statement: string; points: number; position: number; answer_options: Opt[]; solutions: Sol[] };
type Ex = { id: string; title: string | null; position: number; questions: Q[] };

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
    .select("id, year, session, exam_type")
    .eq("level_id", lvl.id).eq("subject_id", subj.id)
    .eq("year", parsed.year).eq("session", parsed.session)
    .maybeSingle();
  if (!exam) return null;
  const { data: exercises } = await sb
    .from("exercises")
    .select("id, title, position, questions(id, statement, points, position, answer_options(id,label,is_correct,position), solutions(body,author))")
    .eq("exam_id", exam.id)
    .order("position");
  const list = ((exercises ?? []) as unknown as Ex[]).map((ex) => ({
    ...ex,
    questions: [...(ex.questions ?? [])]
      .sort((a, b) => a.position - b.position)
      .map((q) => ({ ...q, answer_options: [...(q.answer_options ?? [])].sort((a, b) => a.position - b.position) })),
  }));
  return { lvl, subj, exam, exercises: list };
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
  const title = `Corrigé ${d.subj.name} ${d.exam.year} (${levelLabel(level)}) — Correction détaillée | Bac-up`;
  const description = `Correction détaillée, étape par étape, de l'${examTypeLabel(d.exam.exam_type).toLowerCase()} de ${d.subj.name} ${d.exam.year}, ${sessionLabel(d.exam.session).toLowerCase()}. Corrigé original Bac-up + explications IA.`;
  return {
    title,
    description,
    keywords: [`corrigé ${d.subj.name.toLowerCase()} ${d.exam.year}`, `correction bac ${d.exam.year}`, `solution ${d.subj.name.toLowerCase()}`, level],
    alternates: { canonical: url(`/examens/${level}/${subject}/${exam}/corrige`) },
    openGraph: { title, description, url: url(`/examens/${level}/${subject}/${exam}/corrige`), type: "article", locale: "fr_FR" },
    robots: { index: true, follow: true },
  };
}

export default async function ExamCorrige({ params }: { params: Promise<Params> }) {
  const { level, subject, exam } = await params;
  const d = await load(level, subject, exam);
  if (!d) notFound();

  return (
    <div className="c-page min-h-screen">
      <PublicNav />
      <main className="max-w-3xl mx-auto px-5 py-10">
        <Breadcrumbs
          items={[
            { label: "Accueil", href: "/" },
            { label: "Espace préparation", href: "/examens" },
            { label: `${d.subj.name} ${levelLabel(level)}`, href: `/examens/${level}/${subject}` },
            { label: `${d.exam.year}`, href: `/examens/${level}/${subject}/${exam}` },
            { label: "Corrigé" },
          ]}
        />

        <header className="mt-6">
          <span className="text-xs font-bold uppercase tracking-wide c-accent">Corrigé détaillé · {sessionLabel(d.exam.session)}</span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Correction — {d.subj.name} {d.exam.year}
          </h1>
          <p className="mt-3 c-sub text-sm">
            Correction originale Bac-up, rédigée étape par étape. Bloqué sur une étape ? L&apos;IA
            te la réexplique à ton niveau.
          </p>
        </header>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/examens/${level}/${subject}/${exam}`} className="px-5 py-3 rounded-full c-soft text-sm font-semibold hover:brightness-95 transition inline-flex items-center gap-2">
            <FileText className="w-4 h-4" /> Revoir l&apos;énoncé
          </Link>
          <Link href="/signup" className="px-5 py-3 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-semibold hover:brightness-105 transition inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Explique-moi avec l&apos;IA
          </Link>
        </div>

        <div className="mt-8 space-y-5">
          {d.exercises.map((ex, i) => (
            <article key={ex.id} className="c-card rounded-3xl p-6">
              <div className="flex items-center gap-2 c-accent text-sm font-bold">
                <ListChecks className="w-4 h-4" /> Exercice {i + 1}
              </div>
              {ex.title && <h2 className="mt-1 text-lg font-bold tracking-tight">{ex.title}</h2>}
              <div className="mt-4 space-y-4">
                {ex.questions.map((q, qi) => {
                  const correct = q.answer_options.find((o) => o.is_correct);
                  const sol = q.solutions?.[0]?.body;
                  return (
                    <div key={q.id} className="rounded-2xl c-soft p-4">
                      <div className="text-[15px]"><span className="font-semibold c-dim">{qi + 1}.</span> <Tex>{q.statement}</Tex></div>
                      {correct && (
                        <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 px-3 py-2 text-sm">
                          <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-500 grid place-items-center"><Check className="w-3.5 h-3.5" /></span>
                          <span className="font-medium">Réponse : <Tex>{correct.label}</Tex></span>
                        </div>
                      )}
                      {sol && (
                        <div className="mt-3">
                          <div className="text-[11px] font-bold uppercase tracking-wide c-dim">Explication</div>
                          <p className="mt-1.5 text-[15px] c-sub leading-relaxed whitespace-pre-wrap"><Tex>{sol}</Tex></p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
          {d.exercises.length === 0 && <p className="c-dim">Le corrigé de ce sujet arrive bientôt. ✨</p>}
        </div>

        <section className="mt-10 rounded-3xl p-7 border border-arctic-cyan/25 bg-gradient-to-br from-arctic-cyan/10 to-arctic-blue/5 text-center">
          <h2 className="text-xl font-extrabold tracking-tight">Transforme ce corrigé en vraie progression</h2>
          <p className="mt-2 c-sub text-sm">Refais le sujet chronométré, note sur 20, et suivi de tes chapitres faibles.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-semibold hover:brightness-105 transition">
            Commencer gratuitement →
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
            { "@type": "ListItem", position: 4, name: `${d.exam.year}`, item: url(`/examens/${level}/${subject}/${exam}`) },
            { "@type": "ListItem", position: 5, name: "Corrigé", item: url(`/examens/${level}/${subject}/${exam}/corrige`) },
          ],
        }}
      />
    </div>
  );
}
