import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const siteUrl = "https://betbass.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BetBass — Betting & Casino Comparison Directory",
    template: "%s | BetBass"
  },
  description: "BetBass compares betting sites, online casinos, sportsbook platforms, bonuses, payment methods, licensing and country availability in one directory.",
  keywords: [
    "BetBass", "betting sites", "online casinos", "casino comparison", "sportsbook comparison",
    "betting site comparison", "casino bonuses", "sports betting", "online betting", "casino sites",
    "betting platforms", "casino platforms"
  ],
  applicationName: "BetBass",
  category: "entertainment",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: {
    title: "BetBass — Betting & Casino Comparison Directory",
    description: "Compare betting sites, online casinos, sportsbook platforms, offers, payments and availability.",
    type: "website",
    siteName: "BetBass",
    url: siteUrl,
    locale: "en_US"
  },
  twitter: { card: "summary_large_image", title: "BetBass — Betting & Casino Comparison Directory", description: "Compare betting sites, online casinos, sportsbook platforms and offers." }
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BetBass",
  url: siteUrl,
  description: "Betting and casino comparison and affiliate directory."
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BetBass",
  alternateName: ["Bet Bass", "BetBass betting", "BetBass casino"],
  url: siteUrl
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="monetag" content="2fec36974dceb787f5c29afffa52ed9b" />
        <meta name="theme-color" content="#080812" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BetBass" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body>
        {children}
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
