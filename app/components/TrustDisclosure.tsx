export default function TrustDisclosure() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12" aria-labelledby="trust-heading">
      <div className="glass rounded-3xl border border-white/10 p-7 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">TRANSPARENCY</p>
            <h2 id="trust-heading" className="mt-2 text-3xl font-black">How BetBass works</h2>
            <p className="mt-3 text-sm leading-6 text-white/50">BetBass is a comparison and affiliate directory. We organize platform information so visitors can research listed operators before deciding whether to visit them.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><h3 className="font-bold">Affiliate disclosure</h3><p className="mt-2 text-xs leading-5 text-white/45">Some outbound buttons may use publisher-configured affiliate tracking links. This can help support the site and does not guarantee any offer, outcome or eligibility.</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><h3 className="font-bold">Data freshness</h3><p className="mt-2 text-xs leading-5 text-white/45">Offers, payment methods, licensing and availability can change. Listed information should be checked against the operator's current terms.</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><h3 className="font-bold">No wagering</h3><p className="mt-2 text-xs leading-5 text-white/45">BetBass does not accept bets, hold player funds or process gambling transactions.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
