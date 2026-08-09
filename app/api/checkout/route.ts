import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getOrCreateUser } from "@/lib/getUser";
import { spawn } from "child_process";
import path from "path";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    
    // We expect { items: CartItem[], sessionId?: string } now
    const { items, sessionId } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    let token = "0000000000000000"; // Fallback mock token

    // If we have a Prava session, securely retrieve the real virtual card token
    if (sessionId) {
      try {
        const pravaRes = await fetch(`https://sandbox.api.prava.space/v1/sessions/${sessionId}/payment-result`, {
          headers: {
            "Authorization": `Bearer ${process.env.PRAVA_API_KEY}`,
            "Content-Type": "application/json"
          }
        });
        
        if (pravaRes.ok) {
          const data = await pravaRes.json();
          // Extract token from nested structure
          const transactions = data.transactions || [];
          for (const txn of transactions) {
            for (const item of (txn.line_items || [])) {
              if (item.token) token = item.token;
            }
          }
          if (token === "0000000000000000" && data.token) {
            token = data.token;
          }
        }
      } catch (e) {
        console.error("Failed to fetch real token from Prava", e);
      }
    }

    // 1. Insert into wardrobe_items FIRST to generate IDs
    const wardrobeData = items.map((item: any) => {
      let parsedBrand = item.product.retailer || "Unknown";
      if (parsedBrand.toLowerCase().includes("myntra")) parsedBrand = "Myntra";
      if (parsedBrand.toLowerCase().includes("ajio")) parsedBrand = "Ajio";

      let parsedCategory = item.analysis?.category;
      if (!parsedCategory && item.product.title) {
        const t = item.product.title.toLowerCase();
        if (t.includes("shirt")) parsedCategory = "Shirt";
        else if (t.includes("jeans") || t.includes("pants") || t.includes("trouser")) parsedCategory = "Pants";
        else if (t.includes("dress")) parsedCategory = "Dress";
        else if (t.includes("jacket") || t.includes("coat")) parsedCategory = "Jacket";
        else if (t.includes("belt")) parsedCategory = "Belt";
        else if (t.includes("shoe") || t.includes("sneaker")) parsedCategory = "Shoes";
        else parsedCategory = "Apparel";
      }

      return {
        user_id: user,
        image_url: item.product.imageUrl,
        category: parsedCategory || "Apparel",
        color: item.analysis?.color || "Standard",
        brand: parsedBrand
      };
    });

    // Perform insert and select the rows back to get their UUIDs
    const { data: insertedWardrobeItems, error: wardrobeError } = await supabaseAdmin
      .from("wardrobe_items")
      .insert(wardrobeData)
      .select("id");

    if (wardrobeError) throw wardrobeError;

    // 2. Insert into purchases referencing the newly created wardrobe_items
    const purchasesData = items.map((item: any, index: number) => ({
      user_id: user,
      wardrobe_item_id: insertedWardrobeItems[index].id,
      retailer: item.product.retailer,
      price: parseFloat(item.product.price) || 0,
      status: "completed"
    }));

    const { error: purchaseError } = await supabaseAdmin
      .from("purchases")
      .insert(purchasesData);

    if (purchaseError) throw purchaseError;

    // 3. Trigger the Autonomous Agent (Playwright) asynchronously for each item
    // We use child_process spawn so it doesn't block the API response
    const projectRoot = process.cwd();
    const agentScript = path.join(projectRoot, "scripts", "agent.ts");

    items.forEach((item: any) => {
      const url = item.product.link || item.product.productUrl;
      if (url) {
        console.log(`[CHECKOUT] Spawning AI Agent for ${url}...`);
        
        // Use shell:true so npx resolves on all platforms
        // Use stdio:'inherit' temporarily to see errors in the Next.js terminal
        const agent = spawn(
          `npx tsx "${agentScript}" "${url}" "${token}"`,
          [],
          {
            shell: true,
            detached: true,
            stdio: "ignore",
            cwd: projectRoot,
            env: { ...process.env, FORCE_COLOR: "0" }
          }
        );
        
        agent.on('error', (err) => console.error('[AGENT SPAWN ERROR]', err));
        // Let it run independently of the Node event loop
        agent.unref();
      }
    });

    return NextResponse.json({ success: true, count: items.length });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

