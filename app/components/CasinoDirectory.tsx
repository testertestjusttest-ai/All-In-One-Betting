"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Casino } from "../../lib/supabase";

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map(x => x[0]).join("").toUpperCase();
}

export default function CasinoDirectory({ casinos }: { casinos: Casino[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const filtered = useMemo(() => casinos.filter(c => {
    const hay = [c.name, c.short_description, ...c.tags].join(" ").toLowerCase();
    return hay.includes(query.toLowerCase()) && (type === "all" || c.operator_type === type || c.operator_type === "both");
  }), [casinos, query, type]);

  async function track(casino: Casino) {
    if (!casino.affiliate_url) return;
    try { await fetch("/api/click", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({casinoId:casino.id}) }); } catch {}
    window.open(casino.affiliate_url, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div><p className="text-sm font-semibold text-violet-300">DIRECTORY</p><h2 className="mt-2 text-3xl font-black">Betting & casino platforms</h2><p className="mt-2 text-white/45">Browse brands and compare available information.</p></div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search platforms..." className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30 focus:border-violet-400/40 sm:w-64"/>
          <select value={type} onChange={e=>setType(e.target.value)} className="rounded-2xl border border-white/10 bg-[#101024] px-4 py-3 outline-none"><option value="all">All types</option><option value="sportsbook">Sportsbook</option><option value="casino">Casino</option></select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((casino,i)=>(
          <motion.article key={casino.id} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.03}} className="glass group min-w-0 rounded-2xl p-3 sm:rounded-3xl sm:p-5 transition hover:-translate-y-1 hover:border-violet-400/30">
            <div className="flex items-start gap-2 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white p-1 sm:h-16 sm:w-16 sm:rounded-2xl">
                {casino.logo_url ? <img src={casino.logo_url} alt={casino.name} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain" onError={e=>{e.currentTarget.style.display="none";}}/> : <span className="bg-gradient-to-br from-violet-500 to-cyan-400 bg-clip-text text-base font-black text-transparent">{initials(casino.name)}</span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1"><h3 className="line-clamp-2 text-sm font-bold sm:text-xl">{casino.name}</h3>{casino.featured&&<span className="hidden shrink-0 rounded-full bg-violet-400/10 px-2 py-1 text-[10px] font-bold text-violet-200 sm:block">FEATURED</span>}</div>
                <p className="mt-1 text-[9px] uppercase tracking-wider text-white/35 sm:text-xs">{casino.operator_type==="both"?"Sportsbook + Casino":casino.operator_type}</p>
              </div>
            </div>
            <p className="mt-3 line-clamp-3 min-h-[3.75rem] text-xs leading-5 text-white/55 sm:mt-4 sm:text-sm sm:leading-6">{casino.short_description}</p>
            {casino.bonus_text&&<div className="mt-3 rounded-xl bg-white/5 p-2.5 sm:mt-5 sm:rounded-2xl sm:p-4"><p className="text-[9px] uppercase tracking-wider text-white/35 sm:text-[11px]">Offer</p><p className="mt-1 line-clamp-2 text-xs font-bold sm:text-sm">{casino.bonus_text}</p></div>}
            <div className="mt-3 flex flex-wrap gap-1 sm:mt-4 sm:gap-2">{casino.tags.slice(0,3).map(tag=><span key={tag} className="max-w-full truncate rounded-full border border-white/8 bg-white/4 px-2 py-1 text-[9px] text-white/50 sm:px-2.5 sm:text-[11px]">{tag}</span>)}</div>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:mt-5 sm:grid-cols-2">
              <a href={`/casinos/${casino.slug}`} className="rounded-xl border border-white/10 px-2 py-2.5 text-center text-xs font-semibold hover:bg-white/5 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">Details</a>
              <button onClick={()=>track(casino)} disabled={!casino.affiliate_url} className="rounded-xl bg-white px-2 py-2.5 text-xs font-bold text-black disabled:cursor-not-allowed disabled:opacity-30 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">{casino.affiliate_url?"Visit offer":"Link pending"}</button>
            </div>
          </motion.article>
        ))}
      </div>
      {!filtered.length&&<div className="glass rounded-3xl p-12 text-center text-white/50">No platforms match your search.</div>}
    </>
  );
}