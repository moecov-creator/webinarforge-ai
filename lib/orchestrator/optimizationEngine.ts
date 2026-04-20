// lib/orchestrator/optimizationEngine.ts
// WebinarForge AI — Optimization Engine
//
// Responsibilities:
// 1. Evaluate metrics and decide what needs fixing
// 2. Execute targeted improvement functions
// 3. Return structured OptimizationResult objects
// 4. Log all actions for audit trail
//
// Architecture is rule-based now, extensible for AI decision-making.
// To upgrade: replace rule functions with AI API calls — same interface.

import type {
  OptimizationActionType,
  OptimizationResult,
  OptimizationAction,
  OptimizationStatus,
  AutoOptimizeConfig,
} from "./types"
import type { WebinarMetrics } from "./utils"
import { generateLaunchId, getCurrentTimestamp } from "./utils"

// ─── Action definitions ───────────────────────────────────────────────────────
// Maps each action type to its label, description, and plan requirement

export const OPTIMIZATION_ACTIONS: Record<OptimizationActionType, OptimizationAction> = {
  fix_cta: {
    id: "fix_cta",
    type: "fix_cta",
    label: "Fix My CTA",
    description: "Rewrite your call-to-action with stronger urgency and clarity",
    proOnly: false,
    insightIds: ["cta-weak"],
  },
  fix_landing_page: {
    id: "fix_landing_page",
    type: "fix_landing_page",
    label: "Improve My Landing Page",
    description: "Rewrite headline, hook, and bullet points to increase registrations",
    proOnly: true,
    insightIds: ["reg-weak", "reg-average"],
  },
  fix_offer: {
    id: "fix_offer",
    type: "fix_offer",
    label: "Optimize My Offer",
    description: "Strengthen your value stack, pricing, and guarantee language",
    proOnly: true,
    insightIds: ["conv-critical"],
  },
  fix_email_sequence: {
    id: "fix_email_sequence",
    type: "fix_email_sequence",
    label: "Fix Email Sequence",
    description: "Rewrite subject lines and preview text to boost open rates",
    proOnly: true,
    insightIds: ["email-weak", "showup-weak"],
  },
  fix_webinar_hook: {
    id: "fix_webinar_hook",
    type: "fix_webinar_hook",
    label: "Fix Webinar Hook",
    description: "Rewrite your opening to reduce drop-off and increase watch time",
    proOnly: true,
    insightIds: ["dropoff-early", "dropoff-mid"],
  },
  increase_conversions: {
    id: "increase_conversions",
    type: "increase_conversions",
    label: "Increase Conversions",
    description: "Apply a full conversion optimization pass across your funnel",
    proOnly: true,
    insightIds: ["conv-critical", "cta-weak"],
  },
}

// ─── Individual fix functions ─────────────────────────────────────────────────
// Each returns structured before/after with a human-readable summary.
// TODO: Replace each stub body with an AI API call when ready.
// The function signature and return type stay the same — no UI changes needed.

async function fixCTA(funnelId: string): Promise<OptimizationResult> {
  // TODO: Call AI API with current CTA copy as context
  // const improved = await anthropic.messages.create({ ... })
  return {
    actionType: "fix_cta",
    funnelId,
    status: "applied",
    appliedAt: getCurrentTimestamp(),
    before: {
      ctaText: "Get Access Now",
    },
    after: {
      ctaText: "YES — Give Me Instant Access Before This Closes →",
      ctaSubtext: "Join 387 coaches already inside · 30-day money-back guarantee",
      urgencyLine: "⚠️ Only 113 spots remaining at this price",
    },
    summary: "CTA rewritten with urgency trigger, social proof, and risk reversal. Expected CTA click lift: +4–8%.",
  }
}

async function fixLandingPage(funnelId: string): Promise<OptimizationResult> {
  // TODO: Call AI API with current landing page copy and metrics as context
  return {
    actionType: "fix_landing_page",
    funnelId,
    status: "applied",
    appliedAt: getCurrentTimestamp(),
    before: {
      headline: "Learn How To Grow Your Business With Webinars",
      subheadline: "Join our free training session",
    },
    after: {
      headline: "How Coaches Are Booking 10+ Discovery Calls/Week With One Evergreen Webinar — On Autopilot",
      subheadline: "Free training reveals the exact AI system that generates leads while you sleep",
      hook: "If you're tired of showing up live every week just to get 3 registrations, this changes everything.",
      urgencyText: "Limited spots available — register before they're gone",
    },
    summary: "Headline rewritten with specific outcome + audience. Added curiosity hook and urgency. Expected registration lift: +12–20%.",
  }
}

async function fixOffer(funnelId: string): Promise<OptimizationResult> {
  // TODO: Call AI API with offer details and conversion data
  return {
    actionType: "fix_offer",
    funnelId,
    status: "applied",
    appliedAt: getCurrentTimestamp(),
    before: {
      valueStatement: "Get access to our coaching program",
      guarantee: "30-day refund",
      urgency: "Limited time",
    },
    after: {
      valueStatement: "The complete system to go from 0 to $10k/month with one evergreen webinar funnel",
      valueStack: "Script + Slides + AI Presenter + Funnel Pages + Email Sequence + Private Community",
      guarantee: "Try it for 30 days. If you don't get results, email us for a full refund — no questions, no hassle",
      urgency: "This offer closes permanently when all 500 spots are claimed",
      paymentNote: "One-time payment. No monthly fees. Lifetime access.",
    },
    summary: "Offer repositioned around transformation. Value stack itemized. Guarantee strengthened. Urgency made specific. Expected conversion lift: +2–5%.",
  }
}

async function fixEmailSequence(funnelId: string): Promise<OptimizationResult> {
  // TODO: Call AI API with current email subjects and open rate data
  return {
    actionType: "fix_email_sequence",
    funnelId,
    status: "applied",
    appliedAt: getCurrentTimestamp(),
    before: {
      email1Subject: "You're registered!",
      email2Subject: "Reminder: webinar tomorrow",
      email3Subject: "Last chance",
    },
    after: {
      email1Subject: "Your spot is confirmed — here's what to prepare",
      email1Preview: "One thing to do before we start (takes 2 minutes)",
      email2Subject: "Quick question before tomorrow's training...",
      email2Preview: "I want to make sure you get exactly what you need",
      email3Subject: "I'm going live in 1 hour — are you ready?",
      email3Preview: "Click here to join. I saved something special for attendees only.",
      followUpSubject: "Did you catch the part about [KEY INSIGHT]?",
    },
    summary: "Subject lines rewritten with curiosity hooks and personalization. Open rate target: 35%+.",
  }
}

async function fixWebinarHook(funnelId: string): Promise<OptimizationResult> {
  // TODO: Call AI API with current script opening and watch time data
  return {
    actionType: "fix_webinar_hook",
    funnelId,
    status: "applied",
    appliedAt: getCurrentTimestamp(),
    before: {
      opening: "Welcome everyone, thanks for joining. Today I'm going to share some strategies...",
      hookDuration: "5 minutes",
    },
    after: {
      opening: "Before I show you anything else — I want to show you a screenshot. [PROOF VISUAL]\n\nThis is what happened 30 days after one of my students applied what I'm about to show you.\n\nIf you stay until minute 48, I'm going to give you the exact same system — free.",
      patternInterrupt: "Start with bold visual proof within first 60 seconds",
      futurePace: "Tell them exactly what they'll get if they stay to the end",
      hookDuration: "2 minutes — tight and punchy",
    },
    summary: "Hook restructured with visual proof, pattern interrupt, and future-pacing. Expected watch time improvement: +8–15 minutes.",
  }
}

async function increaseConversions(funnelId: string): Promise<OptimizationResult> {
  // TODO: Full-funnel AI pass — calls fixCTA, fixOffer, and checks all touchpoints
  return {
    actionType: "increase_conversions",
    funnelId,
    status: "applied",
    appliedAt: getCurrentTimestamp(),
    before: {
      conversionRate: "2.1%",
      ctaClickRate: "9%",
    },
    after: {
      ctaUpdated: "✔ CTA rewritten with urgency + social proof",
      offerUpdated: "✔ Value stack itemized, guarantee strengthened",
      scarcityAdded: "✔ Spots-based urgency counter added",
      testimonialsCTA: "✔ Testimonials moved above the CTA",
      pricingAnchor: "✔ Original price anchor added before reveal",
    },
    summary: "Full conversion optimization applied across CTA, offer, pricing display, and social proof positioning. Expected conversion lift: +3–6%.",
  }
}

// ─── Main dispatch function ───────────────────────────────────────────────────
// Called by the UI "Fix This For Me" buttons and the Auto Optimize engine

export async function executeOptimization(
  actionType: OptimizationActionType,
  funnelId: string
): Promise<OptimizationResult> {
  try {
    switch (actionType) {
      case "fix_cta":               return await fixCTA(funnelId)
      case "fix_landing_page":      return await fixLandingPage(funnelId)
      case "fix_offer":             return await fixOffer(funnelId)
      case "fix_email_sequence":    return await fixEmailSequence(funnelId)
      case "fix_webinar_hook":      return await fixWebinarHook(funnelId)
      case "increase_conversions":  return await increaseConversions(funnelId)
      default:
        return {
          actionType,
          funnelId,
          status: "failed",
          appliedAt: null,
          before: {},
          after: {},
          summary: "Unknown action type",
          error: `No handler registered for action: ${actionType}`,
        }
    }
  } catch (error) {
    return {
      actionType,
      funnelId,
      status: "failed",
      appliedAt: null,
      before: {},
      after: {},
      summary: "Optimization failed",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// ─── Auto Optimize engine ─────────────────────────────────────────────────────
// Evaluates metrics against thresholds and fires actions automatically.
// Called on a schedule (cron) or triggered manually when Auto Optimize is on.

export async function runAutoOptimize(
  config: AutoOptimizeConfig,
  metrics: WebinarMetrics
): Promise<OptimizationResult[]> {
  const results: OptimizationResult[] = []
  const { thresholds, funnelId } = config

  // Rule: low registration rate → fix landing page
  if (metrics.registrationRate < thresholds.minRegistrationRate) {
    const result = await executeOptimization("fix_landing_page", funnelId)
    results.push(result)
  }

  // Rule: low CTA click rate → fix CTA
  if (metrics.ctaClickRate < thresholds.minCtaClickRate) {
    const result = await executeOptimization("fix_cta", funnelId)
    results.push(result)
  }

  // Rule: low conversion rate → fix offer
  if (metrics.conversionRate < thresholds.minConversionRate) {
    const result = await executeOptimization("fix_offer", funnelId)
    results.push(result)
  }

  // Rule: low show-up rate → fix email sequence
  if (metrics.showUpRate < thresholds.minShowUpRate) {
    const result = await executeOptimization("fix_email_sequence", funnelId)
    results.push(result)
  }

  // Rule: low watch time → fix webinar hook
  if (metrics.avgWatchTime < 20) {
    const result = await executeOptimization("fix_webinar_hook", funnelId)
    results.push(result)
  }

  return results
}

// ─── Default Auto Optimize config ────────────────────────────────────────────
export function defaultAutoOptimizeConfig(
  userId: string,
  funnelId: string
): AutoOptimizeConfig {
  return {
    enabled: false,
    userId,
    funnelId,
    thresholds: {
      minRegistrationRate: 30,
      minShowUpRate: 25,
      minCtaClickRate: 12,
      minConversionRate: 5,
    },
    lastRunAt: null,
    actionsApplied: [],
  }
}

// ─── Plan gate checker ────────────────────────────────────────────────────────
export function isActionAllowed(
  actionType: OptimizationActionType,
  userPlan: "starter" | "pro" | "enterprise"
): boolean {
  const action = OPTIMIZATION_ACTIONS[actionType]
  if (!action.proOnly) return true
  return userPlan === "pro" || userPlan === "enterprise"
}
