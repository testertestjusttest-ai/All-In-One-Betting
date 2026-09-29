import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "BetBass terms of use for the betting and casino comparison directory.",
  alternates: { canonical: "/terms" }
};

export default function TermsPage() {
  return <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
    <a href="/" className="text-sm text-white/50 hover:text-white">← Back to BetBass</a>
    <h1 className="mt-8 text-4xl font-black">Terms of Use</h1>
    <p className="mt-4 text-white/50">Last updated: September 29, 2026</p>
    <div className="mt-10 space-y-8 text-sm leading-7 text-white/65">
      <section><h2 className="text-xl font-bold text-white">Directory only</h2><p className="mt-3">BetBass is a comparison and affiliate directory. It does not accept wagers, hold player funds, operate sportsbooks or casinos, or process gambling transactions.</p></section>
      <section><h2 className="text-xl font-bold text-white">Information and offers</h2><p className="mt-3">Platform details, offers, payment methods, licensing information and availability can change. Information on BetBass is provided for comparison purposes and should be verified with the relevant operator before use.</p></section>
      <section><h2 className="text-xl font-bold text-white">Eligibility and jurisdiction</h2><p className="mt-3">Gambling laws and operator availability vary by location. You are responsible for determining whether online gambling is lawful where you live and for meeting any applicable age and eligibility requirements.</p></section>
      <section><h2 className="text-xl font-bold text-white">External services</h2><p className="mt-3">Following a directory or affiliate link may take you to a third-party website. That service's own terms, privacy policy and rules apply there.</p></section>
    </div>
  </main>;
}