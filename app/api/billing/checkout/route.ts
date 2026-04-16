import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// ─── Individual product price IDs ─────────────────────────────────────────────
// Set these in Vercel environment variables
const PRICE_IDS = {
  EARLY_BIRD:    process.env.STRIPE_EARLY_BIRD_PRICE_ID!,    // $49
  TEMPLATES_BUMP: process.env.STRIPE_TEMPLATES_BUMP_PRICE_ID!, // $47  ← separate price
  OTO1:          process.env.STRIPE_OTO1_PRICE_ID!,           // $997
  OTO2:          process.env.STRIPE_OTO2_PRICE_ID!,           // $497
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    const { planKey, includeBump } = await req.json()

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://webinarforge.ai"

    // ── Build line items based on planKey + optional bump ──────────────────
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    let successUrl = ""
    let cancelUrl = ""

    if (planKey === "EARLY_BIRD") {
      // Main product: $49 Early Bird
      lineItems = [{ price: PRICE_IDS.EARLY_BIRD, quantity: 1 }]

      // If client checked the order bump, add it as a second line item
      if (includeBump) {
        lineItems.push({ price: PRICE_IDS.TEMPLATES_BUMP, quantity: 1 })
      }

      // After purchase → go to $997 upsell
      successUrl = `${baseUrl}/funnel/upsell`
      cancelUrl  = `${baseUrl}/early-bird`

    } else if (planKey === "OTO1_997") {
      lineItems  = [{ price: PRICE_IDS.OTO1, quantity: 1 }]
      successUrl = `${baseUrl}/funnel/thankyou`
      cancelUrl  = `${baseUrl}/funnel/upsell`

    } else if (planKey === "OTO2_497") {
      lineItems  = [{ price: PRICE_IDS.OTO2, quantity: 1 }]
      successUrl = `${baseUrl}/funnel/thankyou`
      cancelUrl  = `${baseUrl}/funnel/downsell`

    } else {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    // ── Create Stripe session ───────────────────────────────────────────────
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId:      userId || "guest",
        planKey,
        includeBump: includeBump ? "true" : "false",
      },
      allow_promotion_codes:      true,
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
