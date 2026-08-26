import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HSGenius — La préparation IA du BAC marocain",
  description:
    "Comprendre, s'entraîner, progresser. Le coach IA pour le BAC marocain.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
