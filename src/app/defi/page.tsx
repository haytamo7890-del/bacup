import type { Metadata } from "next";
import { createPublicSupabase } from "@/lib/supabase-public";
import { PublicNav, PublicFooter, Breadcrumbs, JsonLd } from "@/components/public-shell";
import { SITE_URL, url } from "@/config/site";
import DefiClient, { type Challenge, type Row } from "./defi-client";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Défi National — le concours blanc du Bac marocain, en direct | Bac-up",
  description:
    "Chaque semaine, tout le Maroc passe le même examen blanc chronométré et se classe en direct — par filière et par ville. Rejoins le Défi National Bac-up et vise le haut du classement.",
  keywords: ["défi national bac", "concours blanc maroc", "classement bac maroc", "examen blanc national", "bac maroc compétition"],
  alternates: { canonical: url("/defi") },
  openGraph: {
    title: "Défi National — le concours blanc du Bac marocain, en direct",
    description: "Tout le Maroc, même sujet, même semaine. Classement national en direct par filière et par ville.",
    url: url("/defi"),
    type: "website",
    locale: "fr_FR",
  },
  robots: { index: true, follow: true },
};

export default async function DefiPage() {
  const sb = createPublicSupabase();
  const { data: cc } = await sb.rpc("current_challenge");
  const challenge = (cc?.[0] ?? null) as Challenge | null;
  let board: Row[] = [];
  if (challenge) {
    const { data } = await sb.rpc("challenge_leaderboard", { p_challenge: challenge.id, p_limit: 50 });
    board = (data ?? []) as Row[];
  }

  return (
    <div className="c-page min-h-screen">
      <PublicNav />
      <main className="max-w-4xl mx-auto px-5 py-10">
        <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Défi National" }]} />
        <div className="mt-6">
          <DefiClient challenge={challenge} initialBoard={board} />
        </div>
      </main>
      <PublicFooter />

      {challenge && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Event",
            name: challenge.title,
            description: challenge.subtitle ?? "Concours blanc national du Bac marocain.",
            startDate: challenge.opens_at,
            endDate: challenge.closes_at,
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            location: { "@type": "VirtualLocation", url: url("/defi") },
            organizer: { "@type": "Organization", name: "Bac-up", url: SITE_URL },
            isAccessibleForFree: true,
          }}
        />
      )}
    </div>
  );
}
