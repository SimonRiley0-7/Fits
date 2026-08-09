import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/getUser";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { category, gender, color, style, pattern, distinctive_feature, keywords } = await req.json();

    // If Iris passes free-form keywords (for missing piece), use them directly
    if (keywords && !category) {
      // Try to fetch user's gender from their Style DNA profile — default to "Men" if not set
      let genderPrefix = "Men's "; // safe default
      try {
        const userId = await getOrCreateUser();
        const { data: user } = await supabaseAdmin.from("users").select("metadata").eq("id", userId).single();
        const gender = user?.metadata?.style_dna?.gender;
        if (gender) {
          genderPrefix = gender === "Unisex" ? "" : `${gender}'s `;
        }
      } catch (_) {}

      // Sharp, gender-specific query targeting Indian fashion retailers
      const searchQuery = `${genderPrefix}${keywords} buy online myntra ajio`;
      console.log(`[FIND-PRODUCT] Missing piece search: "${searchQuery}"`);

      const res = await fetch("https://google.serper.dev/shopping", {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY || "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ q: searchQuery, gl: "in" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Serper search failed");
      const matches = (data.shopping || []).slice(0, 5).map((item: any) => ({
        id: item.id || Math.random().toString(36).substring(7),
        title: item.title,
        price: item.price ? item.price.replace(/[^\d.]/g, '') : "0",
        currency: "INR",
        imageUrl: item.imageUrl,
        link: item.link,
        retailer: item.source || "Retailer",
      }));
      return NextResponse.json({ matches });
    }

    if (!category) {
      return NextResponse.json({ error: "Missing attributes" }, { status: 400 });
    }

    // Try to get user's Style DNA sizes and fit preference if they are logged in
    let sizeQuery = "";
    let fitQuery = "";
    try {
      const userId = await getOrCreateUser();
      const { data: user } = await supabaseAdmin.from("users").select("metadata").eq("id", userId).single();
      const dna = user?.metadata?.style_dna;
      
      if (dna) {
        // Size injection
        const isBottom = ["pants", "jeans", "shorts", "skirt", "trousers"].includes(category.toLowerCase());
        sizeQuery = isBottom && dna.bottomSize ? `size ${dna.bottomSize}` : (dna.topSize ? `size ${dna.topSize}` : "");
        
        // Fit injection
        if (dna.fitPreference && dna.fitPreference !== "Regular") {
          fitQuery = dna.fitPreference; // e.g. "Slim", "Oversized", "Relaxed"
        }
      }
    } catch (e) {
      // Ignore if guest or auth fails, just continue without sizes/fit
    }

    // Ensure we don't duplicate fit if the AI already extracted it
    const finalStyle = style?.toLowerCase().includes(fitQuery.toLowerCase()) ? style : `${fitQuery} ${style || ""}`.trim();

    // Clean Google Shopping query: exactly 5-8 powerful words
    const query = `${gender && gender !== 'Unisex' ? gender + "'s" : ""} ${pattern || ""} ${color || ""} ${finalStyle} ${distinctive_feature || ""} ${category} ${sizeQuery}`.replace(/\s+/g, ' ').trim();
    
    // We'll use Serper Shopping API
    const res = await fetch("https://google.serper.dev/shopping", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY || "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: query,
        gl: "in", // Google India
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Serper search failed");
    }

    // Map to a consistent format and take top 4
    const matches = (data.shopping || []).slice(0, 4).map((item: any) => ({
      id: item.id || Math.random().toString(36).substring(7),
      title: item.title,
      price: item.price ? item.price.replace(/[^\d.]/g, '') : "0", 
      currency: "INR",
      imageUrl: item.imageUrl,
      link: item.link,
      retailer: item.source || "Retailer",
    }));

    return NextResponse.json({ matches });
  } catch (error: any) {
    console.error("Find product error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
