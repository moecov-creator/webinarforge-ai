// app/(dashboard)/dashboard/webinars/[id]/editor/editor-client.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";

const SECTION_COLORS: Record<string, string> = {
  hook: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  promise: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  credibility: "text-green-400 bg-green-400/10 border-green-400/20",
  belief_shift: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  teaching: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  offer_transition: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  stack: "text-pink-400 bg-pink-400/10 border-pink-400/20",
  bonus: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  urgency: "text-red-400 bg-red-400/10 border-red-400/20",
  cta: "text-white bg-white/10 border-white/20",
  faq: "text-slate-400 bg-slate-400/10 border-slate-400/20",
};

interface Section {
  id: string;
  type: string;
  title: string;
  content: string;
  position: number;
}

interface WebinarEditorClientProps {
  webinar: {
    id: string;
    title: string;
    status: string;
    niche: string;
    sections: Section[];
  };
}

export default function WebinarEditorClient({ webinar }: WebinarEditorClientProps) {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>(webinar.sections);
  const [expandedId, setExpandedId] = useState<string | null>(
    webinar.sections[0]?.id ?? null
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateSection(id: string, content: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content } : s))
    );
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/webinars/${webinar.id}/sections`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-white/40 mb-4">No script sections found.</p>
          <button
            onClick={() => router.push(`/dashboard/webinars/${webinar.id}`)}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            ← Back to webinar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/dashboard/webinars/${webinar.id}`)}
            className="text-white/40 hover:text-white transition-colors p-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-white truncate max-w-lg">
              {webinar.title}
            </h1>
            <p className="text-sm text-white/40 mt-0.5">Script Editor — {sections.length} sections</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saved ? (
            <><CheckCircle className="w-4 h-4" /> Saved</>
          ) : saving ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
          ) : (
            <><Save className="w-4 h-4" /> Save changes</>
          )}
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 mb-8">
        {sections.map((s, i) => (
          <div
            key={s.id}
            className="h-1 flex-1 rounded-full cursor-pointer transition-all"
            style={{
              background: expandedId === s.id
                ? "linear-gradient(90deg, #7c3aed, #4f46e5)"
                : "rgba(255,255,255,0.08)",
            }}
            onClick={() => setExpandedId(s.id)}
            title={s.title}
          />
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section, index) => {
          const colorClass = SECTION_COLORS[section.type] ?? "text-white/60 bg-white/5 border-white/10";
          const isExpanded = expandedId === section.id;

          return (
            <div
              key={section.id}
              className="rounded-xl border border-white/8 bg-white/[0.03] overflow-hidden transition-all"
            >
              {/* Section header */}
              <button
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : section.id)}
              >
                <span className="text-xs text-white/25 w-5 text-center font-mono flex-shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${colorClass}`}>
                  {section.type.replace("_", " ")}
                </span>
                <span className="text-sm text-white font-medium flex-1 truncate">{section.title}</span>
                <span className="text-xs text-white/25 mr-2 hidden sm:block">
                  {section.content.length} chars
                </span>
                {isExpanded
                  ? <ChevronUp className="w-4 h-4 text-white/30 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0" />}
              </button>

              {/* Expandable editor */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-white/5">
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, e.target.value)}
                    rows={6}
                    className="w-full mt-3 px-4 py-3 rounded-lg bg-white/[0.04] border border-white/8 text-white/80 text-sm leading-relaxed resize-y focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all font-sans placeholder:text-white/20"
                    placeholder="Write this section's content..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-white/20">{section.content.length} characters</span>
                    <span className="text-xs text-white/20">
                      ~{Math.ceil(section.content.split(" ").length / 130)} min read aloud
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom save bar */}
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
        <p className="text-xs text-white/25">
          {sections.reduce((acc, s) => acc + s.content.split(" ").length, 0).toLocaleString()} total words ·{" "}
          ~{Math.ceil(sections.reduce((acc, s) => acc + s.content.split(" ").length, 0) / 130)} min webinar
        </p>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save changes</>}
        </button>
      </div>
    </div>
  );
}
