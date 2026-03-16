// app/api/webinars/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import OpenAI from "openai";
import { prisma } from "@/lib/db/prisma";
import { nanoid } from "nanoid";

const GenerateSchema = z.object({
  niche: z.string().min(1),
  idealAudience: z.string().min(10),
  painPoint: z.string().min(10),
  desiredOutcome: z.string().min(10),
  offerName: z.string().min(2),
  offerType: z.string(),
  pricePoint: z.number().positive(),
  tone: z.string(),
  trafficSource: z.string().optional(),
  objections: z.string().optional(),
  guarantee: z.string().optional(),
  ctaGoal: z.string().optional(),
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = GenerateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const inputs = parsed.data;

  // Get workspace for this user
  const member = await prisma.workspaceMember.findFirst({
    where: { user: { clerkId: userId } },
    include: { workspace: { include: { subscription: true, planUsage: true } } },
  });

  if (!member) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const { workspace } = member;

  // Check usage limit (simplified — use full service in production)
  const planUsage = workspace.planUsage;
  const plan = workspace.subscription?.plan ?? "FREE_TRIAL";
  const monthlyLimit = plan === "FREE_TRIAL" ? 2 : plan === "STARTER" ? 3 : null;

  if (monthlyLimit !== null && planUsage && planUsage.webinarsBuilt >= monthlyLimit) {
    return NextResponse.json(
      { error: "Monthly webinar limit reached. Please upgrade your plan." },
      { status: 403 }
    );
  }

  // Generate via OpenAI
  const prompt = buildGenerationPrompt(inputs);

  let generated: GeneratedContent;
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o",
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a world-class direct-response webinar strategist. Generate high-converting evergreen webinar content. Write in an original voice. Always respond with valid JSON only.`,
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    generated = JSON.parse(raw) as GeneratedContent;
  } catch (error) {
    console.error("OpenAI generation error:", error);
    // Fall back to structured placeholder content
    generated = buildPlaceholderContent(inputs);
  }

  // Create webinar in DB
  const slug = `webinar-${nanoid(10)}`;
  const title = generated.titleOptions?.[0] ?? `${inputs.offerName} Webinar`;

  const webinar = await prisma.webinar.create({
    data: {
      workspaceId: workspace.id,
      title,
      niche: inputs.niche as any,
      status: "DRAFT",
      mode: "EVERGREEN",
      slug,
      generatorInputs: inputs,
      sections: {
        create: buildSections(generated),
      },
      offers: {
        create: generated.offerStack
          ? [
              {
                name: generated.offerStack.name ?? inputs.offerName,
                type: inputs.offerType as any,
                price: generated.offerStack.price ?? inputs.pricePoint,
                originalPrice: generated.offerStack.originalPrice,
                description: generated.offerStack.description,
                valueItems: generated.offerStack.valueItems ?? [],
                order: 1,
              },
            ]
          : [],
      },
      bonuses: {
        create: (generated.bonuses ?? []).map((b: any, i: number) => ({
          name: b.name ?? `Bonus ${i + 1}`,
          description: b.description,
          value: b.value,
          order: i + 1,
        })),
      },
      objections: {
        create: (generated.faqItems ?? []).map((f: any, i: number) => ({
          question: f.question,
          answer: f.answer,
          order: i + 1,
        })),
      },
      ctaSequences: {
        create: buildCTASequences(generated),
      },
      timedComments: {
        create: buildDefaultTimedComments(),
      },
      evergreenConfig: {
        create: {
          isSimulatedLive: true,
          viewerCountMin: 30,
          viewerCountMax: 200,
          replayEnabled: true,
        },
      },
    },
  });

  // Update usage counter
  await prisma.planUsage.update({
    where: { workspaceId: workspace.id },
    data: { webinarsBuilt: { increment: 1 } },
  });

  // Track analytics event
  await prisma.analyticsEvent.create({
    data: {
      workspaceId: workspace.id,
      webinarId: webinar.id,
      event: "webinar.created",
      properties: { niche: inputs.niche, plan },
    },
  });

  return NextResponse.json({ webinarId: webinar.id, slug });
}

// ─── Helpers ──────────────────────────────────────────────

interface GeneratedContent {
  titleOptions?: string[];
  openingHooks?: string[];
  promiseStatement?: string;
  credibilityAngle?: string;
  beliefShifts?: { oldBelief: string; newBelief: string; bridgeStatement: string }[];
  teachingPoints?: { title: string; content: string; takeaway: string }[];
  offerTransition?: string;
  offerStack?: { name: string; description: string; price: number; originalPrice?: number; valueItems: string[] };
  bonuses?: { name: string; description: string; value: number }[];
  urgencySection?: string;
  ctaCopy?: { headline: string; body: string; buttonText: string; urgencyLine?: string };
  faqItems?: { question: string; answer: string }[];
  followUpEmails?: { subject: string; body: string; sendAtHours: number }[];
}

function buildGenerationPrompt(inputs: z.infer<typeof GenerateSchema>): string {
  return `Generate a complete high-converting webinar structure for:

Niche: ${inputs.niche}
Ideal Audience: ${inputs.idealAudience}
Core Pain Point: ${inputs.painPoint}
Desired Outcome: ${inputs.desiredOutcome}
Offer Name: ${inputs.offerName}
Offer Type: ${inputs.offerType}
Price Point: $${inputs.pricePoint}
Tone: ${inputs.tone}
Traffic Source: ${inputs.trafficSource || "general"}
Objections: ${inputs.objections || "cost, time, skepticism"}
Guarantee: ${inputs.guarantee || "results guarantee"}
CTA Goal: ${inputs.ctaGoal || "book a call"}

Respond with a JSON object containing:
- titleOptions: array of 5 compelling webinar titles
- openingHooks: array of 3 pattern-interrupt opening lines
- promiseStatement: one clear bold promise for this webinar
- credibilityAngle: presenter backstory/authority paragraph
- beliefShifts: array of 3 objects { oldBelief, newBelief, bridgeStatement }
- teachingPoints: array of 3 objects { title, content, takeaway }
- offerTransition: smooth bridge from teaching to offer
- offerStack: { name, description, price, originalPrice, valueItems: string[] }
- bonuses: array of 3 { name, description, value }
- urgencySection: urgency and scarcity section content
- ctaCopy: { headline, body, buttonText, urgencyLine }
- faqItems: array of 5 { question, answer }
- followUpEmails: array of 3 { subject, body, sendAtHours }

Write in an original, authentic voice. No clichés. Keep content specific and results-focused.`;
}

function buildSections(generated: GeneratedContent) {
  const sections = [];

  if (generated.openingHooks?.[0]) {
    sections.push({ type: "hook", title: "Opening Hook", content: generated.openingHooks[0], order: 1 });
  }
  if (generated.promiseStatement) {
    sections.push({ type: "promise", title: "The Promise", content: generated.promiseStatement, order: 2 });
  }
  if (generated.credibilityAngle) {
    sections.push({ type: "credibility", title: "About Me", content: generated.credibilityAngle, order: 3 });
  }

  let order = 4;
  (generated.beliefShifts ?? []).slice(0, 3).forEach((bs, i) => {
    sections.push({
      type: "belief_shift",
      title: `Belief Shift ${i + 1}`,
      content: `${bs.oldBelief}\n\n${bs.bridgeStatement}\n\n${bs.newBelief}`,
      order: order++,
    });
    const tp = generated.teachingPoints?.[i];
    if (tp) {
      sections.push({
        type: "teaching",
        title: tp.title,
        content: `${tp.content}\n\nKey Takeaway: ${tp.takeaway}`,
        order: order++,
      });
    }
  });

  if (generated.offerTransition) {
    sections.push({ type: "offer_transition", title: "Offer Bridge", content: generated.offerTransition, order: order++ });
  }
  if (generated.urgencySection) {
    sections.push({ type: "urgency", title: "Urgency", content: generated.urgencySection, order: order++ });
  }
  if (generated.ctaCopy) {
    sections.push({
      type: "cta",
      title: "Call to Action",
      content: `${generated.ctaCopy.headline}\n\n${generated.ctaCopy.body}`,
      order: order++,
    });
  }

  return sections;
}

function buildCTASequences(generated: GeneratedContent) {
  const cta = generated.ctaCopy;
  return [
    { type: "SOFT", triggerAt: 600, headline: "Stay with me...", body: "The most important part is coming up.", buttonText: "Keep watching", isActive: true, order: 1 },
    { type: "MID", triggerAt: 2700, headline: "Ready to go deeper?", body: cta?.body ?? "This is how you implement everything.", buttonText: "Learn More →", isActive: true, order: 2 },
    { type: "FINAL", triggerAt: 4200, headline: cta?.headline ?? "Take action now", body: cta?.urgencyLine ?? "Limited spots available.", buttonText: cta?.buttonText ?? "Get Started →", isActive: true, order: 3 },
    { type: "URGENCY", triggerAt: 4500, headline: "⚡ Final reminder", body: cta?.urgencyLine ?? "This offer won't be available much longer.", buttonText: cta?.buttonText ?? "Claim Your Spot →", isActive: true, order: 4 },
  ];
}

function buildDefaultTimedComments() {
  return [
    { type: "SOCIAL_PROOF", authorName: "Emily R.", content: "This is exactly what I needed! Taking notes 📝", triggerAt: 300, order: 1 },
    { type: "FAQ", authorName: "James T.", content: "Does this work for beginners?", triggerAt: 900, order: 2 },
    { type: "TESTIMONIAL", authorName: "Amanda K.", content: "I used this and doubled my revenue in 60 days. Not exaggerating.", triggerAt: 1800, order: 3 },
    { type: "URGENCY", authorName: "System", content: "🔥 47 people watching right now", triggerAt: 2400, order: 4 },
    { type: "CTA_REMINDER", authorName: "System", content: "Enrollment is now open 👇", triggerAt: 4200, order: 5 },
  ];
}

function buildPlaceholderContent(inputs: z.infer<typeof GenerateSchema>): GeneratedContent {
  return {
    titleOptions: [
      `The ${inputs.desiredOutcome.split(" ").slice(0, 4).join(" ")} System`,
      `How ${inputs.idealAudience.split(" ").slice(0, 3).join(" ")} Can ${inputs.desiredOutcome.split(" ").slice(0, 5).join(" ")}`,
    ],
    promiseStatement: `In the next 60 minutes, I'll show you exactly how to ${inputs.desiredOutcome}.`,
    credibilityAngle: `I spent years struggling with the same problem you're facing. Once I cracked this system, everything changed.`,
    beliefShifts: [
      { oldBelief: "You need years of experience to succeed", newBelief: "The right system beats raw experience", bridgeStatement: "Here's what actually creates results..." },
    ],
    teachingPoints: [
      { title: "Step 1: Foundation", content: "The first thing you must get right is your positioning.", takeaway: "Clarity creates clients." },
    ],
    offerStack: { name: inputs.offerName, description: `Complete ${inputs.offerType} program to deliver ${inputs.desiredOutcome}`, price: inputs.pricePoint, valueItems: ["Live coaching", "Implementation support", "Community access"] },
    bonuses: [{ name: "Quick-Start Guide", description: "Get results in your first 7 days", value: 297 }],
    urgencySection: "We're limiting enrollment to maintain the quality of support.",
    ctaCopy: { headline: "This is your moment.", body: "Everything changes when you take action today.", buttonText: inputs.ctaGoal ?? "Get Started →" },
    faqItems: [{ question: "Is this right for beginners?", answer: "Yes — this is designed to work regardless of experience level." }],
  };
}
