"use client";

import { useEffect, useMemo, useState } from "react";
import type { Casino } from "../../lib/supabase";

function logoFor(casino: Casino) {
  if (casino.logo_url) return casino.logo_url;
  if (casino.website_url) {
    try {
      const domain = new URL(casino.website_url).hostname.replace(/^www\./, "");
      return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
    } catch {}
  }
  return null;
}

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map(x => x[0]).join("").toUpperCase();
}

export default function PlatformCarousel({ casinos }: { casinos: Casino[] }) {
  const items = useMemo(() => casinos.slice(0, 12), [casinos]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const timer = window.setInterval(() => {
      setActive(current => (current + 1) % items.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [paused, items.length]);

  if (!items.length) return null;

  const visible = Array.from({ length: Math.min(5, items.length) }, (_, offset) => items[(active + offset) % items.length]);

  function move(step: number) {
    setActive(current => (current + step + items.length) % items.length);
  }

  return (
    <section
      className="platform-carousel mx-auto max-w-7xl px-5 sm:px-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Featured betting and casino platforms"
    >
      <div className="platform-carousel-head">
        <div className="platform-carousel-title"><span className="carousel-flame">✦</span><div><p className="section-kicker">TOP PLATFORMS</p><strong>Featured casinos & betting sites</strong></div></div>
        <a href="#directory">View all <span>→</span></a>
      </div>

      <div className="platform-carousel-stage" dir="ltr">
        <button type="button" className="carousel-arrow carousel-prev" onClick={() => move(-1)} aria-label="Previous platform">‹</button>
        <div className="platform-carousel-track">
          {visible.map((casino, index) => {
            const logo = logoFor(casino);
            return (
              <a
                key={casino.id + "-" + index}
                href={"/casinos/" + casino.slug}
                className="platform-slide-card"
                aria-label={"Open " + casino.name}
              >
                <div className="platform-slide-logo">
                  {logo ? (
                    <img src={logo} alt="" loading="lazy" referrerPolicy="no-referrer" onError={e => { e.currentTarget.style.display = "none"; }} />
                  ) : (
                    <span>{initials(casino.name)}</span>
                  )}
                </div>
                <div className="platform-slide-name">{casino.name}</div>
                <div className="platform-slide-type">{casino.operator_type === "both" ? "Casino + Sportsbook" : casino.operator_type}</div>
              </a>
            );
          })}
        </div>
        <button type="button" className="carousel-arrow carousel-next" onClick={() => move(1)} aria-label="Next platform">›</button>
      </div>

      <div className="carousel-dots" aria-label="Carousel pages">
        {items.slice(0, Math.min(items.length, 6)).map((_, index) => (
          <button key={index} type="button" onClick={() => setActive(index)} className={index === active % Math.min(items.length, 6) ? "active" : ""} aria-label={"Go to platform " + (index + 1)} />
        ))}
      </div>
    </section>
  );
}
