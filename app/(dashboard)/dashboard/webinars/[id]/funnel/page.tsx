"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function parseFunnel(raw: string) {
const result = {
headline: "",
subheadline: "",
bullets: "",
cta: "",
summary: "",
};

const blocks = raw.split("###").map((b) => b.trim());

blocks.forEach((block) => {
const lower = block.toLowerCase();

if (lower.startsWith("headline")) {
result.headline = block.replace(/^headline/i, "").trim();
} else if (lower.startsWith("subheadline")) {
result.subheadline = block.replace(/^subheadline/i, "").trim();
} else if (lower.startsWith("bullets")) {
result.bullets = block.replace(/^bullets/i, "").trim();
} else if (lower.startsWith("cta")) {
result.cta = block.replace(/^cta/i, "").trim();
} else if (lower.startsWith("summary")) {
result.summary = block.replace(/^summary/i, "").trim();
}
});

return result;
}

export default function FunnelPage() {
const params = useParams();
const id = String(params.id);

const [raw, setRaw] = useState("");
const [funnel, setFunnel] = useState({
headline: "",
subheadline: "",
bullets: "",
cta: "",
summary: "",
});

useEffect(() => {
const saved = localStorage.getItem(`webinar-funnel:${id}`) || "";
setRaw(saved);

if (saved) {
setFunnel(parseFunnel(saved));
}
}, [id]);

const handleSave = () => {
const rebuilt = `### HEADLINE
${funnel.headline}

### SUBHEADLINE
${funnel.subheadline}

### BULLETS
${funnel.bullets}

### CTA
${funnel.cta}

### SUMMARY
${funnel.summary}`;

localStorage.setItem(`webinar-funnel:${id}`, rebuilt);
setRaw(rebuilt);
alert("✅ Funnel Saved!");
};

const handleChange = (key: string, value: string) => {
setFunnel((prev) => ({ ...prev, [key]: value }));
};

return (
<main className="min-h-screen bg-black text-white">
<div className="mx-auto max-w-5xl px-6 py-10">
<div className="flex items-center justify-between mb-8">
<h1 className="text-3xl font-bold">CTA Funnel Page Builder</h1>

<div className="flex gap-3">
<button
onClick={handleSave}
className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg"
>
Save
</button>

<Link href={`/dashboard/webinars/${id}`}>
<button className="border border-white/20 px-5 py-2 rounded-lg">
← Back to Editor
</button>
</Link>
</div>
</div>

{!raw && (
<div className="rounded-xl border border-white/10 bg-white/5 p-6 text-gray-400 mb-6">
No funnel found yet. Go back to the editor and click Generate Funnel Page.
</div>
)}

<div className="space-y-6">
<div className="rounded-xl border border-white/10 bg-white/5 p-6">
<label className="block text-sm text-gray-300 mb-2">Headline</label>
<textarea
value={funnel.headline}
onChange={(e) => handleChange("headline", e.target.value)}
className="w-full h-[110px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
/>
</div>

<div className="rounded-xl border border-white/10 bg-white/5 p-6">
<label className="block text-sm text-gray-300 mb-2">Subheadline</label>
<textarea
value={funnel.subheadline}
onChange={(e) => handleChange("subheadline", e.target.value)}
className="w-full h-[110px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
/>
</div>

<div className="rounded-xl border border-white/10 bg-white/5 p-6">
<label className="block text-sm text-gray-300 mb-2">Bullets</label>
<textarea
value={funnel.bullets}
onChange={(e) => handleChange("bullets", e.target.value)}
className="w-full h-[180px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
/>
</div>

<div className="rounded-xl border border-white/10 bg-white/5 p-6">
<label className="block text-sm text-gray-300 mb-2">CTA</label>
<textarea
value={funnel.cta}
onChange={(e) => handleChange("cta", e.target.value)}
className="w-full h-[90px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
/>
</div>

<div className="rounded-xl border border-white/10 bg-white/5 p-6">
<label className="block text-sm text-gray-300 mb-2">Summary</label>
<textarea
value={funnel.summary}
onChange={(e) => handleChange("summary", e.target.value)}
className="w-full h-[180px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
/>
</div>

<div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-8">
<p className="text-sm text-purple-300 mb-2">Preview</p>
<h2 className="text-4xl font-bold mb-4">{funnel.headline || "Your headline preview"}</h2>
<p className="text-lg text-white/80 mb-6">
{funnel.subheadline || "Your subheadline preview"}
</p>

<div className="whitespace-pre-wrap text-white/85 mb-6">
{funnel.bullets || "Your bullets preview"}
</div>

<div className="inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold">
{funnel.cta || "Your CTA preview"}
</div>

<p className="mt-6 text-white/70 whitespace-pre-wrap">
{funnel.summary || "Your summary preview"}
</p>
</div>
</div>
</div>
</main>
);
}
