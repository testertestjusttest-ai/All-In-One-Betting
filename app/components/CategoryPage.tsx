import type { Metadata } from "next";
import { supabase } from "../../lib/supabase";
import CasinoDirectory from "./CasinoDirectory";

export type CategoryKey="betting-sites"|"online-casinos"|"sportsbooks"|"casino-bonuses"|"betting-bonuses"|"bangladesh-betting-sites";
export const categoryConfig:Record<CategoryKey,{title:string;description:string;keywords:string[];filter:(c:any)=>boolean}>={
 "betting-sites":{title:"Betting Sites — Compare Platforms",description:"Browse betting site profiles, offers, payment methods and availability on BetBass.",keywords:["betting sites","betting site comparison"],filter:c=>c.operator_type==="sportsbook"||c.operator_type==="both"},
 "online-casinos":{title:"Online Casinos — Compare Casino Platforms",description:"Browse online casino profiles, offers, payment methods and availability on BetBass.",keywords:["online casinos","casino comparison"],filter:c=>c.operator_type==="casino"||c.operator_type==="both"},
 "sportsbooks":{title:"Sportsbooks — Compare Betting Platforms",description:"Browse sportsbook profiles, offers, payment methods and availability on BetBass.",keywords:["sportsbooks","sports betting"],filter:c=>c.operator_type==="sportsbook"||c.operator_type==="both"},
 "casino-bonuses":{title:"Casino Bonuses — Compare Offers",description:"Explore casino platform offers and bonus information listed on BetBass.",keywords:["casino bonuses","casino offers"],filter:c=>c.operator_type==="casino"||c.operator_type==="both"},
 "betting-bonuses":{title:"Betting Bonuses — Compare Offers",description:"Explore betting and sportsbook offers listed on BetBass.",keywords:["betting bonuses","sportsbook bonuses"],filter:c=>c.operator_type==="sportsbook"||c.operator_type==="both"},
 "bangladesh-betting-sites":{title:"Bangladesh Betting Sites — Platform Directory",description:"Browse betting and casino platforms listed for Bangladesh GEO research. Always verify current eligibility and local requirements.",keywords:["Bangladesh betting sites","Bangladesh sportsbook","Bangladesh casino"],filter:c=>Boolean(c.bangladesh_priority)||c.countries?.some((x:string)=>x.toLowerCase().includes("bangladesh"))}
};
export function categoryMetadata(category:CategoryKey):Metadata{const c=categoryConfig[category];return{title:c.title,description:c.description,keywords:c.keywords,alternates:{canonical:`/${category}`},openGraph:{title:`BetBass — ${c.title}`,description:c.description,url:`/${category}`,type:"website"}}}
export async function renderCategory(category:CategoryKey){
 const c=categoryConfig[category];
 const {data}=await supabase.from("betbass_casinos").select("*").eq("active",true).order("priority",{ascending:true}).order("bangladesh_priority",{ascending:false}).order("featured",{ascending:false}).order("name");
 const casinos=(data??[]).filter(c.filter);
 return <main className="min-h-screen px-6 py-10"><div className="mx-auto max-w-7xl"><a href="/" className="text-sm text-white/45 hover:text-white">← Back to BetBass</a><header className="mt-8 max-w-4xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">BETBASS DIRECTORY</p><h1 className="mt-2 text-4xl font-black md:text-6xl">{c.title}</h1><p className="mt-5 text-lg leading-8 text-white/55">{c.description}</p></header><section className="mt-10"><CasinoDirectory casinos={casinos}/></section></div></main>;
}