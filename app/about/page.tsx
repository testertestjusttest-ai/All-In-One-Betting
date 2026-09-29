import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About BetBass",
  description: "Learn what BetBass does and how its betting and casino comparison directory works.",
  alternates: { canonical: "/about" }
};

export default function AboutPage() {
  return <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
    <a href="/" className="text-sm text-white/50 hover:text-white">← Back to BetBass</a>
    <h1 className="mt-8 text-4xl font-black">About BetBass</h1>
    <div className="mt-10 space-y-8 text-sm leading-7 text-white/65">
      <section><h2 className="text-xl font-bold text-white">What we do</h2><p className="mt-3">BetBass organizes betting sites, online casinos and sportsbook platforms into a searchable comparison directory. Platform profiles can include offers, payment information, licensing details and country availability.</p></section>
      <section><h2 className="text-xl font-bold text-white">How we are funded</h2><p className="mt-3">Some outbound links may be affiliate links, meaning BetBass can receive compensation when visitors complete qualifying actions with participating operators.</p></section>
      <section><h2 className="text-xl font-bold text-white">Verification matters</h2><p className="mt-3">Operator terms, promotions, licensing and availability can change. Always verify current information directly with the operator before making a decision.</p></section>
    </div>
  </main>;
}