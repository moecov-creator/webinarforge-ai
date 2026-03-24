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

if (!res.ok
