import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { casinoId } = await request.json();
    if (!casinoId) return NextResponse.json({ ok: false }, { status: 400 });
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return NextResponse.json({ ok: true, tracked: false });
    const db = createClient(url, key);
    const result = await db.from("betbass_clicks").insert({
      casino_id: casinoId,
      path: request.headers.get("referer") ?? "",
      referrer: request.headers.get("referer") ?? "",
      user_agent: request.headers.get("user-agent") ?? ""
    });
    if (result.error) return NextResponse.json({ ok: true, tracked: false });
    return NextResponse.json({ ok: true, tracked: true });
  } catch {
    return NextResponse.json({ ok: true, tracked: false });
  }
}
