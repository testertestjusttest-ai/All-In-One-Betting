"use client";

import { useEffect, useRef, useState } from "react";

type Casino = {
  slug?: string;
  name?: string;
  category?: string;
  logo_url?: string | null;
  affiliate_url?: string | null;
  website_url?: string | null;
};

export default function PlatformSlider({ casinos }: { casinos: Casino[] }) {
  const items = casinos.slice(0, 12);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragX = useRef(0);

  const loopItems = [...items, ...items];

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || items.length < 2) return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - last, 40);
      last = now;

      if (!paused && !dragging) {
        viewport.scrollLeft += dt * 0.045;
        const half = viewport.scrollWidth / 2;
        if (half > 0 && viewport.scrollLeft >= half) viewport.scrollLeft -= half;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, dragging, items.length]);

  if (!items.length) return null;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setPaused(true);
    setDragging(true);
    dragX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const dx = event.clientX - dragX.current;
    dragX.current = event.clientX;
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollLeft -= dx;
      const half = viewport.scrollWidth / 2;
      if (half > 0) {
        if (viewport.scrollLeft < 0) viewport.scrollLeft += half;
        if (viewport.scrollLeft >= half) viewport.scrollLeft -= half;
      }
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    setPaused(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const moveBy = (direction: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    setPaused(true);
    viewport.scrollBy({ left: direction * 190, behavior: "smooth" });
    window.setTimeout(() => setPaused(false), 500);
  };

  return (
    <section className="platform-slider" aria-label="Top betting and casino platforms">
      <div className="platform-slider-head">
        <div className="platform-slider-title">
          <span className="platform-fire" aria-hidden="true">✦</span>
          <div>
            <p className="section-kicker">TOP CASINOS &amp; PLATFORMS</p>
            <strong>Featured platforms</strong>
          </div>
        </div>
        <a href="#directory">View all <span>→</span></a>
      </div>

      <div
        ref={viewportRef}
        className={"platform-viewport" + (dragging ? " is-dragging" : "")}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          if (!dragging) setPaused(false);
        }}
        aria-label="Swipe or drag to browse platforms"
      >
        <div ref={trackRef} className="platform-track">
          {loopItems.map((casino, index) => {
            const href = casino.affiliate_url || casino.website_url || (casino.slug ? "/casinos/" + casino.slug : "#directory");
            return (
              <a
                key={(casino.slug || casino.name || "platform") + "-" + index}
                href={href}
                className="platform-slide-card"
                aria-label={"Open " + (casino.name || "platform")}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "nofollow sponsored noopener" : undefined}
                onClick={(event) => {
                  if (dragging) event.preventDefault();
                }}
                draggable={false}
              >
                <span className="platform-logo-box">
                  {casino.logo_url ? (
                    <img src={casino.logo_url} alt="" loading="lazy" draggable={false} />
                  ) : (
                    <span>{String(casino.name || "B").slice(0, 1).toUpperCase()}</span>
                  )}
                </span>
                <span className="platform-slide-name">{casino.name || "Platform"}</span>
                <span className="platform-slide-meta">{casino.category || "Betting & casino"}</span>
                <span className="platform-slide-arrow" aria-hidden="true">↗</span>
              </a>
            );
          })}
        </div>
      </div>

      <div className="platform-slider-controls">
        <button type="button" className="slider-control-arrow" onClick={() => moveBy(-1)} aria-label="Move platforms left">‹</button>
        <div className="platform-dots" aria-hidden="true">
          {items.slice(0, 5).map((_, index) => <span key={index} className={index === 0 ? "active" : ""} />)}
        </div>
        <button type="button" className="slider-control-arrow" onClick={() => moveBy(1)} aria-label="Move platforms right">›</button>
      </div>
    </section>
  );
}
