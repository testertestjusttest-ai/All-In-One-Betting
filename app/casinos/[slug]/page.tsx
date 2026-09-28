import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "../../../lib/supabase";
import MonetagAds from "../../components/MonetagAds";

const siteUrl = "https://betbass.vercel.app";

async function getCasino(slug: string) {
  const { data } = await supabase.from("betbass_casinos").select("*").eq("slug", slug).eq("active", true).maybeSingle();
  return data;
}

// Fixed malformed literal \\n sequences introduced during a previous edit.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const casino = await getCasino(slug);
  if (!casino) return { title: "Platform not found", robots: { index: false, follow: false } };

  return {
    title: casino.seo_title?.trim() || `${casino.name} — Betting & Casino Platform`,
    description: casino.seo_description?.trim() || casino.short_description || `${casino.name} betting and casino platform profile, offers and payment methods on BetBass.`,
    alternates: { canonical: `/casinos/${casino.slug}` },
    robots: { index: !casino.seo_noindex, follow: true }
  };
}

export default async function CasinoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const casino = await getCasino(slug);
  if (!casino) notFound();

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <section className="mt-8 glass rounded-[2rem] p-7 md:p-10">
          <h1 className="text-4xl font-black md:text-6xl">{casino.name}</h1>
          <p className="mt-4 text-lg text-white/55">{casino.short_description}</p>
        </section>

        <MonetagAds placement="inline" />

        <section className="mt-6 glass rounded-3xl p-7 md:p-9">
          <h2 className="text-2xl font-black">About {casino.name}</h2>
          <p className="mt-4 text-white/60">{casino.seo_intro || casino.short_description}</p>
        </section>

        <MonetagAds placement="bottom" />
      </div>
    </main>
  );
}
