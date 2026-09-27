import type { MetadataRoute } from "next";
import { supabase } from "../lib/supabase";

const base = "https://betbass.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabase.from("betbass_casinos").select("slug,updated_at").eq("active", true);
  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...(data ?? []).map(c => ({ url: `${base}/casinos/${c.slug}`, lastModified: c.updated_at ? new Date(c.updated_at) : new Date(), changeFrequency: "weekly" as const, priority: 0.8 }))
  ];
}
