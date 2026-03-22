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
const [error, setError] = useState("");

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

router.push("/dashboard/webinars");
} catch (err) {
const message =
err instanceof Error ? err.message : "Failed to save webinar";
console.error("Create webinar error:", message);
setError(message);
} finally {
setLoading(false);
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

<button
onClick={handleSubmit}
disabled={loading}
className="w-full bg-purple-600 hover:bg-purple-700 px-6 py-4 rounded-xl font-semibold disabled:opacity-60"
>
{loading ? "Creating..." : "Create Webinar →"}
</button>
</div>
</div>
</main>
);
}
