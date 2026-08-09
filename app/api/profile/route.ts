import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getOrCreateUser } from "@/lib/getUser";

export async function POST(req: Request) {
  try {
    const userId = await getOrCreateUser();
    const { style_dna } = await req.json();

    // Fetch existing metadata first so we don't overwrite other things
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("metadata")
      .eq("id", userId)
      .single();

    const metadata = user?.metadata || {};
    metadata.style_dna = style_dna;

    const { error } = await supabaseAdmin
      .from("users")
      .update({ metadata })
      .eq("id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
