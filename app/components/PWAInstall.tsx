"use client";

import { useEffect, useState } from "react";

export default function PWAInstall() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    const installedHandler = () => setInstalled(true);
    window.addEventListener("appinstalled", installedHandler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  if (installed || !installEvent) return null;

  return (
    <button
      type="button"
      onClick={async () => {
        await installEvent.prompt();
        await installEvent.userChoice;
        setInstallEvent(null);
      }}
      className="rounded-full border border-violet-300/30 bg-violet-500/15 px-4 py-2 text-sm font-bold text-violet-100 shadow-lg shadow-violet-950/20 transition hover:bg-violet-500/25"
    >
      Install BetBass
    </button>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}
