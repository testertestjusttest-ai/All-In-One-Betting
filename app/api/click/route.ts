import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const { casinoId } = await request.json();
    if (!casinoId) return NextResponse.json({ ok: false }, { status: 400 });
    const result = await supabase.from("betbass_clicks").insert({ casino_id: casinoId, path: request.headers.get("referer") ?? "", referrer: request.headers.get("referer") ?? "", user_agent: request.headers.get("user-agent") ?? "" });
    return NextResponse.json({ ok: true, tracked: !result.error });
  } catch { return NextResponse.json({ ok: true, tracked: false }); }
}
