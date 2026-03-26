'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type Section = {
  id: string
  title: string
  content: string
  order: number
  type: string
}

type Webinar = {
  id: string
  title: string
  script?: string | null
  sections: Section[]
  ctaSequences?: { id: string; triggerTime: number }[]
  timedComments?: { id: string; timestamp: number }[]
  offers?: { id: string }[]
  bonuses?: { id: string }[]
  objections?: { id: string }[]
}

const SECTION_COLORS: Record<string, string> = {
  hook: '#3ddc84',
  promise: '#60a5fa',
  belief_shift: '#f59e0b',
  credibility: '#f472b6',
  teaching: '#a78bfa',
  offer_transition: '#fb923c',
  cta: '#e879f9',
}

export default function WebinarEditorClient({ webinar }: { webinar: Webinar }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [script, setScript] = useState(webinar.script ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(
    webinar.sections?.[0]?.id ?? null
  )

  const wordCount = script.trim() ? script.trim().split(/\s+/).length : 0
  const estimatedMinutes = Math.ceil(wordCount / 130)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/webinars/${webinar.id}/script`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      console.error('Failed to save script', err)
    } finally {
      setSaving(false)
    }
  }

  function handleBack() {
    startTransition(() => {
      router.push(`/dashboard/webinars/${webinar.id}`)
    })
  }

  const hasSections = webinar.sections && webinar.sections.length > 0

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#0d0f0e] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-10 py-5 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Webinar Script Editor</h1>
          <p className="text-xs text-white/30 mt-0.5">{webinar.title}</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-green-400 text-sm font-medium">✓ Saved</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-500 hover:bg-green-400 disabled:opacity-60 text-black font-semibold px-5 py-2 rounded-lg transition-all text-sm"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={handleBack}
            disabled={isPending}
            className="border border-white/15 hover:bg-white/5 text-white/70 hover:text-white px-4 py-2 rounded-lg transition-all text-sm"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: section nav (only if sections exist) */}
        {hasSections && (
          <div className="w-52 shrink-0 border-r border-white/5 flex flex-col py-4 gap-1 px-3">
            <p className="text-xs text-white/25 uppercase tracking-widest font-medium px-2 mb-2">
              Sections
            </p>
            {webinar.sections.map((s) => {
              const color = SECTION_COLORS[s.type] ?? '#ffffff'
              const isActive = activeSection === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all ${
                    isActive
                      ? 'bg-white/8 text-white'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/4'
                  }`}
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: color }}
                  />
                  <span className="truncate">{s.title}</span>
                </button>
              )
            })}

            {/* Stats */}
            <div className="mt-auto pt-4 border-t border-white/5 px-2 flex flex-col gap-2">
              <div className="flex justify-between text-xs text-white/25">
                <span>Words</span>
                <span className="font-mono text-white/40">{wordCount}</span>
              </div>
              <div className="flex justify-between text-xs text-white/25">
                <span>Est. duration</span>
                <span className="font-mono text-white/40">{estimatedMinutes} min</span>
              </div>
              <div className="flex justify-between text-xs text-white/25">
                <span>Sections</span>
                <span className="font-mono text-white/40">{webinar.sections.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Editor pane */}
        <div className="flex-1 flex flex-col p-8 gap-4">
          {/* Stats bar (shown when no sidebar) */}
          {!hasSections && script.length > 0 && (
            <div className="flex items-center gap-4 text-xs text-white/30 font-mono">
              <span>{wordCount} words</span>
              <span>·</span>
              <span>~{estimatedMinutes} min</span>
              <span>·</span>
              <span>{script.split('\n').length} lines</span>
            </div>
          )}

          {script === '' ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-5 border border-white/8 rounded-xl bg-white/[0.02] text-white/40">
              <div className="text-4xl">✦</div>
              <p className="text-sm">No script found. Generate one first.</p>
              <button
                onClick={() =>
                  setScript(
                    `### 1. Hook\n\n\n\n### 2. Big Promise\n\n\n\n### 3. Problem Agitation\n\n\n\n### 4. Origin Story\n\n\n\n### 5. Belief Shift\n\n\n\n### 6. Teaching\n\n\n\n### 7. CTA\n\n`
                  )
                }
                className="border border-white/15 hover:bg-white/5 text-white/60 hover:text-white px-4 py-2 rounded-lg transition-all text-sm"
              >
                + Start from scratch
              </button>
            </div>
          ) : (
            <textarea
              className="flex-1 bg-white/[0.03] border border-white/8 rounded-xl p-6 text-sm font-mono text-white/80 resize-none outline-none focus:border-green-500/40 transition-colors leading-relaxed"
              value={script}
              onChange={(e) => {
                setScript(e.target.value)
                setSaved(false)
              }}
              placeholder="Start writing your script…"
              spellCheck
            />
          )}
        </div>
      </div>
    </div>
  )
}
