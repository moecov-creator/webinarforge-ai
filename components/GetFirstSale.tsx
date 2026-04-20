"use client"

import { useState } from "react"
import Link from "next/link"
import type { AutoRunResult } from "@/lib/orchestrator/types"

// ─── Step definition ──────────────────────────────────────────────────────────
const STEPS = [
  {
    id: "offer",
    label: "Define your offer",
    desc: "Tell us what you're selling and who it's for",
    icon: "💡",
    href: "/dashboard/launch",
    cta: "Define Offer →",
    autoRunKey: null, // completed manually in wizard
  },
  {
    id: "webinar",
    label: "Generate your webinar",
    desc: "AI builds your script, slides, and presenter in minutes",
    icon: "🤖",
    href: "/dashboard/launch",
    cta: "Generate Webinar →",
    autoRunKey: "webinar_generated",
  },
  {
    id: "page",
    label: "Launch your registration page",
    desc: "Publish your funnel and start capturing registrations",
    icon: "🚀",
    href: "/dashboard/funnels",
    cta: "Launch Page →",
    autoRunKey: "funnel_created",
  },
  {
    id: "followup",
    label: "Activate follow-up",
    desc: "Turn on your email sequence to convert more leads",
    icon: "📧",
    href: "/dashboard/automation",
    cta: "Activate →",
    autoRunKey: "automation_configured",
  },
  {
    id: "traffic",
    label: "Drive traffic",
    desc: "Share your registration link and start getting visitors",
    icon: "📣",
    href: "/dashboard/analytics",
    cta: "View Share Tools →",
    autoRunKey: null,
  },
  {
    id: "conversion",
    label: "Track your first conversion",
    desc: "Watch your analytics and optimize for sales",
    icon: "💰",
    href: "/dashboard/analytics",
    cta: "View Analytics →",
    autoRunKey: null,
  },
]

// Auto-run animation steps shown during execution
const AUTO_RUN_MESSAGES = [
  { key: "webinar_generated", label: "Generating your webinar script...", icon: "📝" },
  { key: "funnel_created", label: "Building your funnel pages...", icon: "🔥" },
  { key: "presenter_assigned", label: "Assigning your AI presenter...", icon: "🎭" },
  { key: "automation_configured", label: "Setting up follow-up automation...", icon: "⚡" },
  { key: "analytics_initialized", label: "Initializing analytics tracking...", icon: "📊" },
]

interface GetFirstSaleProps {
  completedSteps?: string[]
  compact?: boolean
  userPlan?: "starter" | "pro" | "enterprise"
  // Minimal context for auto-run (collected from first onboarding step)
  launchContext?: {
    offerDescription?: string
    targetAudience?: string
    webinarGoal?: string
  }
}

export default function GetFirstSale({
  completedSteps = [],
  compact = false,
  userPlan = "starter",
  launchContext = {},
}: GetFirstSaleProps) {
  const [dismissed, setDismissed] = useState(false)
  const [autoRunning, setAutoRunning] = useState(false)
  const [autoRunStep, setAutoRunStep] = useState("")
  const [autoRunCompleted, setAutoRunCompleted] = useState<string[]>([])
  const [autoRunResult, setAutoRunResult] = useState<AutoRunResult | null>(null)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [localCompleted, setLocalCompleted] = useState<string[]>(completedSteps)

  if (dismissed) return null

  const allCompleted = [...localCompleted]
  const completed = allCompleted.length
  const total = STEPS.length
  const pct = Math.round((completed / total) * 100)
  const nextStep = STEPS.find((s) => !allCompleted.includes(s.id))

  // ── Auto-run handler ────────────────────────────────────────────────────────
  const handleAutoRun = async () => {
    if (userPlan === "starter") { setShowUpgradePrompt(true); return }

    setAutoRunning(true)
    setAutoRunCompleted([])
    setAutoRunResult(null)

    try {
      // Animate through steps with visual feedback
      for (const step of AUTO_RUN_MESSAGES) {
        setAutoRunStep(step.label)
        await new Promise((r) => setTimeout(r, 900))
        setAutoRunCompleted((prev) => [...prev, step.key])
      }

      // Call the auto-run API
      const res = await fetch("/api/launch/auto-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerDescription: launchContext.offerDescription || "Your coaching program",
          targetAudience: launchContext.targetAudience || "coaches and consultants",
          webinarGoal: launchContext.webinarGoal || "book_calls",
        }),
      })

      const result: AutoRunResult = await res.json()
      setAutoRunResult(result)

      // Mark steps as completed in local UI
      const newCompleted = ["webinar", "page", "followup"]
      setLocalCompleted((prev) => [...new Set([...prev, ...newCompleted])])

    } catch {
      setAutoRunResult({
        success: false,
        stepsCompleted: [],
        stepsFailed: ["all"],
        summary: "Auto-run failed. Please try again or complete steps manually.",
      })
    } finally {
      setAutoRunning(false)
      setAutoRunStep("")
    }
  }

  // ── Compact variant ─────────────────────────────────────────────────────────
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

  // ── Auto-run animation overlay ───────────────────────────────────────────────
  if (autoRunning || autoRunResult) {
    return (
      <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600/15 to-amber-500/15 border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{autoRunResult?.success ? "🎉" : "⚙️"}</span>
            <h2 className="text-lg font-bold text-white">
              {autoRunning ? "Running All Steps..." : autoRunResult?.success ? "All Done!" : "Partially Completed"}
            </h2>
          </div>
          <p className="text-sm text-gray-400">
            {autoRunning
              ? "Sit back while we build your funnel automatically."
              : autoRunResult?.summary}
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-3 mb-5">
            {AUTO_RUN_MESSAGES.map((step) => {
              const isDone = autoRunCompleted.includes(step.key)
              const isActive = autoRunStep === step.label
              return (
                <div
                  key={step.key}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isDone ? "border-green-500/20 bg-green-500/5" :
                    isActive ? "border-purple-500/40 bg-purple-500/8" :
                    "border-white/8 bg-white/3 opacity-40"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base ${
                    isDone ? "bg-green-500/20" : isActive ? "bg-purple-500/20" : "bg-white/8"
                  }`}>
                    {isDone ? "✓" : isActive ? (
                      <svg className="w-4 h-4 text-purple-400 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : step.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-semibold ${isDone ? "text-green-400" : isActive ? "text-white" : "text-gray-600"}`}>
                      {step.label}
                    </div>
                  </div>
                  {isDone && <span className="text-xs text-green-400 font-semibold">Done ✓</span>}
                </div>
              )
            })}
          </div>

          {/* Completion actions */}
          {autoRunResult && !autoRunning && (
            <div className="space-y-2">
              {autoRunResult.success && autoRunResult.launchSummary && (
                <a href={`/dashboard/launch/${autoRunResult.launchSummary.id}`}>
                  <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl text-sm transition">
                    🚀 View My Launch Package →
                  </button>
                </a>
              )}
              <button
                onClick={() => { setAutoRunResult(null); setAutoRunCompleted([]) }}
                className="w-full border border-white/15 text-gray-400 hover:text-white py-3 rounded-xl text-sm transition"
              >
                Back to checklist
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Full variant ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* Pro upgrade modal */}
      {showUpgradePrompt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0d1a] border border-purple-500/40 rounded-2xl p-6 max-w-sm w-full">
            <div className="text-3xl mb-3 text-center">🔒</div>
            <h3 className="text-lg font-black text-white text-center mb-2">Pro Feature</h3>
            <p className="text-gray-400 text-sm text-center leading-relaxed mb-5">
              "Run All Steps Automatically" is a <strong className="text-white">Pro feature</strong>. Upgrade to let the AI execute your entire launch automatically.
            </p>
            <div className="space-y-2">
              <a href="/dashboard/billing">
                <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl text-sm transition">
                  Upgrade to Pro — $297/mo →
                </button>
              </a>
              <button onClick={() => setShowUpgradePrompt(false)} className="w-full border border-white/15 text-gray-400 py-3 rounded-xl text-sm transition hover:text-white">
                Continue manually
              </button>
            </div>
          </div>
        </div>
      )}

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
          <div className="space-y-3 mb-5">
            {STEPS.map((s, i) => {
              const isDone = allCompleted.includes(s.id)
              const isNext = s.id === nextStep?.id
              const isLocked = !isDone && !isNext && i > 0 && !allCompleted.includes(STEPS[i - 1].id)

              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isDone ? "border-green-500/20 bg-green-500/5" :
                    isNext ? "border-amber-500/40 bg-amber-500/8" :
                    "border-white/8 bg-white/3"
                  } ${isLocked ? "opacity-40" : ""}`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base ${
                    isDone ? "bg-green-500/20 text-green-400" :
                    isNext ? "bg-amber-500/20 text-amber-400" :
                    "bg-white/8 text-gray-500"
                  }`}>
                    {isDone ? "✓" : s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold ${isDone ? "text-gray-400 line-through" : "text-white"}`}>
                      {s.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.desc}</div>
                  </div>
                  {isNext && !isDone && (
                    <Link href={s.href}>
                      <button className="flex-shrink-0 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-3 py-2 rounded-lg transition">
                        {s.cta}
                      </button>
                    </Link>
                  )}
                  {isDone && <span className="text-xs text-green-400 font-semibold flex-shrink-0">Done ✓</span>}
                </div>
              )
            })}
          </div>

          {/* Bottom actions */}
          <div className="space-y-3">
            {/* Run All Steps Automatically — primary CTA */}
            <button
              onClick={handleAutoRun}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${
                userPlan === "starter"
                  ? "border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 bg-white/3"
                  : "bg-purple-600 hover:bg-purple-500 text-white"
              }`}
            >
              {userPlan === "starter" ? "🔒" : "⚡"} Run All Steps Automatically
              {userPlan === "starter" && (
                <span className="text-[9px] font-bold bg-purple-500/20 border border-purple-500/30 px-1.5 py-0.5 rounded-full uppercase tracking-wide ml-1">
                  Pro
                </span>
              )}
            </button>

            {/* Manual launch link */}
            <div className="flex items-center justify-between">
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
      </div>
    </>
  )
}
