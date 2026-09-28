import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BetBass — Betting & Casino Comparison Directory",
    short_name: "BetBass",
    description: "Compare betting sites, online casinos and sportsbook platforms.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#070714",
    theme_color: "#070714",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" }]
  };
}
