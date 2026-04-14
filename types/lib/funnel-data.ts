"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { TEMPLATES, TEMPLATE_CATS, ELEMENT_CATEGORIES, type Template } from "@/lib/funnel-data"

// ─── Types ────────────────────────────────────────────────────────────────────
type View = "funnels" | "templates" | "editor" | "workflows" | "contacts"
type EditorSection = "hero" | "logos" | "features" | "social" | "cta" | "footer"

const FUNNEL_STEPS = [
  { name: "$49 Checkout", url: "/checkout", color: "#7c3aed", bg: "#f5f3ff" },
  { name: "OTO1 — $997", url: "/upsell", color: "#059669", bg: "#ecfdf5" },
  { name: "OTO2 — $497", url: "/downsell", color: "#d97706", bg: "#fffbeb" },
  { name: "Thank You", url: "/thankyou", color: "#2563eb", bg: "#eff6ff" },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ view, setView }: { view: View; setView: (v: View) => void }) {
  const items = [
    { id: "funnels", label: "Funnels", section: "Build" },
    { id: "templates", label: "Templates", section: "" },
    { id: "contacts", label: "Customers", section: "Manage" },
    { id: "workflows", label: "Workflows", section: "" },
  ] as const

  return (
    <aside className="w-48 bg-[#1e1b4b] flex flex-col flex-shrink-0 overflow-y-auto">
      <div className="p-3 border-b border-white/10 flex items-center gap-2 flex-shrink-0">
        <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 16 16" className="w-3 h-3 fill-white"><path d="M8 1l2 5h5l-4 3 1.5 5L8 11l-4.5 3L5 9 1 6h5z"/></svg>
        </div>
        <span className="text-[11px] font-medium text-white leading-tight">WebinarForge AI</span>
      </div>

      {items.map((item, i) => (
        <div key={item.id}>
          {item.section && (
            <div className="text-[9px] text-white/30 font-semibold uppercase tracking-widest px-3 pt-3 pb-1">
              {item.section}
            </div>
          )}
          <button
            onClick={() => setView(item.id as View)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] transition-all text-left ${
              view === item.id
                ? "bg-purple-600/40 text-white"
                : "text-white/55 hover:bg-white/7 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        </div>
      ))}

      <div className="text-[9px] text-white/30 font-semibold uppercase tracking-widest px-3 pt-3 pb-1">Learn</div>
      {["Training Courses", "Private Community", "Knowledge Base"].map((s) => (
        <div key={s} className="px-3 py-1.5 text-[10px] text-white/35 cursor-pointer hover:text-white/7 transition-colors">{s}</div>
      ))}

      <div className="mt-auto p-3 border-t border-white/10">
        <div className="flex items-center gap-2 text-[10px] text-white/50">
          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[9px] font-semibold text-white flex-shrink-0">MC</div>
          <span>Maurice's Team</span>
          <span className="ml-auto bg-purple-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">Pro</span>
        </div>
      </div>
    </aside>
  )
}

// ─── Funnels View ─────────────────────────────────────────────────────────────
function FunnelsView({ setView }: { setView: (v: View) => void }) {
  const rows = [
    { name: "WebinarForge AI — Early Bird Launch", meta: "4 steps · $49 / $997 / $497 / Thank You · Edited today", color: "#7c3aed", bg: "#f5f3ff", v: 312, l: 47, cv: "15.1%", dot: "#22c55e", active: true },
    { name: "High Ticket Secrets — Lead Squeeze", meta: "2 steps · Opt-in / Thank You · Edited 3 days ago", color: "#059669", bg: "#ecfdf5", v: 88, l: 22, cv: "25%", dot: "#f59e0b", active: true },
    { name: "1 Comma Club Challenge", meta: "3 steps · Draft · Not published", color: "#a78bfa", bg: "#f5f3ff", v: "—", l: "—", cv: "—", dot: "#d1d5db", active: false },
  ]

  return (
    <div>
      <div className="flex items-end justify-between px-5 py-4 border-b border-black/5 bg-white dark:bg-black/0">
        <div>
          <h1 className="text-xl font-medium">My Funnels</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage and track your WebinarForge AI funnels</p>
        </div>
        <button onClick={() => setView("templates")} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors">
          + New Funnel
        </button>
      </div>
      <div className="p-5 flex flex-col gap-3">
        {rows.map((f) => (
          <div
            key={f.name}
            onClick={() => f.active && setView("editor")}
            className="bg-white dark:bg-white/5 border border-black/8 dark:border-white/10 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-purple-400 transition-all"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: f.bg }}>
              <svg viewBox="0 0 18 18" fill={f.color} className="w-4.5 h-4.5"><path d="M3 2h12l-4 6v6l-4-2V8z"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{f.name}</div>
              <div className="text-xs text-gray-400 mt-0.5 truncate">{f.meta}</div>
            </div>
            <div className="flex gap-5 flex-shrink-0">
              {[["Visitors", f.v], ["Leads", f.l], ["Conv.", f.cv]].map(([label, val]) => (
                <div key={label as string} className="text-right">
                  <div className="text-sm font-medium">{val}</div>
                  <div className="text-[10px] text-gray-400">{label}</div>
                </div>
              ))}
            </div>
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: f.dot }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Template Card ────────────────────────────────────────────────────────────
function TemplateCard({ t, selected, onClick }: { t: Template; selected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-white/5 rounded-xl overflow-hidden cursor-pointer transition-all border ${
        selected ? "border-purple-500 border-[1.5px]" : "border-black/8 dark:border-white/10 hover:border-purple-400"
      }`}
    >
      <div className="h-28 flex flex-col overflow-hidden">
        <div className="h-14 flex flex-col justify-end px-3 pb-2 gap-1" style={{ background: t.heroBg }}>
          <div className="h-1.5 w-3/5 rounded-sm" style={{ background: t.accent, opacity: 0.85 }} />
          <div className="h-2.5 w-4/5 rounded-sm bg-white/85" />
          <div className="h-1 w-1/2 rounded-sm bg-white/35 mt-0.5" />
          <div className="h-3 w-2/5 rounded mt-1.5" style={{ background: t.ctaColor }} />
        </div>
        <div className="flex-1 bg-white dark:bg-black/20 px-2 py-1.5 flex flex-col gap-1">
          {t.thumbBgs.slice(0, 3).map((bg, i) => (
            <div key={i} className="h-1.5 rounded-sm" style={{ background: bg, opacity: 0.18 }} />
          ))}
        </div>
      </div>
      <div className="p-2.5 pb-3">
        <div className="text-[12px] font-medium mb-0.5 leading-tight">{t.name}</div>
        <div className="text-[10px] text-gray-400 leading-snug mb-1.5 line-clamp-2">{t.desc}</div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-400">{t.steps.length} Steps</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: t.catColor, color: t.catText }}>{t.cat}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Template Detail Panel ────────────────────────────────────────────────────
function TemplateDetail({ t, onUse, onClear }: { t: Template | null; onUse: () => void; onClear: () => void }) {
  const [activeThumb, setActiveThumb] = useState(0)

  if (!t) {
    return (
      <div className="w-80 flex-shrink-0 border-l border-black/8 dark:border-white/10 bg-white dark:bg-black/0 flex items-center justify-center text-gray-400 flex-col gap-2 p-6 text-center">
        <svg viewBox="0 0 24 24" className="w-10 h-10 opacity-25" fill="none" stroke="currentColor" strokeWidth={1}><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M9 21h6M12 17v4"/></svg>
        <p className="text-xs">Select a template to preview it</p>
      </div>
    )
  }

  const mainBg = t.thumbBgs[activeThumb] || t.heroBg

  return (
    <div className="w-80 flex-shrink-0 border-l border-black/8 dark:border-white/10 bg-white dark:bg-black/0 flex flex-col overflow-y-auto">
      <div className="p-3 border-b border-black/8 dark:border-white/10">
        <button onClick={onClear} className="text-[10px] text-gray-400 flex items-center gap-1 mb-2 hover:text-gray-600 transition-colors">← Back</button>
        <h2 className="text-sm font-medium leading-tight">{t.name}</h2>
      </div>

      {/* Main preview */}
      <div className="cursor-pointer" onClick={() => setActiveThumb((activeThumb + 1) % t.thumbBgs.length)}>
        <div className="h-44 flex flex-col justify-end px-5 pb-5 gap-1.5 relative" style={{ background: mainBg }}>
          <div className="h-2 w-3/5 rounded" style={{ background: t.accent, opacity: 0.9 }} />
          <div className="h-3.5 w-4/5 rounded bg-white/88" />
          <div className="h-1.5 w-3/5 rounded bg-white/35 mb-2" />
          <div className="h-7 w-2/5 rounded-md flex items-center justify-center" style={{ background: t.ctaColor }}>
            <div className="h-1.5 w-3/5 rounded bg-white/80" />
          </div>
          <span className="absolute bottom-2 right-3 text-[9px] text-white/30">click to cycle</span>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 p-3 border-b border-black/8 dark:border-white/10">
        {t.thumbBgs.map((bg, i) => (
          <div
            key={i}
            onClick={() => setActiveThumb(i)}
            className={`w-16 h-12 rounded cursor-pointer border transition-all flex flex-col gap-1 p-1.5 ${
              activeThumb === i ? "border-purple-500 border-[1.5px]" : "border-black/10 dark:border-white/10 hover:border-purple-400"
            }`}
            style={{ background: bg }}
          >
            <div className="h-1 rounded-sm bg-white/50" />
            <div className="h-0.5 w-3/4 rounded-sm bg-white/30" />
            <div className="h-0.5 w-1/2 rounded-sm bg-white/50" />
          </div>
        ))}
      </div>

      {/* Included */}
      <div className="p-3 border-b border-black/8 dark:border-white/10">
        <h3 className="text-xs font-medium mb-2">Included</h3>
        {t.included.map((p) => (
          <div key={p} className="flex items-center gap-2 py-1 text-xs text-gray-500">
            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.2}><rect x="2" y="1" width="10" height="12" rx="1"/><path d="M4 5h6M4 7h6M4 9h4"/></svg>
            {p}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="p-3 border-b border-black/8 dark:border-white/10 flex flex-col gap-2">
        <button onClick={onUse} className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors">
          → Use This Template
        </button>
        <button className="w-full py-2 rounded-lg border border-black/10 dark:border-white/15 text-sm hover:bg-black/4 dark:hover:bg-white/5 transition-colors">
          ◉ Preview
        </button>
      </div>

      {/* Description */}
      <div className="p-3">
        <h3 className="text-xs font-medium mb-2">Description</h3>
        <p className="text-[11px] text-gray-500 leading-relaxed mb-3">{t.desc}</p>
        <h3 className="text-xs font-medium mb-2">Funnel steps</h3>
        {t.steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold text-white flex-shrink-0" style={{ background: t.thumbBgs[i] || t.heroBg }}>
              {i + 1}
            </div>
            <span className="text-[11px] text-gray-500">{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Templates View ───────────────────────────────────────────────────────────
function TemplatesView({ setView }: { setView: (v: View) => void }) {
  const [activeCat, setActiveCat] = useState("All")
  const [search, setSearch] = useState("")
  const [selTpl, setSelTpl] = useState<Template | null>(null)

  const filtered = TEMPLATES.filter((t) => {
    const matchCat = activeCat === "All" || t.cat === activeCat ||
      (activeCat === "Webinar Funnels" && t.cat === "Webinar Funnels")
    const matchSearch = !search || t.name.toLowerCase().includes(search) || t.desc.toLowerCase().includes(search) || t.cat.toLowerCase().includes(search)
    return matchCat && matchSearch
  })

  return (
    <div className="flex h-full overflow-hidden">
      {/* Grid area */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-black/8 dark:border-white/10 flex-wrap bg-white dark:bg-black/0">
          {TEMPLATE_CATS.map((c) => (
            <button
              key={c}
              onClick={() => { setActiveCat(c); setSelTpl(null) }}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-all whitespace-nowrap ${
                activeCat === c
                  ? "bg-[#1e1b4b] text-purple-300 border-purple-800"
                  : "border-black/10 dark:border-white/15 text-gray-500 hover:bg-black/4 dark:hover:bg-white/6"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="px-4 py-2 text-[11px] text-gray-400">Showing {filtered.length} templates</div>
        <div className="grid grid-cols-3 gap-3 px-4 pb-5">
          {filtered.map((t) => (
            <TemplateCard key={t.id} t={t} selected={selTpl?.id === t.id} onClick={() => setSelTpl(t)} />
          ))}
        </div>
      </div>

      {/* Detail */}
      <TemplateDetail
        t={selTpl}
        onUse={() => setView("editor")}
        onClear={() => setSelTpl(null)}
      />
    </div>
  )
}

// ─── Page Editor ──────────────────────────────────────────────────────────────
function EditorView() {
  const [activeStep, setActiveStep] = useState(0)
  const [activeSec, setActiveSec] = useState<EditorSection>("hero")
  const [activeEpCat, setActiveEpCat] = useState("content")
  const [heroBg, setHeroBg] = useState("#1e1b4b")
  const [ctaColor, setCtaColor] = useState("#059669")
  const [headline, setHeadline] = useState("Lock In Lifetime Access to WebinarForge AI for Just $49")
  const [subhead, setSubhead] = useState("Build AI-powered webinars that generate leads and book appointments automatically.")
  const [ctaText, setCtaText] = useState("Get Lifetime Access for $49")
  const [eyebrow, setEyebrow] = useState("Early Bird — Limited to 1,000 spots")

  const selectSec = (sec: EditorSection) => setActiveSec(sec)

  const HERO_BGS = ["#1e1b4b", "#0f172a", "#111827", "#064e3b", "#4c1d95", "#1c1917", "#1e293b", "#0c0a09"]
  const CTA_COLORS = ["#059669", "#7c3aed", "#d97706", "#dc2626", "#2563eb", "#0284c7"]

  return (
    <div className="flex h-full overflow-hidden">
      {/* Steps panel */}
      <div className="w-48 flex-shrink-0 border-r border-black/8 dark:border-white/10 bg-white dark:bg-black/0 flex flex-col overflow-hidden">
        <div className="px-3 py-2 border-b border-black/8 dark:border-white/10 flex items-center justify-between">
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Funnel Steps</span>
        </div>
        <input className="mx-2 my-2 text-[11px] px-2 py-1.5 rounded border border-black/10 dark:border-white/15 bg-transparent text-gray-500 outline-none" placeholder="Search" />
        <div className="flex-1 overflow-y-auto">
          {FUNNEL_STEPS.map((s, i) => (
            <div
              key={i}
              onClick={() => setActiveStep(i)}
              className={`flex items-center gap-2 p-2.5 border-b border-black/5 dark:border-white/8 cursor-pointer transition-colors ${
                activeStep === i ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-black/3 dark:hover:bg-white/5"
              }`}
            >
              <div className="w-9 h-6 rounded flex-shrink-0 border border-black/8 overflow-hidden flex flex-col gap-px p-0.5" style={{ background: s.bg }}>
                <div className="h-1 rounded-sm" style={{ background: s.color, opacity: 0.7 }} />
                <div className="h-0.5 w-3/4 rounded-sm" style={{ background: s.color, opacity: 0.35 }} />
                <div className="h-0.5 w-1/2 rounded-sm" style={{ background: s.color, opacity: 0.5 }} />
              </div>
              <div>
                <div className="text-[11px] font-medium leading-tight">{s.name}</div>
                <div className="text-[9px] text-gray-400">{s.url}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-black/8 dark:border-white/10">
          <button className="w-full text-[10px] py-1.5 rounded border border-black/10 dark:border-white/15 text-gray-400 hover:bg-black/4 transition-colors">+ Add Step</button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-gray-300 dark:bg-gray-700 overflow-y-auto flex items-start justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-md border border-gray-300 overflow-hidden shadow-sm">

          {/* Hero */}
          <div
            onClick={() => selectSec("hero")}
            className={`cursor-pointer border-b border-gray-100 relative ${activeSec === "hero" ? "ring-2 ring-purple-500 ring-inset" : "hover:ring-2 hover:ring-purple-400 hover:ring-inset"}`}
          >
            {activeSec === "hero" && <div className="absolute top-0 left-0 bg-purple-600 text-white text-[9px] font-semibold px-2 py-0.5 z-10 rounded-br">Hero Section</div>}
            <div className="flex gap-4 p-6 items-center" style={{ background: heroBg }}>
              <div className="flex-1">
                <div className="text-[9px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#a78bfa" }}>{eyebrow}</div>
                <div className="text-lg font-bold leading-tight text-white mb-2">{headline}</div>
                <div className="text-[11px] text-white/60 leading-relaxed mb-3">{subhead}</div>
                <button className="px-4 py-2 rounded text-[11px] font-bold text-white" style={{ background: ctaColor }}>{ctaText}</button>
              </div>
              <div className="w-28 h-20 rounded-lg bg-white/10 border border-dashed border-white/20 flex items-center justify-center text-white/30 text-[9px] text-center flex-shrink-0">AI Twin Video</div>
            </div>
          </div>

          {/* Logos */}
          <div onClick={() => selectSec("logos")} className={`cursor-pointer border-b border-gray-100 relative ${activeSec === "logos" ? "ring-2 ring-purple-500 ring-inset" : "hover:ring-2 hover:ring-purple-400 hover:ring-inset"}`}>
            {activeSec === "logos" && <div className="absolute top-0 left-0 bg-purple-600 text-white text-[9px] font-semibold px-2 py-0.5 z-10 rounded-br">Logo Bar</div>}
            <div className="bg-gray-900 py-3 flex items-center justify-center gap-4 flex-wrap px-4">
              {["Forbes", "Inc. 5000", "TechCrunch", "G2", "Product Hunt"].map((l) => (
                <span key={l} className="bg-white/10 text-white/55 text-[9px] font-medium px-3 py-1 rounded">{l}</span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div onClick={() => selectSec("features")} className={`cursor-pointer border-b border-gray-100 relative ${activeSec === "features" ? "ring-2 ring-purple-500 ring-inset" : "hover:ring-2 hover:ring-purple-400 hover:ring-inset"}`}>
            {activeSec === "features" && <div className="absolute top-0 left-0 bg-purple-600 text-white text-[9px] font-semibold px-2 py-0.5 z-10 rounded-br">Features</div>}
            <div className="p-5">
              <div className="text-sm font-bold text-center mb-1">Everything included — one payment</div>
              <div className="text-[10px] text-gray-400 text-center mb-3">No monthly fees. No upsells. Set it up once.</div>
              <div className="grid grid-cols-2 gap-2">
                {[["AI Script", "Converts cold traffic", "#eff6ff"], ["Slide Builder", "Script to slides in 5min", "#f0fdf4"], ["AI Avatar", "Your face on camera 24/7", "#fdf4ff"], ["Evergreen", "Runs on autopilot forever", "#fff7ed"]].map(([t, d, bg]) => (
                  <div key={t} className="p-2.5 rounded-md border border-gray-100" style={{ background: bg }}>
                    <div className="text-[10px] font-semibold mb-0.5">{t}</div>
                    <div className="text-[9px] text-gray-500">{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div onClick={() => selectSec("social")} className={`cursor-pointer border-b border-gray-100 relative ${activeSec === "social" ? "ring-2 ring-purple-500 ring-inset" : "hover:ring-2 hover:ring-purple-400 hover:ring-inset"}`}>
            {activeSec === "social" && <div className="absolute top-0 left-0 bg-purple-600 text-white text-[9px] font-semibold px-2 py-0.5 z-10 rounded-br">Social Proof</div>}
            <div className="bg-gray-50 p-5">
              <div className="text-sm font-bold text-center mb-3">What early users are saying</div>
              <div className="grid grid-cols-2 gap-2">
                {[["Sarah K.", "Got 47 leads in my first week."], ["Mike T.", "Booked 12 sales calls in 5 days."], ["Tina R.", "Finally launched my webinar."], ["James L.", "First lead came in that night."]].map(([n, t]) => (
                  <div key={n} className="bg-white rounded p-2 border border-gray-100">
                    <div className="text-[8px] text-yellow-400 mb-1">★★★★★</div>
                    <div className="text-[9px] text-gray-600 leading-snug mb-1">"{t}"</div>
                    <div className="text-[8px] font-semibold text-gray-400">{n}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div onClick={() => selectSec("cta")} className={`cursor-pointer border-b border-gray-100 relative ${activeSec === "cta" ? "ring-2 ring-purple-500 ring-inset" : "hover:ring-2 hover:ring-purple-400 hover:ring-inset"}`}>
            {activeSec === "cta" && <div className="absolute top-0 left-0 bg-purple-600 text-white text-[9px] font-semibold px-2 py-0.5 z-10 rounded-br">CTA Section</div>}
            <div className="text-center py-6 px-5" style={{ background: heroBg }}>
              <span className="text-[8px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(167,139,250,0.2)", color: "#a78bfa" }}>Limited — 1,000 spots</span>
              <div className="text-base font-bold text-white mt-2 mb-1">Ready to put your lead gen on autopilot?</div>
              <div className="text-[10px] text-white/55 mb-4">Lock in lifetime access before we switch to monthly pricing.</div>
              <button className="px-6 py-2.5 rounded-lg text-sm font-bold text-white" style={{ background: ctaColor }}>{ctaText}</button>
            </div>
          </div>

          {/* Footer */}
          <div onClick={() => selectSec("footer")} className={`cursor-pointer relative ${activeSec === "footer" ? "ring-2 ring-purple-500 ring-inset" : "hover:ring-2 hover:ring-purple-400 hover:ring-inset"}`}>
            {activeSec === "footer" && <div className="absolute top-0 left-0 bg-purple-600 text-white text-[9px] font-semibold px-2 py-0.5 z-10 rounded-br">Footer</div>}
            <div className="bg-gray-900 px-5 py-3 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-white">WebinarForge AI</span>
              <div className="flex gap-3">{["Privacy", "Terms", "Support"].map((l) => <span key={l} className="text-[9px] text-white/40">{l}</span>)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Elements panel */}
      <div className="w-80 flex-shrink-0 flex overflow-hidden border-l border-black/8 dark:border-white/10">
        {/* Category nav */}
        <div className="w-36 bg-[#1e1b4b] flex-shrink-0 overflow-y-auto">
          <div className="p-2 border-b border-white/10">
            <div className="text-[9px] text-white/30 font-semibold uppercase tracking-widest mb-1 px-1">My Elements</div>
            {["Saved", "Universal"].map((l) => (
              <button key={l} className="w-full flex items-center gap-1.5 px-2 py-1.5 text-[10px] text-white/50 hover:bg-white/8 hover:text-white transition-all rounded text-left">{l}</button>
            ))}
          </div>
          <div className="p-2">
            <div className="text-[9px] text-white/30 font-semibold uppercase tracking-widest mb-1 px-1">Elements</div>
            {ELEMENT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveEpCat(cat.id)}
                className={`w-full flex items-center gap-1.5 px-2 py-1.5 text-[10px] transition-all rounded text-left border-r-2 ${
                  activeEpCat === cat.id
                    ? "bg-purple-600/30 text-white border-purple-500"
                    : "text-white/50 hover:bg-white/7 hover:text-white border-transparent"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Element tiles */}
        <div className="flex-1 bg-[#13112b] overflow-y-auto p-2">
          <div className="relative mb-2">
            <input className="w-full text-[10px] py-1.5 pl-6 pr-2 rounded bg-white/8 border border-white/12 text-white placeholder-white/30 outline-none focus:border-purple-500/50" placeholder="Search Elements" />
            <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 stroke-white/35" viewBox="0 0 16 16" fill="none" strokeWidth={1.5}><circle cx="6.5" cy="6.5" r="4"/><path d="M11 11l3 3"/></svg>
          </div>
          {ELEMENT_CATEGORIES.filter((c) => c.id === activeEpCat).map((cat) => (
            <div key={cat.id}>
              <div className="text-[9px] text-white/30 font-semibold uppercase tracking-widest mb-2 mt-1">{cat.label}</div>
              <div className="grid grid-cols-2 gap-1.5">
                {cat.items.map((item) => (
                  <div
                    key={item.label}
                    draggable
                    className="bg-white/6 border border-white/10 rounded-md py-2.5 px-1.5 flex flex-col items-center gap-1.5 cursor-grab hover:bg-purple-600/30 hover:border-purple-500/50 transition-all text-center active:scale-95"
                  >
                    <div className="w-5 h-5 border border-white/25 rounded flex-shrink-0" />
                    <span className="text-[8px] text-white/55 uppercase tracking-wider leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Properties panel */}
      <div className="w-52 flex-shrink-0 border-l border-black/8 dark:border-white/10 bg-white dark:bg-black/0 overflow-y-auto">
        <div className="px-3 py-2 border-b border-black/8 dark:border-white/10 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          {activeSec === "hero" ? "Hero Section" : activeSec === "cta" ? "CTA Section" : activeSec === "features" ? "Features" : activeSec === "social" ? "Social Proof" : activeSec === "logos" ? "Logo Bar" : "Footer"}
        </div>

        {activeSec === "hero" && (
          <div>
            <div className="p-3 border-b border-black/6 dark:border-white/8">
              <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Content</div>
              {[["Eyebrow", eyebrow, setEyebrow], ["Headline", headline, setHeadline], ["Subheadline", subhead, setSubhead], ["Button text", ctaText, setCtaText]].map(([label, val, setter]) => (
                <div key={label as string} className="mb-2">
                  <label className="block text-[10px] text-gray-400 mb-1">{label as string}</label>
                  {(label === "Headline" || label === "Subheadline") ? (
                    <textarea
                      value={val as string}
                      onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                      className="w-full text-[10px] p-1.5 border border-black/10 dark:border-white/15 rounded bg-transparent text-gray-700 dark:text-gray-300 outline-none focus:border-purple-500 resize-none"
                      rows={2}
                    />
                  ) : (
                    <input
                      value={val as string}
                      onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                      className="w-full text-[10px] p-1.5 border border-black/10 dark:border-white/15 rounded bg-transparent text-gray-700 dark:text-gray-300 outline-none focus:border-purple-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="p-3 border-b border-black/6 dark:border-white/8">
              <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Button Color</div>
              <div className="flex gap-1.5 flex-wrap">
                {CTA_COLORS.map((c) => (
                  <div key={c} onClick={() => setCtaColor(c)} className={`w-4 h-4 rounded cursor-pointer border-2 transition-all ${ctaColor === c ? "border-gray-800 dark:border-white" : "border-transparent hover:border-gray-400"}`} style={{ background: c }} />
                ))}
              </div>
            </div>
            <div className="p-3">
              <div className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Background</div>
              <div className="flex gap-1.5 flex-wrap">
                {HERO_BGS.map((c) => (
                  <div key={c} onClick={() => setHeroBg(c)} className={`w-4 h-4 rounded cursor-pointer border-2 transition-all ${heroBg === c ? "border-gray-800 dark:border-white" : "border-transparent hover:border-gray-400"}`} style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSec !== "hero" && (
          <div className="p-3 text-[11px] text-gray-400 leading-relaxed">
            Click any section in the canvas to edit its content and styles here.
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Workflows View ───────────────────────────────────────────────────────────
function WorkflowsView() {
  const workflows = [
    { name: "Indoctrination — How Can I Help", desc: "2-email welcome sequence for new subscribers.", steps: 4, colors: ["#fbbf24", "#f97316", "#fbbf24", "#f97316"], bg: "#fff7ed" },
    { name: "Convert — Simple Product Launch", desc: "Launch any product in 4 emails without the complexity.", steps: 8, colors: ["#818cf8", "#6366f1", "#4f46e5", "#818cf8"], bg: "#eef2ff" },
    { name: "Nurture — New Customer Onboarding", desc: "Most customers ghost after first purchase — this fixes that.", steps: 3, colors: ["#f9a8d4", "#ec4899", "#f9a8d4"], bg: "#fdf2f8" },
    { name: "Testimonial Getting Sequence", desc: "Collect success stories on autopilot with 3 emails.", steps: 6, colors: ["#6ee7b7", "#34d399", "#059669", "#6ee7b7"], bg: "#ecfdf5" },
    { name: "Nurture — Seinfeld Sequence", desc: "7-day story-driven sequence that keeps subscribers opening.", steps: 13, colors: ["#c4b5fd", "#a78bfa", "#7c3aed", "#c4b5fd"], bg: "#f5f3ff" },
    { name: "Engage — Fishbowl Giveaway", desc: "Run a contest. Tags entrants, sends confirmation, announces winner.", steps: 9, colors: ["#bae6fd", "#38bdf8", "#0284c7", "#bae6fd"], bg: "#f0f9ff" },
  ]

  return (
    <div>
      <div className="flex items-end justify-between px-5 py-4 border-b border-black/5 bg-white dark:bg-black/0">
        <div>
          <h1 className="text-xl font-medium">Workflows</h1>
          <p className="text-xs text-gray-500 mt-0.5">Email automations triggered by funnel events</p>
        </div>
        <button className="text-xs px-3 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors">+ New Workflow</button>
      </div>
      <div className="grid grid-cols-3 gap-3 p-5">
        {workflows.map((w) => (
          <div key={w.name} className="bg-white dark:bg-white/5 border border-black/8 dark:border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-purple-400 transition-all">
            <div className="h-16 flex items-center justify-center gap-1.5 px-4" style={{ background: w.bg }}>
              {w.colors.map((c, i) => (
                <div key={i} className="flex items-center gap-1">
                  {i > 0 && <div className="w-3 h-0.5 rounded-full" style={{ background: c, opacity: 0.4 }} />}
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: c }} />
                </div>
              ))}
              {w.steps > 4 && <span className="text-[9px] font-medium ml-1" style={{ color: w.colors[0] }}>+{w.steps - 4}</span>}
            </div>
            <div className="p-3 border-t border-black/5">
              <div className="text-[11px] font-medium mb-1 leading-tight">{w.name}</div>
              <div className="text-[10px] text-gray-400 leading-snug mb-2">{w.desc}</div>
              <div className="text-[10px] text-gray-400">{w.steps} steps</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Contacts View ────────────────────────────────────────────────────────────
function ContactsView() {
  const contacts = [
    { name: "Sarah K.", email: "sarah@gmail.com", tag: "$49 buyer", tagBg: "#f0fdf4", tagText: "#166534", initials: "SK", ic: "#dcfce7", date: "Apr 14" },
    { name: "Mike T.", email: "mike@agency.io", tag: "$997 buyer", tagBg: "#eff6ff", tagText: "#1d4ed8", initials: "MT", ic: "#dbeafe", date: "Apr 13" },
    { name: "Tina R.", email: "tina@courses.co", tag: "$49 buyer", tagBg: "#f0fdf4", tagText: "#166534", initials: "TR", ic: "#dcfce7", date: "Apr 13" },
    { name: "James L.", email: "james@consult.co", tag: "$497 buyer", tagBg: "#fef9c3", tagText: "#854d0e", initials: "JL", ic: "#fef9c3", date: "Apr 12" },
    { name: "Alex M.", email: "alex@biz.com", tag: "Lead", tagBg: "#f5f3ff", tagText: "#5b21b6", initials: "AM", ic: "#ede9fe", date: "Apr 11" },
  ]

  return (
    <div>
      <div className="flex items-center gap-3 px-5 py-3 border-b border-black/8 bg-white dark:bg-black/0">
        <input className="text-xs px-3 py-1.5 border border-black/10 dark:border-white/15 rounded-lg bg-transparent outline-none w-52 text-gray-600" placeholder="Search contacts..." />
        <span className="text-xs text-gray-400 ml-auto">{contacts.length} contacts</span>
        <button className="text-xs px-3 py-1.5 rounded-lg border border-black/10 hover:bg-black/4 transition-colors">Import</button>
        <button className="text-xs px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-medium transition-colors">+ Add Contact</button>
      </div>
      <table className="w-full bg-white dark:bg-black/0">
        <thead>
          <tr>
            {["Name", "Email", "Tag", "Date Added"].map((h) => (
              <th key={h} className="text-left text-[10px] font-medium text-gray-400 px-4 py-2.5 border-b border-black/6 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.name} className="hover:bg-black/2 dark:hover:bg-white/3 transition-colors border-b border-black/4">
              <td className="px-4 py-2.5 text-sm">
                <span className="inline-flex w-6 h-6 rounded-full items-center justify-center text-[9px] font-semibold mr-2 align-middle" style={{ background: c.ic, color: "#374151" }}>{c.initials}</span>
                {c.name}
              </td>
              <td className="px-4 py-2.5 text-xs text-gray-400">{c.email}</td>
              <td className="px-4 py-2.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: c.tagBg, color: c.tagText }}>{c.tag}</span>
              </td>
              <td className="px-4 py-2.5 text-xs text-gray-400">{c.date}, 2026</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FunnelBuilderPage() {
  const [view, setView] = useState<View>("funnels")

  const topbarTitle: Record<View, string> = {
    funnels: "Funnels",
    templates: "Funnel Templates",
    editor: "Editor",
    workflows: "Workflows",
    contacts: "Contacts",
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar view={view} setView={setView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-11 border-b border-black/8 dark:border-white/10 flex items-center justify-between px-4 flex-shrink-0 bg-white dark:bg-black/0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {view === "editor" && (
              <>
                <button onClick={() => setView("funnels")} className="hover:text-gray-800 transition-colors">← Funnels</button>
                <span className="text-gray-300">/</span>
              </>
            )}
            {view === "templates" && selIsDetail && (
              <>
                <button onClick={() => {}} className="hover:text-gray-800 transition-colors">← Funnel Templates</button>
                <span className="text-gray-300">/</span>
              </>
            )}
            <span className="font-medium text-gray-800 dark:text-gray-200">{topbarTitle[view]}</span>
          </div>
          {view === "editor" && (
            <div className="flex items-center gap-2">
              <button className="text-xs px-3 py-1.5 rounded-lg border border-black/10 hover:bg-black/4 transition-colors">Preview</button>
              <button className="text-xs px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-colors">Save</button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {view === "funnels" && <div className="h-full overflow-y-auto"><FunnelsView setView={setView} /></div>}
          {view === "templates" && <div className="h-full flex flex-col overflow-hidden"><TemplatesView setView={setView} /></div>}
          {view === "editor" && <div className="h-full flex overflow-hidden"><EditorView /></div>}
          {view === "workflows" && <div className="h-full overflow-y-auto"><WorkflowsView /></div>}
          {view === "contacts" && <div className="h-full overflow-y-auto"><ContactsView /></div>}
        </div>
      </div>
    </div>
  )
}

// Fix reference error — not used but needed for TS
const selIsDetail = false
