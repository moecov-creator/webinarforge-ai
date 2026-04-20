// lib/orchestrator/webinarOrchestrator.ts
// WebinarForge AI — Central Launch Orchestrator
//
// This service coordinates the full launch sequence:
// 1. intake → 2. generate webinar → 3. generate funnel →
// 4. assign presenter → 5. configure automation →
// 6. init analytics → 7. return LaunchSummary

import type {
  LaunchRequest,
  LaunchSummary,
  WebinarAssets,
  FunnelAssets,
  PresenterAssignment,
  AutomationConfig,
  AnalyticsInit,
  LaunchStatus,
} from "./types"
import { generateWebinarAssets } from "./services/webinarGenerator"
import { generateFunnelAssets } from "./services/funnelGenerator"
import { assignPresenter } from "./services/presenterService"
import { configureAutomation } from "./services/automationService"
import { initAnalytics } from "./services/analyticsService"
import { generateLaunchId, getCurrentTimestamp } from "./utils"

// ─── Main orchestrator entry point ───────────────────────────────────────────
export async function orchestrateLaunch(
  request: LaunchRequest
): Promise<LaunchSummary> {
  const id = generateLaunchId()
  const now = getCurrentTimestamp()

  const summary: LaunchSummary = {
    id,
    userId: request.userId,
    status: "generating",
    createdAt: now,
    updatedAt: now,
    request,
    webinarAssets: null,
    funnelAssets: null,
    presenterAssignment: null,
    automationConfig: null,
    analyticsInit: null,
    errors: [],
    nextSteps: [],
  }

  try {
    // Step 1 — Generate webinar assets
    summary.webinarAssets = await generateWebinarAssets(request)
    summary.updatedAt = getCurrentTimestamp()

    // Step 2 — Generate funnel assets
    summary.funnelAssets = await generateFunnelAssets(request, summary.webinarAssets)
    summary.updatedAt = getCurrentTimestamp()

    // Step 3 — Assign presenter
    summary.presenterAssignment = await assignPresenter(request)
    summary.updatedAt = getCurrentTimestamp()

    // Step 4 — Configure automation
    summary.automationConfig = await configureAutomation(request)
    summary.updatedAt = getCurrentTimestamp()

    // Step 5 — Initialize analytics
    summary.analyticsInit = await initAnalytics(id, request)
    summary.updatedAt = getCurrentTimestamp()

    // Step 6 — Build next steps
    summary.nextSteps = buildNextSteps(summary)
    summary.status = "ready"

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    summary.errors.push(message)
    summary.status = "draft"
  }

  summary.updatedAt = getCurrentTimestamp()
  return summary
}

// ─── Build contextual next steps ─────────────────────────────────────────────
function buildNextSteps(summary: LaunchSummary): string[] {
  const steps: string[] = []

  if (summary.webinarAssets) {
    steps.push("Review and customize your AI-generated webinar script")
  }
  if (summary.funnelAssets) {
    steps.push("Publish your registration landing page")
  }
  if (summary.presenterAssignment) {
    steps.push(`Activate ${summary.presenterAssignment.presenterName} as your AI presenter`)
  }
  if (summary.automationConfig?.emailSequenceEnabled) {
    steps.push("Review your follow-up email sequence")
  }
  if (summary.request.funnelType === "evergreen") {
    steps.push("Enable evergreen replay scheduling")
  }
  steps.push("Drive traffic to your registration page")
  steps.push("Track your first conversion in Analytics")

  return steps
}

// ─── Status helpers ───────────────────────────────────────────────────────────
export function isLaunchReady(summary: LaunchSummary): boolean {
  return (
    summary.status === "ready" &&
    summary.webinarAssets !== null &&
    summary.funnelAssets !== null
  )
}

export function getLaunchProgress(summary: LaunchSummary): number {
  const checks = [
    summary.webinarAssets !== null,
    summary.funnelAssets !== null,
    summary.presenterAssignment !== null,
    summary.automationConfig !== null,
    summary.analyticsInit !== null,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}
