"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Webinar = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  script?: string | null;
};

export default function WebinarsPage() {
  const router = useRouter();
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWebinars() {
      try {
        const res = await fetch("/api/webinars");
        const data = await res.json();
        if (data.success) setWebinars(data.webinars);
      } catch (err) {
        console.error("Failed to fetch webinars", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWebinars();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Webinars</h1>
            <p className="text-gray-400 mt-1 text-sm">
              Manage and edit your AI-generated webinar scripts.
            </p>
          </div>
          <Link href="/dashboard/webinars/new">
            <button className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl font-semibold transition-colors">
              + New Webinar
            </button>
          </Link>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <svg className="animate-spin h-8 w-8 text-purple-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : webinars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500">
            <div className="text-5xl">📭</div>
            <p className="text-lg">No webinars yet.</p>
            <Link href="/dashboard/webinars/new">
              <button className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl font-semibold transition-colors text-white">
                Create your first webinar
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {webinars.map((w) => (
              <div
                key={w.id}
                className="border border-white/10 bg-white/[0.03] rounded-2xl p-6 flex flex-col gap-4 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-base leading-snug">{w.title}</h2>
                  <span
                    className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                      w.status === "PUBLISHED"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-white/8 text-white/40"
                    }`}
                  >
                    {w.status}
                  </span>
                </div>

                <p className="text-xs text-gray-600">
                  {new Date(w.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => router.push(`/dashboard/webinars/${w.id}/editor`)}
                    className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {w.script ? "Edit Script" : "Open Editor"}
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/webinars/${w.id}/funnel`)}
                    className="flex-1 border border-white/15 hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Funnel
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
