"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { keepScrollOnNextNav } from "@/lib/nav-memory";

type Patch = Record<string, string | null | undefined>;

// Pushes made by in-page navigation, so an in-page "← Retour" can pop history
// instead of stacking a duplicate entry (Back then behaves as expected).
// `seq` counts every URL change (reported by <NavMemory/>): a pop is only safe when
// the current page is exactly the one our last push produced, with nothing in between.
const pushed: { from: string; to: string; seq: number }[] = [];
let navSeq = 0;
export const observeUrlChange = () => { navSeq++; };
const here = () => `${window.location.pathname}${window.location.search}`;

/**
 * URL-backed page state.
 *  set(patch)                 → new history entry (opening a level: Back returns here)
 *  set(patch, {replace:true}) → edit in place (filters, toggles), scroll kept
 *  up(patch)                  → go to a parent view: pops history when we came from it
 */
export function useQueryState() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const build = useCallback((patch: Patch) => {
    const q = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(patch)) {
      if (v == null || v === "") q.delete(k); else q.set(k, v);
    }
    const s = q.toString();
    return s ? `${pathname}?${s}` : pathname;
  }, [pathname]);

  const set = useCallback((patch: Patch, opts: { replace?: boolean } = {}) => {
    const url = build(patch);
    const cur = here();
    if (url === cur) return;
    if (opts.replace) { keepScrollOnNextNav(); router.replace(url, { scroll: false }); return; }
    pushed.push({ from: cur, to: url, seq: navSeq });
    if (pushed.length > 50) pushed.shift();
    router.push(url, { scroll: false });
  }, [router, build]);

  const up = useCallback((patch: Patch) => {
    const url = build(patch);
    const cur = here();
    const top = pushed[pushed.length - 1];
    if (top && top.to === cur && top.from === url && navSeq === top.seq + 1) { pushed.pop(); router.back(); return; }
    pushed.length = 0;
    router.replace(url, { scroll: false });
  }, [router, build]);

  return { sp, get: (k: string) => sp.get(k), set, up };
}
