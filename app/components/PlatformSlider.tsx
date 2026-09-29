"use client";

import { useMemo, useState } from "react";

type Casino = {
  slug?: string;
  name?: string;
  category?: string;
  logo_url?: string | null;
};

export default function PlatformSlider({ casinos }: { casinos: Casino[] }) {
  const items = useMemo(() => casinos.slice(0, 12), [casinos]);
  const [paused, setPaused] = useState(false);
  if (!items.length) return null;
  const loopItems = [...items, ...items];

  return (
    <section className={"platform-slider" + (paused ? " is-paused" : "")} aria-label="Top betting and casino platforms"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)}>
      <div className="platform-slider-head">
        <div className="platform-slider-title">
          <span className="platform-fire" aria-hidden="true">✦</span>
          <div><p className="section-kicker">TOP CASINOS &amp; PLATFORMS</p><strong>Featured platforms</strong></div>
        </div>
        <a href="#directory">View all <span>→</span></a>
      </div>
      <div className="platform-viewport" dir="ltr">
        <div className="platform-track">
          {loopItems.map((casino, index) => (
            <a key={(casino.slug || casino.name || "platform") + "-" + index}
              href={casino.slug ? "/casinos/" + casino.slug : "#directory"} className="platform-slide-card"
              aria-label={"Open " + (casino.name || "platform")}>
              <span className="platform-logo-box">
                {casino.logo_url ? <img src={casino.logo_url} alt="" loading="lazy" /> : <span>{String(casino.name || "B").slice(0, 1).toUpperCase()}</span>}
              </span>
              <span className="platform-slide-name">{casino.name || "Platform"}</span>
              <span className="platform-slide-meta">{casino.category || "Betting & casino"}</span>
              <span className="platform-slide-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
      <div className="platform-slider-controls" aria-hidden="true">
        <span className="slider-control-arrow">‹</span>
        <div className="platform-dots">{items.slice(0, 5).map((_, index) => <span key={index} className={index === 0 ? "active" : ""} />)}</div>
        <span className="slider-control-arrow">›</span>
      </div>
    </section>
  );
}
