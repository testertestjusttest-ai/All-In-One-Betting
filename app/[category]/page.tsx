import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";
import MonetagAds from "../components/MonetagAds";

const siteUrl = "https://betbass.vercel.app";

const configs = {
  "betting-sites": {
    title: "Betting Sites — Compare Sports Betting Platforms | BetBass",
    description: "Explore betting sites and sportsbook platforms on BetBass. Compare platform type, offers, payment information and listed country availability.",
    heading: "Betting Sites",
    intro: "Explore betting sites and sportsbook platforms in one searchable directory. Compare the information published for each platform before visiting an operator.",
    filter: (c:any) => c.operator_type === "sportsbook" || c.operator_type === "both"
  },
  "online-casinos": {
    title: "Online Casinos — Compare Casino Platforms | BetBass",
    description: "Explore online casino platforms on BetBass. Compare casino offers, payment information, licensing details and listed market availability.",
    heading: "Online Casinos",
    intro: "Browse online casino platforms and compare the information available for each operator, including offers, payments, licensing and market coverage.",
    filter: (c:any) => c.operator_type === "casino" || c.operator_type === "both"
  },
  sportsbooks: {
    title: "Sportsbooks — Compare Sports Betting Platforms | BetBass",
    description: "Compare sportsbook platforms on BetBass, including platform details, offers, payment information and country availability.",
    heading: "Sportsbooks",
    intro: "Compare sportsbook platforms using the details maintained in the BetBass directory. Always verify current eligibility and operator terms.",
    filter: (c:any) => c.operator_type === "sportsbook" || c.operator_type === "both"
  },
  "casino-bonuses": {
    title: "Casino Bonuses — Compare Online Casino Offers | BetBass",
    description: "Find online casino platforms with listed bonus information on BetBass. Compare published offers and platform details.",
    heading: "Casino Bonuses",
    intro: "Find casino platforms with bonus information currently listed in the BetBass directory. Offers can change, so confirm current terms before participating.",
    filter: (c:any) => (c.operator_type === "casino" || c.operator_type === "both") && (c.bonus_text || c.bonus_percent != null)
  },
  "betting-bonuses": {
    title: "Betting Bonuses — Compare Sportsbook Offers | BetBass",
    description: "Find sportsbook platforms with listed bonus information on BetBass and compare their published offer details.",
    heading: "Betting Bonuses",
    intro: "Browse sportsbook platforms with listed bonus information. Use each platform profile to review the available details and current terms.",
    filter: (c:any) => (c.operator_type === "sportsbook" || c.operator_type === "both") && (c.bonus_text || c.bonus_percent != null)
  },
  "bangladesh-betting-sites": {
    title: "Bangladesh Betting Sites — Listed Platforms | BetBass",
    description: "Explore betting and sportsbook platforms marked for Bangladesh in the BetBass directory and review their listed availability and offers.",
    heading: "Bangladesh Betting Sites",
    intro: "Explore platforms marked by the BetBass administrator for Bangladesh. Country availability can change and must be confirmed with the operator.",
    filter: (c:any) => Boolean(c.bangladesh_priority) || (Array.isArray(c.countries) && c.countries.some((x:string) => /bangladesh|\bbd\b/i.test(x)))
  }
} as const;