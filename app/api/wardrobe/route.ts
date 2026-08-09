import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getOrCreateUser } from "@/lib/getUser";

export async function POST(req: NextRequest) {
  try {
    const userId = await getOrCreateUser();
    const { image_url, category, color, brand, style } = await req.json();

    if (!image_url) {
      return NextResponse.json({ error: "image_url is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("wardrobe_items")
      .insert({
        user_id: userId,
        image_url,
        category,
        color,
        brand,
        style,
        is_manual: true
      })
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json({ item: data });
  } catch (error: any) {
    console.error("Failed to add wardrobe item:", error);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getOrCreateUser();
    const { item_id } = await req.json();

    if (!item_id) {
      return NextResponse.json({ error: "item_id is required" }, { status: 400 });
    }

    // First, delete any associated purchases to satisfy foreign key constraints
    const { error: purchaseError } = await supabaseAdmin
      .from("purchases")
      .delete()
      .eq("wardrobe_item_id", item_id)
      .eq("user_id", userId);

    if (purchaseError) throw purchaseError;

    // Then, delete the wardrobe item itself
    const { error: wardrobeError } = await supabaseAdmin
      .from("wardrobe_items")
      .delete()
      .eq("id", item_id)
      .eq("user_id", userId);

    if (wardrobeError) throw wardrobeError;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete wardrobe item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
