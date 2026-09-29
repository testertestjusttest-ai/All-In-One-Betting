import type { MetadataRoute } from "next";
import { supabase } from "../lib/supabase";

const base = "https://betbass.vercel.app";
const categories = ["betting-sites","online-casinos","sportsbooks","casino-bonuses","betting-bonuses","bangladesh-betting-sites"];
const informational = ["about","privacy","terms","responsible-gambling"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabase
    .from("betbass_casinos")
    .select("slug,updated_at,seo_noindex,priority,geo_codes,geo_targeting,affiliate_url,website_url,verified_at,seo_content")
    .eq("active", true);

  const now = new Date();
  const latestPlatformUpdate = (data ?? [])
    .map((item) => item.updated_at ? new Date(item.updated_at).getTime() : 0)
    .reduce((latest, value) => Math.max(latest, value), 0);
  const contentLastModified = latestPlatformUpdate ? new Date(latestPlatformUpdate) : now;

  const countryCodes = [...new Set(
    (data ?? [])
      .flatMap((item) => [...(item.geo_codes ?? []), ...(item.geo_targeting ?? [])])
      .map((code) => String(code).toUpperCase())
      .filter(Boolean)
  )];

  return [
    { url: base, lastModified: contentLastModified, changeFrequency: "daily", priority: 1 },
    { url: `${base}/bn`, lastModified: contentLastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/countries`, lastModified: contentLastModified, changeFrequency: "weekly", priority: 0.8 },
    ...countryCodes.map((code) => ({
      url: `${base}/countries/${code.toLowerCase()}`,
      lastModified: contentLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...informational.map(slug => ({ url: `${base}/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 })),
    ...categories.map(category => ({
      url: `${base}/${category}`,
      lastModified: contentLastModified,
      changeFrequency: "daily" as const,
      priority: 0.9
    })),
    ...(data ?? [])
      .filter(c => !c.seo_noindex)
      .map(c => ({
        url: `${base}/casinos/${c.slug}`,
        lastModified: c.updated_at ? new Date(c.updated_at) : contentLastModified,
        changeFrequency: "weekly" as const,
        priority: Number(c.priority ?? 1000) <= 210 ? 0.9 : 0.8
      }))
  ];
}