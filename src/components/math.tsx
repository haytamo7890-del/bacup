"use client";

import katex from "katex";

/**
 * Renders a string that mixes plain text and inline LaTeX delimited by $...$.
 * Example: "Écrire $a = \\cos\\frac{\\pi}{6} + i\\sin\\frac{\\pi}{6}$ sous forme."
 */
export function Tex({ children }: { children: string }) {
  const parts = (children ?? "").split(/(\$[^$]+\$)/g);
  return (
    <span>
      {parts.map((p, i) => {
        if (p.length > 1 && p.startsWith("$") && p.endsWith("$")) {
          const html = katex.renderToString(p.slice(1, -1), {
            throwOnError: false,
            displayMode: false,
          });
          return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
        }
        return <span key={i}>{p}</span>;
      })}
    </span>
  );
}
