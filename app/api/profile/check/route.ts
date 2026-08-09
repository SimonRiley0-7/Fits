import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getOrCreateUser } from "@/lib/getUser";

export async function GET() {
  try {
    const userId = await getOrCreateUser();
    const { data: user } = await supabaseAdmin.from("users").select("metadata").eq("id", userId).single();
    
    if (user?.metadata?.style_dna) {
      return NextResponse.json({ hasDna: true, styleDna: user.metadata.style_dna });
    }
    
    return NextResponse.json({ hasDna: false });
  } catch (error) {
    return NextResponse.json({ hasDna: false });
  }
}
