
Maurice Covington <MauriceCovington@moechermarketing.com>
9:24 PM (0 minutes ago)
to Maurice

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function parseScript(script: string) {
const sections = {
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
const [voiceNote, setVoiceNote] = useState("");

const [avatarName, setAvatarName] = useState("");
const [heygenVideoId, setHeygenVideoId] = useState("");
const [videoStatus, setVideoStatus] = useState("Not Started");
const [finalVideoUrl, setFinalVideoUrl] = useState("");

const [funnelLoading, setFunnelLoading] = useState(false);

useEffect(() => {
const saved = localStorage.getItem(`webinar-script:${id}`);
const savedAudio = localStorage.getItem(`webinar-audio:${id}`);
const savedVoiceId = localStorage.getItem(`webinar-voiceId:${id}`);

const savedAvatarName = localStorage.getItem(`webinar-avatarName:${id}`);
const savedHeygenVideoId = localStorage.getItem(`webinar-heygenVideoId:${id}`);
const savedVideoStatus = localStorage.getItem(`webinar-videoStatus:${id}`);
const savedFinalVideoUrl = localStorage.getItem(`webinar-finalVideoUrl:${id}`);

if (saved) {
setScript(saved);
setSections(parseScript(saved));
}

if (savedAudio) setAudioUrl(savedAudio);
if (savedVoiceId) setVoiceId(savedVoiceId);

if (savedAvatarName) setAvatarName(savedAvatarName);
if (savedHeygenVideoId) setHeygenVideoId(savedHeygenVideoId);
if (savedVideoStatus) setVideoStatus(savedVideoStatus);
if (savedFinalVideoUrl) setFinalVideoUrl(savedFinalVideoUrl);
}, [id]);

const handleChange = (key: string, value: string) => {
const updated = { ...sections, [key]: value };
setSections(updated);

const rebuilt = Object.values(updated)
.filter(Boolean)
.join("\n\n");

setScript(rebuilt);
};

const handleSave = () => {
localStorage.setItem(`webinar-script:${id}`, script);
localStorage.setItem(`webinar-voiceId:${id}`, voiceId);

if (audioUrl) {
localStorage.setItem(`webinar-audio:${id}`, audioUrl);
}

localStorage.setItem(`webinar-avatarName:${id}`, avatarName);
localStorage.setItem(`webinar-heygenVideoId:${id}`, heygenVideoId);
localStorage.setItem(`webinar-videoStatus:${id}`, videoStatus);
localStorage.setItem(`webinar-finalVideoUrl:${id}`, finalVideoUrl);

alert("✅ Script + Video Settings Saved!");
};

const handleRegenerate = async (key: string) => {
try {
setRegenerating(key);

const title =
localStorage.getItem(`webinar-title:${id}`) || "Untitled Webinar";
const niche =
localStorage.getItem(`webinar-niche:${id}`) || "General Audience";
const corePromise =
localStorage.getItem(`webinar-corePromise:${id}`) ||
"Help the audience get a better result";
const cta =
localStorage.getItem(`webinar-cta:${id}`) || "Book a call";

const res = await fetch("/api/webinars/generate", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
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

if (!res.ok || !data.success) {
throw new Error(data.error || "Failed to regenerate section");
}

handleChange(key, data.content || "");
} catch (error) {
alert(error instanceof Error ? error.message : "Failed to regenerate section");
} finally {
setRegenerating(null);
}
};

const handleGenerateVoice = async () => {
try {
setVoiceLoading(true);
setVoiceNote("");

if (!voiceId.trim()) {
throw new Error("Enter your ElevenLabs Voice ID first");
}

const res = await fetch(`/api/webinars/${id}/voice`, {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
script,
voiceId,
}),
});

const data = await res.json();

if (!res.ok || !data.success) {
throw new Error(data.error || "Failed to generate voice");
}

setAudioUrl(data.audioUrl || "");
localStorage.setItem(`webinar-audio:${id}`, data.audioUrl || "");
localStorage.setItem(`webinar-voiceId:${id}`, voiceId);

setVoiceNote("✅ Voiceover generated. Next step: assign avatar + generate funnel or move into HeyGen.");
} catch (error) {
alert(error instanceof Error ? error.message : "Failed to generate voice");
} finally {
setVoiceLoading(false);
}
};

const handleGenerateFunnel = async () => {
try {
setFunnelLoading(true);

const title =
localStorage.getItem(`webinar-title:${id}`) || "Untitled Webinar";
const niche =
localStorage.getItem(`webinar-niche:${id}`) || "General Audience";
const corePromise =
localStorage.getItem(`webinar-corePromise:${id}`) ||
"Help the audience get a better result";
const cta =
localStorage.getItem(`webinar-cta:${id}`) || "Book a call";

const res = await fetch("/api/webinars/generate", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
mode: "funnel",
title,
niche,
corePromise,
cta,
}),
});

const data = await res.json();

if (!res.ok || !data.success) {
throw new Error(data.error || "Failed to generate funnel");
}

localStorage.setItem(`webinar-funnel:${id}`, data.funnel || "");
window.location.href = `/dashboard/webinars/${id}/funnel`;
} catch (error) {
alert(error instanceof Error ? error.message : "Failed to generate funnel");
} finally {
setFunnelLoading(false);
}
};

const videoStatusColor = useMemo(() => {
switch (videoStatus) {
case "Completed":
return "text-green-400";
case "Rendering":
return "text-yellow-400";
case "Submitted":
return "text-blue-400";
default:
return "text-white/70";
}
}, [videoStatus]);

return (
<main className="min-h-screen bg-black text-white">
<div className="mx-auto max-w-6xl p-10">
<div className="flex items-center justify-between mb-8">
<h1 className="text-3xl font-bold">Webinar Script Editor</h1>

<div className="flex gap-3">
<button
onClick={handleSave}
className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg"
>
Save
</button>

<Link href="/dashboard/webinars">
<button className="border border-white/20 px-5 py-2 rounded-lg">
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
<div className="border border-white/10 bg-white/5 p-6 rounded-xl">
<div className="flex items-center justify-between gap-4 flex-wrap">
<h2 className="text-xl font-semibold">AI Voice + Funnel Builder</h2>

<button
onClick={handleGenerateFunnel}
disabled={funnelLoading}
className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl font-semibold disabled:opacity-60"
>
{funnelLoading ? "Generating Funnel..." : "Generate Funnel Page"}
</button>
</div>

<div className="grid gap-4 md:grid-cols-[1fr_auto] mt-4">
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
</div>
)}

{voiceNote && (
<div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
{voiceNote}
</div>
)}
</div>

<div className="border border-white/10 bg-white/5 p-6 rounded-xl">
<h2 className="text-xl font-semibold mb-4">HeyGen Video Handoff</h2>

<div className="grid gap-4 md:grid-cols-2">
<div>
<label className="block text-sm text-gray-300 mb-2">
Avatar Name
</label>
<input
value={avatarName}
onChange={(e) => setAvatarName(e.target.value)}
placeholder="e.g. Maurice AI Twin"
className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
/>
</div>

<div>
<label className="block text-sm text-gray-300 mb-2">
HeyGen Video ID
</label>
<input
value={heygenVideoId}
onChange={(e) => setHeygenVideoId(e.target.value)}
placeholder="Paste HeyGen video ID"
className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
/>
</div>

<div>
<label className="block text-sm text-gray-300 mb-2">
Video Status
</label>
<select
value={videoStatus}
onChange={(e) => setVideoStatus(e.target.value)}
className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
>
<option>Not Started</option>
<option>Submitted</option>
<option>Rendering</option>
<option>Completed</option>
</select>
</div>

<div>
<label className="block text-sm text-gray-300 mb-2">
Final Video URL
</label>
<input
value={finalVideoUrl}
onChange={(e) => setFinalVideoUrl(e.target.value)}
placeholder="Paste final video URL"
className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
/>
</div>
</div>

<div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white/80">
<div className="flex items-center justify-between gap-4">
<span>
Current video status:{" "}
<span className={`font-semibold ${videoStatusColor}`}>
{videoStatus}
</span>
</span>

{finalVideoUrl ? (
<a
href={finalVideoUrl}
target="_blank"
rel="noreferrer"
className="text-purple-400 hover:text-purple-300"
>
Open Final Video →
</a>
) : null}
</div>
</div>

{finalVideoUrl && (
<div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-4">
<p className="text-sm text-white/60 mb-3">Video Preview</p>
<video
controls
className="w-full rounded-xl border border-white/10 bg-black"
src={finalVideoUrl}
/>
</div>
)}
</div>

{Object.entries(sections).map(([key, value]) => (
<div
key={key}
className="border border-white/10 bg-white/5 p-6 rounded-xl"
>
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
  
