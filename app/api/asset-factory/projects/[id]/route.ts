// app/api/asset-factory/projects/[id]/route.ts

import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const project = await prisma.assetFactoryProject.findFirst({
      where: { id: params.id, userId: user.id },
      include: { outputs: { orderBy: { createdAt: "asc" } } },
    })

    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })

    return NextResponse.json({ project })
  } catch (err: any) {
    console.error("Asset factory project error:", err)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await prisma.assetFactoryProject.deleteMany({
      where: { id: params.id, userId: user.id },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
