import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title =
      typeof body.title === "string" && body.title.trim()
        ? body.title.trim()
        : "Untitled Webinar";

    let workspace = await prisma.workspace.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: "Default Workspace",
          slug: "default-workspace",
        },
      });
    }

    const slug = `${slugify(title)}-${nanoid(6)}`;
    const now = new Date();

    const result = await prisma.$queryRawUnsafe(`
      INSERT INTO "Webinar"
      ("id", "workspaceId", "title", "niche", "status", "mode", "slug", "hasWatermark", "createdAt", "updatedAt")
      VALUES
      (gen_random_uuid()::text, '${workspace.id}', '${title}', 'OTHER', 'DRAFT', 'EVERGREEN', '${slug}', true, NOW(), NOW())
      RETURNING "id", "title", "status", "workspaceId", "slug", "createdAt"
    `);

    return NextResponse.json({
      success: true,
      webinar: result[0],
    });

  } catch (error) {
    console.error("POST /api/webinars error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to save webinar",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const webinars = await prisma.$queryRawUnsafe(`
      SELECT "id", "title", "status", "workspaceId", "slug", "createdAt"
      FROM "Webinar"
      ORDER BY "createdAt" DESC
    `);

    return NextResponse.json({
      success: true,
      webinars,
    });

  } catch (error) {
    console.error("GET /api/webinars error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch webinars",
      },
      { status: 500 }
    );
  }
}
