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

const SLIDER_SPEED = 0.010; // px/ms = 10px/sec

export default function PlatformSlider({ casinos }: { casinos: Casino[] }) {
  const items = casinos;
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const lastTimeRef = useRef(0);
  const halfWidthRef = useRef(0);
  const [dragging, setDragging] = useState(false);
  const dragX = useRef(0);

  const loopItems = [...items, ...items];

  const normalizeOffset = () => {
    const half = halfWidthRef.current;
    if (half <= 0) return;
    let next = offsetRef.current % half;
    if (next < 0) next += half;
    offsetRef.current = next;
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length < 2) return;

    const measure = () => {
      halfWidthRef.current = track.scrollWidth / 2;
      normalizeOffset();
      track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
    };

    measure();
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    resizeObserver?.observe(track);

    let frame = 0;
    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - lastTimeRef.current, 40);
      lastTimeRef.current = now;

      if (!dragging) {
        offsetRef.current += dt * SLIDER_SPEED;
        normalizeOffset();
        track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
    };
  }, [dragging, items.length]);

  if (!items.length) return null;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    dragX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const dx = event.clientX - dragX.current;
    dragX.current = event.clientX;
    offsetRef.current -= dx;
    normalizeOffset();

    const track = trackRef.current;
    if (track) track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const moveBy = (direction: number) => {
    offsetRef.current -= direction * 190;
    normalizeOffset();
    const track = trackRef.current;
    if (track) track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
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
        aria-label="Swipe or drag to browse platforms"
      >
        <div ref={trackRef} className="platform-track">
          {loopItems.map((casino, index) => {
            const logoUrl = casinoLogoUrl(casino);
            const href = casino.slug ? "/casinos/" + casino.slug : "#directory";
            return (
              <a
                key={(casino.slug || casino.name || "platform") + "-" + index}
                href={href}
                className="platform-slide-card"
                aria-label={"Open " + (casino.name || "platform") + " profile"}
                onClick={(event) => {
                  if (dragging) event.preventDefault();
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
