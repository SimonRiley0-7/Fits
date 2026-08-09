import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getOrCreateUser } from "@/lib/getUser";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    const { occasion, item_ids, missing_category } = await req.json();

    const { data, error } = await supabaseAdmin
      .from("outfits")
      .insert({ user_id: user, occasion, item_ids, missing_category })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ outfit: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
