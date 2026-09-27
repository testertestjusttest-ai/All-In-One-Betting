"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PWAInstall() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) setInstalled(true);

    const handler = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const installedHandler = () => {
      setInstalled(true);
      setInstallEvent(null);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  if (installed) return null;

  async function install() {
    if (installEvent) {
      await installEvent.prompt();
      await installEvent.userChoice;
      setInstallEvent(null);
      return;
    }
    setShowHelp((value) => !value);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-r from-violet-500/10 via-white/[.03] to-cyan-400/10 p-5 shadow-xl shadow-violet-950/20 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-200/70">BetBass App</p>
            <h2 className="mt-1 text-xl font-black text-white">Install BetBass on your phone</h2>
            <p className="mt-1 text-sm leading-6 text-white/45">Add BetBass to your home screen for a faster app-like experience.</p>
          </div>
          <button type="button" onClick={install} className="shrink-0 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-black shadow-lg transition hover:-translate-y-0.5 hover:bg-white/90">
            {installEvent ? "Install App" : "Add to Home Screen"}
          </button>
        </div>
        {showHelp && !installEvent && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-6 text-white/55">
            <strong className="text-white">Android / Chrome:</strong> open the browser menu and choose <span className="text-white">Install app</span> or <span className="text-white">Add to Home screen</span>.
            <br />
            <strong className="text-white">iPhone / iPad:</strong> tap <span className="text-white">Share</span> in Safari, then choose <span className="text-white">Add to Home Screen</span>.
          </div>
        )}
      </div>
    </div>
  );
}
