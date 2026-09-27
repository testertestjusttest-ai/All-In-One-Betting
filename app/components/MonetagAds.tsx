"use client";

import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

type AdSettings = {
  enabled: boolean;
  multitag_code: string | null;
  vignette_code: string | null;
  in_page_push_code: string | null;
  tag_code_a: string | null;
  tag_code_b: string | null;
};

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

export default function MonetagAds() {
  useEffect(() => {
    let cancelled = false;
    supabase
      .from("betbass_ad_settings")
      .select("enabled,multitag_code,vignette_code,in_page_push_code,tag_code_a,tag_code_b")
      .eq("provider", "monetag")
      .eq("enabled", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return;
        const codes = [
          data.multitag_code,
          data.vignette_code,
          data.in_page_push_code,
          data.tag_code_a,
          data.tag_code_b
        ].filter((x): x is string => Boolean(x?.trim()));
        codes.forEach(runScriptCode);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div aria-label="Sponsored content" className="mx-auto max-w-7xl px-6 pt-4">
      <div className="mb-2 text-center text-[10px] uppercase tracking-[0.2em] text-white/25">Sponsored</div>
    </div>
  );
}
