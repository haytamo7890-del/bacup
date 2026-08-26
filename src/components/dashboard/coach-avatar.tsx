export function CoachAvatar({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bacSpark" x1="8" y1="10" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0db8d3" />
          <stop offset="1" stopColor="#1b7fdc" />
        </linearGradient>
        <radialGradient id="bacSparkSheen" cx="0.36" cy="0.3" r="0.65">
          <stop stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* main glassy spark (original AI mark) */}
      <path
        d="M32 5 C34 22 42 30 59 32 C42 34 34 42 32 59 C30 42 22 34 5 32 C22 30 30 22 32 5 Z"
        fill="url(#bacSpark)"
      />
      <path
        d="M32 5 C34 22 42 30 59 32 C42 34 34 42 32 59 C30 42 22 34 5 32 C22 30 30 22 32 5 Z"
        fill="url(#bacSparkSheen)"
      />

      {/* small accent spark */}
      <path
        d="M51 9 C51.6 13 53 14.4 57 15 C53 15.6 51.6 17 51 21 C50.4 17 49 15.6 45 15 C49 14.4 50.4 13 51 9 Z"
        fill="#8fe3f2"
      />
    </svg>
  );
}
