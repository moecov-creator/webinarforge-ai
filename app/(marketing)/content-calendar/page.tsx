"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const PLATFORMS = [
  { id: "facebook_personal", name: "Facebook Personal", icon: "👤", color: "blue", category: "Facebook" },
  { id: "facebook_page", name: "Facebook Page", icon: "📄", color: "blue", category: "Facebook" },
  { id: "facebook_group", name: "Facebook Group", icon: "👥", color: "blue", category: "Facebook" },
  { id: "instagram", name: "Instagram", icon: "📸", color: "pink", category: "Instagram" },
  { id: "instagram_reels", name: "Instagram Reels", icon: "🎬", color: "pink", category: "Instagram" },
  { id: "instagram_stories", name: "Instagram Stories", icon: "⭕", color: "pink", category: "Instagram" },
  { id: "linkedin", name: "LinkedIn", icon: "💼", color: "indigo", category: "LinkedIn" },
  { id: "linkedin_page", name: "LinkedIn Page", icon: "🏢", color: "indigo", category: "LinkedIn" },
  { id: "tiktok", name: "TikTok", icon: "🎵", color: "red", category: "TikTok" },
  { id: "twitter", name: "X (Twitter)", icon: "𝕏", color: "gray", category: "X" },
  { id: "youtube", name: "YouTube", icon: "▶️", color: "red", category: "YouTube" },
  { id: "youtube_shorts", name: "YouTube Shorts", icon: "📱", color: "red", category: "YouTube" },
  { id: "pinterest", name: "Pinterest", icon: "📌", color: "red", category: "Pinterest" },
  { id: "threads", name: "Threads", icon: "🧵", color: "gray", category: "Threads" },
]

const CONTENT_TYPES = [
  { id: "post", label: "Post", icon: "📝", desc: "Static text or image post" },
  { id: "reel", label: "Reel / Short", icon: "🎬", desc: "Short vertical video 15-90 sec" },
  { id: "story", label: "Story", icon: "⭕", desc: "24-hour disappearing content" },
  { id: "carousel", label: "Carousel", icon: "🖼️", desc: "Multiple images/slides" },
  { id: "video", label: "Long Video", icon: "🎥", desc: "YouTube or Facebook video" },
  { id: "live", label: "Live Stream", icon: "🔴", desc: "Real-time live broadcast" },
  { id: "article", label: "Article", icon: "📰", desc: "LinkedIn or Facebook article" },
  { id: "thread", label: "Thread", icon: "🧵", desc: "Twitter/X thread" },
]

const CATEGORIES = [
  { id: "educational", label: "Educational", color: "blue", icon: "🎓" },
  { id: "promotional", label: "Promotional", color: "green", icon: "📢" },
  { id: "engagement", label: "Engagement", color: "yellow", icon: "💬" },
  { id: "behindscenes", label: "Behind the Scenes", color: "purple", icon: "🎭" },
  { id: "testimonial", label: "Testimonial", color: "pink", icon: "⭐" },
  { id: "trending", label: "Trending / News", color: "red", icon: "🔥" },
  { id: "personal", label: "Personal Story", color: "orange", icon: "❤️" },
  { id: "webinar", label: "Webinar Promo", color: "indigo", icon: "🎬" },
]

const CALENDAR_APPS = [
  { id: "google", name: "Google Calendar", icon: "📅", color: "blue" },
  { id: "outlook", name: "Outlook", icon: "📧", color: "indigo" },
  { id: "apple", name: "Apple Calendar", icon: "🍎", color: "gray" },
  { id: "notion", name: "Notion", icon: "📓", color: "gray" },
  { id: "airtable", name: "Airtable", icon: "🗃️", color: "yellow" },
  { id: "trello", name: "Trello", icon: "📋", color: "blue" },
]

type Post = {
  id: string
  title: string
  content: string
  date: string
  time: string
  platforms: string[]
  contentType: string
  category: string
  status: "draft" | "scheduled" | "published" | "failed"
  mediaUrl?: string
  hashtags: string[]
  aiGenerated: boolean
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/20 border-blue-500/50 text-blue-400",
  pink: "bg-pink-500/20 border-pink-500/50 text-pink-400",
  indigo: "bg-indigo-500/20 border-indigo-500/50 text-indigo-400",
  red: "bg-red-500/20 border-red-500/50 text-red-400",
  gray: "bg-gray-500/20 border-gray-500/50 text-gray-400",
  green: "bg-green-500/20 border-green-500/50 text-green-400",
  yellow: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400",
  purple: "bg-purple-500/20 border-purple-500/50 text-purple-400",
  orange: "bg-orange-500/20 border-orange-500/50 text-orange-400",
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  published: "bg-green-500/20 text-green-400 border-green-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30",
}

const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    title: "Early Bird Launch Announcement",
    content: "🚀 Big news! WebinarForge AI Early Bird is LIVE. Get lifetime access for just $49 — only 500 spots available. Link in bio!",
    date: "2026-04-12",
    time: "09:00",
    platforms: ["facebook_personal", "instagram", "linkedin", "twitter"],
    contentType: "post",
    category: "promotional",
    status: "scheduled",
    hashtags: ["#WebinarForgeAI", "#EarlyBird", "#AIWebinar", "#OnlineBusiness"],
    aiGenerated: true,
  },
  {
    id: "2",
    title: "How AI Webinars Work - Reel",
    content: "Ever wondered how AI runs a webinar without you being live? Here is exactly how it works in 60 seconds...",
    date: "2026-04-13",
    time: "12:00",
    platforms: ["instagram_reels", "tiktok", "youtube_shorts"],
    contentType: "reel",
    category: "educational",
    status: "scheduled",
    hashtags: ["#AIMarketing", "#WebinarTips", "#PassiveIncome"],
    aiGenerated: true,
  },
  {
    id: "3",
    title: "Client Result Testimonial",
    content: "Sarah generated 312 leads in her first week using WebinarForge AI. Here is her story...",
    date: "2026-04-14",
    time: "15:00",
    platforms: ["facebook_page", "instagram", "linkedin"],
    contentType: "carousel",
    category: "testimonial",
    status: "draft",
    hashtags: ["#ClientResults", "#Success", "#Testimonial"],
    aiGenerated: false,
  },
  {
    id: "4",
    title: "Behind the Scenes - Building WebinarForge",
    content: "Taking you behind the scenes of how we built the AI that runs webinars 24/7...",
    date: "2026-04-15",
    time: "10:00",
    platforms: ["instagram_stories", "facebook_personal", "tiktok"],
    contentType: "story",
    category: "behindscenes",
    status: "draft",
    hashtags: ["#BehindTheScenes", "#Startup", "#BuildInPublic"],
    aiGenerated: false,
  },
  {
    id: "5",
    title: "5 Reasons Webinars Fail",
    content: "Most webinars fail because of these 5 reasons. Here is how to fix all of them with AI...",
    date: "2026-04-16",
    time: "11:00",
    platforms: ["linkedin", "twitter", "facebook_page"],
    contentType: "thread",
    category: "educational",
    status: "scheduled",
    hashtags: ["#WebinarTips", "#MarketingStrategy", "#ContentMarketing"],
    aiGenerated: true,
  },
]

export default function ContentCalendarPage() {
  const [view, setView] = useState<"calendar" | "list" | "grid">("calendar")
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPostModal, setShowPostModal] = useState<Post | null>(null)
  const [showCalendarSync, setShowCalendarSync] = useState(false)
  const [activeTab, setActiveTab] = useState<"create" | "ai">("create")
  const [syncedCalendars, setSyncedCalendars] = useState<string[]>([])
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiGenerating, setAiGenerating] = useState(false)
  const [filterPlatform, setFilterPlatform] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([])
  const [posting, setPosting] = useState(false)
  const [postSuccess, setPostSuccess] = useState("")
  const [postError, setPostError] = useState("")

  const [newPost, setNewPost] = useState<Partial<Post>>({
    platforms: [],
    contentType: "post",
    category: "educational",
    status: "draft",
    hashtags: [],
  })
  const [hashtagInput, setHashtagInput] = useState("")

  // Fetch connected platforms from Zernio
  useEffect(() => {
    fetch("/api/social/status")
      .then((r) => r.json())
      .then((data) => {
        setConnectedPlatforms(data.connected?.map((s: any) => s.platform) || [])
      })
      .catch(() => {})
  }, [])

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay()

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

  const getPostsForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return posts.filter((p) => p.date === dateStr)
  }

  const handleAIGenerate = async () => {
    if (!aiPrompt) return
    setAiGenerating(true)
    await new Promise((r) => setTimeout(r, 2000))
    const generated: Post = {
      id: Date.now().toString(),
      title: `AI: ${aiPrompt.slice(0, 40)}...`,
      content: `🤖 AI Generated: ${aiPrompt}\n\nHere is an engaging post about this topic that is designed to drive maximum engagement and conversions for your audience. The AI has optimized this for your selected platforms and content type.\n\n#AIContent #WebinarForgeAI`,
      date: selectedDate || new Date().toISOString().split("T")[0],
      time: "10:00",
      platforms: ["instagram", "facebook_personal", "linkedin", "twitter"],
      contentType: "post",
      category: "educational",
      status: "draft",
      hashtags: ["#AIContent", "#WebinarForgeAI", "#Marketing"],
      aiGenerated: true,
    }
    setPosts([...posts, generated])
    setAiGenerating(false)
    setAiPrompt("")
    setShowCreateModal(false)
  }

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content || !newPost.date) return
    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title || "",
      content: newPost.content || "",
      date: newPost.date || new Date().toISOString().split("T")[0],
      time: newPost.time || "09:00",
      platforms: newPost.platforms || [],
      contentType: newPost.contentType || "post",
      category: newPost.category || "educational",
      status: "scheduled",
      hashtags: newPost.hashtags || [],
      aiGenerated: false,
    }
    setPosts([...posts, post])
    setShowCreateModal(false)
    setNewPost({ platforms: [], contentType: "post", category: "educational", status: "draft", hashtags: [] })
  }

  const handlePublishNow = async (post: Post) => {
    const platformsToPost = post.platforms.filter((p) => connectedPlatforms.includes(p))

    if (platformsToPost.length === 0) {
      setPostError("No connected platforms selected. Connect your accounts in Social Settings first.")
      setTimeout(() => setPostError(""), 5000)
      setShowPostModal(null)
      return
    }

    setPosting(true)
    setShowPostModal(null)

    try {
      const res = await fetch("/api/social/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platforms: platformsToPost,
          content: post.content,
          hashtags: post.hashtags,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setPosts(posts.map((p) => p.id === post.id ? { ...p, status: "published" } : p))
        setPostSuccess(`✅ Published to ${platformsToPost.length} platform${platformsToPost.length > 1 ? "s" : ""}!`)
        setTimeout(() => setPostSuccess(""), 4000)
      } else {
        setPostError(data.error || "Failed to publish. Please try again.")
        setTimeout(() => setPostError(""), 4000)
      }
    } catch {
      setPostError("Failed to publish. Please check your connections.")
      setTimeout(() => setPostError(""), 4000)
    }
    setPosting(false)
  }

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id))
    setShowPostModal(null)
  }

  const handleSyncCalendar = (calendarId: string) => {
    setSyncedCalendars(
      syncedCalendars.includes(calendarId)
        ? syncedCalendars.filter((c) => c !== calendarId)
        : [...syncedCalendars, calendarId]
    )
  }

  const filteredPosts = posts.filter((p) => {
    const matchPlatform = filterPlatform === "all" || p.platforms.includes(filterPlatform)
    const matchStatus = filterStatus === "all" || p.status === filterStatus
    return matchPlatform && matchStatus
  })

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <section className="py-12 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">Content Calendar</h1>
              <p className="text-gray-400">Schedule, generate, and publish to all platforms in one place</p>
            </div>
            <div className="flex flex-wrap gap-3">

              {/* Connected platforms indicator */}
              <div className="flex items-center gap-2 border border-white/10 rounded-xl px-3 py-2">
                {connectedPlatforms.length > 0 ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400 font-semibold">
                      {connectedPlatforms.length} platform{connectedPlatforms.length > 1 ? "s" : ""} connected
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <span className="text-xs text-yellow-400 font-semibold">No platforms connected</span>
                  </>
                )}
              </div>

              <Link href="/dashboard/settings/social">
                <button className="flex items-center gap-2 border border-white/20 hover:border-purple-500 px-4 py-2 rounded-xl text-sm font-semibold transition">
                  🔗 Connect Accounts
                </button>
              </Link>
              <button
                onClick={() => setShowCalendarSync(true)}
                className="flex items-center gap-2 border border-white/20 hover:border-purple-500 px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                📅 Sync Calendar
                {syncedCalendars.length > 0 && (
                  <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {syncedCalendars.length}
                  </span>
                )}
              </button>
              <Link href="/content-calendar/bulk">
                <button className="flex items-center gap-2 border border-white/20 hover:border-purple-500 px-4 py-2 rounded-xl text-sm font-semibold transition">
                  📤 Bulk Upload
                </button>
              </Link>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-sm font-bold transition"
              >
                + Create Post
              </button>
              <button
                onClick={() => { setShowCreateModal(true); setActiveTab("ai") }}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-xl text-sm font-bold transition"
              >
                🤖 AI Generate
              </button>
            </div>
          </div>

          {/* Alerts */}
          {postSuccess && (
            <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm font-semibold">
              {postSuccess}
            </div>
          )}
          {postError && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-semibold flex items-center justify-between">
              <span>❌ {postError}</span>
              {postError.includes("Connect") && (
                <Link href="/dashboard/settings/social" className="text-xs underline text-red-300 ml-2">
                  Connect accounts →
                </Link>
              )}
            </div>
          )}

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            {[
              { label: "Total Posts", value: posts.length, color: "text-white" },
              { label: "Scheduled", value: posts.filter(p => p.status === "scheduled").length, color: "text-blue-400" },
              { label: "Published", value: posts.filter(p => p.status === "published").length, color: "text-green-400" },
              { label: "Drafts", value: posts.filter(p => p.status === "draft").length, color: "text-gray-400" },
              { label: "Connected", value: connectedPlatforms.length, color: "text-purple-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTROLS */}
      <section className="px-6 py-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            {[
              { id: "calendar", label: "📅 Calendar" },
              { id: "list", label: "📋 List" },
              { id: "grid", label: "⊞ Grid" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setView(id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${view === id ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Platforms</option>
              {PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </section>

      {/* CALENDAR VIEW */}
      {view === "calendar" && (
        <section className="px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1) }
                else setCurrentMonth(currentMonth - 1)
              }}
              className="p-2 hover:bg-white/10 rounded-xl transition"
            >←</button>
            <h2 className="text-xl font-bold">{MONTHS[currentMonth]} {currentYear}</h2>
            <button
              onClick={() => {
                if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1) }
                else setCurrentMonth(currentMonth + 1)
              }}
              className="p-2 hover:bg-white/10 rounded-xl transition"
            >→</button>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs text-gray-500 font-semibold py-2">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-28 rounded-xl" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayPosts = getPostsForDate(day)
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              const isToday = new Date().toISOString().split("T")[0] === dateStr
              return (
                <div
                  key={day}
                  onClick={() => { setSelectedDate(dateStr); setShowCreateModal(true) }}
                  className={`h-28 rounded-xl border p-2 cursor-pointer transition hover:border-purple-500 ${
                    isToday ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className={`text-sm font-bold mb-1 ${isToday ? "text-purple-400" : "text-gray-400"}`}>{day}</div>
                  <div className="space-y-1 overflow-hidden">
                    {dayPosts.slice(0, 2).map((post) => {
                      const platform = PLATFORMS.find((p) => post.platforms[0] === p.id)
                      return (
                        <div
                          key={post.id}
                          onClick={(e) => { e.stopPropagation(); setShowPostModal(post) }}
                          className={`text-xs px-2 py-0.5 rounded-full truncate border ${colorMap[platform?.color || "gray"]}`}
                        >
                          {post.title.slice(0, 15)}...
                        </div>
                      )
                    })}
                    {dayPosts.length > 2 && (
                      <div className="text-xs text-gray-500 pl-1">+{dayPosts.length - 2} more</div>
                    )}
                    {dayPosts.length === 0 && (
                      <div className="text-xs text-gray-700 pl-1">+ Add</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* LIST VIEW */}
      {view === "list" && (
        <section className="px-6 py-6 max-w-7xl mx-auto">
          <div className="space-y-3">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <div className="text-5xl mb-4">📭</div>
                <p>No posts found. Create your first post!</p>
              </div>
            ) : (
              filteredPosts
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setShowPostModal(post)}
                    className="bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-2xl p-5 cursor-pointer transition flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 text-center">
                      <div className="text-xs text-gray-500">{MONTHS[parseInt(post.date.split("-")[1]) - 1].slice(0, 3)}</div>
                      <div className="text-2xl font-black text-white">{post.date.split("-")[2]}</div>
                      <div className="text-xs text-gray-500">{post.time}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-white">{post.title}</h3>
                        {post.aiGenerated && (
                          <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full">🤖 AI</span>
                        )}
                        <span className={`text-xs border px-2 py-0.5 rounded-full ${statusColors[post.status]}`}>{post.status}</span>
                      </div>
                      <p className="text-gray-400 text-sm truncate mb-2">{post.content}</p>
                      <div className="flex flex-wrap gap-1">
                        {post.platforms.map((pid) => {
                          const platform = PLATFORMS.find((p) => p.id === pid)
                          const isConn = connectedPlatforms.includes(pid)
                          return platform ? (
                            <span key={pid} className={`text-xs border px-2 py-0.5 rounded-full ${colorMap[platform.color]} ${isConn ? "ring-1 ring-green-400/50" : ""}`}>
                              {platform.icon} {platform.name}{isConn ? " ●" : ""}
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                    <div className="flex-shrink-0">{CONTENT_TYPES.find((c) => c.id === post.contentType)?.icon}</div>
                  </div>
                ))
            )}
          </div>
        </section>
      )}

      {/* GRID VIEW */}
      {view === "grid" && (
        <section className="px-6 py-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setShowPostModal(post)}
                className="bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-2xl p-5 cursor-pointer transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs border px-2 py-0.5 rounded-full ${statusColors[post.status]}`}>{post.status}</span>
                  <span className="text-xl">{CONTENT_TYPES.find((c) => c.id === post.contentType)?.icon}</span>
                </div>
                <h3 className="font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-3 mb-3">{post.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>📅 {post.date} at {post.time}</span>
                  {post.aiGenerated && <span className="text-purple-400">🤖 AI</span>}
                </div>
                <div className="flex flex-wrap gap-1">
                  {post.platforms.slice(0, 3).map((pid) => {
                    const platform = PLATFORMS.find((p) => p.id === pid)
                    const isConn = connectedPlatforms.includes(pid)
                    return platform ? (
                      <span key={pid} className={`text-sm ${isConn ? "relative" : "opacity-60"}`}>
                        {platform.icon}
                        {isConn && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-black" />}
                      </span>
                    ) : null
                  })}
                  {post.platforms.length > 3 && <span className="text-xs text-gray-500">+{post.platforms.length - 3}</span>}
                </div>
              </div>
            ))}
            <div
              onClick={() => setShowCreateModal(true)}
              className="border-2 border-dashed border-white/10 hover:border-purple-500 rounded-2xl p-5 cursor-pointer transition flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-white min-h-[200px]"
            >
              <span className="text-4xl">+</span>
              <span className="text-sm font-semibold">Create New Post</span>
            </div>
          </div>
        </section>
      )}

      {/* CREATE / AI POST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8 overflow-y-auto">
          <div className="bg-[#0a0a0a] border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0a0a0a]">
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab("create")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "create" ? "bg-purple-600 text-white" : "text-gray-400"}`}
                >
                  ✏️ Create Post
                </button>
                <button
                  onClick={() => setActiveTab("ai")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "ai" ? "bg-amber-500 text-black" : "text-gray-400"}`}
                >
                  🤖 AI Generate
                </button>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>

            <div className="p-6 space-y-5">
              {activeTab === "ai" ? (
                <>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block font-semibold">What do you want to post about?</label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. Create a reel about how AI webinars make sales while you sleep, targeting coaches and consultants..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500 transition resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Content Type</label>
                      <select
                        value={newPost.contentType}
                        onChange={(e) => setNewPost({ ...newPost, contentType: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                      >
                        {CONTENT_TYPES.map((t) => (
                          <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Schedule Date</label>
                      <input
                        type="date"
                        value={newPost.date || selectedDate || ""}
                        onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      Select Platforms
                      {connectedPlatforms.length > 0 && (
                        <span className="ml-2 text-xs text-green-400">● = connected</span>
                      )}
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {PLATFORMS.map((platform) => {
                        const isConn = connectedPlatforms.includes(platform.id)
                        return (
                          <button
                            key={platform.id}
                            onClick={() => {
                              const current = newPost.platforms || []
                              setNewPost({
                                ...newPost,
                                platforms: current.includes(platform.id)
                                  ? current.filter((p) => p !== platform.id)
                                  : [...current, platform.id],
                              })
                            }}
                            className={`flex items-center gap-2 p-2 rounded-xl border text-sm transition ${
                              newPost.platforms?.includes(platform.id)
                                ? "border-purple-500 bg-purple-500/10 text-white"
                                : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30"
                            }`}
                          >
                            <span>{platform.icon}</span>
                            <span className="text-xs">{platform.name}</span>
                            {isConn
                              ? <span className="ml-auto text-green-400 text-xs font-bold">●</span>
                              : <span className="ml-auto text-gray-600 text-xs">○</span>
                            }
                          </button>
                        )
                      })}
                    </div>
                    {connectedPlatforms.length === 0 && (
                      <div className="mt-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-3 py-2">
                        <p className="text-xs text-yellow-400">
                          ⚠️ No platforms connected yet.{" "}
                          <Link href="/dashboard/settings/social" className="underline font-semibold" onClick={() => setShowCreateModal(false)}>
                            Connect your accounts →
                          </Link>
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleAIGenerate}
                    disabled={!aiPrompt || aiGenerating}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {aiGenerating ? (
                      <><div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />Generating...</>
                    ) : "🤖 Generate & Schedule Post →"}
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Post Title *</label>
                    <input
                      type="text"
                      value={newPost.title || ""}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="Give your post a title..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Content *</label>
                    <textarea
                      value={newPost.content || ""}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="Write your post content here..."
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Date *</label>
                      <input
                        type="date"
                        value={newPost.date || selectedDate || ""}
                        onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Time</label>
                      <input
                        type="time"
                        value={newPost.time || "09:00"}
                        onChange={(e) => setNewPost({ ...newPost, time: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Content Type</label>
                    <div className="grid grid-cols-4 gap-2">
                      {CONTENT_TYPES.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setNewPost({ ...newPost, contentType: type.id })}
                          className={`p-2 rounded-xl border text-center transition ${
                            newPost.contentType === type.id ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-white/5 hover:border-white/30"
                          }`}
                        >
                          <div className="text-xl mb-1">{type.icon}</div>
                          <div className="text-xs text-gray-400">{type.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Category</label>
                    <div className="grid grid-cols-4 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setNewPost({ ...newPost, category: cat.id })}
                          className={`p-2 rounded-xl border text-center transition ${
                            newPost.category === cat.id ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-white/5 hover:border-white/30"
                          }`}
                        >
                          <div className="text-lg mb-1">{cat.icon}</div>
                          <div className="text-xs text-gray-400">{cat.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      Platforms *
                      {connectedPlatforms.length > 0 && (
                        <span className="ml-2 text-xs text-green-400">● = connected</span>
                      )}
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {PLATFORMS.map((platform) => {
                        const isConn = connectedPlatforms.includes(platform.id)
                        return (
                          <button
                            key={platform.id}
                            onClick={() => {
                              const current = newPost.platforms || []
                              setNewPost({
                                ...newPost,
                                platforms: current.includes(platform.id)
                                  ? current.filter((p) => p !== platform.id)
                                  : [...current, platform.id],
                              })
                            }}
                            className={`flex items-center gap-2 p-2 rounded-xl border text-sm transition ${
                              newPost.platforms?.includes(platform.id)
                                ? "border-purple-500 bg-purple-500/10 text-white"
                                : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30"
                            }`}
                          >
                            <span>{platform.icon}</span>
                            <span className="text-xs">{platform.name}</span>
                            {isConn
                              ? <span className="ml-auto text-green-400 text-xs font-bold">●</span>
                              : <span className="ml-auto text-gray-600 text-xs">○</span>
                            }
                          </button>
                        )
                      })}
                    </div>
                    {connectedPlatforms.length === 0 && (
                      <div className="mt-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-3 py-2">
                        <p className="text-xs text-yellow-400">
                          ⚠️ No platforms connected yet.{" "}
                          <Link href="/dashboard/settings/social" className="underline font-semibold" onClick={() => setShowCreateModal(false)}>
                            Connect your accounts →
                          </Link>
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Hashtags</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && hashtagInput) {
                            const tag = hashtagInput.startsWith("#") ? hashtagInput : `#${hashtagInput}`
                            setNewPost({ ...newPost, hashtags: [...(newPost.hashtags || []), tag] })
                            setHashtagInput("")
                          }
                        }}
                        placeholder="Type hashtag and press Enter..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition text-sm"
                      />
                      <button
                        onClick={() => {
                          if (hashtagInput) {
                            const tag = hashtagInput.startsWith("#") ? hashtagInput : `#${hashtagInput}`
                            setNewPost({ ...newPost, hashtags: [...(newPost.hashtags || []), tag] })
                            setHashtagInput("")
                          }
                        }}
                        className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-xl text-sm transition"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newPost.hashtags?.map((tag) => (
                        <span
                          key={tag}
                          onClick={() => setNewPost({ ...newPost, hashtags: newPost.hashtags?.filter((t) => t !== tag) })}
                          className="text-xs bg-purple-500/20 border border-purple-500/30 text-purple-400 px-2 py-1 rounded-full cursor-pointer hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition"
                        >
                          {tag} ✕
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { handleCreatePost(); setNewPost({ ...newPost, status: "draft" }) }}
                      className="flex-1 border border-white/20 hover:border-white/50 py-3 rounded-xl font-semibold text-sm transition"
                    >
                      Save as Draft
                    </button>
                    <button
                      onClick={handleCreatePost}
                      disabled={!newPost.title || !newPost.content || !newPost.date}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
                    >
                      Schedule Post →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* POST DETAIL MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8">
          <div className="bg-[#0a0a0a] border border-white/20 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs border px-2 py-0.5 rounded-full ${statusColors[showPostModal.status]}`}>
                    {showPostModal.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {CONTENT_TYPES.find((c) => c.id === showPostModal.contentType)?.icon}{" "}
                    {CONTENT_TYPES.find((c) => c.id === showPostModal.contentType)?.label}
                  </span>
                  {showPostModal.aiGenerated && (
                    <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full">🤖 AI</span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">{showPostModal.title}</h2>
              </div>
              <button onClick={() => setShowPostModal(null)} className="text-gray-500 hover:text-white text-xl ml-4">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{showPostModal.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Scheduled For</p>
                  <p className="text-white font-semibold">{showPostModal.date} at {showPostModal.time}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Category</p>
                  <p className="text-white font-semibold">
                    {CATEGORIES.find((c) => c.id === showPostModal.category)?.icon}{" "}
                    {CATEGORIES.find((c) => c.id === showPostModal.category)?.label}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-2">Publishing To</p>
                <div className="flex flex-wrap gap-2">
                  {showPostModal.platforms.map((pid) => {
                    const platform = PLATFORMS.find((p) => p.id === pid)
                    const isConn = connectedPlatforms.includes(pid)
                    return platform ? (
                      <span key={pid} className={`text-xs border px-2 py-1 rounded-full ${colorMap[platform.color]} ${isConn ? "ring-1 ring-green-400/50" : "opacity-60"}`}>
                        {platform.icon} {platform.name} {isConn ? "✅" : "⚠️"}
                      </span>
                    ) : null
                  })}
                </div>
                {showPostModal.platforms.some(p => !connectedPlatforms.includes(p)) && (
                  <div className="mt-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-3 py-2">
                    <p className="text-xs text-yellow-400">
                      ⚠️ Some platforms not connected.{" "}
                      <Link href="/dashboard/settings/social" className="underline font-semibold" onClick={() => setShowPostModal(null)}>
                        Connect accounts →
                      </Link>
                    </p>
                  </div>
                )}
              </div>
              {showPostModal.hashtags.length > 0 && (
                <div>
                  <p className="text-gray-500 text-xs mb-2">Hashtags</p>
                  <div className="flex flex-wrap gap-2">
                    {showPostModal.hashtags.map((tag) => (
                      <span key={tag} className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handlePublishNow(showPostModal)}
                  disabled={posting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {posting ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Publishing...</>
                  ) : "🚀 Publish Now"}
                </button>
                <button
                  onClick={() => handleDeletePost(showPostModal.id)}
                  className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/30 font-semibold py-3 rounded-xl transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALENDAR SYNC MODAL */}
      {showCalendarSync && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#0a0a0a] border border-white/20 rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold">Sync Calendar</h2>
              <button onClick={() => setShowCalendarSync(false)} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-gray-400 text-sm mb-4">Connect your calendar apps to sync scheduled posts and get reminders.</p>
              {CALENDAR_APPS.map((app) => (
                <div key={app.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{app.icon}</span>
                    <span className="font-semibold">{app.name}</span>
                  </div>
                  <button
                    onClick={() => handleSyncCalendar(app.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      syncedCalendars.includes(app.id)
                        ? "bg-green-600/20 text-green-400 border border-green-600/30"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {syncedCalendars.includes(app.id) ? "✅ Connected" : "Connect"}
                  </button>
                </div>
              ))}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-4">
                <p className="text-amber-400 text-xs font-semibold mb-1">🔒 Early Bird Access Required</p>
                <p className="text-gray-400 text-xs">Calendar sync is available with full WebinarForge AI access. Get started for $49 one-time.</p>
                <Link href="/pricing">
                  <button className="mt-3 w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 rounded-xl text-sm transition">
                    Unlock Calendar Sync — $49 →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
