"use client";

import { useMemo, useState } from "react";

type Casino = {
  slug?: string;
  name?: string;
  category?: string;
  logo_url?: string | null;
  website_url?: string | null;
};

function platformLogo(casino: Casino) {
  if (casino.logo_url) return casino.logo_url;
  if (casino.website_url) {
    try {
      const host = new URL(casino.website_url).hostname.replace(/^www\./, "");
      return "https://www.google.com/s2/favicons?domain=" + encodeURIComponent(host) + "&sz=128";
    } catch {}
  }
  return "";
}

export default function PlatformSlider({ casinos }: { casinos: Casino[] }) {
  const items = useMemo(() => casinos.filter(Boolean).slice(0, 12), [casinos]);
  const [paused, setPaused] = useState(false);

  if (!items.length) return null;

  const loop = [...items, ...items];

  return (
    <section
      className={"platform-slider" + (paused ? " is-paused" : "")}
      aria-label="Top betting and casino platforms"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="platform-slider-head">
        <div className="platform-slider-title">
          <span className="platform-flame" aria-hidden="true">✦</span>
          <div>
            <p className="section-kicker">TOP PLATFORMS</p>
            <strong>Casinos &amp; betting sites</strong>
          </div>
        </div>
        <a href="#directory">View all <span>→</span></a>
      </div>

      <div className="platform-slider-window">
        <div className="platform-slider-track">
          {loop.map((casino, index) => (
            <a
              key={(casino.slug || casino.name || "platform") + "-" + index}
              href={casino.slug ? "/casinos/" + casino.slug : "#directory"}
              className="platform-slide-card"
              aria-label={"Open " + (casino.name || "platform")}
            >
              <span className="platform-slide-logo">
                {platformLogo(casino) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={platformLogo(casino)} alt="" loading="lazy" referrerPolicy="no-referrer" />
                ) : (
                  <span>{String(casino.name || "B").slice(0, 2).toUpperCase()}</span>
                )}
              </span>
              <span className="platform-slide-name">{casino.name || "Platform"}</span>
              <small>{casino.category || "Betting & casino"}</small>
            </a>
          ))}
        </div>
      </div>

      <div className="platform-slider-dots" aria-hidden="true">
        <i className="active" /><i /><i /><i /><i />
      </div>
    </section>
  );
}
