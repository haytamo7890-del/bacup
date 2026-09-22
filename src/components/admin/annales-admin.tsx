"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useAdminLevel } from "@/lib/admin-level";
import {
  Upload, FileText, Trash2, Loader2, ExternalLink, Plus, ScrollText,
  CheckCircle2, AlertTriangle, X,
} from "lucide-react";

type Subject = { id: string; code: string; name: string };
type Res = {
  id: string; scope_key: string; name: string; storage_path: string;
  size_bytes: number; filiere: string | null; year: number | null; session: string | null; kind: string; niveau: string | null;
};
type Exam = { key: string; filiere: string; year: number; session: string; sujet: Res | null; corrige: Res | null };

const FILIERES_2 = [
  { tok: "sm", label: "Sciences Maths (SM)" },
  { tok: "smb", label: "SM-B / Sc. Ingénieur" },
  { tok: "pc", label: "Sciences Physiques (PC)" },
  { tok: "svt", label: "SVT" },
];
const FILIERES_1 = [{ tok: "commun", label: "Régional (commun)" }];
const FIL_SHORT: Record<string, string> = { sm: "SM", smb: "SM-B", pc: "PC", svt: "SVT", commun: "Commun" };
const SESSIONS = [{ tok: "normale", label: "Normale" }, { tok: "rattrapage", label: "Rattrapage" }];
const SESS_LABEL: Record<string, string> = { normale: "Normale", rattrapage: "Rattrapage" };

const SUBJ_TOK: Record<string, string> = {
  maths: "maths", math: "maths", "physique-chimie": "pc", physique: "pc", pc: "pc",
  svt: "svt", anglais: "anglais", philosophie: "philo", philo: "philo",
  "sciences-ingenieur": "si", si: "si", ingenieur: "si",
};

const MAX = 25 * 1024 * 1024;
const fmt = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} Ko` : `${(b / 1024 / 1024).toFixed(1)} Mo`);
const sel = "rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-arctic-blue";

type Toast = { kind: "ok" | "err"; msg: string };
type Target = { c: string; f: string; y: number; s: string; kind: "sujet" | "corrige" };

/** Admin manager for official annales: sujet + corrigé per matière/filière/année/session. */
export function AnnalesAdmin() {
  const supabase = createBrowserSupabase();
  const { niveau } = useAdminLevel();
  const FILIERES = niveau === "1bac" ? FILIERES_1 : FILIERES_2;
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [code, setCode] = useState("");
  const [allItems, setAllItems] = useState<Res[]>([]);
  const [loading, setLoading] = useState(false);
  const [filFilter, setFilFilter] = useState("all");

  const [fil, setFil] = useState("sm");

  // when the niveau switch changes, reset filière scope to that niveau's set
  useEffect(() => { setFil(FILIERES[0].tok); setFilFilter("all"); }, [niveau]); // eslint-disable-line react-hooks/exhaustive-deps
  const [year, setYear] = useState(new Date().getFullYear());
  const [session, setSession] = useState("normale");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const slotRef = useRef<HTMLInputElement | null>(null);   // per-slot upload (targeted)
  const bulkRef = useRef<HTMLInputElement | null>(null);
  const target = useRef<Target | null>(null);

  const say = (t: Toast) => { setToast(t); setTimeout(() => setToast(null), 4500); };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("subjects").select("id, code, name").order("name");
      const s = (data ?? []) as Subject[];
      setSubjects(s);
      setCode(s.find((x) => x.code === "maths")?.code ?? s[0]?.code ?? "");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("resources")
      .select("id, scope_key, name, storage_path, size_bytes, filiere, year, session, kind, niveau")
      .eq("scope", "subject").order("year", { ascending: false });
    setAllItems((data ?? []) as Res[]);
    setLoading(false);
  }, [supabase]);
  useEffect(() => { load(); }, [load]);

  const items = useMemo(() => allItems.filter((r) => r.scope_key === code && (r.niveau ?? "2bac") === niveau), [allItems, code, niveau]);
  // sessions per matière (for the selected niveau) — powers the matière hub + its counts
  const matiereCounts = useMemo(() => {
    const sets: Record<string, Set<string>> = {};
    for (const r of allItems) {
      if (r.kind === "corrige" || !r.filiere || r.year == null || !r.session || (r.niveau ?? "2bac") !== niveau) continue;
      (sets[r.scope_key] ??= new Set()).add(`${r.filiere}|${r.year}|${r.session}`);
    }
    const out: Record<string, number> = {};
    for (const k in sets) out[k] = sets[k].size;
    return out;
  }, [allItems, niveau]);

  const openUrl = (p: string) => supabase.storage.from("resources").getPublicUrl(p).data.publicUrl;

  async function put(file: File, c: string, f: string, y: number, s: string, kind: "sujet" | "corrige"): Promise<string | null> {
    if (file.type !== "application/pdf") return `${file.name}: PDF uniquement`;
    if (file.size > MAX) return `${file.name}: trop lourd (max 25 Mo)`;
    const prefix = kind === "corrige" ? "Corrige" : "Sujet";
    const path = `subject/${c}/${niveau}/${prefix}-${c}-${f}-${y}-${s}.pdf`;
    const name = `${y} · ${SESS_LABEL[s] ?? s} · ${FIL_SHORT[f] ?? f.toUpperCase()}${kind === "corrige" ? " · Corrigé" : ""}`;
    const up = await supabase.storage.from("resources").upload(path, file, { contentType: "application/pdf", upsert: true });
    if (up.error) return `${file.name}: ${up.error.message}`;
    const { data: { user } } = await supabase.auth.getUser();
    const { data: existing } = await supabase.from("resources").select("id").eq("storage_path", path).maybeSingle();
    const row = { scope: "subject", scope_key: c, name, storage_path: path, size_bytes: file.size, filiere: f, year: y, session: s, kind, niveau };
    const res = existing
      ? await supabase.from("resources").update(row).eq("id", existing.id)
      : await supabase.from("resources").insert({ ...row, created_by: user?.id ?? null });
    if (res.error) { await supabase.storage.from("resources").remove([path]); return `${file.name}: ${res.error.message}`; }
    return null;
  }

  function pickForTarget(t: Target) { target.current = t; slotRef.current?.click(); }

  async function onSlotFile(file: File | null) {
    const t = target.current;
    if (!file || !t) return;
    setBusy(true);
    const err = await put(file, t.c, t.f, t.y, t.s, t.kind);
    setBusy(false);
    if (slotRef.current) slotRef.current.value = "";
    target.current = null;
    if (err) say({ kind: "err", msg: err });
    else { say({ kind: "ok", msg: `${t.kind === "corrige" ? "Corrigé" : "Sujet"} enregistré : ${t.y} · ${SESS_LABEL[t.s]} · ${FIL_SHORT[t.f]}` }); load(); }
  }

  function parseName(fn: string): { c: string; f: string; y: number; s: string; kind: "sujet" | "corrige" } | null {
    const m = fn.toLowerCase().match(/(sujet|corrige)-([a-z-]+?)-(sm|smb|pc|svt|commun)-(\d{4})-(normale|rattrapage)/);
    if (!m) return null;
    const c = SUBJ_TOK[m[2]]; if (!c) return null;
    return { kind: m[1] === "corrige" ? "corrige" : "sujet", c, f: m[3], y: Number(m[4]), s: m[5] };
  }

  async function addBulk(files: FileList | File[]) {
    const arr = [...files].filter((f) => f.name.toLowerCase().endsWith(".pdf"));
    if (!arr.length) return;
    setBusy(true);
    let ok = 0; const errs: string[] = [];
    for (const file of arr) {
      const p = parseName(file.name);
      const err = p ? await put(file, p.c, p.f, p.y, p.s, p.kind) : await put(file, code, fil, year, session, "sujet");
      if (err) errs.push(err); else ok++;
    }
    setBusy(false);
    if (bulkRef.current) bulkRef.current.value = "";
    say(errs.length ? { kind: "err", msg: `${ok} ajouté(s), ${errs.length} échec(s). ${errs[0] ?? ""}` } : { kind: "ok", msg: `${ok} fichier(s) classé(s).` });
    load();
  }

  async function del(r: Res) {
    if (!confirm(`Supprimer « ${r.name} » ?`)) return;
    await supabase.storage.from("resources").remove([r.storage_path]);
    await supabase.from("resources").delete().eq("id", r.id);
    setAllItems((xs) => xs.filter((x) => x.id !== r.id));
  }

  // group rows into exams (sujet + corrigé) for the list
  const exams = useMemo(() => {
    const map = new Map<string, Exam>();
    for (const r of items) {
      if (!r.filiere || r.year == null || !r.session) continue;
      const key = `${r.filiere}|${r.year}|${r.session}`;
      let e = map.get(key);
      if (!e) { e = { key, filiere: r.filiere, year: r.year, session: r.session, sujet: null, corrige: null }; map.set(key, e); }
      if (r.kind === "corrige") e.corrige = r; else e.sujet = r;
    }
    return [...map.values()]
      .filter((e) => filFilter === "all" || e.filiere === filFilter)
      .sort((a, b) => b.year - a.year || a.session.localeCompare(b.session) || a.filiere.localeCompare(b.filiere));
  }, [items, filFilter]);

  const activeFil = filFilter === "all" ? null : filFilter;
  function pickFil(tok: string) {
    setFilFilter(tok);
    if (tok !== "all") setFil(tok); // scope the editor to this filière
  }

  // per-filière coverage: sessions (sujets) + how many have a corrigé
  const filStats = useMemo(() => {
    const g: Record<string, { sessions: Set<string>; corr: number }> = {};
    for (const f of FILIERES) g[f.tok] = { sessions: new Set(), corr: 0 };
    for (const r of items) {
      if (!r.filiere || !g[r.filiere] || r.year == null || !r.session) continue;
      const key = `${r.year}|${r.session}`;
      if (r.kind === "corrige") g[r.filiere].corr++;
      else g[r.filiere].sessions.add(key);
    }
    return g;
  }, [items]);
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const t of Object.keys(filStats)) m[t] = filStats[t].sessions.size;
    return m;
  }, [filStats]);

  // headline numbers for the active scope (a filière, or all)
  const scope = useMemo(() => {
    const toks = activeFil ? [activeFil] : FILIERES.map((f) => f.tok);
    let sessions = 0, corr = 0;
    for (const t of toks) { sessions += filStats[t].sessions.size; corr += Math.min(filStats[t].corr, filStats[t].sessions.size); }
    return { sessions, corr, pct: sessions ? Math.round((corr / sessions) * 100) : 0 };
  }, [activeFil, filStats]);

  const Slot = ({ e, kind }: { e: Exam; kind: "sujet" | "corrige" }) => {
    const r = kind === "corrige" ? e.corrige : e.sujet;
    const isC = kind === "corrige";
    if (r) {
      return (
        <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ${isC ? "bg-emerald-500/10" : "bg-black/[0.03] dark:bg-white/[0.05]"}`}>
          <span className={`w-7 h-7 rounded-lg grid place-items-center shrink-0 ${isC ? "bg-emerald-500/15 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>{isC ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}</span>
          <span className="flex-1 min-w-0 text-xs font-semibold truncate">{isC ? "Corrigé" : "Sujet"}<span className="text-neutral-400 font-normal"> · {fmt(r.size_bytes)}</span></span>
          <a href={openUrl(r.storage_path)} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg text-neutral-400 hover:text-arctic-blue grid place-items-center"><ExternalLink className="w-4 h-4" /></a>
          <button onClick={() => del(r)} className="w-7 h-7 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-500/10 grid place-items-center transition"><Trash2 className="w-4 h-4" /></button>
        </div>
      );
    }
    return (
      <button onClick={() => pickForTarget({ c: code, f: e.filiere, y: e.year, s: e.session, kind })} disabled={busy}
        className={`flex items-center gap-2 rounded-xl px-3 py-2 border border-dashed transition disabled:opacity-60 ${isC ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5" : "border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:bg-black/[0.02] dark:hover:bg-white/[0.04]"}`}>
        <Plus className="w-4 h-4" /> <span className="text-xs font-semibold">Ajouter {isC ? "le corrigé" : "le sujet"}</span>
      </button>
    );
  };

  return (
    <div className="max-w-4xl fade-up">
      <div className="flex items-center gap-3">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center shadow-lg shadow-arctic-blue/30"><ScrollText className="w-6 h-6" /></span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Annales
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-arctic-blue/12 text-arctic-blue dark:text-arctic-cyan">{niveau === "1bac" ? "1 BAC" : "2 BAC"}</span>
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Sujets officiels + corrigés — utilise le sélecteur de niveau en haut à droite.</p>
        </div>
      </div>

      {/* matière hub — every subject, with its session count, all manageable here */}
      <div className="mt-6">
        <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 mb-2">Matière</div>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => {
            const on = s.code === code;
            const n = matiereCounts[s.code] ?? 0;
            return (
              <button key={s.id} onClick={() => { setCode(s.code); setFilFilter("all"); }}
                className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-full transition ${on ? "bg-arctic-blue/15 text-arctic-blue dark:text-arctic-cyan ring-1 ring-arctic-blue/30" : "chip text-neutral-600 dark:text-neutral-300 hover:-translate-y-0.5"}`}>
                {s.name}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${n ? (on ? "bg-arctic-blue/20" : "bg-black/[0.05] dark:bg-white/[0.08]") : "bg-amber-500/20 text-amber-500"}`}>{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* create a new session slot */}
      <div className="mt-5 glass rounded-2xl p-5">
        <div className="text-sm font-bold tracking-tight mb-3 inline-flex items-center gap-2">
          <Plus className="w-4 h-4 text-arctic-blue dark:text-arctic-cyan" /> Nouvelle session
          {activeFil && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan">{FILIERES.find((f) => f.tok === activeFil)?.label ?? activeFil}</span>}
        </div>
        <div className="flex flex-wrap items-end gap-3">
          {!activeFil && (
            <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Filière
              <select className={sel} value={fil} onChange={(e) => setFil(e.target.value)}>
                {FILIERES.map((f) => <option key={f.tok} value={f.tok}>{f.label}</option>)}
              </select>
            </label>
          )}
          <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Année
            <input type="number" min={2000} max={2035} className={sel + " w-28"} value={year} onChange={(e) => setYear(Number(e.target.value))} />
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Session
            <select className={sel} value={session} onChange={(e) => setSession(e.target.value)}>
              {SESSIONS.map((s) => <option key={s.tok} value={s.tok}>{s.label}</option>)}
            </select>
          </label>
          <button onClick={() => pickForTarget({ c: code, f: fil, y: year, s: session, kind: "sujet" })} disabled={busy || !code}
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white hover:brightness-105 transition disabled:opacity-60">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Sujet
          </button>
          <button onClick={() => pickForTarget({ c: code, f: fil, y: year, s: session, kind: "corrige" })} disabled={busy || !code}
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-full bg-emerald-500 text-white hover:brightness-105 transition disabled:opacity-60">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Corrigé
          </button>
        </div>
      </div>

      {/* bulk drop */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.length) addBulk(e.dataTransfer.files); }}
        className={`mt-4 rounded-2xl border-2 border-dashed p-6 text-center transition ${dragOver ? "border-arctic-blue bg-arctic-blue/5" : "border-neutral-300/70 dark:border-neutral-700"}`}>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Glisse plusieurs PDF — <code>Sujet-…</code> et <code>Corrige-matière-filière-année-session.pdf</code> sont classés automatiquement.
        </p>
        <button onClick={() => bulkRef.current?.click()} disabled={busy} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full glass hover:-translate-y-0.5 transition disabled:opacity-60">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Sélectionner plusieurs fichiers
        </button>
        <input ref={bulkRef} type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => e.target.files && addBulk(e.target.files)} />
      </div>

      <input ref={slotRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => onSlotFile(e.target.files?.[0] ?? null)} />

      {toast && (
        <div className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${toast.kind === "ok" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
          {toast.kind === "ok" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span className="flex-1">{toast.msg}</span>
          <button onClick={() => setToast(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* filière tabs — always present so each filière is its own editable space */}
      <div className="mt-7 flex flex-wrap items-center gap-2">
        <button onClick={() => pickFil("all")} className={`text-sm font-semibold px-3.5 py-1.5 rounded-full transition ${filFilter === "all" ? "bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white shadow-lg shadow-arctic-blue/20" : "chip text-neutral-500 hover:-translate-y-0.5"}`}>Toutes</button>
        {FILIERES.map((f) => (
          <button key={f.tok} onClick={() => pickFil(f.tok)} title={f.label} className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-1.5 rounded-full transition ${filFilter === f.tok ? "bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white shadow-lg shadow-arctic-blue/20" : "chip text-neutral-500 hover:-translate-y-0.5"}`}>
            {FIL_SHORT[f.tok]}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filFilter === f.tok ? "bg-white/25" : "bg-black/[0.05] dark:bg-white/[0.08]"}`}>{counts[f.tok] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* coverage stats for the active scope */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="glass rounded-2xl p-4">
          <div className="text-2xl font-extrabold tracking-tight">{scope.sessions}</div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Sessions</div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="text-2xl font-extrabold tracking-tight text-emerald-500">{scope.corr}</div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Corrigés</div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="text-2xl font-extrabold tracking-tight">{scope.pct}%</div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Couverture</div>
          <div className="mt-2 h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${scope.pct}%` }} /></div>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {loading ? (
          <div className="grid place-items-center h-20 text-neutral-400"><Loader2 className="w-5 h-5 animate-spin" /></div>
        ) : exams.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-sm text-neutral-400">Aucune session. Crée la première ci-dessus.</div>
        ) : exams.map((e) => (
          <div key={e.key} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold tracking-tight">{e.year} · {SESS_LABEL[e.session]}</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-arctic-blue/10 text-arctic-blue dark:text-arctic-cyan">{FIL_SHORT[e.filiere] ?? e.filiere}</span>
              {!e.corrige && <span className="text-[11px] text-amber-500">corrigé manquant</span>}
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              <Slot e={e} kind="sujet" />
              <Slot e={e} kind="corrige" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
