// app/api/optimize/route.ts
// POST /api/optimize        — execute a single Fix This For Me action
// POST /api/optimize/auto   — run the full Auto Optimize pass
// GET  /api/optimize?funnelId=xxx — fetch optimization history for a funnel

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import {
  executeOptimization,
  runAutoOptimize,
  defaultAutoOptimizeConfig,
  isActionAllowed,
} from "@/lib/orchestrator/optimizationEngine"
import type { OptimizationActionType, AutoOptimizeConfig } from "@/lib/orchestrator/types"

// ─── POST /api/optimize ───────────────────────────────────────────────────────
// Execute a single optimization action ("Fix This For Me")
export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { actionType, funnelId, mode } = body

    // ── Auto optimize mode ────────────────────────────────────────────────
    if (mode === "auto") {
      const { metrics } = body
      if (!metrics || !funnelId) {
        return NextResponse.json({ error: "Missing metrics or funnelId" }, { status: 400 })
      }

      // TODO: Load user's AutoOptimizeConfig from DB
      // const config = await db.autoOptimizeConfig.findFirst({ where: { userId, funnelId } })
      const config = defaultAutoOptimizeConfig(userId, funnelId)

      const results = await runAutoOptimize(config, metrics)

      // TODO: Save results to DB
      // await db.optimizationLog.createMany({ data: results.map(r => ({ ...r, userId })) })

      return NextResponse.json({ results, count: results.length })
    }

    // ── Single action mode ────────────────────────────────────────────────
    if (!actionType || !funnelId) {
      return NextResponse.json({ error: "Missing actionType or funnelId" }, { status: 400 })
    }

    // TODO: Get real user plan from DB
    // const user = await db.user.findUnique({ where: { clerkId: userId } })
    const userPlan = "pro" as const // stub — replace with real plan check

    if (!isActionAllowed(actionType as OptimizationActionType, userPlan)) {
      return NextResponse.json(
        { error: "upgrade_required", plan: "pro", message: "This feature requires a Pro plan" },
        { status: 403 }
      )
    }

    const result = await executeOptimization(actionType as OptimizationActionType, funnelId)

    // TODO: Persist result to DB
    // await db.optimizationLog.create({ data: { ...result, userId } })

    return NextResponse.json(result)

  } catch (error) {
    console.error("Optimization error:", error)
    return NextResponse.json({ error: "Optimization failed" }, { status: 500 })
  }
}

// ─── GET /api/optimize?funnelId=xxx ──────────────────────────────────────────
// Fetch optimization history for a funnel
export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const funnelId = searchParams.get("funnelId")

    if (!funnelId) {
      return NextResponse.json({ error: "Missing funnelId" }, { status: 400 })
    }

    // TODO: Fetch from DB
    // const history = await db.optimizationLog.findMany({
    //   where: { funnelId, userId },
    //   orderBy: { appliedAt: "desc" }
    // })

    return NextResponse.json({ history: [], funnelId })
  } catch (error) {
    console.error("Optimization fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
