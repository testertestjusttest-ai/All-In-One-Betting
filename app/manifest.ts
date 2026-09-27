import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BetBass",
    short_name: "BetBass",
    description: "Global betting and casino affiliate directory.",
    start_url: "/",
    display: "standalone",
    background_color: "#070714",
    theme_color: "#070714",
    icons: []
  };
}
