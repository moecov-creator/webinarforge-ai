"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────
interface SlideTemplate {
  id: string;
  niche: string;
  name: string;
  description: string;
  preview: { primary: string; secondary: string; accent: string };
  pptx: {
    bg: string; titleColor: string; bodyColor: string;
    accentColor: string; labelBg: string; labelText: string;
    fontFace: string;
  };
  pdf: {
    bg: [number,number,number]; title: [number,number,number];
    body: [number,number,number]; accent: [number,number,number];
    label: [number,number,number]; labelText: [number,number,number];
  };
  layout: "split" | "centered" | "minimal" | "bold";
  tagline: string;
}

// ── Templates ──────────────────────────────────────────────────────
const TEMPLATES: SlideTemplate[] = [
  // Real Estate
  {
    id: "re-luxury",
    niche: "Real Estate",
    name: "Luxury Estate",
    description: "Elegant navy & gold — premium property feel",
    tagline: "Close More Listings",
    preview: { primary: "#1E2761", secondary: "#C9A84C", accent: "#F5F0E8" },
    pptx: { bg: "1E2761", titleColor: "C9A84C", bodyColor: "F5F0E8", accentColor: "C9A84C", labelBg: "C9A84C", labelText: "1E2761", fontFace: "Georgia" },
    pdf: { bg: [30,39,97], title: [201,168,76], body: [245,240,232], accent: [201,168,76], label: [201,168,76], labelText: [30,39,97] },
    layout: "split",
  },
  {
    id: "re-modern",
    niche: "Real Estate",
    name: "Modern Market",
    description: "Clean white & charcoal — professional and sharp",
    tagline: "Market Leader",
    preview: { primary: "#2D2D2D", secondary: "#E63946", accent: "#FFFFFF" },
    pptx: { bg: "2D2D2D", titleColor: "E63946", bodyColor: "FFFFFF", accentColor: "E63946", labelBg: "E63946", labelText: "FFFFFF", fontFace: "Calibri" },
    pdf: { bg: [45,45,45], title: [230,57,70], body: [255,255,255], accent: [230,57,70], label: [230,57,70], labelText: [255,255,255] },
    layout: "bold",
  },
  // Coaches & Consultants
  {
    id: "coach-transform",
    niche: "Coaches & Consultants",
    name: "Transformation",
    description: "Warm purple & gold — inspiring and authoritative",
    tagline: "Transform Your Clients",
    preview: { primary: "#4A1259", secondary: "#F4A261", accent: "#FDF6EC" },
    pptx: { bg: "4A1259", titleColor: "F4A261", bodyColor: "FDF6EC", accentColor: "F4A261", labelBg: "F4A261", labelText: "4A1259", fontFace: "Palatino Linotype" },
    pdf: { bg: [74,18,89], title: [244,162,97], body: [253,246,236], accent: [244,162,97], label: [244,162,97], labelText: [74,18,89] },
    layout: "centered",
  },
  {
    id: "coach-bold",
    niche: "Coaches & Consultants",
    name: "Power Coach",
    description: "Bold green & black — high-energy and results-driven",
    tagline: "Results. Not Excuses.",
    preview: { primary: "#0D1B2A", secondary: "#00C896", accent: "#FFFFFF" },
    pptx: { bg: "0D1B2A", titleColor: "00C896", bodyColor: "FFFFFF", accentColor: "00C896", labelBg: "00C896", labelText: "0D1B2A", fontFace: "Trebuchet MS" },
    pdf: { bg: [13,27,42], title: [0,200,150], body: [255,255,255], accent: [0,200,150], label: [0,200,150], labelText: [13,27,42] },
    layout: "bold",
  },
  // SaaS
  {
    id: "saas-tech",
    niche: "SaaS",
    name: "Tech Forward",
    description: "Deep blue & cyan — modern and technical",
    tagline: "Scale Faster",
    preview: { primary: "#0F1923", secondary: "#00D4FF", accent: "#E0F7FA" },
    pptx: { bg: "0F1923", titleColor: "00D4FF", bodyColor: "E0F7FA", accentColor: "00D4FF", labelBg: "00D4FF", labelText: "0F1923", fontFace: "Consolas" },
    pdf: { bg: [15,25,35], title: [0,212,255], body: [224,247,250], accent: [0,212,255], label: [0,212,255], labelText: [15,25,35] },
    layout: "minimal",
  },
  {
    id: "saas-clean",
    niche: "SaaS",
    name: "Clean Product",
    description: "White & indigo — crisp, minimal, startup feel",
    tagline: "Ship. Grow. Repeat.",
    preview: { primary: "#FFFFFF", secondary: "#4F46E5", accent: "#1E1B4B" },
    pptx: { bg: "FFFFFF", titleColor: "4F46E5", bodyColor: "1E1B4B", accentColor: "4F46E5", labelBg: "4F46E5", labelText: "FFFFFF", fontFace: "Calibri" },
    pdf: { bg: [255,255,255], title: [79,70,229], body: [30,27,75], accent: [79,70,229], label: [79,70,229], labelText: [255,255,255] },
    layout: "minimal",
  },
  // Travel
  {
    id: "travel-adventure",
    niche: "Travel",
    name: "Adventure",
    description: "Ocean teal & sunset gold — wanderlust and freedom",
    tagline: "Your Next Journey Awaits",
    preview: { primary: "#065A82", secondary: "#F5A623", accent: "#E8F4F8" },
    pptx: { bg: "065A82", titleColor: "F5A623", bodyColor: "E8F4F8", accentColor: "F5A623", labelBg: "F5A623", labelText: "065A82", fontFace: "Georgia" },
    pdf: { bg: [6,90,130], title: [245,166,35], body: [232,244,248], accent: [245,166,35], label: [245,166,35], labelText: [6,90,130] },
    layout: "split",
  },
  {
    id: "travel-luxury",
    niche: "Travel",
    name: "Luxury Travel",
    description: "Rich emerald & champagne — exclusive and aspirational",
    tagline: "Travel in Style",
    preview: { primary: "#1B4332", secondary: "#D4AF37", accent: "#F9F6EE" },
    pptx: { bg: "1B4332", titleColor: "D4AF37", bodyColor: "F9F6EE", accentColor: "D4AF37", labelBg: "D4AF37", labelText: "1B4332", fontFace: "Palatino Linotype" },
    pdf: { bg: [27,67,50], title: [212,175,55], body: [249,246,238], accent: [212,175,55], label: [212,175,55], labelText: [27,67,50] },
    layout: "centered",
  },
  // Local Services
  {
    id: "local-trust",
    niche: "Local Services",
    name: "Community Trust",
    description: "Warm red & cream — local, reliable, approachable",
    tagline: "Serving Your Community",
    preview: { primary: "#8B1A1A", secondary: "#F5E6D3", accent: "#FFFFFF" },
    pptx: { bg: "8B1A1A", titleColor: "F5E6D3", bodyColor: "FFFFFF", accentColor: "F5E6D3", labelBg: "F5E6D3", labelText: "8B1A1A", fontFace: "Calibri" },
    pdf: { bg: [139,26,26], title: [245,230,211], body: [255,255,255], accent: [245,230,211], label: [245,230,211], labelText: [139,26,26] },
    layout: "bold",
  },
  {
    id: "local-pro",
    niche: "Local Services",
    name: "Pro Services",
    description: "Steel blue & white — professional and dependable",
    tagline: "Done Right. Every Time.",
    preview: { primary: "#1D3557", secondary: "#457B9D", accent: "#F1FAEE" },
    pptx: { bg: "1D3557", titleColor: "A8DADC", bodyColor: "F1FAEE", accentColor: "A8DADC", labelBg: "457B9D", labelText: "FFFFFF", fontFace: "Trebuchet MS" },
    pdf: { bg: [29,53,87], title: [168,218,220], body: [241,250,238], accent: [168,218,220], label: [69,123,157], labelText: [255,255,255] },
    layout: "split",
  },
  // General
  {
    id: "general-dark",
    niche: "General/Other",
    name: "Dark & Bold",
    description: "Charcoal & green — universal, modern, clean",
    tagline: "Make Your Mark",
    preview: { primary: "#0D0F0E", secondary: "#3DDC84", accent: "#FFFFFF" },
    pptx: { bg: "0D0F0E", titleColor: "3DDC84", bodyColor: "FFFFFF", accentColor: "3DDC84", labelBg: "3DDC84", labelText: "0D0F0E", fontFace: "Calibri" },
    pdf: { bg: [13,15,14], title: [61,220,132], body: [255,255,255], accent: [61,220,132], label: [61,220,132], labelText: [13,15,14] },
    layout: "bold",
  },
  {
    id: "general-light",
    niche: "General/Other",
    name: "Clean & Light",
    description: "White & slate — minimal, professional, versatile",
    tagline: "Clear. Concise. Compelling.",
    preview: { primary: "#F8F9FA", secondary: "#343A40", accent: "#6C757D" },
    pptx: { bg: "F8F9FA", titleColor: "343A40", bodyColor: "495057", accentColor: "343A40", labelBg: "343A40", labelText: "FFFFFF", fontFace: "Calibri" },
    pdf: { bg: [248,249,250], title: [52,58,64], body: [73,80,87], accent: [52,58,64], label: [52,58,64], labelText: [255,255,255] },
    layout: "minimal",
  },
];

const NICHES = ["All", "Real Estate", "Coaches & Consultants", "SaaS", "Travel", "Local Services", "General/Other"];

// ── Helpers ────────────────────────────────────────────────────────
function parseScript(script: string) {
  const sections: Record<string, string> = { hook: "", promise: "", problem: "", story: "", teaching: "", cta: "" };
  script.split("###").forEach((section) => {
    const lower = section.toLowerCase();
    if (lower.includes("hook")) sections.hook = `###${section}`.trim();
    else if (lower.includes("promise")) sections.promise = `###${section}`.trim();
    else if (lower.includes("problem")) sections.problem = `###${section}`.trim();
    else if (lower.includes("story") || lower.includes("origin")) sections.story = `###${section}`.trim();
    else if (lower.includes("teaching") || lower.includes("belief")) sections.teaching = `${sections.teaching}\n\n###${section}`.trim();
    else if (lower.includes("cta") || lower.includes("call to action")) sections.cta = `###${section}`.trim();
  });
  return sections;
}

function cleanSection(text: string): { title: string; body: string } {
  const lines = text.split("\n").filter(Boolean);
  const title = lines[0]?.replace(/^###\s*\d*\.?\s*/, "").trim() || "Section";
  const body = lines.slice(1).join("\n").trim();
  return { title, body };
}

// ── Template Picker Modal ──────────────────────────────────────────
function TemplatePicker({
  format,
  onSelect,
  onClose,
}: {
  format: "pdf" | "pptx";
  onSelect: (template: SlideTemplate) => void;
  onClose: () => void;
}) {
  const [activeNiche, setActiveNiche] = useState("All");
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered = activeNiche === "All"
    ? TEMPLATES
    : TEMPLATES.filter(t => t.niche === activeNiche);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <div>
            <h2 className="text-xl font-bold text-white">Choose a Slide Template</h2>
            <p className="text-sm text-white/40 mt-0.5">
              Exporting as <span className="text-white/70 font-medium">{format.toUpperCase()}</span> · Pick a design that matches your niche
            </p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white text-2xl leading-none transition-colors">×</button>
        </div>

        {/* Niche filter */}
        <div className="flex gap-2 px-6 py-3 border-b border-white/8 overflow-x-auto">
          {NICHES.map(n => (
            <button
              key={n}
              onClick={() => setActiveNiche(n)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeNiche === n
                  ? "bg-white text-black"
                  : "border border-white/15 text-white/50 hover:text-white hover:border-white/30"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map(t => (
              <button
                key={t.id}
                onClick={() => onSelect(t)}
                onMouseEnter={() => setHovered(t.id)}
                onMouseLeave={() => setHovered(null)}
                className={`text-left rounded-xl border overflow-hidden transition-all ${
                  hovered === t.id ? "border-white/40 scale-[1.02]" : "border-white/10"
                }`}
              >
                {/* Color preview */}
                <div
                  className="h-24 relative flex flex-col justify-between p-3"
                  style={{ background: t.preview.primary }}
                >
                  {/* Fake slide content */}
                  <div className="flex items-center gap-1.5">
                    <div className="px-2 py-0.5 rounded text-[9px] font-bold"
                      style={{ background: t.preview.secondary, color: t.preview.primary }}>
                      HOOK
                    </div>
                  </div>
                  <div>
                    <div className="h-2.5 rounded mb-1.5 w-3/4" style={{ background: t.preview.secondary }} />
                    <div className="h-1.5 rounded mb-1 w-full opacity-60" style={{ background: t.preview.accent }} />
                    <div className="h-1.5 rounded w-2/3 opacity-40" style={{ background: t.preview.accent }} />
                  </div>
                  {/* Layout badge */}
                  <div className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded bg-black/30 text-white/60">
                    {t.layout}
                  </div>
                </div>

                {/* Info */}
                <div className="bg-[#1a1a1a] p-3">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-semibold text-white">{t.name}</span>
                    <span className="text-[10px] text-white/30">{t.niche}</span>
                  </div>
                  <p className="text-[11px] text-white/40 leading-snug">{t.description}</p>
                  <p className="text-[10px] mt-1.5 font-medium" style={{ color: t.preview.secondary }}>
                    "{t.tagline}"
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/8 text-xs text-white/25 text-center">
          Click a template to export instantly
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
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
  const [exportFormat, setExportFormat] = useState<"pdf" | "pptx" | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function loadScript() {
      try {
        const res = await fetch(`/api/webinars/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.webinar?.title) setWebinarTitle(data.webinar.title);
          if (data?.webinar?.script) {
            setScript(data.webinar.script);
            setSections(parseScript(data.webinar.script));
            setLoading(false);
            return;
          }
        }
      } catch { /* fall through */ }

      const s = localStorage.getItem(`webinar-script:${id}`);
      if (s) { setScript(s); setSections(parseScript(s)); }
      const a = localStorage.getItem(`webinar-audio:${id}`);
      if (a) setAudioUrl(a);
      const v = localStorage.getItem(`webinar-voiceId:${id}`);
      if (v) setVoiceId(v);
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
    setSaving(true); setSaved(false);
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
    } catch { alert("Failed to save."); }
    finally { setSaving(false); }
  };

  const handleRegenerate = async (key: string) => {
    try {
      setRegenerating(key);
      const res = await fetch("/api/webinars/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: webinarTitle, niche: "General", corePromise: "Help the audience",
          cta: "Book a call", section: key, currentText: sections[key] || "",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      handleChange(key, data.content || "");
    } catch (e) { alert(e instanceof Error ? e.message : "Failed"); }
    finally { setRegenerating(null); }
  };

  const handleGenerateVoice = async () => {
    try {
      setVoiceLoading(true); setVideoNote("");
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
      setVideoNote("✅ Voiceover generated. Next step: use this narration in HeyGen.");
    } catch (e) { alert(e instanceof Error ? e.message : "Failed"); }
    finally { setVoiceLoading(false); }
  };

  // ── Export with template ─────────────────────────────────────────
  const handleTemplateSelect = async (template: SlideTemplate) => {
    setExportFormat(null);
    setExporting(true);
    const entries = Object.entries(sections).filter(([, v]) => v.trim());
    const filename = webinarTitle.replace(/\s+/g, "-");

    try {
      if (exportFormat === "pptx") {
        const PptxGenJS = (await import("pptxgenjs")).default;
        const pptx = new PptxGenJS();
        pptx.layout = "LAYOUT_16x9";
        pptx.title = webinarTitle;
        const t = template.pptx;

        // Title slide
        const ts = pptx.addSlide();
        ts.background = { color: t.bg };
        ts.addText(webinarTitle, { x: 0.8, y: 2.2, w: "85%", h: 1.2, fontSize: 36, bold: true, color: t.titleColor, fontFace: t.fontFace, align: "center" });
        ts.addText(template.tagline, { x: 0.8, y: 3.5, w: "85%", h: 0.6, fontSize: 16, color: t.accentColor, fontFace: t.fontFace, align: "center" });
        ts.addText("Webinar Script", { x: 0.8, y: 4.2, w: "85%", h: 0.4, fontSize: 11, color: t.bodyColor, fontFace: t.fontFace, align: "center", italic: true });

        entries.forEach(([key, value], i) => {
          const { title, body } = cleanSection(value);
          const slide = pptx.addSlide();
          slide.background = { color: t.bg };

          if (template.layout === "split") {
            // Left color bar
            slide.addShape("rect" as any, { x: 0, y: 0, w: 0.12, h: "100%", fill: { color: t.accentColor } });
            slide.addText(key.toUpperCase(), { x: 0.3, y: 0.25, w: 1.8, h: 0.35, fontSize: 9, bold: true, color: t.labelText, fill: { color: t.labelBg }, fontFace: t.fontFace, align: "center", rectRadius: 0.04 });
            slide.addText(title, { x: 0.3, y: 0.75, w: "88%", h: 0.9, fontSize: 26, bold: true, color: t.titleColor, fontFace: t.fontFace });
            slide.addText(body, { x: 0.3, y: 1.8, w: "88%", h: 4.3, fontSize: 14, color: t.bodyColor, fontFace: t.fontFace, valign: "top", wrap: true });
          } else if (template.layout === "centered") {
            slide.addText(key.toUpperCase(), { x: 3.5, y: 0.3, w: 3, h: 0.35, fontSize: 9, bold: true, color: t.labelText, fill: { color: t.labelBg }, fontFace: t.fontFace, align: "center", rectRadius: 0.04 });
            slide.addText(title, { x: 0.5, y: 0.9, w: "90%", h: 1, fontSize: 28, bold: true, color: t.titleColor, fontFace: t.fontFace, align: "center" });
            slide.addShape("rect" as any, { x: 4, y: 2.05, w: 2, h: 0.05, fill: { color: t.accentColor } });
            slide.addText(body, { x: 0.8, y: 2.3, w: "85%", h: 3.8, fontSize: 13, color: t.bodyColor, fontFace: t.fontFace, valign: "top", wrap: true, align: "center" });
          } else if (template.layout === "minimal") {
            slide.addText(key.toUpperCase(), { x: 0.5, y: 0.3, w: 1.8, h: 0.3, fontSize: 9, bold: true, color: t.accentColor, fontFace: t.fontFace });
            slide.addShape("rect" as any, { x: 0.5, y: 0.68, w: 8.5, h: 0.04, fill: { color: t.accentColor } });
            slide.addText(title, { x: 0.5, y: 0.9, w: "90%", h: 0.9, fontSize: 26, bold: true, color: t.titleColor, fontFace: t.fontFace });
            slide.addText(body, { x: 0.5, y: 2.0, w: "90%", h: 4.2, fontSize: 13, color: t.bodyColor, fontFace: t.fontFace, valign: "top", wrap: true });
          } else {
            // bold
            slide.addShape("rect" as any, { x: 0, y: 0, w: "100%", h: 1.4, fill: { color: t.accentColor } });
            slide.addText(key.toUpperCase(), { x: 0.5, y: 0.15, w: 2, h: 0.35, fontSize: 9, bold: true, color: t.labelText, fill: { color: t.labelBg }, fontFace: t.fontFace, align: "center", rectRadius: 0.04 });
            slide.addText(title, { x: 0.5, y: 0.55, w: "90%", h: 0.75, fontSize: 24, bold: true, color: t.bg, fontFace: t.fontFace });
            slide.addText(body, { x: 0.5, y: 1.6, w: "90%", h: 4.5, fontSize: 13, color: t.bodyColor, fontFace: t.fontFace, valign: "top", wrap: true });
          }

          slide.addText(`${i + 1} / ${entries.length}`, { x: 8.5, y: 6.8, w: 1, h: 0.3, fontSize: 9, color: t.accentColor, align: "right", fontFace: t.fontFace });
        });

        await pptx.writeFile({ fileName: `${filename}-script.pptx` });

      } else {
        // PDF
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
        const W = 297; const H = 210;
        const c = template.pdf;

        // Title page
        doc.setFillColor(...c.bg);
        doc.rect(0, 0, W, H, "F");
        doc.setFillColor(...c.accent);
        doc.rect(0, H - 2, W, 2, "F");
        doc.setTextColor(...c.title);
        doc.setFontSize(30);
        doc.setFont("helvetica", "bold");
        doc.text(webinarTitle, W / 2, H / 2 - 8, { align: "center" });
        doc.setTextColor(...c.accent);
        doc.setFontSize(14);
        doc.setFont("helvetica", "italic");
        doc.text(`"${template.tagline}"`, W / 2, H / 2 + 8, { align: "center" });
        doc.setTextColor(...c.body);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Webinar Script", W / 2, H / 2 + 20, { align: "center" });

        entries.forEach(([key, value]) => {
          doc.addPage();
          const { title, body } = cleanSection(value);

          doc.setFillColor(...c.bg);
          doc.rect(0, 0, W, H, "F");

          if (template.layout === "split") {
            doc.setFillColor(...c.accent);
            doc.rect(0, 0, 8, H, "F");
            doc.setFillColor(...c.label);
            doc.roundedRect(14, 10, 44, 9, 2, 2, "F");
            doc.setTextColor(...c.labelText);
            doc.setFontSize(8); doc.setFont("helvetica", "bold");
            doc.text(key.toUpperCase(), 36, 15.5, { align: "center" });
            doc.setTextColor(...c.title);
            doc.setFontSize(22); doc.setFont("helvetica", "bold");
            doc.text(title, 14, 32);
            doc.setDrawColor(...c.accent);
            doc.setLineWidth(0.4);
            doc.line(14, 37, W - 14, 37);
            doc.setTextColor(...c.body);
            doc.setFontSize(12); doc.setFont("helvetica", "normal");
            doc.text(doc.splitTextToSize(body, W - 30).slice(0, 11), 14, 47);

          } else if (template.layout === "centered") {
            doc.setFillColor(...c.label);
            doc.roundedRect(W / 2 - 22, 10, 44, 9, 2, 2, "F");
            doc.setTextColor(...c.labelText);
            doc.setFontSize(8); doc.setFont("helvetica", "bold");
            doc.text(key.toUpperCase(), W / 2, 15.5, { align: "center" });
            doc.setTextColor(...c.title);
            doc.setFontSize(22); doc.setFont("helvetica", "bold");
            doc.text(title, W / 2, 32, { align: "center" });
            doc.setFillColor(...c.accent);
            doc.rect(W / 2 - 20, 36, 40, 1, "F");
            doc.setTextColor(...c.body);
            doc.setFontSize(12); doc.setFont("helvetica", "normal");
            const lines = doc.splitTextToSize(body, W - 40);
            lines.slice(0, 10).forEach((line: string, i: number) => {
              doc.text(line, W / 2, 46 + i * 7, { align: "center" });
            });

          } else if (template.layout === "minimal") {
            doc.setTextColor(...c.accent);
            doc.setFontSize(9); doc.setFont("helvetica", "bold");
            doc.text(key.toUpperCase(), 14, 16);
            doc.setDrawColor(...c.accent);
            doc.setLineWidth(0.5);
            doc.line(14, 20, W - 14, 20);
            doc.setTextColor(...c.title);
            doc.setFontSize(22); doc.setFont("helvetica", "bold");
            doc.text(title, 14, 34);
            doc.setTextColor(...c.body);
            doc.setFontSize(12); doc.setFont("helvetica", "normal");
            doc.text(doc.splitTextToSize(body, W - 28).slice(0, 11), 14, 46);

          } else {
            // bold
            doc.setFillColor(...c.accent);
            doc.rect(0, 0, W, 38, "F");
            doc.setFillColor(...c.label);
            doc.roundedRect(14, 8, 44, 9, 2, 2, "F");
            doc.setTextColor(...c.labelText);
            doc.setFontSize(8); doc.setFont("helvetica", "bold");
            doc.text(key.toUpperCase(), 36, 13.5, { align: "center" });
            doc.setTextColor(...c.bg);
            doc.setFontSize(20); doc.setFont("helvetica", "bold");
            doc.text(title, 14, 30);
            doc.setTextColor(...c.body);
            doc.setFontSize(12); doc.setFont("helvetica", "normal");
            doc.text(doc.splitTextToSize(body, W - 28).slice(0, 11), 14, 50);
          }
        });

        doc.save(`${filename}-script.pdf`);
      }
    } catch (err) {
      console.error(err);
      alert("Export failed. Please try again.");
    } finally { setExporting(false); }
  };

  const heygenHint = useMemo(() => "HeyGen supports creating videos from scripts and audio. Use your generated narration with your HeyGen avatar workflow.", []);

  if (loading) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <svg className="animate-spin h-8 w-8 text-purple-400" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </main>
  );

  return (
    <>
      {/* Template picker modal */}
      {exportFormat && (
        <TemplatePicker
          format={exportFormat}
          onSelect={handleTemplateSelect}
          onClose={() => setExportFormat(null)}
        />
      )}

      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-6xl p-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <h1 className="text-3xl font-bold">Webinar Script Editor</h1>
            <div className="flex items-center gap-2 flex-wrap">
              {script && (
                <>
                  <button
                    onClick={() => setExportFormat("pdf")}
                    disabled={exporting}
                    className="flex items-center gap-2 border border-red-500/40 hover:bg-red-500/10 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {exporting && exportFormat === "pdf" ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : "↓"} Export PDF
                  </button>
                  <button
                    onClick={() => setExportFormat("pptx")}
                    disabled={exporting}
                    className="flex items-center gap-2 border border-orange-500/40 hover:bg-orange-500/10 text-orange-400 hover:text-orange-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {exporting && exportFormat === "pptx" ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : "↓"} Export PPTX
                  </button>
                </>
              )}
              {saved && <span className="text-green-400 text-sm font-medium">✓ Saved</span>}
              <button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 disabled:opacity-60 px-5 py-2 rounded-lg transition-colors">
                {saving ? "Saving…" : "Save"}
              </button>
              <Link href="/dashboard/webinars">
                <button className="border border-white/20 px-5 py-2 rounded-lg hover:bg-white/5 transition-colors">← Back</button>
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
              <div className="border border-white/10 bg-white/5 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">AI Video Generator</h2>
                <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                  <input value={voiceId} onChange={(e) => setVoiceId(e.target.value)} placeholder="Paste ElevenLabs Voice ID" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white" />
                  <button onClick={handleGenerateVoice} disabled={voiceLoading} className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold disabled:opacity-60">
                    {voiceLoading ? "Generating Voice..." : "Generate Voiceover"}
                  </button>
                </div>
                {audioUrl && <div className="mt-4 space-y-4"><audio controls className="w-full"><source src={audioUrl} type="audio/mpeg" /></audio><div className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white/80">{heygenHint}</div></div>}
                {videoNote && <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">{videoNote}</div>}
              </div>

              {Object.entries(sections).map(([key, value]) => (
                <div key={key} className="border border-white/10 bg-white/5 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold capitalize">{key}</h2>
                    <button onClick={() => handleRegenerate(key)} disabled={regenerating === key} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm disabled:opacity-60">
                      {regenerating === key ? "Regenerating..." : "Regenerate with AI"}
                    </button>
                  </div>
                  <textarea value={value} onChange={(e) => handleChange(key, e.target.value)} className="w-full h-[160px] bg-black border border-white/10 p-4 rounded-xl text-white" />
                </div>
              ))}

              <div className="border border-white/10 bg-white/5 p-6 rounded-xl">
                <h2 className="text-lg font-semibold mb-3">Full Script</h2>
                <textarea value={script} onChange={(e) => setScript(e.target.value)} className="w-full h-[400px] bg-black border border-white/10 p-4 rounded-xl text-white" />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
