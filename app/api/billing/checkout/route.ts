// app/api/billing/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { billingAdapter } from "@/lib/adapters/stripe/billing";

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

  const member = await prisma.workspaceMember.findFirst({
    where: { user: { clerkId }, role: "owner" },
  });

  if (!member)
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

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
