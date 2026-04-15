import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const PLANS: Record<string, { priceId: string; name: string }> = {
  EARLY_BIRD: {
    priceId: process.env.STRIPE_EARLY_BIRD_PRICE_ID!,
    name: "WebinarForge AI — Early Bird Lifetime Access",
  },
  OTO1_997: {
    priceId: process.env.STRIPE_OTO1_PRICE_ID!,
    name: "WebinarForge AI — Done-For-You Funnel ($997)",
  },
  OTO2_497: {
    priceId: process.env.STRIPE_OTO2_PRICE_ID!,
    name: "WebinarForge AI — Guided Setup ($497)",
  },
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    const { planKey } = await req.json()

    const plan = PLANS[planKey]
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://webinarforge.ai"

    // After $49 Early Bird purchase → redirect to $997 upsell
    // After OTO1 purchase → redirect to Thank You
    // After OTO2 purchase → redirect to Thank You
    const successUrl =
      planKey === "EARLY_BIRD"
        ? `${baseUrl}/funnel/upsell`
        : `${baseUrl}/funnel/thankyou`

    const cancelUrl =
      planKey === "EARLY_BIRD"
        ? `${baseUrl}/early-bird`
        : `${baseUrl}/funnel/upsell`

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId || "guest",
        planKey,
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
