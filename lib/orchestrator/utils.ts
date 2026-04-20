// lib/orchestrator/utils.ts

import { nanoid } from "nanoid"
import type { AnalyticsInsight, InsightSeverity, FunnelMetrics } from "./types"
import { THRESHOLDS } from "./optimizationEngine"

export function generateLaunchId(): string {
  return `launch_${nanoid(10)}`
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString()
}

// ─── Legacy type alias ────────────────────────────────────────────────────────
// Kept for backward compat with existing UI components that import WebinarMetrics
export type WebinarMetrics = FunnelMetrics & {
  // legacy field names used in existing dashboard mock data
  registrationRate?: number
  showUpRate?: number
  ctaClickRate?: number
  conversionRate?: number
  avgWatchTime?: number
  dropOffPoint?: number
  emailOpenRate?: number
  replayWatchRate?: number
}

// ─── Normalize metrics ────────────────────────────────────────────────────────
// Converts legacy camelCase field names to the canonical snake_case FunnelMetrics shape

export function normalizeFunnelMetrics(raw: WebinarMetrics): FunnelMetrics {
  return {
    registration_rate:        raw.registration_rate        ?? raw.registrationRate        ?? 0,
    attendance_rate:          raw.attendance_rate          ?? raw.showUpRate              ?? 0,
    watch_time_percent:       raw.watch_time_percent       ?? (raw.avgWatchTime ? Math.round(raw.avgWatchTime / 60 * 100) : 0),
    cta_click_rate:           raw.cta_click_rate           ?? raw.ctaClickRate            ?? 0,
    sales_conversion_rate:    raw.sales_conversion_rate    ?? raw.conversionRate          ?? 0,
    checkout_completion_rate: raw.checkout_completion_rate ?? 0,
    follow_up_open_rate:      raw.follow_up_open_rate      ?? raw.emailOpenRate           ?? 0,
    follow_up_click_rate:     raw.follow_up_click_rate     ?? 0,
  }
}

// ─── Analytics insight engine ─────────────────────────────────────────────────
// Generates InsightCard data for the dashboard panel.
// Each insight carries a fixAction that maps to an OptimizationActionType.
// Covers all 8 tracked metrics.

export function generateInsights(rawMetrics: WebinarMetrics): AnalyticsInsight[] {
  const metrics = normalizeFunnelMetrics(rawMetrics)
  const insights: AnalyticsInsight[] = []

  // ── 1. Registration rate ──────────────────────────────────────────────────
  const { healthy: regH, warning: regW } = THRESHOLDS.registration_rate
  if (metrics.registration_rate >= regH) {
    insights.push({
      id: "reg-healthy",
      severity: "positive",
      metric: "registration_rate",
      title: "Registration rate is strong",
      description: `${metrics.registration_rate}% of visitors are registering — above the ${regH}% benchmark.`,
      recommendation: "Maintain current landing page. A/B test headline variations for further gains.",
    })
  } else if (metrics.registration_rate >= regW) {
    insights.push({
      id: "reg-warning",
      severity: "warning",
      metric: "registration_rate",
      title: "Registration rate has room to improve",
      description: `${metrics.registration_rate}% registration rate is below the ${regH}% target.`,
      recommendation: "Test a stronger headline, reduce form fields to 2, and add social proof near the CTA.",
      actionLabel: "Edit Landing Page",
      actionHref: "/dashboard/funnels/editor",
      fixAction: "rewrite_landing_page",
    })
  } else {
    insights.push({
      id: "reg-weak",
      severity: "critical",
      metric: "registration_rate",
      title: "Registration rate needs immediate attention",
      description: `${metrics.registration_rate}% registration rate is critically below the ${regH}% benchmark.`,
      recommendation: "Rewrite landing page headline with specific outcome + audience. Remove all friction from registration form.",
      actionLabel: "Regenerate Landing Page",
      actionHref: "/dashboard/funnels/generator",
      fixAction: "rewrite_landing_page",
    })
  }

  // ── 2. Attendance rate ────────────────────────────────────────────────────
  const { healthy: attH, warning: attW } = THRESHOLDS.attendance_rate
  if (metrics.attendance_rate >= attH) {
    insights.push({
      id: "att-healthy",
      severity: "positive",
      metric: "attendance_rate",
      title: "Attendance rate is healthy",
      description: `${metrics.attendance_rate}% of registrants are attending — above the ${attH}% benchmark.`,
      recommendation: "Your reminder sequence is working. Keep the current cadence.",
    })
  } else if (metrics.attendance_rate < attH) {
    insights.push({
      id: metrics.attendance_rate < attW ? "att-weak" : "att-warning",
      severity: metrics.attendance_rate < attW ? "critical" : "warning",
      metric: "attendance_rate",
      title: metrics.attendance_rate < attW
        ? "Critical: most registrants are not showing up"
        : "Low show-up rate — reminders need improvement",
      description: `Only ${metrics.attendance_rate}% of registrants are attending. Benchmark is ${attH}%.`,
      recommendation: "Add a 1-hour SMS reminder. Rewrite email reminders with curiosity hook and attendee-exclusive bonus.",
      actionLabel: "Fix Reminders",
      actionHref: "/dashboard/automation",
      fixAction: "rewrite_reminder_sequence",
    })
  }

  // ── 3. Watch time percent ─────────────────────────────────────────────────
  const { healthy: wtH, warning: wtW } = THRESHOLDS.watch_time_percent
  if (metrics.watch_time_percent >= wtH) {
    insights.push({
      id: "watch-healthy",
      severity: "positive",
      metric: "watch_time_percent",
      title: "Watch time is strong",
      description: `Attendees are watching ${metrics.watch_time_percent}% of your webinar on average.`,
      recommendation: "Strong retention. Consider moving CTA earlier to capture high-intent viewers.",
    })
  } else if (metrics.watch_time_percent < wtH) {
    insights.push({
      id: metrics.watch_time_percent < wtW ? "watch-weak" : "watch-warning",
      severity: metrics.watch_time_percent < wtW ? "critical" : "warning",
      metric: "watch_time_percent",
      title: "Drop-off may indicate a weak hook or slow intro",
      description: `Attendees watch only ${metrics.watch_time_percent}% of your webinar on average. Most are leaving before the offer.`,
      recommendation: "Open with visual proof within the first 45 seconds. Add a minute-48 commitment device early in the webinar.",
      actionLabel: "Fix Webinar Hook",
      actionHref: "/dashboard/webinars",
      fixAction: "improve_webinar_hook",
    })
  }

  // ── 4. CTA click rate ─────────────────────────────────────────────────────
  const { healthy: ctaH, warning: ctaW } = THRESHOLDS.cta_click_rate
  if (metrics.cta_click_rate >= ctaH) {
    insights.push({
      id: "cta-healthy",
      severity: "positive",
      metric: "cta_click_rate",
      title: "CTA engagement is strong",
      description: `${metrics.cta_click_rate}% of attendees clicked the CTA — above the ${ctaH}% benchmark.`,
      recommendation: "Strong CTA performance. Focus optimization on the order page to convert more clickers.",
    })
  } else if (metrics.cta_click_rate < ctaH) {
    insights.push({
      id: metrics.cta_click_rate < ctaW ? "cta-weak" : "cta-warning",
      severity: metrics.cta_click_rate < ctaW ? "critical" : "warning",
      metric: "cta_click_rate",
      title: "CTA clicks are underperforming",
      description: `${metrics.cta_click_rate}% CTA click rate is below the ${ctaH}% target.`,
      recommendation: "Add urgency trigger, social proof counter, and risk reversal immediately before the CTA button.",
      actionLabel: "Fix My CTA",
      actionHref: "/dashboard/webinars",
      fixAction: "rewrite_cta_section",
    })
  }

  // ── 5. Sales conversion rate ──────────────────────────────────────────────
  const { healthy: convH, warning: convW } = THRESHOLDS.sales_conversion_rate
  if (metrics.sales_conversion_rate >= convH) {
    insights.push({
      id: "conv-healthy",
      severity: "positive",
      metric: "sales_conversion_rate",
      title: "Excellent conversion rate",
      description: `${metrics.sales_conversion_rate}% conversion rate is above the ${convH}% benchmark. Scale traffic.`,
      recommendation: "This funnel is converting well. Increase ad spend or affiliate traffic immediately.",
    })
  } else if (metrics.sales_conversion_rate < convH) {
    insights.push({
      id: metrics.sales_conversion_rate < convW ? "conv-weak" : "conv-warning",
      severity: metrics.sales_conversion_rate < convW ? "critical" : "warning",
      metric: "sales_conversion_rate",
      title: "Conversion rate suggests offer needs strengthening",
      description: `${metrics.sales_conversion_rate}% conversion rate is below the ${convH}% target.`,
      recommendation: "Itemize value stack with dollar anchors. Add 3 result-specific testimonials before price reveal. Strengthen guarantee language.",
      actionLabel: "Optimize Offer",
      actionHref: "/dashboard/funnels",
      fixAction: "optimize_offer_stack",
    })
  }

  // ── 6. Checkout completion rate ───────────────────────────────────────────
  const { healthy: coH, warning: coW } = THRESHOLDS.checkout_completion_rate
  if (metrics.checkout_completion_rate > 0 && metrics.checkout_completion_rate < coH) {
    insights.push({
      id: metrics.checkout_completion_rate < coW ? "checkout-weak" : "checkout-warning",
      severity: metrics.checkout_completion_rate < coW ? "critical" : "warning",
      metric: "checkout_completion_rate",
      title: "Checkout abandonment is too high",
      description: `${metrics.checkout_completion_rate}% of people who start checkout are completing it. Benchmark is ${coH}%.`,
      recommendation: "Add security badges and SSL seal above the payment form. Simplify form fields. Add PayPal as alternative.",
      actionLabel: "Fix Checkout",
      actionHref: "/dashboard/funnels",
      fixAction: "improve_checkout_flow",
    })
  } else if (metrics.checkout_completion_rate >= coH) {
    insights.push({
      id: "checkout-healthy",
      severity: "positive",
      metric: "checkout_completion_rate",
      title: "Checkout completion is strong",
      description: `${metrics.checkout_completion_rate}% checkout completion rate — above the ${coH}% benchmark.`,
      recommendation: "Checkout is converting well. Test an order bump to increase average order value.",
    })
  }

  // ── 7. Follow-up open rate ────────────────────────────────────────────────
  const { healthy: foH, warning: foW } = THRESHOLDS.follow_up_open_rate
  if (metrics.follow_up_open_rate > 0 && metrics.follow_up_open_rate < foH) {
    insights.push({
      id: metrics.follow_up_open_rate < foW ? "followup-open-weak" : "followup-open-warning",
      severity: metrics.follow_up_open_rate < foW ? "critical" : "warning",
      metric: "follow_up_open_rate",
      title: "Follow-up email open rate is low",
      description: `${metrics.follow_up_open_rate}% open rate is below the ${foH}% benchmark.`,
      recommendation: "Rewrite subject lines with curiosity hooks. Avoid spam-trigger words. Test 'did you watch the replay?' angle.",
      actionLabel: "Fix Email Sequence",
      actionHref: "/dashboard/automation",
      fixAction: "rewrite_follow_up_sequence",
    })
  }

  // ── 8. Follow-up click rate ───────────────────────────────────────────────
  const { healthy: fcH, warning: fcW } = THRESHOLDS.follow_up_click_rate
  if (metrics.follow_up_click_rate > 0 && metrics.follow_up_click_rate < fcH) {
    insights.push({
      id: metrics.follow_up_click_rate < fcW ? "followup-click-weak" : "followup-click-warning",
      severity: metrics.follow_up_click_rate < fcW ? "critical" : "warning",
      metric: "follow_up_click_rate",
      title: "Follow-up email click rate is low",
      description: `${metrics.follow_up_click_rate}% click rate is below the ${fcH}% target.`,
      recommendation: "Use a single CTA per email. Add replay expiry deadline. Use a PS line with a direct link.",
      actionLabel: "Fix Email CTAs",
      actionHref: "/dashboard/automation",
      fixAction: "rewrite_follow_up_sequence",
    })
  }

  const order: Record<InsightSeverity, number> = { critical: 0, warning: 1, positive: 2, info: 3 }
  return insights.sort((a, b) => order[a.severity] - order[b.severity])
}

export function getOverallHealth(
  rawMetrics: WebinarMetrics
): "excellent" | "good" | "needs_work" | "critical" {
  const insights = generateInsights(rawMetrics)
  const criticals = insights.filter((i) => i.severity === "critical").length
  const positives = insights.filter((i) => i.severity === "positive").length
  if (criticals >= 2) return "critical"
  if (criticals === 1) return "needs_work"
  if (positives >= 4) return "excellent"
  return "good"
}
