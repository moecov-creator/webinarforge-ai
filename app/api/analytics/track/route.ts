// app/api/analytics/track/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyticsService } from "@/lib/services/analytics/analytics.service";
export const dynamic = 'force-dynamic';
const TrackSchema = z.object({
  workspaceId: z.string(),
  event: z.string(),
  webinarId: z.string().optional(),
  sessionId: z.string().optional(),
  properties: z.record(z.unknown()).optional(),
});

// Public endpoint — authenticated by workspaceId only (for client-side tracking)
// In production, add CSRF or signed token validation
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = TrackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    undefined;

  try {
    await analyticsService.track({ ...parsed.data, ipAddress });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Analytics track error:", err);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
