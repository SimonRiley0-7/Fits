import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getOrCreateUser } from "@/lib/getUser";
import { groq } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    const { occasion, forceItemId } = await req.json();

    if (!occasion) {
      return NextResponse.json({ error: "Occasion is required" }, { status: 400 });
    }

    // 1. Fetch user's wardrobe
    const { data: wardrobe, error: dbError } = await supabaseAdmin
      .from("wardrobe_items")
      .select("*")
      .eq("user_id", user);

    if (dbError) throw dbError;

    if (!wardrobe || wardrobe.length === 0) {
      return NextResponse.json({ 
        error: "Your wardrobe is empty. Head back to Grabbit to add some pieces first!" 
      }, { status: 400 });
    }

    const wardrobeSummary = wardrobe.map(i => ({
      id: i.id,
      category: i.category,
      color: i.color,
      retailer: i.retailer
    }));

    // 1.5 Fetch user's Style DNA
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("metadata")
      .eq("id", user)
      .single();
    
    const styleDna = userData?.metadata?.style_dna || null;
    let styleInstruction = "";
    if (styleDna) {
      const genderCtx = styleDna.gender && styleDna.gender !== "Unisex" ? `The user is styling for ${styleDna.gender}'s fashion. ` : "";
      styleInstruction = `\n${genderCtx}The user has a specific 'Style DNA' profile: they prefer ${styleDna.fitPreference} fits, and their core vibe is '${styleDna.vibe}'. ALWAYS factor this into your styling decisions and mention it in your explanation.`;
    }
    
    if (forceItemId) {
      styleInstruction += `\nCRITICAL: You MUST include the item with ID "${forceItemId}" in the outfit. Do NOT omit it.`;
    }

    // 2. Call Iris (Groq LLaMA-3)
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are Iris, a high-end fashion stylist. You will be given a list of items a user owns and an occasion. Build an outfit using ONLY the provided item IDs. Also identify exactly one 'missing_piece_keywords' (e.g. 'Men's black leather boots', 'Women's beige trench coat', or 'silver watch') that would perfect the look but isn't in their wardrobe. CRITICAL: If the user has a specific gender profile, you MUST start the missing_piece_keywords with that gender (e.g., "Men's " or "Women's ").${styleInstruction} Return JSON with 'item_ids' (array of strings), 'missing_piece_keywords' (string), and 'iris_message' (a stylish, highly opinionated 2-sentence explanation of why you picked these and why they absolutely need the missing item to tie it together).`
        },
        {
          role: "user",
          content: `Occasion: ${occasion}\nWardrobe: ${JSON.stringify(wardrobeSummary)}`
        }
      ]
    });

    const response = JSON.parse(completion.choices[0].message.content!);

    const itemIds = response.item_ids || [];
    if (forceItemId && !itemIds.includes(forceItemId)) {
      itemIds.push(forceItemId);
    }
    const missingPiece = response.missing_piece_keywords || null;

    // Auto-save outfit to history (fire and forget)
    void supabaseAdmin.from("outfits").insert({
      user_id: user,
      occasion,
      item_ids: itemIds,
      missing_category: missingPiece,
    });

    return NextResponse.json({
      item_ids: itemIds,
      missing_piece: missingPiece,
      message: response.iris_message || "Here is your outfit.",
      wardrobe: wardrobe
    });

  } catch (error: any) {
    console.error("Iris Styling Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
