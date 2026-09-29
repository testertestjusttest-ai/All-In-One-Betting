import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://betbass.vercel.app").replace(/\/$/, "");

export const LOCALES = {
  en: { href: "/", label: "English", language: "en-US" },
  bn: { href: "/bn", label: "বাংলা", language: "bn-BD" },
} as const;

export const COUNTRY_NAMES: Record<string, string> = {
  BD: "Bangladesh", IN: "India", PK: "Pakistan", LK: "Sri Lanka", NP: "Nepal",
  ID: "Indonesia", MY: "Malaysia", PH: "Philippines", TH: "Thailand", VN: "Vietnam",
  NG: "Nigeria", ZA: "South Africa", KE: "Kenya", GH: "Ghana", TZ: "Tanzania",
  BR: "Brazil", MX: "Mexico", AR: "Argentina", CO: "Colombia", CL: "Chile",
  ES: "Spain", DE: "Germany", FR: "France", IT: "Italy", GB: "United Kingdom",
  AU: "Australia", NZ: "New Zealand", CA: "Canada", US: "United States",
};

export function countryName(code: string) {
  const normalized = code.toUpperCase();
  return COUNTRY_NAMES[normalized] ?? normalized;
}

export function countryPath(code: string) {
  return "/countries/" + code.toLowerCase();
}

export function siteUrl(path = "") {
  return SITE_URL + (path.startsWith("/") ? path : path ? "/" + path : "");
}

export function localizedAlternates(path = ""): Metadata["alternates"] {
  const cleanPath = path === "/" ? "" : path;
  const canonical = cleanPath || "/";
  return {
    canonical,
    languages: {
      "en-US": siteUrl(canonical),
      "bn-BD": siteUrl(cleanPath === "" ? "/bn" : "/bn" + cleanPath),
      "x-default": siteUrl(canonical),
    },
  };
}