"use client";

import { useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";

type Placement = "top" | "inline" | "bottom" | "sidebar";

let monetagLoaderPromise: Promise<void> | null = null;

function appendScriptToHead(code: string) {
  const template = document.createElement("template");
  template.innerHTML = code.trim();

  template.content.querySelectorAll("script").forEach((source) => {
    const script = document.createElement("script");

    for (const attr of Array.from(source.attributes)) {
      const value = source.getAttribute(attr.name);
      if (value !== null) script.setAttribute(attr.name, value);
    }

    script.text = source.textContent ?? "";
    document.head.appendChild(script);
  });
}

function loadMonetagOnce() {
  if (monetagLoaderPromise) return monetagLoaderPromise;

  monetagLoaderPromise = Promise.resolve(
    supabase
      .from("betbass_ad_settings")
      .select(
        "enabled,multitag_code,vignette_code,in_page_push_code,tag_code_a,tag_code_b,multitag_enabled,vignette_enabled,in_page_push_enabled,tag_a_enabled,tag_b_enabled",
      )
      .eq("provider", "monetag")
      .eq("enabled", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ).then(({ data }) => {
    if (!data) return;

    // Monetag channel tags are document-level integrations. They should be
    // loaded in <head>, not copied into arbitrary ad-card containers.
    const codes = [
      [data.multitag_enabled, data.multitag_code],
      [data.vignette_enabled, data.vignette_code],
      [data.in_page_push_enabled, data.in_page_push_code],
      [data.tag_a_enabled, data.tag_code_a],
      [data.tag_b_enabled, data.tag_code_b],
    ];

    codes
      .filter(([enabled, code]) => enabled && typeof code === "string" && code.trim())
      .forEach(([, code]) => appendScriptToHead(code as string));
  }).catch(() => undefined);

  return monetagLoaderPromise;
}

export default function MonetagAds({ placement = "inline" }: { placement?: Placement }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    void loadMonetagOnce();
  }, []);

  // These Monetag formats are not HTML banner widgets that can reliably be
  // rendered inside this div. IPP/Vignette are injected by Monetag according
  // to the zone's placement rules (typically top/right or an overlay).
  // Keep the page free of fake "ad loading" cards.
  const label = placement === "top" ? "Sponsored" : "Advertisement";

  return (
    <aside aria-label={label} className="mx-auto w-full max-w-7xl px-2 py-3 sm:px-6">
      <div className="flex items-center justify-center">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
          {label}
        </span>
      </div>
    </aside>
  );
}
