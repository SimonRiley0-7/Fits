import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/getUser";
import { supabaseAdmin } from "@/lib/supabase";

function extractCleanUrl(url: string, source: string, title: string) {
  if (!url) return "";
  if (url.includes('google.com/url')) {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('url') || urlObj.searchParams.get('q') || url;
    } catch (e) {}
  }
  
  if (url.includes('google.com/search?ibp=oshop') || url.includes('google.com/shopping/product')) {
    const s = source.toLowerCase();
    const q = encodeURIComponent(title);
    if (s.includes('myntra')) return `https://www.myntra.com/search?q=${q}`;
    if (s.includes('ajio')) return `https://www.ajio.com/search/?text=${q}`;
    if (s.includes('amazon')) return `https://www.amazon.in/s?k=${q}`;
    if (s.includes('flipkart')) return `https://www.flipkart.com/search?q=${q}`;
    if (s.includes('zara')) return `https://www.zara.com/in/en/search?searchTerm=${q}`;
    if (s.includes('h&m') || s.includes('hm')) return `https://www2.hm.com/en_in/search-results.html?q=${q}`;
    if (s.includes('uniqlo')) return `https://www.uniqlo.com/in/en/search?q=${q}`;
    // Fallback: regular google search for the product
    return `https://www.google.com/search?q=${encodeURIComponent(title + ' ' + source)}`;
  }
  
  return url;
}

export async function POST(req: Request) {
  try {
    const { category, gender, color, style, pattern, distinctive_feature, keywords, budget } = await req.json();

    // If Iris passes free-form keywords (for missing piece), use them directly
    if (keywords && !category) {
      // Try to fetch user's gender from their Style DNA profile — default to "" if not set
      let genderPrefix = ""; 
      try {
        const userId = await getOrCreateUser();
        const { data: user } = await supabaseAdmin.from("users").select("metadata").eq("id", userId).single();
        const gender = user?.metadata?.style_dna?.gender;
        if (gender) {
          genderPrefix = gender === "Unisex" ? "" : `${gender}'s `;
        }
      } catch (_) {}

      // Sharp, gender-specific query targeting Indian fashion retailers
      const budgetQuery = budget ? `under ${budget} rupees` : "";
      const genderSuffix = genderPrefix ? `for ${genderPrefix.replace("'s ", "")}` : "";
      const searchQuery = `${genderPrefix}${keywords} ${genderSuffix} ${budgetQuery} buy online myntra ajio`.trim();
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
        link: extractCleanUrl(item.link, item.source || "Retailer", item.title),
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
    const budgetQuery = budget ? `under ${budget} rupees` : "";
    const genderSuffix = gender && gender !== 'Unisex' ? `for ${gender}` : "";
    const query = `${gender && gender !== 'Unisex' ? gender + "'s" : ""} ${pattern || ""} ${color || ""} ${finalStyle} ${distinctive_feature || ""} ${category} ${sizeQuery} ${genderSuffix} ${budgetQuery}`.replace(/\s+/g, ' ').trim();
    
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
      link: extractCleanUrl(item.link, item.source || "Retailer", item.title),
      retailer: item.source || "Retailer",
    }));

    return NextResponse.json({ matches });
  } catch (error: any) {
    console.error("Find product error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
