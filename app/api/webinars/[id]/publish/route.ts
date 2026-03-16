// app/api/webinars/[id]/publish/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { webinarService } from "@/lib/services/webinars/webinar.service";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const webinar = await webinarService.publish(params.id);
    return NextResponse.json({ webinar });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const webinar = await webinarService.unpublish(params.id);
    return NextResponse.json({ webinar });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
