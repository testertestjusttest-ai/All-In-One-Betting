"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type Click = { id: number; casino_id: string; path: string | null; referrer: string | null; created_at: string };
type Casino = { id: string; name: string };

export default function AdminAnalytics() {
  const [clicks, setClicks] = useState<Click[]>([]);
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const since = new Date(Date.now() - days * 86400000).toISOString();
      const [clicksResult, casinosResult] = await Promise.all([
        supabase.from("betbass_clicks").select("id,casino_id,path,referrer,created_at").gte("created_at", since).order("created_at", { ascending: false }).limit(1000),
        supabase.from("betbass_casinos").select("id,name")
      ]);
      if (!mounted) return;
      if (!clicksResult.error) setClicks(clicksResult.data ?? []);
      if (!casinosResult.error) setCasinos(casinosResult.data ?? []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [days]);

  const nameById = useMemo(() => new Map(casinos.map(c => [c.id, c.name])), [casinos]);
  const grouped = useMemo(() => {
    const map = new Map<string, number>();
    for (const click of clicks) map.set(click.casino_id, (map.get(click.casino_id) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [clicks]);

  return (
    <section className="glass mt-6 rounded-3xl p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[.2em] text-emerald-300">CLICK ANALYTICS</p>
          <h2 className="mt-1 text-2xl font-bold">Affiliate performance</h2>
          <p className="mt-1 text-sm text-white/40">Tracked outbound clicks from the public directory.</p>
        </div>
        <select value={days} onChange={e => setDays(Number(e.target.value))} className="rounded-xl border border-white/10 bg-[#101024] px-3 py-2.5 text-sm">
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>
      {loading ? <p className="mt-5 text-sm text-white/40">Loading analytics…</p> : (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><p className="text-xs text-white/35">Outbound clicks</p><p className="mt-1 text-2xl font-black">{clicks.length}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><p className="text-xs text-white/35">Platforms clicked</p><p className="mt-1 text-2xl font-black">{grouped.length}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><p className="text-xs text-white/35">Avg. clicks/platform</p><p className="mt-1 text-2xl font-black">{grouped.length ? (clicks.length / grouped.length).toFixed(1) : "0.0"}</p></div>
          </div>
          <div className="mt-5 space-y-2">
            {grouped.slice(0, 10).map(([id, count]) => (
              <div key={id} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[.025] px-4 py-3">
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{nameById.get(id) ?? "Unknown platform"}</span>
                <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-bold text-white/60">{count} clicks</span>
              </div>
            ))}
            {!grouped.length && <p className="rounded-2xl border border-white/8 bg-white/[.025] p-5 text-sm text-white/40">No outbound clicks in this period yet.</p>}
          </div>
        </>
      )}
    </section>
  );
}
