import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const script = typeof body.script === "string" ? body.script : "";

    await prisma.webinar.update({
      where: { id: params.id },
      data: { script },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SAVE SCRIPT ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save script" },
      { status: 500 }
    );
  }
}
