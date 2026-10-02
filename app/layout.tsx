import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SITE_URL } from "../lib/seo";
import LanguageController from "./components/LanguageController";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "BetBass — Betting & Casino Comparison Directory", template: "%s | BetBass" },
  description: "BetBass compares betting sites, online casinos, sportsbook platforms, offers, payment methods, licensing and country availability in one structured directory.",
  applicationName: "BetBass",
  category: "entertainment",
  alternates: {
    canonical: "/",
    languages: { "en-US": SITE_URL, "bn-BD": SITE_URL + "/bn", "x-default": SITE_URL },
  },
  robots: { index:true, follow:true, googleBot:{ index:true, follow:true, "max-image-preview":"large", "max-snippet":-1, "max-video-preview":-1 } },
  openGraph: { title:"BetBass — Betting & Casino Comparison Directory", description:"Compare betting sites, online casinos, sportsbook platforms, offers, payments and GEO availability.", type:"website", siteName:"BetBass", url:SITE_URL, locale:"en_US" },
  twitter: { card:"summary_large_image", title:"BetBass — Betting & Casino Comparison Directory", description:"Compare betting sites, online casinos, sportsbook platforms and offers." },
};

const organizationJsonLd = { "@context":"https://schema.org", "@type":"Organization", name:"BetBass", url:SITE_URL, description:"Betting and casino comparison and affiliate directory." };
const websiteJsonLd = { "@context":"https://schema.org", "@type":"WebSite", name:"BetBass", alternateName:["Bet Bass","BetBass betting","BetBass casino"], url:SITE_URL };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="monetag" content="2fec36974dceb787f5c29afffa52ed9b" />
        <meta name="theme-color" content="#06060d" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BetBass" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body>
        {children}
        <LanguageController />
        <PWAInstallPrompt />
        <Script id="betbass-sw-register" strategy="afterInteractive">{`
          if ("serviceWorker" in navigator) {
            window.addEventListener("load", function () {
              navigator.serviceWorker.register("/sw.js").catch(function () {});
            });
          }
        `}</Script>
      </body>
    </html>
  );
}