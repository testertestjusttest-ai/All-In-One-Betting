import { supabase } from "../lib/supabase";
import CasinoDirectory from "./components/CasinoDirectory";

export const dynamic = "force-dynamic";

async function getCasinos() {
  const { data } = await supabase.from("betbass_casinos").select("*").eq("active", true).order("featured",{ascending:false}).order("sort_order");
  return data ?? [];
}

export default async function Home() {
  const casinos = await getCasinos();
  return (
    <main className="min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href="/" className="text-2xl font-black tracking-tight">Bet<span className="gradient-text">Bass</span></a>
        <div className="hidden gap-7 text-sm text-white/65 md:flex"><a href="#directory" className="hover:text-white">Directory</a><a href="#compare" className="hover:text-white">Compare</a><a href="#faq" className="hover:text-white">FAQ</a></div>
        <a href="/admin" className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold hover:bg-white/10">Admin</a>
      </nav>
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:pt-24"><div className="max-w-5xl"><div className="mb-5 inline-flex rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-semibold text-violet-200">GLOBAL BETTING & CASINO DIRECTORY</div><h1 className="text-5xl font-black leading-[1.03] tracking-tight md:text-7xl">Every major <span className="gradient-text">platform</span>, one professional directory.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">Search betting and casino brands, open detailed profiles, and manage your own affiliate tracking links from the BetBass admin center.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="#directory" className="rounded-2xl bg-white px-6 py-4 text-center font-bold text-black hover:bg-white/90">Explore platforms</a><a href="/admin" className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center font-bold hover:bg-white/10">Open admin center</a></div></div></section>
      <section id="directory" className="mx-auto max-w-7xl px-6 py-12"><CasinoDirectory casinos={casinos} /></section>
      <section id="compare" className="mx-auto max-w-7xl px-6 py-16"><div className="glass rounded-3xl p-7 md:p-10"><p className="text-sm font-semibold text-violet-300">BUILT FOR AFFILIATE PUBLISHERS</p><h2 className="mt-2 text-3xl font-bold">Everything you need to manage the directory</h2><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Platform cards","Logo, type, tags, offer and GEO information."],["Affiliate links","Paste or replace tracking links from admin."],["Click analytics","Track outbound offer clicks per platform."],["SEO pages","Dedicated, indexable profiles for every platform."]].map(([title,body])=><div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/45">{body}</p></div>)}</div></div></section>
      <section id="faq" className="mx-auto max-w-4xl px-6 py-16"><h2 className="text-3xl font-bold">FAQ</h2><div className="mt-6 space-y-3"><details className="glass rounded-2xl p-5"><summary className="cursor-pointer font-semibold">Can I add my own affiliate links?</summary><p className="mt-3 text-white/55">Yes. Sign in at the admin center and add or edit the affiliate tracking URL for each platform. Empty links remain disabled on public cards.</p></details><details className="glass rounded-2xl p-5"><summary className="cursor-pointer font-semibold">Is the directory exhaustive?</summary><p className="mt-3 text-white/55">The starter catalog covers many major global brands, but no static directory can guarantee every operator worldwide. You can add more from the admin panel.</p></details><details className="glass rounded-2xl p-5"><summary className="cursor-pointer font-semibold">Does BetBass accept bets?</summary><p className="mt-3 text-white/55">No. BetBass is a comparison and affiliate directory. It does not accept wagers, hold player funds or process gambling transactions.</p></details></div></section>
      <footer className="border-t border-white/10 px-6 py-10 text-center text-sm text-white/40">18+ where applicable. Gambling involves risk. Availability, licensing and offers vary by jurisdiction. Always check current operator terms.</footer>
    </main>
  );
}
