import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "BetBass — Global Betting & Casino Directory", template: "%s | BetBass" },
  description: "Compare betting and casino platforms, offers, payment methods and market availability.",
  metadataBase: new URL("https://betbass.vercel.app"),
  robots: { index: true, follow: true },
  openGraph: {
    title: "BetBass — Global Betting & Casino Directory",
    description: "A professional betting and casino affiliate directory.",
    type: "website",
    siteName: "BetBass"
  },
  twitter: { card: "summary_large_image", title: "BetBass", description: "Global betting and casino directory." }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="monetag" content="2fec36974dceb787f5c29afffa52ed9b" />
      </head>
      <body>{children}</body>
    </html>
  );
}
