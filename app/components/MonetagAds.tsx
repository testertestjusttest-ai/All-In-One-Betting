"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Placement = "top" | "inline" | "bottom" | "sidebar";

function runScriptCode(code: string) {
  const box = document.createElement("div");
  box.innerHTML = code;
  box.querySelectorAll("script").forEach((oldScript) => {
    const script = document.createElement("script");
    for (const attr of Array.from(oldScript.attributes)) script.setAttribute(attr.name, attr.value);
    script.text = oldScript.textContent ?? "";
    document.body.appendChild(script);
  });
}

export default function MonetagAds({ placement = "inline" }: { placement?: Placement }) {
  const [directLink, setDirectLink] = useState("");
  const [directEnabled, setDirectEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase.from("betbass_ad_settings")
      .select("enabled,multitag_code,vignette_code,in_page_push_code,tag_code_a,tag_code_b,direct_link,multitag_enabled,vignette_enabled,in_page_push_enabled,tag_a_enabled,tag_b_enabled,direct_link_enabled")
      .eq("provider", "monetag").eq("enabled", true).order("updated_at", { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return;
        setDirectLink(typeof data.direct_link === "string" ? data.direct_link : "");
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
      });
    return () => { cancelled = true; };
  }, []);

  const title = placement === "top" ? "Sponsored" : "Advertisement";
  return (
    <aside aria-label={title} className="mx-auto max-w-7xl px-6 py-5">
      <div className="rounded-2xl border border-white/8 bg-white/[.025] p-3">
        <div className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-white/25">{title}</div>
        {directEnabled && directLink ? (
          <a href={directLink} target="_blank" rel="nofollow sponsored noopener noreferrer"
            className="block min-h-[74px] rounded-xl border border-violet-400/15 bg-gradient-to-r from-violet-500/10 via-white/[.03] to-blue-500/10 px-5 py-4 text-center transition hover:border-violet-300/30">
            <span className="text-xs text-white/35">Sponsored offer</span>
            <span className="mt-1 block text-sm font-bold text-white/80">Explore this promoted offer →</span>
          </a>
        ) : (
          <div className="flex min-h-[56px] items-center justify-center rounded-xl bg-black/10 text-[11px] text-white/20">
            Sponsored placement
          </div>
        )}
      </div>
    </aside>
  );
}
