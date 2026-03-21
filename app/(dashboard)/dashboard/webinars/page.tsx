import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-purple-400">Dashboard / Webinars</p>
            <h1 className="text-3xl md:text-5xl font-bold">Your Webinars</h1>
            <p className="mt-2 text-gray-400">
              View, manage, and launch your AI webinar funnels.
            </p>
          </div>

          <Link href="/dashboard/webinars/new">
            <button className="rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700">
              + Create Webinar
            </button>
          </Link>
        </div>

        {webinars.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <h2 className="text-2xl font-semibold mb-3">No webinars yet</h2>
            <p className="text-gray-400 mb-6">
              Create your first webinar funnel to get started.
            </p>

            <Link href="/">
              <button className="rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700">
                Start My First Webinar →
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {webinars.map((webinar) => (
              <div
                key={webinar.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{webinar.title}</h2>
                    <p className="mt-1 text-sm text-gray-400">
                      {webinar.subtitle || "No subtitle yet"}
                    </p>
                  </div>

                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300">
                    {String(webinar.status)}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <span className="text-gray-500">Niche:</span>{" "}
                    {String(webinar.niche)}
                  </p>
                  <p>
                    <span className="text-gray-500">Mode:</span>{" "}
                    {String(webinar.mode)}
                  </p>
                  <p>
                    <span className="text-gray-500">Slug:</span>{" "}
                    {webinar.slug}
                  </p>
                  <p>
                    <span className="text-gray-500">Created:</span>{" "}
                    {new Date(webinar.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/dashboard/webinars/${webinar.id}`}>
                    <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium hover:bg-white/5">
                      View
                    </button>
                  </Link>

                  <Link href={`/dashboard/evergreen/${webinar.slug}`}>
                    <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium hover:bg-white/5">
                      Preview
                    </button>
                  </Link>

                  <button className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium hover:bg-purple-700">
                    Publish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
