import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "../../../lib/supabase";

async function getCasino(slug: string) {
  const { data } = await supabase.from("betbass_casinos").select("*").eq("slug", slug).eq("active", true).maybeSingle();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{slug:string}> }): Promise<Metadata> {
  const { slug } = await params; const casino = await getCasino(slug);
  if (!casino) return { title: "Platform not found | BetBass" };
  return { title: casino.name, description: casino.short_description || `${casino.name} platform details, offers and availability.`, alternates: { canonical: `/casinos/${casino.slug}` } };
}

export default async function CasinoPage({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params; const casino = await getCasino(slug); if (!casino) notFound();
  return <main className="min-h-screen px-6 py-10"><div className="mx-auto max-w-5xl"><a href="/" className="text-sm text-white/45 hover:text-white">← Back to BetBass</a>
    <section className="mt-8 glass rounded-[2rem] p-7 md:p-10"><div className="flex flex-col gap-6 md:flex-row md:items-start"><div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-400 text-3xl font-black">{casino.logo_url ? <img src={casino.logo_url} alt="" className="h-full w-full object-contain p-3"/> : casino.name.slice(0,2).toUpperCase()}</div><div className="flex-1"><div className="flex flex-wrap gap-2">{casino.tags?.map((tag:string)=><span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">{tag}</span>)}</div><h1 className="mt-4 text-4xl font-black md:text-6xl">{casino.name}</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-white/55">{casino.short_description}</p>{casino.bonus_text&&<div className="mt-6 rounded-2xl border border-violet-400/15 bg-violet-400/8 p-5"><p className="text-xs uppercase tracking-widest text-violet-200">Current offer</p><p className="mt-2 text-xl font-bold">{casino.bonus_text}</p></div>}<div className="mt-7 flex flex-col gap-3 sm:flex-row">{casino.affiliate_url&&<a href={casino.affiliate_url} target="_blank" rel="nofollow sponsored noopener noreferrer" className="rounded-2xl bg-white px-6 py-4 text-center font-bold text-black">Visit offer</a>}{casino.website_url&&<a href={casino.website_url} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center font-semibold">Official website</a>}</div></div></div></section>
    <section className="mt-6 grid gap-6 md:grid-cols-2"><div className="glass rounded-3xl p-6"><h2 className="text-xl font-bold">Offer & terms</h2><dl className="mt-5 space-y-4 text-sm"><div><dt className="text-white/35">Cashback</dt><dd className="mt-1">{casino.cashback_text||"Not listed yet"}</dd></div><div><dt className="text-white/35">License / regulation</dt><dd className="mt-1">{casino.license_text||"Verify current licensing in your jurisdiction."}</dd></div></dl></div><div className="glass rounded-3xl p-6"><h2 className="text-xl font-bold">Availability</h2><p className="mt-3 text-sm text-white/55">Availability and product access can vary by country. Always confirm eligibility, local restrictions and current terms with the operator.</p><div className="mt-5 flex flex-wrap gap-2">{(casino.countries?.length?casino.countries:["Market-specific"]).map((x:string)=><span key={x} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/55">{x}</span>)}</div></div></section>
    <p className="mt-8 text-center text-xs leading-6 text-white/30">BetBass is an affiliate/comparison directory. We do not accept bets, hold player funds or process wagers. Offers can change; check the operator's current terms before participating.</p>
  </div></main>;
}
