// app/api/billing/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { billingAdapter } from "@/lib/adapters/stripe/billing";
import { nanoid } from "nanoid";

const CheckoutSchema = z.object({
  planKey: z.enum(["STARTER", "PRO", "SCALE", "EARLY_BIRD"]),
});

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = CheckoutSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  // Find existing workspace member
  let member = await prisma.workspaceMember.findFirst({
    where: { user: { clerkId }, role: "owner" },
  });

  // If no workspace yet create user and workspace automatically
  if (!member) {
    const clerkUser = await currentUser()
    if (!clerkUser)
      return NextResponse.json({ error: "Clerk user not found" }, { status: 404 });

    const email = clerkUser.emailAddresses[0]?.emailAddress ?? ""
    const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || "User"

    // Upsert user — handles both new and existing users
    const user = await prisma.user.upsert({
      where: { email },
      update: { clerkId },
      create: {
        clerkId,
        email,
        name,
        company: "My Company",
        niche: "COACHING",
        primaryOffer: "",
        targetAudience: "",
        webinarGoal: "SELL_PRODUCT",
        onboardingComplete: false,
      },
    })

    // Create workspace
    const slug = `workspace-${nanoid(6)}`
    const workspace = await prisma.workspace.create({
      data: {
        name: "My Workspace",
        slug,
        members: {
          create: {
            userId: user.id,
            role: "owner",
          },
        },
      },
    })

    // Create subscription record
    await prisma.subscription.create({
      data: {
        workspaceId: workspace.id,
        plan: "FREE_TRIAL",
        status: "trialing",
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    })

    // Create plan usage
    await prisma.planUsage.create({
      data: { workspaceId: workspace.id },
    })

    member = await prisma.workspaceMember.findFirst({
      where: { workspaceId: workspace.id, role: "owner" },
    })
  }

  if (!member)
    return NextResponse.json({ error: "Workspace setup failed" }, { status: 500 });

  try {
    const url = await billingAdapter.createCheckoutSession(
      member.workspaceId,
      parsed.data.planKey
    );
    return NextResponse.json({ url });
  } catch (err: any) {
    console.error("Checkout session error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
