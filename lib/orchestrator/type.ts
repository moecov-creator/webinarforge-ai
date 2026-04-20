// lib/orchestrator/types.ts
// WebinarForge AI — Central Orchestrator Types
// All structured data contracts for the launch workflow

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

// ─── User Launch Request ──────────────────────────────────────────────────────
export interface LaunchRequest {
  userId: string
  // Offer
  offerDescription: string
  offerPrice: string
  targetAudience: string
  biggestPainPoint: string
  desiredTransformation: string
  // Webinar config
  webinarGoal: WebinarGoal
  toneStyle: ToneStyle
  presenterId?: string
  funnelType: FunnelType
  followUpPreference: FollowUpPreference
}

// ─── Generated Webinar Assets ─────────────────────────────────────────────────
export interface WebinarAssets {
  title: string
  hook: string
  outline: WebinarOutlineSection[]
  fullScript: string
  ctaSection: string
  suggestedCtaTiming: number // minutes into webinar
}

export interface WebinarOutlineSection {
  order: number
  title: string
  duration: number // minutes
  keyPoints: string[]
  type: "intro" | "content" | "story" | "proof" | "offer" | "close"
}

// ─── Generated Funnel Assets ──────────────────────────────────────────────────
export interface FunnelAssets {
  structure: FunnelStep[]
  landingPageCopy: LandingPageCopy
  registrationFormCopy: RegistrationFormCopy
  emailSequence: EmailMessage[]
  optimizationRecommendations: string[]
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
  triggerDelay: string // e.g. "immediately", "1 day after", "3 days after"
  subject: string
  previewText: string
  bodyOutline: string
  ctaText: string
  ctaUrl: string
}

// ─── Presenter Assignment ─────────────────────────────────────────────────────
export interface PresenterAssignment {
  presenterId: string
  presenterName: string
  avatarUrl?: string
  voiceId?: string
  assignedAt: string
}

// ─── Automation Config ────────────────────────────────────────────────────────
export interface AutomationConfig {
  emailSequenceEnabled: boolean
  smsEnabled: boolean
  reminderSchedule: string[]
  followUpSequenceCount: number
  evergreen: boolean
  replayEnabled: boolean
}

// ─── Analytics Init ───────────────────────────────────────────────────────────
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

// ─── Launch Summary — the full output object ──────────────────────────────────
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

// ─── Insight Cards for Analytics UI ──────────────────────────────────────────
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
}
