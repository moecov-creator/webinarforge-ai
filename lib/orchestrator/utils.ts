// lib/orchestrator/utils.ts

import { nanoid } from "nanoid"
import type { AnalyticsInsight, InsightSeverity } from "./types"

// ─── ID and timestamp helpers ─────────────────────────────────────────────────
export function generateLaunchId(): string {
  return `launch_${nanoid(10)}`
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString()
}

// ─── Analytics insight engine ─────────────────────────────────────────────────
// Rules-based interpretation layer — compatible with future AI-generated insights.
// To upgrade to AI: replace the rules below with an AI API call.
// The return type and interface stay identical — no UI changes needed.

export interface WebinarMetrics {
  registrationRate: number   // % of page visitors who registered
  showUpRate: number         // % of registrants who attended
  ctaClickRate: number       // % of attendees who clicked CTA
  conversionRate: number     // % of attendees who purchased
  avgWatchTime: number       // minutes
  dropOffPoint: number       // minute where most people leave
  emailOpenRate?: number
  replayWatchRate?: number
}

export function generateInsights(metrics: WebinarMetrics): AnalyticsInsight[] {
  const insights: AnalyticsInsight[] = []

  // ── Registration rate ─────────────────────────────────────────────────────
  if (metrics.registrationRate >= 40) {
    insights.push({
      id: "reg-strong",
      severity: "positive",
      metric: "registration_rate",
      title: "Registration rate is strong",
      description: `${metrics.registrationRate}% of visitors are registering — above the 40% benchmark.`,
      recommendation: "Maintain current landing page copy. Consider A/B testing the headline for further gains.",
    })
  } else if (metrics.registrationRate >= 25) {
    insights.push({
      id: "reg-average",
      severity: "warning",
      metric: "registration_rate",
      title: "Registration rate has room to improve",
      description: `${metrics.registrationRate}% registration rate is below the 40% target.`,
      recommendation: "Test a stronger headline, reduce form fields to 2, and add social proof near the CTA.",
      actionLabel: "Edit Landing Page",
      actionHref: "/dashboard/funnels/editor",
    })
  } else {
    insights.push({
      id: "reg-weak",
      severity: "critical",
      metric: "registration_rate",
      title: "Registration rate needs immediate attention",
      description: `${metrics.registrationRate}% registration rate is significantly below benchmark.`,
      recommendation: "Landing page may have a weak hook or mismatched audience. Rewrite headline and test a new traffic source.",
      actionLabel: "Regenerate Landing Page",
      actionHref: "/dashboard/funnels/generator",
    })
  }

  // ── Show-up rate ──────────────────────────────────────────────────────────
  if (metrics.showUpRate >= 40) {
    insights.push({
      id: "showup-strong",
      severity: "positive",
      metric: "show_up_rate",
      title: "Show-up rate is healthy",
      description: `${metrics.showUpRate}% of registrants are attending — above the 35% benchmark.`,
      recommendation: "Your reminder sequence is working. Keep the current email + reminder cadence.",
    })
  } else if (metrics.showUpRate < 25) {
    insights.push({
      id: "showup-weak",
      severity: "warning",
      metric: "show_up_rate",
      title: "Low show-up rate — follow-up automation may help",
      description: `Only ${metrics.showUpRate}% of registrants are attending. Industry benchmark is 35%.`,
      recommendation: "Add a 1-hour SMS reminder, increase email frequency, and improve the confirmation page.",
      actionLabel: "Upgrade Automation",
      actionHref: "/dashboard/automation",
    })
  }

  // ── CTA click rate ────────────────────────────────────────────────────────
  if (metrics.ctaClickRate < 15) {
    insights.push({
      id: "cta-weak",
      severity: "critical",
      metric: "cta_click_rate",
      title: "CTA clicks are underperforming",
      description: `${metrics.ctaClickRate}% CTA click rate is below the 15% target.`,
      recommendation: "Strengthen the offer transition. Add more urgency and stack value before revealing the price.",
      actionLabel: "Edit Webinar Script",
      actionHref: "/dashboard/webinars",
    })
  } else if (metrics.ctaClickRate >= 20) {
    insights.push({
      id: "cta-strong",
      severity: "positive",
      metric: "cta_click_rate",
      title: "CTA engagement is strong",
      description: `${metrics.ctaClickRate}% of attendees clicked the CTA — above the 15% benchmark.`,
      recommendation: "Focus optimization on the order page to convert more clickers into buyers.",
    })
  }

  // ── Conversion rate ───────────────────────────────────────────────────────
  if (metrics.conversionRate < 3) {
    insights.push({
      id: "conv-critical",
      severity: "critical",
      metric: "conversion_rate",
      title: "Conversion rate suggests your offer needs stronger urgency",
      description: `${metrics.conversionRate}% conversion rate is below the 5% minimum target.`,
      recommendation: "Add a deadline, bonus stack, or payment plan. Test a lower entry price or tripwire offer.",
      actionLabel: "Improve Offer",
      actionHref: "/dashboard/funnels",
    })
  } else if (metrics.conversionRate >= 10) {
    insights.push({
      id: "conv-excellent",
      severity: "positive",
      metric: "conversion_rate",
      title: "Excellent conversion rate",
      description: `${metrics.conversionRate}% conversion rate is above the 10% benchmark. This funnel is performing.`,
      recommendation: "Scale traffic immediately — this funnel is converting.",
    })
  }

  // ── Watch time / drop-off ─────────────────────────────────────────────────
  if (metrics.avgWatchTime < 20) {
    insights.push({
      id: "dropoff-early",
      severity: "critical",
      metric: "avg_watch_time",
      title: "Early drop-off may indicate a weak hook or transition",
      description: `Average watch time is ${metrics.avgWatchTime} minutes. Most people leave before the offer.`,
      recommendation: "Rewrite the first 10 minutes. Your hook or story may not be holding attention.",
      actionLabel: "Edit Script",
      actionHref: "/dashboard/webinars",
    })
  } else if (metrics.dropOffPoint > 0 && metrics.dropOffPoint < 40) {
    insights.push({
      id: "dropoff-mid",
      severity: "warning",
      metric: "drop_off_point",
      title: `Drop-off spike at minute ${metrics.dropOffPoint}`,
      description: `Significant drop-off at minute ${metrics.dropOffPoint}, before the offer is made.`,
      recommendation: "Add a pattern interrupt, case study, or re-engagement hook at this point.",
    })
  }

  // ── Email performance ─────────────────────────────────────────────────────
  if (metrics.emailOpenRate && metrics.emailOpenRate < 20) {
    insights.push({
      id: "email-weak",
      severity: "warning",
      metric: "email_open_rate",
      title: "Email open rate is low",
      description: `${metrics.emailOpenRate}% open rate is below the 25% benchmark.`,
      recommendation: "Test new subject lines with curiosity or urgency hooks. Check sender reputation.",
      actionLabel: "Edit Email Sequence",
      actionHref: "/dashboard/automation",
    })
  }

  // ── Replay engagement ─────────────────────────────────────────────────────
  if (metrics.replayWatchRate !== undefined && metrics.replayWatchRate > 30) {
    insights.push({
      id: "replay-strong",
      severity: "info",
      metric: "replay_watch_rate",
      title: "Replay is driving significant engagement",
      description: `${metrics.replayWatchRate}% of registrants are watching the replay.`,
      recommendation: "Add a replay-specific urgency message and separate CTA to maximize replay conversions.",
    })
  }

  // Sort: critical first, then warning, then positive, then info
  const order: Record<InsightSeverity, number> = { critical: 0, warning: 1, positive: 2, info: 3 }
  return insights.sort((a, b) => order[a.severity] - order[b.severity])
}

export function getOverallHealth(
  metrics: WebinarMetrics
): "excellent" | "good" | "needs_work" | "critical" {
  const insights = generateInsights(metrics)
  const criticals = insights.filter((i) => i.severity === "critical").length
  const positives = insights.filter((i) => i.severity === "positive").length
  if (criticals >= 2) return "critical"
  if (criticals === 1) return "needs_work"
  if (positives >= 3) return "excellent"
  return "good"
}
