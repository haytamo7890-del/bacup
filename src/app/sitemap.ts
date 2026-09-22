import type { MetadataRoute } from "next";
import { createPublicSupabase } from "@/lib/supabase-public";
import { SITE_URL, subjectSlug, examSlug } from "@/config/site";

export const revalidate = 3600;

type Row = {
  year: number;
  session: string;
  levels: { code: string } | null;
  subjects: { code: string } | null;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/examens`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/defi`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/signup`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const sb = createPublicSupabase();
  const { data } = await sb.from("exams").select("year, session, levels(code), subjects(code)");
  const rows = (data ?? []) as unknown as Row[];

  const subjectHubs = new Set<string>();
  for (const r of rows) {
    const lc = r.levels?.code, sc = r.subjects?.code;
    if (!lc || !sc) continue;
    const sSlug = subjectSlug(sc);
    const hub = `/examens/${lc}/${sSlug}`;
    if (!subjectHubs.has(hub)) {
      subjectHubs.add(hub);
      entries.push({ url: `${SITE_URL}${hub}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 });
    }
    const exam = `${hub}/${examSlug(r.year, r.session)}`;
    entries.push({ url: `${SITE_URL}${exam}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
    entries.push({ url: `${SITE_URL}${exam}/corrige`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
  }

  return entries;
}
