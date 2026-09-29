import { NextResponse } from "next/server";

function validDomain(domain: string) {
  return /^[a-z0-9.-]+$/i.test(domain) && domain.includes(".") && !domain.includes("..");
}

export async function GET(request: Request) {
  const domain = new URL(request.url).searchParams.get("domain")?.trim().toLowerCase();
  if (!domain || !validDomain(domain)) {
    return new NextResponse(null, { status: 400 });
  }

  const sources = [
    `https://logos.hunter.io/${encodeURIComponent(domain)}`,
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`,
  ];

  for (const source of sources) {
    try {
      const upstream = await fetch(source, {
        headers: { "user-agent": "Mozilla/5.0 BetBass/1.0" },
        cache: "force-cache",
        next: { revalidate: 86400 },
      });

      if (!upstream.ok) continue;

      const body = await upstream.arrayBuffer();
      const contentType = upstream.headers.get("content-type") || "image/png";

      return new NextResponse(body, {
        headers: {
          "content-type": contentType,
          "cache-control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
        },
      });
    } catch {
      // Try the next logo provider.
    }
  }

  return new NextResponse(null, { status: 404 });
}
