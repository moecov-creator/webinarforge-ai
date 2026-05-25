"use client"

import { useState } from "react"

interface GenerationStep { id: string; label: string; status: "pending"|"running"|"done"|"error" }
interface ProductOutput {
  productTitle: string; productPromise: string; ebookTitle: string; chapterOutline: string[]
  ebookDraft: string; coverPrompt: string; coverImageUrl: string; ebookHtml: string
  checklistContent: string; workbookContent: string; bonusTitle: string; bonusContent: string
  salesPageCopy: string; emailSequence: string; miniCourse: string; socialPromoPack: string
}

const STEPS: GenerationStep[] = [
  { id:"s1", label:"🎯 Creating $100M-style offer", status:"pending" },
  { id:"s2", label:"📚 Writing full ebook (2000+ words)", status:"pending" },
  { id:"s3", label:"💰 Building sales page copy", status:"pending" },
  { id:"s4", label:"📧 Writing 5-email nurture sequence", status:"pending" },
  { id:"s5", label:"🎬 Creating mini-course + video scripts", status:"pending" },
  { id:"s6", label:"✅ Building checklist & workbook", status:"pending" },
  { id:"s7", label:"📱 Creating social media pack", status:"pending" },
  { id:"s8", label:"🎁 Writing bonus resource", status:"pending" },
  { id:"s9", label:"🎨 Generating AI cover image", status:"pending" },
  { id:"s10", label:"📦 Assembling final package", status:"pending" },
]

function DlBtn({ label, content, filename, type }: { label:string; content:string; filename:string; type:"html"|"md"|"txt"|"json" }) {
  const mime = { html:"text/html", md:"text/markdown", txt:"text/plain", json:"application/json" }
  return (
    <button onClick={() => { const b=new Blob([content],{type:mime[type]}); const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=filename; a.click(); URL.revokeObjectURL(u) }}
      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all">
      📥 {label}
    </button>
  )
}

function CopyBtn({ text }: { text:string }) {
  const [c,setC] = useState(false)
  return <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(()=>setC(false),2000) }} className="text-xs text-gray-500 hover:text-white border border-gray-700 px-2 py-1 rounded-lg transition-all">{c?"✅":"📋"}</button>
}

function ContentBlock({ title, content, filename }: { title:string; content:string; filename:string }) {
  return (
    <div className="bg-[#0f0f1a] border border-white/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h4 className="font-bold text-sm text-white">{title}</h4>
        <div className="flex gap-2"><CopyBtn text={content} /><DlBtn label="Save" content={content} filename={filename} type="md" /></div>
      </div>
      <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap p-4 max-h-80 overflow-auto">{content}</pre>
    </div>
  )
}

export default function AssetFactoryPage() {
  const [keyword, setKeyword] = useState("")
  const [audience, setAudience] = useState("")
  const [outcome, setOutcome] = useState("")
  const [pricePoint, setPricePoint] = useState("$27")
  const [steps, setSteps] = useState<GenerationStep[]>(STEPS)
  const [generating, setGenerating] = useState(false)
  const [output, setOutput] = useState<ProductOutput|null>(null)
  const [error, setError] = useState("")
  const [tab, setTab] = useState("overview")

  const updateStep = (id:string, status:GenerationStep["status"]) => setSteps(p=>p.map(s=>s.id===id?{...s,status}:s))

  const handleGenerate = async () => {
    if (!keyword.trim()) { setError("Please enter a keyword."); return }
    setError(""); setOutput(null); setGenerating(true)
    setSteps(STEPS.map(s=>({...s,status:"pending"})))
    try {
      updateStep("s1","running")
      const res = await fetch("/api/asset-factory/generate-product", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ keyword, audience, outcome, pricePoint }),
      })
      if (!res.ok) { const d=await res.json(); throw new Error(d.error||"Failed") }
      const data = await res.json()
      const ids = ["s1","s2","s3","s4","s5","s6","s7","s8","s9","s10"]
      for (let i=0; i<ids.length; i++) {
        if (i>0) updateStep(ids[i-1],"done")
        updateStep(ids[i],"running")
        await new Promise(r=>setTimeout(r,400))
      }
      updateStep(ids[ids.length-1],"done")
      setOutput(data.output); setTab("overview")
    } catch(e:any) {
      setError(e.message||"Generation failed.")
      setSteps(p=>p.map(s=>s.status==="running"?{...s,status:"error"}:s))
    } finally { setGenerating(false) }
  }

  const progress = Math.round((steps.filter(s=>s.status==="done").length/steps.length)*100)
  const buildJson = () => output ? JSON.stringify({productTitle:output.productTitle,productPromise:output.productPromise,ebookTitle:output.ebookTitle,coverPrompt:output.coverPrompt,chapterOutline:output.chapterOutline,generatedAt:new Date().toISOString()},null,2) : ""

  const TABS = [
    {id:"overview",label:"📋 Overview"},
    {id:"ebook",label:"📚 Ebook"},
    {id:"cover",label:"🎨 Cover"},
    {id:"emails",label:"📧 Emails"},
    {id:"course",label:"🎬 Mini Course"},
    {id:"bonus",label:"🎁 Bonuses"},
    {id:"sales",label:"💰 Sales Page"},
    {id:"social",label:"📱 Social Pack"},
  ]

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-xl">🏭</div>
            <div><h1 className="text-xl font-black">AI Asset Factory™</h1><p className="text-gray-500 text-xs">One keyword → complete digital product package</p></div>
          </div>
          {output && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full font-semibold">✅ Product Ready</span>
              <button onClick={()=>{setOutput(null);setSteps(STEPS)}} className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-xl transition-all">✨ New Product</button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* FORM */}
        {!generating && !output && (
          <div className="max-w-2xl mx-auto">
            {/* Pipeline */}
            <div className="flex items-center justify-center gap-1.5 mb-10 flex-wrap text-xs text-gray-500">
              {["Keyword","Offer","Ebook","Cover","Emails","Mini-Course","Bonuses","Downloads"].map((s,i,arr)=>(
                <div key={s} className="flex items-center gap-1.5">
                  <span className="bg-purple-500/10 border border-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full">{s}</span>
                  {i<arr.length-1 && <span className="text-gray-700">→</span>}
                </div>
              ))}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-black mb-2">🚀 Create Your Complete Digital Product</h2>
              <p className="text-gray-500 text-sm mb-6">Generates ebook, cover image, email sequence, mini-course, sales page, social pack & more</p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Keyword / Niche *</label>
                  <input value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="e.g. Night Shift Nurse Reset — 7 Days to Supercharged Energy"
                    className="w-full bg-[#0f0f1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Target Audience</label>
                    <input value={audience} onChange={e=>setAudience(e.target.value)} placeholder="e.g. Night shift nurses"
                      className="w-full bg-[#0f0f1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Price Point</label>
                    <select value={pricePoint} onChange={e=>setPricePoint(e.target.value)} className="w-full bg-[#0f0f1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white outline-none text-sm">
                      {["$7","$17","$27","$37","$47","$97","$197","$297","$497","$997"].map(p=><option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Desired Outcome</label>
                  <input value={outcome} onChange={e=>setOutcome(e.target.value)} placeholder="e.g. Feel energized and clear-headed within 7 days"
                    className="w-full bg-[#0f0f1a] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm" />
                </div>
              </div>
              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
              <button onClick={handleGenerate} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black py-4 rounded-xl text-lg transition-all">
                🏭 Generate Complete Product Package →
              </button>
              <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                {["📚 Ebook","🎨 AI Cover","📧 5 Emails","🎬 Mini-Course","✅ Checklist","📱 Social Pack","💰 Sales Page","🎁 Bonus"].map(f=>(
                  <div key={f} className="bg-white/3 border border-white/5 rounded-lg py-2 text-xs text-gray-500">{f}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROGRESS */}
        {generating && (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4 animate-bounce">🏭</div>
              <h2 className="text-2xl font-black mb-1">Building Your Product Package...</h2>
              <p className="text-gray-500 text-sm">Generating 8+ assets — please wait ~90 seconds</p>
            </div>
            <div className="bg-white/5 rounded-full h-2 mb-6 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full transition-all duration-500" style={{width:`${progress}%`}} />
            </div>
            <div className="space-y-2">
              {steps.map(s=>(
                <div key={s.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${s.status==="running"?"bg-purple-500/10 border border-purple-500/30":s.status==="done"?"opacity-50 bg-white/3 border border-white/5":"opacity-20 bg-white/2 border border-white/5"}`}>
                  <span className="text-base">{s.status==="done"?"✅":s.status==="running"?"⚡":s.status==="error"?"❌":"⏳"}</span>
                  <span className={`text-sm font-medium ${s.status==="running"?"text-white":"text-gray-400"}`}>{s.label}</span>
                  {s.status==="running" && <div className="ml-auto flex gap-1">{[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OUTPUT */}
        {output && !generating && (
          <div>
            {/* Hero product card */}
            <div className="relative bg-gradient-to-r from-[#0a0a2e] via-[#1a1a6e] to-[#0d47a1] rounded-2xl p-8 mb-6 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,200,0,.1)_0%,transparent_60%)]" />
              <div className="relative flex items-start gap-8">
                {output.coverImageUrl && (
                  <img src={output.coverImageUrl} alt={output.ebookTitle} className="w-40 h-40 object-cover rounded-xl shadow-2xl flex-shrink-0 border-2 border-white/20" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-yellow-400 font-bold uppercase tracking-widest mb-2">✅ Complete Product Package Ready</div>
                  <h2 className="text-2xl font-black text-white mb-3 leading-tight">{output.productTitle}</h2>
                  <p className="text-blue-100 text-sm leading-relaxed mb-4">{output.productPromise}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-yellow-500/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/20">{pricePoint} Digital Product</span>
                    <span className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full">📚 {output.chapterOutline.length} Chapters</span>
                    <span className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full">📧 5 Emails</span>
                    <span className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full">🎬 Mini Course</span>
                    <span className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full">📱 Social Pack</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Downloads */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">📦 Download All Assets</p>
              <div className="flex flex-wrap gap-2">
                <DlBtn label="Ebook HTML" content={output.ebookHtml} filename="main-ebook.html" type="html" />
                <DlBtn label="Ebook MD" content={output.ebookDraft} filename="main-ebook.md" type="md" />
                <DlBtn label="Sales Page" content={output.salesPageCopy} filename="sales-page.md" type="md" />
                <DlBtn label="Email Sequence" content={output.emailSequence} filename="email-sequence.md" type="md" />
                <DlBtn label="Mini Course" content={output.miniCourse} filename="mini-course.md" type="md" />
                <DlBtn label="Checklist" content={output.checklistContent} filename="checklist.md" type="md" />
                <DlBtn label="Workbook" content={output.workbookContent} filename="workbook.md" type="md" />
                <DlBtn label="Social Pack" content={output.socialPromoPack} filename="social-pack.md" type="md" />
                <DlBtn label="Bonus" content={output.bonusContent} filename="bonus.md" type="md" />
                <DlBtn label="JSON Summary" content={buildJson()} filename="product.json" type="json" />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 scrollbar-hide">
              {TABS.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${tab===t.id?"bg-purple-600 text-white":"bg-white/5 text-gray-400 hover:text-white"}`}>{t.label}</button>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

              {/* OVERVIEW */}
              {tab==="overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#0f0f1a] border border-white/10 rounded-xl p-4"><div className="flex justify-between mb-2"><h4 className="font-bold text-sm">📚 Ebook Title</h4><CopyBtn text={output.ebookTitle} /></div><p className="text-gray-300 text-sm">{output.ebookTitle}</p></div>
                    <div className="bg-[#0f0f1a] border border-white/10 rounded-xl p-4"><div className="flex justify-between mb-2"><h4 className="font-bold text-sm">💎 Product Promise</h4><CopyBtn text={output.productPromise} /></div><p className="text-gray-300 text-sm">{output.productPromise}</p></div>
                  </div>
                  <div className="bg-[#0f0f1a] border border-white/10 rounded-xl p-4">
                    <h4 className="font-bold text-sm mb-3">📋 Chapter Outline</h4>
                    <ol className="space-y-2">{output.chapterOutline.map((ch,i)=><li key={i} className="flex gap-3 text-sm"><span className="text-purple-400 font-black w-6 flex-shrink-0">{i+1}.</span><span className="text-gray-300">{ch}</span></li>)}</ol>
                  </div>
                  {output.coverImageUrl && (
                    <div className="bg-[#0f0f1a] border border-white/10 rounded-xl p-4">
                      <h4 className="font-bold text-sm mb-3">🎨 AI-Generated Cover</h4>
                      <img src={output.coverImageUrl} alt="Cover" className="w-full max-w-sm rounded-xl shadow-xl" />
                    </div>
                  )}
                </div>
              )}

              {/* EBOOK */}
              {tab==="ebook" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black">{output.ebookTitle}</h3>
                    <div className="flex gap-2"><DlBtn label="HTML" content={output.ebookHtml} filename="main-ebook.html" type="html" /><DlBtn label="Markdown" content={output.ebookDraft} filename="main-ebook.md" type="md" /></div>
                  </div>
                  <div className="bg-white rounded-xl overflow-hidden shadow-xl" style={{height:"600px"}}>
                    <iframe srcDoc={output.ebookHtml} className="w-full h-full border-none" title="Ebook Preview" />
                  </div>
                </div>
              )}

              {/* COVER */}
              {tab==="cover" && (
                <div>
                  <h3 className="font-black mb-4">🎨 AI Cover Image</h3>
                  {output.coverImageUrl ? (
                    <div className="flex gap-6 items-start">
                      <img src={output.coverImageUrl} alt="Cover" className="w-64 rounded-xl shadow-2xl flex-shrink-0" />
                      <div>
                        <p className="text-green-400 text-sm font-semibold mb-3">✅ Cover generated with DALL-E 3</p>
                        <p className="text-gray-400 text-sm mb-4">Right-click the image to save it.</p>
                        <div className="bg-[#0f0f1a] border border-white/10 rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Regenerate with this prompt:</p>
                          <p className="text-gray-300 text-sm">{output.coverPrompt}</p>
                          <CopyBtn text={output.coverPrompt} />
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-4">
                          {[{n:"Midjourney",u:"https://midjourney.com"},{n:"DALL-E",u:"https://openai.com/dall-e-3"},{n:"Leonardo",u:"https://leonardo.ai"}].map(t=>(
                            <a key={t.n} href={t.u} target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 hover:border-white/20 rounded-xl p-3 text-center transition-all text-xs text-gray-400 hover:text-white">{t.n} →</a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#0f0f1a] border border-white/10 rounded-xl p-6">
                      <p className="text-amber-400 text-sm mb-3">⚠️ Cover image generation requires OPENAI_API_KEY in Vercel environment variables.</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Use this prompt to generate manually:</p>
                      <p className="text-gray-300 text-sm mb-3">{output.coverPrompt}</p>
                      <CopyBtn text={output.coverPrompt} />
                    </div>
                  )}
                </div>
              )}

              {/* EMAILS */}
              {tab==="emails" && <ContentBlock title="📧 5-Email Nurture Sequence" content={output.emailSequence} filename="email-sequence.md" />}

              {/* MINI COURSE */}
              {tab==="course" && <ContentBlock title="🎬 Mini-Course + Video Scripts" content={output.miniCourse} filename="mini-course.md" />}

              {/* BONUS */}
              {tab==="bonus" && (
                <div className="space-y-4">
                  <ContentBlock title={`🎁 ${output.bonusTitle}`} content={output.bonusContent} filename="bonus.md" />
                  <ContentBlock title="✅ Checklist" content={output.checklistContent} filename="checklist.md" />
                  <ContentBlock title="📓 Workbook" content={output.workbookContent} filename="workbook.md" />
                </div>
              )}

              {/* SALES */}
              {tab==="sales" && <ContentBlock title="💰 Sales Page Copy" content={output.salesPageCopy} filename="sales-page.md" />}

              {/* SOCIAL */}
              {tab==="social" && <ContentBlock title="📱 Social Media Pack" content={output.socialPromoPack} filename="social-pack.md" />}

            </div>
          </div>
        )}
      </div>
    </div>
  )
}
