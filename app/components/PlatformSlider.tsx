"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Casino = {
  slug?: string | null;
  name?: string | null;
  category?: string | null;
  website_url?: string | null;
  logo_url?: string | null;
};

function logoFallback(name: string) {
  return String(name || "B").trim().slice(0, 1).toUpperCase();
}

export default function PlatformSlider({ casinos }: { casinos: Casino[] }) {
  const items = useMemo(() => casinos.filter(Boolean).slice(0, 12), [casinos]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current - 1 + items.length) % items.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [paused, items.length]);

  if (!items.length) return null;

  const visible = Array.from({ length: Math.min(6, items.length) }, (_, offset) => {
    return items[(index + offset) % items.length];
  });

  const move = (direction: number) => {
    setIndex((current) => (current + direction + items.length) % items.length);
  };

  return (
    <section
      className="platform-slider"
      aria-label="Top casinos and betting platforms"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
        setPaused(true);
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        const end = event.changedTouches[0]?.clientX ?? start ?? 0;
        if (start !== null && Math.abs(end - start) > 40) {
          move(end > start ? -1 : 1);
        }
        touchStart.current = null;
        setPaused(false);
      }}
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
        <button className="platform-slider-arrow platform-slider-prev" onClick={() => move(-1)} aria-label="Previous platforms">‹</button>
        <div className="platform-slider-track">
          {visible.map((casino, position) => {
            const name = casino.name || "BetBass";
            const initial = logoFallback(name);
            return (
              <a
                key={String(casino.slug || name) + "-" + position}
                href={casino.slug ? "/casinos/" + casino.slug : "#directory"}
                className={"platform-slide-card" + (position === 0 ? " is-active" : "")}
              >
                <span className="platform-slide-logo">
                  {casino.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={casino.logo_url} alt="" loading="lazy" />
                  ) : (
                    initial
                  )}
                </span>
                <span className="platform-slide-name">{name}</span>
                <small>{casino.category || "Platform"}</small>
              </a>
            );
          })}
        </div>
        <button className="platform-slider-arrow platform-slider-next" onClick={() => move(1)} aria-label="Next platforms">›</button>
      </div>

      <div className="platform-slider-dots" aria-label="Slider position">
        {items.slice(0, Math.min(items.length, 6)).map((_, dot) => (
          <button
            key={dot}
            className={dot === index % Math.min(items.length, 6) ? "active" : ""}
            onClick={() => setIndex(dot)}
            aria-label={"Show platform group " + (dot + 1)}
          />
        ))}
      </div>
    </section>
  );
}
