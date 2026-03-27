// app/(dashboard)/dashboard/webinars/[id]/editor/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import WebinarEditorClient from "./editor-client";

export const dynamic = "force-dynamic";

export default async function WebinarEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  const webinar = await prisma.webinar.findUnique({
    where: { id },
  });

  if (!webinar) redirect("/dashboard/webinars");

  return <WebinarEditorClient webinar={webinar} />;
}
