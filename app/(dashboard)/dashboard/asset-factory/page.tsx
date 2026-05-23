"use client"

import { useState, useEffect } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  id: string
  title: string
  niche: string
  status: string
  createdAt: string
}

interface Output {
  id: string
  phase: string
  sectionTitle: string
  content: string
  format: string
}

interface ProjectDetail extends Project {
  outputs: Output[]
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PHASES = [
  { key: "strategic_intelligence", label: "🧠 Strategic Intelligence", color: "purple" },
  { key: "offer_engineering", label: "💰 Offer Engineering", color: "amber" },
  { key: "digital_product", label: "📚 Digital Product", color: "blue" },
  { key: "webinar_engine", label: "🎙️ Webinar Engine", color: "green" },
  { key: "ai_video_content", label: "🎬 AI Video Content", color: "pink" },
  { key: "funnel_crm_assets", label: "🔧 Funnel + CRM", color: "orange" },
]

const TONE_OPTIONS = ["Professional", "Conversational", "Bold & Direct", "Educational", "Inspirational", "Urgent", "Story-based"]
const OFFER_TYPES = ["Course", "Coaching Program", "Done-For-You Service", "SaaS / Software", "Consulting", "Membership", "Digital Product", "Agency Service"]
const INDUSTRIES = ["Business & Entrepreneurship", "Health & Wellness", "Real Estate", "Finance & Investing", "Marketing & Advertising", "Personal Development", "E-commerce", "Technology", "Education", "Other"]

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-2 py-1 rounded-lg transition-all flex-shrink-0"
    >
      {copied ? "✅ Copied" : "📋 Copy"}
    </button>
  )
}

// ─── Output Card ──────────────────────────────────────────────────────────────
function OutputCard({ output }: { output: Output }) {
  const [expanded, setExpanded] = useState(false)

  let displayContent = output.content
  let items: string[] = []
  const isList = output.format === "json"

  if (isList) {
    try {
      items = JSON.parse(output.content)
    } catch {
      items = []
    }
  }

  const label = output.sectionTitle.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
  const preview = isList ? items.slice(0, 2).join(" · ") : displayContent.slice(0, 120)

  return (
    <div className="bg-[#0f0f1a] border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-all">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="text-sm font-bold text-white">{label}</h4>
        <div className="flex items-center gap-2">
          <CopyButton text={isList ? items.join("\n") : displayContent} />
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            {expanded ? "▲ Less" : "▼ More"}
          </button>
        </div>
      </div>

      {isList ? (
        <ul className="space-y-1">
          {(expanded ? items : items.slice(0, 3)).map((item, i) => (
            <li key={i} className="text-gray-400 text-xs flex gap-2">
              <span className="text-purple-400 flex-shrink-0">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
          {!expanded && items.length > 3 && (
            <li className="text-gray-600 text-xs">+{items.length - 3} more...</li>
          )}
        </ul>
      ) : (
        <p className="text-gray-400 text-xs leading-relaxed">
          {expanded ? displayContent : preview + (displayContent.length > 120 ? "..." : "")}
        </p>
      )}
    </div>
  )
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {PHASES.map(phase => (
        <div key={phase.key}>
          <div className="h-6 bg-white/5 rounded w-48 mb-3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-white/5 rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AssetFactoryPage() {
  const [view, setView] = useState<"form" | "results" | "history">("form")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState("")
  const [activePhase, setActivePhase] = useState("strategic_intelligence")
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<ProjectDetail | null>(null)
  const [currentOutput, setCurrentOutput] = useState<Record<string, Record<string, unknown>> | null>(null)

  const [form, setForm] = useState({
    niche: "",
    targetAudience: "",
    desiredOutcome: "",
    offerType: "",
    tone: "Professional",
    cta: "",
    industry: "",
    pricePoint: "",
  })

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/asset-factory/projects")
      const data = await res.json()
      if (data.projects) setProjects(data.projects)
    } catch {}
  }

  useEffect(() => { loadProjects() }, [])

  const handleGenerate = async () => {
    if (!form.niche || !form.targetAudience || !form.desiredOutcome || !form.offerType) {
      setError("Please fill in all required fields.")
      return
    }
    setLoading(true)
    setError("")
    setCurrentOutput(null)

    try {
      const res = await fetch("/api/asset-factory/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Generation failed")

      setCurrentOutput(data.output)
      setCurrentProject(data.project)
      setView("results")
      setActivePhase("strategic_intelligence")
      showToast("✅ Asset package generated successfully!")
      loadProjects()
    } catch (err: any) {
      setError(err.message || "Generation failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const loadProject = async (id: string) => {
    try {
      const res = await fetch(`/api/asset-factory/projects/${id}`)
      const data = await res.json()
      if (data.project) {
        setCurrentProject(data.project)
        // Reconstruct output object from outputs array
        const rebuilt: Record<string, Record<string, unknown>> = {}
        for (const output of data.project.outputs) {
          if (!rebuilt[output.phase]) rebuilt[output.phase] = {}
          try {
            rebuilt[output.phase][output.sectionTitle] = output.format === "json"
              ? JSON.parse(output.content)
              : output.content
          } catch {
            rebuilt[output.phase][output.sectionTitle] = output.content
          }
        }
        setCurrentOutput(rebuilt)
        setView("results")
        setActivePhase("strategic_intelligence")
      }
    } catch {}
  }

  const deleteProject = async (id: string) => {
    try {
      await fetch(`/api/asset-factory/projects/${id}`, { method: "DELETE" })
      setProjects(prev => prev.filter(p => p.id !== id))
      showToast("🗑️ Project deleted")
    } catch {}
  }

  const handleExport = async (type: "json" | "markdown") => {
    if (!currentProject) return
    try {
      const res = await fetch("/api/asset-factory/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: currentProject.id, exportType: type }),
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `asset-factory-${Date.now()}.${type === "markdown" ? "md" : type}`
      a.click()
      URL.revokeObjectURL(url)
      showToast(`📥 Exported as ${type.toUpperCase()}`)
    } catch {
      showToast("❌ Export failed")
    }
  }

  // Get outputs for active phase
  const phaseOutputs = currentProject?.outputs.filter(o => o.phase === activePhase) || []

  return (
    <div className="min-h-screen bg-[#080810] text-white p-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 border border-white/20 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-xl">
                🏭
              </div>
              <div>
                <h1 className="text-2xl font-black">AI Asset Factory™</h1>
                <p className="text-gray-500 text-sm">One keyword → complete client acquisition system</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("form")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${view === "form" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-400 hover:text-white"}`}
            >
              ✨ New Project
            </button>
            <button
              onClick={() => { setView("history"); loadProjects() }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${view === "history" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-400 hover:text-white"}`}
            >
              📁 History ({projects.length})
            </button>
            {view === "results" && currentProject && (
              <div className="flex items-center gap-2">
                <button onClick={() => handleExport("json")} className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 text-gray-400 hover:text-white transition-all">
                  📥 JSON
                </button>
                <button onClick={() => handleExport("markdown")} className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 text-gray-400 hover:text-white transition-all">
                  📥 Markdown
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FORM VIEW */}
        {view === "form" && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <span>🚀</span> Create Your Asset Package
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                    Business Niche / Keyword *
                  </label>
                  <input
                    value={form.niche}
                    onChange={e => setForm(p => ({ ...p, niche: e.target.value }))}
                    placeholder="e.g. Real estate investing for beginners"
                    className="w-full bg-[#0f0f1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                    Target Audience *
                  </label>
                  <input
                    value={form.targetAudience}
                    onChange={e => setForm(p => ({ ...p, targetAudience: e.target.value }))}
                    placeholder="e.g. Busy professionals aged 30-50"
                    className="w-full bg-[#0f0f1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                    Desired Outcome *
                  </label>
                  <input
                    value={form.desiredOutcome}
                    onChange={e => setForm(p => ({ ...p, desiredOutcome: e.target.value }))}
                    placeholder="e.g. Buy their first rental property in 90 days"
                    className="w-full bg-[#0f0f1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                    Offer Type *
                  </label>
                  <select
                    value={form.offerType}
                    onChange={e => setForm(p => ({ ...p, offerType: e.target.value }))}
                    className="w-full bg-[#0f0f1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white outline-none text-sm transition-colors"
                  >
                    <option value="">Select offer type...</option>
                    {OFFER_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                    Tone / Style
                  </label>
                  <select
                    value={form.tone}
                    onChange={e => setForm(p => ({ ...p, tone: e.target.value }))}
                    className="w-full bg-[#0f0f1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white outline-none text-sm transition-colors"
                  >
                    {TONE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                    Main CTA
                  </label>
                  <input
                    value={form.cta}
                    onChange={e => setForm(p => ({ ...p, cta: e.target.value }))}
                    placeholder="e.g. Book a Free Strategy Call"
                    className="w-full bg-[#0f0f1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                    Industry
                  </label>
                  <select
                    value={form.industry}
                    onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
                    className="w-full bg-[#0f0f1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white outline-none text-sm transition-colors"
                  >
                    <option value="">Select industry...</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                    Price Point
                  </label>
                  <input
                    value={form.pricePoint}
                    onChange={e => setForm(p => ({ ...p, pricePoint: e.target.value }))}
                    placeholder="e.g. $997 or $297/month"
                    className="w-full bg-[#0f0f1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl text-lg transition-all mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating your asset package... (60-90 seconds)
                  </span>
                ) : (
                  "🏭 Generate Full Asset Package →"
                )}
              </button>

              <p className="text-gray-600 text-xs text-center mt-3">
                Generates 6 phases • 40+ assets • Takes ~60-90 seconds
              </p>
            </div>

            {/* What you get */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
              {PHASES.map(phase => (
                <div key={phase.key} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{phase.label.split(" ")[0]}</div>
                  <div className="text-xs font-semibold text-gray-300">{phase.label.split(" ").slice(1).join(" ")}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS VIEW */}
        {view === "results" && (
          <div>
            {/* Project info bar */}
            {currentProject && (
              <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 mb-6 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-white">{currentProject.title}</span>
                  <span className="ml-3 text-xs text-gray-500">
                    {new Date(currentProject.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-semibold">
                  ✅ Complete
                </span>
              </div>
            )}

            {/* Phase tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {PHASES.map(phase => (
                <button
                  key={phase.key}
                  onClick={() => setActivePhase(phase.key)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activePhase === phase.key
                      ? "bg-purple-600 text-white"
                      : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {phase.label}
                </button>
              ))}
            </div>

            {/* Phase content */}
            {loading ? (
              <LoadingSkeleton />
            ) : phaseOutputs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {phaseOutputs.map(output => (
                  <OutputCard key={output.id} output={output} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-600">
                <div className="text-4xl mb-3">📭</div>
                <p>No content for this phase yet.</p>
              </div>
            )}
          </div>
        )}

        {/* HISTORY VIEW */}
        {view === "history" && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-black mb-4">📁 Project History</h2>
            {projects.length === 0 ? (
              <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-5xl mb-4">🏭</div>
                <p className="text-gray-400 mb-4">No projects yet. Generate your first asset package!</p>
                <button
                  onClick={() => setView("form")}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
                >
                  ✨ Create First Project
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map(project => (
                  <div key={project.id} className="bg-white/5 border border-white/10 hover:border-purple-500/30 rounded-xl p-5 flex items-center justify-between transition-all">
                    <div>
                      <h3 className="font-bold text-white text-sm">{project.title}</h3>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {project.niche} · {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        project.status === "complete" ? "bg-green-500/20 text-green-400" :
                        project.status === "error" ? "bg-red-500/20 text-red-400" :
                        "bg-amber-500/20 text-amber-400"
                      }`}>
                        {project.status}
                      </span>
                      {project.status === "complete" && (
                        <button
                          onClick={() => loadProject(project.id)}
                          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                        >
                          View →
                        </button>
                      )}
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="text-gray-600 hover:text-red-400 text-xs px-2 py-1.5 rounded-lg transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
