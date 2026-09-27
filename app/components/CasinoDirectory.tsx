"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Casino } from "../../lib/supabase";

function initials(name: string) {
  return name.split(/\\s+/).slice(0, 2).map(x => x[0]).join("").toUpperCase();
}

export default function CasinoDirectory({ casinos }: { casinos: Casino[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const filtered = useMemo(() => casinos.filter(c => {
    const hay = [c.name, c.short_description, ...c.tags].join(" ").toLowerCase();
    const matchesQuery = hay.includes(query.toLowerCase());
    const matchesType = type === "all" || c.operator_type === type || c.operator_type === "both";
    return matchesQuery && matchesType;
  }), [casinos, query, type]);

  async function track(casino: Casino) {
    if (!casino.affiliate_url) return;
    try {
      await fetch("/api/click", {
        method: "POST",
        headers: {"content-type":"application/json"},
        body: JSON.stringify({ casinoId: casino.id })
      });
    } catch {}
    window.open(casino.affiliate_url, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-violet-300">DIRECTORY</p>
          <h2 className="mt-2 text-3xl font-black">Betting & casino platforms</h2>
          <p className="mt-2 text-white/45">Browse brands and follow your own affiliate links when available.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search platforms..." className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30 focus:border-violet-400/40 sm:w-64" />
          <select value={type} onChange={e => setType(e.target.value)} className="rounded-2xl border border-white/10 bg-[#101024] px-4 py-3 outline-none">
            <option value="all">All types</option>
            <option value="sportsbook">Sportsbook</option>
            <option value="casino">Casino</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((casino, i) => (
          <motion.article key={casino.id} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.03}} className="glass group rounded-3xl p-5 transition hover:-translate-y-1 hover:border-violet-400/30">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/80 to-cyan-400/70 text-lg font-black">
                {casino.logo_url ? <img src={casino.logo_url} alt="" className="h-full w-full object-contain p-2" /> : initials(casino.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-xl font-bold">{casino.name}</h3>
                  {casino.featured && <span className="rounded-full bg-violet-400/10 px-2 py-1 text-[10px] font-bold text-violet-200">FEATURED</span>}
                </div>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/35">{casino.operator_type === "both" ? "Sportsbook + Casino" : casino.operator_type}</p>
              </div>
            </div>
            <p className="mt-4 min-h-12 text-sm leading-6 text-white/55">{casino.short_description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {casino.tags.slice(0,4).map(tag => <span key={tag} className="rounded-full border border-white/8 bg-white/4 px-2.5 py-1 text-[11px] text-white/50">{tag}</span>)}
            </div>
            {casino.bonus_text && <div className="mt-5 rounded-2xl bg-white/5 p-4"><p className="text-[11px] uppercase tracking-wider text-white/35">Offer</p><p className="mt-1 font-bold">{casino.bonus_text}</p></div>}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <a href={`/casinos/${casino.slug}`} className="rounded-2xl border border-white/10 px-4 py-3 text-center text-sm font-semibold hover:bg-white/5">Details</a>
              <button onClick={() => track(casino)} disabled={!casino.affiliate_url} className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-30">{casino.affiliate_url ? "Visit offer" : "Link pending"}</button>
            </div>
          </motion.article>
        ))}
      </div>
      {!filtered.length && <div className="glass rounded-3xl p-12 text-center text-white/50">No platforms match your search.</div>}
    </>
  );
}
