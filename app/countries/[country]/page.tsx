import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CasinoDirectory from "../../components/CasinoDirectory";
import { supabase } from "../../../lib/supabase";
import { COUNTRY_NAMES, SITE_URL, countryName, countryPath } from "../../../lib/seo";

type Props = { params: Promise<{ country: string }> };

async function getCountryData(code: string) {
  const { data } = await supabase.from("betbass_casinos").select("*").eq("active", true).order("priority", { ascending: true }).order("featured", { ascending: false }).order("name");
  const normalized = code.toUpperCase();
  return (data ?? []).filter((casino) => {
    const codes = [...(casino.geo_codes ?? []), ...(casino.geo_targeting ?? [])].map((value: string) => value.toUpperCase());
    return codes.includes(normalized);
  });
}

export async function generateStaticParams() {
  const { data } = await supabase.from("betbass_casinos").select("geo_codes,geo_targeting").eq("active", true);
  const codes = [...new Set((data ?? []).flatMap((row) => [...(row.geo_codes ?? []), ...(row.geo_targeting ?? [])]).map((code) => String(code).toUpperCase()).filter(Boolean))];
  return codes.map((country) => ({ country: country.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const code = country.toUpperCase();
  const casinos = await getCountryData(code);
  if (!casinos.length) return {};
  const name = countryName(code);
  const path = countryPath(code);
  const title = `Betting Sites & Online Casinos in ${name}`;
  const description = `Compare betting sites, online casinos and sportsbook platforms with ${name} GEO information listed by BetBass.`;
  return {
    title,
    description,
    keywords: [`betting sites ${name}`, `online casinos ${name}`, `sportsbooks ${name}`, "BetBass"],
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: { title: `BetBass — ${title}`, description, url: `${SITE_URL}${path}`, type: "website" },
  };
}

export default async function CountryPage({ params }: Props) {
  const { country } = await params;
  const code = country.toUpperCase();
  if (!COUNTRY_NAMES[code]) notFound();
  const casinos = await getCountryData(code);
  if (!casinos.length) notFound();
  const name = countryName(code);
  const path = countryPath(code);
  const items = casinos.slice(0, 100).map((casino, index) => ({ "@type": "ListItem", position: index + 1, name: casino.name, url: `${SITE_URL}/casinos/${casino.slug}` }));
  const jsonLd = { "@context": "https://schema.org", "@type": "CollectionPage", name: `Betting Sites & Online Casinos in ${name}`, description: `BetBass country directory for ${name}.`, url: `${SITE_URL}${path}`, isPartOf: { "@type": "WebSite", name: "BetBass", url: SITE_URL }, mainEntity: { "@type": "ItemList", numberOfItems: items.length, itemListElement: items } };
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "BetBass", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Countries", item: `${SITE_URL}/countries` }, { "@type": "ListItem", position: 3, name, item: `${SITE_URL}${path}` }] };

  return (
    <main className="min-h-screen px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className="mx-auto max-w-7xl">
        <Link href="/countries" className="text-sm text-white/45 hover:text-white">← All countries</Link>
        <header className="mt-8 max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">BETBASS GEO DIRECTORY · {code}</p>
          <h1 className="mt-2 text-4xl font-black md:text-6xl">Betting Sites & Online Casinos in {name}</h1>
          <p className="mt-5 text-lg leading-8 text-white/55">Browse platforms with {name} GEO information currently published in the BetBass dataset.</p>
          <p className="mt-4 text-sm leading-6 text-white/45">GEO data is informational and can change. Verify current eligibility, licensing, payment availability and local requirements with the operator before using a platform.</p>
        </header>
        <section className="mt-10"><CasinoDirectory casinos={casinos} /></section>
      </div>
    </main>
  );
}
