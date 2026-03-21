import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const webinar = await prisma.webinar.create({
      data: {
        workspaceId: "default-workspace",
        title: body.title || "My First Webinar",
        subtitle: body.corePromise || null,
        slug: `webinar-${Date.now()}`,
        niche: "OTHER",
        status: "DRAFT",
        mode: "EVERGREEN",
      },
    })

    return NextResponse.json({ success: true, webinar })
  } catch (error) {
    console.error("POST /api/webinars error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save webinar" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const webinars = await prisma.webinar.findMany({
      where: {
        workspaceId: "default-workspace",
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ success: true, webinars })
  } catch (error) {
    console.error("GET /api/webinars error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to load webinars" },
      { status: 500 }
    )
  }
}
