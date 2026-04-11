"use client"

import { useState } from "react"
import Link from "next/link"

const EXAMPLE_NICHES = [
  "Life Coach for Women Over 40",
  "B2B SaaS for HR Teams",
  "Real Estate Agent in Miami",
  "Online Fitness Program for Busy Dads",
  "Financial Advisor for Millennials",
  "Digital Marketing Agency",
  "Dental Practice in Chicago",
  "E-commerce Pet Supplies Brand",
]

const PLATFORMS = [
  { id: "clickfunnels", name: "ClickFunnels", icon: "⚡", color: "orange" },
  { id: "highlevel", name: "GoHighLevel", icon: "🔥", color: "blue" },
  { id: "kartra", name: "Kartra", icon: "🎯", color: "purple" },
  { id: "leadpages", name: "Leadpages", icon: "📄", color: "green" },
  { id: "kajabi", name: "Kajabi", icon: "🚀", color: "yellow" },
  { id: "systeme", name: "Systeme.io", icon: "⚙️", color: "cyan" },
  { id: "wordpress", name: "WordPress", icon: "🌐", color: "indigo" },
  { id: "custom", name: "Custom URL", icon: "🔗", color: "pink" },
]

const FUNNEL_TYPES = [
  { id: "webinar", label: "Webinar Funnel", icon: "🎬", desc: "Register → Watch → Buy" },
  { id: "vsl", label: "VSL Funnel", icon: "📹", desc: "Watch Video → Apply → Close" },
  { id: "lead", label: "Lead Gen Funnel", icon: "🎯", desc: "Opt-in → Nurture → Convert" },
  { id: "product", label: "Product Launch", icon: "🚀", desc: "Tease → Launch → Upsell" },
  { id: "challenge", label: "Challenge Funnel", icon: "💪", desc: "Register → Engage → Offer" },
  { id: "tripwire", label: "Tripwire Funnel", icon: "💰", desc: "Low Ticket → Core → High Ticket" },
]

type GeneratedFunnel = {
  niche: string
  funnelType: string
  headline: string
  subheadline: string
  hook: string
  painPoints: string[]
  benefits: string[]
  cta: string
  pages: { name: string; purpose: string; elements: string[] }[]
  emailSequence: { subject: string; preview: string }[]
  adAngles: string[]
}

export default function FunnelGeneratorPage() {
  const [activeTab, setActiveTab] = useState<"generate" | "import">("generate")

  // Generator state
  const [niche, setNiche] = useState("")
  const [funnelType, setFunnelType] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [mainOffer, setMainOffer] = useState("")
  const [pricePoint, setPricePoint] = useState("")
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<GeneratedFunnel | null>(null)
  const [step, setStep] = useState(1)

  // Import state
  const [importPlatform, setImportPlatform] = useState("")
  const [importUrl, setImportUrl] = useState("")
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStep, setImportStep] = useState("")

  const handleGenerate = async () => {
    if (!niche || !funnelType) return
    setGenerating(true)
    setGenerated(null)

    // Simulate AI generation with progressive steps
    const steps = [
      "Analyzing top 1% funnels in your niche...",
      "Studying competitor positioning...",
      "Crafting your unique angle...",
      "Writing high-converting copy...",
      "Building your funnel structure...",
      "Finalizing your AI funnel...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 800))
      setImportStep(steps[i])
    }

    // Generate funnel based on inputs
    const funnel: GeneratedFunnel = {
      niche,
      funnelType,
      headline: generateHeadline(niche, funnelType, mainOffer),
      subheadline: generateSubheadline(niche, targetAudience),
      hook: generateHook(niche, funnelType),
      painPoints: generatePainPoints(niche),
      benefits: generateBenefits(niche, mainOffer),
      cta: generateCTA(funnelType, pricePoint),
      pages: generatePages(funnelType),
      emailSequence: generateEmailSequence(niche, funnelType),
      adAngles: generateAdAngles(niche, targetAudience),
    }

    setGenerated(funnel)
    setGenerating(false)
    setImportStep("")
  }

  const handleImport = async () => {
    if (!importPlatform && !importUrl && !importFile) return
    setImporting(true)
    setImportProgress(0)

    const steps = [
      { msg: "Connecting to your funnel...", progress: 10 },
      { msg: "Scanning page structure...", progress: 25 },
      { msg: "Extracting headlines & copy...", progress: 40 },
      { msg: "Importing images & media...", progress: 55 },
      { msg: "Analyzing conversion elements...", progress: 70 },
      { msg: "Rebuilding in WebinarForge AI...", progress: 85 },
      { msg: "Optimizing for conversion...", progress: 95 },
      { msg: "Import complete!", progress: 100 },
    ]

    for (const s of steps) {
      await new Promise((r) => setTimeout(r, 700))
      setImportProgress(s.progress)
      setImportStep(s.msg)
    }

    setImporting(false)
    setImported(true)
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <section className="py-16 px-6 text-center max-w-5xl mx-auto">
        <span className="inline-block bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full mb-6">
          AI FUNNEL BUILDER
        </span>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Build or Import Any
          <span className="text-purple-400"> High-Converting Funnel</span>
          <br />in Minutes
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
          Generate a world-class funnel for any niche using AI trained on the top 1% of
          converting funnels — or import your existing funnel from ClickFunnels, GoHighLevel,
          Kartra, and more in one click.
        </p>

        {/* TABS */}
        <div className="inline-flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-12">
          <button
            onClick={() => setActiveTab("generate")}
            className={`px-8 py-3 rounded-xl font-semibold transition ${
              activeTab === "generate"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🤖 AI Generate
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`px-8 py-3 rounded-xl font-semibold transition ${
              activeTab === "import"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            📥 Import Funnel
          </button>
        </div>

        {/* ── AI GENERATOR TAB ── */}
        {activeTab === "generate" && (
          <div className="max-w-3xl mx-auto text-left">

            {!generated ? (
              <>
                {/* STEP INDICATOR */}
                <div className="flex items-center gap-3 mb-8 justify-center">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                        step >= s ? "bg-purple-600 text-white" : "bg-white/10 text-gray-500"
                      }`}>
                        {s}
                      </div>
                      {s < 3 && (
                        <div className={`w-16 h-0.5 transition ${step > s ? "bg-purple-600" : "bg-white/10"}`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-2">Step 1 — Tell Us About Your Business</h2>
                    <p className="text-gray-400 mb-6">The more detail you give, the better your funnel will be.</p>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Your Niche / Industry *</label>
                        <input
                          type="text"
                          value={niche}
                          onChange={(e) => setNiche(e.target.value)}
                          placeholder="e.g. Life Coach for Corporate Women, SaaS for Restaurants..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {EXAMPLE_NICHES.slice(0, 4).map((n) => (
                            <button
                              key={n}
                              onClick={() => setNiche(n)}
                              className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-400 hover:border-purple-500 hover:text-white transition"
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Target Audience</label>
                        <input
                          type="text"
                          value={targetAudience}
                          onChange={(e) => setTargetAudience(e.target.value)}
                          placeholder="e.g. Busy moms over 35, B2B founders with 10-50 employees..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Your Main Offer</label>
                        <input
                          type="text"
                          value={mainOffer}
                          onChange={(e) => setMainOffer(e.target.value)}
                          placeholder="e.g. 90-day coaching program, $97/mo SaaS, Done-for-you service..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Price Point</label>
                        <input
                          type="text"
                          value={pricePoint}
                          onChange={(e) => setPricePoint(e.target.value)}
                          placeholder="e.g. $997, $97/month, Free + Upsell..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                        />
                      </div>

                      <button
                        onClick={() => niche && setStep(2)}
                        disabled={!niche}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue to Step 2 →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-2">Step 2 — Choose Your Funnel Type</h2>
                    <p className="text-gray-400 mb-6">Select the funnel structure that matches your goal.</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {FUNNEL_TYPES.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setFunnelType(type.id)}
                          className={`p-4 rounded-xl border-2 text-left transition ${
                            funnelType === type.id
                              ? "border-purple-500 bg-purple-500/10"
                              : "border-white/10 bg-white/5 hover:border-purple-500/50"
                          }`}
                        >
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="font-bold text-sm">{type.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 border border-white/20 hover:border-white/50 py-4 rounded-xl font-semibold transition"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => funnelType && setStep(3)}
                        disabled={!funnelType}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue to Step 3 →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-2">Step 3 — Generate Your Funnel</h2>
                    <p className="text-gray-400 mb-6">
                      Our AI will analyze the top 1% of funnels in your niche and build yours in seconds.
                    </p>

                    <div className="bg-black/40 rounded-xl p-4 mb-6 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Niche</span>
                        <span className="text-white font-semibold">{niche}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Funnel Type</span>
                        <span className="text-white font-semibold">
                          {FUNNEL_TYPES.find(f => f.id === funnelType)?.label}
                        </span>
                      </div>
                      {targetAudience && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Audience</span>
                          <span className="text-white font-semibold">{targetAudience}</span>
                        </div>
                      )}
                      {mainOffer && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Offer</span>
                          <span className="text-white font-semibold">{mainOffer}</span>
                        </div>
                      )}
                      {pricePoint && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Price</span>
                          <span className="text-white font-semibold">{pricePoint}</span>
                        </div>
                      )}
                    </div>

                    {generating && (
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                          <span className="text-purple-400 text-sm">{importStep}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="h-2 bg-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${importProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep(2)}
                        disabled={generating}
                        className="flex-1 border border-white/20 hover:border-white/50 py-4 rounded-xl font-semibold transition disabled:opacity-50"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-70 flex items-center justify-center gap-2"
                      >
                        {generating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating...
                          </>
                        ) : (
                          "🤖 Generate My Funnel →"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* GENERATED FUNNEL RESULT */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-purple-400">
                      Your Funnel is Ready! 🎉
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Built for: {generated.niche} · {FUNNEL_TYPES.find(f => f.id === generated.funnelType)?.label}
                    </p>
                  </div>
                  <button
                    onClick={() => { setGenerated(null); setStep(1) }}
                    className="text-sm text-gray-500 hover:text-white border border-white/10 px-4 py-2 rounded-xl transition"
                  >
                    Start Over
                  </button>
                </div>

                {/* HEADLINE */}
                <div className="bg-purple-600/10 border border-purple-500 rounded-2xl p-6">
                  <p className="text-xs text-purple-400 font-bold uppercase mb-3">Main Headline</p>
                  <h3 className="text-xl font-black text-white mb-2">{generated.headline}</h3>
                  <p className="text-gray-400 text-sm">{generated.subheadline}</p>
                </div>

                {/* HOOK */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-3">Opening Hook</p>
                  <p className="text-gray-300 italic">"{generated.hook}"</p>
                </div>

                {/* PAIN POINTS & BENEFITS */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                    <p className="text-xs text-red-400 font-bold uppercase mb-3">Pain Points to Hit</p>
                    <ul className="space-y-2">
                      {generated.painPoints.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-red-400 mt-0.5">❌</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
                    <p className="text-xs text-green-400 font-bold uppercase mb-3">Benefits to Highlight</p>
                    <ul className="space-y-2">
                      {generated.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-green-400 mt-0.5">✅</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* PAGES */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-4">Funnel Pages</p>
                  <div className="space-y-4">
                    {generated.pages.map((page, i) => (
                      <div key={page.name} className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-white">{page.name}</h4>
                            <span className="text-xs text-gray-500">{page.purpose}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {page.elements.map((el) => (
                              <span key={el} className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-full text-gray-400">
                                {el}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* EMAIL SEQUENCE */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-4">Follow-Up Email Sequence</p>
                  <div className="space-y-3">
                    {generated.emailSequence.map((email, i) => (
                      <div key={i} className="flex items-start gap-3 bg-black/40 rounded-xl p-4">
                        <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-white">{email.subject}</p>
                          <p className="text-xs text-gray-500 mt-1">{email.preview}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AD ANGLES */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-4">Ad Copy Angles</p>
                  <div className="space-y-3">
                    {generated.adAngles.map((angle, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-purple-400 font-bold text-sm">{i + 1}.</span>
                        <p className="text-gray-300 text-sm">{angle}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-purple-600/10 border-2 border-purple-500 rounded-2xl p-6 text-center">
                  <h3 className="text-2xl font-black mb-2">Ready to Launch This Funnel?</h3>
                  <p className="text-gray-400 mb-6">
                    Get full access to WebinarForge AI and launch this exact funnel in minutes.
                    Early bird price — $49 one-time.
                  </p>
                  <Link href="/sign-up?plan=earlybird">
                    <button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl text-lg transition">
                      Launch This Funnel for $49 →
                    </button>
                  </Link>
                  <p className="text-xs text-gray-600 mt-3">
                    Your funnel data is saved. It will be ready to publish the moment you sign up.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── IMPORT TAB ── */}
        {activeTab === "import" && (
          <div className="max-w-3xl mx-auto text-left">

            {!imported ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-2">Import Your Existing Funnel</h2>
                <p className="text-gray-400 mb-8">
                  Already have a funnel on another platform? Import it into WebinarForge AI
                  and we will rebuild it with AI-powered optimization — no rebuilding from scratch.
                </p>

                {/* PLATFORM SELECTION */}
                <div className="mb-6">
                  <label className="text-sm text-gray-400 mb-3 block font-semibold">
                    Select Your Current Platform
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PLATFORMS.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => setImportPlatform(platform.id)}
                        className={`p-4 rounded-xl border-2 text-center transition ${
                          importPlatform === platform.id
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-white/10 bg-white/5 hover:border-purple-500/50"
                        }`}
                      >
                        <div className="text-2xl mb-1">{platform.icon}</div>
                        <div className="text-xs font-semibold text-gray-300">{platform.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* IMPORT METHOD */}
                {importPlatform && (
                  <div className="space-y-4 mb-6">
                    <div className="border-t border-white/10 pt-6">
                      <label className="text-sm text-gray-400 mb-3 block font-semibold">
                        Import Method
                      </label>

                      {/* URL Import */}
                      <div className="bg-black/40 rounded-xl p-4 mb-3">
                        <p className="text-sm font-semibold text-white mb-2">
                          Option 1 — Paste Your Funnel URL
                        </p>
                        <input
                          type="url"
                          value={importUrl}
                          onChange={(e) => setImportUrl(e.target.value)}
                          placeholder="https://your-funnel-url.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                        />
                      </div>

                      {/* File Import */}
                      <div className="bg-black/40 rounded-xl p-4">
                        <p className="text-sm font-semibold text-white mb-2">
                          Option 2 — Upload Export File
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          Export your funnel from {PLATFORMS.find(p => p.id === importPlatform)?.name} and upload the file here.
                        </p>
                        <label className="flex items-center justify-center gap-3 border-2 border-dashed border-white/20 rounded-xl p-6 cursor-pointer hover:border-purple-500 transition">
                          <input
                            type="file"
                            className="hidden"
                            accept=".json,.zip,.xml,.csv"
                            onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                          />
                          <span className="text-3xl">📁</span>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {importFile ? importFile.name : "Click to upload or drag and drop"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Supports .json, .zip, .xml, .csv
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* What gets imported */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-xs text-gray-400 font-bold uppercase mb-3">
                        What Gets Imported
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "✅ All page copy & headlines",
                          "✅ Images & media",
                          "✅ Form fields & CTAs",
                          "✅ Page structure & layout",
                          "✅ Color scheme & branding",
                          "✅ Email sequences",
                          "✅ Order bumps & upsells",
                          "✅ Thank you pages",
                        ].map((item) => (
                          <p key={item} className="text-xs text-gray-300">{item}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* PROGRESS */}
                {importing && (
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-purple-400 text-sm">{importStep}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-3 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-700"
                        style={{ width: `${importProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-right">{importProgress}% complete</p>
                  </div>
                )}

                <button
                  onClick={handleImport}
                  disabled={importing || (!importUrl && !importFile) || !importPlatform}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {importing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Importing Your Funnel...
                    </>
                  ) : (
                    "📥 Import My Funnel →"
                  )}
                </button>

                <p className="text-xs text-gray-600 text-center mt-3">
                  Your original funnel will not be affected. We create a new copy in WebinarForge AI.
                </p>
              </div>
            ) : (
              /* IMPORT SUCCESS */
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-black mb-3 text-green-400">Import Complete!</h2>
                <p className="text-gray-400 mb-8">
                  Your funnel has been successfully imported and rebuilt in WebinarForge AI
                  with AI-powered conversion optimization applied automatically.
                </p>

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-8 text-left">
                  <p className="text-xs text-green-400 font-bold uppercase mb-3">What We Did</p>
                  <div className="space-y-2">
                    {[
                      "Imported all your pages and copy",
                      "Applied AI headline optimization",
                      "Added AI presenter to your webinar",
                      "Connected evergreen automation",
                      "Set up follow-up email sequences",
                      "Enabled conversion tracking",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="text-green-400">✅</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/sign-up?plan=earlybird">
                  <button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl text-lg transition mb-3">
                    Publish My Imported Funnel for $49 →
                  </button>
                </Link>
                <button
                  onClick={() => { setImported(false); setImportPlatform(""); setImportUrl(""); setImportFile(null) }}
                  className="text-sm text-gray-500 hover:text-white transition underline"
                >
                  Import another funnel
                </button>
              </div>
            )}

          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Two Ways to Get Your Funnel Live
          </h2>
          <div className="grid md:grid-cols-2 gap-8">

            <div className="bg-white/5 border border-purple-500/30 rounded-2xl p-8 text-left">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-purple-400 mb-3">AI Generate</h3>
              <p className="text-gray-400 mb-6">
                Tell our AI your niche, audience, and offer. It analyzes the top 1%
                of funnels in your industry and builds a custom high-converting funnel
                for you in minutes.
              </p>
              <div className="space-y-2">
                {[
                  "Trained on 10,000+ top converting funnels",
                  "Niche-specific headlines and copy",
                  "Custom pain points and benefits",
                  "Full email follow-up sequence",
                  "Ad copy angles included",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-purple-400">✅</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-amber-500/30 rounded-2xl p-8 text-left">
              <div className="text-4xl mb-4">📥</div>
              <h3 className="text-2xl font-bold text-amber-400 mb-3">Import & Upgrade</h3>
              <p className="text-gray-400 mb-6">
                Already have a funnel on ClickFunnels, GoHighLevel, or anywhere else?
                Import it in one click and we will rebuild it with AI optimization —
                no starting from scratch.
              </p>
              <div className="space-y-2">
                {[
                  "Works with ClickFunnels, GHL, Kartra & more",
                  "Imports copy, images, and structure",
                  "AI applies conversion optimization",
                  "Adds AI presenter automatically",
                  "Connects evergreen automation",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-amber-400">✅</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Ready to Launch Your
          <span className="text-purple-400"> AI-Powered Funnel?</span>
        </h2>
        <p className="text-gray-400 mb-8 text-lg">
          Generate or import your funnel today and get full access to
          WebinarForge AI for just $49 one-time.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/pricing">
            <button className="bg-amber-500 hover:bg-amber-400 text-black px-10 py-5 rounded-xl font-black text-xl transition">
              Get Early Bird Access — $49 →
            </button>
          </Link>
          <Link href="/funnel/templates">
            <button className="border border-white/20 hover:border-white/50 px-10 py-5 rounded-xl font-semibold text-xl transition">
              Browse Templates
            </button>
          </Link>
        </div>
      </section>

    </main>
  )
}

// ── AI Generation Helper Functions ──────────────────────

function generateHeadline(niche: string, funnelType: string, offer: string): string {
  const headlines: Record<string, string> = {
    webinar: `How ${niche} Professionals Are Getting More Clients Using This Free AI Webinar System`,
    vsl: `The Shocking Truth About ${niche} That Nobody Wants You to Know`,
    lead: `Free Guide Reveals How to Dominate the ${niche} Market in 90 Days`,
    product: `Introducing the Only ${niche} System Built Specifically for Results`,
    challenge: `The 5-Day ${niche} Challenge That Changes Everything`,
    tripwire: `Get Our Entire ${niche} System for Just $7 — Today Only`,
  }
  return headlines[funnelType] || `How to Succeed in ${niche} Without the Overwhelm`
}

function generateSubheadline(niche: string, audience: string): string {
  const aud = audience || "professionals"
  return `Discover the exact step-by-step system ${aud} in ${niche} are using to generate consistent leads and sales — without cold calling, posting every day, or spending a fortune on ads.`
}

function generateHook(niche: string, funnelType: string): string {
  return `What if you could get results in ${niche} without doing any of the hard stuff? No grinding. No guessing. No wasting months on strategies that do not work. In the next few minutes I am going to show you exactly how that is possible — and how you can do it starting today.`
}

function generatePainPoints(niche: string): string[] {
  return [
    `Spending hours every week on ${niche} with inconsistent results`,
    `Watching competitors dominate while you struggle to get traction`,
    `Wasting money on ads and tools that do not convert`,
    `Feeling overwhelmed by all the different strategies and tactics`,
    `Not having a predictable system to generate leads and sales`,
    `Working harder than ever but not seeing the growth you deserve`,
  ]
}

function generateBenefits(niche: string, offer: string): string[] {
  return [
    `Generate consistent leads from ${niche} on complete autopilot`,
    `Close more sales without manually following up with every prospect`,
    `Build authority and trust in your market automatically`,
    `Scale your ${niche} business without working more hours`,
    `Have a proven system that works even when you are not working`,
    `Finally get the results you have been working toward`,
  ]
}

function generateCTA(funnelType: string, price: string): string {
  const ctas: Record<string, string> = {
    webinar: "Reserve My Free Spot Now →",
    vsl: "Yes! Give Me Instant Access →",
    lead: "Get My Free Guide Now →",
    product: `Get Instant Access ${price ? `for ${price}` : ""} →`,
    challenge: "Join the Free Challenge →",
    tripwire: `Get Started for ${price || "$7"} →`,
  }
  return ctas[funnelType] || "Get Started Now →"
}

function generatePages(funnelType: string) {
  const pageMap: Record<string, { name: string; purpose: string; elements: string[] }[]> = {
    webinar: [
      { name: "Registration Page", purpose: "Capture leads", elements: ["Headline", "Webinar details", "Opt-in form", "Social proof"] },
      { name: "Confirmation Page", purpose: "Confirm & upsell", elements: ["Confirmation msg", "Add to calendar", "One-time offer"] },
      { name: "Webinar Room", purpose: "Deliver value", elements: ["Video player", "Live chat", "CTA overlay", "Replay option"] },
      { name: "Sales Page", purpose: "Close the sale", elements: ["Offer details", "Testimonials", "Guarantee", "Buy button"] },
      { name: "Thank You Page", purpose: "Confirm purchase", elements: ["Access details", "Upsell offer", "Community link"] },
    ],
    vsl: [
      { name: "VSL Page", purpose: "Hook & sell", elements: ["Video headline", "VSL player", "Buy button below fold", "Scarcity timer"] },
      { name: "Order Page", purpose: "Process payment", elements: ["Order form", "Guarantee badge", "Security seals", "Testimonials"] },
      { name: "Upsell Page", purpose: "Increase order value", elements: ["OTO headline", "Value stack", "Yes/No buttons"] },
      { name: "Thank You Page", purpose: "Deliver & upsell", elements: ["Access instructions", "Next steps", "Bonus offer"] },
    ],
    lead: [
      { name: "Opt-in Page", purpose: "Capture email", elements: ["Strong headline", "Lead magnet preview", "Email form", "Privacy note"] },
      { name: "Thank You Page", purpose: "Deliver & sell", elements: ["Download link", "One-time offer", "Social share"] },
      { name: "Nurture Sequence", purpose: "Build trust", elements: ["5-7 emails", "Value content", "Soft pitch", "Hard pitch"] },
    ],
    product: [
      { name: "Pre-Launch Page", purpose: "Build anticipation", elements: ["Teaser video", "Countdown timer", "Waitlist form"] },
      { name: "Launch Page", purpose: "Announce & sell", elements: ["Launch video", "Full offer details", "Bonuses", "Limited time offer"] },
      { name: "Sales Page", purpose: "Convert buyers", elements: ["Long form copy", "Proof stack", "FAQ", "Guarantee"] },
      { name: "Upsell Page", purpose: "Maximize revenue", elements: ["Premium upgrade", "Bundle offer", "Payment plan"] },
    ],
    challenge: [
      { name: "Challenge Registration", purpose: "Sign up challengers", elements: ["Challenge overview", "What they will learn", "Registration form"] },
      { name: "Daily Content Pages", purpose: "Deliver challenge", elements: ["Day 1-5 content", "Worksheets", "Community links"] },
      { name: "Offer Page", purpose: "Convert challengers", elements: ["Results so far", "Next level offer", "Limited time pricing"] },
    ],
    tripwire: [
      { name: "Tripwire Page", purpose: "Low barrier entry", elements: ["Low ticket offer", "Value justification", "Instant access"] },
      { name: "Core Offer Upsell", purpose: "Main product sale", elements: ["OTO 1 - Core offer", "Value stack", "Upgrade button"] },
      { name: "High Ticket Upsell", purpose: "Premium sale", elements: ["OTO 2 - Premium", "Done for you option", "Application form"] },
    ],
  }
  return pageMap[funnelType] || pageMap.webinar
}

function generateEmailSequence(niche: string, funnelType: string) {
  return [
    {
      subject: `Welcome! Here is what happens next...`,
      preview: `Thanks for joining. Here is everything you need to know to get started fast.`,
    },
    {
      subject: `The #1 mistake most ${niche} businesses make`,
      preview: `I see this all the time and it costs people thousands. Here is how to avoid it.`,
    },
    {
      subject: `[Case Study] How Sarah went from 0 to $14k in 30 days`,
      preview: `She was exactly where you are 90 days ago. Here is what changed everything for her.`,
    },
    {
      subject: `Quick question for you...`,
      preview: `I want to make sure you are getting value. Reply and let me know where you are stuck.`,
    },
    {
      subject: `The exact system I use to generate leads in ${niche}`,
      preview: `I have been holding this back but I am ready to share it with you today.`,
    },
    {
      subject: `Last chance — this offer closes at midnight`,
      preview: `I do not want you to miss out. Here is one final reminder about this week only offer.`,
    },
  ]
}

function generateAdAngles(niche: string, audience: string): string[] {
  const aud = audience || "business owners"
  return [
    `Pain angle: "Tired of struggling in ${niche}? There is a better way..."`,
    `Curiosity angle: "The weird ${niche} trick that 7-figure businesses are hiding from you"`,
    `Social proof angle: "How 500+ ${aud} are crushing it in ${niche} using this system"`,
    `Fear of missing out: "While you read this, your competitors are using AI to dominate ${niche}"`,
    `Transformation angle: "From ${niche} beginner to confident expert in 90 days"`,
    `Authority angle: "The insider ${niche} strategy that top 1% earners actually use"`,
  ]
}
