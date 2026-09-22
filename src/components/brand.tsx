/**
 * Shared Bac Up brand mark — the star-bolt in the arctic tile.
 * Used across auth pages, sidebar, etc. so the whole app matches the landing.
 */
export function BrandLogo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Bac Up">
      <defs>
        <linearGradient id="brandtile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#12c7de" />
          <stop offset="1" stopColor="#1b7fdc" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="94" height="94" rx="26" fill="url(#brandtile)" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#fff"
        d="M50 10 L58 41 L90 50 L58 59 L50 90 L42 59 L10 50 L42 41 Z M55 31 L44 53 L51 53 L46 69 L58 45 L51 45 L57 31 Z"
      />
    </svg>
  );
}

export function BrandLockup({ size = 34, textClass = "text-lg", className = "" }: { size?: number; textClass?: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <BrandLogo size={size} />
      <span className={`font-display font-bold tracking-tight ${textClass}`}>Bac Up</span>
    </span>
  );
}
