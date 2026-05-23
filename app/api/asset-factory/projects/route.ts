// app/api/asset-factory/projects/route.ts

import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const projects = await prisma.assetFactoryProject.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { outputs: false },
    })

    return NextResponse.json({ projects })
  } catch (err: any) {
    console.error("Asset factory projects error:", err)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
