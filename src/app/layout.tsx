import type { Metadata } from "next";
import { Inter, Afacad_Flux, Yellowtail, Aref_Ruqaa, Amiri_Quran } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const afacad = Afacad_Flux({ subsets: ["latin"], variable: "--font-afacad" });
// Brush script (with natural tail flourishes) for subject-name cards, paired
// with a swash underline for the "Starlight" lettering vibe. Arabic fallback.
const yellowtail = Yellowtail({ subsets: ["latin"], weight: "400", variable: "--font-yellowtail" });
const amiriQuran = Amiri_Quran({ subsets: ["arabic"], weight: "400", variable: "--font-quran" });
const arefRuqaa = Aref_Ruqaa({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-aref" });

export const metadata: Metadata = {
  metadataBase: new URL("https://bacup.ma"),
  title: "Bac Up — Réussis ton BAC. Sans t'ennuyer.",
  description:
    "La boussole pour atteindre tes objectifs au BAC marocain : examens blancs notés /20, corrections détaillées, IA qui t'explique tout et coach IA. 1bac & 2bac.",
  keywords: ["bac maroc", "1bac", "2bac", "examens blancs", "annales bac", "révision bac maroc", "coach ia bac"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Bac Up — Réussis ton BAC. Sans t'ennuyer.",
    description:
      "Examens blancs /20, corrections détaillées, IA + coach. 1bac & 2bac. Essaie la démo, prix fondateur.",
    type: "website",
    locale: "fr_MA",
    siteName: "Bac Up",
  },
  twitter: { card: "summary_large_image", title: "Bac Up — Réussis ton BAC. Sans t'ennuyer." },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Bac Up", statusBarStyle: "black-translucent" },
};

export const viewport = { themeColor: "#0e1a2d" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${afacad.variable} ${yellowtail.variable} ${arefRuqaa.variable} ${amiriQuran.variable}`}>
      <head>
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" />
      </head>
      <body className="font-sans antialiased bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
