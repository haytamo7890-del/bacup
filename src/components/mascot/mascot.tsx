"use client";

/**
 * Le Lauréat — the Bac Up mark as a living mascot, seated in a glass médaillon.
 *
 *  · The mark (src/components/brand.tsx) is split into its 3 shapes: body (graduate + star),
 *    cap, tassel. Idle: tassel sways, body breathes. Speaking: cap tip + ice-light glint.
 *  · Lines are rule-based (no AI, no emoji): callers pass an ordered list of candidate lines,
 *    the first one not muted today is shown.
 *  · Calm by design: a line opens by itself once a day, never twice within 10 min (the dot waits); « Plus tard » mutes that
 *    line for the day; a second « Plus tard » the same day = quiet until tomorrow.
 *  · The student can rename it (default « Ton Lauréat »), stored on this device.
 * Motion: transform / opacity, plus one grid-row unfold for the words slot. Reduced motion: no idle loop, no cap tip.
 */
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { MARK_PATH } from "@/components/brand";

export type MascotLine = { key: string; text: string; cta?: { label: string; href: string } };

const PARTS = (() => {
  const subs = MARK_PATH.split(/(?=M)/).map((s) => s.trim()).filter(Boolean);
  return { body: subs[0] ?? MARK_PATH, cap: subs[1] ?? "", tassel: subs[2] ?? "" };
})();

const NAME_KEY = "bacup.mascot.name";
const LAST_KEY = "bacup.mascot.last";       // { key, t } last line shown
const SEEN_KEY = "bacup.mascot.seen";       // { [lineKey]: day } auto-opened today
const MUTE_KEY = "bacup.mascot.mute";       // { day, keys: string[], all: boolean }
const DEFAULT_NAME = "Ton Lauréat";
const today = () => new Date().toISOString().slice(0, 10);

function read<T>(k: string, fallback: T): T {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
function write(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } }
type Mute = { day: string; keys: string[]; all: boolean };
const todayMute = (): Mute => { const m = read<Mute>(MUTE_KEY, { day: "", keys: [], all: false }); return m.day === today() ? m : { day: today(), keys: [], all: false }; };
const NAME_EVT = "bacup:mascot-name";
const readName = () => read<string>(NAME_KEY, DEFAULT_NAME);
const subscribeName = (cb: () => void) => {
  window.addEventListener("storage", cb); window.addEventListener(NAME_EVT, cb);
  return () => { window.removeEventListener("storage", cb); window.removeEventListener(NAME_EVT, cb); };
};

/** The rigged mark. Use inside any sized box; colour = currentColor. */
export function Laureat({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={`lau ${className}`} viewBox="0 0 613 533" aria-hidden>
      <defs>
        <linearGradient id={`g${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#0DB8D3" stopOpacity="0" />
          <stop offset=".44" stopColor="#0DB8D3" stopOpacity="0" />
          <stop offset=".5" stopColor="#0DB8D3" stopOpacity=".95" />
          <stop offset=".56" stopColor="#1B7FDC" stopOpacity=".85" />
          <stop offset=".62" stopColor="#1B7FDC" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`c${id}`}><path d={PARTS.body} /><path d={PARTS.cap} /><path d={PARTS.tassel} /></clipPath>
      </defs>
      <g className="lau-body"><path fill="currentColor" fillRule="evenodd" d={PARTS.body} /></g>
      <g className="lau-tassel"><path fill="currentColor" d={PARTS.tassel} /></g>
      <g className="lau-cap"><path fill="currentColor" d={PARTS.cap} /></g>
      <g clipPath={`url(#c${id})`}><rect className="lau-glint" x="0" y="0" width="613" height="533" fill={`url(#g${id})`} /></g>
    </svg>
  );
}

/**
 * Wraps a card. The médaillon pins to the card's top-right edge; the words open in their own
 * slot ABOVE the card (never over its content): a slim glass strip whose tail points down to the
 * médaillon. The slot unfolds smoothly, so the card just glides down a few pixels.
 * `lines` = candidates in priority order.
 */
export function Mascot({ lines, size = "md", variant = "card", style, children }: {
  lines: MascotLine[]; size?: "sm" | "md"; style?: CSSProperties; children: ReactNode;
  /** card: médaillon on the card's top-right edge, words above · inline: médaillon ends a header row, words below */
  variant?: "card" | "inline";
}) {
  const name = useSyncExternalStore(subscribeName, readName, () => DEFAULT_NAME);
  const [muteRev, setMuteRev] = useState(0);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [talking, setTalking] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState("");
  const talkT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const linesKey = lines.map((l) => l.key).join("|");

  // the first line that isn't muted today (lines are [] on the server: data loads client-side)
  const { line, quiet } = useMemo(() => {
    if (typeof window === "undefined" || !lines.length) return { line: null, quiet: false };
    const m = todayMute();
    return { line: lines.find((l) => !m.keys.includes(l.key)) ?? null, quiet: m.all };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linesKey, muteRev]);
  const open = !!line && openKey === line.key;

  const speak = () => {
    setTalking(false);
    requestAnimationFrame(() => setTalking(true));
    if (talkT.current) clearTimeout(talkT.current);
    talkT.current = setTimeout(() => setTalking(false), 1300);
  };

  // calm: a given line opens by itself once a day, and nothing opens twice within 10 min
  useEffect(() => {
    if (!line || quiet) return;
    const last = read<{ key: string; t: number }>(LAST_KEY, { key: "", t: 0 });
    const seen = read<Record<string, string>>(SEEN_KEY, {});
    if (seen[line.key] === today() || Date.now() - last.t <= 10 * 60_000) return;
    const t = setTimeout(() => {
      setOpenKey(line.key); speak(); write(LAST_KEY, { key: line.key, t: Date.now() });
      const d = today(); const kept = Object.fromEntries(Object.entries(seen).filter(([, v]) => v === d));
      write(SEEN_KEY, { ...kept, [line.key]: d });
    }, 650);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line?.key, quiet]);

  useEffect(() => () => { if (talkT.current) clearTimeout(talkT.current); }, []);

  const mute = (all: boolean) => {
    const m = todayMute();
    // « Plus tard » mutes this line today; a second « Plus tard » the same day = quiet until tomorrow
    if (all || m.keys.length > 0) m.all = true;
    if (line) m.keys = [...new Set([...m.keys, line.key])];
    write(MUTE_KEY, m);
    setOpenKey(null); setMuteRev((r) => r + 1);
  };
  const saveName = () => {
    const n = draft.trim().slice(0, 24) || DEFAULT_NAME;
    write(NAME_KEY, n); window.dispatchEvent(new Event(NAME_EVT)); setRenaming(false);
  };

  const shown = open;

  const medal = (
    <button type="button" aria-label={`${name} : ${line ? (shown ? "masquer le message" : "afficher le message") : "mascotte"}`} aria-expanded={shown}
      onClick={() => { if (line) setOpenKey((k) => (k === line.key ? null : line.key)); speak(); }}
      className={`mm-medal ${talking ? "mm-talking" : ""}`}>
      <Laureat />
      {line && !shown && <span className="mm-dot" aria-hidden />}
    </button>
  );
  const slot = (
    <div className={`mm-slot ${shown ? "mm-on" : ""}`} aria-hidden={!shown}>
      <div className="mm-slot-in">
        <div role="status" aria-live="polite" className="mm-say">
          {line && (
            <>
              {renaming ? (
                <form onSubmit={(e) => { e.preventDefault(); saveName(); }} className="mm-who">
                  <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={saveName} maxLength={24} aria-label="Nom de ta mascotte" className="mm-input" />
                </form>
              ) : (
                <button type="button" tabIndex={shown ? 0 : -1} className="mm-who mm-name" onClick={() => { setDraft(name === DEFAULT_NAME ? "" : name); setRenaming(true); }} title="Renommer">{name}</button>
              )}
              <p className="mm-text">{line.text}</p>
              <div className="mm-actions">
                {line.cta && <Link href={line.cta.href} tabIndex={shown ? 0 : -1} className="mm-cta" onClick={() => setOpenKey(null)}>{line.cta.label}</Link>}
                <button type="button" tabIndex={shown ? 0 : -1} className="mm-link" onClick={() => mute(false)}>Plus tard</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
  const cls = `mm-wrap ${size === "sm" ? "mm-wrap-sm" : ""}`;

  if (variant === "inline") return (
    <div className={`${cls} mm-inline`} style={style}>
      <div className="mm-row"><div className="min-w-0">{children}</div>{medal}</div>
      {slot}
    </div>
  );
  return (
    <div className={cls} style={style}>
      {slot}
      <div className="mm-host">{children}{medal}</div>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------
   Rule tables. Pure functions: callers pass what they already know, get ordered candidates.
--------------------------------------------------------------------------------------------- */

const plural = (n: number, w: string) => `${n} ${w}${n > 1 ? "s" : ""}`;

export function subjectLines(o: {
  subjectName: string; coeff: number | null;
  last?: { title: string; href: string } | null;
  errors: number; due: number; errorsHref: string; reviewHref: string;
  pct: number;
}): MascotLine[] {
  const out: MascotLine[] = [];
  if (o.last) out.push({ key: `resume:${o.last.href}`, text: `Tu t'es arrêté à « ${o.last.title} ». On reprend là ?`, cta: { label: "Reprendre", href: o.last.href } });
  if (o.errors > 0) out.push({ key: `errors:${o.subjectName}:${o.errors}`, text: `${plural(o.errors, "erreur")} en ${o.subjectName}. Les rejouer, c'est le meilleur rapport temps / points.`, cta: { label: "Rejouer", href: o.errorsHref } });
  if (o.due > 0) out.push({ key: `due:${o.subjectName}:${o.due}`, text: `${plural(o.due, "révision")} prête${o.due > 1 ? "s" : ""} aujourd'hui en ${o.subjectName}. Cinq minutes suffisent.`, cta: { label: "Réviser", href: o.reviewHref } });
  if (o.pct === 0) out.push({ key: `start:${o.subjectName}`, text: `Premier chapitre, premier cours : on commence petit, 15 minutes.` });
  if (o.coeff != null && o.coeff >= 5) out.push({ key: `coeff:${o.subjectName}`, text: `Coeff. ${o.coeff} : chaque notion de ${o.subjectName} pèse lourd au national.` });
  return out;
}

export function chapterLines(o: {
  chapterName: string; total: number; done: number;
  next?: { title: string; href: string } | null; hasResume: boolean; resumeHref: string;
}): MascotLine[] {
  const out: MascotLine[] = [];
  if (o.total > 0 && o.done === o.total) out.push({ key: `chapdone:${o.chapterName}`, text: `Tout le chapitre est lu. Passe au résumé pour fixer l'essentiel.`, cta: o.hasResume ? { label: "Résumé", href: o.resumeHref } : undefined });
  if (o.next) out.push({ key: `next:${o.next.href}`, text: o.done === 0 ? `${plural(o.total, "cours")} dans ce chapitre. On commence par « ${o.next.title} ».` : `${o.done} sur ${o.total} lus. Le suivant : « ${o.next.title} ».`, cta: { label: "Lire", href: o.next.href } });
  return out;
}

export type PlanTalk = { rest: boolean; subject: string; minutes: number; href: string | null; started: boolean; allDone: boolean; slot: "matin" | "apres" | "soir" };
const SLOT_START: Record<PlanTalk["slot"], number> = { matin: 7, apres: 17, soir: 20 };
const SLOT_WORD: Record<PlanTalk["slot"], string> = { matin: "ce matin", apres: "après l'école", soir: "ce soir" };

export function dashboardLines(o: { daysAway: number; due: number; errors: number; monkLeft: number | null; hour: number; noPlan?: boolean; plan?: PlanTalk | null }): MascotLine[] {
  const out: MascotLine[] = [];
  const d = today();
  const p = o.plan && !o.plan.rest ? o.plan : null;
  if (o.noPlan) out.push({ key: "plan:create", text: "Tu n'as pas encore de plan BAC. 5 questions, 2 minutes, et je te montre quoi faire chaque jour.", cta: { label: "Créer mon plan", href: "/dashboard/plan" } });
  if (o.daysAway >= 3) out.push({ key: `back:${today()}`, text: `Content de te revoir. On reprend doucement : 10 minutes aujourd'hui, c'est déjà gagné.` });
  if (p) {
    if (p.allDone) out.push({ key: `plan:done:${d}`, text: "Séance du jour terminée. Un jour de plus de gagné sur le BAC." });
    else if (o.hour >= SLOT_START[p.slot] - 1) out.push({ key: `plan:go:${d}:${p.started ? 1 : 0}`, text: p.started ? `Ta séance de ${p.subject} est commencée. On la finit ?` : `C'est l'heure de ta séance : ${p.subject}, ${p.minutes} min. On s'y met ?`, cta: p.href ? { label: p.started ? "Continuer" : "Commencer", href: p.href } : undefined });
    else out.push({ key: `plan:today:${d}`, text: `Au programme ${SLOT_WORD[p.slot]} : ${p.subject}, ${p.minutes} min. Trois blocs, et c'est fait.` });
  }
  if (o.due > 0 && !p) out.push({ key: `due:${o.due}`, text: `${plural(o.due, "révision")} prête${o.due > 1 ? "s" : ""}. C'est le moment idéal : juste avant d'oublier.`, cta: { label: "Réviser", href: "/dashboard/examens/pratique?review=all" } });
  if (o.errors > 0) out.push({ key: `err:${o.errors}`, text: `${plural(o.errors, "erreur")} dans ton journal. Une erreur rejouée, c'est un point de gagné au BAC.`, cta: { label: "Rejouer", href: "/dashboard/examens/erreurs" } });
  if (o.monkLeft && o.hour >= 18) out.push({ key: `monk:${o.monkLeft}`, text: `Il te reste ${plural(o.monkLeft, "non-négociable")} aujourd'hui. Tu tiens ta série ?`, cta: { label: "Monk Mode", href: "/dashboard/monk" } });
  return out;
}
