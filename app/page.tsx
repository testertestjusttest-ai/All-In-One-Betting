import type { Metadata } from "next";
import { supabase } from "../lib/supabase";
import { countryName, SITE_URL } from "../lib/seo";
import CasinoDirectory from "./components/CasinoDirectory";
import MonetagAds from "./components/MonetagAds";
import PWAInstall from "./components/PWAInstall";
import TrustDisclosure from "./components/TrustDisclosure";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "BetBass — Betting Sites & Online Casino Comparison",
  description:
    "Compare betting sites, online casinos and sportsbooks by offers, payment methods, licensing and country availability. BetBass provides structured platform profiles and transparent affiliate disclosures.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "BetBass — Betting & Casino Comparison",
    description:
      "Compare betting sites, online casinos, sportsbooks, offers, payments and GEO availability.",
    url: SITE_URL,
    type: "website",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is BetBass?", acceptedAnswer: { "@type": "Answer", text: "BetBass is a comparison and affiliate directory that organizes published information about betting sites, online casinos and sportsbook platforms." } },
    { "@type": "Question", name: "How does BetBass handle offers?", acceptedAnswer: { "@type": "Answer", text: "Offer details are displayed from the BetBass dataset and should be checked against the operator's current terms because promotions, eligibility and availability can change." } },
    { "@type": "Question", name: "Does BetBass accept bets or deposits?", acceptedAnswer: { "@type": "Answer", text: "No. BetBass is a comparison and affiliate directory. It does not accept wagers, hold player funds or process gambling transactions." } },
    { "@type": "Question", name: "Why are some outbound links affiliate links?", acceptedAnswer: { "@type": "Answer", text: "Some outbound links may use publisher-configured affiliate tracking. This can support BetBass and does not guarantee an offer, outcome or eligibility." } },
  ],
};

async function getCasinos() {
  const { data } = await supabase
    .from("betbass_casinos")
    .select("*")
    .eq("active", true)
    .order("priority", { ascending: true })
    .order("bangladesh_priority", { ascending: false })
    .order("featured", { ascending: false })
    .order("name");
  return data ?? [];
}

function getCountryStats(casinos: any[]) {
  const counts = new Map<string, number>();
  for (const casino of casinos) {
    for (const raw of [...(casino.geo_codes ?? []), ...(casino.geo_targeting ?? [])]) {
      const code = String(raw).toUpperCase();
      if (code) counts.set(code, (counts.get(code) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8);
}

export default async function Home() {
  const casinos = await getCasinos();
  const countryStats = getCountryStats(casinos);
  const indexableCasinos = casinos.filter((casino:any) => Boolean(casino.affiliate_url && casino.website_url && casino.verified_at && casino.seo_content && String(casino.seo_content).trim().length >= 120 && !casino.seo_noindex));
  const itemList = indexableCasinos.slice(0, 100).map((casino, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: casino.name,
    url: SITE_URL + "/casinos/" + casino.slug,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "BetBass Betting & Casino Comparison Directory",
    description: "Compare betting sites, online casinos and sportsbook platforms.",
    url: SITE_URL,
    mainEntity: { "@type": "ItemList", name: "BetBass platform directory", numberOfItems: itemList.length, itemList },
  };

  return (
    <main className="min-h-screen overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <nav className="site-nav mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">
        <a href="/" className="brand-mark" aria-label="BetBass home">
          <span className="brand-orb">B</span>
          <span>Bet<span className="gradient-text">Bass</span></span>
        </a>
        <div className="hidden items-center gap-7 text-sm text-white/60 md:flex">
          <a href="#directory" className="nav-link">Directory</a>
          <a href="/countries" className="nav-link">Countries</a>
          <a href="/methodology" className="nav-link">Methodology</a>
          <a href="#faq" className="nav-link">FAQ</a>
        </div>
        <a href="#directory" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white transition hover:border-violet-300/40 hover:bg-white/10">Explore</a>
      </nav>

      <section className="hero-shell mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-16">
        <div className="hero-grid">
          <div className="relative z-10">
            <div className="eyebrow"><span className="eyebrow-dot" />GLOBAL BETTING & CASINO DIRECTORY</div>
            <h1 className="hero-title">Compare platforms with <span className="hero-title-accent">clarity, context & confidence.</span></h1>
            <p className="hero-copy">Explore structured profiles for betting sites, online casinos and sportsbooks. Compare published offers, payment information, licensing notes and GEO availability before leaving BetBass.</p>
            <div className="hero-actions">
              <a href="#directory" className="primary-cta">Browse platforms <span>↗</span></a>
              <a href="/countries" className="secondary-cta">Explore countries</a>
            </div>
            <div className="hero-trust"><span>18+ where applicable</span><span>•</span><span>Affiliate disclosure</span><span>•</span><span>Offers can change</span></div>
          </div>

          <div className="hero-visual" aria-label="BetBass comparison overview">
            <div className="hero-halo hero-halo-one" />
            <div className="hero-halo hero-halo-two" />
            <div className="hero-core">
              <div className="core-ring ring-one" /><div className="core-ring ring-two" />
              <div className="core-logo">BB</div><span className="core-caption">COMPARE</span>
            </div>
            <div className="float-card float-card-one"><span className="float-label">Platforms</span><strong>{casinos.length}</strong><small>active profiles</small></div>
            <div className="float-card float-card-two"><span className="float-label">GEO coverage</span><strong>{countryStats.length || 0}+</strong><small>markets surfaced</small></div>
            <div className="float-card float-card-three"><span className="float-label">Research first</span><strong>DATA</strong><small>terms • payments • GEO</small></div>
          </div>
        </div>

        <div className="trust-strip mt-10">
          <div><span className="trust-icon">✓</span><div><strong>Structured profiles</strong><small>Consistent platform fields</small></div></div>
          <div><span className="trust-icon">↻</span><div><strong>Freshness aware</strong><small>Verify current operator terms</small></div></div>
          <div><span className="trust-icon">⌖</span><div><strong>Country context</strong><small>GEO data where available</small></div></div>
          <div><span className="trust-icon">↗</span><div><strong>Transparent links</strong><small>Affiliate disclosure included</small></div></div>
        </div>
      </section>

      <MonetagAds placement="top" />

      <section id="directory" className="mx-auto max-w-7xl px-5 py-10 sm:px-6 md:py-16">
        <div className="section-heading">
          <div><p className="section-kicker">DISCOVER</p><h2>Find the right information faster.</h2><p>Search, filter and compare the platforms currently published in the BetBass dataset.</p></div>
          <a href="/methodology" className="method-link">How BetBass works →</a>
        </div>

        <div className="quick-links">
          {[
            ["Betting Sites", "/betting-sites"], ["Online Casinos", "/online-casinos"], ["Sportsbooks", "/sportsbooks"],
            ["Casino Bonuses", "/casino-bonuses"], ["Betting Bonuses", "/betting-bonuses"], ["All Countries", "/countries"],
          ].map(([label, href]) => <a key={href} href={href}>{label}<span>↗</span></a>)}
        </div>

        <CasinoDirectory casinos={casinos} />
      </section>

      <MonetagAds placement="inline" />

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16">
        <div className="country-panel">
          <div className="section-heading mb-7">
            <div><p className="section-kicker">GLOBAL GEO</p><h2>Explore by country</h2><p>Market pages are generated from country information currently present in the dataset.</p></div>
            <a href="/countries" className="method-link">View all countries →</a>
          </div>
          <div className="country-grid">
            {countryStats.map(([code, count]) => (
              <a key={code} href={"/countries/" + code.toLowerCase()} className="country-card">
                <span>{code}</span><strong>{countryName(code)}</strong><small>{count} listed platform{count === 1 ? "" : "s"} ↗</small>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 md:py-16">
        <div className="methodology-preview">
          <div>
            <p className="section-kicker">TRUST LAYER</p>
            <h2>More than an affiliate link.</h2>
            <p>BetBass is designed to add useful comparison value: structured offer fields, payment context, country availability, freshness signals and clear disclosure. Operator terms remain the source of truth for eligibility and current promotions.</p>
            <a href="/methodology" className="primary-cta inline-flex">Read our methodology <span>→</span></a>
          </div>
          <div className="methodology-points">
            <div><span>01</span><strong>Evidence-aware</strong><p>Separate published facts from editorial context.</p></div>
            <div><span>02</span><strong>Comparison-first</strong><p>Make important fields easy to scan side by side.</p></div>
            <div><span>03</span><strong>GEO-aware</strong><p>Surface country data without implying universal eligibility.</p></div>
            <div><span>04</span><strong>Freshness-aware</strong><p>Show update context and remind visitors to verify live terms.</p></div>
          </div>
        </div>
      </section>

      <TrustDisclosure />

      <section id="faq" className="mx-auto max-w-4xl px-5 py-12 sm:px-6 md:py-16">
        <p className="section-kicker">FAQ</p><h2 className="mt-2 text-3xl font-black md:text-4xl">BetBass FAQ</h2>
        <div className="mt-7 space-y-3">
          <details className="glass rounded-2xl p-5"><summary className="cursor-pointer font-semibold">What is BetBass?</summary><p className="mt-3 text-sm leading-6 text-white/55">BetBass is a comparison and affiliate directory that organizes published information about betting sites, online casinos and sportsbooks.</p></details>
          <details className="glass rounded-2xl p-5"><summary className="cursor-pointer font-semibold">How are bonus details handled?</summary><p className="mt-3 text-sm leading-6 text-white/55">Bonus information is stored as platform data and can change. Always verify the current promotion, eligibility, wagering terms and expiry conditions with the operator.</p></details>
          <details className="glass rounded-2xl p-5"><summary className="cursor-pointer font-semibold">Does BetBass accept bets?</summary><p className="mt-3 text-sm leading-6 text-white/55">No. BetBass does not accept wagers, hold player funds or process gambling transactions.</p></details>
          <details className="glass rounded-2xl p-5"><summary className="cursor-pointer font-semibold">Are outbound links affiliate links?</summary><p className="mt-3 text-sm leading-6 text-white/55">Some outbound buttons may use publisher-configured affiliate tracking links. This can support the site and does not guarantee an offer, outcome or eligibility.</p></details>
        </div>
      </section>

      <PWAInstall />

      <footer className="border-t border-white/10 px-5 py-10 text-center text-sm text-white/40 sm:px-6">
        <div className="mb-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
          <a href="/about" className="hover:text-white">About</a><a href="/methodology" className="hover:text-white">Methodology</a><a href="/privacy" className="hover:text-white">Privacy</a><a href="/terms" className="hover:text-white">Terms</a><a href="/responsible-gambling" className="hover:text-white">Responsible Gambling</a>
        </div>
        18+ where applicable. Gambling involves risk. Availability, licensing and offers vary by jurisdiction. Always check current operator terms.
      </footer>
    </main>
  );
}
