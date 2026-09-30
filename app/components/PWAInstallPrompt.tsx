"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_KEY = "betbass-pwa-install-dismissed";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = window.localStorage.getItem(DISMISS_KEY);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (dismissed || standalone) return;

    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  if (!visible || !deferredPrompt) return null;

  return (
    <aside className="betbass-pwa-prompt" role="status" aria-label="Install BetBass">
      <div className="betbass-pwa-prompt-inner">
        <div className="betbass-pwa-icon" aria-hidden="true">B</div>
        <div className="betbass-pwa-copy">
          <strong>Install BetBass</strong>
          <span>Get faster access from your home screen.</span>
        </div>
        <button type="button" className="betbass-pwa-install" onClick={install}>
          Install
        </button>
        <button type="button" className="betbass-pwa-close" onClick={dismiss} aria-label="Close install notification">
          ×
        </button>
      </div>
    </aside>
  );
}
