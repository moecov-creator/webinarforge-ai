// lib/orchestrator/optimizationEngine.ts
// WebinarForge AI — Production Optimization Engine v2
//
// Responsibilities:
//   1. Evaluate all 8 funnel metrics against defined thresholds
//   2. Generate prioritized, typed recommendations
//   3. Execute fix actions with cooldown enforcement and safeguards
//   4. Support auto-optimize mode with concurrent action limits
//   5. Track history, versions, and revert readiness
//
// Architecture: rule-based now, drop-in AI upgrade path.
// To upgrade any action handler: replace the stub return with an AI API call.
// Same function signature — no UI or routing changes needed.

import type {
  FunnelMetrics,
  MetricEvaluation,
  MetricKey,
  MetricStatus,
  OptimizationActionType,
  OptimizationAction,
  OptimizationRecommendation,
  OptimizationResult,
  OptimizationStatus,
  FunnelOptimizationReport,
  ReportStatus,
  AutoOptimizeConfig,
  CooldownRecord,
  UserPlan,
} from "./types"
import { getCurrentTimestamp, generateLaunchId } from "./utils"

// ─── Metric thresholds ────────────────────────────────────────────────────────
// Single source of truth for all threshold values.
// Change here to update evaluations, UI badges, and auto-optimize rules.

export const THRESHOLDS: Record<MetricKey, { healthy: number; warning: number }> = {
  registration_rate:        { healthy: 35, warning: 20 },
  attendance_rate:          { healthy: 30, warning: 15 },
  watch_time_percent:       { healthy: 45, warning: 25 },
  cta_click_rate:           { healthy: 12, warning: 6  },
  sales_conversion_rate:    { healthy: 8,  warning: 3  },
  checkout_completion_rate: { healthy: 50, warning: 30 },
  follow_up_open_rate:      { healthy: 35, warning: 20 },
  follow_up_click_rate:     { healthy: 4,  warning: 2  },
}

// ─── Priority order ───────────────────────────────────────────────────────────
// Lower number = higher priority. Matches spec exactly.

const METRIC_PRIORITY: Record<MetricKey, number> = {
  sales_conversion_rate:    1,
  cta_click_rate:           2,
  registration_rate:        3,
  watch_time_percent:       4,
  attendance_rate:          5,
  checkout_completion_rate: 6,
  follow_up_click_rate:     7,
  follow_up_open_rate:      8,
}

// ─── Action definitions ───────────────────────────────────────────────────────

export const OPTIMIZATION_ACTIONS: Record<OptimizationActionType, OptimizationAction> = {
  // ── New canonical actions ──
  rewrite_landing_page: {
    id: "rewrite_landing_page",
    type: "rewrite_landing_page",
    label: "Improve My Landing Page",
    description: "Rewrite headline, hook, and bullet points to increase registrations",
    proOnly: true,
    insightIds: ["reg-weak", "reg-warning"],
    autoApplicable: true,
    confirmationRequired: false,
  },
  reduce_form_friction: {
    id: "reduce_form_friction",
    type: "reduce_form_friction",
    label: "Reduce Form Friction",
    description: "Simplify registration form to remove barriers and increase opt-in rate",
    proOnly: false,
    insightIds: ["reg-weak", "reg-warning"],
    autoApplicable: true,
    confirmationRequired: false,
  },
  rewrite_reminder_sequence: {
    id: "rewrite_reminder_sequence",
    type: "rewrite_reminder_sequence",
    label: "Fix Reminder Sequence",
    description: "Rewrite reminder emails with urgency and anticipation to boost attendance",
    proOnly: true,
    insightIds: ["attendance-weak", "attendance-warning"],
    autoApplicable: true,
    confirmationRequired: false,
  },
  improve_webinar_hook: {
    id: "improve_webinar_hook",
    type: "improve_webinar_hook",
    label: "Fix Webinar Hook",
    description: "Rewrite your opening 60 seconds to stop drop-off and increase watch time",
    proOnly: true,
    insightIds: ["watch-weak", "watch-warning"],
    autoApplicable: false,
    confirmationRequired: true,
  },
  rewrite_cta_section: {
    id: "rewrite_cta_section",
    type: "rewrite_cta_section",
    label: "Fix My CTA",
    description: "Rewrite call-to-action with urgency, social proof, and risk reversal",
    proOnly: false,
    insightIds: ["cta-weak", "cta-warning"],
    autoApplicable: true,
    confirmationRequired: false,
  },
  optimize_offer_stack: {
    id: "optimize_offer_stack",
    type: "optimize_offer_stack",
    label: "Optimize My Offer",
    description: "Strengthen value stack, pricing framing, and guarantee language",
    proOnly: true,
    insightIds: ["conv-weak", "conv-warning"],
    autoApplicable: false,
    confirmationRequired: true,
  },
  improve_checkout_flow: {
    id: "improve_checkout_flow",
    type: "improve_checkout_flow",
    label: "Improve Checkout Flow",
    description: "Reduce checkout friction and add trust signals to increase completions",
    proOnly: true,
    insightIds: ["checkout-weak", "checkout-warning"],
    autoApplicable: false,
    confirmationRequired: true,
  },
  rewrite_follow_up_sequence: {
    id: "rewrite_follow_up_sequence",
    type: "rewrite_follow_up_sequence",
    label: "Fix Email Follow-Up",
    description: "Rewrite follow-up subject lines and copy to boost opens and clicks",
    proOnly: true,
    insightIds: ["followup-open-weak", "followup-click-weak"],
    autoApplicable: true,
    confirmationRequired: false,
  },
  // ── Legacy aliases (for backward compat with existing UI buttons) ──
  fix_cta: {
    id: "fix_cta", type: "fix_cta",
    label: "Fix My CTA", description: "Rewrite CTA with urgency and social proof",
    proOnly: false, insightIds: ["cta-weak"], autoApplicable: true, confirmationRequired: false,
  },
  fix_landing_page: {
    id: "fix_landing_page", type: "fix_landing_page",
    label: "Improve Landing Page", description: "Rewrite headline and hook",
    proOnly: true, insightIds: ["reg-weak"], autoApplicable: true, confirmationRequired: false,
  },
  fix_offer: {
    id: "fix_offer", type: "fix_offer",
    label: "Optimize My Offer", description: "Strengthen value stack and guarantee",
    proOnly: true, insightIds: ["conv-weak"], autoApplicable: false, confirmationRequired: true,
  },
  fix_email_sequence: {
    id: "fix_email_sequence", type: "fix_email_sequence",
    label: "Fix Email Sequence", description: "Rewrite subject lines",
    proOnly: true, insightIds: ["followup-open-weak"], autoApplicable: true, confirmationRequired: false,
  },
  fix_webinar_hook: {
    id: "fix_webinar_hook", type: "fix_webinar_hook",
    label: "Fix Webinar Hook", description: "Rewrite opening to reduce drop-off",
    proOnly: true, insightIds: ["watch-weak"], autoApplicable: false, confirmationRequired: true,
  },
  increase_conversions: {
    id: "increase_conversions", type: "increase_conversions",
    label: "Increase Conversions", description: "Full-funnel conversion optimization pass",
    proOnly: true, insightIds: ["conv-weak", "cta-weak"], autoApplicable: false, confirmationRequired: true,
  },
}

// ─── STEP 1: Rules evaluator ─────────────────────────────────────────────────
// Evaluates each metric against thresholds and returns typed MetricEvaluation[]

export function evaluateMetrics(metrics: FunnelMetrics): MetricEvaluation[] {
  return (Object.keys(THRESHOLDS) as MetricKey[]).map((metric) => {
    const value = metrics[metric]
    const { healthy, warning } = THRESHOLDS[metric]

    let status: MetricStatus
    if (value >= healthy) {
      status = "healthy"
    } else if (value >= warning) {
      status = "warning"
    } else {
      status = "critical"
    }

    return {
      metric,
      value,
      status,
      threshold: { healthy, warning },
      delta: value - healthy,  // negative = below healthy threshold
    }
  })
}

// ─── STEP 2: Recommendation generator ────────────────────────────────────────
// Maps each failing evaluation to one or more typed recommendations

export function generateRecommendations(
  evaluations: MetricEvaluation[],
  funnelId: string
): OptimizationRecommendation[] {
  const recommendations: OptimizationRecommendation[] = []

  for (const eval_ of evaluations) {
    if (eval_.status === "healthy") continue

    const severity = eval_.status === "critical" ? "critical" : "warning"
    const priority = METRIC_PRIORITY[eval_.metric]

    switch (eval_.metric) {

      case "registration_rate":
        recommendations.push({
          id: `${funnelId}_rewrite_landing_page_${Date.now()}`,
          type: "rewrite_landing_page",
          title: "Rewrite Your Landing Page",
          reason: `Registration rate is ${eval_.value}% — ${
            severity === "critical" ? "critically" : "significantly"
          } below the ${eval_.threshold.healthy}% target. Likely causes: weak headline, unclear value proposition.`,
          severity,
          impactedMetric: "registration_rate",
          recommendedAction: "Rewrite headline with a specific outcome + audience, add a curiosity hook, and move the primary CTA above the fold.",
          autoApplicable: true,
          requiresPro: true,
          priority,
        })
        recommendations.push({
          id: `${funnelId}_reduce_form_friction_${Date.now() + 1}`,
          type: "reduce_form_friction",
          title: "Reduce Form Friction",
          reason: "High-friction registration forms (3+ fields) reduce conversion by up to 50%.",
          severity: "warning",
          impactedMetric: "registration_rate",
          recommendedAction: "Reduce form to name + email only. Remove phone field. Add privacy note below submit button.",
          autoApplicable: true,
          requiresPro: false,
          priority: priority + 0.5,  // slightly lower than landing page rewrite
        })
        break

      case "attendance_rate":
        recommendations.push({
          id: `${funnelId}_rewrite_reminder_sequence_${Date.now()}`,
          type: "rewrite_reminder_sequence",
          title: "Fix Your Reminder Sequence",
          reason: `Attendance rate is ${eval_.value}% — ${
            severity === "critical" ? "critically" : "significantly"
          } below the ${eval_.threshold.healthy}% benchmark. Registrants are not showing up.`,
          severity,
          impactedMetric: "attendance_rate",
          recommendedAction: "Add a 1-hour SMS reminder. Rewrite email reminders with urgency and an exclusive-to-attendees bonus hook.",
          autoApplicable: true,
          requiresPro: true,
          priority,
        })
        break

      case "watch_time_percent":
        recommendations.push({
          id: `${funnelId}_improve_webinar_hook_${Date.now()}`,
          type: "improve_webinar_hook",
          title: "Improve Your Webinar Hook",
          reason: `Average watch time is ${eval_.value}% of the webinar — below the ${eval_.threshold.healthy}% target. Most attendees are leaving before the offer.`,
          severity,
          impactedMetric: "watch_time_percent",
          recommendedAction: "Open with visual proof within the first 60 seconds. State a specific promise ('If you stay to minute 48, I'll give you...') before the 2-minute mark.",
          autoApplicable: false,
          requiresPro: true,
          priority,
        })
        break

      case "cta_click_rate":
        recommendations.push({
          id: `${funnelId}_rewrite_cta_section_${Date.now()}`,
          type: "rewrite_cta_section",
          title: "Rewrite Your CTA Section",
          reason: `CTA click rate is ${eval_.value}% — below the ${eval_.threshold.healthy}% target. Offer transition may be weak or CTA timing is off.`,
          severity,
          impactedMetric: "cta_click_rate",
          recommendedAction: "Add urgency trigger (scarcity counter), social proof (X people joined), and risk reversal (guarantee) immediately before the CTA button. Move CTA earlier if webinar runs over 60 minutes.",
          autoApplicable: true,
          requiresPro: false,
          priority,
        })
        break

      case "sales_conversion_rate":
        recommendations.push({
          id: `${funnelId}_optimize_offer_stack_${Date.now()}`,
          type: "optimize_offer_stack",
          title: "Optimize Your Offer Stack",
          reason: `Sales conversion rate is ${eval_.value}% — ${
            severity === "critical" ? "critically" : "significantly"
          } below the ${eval_.threshold.healthy}% benchmark. Weak offer stack or insufficient proof is likely.`,
          severity,
          impactedMetric: "sales_conversion_rate",
          recommendedAction: "Itemize and anchor your value stack. Add 3+ specific testimonials with results before the price reveal. Strengthen guarantee language. Add payment plan option if price exceeds $500.",
          autoApplicable: false,
          requiresPro: true,
          priority,
        })
        break

      case "checkout_completion_rate":
        recommendations.push({
          id: `${funnelId}_improve_checkout_flow_${Date.now()}`,
          type: "improve_checkout_flow",
          title: "Improve Your Checkout Flow",
          reason: `Checkout completion is ${eval_.value}% — below the ${eval_.threshold.healthy}% target. Trust issues or friction is causing abandonment at the payment step.`,
          severity,
          impactedMetric: "checkout_completion_rate",
          recommendedAction: "Add security badges and SSL trust seal above the payment form. Add a guarantee reminder below the buy button. Remove unnecessary fields. Offer PayPal as alternative payment method.",
          autoApplicable: false,
          requiresPro: true,
          priority,
        })
        break

      case "follow_up_open_rate":
        recommendations.push({
          id: `${funnelId}_rewrite_follow_up_opens_${Date.now()}`,
          type: "rewrite_follow_up_sequence",
          title: "Rewrite Follow-Up Subject Lines",
          reason: `Follow-up email open rate is ${eval_.value}% — below the ${eval_.threshold.healthy}% benchmark. Subject lines are not compelling enough.`,
          severity,
          impactedMetric: "follow_up_open_rate",
          recommendedAction: "Rewrite all subject lines with curiosity hooks or open loops. Test a 'did you watch the replay?' angle. Avoid spammy words (free, guarantee, limited) in subject lines.",
          autoApplicable: true,
          requiresPro: true,
          priority,
        })
        break

      case "follow_up_click_rate":
        recommendations.push({
          id: `${funnelId}_rewrite_follow_up_clicks_${Date.now()}`,
          type: "rewrite_follow_up_sequence",
          title: "Fix Follow-Up Email CTAs",
          reason: `Follow-up click rate is ${eval_.value}% — below the ${eval_.threshold.healthy}% target. Email body or CTA links are not driving action.`,
          severity,
          impactedMetric: "follow_up_click_rate",
          recommendedAction: "Use a single CTA per email (not multiple links). Add urgency to the replay offer (expires in 48 hours). Use a PS line with a direct link and additional urgency hook.",
          autoApplicable: true,
          requiresPro: true,
          priority,
        })
        break
    }
  }

  // Deduplicate: if same action type appears twice (e.g. follow-up open + click both trigger rewrite),
  // keep only the higher-severity one
  const seen = new Map<OptimizationActionType, OptimizationRecommendation>()
  for (const rec of recommendations) {
    const existing = seen.get(rec.type)
    if (!existing || rec.severity === "critical") {
      seen.set(rec.type, rec)
    }
  }

  return Array.from(seen.values())
}

// ─── STEP 3: Priority sorter ──────────────────────────────────────────────────
// Sorts recommendations by metric priority spec, then by severity within same priority

export function sortRecommendations(
  recommendations: OptimizationRecommendation[]
): OptimizationRecommendation[] {
  return [...recommendations].sort((a, b) => {
    // Primary: metric priority (lower = more urgent)
    const priorityDiff = a.priority - b.priority
    if (priorityDiff !== 0) return priorityDiff
    // Secondary: severity (critical before warning)
    if (a.severity === "critical" && b.severity !== "critical") return -1
    if (b.severity === "critical" && a.severity !== "critical") return 1
    return 0
  })
}

// ─── STEP 4: Report builder ───────────────────────────────────────────────────
// Combines evaluation + recommendations into the full typed report

export function buildOptimizationReport(
  funnelId: string,
  metrics: FunnelMetrics
): FunnelOptimizationReport {
  const evaluations = evaluateMetrics(metrics)
  const raw = generateRecommendations(evaluations, funnelId)
  const recommendations = sortRecommendations(raw)

  const hasCritical = evaluations.some((e) => e.status === "critical")
  const hasWarning = evaluations.some((e) => e.status === "warning")

  const status: ReportStatus = hasCritical
    ? "critical"
    : hasWarning
    ? "needs_attention"
    : "healthy"

  return {
    funnelId,
    evaluatedAt: getCurrentTimestamp(),
    status,
    evaluations,
    recommendations,
    topPriorityRecommendation: recommendations[0] ?? null,
  }
}

// ─── Cooldown checker ─────────────────────────────────────────────────────────

export function isCooledDown(
  actionType: OptimizationActionType,
  cooldowns: CooldownRecord[]
): boolean {
  const record = cooldowns.find(
    (c) => c.actionType === actionType
  )
  if (!record) return true  // no record = no cooldown
  return new Date() >= new Date(record.nextAllowedAt)
}

export function buildCooldownRecord(
  actionType: OptimizationActionType,
  funnelId: string,
  cooldownHours = 72
): CooldownRecord {
  const now = new Date()
  const next = new Date(now.getTime() + cooldownHours * 60 * 60 * 1000)
  return {
    actionType,
    funnelId,
    lastAppliedAt: now.toISOString(),
    cooldownHours,
    nextAllowedAt: next.toISOString(),
  }
}

// ─── Plan gate checker ────────────────────────────────────────────────────────

export function isActionAllowed(
  actionType: OptimizationActionType,
  userPlan: UserPlan
): boolean {
  const action = OPTIMIZATION_ACTIONS[actionType]
  if (!action) return false
  if (!action.proOnly) return true
  return userPlan === "pro" || userPlan === "enterprise"
}

export function getUpgradePrompt(actionType: OptimizationActionType): string {
  const labels: Partial<Record<OptimizationActionType, string>> = {
    rewrite_landing_page: "Automated landing page rewrites",
    optimize_offer_stack: "AI offer optimization",
    improve_checkout_flow: "Checkout flow improvements",
    rewrite_follow_up_sequence: "Follow-up sequence rewrites",
    improve_webinar_hook: "Webinar hook optimization",
    rewrite_reminder_sequence: "Reminder sequence fixes",
    fix_landing_page: "Landing page optimization",
    fix_offer: "Offer stack optimization",
    fix_webinar_hook: "Webinar hook rewrite",
    increase_conversions: "Full-funnel conversion optimization",
  }
  const feature = labels[actionType] || "This optimization"
  return `${feature} requires a Pro plan. Upgrade to apply fixes automatically and access the full optimization suite.`
}

// ─── Concurrency guard ────────────────────────────────────────────────────────

export function canRunOptimization(
  config: AutoOptimizeConfig
): { allowed: boolean; reason?: string } {
  const activeCount = config.actionsApplied.filter(
    (r) => r.status === "running"
  ).length

  if (activeCount >= config.maxConcurrentOptimizations) {
    return {
      allowed: false,
      reason: `Maximum ${config.maxConcurrentOptimizations} concurrent optimizations reached. Wait for current ones to complete.`,
    }
  }

  return { allowed: true }
}

// ─── STEP 5: Action handlers ──────────────────────────────────────────────────
// Each handler returns a fully structured OptimizationResult.
// TODO markers show exactly where to connect AI calls when ready.

function makeResult(
  actionType: OptimizationActionType,
  funnelId: string,
  before: Record<string, string>,
  after: Record<string, string>,
  summary: string,
  autoApplicable: boolean
): OptimizationResult {
  const now = new Date()
  const revertUntil = new Date(now.getTime() + 48 * 60 * 60 * 1000)
  return {
    id: generateLaunchId(),
    actionType,
    funnelId,
    status: "applied",
    appliedAt: now.toISOString(),
    before,
    after,
    summary,
    autoApplicable,
    version: 1,
    revertableUntil: revertUntil.toISOString(),
  }
}

async function handleRewriteLandingPage(funnelId: string): Promise<OptimizationResult> {
  // TODO: Call AI API — pass current headline, subheadline, metrics as context
  // const res = await anthropic.messages.create({ model: "claude-opus-4-6", messages: [{ role: "user", content: buildLandingPagePrompt(funnelId) }] })
  return makeResult(
    "rewrite_landing_page", funnelId,
    { headline: "Learn How To Grow Your Business With Webinars", subheadline: "Join our free training session" },
    {
      headline: "How Coaches Are Booking 10+ Discovery Calls/Week With One Evergreen Webinar — On Autopilot",
      subheadline: "Free training reveals the exact AI system that generates leads while you sleep",
      hook: "If you're tired of showing up live every week just to get 3 registrations, this changes everything.",
      urgencyText: "Limited spots available — register before they're gone",
    },
    "Headline rewritten with specific outcome + audience. Curiosity hook and urgency added. Expected registration lift: +12–20%.",
    true
  )
}

async function handleReduceFormFriction(funnelId: string): Promise<OptimizationResult> {
  // TODO: Fetch current form fields from DB and apply reduction
  return makeResult(
    "reduce_form_friction", funnelId,
    { fields: "First Name, Last Name, Email, Phone, Company", fieldCount: "5" },
    { fields: "First Name, Email", fieldCount: "2", privacyNote: "We respect your privacy. Unsubscribe anytime." },
    "Form reduced from 5 fields to 2. Phone and company fields removed. Privacy note added. Expected opt-in lift: +15–30%.",
    true
  )
}

async function handleRewriteReminderSequence(funnelId: string): Promise<OptimizationResult> {
  // TODO: Call AI API with registrant data and webinar topic
  return makeResult(
    "rewrite_reminder_sequence", funnelId,
    { reminder1Subject: "Your webinar is tomorrow", reminder2Subject: "Reminder: starts in 1 hour" },
    {
      reminder1Subject: "Quick question before tomorrow...",
      reminder1Preview: "I want to make sure you get exactly what you need from this",
      reminder2Subject: "Starting in 1 hour — I saved something special for attendees only",
      reminder2Preview: "Click to join. This won't be available in the replay.",
      smsReminder: "WebinarForge: Your training starts in 60 min! Join here: [LINK] — Reply STOP to unsubscribe",
    },
    "Reminder emails rewritten with curiosity hooks and exclusive-to-attendees incentive. SMS reminder added. Expected attendance lift: +8–15%.",
    true
  )
}

async function handleImproveWebinarHook(funnelId: string): Promise<OptimizationResult> {
  // TODO: Call AI API with current webinar script intro section and watch time data
  return makeResult(
    "improve_webinar_hook", funnelId,
    {
      opening: "Welcome everyone, thanks for joining today. I'm excited to share some strategies with you...",
      hookDuration: "5 minutes",
      proofPosition: "minute 15",
    },
    {
      opening: "Before I show you anything — I want to show you this. [PROOF VISUAL: student result screenshot]\n\nThis happened 30 days after [STUDENT NAME] applied exactly what I'm about to walk you through.\n\nStay until minute 48 and I'll give you the exact template they used — completely free.",
      patternInterrupt: "Open with visual proof within first 45 seconds",
      futurePace: "State the minute-48 bonus promise within first 90 seconds",
      hookDuration: "2 minutes maximum — tight and punchy",
      proofPosition: "First 45 seconds",
    },
    "Hook restructured with visual proof, pattern interrupt, and a minute-48 commitment device. Expected watch time improvement: +10–20%.",
    false
  )
}

async function handleRewriteCtaSection(funnelId: string): Promise<OptimizationResult> {
  // TODO: Call AI API with current CTA copy and click rate data
  return makeResult(
    "rewrite_cta_section", funnelId,
    { ctaText: "Get Access Now", urgency: "Limited time offer" },
    {
      ctaText: "YES — Give Me Instant Access Before This Closes →",
      ctaSubtext: "Join 387+ coaches already inside · 30-day money-back guarantee",
      urgencyCounter: "⚠️ Only 113 spots remaining at this price",
      guarantee: "Try it risk-free for 30 days. Full refund if you're not blown away.",
      socialProof: "[NAME] from [CITY] just joined 4 minutes ago",
    },
    "CTA rewritten with urgency trigger, real-time social proof, and explicit risk reversal. Expected CTA click lift: +4–9%.",
    true
  )
}

async function handleOptimizeOfferStack(funnelId: string): Promise<OptimizationResult> {
  // TODO: Call AI API with offer details, pricing, and conversion data
  return makeResult(
    "optimize_offer_stack", funnelId,
    { valueStatement: "Get access to our program", guarantee: "30-day refund", urgency: "Limited time" },
    {
      valueStatement: "The complete system: from first webinar to $10k/month on autopilot",
      valueStack: "✔ AI Webinar Script ($997 value)\n✔ Slide Deck Template ($297)\n✔ AI Avatar Presenter ($497)\n✔ Funnel Pages + Copy ($497)\n✔ 7-Email Follow-Up Sequence ($297)\n✔ Private Mastermind Community ($497)",
      totalValue: "$3,082 total value",
      guarantee: "Try it for 30 days. If you don't get results, email us for a full refund — no questions, no hassle, no hard feelings.",
      urgency: "This offer closes permanently when all 500 early-bird spots are claimed",
      paymentPlan: "Or 3 payments of $[X] — same lifetime access",
      priceAnchor: "Normal price: $[HIGHER PRICE] — early bird: $[OFFER PRICE]",
    },
    "Offer repositioned around transformation outcome. Value stack itemized with dollar anchors. Guarantee strengthened. Payment plan option added. Expected conversion lift: +3–6%.",
    false
  )
}

async function handleImproveCheckoutFlow(funnelId: string): Promise<OptimizationResult> {
  // TODO: Fetch checkout config and apply trust/friction improvements
  return makeResult(
    "improve_checkout_flow", funnelId,
    { trustBadges: "none", fields: "Name, Email, Card, Address, City, State, Zip", paymentOptions: "Credit card only" },
    {
      trustBadges: "SSL badge, McAfee Secure, Stripe Verified — displayed above payment form",
      fields: "Name, Email, Card number (auto-formatted) — billing address auto-detected",
      paymentOptions: "Credit card + PayPal + Apple Pay",
      guaranteeReminder: "30-day money-back guarantee reminder shown below buy button",
      abandonmentRecovery: "Exit-intent popup with guarantee reminder enabled",
    },
    "Checkout simplified to 3 essential fields. Trust badges and payment alternatives added. Abandonment recovery enabled. Expected completion lift: +10–20%.",
    false
  )
}

async function handleRewriteFollowUpSequence(funnelId: string): Promise<OptimizationResult> {
  // TODO: Call AI API with current sequence and open/click rate data
  return makeResult(
    "rewrite_follow_up_sequence", funnelId,
    {
      email1Subject: "You're registered!",
      email2Subject: "Reminder: webinar tomorrow",
      email3Subject: "Last chance to watch the replay",
    },
    {
      email1Subject: "Your spot is confirmed — do this one thing first",
      email1Preview: "Takes 2 minutes and makes a big difference (see inside)",
      email2Subject: "Quick question before tomorrow's training...",
      email2Preview: "I want to make sure you get what you need",
      email3Subject: "I'm going live in 1 hour — I saved something for attendees",
      email3Preview: "Won't be in the replay. Click to join before it starts.",
      email4Subject: "Did you catch the part about [KEY INSIGHT]?",
      email4Preview: "Replay is up — but only for 48 more hours",
      replayUrgency: "Replay expires: [TIMESTAMP] — after this it's gone forever",
    },
    "Full follow-up sequence rewritten with curiosity hooks, urgency, and a replay expiry deadline. Open rate target: 35%+. Click rate target: 5%+.",
    true
  )
}

// Legacy handlers — map to new canonical actions for backward compat
async function handleLegacyFixCta(funnelId: string): Promise<OptimizationResult> {
  const result = await handleRewriteCtaSection(funnelId)
  return { ...result, actionType: "fix_cta" }
}

async function handleLegacyFixLandingPage(funnelId: string): Promise<OptimizationResult> {
  const result = await handleRewriteLandingPage(funnelId)
  return { ...result, actionType: "fix_landing_page" }
}

async function handleLegacyFixOffer(funnelId: string): Promise<OptimizationResult> {
  const result = await handleOptimizeOfferStack(funnelId)
  return { ...result, actionType: "fix_offer" }
}

async function handleLegacyFixEmailSequence(funnelId: string): Promise<OptimizationResult> {
  const result = await handleRewriteFollowUpSequence(funnelId)
  return { ...result, actionType: "fix_email_sequence" }
}

async function handleLegacyFixWebinarHook(funnelId: string): Promise<OptimizationResult> {
  const result = await handleImproveWebinarHook(funnelId)
  return { ...result, actionType: "fix_webinar_hook" }
}

async function handleIncreaseConversions(funnelId: string): Promise<OptimizationResult> {
  // Compound action — runs CTA + offer stack fixes in sequence
  // TODO: Replace with full AI pass across all funnel touchpoints
  return makeResult(
    "increase_conversions", funnelId,
    { conversionRate: "2.1%", ctaClickRate: "9%" },
    {
      ctaUpdated: "✔ CTA rewritten with urgency + social proof",
      offerUpdated: "✔ Value stack itemized with dollar anchors",
      scarcityAdded: "✔ Spots-based urgency counter activated",
      testimonialsRepositioned: "✔ Testimonials moved above CTA",
      priceAnchorAdded: "✔ Original price anchor shown before offer reveal",
      paymentPlanAdded: "✔ 3-pay option added",
    },
    "Full conversion optimization applied across CTA, offer, pricing display, and social proof. Expected conversion lift: +3–7%.",
    false
  )
}

// ─── STEP 6: Main dispatch ─────────────────────────────────────────────────────
// Entry point called by UI buttons and Auto Optimize engine.
// Enforces cooldowns, concurrency, and plan gating before executing.

export async function executeOptimization(
  actionType: OptimizationActionType,
  funnelId: string,
  config?: AutoOptimizeConfig
): Promise<OptimizationResult> {
  // Check cooldown if config provided
  if (config && !isCooledDown(actionType, config.cooldowns)) {
    const record = config.cooldowns.find((c) => c.actionType === actionType)!
    return {
      id: generateLaunchId(),
      actionType,
      funnelId,
      status: "failed",
      appliedAt: null,
      before: {},
      after: {},
      summary: `Cooldown active — next allowed at ${new Date(record.nextAllowedAt).toLocaleString()}`,
      autoApplicable: false,
      version: 0,
      revertableUntil: null,
      error: `Action ${actionType} is in cooldown until ${record.nextAllowedAt}`,
    }
  }

  // Check concurrency limit if config provided
  if (config) {
    const { allowed, reason } = canRunOptimization(config)
    if (!allowed) {
      return {
        id: generateLaunchId(),
        actionType,
        funnelId,
        status: "failed",
        appliedAt: null,
        before: {},
        after: {},
        summary: reason ?? "Concurrency limit reached",
        autoApplicable: false,
        version: 0,
        revertableUntil: null,
        error: reason,
      }
    }
  }

  try {
    switch (actionType) {
      case "rewrite_landing_page":      return await handleRewriteLandingPage(funnelId)
      case "reduce_form_friction":      return await handleReduceFormFriction(funnelId)
      case "rewrite_reminder_sequence": return await handleRewriteReminderSequence(funnelId)
      case "improve_webinar_hook":      return await handleImproveWebinarHook(funnelId)
      case "rewrite_cta_section":       return await handleRewriteCtaSection(funnelId)
      case "optimize_offer_stack":      return await handleOptimizeOfferStack(funnelId)
      case "improve_checkout_flow":     return await handleImproveCheckoutFlow(funnelId)
      case "rewrite_follow_up_sequence":return await handleRewriteFollowUpSequence(funnelId)
      // legacy aliases
      case "fix_cta":                   return await handleLegacyFixCta(funnelId)
      case "fix_landing_page":          return await handleLegacyFixLandingPage(funnelId)
      case "fix_offer":                 return await handleLegacyFixOffer(funnelId)
      case "fix_email_sequence":        return await handleLegacyFixEmailSequence(funnelId)
      case "fix_webinar_hook":          return await handleLegacyFixWebinarHook(funnelId)
      case "increase_conversions":      return await handleIncreaseConversions(funnelId)
      default:
        return {
          id: generateLaunchId(),
          actionType,
          funnelId,
          status: "failed",
          appliedAt: null,
          before: {},
          after: {},
          summary: "Unknown action type",
          autoApplicable: false,
          version: 0,
          revertableUntil: null,
          error: `No handler registered for: ${actionType}`,
        }
    }
  } catch (error) {
    return {
      id: generateLaunchId(),
      actionType,
      funnelId,
      status: "failed",
      appliedAt: null,
      before: {},
      after: {},
      summary: "Optimization failed — check error log",
      autoApplicable: false,
      version: 0,
      revertableUntil: null,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// ─── Auto Optimize runner ─────────────────────────────────────────────────────
// Evaluates metrics, generates report, then applies all autoApplicable actions
// that are within cooldown and concurrency limits.

export async function runAutoOptimize(
  config: AutoOptimizeConfig,
  metrics: FunnelMetrics
): Promise<{ report: FunnelOptimizationReport; results: OptimizationResult[] }> {
  const report = buildOptimizationReport(config.funnelId, metrics)
  const results: OptimizationResult[] = []

  // Only execute actions that are: auto-applicable, not in cooldown, within concurrency limit
  for (const rec of report.recommendations) {
    const actionDef = OPTIMIZATION_ACTIONS[rec.type]
    if (!actionDef?.autoApplicable) continue
    if (!isCooledDown(rec.type, config.cooldowns)) continue
    if (results.length + config.actionsApplied.filter(r => r.status === "running").length
        >= config.maxConcurrentOptimizations) break

    const result = await executeOptimization(rec.type, config.funnelId, config)
    if (result.status === "applied") {
      results.push(result)
      // Update cooldown record — in production this would be persisted to DB
      // TODO: await db.cooldownRecord.upsert({ where: { actionType, funnelId }, data: buildCooldownRecord(...) })
    }
  }

  return { report, results }
}

// ─── Default config factory ───────────────────────────────────────────────────

export function defaultAutoOptimizeConfig(
  userId: string,
  funnelId: string
): AutoOptimizeConfig {
  return {
    enabled: false,
    userId,
    funnelId,
    thresholds: {
      minRegistrationRate: THRESHOLDS.registration_rate.warning,
      minAttendanceRate: THRESHOLDS.attendance_rate.warning,
      minWatchTimePercent: THRESHOLDS.watch_time_percent.warning,
      minCtaClickRate: THRESHOLDS.cta_click_rate.warning,
      minConversionRate: THRESHOLDS.sales_conversion_rate.warning,
      minCheckoutCompletionRate: THRESHOLDS.checkout_completion_rate.warning,
      minFollowUpOpenRate: THRESHOLDS.follow_up_open_rate.warning,
      minFollowUpClickRate: THRESHOLDS.follow_up_click_rate.warning,
      minShowUpRate: THRESHOLDS.attendance_rate.warning,  // legacy alias
    },
    maxConcurrentOptimizations: 3,
    lastRunAt: null,
    actionsApplied: [],
    cooldowns: [],
  }
}
