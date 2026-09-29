"use client";

import { useMemo, useState } from "react";

type Casino = {
  slug?: string | null;
  name?: string | null;
  category?: string | null;
  operator_type?: string | null;
  website_url?: string | null;
  logo_url?: string | null;
};

function faviconFor(casino: Casino) {
  if (casino.logo_url) return casino.logo_url;
  if (casino.website_url) {
    try {
      const domain = new URL(casino.website_url).hostname.replace(/^www\./, "");
      return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
    } catch {}
  }
  return "";
}

function initial(name?: string | null) {
  return String(name || "B").trim().slice(0, 1).toUpperCase();
}

export default function PlatformSlider({ casinos }: { casinos: Casino[] }) {
  const items = useMemo(() => casinos.filter(Boolean).slice(0, 12), [casinos]);
  const [paused, setPaused] = useState(false);

  if (!items.length) return null;

  const loop = [...items, ...items];

  return (
    <section
      className={"platform-slider" + (paused ? " is-paused" : "")}
      aria-label="Top casinos and betting platforms"
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
            <h2>Casinos & betting sites</h2>
          </div>
        </div>
        <a href="#directory">View all <span>→</span></a>
      </div>

      <div className="platform-slider-window">
        <div className="platform-slider-track" aria-live="off">
          {loop.map((casino, position) => {
            const name = casino.name || "BetBass";
            const logo = faviconFor(casino);
            return (
              <a
                key={String(casino.slug || name) + "-" + position}
                href={casino.slug ? "/casinos/" + casino.slug : "#directory"}
                className="platform-slide-card"
              >
                <span className="platform-slide-logo">
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo} alt="" loading="lazy" />
                  ) : (
                    initial(name)
                  )}
                </span>
                <span className="platform-slide-name">{name}</span>
                <small>{casino.operator_type === "both" ? "CASINO + BETTING" : String(casino.operator_type || casino.category || "PLATFORM").toUpperCase()}</small>
              </a>
            );
          })}
        </div>
      </div>

      <div className="platform-slider-dots" aria-hidden="true">
        <i className="active" /><i /><i /><i /><i />
      </div>
    </section>
  );
}
