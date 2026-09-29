"use client";

import { useEffect, useMemo, useState } from "react";
type Casino = { slug?: string; name?: string; category?: string; logo_url?: string | null };

export default function PlatformSlider({ casinos }: { casinos: Casino[] }) {
  const items = useMemo(() => casinos.slice(0, 12), [casinos]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!items.length || paused) return;
    const timer = window.setInterval(() => setActive((v) => (v + 1) % items.length), 2600);
    return () => window.clearInterval(timer);
  }, [items.length, paused]);
  if (!items.length) return null;
  return (
    <section className="platform-slider" aria-label="Top betting and casino platforms" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)}>
      <div className="platform-slider-head">
        <div className="platform-slider-title"><span className="platform-fire">✦</span><div><p className="section-kicker">PLATFORM DIRECTORY</p><strong>Top casinos &amp; platforms</strong></div></div>
        <a href="#directory">View all <span>→</span></a>
      </div>
      <div className="platform-viewport" dir="ltr">
        <div className="platform-track" style={{ transform: `translateX(${-active * 176}px)` }}>
          {items.map((casino, index) => (
            <a key={casino.slug || `${casino.name}-${index}`} href={casino.slug ? `/casinos/${casino.slug}` : "#directory"} className="platform-slide-card">
              <span className="platform-logo-box">{casino.logo_url ? <img src={casino.logo_url} alt="" loading="lazy" /> : <span>{String(casino.name || "B").slice(0, 1).toUpperCase()}</span>}</span>
              <span className="platform-slide-name">{casino.name || "Platform"}</span>
              <span className="platform-slide-meta">{casino.category || "Betting & casino"}</span><span className="platform-slide-arrow">↗</span>
            </a>
          ))}
        </div>
      </div>
      <div className="platform-slider-controls">
        <button type="button" aria-label="Previous platform" onClick={() => setActive((v) => (v - 1 + items.length) % items.length)}>←</button>
        <div className="platform-dots" aria-hidden="true">{items.slice(0, Math.min(items.length, 6)).map((_, i) => <span key={i} className={i === active % 6 ? "active" : ""} />)}</div>
        <button type="button" aria-label="Next platform" onClick={() => setActive((v) => (v + 1) % items.length)}>→</button>
      </div>
    </section>
  );
}