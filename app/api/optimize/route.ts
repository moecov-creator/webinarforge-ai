// app/api/optimize/route.ts
// POST /api/optimize          — single fix action or auto-optimize pass
// GET  /api/optimize?funnelId — fetch report + history for a funnel

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import {
  executeOptimization,
  runAutoOptimize,
  buildOptimizationReport,
  defaultAutoOptimizeConfig,
  isActionAllowed,
  getUpgradePrompt,
} from "@/lib/orchestrator/optimizationEngine"
import { normalizeFunnelMetrics } from "@/lib/orchestrator/utils"
import type { OptimizationActionType, FunnelMetrics } from "@/lib/orchestrator/types"

// ─── POST /api/optimize ───────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { mode, actionType, funnelId, metrics: rawMetrics } = body

    if (!funnelId) {
      return NextResponse.json({ error: "Missing funnelId" }, { status: 400 })
    }

    // TODO: Get real user plan from DB
    // const user = await db.user.findFirst({ where: { clerkId: userId } })
    const userPlan = "pro" as const

    // ── Mode: report — evaluate metrics and return typed report ──────────
    if (mode === "report") {
      if (!rawMetrics) {
        return NextResponse.json({ error: "Missing metrics for report mode" }, { status: 400 })
      }
      const metrics: FunnelMetrics = normalizeFunnelMetrics(rawMetrics)
      const report = buildOptimizationReport(funnelId, metrics)
      return NextResponse.json(report)
    }

    // ── Mode: auto — run full auto-optimize pass ──────────────────────────
    if (mode === "auto") {
      if (!rawMetrics) {
        return NextResponse.json({ error: "Missing metrics for auto mode" }, { status: 400 })
      }

      if (userPlan === "starter") {
        return NextResponse.json(
          { error: "upgrade_required", plan: "pro", message: "Auto Optimize requires a Pro plan" },
          { status: 403 }
        )
      }

      const metrics: FunnelMetrics = normalizeFunnelMetrics(rawMetrics)

      // TODO: Load real config from DB
      // const config = await db.autoOptimizeConfig.findFirst({ where: { userId, funnelId } })
      const config = defaultAutoOptimizeConfig(userId, funnelId)

      const { report, results } = await runAutoOptimize(config, metrics)

      // TODO: Persist results to DB
      // await db.optimizationLog.createMany({ data: results.map(r => ({ ...r, userId })) })
      // await db.autoOptimizeConfig.update({ where: { userId, funnelId }, data: { lastRunAt: new Date() } })

      return NextResponse.json({
        report,
        results,
        count: results.length,
        summary: `${results.length} optimization${results.length !== 1 ? "s" : ""} applied automatically`,
      })
    }

    // ── Mode: single action (default) ─────────────────────────────────────
    if (!actionType) {
      return NextResponse.json({ error: "Missing actionType" }, { status: 400 })
    }

    if (!isActionAllowed(actionType as OptimizationActionType, userPlan)) {
      return NextResponse.json(
        {
          error: "upgrade_required",
          plan: "pro",
          message: getUpgradePrompt(actionType as OptimizationActionType),
        },
        { status: 403 }
      )
    }

    // TODO: Load cooldown config from DB
    const config = defaultAutoOptimizeConfig(userId, funnelId)
    const result = await executeOptimization(actionType as OptimizationActionType, funnelId, config)

    // TODO: Persist result + update cooldown in DB
    // await db.optimizationLog.create({ data: { ...result, userId } })
    // await db.cooldownRecord.upsert({ ... })

    return NextResponse.json(result)

  } catch (error) {
    console.error("Optimization error:", error)
    return NextResponse.json({ error: "Optimization failed" }, { status: 500 })
  }
}

// ─── GET /api/optimize?funnelId=xxx ──────────────────────────────────────────
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
    //   orderBy: { appliedAt: "desc" },
    //   take: 50,
    // })
    // const config = await db.autoOptimizeConfig.findFirst({ where: { userId, funnelId } })

    return NextResponse.json({
      history: [],
      config: defaultAutoOptimizeConfig(userId, funnelId),
      funnelId,
    })
  } catch (error) {
    console.error("Optimization fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch optimization data" }, { status: 500 })
  }
}
