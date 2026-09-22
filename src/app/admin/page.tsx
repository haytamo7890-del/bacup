"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import {
  BadgeCheck, Users, BookOpen, FileText, Loader2, Wallet, TrendingUp, Sparkles, UserCheck, ArrowRight,
} from "lucide-react";

type Paid = { amount_mad: number; created_at: string };
type Stats = {
  revenue: number; monthRevenue: number; customers: number;
  active: number; demo: number; pending: number;
  pendingPay: number; lessons: number; exams: number;
  oneBac: number; twoBac: number;
  series: { label: string; value: number }[];
};

export default function AdminHome() {
  const supabase = createBrowserSupabase();
  const [s, setS] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const [paid, actC, demoC, pendC, pendPay, les, exm, lvl] = await Promise.all([
        // Revenue = only validated (approved) payments → activated accounts.
        supabase.from("payment_requests").select("amount_mad, created_at").eq("status", "approved"),
        supabase.from("student_profiles").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("student_profiles").select("id", { count: "exact", head: true }).eq("status", "demo"),
        supabase.from("student_profiles").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("payment_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("lessons").select("id", { count: "exact", head: true }),
        supabase.from("exams").select("id", { count: "exact", head: true }),
        supabase.from("student_profiles").select("levels(code)"),
      ]);

      let oneBac = 0, twoBac = 0;
      for (const r of (lvl.data ?? []) as { levels: unknown }[]) {
        const c = (r.levels as { code?: string } | null)?.code;
        if (c === "1bac") oneBac++; else if (c === "2bac") twoBac++;
      }

      const rows = (paid.data ?? []) as Paid[];
      const now = new Date();
      const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // last 6 monthly buckets
      const buckets: { key: string; label: string; value: number }[] = [];
      const ML = ["janv", "févr", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: ML[d.getMonth()], value: 0 });
      }
      const idx = new Map(buckets.map((b, i) => [b.key, i]));
      for (const r of rows) {
        const d = new Date(r.created_at);
        const k = `${d.getFullYear()}-${d.getMonth()}`;
        const i = idx.get(k);
        if (i != null) buckets[i].value += Number(r.amount_mad) || 0;
      }

      setS({
        revenue: rows.reduce((a, r) => a + (Number(r.amount_mad) || 0), 0),
        monthRevenue: rows.filter((r) => new Date(r.created_at) >= startMonth).reduce((a, r) => a + (Number(r.amount_mad) || 0), 0),
        customers: rows.length,
        active: actC.count ?? 0, demo: demoC.count ?? 0, pending: pendC.count ?? 0,
        pendingPay: pendPay.count ?? 0, lessons: les.count ?? 0, exams: exm.count ?? 0,
        oneBac, twoBac,
        series: buckets.map((b) => ({ label: b.label, value: b.value })),
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmt = (n: number) => n.toLocaleString("fr-FR");
  const loading = !s;

  return (
    <div className="max-w-6xl fade-up">
      <h1 className="text-3xl font-bold tracking-tight">Vue d&apos;ensemble</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Revenus, comptes et contenu — tout Bac Up depuis ici.</p>

      {/* TOP: revenue chart + key figures */}
      <div className="mt-7 grid lg:grid-cols-3 gap-4">
        {/* chart */}
        <div className="lg:col-span-2 glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-neutral-400">Revenu · 6 derniers mois</div>
              <div className="mt-1 text-3xl font-extrabold tracking-tight">{loading ? <Dots /> : `${fmt(s!.revenue)} DH`}</div>
              <div className="text-xs text-neutral-400">total validé · {loading ? "…" : fmt(s!.customers)} client(s)</div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" /> {loading ? "…" : `${fmt(s!.monthRevenue)} DH ce mois`}
            </span>
          </div>
          <div className="mt-4">{loading ? <div className="h-40 grid place-items-center"><Dots /></div> : <RevenueChart data={s!.series} />}</div>
        </div>

        {/* figures */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <Money label="Revenu ce mois" value={loading ? null : `${fmt(s!.monthRevenue)} DH`} icon={Wallet} accent="text-emerald-500 bg-emerald-500/15" />
          <Money label="Clients payants" value={loading ? null : fmt(s!.customers)} icon={UserCheck} accent="text-arctic-blue dark:text-arctic-cyan bg-arctic-blue/15" />
        </div>
      </div>

      {/* ACCOUNTS */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Comptes actifs" value={s?.active} loading={loading} icon={Users} href="/admin/etudiants" accent="text-emerald-500 bg-emerald-500/15" />
        <Stat label="En démo" value={s?.demo} loading={loading} icon={Sparkles} href="/admin/etudiants" accent="text-arctic-blue dark:text-arctic-cyan bg-arctic-blue/15" />
        <Stat label="Paiements en attente" value={s?.pendingPay} loading={loading} icon={BadgeCheck} href="/admin/activations" accent="text-amber-500 bg-amber-400/15" />
        <Stat label="En attente" value={s?.pending} loading={loading} icon={Users} href="/admin/etudiants" accent="text-neutral-500 bg-neutral-400/15" />
      </div>

      {/* ACCOUNTS BY NIVEAU */}
      <div className="mt-6 text-xs font-bold uppercase tracking-wide text-neutral-400">Comptes par niveau</div>
      <div className="mt-3 glass rounded-3xl p-6">
        {loading ? <div className="h-16 grid place-items-center"><Dots /></div> : (() => {
          const total = s!.oneBac + s!.twoBac;
          const p1 = total ? (s!.oneBac / total) * 100 : 0;
          const p2 = total ? (s!.twoBac / total) * 100 : 0;
          return (
            <>
              <div className="flex items-end justify-between gap-6 flex-wrap">
                <div>
                  <div className="text-3xl font-extrabold tracking-tight">{fmt(total)}</div>
                  <div className="text-xs text-neutral-400">élèves inscrits</div>
                </div>
                <div className="flex gap-8">
                  <div className="text-right">
                    <div className="text-2xl font-extrabold tracking-tight text-arctic-blue dark:text-arctic-cyan">{fmt(s!.oneBac)}</div>
                    <div className="text-[11px] font-semibold text-neutral-400">1 BAC · {Math.round(p1)}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold tracking-tight text-emerald-500">{fmt(s!.twoBac)}</div>
                    <div className="text-[11px] font-semibold text-neutral-400">2 BAC · {Math.round(p2)}%</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 h-2.5 rounded-full overflow-hidden bg-black/[0.06] dark:bg-white/[0.08] flex">
                <div className="h-full bg-arctic-blue transition-all" style={{ width: `${p1}%` }} />
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${p2}%` }} />
              </div>
            </>
          );
        })()}
      </div>

      {/* CONTENT MANAGEMENT */}
      <div className="mt-6 text-xs font-bold uppercase tracking-wide text-neutral-400">Contenu</div>
      <div className="mt-3 grid sm:grid-cols-2 gap-4">
        <Manage href="/admin/cours" icon={BookOpen} title="Cours & résumés" desc={`${loading ? "…" : fmt(s!.lessons)} leçon(s) · ajoute tes ressources`} />
        <Manage href="/admin/examens" icon={FileText} title="Examens & annales" desc={`${loading ? "…" : fmt(s!.exams)} examen(s) · ajoute sujets & corrigés`} />
      </div>

      {(s?.pendingPay ?? 0) > 0 && (
        <Link href="/admin/activations" className="mt-6 block glass rounded-2xl p-5 border border-amber-400/30">
          <div className="font-semibold text-amber-500">{s?.pendingPay} paiement(s) à vérifier</div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">Vérifie les reçus et active les comptes →</div>
        </Link>
      )}
    </div>
  );
}

function Dots() { return <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />; }

function RevenueChart({ data }: { data: { label: string; value: number }[] }) {
  const W = 560, H = 170, padX = 12, padTop = 14, padBot = 26;
  const max = Math.max(1, ...data.map((d) => d.value));
  const n = data.length;
  const pts = data.map((d, i) => {
    const x = padX + (n === 1 ? 0 : (i / (n - 1)) * (W - padX * 2));
    const y = (H - padBot) - (d.value / max) * (H - padTop - padBot);
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[n - 1][0].toFixed(1)},${H - padBot} L${pts[0][0].toFixed(1)},${H - padBot} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <defs>
        <linearGradient id="rv" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#0db8d3" /><stop offset="1" stopColor="#1b7fdc" /></linearGradient>
        <linearGradient id="rvf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b7fdc" stopOpacity="0.22" /><stop offset="1" stopColor="#1b7fdc" stopOpacity="0" /></linearGradient>
      </defs>
      {[0, 0.5, 1].map((g) => { const y = padTop + g * (H - padTop - padBot); return <line key={g} x1={padX} y1={y} x2={W - padX} y2={y} className="stroke-black/[0.06] dark:stroke-white/[0.06]" strokeWidth="1" />; })}
      <path d={area} fill="url(#rvf)" />
      <path d={line} fill="none" stroke="url(#rv)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="3.5" fill="#1b7fdc" />
          <text x={p[0]} y={H - 8} textAnchor="middle" className="fill-neutral-400 text-[10px]">{data[i].label}</text>
        </g>
      ))}
    </svg>
  );
}

function Money({ label, value, icon: Icon, accent }: { label: string; value: string | null; icon: React.ElementType; accent: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <span className={`w-10 h-10 rounded-xl grid place-items-center ${accent}`}><Icon className="w-5 h-5" /></span>
      <div className="mt-4 text-2xl font-extrabold tracking-tight">{value ?? <Dots />}</div>
      <div className="mt-1 text-xs text-neutral-400">{label}</div>
    </div>
  );
}

function Stat({ label, value, loading, icon: Icon, href, accent }: {
  label: string; value?: number; loading: boolean; icon: React.ElementType; href: string; accent: string;
}) {
  return (
    <Link href={href} className="glass rounded-2xl p-5 hover:-translate-y-0.5 transition">
      <span className={`w-10 h-10 rounded-xl grid place-items-center ${accent}`}><Icon className="w-5 h-5" /></span>
      <div className="mt-4 text-3xl font-extrabold tracking-tight">{loading ? <Dots /> : (value ?? 0).toLocaleString("fr-FR")}</div>
      <div className="mt-1 text-xs text-neutral-400">{label}</div>
    </Link>
  );
}

function Manage({ href, icon: Icon, title, desc }: { href: string; icon: React.ElementType; title: string; desc: string }) {
  return (
    <Link href={href} className="glass rounded-2xl p-5 flex items-center gap-4 hover:-translate-y-0.5 transition">
      <span className="w-11 h-11 rounded-2xl grid place-items-center bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan shrink-0"><Icon className="w-5 h-5" /></span>
      <div className="min-w-0 flex-1">
        <div className="font-bold tracking-tight">{title}</div>
        <div className="text-xs text-neutral-400 truncate">{desc}</div>
      </div>
      <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0" />
    </Link>
  );
}
