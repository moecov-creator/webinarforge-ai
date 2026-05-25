"use client"

import { useState } from "react"

interface GenerationStep {
  id: string
  label: string
  status: "pending" | "running" | "done" | "error"
}

interface ProductOutput {
  productTitle: string
  productPromise: string
  ebookTitle: string
  chapterOutline: string[]
  ebookDraft: string
  coverPrompt: string
  ebookHtml: string
  checklistContent: string
  workbookContent: string
  bonusTitle: string
  bonusContent: string
  salesPageCopy: string
  socialPromoPack: string
}

const STEPS: GenerationStep[] = [
  { id: "offer", label: "🎯 Creating $100M-style offer", status: "pending" },
  { id: "title", label: "📚 Generating product title & promise", status: "pending" },
  { id: "outline", label: "📋 Building chapter outline", status: "pending" },
  { id: "draft", label: "✍️ Writing full ebook draft", status: "pending" },
  { id: "cover", label: "🎨 Creating cover image prompt", status: "pending" },
  { id: "html", label: "🌐 Building styled HTML ebook", status: "pending" },
  { id: "bonus", label: "🎁 Creating bonus resources", status: "pending" },
  { id: "checklist", label: "✅ Building checklist & workbook", status: "pending" },
  { id: "sales", label: "💰 Writing sales page copy", status: "pending" },
  { id: "social", label: "📱 Creating social promo pack", status: "pending" },
  { id: "export", label: "📦 Preparing downloadable files", status: "pending" },
]

function DownloadButton({ label, content, filename, type }: {
  label: string; content: string; filename: string; type: "html" | "md" | "txt" | "json"
}) {
  const mimeTypes = { html: "text/html", md: "text/markdown", txt: "text/plain", json: "application/json" }
  const handleDownload = () => {
    const blob = new Blob([content], { type: mimeTypes[type] })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <button onClick={handleDownload} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all">
      <span>📥</span> {label}
    </button>
  )
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="text-xs text-gray-500 hover:text-white border border-gray-700 hover:border-gray-500 px-2 py-1 rounded-lg transition-all">
      {copied ? "✅" : "📋"}
    </button>
  )
}

export default function AssetFactoryPage() {
  const [keyword, setKeyword] = useState("")
  const [audience, setAudience] = useState("")
  const [outcome, setOutcome] = useState("")
  const [pricePoint, setPricePoint] = useState("$27")
  const [steps, setSteps] = useState<GenerationStep[]>(STEPS)
  const [generating, setGenerating] = useState(false)
  const [output, setOutput] = useState<ProductOutput | null>(null)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const updateStep = (id: string, status: GenerationStep["status"]) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }

  const handleGenerate = async () => {
    if (!keyword.trim()) { setError("Please enter a keyword or niche."); return }
    setError(""); setOutput(null); setGenerating(true)
    setSteps(STEPS.map(s => ({ ...s, status: "pending" })))

    try {
      updateStep("offer", "running")
      const res = await fetch("/api/asset-factory/generate-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, audience, outcome, pricePoint }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Generation failed") }
      const data = await res.json()

      const stepIds = ["offer","title","outline","draft","cover","html","bonus","checklist","sales","social","export"]
      for (let i = 0; i < stepIds.length; i++) {
        if (i > 0) updateStep(stepIds[i-1], "done")
        updateStep(stepIds[i], "running")
        await new Promise(r => setTimeout(r, 250))
      }
      updateStep(stepIds[stepIds.length-1], "done")
      setOutput(data.output); setActiveTab("overview")
    } catch (err: any) {
      setError(err.message || "Generation failed.")
      setSteps(prev => prev.map(s => s.status === "running" ? { ...s, status: "error" } : s))
    } finally {
      setGenerating(false)
    }
  }

  const completedSteps = steps.filter(s => s.status === "done").length
  const progress = Math.round((completedSteps / steps.length) * 100)
  const buildJson = () => output ? JSON.stringify({ productTitle: output.productTitle, productPromise: output.productPromise, ebookTitle: output.ebookTitle, coverPrompt: output.coverPrompt, chapterOutline: output.chapterOutline, generatedAt: new Date().toISOString() }, null, 2) : ""

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <div className="border-b border-white/5 px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-xl">🏭</div>
            <div>
              <h1 className="text-xl font-black">AI Asset Factory™</h1>
              <p className="text-gray-500 text-xs">One keyword → complete digital product</p>
            </div>
          </div>
          {output && <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full font-semibold">✅ Product Ready</span>}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* FORM */}
        {!generating && !output && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-10 text-xs text-gray-500 flex-wrap">
              {["Keyword","Offer","Ebook","Cover","Bonuses","Downloads"].map((s, i, arr) => (
                <div key={s} className="flex items-center gap-2">
                  <span className="bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1 rounded-full">{s}</span>
                  {i < arr.length-1 && <span className="text-gray-600">→</span>}
                </div>
              ))}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-black mb-6">🚀 Create Your Digital Product</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Keyword / Niche *</label>
                  <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="e.g. Night Shift Nurse Reset — 7 Days to Supercharged Energy"
                    className="w-full bg-[#0f0f1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Target Audience</label>
                    <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. Night shift nurses"
                      className="w-full bg-[#0f0f1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Price Point</label>
                    <select value={pricePoint} onChange={e => setPricePoint(e.target.value)} className="w-full bg-[#0f0f1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white outline-none text-sm">
                      {["$7","$17","$27","$37","$47","$97","$197","$297","$497","$997"].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Desired Outcome</label>
                  <input value={outcome} onChange={e => setOutcome(e.target.value)} placeholder="e.g. Feel energized and clear-headed within 7 days"
                    className="w-full bg-[#0f0f1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm transition-colors" />
                </div>
              </div>
              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
              <button onClick={handleGenerate} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black py-4 rounded-xl text-lg transition-all">
                🏭 Generate Full Digital Product →
              </button>
              <p className="text-gray-600 text-xs text-center mt-2">Generates ebook, cover prompt, bonuses, sales page & downloads • ~60 seconds</p>
            </div>
          </div>
        )}

        {/* PROGRESS */}
        {generating && (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3 animate-bounce">🏭</div>
              <h2 className="text-2xl font-black mb-1">Building Your Product...</h2>
              <p className="text-gray-500 text-sm">Creating a complete digital product package</p>
            </div>
            <div className="bg-white/5 rounded-full h-2 mb-8 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="space-y-2">
              {steps.map(step => (
                <div key={step.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  step.status==="running" ? "bg-purple-500/10 border border-purple-500/30" :
                  step.status==="done" ? "bg-white/3 border border-white/5 opacity-60" : "bg-white/2 border border-white/5 opacity-30"
                }`}>
                  <span className="text-lg flex-shrink-0">{step.status==="done"?"✅":step.status==="running"?"⚡":step.status==="error"?"❌":"⏳"}</span>
                  <span className={`text-sm font-medium ${step.status==="running"?"text-white":"text-gray-400"}`}>{step.label}</span>
                  {step.status==="running" && (
                    <div className="ml-auto flex gap-1">
                      {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OUTPUT */}
        {output && !generating && (
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/20 rounded-2xl p-6 mb-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-2">✅ Product Ready</div>
                  <h2 className="text-2xl font-black mb-2">{output.productTitle}</h2>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{output.productPromise}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/20">{pricePoint} Digital Product</span>
                    <span className="bg-white/10 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">📚 {output.chapterOutline.length} Chapters</span>
                  </div>
                </div>
                <button onClick={() => { setOutput(null); setSteps(STEPS) }} className="text-gray-500 hover:text-white text-sm border border-gray-700 hover:border-gray-500 px-3 py-2 rounded-xl transition-all flex-shrink-0">
                  ✨ New Product
                </button>
              </div>
            </div>

            {/* Downloads */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">📦 Download All Assets</p>
              <div className="flex flex-wrap gap-2">
                <DownloadButton label="Ebook (HTML)" content={output.ebookHtml} filename="main-ebook.html" type="html" />
                <DownloadButton label="Ebook (Markdown)" content={output.ebookDraft} filename="main-ebook.md" type="md" />
                <DownloadButton label="Checklist" content={output.checklistContent} filename="checklist.md" type="md" />
                <DownloadButton label="Workbook" content={output.workbookContent} filename="workbook.md" type="md" />
                <DownloadButton label="Sales Page" content={output.salesPageCopy} filename="sales-page-copy.md" type="md" />
                <DownloadButton label="Social Pack" content={output.socialPromoPack} filename="social-promo-pack.md" type="md" />
                <DownloadButton label="Bonus Resource" content={output.bonusContent} filename="bonus-resource.md" type="md" />
                <DownloadButton label="Product JSON" content={buildJson()} filename="product-summary.json" type="json" />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {[{id:"overview",label:"📋 Overview"},{id:"ebook",label:"📚 Ebook"},{id:"cover",label:"🎨 Cover"},{id:"bonus",label:"🎁 Bonuses"},{id:"sales",label:"💰 Sales Page"},{id:"social",label:"📱 Social Pack"}].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab===tab.id?"bg-purple-600 text-white":"bg-white/5 text-gray-400 hover:text-white"}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              {activeTab==="overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#0f0f1a] border border-white/10 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3"><h3 className="font-black text-sm">📚 Ebook Title</h3><CopyBtn text={output.ebookTitle} /></div>
                      <p className="text-gray-300 text-sm">{output.ebookTitle}</p>
                    </div>
                    <div className="bg-[#0f0f1a] border border-white/10 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3"><h3 className="font-black text-sm">💎 Product Promise</h3><CopyBtn text={output.productPromise} /></div>
                      <p className="text-gray-300 text-sm">{output.productPromise}</p>
                    </div>
                  </div>
                  <div className="bg-[#0f0f1a] border border-white/10 rounded-xl p-5">
                    <h3 className="font-black text-sm mb-3">📋 Chapter Outline ({output.chapterOutline.length} chapters)</h3>
                    <ol className="space-y-2">
                      {output.chapterOutline.map((ch, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="text-purple-400 font-black flex-shrink-0 w-6">{i+1}.</span>
                          <span className="text-gray-300">{ch}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {activeTab==="ebook" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black">{output.ebookTitle}</h3>
                    <div className="flex gap-2">
                      <DownloadButton label="HTML" content={output.ebookHtml} filename="main-ebook.html" type="html" />
                      <DownloadButton label="Markdown" content={output.ebookDraft} filename="main-ebook.md" type="md" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl overflow-hidden" style={{height:"500px"}}>
                    <iframe srcDoc={output.ebookHtml} className="w-full h-full border-none" title="Ebook Preview" />
                  </div>
                  <details className="mt-4">
                    <summary className="text-sm text-gray-400 cursor-pointer hover:text-white">View Markdown Source</summary>
                    <pre className="mt-3 text-xs text-gray-400 bg-black/30 rounded-xl p-4 overflow-auto max-h-60 whitespace-pre-wrap">{output.ebookDraft}</pre>
                  </details>
                </div>
              )}

              {activeTab==="cover" && (
                <div>
                  <h3 className="font-black mb-4">🎨 Cover Image Prompt</h3>
                  <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/20 rounded-xl p-6 mb-4">
                    <p className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-2">Use this prompt in Midjourney, DALL-E, or Leonardo AI:</p>
                    <p className="text-gray-200 text-sm leading-relaxed mb-3">{output.coverPrompt}</p>
                    <CopyBtn text={output.coverPrompt} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[{name:"Midjourney",url:"https://midjourney.com",color:"from-blue-600/20 to-blue-800/20"},{name:"DALL-E 3",url:"https://openai.com/dall-e-3",color:"from-green-600/20 to-green-800/20"},{name:"Leonardo AI",url:"https://leonardo.ai",color:"from-orange-600/20 to-orange-800/20"}].map(t => (
                      <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer" className={`bg-gradient-to-br ${t.color} border border-white/10 hover:border-white/20 rounded-xl p-4 text-center transition-all`}>
                        <div className="font-bold text-sm text-white">{t.name}</div>
                        <div className="text-xs text-gray-400 mt-1">Generate cover →</div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {activeTab==="bonus" && (
                <div className="space-y-4">
                  <div><div className="flex items-center justify-between mb-2"><h3 className="font-black">🎁 {output.bonusTitle}</h3><DownloadButton label="Download" content={output.bonusContent} filename="bonus-resource.md" type="md" /></div>
                  <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap bg-[#0f0f1a] border border-white/10 rounded-xl p-5">{output.bonusContent}</pre></div>
                  <div><div className="flex items-center justify-between mb-2"><h3 className="font-black">✅ Checklist</h3><DownloadButton label="Download" content={output.checklistContent} filename="checklist.md" type="md" /></div>
                  <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap bg-[#0f0f1a] border border-white/10 rounded-xl p-5">{output.checklistContent}</pre></div>
                  <div><div className="flex items-center justify-between mb-2"><h3 className="font-black">📓 Workbook</h3><DownloadButton label="Download" content={output.workbookContent} filename="workbook.md" type="md" /></div>
                  <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap bg-[#0f0f1a] border border-white/10 rounded-xl p-5">{output.workbookContent}</pre></div>
                </div>
              )}

              {activeTab==="sales" && (
                <div>
                  <div className="flex items-center justify-between mb-4"><h3 className="font-black">💰 Sales Page Copy</h3><div className="flex gap-2"><CopyBtn text={output.salesPageCopy} /><DownloadButton label="Download" content={output.salesPageCopy} filename="sales-page-copy.md" type="md" /></div></div>
                  <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap bg-[#0f0f1a] border border-white/10 rounded-xl p-5 max-h-[600px] overflow-auto">{output.salesPageCopy}</pre>
                </div>
              )}

              {activeTab==="social" && (
                <div>
                  <div className="flex items-center justify-between mb-4"><h3 className="font-black">📱 Social Promo Pack</h3><div className="flex gap-2"><CopyBtn text={output.socialPromoPack} /><DownloadButton label="Download" content={output.socialPromoPack} filename="social-promo-pack.md" type="md" /></div></div>
                  <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap bg-[#0f0f1a] border border-white/10 rounded-xl p-5 max-h-[600px] overflow-auto">{output.socialPromoPack}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
