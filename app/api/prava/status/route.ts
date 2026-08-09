import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const pravaRes = await fetch(`https://sandbox.api.prava.space/v1/sessions/${sessionId}/payment-result`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.PRAVA_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!pravaRes.ok) {
      const errorText = await pravaRes.text();
      console.error("[PRAVA] Status check failed:", errorText);
      return NextResponse.json({ error: "Failed to check Prava status" }, { status: pravaRes.status });
    }

    const data = await pravaRes.json();
    
    // Check nested transactions for token (Sandbox structure) as done in DropAgent
    let token = null;
    let cryptogram = null;
    let isApproved = false;

    const transactions = data.transactions || [];
    for (const txn of transactions) {
      const lineItems = txn.line_items || [];
      for (const item of lineItems) {
        if (item.token) {
          token = item.token;
          cryptogram = item.dynamic_cvv;
          isApproved = true;
          break;
        }
      }
    }

    // Fallback to root level just in case
    if (!isApproved) {
      if (["approved", "completed", "used", "credentials_generated"].includes(data.status) && data.token) {
        token = data.token;
        cryptogram = data.cryptogram;
        isApproved = true;
      }
    }

    return NextResponse.json({
      status: data.status,
      isApproved,
      token: token ? "***" + token.slice(-4) : null // Don't send full PAN back to client for security
    });

  } catch (error) {
    console.error("[PRAVA] Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
