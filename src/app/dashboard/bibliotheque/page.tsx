"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useAccess } from "@/lib/use-access";
import { UpgradeCard } from "@/components/dashboard/paywall";
import { curriculumFor } from "@/config/curriculum";
import { subjectTheme } from "@/config/subjects";
import {
  Library, Upload, FolderPlus, Folder, FileText, Trash2, Pencil, X, Loader2,
  ChevronLeft, ExternalLink, HardDrive, ChevronRight,
} from "lucide-react";

type Subject = { code: string; name: string };
type CustomFolder = { id: string; name: string };
type LibFile = { id: string; name: string; subject_code: string | null; folder_id: string | null; storage_path: string; size_bytes: number; created_at: string };

const QUOTA = 250 * 1024 * 1024;
const fmtSize = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} Ko` : `${(b / 1024 / 1024).toFixed(1)} Mo`);

export default function BibliothequePage() {
  const supabase = createBrowserSupabase();
  const access = useAccess();
  const [ready, setReady] = useState(false);
  const [uid, setUid] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [folders, setFolders] = useState<CustomFolder[]>([]);
  const [files, setFiles] = useState<LibFile[]>([]);

  const [open, setOpen] = useState<{ kind: "subject" | "folder" | "loose"; key: string; name: string } | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewer, setViewer] = useState<{ blob: Blob; url: string; name: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUid(user.id);
    const { data: sp } = await supabase
      .from("student_profiles")
      .select("level_id, track_id, levels(code), tracks(code)")
      .eq("id", user.id)
      .maybeSingle();
    const lc = (sp?.levels as unknown as { code: string } | null)?.code ?? null;
    const tc = (sp?.tracks as unknown as { code: string } | null)?.code ?? null;
    const { data: subs } = await supabase.from("subjects").select("code, name");
    const byCode = new Map<string, Subject>();
    for (const s of (subs ?? []) as Subject[]) byCode.set(s.code, s);
    const ref = curriculumFor(lc, tc);
    const list = ref
      ? ref.map((r) => byCode.get(r.code)).filter(Boolean) as Subject[]
      : Array.from(byCode.values()).sort((a, b) => a.name.localeCompare(b.name));
    setSubjects(list);

    const [{ data: fl }, { data: fi }] = await Promise.all([
      supabase.from("library_folders").select("id, name").order("created_at"),
      supabase.from("library_files").select("id, name, subject_code, folder_id, storage_path, size_bytes, created_at").order("created_at", { ascending: false }),
    ]);
    setFolders((fl ?? []) as CustomFolder[]);
    setFiles((fi ?? []) as LibFile[]);
    setReady(true);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const used = useMemo(() => files.reduce((s, f) => s + f.size_bytes, 0), [files]);
  const usedPct = Math.min(100, Math.round((used / QUOTA) * 100));
  const countFor = (pred: (f: LibFile) => boolean) => files.filter(pred).length;
  const orphans = useMemo(() => files.filter((f) => !f.folder_id && !f.subject_code), [files]);
  const openFiles = useMemo(() => {
    if (!open) return [];
    if (open.kind === "subject") return files.filter((f) => f.subject_code === open.key);
    if (open.kind === "loose") return orphans;
    return files.filter((f) => f.folder_id === open.key);
  }, [open, files, orphans]);

  async function newFolder() {
    const name = window.prompt("Nom du dossier :");
    if (!name?.trim() || !uid) return;
    await supabase.from("library_folders").insert({ user_id: uid, name: name.trim() });
    load();
  }
  async function delFolder(id: string) {
    const inside = files.filter((f) => f.folder_id === id);
    if (!confirm(`Supprimer ce dossier${inside.length ? ` et ses ${inside.length} fichier(s)` : ""} ? Cette action libère l'espace.`)) return;
    if (inside.length) await supabase.storage.from("library").remove(inside.map((f) => f.storage_path));
    await supabase.from("library_files").delete().eq("folder_id", id);
    await supabase.from("library_folders").delete().eq("id", id);
    load();
  }
  async function openFile(f: LibFile) {
    setBusy(f.id);
    // Download through the authenticated client → render the blob in-app
    // (a blob URL always renders inline, never forces a download).
    const { data, error } = await supabase.storage.from("library").download(f.storage_path);
    setBusy(null);
    if (error || !data) { alert("Impossible d'ouvrir le fichier."); return; }
    setViewer({ blob: data, url: URL.createObjectURL(data), name: f.name });
  }
  function closeViewer() {
    if (viewer) URL.revokeObjectURL(viewer.url);
    setViewer(null);
  }
  async function renameFile(f: LibFile) {
    const name = window.prompt("Renommer :", f.name);
    if (!name?.trim()) return;
    await supabase.from("library_files").update({ name: name.trim() }).eq("id", f.id);
    load();
  }
  async function delFile(f: LibFile) {
    if (!confirm("Supprimer ce PDF ?")) return;
    await supabase.storage.from("library").remove([f.storage_path]);
    await supabase.from("library_files").delete().eq("id", f.id);
    setFiles((xs) => xs.filter((x) => x.id !== f.id));
  }

  if (!ready) return <div className="grid place-items-center h-64 text-neutral-400"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  // Demo: personal library is an accès-complet feature.
  if (access.isDemo) {
    return (
      <div className="max-w-3xl mx-auto py-8 fade-up">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center shadow-lg shadow-arctic-blue/30"><Library className="w-6 h-6" /></span>
          <div><h1 className="text-3xl font-bold tracking-tight">Bibliothèque</h1><p className="text-sm text-neutral-500 dark:text-neutral-400">Tes PDF, rangés par matière.</p></div>
        </div>
        <UpgradeCard title="Ta bibliothèque est réservée à l’accès complet" sub="Téléverse et range tes PDF par matière, retrouve-les partout. 220 DH pour toute l’année." />
      </div>
    );
  }

  // ---- FOLDER / SUBJECT OPEN ----
  if (open) {
    const t = open.kind === "subject" ? subjectTheme(open.key) : null;
    return (
      <div className="max-w-4xl mx-auto py-8 fade-up">
        <button onClick={() => setOpen(null)} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white"><ChevronLeft className="w-4 h-4" /> Bibliothèque</button>
        <div className="mt-3 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${t ? t.bar : "bg-neutral-400"}`} /> {open.name}
            <span className="text-sm font-normal text-neutral-400">· {openFiles.length} fichier{openFiles.length > 1 ? "s" : ""}</span>
          </h1>
          <button onClick={() => setUploadOpen(true)} className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white px-4 py-2 hover:brightness-105 transition"><Upload className="w-4 h-4" /> Téléverser</button>
        </div>

        {openFiles.length === 0 ? (
          <div className="mt-6 glass rounded-3xl p-10 text-center text-sm text-neutral-400">Aucun PDF ici. Téléverse ton premier fichier. 📄</div>
        ) : (
          <div className="mt-5 space-y-2.5">
            {openFiles.map((f) => <FileRow key={f.id} f={f} busy={busy === f.id} onOpen={() => openFile(f)} onRename={() => renameFile(f)} onDelete={() => delFile(f)} />)}
          </div>
        )}
        {uploadOpen && <UploadModal supabase={supabase} uid={uid} used={used} subjects={subjects} folders={folders} preset={open} onClose={() => setUploadOpen(false)} onDone={() => { setUploadOpen(false); load(); }} />}
        {viewer && <Viewer viewer={viewer} onClose={closeViewer} />}
      </div>
    );
  }

  // ---- HOME ----
  return (
    <div className="max-w-4xl mx-auto py-8 fade-up">
      <div className="flex items-center gap-3">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-arctic-cyan to-arctic-blue text-white grid place-items-center shadow-lg shadow-arctic-blue/30"><Library className="w-6 h-6" /></span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bibliothèque</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Tes PDF, rangés par matière et par dossier.</p>
        </div>
      </div>

      {/* usage + actions */}
      <div className="mt-6 glass rounded-2xl p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-2 font-medium"><HardDrive className="w-4 h-4 text-neutral-400" /> {fmtSize(used)} / 250 Mo</span>
          <div className="flex gap-2">
            <button onClick={newFolder} className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-full chip px-4 py-2 hover:-translate-y-0.5 transition"><FolderPlus className="w-4 h-4" /> Dossier</button>
            <button onClick={() => setUploadOpen(true)} className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white px-4 py-2 hover:brightness-105 transition"><Upload className="w-4 h-4" /> Téléverser un PDF</button>
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
          <div className={`h-full rounded-full transition-all ${usedPct > 90 ? "bg-red-500" : "bg-gradient-to-r from-arctic-cyan to-arctic-blue"}`} style={{ width: `${Math.max(2, usedPct)}%` }} />
        </div>
      </div>

      {/* custom folders */}
      {(folders.length > 0 || orphans.length > 0) && (
        <>
          <div className="mt-8 text-xs font-bold uppercase tracking-wide text-neutral-400">Mes dossiers</div>
          <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {orphans.length > 0 && (
              <button onClick={() => setOpen({ kind: "loose", key: "", name: "Sans dossier" })} className="glass rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-0.5 transition text-left">
                <span className="w-10 h-10 rounded-xl bg-amber-500/12 text-amber-500 grid place-items-center"><Folder className="w-5 h-5" /></span>
                <span className="min-w-0"><span className="block font-semibold tracking-tight truncate">Sans dossier</span><span className="block text-xs text-neutral-400">{orphans.length} fichier(s) à ranger</span></span>
              </button>
            )}
            {folders.map((fo) => (
              <div key={fo.id} className="group glass rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-0.5 transition">
                <button onClick={() => setOpen({ kind: "folder", key: fo.id, name: fo.name })} className="flex-1 flex items-center gap-3 text-left">
                  <span className="w-10 h-10 rounded-xl bg-arctic-blue/12 text-arctic-blue dark:text-arctic-cyan grid place-items-center"><Folder className="w-5 h-5" /></span>
                  <span className="min-w-0"><span className="block font-semibold tracking-tight truncate">{fo.name}</span><span className="block text-xs text-neutral-400">{countFor((f) => f.folder_id === fo.id)} fichier(s)</span></span>
                </button>
                <button onClick={() => delFolder(fo.id)} className="w-8 h-8 rounded-lg text-neutral-300 dark:text-neutral-600 hover:text-red-500 hover:bg-red-500/10 grid place-items-center transition opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* subject folders */}
      <div className="mt-8 text-xs font-bold uppercase tracking-wide text-neutral-400">Par matière</div>
      <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {subjects.map((s) => {
          const t = subjectTheme(s.code);
          const n = countFor((f) => f.subject_code === s.code);
          return (
            <button key={s.code} onClick={() => setOpen({ kind: "subject", key: s.code, name: s.name })}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 p-4 text-left hover:-translate-y-0.5 transition">
              <span className={`pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-20 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity ${t.bar}`} />
              <div className="relative flex items-center justify-between">
                <div><div className="font-extrabold tracking-tight text-white">{s.name}</div><div className="text-xs text-white/50 mt-0.5">{n} PDF</div></div>
                <ChevronRight className="w-5 h-5 text-white/40" />
              </div>
            </button>
          );
        })}
      </div>

      {uploadOpen && <UploadModal supabase={supabase} uid={uid} used={used} subjects={subjects} folders={folders} preset={null} onClose={() => setUploadOpen(false)} onDone={() => { setUploadOpen(false); load(); }} />}
      {viewer && <Viewer viewer={viewer} onClose={closeViewer} />}
    </div>
  );
}

function FileRow({ f, busy, onOpen, onRename, onDelete }: { f: LibFile; busy: boolean; onOpen: () => void; onRename: () => void; onDelete: () => void }) {
  return (
    <div className="group glass rounded-2xl p-4 flex items-center gap-3">
      <button onClick={onOpen} className="flex-1 flex items-center gap-3 text-left min-w-0">
        <span className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 grid place-items-center shrink-0">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-5 h-5" />}</span>
        <span className="min-w-0"><span className="block font-semibold tracking-tight truncate">{f.name}</span><span className="block text-xs text-neutral-400">{fmtSize(f.size_bytes)} · {new Date(f.created_at).toLocaleDateString("fr-FR")}</span></span>
      </button>
      <button onClick={onRename} title="Renommer" className="w-8 h-8 rounded-lg text-neutral-400 hover:text-arctic-blue hover:bg-arctic-blue/10 grid place-items-center transition"><Pencil className="w-4 h-4" /></button>
      <button onClick={onDelete} title="Supprimer" className="w-8 h-8 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-500/10 grid place-items-center transition"><Trash2 className="w-4 h-4" /></button>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
let pdfjsPromise: Promise<any> | null = null;
function loadPdfJs(): Promise<any> {
  if (typeof window !== "undefined" && (window as any).pdfjsLib) return Promise.resolve((window as any).pdfjsLib);
  if (pdfjsPromise) return pdfjsPromise;
  pdfjsPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => {
      const lib = (window as any).pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(lib);
    };
    s.onerror = () => reject(new Error("pdfjs load failed"));
    document.head.appendChild(s);
  });
  return pdfjsPromise;
}

function Viewer({ viewer, onClose }: { viewer: { blob: Blob; url: string; name: string }; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdfjsLib = await loadPdfJs();
        const buf = new Uint8Array(await viewer.blob.arrayBuffer());
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        const host = pagesRef.current;
        if (!host || cancelled) return;
        host.innerHTML = "";
        const width = host.clientWidth || 800;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        for (let n = 1; n <= pdf.numPages; n++) {
          if (cancelled) return;
          const page = await pdf.getPage(n);
          const base = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: width / base.width });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width * dpr);
          canvas.height = Math.floor(viewport.height * dpr);
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.className = "rounded-lg shadow-2xl mb-4 bg-white block";
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          ctx.scale(dpr, dpr);
          await page.render({ canvasContext: ctx, viewport }).promise;
          if (cancelled) return;
          host.appendChild(canvas);
        }
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => { cancelled = true; };
  }, [viewer.blob]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-md flex flex-col">
      <div className="h-14 shrink-0 flex items-center justify-between px-4 sm:px-8 text-white">
        <span className="font-semibold truncate">{viewer.name}</span>
        <div className="flex items-center gap-4">
          <a href={viewer.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white"><ExternalLink className="w-4 h-4" /> Onglet</a>
          <button onClick={onClose} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white"><X className="w-4 h-4" /> Fermer</button>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-6 pb-10">
        <div ref={pagesRef} className="mx-auto w-full max-w-5xl fade-up" />
        {status === "loading" && <div className="grid place-items-center py-24 text-white/70"><Loader2 className="w-8 h-8 animate-spin" /></div>}
        {status === "error" && (
          <div className="mx-auto max-w-3xl text-center text-white/70 py-24">
            <p>Impossible d&apos;afficher le PDF ici.</p>
            <a href={viewer.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline"><ExternalLink className="w-4 h-4" /> Ouvrir dans un onglet</a>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

function UploadModal({ supabase, uid, used, subjects, folders, preset, onClose, onDone }: {
  supabase: ReturnType<typeof createBrowserSupabase>; uid: string; used: number; subjects: Subject[]; folders: CustomFolder[];
  preset: { kind: "subject" | "folder" | "loose"; key: string; name: string } | null; onClose: () => void; onDone: () => void;
}) {
  const presetDest = preset && (preset.kind === "subject" || preset.kind === "folder") ? `${preset.kind}:${preset.key}` : "";
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [dest, setDest] = useState<string>(presetDest || (subjects[0] ? `subject:${subjects[0].code}` : ""));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  function pick(f: File | null) {
    setErr("");
    if (f && f.type !== "application/pdf") { setErr("PDF uniquement."); return; }
    setFile(f);
    if (f && !name) setName(f.name.replace(/\.pdf$/i, ""));
  }

  async function submit() {
    if (!file) { setErr("Choisis un PDF."); return; }
    if (file.type !== "application/pdf") { setErr("PDF uniquement."); return; }
    if (file.size > 25 * 1024 * 1024) { setErr("Fichier trop lourd (max 25 Mo)."); return; }
    if (used + file.size > QUOTA) { setErr("Quota dépassé (250 Mo). Supprime des fichiers."); return; }
    if (!dest) { setErr("Choisis une destination."); return; }
    setSaving(true); setErr("");
    // Verify the real file signature (%PDF) — blocks a renamed non-PDF.
    const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
    if (!(head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46)) {
      setErr("Fichier PDF invalide ou corrompu."); setSaving(false); return;
    }
    const path = `${uid}/${crypto.randomUUID()}.pdf`;
    const up = await supabase.storage.from("library").upload(path, file, { contentType: "application/pdf" });
    if (up.error) { setErr("Échec du téléversement : " + up.error.message); setSaving(false); return; }
    const [kind, key] = dest.split(":");
    const row = {
      user_id: uid, name: (name.trim() || file.name), storage_path: path, size_bytes: file.size,
      subject_code: kind === "subject" ? key : null,
      folder_id: kind === "folder" ? key : null,
    };
    const { error } = await supabase.from("library_files").insert(row);
    if (error) {
      await supabase.storage.from("library").remove([path]); // avoid orphan
      setErr(error.message); setSaving(false); return;
    }
    setSaving(false); onDone();
  }

  const inp = "w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-arctic-blue";
  return (
    <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4" onClick={onClose}>
      <div className="w-full max-w-md glass rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold tracking-tight">Téléverser un PDF</h3><button onClick={onClose} className="text-neutral-400 hover:text-neutral-800 dark:hover:text-white"><X className="w-5 h-5" /></button></div>

        <label className="block rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 px-4 py-6 text-center cursor-pointer hover:border-arctic-blue/60 transition">
          <Upload className="w-6 h-6 mx-auto text-neutral-400" />
          <div className="mt-2 text-sm font-medium">{file ? file.name : "Choisir un PDF"}</div>
          <div className="text-xs text-neutral-400">{file ? fmtSize(file.size) : "PDF uniquement"}</div>
          <input type="file" accept="application/pdf" className="hidden" onChange={(e) => pick(e.target.files?.[0] ?? null)} />
        </label>

        <div className="mt-4 space-y-3">
          <div><label className="block text-xs font-semibold text-neutral-500 mb-1">Nom</label><input className={inp} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du fichier" /></div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1">Ranger dans</label>
            <select className={inp} value={dest} onChange={(e) => setDest(e.target.value)}>
              <optgroup label="Matières">
                {subjects.map((s) => <option key={s.code} value={`subject:${s.code}`}>{s.name}</option>)}
              </optgroup>
              {folders.length > 0 && (
                <optgroup label="Mes dossiers">
                  {folders.map((f) => <option key={f.id} value={`folder:${f.id}`}>{f.name}</option>)}
                </optgroup>
              )}
            </select>
          </div>
        </div>

        {err && <p className="mt-3 text-sm text-red-500">{err}</p>}

        <button onClick={submit} disabled={saving} className="mt-5 w-full rounded-full bg-gradient-to-r from-arctic-cyan to-arctic-blue text-white text-sm font-semibold py-3 hover:brightness-105 transition disabled:opacity-50 inline-flex items-center justify-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Téléverser
        </button>
      </div>
    </div>
  );
}
