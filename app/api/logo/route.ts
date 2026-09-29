import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const domain = new URL(request.url).searchParams.get("domain")?.trim().toLowerCase();
  if (!domain || !/^[a-z0-9.-]+$/.test(domain)) return new NextResponse(null, { status: 400 });
  const upstream = await fetch(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`, {
    headers: { "user-agent": "Mozilla/5.0 BetBass/1.0" },
    next: { revalidate: 86400 },
  });
  if (!upstream.ok) return new NextResponse(null, { status: 404 });
  const body = await upstream.arrayBuffer();
  return new NextResponse(body, {
    headers: { "content-type": upstream.headers.get("content-type") || "image/png", "cache-control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000" },
  });
}