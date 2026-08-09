import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getOrCreateUser } from "@/lib/getUser";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getOrCreateUser();

    const [purchasesRes, outfitsRes] = await Promise.all([
      supabaseAdmin
        .from("purchases")
        .select("*, wardrobe_items(id, image_url, category, color, brand)")
        .eq("user_id", user)
        .order("created_at", { ascending: false })
        .limit(30),
      supabaseAdmin
        .from("outfits")
        .select("*")
        .eq("user_id", user)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    return NextResponse.json({
      purchases: purchasesRes.data || [],
      outfits: outfitsRes.data || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
