"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Casino } from "../../lib/supabase";
import { casinoLogoFallbackUrl, casinoLogoUrl, initials } from "../lib/casinoLogo";

type OfferCasino = Casino & {
  bonus_percent?: number | null;
  bonus_type?: string | null;
  currency?: string | null;
  claim_label?: string | null;
  priority?: number;
  bangladesh_priority?: boolean;
  public_rating?: number;
  deposit_methods?: string[];
  withdrawal_methods?: string[];
};

function dataCompleteness(casino: OfferCasino) {
  const checks = [
    Boolean(casino.logo_url || casino.website_url),
    Boolean(casino.short_description),
    Boolean(casino.bonus_text || casino.bonus_percent != null),
    Boolean(casino.payment_methods?.length || casino.deposit_methods?.length || casino.withdrawal_methods?.length),
    Boolean(casino.countries?.length),
    Boolean(casino.license_text),
    Boolean(casino.verified_at)
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
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
  const [payment, setPayment] = useState("all");
  const [compare, setCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const filtered = useMemo(
    () =>
      sortCasinos(casinos as OfferCasino[]).filter(c => {
        const hay = [c.name, c.short_description, c.bonus_text, c.bonus_type ?? "", ...c.tags].join(" ").toLowerCase();
        const paymentHay = [...(c.payment_methods ?? []), ...(c.deposit_methods ?? []), ...(c.withdrawal_methods ?? [])].join(" ").toLowerCase();
        return hay.includes(query.toLowerCase()) && (type === "all" || c.operator_type === type || c.operator_type === "both") && (payment === "all" || paymentHay.includes(payment));
      }),
    [casinos, query, type, payment]
  );

  const compareItems = useMemo(() => filtered.filter(item => compare.includes(item.id)), [filtered, compare]);

  function toggleCompare(id: string) {
    setCompare(current => current.includes(id) ? current.filter(x => x !== id) : current.length < 3 ? [...current, id] : current);
  }

  function openProfile(casino: Casino) {
    window.location.href = casino.slug ? `/casinos/${casino.slug}` : "#directory";
  }

  async function trackAffiliateAndOpen(casino: Casino) {
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
          <p className="mt-2 text-white/45">Search, filter and compare platforms by the information currently listed on BetBass.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:min-w-[36rem]">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search platforms..." className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30 focus:border-violet-400/40 sm:w-64" />
          <select value={type} onChange={e => setType(e.target.value)} className="rounded-2xl border border-white/10 bg-[#101024] px-4 py-3 outline-none"><option value="all">All types</option><option value="sportsbook">Sportsbook</option><option value="casino">Casino</option></select><select value={payment} onChange={e => setPayment(e.target.value)} className="rounded-2xl border border-white/10 bg-[#101024] px-4 py-3 outline-none"><option value="all">All payments</option><option value="bkash">bKash</option><option value="nagad">Nagad</option><option value="rocket">Rocket</option><option value="crypto">Crypto</option></select>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><p className="text-xs text-white/45">{filtered.length} platform{filtered.length === 1 ? "" : "s"} shown</p>{(query || type !== "all" || payment !== "all") && <button type="button" onClick={() => { setQuery(""); setType("all"); setPayment("all"); }} className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 hover:text-white">Clear filters</button>}</div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-2">
        {filtered.map((casino, i) => {
          const rating = Number(casino.public_rating ?? 0);
          const logoUrl = casinoLogoUrl(casino);
          const hasAffiliate = Boolean(casino.affiliate_url);
          const completeness = dataCompleteness(casino);

          return (
            <motion.article
              id={`casino-${casino.slug}`}
              key={casino.id}
              role="link"
              tabIndex={0}
              aria-label={`View ${casino.name} platform profile`}
              onClick={() => openProfile(casino)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openProfile(casino);
                }
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="glass group min-w-0 cursor-pointer rounded-2xl border border-white/10 p-3 transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-[0_20px_70px_rgba(124,58,237,.14)] sm:rounded-3xl sm:p-5"
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
                        const fallbackUrl = casinoLogoFallbackUrl(casino);
                        if (fallbackUrl && e.currentTarget.src !== new URL(fallbackUrl, window.location.origin).href) {
                          e.currentTarget.src = fallbackUrl;
                          return;
                        }
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

              <div className="mt-3"><div className="flex items-center justify-between text-[10px] text-white/35"><span>Profile data coverage</span><span>{completeness}%</span></div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-violet-400/70" style={{ width: `${completeness}%` }} /></div></div>

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

              <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4"><button type="button" onClick={e => { e.stopPropagation(); toggleCompare(casino.id); }} className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${compare.includes(casino.id) ? "border-violet-400/50 bg-violet-400/15 text-violet-200" : "border-white/10 bg-white/5 text-white/45"}`}>{compare.includes(casino.id) ? "✓ Comparing" : "＋ Compare"}</button>{casino.verified_at && <span className="text-[10px] text-emerald-300/70">✓ Listed data verified</span>}</div>

              <div className="mt-3 flex flex-wrap gap-1 sm:mt-4 sm:gap-2">
                {casino.tags.slice(0, 3).map(tag => <span key={tag} className="max-w-full truncate rounded-full border border-white/8 bg-white/4 px-2 py-1 text-[9px] text-white/50 sm:px-2.5 sm:text-[11px]">{tag}</span>)}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5">
                <button type="button" onClick={e => { e.stopPropagation(); openProfile(casino); }} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-bold text-white/75 transition hover:bg-white/10 sm:rounded-2xl sm:py-3 sm:text-sm">View profile</button>
                <button type="button" disabled={!hasAffiliate} onClick={e => { e.stopPropagation(); void trackAffiliateAndOpen(casino); }} className="rounded-xl bg-gradient-to-r from-violet-400 to-cyan-300 px-3 py-2.5 text-xs font-black text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35 sm:rounded-2xl sm:py-3 sm:text-sm">{hasAffiliate ? (casino.claim_label || "Join Now") : "No offer link"}</button>
              </div>
            </motion.article>
          );
        })}
      </div>

      {!filtered.length && <div className="glass rounded-3xl p-12 text-center text-white/50">No platforms match your search.</div>}

      {compare.length > 0 && (
        <>
          <aside className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-4xl rounded-3xl border border-violet-400/20 bg-[#101024]/95 p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-xs font-bold uppercase tracking-wider text-violet-300">Compare shortlist</p><p className="mt-1 text-sm text-white/55">{compare.length}/3 platforms selected</p></div>
              <div className="flex flex-wrap gap-2">
                {compareItems.map(x => <span key={x.id} className="rounded-full bg-white/5 px-3 py-1.5 text-xs">{x.name}</span>)}
                <button type="button" onClick={() => setCompareOpen(true)} className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black">Compare now</button>
                <button type="button" onClick={() => setCompare([])} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/50">Clear</button>
              </div>
            </div>
          </aside>
          {compareOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Compare platforms">
              <div className="mx-auto my-6 max-w-6xl rounded-[2rem] border border-white/10 bg-[#0c0c1a] p-5 shadow-2xl sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-xs font-bold uppercase tracking-wider text-violet-300">Side-by-side comparison</p><h2 className="mt-2 text-3xl font-black">Compare selected platforms</h2><p className="mt-2 text-sm text-white/45">Only information currently listed in BetBass is shown.</p></div>
                  <button type="button" onClick={() => setCompareOpen(false)} className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/60">Close</button>
                </div>
                <div className="mt-7 grid gap-4 md:grid-cols-3">
                  {compareItems.map(item => {
                    const payments = [...(item.payment_methods ?? []), ...(item.deposit_methods ?? []), ...(item.withdrawal_methods ?? [])].filter((v, idx, arr) => arr.indexOf(v) === idx);
                    return (
                      <article key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-1">{casinoLogoUrl(item) ? <img src={casinoLogoUrl(item)!} alt={`${item.name} logo`} className="h-full w-full object-contain" /> : <span className="bg-gradient-to-br from-violet-500 to-cyan-400 bg-clip-text text-base font-black text-transparent">{initials(item.name)}</span>}</div><div className="min-w-0"><h3 className="break-words font-bold">{item.name}</h3><p className="text-[10px] uppercase text-white/35">{item.operator_type === "both" ? "Sportsbook + Casino" : item.operator_type}</p></div></div>
                        <dl className="mt-5 space-y-3 text-sm">
                          <div><dt className="text-xs text-white/35">Rating</dt><dd className="mt-1 font-bold text-yellow-200">★ {Number(item.public_rating ?? 0).toFixed(1)}/5</dd></div>
                          <div><dt className="text-xs text-white/35">Offer</dt><dd className="mt-1 text-white/70">{item.bonus_text || (item.bonus_percent != null ? `${item.bonus_percent}% ${item.bonus_type ?? "welcome"} bonus` : "Not listed")}</dd></div>
                          <div><dt className="text-xs text-white/35">Payments</dt><dd className="mt-1 text-white/70">{payments.length ? payments.join(", ") : "Not listed"}</dd></div>
                          <div><dt className="text-xs text-white/35">License</dt><dd className="mt-1 text-white/70">{item.license_text || "Not listed"}</dd></div>
                          <div><dt className="text-xs text-white/35">Countries / GEO</dt><dd className="mt-1 text-white/70">{item.countries?.length ? item.countries.join(", ") : "Not listed"}</dd></div>
                        </dl>
                        {item.affiliate_url ? <button type="button" onClick={() => void trackAffiliateAndOpen(item)} className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-black">Open affiliate offer</button> : <div className="mt-6 rounded-2xl border border-white/10 px-4 py-3 text-center text-xs text-white/35">Affiliate link not configured</div>}
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
