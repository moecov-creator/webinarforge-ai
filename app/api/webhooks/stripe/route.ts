// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { billingAdapter } from "@/lib/adapters/stripe/billing";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  try {
    await billingAdapter.handleWebhook(rawBody, signature);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}
