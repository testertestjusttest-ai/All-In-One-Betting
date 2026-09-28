"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

type Placement = "top" | "inline" | "bottom" | "sidebar";

function executeAdCode(code: string, mount: HTMLElement) {
  const template = document.createElement("template");
  template.innerHTML = code.trim();

  template.content.querySelectorAll("script").forEach((source) => {
    const script = document.createElement("script");

    for (const attr of Array.from(source.attributes)) {
      const value = source.getAttribute(attr.name);
      if (value !== null) script.setAttribute(attr.name, value);
    }

    script.text = source.textContent ?? "";
    mount.appendChild(script);
  });
}

function executeGlobalAdCode(code: string) {
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

export default function MonetagAds({ placement = "inline" }: { placement?: Placement }) {
  const [loaded, setLoaded] = useState(false);
  const [hasVisibleCode, setHasVisibleCode] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    let cancelled = false;

    Promise.resolve(
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
    )
      .then(({ data }) => {
        if (cancelled || !data || initialized.current) return;
        initialized.current = true;

        // Monetag recommends putting channel tags high in the document/head.
        // Load the global formats once per page rather than rendering fake ad cards.
        const globalCodes = [
          [data.multitag_enabled, data.multitag_code],
          [data.vignette_enabled, data.vignette_code],
          [data.tag_a_enabled, data.tag_code_a],
          [data.tag_b_enabled, data.tag_code_b],
        ];

        globalCodes
          .filter(([enabled, code]) => enabled && typeof code === "string" && code.trim())
          .forEach(([, code]) => executeGlobalAdCode(code as string));

        // In-Page Push is the format intended to appear directly on the page.
        if (
          data.in_page_push_enabled &&
          typeof data.in_page_push_code === "string" &&
          data.in_page_push_code.trim() &&
          mountRef.current
        ) {
          executeAdCode(data.in_page_push_code, mountRef.current);
          setHasVisibleCode(true);
        }

        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const title = placement === "top" ? "Sponsored" : "Advertisement";

  return (
    <aside aria-label={title} className="mx-auto w-full max-w-7xl px-2 py-4 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b18] shadow-xl shadow-black/20">
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-2.5">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
            {title}
          </span>
          <span className="text-[9px] uppercase tracking-[0.18em] text-white/20">
            Sponsored
          </span>
        </div>

        <div
          ref={mountRef}
          className="relative min-h-[90px] w-full overflow-hidden bg-white/[0.015]"
        />

        {!hasVisibleCode && (
          <div className="flex min-h-[90px] items-center justify-center px-4 text-center text-[11px] text-white/30">
            {loaded ? "Advertisement loading…" : "Loading advertisement…"}
          </div>
        )}
      </div>
    </aside>
  );
}
