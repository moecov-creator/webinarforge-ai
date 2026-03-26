'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

// Types inferred from the prisma include in page.tsx
type Section = {
  id: string
  title: string
  content: string | null
  position: number
}

type Webinar = {
  id: string
  title: string
  script?: string | null
  sections: Section[]
  ctaSequences: { id: string; triggerTime: number }[]
  timedComments: { id: string; timestamp: number }[]
  offers: { id: string }[]
  bonuses: { id: string }[]
  objections: { id: string }[]
}

export default function WebinarEditorClient({ webinar }: { webinar: Webinar }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Use existing script content if available, otherwise empty
  const [script, setScript] = useState<string>(webinar.script ?? '')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const wordCount = script.trim() ? script.trim().split(/\s+/).length : 0
  const estimatedMinutes = Math.ceil(wordCount / 130)

  async function handleSave() {
    setSaving(true)
    try {
      await fetch(`/api/webinars/${webinar.id}/script`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
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

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#0d0f0e] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-10 py-5 border-b border-white/5">
        <h1 className="text-2xl font-semibold tracking-tight">Webinar Script Editor</h1>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-green-400 text-sm font-medium animate-pulse">
              ✓ Saved
            </span>
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
      <div className="flex flex-1 overflow-hidden px-10 py-6 gap-6">
        {/* Editor */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Stats bar */}
          {script.length > 0 && (
            <div className="flex items-center gap-4 text-xs text-white/30 font-mono">
              <span>{wordCount} words</span>
              <span>·</span>
              <span>~{estimatedMinutes} min read</span>
              <span>·</span>
              <span>{script.split('\n').length} lines</span>
            </div>
          )}

          {/* Textarea or empty state */}
          {script === '' ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-5 border border-white/8 rounded-xl bg-white/[0.02] text-white/40">
              <div className="text-4xl">✦</div>
              <p className="text-sm">No script found. Generate one first.</p>
              <button
                onClick={() =>
                  setScript(
                    `# ${webinar.title}\n\n## Introduction\n\nWelcome everyone...\n\n## Main Content\n\nToday we'll cover...\n\n## Call to Action\n\nHere's how to get started...\n`
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

        {/* Right panel — webinar info */}
        <div className="w-56 flex flex-col gap-4 shrink-0">
          <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4 flex flex-col gap-3">
            <p className="text-xs text-white/30 uppercase tracking-widest font-medium">Webinar</p>
            <p className="text-sm text-white/80 font-medium leading-snug">{webinar.title}</p>
          </div>

          <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4 flex flex-col gap-3">
            <p className="text-xs text-white/30 uppercase tracking-widest font-medium">Assets</p>
            <div className="flex flex-col gap-2 text-xs text-white/50">
              <div className="flex justify-between">
                <span>Sections</span>
                <span className="text-white/70 font-mono">{webinar.sections.length}</span>
              </div>
              <div className="flex justify-between">
                <span>CTAs</span>
                <span className="text-white/70 font-mono">{webinar.ctaSequences.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Comments</span>
                <span className="text-white/70 font-mono">{webinar.timedComments.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Offers</span>
                <span className="text-white/70 font-mono">{webinar.offers.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Objections</span>
                <span className="text-white/70 font-mono">{webinar.objections.length}</span>
              </div>
            </div>
          </div>

          {webinar.sections.length > 0 && (
            <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4 flex flex-col gap-3">
              <p className="text-xs text-white/30 uppercase tracking-widest font-medium">Sections</p>
              <div className="flex flex-col gap-2">
                {webinar.sections.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2 text-xs text-white/50">
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: ['#3ddc84','#60a5fa','#f59e0b','#f472b6','#a78bfa'][i % 5] }}
                    />
                    <span className="truncate">{s.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
