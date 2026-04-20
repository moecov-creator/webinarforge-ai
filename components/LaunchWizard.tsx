"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type {
  WebinarGoal,
  FunnelType,
  FollowUpPreference,
  ToneStyle,
  LaunchSummary,
} from "@/lib/orchestrator/types"

// ─── Step config ──────────────────────────────────────────────────────────────
const TOTAL_STEPS = 5

const WEBINAR_GOALS: { id: WebinarGoal; label: string; icon: string; desc: string }[] = [
  { id: "book_calls", label: "Book Strategy Calls", icon: "📞", desc: "Fill your calendar with qualified prospects" },
  { id: "sell_product", label: "Sell a Product", icon: "💰", desc: "Close direct sales from the webinar" },
  { id: "generate_leads", label: "Generate Leads", icon: "🎯", desc: "Build your list of qualified prospects" },
  { id: "build_list", label: "Build My List", icon: "📧", desc: "Grow an engaged email audience" },
  { id: "promote_event", label: "Promote an Event", icon: "🎟", desc: "Drive registrations to a live event" },
]

const TONE_STYLES: { id: ToneStyle; label: string; desc: string }[] = [
  { id: "professional", label: "Professional", desc: "Authoritative and credible" },
  { id: "conversational", label: "Conversational", desc: "Friendly and relatable" },
  { id: "energetic", label: "Energetic", desc: "High-energy and motivating" },
  { id: "educational", label: "Educational", desc: "Teach-first, sell second" },
  { id: "storytelling", label: "Storytelling", desc: "Narrative-driven and emotional" },
]

const FOLLOW_UP_OPTIONS: { id: FollowUpPreference; label: string; desc: string; badge?: string }[] = [
  { id: "email_only", label: "Email Only", desc: "Standard email follow-up sequence" },
  { id: "email_sms", label: "Email + SMS", desc: "Email + text message reminders", badge: "Better show-up" },
  { id: "basic_automation", label: "Basic Automation", desc: "Triggered sequences based on behavior" },
  { id: "advanced_automation", label: "Advanced Automation", desc: "Full multi-channel behavioral automation", badge: "Highest converting" },
]

// ─── Field state ──────────────────────────────────────────────────────────────
type FormState = {
  offerDescription: string
  offerPrice: string
  targetAudience: string
  biggestPainPoint: string
  desiredTransformation: string
  webinarGoal: WebinarGoal | ""
  toneStyle: ToneStyle | ""
  funnelType: FunnelType | ""
  followUpPreference: FollowUpPreference | ""
}

const initialForm: FormState = {
  offerDescription: "",
  offerPrice: "",
  targetAudience: "",
  biggestPainPoint: "",
  desiredTransformation: "",
  webinarGoal: "",
  toneStyle: "",
  funnelType: "",
  followUpPreference: "",
}

// ─── Shared input styles ──────────────────────────────────────────────────────
const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition text-sm"
const labelCls = "block text-sm text-gray-400 mb-1.5 font-medium"

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            i + 1 < step ? "bg-purple-600 text-white" :
            i + 1 === step ? "bg-purple-500 text-white ring-2 ring-purple-400/40" :
            "bg-white/10 text-gray-500"
          }`}>
            {i + 1 < step ? "✓" : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`w-8 h-0.5 transition-all ${i + 1 < step ? "bg-purple-600" : "bg-white/10"}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Option card ──────────────────────────────────────────────────────────────
function OptionCard({
  selected, onClick, icon, label, desc, badge,
}: {
  selected: boolean; onClick: () => void;
  icon?: string; label: string; desc?: string; badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        selected
          ? "border-purple-500 bg-purple-500/10"
          : "border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-white/8"
      }`}
    >
      <div className="flex items-start gap-3">
        {icon && <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>}
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-white">{label}</span>
            {badge && (
              <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          {desc && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>}
        </div>
        {selected && (
          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white fill-none stroke-white" strokeWidth="3" viewBox="0 0 12 12">
              <polyline points="1.5,6 4.5,9 10.5,3" />
            </svg>
          </div>
        )}
      </div>
    </button>
  )
}

// ─── Generating screen ────────────────────────────────────────────────────────
function GeneratingScreen({ step: gStep }: { step: string }) {
  const steps = [
    "Analyzing your offer and audience...",
    "Crafting your webinar title and hook...",
    "Building your core webinar outline...",
    "Writing your full webinar script...",
    "Creating your funnel structure...",
    "Writing landing page and email copy...",
    "Assigning your AI presenter...",
    "Configuring follow-up automation...",
    "Initializing performance tracking...",
    "Finalizing your launch package...",
  ]

  return (
    <div className="text-center py-12 px-6">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
        <svg className="w-8 h-8 text-purple-400 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Building Your Funnel...</h2>
      <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
        Our AI is analyzing top-converting funnels in your niche and generating your complete launch package.
      </p>
      <div className="max-w-sm mx-auto space-y-2">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 text-sm transition-all ${s === gStep ? "text-purple-400" : i < steps.indexOf(gStep) ? "text-green-400" : "text-gray-700"}`}>
            <span className="w-4 h-4 flex-shrink-0">
              {s === gStep ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              ) : i < steps.indexOf(gStep) ? "✓" : "·"}
            </span>
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LaunchWizard({ onComplete }: { onComplete?: (summary: LaunchSummary) => void }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(initialForm)
  const [generating, setGenerating] = useState(false)
  const [generatingStep, setGeneratingStep] = useState("")
  const [error, setError] = useState("")

  const set = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const canNext = () => {
    if (step === 1) return form.offerDescription && form.offerPrice && form.targetAudience
    if (step === 2) return form.biggestPainPoint && form.desiredTransformation
    if (step === 3) return form.webinarGoal
    if (step === 4) return form.toneStyle && form.funnelType
    if (step === 5) return form.followUpPreference
    return false
  }

  const handleGenerate = async () => {
    setGenerating(true)
    setError("")

    const genSteps = [
      "Analyzing your offer and audience...",
      "Crafting your webinar title and hook...",
      "Building your core webinar outline...",
      "Writing your full webinar script...",
      "Creating your funnel structure...",
      "Writing landing page and email copy...",
      "Assigning your AI presenter...",
      "Configuring follow-up automation...",
      "Initializing performance tracking...",
      "Finalizing your launch package...",
    ]

    // Animate through steps for UX
    for (const s of genSteps) {
      setGeneratingStep(s)
      await new Promise((r) => setTimeout(r, 700))
    }

    try {
      const res = await fetch("/api/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data: LaunchSummary = await res.json()

      if (!res.ok) throw new Error(data as any)

      if (onComplete) {
        onComplete(data)
      } else {
        router.push(`/dashboard/launch/${data.id}`)
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
      setGenerating(false)
    }
  }

  if (generating) return <GeneratingScreen step={generatingStep} />

  return (
    <div className="max-w-2xl mx-auto">
      <StepIndicator step={step} total={TOTAL_STEPS} />

      {/* ── Step 1: Your Offer ────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Tell us about your offer</h2>
            <p className="text-gray-400 text-sm">The more specific you are, the better your funnel will convert.</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>What are you selling? *</label>
              <input value={form.offerDescription} onChange={(e) => set("offerDescription", e.target.value)}
                placeholder="e.g. 90-day coaching program for business owners, $497 SaaS tool for agencies..."
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Offer price *</label>
              <input value={form.offerPrice} onChange={(e) => set("offerPrice", e.target.value)}
                placeholder="e.g. $997, $97/month, Free + upsell..."
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Who is your target audience? *</label>
              <input value={form.targetAudience} onChange={(e) => set("targetAudience", e.target.value)}
                placeholder="e.g. Coaches with 0-3 clients, SaaS founders doing $10k MRR..."
                className={inputCls} />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Pain & Transformation ────────────────────────────────── */}
      {step === 2 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Pain and transformation</h2>
            <p className="text-gray-400 text-sm">This powers your hook, script, and all conversion copy.</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>What is your audience's biggest pain point? *</label>
              <textarea value={form.biggestPainPoint} onChange={(e) => set("biggestPainPoint", e.target.value)}
                placeholder="e.g. Spending hours on lead gen with no consistent results, can't scale past $10k/month..."
                className={`${inputCls} resize-none`} rows={3} />
            </div>
            <div>
              <label className={labelCls}>What transformation do they desire? *</label>
              <textarea value={form.desiredTransformation} onChange={(e) => set("desiredTransformation", e.target.value)}
                placeholder="e.g. Have a predictable $30k/month business working 4 hours/day..."
                className={`${inputCls} resize-none`} rows={3} />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Webinar Goal ──────────────────────────────────────────── */}
      {step === 3 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">What's your webinar goal?</h2>
            <p className="text-gray-400 text-sm">This shapes your entire funnel structure and CTA strategy.</p>
          </div>
          <div className="space-y-3">
            {WEBINAR_GOALS.map((g) => (
              <OptionCard key={g.id} selected={form.webinarGoal === g.id}
                onClick={() => set("webinarGoal", g.id)}
                icon={g.icon} label={g.label} desc={g.desc} />
            ))}
          </div>
        </div>
      )}

      {/* ── Step 4: Style & Funnel Type ───────────────────────────────────── */}
      {step === 4 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Tone and funnel type</h2>
            <p className="text-gray-400 text-sm">Choose how you want to come across and how your webinar runs.</p>
          </div>
          <div className="mb-6">
            <label className={labelCls}>Presentation tone / style *</label>
            <div className="grid grid-cols-2 gap-2">
              {TONE_STYLES.map((t) => (
                <OptionCard key={t.id} selected={form.toneStyle === t.id}
                  onClick={() => set("toneStyle", t.id)}
                  label={t.label} desc={t.desc} />
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Funnel type *</label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { id: "evergreen", label: "Evergreen", icon: "🔄", desc: "Runs 24/7 on autopilot. Perfect for passive lead gen." },
                { id: "live", label: "Live Event", icon: "🔴", desc: "Scheduled date and time. Higher show-up and urgency." },
              ] as { id: FunnelType; label: string; icon: string; desc: string }[]).map((f) => (
                <OptionCard key={f.id} selected={form.funnelType === f.id}
                  onClick={() => set("funnelType", f.id)}
                  icon={f.icon} label={f.label} desc={f.desc} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 5: Follow-up ─────────────────────────────────────────────── */}
      {step === 5 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Follow-up preference</h2>
            <p className="text-gray-400 text-sm">More follow-up = more revenue. Choose what fits your plan.</p>
          </div>
          <div className="space-y-3">
            {FOLLOW_UP_OPTIONS.map((f) => (
              <OptionCard key={f.id} selected={form.followUpPreference === f.id}
                onClick={() => set("followUpPreference", f.id)}
                label={f.label} desc={f.desc} badge={f.badge} />
            ))}
          </div>

          {/* Summary preview */}
          <div className="mt-6 bg-black/30 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Your launch summary</p>
            <div className="space-y-2">
              {[
                ["Offer", form.offerDescription],
                ["Price", form.offerPrice],
                ["Audience", form.targetAudience],
                ["Goal", WEBINAR_GOALS.find(g => g.id === form.webinarGoal)?.label],
                ["Tone", TONE_STYLES.find(t => t.id === form.toneStyle)?.label],
                ["Type", form.funnelType === "evergreen" ? "Evergreen (24/7)" : "Live Event"],
              ].map(([label, value]) => value ? (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-white font-medium truncate ml-4 max-w-[60%] text-right">{value}</span>
                </div>
              ) : null)}
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 mt-6">
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)}
            className="flex-1 border border-white/20 hover:border-white/40 py-3.5 rounded-xl font-semibold text-sm transition">
            ← Back
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
            className="flex-[2] bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed text-sm">
            Continue →
          </button>
        ) : (
          <button onClick={handleGenerate} disabled={!canNext()}
            className="flex-[2] bg-amber-500 hover:bg-amber-400 text-black font-black py-3.5 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed text-sm">
            🚀 Generate My Funnel →
          </button>
        )}
      </div>
    </div>
  )
}
