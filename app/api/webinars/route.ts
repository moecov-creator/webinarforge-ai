import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") || "untitled-webinar";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title =
      typeof body.title === "string" && body.title.trim()
        ? body.title.trim()
        : "Untitled Webinar";

    const script =
      typeof body.script === "string" ? body.script.trim() : "";

    let workspace = await prisma.workspace.findFirst({
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: { name: "Default Workspace", slug: "default-workspace" },
        select: { id: true },
      });
    }

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.webinar.findFirst({
        where: { slug },
        select: { id: true },
      });
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const webinar = await prisma.webinar.create({
      data: {
        workspaceId: workspace.id,
        title,
        slug,
        script,
      },
    });

    return NextResponse.json({ success: true, webinar });
  } catch (error) {
    console.error("POST /api/webinars error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create webinar" },
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
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch webinars" },
      { status: 500 }
    );
  }
}
