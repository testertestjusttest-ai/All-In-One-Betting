import type { Metadata } from "next";
import { supabase } from "../lib/supabase";
import CasinoDirectory from "./components/CasinoDirectory";
import MonetagAds from "./components/MonetagAds";

export const metadata: Metadata = {
  title: "Betting Sites & Online Casinos — Compare Platforms, Bonuses & Availability",
  description: "Compare betting sites, online casinos and sportsbook platforms on BetBass. Explore offers, payment methods, licensing and country availability in one directory.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "BetBass — Betting Sites & Online Casino Comparison",
    description: "Compare betting sites, online casinos, sportsbook platforms, offers and availability.",
    url: "/",
    type: "website"
  }
};

export const dynamic = "force-dynamic";

async function getCasinos() {
  const { data } = await supabase.from("betbass_casinos").select("*").eq("active", true).order("priority",{ascending:true}).order("bangladesh_priority",{ascending:false}).order("featured",{ascending:false}).order("name");
  return data ?? [];
}

export default async function Home() {
  const casinos = await getCasinos();
  const siteUrl = "https://betbass.vercel.app";
  const itemList = casinos.slice(0, 100).map((casino, index) => ({ "@type": "ListItem", position: index + 1, name: casino.name, url: `${siteUrl}/casinos/${casino.slug}` }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "BetBass Betting & Casino Comparison Directory",
    description: "Compare betting sites, online casinos and sportsbook platforms.",
    url: siteUrl,
    mainEntity: { "@type": "ItemList", name: "BetBass platform directory", numberOfItems: itemList.length, itemList }
  };
  return (
    <main className="min-h-screen overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href="/" className="text-2xl font-black tracking-tight">Bet<span className="gradient-text">Bass</span></a>
        <div className="hidden gap-7 text-sm text-white/65 md:flex"><a href="#directory" className="hover:text-white">Directory</a><a href="#compare" className="hover:text-white">Compare</a><a href="#faq" className="hover:text-white">FAQ</a></div>
        <a href="/admin" className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold hover:bg-white/10">Admin</a>
      </nav>
      <MonetagAds />
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:pt-24"><div className="max-w-5xl"><div className="mb-5 inline-flex rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-semibold text-violet-200">BETTING SITES • ONLINE CASINOS • SPORTSBOOKS</div><h1 className="text-5xl font-black leading-[1.03] tracking-tight md:text-7xl">Compare <span className="gradient-text">betting sites & casinos</span> in one directory.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">Search casino and sportsbook brands, compare offers, payment methods, licensing and country availability, then open detailed platform profiles.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="#directory" className="rounded-2xl bg-white px-6 py-4 text-center font-bold text-black hover:bg-white/90">Explore platforms</a><a href="#compare" className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center font-bold hover:bg-white/10">Compare features</a></div></div></section>
      <section id="directory" className="mx-auto max-w-7xl px-6 py-12"><CasinoDirectory casinos={casinos} /></section>
      <section id="compare" className="mx-auto max-w-7xl px-6 py-16"><div className="glass rounded-3xl p-7 md:p-10"><p className="text-sm font-semibold text-violet-300">BETTING & CASINO DIRECTORY</p><h2 className="mt-2 text-3xl font-bold">Compare platforms by the information that matters</h2><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Platform profiles","Review operator type, offer details, tags and market availability."],["Affiliate offers","Open publisher-configured tracking links for listed platforms."],["Payment methods","Compare available payment information shown for each platform."],["Country availability","Check listed GEO coverage and verify current operator terms."]].map(([title,body])=><div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/45">{body}</p></div>)}</div></div></section>
      <section id="faq" className="mx-auto max-w-4xl px-6 py-16"><h2 className="text-3xl font-bold">BetBass FAQ</h2><div className="mt-6 space-y-3"><details className="glass rounded-2xl p-5"><summary className="cursor-pointer font-semibold">What is BetBass?</summary><p className="mt-3 text-white/55">BetBass is a betting and casino comparison and affiliate directory. It organizes platform information, offers, payment details and availability in dedicated pages.</p></details><details className="glass rounded-2xl p-5"><summary className="cursor-pointer font-semibold">Can I find betting sites and online casinos?</summary><p className="mt-3 text-white/55">Yes. The directory can contain sportsbook, casino and combined betting-and-casino platforms, with category and GEO information supplied by the site administrator.</p></details><details className="glass rounded-2xl p-5"><summary className="cursor-pointer font-semibold">Are offers and availability guaranteed?</summary><p className="mt-3 text-white/55">No. Offers, licensing, eligibility and product availability can change by operator and jurisdiction. Always verify the current terms with the operator.</p></details><details className="glass rounded-2xl p-5"><summary className="cursor-pointer font-semibold">Does BetBass accept bets?</summary><p className="mt-3 text-white/55">No. BetBass is a comparison and affiliate directory. It does not accept wagers, hold player funds or process gambling transactions.</p></details></div></section>
      <footer className="border-t border-white/10 px-6 py-10 text-center text-sm text-white/40">18+ where applicable. Gambling involves risk. Availability, licensing and offers vary by jurisdiction. Always check current operator terms.</footer>
    </main>
  );
}
