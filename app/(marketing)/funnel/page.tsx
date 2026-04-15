"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// ─── Types ────────────────────────────────────────────────────────────────────
type FunnelStatus = "live" | "draft" | "paused"

type Funnel = {
  id: string
  name: string
  type: string
  status: FunnelStatus
  steps: number
  registrations: number
  clicks: number
  conversion: string
  lastEdited: string
  color: string
}

// ─── Sample data ──────────────────────────────────────────────────────────────
const MY_FUNNELS: Funnel[] = [
  {
    id: "1",
    name: "WebinarForge AI — Early Bird Launch",
    type: "Sales Funnel",
    status: "live",
    steps: 4,
    registrations: 312,
    clicks: 47,
    conversion: "15.1%",
    lastEdited: "Today",
    color: "#7c3aed",
  },
  {
    id: "2",
    name: "High Ticket Secrets — Lead Squeeze",
    type: "Lead Funnel",
    status: "live",
    steps: 2,
    registrations: 88,
    clicks: 22,
    conversion: "25.0%",
    lastEdited: "3 days ago",
    color: "#059669",
  },
  {
    id: "3",
    name: "1 Comma Club Challenge",
    type: "Challenge Funnel",
    status: "draft",
    steps: 4,
    registrations: 0,
    clicks: 0,
    conversion: "—",
    lastEdited: "1 week ago",
    color: "#2563eb",
  },
]

const TEMPLATES = [
  { id: "earlybird", name: "WebinarForge AI — Early Bird", cat: "SaaS & Digital", steps: 4, color: "#7c3aed", accent: "#a78bfa", ctaColor: "#059669" },
  { id: "ai-sales", name: "AI-Powered Sales System", cat: "AI & Automation", steps: 3, color: "#0a0a1a", accent: "#7c3aed", ctaColor: "#7c3aed" },
  { id: "webinar-b2b", name: "Webinar Funnel — B2B", cat: "Webinar Funnels", steps: 3, color: "#4c1d95", accent: "#fbbf24", ctaColor: "#f59e0b" },
  { id: "hvac", name: "HVAC Services", cat: "Local Services", steps: 2, color: "#1c1917", accent: "#ef4444", ctaColor: "#dc2626" },
  { id: "hts", name: "High Ticket Lead Squeeze", cat: "Lead Funnels", steps: 2, color: "#111827", accent: "#22c55e", ctaColor: "#22c55e" },
  { id: "roofing", name: "Roofing Agency", cat: "Local Services", steps: 2, color: "#064e3b", accent: "#6ee7b7", ctaColor: "#059669" },
  { id: "coach", name: "Coaching & Consulting", cat: "Professional Service", steps: 3, color: "#1e1b4b", accent: "#c4b5fd", ctaColor: "#7c3aed" },
  { id: "saas", name: "SaaS Free Trial", cat: "SaaS & Digital", steps: 3, color: "#0f172a", accent: "#38bdf8", ctaColor: "#0284c7" },
]

const STAT_COLORS: Record<FunnelStatus, string> = {
  live: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  draft: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  paused: "bg-amber-500/15 text-amber-400 border-amber-500/30",
}

// ─── Sub-views ────────────────────────────────────────────────────────────────
type View = "hub" | "templates" | "editor" | "workflows"

export default function FunnelHubPage() {
  const [view, setView] = useState<View>("hub")
  const [activeCat, setActiveCat] = useState("All")
  const router = useRouter()

  const cats = ["All", "SaaS & Digital", "Lead Funnels", "Webinar Funnels", "AI & Automation", "Local Services", "Professional Service"]

  const filteredTemplates = activeCat === "All"
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.cat === activeCat)

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="border-b border-white/8 bg-[#0d0d15] px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          {view !== "hub" && (
            <button
              onClick={() => setView("hub")}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mr-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
              Back
            </button>
          )}
          <div>
            <h1 className="text-lg font-semibold">
              {view === "hub" && "Funnel Hub"}
              {view === "templates" && "Funnel Templates"}
              {view === "editor" && "Page Editor"}
              {view === "workflows" && "Workflows"}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {view === "hub" && "Build, manage and track all your funnels"}
              {view === "templates" && "Choose a template to start building"}
              {view === "editor" && "Customize your funnel pages"}
              {view === "workflows" && "Email automations for your funnels"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {view === "hub" && (
            <>
              <button
                onClick={() => setView("templates")}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                Browse Templates
              </button>
              <button
                onClick={() => router.push("/dashboard/funnels/generator")}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 4v16M4 12h16"/></svg>
                New Funnel
              </button>
            </>
          )}
          {view === "editor" && (
            <>
              <button className="text-sm px-4 py-2 rounded-xl border border-white/15 hover:bg-white/5 transition-all">Preview</button>
              <button className="text-sm px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-all">Save</button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── HUB VIEW ─────────────────────────────────────────────────────── */}
        {view === "hub" && (
          <div className="space-y-8">

            {/* Quick action cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "🤖", label: "AI Generator", sub: "Build a funnel from scratch", href: "/dashboard/funnels/generator", color: "border-purple-500/30 hover:border-purple-500/60" },
                { icon: "📋", label: "Templates", sub: "17+ proven templates", action: () => setView("templates"), color: "border-amber-500/30 hover:border-amber-500/60" },
                { icon: "⚡", label: "Workflows", sub: "Email automations", action: () => setView("workflows"), color: "border-blue-500/30 hover:border-blue-500/60" },
                { icon: "📊", label: "Analytics", sub: "Funnel performance", href: "/dashboard/analytics", color: "border-emerald-500/30 hover:border-emerald-500/60" },
              ].map(({ icon, label, sub, href, action, color }) => (
                <button
                  key={label}
                  onClick={action ? action : () => href && router.push(href)}
                  className={`bg-white/3 border ${color} rounded-2xl p-5 text-left transition-all hover:bg-white/6`}
                >
                  <div className="text-2xl mb-3">{icon}</div>
                  <div className="font-semibold text-sm text-white">{label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
                </button>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Funnels", value: MY_FUNNELS.length.toString(), delta: "+1 this month", color: "text-white" },
                { label: "Live Funnels", value: MY_FUNNELS.filter(f => f.status === "live").length.toString(), delta: "Active now", color: "text-emerald-400" },
                { label: "Total Registrations", value: MY_FUNNELS.reduce((a, f) => a + f.registrations, 0).toString(), delta: "+18% vs last week", color: "text-purple-400" },
                { label: "Avg Conversion", value: "18.4%", delta: "Healthy performance", color: "text-amber-400" },
              ].map(({ label, value, delta, color }) => (
                <div key={label} className="bg-white/3 border border-white/8 rounded-2xl p-5">
                  <div className="text-xs text-gray-500 mb-2">{label}</div>
                  <div className={`text-3xl font-bold ${color}`}>{value}</div>
                  <div className="text-xs text-gray-600 mt-1.5">{delta}</div>
                </div>
              ))}
            </div>

            {/* My funnels table */}
            <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-base">My Funnels</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Your active and draft funnels</p>
                </div>
                <button
                  onClick={() => setView("templates")}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  + Add New →
                </button>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-xs text-gray-500 font-medium uppercase tracking-wider">
                <div className="col-span-4">Funnel</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Registrations</div>
                <div className="col-span-2 text-right">CTA Clicks</div>
                <div className="col-span-2 text-right">Conversion</div>
              </div>

              {/* Rows */}
              {MY_FUNNELS.map((funnel) => (
                <div
                  key={funnel.id}
                  onClick={() => setView("editor")}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/3 cursor-pointer transition-colors items-center group last:border-0"
                >
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${funnel.color}22` }}>
                      <svg viewBox="0 0 18 18" fill={funnel.color} className="w-4 h-4"><path d="M3 2h12l-4 6v6l-4-2V8z"/></svg>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate group-hover:text-purple-300 transition-colors">{funnel.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{funnel.type} · {funnel.steps} steps · Edited {funnel.lastEdited}</div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STAT_COLORS[funnel.status]}`}>
                      {funnel.status === "live" && "● "}
                      {funnel.status.charAt(0).toUpperCase() + funnel.status.slice(1)}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="text-sm font-semibold">{funnel.registrations > 0 ? funnel.registrations.toLocaleString() : "—"}</div>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="text-sm font-semibold">{funnel.clicks > 0 ? funnel.clicks : "—"}</div>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className={`text-sm font-semibold ${funnel.status === "live" ? "text-emerald-400" : "text-gray-500"}`}>
                      {funnel.conversion}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom 2-col: recent activity + quick links */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* Recent activity */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <h3 className="font-semibold text-sm mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { icon: "🎉", text: "Early Bird funnel hit 312 registrations", time: "2h ago", color: "text-emerald-400" },
                    { icon: "📧", text: "Email sequence triggered for 18 new leads", time: "4h ago", color: "text-blue-400" },
                    { icon: "⚡", text: "High Ticket funnel conversion up 3.2%", time: "Yesterday", color: "text-amber-400" },
                    { icon: "🤖", text: "AI generated new funnel: SaaS Demo Converter", time: "2 days ago", color: "text-purple-400" },
                  ].map(({ icon, text, time, color }) => (
                    <div key={text} className="flex items-start gap-3">
                      <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-300 leading-relaxed">{text}</p>
                        <p className={`text-[10px] ${color} mt-0.5`}>{time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top performers */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <h3 className="font-semibold text-sm mb-4">Top Performers</h3>
                <div className="space-y-3">
                  {MY_FUNNELS.filter(f => f.status === "live").map((f) => (
                    <div key={f.id} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: f.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-300 truncate">{f.name}</span>
                          <span className="text-xs text-emerald-400 font-semibold ml-2 flex-shrink-0">{f.conversion}</span>
                        </div>
                        <div className="w-full bg-white/8 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{ width: f.conversion, background: f.color }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-white/8">
                    <Link href="/dashboard/analytics" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                      Full analytics →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TEMPLATES VIEW ───────────────────────────────────────────────── */}
        {view === "templates" && (
          <div>
            {/* Category filters */}
            <div className="flex gap-2 flex-wrap mb-6">
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    activeCat === c
                      ? "bg-purple-600 text-white border-purple-600"
                      : "border-white/15 text-gray-400 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
              <span className="text-xs text-gray-600 self-center ml-2">{filteredTemplates.length} templates</span>
            </div>

            {/* Template grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {filteredTemplates.map((t) => (
                <div
                  key={t.id}
                  className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-purple-500/50 transition-all group"
                  onClick={() => setView("editor")}
                >
                  {/* Thumb */}
                  <div className="h-32 flex flex-col overflow-hidden">
                    <div className="flex-1 flex flex-col justify-end px-3 pb-2 gap-1.5" style={{ background: t.color }}>
                      <div className="h-1.5 w-3/5 rounded" style={{ background: t.accent, opacity: 0.85 }} />
                      <div className="h-2.5 w-4/5 rounded bg-white/85" />
                      <div className="h-1 w-1/2 rounded bg-white/35 mb-1" />
                      <div className="h-3.5 w-2/5 rounded" style={{ background: t.ctaColor }} />
                    </div>
                    <div className="h-12 bg-[#0d0d15] px-2 pt-1.5 flex flex-col gap-1">
                      <div className="h-1 rounded bg-white/10 w-full" />
                      <div className="h-1 rounded bg-white/6 w-3/4" />
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-3 border-t border-white/8">
                    <div className="text-xs font-medium text-white mb-0.5 leading-tight group-hover:text-purple-300 transition-colors">{t.name}</div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-gray-500">{t.steps} steps</span>
                      <span className="text-[10px] text-gray-600 border border-white/10 px-1.5 py-0.5 rounded-full">{t.cat}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 bg-purple-600/8 border border-purple-500/25 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm mb-1">Want a custom funnel built by AI?</h3>
                <p className="text-xs text-gray-500">Tell our AI your niche and offer — it builds everything in minutes.</p>
              </div>
              <button
                onClick={() => router.push("/dashboard/funnels/generator")}
                className="flex-shrink-0 bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-all"
              >
                🤖 AI Generator →
              </button>
            </div>
          </div>
        )}

        {/* ── EDITOR VIEW ──────────────────────────────────────────────────── */}
        {view === "editor" && (
          <div className="flex gap-6 h-[calc(100vh-140px)]">

            {/* Steps sidebar */}
            <div className="w-52 flex-shrink-0 bg-white/3 border border-white/8 rounded-2xl overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-white/8 text-xs font-semibold text-gray-400 uppercase tracking-wider">Funnel Steps</div>
              <div className="flex-1 overflow-y-auto">
                {[
                  { name: "$49 Checkout", url: "/checkout", color: "#7c3aed", bg: "#7c3aed22" },
                  { name: "OTO1 — $997", url: "/upsell", color: "#059669", bg: "#05966922" },
                  { name: "OTO2 — $497", url: "/downsell", color: "#d97706", bg: "#d9770622" },
                  { name: "Thank You", url: "/thankyou", color: "#2563eb", bg: "#2563eb22" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2.5 px-3 py-2.5 border-b border-white/5 cursor-pointer transition-colors ${i === 0 ? "bg-white/5" : "hover:bg-white/3"}`}
                  >
                    <div className="w-9 h-6 rounded flex-shrink-0 flex flex-col gap-px p-1" style={{ background: s.bg }}>
                      <div className="h-1 rounded-sm opacity-70" style={{ background: s.color }} />
                      <div className="h-0.5 w-3/4 rounded-sm opacity-40" style={{ background: s.color }} />
                    </div>
                    <div>
                      <div className="text-xs font-medium">{s.name}</div>
                      <div className="text-[9px] text-gray-600">{s.url}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-white/8">
                <button className="w-full text-xs py-2 rounded-lg border border-white/10 text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-all">
                  + Add Step
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-gray-800 rounded-2xl overflow-auto flex items-start justify-center p-6">
              <div className="w-full max-w-2xl bg-white rounded-xl overflow-hidden shadow-2xl">
                {/* Hero */}
                <div className="bg-[#1e1b4b] px-6 py-8 text-center">
                  <div className="text-[9px] font-semibold text-purple-300 uppercase tracking-widest mb-2">Early Bird — Limited to 1,000 spots</div>
                  <div className="text-lg font-black text-white leading-tight mb-3">Lock In Lifetime Access to WebinarForge AI for Just $49</div>
                  <div className="text-[11px] text-white/55 mb-4">Build AI-powered webinars that generate leads automatically.</div>
                  <button className="bg-emerald-600 text-white text-[11px] font-bold px-5 py-2 rounded-lg">Get Lifetime Access for $49</button>
                </div>
                <div className="bg-gray-900 py-3 flex justify-center gap-4">
                  {["Forbes","Inc. 5000","G2"].map(l => <span key={l} className="text-[9px] text-white/40 font-medium bg-white/10 px-3 py-1 rounded">{l}</span>)}
                </div>
                <div className="p-5">
                  <div className="text-xs font-bold text-center mb-3">Everything included — one payment</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[["AI Script","Converts cold traffic"],["Slide Builder","5 min setup"],["AI Avatar","24/7 presenter"],["Evergreen","Runs forever"]].map(([t,d]) => (
                      <div key={t} className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                        <div className="text-[10px] font-semibold mb-0.5">{t}</div>
                        <div className="text-[9px] text-gray-400">{d}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#1e1b4b] text-center py-5 px-5">
                  <div className="text-sm font-black text-white mb-1">Ready to put your lead gen on autopilot?</div>
                  <div className="text-[10px] text-white/45 mb-3">Lock in lifetime access before we switch to monthly.</div>
                  <button className="bg-emerald-600 text-white text-[11px] font-bold px-6 py-2.5 rounded-lg">Get Lifetime Access for $49</button>
                </div>
                <div className="bg-gray-900 px-5 py-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-white">WebinarForge AI</span>
                  <div className="flex gap-2">{["Privacy","Terms"].map(l => <span key={l} className="text-[9px] text-white/30">{l}</span>)}</div>
                </div>
              </div>
            </div>

            {/* Properties panel */}
            <div className="w-56 flex-shrink-0 bg-white/3 border border-white/8 rounded-2xl overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-white/8 text-xs font-semibold text-gray-400 uppercase tracking-wider">Properties</div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-2">Headline</label>
                  <textarea
                    defaultValue="Lock In Lifetime Access to WebinarForge AI for Just $49"
                    rows={3}
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-2">CTA Text</label>
                  <input
                    defaultValue="Get Lifetime Access for $49"
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-2">Button Color</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {["#059669","#7c3aed","#d97706","#dc2626","#2563eb"].map(c => (
                      <div key={c} className={`w-5 h-5 rounded-md cursor-pointer border-2 ${c === "#059669" ? "border-white" : "border-transparent"} hover:border-white/60 transition-all`} style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-2">Background</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {["#1e1b4b","#0f172a","#111827","#064e3b","#4c1d95"].map(c => (
                      <div key={c} className={`w-5 h-5 rounded-md cursor-pointer border-2 ${c === "#1e1b4b" ? "border-white" : "border-transparent"} hover:border-white/60 transition-all`} style={{ background: c }} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-3 border-t border-white/8 space-y-2">
                <button className="w-full text-xs py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all">Publish Page</button>
                <button className="w-full text-xs py-2 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 transition-all">Preview</button>
              </div>
            </div>
          </div>
        )}

        {/* ── WORKFLOWS VIEW ───────────────────────────────────────────────── */}
        {view === "workflows" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold">Email Workflows</h2>
                <p className="text-sm text-gray-500 mt-0.5">Automations triggered by funnel events</p>
              </div>
              <button className="text-sm px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all">+ New Workflow</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {[
                { name: "Indoctrination — How Can I Help", desc: "2-email welcome sequence for new subscribers.", steps: 4, colors: ["#fbbf24","#f97316","#fbbf24","#f97316"], bg: "#1a1200" },
                { name: "Convert — Simple Product Launch", desc: "Launch any product in 4 emails without the complexity.", steps: 8, colors: ["#818cf8","#6366f1","#4f46e5","#818cf8"], bg: "#0d0d1f" },
                { name: "Nurture — New Customer Onboarding", desc: "Most customers ghost after first purchase — this fixes that.", steps: 3, colors: ["#f9a8d4","#ec4899","#f9a8d4"], bg: "#1a0010" },
                { name: "Testimonial Getting Sequence", desc: "Collect success stories on autopilot.", steps: 6, colors: ["#6ee7b7","#34d399","#059669","#6ee7b7"], bg: "#001a0d" },
                { name: "Nurture — Seinfeld Sequence", desc: "7-day story-driven sequence that keeps subscribers opening.", steps: 13, colors: ["#c4b5fd","#a78bfa","#7c3aed","#c4b5fd"], bg: "#0d0d1a" },
                { name: "Engage — Fishbowl Giveaway", desc: "Run a contest. Tags entrants, sends confirmation.", steps: 9, colors: ["#bae6fd","#38bdf8","#0284c7","#bae6fd"], bg: "#00101a" },
              ].map((w) => (
                <div key={w.name} className="bg-white/3 border border-white/8 hover:border-white/20 rounded-2xl overflow-hidden cursor-pointer transition-all group">
                  <div className="h-16 flex items-center justify-center gap-1.5 px-4" style={{ background: w.bg }}>
                    {w.colors.map((c, i) => (
                      <div key={i} className="flex items-center gap-1">
                        {i > 0 && <div className="w-3 h-px rounded-full opacity-40" style={{ background: c }} />}
                        <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: c }} />
                      </div>
                    ))}
                    {w.steps > 4 && <span className="text-[9px] font-semibold ml-1" style={{ color: w.colors[0] }}>+{w.steps - 4}</span>}
                  </div>
                  <div className="p-4 border-t border-white/5">
                    <div className="text-xs font-semibold text-white mb-1 leading-tight group-hover:text-purple-300 transition-colors">{w.name}</div>
                    <div className="text-[10px] text-gray-500 leading-relaxed mb-2">{w.desc}</div>
                    <div className="text-[10px] text-gray-600">{w.steps} steps</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
