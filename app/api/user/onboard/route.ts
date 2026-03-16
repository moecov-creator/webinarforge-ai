// app/api/user/onboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { nanoid } from "nanoid";

const OnboardSchema = z.object({
  name: z.string().min(1),
  company: z.string().min(1),
  niche: z.string().min(1),
  primaryOffer: z.string().min(1),
  targetAudience: z.string().min(5),
  webinarGoal: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress;
  if (!email) {
    return NextResponse.json({ error: "Email not found" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = OnboardSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;

  // Upsert user
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      clerkId,
      name: data.name,
      company: data.company,
      niche: data.niche as any,
      primaryOffer: data.primaryOffer,
      targetAudience: data.targetAudience,
      webinarGoal: data.webinarGoal,
      onboardingComplete: true,
    },
    create: {
      email,
      clerkId,
      name: data.name,
      company: data.company,
      niche: data.niche as any,
      primaryOffer: data.primaryOffer,
      targetAudience: data.targetAudience,
      webinarGoal: data.webinarGoal,
      onboardingComplete: true,
    },
  });

  // Create workspace if not already in one
  const existingMembership = await prisma.workspaceMember.findFirst({
    where: { userId: user.id },
  });

  if (!existingMembership) {
    const slug = `${data.company.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30)}-${nanoid(6)}`;

    const workspace = await prisma.workspace.create({
      data: {
        name: data.company,
        slug,
        members: {
          create: { userId: user.id, role: "owner" },
        },
      },
    });

    // Create subscription (14-day trial)
    await prisma.subscription.create({
      data: {
        workspaceId: workspace.id,
        plan: "FREE_TRIAL",
        status: "trialing",
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    });

    // Initialize usage counters
    await prisma.planUsage.create({
      data: { workspaceId: workspace.id },
    });

    // Create default AI presenter
    await prisma.aIPresenter.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        name: data.name,
        speakingStyle: "conversational",
        tone: "professional",
        nicheSpecialty: data.niche as any,
        isDefault: true,
      },
    });

    // Track analytics
    await prisma.analyticsEvent.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        event: "user.onboarded",
        properties: { niche: data.niche, goal: data.webinarGoal },
      },
    });
  }

  return NextResponse.json({ success: true });
}
