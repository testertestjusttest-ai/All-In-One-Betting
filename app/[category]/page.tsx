import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";

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

type Category = keyof typeof configs;

export function generateStaticParams() {
  return Object.keys(configs).map(category => ({ category }));
}

export async function generateMetadata({params}:{params:Promise<{category:string}>}):Promise<Metadata>{
  const {category}=await params;
  const config=configs[category as Category];
  if(!config) return { title:"Category not found", robots:{index:false,follow:false} };
  return { title:config.title, description:config.description, alternates:{canonical:"/"+category}, openGraph:{title:config.title,description:config.description,url:siteUrl+"/"+category,type:"website",siteName:"BetBass"} };
}

export default async function CategoryPage({params}:{params:Promise<{category:string}>}){
  const {category}=await params;
  const config=configs[category as Category];
  if(!config) notFound();
  const {data}=await supabase.from("betbass_casinos").select("*").eq("active",true).order("priority",{ascending:true}).order("featured",{ascending:false}).order("name");
  const casinos=(data??[]).filter(config.filter).slice(0,120);
  const itemList=casinos.map((c:any,i:number)=>({"@type":"ListItem",position:i+1,name:c.name,url:siteUrl+"/casinos/"+c.slug}));
  const jsonLd={"@context":"https://schema.org","@type":"CollectionPage",name:config.heading,description:config.description,url:siteUrl+"/"+category,mainEntity:{"@type":"ItemList",numberOfItems:itemList.length,itemList}};
  return <main className="min-h-screen px-6 py-10"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/><div className="mx-auto max-w-6xl"><a href="/" className="text-sm text-white/45 hover:text-white">← Back to BetBass</a><header className="mt-10 max-w-4xl"><p className="text-sm font-semibold text-violet-300">BETBASS DIRECTORY</p><h1 className="mt-3 text-4xl font-black md:text-6xl">{config.heading}</h1><p className="mt-5 text-lg leading-8 text-white/55">{config.intro}</p></header><nav className="mt-8 flex flex-wrap gap-2">{Object.keys(configs).filter(x=>x!==category).map(x=><a key={x} href={"/"+x} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60 hover:text-white">{configs[x as Category].heading}</a>)}</nav><section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{casinos.map((c:any)=><article key={c.id} className="glass rounded-3xl p-5"><h2 className="text-xl font-bold">{c.name}</h2><p className="mt-2 text-sm leading-6 text-white/50">{c.short_description||c.name+" platform information, offers and availability."}</p>{(c.bonus_text||c.bonus_percent!=null)&&<p className="mt-4 rounded-xl bg-white/5 p-3 text-sm font-semibold">{c.bonus_percent!=null?c.bonus_percent+"% "+(c.bonus_type||"welcome")+" bonus":c.bonus_text}</p>}<a href={"/casinos/"+c.slug} className="mt-4 inline-block text-sm font-bold text-violet-300 hover:text-white">View {c.name} details →</a></article>)}</section>{!casinos.length&&<div className="glass mt-8 rounded-3xl p-10 text-center text-white/50">No matching platforms are currently listed in this category.</div>}<p className="mt-10 text-center text-xs leading-6 text-white/30">BetBass is a comparison and affiliate directory. Listings, offers, licensing information and country availability can change. Verify current terms with the operator.</p></div></main>;
}
