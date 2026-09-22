"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Flame, PlayCircle, Sparkles, Check } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

type Notif = { id: string; icon: "monk" | "resume" | "new"; title: string; desc: string; href: string };

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function NotificationBell() {
  const supabase = createBrowserSupabase();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const out: Notif[] = [];

      // Monk reminder (only if started and not done today)
      const since = new Date(); since.setDate(since.getDate() - 3);
      const [{ data: mh, error: mhe }, { data: mc }] = await Promise.all([
        supabase.from("monk_habits").select("id, is_core").eq("active", true),
        supabase.from("monk_checks").select("habit_id, day").gte("day", ymd(since)),
      ]);
      if (!mhe) {
        const coreIds = (mh ?? []).filter((x) => (x as { is_core: boolean }).is_core).map((x) => (x as { id: string }).id);
        if (coreIds.length >= 4) {
          const today = ymd(new Date());
          const todaySet = new Set((mc ?? []).filter((c) => (c as { day: string }).day === today).map((c) => (c as { habit_id: string }).habit_id));
          const done = coreIds.every((id) => todaySet.has(id));
          if (!done) out.push({ id: "monk", icon: "monk", title: "Monk Mode du jour", desc: "Coche tes non-négociables avant minuit 🔥", href: "/dashboard/monk" });
        }
      }

      // Resume: chapters started but not finished
      const { data: comp } = await supabase.from("lesson_completions").select("lesson_id");
      const doneIds = new Set((comp ?? []).map((r) => r.lesson_id as string));
      if (doneIds.size > 0) {
        const { data: allLes } = await supabase.from("lessons").select("id, chapter_id, chapters(name)").limit(500);
        const byChap = new Map<string, { name: string; total: number; done: number }>();
        for (const l of (allLes ?? []) as unknown as { id: string; chapter_id: string; chapters: { name: string } | null }[]) {
          if (!l.chapter_id) continue;
          const cur = byChap.get(l.chapter_id) ?? { name: l.chapters?.name ?? "Chapitre", total: 0, done: 0 };
          cur.total += 1; if (doneIds.has(l.id)) cur.done += 1;
          byChap.set(l.chapter_id, cur);
        }
        let n = 0;
        for (const [, v] of byChap) {
          if (v.done > 0 && v.done < v.total && n < 3) { out.push({ id: `r${n}`, icon: "resume", title: "Reprends ta leçon", desc: `${v.name} · ${v.done}/${v.total}`, href: "/dashboard/cours" }); n++; }
        }
      }

      setNotifs(out);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const count = notifs.length;
  const Ico = { monk: Flame, resume: PlayCircle, new: Sparkles };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative w-9 h-9 grid place-items-center rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/10 transition"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-arctic-blue text-white text-[10px] font-bold grid place-items-center ring-2 ring-white dark:ring-neutral-900">{count}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[85vw] glass rounded-2xl p-2 shadow-2xl z-50 border border-black/5 dark:border-white/10">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-neutral-400">Notifications</div>
          {count === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-neutral-400 inline-flex flex-col items-center gap-2 w-full">
              <Check className="w-5 h-5 text-emerald-500" /> Tout est à jour ✨
            </div>
          ) : (
            <div className="space-y-1">
              {notifs.map((n) => {
                const I = Ico[n.icon];
                return (
                  <Link key={n.id} href={n.href} onClick={() => setOpen(false)}
                    className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition">
                    <span className="w-8 h-8 rounded-lg bg-arctic-blue/12 text-arctic-blue dark:text-arctic-cyan grid place-items-center shrink-0"><I className="w-4 h-4" /></span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold tracking-tight">{n.title}</span>
                      <span className="block text-xs text-neutral-400 truncate">{n.desc}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
