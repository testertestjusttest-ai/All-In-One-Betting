import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "../../../lib/supabase";\nimport MonetagAds from "../../components/MonetagAds";

const siteUrl = "https://betbass.vercel.app";

async function getCasino(slug: string) {
  const { data } = await supabase.from("betbass_casinos").select("*").eq("slug", slug).eq("active", true).maybeSingle();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const casino = await getCasino(slug);
  if (!casino) return { title: "Platform not found", robots: { index: false, follow: false } };

  const title = casino.seo_title?.trim() || `${casino.name} — Betting & Casino Platform`;
  const description = casino.seo_description?.trim() || casino.short_description || `${casino.name} betting and casino platform profile, offers, payment methods and availability on BetBass.`;
  const aliases = Array.isArray(casino.seo_aliases) ? casino.seo_aliases.filter(Boolean) : [];
  const noindex = Boolean(casino.seo_noindex);

  return {
    title,
    description,
    keywords: Array.isArray(casino.seo_keywords) && casino.seo_keywords.length ? casino.seo_keywords : aliases,
    robots: { index: !noindex, follow: true },
    alternates: { canonical: `/casinos/${casino.slug}` },
    openGraph: { title, description, url: `${siteUrl}/casinos/${casino.slug}`, type: "website", siteName: "BetBass" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CasinoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const casino = await getCasino(slug);
  if (!casino) notFound();

  const { data: related } = await supabase
    .from("betbass_casinos")
    .select("slug,name,operator_type,bonus_text,bonus_percent,currency")
    .eq("active", true)
    .neq("slug", casino.slug)
    .in("operator_type", casino.operator_type === "both" ? ["both", "casino", "sportsbook"] : [casino.operator_type, "both"])
    .order("priority", { ascending: true })
    .limit(4);

  const hasStructuredOffer = casino.bonus_percent != null || casino.bonus_text || casino.cashback_text;
  const intro = casino.seo_intro?.trim() || `${casino.name} is listed on BetBass with current offer information, payment options, licensing details and country availability. Review the details below and confirm the operator's current terms before using any offer.`;
  const content = casino.seo_content?.trim();
  const countries = Array.isArray(casino.countries) ? casino.countries : [];
  const geoTargeting = Array.isArray(casino.geo_targeting) ? casino.geo_targeting : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: casino.seo_title?.trim() || `${casino.name} — Betting & Casino Platform`,
    description: casino.seo_description?.trim() || casino.short_description || `${casino.name} platform profile on BetBass.`,
    url: `${siteUrl}/casinos/${casino.slug}`,
    breadcrumb: { "@id": `${siteUrl}/casinos/${casino.slug}#breadcrumb` },
    about: { "@type": "Organization", name: casino.name, url: casino.website_url || undefined },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/casinos/${casino.slug}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "BetBass", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Casino & Betting Platforms", item: `${siteUrl}/online-casinos` },
      { "@type": "ListItem", position: 3, name: casino.name, item: `${siteUrl}/casinos/${casino.slug}` },
    ],
  };

  return <main className="min-h-screen px-6 py-10">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    <div className="mx-auto max-w-5xl">
      <nav aria-label="Breadcrumb" className="text-sm text-white/45">
        <a href="/" className="hover:text-white">BetBass</a><span className="mx-2">/</span>
        <a href="/online-casinos" className="hover:text-white">Online Casinos</a><span className="mx-2">/</span>
        <span className="text-white/65">{casino.name}</span>
      </nav>
      <section className="mt-8 glass rounded-[2rem] p-7 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-white text-3xl font-black">
            {casino.logo_url ? <img src={casino.logo_url} alt={`${casino.name} logo`} className="h-full w-full object-contain p-3" /> : casino.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">{casino.tags?.map((tag: string) => <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">{tag}</span>)}</div>
            <h1 className="mt-4 text-4xl font-black md:text-6xl">{casino.name}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-white/55">{casino.short_description}</p>
            {hasStructuredOffer && <div className="mt-6 rounded-2xl border border-violet-400/15 bg-violet-400/8 p-5"><p className="text-xs uppercase tracking-widest text-violet-200">Current offer information</p>{casino.bonus_percent != null && <p className="mt-2 text-2xl font-black">{casino.bonus_percent}% {casino.bonus_type || "welcome"} bonus{casino.currency ? " • " + casino.currency : ""}</p>}{casino.bonus_text && <p className="mt-2 text-base font-semibold">{casino.bonus_text}</p>}{casino.cashback_text && <p className="mt-2 text-sm text-white/55">Cashback: {casino.cashback_text}</p>}</div>}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">{casino.affiliate_url && <a href={casino.affiliate_url} target="_blank" rel="nofollow sponsored noopener noreferrer" className="rounded-2xl bg-white px-6 py-4 text-center font-bold text-black">{casino.claim_label || "Visit offer"}</a>}{casino.website_url && <a href={casino.website_url} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center font-semibold">Official website</a>}</div>
          </div>
        </div>
      </section>

      <MonetagAds placement="inline" />\n      <section className="mt-6 glass rounded-3xl p-7 md:p-9">
        <h2 className="text-2xl font-black">About {casino.name}</h2>
        <p className="mt-4 whitespace-pre-line text-base leading-8 text-white/60">{intro}</p>
        {content && <div className="mt-6 border-t border-white/8 pt-6"><p className="whitespace-pre-line text-sm leading-7 text-white/55">{content}</p></div>}
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="glass rounded-3xl p-6"><h2 className="text-xl font-bold">{casino.name} offer & terms</h2><dl className="mt-5 space-y-4 text-sm"><div><dt className="text-white/35">Offer</dt><dd className="mt-1">{casino.bonus_text || "Not listed yet"}{casino.bonus_percent != null ? " • " + casino.bonus_percent + "% " + (casino.bonus_type || "welcome") + " bonus" : ""}</dd></div><div><dt className="text-white/35">Cashback</dt><dd className="mt-1">{casino.cashback_text || "Not listed yet"}</dd></div><div><dt className="text-white/35">License / regulation</dt><dd className="mt-1">{casino.license_text || "Verify current licensing in your jurisdiction."}</dd></div></dl></div>
        <div className="glass rounded-3xl p-6"><h2 className="text-xl font-bold">{casino.name} availability</h2><p className="mt-3 text-sm text-white/55">Availability and product access can vary by country. Always confirm eligibility, local restrictions and current terms with the operator.</p><div className="mt-5 flex flex-wrap gap-2">{(countries.length ? countries : ["Market-specific"]).map((x: string) => <span key={x} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/55">{x}</span>)}</div>{geoTargeting.length > 0 && <p className="mt-5 text-xs text-white/35">Configured GEO targets: {geoTargeting.join(", ")}</p>}</div>
      </section>

      <MonetagAds placement="bottom" />\n      {related?.length ? <section className="mt-6 glass rounded-3xl p-6"><h2 className="text-xl font-bold">Related platforms</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{related.map((item: any) => <a key={item.slug} href={`/casinos/${item.slug}`} className="rounded-2xl border border-white/8 bg-white/[.03] p-4 transition hover:bg-white/[.06]"><p className="font-bold">{item.name}</p><p className="mt-1 text-xs text-white/40">{item.bonus_text || "View platform details"}</p></a>)}</div></section> : null}

      <p className="mt-8 text-center text-xs leading-6 text-white/30">BetBass is an affiliate/comparison directory. We do not accept bets, hold player funds or process wagers. Offers can change; check the operator's current terms before participating.</p>
    </div>
  </main>;
}
