// app/api/launch/route.ts
// POST /api/launch — kicks off the full orchestration sequence

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { orchestrateLaunch } from "@/lib/orchestrator/webinarOrchestrator"
import type { LaunchRequest } from "@/lib/orchestrator/types"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate required fields
    const required: (keyof LaunchRequest)[] = [
      "offerDescription",
      "offerPrice",
      "targetAudience",
      "biggestPainPoint",
      "desiredTransformation",
      "webinarGoal",
      "toneStyle",
      "funnelType",
      "followUpPreference",
    ]

    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const request: LaunchRequest = {
      userId,
      offerDescription: body.offerDescription,
      offerPrice: body.offerPrice,
      targetAudience: body.targetAudience,
      biggestPainPoint: body.biggestPainPoint,
      desiredTransformation: body.desiredTransformation,
      webinarGoal: body.webinarGoal,
      toneStyle: body.toneStyle,
      presenterId: body.presenterId,
      funnelType: body.funnelType,
      followUpPreference: body.followUpPreference,
    }

    const summary = await orchestrateLaunch(request)

    return NextResponse.json(summary)
  } catch (error) {
    console.error("Launch orchestration error:", error)
    return NextResponse.json(
      { error: "Failed to orchestrate launch" },
      { status: 500 }
    )
  }
}

// GET /api/launch?id=xxx — fetch a previously generated launch summary
export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const launchId = searchParams.get("id")

    if (!launchId) {
      return NextResponse.json({ error: "Missing launch ID" }, { status: 400 })
    }

    // TODO: Fetch from database by launchId + userId
    // const summary = await db.launchSummary.findFirst({
    //   where: { id: launchId, userId }
    // })

    return NextResponse.json({ message: "TODO: wire to database", launchId })
  } catch (error) {
    console.error("Launch fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch launch" },
      { status: 500 }
    )
  }
}
