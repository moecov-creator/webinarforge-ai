"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewWebinarPage() {
const router = useRouter();

const [title, setTitle] = useState("");
const [niche, setNiche] = useState("");
const [corePromise, setCorePromise] = useState("");
const [cta, setCta] = useState("");

const [loading, setLoading] = useState(false);
const [generating, setGenerating] = useState(false);
const [error, setError] = useState("");
const [script, setScript] = useState("");

const handleSubmit = async () => {
setLoading(true);
setError("");

try {
const res = await fetch("/api/webinars", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
title,
niche,
corePromise,
cta,
}),
});

const data = await res.json();

if (!res.ok || !data.success) {
throw new Error(data.error || `Request failed with status ${res.status}`);
}

if (typeof window !== "undefined" && data.webinar?.id) {
if (script) {
localStorage.setItem(`webinar-script:${data.webinar.id}`, script);
}
localStorage.setItem(`webinar-title:${data.webinar.id}`, title);
localStorage.setItem(`webinar-niche:${data.webinar.id}`, niche);
localStorage.setItem(`webinar-corePromise:${data.webinar.id}`, corePromise);
localStorage.setItem(`webinar-cta:${data.webinar.id}`, cta);
}

router.push(`/dashboard/webinars/${data.webinar.id}`);
} catch (err) {
const message =
err instanceof Error ? err.message : "Failed to save webinar";
console.error("Create webinar error:", message);
setError(message);
} finally {
setLoading(false);
}
};

const handleGenerateScript = async () => {
setGenerating(true);
setError("");
setScript("");

try {
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
}),
});

const data = await res.json();

if (!res.ok || !data.success) {
throw new Error(
data.error || `Generate failed with status ${res.status}`
);
}

setScript(data.script || "");
} catch (err) {
const message =
err instanceof Error ? err.message : "Failed to generate script";
console.error("Generate script error:", message);
setError(message);
} finally {
setGenerating(false);
}
};

return (
<main className="min-h-screen bg-black text-white">
<div className="mx-auto max-w-7xl px-6 py-10">
<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
<div>
<p className="text-sm text-purple-400">Webinars / New</p>
<h1 className="text-3xl md:text-5xl font-bold">
Create New Webinar
</h1>
<p className="mt-2 text-gray-400">
Build your next AI-powered evergreen webinar funnel in minutes.
</p>
</div>

<Link href="/dashboard">
<button className="rounded-xl border border-white/20 px-5 py-3 font-medium hover:border-white/50">
← Back to Dashboard
</button>
</Link>
</div>

<div className="grid gap-8 lg:grid-cols-2">
<div className="max-w-2xl space-y-6">
<div>
<label className="block text-sm text-gray-300 mb-2">
Webinar Title
</label>
<input
value={title}
onChange={(e) => setTitle(e.target.value)}
placeholder="e.g. AI Client Acquisition System"
className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
/>
</div>

<div>
<label className="block text-sm text-gray-300 mb-2">
Niche / Audience
</label>
<input
value={niche}
onChange={(e) => setNiche(e.target.value)}
placeholder="e.g. Realtors, Coaches, SaaS"
className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
/>
</div>

<div>
<label className="block text-sm text-gray-300 mb-2">
Core Promise
</label>
<input
value={corePromise}
onChange={(e) => setCorePromise(e.target.value)}
placeholder="What result do they get?"
className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
/>
</div>

<div>
<label className="block text-sm text-gray-300 mb-2">
Main CTA
</label>
<input
value={cta}
onChange={(e) => setCta(e.target.value)}
placeholder="Book call / Start trial"
className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white"
/>
</div>

{error && (
<div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
{error}
</div>
)}

<div className="grid gap-4 md:grid-cols-2">
<button
onClick={handleGenerateScript}
disabled={generating}
className="w-full bg-purple-600 hover:bg-purple-700 px-6 py-4 rounded-xl font-semibold disabled:opacity-60"
>
{generating ? "Generating..." : "Generate AI Script"}
</button>

<button
onClick={handleSubmit}
disabled={loading}
className="w-full border border-white/20 hover:border-white/40 px-6 py-4 rounded-xl font-semibold disabled:opacity-60"
>
{loading ? "Creating..." : "Create Webinar →"}
</button>
</div>
</div>

<div className="rounded-2xl border border-white/10 bg-white/5 p-6">
<div className="mb-4 flex items-center justify-between">
<h2 className="text-xl font-semibold">AI Webinar Script Preview</h2>
</div>

<div className="min-h-[500px] whitespace-pre-wrap text-sm leading-7 text-gray-200">
{script
? script
: "Your generated webinar script will appear here after you click “Generate AI Script”."}
</div>
</div>
</div>
</div>
</main>
);
}
