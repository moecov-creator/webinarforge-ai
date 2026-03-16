// app/api/integrations/webhooks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { webhookDispatcher } from "@/lib/adapters/webhooks/dispatcher";
import { WEBHOOK_EVENTS } from "@/lib/config/webhooks";

const CreateWebhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1),
  description: z.string().optional(),
});

async function getWorkspaceId(clerkId: string): Promise<string | null> {
  const member = await prisma.workspaceMember.findFirst({
    where: { user: { clerkId }, role: "owner" },
  });
  return member?.workspaceId ?? null;
}

export async function GET(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workspaceId = await getWorkspaceId(clerkId);
  if (!workspaceId) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const subs = await webhookDispatcher.listSubscriptions(workspaceId);
  return NextResponse.json({ subscriptions: subs });
}

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workspaceId = await getWorkspaceId(clerkId);
  if (!workspaceId) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const body = await req.json();
  const parsed = CreateWebhookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  // Validate event types
  const invalidEvents = parsed.data.events.filter(
    (e) => !Object.values(WEBHOOK_EVENTS).includes(e as any)
  );
  if (invalidEvents.length > 0) {
    return NextResponse.json(
      { error: `Unknown event types: ${invalidEvents.join(", ")}` },
      { status: 400 }
    );
  }

  await webhookDispatcher.subscribe(workspaceId, parsed.data);
  return NextResponse.json({ success: true }, { status: 201 });
}
