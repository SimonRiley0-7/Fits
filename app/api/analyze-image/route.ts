import { openai } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/getUser";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, targetGender } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 });
    }

    // Attempt to fetch user's Style DNA
    let styleDna = null;
    try {
      const userId = await getOrCreateUser();
      const { data: user } = await supabaseAdmin.from("users").select("metadata").eq("id", userId).single();
      styleDna = user?.metadata?.style_dna;
    } catch (e) {
      // User might not be logged in or no DNA set
    }

    // Determine Gender Instruction
    // Priority: 1. Style DNA Gender -> 2. targetGender (from dropdown) -> 3. Auto-detect
    let genderInstruction = "You can automatically determine the gender based on the item.";
    if (styleDna?.gender && styleDna.gender !== "Unisex") {
      genderInstruction = `FORCE GENDER MATCH: The user's Style DNA dictates they shop for ${styleDna.gender}'s clothing. You MUST forcefully classify all extracted items as '${styleDna.gender}', regardless of who is wearing it in the photo.`;
    } else if (targetGender && targetGender !== "Auto-detect") {
      genderInstruction = `FORCE GENDER MATCH: The user has explicitly selected that they are shopping for ${targetGender}'s clothing. You MUST forcefully classify all extracted items as '${targetGender}', regardless of who is wearing it in the photo.`;
    }

    // Determine Fit Instruction
    let fitInstruction = "";
    if (styleDna?.fitPreference) {
      fitInstruction = `The user strongly prefers a '${styleDna.fitPreference}' fit. Bias your 'distinctive_feature' and 'style' extraction towards identifying items that align with a ${styleDna.fitPreference} fit if applicable.`;
    }

    const res = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: imageUrl } },
            { 
              type: "text", 
              text: `Analyze this image and meticulously identify ALL clothing items worn by the person, including both tops (shirts, sweaters, jackets) and bottoms (jeans, pants, shorts, skirts), even if the bottoms are only partially visible at the bottom of the frame. \n\n${genderInstruction}\n${fitInstruction}\n\nReturn a JSON object with a single key 'items', which is an array of objects. Each object in the array MUST strictly have these keys: 'category' (e.g., sweater, jeans, pants, dress, sneakers), 'gender' (Men, Women, or Unisex), 'color' (highly specific dominant color shade, e.g., 'dark charcoal gray', 'navy blue', 'olive green', 'light heather gray' instead of just 'gray' or 'blue'), 'pattern' (e.g., solid, striped, plaid, floral, graphic print), 'style' (e.g., casual, formal, streetwear), and 'distinctive_feature' (exactly ONE short, concise visual descriptor string like 'fine knit', 'cargo', 'v-neck', or 'oversized').` 
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
    });

    const data = JSON.parse(res.choices[0].message.content || "{}");
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Error analyzing image:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
