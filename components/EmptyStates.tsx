"use client"

import Link from "next/link"

interface EmptyStateProps {
  onAction?: () => void
}

// ─── Webinars empty state ─────────────────────────────────────────────────────
export function WebinarsEmptyState({ onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-5 text-2xl">
        🎬
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No webinars yet</h3>
      <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-6">
        Your first AI-generated webinar is 10 minutes away. Tell us your offer and we'll build the entire funnel.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/dashboard/launch">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition">
            🚀 Launch My First Webinar Funnel
          </button>
        </Link>
        <Link href="/dashboard/funnels/templates">
          <button className="border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-xl text-sm transition">
            Browse Templates
          </button>
        </Link>
      </div>
    </div>
  )
}

// ─── Funnels empty state ──────────────────────────────────────────────────────
export function FunnelsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-5 text-2xl">
        🔥
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Build your first funnel</h3>
      <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-6">
        Generate a complete webinar funnel — landing page, registration form, follow-up emails, and AI presenter — in minutes.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/dashboard/funnels/generator">
          <button className="bg-amber-500 hover:bg-amber-400 text-black font-black px-6 py-3 rounded-xl text-sm transition">
            🤖 Generate a Funnel That Converts →
          </button>
        </Link>
        <Link href="/dashboard/funnels/templates">
          <button className="border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-xl text-sm transition">
            Choose a Template
          </button>
        </Link>
      </div>
    </div>
  )
}

// ─── AI Presenters empty state ────────────────────────────────────────────────
export function PresentersEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-5 text-2xl">
        🎭
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No AI presenters yet</h3>
      <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-6">
        Your AI presenter delivers your webinar 24/7 while you focus on everything else. Select or create one to get started.
      </p>
      <Link href="/dashboard/presenters/new">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition">
          Create Your AI Presenter →
        </button>
      </Link>
    </div>
  )
}

// ─── Automation empty state ───────────────────────────────────────────────────
export function AutomationEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-green-600/20 border border-green-500/30 flex items-center justify-center mb-5 text-2xl">
        ⚡
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Activate follow-up automation</h3>
      <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-6">
        Most revenue is made in the follow-up. Enable email sequences, reminders, and behavioral triggers to convert more leads automatically.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/dashboard/automation/new">
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition">
            Enable Follow-Up Automation →
          </button>
        </Link>
        <Link href="/dashboard/launch">
          <button className="border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-xl text-sm transition">
            Launch Full Funnel (includes automation)
          </button>
        </Link>
      </div>
    </div>
  )
}

// ─── Analytics empty state ────────────────────────────────────────────────────
export function AnalyticsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-5 text-2xl">
        📊
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No data yet — time to launch</h3>
      <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-6">
        Once your funnel is live, you'll see registrations, show-up rates, CTA clicks, and conversion data — with AI interpretation of what to improve.
      </p>
      <Link href="/dashboard/launch">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition">
          Launch Your First Funnel →
        </button>
      </Link>
    </div>
  )
}

// ─── Generic guided empty state ───────────────────────────────────────────────
export function GuidedEmptyState({
  icon,
  title,
  description,
  primaryCta,
  primaryHref,
  secondaryCta,
  secondaryHref,
}: {
  icon: string
  title: string
  description: string
  primaryCta: string
  primaryHref: string
  secondaryCta?: string
  secondaryHref?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/8 border border-white/15 flex items-center justify-center mb-5 text-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-6">{description}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href={primaryHref}>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition">
            {primaryCta}
          </button>
        </Link>
        {secondaryCta && secondaryHref && (
          <Link href={secondaryHref}>
            <button className="border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-xl text-sm transition">
              {secondaryCta}
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}
