import { NextResponse } from "next/server";

function validDomain(domain: string) {
  return /^[a-z0-9.-]+$/i.test(domain) && domain.includes(".") && !domain.includes("..");
}

function absoluteUrl(value: string, domain: string) {
  try {
    return new URL(value, `https://${domain}/`).toString();
  } catch {
    return null;
  }
}

async function fetchImage(source: string) {
  try {
    const upstream = await fetch(source, {
      headers: { "user-agent": "Mozilla/5.0 BetBass/1.0" },
      cache: "force-cache",
      next: { revalidate: 86400 },
    });
    if (!upstream.ok) return null;

    const contentType = upstream.headers.get("content-type") || "";
    if (!contentType.startsWith("image/") && !contentType.includes("svg")) return null;

    return {
      body: await upstream.arrayBuffer(),
      contentType: contentType || "image/png",
    };
  } catch {
    return null;
  }
}

async function websiteLogoSources(domain: string) {
  const sources: string[] = [];

  try {
    const homepage = await fetch(`https://${domain}/`, {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "Mozilla/5.0 BetBass/1.0",
      },
      cache: "force-cache",
      next: { revalidate: 86400 },
      redirect: "follow",
    });

    if (homepage.ok) {
      const html = await homepage.text();

      // Prefer the site's declared social/logo image, then its favicon/icon declarations.
      const patterns = [
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
        /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
        /<link[^>]+rel=["'][^"']*(?:apple-touch-icon|icon)["'][^>]+href=["']([^"']+)["']/i,
        /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*(?:apple-touch-icon|icon)["']/i,
      ];

      for (const pattern of patterns) {
        const match = html.match(pattern);
        const url = match?.[1] ? absoluteUrl(match[1], domain) : null;
        if (url && !sources.includes(url)) sources.push(url);
      }
    }
  } catch {
    // Fall through to standard favicon/logo providers.
  }

  // Direct site favicon is often the most accurate brand mark when the homepage
  // does not expose an OG image or icon declaration.
  sources.push(
    `https://${domain}/favicon.ico`,
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`,
    `https://logos.hunter.io/${encodeURIComponent(domain)}`,
  );

  return [...new Set(sources)];
}

export async function GET(request: Request) {
  const domain = new URL(request.url).searchParams.get("domain")?.trim().toLowerCase();
  if (!domain || !validDomain(domain)) {
    return new NextResponse(null, { status: 400 });
  }

  const sources = await websiteLogoSources(domain);

  for (const source of sources) {
    const image = await fetchImage(source);
    if (!image) continue;

    return new NextResponse(image.body, {
      headers: {
        "content-type": image.contentType,
        "cache-control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
      },
    });
  }

  return new NextResponse(null, { status: 404 });
}
