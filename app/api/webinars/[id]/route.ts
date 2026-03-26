import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const webinar = await prisma.webinar.findUnique({
      where: { id: params.id },
    });

    if (!webinar) {
      return NextResponse.json(
        { success: false, error: "Webinar not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, webinar });
  } catch (error) {
    console.error("GET /api/webinars/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch webinar" },
      { status: 500 }
    );
  }
}
