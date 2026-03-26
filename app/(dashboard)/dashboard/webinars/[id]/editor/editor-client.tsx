"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function parseScript(script: string) {
  const sections: Record<string, string> = {
    hook: "",
    promise: "",
    problem: "",
    story: "",
    teaching: "",
    cta: "",
  };

  const split = script.split("###");

  split.forEach((section) => {
    const lower = section.toLowerCase();

    if (lower.includes("hook")) sections.hook = `###${section}`.trim();
    else if (lower.includes("promise")) sections.promise = `###${section}`.trim();
    else if (lower.includes("problem")) sections.problem = `###${section}`.trim();
    else if (lower.includes("story") || lower.includes("origin")) {
      sections.story = `###${section}`.trim();
    } else if (lower.includes("teaching") || lower.includes("belief")) {
      sections.teaching = `${sections.teaching}\n\n###${section}`.trim();
    } else if (lower.includes("cta") || lower.includes("call to action")) {
      sections.cta = `###${section}`.trim();
    }
  });

  return sections;
}

export default function WebinarEditor() {
  const params = useParams();
  const id = String(params.id);

  const [sections, setSections] = useState<Record<string, string>>({});
  const [script, setScript] = useState("");
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceId, setVoiceId] = useState("");
  const [videoNote, setVideoNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScript() {
      try {
        // Try loading from DB first
        const res = await fetch(`/api/webinars/${id}`);
        if (res.ok) {
          const data = await res.json();
          const dbScript = data?.webinar?.script;
          if (dbScript) {
            setScript(dbScript);
            setSections(parseScript(dbScript));
            setLoading(false);
            return;
          }
        }
      } catch {
        // silently fall through to localStorage
      }

      // Fall back to localStorage
      const saved = localStorage.getItem(`webinar-script:${id}`);
      const savedAudio = localStorage.getItem(`webinar-audio:${id}`);
      const savedVoiceId = localStorage.getItem(`webinar-voiceId:${id}`);

      if (saved) {
        setScript(saved);
        setSections(parseScript(saved));
      }
      if (savedAudio) setAudioUrl(savedAudio);
      if (savedVoiceId) setVoiceId(savedVoiceId);

      setLoading(false);
    }

    loadScript();
  }, [id]);

  const handleChange = (key: string, value: string) => {
    const updated = { ...sections, [key]: value };
    setSections(updated);
    const rebuilt = Object.values(updated).filter(Boolean).join("\n\n");
    setScript(rebuilt);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      // Save to DB
      await fetch(`/api/webinars/${id}/script`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script }),
      });
      // Also keep localStorage in sync
      localStorage.setItem(`webinar-script:${id}`, script);
      localStorage.setItem(`webinar-voiceId:${id}`, voiceId);
      if (audioUrl) localStorage.setItem(`webinar-audio:${id}`, audioUrl);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async (key: string) => {
    try {
      setRegenerating(key);

      const title = localStorage.getItem(`webinar-title:${id}`) || "Untitled Webinar";
      const niche = localStorage.getItem(`webinar-niche:${id}`) || "General Audience";
      const corePromise = localStorage.getItem(`webinar-corePromise:${id}`) || "Help the audience get a better result";
      const cta = localStorage.getItem(`webinar-cta:${id}`) || "Book a call";

      const res = await fetch("/api/webinars/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          niche,
          corePromise,
          cta,
          section: key,
          currentText: sections[key] || "",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to regenerate section");
      handleChange(key, data.content || "");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to regenerate");
    } finally {
      setRegenerating(null);
    }
  };

  const handleGenerateVoice = async () => {
    try {
      setVoiceLoading(true);
      setVideoNote("");

      if (!voiceId.trim()) throw new Error("Enter your ElevenLabs voice ID first");

      const res = await fetch(`/api/webinars/${id}/voice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, voiceId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to generate voice");

      setAudioUrl(data.audioUrl || "");
      localStorage.setItem(`webinar-audio:${id}`, data.audioUrl || "");
      localStorage.setItem(`webinar-voiceId:${id}`, voiceId);
      setVideoNote("✅ Voiceover generated. Next step: use this narration in HeyGen.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to generate voice");
    } finally {
      setVoiceLoading(false);
    }
  };

  const heygenHint = useMemo(() => {
    return "HeyGen supports creating videos from scripts and audio. Use your generated narration with your HeyGen avatar workflow.";
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <svg className="animate-spin h-8 w-8 text-purple-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-sm">Loading script...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Webinar Script Editor</h1>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-green-400 text-sm font-medium">✓ Saved</span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-60 px-5 py-2 rounded-lg transition-colors"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <Link href="/dashboard/webinars">
              <button className="border border-white/20 px-5 py-2 rounded-lg hover:bg-white/5 transition-colors">
                ← Back
              </button>
            </Link>
          </div>
        </div>

        {!script && (
          <div className="border border-white/10 bg-white/5 p-6 rounded-xl text-gray-400">
            No script found. Generate one first.
          </div>
        )}

        {script && (
          <div className="space-y-6">
            {/* Voice generator */}
            <div className="border border-white/10 bg-white/5 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">AI Video Generator</h2>
              <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                <input
                  value={voiceId}
                  onChange={(e) => setVoiceId(e.target.value)}
                  placeholder="Paste ElevenLabs Voice ID"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
                />
                <button
                  onClick={handleGenerateVoice}
                  disabled={voiceLoading}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold disabled:opacity-60"
                >
                  {voiceLoading ? "Generating Voice..." : "Generate Voiceover"}
                </button>
              </div>
              {audioUrl && (
                <div className="mt-4 space-y-4">
                  <audio controls className="w-full">
                    <source src={audioUrl} type="audio/mpeg" />
                  </audio>
                  <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white/80">
                    {heygenHint}
                  </div>
                </div>
              )}
              {videoNote && (
                <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
                  {videoNote}
                </div>
              )}
            </div>

            {/* Section editors */}
            {Object.entries(sections).map(([key, value]) => (
              <div key={key} className="border border-white/10 bg-white/5 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold capitalize">{key}</h2>
                  <button
                    onClick={() => handleRegenerate(key)}
                    disabled={regenerating === key}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm disabled:opacity-60"
                  >
                    {regenerating === key ? "Regenerating..." : "Regenerate with AI"}
                  </button>
                </div>
                <textarea
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full h-[160px] bg-black border border-white/10 p-4 rounded-xl text-white"
                />
              </div>
            ))}

            {/* Full script */}
            <div className="border border-white/10 bg-white/5 p-6 rounded-xl">
              <h2 className="text-lg font-semibold mb-3">Full Script</h2>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="w-full h-[400px] bg-black border border-white/10 p-4 rounded-xl text-white"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
