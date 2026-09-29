"use client";

type Casino = { slug?: string; name?: string; category?: string; logo_url?: string | null };

export default function PlatformSlider({ casinos }: { casinos: Casino[] }) {
  const items = casinos.slice(0, 10);
  if (!items.length) return null;
  const loop = [...items, ...items];

  return (
    <section className="platform-rtl" aria-label="BetBass platform slider">
      <div className="platform-rtl-head">
        <div>
          <p className="section-kicker">PLATFORMS</p>
          <strong>Explore available platforms</strong>
        </div>
        <a href="#directory">View all <span>→</span></a>
      </div>
      <div className="platform-rtl-window">
        <div className="platform-rtl-track">
          {loop.map((casino, index) => (
            <a key={casino.slug + "-" + index} href={casino.slug ? "/casinos/" + casino.slug : "#directory"} className="platform-rtl-card" aria-label={"Open " + (casino.name || "platform")}>
              <span className="platform-rtl-logo">
                {casino.logo_url ? <img src={casino.logo_url} alt="" loading="lazy" /> : <span>{String(casino.name || "B").slice(0, 1).toUpperCase()}</span>}
              </span>
              <span className="platform-rtl-copy">
                <strong>{casino.name || "Platform"}</strong>
                <small>{casino.category || "Betting & casino"}</small>
              </span>
              <b>↗</b>
            </a>
          ))}
        </div>
      </div>
      <div className="platform-rtl-dots" aria-hidden="true"><span className="active" /><span /><span /><span /><span /></div>
    </section>
  );
}
