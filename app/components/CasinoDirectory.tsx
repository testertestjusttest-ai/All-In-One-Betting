"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Casino } from "../../lib/supabase";

type OfferCasino = Casino & {
  bonus_percent?: number | null;
  bonus_type?: string | null;
  currency?: string | null;
  claim_label?: string | null;
  priority?: number;
  bangladesh_priority?: boolean;
  public_rating?: number;
};

const logoDomains: Record<string, string> = {
  tk999: "tk999.com", ck999: "ck999.com", bk999: "bk999.com", jeetwin: "jeetwin.com",
  krikiya: "krikya.io", baji: "baji.com", crickex: "crickex.com", jeetbuzz: "jeetbuzz.com",
  nagad88: "nagad88.com", babu88: "babu88.com", jaya9: "jaya9.com", mcw: "mcw.com",
  linebet: "linebet.com", megapari: "megapari.com", "888starz": "888starz.com", betjili: "betjili.com",
  "4rabet": "4rabet.com", winwin: "winwin.bet", rajabaji: "rajabaji.com", pbc88: "pbc88.com",
  betvisa: "bv88visa.com",
  "10bet": "10bet.com", "1win": "1win.com", "1xbet": "1xbet.com", "22bet": "22bet.com",
  "888casino": "888casino.com", "888sport": "888sport.com", "bc-game": "bc.game",
  bet365: "bet365.com", betano: "betano.com", betfred: "betfred.com", betmgm: "betmgm.com",
  betsson: "betsson.com", betvictor: "betvictor.com", betway: "betway.com", betwinner: "betwinner.com",
  bitstarz: "bitstarz.com", borgata: "borgataonline.com", bwin: "bwin.com",
  "caesars-sportsbook": "caesars.com", comeon: "comeon.com", coral: "coral.co.uk",
  dafabet: "dafabet.com", draftkings: "draftkings.com", "fanatics-sportsbook": "fanatics.com",
  fanduel: "fanduel.com", ggbet: "gg.bet", interwetten: "interwetten.com", ladbrokes: "ladbrokes.com",
  leovegas: "leovegas.com", marathonbet: "marathonbet.com", melbet: "melbet.com",
  mostbet: "mostbet.com", "mr-green": "mrgreen.com", "paddy-power": "paddypower.com",
  parimatch: "parimatch.com", pinnacle: "pinnacle.com", playamo: "playamo.com",
  rollbit: "rollbit.com", roobet: "roobet.com", sportingbet: "sportingbet.com", stake: "stake.com",
  thunderpick: "thunderpick.io", unibet: "unibet.com", vavada: "vavada.com", "william-hill": "williamhill.com"
};

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map(x => x[0]).join("").toUpperCase();
}

function logoFor(casino: Casino) {
  if (casino.logo_url) return casino.logo_url;
  if (casino.website_url) {
    try {
      const domain = new URL(casino.website_url).hostname.replace(/^www\./, "");
      return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
    } catch {}
  }
  const domain = logoDomains[casino.slug];
  return domain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128` : null;
}

function sortCasinos(casinos: OfferCasino[]) {
  return [...casinos].sort(
    (a, b) =>
      (a.priority ?? 1000) - (b.priority ?? 1000) ||
      Number(Boolean(b.bangladesh_priority)) - Number(Boolean(a.bangladesh_priority)) ||
      Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
      a.name.localeCompare(b.name)
  );
}

export default function CasinoDirectory({ casinos }: { casinos: Casino[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const filtered = useMemo(
    () =>
      sortCasinos(casinos as OfferCasino[]).filter(c => {
        const hay = [c.name, c.short_description, c.bonus_text, c.bonus_type ?? "", ...c.tags].join(" ").toLowerCase();
        return hay.includes(query.toLowerCase()) && (type === "all" || c.operator_type === type || c.operator_type === "both");
      }),
    [casinos, query, type]
  );

  async function trackAndOpen(casino: Casino) {
    if (!casino.affiliate_url) return;
    try {
      await fetch("/api/click", {
        method: "POST",
        headers: { "content-type": "application/json" },
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
          <p className="mt-2 text-white/45">Browse brands and compare available offers.</p>
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

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-2">
        {filtered.map((casino, i) => {
          const rating = Number(casino.public_rating ?? 0);
          const logoUrl = logoFor(casino);
          const hasAffiliate = Boolean(casino.affiliate_url);

          return (
            <motion.article
              key={casino.id}
              role={hasAffiliate ? "button" : undefined}
              tabIndex={hasAffiliate ? 0 : -1}
              aria-label={hasAffiliate ? `Open ${casino.name} affiliate offer` : `${casino.name} affiliate link not configured`}
              onClick={() => trackAndOpen(casino)}
              onKeyDown={e => {
                if (hasAffiliate && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  void trackAndOpen(casino);
                }
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className={`glass group min-w-0 rounded-2xl p-3 transition sm:rounded-3xl sm:p-5 ${hasAffiliate ? "cursor-pointer hover:-translate-y-1 hover:border-violet-400/30" : "cursor-not-allowed opacity-80"}`}
            >
              <div className="flex items-start gap-2 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white p-1 sm:h-16 sm:w-16 sm:rounded-2xl">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={`${casino.name} logo`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain"
                      onError={e => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget.parentElement?.querySelector("[data-logo-fallback]") as HTMLElement | null;
                        if (fallback) fallback.style.display = "block";
                      }}
                    />
                  ) : null}
                  <span data-logo-fallback style={{ display: logoUrl ? "none" : "block" }} className="bg-gradient-to-br from-violet-500 to-cyan-400 bg-clip-text text-base font-black text-transparent">
                    {initials(casino.name)}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="break-words text-sm font-bold leading-5 sm:text-xl sm:leading-7">{casino.name}</h3>
                    {casino.bangladesh_priority && <span className="shrink-0 rounded-full bg-green-400/10 px-2 py-1 text-[9px] font-bold text-green-200">🇧🇩 BD</span>}
                  </div>
                  <p className="mt-1 text-[9px] uppercase tracking-wider text-white/35 sm:text-xs">
                    {casino.operator_type === "both" ? "Sportsbook + Casino" : casino.operator_type}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl border border-white/8 bg-white/5 px-3 py-2 sm:mt-4 sm:rounded-2xl sm:px-4">
                <span className="text-[10px] uppercase tracking-wider text-white/35 sm:text-xs">Public rating</span>
                <span className="text-sm font-black text-yellow-200 sm:text-base">★ {rating.toFixed(1)}<span className="text-white/35">/5</span></span>
              </div>

              <p className="mt-3 line-clamp-3 min-h-[3.75rem] text-xs leading-5 text-white/55 sm:mt-4 sm:text-sm sm:leading-6">{casino.short_description}</p>

              {(casino.bonus_text || casino.bonus_percent != null) && (
                <div className="mt-3 rounded-xl bg-white/5 p-2.5 sm:mt-5 sm:rounded-2xl sm:p-4">
                  <p className="text-[9px] uppercase tracking-wider text-white/35 sm:text-[11px]">Current offer</p>
                  <p className="mt-1 line-clamp-2 text-xs font-bold sm:text-sm">
                    {casino.bonus_percent != null
                      ? casino.bonus_percent + "% " + (casino.bonus_type ?? "welcome") + " bonus" + (casino.currency ? " • " + casino.currency : "")
                      : casino.bonus_text}
                  </p>
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-1 sm:mt-4 sm:gap-2">
                {casino.tags.slice(0, 3).map(tag => <span key={tag} className="max-w-full truncate rounded-full border border-white/8 bg-white/4 px-2 py-1 text-[9px] text-white/50 sm:px-2.5 sm:text-[11px]">{tag}</span>)}
              </div>

              <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-center text-xs font-bold sm:mt-5 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">
                {hasAffiliate ? (casino.claim_label || "Open affiliate offer") : "Affiliate link not configured"}
              </div>
            </motion.article>
          );
        })}
      </div>

      {!filtered.length && <div className="glass rounded-3xl p-12 text-center text-white/50">No platforms match your search.</div>}
    </>
  );
}
