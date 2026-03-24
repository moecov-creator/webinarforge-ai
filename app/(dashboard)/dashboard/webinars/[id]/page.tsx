"use client";

import { useEffect, useState } from "react";
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
else if (lower.includes("story")) sections.story = `###${section}`.trim();
else if (lower.includes("teaching")) sections.teaching = `###${section}`.trim();
else if (lower.includes("cta") || lower.includes("call to action")) {
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

useEffect(() => {
const saved = localStorage.getItem(`webinar-script:${id}`);
if (saved) {
setScript(saved);
setSections(parseScript(saved));
}
}, [id]);

return (
<main className="min-h-screen bg-black text-white">
<div className="mx-auto max-w-6xl p-10">
<div className="flex items-center justify-between mb-8">
<h1 className="text-3xl font-bold">Webinar Script Editor</h1>

<Link href="/dashboard/webinars">
<button className="rounded-xl border border-white/20 px-5 py-3 font-medium hover:border-white/50">
← Back to Webinars
</button>
</Link>
</div>

{!script && (
<div className="rounded-xl border border-white/10 bg-white/5 p-6 text-gray-400">
No script found. Go back, generate a script, then create the webinar.
</div>
)}

{script && (
<div className="space-y-6">
{Object.entries(sections).map(([key, value]) => (
<div
key={key}
className="rounded-2xl border border-white/10 bg-white/5 p-6"
>
<h2 className="text-lg font-semibold capitalize mb-3">{key}</h2>
<textarea
value={value}
readOnly
className="w-full h-[140px] bg-black border border-white/10 p-4 rounded-xl text-white"
/>
</div>
))}

<div className="rounded-2xl border border-white/10 bg-white/5 p-6">
<h2 className="text-lg font-semibold mb-3">Full Script</h2>
<textarea
value={script}
readOnly
className="w-full h-[400px] bg-black border border-white/10 p-4 rounded-xl text-white"
/>
</div>
</div>
)}
</div>
</main>
);
}
