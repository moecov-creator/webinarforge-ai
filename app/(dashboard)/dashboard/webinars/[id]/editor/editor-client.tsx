'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type Webinar = {
  id: string
  title: string
  scriptHook?: string | null
  scriptPromise?: string | null
  scriptProblem?: string | null
  scriptOrigin?: string | null
  scriptTeaching1?: string | null
  scriptTeaching2?: string | null
  scriptTransition?: string | null
  scriptCTA?: string | null
  sections: { id: string; title: string; position: number }[]
  ctaSequences: { id: string; triggerTime: number }[]
  timedComments: { id: string; timestamp: number }[]
  offers: { id: string }[]
  bonuses: { id: string }[]
  objections: { id: string }[]
}

const SECTIONS = [
  { key: 'hook',       label: 'Hook',         color: '#3ddc84', placeholder: 'Open with a bold statement or question that grabs attention...' },
  { key: 'promise',    label: 'Promise',      color: '#60a5fa', placeholder: 'Tell viewers exactly what they will learn or gain today...' },
  { key: 'problem',    label: 'Problem',      color: '#f59e0b', placeholder: 'Describe the core pain point your audience is experiencing...' },
  { key: 'origin',     label: 'Origin Story', color: '#f472b6', placeholder: 'Share how you discovered the solution to this problem...' },
  { key: 'teaching1',  label: 'Teaching 1',   color: '#a78bfa', placeholder: 'First key teaching point or framework...' },
  { key: 'teaching2',  label: 'Teaching 2',   color: '#34d399', placeholder: 'Second key teaching point or framework...' },
  { key: 'transition', label: 'Transition',   color: '#fb923c', placeholder: 'Bridge from teaching into your offer naturally...' },
  { key: 'cta',        label: 'Call to Action', color: '#e879f9', placeholder: 'Clear, compelling call to action with urgency...' },
] as const

type ScriptKey = typeof SECTIONS[number]['key']
type ScriptFields = Record<ScriptKey, string>

export default function WebinarEditorClient({ webinar }: { webinar: Webinar }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeSection, setActiveSection] = useState<ScriptKey>('hook')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [fields, setFields] = useState<ScriptFields>({
    hook:       webinar.scriptHook       ?? '',
    promise:    webinar.scriptPromise    ?? '',
    problem:    webinar.scriptProblem    ?? '',
    origin:     webinar.scriptOrigin     ?? '',
    teaching1:  webinar.scriptTeaching1  ?? '',
    teaching2:  webinar.scriptTeaching2  ?? '',
    transition: webinar.scriptTransition ?? '',
    cta:        webinar.scriptCTA        ?? '',
  })

  const totalWords = Object.values(fields).join(' ').trim().split(/\s+/).filter(Boolean).length
  const estimatedMinutes = Math.ceil(totalWords / 130)
  const filledSections = SECTIONS.filter(s => fields[s.key].trim().length > 0).length

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/webinars/${webinar.id}/script`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hook:       fields.hook,
          promise:    fields.promise,
          problem:    fields.problem,
          origin:     fields.origin,
          teaching1:  fields.teaching1,
          teaching2:  fields.teaching2,
          transition: fields.transition,
          cta:        fields.cta,
        }),
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

  const activeConfig = SECTIONS.find(s => s.key === activeSection)!

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

        {/* Section nav */}
        <div className="w-52 shrink-0 border-r border-white/5 flex flex-col py-4 gap-1 px-3">
          <p className="text-xs text-white/25 uppercase tracking-widest font-medium px-2 mb-2">
            Script Sections
          </p>
          {SECTIONS.map(s => {
            const filled = fields[s.key].trim().length > 0
            const isActive = activeSection === s.key
            return (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all ${
                  isActive
                    ? 'bg-white/8 text-white'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/4'
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: filled ? s.color : 'rgba(255,255,255,0.15)' }}
                />
                <span>{s.label}</span>
                {filled && (
                  <span className="ml-auto text-[10px] text-white/20 font-mono">
                    {fields[s.key].trim().split(/\s+/).length}w
                  </span>
                )}
              </button>
            )
          })}

          {/* Stats */}
          <div className="mt-auto pt-4 border-t border-white/5 px-2 flex flex-col gap-2">
            <div className="flex justify-between text-xs text-white/25">
              <span>Total words</span>
              <span className="font-mono text-white/40">{totalWords}</span>
            </div>
            <div className="flex justify-between text-xs text-white/25">
              <span>Est. duration</span>
              <span className="font-mono text-white/40">{estimatedMinutes} min</span>
            </div>
            <div className="flex justify-between text-xs text-white/25">
              <span>Sections done</span>
              <span className="font-mono text-white/40">{filledSections}/{SECTIONS.length}</span>
            </div>
          </div>
        </div>

        {/* Editor pane */}
        <div className="flex-1 flex flex-col p-8 gap-4">
          {/* Section header */}
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: activeConfig.color }}
            />
            <h2 className="text-lg font-semibold">{activeConfig.label}</h2>
            <span className="text-xs text-white/25 font-mono ml-auto">
              {fields[activeSection].trim()
                ? `${fields[activeSection].trim().split(/\s+/).length} words`
                : 'Empty'}
            </span>
          </div>

          {/* Textarea */}
          <textarea
            key={activeSection}
            className="flex-1 bg-white/[0.03] border border-white/8 rounded-xl p-6 text-sm font-mono text-white/80 resize-none outline-none transition-colors leading-relaxed"
            value={fields[activeSection]}
            onChange={e => {
              setFields(prev => ({ ...prev, [activeSection]: e.target.value }))
              setSaved(false)
            }}
            placeholder={activeConfig.placeholder}
            spellCheck
            onFocus={e => { e.target.style.borderColor = activeConfig.color + '40' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
          />

          {/* Prev / Next navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                const idx = SECTIONS.findIndex(s => s.key === activeSection)
                if (idx > 0) setActiveSection(SECTIONS[idx - 1].key)
              }}
              disabled={activeSection === SECTIONS[0].key}
              className="text-sm text-white/30 hover:text-white/60 disabled:opacity-20 transition-all"
            >
              ← Previous
            </button>
            <div className="flex gap-1.5">
              {SECTIONS.map(s => (
                <div
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  className="w-1.5 h-1.5 rounded-full cursor-pointer transition-all"
                  style={{
                    background: activeSection === s.key
                      ? activeConfig.color
                      : fields[s.key].trim()
                      ? 'rgba(255,255,255,0.3)'
                      : 'rgba(255,255,255,0.1)'
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => {
                const idx = SECTIONS.findIndex(s => s.key === activeSection)
                if (idx < SECTIONS.length - 1) setActiveSection(SECTIONS[idx + 1].key)
              }}
              disabled={activeSection === SECTIONS[SECTIONS.length - 1].key}
              className="text-sm text-white/30 hover:text-white/60 disabled:opacity-20 transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
