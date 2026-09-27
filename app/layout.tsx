import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BetBass — All-in-One Betting Guide",
  description: "Compare licensed betting and casino offers, bonuses, payment methods and country availability.",
  metadataBase: new URL("https://betbass.example"),
  robots: { index: true, follow: true },
  openGraph: {
    title: "BetBass — All-in-One Betting Guide",
    description: "Compare betting and casino offers in one place.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}