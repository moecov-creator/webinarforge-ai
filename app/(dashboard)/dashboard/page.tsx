"use client"

import { useState } from "react"
import Link from "next/link"
import GetFirstSale from "@/components/GetFirstSale"
import { InsightPanel, HealthBadge } from "@/components/InsightCards"
import { generateInsights, getOverallHealth } from "@/lib/orchestrator/utils"

// ─── Mock data — replace with real API calls ──────────────────────────────────
const MOCK_STATS = {
  activeWebinars: 4,
  registrations: 312,
  ctaClicks: 47,
  conversionRate: 18.4,
  registrationsChange: "+18%",
  ctaChange: "+12%",
}

const MOCK_WEBINARS = [
  { id: "1", name: "3-Step High-Ticket Coaching System", status: "live", registrations: 128, clicks: 19 },
  { id: "2", name: "Real Estate Lead Machine", status: "live", registrations: 94, clicks: 14 },
  { id: "3", name: "SaaS Demo-to-Trial Converter", status: "draft", registrations: 0, clicks: 0 },
]

const MOCK_METRICS = {
  registrationRate: 38,
  showUpRate: 29,
  ctaClickRate: 12,
  conversionRate: 18.4,
  avgWatchTime: 34,
  dropOffPoint: 0,
  emailOpenRate: 28,
}

// TODO: Replace with real user plan from Clerk/DB
const USER_PLAN = "pro" as "starter" | "pro" | "enterprise"
const ACTIVE_FUNNEL_ID = "funnel_demo_001"

const QUICK_ACTIONS = [
  { icon: "🚀", label: "Launch My Webinar Funnel", desc: "Full AI-powered launch in minutes", href: "/dashboard/launch", accent: "border-amber-500/40 hover:border-amber-500 bg-amber-500/5" },
  { icon: "🤖", label: "AI Funnel Generator", desc: "Generate a funnel that converts", href: "/dashboard/funnels/generator", accent: "border-purple-500/40 hover:border-purple-500 bg-purple-500/5" },
  { icon: "📋", label: "Funnel Templates", desc: "17+ proven templates", href: "/dashboard/funnels/templates", accent: "border-blue-500/40 hover:border-blue-500 bg-blue-500/5" },
  { icon: "📅", label: "Content Calendar", desc: "Schedule posts across all platforms", href: "/dashboard/content-calendar", accent: "border-green-500/40 hover:border-green-500 bg-green-500/5" },
  { icon: "📊", label: "Track Revenue Performance", desc: "See what's converting", href: "/dashboard/analytics", accent: "border-indigo-500/40 hover:border-indigo-500 bg-indigo-500/5" },
  { icon: "🔗", label: "Form Builder", desc: "A2P compliant lead capture", href: "/dashboard/forms", accent: "border-pink-500/40 hover:border-pink-500 bg-pink-500/5" },
  { icon: "⚡", label: "Automation", desc: "Set up follow-up sequences", href: "/dashboard/automation", accent: "border-yellow-500/40 hover:border-yellow-500 bg-yellow-500/5" },
  { icon: "🏆", label: "Affiliates", desc: "Grow with partner traffic", href: "/dashboard/affiliates", accent: "border-emerald-500/40 hover:border-emerald-500 bg-emerald-500/5" },
]

const STATUS_STYLES: Record<string, string> = {
  live: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  draft: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  paused: "bg-amber-500/15 text-amber-400 border-amber-500/30",
}

function StatCard({ label, value, delta, color, icon }: {
  label: string; value: string | number; delta?: string; color: string; icon: string;
}) {
  return (
    <div className="bg-[#0d0d1a] border border-white/8 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <span className="text-lg">{icon}</span>
      </div>
      <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
      {delta && <p className="text-xs text-gray-600">{delta} vs last week</p>}
    </div>
  )
}

export default function DashboardPage() {
  const insights = generateInsights(MOCK_METRICS)
  const health = getOverallHealth(MOCK_METRICS)

  // TODO: Replace with real user data
  const isNewUser = false
  const completedOnboardingSteps: string[] = ["offer"]

  return (
    <main className="min-h-screen bg-[#080812] text-white">
      <div className="max-w-7xl mx-auto px-5 py-8 space-y-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Welcome back 👋</h1>
            <p className="text-gray-500 text-sm">Manage your webinars, funnels, and automations from one place.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/dashboard/funnels/generator">
              <button className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border border-white/15 hover:border-purple-500/50 hover:bg-purple-500/8 transition-all">
                🤖 AI Generator
              </button>
            </Link>
            <Link href="/dashboard/funnels">
              <button className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border border-white/15 hover:border-white/30 transition-all">
                🚀 View Funnel
              </button>
            </Link>
            <Link href="/dashboard/launch">
              <button className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all">
                + Launch My Webinar Funnel
              </button>
            </Link>
          </div>
        </div>

        {/* ── Get First Sale ──────────────────────────────────────────────── */}
        {(isNewUser || completedOnboardingSteps.length < 6) && (
          <GetFirstSale
            completedSteps={completedOnboardingSteps}
            userPlan={USER_PLAN}
            launchContext={{
              offerDescription: "High-ticket coaching program",
              targetAudience: "coaches and consultants",
              webinarGoal: "book_calls",
            }}
          />
        )}

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Active Webinars" value={MOCK_STATS.activeWebinars} delta="+2 this week" color="text-white" icon="🎬" />
          <StatCard label="Registrations" value={MOCK_STATS.registrations} delta={MOCK_STATS.registrationsChange} color="text-white" icon="👥" />
          <StatCard label="CTA Clicks" value={MOCK_STATS.ctaClicks} delta={MOCK_STATS.ctaChange} color="text-white" icon="🖱️" />
          <StatCard label="Conversion Rate" value={`${MOCK_STATS.conversionRate}%`} delta="Healthy performance" color="text-purple-400" icon="💰" />
        </div>

        {/* ── Quick Actions ───────────────────────────────────────────────── */}
        <div>
          <h2 className="text-base font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map((a) => (
              <Link key={a.label} href={a.href}>
                <div className={`border rounded-2xl p-4 cursor-pointer transition-all group ${a.accent}`}>
                  <div className="text-xl mb-2">{a.icon}</div>
                  <div className="text-sm font-semibold text-white group-hover:text-white leading-tight mb-0.5">{a.label}</div>
                  <div className="text-[11px] text-gray-500 leading-tight">{a.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Main content ────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-[1fr_340px] gap-6">

          {/* Recent webinars */}
          <div className="bg-[#0d0d1a] border border-white/8 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-base">Recent Webinars</h2>
                <p className="text-xs text-gray-500 mt-0.5">Your latest webinar funnels and their performance.</p>
              </div>
              <Link href="/dashboard/webinars" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-white/5 text-[10px] text-gray-600 font-semibold uppercase tracking-wider">
              <div className="col-span-5">Webinar</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3 text-right">Registrations</div>
              <div className="col-span-2 text-right">CTA Clicks</div>
            </div>
            {MOCK_WEBINARS.map((w) => (
              <Link key={w.id} href={`/dashboard/webinars/${w.id}`}>
                <div className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-white/5 hover:bg-white/3 transition-colors items-center cursor-pointer last:border-0">
                  <div className="col-span-5 text-sm font-medium text-white truncate">{w.name}</div>
                  <div className="col-span-2">
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${STATUS_STYLES[w.status]}`}>
                      {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                    </span>
                  </div>
                  <div className="col-span-3 text-right text-sm font-semibold">{w.registrations > 0 ? w.registrations : "—"}</div>
                  <div className="col-span-2 text-right text-sm font-semibold">{w.clicks > 0 ? w.clicks : "—"}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick links + upgrade */}
          <div className="space-y-4">
            <div className="bg-[#0d0d1a] border border-white/8 rounded-2xl p-5">
              <h3 className="font-semibold text-sm mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { icon: "🚀", label: "Launch My Webinar Funnel", href: "/dashboard/launch", highlight: true },
                  { icon: "🤖", label: "AI Funnel Generator", href: "/dashboard/funnels/generator" },
                  { icon: "📋", label: "Funnel Templates", href: "/dashboard/funnels/templates" },
                  { icon: "📊", label: "View Analytics", href: "/dashboard/analytics" },
                  { icon: "📅", label: "Content Calendar", href: "/dashboard/content-calendar" },
                  { icon: "📝", label: "Form Builder", href: "/dashboard/forms" },
                ].map((a) => (
                  <Link key={a.label} href={a.href}>
                    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                      a.highlight ? "bg-purple-600/15 border border-purple-500/30 hover:bg-purple-600/25" : "hover:bg-white/5"
                    }`}>
                      <span className="text-sm">{a.icon}</span>
                      <span className={`text-sm ${a.highlight ? "text-purple-300 font-medium" : "text-gray-300"}`}>{a.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upgrade card — shown to starter users */}
            {USER_PLAN === "starter" && (
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/20 border border-purple-500/25 rounded-2xl p-5">
                <div className="text-sm font-bold text-white mb-1">Unlock Auto-Fix & Auto-Optimize</div>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Pro users can fix CTA issues, optimize landing pages, and run their entire launch automatically — with one click.
                </p>
                <div className="space-y-1.5 mb-4">
                  {["⚡ Fix This For Me buttons", "🔄 Auto Optimize mode", "🚀 Run All Steps Automatically", "📊 Advanced analytics insights"].map((f) => (
                    <div key={f} className="text-xs text-gray-300">{f}</div>
                  ))}
                </div>
                <Link href="/dashboard/billing">
                  <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-sm transition">
                    Upgrade to Pro — $297/mo →
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── Performance + Insights ───────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Performance chart */}
          <div className="bg-[#0d0d1a] border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-base">Funnel Performance</h3>
                <p className="text-xs text-gray-500 mt-0.5">Registrations over the last 7 days.</p>
              </div>
              <Link href="/dashboard/analytics" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                Full analytics →
              </Link>
            </div>
            <div className="flex items-end gap-2 h-28">
              {[24, 18, 35, 28, 42, 38, 47].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-purple-600/60 rounded-t hover:bg-purple-500 transition-colors"
                    style={{ height: `${(v / 50) * 100}%` }}
                    title={`${v} registrations`}
                  />
                  <span className="text-[9px] text-gray-600">{["M","T","W","T","F","S","S"][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Insight panel — now with Fix This For Me + Auto Optimize */}
          <div className="bg-[#0d0d1a] border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-base">What's Blocking Conversions</h3>
                  <HealthBadge health={health} />
                </div>
                <p className="text-xs text-gray-500">AI-interpreted insights with one-click fixes</p>
              </div>
            </div>
            <InsightPanel
              insights={insights.slice(0, 3)}
              userPlan={USER_PLAN}
              funnelId={ACTIVE_FUNNEL_ID}
              metrics={MOCK_METRICS}
            />
            {insights.length > 3 && (
              <Link href="/dashboard/analytics" className="mt-3 block text-xs text-center text-purple-400 hover:text-purple-300 transition-colors">
                See all {insights.length} insights →
              </Link>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}
