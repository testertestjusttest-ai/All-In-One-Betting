import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "../../../lib/supabase";
import MonetagAds from "../../components/MonetagAds";
import AffiliateCTA from "../../components/AffiliateCTA";

const siteUrl = "https://betbass.vercel.app";

async function getCasino(slug: string) {
  const { data } = await supabase.from("betbass_casinos").select("*").eq("slug", slug).eq("active", true).maybeSingle();
  return data;
}

async function getRelated(casino: any) {
  const { data } = await supabase
    .from("betbass_casinos")
    .select("id,name,slug,operator_type,short_description,priority,bangladesh_priority")
    .eq("active", true)
    .neq("id", casino.id)
    .order("priority", { ascending: true })
    .order("bangladesh_priority", { ascending: false })
    .order("name", { ascending: true })
    .limit(6);
  return data ?? [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const casino = await getCasino(slug);
  if (!casino) return { title: "Platform not found", robots: { index: false, follow: false } };

  return {
    title: casino.seo_title?.trim() || `${casino.name} — Betting & Casino Platform`,
    description: casino.seo_description?.trim() || casino.short_description || `${casino.name} betting and casino platform profile, offers and payment methods on BetBass.`,
    keywords: casino.seo_keywords?.length ? casino.seo_keywords : undefined,
    alternates: { canonical: `/casinos/${casino.slug}` },
    robots: { index: !casino.seo_noindex, follow: true },
    openGraph: {
      title: casino.seo_title?.trim() || `${casino.name} — BetBass`,
      description: casino.seo_description?.trim() || casino.short_description || "",
      url: `/casinos/${casino.slug}`,
      type: "website"
    }
  };
}

export default async function CasinoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const casino = await getCasino(slug);
  if (!casino) notFound();

  const related = await getRelated(casino);
  const categories = casino.operator_type === "casino"
    ? [["Online Casinos", "/online-casinos"], ["Casino Bonuses", "/casino-bonuses"]]
    : casino.operator_type === "sportsbook"
      ? [["Betting Sites", "/betting-sites"], ["Sportsbooks", "/sportsbooks"], ["Betting Bonuses", "/betting-bonuses"]]
      : [["Betting Sites", "/betting-sites"], ["Online Casinos", "/online-casinos"], ["Sportsbooks", "/sportsbooks"]];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "BetBass", item: siteUrl },
      { "@type": "ListItem", position: 2, name: casino.name, item: `${siteUrl}/casinos/${casino.slug}` }
    ]
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: casino.seo_title || `${casino.name} — Betting & Casino Platform`,
    description: casino.seo_description || casino.short_description || "",
    url: `${siteUrl}/casinos/${casino.slug}`,
    isPartOf: { "@type": "WebSite", name: "BetBass", url: siteUrl },
    mainEntity: { "@type": "Thing", name: casino.name }
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <div className="mx-auto max-w-5xl">
        <a href="/" className="text-sm text-white/45 hover:text-white">← Back to BetBass</a>

        <section className="mt-8 glass rounded-[2rem] p-7 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">{casino.operator_type === "both" ? "Sportsbook + Casino" : casino.operator_type}</p>
              <h1 className="mt-2 text-4xl font-black md:text-6xl">{casino.name}</h1>
              <p className="mt-4 max-w-3xl text-lg text-white/55">{casino.short_description}</p>
            </div>
            {casino.public_rating != null && Number(casino.public_rating) > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-white/35">Public rating</p>
                <p className="mt-1 text-2xl font-black text-yellow-200">★ {Number(casino.public_rating).toFixed(1)}<span className="text-sm text-white/35">/5</span></p>
              </div>
            )}
          </div>
        </section>

        <MonetagAds placement="inline" />

        <nav aria-label="Platform categories" className="mt-5 flex flex-wrap gap-2">
          {categories.map(([label, href]) => <a key={href} href={href} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/60 hover:text-white">{label}</a>)}
        </nav>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="glass rounded-3xl p-7">
            <h2 className="text-2xl font-black">Offer & payments</h2>
            {casino.bonus_text && <div className="mt-4"><p className="text-xs uppercase tracking-wider text-white/35">Offer</p><p className="mt-1 text-white/70">{casino.bonus_text}</p></div>}
            {casino.bonus_percent != null && <div className="mt-4"><p className="text-xs uppercase tracking-wider text-white/35">Bonus</p><p className="mt-1 text-white/70">{Number(casino.bonus_percent)}% {casino.bonus_type || "welcome"} bonus{casino.currency ? ` · ${casino.currency}` : ""}</p></div>}
            {casino.payment_methods?.length > 0 && <div className="mt-4"><p className="text-xs uppercase tracking-wider text-white/35">Payment methods</p><div className="mt-2 flex flex-wrap gap-2">{casino.payment_methods.map((x:string)=><span key={x} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60">{x}</span>)}</div></div>}
            {casino.deposit_methods?.length > 0 && <div className="mt-4"><p className="text-xs uppercase tracking-wider text-white/35">Deposit methods</p><p className="mt-1 text-sm text-white/60">{casino.deposit_methods.join(", ")}</p></div>}
            {casino.withdrawal_methods?.length > 0 && <div className="mt-4"><p className="text-xs uppercase tracking-wider text-white/35">Withdrawal methods</p><p className="mt-1 text-sm text-white/60">{casino.withdrawal_methods.join(", ")}</p></div>}
          </section>

          <section className="glass rounded-3xl p-7">
            <h2 className="text-2xl font-black">Availability & licensing</h2>
            {casino.license_text && <div className="mt-4"><p className="text-xs uppercase tracking-wider text-white/35">License / regulation</p><p className="mt-1 text-white/60">{casino.license_text}</p></div>}
            {casino.countries?.length > 0 && <div className="mt-4"><p className="text-xs uppercase tracking-wider text-white/35">Listed countries</p><p className="mt-1 text-sm text-white/60">{casino.countries.join(", ")}</p></div>}
            {casino.geo_codes?.length > 0 && <div className="mt-4"><p className="text-xs uppercase tracking-wider text-white/35">GEO coverage</p><p className="mt-1 text-sm text-white/60">{casino.geo_codes.join(", ")}</p></div>}
            {casino.tags?.length > 0 && <div className="mt-4"><p className="text-xs uppercase tracking-wider text-white/35">Tags</p><div className="mt-2 flex flex-wrap gap-2">{casino.tags.map((x:string)=><span key={x} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60">{x}</span>)}</div></div>}
          </section>
          <AffiliateCTA casinoId={casino.id} affiliateUrl={casino.affiliate_url} label={casino.claim_label || "Claim offer"} />
        </div>

        <section className="mt-6 glass rounded-3xl p-7 md:p-9">
          <h2 className="text-2xl font-black">About {casino.name}</h2>
          <p className="mt-4 leading-7 text-white/60">{casino.seo_intro || casino.short_description}</p>
          {casino.seo_content && <div className="mt-5 whitespace-pre-line leading-7 text-white/55">{casino.seo_content}</div>}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-bold">How to research {casino.name} on BetBass</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">Use the information on this profile to review the operator category, listed payment information, GEO notes and any publisher-provided offer details. Availability and terms can vary by country and can change over time, so verify current conditions before using an operator.</p>
          </div>
          <p className="mt-6 text-xs leading-5 text-white/35">Offers, licensing, eligibility, payment methods and country availability can change. Verify the current terms with the operator before using any service.</p>
        </section>

        {related.length > 0 && (
          <section className="mt-6 glass rounded-3xl p-7">
            <h2 className="text-2xl font-black">Related platforms</h2>
            <p className="mt-2 text-sm text-white/45">Explore more platforms in the BetBass directory.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item:any) => <a key={item.id} href={`/casinos/${item.slug}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"><div className="font-bold">{item.name}</div><div className="mt-1 text-xs uppercase text-white/35">{item.operator_type === "both" ? "Sportsbook + Casino" : item.operator_type}</div><p className="mt-2 line-clamp-2 text-xs leading-5 text-white/45">{item.short_description}</p></a>)}
            </div>
          </section>
        )}

        <MonetagAds placement="bottom" />
      </div>
    </main>
  );
}
