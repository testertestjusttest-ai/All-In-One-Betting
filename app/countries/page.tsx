import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { COUNTRY_NAMES, countryPath } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Betting & Casino Countries",
  description: "Browse BetBass country-specific betting and casino comparison directories based on available GEO data.",
  alternates: { canonical: "/countries" },
};

export default async function CountriesPage() {
  const { data } = await supabase.from("betbass_casinos").select("geo_codes,geo_targeting").eq("active", true);
  const codes = [...new Set((data ?? []).flatMap((row) => [...(row.geo_codes ?? []), ...(row.geo_targeting ?? [])]).map((code) => String(code).toUpperCase()).filter(Boolean))].sort();

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-white/45 hover:text-white">← Back to BetBass</Link>
        <header className="mt-10 max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">GLOBAL GEO DIRECTORY</p>
          <h1 className="mt-2 text-4xl font-black md:text-6xl">Betting & Casino by Country</h1>
          <p className="mt-5 text-lg leading-8 text-white/55">
            Country pages are generated from GEO information currently available in the BetBass platform dataset.
          </p>
        </header>
        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {codes.map((code) => (
            <Link key={code} href={countryPath(code)} className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/[.08]">
              <h2 className="text-lg font-black">{COUNTRY_NAMES[code] ?? code}</h2>
              <p className="mt-1 text-xs text-white/45">{code}</p>
            </Link>
          ))}
        </section>
        {!codes.length && <p className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/50">No country-specific GEO records are currently published.</p>}
      </div>
    </main>
  );
}
