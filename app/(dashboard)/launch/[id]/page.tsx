"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import type { LaunchSummary } from "@/lib/orchestrator/types"
import { getLaunchProgress } from "@/lib/orchestrator/webinarOrchestrator"

type Tab = "overview" | "script" | "funnel" | "emails" | "next"

export default function LaunchResultPage() {
  const params = useParams()
  const router = useRouter()
  const [summary, setSummary] = useState<LaunchSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>("overview")

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`/api/launch?id=${params.id}`)
        const data = await res.json()
        setSummary(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) fetchSummary()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080812] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your launch package...</p>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-[#080812] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-white font-bold mb-2">Launch not found</h2>
          <Link href="/dashboard/launch">
            <button className="text-purple-400 hover:text-purple-300 text-sm underline">Start a new launch →</button>
          </Link>
        </div>
      </div>
    )
  }

  const progress = getLaunchProgress(summary)
  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "🎯" },
    { id: "script", label: "Script", icon: "📝" },
    { id: "funnel", label: "Funnel", icon: "🔥" },
    { id: "emails", label: "Emails", icon: "📧" },
    { id: "next", label: "Next Steps", icon: "🚀" },
  ]

  return (
    <main className="min-h-screen bg-[#080812] text-white">
      <div className="max-w-5xl mx-auto px-5 py-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                summary.status === "ready"
                  ? "bg-green-500/15 text-green-400 border-green-500/30"
                  : "bg-amber-500/15 text-amber-400 border-amber-500/30"
              }`}>
                {summary.status === "ready" ? "✅ Ready to Launch" : "⚙️ " + summary.status}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {summary.webinarAssets?.title || "Your Webinar Funnel"}
            </h1>
            <p className="text-gray-500 text-sm">
              Built for: {summary.request.targetAudience} · {summary.request.funnelType} funnel
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/funnels">
              <button className="text-sm px-4 py-2.5 rounded-xl border border-white/15 hover:border-white/30 transition">
                View in Funnel Hub
              </button>
            </Link>
            <Link href="/dashboard/webinars">
              <button className="text-sm px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold transition">
                🚀 Launch This Funnel →
              </button>
            </Link>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white/4 border border-white/8 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Launch readiness</span>
            <span className="text-sm font-black text-purple-400">{progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="h-2 bg-purple-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/4 border border-white/8 rounded-xl p-1 mb-6 flex-wrap">
          {TABS.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === id ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
              }`}>
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {tab === "overview" && (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-4 text-purple-400">Webinar Hook</h3>
              <p className="text-gray-300 text-sm leading-relaxed italic">
                "{summary.webinarAssets?.hook}"
              </p>
            </div>
            <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-4 text-purple-400">Your Offer Summary</h3>
              <div className="space-y-2 text-sm">
                {[
                  ["Offer", summary.request.offerDescription],
                  ["Price", summary.request.offerPrice],
                  ["Audience", summary.request.targetAudience],
                  ["Goal", summary.request.webinarGoal.replace("_", " ")],
                  ["Type", summary.request.funnelType],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-500">{k}</span>
                    <span className="text-white font-medium text-right ml-4 truncate max-w-[55%]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            {summary.webinarAssets && (
              <div className="bg-white/4 border border-white/8 rounded-2xl p-5 md:col-span-2">
                <h3 className="font-bold text-sm mb-4 text-purple-400">Webinar Outline ({summary.webinarAssets.outline.reduce((a, s) => a + s.duration, 0)} min total)</h3>
                <div className="space-y-2">
                  {summary.webinarAssets.outline.map((s) => (
                    <div key={s.order} className="flex items-start gap-3 bg-white/3 rounded-xl px-4 py-3">
                      <div className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-400 text-xs font-bold flex items-center justify-center flex-shrink-0">{s.order}</div>
                      <div>
                        <div className="text-sm font-semibold text-white">{s.title}</div>
                        <div className="text-xs text-gray-500">{s.duration} min · {s.type} · {s.keyPoints.join(", ")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Script */}
        {tab === "script" && summary.webinarAssets && (
          <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Full Webinar Script</h3>
              <button className="text-xs border border-white/15 px-3 py-1.5 rounded-lg hover:bg-white/5 transition">
                Copy Script
              </button>
            </div>
            <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-black/30 rounded-xl p-5 overflow-auto max-h-[600px]">
              {summary.webinarAssets.fullScript}
            </pre>
          </div>
        )}

        {/* Tab: Funnel */}
        {tab === "funnel" && summary.funnelAssets && (
          <div className="space-y-4">
            <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-4 text-purple-400">Funnel Structure</h3>
              <div className="space-y-3">
                {summary.funnelAssets.structure.map((step) => (
                  <div key={step.order} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{step.order}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">{step.name}</span>
                        <span className="text-[10px] text-gray-500 border border-white/10 px-2 py-0.5 rounded-full">{step.url}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{step.purpose}</p>
                      <div className="flex gap-1 flex-wrap">
                        {step.elements.map((el) => <span key={el} className="text-[10px] bg-white/5 border border-white/8 px-2 py-0.5 rounded-full text-gray-400">{el}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-4 text-purple-400">Landing Page Copy</h3>
              <div className="space-y-3 text-sm">
                <div><span className="text-gray-500 block text-xs mb-1">Headline</span><p className="text-white font-semibold">{summary.funnelAssets.landingPageCopy.headline}</p></div>
                <div><span className="text-gray-500 block text-xs mb-1">Subheadline</span><p className="text-gray-300">{summary.funnelAssets.landingPageCopy.subheadline}</p></div>
                <div><span className="text-gray-500 block text-xs mb-1">Hook</span><p className="text-gray-300 italic">"{summary.funnelAssets.landingPageCopy.hook}"</p></div>
                <div><span className="text-gray-500 block text-xs mb-1">Bullet Points</span>
                  <ul className="space-y-1">{summary.funnelAssets.landingPageCopy.bulletPoints.map((b, i) => <li key={i} className="text-gray-300 flex gap-2"><span className="text-green-400">✔</span>{b}</li>)}</ul>
                </div>
                <div><span className="text-gray-500 block text-xs mb-1">CTA Text</span><p className="text-green-400 font-bold">{summary.funnelAssets.landingPageCopy.ctaText}</p></div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Emails */}
        {tab === "emails" && summary.funnelAssets && (
          <div className="space-y-3">
            {summary.funnelAssets.emailSequence.map((email) => (
              <div key={email.order} className="bg-white/4 border border-white/8 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 text-xs font-bold flex items-center justify-center flex-shrink-0">{email.order}</div>
                  <div className="flex-1">
                    <div className="text-xs text-purple-400 font-semibold mb-1 uppercase tracking-wider">Send: {email.triggerDelay}</div>
                    <div className="text-sm font-semibold text-white mb-0.5">{email.subject}</div>
                    <div className="text-xs text-gray-500 mb-2">{email.previewText}</div>
                    <div className="text-xs text-gray-400 bg-black/20 rounded-lg px-3 py-2">{email.bodyOutline}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Next Steps */}
        {tab === "next" && (
          <div className="space-y-4">
            <div className="bg-amber-500/8 border border-amber-500/25 rounded-2xl p-5">
              <h3 className="font-bold text-amber-400 mb-4">🚀 Your Next Steps to First Sale</h3>
              <div className="space-y-3">
                {summary.nextSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                    <p className="text-sm text-gray-300 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            {summary.funnelAssets?.optimizationRecommendations && (
              <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-4 text-purple-400">Optimization Recommendations</h3>
                <div className="space-y-2">
                  {summary.funnelAssets.optimizationRecommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-gray-400">
                      <span className="text-purple-400 flex-shrink-0 mt-0.5">💡</span>
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <Link href="/dashboard/funnels" className="flex-1">
                <button className="w-full border border-white/20 hover:border-white/40 py-3 rounded-xl text-sm font-semibold transition">View in Funnel Hub</button>
              </Link>
              <Link href="/dashboard/webinars" className="flex-1">
                <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl text-sm transition">🚀 Launch This Funnel →</button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
