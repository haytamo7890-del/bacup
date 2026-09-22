"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ Logo */
/**
 * Bac Up mark — an ORIGINAL star-bolt (4-point star pierced by a lightning
 * bolt). White glyph inside the arctic gradient tile (Postflows format).
 * `simple` drops the bolt cut for tiny sizes (favicon).
 */
export function LogoMark({
  size = 40,
  tile = true,
  simple = false,
  className = "",
}: {
  size?: number;
  tile?: boolean;
  simple?: boolean;
  className?: string;
}) {
  const gid = "bacup-tile";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Bac Up">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#12c7de" />
          <stop offset="1" stopColor="#1b7fdc" />
        </linearGradient>
        <radialGradient id={`${gid}-sheen`} cx="0.3" cy="0.2" r="0.9">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {tile && (
        <>
          <rect x="3" y="3" width="94" height="94" rx="26" fill={`url(#${gid})`} />
          <rect x="3" y="3" width="94" height="94" rx="26" fill={`url(#${gid}-sheen)`} />
        </>
      )}
      {/* star + integrated bolt (evenodd carves the bolt) */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={tile ? "#ffffff" : `url(#${gid})`}
        d={
          simple
            ? "M50 12 L58 42 L88 50 L58 58 L50 88 L42 58 L12 50 L42 42 Z"
            : "M50 10 L58 41 L90 50 L58 59 L50 90 L42 59 L10 50 L42 41 Z " +
              "M55 31 L44 53 L51 53 L46 69 L58 45 L51 45 L57 31 Z"
        }
      />
    </svg>
  );
}

export function Wordmark({ className = "", onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span className={`font-display font-bold tracking-tight ${onDark ? "text-white" : "text-[#0c1622] dark:text-white"} ${className}`}>
      Bac Up
    </span>
  );
}

export function BrandLockup({ size = 34, onDark = false, wm = "text-xl" }: { size?: number; onDark?: boolean; wm?: string }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <Wordmark className={wm} onDark={onDark} />
    </span>
  );
}

/* --------------------------------------------------------------- useInView */
function useInView<T extends HTMLElement>(opts: IntersectionObserverInit = { threshold: 0.25 }) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setInView(true);
          io.unobserve(e.target);
        }
      });
    }, opts);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { ref, inView };
}

/* --------------------------------------------------------------- Reveal */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const Comp = Tag as React.ElementType;
  return (
    <Comp ref={ref} className={`lz ${inView ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Comp>
  );
}

/* --------------------------------------------------------------- Words */
export function Words({
  text,
  className = "",
  stagger = 80,
}: {
  text: string;
  className?: string;
  stagger?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const words = text.split(" ");
  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block">
          <span className={`wz ${inView ? "in" : ""}`} style={{ transitionDelay: `${i * stagger}ms` }}>
            {w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/* --------------------------------------------------------------- CountUp */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  dur = 1500,
  className = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  dur?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.5 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const ease = (p: number) => 1 - Math.pow(1 - p, 3);
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setV(to * ease(p));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setV(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, dur]);
  const shown = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString("fr-FR");
  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}

/* --------------------------------------------------------- MagneticButton */
export function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  strength = 0.35,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  function move(e: React.MouseEvent) {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }
  function reset() {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }
  const inner = (
    <span
      ref={ref}
      className="inline-flex items-center justify-center gap-2 transition-transform duration-300 ease-out will-change-transform"
    >
      {children}
    </span>
  );
  const shared = `inline-flex items-center justify-center ${className}`;
  if (href) {
    return (
      <Link href={href} onMouseMove={move} onMouseLeave={reset} className={shared}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} onMouseMove={move} onMouseLeave={reset} className={shared}>
      {inner}
    </button>
  );
}

/* --------------------------------------------------------- scroll progress */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // 0 when top enters bottom of viewport, 1 when bottom leaves top
        const total = r.height + vh;
        const seen = vh - r.top;
        setP(Math.max(0, Math.min(1, seen / total)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return { ref, p };
}
