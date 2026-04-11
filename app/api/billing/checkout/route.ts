// app/api/billing/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import Stripe from "stripe";
import { nanoid } from "nanoid";

const CheckoutSchema = z.object({
  planKey: z.enum(["STARTER", "PRO", "SCALE", "EARLY_BIRD"]),
});

export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-11-20.acacia",
  });
}

const PRICE_MAP: Record<string, string | undefined> = {
  EARLY_BIRD: process.env.STRIPE_PRICE_EARLY_BIRD,
  STARTER: process.env.STRIPE_PRICE_STARTER_MONTHLY,
  PRO: process.env.STRIPE_PRICE_PRO_MONTHLY,
  SCALE: process.env.STRIPE_PRICE_SCALE_MONTHLY,
}

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const parsed = CheckoutSchema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })

    const planKey = parsed.data.planKey
    const priceId = PRICE_MAP[planKey]

    if (!priceId)
      return NextResponse.json(
        { error: `No Stripe price configured for: ${planKey}` },
        { status: 400 }
      )

    const clerkUser = await currentUser()
    if (!clerkUser)
      return NextResponse.json({ error: "Clerk user not found" }, { status: 404 })

    const email = clerkUser.emailAddresses[0]?.emailAddress ?? ""

    // Use short unique slug to avoid length issues
    const shortId = clerkId.slice(-8)
    let workspace = await prisma.workspace.findFirst({
      where: { slug: { contains: shortId } },
    })

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: "My Workspace",
          slug: `ws-${shortId}-${nanoid(4)}`,
        },
      })
    }

    const isEarlyBird = planKey === "EARLY_BIRD"

    const session = await getStripe().checkout.sessions.create({
      mode: isEarlyBird ? "payment" : "subscription",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&plan=${planKey}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        clerkId,
        workspaceId: workspace.id,
        planKey,
      },
    })

    return NextResponse.json({ url: session.url })

  } catch (err: any) {
    console.error("Checkout error:", err)
    return NextResponse.json(
      { error: err.message ?? "Checkout failed" },
      { status: 500 }
    )
  }
}
