// app/api/launch/auto-run/route.ts
// POST /api/launch/auto-run
// Executes all onboarding steps automatically:
// webinar generation → funnel creation → presenter → automation → analytics
// Returns a real-time compatible response with step-by-step progress

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { orchestrateLaunch } from "@/lib/orchestrator/webinarOrchestrator"
import type { LaunchRequest, AutoRunResult } from "@/lib/orchestrator/types"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate that we have enough context to auto-run
    // Auto-run requires at minimum: offer, audience, goal
    if (!body.offerDescription || !body.targetAudience || !body.webinarGoal) {
      return NextResponse.json(
        { error: "Missing required fields: offerDescription, targetAudience, webinarGoal" },
        { status: 400 }
      )
    }

    // Fill in smart defaults for fields not provided
    const request: LaunchRequest = {
      userId,
      offerDescription: body.offerDescription,
      offerPrice: body.offerPrice || "$997",
      targetAudience: body.targetAudience,
      biggestPainPoint: body.biggestPainPoint || "not getting consistent results",
      desiredTransformation: body.desiredTransformation || "build a predictable, scalable business",
      webinarGoal: body.webinarGoal,
      toneStyle: body.toneStyle || "conversational",
      presenterId: body.presenterId,
      funnelType: body.funnelType || "evergreen",
      followUpPreference: body.followUpPreference || "email_sms",
    }

    // Run the full orchestration
    const launchSummary = await orchestrateLaunch(request)

    const stepsCompleted: string[] = []
    const stepsFailed: string[] = []

    if (launchSummary.webinarAssets)      stepsCompleted.push("webinar_generated")
    else                                   stepsFailed.push("webinar_generated")

    if (launchSummary.funnelAssets)       stepsCompleted.push("funnel_created")
    else                                   stepsFailed.push("funnel_created")

    if (launchSummary.presenterAssignment) stepsCompleted.push("presenter_assigned")
    else                                   stepsFailed.push("presenter_assigned")

    if (launchSummary.automationConfig)   stepsCompleted.push("automation_configured")
    else                                   stepsFailed.push("automation_configured")

    if (launchSummary.analyticsInit)      stepsCompleted.push("analytics_initialized")
    else                                   stepsFailed.push("analytics_initialized")

    const result: AutoRunResult = {
      success: stepsFailed.length === 0,
      stepsCompleted,
      stepsFailed,
      summary: stepsFailed.length === 0
        ? `All ${stepsCompleted.length} steps completed. Your funnel is ready to launch.`
        : `${stepsCompleted.length} steps completed, ${stepsFailed.length} failed. Check errors.`,
      launchSummary,
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error("Auto-run error:", error)
    return NextResponse.json({ error: "Auto-run failed" }, { status: 500 })
  }
}
