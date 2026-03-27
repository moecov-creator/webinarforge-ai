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

function cleanSection(text: string): { title: string; body: string } {
  const lines = text.split("\n").filter(Boolean);
  const title = lines[0]?.replace(/^###\s*\d*\.?\s*/, "").trim() || "Section";
  const body = lines.slice(1).join("\n").trim();
  return { title, body };
}

const SECTION_COLORS: Record<string, string> = {
  hook:     { bg: "1E2761", accent: "CADCFC" },
  promise:  { bg: "028090", accent: "E0F7FA" },
  problem:  { bg: "B85042", accent: "F9E795" },
  story:    { bg: "6D2E46", accent: "ECE2D0" },
  teaching: { bg: "2C5F2D", accent: "97BC62" },
  cta:      { bg: "990011", accent: "FCF6F5" },
} as unknown as Record<string, string>;

export default function WebinarEditor() {
  const params = useParams();
  const id = String(params.id);

  const [sections, setSections] = useState<Record<string, string>>({});
  const [script, setScript] = useState("");
  const [webinarTitle, setWebinarTitle] = useState("Webinar Script");
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceId, setVoiceId] = useState("");
  const [videoNote, setVideoNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<"pdf" | "pptx" | null>(null);

  useEffect(() => {
    async function loadScript() {
      try {
        const res = await fetch(`/api/webinars/${id}`);
        if (res.ok) {
          const data = await res.json();
          const dbScript = data?.webinar?.script;
          const title = data?.webinar?.title;
          if (title) setWebinarTitle(title);
          if (dbScript) {
            setScript(dbScript);
            setSections(parseScript(dbScript));
            setLoading(false);
            return;
          }
        }
      } catch { /* fall through */ }

      const saved = localStorage.getItem(`webinar-script:${id}`);
      const savedAudio = localStorage.getItem(`webinar-audio:${id}`);
      const savedVoiceId = localStorage.getItem(`webinar-voiceId:${id}`);
      if (saved) { setScript(saved); setSections(parseScript(saved)); }
      if (savedAudio) setAudioUrl(savedAudio);
      if (savedVoiceId) setVoiceId(savedVoiceId);
      setLoading(false);
    }
    loadScript();
  }, [id]);

  const handleChange = (key: string, value: string) => {
    const updated = { ...sections, [key]: value };
    setSections(updated);
    setScript(Object.values(updated).filter(Boolean).join("\n\n"));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch(`/api/webinars/${id}/script`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script }),
      });
      localStorage.setItem(`webinar-script:${id}`, script);
      localStorage.setItem(`webinar-voiceId:${id}`, voiceId);
      if (audioUrl) localStorage.setItem(`webinar-audio:${id}`, audioUrl);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { alert("Failed to save. Please try again."); }
    finally { setSaving(false); }
  };

  const handleRegenerate = async (key: string) => {
    try {
      setRegenerating(key);
      const title = localStorage.getItem(`webinar-title:${id}`) || webinarTitle;
      const niche = localStorage.getItem(`webinar-niche:${id}`) || "General Audience";
      const corePromise = localStorage.getItem(`webinar-corePromise:${id}`) || "Help the audience";
      const cta = localStorage.getItem(`webinar-cta:${id}`) || "Book a call";

      const res = await fetch("/api/webinars/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, niche, corePromise, cta, section: key, currentText: sections[key] || "" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      handleChange(key, data.content || "");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to regenerate");
    } finally { setRegenerating(null); }
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
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      setAudioUrl(data.audioUrl || "");
      localStorage.setItem(`webinar-audio:${id}`, data.audioUrl || "");
      localStorage.setItem(`webinar-voiceId:${id}`, voiceId);
      setVideoNote("✅ Voiceover generated. Next step: use this narration in HeyGen.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to generate voice");
    } finally { setVoiceLoading(false); }
  };

  // ── Export as PPTX ──────────────────────────────────────────────
  const handleExportPPTX = async () => {
    setExporting("pptx");
    try {
      const PptxGenJS = (await import("pptxgenjs")).default;
      const pptx = new PptxGenJS();
      pptx.layout = "LAYOUT_16x9";
      pptx.title = webinarTitle;

      // Title slide
      const titleSlide = pptx.addSlide();
      titleSlide.background = { color: "0D0F0E" };
      titleSlide.addText(webinarTitle, {
        x: 0.8, y: 2.5, w: "85%", h: 1.2,
        fontSize: 36, bold: true, color: "FFFFFF", fontFace: "Calibri",
        align: "center",
      });
      titleSlide.addText("Webinar Script", {
        x: 0.8, y: 3.8, w: "85%", h: 0.5,
        fontSize: 16, color: "3DDC84", fontFace: "Calibri", align: "center",
      });

      // One slide per section
      const sectionEntries = Object.entries(sections).filter(([, v]) => v.trim());
      const colors: Record<string, { bg: string; accent: string }> = {
        hook:     { bg: "1E2761", accent: "CADCFC" },
        promise:  { bg: "028090", accent: "E0F7FA" },
        problem:  { bg: "B85042", accent: "F9E795" },
        story:    { bg: "6D2E46", accent: "ECE2D0" },
        teaching: { bg: "2C5F2D", accent: "97BC62" },
        cta:      { bg: "990011", accent: "FCF6F5" },
      };

      sectionEntries.forEach(([key, value]) => {
        const { title, body } = cleanSection(value);
        const color = colors[key] ?? { bg: "222222", accent: "FFFFFF" };
        const slide = pptx.addSlide();
        slide.background = { color: color.bg };

        // Section label pill
        slide.addText(key.toUpperCase(), {
          x: 0.5, y: 0.3, w: 1.5, h: 0.35,
          fontSize: 10, bold: true, color: color.bg,
          fill: { color: color.accent },
          fontFace: "Calibri", align: "center",
          rectRadius: 0.05,
        });

        // Title
        slide.addText(title, {
          x: 0.5, y: 0.8, w: "90%", h: 0.9,
          fontSize: 28, bold: true, color: color.accent,
          fontFace: "Calibri",
        });

        // Body
        slide.addText(body, {
          x: 0.5, y: 1.85, w: "90%", h: 4.2,
          fontSize: 15, color: "FFFFFF", fontFace: "Calibri",
          valign: "top", wrap: true,
        });

        // Slide number
        slide.addText(`${sectionEntries.indexOf([key, value] as [string,string]) + 1} / ${sectionEntries.length}`, {
          x: 8.5, y: 6.8, w: 1, h: 0.3,
          fontSize: 9, color: color.accent, align: "right", fontFace: "Calibri",
        });
      });

      await pptx.writeFile({ fileName: `${webinarTitle.replace(/\s+/g, "-")}-script.pptx` });
    } catch (err) {
      console.error(err);
      alert("Failed to export PPTX. Please try again.");
    } finally { setExporting(null); }
  };

  // ── Export as PDF ──────────────────────────────────────────────
  const handleExportPDF = async () => {
    setExporting("pdf");
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const W = 297; const H = 210;

      const sectionColors: Record<string, { bg: [number,number,number]; accent: [number,number,number]; text: [number,number,number] }> = {
        hook:     { bg: [30,39,97],   accent: [202,220,252], text: [255,255,255] },
        promise:  { bg: [2,128,144],  accent: [224,247,250], text: [255,255,255] },
        problem:  { bg: [184,80,66],  accent: [249,231,149], text: [255,255,255] },
        story:    { bg: [109,46,70],  accent: [236,226,208], text: [255,255,255] },
        teaching: { bg: [44,95,45],   accent: [151,188,98],  text: [255,255,255] },
        cta:      { bg: [153,0,17],   accent: [252,246,245], text: [255,255,255] },
      };

      // Title page
      doc.setFillColor(13, 15, 14);
      doc.rect(0, 0, W, H, "F");
      doc.setTextColor(61, 220, 132);
      doc.setFontSize(32);
      doc.setFont("helvetica", "bold");
      doc.text(webinarTitle, W / 2, H / 2 - 10, { align: "center" });
      doc.setTextColor(180, 180, 180);
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("Webinar Script", W / 2, H / 2 + 10, { align: "center" });

      // Section pages
      Object.entries(sections).filter(([, v]) => v.trim()).forEach(([key, value]) => {
        doc.addPage();
        const { title, body } = cleanSection(value);
        const c = sectionColors[key] ?? { bg: [30,30,30], accent: [200,200,200], text: [255,255,255] };

        // Background
        doc.setFillColor(...c.bg);
        doc.rect(0, 0, W, H, "F");

        // Left accent bar
        doc.setFillColor(...c.accent);
        doc.rect(0, 0, 6, H, "F");

        // Section label
        doc.setFillColor(...c.accent);
        doc.roundedRect(14, 12, 40, 8, 2, 2, "F");
        doc.setTextColor(...c.bg);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text(key.toUpperCase(), 34, 17.5, { align: "center" });

        // Title
        doc.setTextColor(...c.accent);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text(title, 14, 36);

        // Divider
        doc.setDrawColor(...c.accent);
        doc.setLineWidth(0.5);
        doc.line(14, 42, W - 14, 42);

        // Body
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(body, W - 30);
        doc.text(lines.slice(0, 12), 14, 52);
      });

      doc.save(`${webinarTitle.replace(/\s+/g, "-")}-script.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to export PDF. Please try again.");
    } finally { setExporting(null); }
  };

  const heygenHint = useMemo(() => "HeyGen supports creating videos from scripts and audio. Use your generated narration with your HeyGen avatar workflow.", []);

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

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <h1 className="text-3xl font-bold">Webinar Script Editor</h1>
          <div className="flex items-center gap-2 flex-wrap">

            {/* Export buttons — only show when there's a script */}
            {script && (
              <>
                <button
                  onClick={handleExportPDF}
                  disabled={exporting !== null}
                  className="flex items-center gap-2 border border-red-500/40 hover:bg-red-500/10 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {exporting === "pdf" ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : "↓"} Export PDF
                </button>

                <button
                  onClick={handleExportPPTX}
                  disabled={exporting !== null}
                  className="flex items-center gap-2 border border-orange-500/40 hover:bg-orange-500/10 text-orange-400 hover:text-orange-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {exporting === "pptx" ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : "↓"} Export PPTX
                </button>
              </>
            )}

            {saved && <span className="text-green-400 text-sm font-medium">✓ Saved</span>}
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
                  <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white/80">{heygenHint}</div>
                </div>
              )}
              {videoNote && (
                <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">{videoNote}</div>
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
