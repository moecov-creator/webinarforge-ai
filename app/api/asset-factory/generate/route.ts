// app/api/asset-factory/generate/route.ts

import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"
import { generateAssetFactory } from "@/lib/asset-factory/generate"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { niche, targetAudience, desiredOutcome, offerType, tone, cta, industry, pricePoint } = body

    if (!niche || !targetAudience || !desiredOutcome || !offerType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create project record
    const project = await prisma.assetFactoryProject.create({
      data: {
        userId: user.id,
        title: `${niche} — ${offerType}`,
        niche,
        targetAudience,
        desiredOutcome,
        offerType,
        tone: tone || "professional",
        cta: cta || "Book a Call",
        industry: industry || niche,
        pricePoint: pricePoint || "997",
        status: "generating",
      },
    })

    // Generate assets
    let output
    try {
      output = await generateAssetFactory({ niche, targetAudience, desiredOutcome, offerType, tone, cta, industry, pricePoint })
    } catch (err) {
      await prisma.assetFactoryProject.update({
        where: { id: project.id },
        data: { status: "error" },
      })
      throw err
    }

    // Save all outputs
    const phases = [
      { phase: "strategic_intelligence", data: output.strategic_intelligence },
      { phase: "offer_engineering", data: output.offer_engineering },
      { phase: "digital_product", data: output.digital_product },
      { phase: "webinar_engine", data: output.webinar_engine },
      { phase: "ai_video_content", data: output.ai_video_content },
      { phase: "funnel_crm_assets", data: output.funnel_crm_assets },
    ]

    for (const { phase, data } of phases) {
      for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
        await prisma.assetFactoryOutput.create({
          data: {
            projectId: project.id,
            phase,
            sectionTitle: key,
            content: Array.isArray(value) ? JSON.stringify(value) : String(value),
            format: Array.isArray(value) ? "json" : "text",
          },
        })
      }
    }

    // Mark complete
    await prisma.assetFactoryProject.update({
      where: { id: project.id },
      data: { status: "complete" },
    })

    const fullProject = await prisma.assetFactoryProject.findUnique({
      where: { id: project.id },
      include: { outputs: true },
    })

    return NextResponse.json({ success: true, project: fullProject, output })
  } catch (err: any) {
    console.error("Asset factory generate error:", err)
    return NextResponse.json({ error: err.message || "Generation failed" }, { status: 500 })
  }
}
