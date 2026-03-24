import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function WebinarEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const webinar = await prisma.webinar.findUnique({
    where: { id: params.id },
  });

  if (!webinar) return notFound();

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Webinar Script Editor</h1>

      {!webinar.script ? (
        <div className="text-gray-400">
          No script found. Generate one first.
        </div>
      ) : (
        <textarea
          defaultValue={webinar.script}
          className="w-full h-[500px] bg-black border border-white/10 p-4 rounded-lg"
        />
      )}
    </div>
  );
}
