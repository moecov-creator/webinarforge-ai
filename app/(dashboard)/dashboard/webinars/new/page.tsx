"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NICHES = [
  "REAL_ESTATE",
  "COACH_CONSULTANT",
  "TRAVEL",
  "SAAS",
  "LOCAL_SERVICES",
  "OTHER",
];

const NICHE_LABELS: Record<string, string> = {
  REAL_ESTATE: "Real Estate",
  COACH_CONSULTANT: "Coaches & Consultants",
  TRAVEL: "Travel",
  SAAS: "SaaS",
  LOCAL_SERVICES: "Local Services",
  OTHER: "Other",
};

export default function NewWebinarPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [niche, setNiche] = useState("COACH_CONSULTANT");
  const [audience, setAudience] = useState("");
  const [corePromise, setCorePromise] = useState("");
  const [cta, setCta] = useState("");

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [script, setScript] = useState("");
  const [webinarId, setWebinarId] = useState("");

  const handleGenerateScript = async () => {
    if (!title.trim() || !corePromise.trim()) {
      setError("Please fill in Webinar Title and Core Promise first.");
      return;
    }

    try {
      setGenerating(true);
      setError("");
      setScript("");
      setWebinarId("");

      // Step 1: Generate the script with OpenAI
      const genRes = await fetch("/api/webinars/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerName: title,
          niche: NICHE_LABELS[niche],
          idealAudience: audience || NICHE_LABELS[niche],
          desiredOutcome: corePromise,
          ctaGoal: cta || "Book a call",
        }),
      });

      const genData = await genRes.json();

      if (!genRes.ok || !genData.success) {
        throw new Error(genData.error || "Generation failed");
      }

      const generatedScript: string = genData.script;

      // Step 2: Save the webinar + script to the database
      const createRes = await fetch("/api/webinars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          niche: NICHE_LABELS[niche],
          corePromise,
          cta: cta || "Book a call",
          script: generatedScript,
        }),
      });

      const createData = await createRes.json();

      if (!createRes.ok || !createData.success) {
        throw new Error(createData.error || "Failed to save webinar");
      }

      setWebinarId(createData.webinar.id);
      setScript(generatedScript);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenEditor = () => {
    if (webinarId) {
      router.push(`/dashboard/webinars/${webinarId}/editor`);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-purple-400">Webinars / New</p>
            <h1 className="text-3xl md:text-5xl font-bold">Create New Webinar</h1>
            <p className="mt-2 text-gray-400">
              Build your next AI-powered evergreen webinar funnel in minutes.
            </p>
          </div>
          <Link href="/dashboard">
            <button className="rounded-xl border border-white/20 px-5 py-3 font-medium hover:border-white/50 transition-colors">
              ← Back to Dashboard
            </button>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          {/* Left: Form */}
          <div className="max-w-2xl space-y-5">

            <div>
              <label className="block text-sm text-gray-300 mb-2">Webinar Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The 3-Step System to Land High-Ticket Clients"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Niche / Industry</label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
              >
                {NICHES.map((n) => (
                  <option key={n} value={n}>{NICHE_LABELS[n]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Target Audience{" "}
                <span className="text-gray-500">(optional — be specific)</span>
              </label>
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Coaches stuck under $10k/month wanting to scale"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Core Promise</label>
              <input
                value={corePromise}
                onChange={(e) => setCorePromise(e.target.value)}
                placeholder="e.g. Get more leads without cold outreach"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Main CTA</label>
              <input
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                placeholder="e.g. Book a call / Start free trial"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={handleGenerateScript}
                disabled={generating || !!webinarId}
                className="w-full bg-purple-600 hover:bg-purple-700 px-6 py-4 rounded-xl font-semibold disabled:opacity-50 transition-colors"
              >
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Generating...
                  </span>
                ) : webinarId ? "✓ Generated!" : "Generate AI Script"}
              </button>

              {webinarId ? (
                <button
                  onClick={handleOpenEditor}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 px-6 py-4 rounded-xl font-semibold transition-colors"
                >
                  Open Editor →
                </button>
              ) : (
                <button
                  onClick={() => router.push("/dashboard/webinars")}
                  disabled={generating}
                  className="w-full border border-white/20 hover:border-white/40 px-6 py-4 rounded-xl font-semibold disabled:opacity-50 transition-colors"
                >
                  My Webinars →
                </button>
              )}
            </div>

            {webinarId && (
              <p className="text-xs text-gray-500 text-center">
                Webinar ID:{" "}
                <span className="font-mono text-gray-400">{webinarId}</span>
              </p>
            )}
          </div>

          {/* Right: Preview */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-semibold mb-4">AI Webinar Script Preview</h2>
            <div className="min-h-[500px] whitespace-pre-wrap text-sm leading-7 text-gray-300">
              {generating ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center">
                    <svg className="animate-spin h-6 w-6 text-purple-400" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">Generating your webinar with AI...</p>
                  <p className="text-gray-600 text-xs">This takes about 15–30 seconds</p>
                </div>
              ) : script ? (
                <>
                  <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                    ✅ Webinar created successfully! Click &ldquo;Open Editor →&rdquo; to edit your script.
                  </div>
                  {script}
                </>
              ) : (
                <p className="text-gray-600">
                  Fill in the form and click &ldquo;Generate AI Script&rdquo; to build your complete
                  webinar — script, offer stack, CTAs, and timed comments.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
