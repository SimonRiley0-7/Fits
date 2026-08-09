import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const items = body.items || [];

    if (items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Calculate total amount
    const totalAmount = items.reduce((total: number, item: any) => {
      const priceVal = parseFloat(item.product.price.toString().replace(/,/g, ''));
      return total + (isNaN(priceVal) ? 0 : priceVal);
    }, 0);

    // Build the Prava purchase_context payload based on DropAgent's spec
    const productDetails = items.map((item: any) => ({
      description: item.product.title,
      unit_price: parseFloat(item.product.price.toString().replace(/,/g, '')).toFixed(2),
      quantity: 1
    }));

    // In a real scenario, these items might come from different merchants.
    // For simplicity in this checkout session, we group them under a general merchant name,
    // or just pick the first item's retailer. Let's use the first item's retailer as the merchant for this batch checkout.
    const merchantName = items[0].product.retailer || "Drobe Marketplace";

    const payload = {
      user_id: user.id,
      user_email: user.emailAddresses[0]?.emailAddress || "user@example.com",
      total_amount: totalAmount.toFixed(2),
      currency: "INR",
      purchase_context: [{
        merchant_details: {
          id: merchantName.toLowerCase().replace(/[^a-z0-9]/g, ''),
          name: merchantName,
          url: `https://${merchantName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          country_code_iso2: "IN"
        },
        product_details: productDetails
      }]
    };

    const pravaRes = await fetch("https://sandbox.api.prava.space/v1/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PRAVA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!pravaRes.ok) {
      const errorText = await pravaRes.text();
      console.error("[PRAVA] Session creation failed:", errorText);
      return NextResponse.json({ error: "Failed to create Prava session" }, { status: pravaRes.status });
    }

    const pravaData = await pravaRes.json();
    console.log("[PRAVA] Session created successfully:", pravaData.session_id || pravaData.id);

    return NextResponse.json({
      session_id: pravaData.session_id || pravaData.id,
      iframe_url: pravaData.iframe_url || pravaData.payment_url || ""
    });

  } catch (error) {
    console.error("[PRAVA] Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
