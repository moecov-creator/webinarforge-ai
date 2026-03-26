import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title =
      typeof body.title === "string" && body.title.trim()
        ? body.title.trim()
        : "Untitled Webinar";

    const script =
      typeof body.script === "string" ? body.script.trim() : "";

    // Get or create the default workspace
    let workspace = await prisma.workspace.findFirst({
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: "Default Workspace",
          slug: "default-workspace",
        },
        select: { id: true },
      });
    }

    const webinar = await prisma.webinar.create({
      data: {
        workspaceId: workspace.id,
        title,
        script,
      },
    });

    return NextResponse.json({
      success: true,
      webinar,
    });
  } catch (error) {
    console.error("POST /api/webinars error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create webinar",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const webinars = await prisma.webinar.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      webinars,
    });
  } catch (error) {
    console.error("GET /api/webinars error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch webinars",
      },
      { status: 500 }
    );
  }
}
