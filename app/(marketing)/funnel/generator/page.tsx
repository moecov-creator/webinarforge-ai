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
  { id: "challenge", label: "Challenge Funnel", icon: "💪", desc: "Register → Engage → Offer" },
  { id: "tripwire", label: "Tripwire Funnel", icon: "💰", desc: "Low Ticket → Core → High Ticket" },
  { id: "survey", label: "Survey Funnel", icon: "📊", desc: "Quiz → Segment → Personalize" },
]

type GeneratedFunnel = {
  niche: string
  funnelType: string
  headline: string
  subheadline: string
  hook: string
  painPoints: string[]
  benefits: string[]
  valueStack: { item: string; value: string }[]
  testimonials: { name: string; role: string; quote: string; result: string }[]
  cta: string
  price: string
  originalPrice: string
  guarantee: string
  faqItems: { q: string; a: string }[]
  urgencyText: string
  pages: { name: string; purpose: string; elements: string[] }[]
  emailSequence: { subject: string; preview: string }[]
  adAngles: string[]
  stats: { value: string; label: string }[]
}

export default function FunnelGeneratorPage() {
  const [activeTab, setActiveTab] = useState<"generate" | "import">("generate")
  const [step, setStep] = useState(1)
  const [niche, setNiche] = useState("")
  const [funnelType, setFunnelType] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [mainOffer, setMainOffer] = useState("")
  const [pricePoint, setPricePoint] = useState("")
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<GeneratedFunnel | null>(null)
  const [progressMsg, setProgressMsg] = useState("")
  const [activePreviewTab, setActivePreviewTab] = useState<"preview" | "copy" | "pages" | "emails" | "ads">("preview")
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editedFunnel, setEditedFunnel] = useState<GeneratedFunnel | null>(null)

  const [importPlatform, setImportPlatform] = useState("")
  const [importUrl, setImportUrl] = useState("")
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStep, setImportStep] = useState("")

  const funnel = editedFunnel || generated

  const handleGenerate = async () => {
    if (!niche || !funnelType) return
    setGenerating(true)
    setGenerated(null)
    setEditedFunnel(null)

    const steps = [
      "Analyzing top 1% funnels in your niche...",
      "Studying competitor positioning...",
      "Crafting your unique hook...",
      "Writing high-converting headlines...",
      "Building value stack...",
      "Generating testimonials framework...",
      "Creating email sequences...",
      "Finalizing your AI funnel...",
    ]

    for (const s of steps) {
      await new Promise((r) => setTimeout(r, 600))
      setProgressMsg(s)
    }

    const f: GeneratedFunnel = {
      niche,
      funnelType,
      headline: `How ${targetAudience || niche + " Professionals"} Are Getting ${mainOffer || "Jaw-Dropping Results"} Without The Overwhelm`,
      subheadline: `Discover the exact step-by-step system top ${niche} experts use to generate consistent leads and sales — completely on autopilot.`,
      hook: `What if you could get results in ${niche} without doing any of the hard stuff? No grinding. No guessing. No wasting months on strategies that do not work.`,
      painPoints: [
        `Spending hours every week on ${niche} with inconsistent results`,
        `Watching competitors dominate while you struggle to get traction`,
        `Wasting money on ads and tools that never convert`,
        `Feeling overwhelmed by all the different strategies out there`,
        `Not having a predictable system to generate leads and sales`,
        `Working harder than ever but not seeing the growth you deserve`,
      ],
      benefits: [
        `Generate consistent leads from ${niche} on complete autopilot`,
        `Close more sales without manually following up with every prospect`,
        `Build authority and trust in your market automatically`,
        `Scale your business without working more hours`,
        `Have a proven system that works even when you are not working`,
        `Finally get the results you have been working toward`,
      ],
      valueStack: [
        { item: `${niche} Masterclass Training`, value: "$997" },
        { item: "Done-For-You Email Sequences", value: "$497" },
        { item: "Lead Generation Playbook", value: "$297" },
        { item: "Sales Script Templates", value: "$197" },
        { item: "Private Community Access", value: "$497" },
        { item: "30-Day Implementation Plan", value: "$297" },
        { item: "BONUS: AI Content Generator", value: "$997" },
      ],
      testimonials: [
        {
          name: "Sarah M.",
          role: `${niche} Expert`,
          quote: `This system completely transformed my ${niche} business. I went from struggling to get clients to having a waitlist in just 30 days.`,
          result: "312 leads in first week",
        },
        {
          name: "James K.",
          role: "Business Owner",
          quote: `I was skeptical at first but the results speak for themselves. My conversion rate jumped from 3% to over 18% using this exact system.`,
          result: "18.4% conversion rate",
        },
        {
          name: "Maria L.",
          role: `${niche} Coach`,
          quote: `I made more in the last 30 days using this system than I did in the entire previous quarter. The ROI is insane.`,
          result: "$14,700 in 30 days",
        },
      ],
      cta: pricePoint ? `Get Instant Access for ${pricePoint}` : "Get Instant Access Now",
      price: pricePoint || "$997",
      originalPrice: pricePoint ? `$${parseInt(pricePoint.replace(/\D/g, "") || "997") * 3}` : "$2,997",
      guarantee: `Try it for 30 days. If you do not get results, email us and we will refund every penny. No questions. No hassle. No hard feelings.`,
      urgencyText: `This offer expires in 24 hours or when all spots are claimed — whichever comes first.`,
      faqItems: [
        { q: `Does this work for ${niche}?`, a: `Yes — this system was specifically designed for ${niche} businesses and has been tested across dozens of niches with consistent results.` },
        { q: "How fast will I see results?", a: "Most users see their first leads within 7 days of implementing the system. Full results typically come within 30-60 days." },
        { q: "Do I need any tech skills?", a: "Zero. If you can fill out a form you can use this system. We built it specifically for non-technical people." },
        { q: "What if it does not work for me?", a: "You are covered by our 30-day money back guarantee. Try it risk-free and if you are not happy we refund everything." },
        { q: "Is this a one-time payment?", a: `Yes — ${pricePoint || "$997"} one time. No monthly fees, no hidden charges, no surprises.` },
      ],
      stats: [
        { value: "2,500+", label: "Happy Customers" },
        { value: "18.4%", label: "Avg Conversion" },
        { value: "30 Days", label: "To First Results" },
        { value: "100%", label: "Money Back Guarantee" },
      ],
      pages: [
        { name: "Landing Page", purpose: "Hook & capture attention", elements: ["Bold headline", "VSL video", "CTA button", "Social proof bar"] },
        { name: "Opt-in Page", purpose: "Capture lead info", elements: ["Lead magnet offer", "Name + email form", "Privacy note", "Benefit bullets"] },
        { name: "Sales Page", purpose: "Convert to buyer", elements: ["Value stack", "Testimonials", "Price reveal", "Guarantee badge", "FAQ", "Urgency timer"] },
        { name: "Order Page", purpose: "Process payment", elements: ["Order summary", "Payment form", "Security seals", "Guarantee reminder"] },
        { name: "Upsell Page", purpose: "Increase order value", elements: ["OTO headline", "Value stack", "Yes/No buttons", "Scarcity element"] },
        { name: "Thank You Page", purpose: "Onboard & upsell", elements: ["Access instructions", "Next steps", "Community link", "Referral offer"] },
      ],
      emailSequence: [
        { subject: "Welcome! Here is what happens next...", preview: "Thanks for joining. Here is everything you need to get started fast." },
        { subject: `The #1 mistake most ${niche} businesses make`, preview: "I see this all the time and it costs people thousands. Here is how to avoid it." },
        { subject: "[Case Study] How Sarah went from 0 to $14k in 30 days", preview: "She was exactly where you are 90 days ago. Here is what changed everything." },
        { subject: "Quick question for you...", preview: "I want to make sure you are getting value. Reply and let me know where you are stuck." },
        { subject: `The exact system I use to generate leads in ${niche}`, preview: "I have been holding this back but I am ready to share it with you today." },
        { subject: "Last chance — this offer closes at midnight", preview: "I do not want you to miss out. Here is one final reminder about this offer." },
      ],
      adAngles: [
        `Pain: "Tired of struggling in ${niche}? There is a better way..."`,
        `Curiosity: "The weird ${niche} trick that 7-figure businesses are hiding from you"`,
        `Social proof: "How 500+ ${targetAudience || niche + " pros"} are crushing it using this system"`,
        `FOMO: "While you read this, your competitors are dominating ${niche}"`,
        `Transformation: "From ${niche} beginner to confident expert in 90 days"`,
        `Authority: "The insider ${niche} strategy that top 1% earners actually use"`,
      ],
    }

    setGenerated(f)
    setEditedFunnel(f)
    setGenerating(false)
    setProgressMsg("")
    setActivePreviewTab("preview")
  }

  const handleImport = async () => {
    if (!importPlatform && !importUrl && !importFile) return
    setImporting(true)
    setImportProgress(0)

    const steps = [
      { msg: "Connecting to your funnel...", progress: 10 },
      { msg: "Scanning page structure...", progress: 25 },
      { msg: "Extracting headlines and copy...", progress: 40 },
      { msg: "Importing images and media...", progress: 55 },
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

  const updateField = (field: string, value: string) => {
    if (!editedFunnel) return
    setEditedFunnel({ ...editedFunnel, [field]: value })
    setEditingField(null)
  }

  const EditableText = ({ field, value, className }: { field: string; value: string; className?: string }) => {
    const [val, setVal] = useState(value)
    if (editingField === field) {
      return (
        <div className="relative">
          <textarea
            value={val}
            onChange={(e) => setVal(e.target.value)}
            rows={3}
            className="w-full bg-black/60 border border-purple-500 rounded-xl px-3 py-2 text-white text-sm focus:outline-none resize-none"
          />
          <div className="flex gap-2 mt-1">
            <button onClick={() => updateField(field, val)} className="text-xs bg-purple-600 px-3 py-1 rounded-lg">Save</button>
            <button onClick={() => setEditingField(null)} className="text-xs border border-white/20 px-3 py-1 rounded-lg">Cancel</button>
          </div>
        </div>
      )
    }
    return (
      <div className={`group relative cursor-pointer ${className}`} onClick={() => { setEditingField(field); }}>
        <span>{value}</span>
        <span className="hidden group-hover:inline-block ml-2 text-xs text-purple-400 border border-purple-500/50 px-1.5 py-0.5 rounded-lg">✏️ edit</span>
      </div>
    )
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
          and more in one click.
        </p>

        {/* TABS */}
        <div className="inline-flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-12">
          <button
            onClick={() => setActiveTab("generate")}
            className={`px-8 py-3 rounded-xl font-semibold transition ${activeTab === "generate" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}
          >
            🤖 AI Generate
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`px-8 py-3 rounded-xl font-semibold transition ${activeTab === "import" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}
          >
            📥 Import Funnel
          </button>
        </div>

        {/* ── AI GENERATOR TAB ── */}
        {activeTab === "generate" && (
          <div className="max-w-3xl mx-auto text-left">
            {!funnel ? (
              <>
                {/* STEP INDICATOR */}
                <div className="flex items-center gap-3 mb-8 justify-center">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${step >= s ? "bg-purple-600 text-white" : "bg-white/10 text-gray-500"}`}>
                        {s}
                      </div>
                      {s < 3 && <div className={`w-16 h-0.5 transition ${step > s ? "bg-purple-600" : "bg-white/10"}`} />}
                    </div>
                  ))}
                </div>

                {step === 1 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-2">Step 1 — Your Business</h2>
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
                            <button key={n} onClick={() => setNiche(n)}
                              className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-400 hover:border-purple-500 hover:text-white transition">
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
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-50"
                      >
                        Continue to Step 2 →
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-2">Step 2 — Funnel Type</h2>
                    <p className="text-gray-400 mb-6">Select the funnel structure that matches your goal.</p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {FUNNEL_TYPES.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setFunnelType(type.id)}
                          className={`p-4 rounded-xl border-2 text-left transition ${funnelType === type.id ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-white/5 hover:border-purple-500/50"}`}
                        >
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="font-bold text-sm">{type.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="flex-1 border border-white/20 hover:border-white/50 py-4 rounded-xl font-semibold transition">← Back</button>
                      <button
                        onClick={() => funnelType && setStep(3)}
                        disabled={!funnelType}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-50"
                      >
                        Continue to Step 3 →
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-2">Step 3 — Generate</h2>
                    <p className="text-gray-400 mb-6">Our AI will analyze top funnels in your niche and build yours in seconds.</p>

                    <div className="bg-black/40 rounded-xl p-4 mb-6 space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Niche</span><span className="text-white font-semibold">{niche}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Funnel Type</span><span className="text-white font-semibold">{FUNNEL_TYPES.find(f => f.id === funnelType)?.label}</span></div>
                      {targetAudience && <div className="flex justify-between text-sm"><span className="text-gray-500">Audience</span><span className="text-white font-semibold">{targetAudience}</span></div>}
                      {mainOffer && <div className="flex justify-between text-sm"><span className="text-gray-500">Offer</span><span className="text-white font-semibold">{mainOffer}</span></div>}
                      {pricePoint && <div className="flex justify-between text-sm"><span className="text-gray-500">Price</span><span className="text-white font-semibold">{pricePoint}</span></div>}
                    </div>

                    {generating && (
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                          <span className="text-purple-400 text-sm">{progressMsg}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="h-2 bg-purple-500 rounded-full animate-pulse" style={{ width: "60%" }} />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button onClick={() => setStep(2)} disabled={generating} className="flex-1 border border-white/20 py-4 rounded-xl font-semibold transition disabled:opacity-50">← Back</button>
                      <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-70 flex items-center justify-center gap-2"
                      >
                        {generating ? (
                          <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating...</>
                        ) : "🤖 Generate My Funnel →"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* ── GENERATED FUNNEL RESULT ── */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-purple-400">Your Funnel is Ready! 🎉</h2>
                    <p className="text-gray-400 text-sm">Built for: {funnel.niche} · {FUNNEL_TYPES.find(f => f.id === funnel.funnelType)?.label}</p>
                  </div>
                  <button
                    onClick={() => { setGenerated(null); setEditedFunnel(null); setStep(1) }}
                    className="text-sm text-gray-500 hover:text-white border border-white/10 px-4 py-2 rounded-xl transition"
                  >
                    Start Over
                  </button>
                </div>

                <p className="text-xs text-gray-500 bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-2">
                  ✏️ Click any text in the preview to edit it directly before launching
                </p>

                {/* PREVIEW TABS */}
                <div className="flex flex-wrap bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                  {[
                    { id: "preview", label: "🖥️ Live Preview" },
                    { id: "copy", label: "✍️ Copy" },
                    { id: "pages", label: "📄 Pages" },
                    { id: "emails", label: "📧 Emails" },
                    { id: "ads", label: "📢 Ads" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setActivePreviewTab(id as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activePreviewTab === id ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* LIVE PREVIEW TAB */}
                {activePreviewTab === "preview" && (
                  <div className="rounded-2xl overflow-hidden border border-white/10">

                    {/* HERO — ClickFunnels Style */}
                    <div className="bg-[#0d0d1a] px-8 py-12 text-center border-b border-white/10">
                      <div className="inline-block bg-yellow-400 text-black text-xs font-black px-4 py-1 rounded-full mb-6 uppercase">
                        Attention: {targetAudience || niche + " Professionals"}
                      </div>
                      <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                        <EditableText field="headline" value={funnel.headline} />
                      </h1>
                      <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                        <EditableText field="subheadline" value={funnel.subheadline} />
                      </p>

                      {/* VSL Placeholder */}
                      <div className="max-w-2xl mx-auto mb-8 rounded-2xl overflow-hidden border-4 border-yellow-400">
                        <div className="bg-gray-900 aspect-video flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-3 cursor-pointer hover:bg-yellow-300 transition">
                            <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          </div>
                          <p className="text-gray-400 text-sm">Watch This Free Training</p>
                          <p className="text-yellow-400 font-bold text-sm mt-1">(This changes everything — 3 mins)</p>
                        </div>
                      </div>

                      <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-10 py-5 rounded-xl text-xl transition shadow-[0_0_30px_rgba(250,204,21,0.4)]">
                        <EditableText field="cta" value={funnel.cta} className="text-black" />
                      </button>
                      <p className="text-gray-500 text-xs mt-3">🔒 Secure checkout · 30-day money back guarantee</p>
                    </div>

                    {/* STATS BAR — ProspexPro Style */}
                    <div className="bg-gradient-to-r from-purple-900 to-blue-900 px-8 py-8">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {funnel.stats.map(({ value, label }) => (
                          <div key={label}>
                            <div className="text-3xl font-black text-white mb-1">{value}</div>
                            <div className="text-sm text-purple-300">{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PAIN POINTS */}
                    <div className="bg-[#0a0a0a] px-8 py-12">
                      <h2 className="text-2xl md:text-3xl font-black text-center mb-8 uppercase">
                        Be Honest With Yourself For A Second...
                      </h2>
                      <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                        {funnel.painPoints.map((p) => (
                          <div key={p} className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                            <span className="text-red-400 flex-shrink-0">❌</span>
                            <p className="text-gray-300 text-sm">{p}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* BENEFITS */}
                    <div className="bg-[#050510] px-8 py-12">
                      <h2 className="text-2xl md:text-3xl font-black text-center mb-8">
                        Here is What Changes When You Have The Right System
                      </h2>
                      <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                        {funnel.benefits.map((b) => (
                          <div key={b} className="flex items-start gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                            <span className="text-green-400 flex-shrink-0">✅</span>
                            <p className="text-gray-300 text-sm">{b}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* TESTIMONIALS — ClickFunnels Style */}
                    <div className="bg-[#0d0d1a] px-8 py-12">
                      <h2 className="text-2xl md:text-3xl font-black text-center mb-8">
                        What Real Customers Say
                      </h2>
                      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {funnel.testimonials.map(({ name, role, quote, result }) => (
                          <div key={name} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="text-yellow-400 text-lg mb-3">★★★★★</div>
                            <p className="text-gray-300 text-sm mb-4 italic">"{quote}"</p>
                            <div className="border-t border-white/10 pt-3">
                              <p className="font-black text-yellow-400 text-sm">{result}</p>
                              <p className="text-white font-semibold text-sm">{name}</p>
                              <p className="text-gray-500 text-xs">{role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* VALUE STACK — Lead Challenge Style */}
                    <div className="bg-[#0a0a0a] px-8 py-12">
                      <h2 className="text-2xl md:text-3xl font-black text-center mb-4 uppercase">
                        Here is Everything You Get
                      </h2>
                      <p className="text-center text-gray-400 mb-8">
                        Total value: over ${funnel.valueStack.reduce((acc, v) => acc + parseInt(v.value.replace(/\D/g, "")), 0).toLocaleString()} — yours for just {funnel.price}
                      </p>
                      <div className="space-y-3 max-w-2xl mx-auto mb-8">
                        {funnel.valueStack.map(({ item, value }) => (
                          <div key={item} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-yellow-400">✅</span>
                              <span className="font-semibold text-sm">{item}</span>
                            </div>
                            <span className="text-gray-400 line-through text-sm">{value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-yellow-400/10 border-2 border-yellow-400 rounded-2xl p-8 max-w-2xl mx-auto text-center mb-8">
                        <p className="text-gray-400 text-lg mb-1">Regular Price: <span className="line-through">{funnel.originalPrice}</span></p>
                        <p className="text-5xl font-black text-yellow-400">{funnel.price}</p>
                        <p className="text-gray-500 text-sm mt-1">One-time payment. No monthly fees.</p>
                      </div>

                      <div className="text-center">
                        <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-10 py-5 rounded-xl text-xl transition shadow-[0_0_30px_rgba(250,204,21,0.3)] mb-4">
                          {funnel.cta}
                        </button>
                        <p className="text-red-400 text-sm font-semibold animate-pulse">{funnel.urgencyText}</p>
                      </div>
                    </div>

                    {/* GUARANTEE */}
                    <div className="bg-[#050510] px-8 py-12 text-center">
                      <div className="text-6xl mb-4">🛡️</div>
                      <h2 className="text-2xl font-black mb-4 uppercase">30-Day Money Back Guarantee</h2>
                      <p className="text-gray-300 max-w-2xl mx-auto text-sm">
                        <EditableText field="guarantee" value={funnel.guarantee} />
                      </p>
                    </div>

                    {/* FAQ */}
                    <div className="bg-[#0a0a0a] px-8 py-12">
                      <h2 className="text-2xl font-black text-center mb-8 uppercase">Frequently Asked Questions</h2>
                      <div className="space-y-4 max-w-3xl mx-auto">
                        {funnel.faqItems.map(({ q, a }) => (
                          <div key={q} className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <h3 className="font-black text-yellow-400 mb-2 text-sm">{q}</h3>
                            <p className="text-gray-400 text-sm">{a}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FINAL CTA */}
                    <div className="bg-yellow-400/5 border-t-4 border-yellow-400 px-8 py-16 text-center">
                      <h2 className="text-3xl font-black mb-4 uppercase">This Is Your Last Chance</h2>
                      <p className="text-gray-300 mb-8 max-w-xl mx-auto">{funnel.urgencyText}</p>
                      <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-12 py-6 rounded-xl text-2xl transition shadow-[0_0_40px_rgba(250,204,21,0.5)]">
                        {funnel.cta}
                      </button>
                      <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-500">
                        <span>🔒 256-bit SSL Secure</span>
                        <span>💳 All Cards Accepted</span>
                        <span>🔄 30-Day Guarantee</span>
                        <span>⚡ Instant Access</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* COPY TAB */}
                {activePreviewTab === "copy" && (
                  <div className="space-y-4">
                    {[
                      { label: "Main Headline", field: "headline", value: funnel.headline },
                      { label: "Subheadline", field: "subheadline", value: funnel.subheadline },
                      { label: "Opening Hook", field: "hook", value: funnel.hook },
                      { label: "CTA Button Text", field: "cta", value: funnel.cta },
                      { label: "Price", field: "price", value: funnel.price },
                      { label: "Urgency Text", field: "urgencyText", value: funnel.urgencyText },
                      { label: "Guarantee Text", field: "guarantee", value: funnel.guarantee },
                    ].map(({ label, field, value }) => (
                      <div key={field} className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-2">{label}</p>
                        {editingField === field ? (
                          <div>
                            <textarea
                              defaultValue={value}
                              rows={3}
                              id={`edit-${field}`}
                              className="w-full bg-black/60 border border-purple-500 rounded-xl px-3 py-2 text-white text-sm focus:outline-none resize-none"
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => {
                                  const el = document.getElementById(`edit-${field}`) as HTMLTextAreaElement
                                  updateField(field, el.value)
                                }}
                                className="text-xs bg-purple-600 px-3 py-1 rounded-lg"
                              >
                                Save
                              </button>
                              <button onClick={() => setEditingField(null)} className="text-xs border border-white/20 px-3 py-1 rounded-lg">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-white text-sm">{value}</p>
                            <button onClick={() => setEditingField(field)} className="flex-shrink-0 text-xs border border-purple-500/50 text-purple-400 px-2 py-1 rounded-lg hover:bg-purple-500/20 transition">
                              ✏️ Edit
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-3">Pain Points</p>
                      {funnel.painPoints.map((p, i) => (
                        <div key={i} className="flex items-center gap-2 mb-2">
                          <span className="text-red-400 text-sm">❌</span>
                          <p className="text-sm text-gray-300">{p}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-3">Benefits</p>
                      {funnel.benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-2 mb-2">
                          <span className="text-green-400 text-sm">✅</span>
                          <p className="text-sm text-gray-300">{b}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-3">Value Stack</p>
                      {funnel.valueStack.map(({ item, value }, i) => (
                        <div key={i} className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-300">✅ {item}</p>
                          <p className="text-sm text-gray-500 line-through">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PAGES TAB */}
                {activePreviewTab === "pages" && (
                  <div className="space-y-4">
                    {funnel.pages.map((page, i) => (
                      <div key={page.name} className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</div>
                          <div>
                            <h4 className="font-bold text-white">{page.name}</h4>
                            <p className="text-xs text-gray-500">{page.purpose}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {page.elements.map((el) => (
                            <span key={el} className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-full text-gray-400">{el}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* EMAILS TAB */}
                {activePreviewTab === "emails" && (
                  <div className="space-y-3">
                    {funnel.emailSequence.map((email, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
                        <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
                        <div>
                          <p className="font-semibold text-sm text-white">{email.subject}</p>
                          <p className="text-xs text-gray-500 mt-1">{email.preview}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ADS TAB */}
                {activePreviewTab === "ads" && (
                  <div className="space-y-3">
                    {funnel.adAngles.map((angle, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
                        <span className="text-purple-400 font-bold text-sm flex-shrink-0">{i + 1}.</span>
                        <p className="text-gray-300 text-sm">{angle}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* LAUNCH CTA */}
                <div className="bg-purple-600/10 border-2 border-purple-500 rounded-2xl p-6 text-center">
                  <h3 className="text-2xl font-black mb-2">Ready to Launch This Funnel?</h3>
                  <p className="text-gray-400 mb-6">
                    Get full access to WebinarForge AI and publish this exact funnel in minutes. Early bird price — $49 one-time.
                  </p>
                  <Link href="/sign-up?plan=earlybird">
                    <button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl text-lg transition">
                      Launch This Funnel for $49 →
                    </button>
                  </Link>
                  <p className="text-xs text-gray-600 mt-3">
                    Your edits are saved. Funnel will be ready to publish the moment you sign up.
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
                  and we will rebuild it with AI-powered optimization.
                </p>

                <div className="mb-6">
                  <label className="text-sm text-gray-400 mb-3 block font-semibold">Select Your Current Platform</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PLATFORMS.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => setImportPlatform(platform.id)}
                        className={`p-4 rounded-xl border-2 text-center transition ${importPlatform === platform.id ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-white/5 hover:border-purple-500/50"}`}
                      >
                        <div className="text-2xl mb-1">{platform.icon}</div>
                        <div className="text-xs font-semibold text-gray-300">{platform.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {importPlatform && (
                  <div className="space-y-4 mb-6">
                    <div className="bg-black/40 rounded-xl p-4">
                      <p className="text-sm font-semibold text-white mb-2">Option 1 — Paste Your Funnel URL</p>
                      <input
                        type="url"
                        value={importUrl}
                        onChange={(e) => setImportUrl(e.target.value)}
                        placeholder="https://your-funnel-url.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>
                    <div className="bg-black/40 rounded-xl p-4">
                      <p className="text-sm font-semibold text-white mb-2">Option 2 — Upload Export File</p>
                      <label className="flex items-center justify-center gap-3 border-2 border-dashed border-white/20 rounded-xl p-6 cursor-pointer hover:border-purple-500 transition">
                        <input type="file" className="hidden" accept=".json,.zip,.xml,.csv" onChange={(e) => setImportFile(e.target.files?.[0] || null)} />
                        <span className="text-3xl">📁</span>
                        <div>
                          <p className="text-sm font-semibold text-white">{importFile ? importFile.name : "Click to upload or drag and drop"}</p>
                          <p className="text-xs text-gray-500">Supports .json, .zip, .xml, .csv</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {importing && (
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-purple-400 text-sm">{importStep}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div className="h-3 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-700" style={{ width: `${importProgress}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-right">{importProgress}% complete</p>
                  </div>
                )}

                <button
                  onClick={handleImport}
                  disabled={importing || (!importUrl && !importFile) || !importPlatform}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {importing ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Importing...</>
                  ) : "📥 Import My Funnel →"}
                </button>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-black mb-3 text-green-400">Import Complete!</h2>
                <p className="text-gray-400 mb-8">
                  Your funnel has been successfully imported and rebuilt in WebinarForge AI
                  with AI-powered conversion optimization applied automatically.
                </p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-8 text-left">
                  <p className="text-xs text-green-400 font-bold uppercase mb-3">What We Did</p>
                  {["Imported all your pages and copy", "Applied AI headline optimization", "Added AI presenter to your webinar", "Connected evergreen automation", "Set up follow-up email sequences", "Enabled conversion tracking"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                      <span className="text-green-400">✅</span>{item}
                    </div>
                  ))}
                </div>
                <Link href="/sign-up?plan=earlybird">
                  <button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl text-lg transition mb-3">
                    Publish My Imported Funnel for $49 →
                  </button>
                </Link>
                <button onClick={() => { setImported(false); setImportPlatform(""); setImportUrl(""); setImportFile(null) }} className="text-sm text-gray-500 hover:text-white underline transition">
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
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Two Ways to Get Your Funnel Live</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-purple-500/30 rounded-2xl p-8 text-left">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-purple-400 mb-3">AI Generate</h3>
              <p className="text-gray-400 mb-6">Tell our AI your niche, audience, and offer. It analyzes the top 1% of funnels in your industry and builds a complete high-converting funnel with live preview, editable copy, email sequences, and ad angles.</p>
              <div className="space-y-2">
                {["Modeled on ClickFunnels, GoHighLevel, and top performers", "VSL + value stack + testimonials + guarantee + FAQ", "Full email follow-up sequence included", "Ad copy angles for Facebook, TikTok, and Google", "Edit everything before you launch"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-purple-400">✅</span>{item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-amber-500/30 rounded-2xl p-8 text-left">
              <div className="text-4xl mb-4">📥</div>
              <h3 className="text-2xl font-bold text-amber-400 mb-3">Import and Upgrade</h3>
              <p className="text-gray-400 mb-6">Already have a funnel on ClickFunnels, GoHighLevel, or anywhere else? Import it in one click and we will rebuild it with AI optimization — no starting from scratch.</p>
              <div className="space-y-2">
                {["Works with ClickFunnels, GHL, Kartra and more", "Imports copy, images, and structure", "AI applies conversion optimization", "Adds AI presenter automatically", "Connects evergreen automation"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-amber-400">✅</span>{item}
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
          Ready to Launch Your <span className="text-purple-400">AI-Powered Funnel?</span>
        </h2>
        <p className="text-gray-400 mb-8 text-lg">
          Generate or import your funnel today and get full access to WebinarForge AI for just $49 one-time.
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
