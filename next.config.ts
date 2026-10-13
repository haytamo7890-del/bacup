import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bac Up handoff pages (static HTML in public/bacup) served at their routes.
  // beforeFiles: they take over these paths from any older app route.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/bacup/landing.html" },
        { source: "/onboarding", destination: "/bacup/onboarding.html" },
        { source: "/ambassadeurs", destination: "/bacup/ambassadeurs.html" },
        { source: "/ambassadeurs/espace", destination: "/bacup/espace.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
