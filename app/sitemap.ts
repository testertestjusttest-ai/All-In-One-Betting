import type { MetadataRoute } from "next";
import { supabase } from "../lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabase.from("betbass_casinos").select("slug,updated_at").eq("active", true);
  const base = "https://betbass.vercel.app";
  return [
    { url: base, lastModified: new Date() },
    ...(data ?? []).map(c => ({ url: `${base}/casinos/${c.slug}`, lastModified: c.updated_at ? new Date(c.updated_at) : new Date() }))
  ];
}
