// lib/orchestrator/types.ts
// WebinarForge AI — Complete Type System

// ─── Launch types ─────────────────────────────────────────────────────────────

export type LaunchStatus =
  | "draft"
  | "generating"
  | "ready"
  | "launched"
  | "optimization_needed"

export type FunnelType = "evergreen" | "live"

export type WebinarGoal =
  | "book_calls"
  | "sell_product"
  | "generate_leads"
  | "build_list"
  | "promote_event"

export type FollowUpPreference =
  | "email_only"
  | "email_sms"
  | "basic_automation"
  | "advanced_automation"

export type ToneStyle =
  | "professional"
  | "conversational"
  | "energetic"
  | "educational"
  | "storytelling"

export interface LaunchRequest {
  userId: string
  offerDescription: string
  offerPrice: string
  targetAudience: string
  biggestPainPoint: string
  desiredTransformation: string
  webinarGoal: WebinarGoal
  toneStyle: ToneStyle
  presenterId?: string
  funnelType: FunnelType
  followUpPreference: FollowUpPreference
}

export interface WebinarOutlineSection {
  order: number
  title: string
  duration: number
  keyPoints: string[]
  type: "intro" | "content" | "story" | "proof" | "offer" | "close"
}

export interface WebinarAssets {
  title: string
  hook: string
  outline: WebinarOutlineSection[]
  fullScript: string
  ctaSection: string
  suggestedCtaTiming: number
}

export interface FunnelStep {
  order: number
  name: string
  url: string
  purpose: string
  elements: string[]
}

export interface LandingPageCopy {
  headline: string
  subheadline: string
  hook: string
  bulletPoints: string[]
  ctaText: string
  urgencyText: string
  socialProofPlaceholder: string
}

export interface RegistrationFormCopy {
  headline: string
  subheadline: string
  fields: { label: string; placeholder: string }[]
  submitButtonText: string
  privacyNote: string
}

export interface EmailMessage {
  order: number
  triggerDelay: string
  subject: string
  previewText: string
  bodyOutline: string
  ctaText: string
  ctaUrl: string
}

export interface FunnelAssets {
  structure: FunnelStep[]
  landingPageCopy: LandingPageCopy
  registrationFormCopy: RegistrationFormCopy
  emailSequence: EmailMessage[]
  optimizationRecommendations: string[]
}

export interface PresenterAssignment {
  presenterId: string
  presenterName: string
  avatarUrl?: string
  voiceId?: string
  assignedAt: string
}

export interface AutomationConfig {
  emailSequenceEnabled: boolean
  smsEnabled: boolean
  reminderSchedule: string[]
  followUpSequenceCount: number
  evergreen: boolean
  replayEnabled: boolean
}

export interface AnalyticsInit {
  trackingId: string
  funnelId: string
  eventsToTrack: string[]
  conversionGoal: string
  benchmarks: {
    targetRegistrationRate: number
    targetShowUpRate: number
    targetConversionRate: number
  }
}

export interface LaunchSummary {
  id: string
  userId: string
  status: LaunchStatus
  createdAt: string
  updatedAt: string
  request: LaunchRequest
  webinarAssets: WebinarAssets | null
  funnelAssets: FunnelAssets | null
  presenterAssignment: PresenterAssignment | null
  automationConfig: AutomationConfig | null
  analyticsInit: AnalyticsInit | null
  errors: string[]
  nextSteps: string[]
}

// ─── Insight types ────────────────────────────────────────────────────────────

export type InsightSeverity = "positive" | "warning" | "critical" | "info"

export interface AnalyticsInsight {
  id: string
  severity: InsightSeverity
  metric: string
  title: string
  description: string
  recommendation: string
  actionLabel?: string
  actionHref?: string
  fixAction?: OptimizationActionType
}

// ─── Funnel metrics ───────────────────────────────────────────────────────────
// All 8 tracked metrics — pass this object everywhere metrics are needed

export interface FunnelMetrics {
  registration_rate: number         // % of page visitors who registered
  attendance_rate: number           // % of registrants who attended
  watch_time_percent: number        // % of webinar duration watched on average
  cta_click_rate: number            // % of attendees who clicked CTA
  sales_conversion_rate: number     // % of attendees who purchased
  checkout_completion_rate: number  // % of checkout starters who completed
  follow_up_open_rate: number       // % of follow-up emails opened
  follow_up_click_rate: number      // % of follow-up emails clicked
}

// ─── Metric evaluation ────────────────────────────────────────────────────────

export type MetricStatus = "healthy" | "warning" | "critical"

export type MetricKey = keyof FunnelMetrics

export interface MetricEvaluation {
  metric: MetricKey
  value: number
  status: MetricStatus
  threshold: {
    healthy: number
    warning: number
  }
  delta: number  // how far from healthy threshold (negative = below)
}

// ─── Optimization action types ────────────────────────────────────────────────

export type OptimizationActionType =
  | "rewrite_landing_page"
  | "reduce_form_friction"
  | "rewrite_reminder_sequence"
  | "improve_webinar_hook"
  | "rewrite_cta_section"
  | "optimize_offer_stack"
  | "improve_checkout_flow"
  | "rewrite_follow_up_sequence"
  // legacy aliases kept for backward compatibility with existing UI
  | "fix_cta"
  | "fix_landing_page"
  | "fix_offer"
  | "fix_email_sequence"
  | "fix_webinar_hook"
  | "increase_conversions"

// ─── Optimization recommendation ─────────────────────────────────────────────

export type RecommendationSeverity = "critical" | "warning"

export interface OptimizationRecommendation {
  id: string
  type: OptimizationActionType
  title: string
  reason: string
  severity: RecommendationSeverity
  impactedMetric: MetricKey
  recommendedAction: string
  autoApplicable: boolean    // safe to apply without confirmation
  requiresPro: boolean       // gated behind Pro plan
  priority: number           // lower = higher priority (1 = most urgent)
}

// ─── Funnel optimization report ───────────────────────────────────────────────

export type ReportStatus = "healthy" | "needs_attention" | "critical"

export interface FunnelOptimizationReport {
  funnelId: string
  evaluatedAt: string
  status: ReportStatus
  evaluations: MetricEvaluation[]
  recommendations: OptimizationRecommendation[]
  topPriorityRecommendation: OptimizationRecommendation | null
}

// ─── Optimization result (execution output) ───────────────────────────────────

export type OptimizationStatus = "idle" | "running" | "applied" | "failed" | "reverted"

export interface OptimizationResult {
  id: string
  actionType: OptimizationActionType
  funnelId: string
  status: OptimizationStatus
  appliedAt: string | null
  before: Record<string, string>
  after: Record<string, string>
  summary: string
  autoApplicable: boolean
  error?: string
  // version tracking
  version: number
  revertableUntil: string | null  // ISO timestamp — null if not revertable
}

// ─── Action definition (UI metadata) ─────────────────────────────────────────

export interface OptimizationAction {
  id: string
  type: OptimizationActionType
  label: string
  description: string
  proOnly: boolean
  insightIds: string[]
  autoApplicable: boolean
  confirmationRequired: boolean
}

// ─── Cooldown tracking ────────────────────────────────────────────────────────

export interface CooldownRecord {
  actionType: OptimizationActionType
  funnelId: string
  lastAppliedAt: string    // ISO timestamp
  cooldownHours: number    // default 72
  nextAllowedAt: string    // ISO timestamp
}

// ─── Auto optimize config ─────────────────────────────────────────────────────

export interface AutoOptimizeConfig {
  enabled: boolean
  userId: string
  funnelId: string
  thresholds: {
    minRegistrationRate: number
    minShowUpRate: number       // kept for legacy compat
    minCtaClickRate: number
    minConversionRate: number
    // new full set
    minAttendanceRate: number
    minWatchTimePercent: number
    minCheckoutCompletionRate: number
    minFollowUpOpenRate: number
    minFollowUpClickRate: number
  }
  maxConcurrentOptimizations: number  // default 3
  lastRunAt: string | null
  actionsApplied: OptimizationResult[]
  cooldowns: CooldownRecord[]
}

// ─── Auto run ─────────────────────────────────────────────────────────────────

export interface AutoRunResult {
  success: boolean
  stepsCompleted: string[]
  stepsFailed: string[]
  summary: string
  launchSummary?: LaunchSummary
}

// ─── Plan gating ──────────────────────────────────────────────────────────────

export type UserPlan = "starter" | "pro" | "enterprise"

export interface PlanFeatureGate {
  feature: string
  requiredPlan: UserPlan
  upgradeMessage: string
  upgradeHref: string
}

// ─── Optimization history entry ───────────────────────────────────────────────

export interface OptimizationHistoryEntry {
  id: string
  funnelId: string
  userId: string
  actionType: OptimizationActionType
  status: OptimizationStatus
  appliedAt: string
  summary: string
  version: number
  reverted: boolean
  revertedAt: string | null
}
