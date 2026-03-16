// prisma/seed.ts
// Demo seed data for WebinarForge AI

import { PrismaClient, NicheType, Plan, AffiliateStatus } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding WebinarForge AI...");

  // ── Niche Packs ──────────────────────────────────────────
  const nichePacks = await prisma.nichePack.createMany({
    data: [
      {
        niche: NicheType.REAL_ESTATE,
        displayName: "Real Estate",
        description: "Agents, investors, and wholesalers building automated lead funnels.",
        iconEmoji: "🏠",
        color: "#3B82F6",
        promptHints: {
          audienceDescriptor: "motivated home buyers, sellers, or investors",
          painPoints: ["missing deals due to slow follow-up", "inconsistent lead flow", "time spent on unqualified prospects"],
          desiredOutcomes: ["predictable closings", "qualified pipeline on autopilot", "high-ticket investor clients"],
        },
      },
      {
        niche: NicheType.COACH_CONSULTANT,
        displayName: "Coach / Consultant",
        description: "Coaches, consultants, and experts monetizing their knowledge.",
        iconEmoji: "🎯",
        color: "#8B5CF6",
        promptHints: {
          audienceDescriptor: "ambitious professionals and entrepreneurs",
          painPoints: ["trading time for money", "inconsistent client flow", "difficulty scaling beyond 1:1"],
          desiredOutcomes: ["scalable group program", "consistent high-ticket clients", "productized expertise"],
        },
      },
      {
        niche: NicheType.TRAVEL,
        displayName: "Travel",
        description: "Travel agents and advisors selling premium itineraries and packages.",
        iconEmoji: "✈️",
        color: "#06B6D4",
        promptHints: {
          audienceDescriptor: "travelers dreaming of their next adventure",
          painPoints: ["overwhelm planning complex trips", "wasting money on bad experiences", "not knowing where to start"],
          desiredOutcomes: ["dream vacation without stress", "insider access and deals", "unforgettable experiences"],
        },
      },
      {
        niche: NicheType.SAAS,
        displayName: "SaaS",
        description: "Software founders and teams converting trial users into paying customers.",
        iconEmoji: "💻",
        color: "#10B981",
        promptHints: {
          audienceDescriptor: "founders, operators, and power users",
          painPoints: ["low trial-to-paid conversion", "users who don't see ROI", "churn after first month"],
          desiredOutcomes: ["fast time-to-value", "high activation rate", "long-term retention"],
        },
      },
      {
        niche: NicheType.LOCAL_SERVICES,
        displayName: "Local Services",
        description: "Local business owners filling their calendar with premium clients.",
        iconEmoji: "📍",
        color: "#F59E0B",
        promptHints: {
          audienceDescriptor: "local homeowners and business owners",
          painPoints: ["competing on price", "inconsistent referrals", "slow seasons"],
          desiredOutcomes: ["booked calendar", "premium clients who don't haggle", "word-of-mouth growth"],
        },
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Niche packs created");

  // ── Demo Workspace + User ─────────────────────────────────
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@webinarforge.ai" },
    update: {},
    create: {
      email: "demo@webinarforge.ai",
      name: "Alex Rivera",
      company: "Demo Corp",
      niche: NicheType.COACH_CONSULTANT,
      primaryOffer: "Business Acceleration Mastermind",
      targetAudience: "Coaches and consultants stuck under $10k/month",
      webinarGoal: "Enroll 10 new clients per month on autopilot",
      onboardingComplete: true,
      isAdmin: true,
    },
  });

  const demoWorkspace = await prisma.workspace.upsert({
    where: { slug: "demo-workspace" },
    update: {},
    create: {
      name: "Demo Corp",
      slug: "demo-workspace",
      brandColor: "#8B5CF6",
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: demoWorkspace.id,
        userId: demoUser.id,
      },
    },
    update: {},
    create: {
      workspaceId: demoWorkspace.id,
      userId: demoUser.id,
      role: "owner",
    },
  });

  // ── Subscription ─────────────────────────────────────────
  await prisma.subscription.upsert({
    where: { workspaceId: demoWorkspace.id },
    update: {},
    create: {
      workspaceId: demoWorkspace.id,
      plan: Plan.PRO,
      status: "active",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.planUsage.upsert({
    where: { workspaceId: demoWorkspace.id },
    update: {},
    create: {
      workspaceId: demoWorkspace.id,
      webinarsBuilt: 4,
      webinarsPublished: 2,
      aiGenerations: 18,
    },
  });

  console.log("✅ Demo user + workspace created");

  // ── AI Presenter ─────────────────────────────────────────
  const presenter = await prisma.aIPresenter.create({
    data: {
      workspaceId: demoWorkspace.id,
      userId: demoUser.id,
      name: "Jordan Blake",
      speakingStyle: "conversational",
      tone: "motivational",
      brandVoice: "Direct, warm, and results-focused. Speaks with authority but remains approachable.",
      nicheSpecialty: NicheType.COACH_CONSULTANT,
      isDefault: true,
    },
  });

  console.log("✅ AI Presenter created");

  // ── Webinar Templates ─────────────────────────────────────
  const templateStructure = {
    sections: [
      { type: "hook", title: "Opening Hook" },
      { type: "promise", title: "The Promise" },
      { type: "credibility", title: "Presenter Authority" },
      { type: "belief_shift", title: "Belief Shift 1" },
      { type: "teaching", title: "Teaching Point 1" },
      { type: "belief_shift", title: "Belief Shift 2" },
      { type: "teaching", title: "Teaching Point 2" },
      { type: "belief_shift", title: "Belief Shift 3" },
      { type: "teaching", title: "Teaching Point 3" },
      { type: "offer_transition", title: "Offer Transition" },
      { type: "stack", title: "The Offer" },
      { type: "bonus", title: "Bonuses" },
      { type: "urgency", title: "Urgency" },
      { type: "cta", title: "Call to Action" },
      { type: "faq", title: "FAQ" },
    ],
  };

  const templates = await prisma.webinarTemplate.createMany({
    data: [
      {
        niche: NicheType.COACH_CONSULTANT,
        name: "High-Ticket Coaching Funnel",
        description: "Convert cold traffic into $3k–$10k coaching clients using a proven evergreen structure.",
        isPremium: false,
        isPublic: true,
        tags: ["coaching", "high-ticket", "consulting", "evergreen"],
        structure: templateStructure,
      },
      {
        niche: NicheType.REAL_ESTATE,
        name: "Real Estate Lead Machine",
        description: "Turn motivated sellers and buyers into booked appointments — 24/7, no cold calling.",
        isPremium: false,
        isPublic: true,
        tags: ["real estate", "leads", "agents", "investors"],
        structure: templateStructure,
      },
      {
        niche: NicheType.SAAS,
        name: "SaaS Demo-to-Trial Converter",
        description: "Move prospects from curious to activated in one automated webinar session.",
        isPremium: true,
        isPublic: true,
        tags: ["saas", "demo", "activation", "software"],
        structure: templateStructure,
      },
      {
        niche: NicheType.TRAVEL,
        name: "Premium Travel Package Seller",
        description: "Sell $5k+ travel packages to dream-destination travelers using educational selling.",
        isPremium: false,
        isPublic: true,
        tags: ["travel", "luxury", "packages", "agents"],
        structure: templateStructure,
      },
      {
        niche: NicheType.LOCAL_SERVICES,
        name: "Local Service Authority Builder",
        description: "Position yourself as the go-to expert in your area and fill your calendar with premium clients.",
        isPremium: false,
        isPublic: true,
        tags: ["local", "services", "authority", "referrals"],
        structure: templateStructure,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Templates created");

  // ── Sample Webinars ───────────────────────────────────────
  const webinar1 = await prisma.webinar.create({
    data: {
      workspaceId: demoWorkspace.id,
      title: "The 3-Step System to Land High-Ticket Coaching Clients Without Cold Outreach",
      subtitle: "How to build a client acquisition machine that runs while you sleep",
      niche: NicheType.COACH_CONSULTANT,
      status: "PUBLISHED",
      mode: "EVERGREEN",
      slug: `demo-coaching-${nanoid(8)}`,
      durationMinutes: 75,
      hasWatermark: false,
      publishedAt: new Date(),
      generatorInputs: {
        niche: "coach_consultant",
        idealAudience: "Coaches stuck under $10k/month",
        painPoint: "Trading time for money with no scalable client acquisition system",
        desiredOutcome: "Consistent high-ticket clients on autopilot",
        offerName: "Business Acceleration Mastermind",
        offerType: "COACHING",
        pricePoint: 5000,
        tone: "motivational",
      },
      sections: {
        create: [
          {
            type: "hook",
            title: "Opening Hook",
            content: "What if you could wake up tomorrow with three qualified discovery calls already booked — without sending a single cold message? In the next 75 minutes, I'm going to show you exactly how I did it, and how you can replicate it regardless of your niche.",
            order: 1,
          },
          {
            type: "promise",
            title: "The Promise",
            content: "By the end of this training, you'll have a complete blueprint for a client-acquisition system that works 24 hours a day. No more chasing. No more posting and hoping. A real, automated funnel that delivers ready-to-buy clients to your calendar.",
            order: 2,
          },
          {
            type: "credibility",
            title: "Who Am I",
            content: "I spent three years as a coach who was brilliant at transforming clients but terrible at finding them. I tried everything — cold DMs, networking events, even paid ads that burned $8,000 with nothing to show. Then I discovered evergreen webinar funnels and everything changed.",
            order: 3,
          },
          {
            type: "belief_shift",
            title: "Belief Shift 1",
            content: "You've probably been told you need a massive audience or a huge following to sell high-ticket. That's false. The coaches I know who consistently close $5k–$20k clients have small, highly targeted audiences who trust them — not viral reach.",
            order: 4,
          },
          {
            type: "teaching",
            title: "Step 1: Nail Your Positioning",
            content: "Your first job isn't to sell. It's to be unmistakably clear about who you help and what result you deliver. Specificity is the currency of trust. We'll walk through the one-sentence positioning formula that makes your ideal client feel like you're speaking directly to them.",
            order: 5,
          },
          {
            type: "offer_transition",
            title: "Offer Bridge",
            content: "Now I want to show you the fastest path to implementing everything we've covered — and how you can have your first evergreen webinar funnel live within the next 14 days.",
            order: 6,
          },
          {
            type: "cta",
            title: "Call to Action",
            content: "If you're ready to install a client-acquisition system that runs while you sleep, click the button below and let's talk about what that looks like for your specific situation.",
            order: 7,
          },
        ],
      },
      offers: {
        create: [
          {
            name: "Business Acceleration Mastermind",
            type: "COACHING",
            price: 5000,
            originalPrice: 8000,
            description: "12-week intensive coaching program for coaches and consultants ready to scale past $10k/month with a proven evergreen system.",
            valueItems: [
              "12 weeks of live group coaching calls",
              "Done-with-you evergreen webinar setup",
              "Copywriting templates for every funnel stage",
              "Private community access",
              "Direct Slack access to Alex",
            ],
            checkoutUrl: "https://example.com/checkout",
            order: 1,
          },
        ],
      },
      bonuses: {
        create: [
          { name: "Webinar Script Swipe File", description: "30 proven webinar scripts across 10 niches, ready to adapt and deploy.", value: 997, order: 1 },
          { name: "Email Follow-Up Sequence", description: "14-day post-webinar email sequence that continues selling after the room closes.", value: 497, order: 2 },
          { name: "Private 1:1 Strategy Call", description: "30-minute call to map out your custom client acquisition strategy.", value: 500, order: 3 },
        ],
      },
      ctaSequences: {
        create: [
          {
            type: "SOFT",
            triggerAt: 600,
            headline: "Quick reminder...",
            body: "If you're serious about landing high-ticket clients on autopilot, stick with me — the best part is coming.",
            buttonText: "Keep watching",
            isActive: true,
            order: 1,
          },
          {
            type: "MID",
            triggerAt: 2700,
            headline: "Ready to implement this?",
            body: "If what you've seen so far resonates, I want to invite you to learn about the Business Acceleration Mastermind.",
            buttonText: "Tell me more →",
            buttonUrl: "https://example.com/checkout",
            isActive: true,
            order: 2,
          },
          {
            type: "FINAL",
            triggerAt: 4200,
            headline: "This is your moment.",
            body: "Everything we covered today can be yours, fully implemented, within 14 days. But the program fills fast.",
            buttonText: "Claim Your Spot →",
            buttonUrl: "https://example.com/checkout",
            isActive: true,
            order: 3,
          },
          {
            type: "URGENCY",
            triggerAt: 4500,
            headline: "⚡ 3 spots remaining at this price",
            body: "We limit cohort sizes to ensure every client gets personal attention. Once these spots are gone, they're gone.",
            buttonText: "Secure Your Spot Now →",
            buttonUrl: "https://example.com/checkout",
            isActive: true,
            order: 4,
          },
        ],
      },
      timedComments: {
        create: [
          { type: "SOCIAL_PROOF", authorName: "Sarah M.", content: "I used this exact approach and booked 4 discovery calls in a week! 🔥", triggerAt: 300, order: 1 },
          { type: "FAQ", authorName: "Marcus T.", content: "Question: Does this work if I'm just starting out?", triggerAt: 900, order: 2 },
          { type: "MODERATOR", authorName: "Alex Rivera", content: "Great question Marcus — yes, we cover this specifically in step 2 coming up.", triggerAt: 960, order: 3 },
          { type: "TESTIMONIAL", authorName: "Jennifer K.", content: "Went from $3k to $22k months after implementing this system. Worth every penny.", triggerAt: 1800, order: 4 },
          { type: "OBJECTION", authorName: "Dave R.", content: "I'm skeptical — I've tried funnels before and they didn't work", triggerAt: 2400, order: 5 },
          { type: "URGENCY", authorName: "System", content: "🚨 Only 3 spots left in the current cohort!", triggerAt: 4200, order: 6 },
          { type: "CTA_REMINDER", authorName: "Alex Rivera", content: "The enrollment link is now live below 👇 Let's get your system built!", triggerAt: 4500, order: 7 },
        ],
      },
      evergreenConfig: {
        create: {
          isSimulatedLive: true,
          viewerCountMin: 47,
          viewerCountMax: 312,
          replayEnabled: true,
          autoEmailEnabled: false,
        },
      },
      objections: {
        create: [
          {
            question: "What if I don't have an audience yet?",
            answer: "That's exactly why this system works so well for newcomers. You don't need a large audience — you need the right audience. We show you how to drive targeted traffic to your webinar from day one, including free and paid strategies that work even starting from zero.",
            order: 1,
          },
          {
            question: "Is this just another course I'll never finish?",
            answer: "This isn't a course — it's a done-with-you implementation program. You'll have your evergreen funnel live within 14 days because we build it together. The accountability structures in the program are specifically designed to defeat procrastination.",
            order: 2,
          },
          {
            question: "What if it doesn't work for my niche?",
            answer: "Webinar funnels work in virtually every niche where people exchange money for expertise or transformation. We have active clients in real estate, health coaching, business strategy, financial advising, and more. We'll customize the approach for your specific market.",
            order: 3,
          },
        ],
      },
    },
  });

  // ── Sample Analytics Events ───────────────────────────────
  const analyticsData = [
    { event: "webinar.viewed", properties: { webinarId: webinar1.id, sessionId: nanoid() } },
    { event: "webinar.viewed", properties: { webinarId: webinar1.id, sessionId: nanoid() } },
    { event: "webinar.completed", properties: { webinarId: webinar1.id, sessionId: nanoid() } },
    { event: "cta.clicked", properties: { webinarId: webinar1.id, ctaType: "FINAL" } },
    { event: "registration.created", properties: { webinarId: webinar1.id, email: "user@example.com" } },
    { event: "plan.upgraded", properties: { fromPlan: "FREE_TRIAL", toPlan: "PRO" } },
  ];

  for (const data of analyticsData) {
    await prisma.analyticsEvent.create({
      data: {
        workspaceId: demoWorkspace.id,
        webinarId: webinar1.id,
        event: data.event,
        properties: data.properties,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log("✅ Sample webinar + analytics created");

  // ── Affiliate ─────────────────────────────────────────────
  const affiliate = await prisma.affiliate.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      workspaceId: demoWorkspace.id,
      userId: demoUser.id,
      referralCode: "DEMO30",
      status: AffiliateStatus.ACTIVE,
      commissionRate: 0.30,
      paypalEmail: "demo@webinarforge.ai",
      approvedAt: new Date(),
    },
  });

  // Sample referrals
  const referredUser = await prisma.user.upsert({
    where: { email: "referred@example.com" },
    update: {},
    create: {
      email: "referred@example.com",
      name: "Casey Johnson",
      onboardingComplete: false,
    },
  });

  await prisma.referral.upsert({
    where: { referredUserId: referredUser.id },
    update: {},
    create: {
      affiliateId: affiliate.id,
      referredUserId: referredUser.id,
      referralCode: "DEMO30",
      convertedAt: new Date(),
    },
  });

  await prisma.commission.createMany({
    data: [
      {
        affiliateId: affiliate.id,
        amount: 89.10,
        currency: "usd",
        status: "APPROVED",
        description: "Starter plan recurring — Casey Johnson",
        approvedAt: new Date(),
      },
      {
        affiliateId: affiliate.id,
        amount: 89.10,
        currency: "usd",
        status: "PAID",
        description: "Starter plan recurring — Casey Johnson (month 2)",
        paidAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Affiliate + commissions seeded");

  // ── Integration Connections ───────────────────────────────
  await prisma.integrationConnection.createMany({
    data: [
      {
        workspaceId: demoWorkspace.id,
        provider: "STRIPE",
        isActive: true,
        metadata: { note: "Primary billing integration" },
        connectedAt: new Date(),
      },
      {
        workspaceId: demoWorkspace.id,
        provider: "ZAPIER",
        isActive: false,
        metadata: { note: "Ready to connect" },
      },
      {
        workspaceId: demoWorkspace.id,
        provider: "WEBHOOK",
        isActive: false,
      },
    ],
    skipDuplicates: true,
  });

  // Sample webhook subscription
  await prisma.webhookSubscription.create({
    data: {
      workspaceId: demoWorkspace.id,
      url: "https://example.com/webhooks/webinarforge",
      secret: nanoid(32),
      events: ["webinar.completed", "cta.clicked", "registration.created"],
      isActive: false,
      description: "Example endpoint — update URL to activate",
    },
  });

  console.log("✅ Integrations seeded");

  // ── Prompt Templates ─────────────────────────────────────
  await prisma.promptTemplate.createMany({
    data: [
      {
        key: "webinar_generator_main",
        name: "Webinar Generator — Main Prompt",
        description: "Generates the full webinar structure from user inputs",
        systemPrompt: `You are a world-class direct-response webinar strategist. Your job is to generate high-converting evergreen webinar content based on the user's business details. Write in an original voice — never use templated or clichéd webinar language. Focus on genuine transformation, specific results, and emotionally resonant messaging. Always respond with valid JSON matching the requested schema.`,
        userPrompt: `Generate a complete webinar structure for the following:

Niche: {{niche}}
Ideal Audience: {{idealAudience}}
Core Pain Point: {{painPoint}}
Desired Outcome: {{desiredOutcome}}
Offer Name: {{offerName}}
Offer Type: {{offerType}}
Price Point: ${{pricePoint}}
Tone: {{tone}}
Objections to Handle: {{objections}}
Guarantee: {{guarantee}}
CTA Goal: {{ctaGoal}}

Return a JSON object with: titleOptions (array of 5), openingHooks (array of 3), promiseStatement, credibilityAngle, beliefShifts (array of 3 objects with oldBelief/newBelief/bridgeStatement), teachingPoints (array of 3), offerTransition, offerStack (name/description/price/originalPrice/valueItems), bonuses (array of 3), urgencySection, ctaCopy (headline/body/buttonText/urgencyLine), faqItems (array of 5), followUpEmails (array of 3 with subject/body/sendAtHours).`,
        variables: ["niche", "idealAudience", "painPoint", "desiredOutcome", "offerName", "offerType", "pricePoint", "tone", "objections", "guarantee", "ctaGoal"],
        version: 1,
        isActive: true,
      },
      {
        key: "presenter_narration",
        name: "AI Presenter — Narration Generator",
        description: "Generates slide-by-slide narration in presenter voice",
        systemPrompt: `You are writing narration scripts for a webinar AI presenter. Match the presenter's defined speaking style and tone exactly. Keep narration natural, conversational, and persuasive without being salesy. Each narration should feel like a real person speaking with authority and warmth.`,
        userPrompt: `Generate narration for this webinar section.

Presenter Name: {{presenterName}}
Speaking Style: {{speakingStyle}}
Tone: {{tone}}
Section Type: {{sectionType}}
Section Content: {{content}}
Webinar Title: {{webinarTitle}}

Write the narration as if the presenter is speaking directly to a viewer. 150–250 words. No stage directions.`,
        variables: ["presenterName", "speakingStyle", "tone", "sectionType", "content", "webinarTitle"],
        version: 1,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Prompt templates seeded");
  console.log("\n🎉 Seeding complete! WebinarForge AI is ready.");
  console.log(`   Demo user: demo@webinarforge.ai`);
  console.log(`   Demo workspace: ${demoWorkspace.slug}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
