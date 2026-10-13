"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import {
  consumeKeepScroll, featureFor, loadLocalSpots, mergeRemote, navStore, recordSpot, savedScrollFor,
} from "@/lib/nav-memory";
import { observeUrlChange } from "@/lib/use-query-state";

export const DASH_SCROLLER_ID = "dash-main";

/**
 * Invisible: records the student's spot in each feature (URL + scroll), restores
 * scroll when they come back to a spot, and syncs spots across devices.
 * Mounted once in the dashboard layout.
 */
export function NavMemory() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const url = sp.toString() ? `${pathname}?${sp.toString()}` : pathname;
  const urlRef = useRef(url);
  const uidRef = useRef<string | null>(null);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoring = useRef(false);

  // ---- remote sync (debounced upsert; flushed when the tab is hidden) ----
  const schedulePush = (delay = 2500) => {
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(flush, delay);
  };
  const flush = async () => {
    if (pushTimer.current) { clearTimeout(pushTimer.current); pushTimer.current = null; }
    const uid = uidRef.current;
    if (!uid) return;
    try {
      await createBrowserSupabase().from("nav_state")
        .upsert({ user_id: uid, spots: navStore.get(), updated_at: new Date().toISOString() });
    } catch { /* offline: localStorage still has it */ }
  };

  useEffect(() => {
    loadLocalSpots();
    let alive = true;
    (async () => {
      const supabase = createBrowserSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !alive) return;
      uidRef.current = user.id;
      const { data } = await supabase.from("nav_state").select("spots").eq("user_id", user.id).maybeSingle();
      if (!alive) return;
      if (mergeRemote(data?.spots ?? {})) schedulePush(500);
    })();
    const onHide = () => { if (document.visibilityState === "hidden") void flush(); };
    document.addEventListener("visibilitychange", onHide);
    return () => { alive = false; document.removeEventListener("visibilitychange", onHide); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- track scroll of the dashboard scroller for the current URL ----
  useEffect(() => {
    const el = document.getElementById(DASH_SCROLLER_ID);
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (restoring.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const f = featureFor(window.location.pathname);
        if (!f) return;
        recordSpot(f, urlRef.current, el.scrollTop);
        schedulePush();
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- on every URL change: restore scroll (or go to top), then record the spot ----
  useEffect(() => {
    observeUrlChange();
    urlRef.current = url;
    const el = document.getElementById(DASH_SCROLLER_ID);
    const f = featureFor(pathname);
    const keep = consumeKeepScroll();
    const target = keep ? null : savedScrollFor(url);

    let cancelled = false;
    let cleanupRestore: (() => void) | null = null;
    const stopOnUser = () => { cancelled = true; };
    if (el && !keep) {
      if (target && target > 0) {
        // Content loads async (cold loads fetch data first): wait until the page is
        // tall enough, give up after 20s or as soon as the student scrolls themselves.
        restoring.current = true;
        el.addEventListener("wheel", stopOnUser, { passive: true, once: true });
        el.addEventListener("touchstart", stopOnUser, { passive: true, once: true });
        el.addEventListener("keydown", stopOnUser, { once: true });
        const t0 = performance.now();
        const done = () => { restoring.current = false; clearInterval(iv); };
        const tryRestore = () => {
          if (cancelled || performance.now() - t0 > 20000) { done(); return; }
          if (el.scrollHeight - el.clientHeight >= target - 4) { el.scrollTop = target; done(); }
        };
        const iv = setInterval(tryRestore, 120);
        cleanupRestore = done;
        tryRestore();
      } else {
        el.scrollTop = 0;
      }
    }
    if (f) {
      recordSpot(f, url, keep && el ? el.scrollTop : target ?? 0);
      schedulePush();
    }
    return () => {
      cancelled = true;
      cleanupRestore?.();
      restoring.current = false;
      el?.removeEventListener("wheel", stopOnUser);
      el?.removeEventListener("touchstart", stopOnUser);
      el?.removeEventListener("keydown", stopOnUser);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return null;
}
