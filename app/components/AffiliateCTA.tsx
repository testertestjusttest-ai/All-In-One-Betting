"use client";

import { useState } from "react";

export default function AffiliateCTA({
  casinoId,
  affiliateUrl,
  label,
}: {
  casinoId: string;
  affiliateUrl: string | null;
  label: string;
}) {
  const [busy, setBusy] = useState(false);

  if (!affiliateUrl) return null;

  async function go() {
    setBusy(true);
    try {
      await fetch("/api/click", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ casinoId }),
      });
    } catch {}

    if (affiliateUrl) {
      window.open(affiliateUrl, "_blank", "noopener,noreferrer");
    }
    setBusy(false);
  }

  return (
    <button
      onClick={go}
      disabled={busy}
      className="mt-6 w-full rounded-2xl bg-white px-5 py-4 text-center font-black text-black transition hover:-translate-y-0.5 hover:bg-white/90 disabled:opacity-60"
    >
      {busy ? "Opening…" : label || "Claim offer"} →
    </button>
  );
}
