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
  const [directLink, setDirectLink] = useState("");
  const [directEnabled, setDirectEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase.from("betbass_ad_settings")
      .select("enabled,multitag_code,vignette_code,in_page_push_code,tag_code_a,tag_code_b,direct_link,multitag_enabled,vignette_enabled,in_page_push_enabled,tag_a_enabled,tag_b_enabled,direct_link_enabled")
      .eq("provider", "monetag").eq("enabled", true).order("updated_at", { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (data) {
          setDirectLink(typeof data.direct_link === "string" ? data.direct_link.trim() : "");
          setDirectEnabled(Boolean(data.direct_link_enabled));
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
      });
    return () => { cancelled = true; };
  }, []);

  const title = placement === "top" ? "Sponsored" : "Advertisement";
  return (
    <aside aria-label={title} className="mx-auto w-full max-w-7xl px-6 py-4">
      <div className="overflow-hidden rounded-2xl border border-violet-400/15 bg-gradient-to-r from-violet-500/[.08] via-white/[.025] to-cyan-400/[.08] shadow-lg shadow-violet-950/10">
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">{title}</span>
          <span className="rounded-full border border-white/10 bg-black/10 px-2 py-0.5 text-[9px] text-white/30">Paid placement</span>
        </div>
        {directEnabled && directLink ? (
          <a href={directLink} target="_blank" rel="nofollow sponsored noopener noreferrer"
            className="block min-h-[92px] px-5 py-5 text-center transition hover:bg-white/[.04]">
            <span className="text-xs font-semibold text-violet-200/70">Sponsored offer</span>
            <span className="mt-1 block text-base font-black text-white sm:text-lg">Explore this promoted offer →</span>
            <span className="mt-1 block text-[11px] text-white/35">Advertisement · External offer</span>
          </a>
        ) : (
          <div className="flex min-h-[72px] items-center justify-center px-4 text-center text-[11px] text-white/25">
            {loaded ? "Advertisement placement" : "Loading advertisement…"}
          </div>
        )}
      </div>
    </aside>
  );
}
