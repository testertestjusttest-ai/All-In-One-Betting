import { motion } from "framer-motion";

const casinos = [
  { name: "NeonBet", bonus: "100% up to $500", tag: "Featured", rating: "4.8", color: "from-violet-500 to-cyan-400" },
  { name: "LuckyPeak", bonus: "200 Free Spins", tag: "Popular", rating: "4.7", color: "from-fuchsia-500 to-purple-500" },
  { name: "PrimePlay", bonus: "50% up to $300", tag: "New", rating: "4.6", color: "from-blue-500 to-indigo-500" }
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="text-2xl font-black tracking-tight">Bet<span className="gradient-text">Bass</span></div>
        <div className="hidden gap-7 text-sm text-white/65 md:flex">
          <a href="#offers" className="hover:text-white">Offers</a>
          <a href="#compare" className="hover:text-white">Compare</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
        </div>
        <button className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold hover:bg-white/10">Menu</button>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }} className="max-w-4xl">
          <div className="mb-5 inline-flex rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-semibold text-violet-200">ALL-IN-ONE OFFERS & GUIDES</div>
          <h1 className="text-5xl font-black leading-[1.03] tracking-tight md:text-7xl">
            Find the right <span className="gradient-text">betting offer</span> in one place.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">Explore bonuses, cashback, payment methods and country availability with clear offer details before you choose.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#offers" className="rounded-2xl bg-white px-6 py-4 text-center font-bold text-black hover:bg-white/90">Explore offers</a>
            <a href="#compare" className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center font-bold hover:bg-white/10">Compare operators</a>
          </div>
        </motion.div>
      </section>

      <section id="offers" className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div><p className="text-sm font-semibold text-violet-300">CURATED</p><h2 className="mt-2 text-3xl font-bold">Featured offers</h2></div>
          <span className="text-sm text-white/40">Updated regularly</span>
        </div>
        <div id="compare" className="grid gap-5 md:grid-cols-3">
          {casinos.map((casino, i) => (
            <motion.article key={casino.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .08 }} className="glass rounded-3xl p-6">
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${casino.color} text-xl font-black text-white`}>{casino.name[0]}</div>
              <div className="flex items-center justify-between gap-3"><h3 className="text-xl font-bold">{casino.name}</h3><span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/60">{casino.tag}</span></div>
              <p className="mt-4 text-2xl font-extrabold">{casino.bonus}</p>
              <div className="mt-3 text-sm text-white/50">Rating {casino.rating} · Terms apply</div>
              <button className="mt-6 w-full rounded-2xl bg-white/8 px-4 py-3 font-semibold hover:bg-white/12">View offer</button>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="glass rounded-3xl p-7 md:p-10">
          <h2 className="text-2xl font-bold">What we compare</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Welcome bonuses", "Cashback", "Payment methods", "Country availability"].map(x => <div key={x} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/75">{x}</div>)}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-bold">FAQ</h2>
        <div className="mt-6 space-y-3">
          <details className="glass rounded-2xl p-5"><summary className="cursor-pointer font-semibold">How does BetBass work?</summary><p className="mt-3 text-white/55">We organize publicly available operator information so visitors can compare offers and follow an affiliate link when available.</p></details>
          <details className="glass rounded-2xl p-5"><summary className="cursor-pointer font-semibold">Are offers guaranteed?</summary><p className="mt-3 text-white/55">No. Offers can change. Always check the operator&apos;s current terms, eligibility and local laws before participating.</p></details>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10 text-center text-sm text-white/40">18+ where applicable. Gambling involves risk. Terms, eligibility and local restrictions apply.</footer>
    </main>
  );
}