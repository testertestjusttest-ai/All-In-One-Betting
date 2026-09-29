import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "BetBass privacy policy covering site usage, analytics, advertising and affiliate links.",
  alternates: { canonical: "/privacy" }
};

export default function PrivacyPage() {
  return <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
    <a href="/" className="text-sm text-white/50 hover:text-white">← Back to BetBass</a>
    <h1 className="mt-8 text-4xl font-black">Privacy Policy</h1>
    <p className="mt-4 text-white/50">Last updated: September 29, 2026</p>
    <div className="mt-10 space-y-8 text-sm leading-7 text-white/65">
      <section><h2 className="text-xl font-bold text-white">Information we collect</h2><p className="mt-3">BetBass may process information needed to operate the website, measure traffic, prevent abuse and understand how visitors use the directory. Third-party advertising, analytics and affiliate providers may use cookies or similar technologies according to their own policies.</p></section>
      <section><h2 className="text-xl font-bold text-white">Affiliate links and advertising</h2><p className="mt-3">Some links may be affiliate links. If you follow an affiliate link and complete an eligible action with an operator, BetBass may receive compensation. Advertising providers may also use cookies or similar technologies.</p></section>
      <section><h2 className="text-xl font-bold text-white">Your choices</h2><p className="mt-3">You can control cookies through your browser and, where offered, through the consent controls provided by third-party services. Blocking some technologies may affect site functionality.</p></section>
      <section><h2 className="text-xl font-bold text-white">Third-party sites</h2><p className="mt-3">Operator and advertiser websites linked from BetBass are independent services. Review their privacy notices and terms before providing personal information.</p></section>
    </div>
  </main>;
}