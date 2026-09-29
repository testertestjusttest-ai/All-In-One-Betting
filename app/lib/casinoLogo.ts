import type { Casino } from "./supabase";

export const logoDomains: Record<string, string> = {
  tk999:"tk999.com",ck999:"ck999.com",bk999:"bk999.com",jeetwin:"jeetwin.com",krikiya:"krikya.io",baji:"baji.com",crickex:"crickex.com",jeetbuzz:"jeetbuzz.com",nagad88:"nagad88.com",babu88:"babu88.com",jaya9:"jaya9.com",mcw:"mcw.com",linebet:"linebet.com",megapari:"megapari.com","888starz":"888starz.com",betjili:"betjili.com","4rabet":"4rabet.com",winwin:"winwin.bet",rajabaji:"rajabaji.com",pbc88:"pbc88.com",betvisa:"bv88visa.com","10bet":"10bet.com","1win":"1win.com","1xbet":"1xbet.com","22bet":"22bet.com","888casino":"888casino.com","888sport":"888sport.com","bc-game":"bc.game",bet365:"bet365.com",betano:"betano.com",betfred:"betfred.com",betmgm:"betmgm.com",betsson:"betsson.com",betvictor:"betvictor.com",betway:"betway.com",betwinner:"betwinner.com",bitstarz:"bitstarz.com",borgata:"borgataonline.com",bwin:"bwin.com","caesars-sportsbook":"caesars.com",comeon:"comeon.com",coral:"coral.co.uk",dafabet:"dafabet.com",draftkings:"draftkings.com","fanatics-sportsbook":"fanatics.com",fanduel:"fanduel.com",ggbet:"gg.bet",interwetten:"interwetten.com",ladbrokes:"ladbrokes.com",leovegas:"leovegas.com",marathonbet:"marathonbet.com",melbet:"melbet.com",mostbet:"mostbet.com","mr-green":"mrgreen.com","paddy-power":"paddypower.com",parimatch:"parimatch.com",pinnacle:"pinnacle.com",playamo:"playamo.com",rollbit:"rollbit.com",roobet:"roobet.com",sportingbet:"sportingbet.com",stake:"stake.com",thunderpick:"thunderpick.io",unibet:"unibet.com",vavada:"vavada.com","william-hill":"williamhill.com"
};

export function initials(name: string) {
  return name.split(/\s+/).slice(0,2).map(x => x[0]).join("").toUpperCase();
}

function domainForCasino(casino: Pick<Casino, "logo_url" | "website_url" | "slug">) {
  if (casino.website_url) {
    try {
      return new URL(casino.website_url).hostname.replace(/^www\./, "");
    } catch {}
  }
  return casino.slug ? logoDomains[casino.slug] : undefined;
}

export function casinoLogoUrl(casino: Pick<Casino, "logo_url" | "website_url" | "slug">) {
  if (casino.logo_url) return casino.logo_url;
  const domain = domainForCasino(casino);
  if (!domain) return null;

  // Prefer the same-origin logo proxy so logos are not blocked by browser referrer/CORS policies.
  return "/api/logo?domain=" + encodeURIComponent(domain);
}

export function casinoLogoFallbackUrl(casino: Pick<Casino, "logo_url" | "website_url" | "slug">) {
  const domain = domainForCasino(casino);
  return domain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128` : null;
}
