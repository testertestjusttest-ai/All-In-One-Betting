import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Responsible Gambling",
  description: "Responsible gambling information and practical safeguards for visitors using BetBass.",
  alternates: { canonical: "/responsible-gambling" }
};

export default function ResponsibleGamblingPage() {
  return <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
    <a href="/" className="text-sm text-white/50 hover:text-white">← Back to BetBass</a>
    <h1 className="mt-8 text-4xl font-black">Responsible Gambling</h1>
    <p className="mt-4 text-white/50">18+ where applicable. Gambling involves risk.</p>
    <div className="mt-10 space-y-8 text-sm leading-7 text-white/65">
      <section><h2 className="text-xl font-bold text-white">Set limits</h2><p className="mt-3">Only gamble with money you can afford to lose. Consider setting deposit, spending and time limits before you start.</p></section>
      <section><h2 className="text-xl font-bold text-white">Know the risks</h2><p className="mt-3">Gambling outcomes are uncertain. Do not chase losses, borrow money to gamble, or treat gambling as a way to earn income.</p></section>
      <section><h2 className="text-xl font-bold text-white">Take a break</h2><p className="mt-3">If gambling is becoming difficult to control, stop and use the self-exclusion, cooling-off and limit tools offered by the relevant operator where available. Consider seeking help from a qualified local support service.</p></section>
      <section><h2 className="text-xl font-bold text-white">Jurisdiction and age</h2><p className="mt-3">Only use gambling services where permitted by applicable law and only if you meet the applicable minimum age.</p></section>
    </div>
  </main>;
}