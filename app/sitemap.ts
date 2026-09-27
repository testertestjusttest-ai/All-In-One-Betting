import type { MetadataRoute } from "next";
import { supabase } from "../lib/supabase";

const base = "https://betbass.vercel.app";
const categories = ["betting-sites","online-casinos","sportsbooks","casino-bonuses","betting-bonuses","bangladesh-betting-sites"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabase.from("betbass_casinos").select("slug,updated_at,seo_noindex").eq("active", true);
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...categories.map(category => ({ url: `${base}/${category}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 })),
    ...(data ?? []).filter(c => !c.seo_noindex).map(c => ({ url: `${base}/casinos/${c.slug}`, lastModified: c.updated_at ? new Date(c.updated_at) : now, changeFrequency: "weekly" as const, priority: 0.8 }))
  ];
}
