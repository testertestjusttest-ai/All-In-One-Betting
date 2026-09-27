"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Placement = "top" | "inline" | "bottom" | "sidebar";

function runScriptCode(code: string) {
  const box = document.createElement("div");
  box.innerHTML = code;
  box.querySelectorAll("script").forEach((oldScript) => {
    const script = document.createElement("script");
    for (const attr of Array.from(oldScript.attributes)) script.setAttribute(attr.name, oldScript.getAttribute(attr.name) ?? "");
    script.text = oldScript.textContent ?? "";
    document.body.appendChild(script);
  });
}

export default function MonetagAds({ placement = "inline" }: { placement?: Placement }) {
  const FALLBACK_DIRECT_LINK = "https://omg10.com/4/11907049";
  const [directLink, setDirectLink] = useState(FALLBACK_DIRECT_LINK);
  const [directEnabled, setDirectEnabled] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase.from("betbass_ad_settings")
      .select("enabled,multitag_code,vignette_code,in_page_push_code,tag_code_a,tag_code_b,direct_link,multitag_enabled,vignette_enabled,in_page_push_enabled,tag_a_enabled,tag_b_enabled,direct_link_enabled")
      .eq("provider", "monetag").eq("enabled", true).order("updated_at", { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (data) {
          setDirectLink(typeof data.direct_link === "string" && data.direct_link.trim() ? data.direct_link.trim() : FALLBACK_DIRECT_LINK);
          setDirectEnabled(Boolean(data.direct_link_enabled) || Boolean(data.direct_link));
          const codes = [
            [data.multitag_enabled, data.multitag_code],
            [data.vignette_enabled, data.vignette_code],
            [data.in_page_push_enabled, data.in_page_push_code],
            [data.tag_a_enabled, data.tag_code_a],
            [data.tag_b_enabled, data.tag_code_b],
          ];
          codes.filter(([on, code]) => on && typeof code === "string" && code.trim())
            .forEach(([, code]) => runScriptCode(code as string));
        }
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) {
          setDirectLink(FALLBACK_DIRECT_LINK);
          setDirectEnabled(true);
          setLoaded(true);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const title = placement === "top" ? "Sponsored" : "Advertisement";

  return (
    <aside aria-label={title} className="mx-auto w-full max-w-7xl px-6 py-4">
      <div className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#11102b] via-[#0c0c20] to-[#091b28] p-1 shadow-xl shadow-violet-950/20">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative rounded-[1.35rem] border border-white/8 bg-black/10 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full border border-violet-300/15 bg-violet-500/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-violet-200/70">
              {title}
            </span>
            <span className="text-[9px] uppercase tracking-[0.18em] text-white/25">Paid placement</span>
          </div>

          {directEnabled && directLink ? (
            <a
              href={directLink}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="mt-3 block rounded-2xl border border-white/8 bg-white/[.035] p-4 transition hover:-translate-y-0.5 hover:bg-white/[.06] hover:border-violet-300/20"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-300/15 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-xl font-black text-violet-100 shadow-lg shadow-violet-950/20 sm:h-16 sm:w-16">
                  AD
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-200/65">Sponsored offer</p>
                  <h3 className="mt-1 line-clamp-2 text-base font-black text-white sm:text-lg">Explore this promoted offer</h3>
                  <p className="mt-1 text-[11px] text-white/35">External advertisement · Sponsored link</p>
                </div>
                <span className="hidden shrink-0 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-black sm:inline-block">Visit offer →</span>
              </div>
              <span className="mt-3 block rounded-xl bg-white px-4 py-2.5 text-center text-xs font-black text-black sm:hidden">Visit offer →</span>
            </a>
          ) : (
            <div className="mt-3 flex min-h-[84px] items-center justify-center rounded-2xl border border-white/8 bg-white/[.025] px-4 text-center text-[11px] text-white/25">
              {loaded ? "Advertisement placement" : "Loading advertisement…"}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
