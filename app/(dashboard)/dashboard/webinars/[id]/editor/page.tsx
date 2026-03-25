// app/(dashboard)/dashboard/webinars/[id]/editor/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import WebinarEditorClient from "./editor-client";

export default async function WebinarEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  const webinar = await prisma.webinar.findFirst({
    where: {
      id,
      workspace: { members: { some: { user: { clerkId: userId } } } },
    },
    include: {
      sections: { orderBy: { position: "asc" } },
      ctaSequences: { orderBy: { triggerTime: "asc" } },
      timedComments: { orderBy: { timestamp: "asc" } },
      offers: true,
      bonuses: true,
      objections: true,
    },
  });

  if (!webinar) redirect("/dashboard/webinars");

  return <WebinarEditorClient webinar={webinar} />;
}
