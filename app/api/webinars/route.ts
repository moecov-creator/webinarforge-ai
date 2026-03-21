import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title = body.title || "Untitled Webinar";

    // ✅ Ensure workspace exists
    let workspace = await prisma.workspace.findFirst();

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: "Default Workspace",
          slug: "default-workspace",
        },
      });
    }

    // ✅ Create webinar WITHOUT extra required fields
    const webinar = await prisma.webinar.create({
      data: {
        title,
        workspaceId: workspace.id,
      },
    });

    return NextResponse.json({
      success: true,
      webinar,
    });
  } catch (error) {
    console.error("🔥 WEBINAR ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Failed to save webinar" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const webinars = await prisma.webinar.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, webinars });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch webinars" },
      { status: 500 }
    );
  }
}
