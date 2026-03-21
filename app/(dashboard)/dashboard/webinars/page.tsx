import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // 🔥 IMPORTANT FIX

export default async function WebinarsPage() {
  const webinars = await prisma.webinar.findMany({
    where: {
      workspaceId: "default-workspace",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-4xl font-bold mb-6">Your Webinars</h1>

        {webinars.length === 0 ? (
          <div className="text-center text-gray-400">
            No webinars yet
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {webinars.map((webinar) => (
              <div
                key={webinar.id}
                className="p-6 border border-white/10 rounded-xl"
              >
                <h2 className="text-xl font-semibold">
                  {webinar.title}
                </h2>

                <p className="text-sm text-gray-400 mt-2">
                  {webinar.slug}
                </p>

                <div className="mt-4">
                  <Link href={`/dashboard/webinars/${webinar.id}`}>
                    <button className="bg-purple-600 px-4 py-2 rounded-lg">
                      View
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
