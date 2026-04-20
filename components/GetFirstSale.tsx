"use client"

import { useState } from "react"
import Link from "next/link"

// ─── Step definition ──────────────────────────────────────────────────────────
const STEPS = [
  {
    id: "offer",
    label: "Define your offer",
    desc: "Tell us what you're selling and who it's for",
    icon: "💡",
    href: "/dashboard/launch",
    cta: "Define Offer →",
  },
  {
    id: "webinar",
    label: "Generate your webinar",
    desc: "AI builds your script, slides, and presenter in minutes",
    icon: "🤖",
    href: "/dashboard/launch",
    cta: "Generate Webinar →",
  },
  {
    id: "page",
    label: "Launch your registration page",
    desc: "Publish your funnel and start capturing registrations",
    icon: "🚀",
    href: "/dashboard/funnels",
    cta: "Launch Page →",
  },
  {
    id: "followup",
    label: "Activate follow-up",
    desc: "Turn on your email sequence to convert more leads",
    icon: "📧",
    href: "/dashboard/automation",
    cta: "Activate →",
  },
  {
    id: "traffic",
    label: "Drive traffic",
    desc: "Share your registration link and start getting visitors",
    icon: "📣",
    href: "/dashboard/analytics",
    cta: "View Share Tools →",
  },
  {
    id: "conversion",
    label: "Track your first conversion",
    desc: "Watch your analytics and optimize for sales",
    icon: "💰",
    href: "/dashboard/analytics",
    cta: "View Analytics →",
  },
]

interface GetFirstSaleProps {
  completedSteps?: string[]
  compact?: boolean
}

export default function GetFirstSale({ completedSteps = [], compact = false }: GetFirstSaleProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const completed = completedSteps.length
  const total = STEPS.length
  const pct = Math.round((completed / total) * 100)
  const nextStep = STEPS.find((s) => !completedSteps.includes(s.id))

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-amber-500/10 to-purple-600/10 border border-amber-500/30 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <span className="font-bold text-sm text-white">Get My First Sale</span>
          </div>
          <span className="text-xs text-amber-400 font-semibold">{completed}/{total} complete</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5 mb-3 overflow-hidden">
          <div className="h-1.5 bg-amber-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        {nextStep && (
          <Link href={nextStep.href}>
            <button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-xl text-sm transition">
              {nextStep.icon} {nextStep.cta}
            </button>
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/15 to-purple-600/15 border-b border-white/10 px-6 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🎯</span>
            <h2 className="text-lg font-bold text-white">Get My First Sale</h2>
          </div>
          <p className="text-sm text-gray-400">
            The fastest path from zero to your first webinar conversion.
          </p>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className="text-2xl font-black text-amber-400">{pct}%</div>
          <div className="text-xs text-gray-500">complete</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5">
        <div className="h-1 bg-amber-400 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>

      {/* Steps */}
      <div className="p-6">
        <div className="space-y-3">
          {STEPS.map((s, i) => {
            const isDone = completedSteps.includes(s.id)
            const isNext = s.id === nextStep?.id
            const isLocked = !isDone && !isNext && i > 0 && !completedSteps.includes(STEPS[i - 1].id)

            return (
              <div
                key={s.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  isDone ? "border-green-500/20 bg-green-500/5" :
                  isNext ? "border-amber-500/40 bg-amber-500/8" :
                  "border-white/8 bg-white/3"
                } ${isLocked ? "opacity-40" : ""}`}
              >
                {/* Step icon */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base ${
                  isDone ? "bg-green-500/20 text-green-400" :
                  isNext ? "bg-amber-500/20 text-amber-400" :
                  "bg-white/8 text-gray-500"
                }`}>
                  {isDone ? "✓" : s.icon}
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${isDone ? "text-gray-400 line-through" : "text-white"}`}>
                    {s.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.desc}</div>
                </div>

                {/* CTA */}
                {isNext && !isDone && (
                  <Link href={s.href}>
                    <button className="flex-shrink-0 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-3 py-2 rounded-lg transition">
                      {s.cta}
                    </button>
                  </Link>
                )}
                {isDone && (
                  <span className="text-xs text-green-400 font-semibold flex-shrink-0">Done ✓</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom actions */}
        <div className="mt-5 flex items-center justify-between">
          <Link href="/dashboard/launch">
            <button className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium">
              🚀 Launch My Webinar Funnel →
            </button>
          </Link>
          <button onClick={() => setDismissed(true)} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
