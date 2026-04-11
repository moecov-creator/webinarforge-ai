"use client"

import { useState, useRef } from "react"
import Link from "next/link"

const PLATFORMS = [
  { id: "facebook_personal", name: "Facebook Personal", icon: "👤", color: "blue" },
  { id: "facebook_page", name: "Facebook Page", icon: "📄", color: "blue" },
  { id: "facebook_group", name: "Facebook Group", icon: "👥", color: "blue" },
  { id: "instagram", name: "Instagram", icon: "📸", color: "pink" },
  { id: "instagram_reels", name: "Instagram Reels", icon: "🎬", color: "pink" },
  { id: "instagram_stories", name: "Instagram Stories", icon: "⭕", color: "pink" },
  { id: "linkedin", name: "LinkedIn", icon: "💼", color: "indigo" },
  { id: "linkedin_page", name: "LinkedIn Page", icon: "🏢", color: "indigo" },
  { id: "tiktok", name: "TikTok", icon: "🎵", color: "red" },
  { id: "twitter", name: "X (Twitter)", icon: "𝕏", color: "gray" },
  { id: "youtube", name: "YouTube", icon: "▶️", color: "red" },
  { id: "youtube_shorts", name: "YouTube Shorts", icon: "📱", color: "red" },
  { id: "pinterest", name: "Pinterest", icon: "📌", color: "red" },
  { id: "threads", name: "Threads", icon: "🧵", color: "gray" },
]

const CONTENT_TYPES = [
  { id: "post", label: "Post", icon: "📝" },
  { id: "reel", label: "Reel", icon: "🎬" },
  { id: "story", label: "Story", icon: "⭕" },
  { id: "carousel", label: "Carousel", icon: "🖼️" },
  { id: "video", label: "Video", icon: "🎥" },
  { id: "thread", label: "Thread", icon: "🧵" },
]

type BulkPost = {
  id: string
  title: string
  content: string
  date: string
  time: string
  platforms: string[]
  contentType: string
  hashtags: string
  status: "pending" | "valid" | "error" | "scheduled" | "published"
  error?: string
}

type UploadMethod = "csv" | "json" | "excel" | "manual" | "ai"

const CSV_TEMPLATE = `title,content,date,time,platforms,contentType,hashtags
Early Bird Announcement,🚀 WebinarForge AI Early Bird is LIVE! Get lifetime access for $49 — only 500 spots. Link in bio!,2026-04-12,09:00,"facebook_personal,instagram,linkedin,twitter",post,"#WebinarForgeAI,#EarlyBird,#AIWebinar"
How AI Webinars Work,Ever wondered how AI runs your webinar 24/7 without you? Here is the secret...,2026-04-13,12:00,"instagram_reels,tiktok,youtube_shorts",reel,"#AIMarketing,#WebinarTips"
Client Success Story,Sarah generated 312 leads in her first week. Here is her exact story...,2026-04-14,15:00,"facebook_page,instagram,linkedin",carousel,"#Success,#ClientResults"
5 Reasons Webinars Fail,Most webinars fail because of these 5 mistakes. Thread below...,2026-04-15,10:00,"twitter,linkedin",thread,"#WebinarTips,#Marketing"
Behind the Scenes,Taking you behind the scenes of how we built WebinarForge AI...,2026-04-16,11:00,"instagram_stories,tiktok",story,"#BehindTheScenes,#Startup"`

const JSON_TEMPLATE = JSON.stringify([
  {
    title: "Early Bird Announcement",
    content: "🚀 WebinarForge AI Early Bird is LIVE! Get lifetime access for $49 — only 500 spots. Link in bio!",
    date: "2026-04-12",
    time: "09:00",
    platforms: ["facebook_personal", "instagram", "linkedin", "twitter"],
    contentType: "post",
    hashtags: "#WebinarForgeAI,#EarlyBird,#AIWebinar"
  },
  {
    title: "How AI Webinars Work",
    content: "Ever wondered how AI runs your webinar 24/7 without you? Here is the secret...",
    date: "2026-04-13",
    time: "12:00",
    platforms: ["instagram_reels", "tiktok", "youtube_shorts"],
    contentType: "reel",
    hashtags: "#AIMarketing,#WebinarTips"
  }
], null, 2)

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/20 border-blue-500/50 text-blue-400",
  pink: "bg-pink-500/20 border-pink-500/50 text-pink-400",
  indigo: "bg-indigo-500/20 border-indigo-500/50 text-indigo-400",
  red: "bg-red-500/20 border-red-500/50 text-red-400",
  gray: "bg-gray-500/20 border-gray-500/50 text-gray-400",
}

export default function BulkUploadPage() {
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>("csv")
  const [posts, setPosts] = useState<BulkPost[]>([])
  const [processing, setProcessing] = useState(false)
  const [processed, setProcessed] = useState(false)
  const [scheduling, setScheduling] = useState(false)
  const [scheduled, setScheduled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMsg, setProgressMsg] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [aiBulkPrompt, setAiBulkPrompt] = useState("")
  const [aiPostCount, setAiPostCount] = useState(7)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [editingPost, setEditingPost] = useState<BulkPost | null>(null)
  const [activeTemplateTab, setActiveTemplateTab] = useState<"csv" | "json">("csv")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCSV = (text: string): BulkPost[] => {
    const lines = text.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    return lines.slice(1).map((line, i) => {
      const values: string[] = []
      let current = ""
      let inQuotes = false

      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      values.push(current.trim())

      const obj: Record<string, string> = {}
      headers.forEach((h, idx) => { obj[h] = values[idx] || "" })

      const platformList = obj.platforms
        ? obj.platforms.split(",").map((p) => p.trim()).filter(Boolean)
        : []

      const isValid = obj.title && obj.content && obj.date && platformList.length > 0

      return {
        id: `bulk-${Date.now()}-${i}`,
        title: obj.title || "",
        content: obj.content || "",
        date: obj.date || "",
        time: obj.time || "09:00",
        platforms: platformList,
        contentType: obj.contentType || "post",
        hashtags: obj.hashtags || "",
        status: isValid ? "valid" : "error",
        error: !isValid ? "Missing required fields: title, content, date, or platforms" : undefined,
      }
    })
  }

  const parseJSON = (text: string): BulkPost[] => {
    const data = JSON.parse(text)
    return data.map((item: any, i: number) => ({
      id: `bulk-${Date.now()}-${i}`,
      title: item.title || "",
      content: item.content || "",
      date: item.date || "",
      time: item.time || "09:00",
      platforms: Array.isArray(item.platforms) ? item.platforms : [],
      contentType: item.contentType || "post",
      hashtags: item.hashtags || "",
      status: item.title && item.content && item.date ? "valid" : "error",
      error: !item.title || !item.content || !item.date ? "Missing required fields" : undefined,
    }))
  }

  const handleFileUpload = async (file: File) => {
    setProcessing(true)
    setProcessed(false)
    setPosts([])

    const steps = [
      "Reading file...",
      "Parsing content...",
      "Validating posts...",
      "Checking platforms...",
      "Finalizing...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 400))
      setProgress(Math.round(((i + 1) / steps.length) * 100))
      setProgressMsg(steps[i])
    }

    const text = await file.text()
    let parsedPosts: BulkPost[] = []

    try {
      if (file.name.endsWith(".csv")) {
        parsedPosts = parseCSV(text)
      } else if (file.name.endsWith(".json")) {
        parsedPosts = parseJSON(text)
      } else {
        parsedPosts = parseCSV(text)
      }
    } catch (err) {
      console.error(err)
    }

    // Apply selected platforms override if set
    if (selectedPlatforms.length > 0) {
      parsedPosts = parsedPosts.map((p) => ({ ...p, platforms: selectedPlatforms }))
    }

    setPosts(parsedPosts)
    setProcessing(false)
    setProcessed(true)
    setProgress(0)
    setProgressMsg("")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const handleAIBulkGenerate = async () => {
    if (!aiBulkPrompt) return
    setAiGenerating(true)

    const steps = [
      "Analyzing your niche...",
      "Researching top content...",
      "Writing post 1...",
      "Writing post 2...",
      "Writing post 3...",
      "Optimizing for engagement...",
      "Scheduling across platforms...",
    ]

    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 600))
      setProgressMsg(step)
    }

    const contentIdeas = [
      { type: "post", category: "educational", hook: "5 things nobody tells you about" },
      { type: "reel", category: "promotional", hook: "Watch this before you" },
      { type: "carousel", category: "testimonial", hook: "How our client went from" },
      { type: "post", category: "engagement", hook: "Unpopular opinion:" },
      { type: "thread", category: "educational", hook: "A thread on why most people fail at" },
      { type: "story", category: "behindscenes", hook: "Behind the scenes of" },
      { type: "post", category: "promotional", hook: "Last chance to get" },
      { type: "reel", category: "educational", hook: "The truth about" },
      { type: "carousel", category: "educational", hook: "Step by step guide to" },
      { type: "post", category: "personal", hook: "I made this mistake so you don't have to" },
      { type: "video", category: "educational", hook: "Complete breakdown of" },
      { type: "post", category: "trending", hook: "Everyone is talking about" },
      { type: "thread", category: "promotional", hook: "Why we built" },
      { type: "story", category: "engagement", hook: "Quick question for you" },
    ]

    const today = new Date()
    const generated: BulkPost[] = Array.from({ length: aiPostCount }).map((_, i) => {
      const idea = contentIdeas[i % contentIdeas.length]
      const postDate = new Date(today)
      postDate.setDate(today.getDate() + i)

      return {
        id: `ai-bulk-${Date.now()}-${i}`,
        title: `${idea.hook} ${aiBulkPrompt.slice(0, 30)}`,
        content: `${idea.hook} ${aiBulkPrompt}...\n\nHere is exactly how this works and why it matters for your business. The AI has crafted this content specifically for maximum engagement on your target platforms.\n\n${["#AIContent", "#WebinarForgeAI", "#Marketing", "#Business"].join(" ")}`,
        date: postDate.toISOString().split("T")[0],
        time: ["08:00", "10:00", "12:00", "15:00", "18:00"][i % 5],
        platforms: selectedPlatforms.length > 0
          ? selectedPlatforms
          : ["instagram", "facebook_personal", "linkedin", "twitter"],
        contentType: idea.type,
        hashtags: "#AIContent,#WebinarForgeAI,#Marketing,#Business",
        status: "valid",
      }
    })

    setPosts(generated)
    setAiGenerating(false)
    setProcessed(true)
    setProgressMsg("")
  }

  const handleScheduleAll = async () => {
    const validPosts = posts.filter((p) => p.status === "valid")
    if (validPosts.length === 0) return

    setScheduling(true)
    setProgress(0)

    for (let i = 0; i < validPosts.length; i++) {
      await new Promise((r) => setTimeout(r, 300))
      const pct = Math.round(((i + 1) / validPosts.length) * 100)
      setProgress(pct)
      setProgressMsg(`Scheduling post ${i + 1} of ${validPosts.length}...`)
      setPosts((prev) =>
        prev.map((p) =>
          p.id === validPosts[i].id ? { ...p, status: "scheduled" } : p
        )
      )
    }

    setScheduling(false)
    setScheduled(true)
    setProgress(0)
    setProgressMsg("")
  }

  const handleRemovePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id))
  }

  const handleEditPost = (post: BulkPost) => {
    setEditingPost({ ...post })
  }

  const handleSaveEdit = () => {
    if (!editingPost) return
    setPosts(posts.map((p) => p.id === editingPost.id ? { ...editingPost, status: "valid" } : p))
    setEditingPost(null)
  }

  const downloadTemplate = (type: "csv" | "json") => {
    const content = type === "csv" ? CSV_TEMPLATE : JSON_TEMPLATE
    const mimeType = type === "csv" ? "text/csv" : "application/json"
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `webinarforge-bulk-template.${type}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const validCount = posts.filter((p) => p.status === "valid").length
  const errorCount = posts.filter((p) => p.status === "error").length
  const scheduledCount = posts.filter((p) => p.status === "scheduled").length

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <section className="py-12 px-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/content-calendar" className="text-gray-500 hover:text-white transition text-sm">
                ← Content Calendar
              </Link>
              <span className="text-gray-700">/</span>
              <span className="text-purple-400 text-sm font-semibold">Bulk Upload</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">Bulk Post Scheduler</h1>
            <p className="text-gray-400">
              Upload hundreds of posts at once via CSV, JSON, Excel or AI generation
            </p>
          </div>
          {processed && posts.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={() => { setPosts([]); setProcessed(false); setScheduled(false) }}
                className="border border-white/20 hover:border-white/50 px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                Start Over
              </button>
              <button
                onClick={handleScheduleAll}
                disabled={scheduling || validCount === 0}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-xl transition disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                {scheduling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  `Schedule All ${validCount} Posts →`
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* SUCCESS STATE */}
        {scheduled && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center mb-8">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-black text-green-400 mb-2">
              {scheduledCount} Posts Scheduled Successfully!
            </h2>
            <p className="text-gray-400 mb-6">
              All your posts are queued and will be published automatically at their scheduled times.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/content-calendar">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-xl transition">
                  View Calendar →
                </button>
              </Link>
              <button
                onClick={() => { setPosts([]); setProcessed(false); setScheduled(false) }}
                className="border border-white/20 hover:border-white/50 px-8 py-3 rounded-xl font-semibold transition"
              >
                Upload More Posts
              </button>
            </div>
          </div>
        )}

        {/* UPLOAD METHOD TABS */}
        {!processed && (
          <>
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                { id: "csv", label: "📊 CSV Upload", desc: "Spreadsheet format" },
                { id: "json", label: "🔧 JSON Upload", desc: "Developer format" },
                { id: "excel", label: "📗 Excel Upload", desc: ".xlsx files" },
                { id: "manual", label: "✏️ Manual Paste", desc: "Copy & paste data" },
                { id: "ai", label: "🤖 AI Generate", desc: "Auto-create posts" },
              ].map(({ id, label, desc }) => (
                <button
                  key={id}
                  onClick={() => setUploadMethod(id as UploadMethod)}
                  className={`flex flex-col items-start px-5 py-3 rounded-xl border transition ${
                    uploadMethod === id
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-white/10 bg-white/5 hover:border-purple-500/50"
                  }`}
                >
                  <span className="font-semibold text-sm">{label}</span>
                  <span className="text-xs text-gray-500">{desc}</span>
                </button>
              ))}
            </div>

            {/* PLATFORM OVERRIDE */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <h3 className="font-bold mb-1">Override Platforms (Optional)</h3>
              <p className="text-gray-400 text-sm mb-4">
                Select platforms to apply to ALL imported posts, overriding any platform values in your file.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {PLATFORMS.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => {
                      setSelectedPlatforms((prev) =>
                        prev.includes(platform.id)
                          ? prev.filter((p) => p !== platform.id)
                          : [...prev, platform.id]
                      )
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs transition ${
                      selectedPlatforms.includes(platform.id)
                        ? `${colorMap[platform.color]}`
                        : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30"
                    }`}
                  >
                    <span>{platform.icon}</span>
                    <span>{platform.name}</span>
                  </button>
                ))}
              </div>
              {selectedPlatforms.length > 0 && (
                <button
                  onClick={() => setSelectedPlatforms([])}
                  className="mt-3 text-xs text-gray-500 hover:text-white underline"
                >
                  Clear platform override
                </button>
              )}
            </div>

            {/* CSV UPLOAD */}
            {(uploadMethod === "csv" || uploadMethod === "excel") && (
              <div className="space-y-6">
                {/* Template Download */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="font-bold mb-1">Download Template</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Download our template to make sure your file is formatted correctly.
                  </p>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setActiveTemplateTab("csv")}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                        activeTemplateTab === "csv" ? "bg-purple-600 text-white" : "border border-white/10 text-gray-400"
                      }`}
                    >
                      CSV Template
                    </button>
                    <button
                      onClick={() => setActiveTemplateTab("json")}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                        activeTemplateTab === "json" ? "bg-purple-600 text-white" : "border border-white/10 text-gray-400"
                      }`}
                    >
                      JSON Template
                    </button>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4 mb-4 overflow-x-auto">
                    <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                      {activeTemplateTab === "csv" ? CSV_TEMPLATE.slice(0, 300) + "..." : JSON_TEMPLATE.slice(0, 300) + "..."}
                    </pre>
                  </div>
                  <button
                    onClick={() => downloadTemplate(activeTemplateTab)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition"
                  >
                    ⬇️ Download {activeTemplateTab.toUpperCase()} Template
                  </button>
                </div>

                {/* File Drop Zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${
                    dragOver
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-white/20 hover:border-purple-500 hover:bg-white/5"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file)
                    }}
                  />
                  <div className="text-6xl mb-4">📁</div>
                  <h3 className="text-xl font-bold mb-2">
                    {dragOver ? "Drop your file here!" : "Drag & drop your file here"}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    or click to browse your files
                  </p>
                  <p className="text-gray-600 text-sm">
                    Supports: .csv, .json, .xlsx, .xls — Max 10MB — Up to 1,000 posts
                  </p>
                </div>

                {/* Column Reference */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="font-bold mb-4">Required & Optional Columns</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { col: "title", req: true, desc: "Post title for your reference" },
                      { col: "content", req: true, desc: "The actual post text content" },
                      { col: "date", req: true, desc: "Publish date (YYYY-MM-DD format)" },
                      { col: "platforms", req: true, desc: "Comma-separated platform IDs" },
                      { col: "time", req: false, desc: "Publish time (HH:MM format, default 09:00)" },
                      { col: "contentType", req: false, desc: "post, reel, story, carousel, video, thread" },
                      { col: "hashtags", req: false, desc: "Comma-separated hashtags" },
                      { col: "mediaUrl", req: false, desc: "URL to image or video file" },
                    ].map(({ col, req, desc }) => (
                      <div key={col} className="flex items-start gap-3 bg-black/40 rounded-xl p-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          req ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                        }`}>
                          {req ? "Required" : "Optional"}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">{col}</p>
                          <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Platform ID Reference */}
                  <div className="mt-4">
                    <p className="text-sm font-bold mb-2 text-gray-400">Platform IDs Reference:</p>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.map((p) => (
                        <code key={p.id} className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-gray-400">
                          {p.id}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* JSON UPLOAD */}
            {uploadMethod === "json" && (
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="font-bold mb-4">JSON Format</h3>
                  <div className="bg-black/40 rounded-xl p-4 mb-4 overflow-x-auto">
                    <pre className="text-xs text-green-400 whitespace-pre-wrap">{JSON_TEMPLATE}</pre>
                  </div>
                  <button
                    onClick={() => downloadTemplate("json")}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition"
                  >
                    ⬇️ Download JSON Template
                  </button>
                </div>

                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${
                    dragOver
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-white/20 hover:border-purple-500 hover:bg-white/5"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file)
                    }}
                  />
                  <div className="text-6xl mb-4">🔧</div>
                  <h3 className="text-xl font-bold mb-2">Upload JSON File</h3>
                  <p className="text-gray-400">Drag & drop or click to browse</p>
                </div>
              </div>
            )}

            {/* MANUAL PASTE */}
            {uploadMethod === "manual" && (
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="font-bold mb-2">Paste CSV Data</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Copy your spreadsheet data and paste it directly here.
                    First row must be the header row.
                  </p>
                  <textarea
                    placeholder={CSV_TEMPLATE}
                    rows={12}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 focus:outline-none focus:border-purple-500 transition resize-none text-xs font-mono"
                    onChange={(e) => {
                      if (e.target.value.includes(",")) {
                        const parsed = parseCSV(e.target.value)
                        if (parsed.length > 0) {
                          setPosts(parsed)
                          setProcessed(true)
                        }
                      }
                    }}
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Posts will be parsed automatically as you paste
                  </p>
                </div>
              </div>
            )}

            {/* AI BULK GENERATE */}
            {uploadMethod === "ai" && (
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-2">AI Bulk Post Generator</h3>
                  <p className="text-gray-400 mb-6">
                    Tell the AI about your business and it will generate a full month of
                    scheduled content across all your platforms automatically.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block font-semibold">
                        Describe your business & content goals *
                      </label>
                      <textarea
                        value={aiBulkPrompt}
                        onChange={(e) => setAiBulkPrompt(e.target.value)}
                        placeholder="e.g. I run a business coaching company targeting female entrepreneurs over 35. I want content that promotes my $997 coaching program, builds authority, shares client wins, and drives webinar registrations. Mix of educational, motivational, and promotional content..."
                        rows={5}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500 transition resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">
                          Number of Posts to Generate
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={7}
                            max={90}
                            value={aiPostCount}
                            onChange={(e) => setAiPostCount(parseInt(e.target.value))}
                            className="flex-1"
                          />
                          <span className="text-white font-bold w-12 text-center bg-white/5 border border-white/10 rounded-lg py-1">
                            {aiPostCount}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>7 (1 week)</span>
                          <span>30 (1 month)</span>
                          <span>90 (3 months)</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">
                          Content Mix
                        </label>
                        <div className="space-y-1">
                          {[
                            { label: "Educational", pct: "40%" },
                            { label: "Promotional", pct: "30%" },
                            { label: "Engagement", pct: "20%" },
                            { label: "Personal", pct: "10%" },
                          ].map(({ label, pct }) => (
                            <div key={label} className="flex items-center justify-between text-xs">
                              <span className="text-gray-400">{label}</span>
                              <span className="text-purple-400 font-semibold">{pct}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">
                        Select Platforms for All Posts
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {PLATFORMS.map((platform) => (
                          <button
                            key={platform.id}
                            onClick={() => {
                              setSelectedPlatforms((prev) =>
                                prev.includes(platform.id)
                                  ? prev.filter((p) => p !== platform.id)
                                  : [...prev, platform.id]
                              )
                            }}
                            className={`flex items-center gap-2 p-2 rounded-xl border text-xs transition ${
                              selectedPlatforms.includes(platform.id)
                                ? `${colorMap[platform.color]}`
                                : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30"
                            }`}
                          >
                            <span>{platform.icon}</span>
                            <span>{platform.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Estimated output */}
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                      <p className="text-purple-400 text-sm font-semibold mb-2">
                        📊 Estimated Output
                      </p>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div className="text-xl font-black text-white">{aiPostCount}</div>
                          <div className="text-xs text-gray-500">Total Posts</div>
                        </div>
                        <div>
                          <div className="text-xl font-black text-white">
                            {selectedPlatforms.length || 4}
                          </div>
                          <div className="text-xs text-gray-500">Platforms</div>
                        </div>
                        <div>
                          <div className="text-xl font-black text-white">
                            {aiPostCount * (selectedPlatforms.length || 4)}
                          </div>
                          <div className="text-xs text-gray-500">Total Publishes</div>
                        </div>
                      </div>
                    </div>

                    {aiGenerating && (
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                          <span className="text-amber-400 text-sm">{progressMsg}</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleAIBulkGenerate}
                      disabled={!aiBulkPrompt || aiGenerating}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl text-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {aiGenerating ? (
                        <>
                          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Generating {aiPostCount} Posts...
                        </>
                      ) : (
                        `🤖 Generate ${aiPostCount} Posts with AI →`
                      )}
                    </button>
                  </div>
                </div>

                {/* Preset Campaigns */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="font-bold mb-4">Quick Campaign Templates</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { name: "🚀 Product Launch Campaign", posts: 14, desc: "2-week product launch sequence" },
                      { name: "🎓 Educational Series", posts: 21, desc: "3-week educational content" },
                      { name: "📢 Webinar Promotion", posts: 7, desc: "7-day webinar promo push" },
                      { name: "⭐ Social Proof Campaign", posts: 10, desc: "10 testimonial and case study posts" },
                      { name: "🔥 30-Day Authority Build", posts: 30, desc: "Full month of authority content" },
                      { name: "💰 Sales Push", posts: 5, desc: "5-day aggressive sales campaign" },
                    ].map(({ name, posts: count, desc }) => (
                      <button
                        key={name}
                        onClick={() => {
                          setAiBulkPrompt(`Create a ${name} for my WebinarForge AI business targeting coaches and consultants`)
                          setAiPostCount(count)
                        }}
                        className="flex items-start gap-3 bg-black/40 border border-white/10 hover:border-purple-500 rounded-xl p-4 text-left transition"
                      >
                        <div>
                          <p className="font-semibold text-sm text-white">{name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{desc} · {count} posts</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* PROCESSING INDICATOR */}
        {processing && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-purple-400 font-semibold mb-3">{progressMsg}</p>
            <div className="w-full max-w-sm mx-auto bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{progress}%</p>
          </div>
        )}

        {/* SCHEDULING PROGRESS */}
        {scheduling && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center mb-6">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-green-400 font-semibold mb-3">{progressMsg}</p>
            <div className="w-full max-w-sm mx-auto bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{progress}%</p>
          </div>
        )}

        {/* POSTS PREVIEW */}
        {processed && posts.length > 0 && !scheduling && (
          <div className="space-y-4">

            {/* Summary Bar */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-white">{posts.length}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-green-400">{validCount}</div>
                  <div className="text-xs text-gray-500">Valid</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-red-400">{errorCount}</div>
                  <div className="text-xs text-gray-500">Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-blue-400">{scheduledCount}</div>
                  <div className="text-xs text-gray-500">Scheduled</div>
                </div>
              </div>
              {!scheduled && (
                <button
                  onClick={handleScheduleAll}
                  disabled={validCount === 0}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition disabled:opacity-50"
                >
                  Schedule All {validCount} Valid Posts →
                </button>
              )}
            </div>

            {/* Posts Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10 bg-white/5">
                    <tr>
                      <th className="text-left p-4 text-xs text-gray-500 font-semibold">Status</th>
                      <th className="text-left p-4 text-xs text-gray-500 font-semibold">Title</th>
                      <th className="text-left p-4 text-xs text-gray-500 font-semibold">Date & Time</th>
                      <th className="text-left p-4 text-xs text-gray-500 font-semibold">Platforms</th>
                      <th className="text-left p-4 text-xs text-gray-500 font-semibold">Type</th>
                      <th className="text-left p-4 text-xs text-gray-500 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="p-4">
                          <span className={`text-xs border px-2 py-1 rounded-full ${
                            post.status === "valid" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                            post.status === "error" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                            post.status === "scheduled" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                            "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }`}>
                            {post.status === "valid" ? "✅ Valid" :
                             post.status === "error" ? "❌ Error" :
                             post.status === "scheduled" ? "📅 Scheduled" : post.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-semibold text-white max-w-[200px] truncate">
                            {post.title}
                          </p>
                          {post.error && (
                            <p className="text-xs text-red-400 mt-0.5">{post.error}</p>
                          )}
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-300">{post.date}</p>
                          <p className="text-xs text-gray-500">{post.time}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {post.platforms.slice(0, 2).map((pid) => {
                              const p = PLATFORMS.find((pl) => pl.id === pid)
                              return p ? (
                                <span key={pid} className="text-sm">{p.icon}</span>
                              ) : null
                            })}
                            {post.platforms.length > 2 && (
                              <span className="text-xs text-gray-500">+{post.platforms.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">
                            {CONTENT_TYPES.find((c) => c.id === post.contentType)?.icon}{" "}
                            {CONTENT_TYPES.find((c) => c.id === post.contentType)?.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditPost(post)}
                              className="text-xs border border-white/20 hover:border-purple-500 px-2 py-1 rounded-lg transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleRemovePost(post.id)}
                              className="text-xs border border-red-500/30 hover:border-red-500 text-red-400 px-2 py-1 rounded-lg transition"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* EDIT POST MODAL */}
        {editingPost && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8">
            <div className="bg-[#0a0a0a] border border-white/20 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-bold">Edit Post</h2>
                <button onClick={() => setEditingPost(null)} className="text-gray-500 hover:text-white text-xl">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Title</label>
                  <input
                    type="text"
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Content</label>
                  <textarea
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Date</label>
                    <input
                      type="date"
                      value={editingPost.date}
                      onChange={(e) => setEditingPost({ ...editingPost, date: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Time</label>
                    <input
                      type="time"
                      value={editingPost.time}
                      onChange={(e) => setEditingPost({ ...editingPost, time: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Platforms</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {PLATFORMS.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => {
                          const current = editingPost.platforms
                          setEditingPost({
                            ...editingPost,
                            platforms: current.includes(platform.id)
                              ? current.filter((p) => p !== platform.id)
                              : [...current, platform.id],
                          })
                        }}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs transition ${
                          editingPost.platforms.includes(platform.id)
                            ? `${colorMap[platform.color]}`
                            : "border-white/10 bg-white/5 text-gray-400"
                        }`}
                      >
                        <span>{platform.icon}</span>
                        <span>{platform.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingPost(null)}
                    className="flex-1 border border-white/20 py-3 rounded-xl font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM CTA */}
        {!processed && (
          <div className="mt-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center">
            <p className="text-amber-400 font-bold mb-1">
              🔒 Full Bulk Scheduling Requires Early Bird Access
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Schedule unlimited posts across all platforms for just $49 one-time.
            </p>
            <Link href="/pricing">
              <button className="bg-amber-500 hover:bg-amber-400 text-black font-black px-8 py-3 rounded-xl transition">
                Get Full Access — $49 →
              </button>
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}
