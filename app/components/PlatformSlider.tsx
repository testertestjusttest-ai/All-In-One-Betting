"use client";

import { useEffect, useRef, useState } from "react";
import { casinoLogoFallbackUrl, casinoLogoUrl, initials } from "../lib/casinoLogo";

type Casino = {
  id?: string;
  slug?: string;
  name?: string;
  category?: string;
  logo_url?: string | null;
  affiliate_url?: string | null;
  website_url?: string | null;
};

export default function PlatformSlider({ casinos }: { casinos: Casino[] }) {
  // Show every platform supplied by the directory, not only the first 12.
  const items = casinos;
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
            const logoUrl = casinoLogoUrl(casino);
            const href = casino.affiliate_url || (casino.slug ? "/casinos/" + casino.slug : "#directory");
            return (
              <a
                key={(casino.slug || casino.name || "platform") + "-" + index}
                href={href}
                className="platform-slide-card"
                aria-label={"Open " + (casino.name || "platform")}
                target={casino.affiliate_url ? "_self" : undefined}
                rel={casino.affiliate_url ? "nofollow sponsored" : undefined}
                onClick={(event) => {
                  if (dragging) {
                    event.preventDefault();
                    return;
                  }
                  if (casino.affiliate_url) {
                    event.preventDefault();
                    void fetch("/api/click", {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({ casinoId: casino.id }),
                      keepalive: true,
                    }).catch(() => {});
                    window.location.href = casino.affiliate_url;
                  }
                }}
                draggable={false}
              >
                <span className="platform-logo-box">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      draggable={false}
                      onError={(e) => {
                        const fallbackUrl = casinoLogoFallbackUrl(casino);
                        if (fallbackUrl && e.currentTarget.src !== new URL(fallbackUrl, window.location.origin).href) {
                          e.currentTarget.src = fallbackUrl;
                          return;
                        }
                        e.currentTarget.style.display = "none";
                        const f = e.currentTarget.parentElement?.querySelector("[data-slider-logo-fallback]") as HTMLElement | null;
                        if (f) f.style.display = "block";
                      }}
                    />
                  ) : null}
                  <span data-slider-logo-fallback style={{ display: logoUrl ? "none" : "block" }}>
                    {initials(casino.name || "BetBass")}
                  </span>
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
          {items.map((_, index) => <span key={index} className={index === 0 ? "active" : ""} />)}
        </div>
        <button type="button" className="slider-control-arrow" onClick={() => moveBy(1)} aria-label="Move platforms right">›</button>
      </div>
    </section>
  );
}
