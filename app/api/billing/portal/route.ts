// app/api/billing/portal/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { billingAdapter } from "@/lib/adapters/stripe/billing";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await prisma.workspaceMember.findFirst({
    where: { user: { clerkId }, role: "owner" },
  });

  if (!member) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  try {
    const url = await billingAdapter.createPortalSession(member.workspaceId);
    return NextResponse.json({ url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
