import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getOrCreateUser } from "@/lib/getUser";
import { resolveGoogleShoppingLink, getRetailerFromLink } from "@/lib/utils";

export const dynamic = 'force-dynamic';

// GET — fetch user's wishlist
export async function GET() {
  try {
    const user = await getOrCreateUser();
    const { data, error } = await supabaseAdmin
      .from("wishlist")
      .select("*")
      .eq("user_id", user)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ items: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST — add item to wishlist
export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    const { product_id, title, price, image_url, link, retailer } = await req.json();
    
    // Resolve Google Shopping redirects to direct retailer links
    const resolvedLink = await resolveGoogleShoppingLink(link);
    const resolvedRetailer = getRetailerFromLink(resolvedLink) || retailer;

    const { data, error } = await supabaseAdmin
      .from("wishlist")
      .upsert({ user_id: user, product_id, title, price: parseFloat(price) || 0, image_url, link: resolvedLink, retailer: resolvedRetailer }, { onConflict: "user_id,product_id" })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — remove item from wishlist
export async function DELETE(req: Request) {
  try {
    const user = await getOrCreateUser();
    const { product_id } = await req.json();
    const { error } = await supabaseAdmin
      .from("wishlist")
      .delete()
      .eq("user_id", user)
      .eq("product_id", product_id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
