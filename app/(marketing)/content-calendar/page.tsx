"use client"

import { useState, useEffect, useRef } from "react"
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

const PLATFORM_SPECS: Record<string, {
  ratio: string
  ratioLabel: string
  maxChars: number
  captionStyle: string
  bgColor: string
  algorithm: string
}> = {
  instagram:         { ratio: "aspect-square",  ratioLabel: "1:1 Square",   maxChars: 2200,  captionStyle: "below",   bgColor: "bg-gradient-to-br from-purple-900 to-pink-900", algorithm: "instagram" },
  instagram_reels:   { ratio: "aspect-[9/16]",  ratioLabel: "9:16 Reels",   maxChars: 2200,  captionStyle: "overlay", bgColor: "bg-black", algorithm: "instagram_reels" },
  instagram_stories: { ratio: "aspect-[9/16]",  ratioLabel: "9:16 Story",   maxChars: 0,     captionStyle: "overlay", bgColor: "bg-black", algorithm: "instagram_reels" },
  tiktok:            { ratio: "aspect-[9/16]",  ratioLabel: "9:16 TikTok",  maxChars: 2200,  captionStyle: "overlay", bgColor: "bg-black", algorithm: "tiktok" },
  youtube_shorts:    { ratio: "aspect-[9/16]",  ratioLabel: "9:16 Shorts",  maxChars: 500,   captionStyle: "overlay", bgColor: "bg-black", algorithm: "youtube_shorts" },
  youtube:           { ratio: "aspect-video",   ratioLabel: "16:9 YouTube", maxChars: 5000,  captionStyle: "below",   bgColor: "bg-gray-900", algorithm: "youtube" },
  facebook_personal: { ratio: "aspect-video",   ratioLabel: "16:9 Facebook",maxChars: 63206, captionStyle: "below",   bgColor: "bg-blue-950", algorithm: "facebook" },
  facebook_page:     { ratio: "aspect-video",   ratioLabel: "16:9 Facebook",maxChars: 63206, captionStyle: "below",   bgColor: "bg-blue-950", algorithm: "facebook" },
  facebook_group:    { ratio: "aspect-video",   ratioLabel: "16:9 Facebook",maxChars: 63206, captionStyle: "below",   bgColor: "bg-blue-950", algorithm: "facebook" },
  linkedin:          { ratio: "aspect-video",   ratioLabel: "16:9 LinkedIn",maxChars: 3000,  captionStyle: "below",   bgColor: "bg-indigo-950", algorithm: "linkedin" },
  linkedin_page:     { ratio: "aspect-video",   ratioLabel: "16:9 LinkedIn",maxChars: 3000,  captionStyle: "below",   bgColor: "bg-indigo-950", algorithm: "linkedin" },
  twitter:           { ratio: "aspect-video",   ratioLabel: "16:9 Twitter", maxChars: 280,   captionStyle: "below",   bgColor: "bg-gray-950", algorithm: "twitter" },
  pinterest:         { ratio: "aspect-[2/3]",   ratioLabel: "2:3 Pinterest",maxChars: 500,   captionStyle: "below",   bgColor: "bg-red-950", algorithm: "pinterest" },
  threads:           { ratio: "aspect-square",  ratioLabel: "1:1 Threads",  maxChars: 500,   captionStyle: "below",   bgColor: "bg-gray-950", algorithm: "instagram" },
}

const ALGORITHM_PROMPTS: Record<string, string> = {
  tiktok: `You are a top 1% TikTok growth expert. TikTok's algorithm rewards: hooks in first 3 words, pattern interrupts, curiosity gaps, conversational tone, trending sounds references, challenges, duet invites, and FOMO. Keep it under 150 chars for display but allow up to 2200. Use 3-5 ultra-specific niche hashtags + 2-3 trending broad hashtags. Start with a HOOK that stops the scroll. Use lowercase for authenticity. End with a question or CTA that drives comments (comments = biggest signal).`,
  instagram_reels: `You are a top 1% Instagram Reels growth expert. IG Reels algorithm rewards: saves and shares above all else, relatable hooks, value-packed content, storytelling. First line must be a scroll-stopping hook under 125 chars (gets cut off). Use line breaks for readability. Mix niche hashtags (10K-500K posts) with broader ones. Include a strong save/share CTA. Emojis add personality. Aim for 3-5 sentences max before the hashtag block.`,
  instagram: `You are a top 1% Instagram growth expert. IG feed algorithm rewards saves and shares. Write a compelling 2-3 line caption with a hook, value, and CTA. Add a line break then hashtags. Use 20-25 hashtags mixing niche (10K-300K), mid (300K-1M), and broad. Include a question at the end to drive comments. Personal, authentic tone outperforms corporate speak.`,
  facebook: `You are a top 1% Facebook growth expert. Facebook algorithm rewards meaningful interactions — comments and shares. Write longer, story-driven captions that evoke emotion or debate. Ask a strong open-ended question. Avoid external links in the post body (kills reach). Use 2-3 relevant hashtags max. Emojis add visual breaks. Tag relevant pages when appropriate.`,
  linkedin: `You are a top 1% LinkedIn growth expert. LinkedIn algorithm rewards dwell time and comments. Use the "LinkedIn hook formula": bold first line that stops scrolling, then expand with a story or insight using short punchy paragraphs (1-2 sentences each). No hashtag spam — use 3-5 highly relevant professional hashtags. End with a thought-provoking question. Professional but human tone. Show vulnerability and expertise.`,
  twitter: `You are a top 1% Twitter/X growth expert. Twitter rewards retweets and replies. Under 280 chars total. Write a punchy, opinionated, or controversial take that makes people react. Use 1-2 hashtags max or none at all — organic performs better. Brevity is power. Make it quotable. End with a question or hot take.`,
  youtube: `You are a top 1% YouTube SEO expert. YouTube description should start with the most important keyword-rich sentence (first 2-3 lines shown before "more"). Include timestamps, links, and a strong subscribe CTA. Use keyword-rich sentences naturally. Include 3-5 hashtags at the very end. Write for both humans and the algorithm.`,
  youtube_shorts: `You are a top 1% YouTube Shorts growth expert. Shorts algorithm rewards watch completion and likes. Write a punchy 1-2 sentence caption with the main keyword + 3-5 hashtags including #Shorts. Keep it under 100 words. Strong hook in first line.`,
  pinterest: `You are a top 1% Pinterest growth expert. Pinterest is a search engine. Write SEO-optimized descriptions with primary keyword in first sentence. Include secondary keywords naturally. 2-3 hashtags max. Describe what value viewers get. Include a soft CTA.`,
}

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

const ZERNIO_PLATFORM_MAP: Record<string, string[]> = {
  facebook: ["facebook_personal", "facebook_page", "facebook_group"],
  instagram: ["instagram", "instagram_reels", "instagram_stories"],
  linkedin: ["linkedin", "linkedin_page"],
  tiktok: ["tiktok"],
  youtube: ["youtube", "youtube_shorts"],
  twitter: ["twitter"],
  pinterest: ["pinterest"],
  threads: ["threads"],
  reddit: ["reddit"],
  bluesky: ["bluesky"],
  googlebusiness: ["googlebusiness"],
  telegram: ["telegram"],
}

const EMOJIS = ["🔥","💡","🚀","✨","💪","🎯","📈","💰","🙌","❤️","😍","🤯","👀","⚡","🎬","📣","💥","🌟","👇","✅","🏆","💎","🤝","📱","🎉"]

type Post = {
  id: string
  title: string
  content: string
  platformCaptions: Record<string, string>
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
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]

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
  { id: "1", title: "Early Bird Launch Announcement", content: "🚀 Big news! WebinarForge AI Early Bird is LIVE. Get lifetime access for just $49 — only 500 spots available. Link in bio!", platformCaptions: {}, date: "2026-04-12", time: "09:00", platforms: ["facebook_personal", "instagram", "linkedin", "twitter"], contentType: "post", category: "promotional", status: "scheduled", hashtags: ["#WebinarForgeAI", "#EarlyBird", "#AIWebinar", "#OnlineBusiness"], aiGenerated: true },
  { id: "2", title: "How AI Webinars Work - Reel", content: "Ever wondered how AI runs a webinar without you being live? Here is exactly how it works in 60 seconds...", platformCaptions: {}, date: "2026-04-13", time: "12:00", platforms: ["instagram_reels", "tiktok", "youtube_shorts"], contentType: "reel", category: "educational", status: "scheduled", hashtags: ["#AIMarketing", "#WebinarTips", "#PassiveIncome"], aiGenerated: true },
  { id: "3", title: "Client Result Testimonial", content: "Sarah generated 312 leads in her first week using WebinarForge AI. Here is her story...", platformCaptions: {}, date: "2026-04-14", time: "15:00", platforms: ["facebook_page", "instagram", "linkedin"], contentType: "carousel", category: "testimonial", status: "draft", hashtags: ["#ClientResults", "#Success", "#Testimonial"], aiGenerated: false },
  { id: "4", title: "Behind the Scenes - Building WebinarForge", content: "Taking you behind the scenes of how we built the AI that runs webinars 24/7...", platformCaptions: {}, date: "2026-04-15", time: "10:00", platforms: ["instagram_stories", "facebook_personal", "tiktok"], contentType: "story", category: "behindscenes", status: "draft", hashtags: ["#BehindTheScenes", "#Startup", "#BuildInPublic"], aiGenerated: false },
  { id: "5", title: "5 Reasons Webinars Fail", content: "Most webinars fail because of these 5 reasons. Here is how to fix all of them with AI...", platformCaptions: {}, date: "2026-04-16", time: "11:00", platforms: ["linkedin", "twitter", "facebook_page"], contentType: "thread", category: "educational", status: "scheduled", hashtags: ["#WebinarTips", "#MarketingStrategy", "#ContentMarketing"], aiGenerated: true },
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
  const [activeTab, setActiveTab] = useState<"create" | "ai" | "preview">("create")
  const [syncedCalendars, setSyncedCalendars] = useState<string[]>([])
  const [filterPlatform, setFilterPlatform] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([])
  const [posting, setPosting] = useState(false)
  const [postSuccess, setPostSuccess] = useState("")
  const [postError, setPostError] = useState("")
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [previewPlatform, setPreviewPlatform] = useState("instagram")
  const [usePlatformCaptions, setUsePlatformCaptions] = useState(false)
  const [platformCaptions, setPlatformCaptions] = useState<Record<string, string>>({})
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [activeTextarea, setActiveTextarea] = useState<"main" | string>("main")
  const captionRef = useRef<HTMLTextAreaElement>(null)

  // AI Caption Generator state
  const [aiTopic, setAiTopic] = useState("")
  const [aiNiche, setAiNiche] = useState("")
  const [aiPlatforms, setAiPlatforms] = useState<string[]>(["instagram_reels", "tiktok"])
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiCaptions, setAiCaptions] = useState<Record<string, string>>({})
  const [aiHashtags, setAiHashtags] = useState<Record<string, string[]>>({})
  const [aiGenerated, setAiGenerated] = useState(false)
  const [selectedAiCaption, setSelectedAiCaption] = useState<string | null>(null)

  const [newPost, setNewPost] = useState<Partial<Post>>({
    platforms: [],
    contentType: "post",
    category: "educational",
    status: "draft",
    hashtags: [],
    platformCaptions: {},
  })
  const [hashtagInput, setHashtagInput] = useState("")

  useEffect(() => {
    fetch("/api/social/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.expandedPlatforms && data.expandedPlatforms.length > 0) {
          setConnectedPlatforms(data.expandedPlatforms)
          return
        }
        const rawPlatforms: string[] = data.connected?.map((s: any) =>
          (s.platform || s.network || s.type || "").toLowerCase()
        ).filter(Boolean) || []
        const expanded = rawPlatforms.flatMap((p) => ZERNIO_PLATFORM_MAP[p] || [p])
        setConnectedPlatforms(expanded)
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

  const normalizeDate = (date: string): string => {
    if (!date) return ""
    if (date.includes("/")) {
      const parts = date.split("/")
      if (parts.length === 3) return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`
    }
    return date
  }

  const insertAtCursor = (text: string) => {
    const textarea = captionRef.current
    if (!textarea) {
      setNewPost({ ...newPost, content: (newPost.content || "") + text })
      return
    }
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const current = newPost.content || ""
    const newContent = current.substring(0, start) + text + current.substring(end)
    setNewPost({ ...newPost, content: newContent })
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  const formatText = (type: "bold" | "italic" | "caps" | "lower") => {
    const textarea = captionRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = (newPost.content || "").substring(start, end)
    if (!selected) return
    let formatted = selected
    if (type === "caps") formatted = selected.toUpperCase()
    if (type === "lower") formatted = selected.toLowerCase()
    if (type === "bold") formatted = selected.split("").map(c => {
      const bold: Record<string, string> = { a:"𝗮",b:"𝗯",c:"𝗰",d:"𝗱",e:"𝗲",f:"𝗳",g:"𝗴",h:"𝗵",i:"𝗶",j:"𝗷",k:"𝗸",l:"𝗹",m:"𝗺",n:"𝗻",o:"𝗼",p:"𝗽",q:"𝗾",r:"𝗿",s:"𝘀",t:"𝘁",u:"𝘂",v:"𝘃",w:"𝘄",x:"𝘅",y:"𝘆",z:"𝘇",A:"𝗔",B:"𝗕",C:"𝗖",D:"𝗗",E:"𝗘",F:"𝗙",G:"𝗚",H:"𝗛",I:"𝗜",J:"𝗝",K:"𝗞",L:"𝗟",M:"𝗠",N:"𝗡",O:"𝗢",P:"𝗣",Q:"𝗤",R:"𝗥",S:"𝗦",T:"𝗧",U:"𝗨",V:"𝗩",W:"𝗪",X:"𝗫",Y:"𝗬",Z:"𝗭" }
      return bold[c] || c
    }).join("")
    if (type === "italic") formatted = selected.split("").map(c => {
      const italic: Record<string, string> = { a:"𝘢",b:"𝘣",c:"𝘤",d:"𝘥",e:"𝘦",f:"𝘧",g:"𝘨",h:"𝘩",i:"𝘪",j:"𝘫",k:"𝘬",l:"𝘭",m:"𝘮",n:"𝘯",o:"𝘰",p:"𝘱",q:"𝘲",r:"𝘳",s:"𝘴",t:"𝘵",u:"𝘶",v:"𝘷",w:"𝘸",x:"𝘹",y:"𝘺",z:"𝘻",A:"𝘈",B:"𝘉",C:"𝘊",D:"𝘋",E:"𝘌",F:"𝘍",G:"𝘎",H:"𝘏",I:"𝘐",J:"𝘑",K:"𝘒",L:"𝘓",M:"𝘔",N:"𝘕",O:"𝘖",P:"𝘗",Q:"𝘘",R:"𝘙",S:"𝘚",T:"𝘛",U:"𝘜",V:"𝘝",W:"𝘞",X:"𝘟",Y:"𝘠",Z:"𝘡" }
      return italic[c] || c
    }).join("")
    const current = newPost.content || ""
    setNewPost({ ...newPost, content: current.substring(0, start) + formatted + current.substring(end) })
  }

  // AI Caption Generator — calls internal API route (keeps API key secure)
  const handleAIGenerateCaptions = async () => {
    if (!aiTopic) return
    setAiGenerating(true)
    setAiGenerated(false)
    setAiCaptions({})
    setAiHashtags({})

    const platformsToGenerate = aiPlatforms.length > 0 ? aiPlatforms : ["instagram_reels", "tiktok"]

    try {
      const platformList = platformsToGenerate.map(pid => {
        const platform = PLATFORMS.find(p => p.id === pid)
        const spec = PLATFORM_SPECS[pid]
        const algoKey = spec?.algorithm || pid
        return { pid, name: platform?.name || pid, algoKey, maxChars: spec?.maxChars || 2200 }
      })

      const response = await fetch("/api/ai/captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          niche: aiNiche,
          contentType: newPost.contentType,
          category: newPost.category,
          platforms: platformList,
          algorithmPrompts: ALGORITHM_PROMPTS,
        }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || "API request failed")
      }

      const parsed = await response.json()

      if (parsed.error) throw new Error(parsed.error)

      setAiCaptions(parsed.captions || {})
      setAiHashtags(parsed.hashtags || {})
      setAiGenerated(true)

      // Auto-select first platform caption
      const firstPid = platformList[0]?.pid
      if (firstPid && parsed.captions?.[firstPid]) {
        setSelectedAiCaption(firstPid)
      }

    } catch (err: any) {
      console.error("AI generation failed:", err)
      // Show error to user
      setPostError(`AI generation failed: ${err.message || "Please try again."}`)
      setTimeout(() => setPostError(""), 5000)
    }

    setAiGenerating(false)
  }

  const applyAICaptions = () => {
    if (!aiGenerated) return
    const firstPid = aiPlatforms[0]
    const mainCaption = aiCaptions[firstPid] || Object.values(aiCaptions)[0] || ""
    const mainHashtags = aiHashtags[firstPid] || Object.values(aiHashtags)[0] || []

    setNewPost({
      ...newPost,
      content: mainCaption,
      hashtags: mainHashtags,
      platforms: aiPlatforms,
    })

    const caps: Record<string, string> = {}
    aiPlatforms.forEach(pid => {
      if (aiCaptions[pid]) caps[pid] = aiCaptions[pid]
    })
    setPlatformCaptions(caps)
    setUsePlatformCaptions(Object.keys(caps).length > 1)
    setActiveTab("create")
  }

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content || !newPost.date) return
    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title || "",
      content: newPost.content || "",
      platformCaptions: usePlatformCaptions ? platformCaptions : {},
      date: normalizeDate(newPost.date),
      time: newPost.time || "09:00",
      platforms: newPost.platforms || [],
      contentType: newPost.contentType || "post",
      category: newPost.category || "educational",
      status: "scheduled",
      hashtags: newPost.hashtags || [],
      mediaUrl: mediaPreview || undefined,
      aiGenerated: false,
    }
    setPosts([...posts, post])
    setShowCreateModal(false)
    setMediaFile(null)
    setMediaPreview(null)
    setPlatformCaptions({})
    setUsePlatformCaptions(false)
    setAiGenerated(false)
    setAiCaptions({})
    setAiHashtags({})
    setNewPost({ platforms: [], contentType: "post", category: "educational", status: "draft", hashtags: [], platformCaptions: {} })
  }

  const handlePublishNow = async (post: Post) => {
    const zernioIds = Object.entries(ZERNIO_PLATFORM_MAP)
      .filter(([, calIds]) => post.platforms.some((p) => calIds.includes(p)))
      .map(([zernioId]) => zernioId)
    if (zernioIds.length === 0) {
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
        body: JSON.stringify({ platforms: zernioIds, content: post.content, hashtags: post.hashtags, mediaUrl: post.mediaUrl }),
      })
      const data = await res.json()
      if (data.success) {
        setPosts(posts.map((p) => p.id === post.id ? { ...p, status: "published" } : p))
        setPostSuccess(`✅ Published to ${zernioIds.length} platform${zernioIds.length > 1 ? "s" : ""}!`)
        setTimeout(() => setPostSuccess(""), 4000)
      } else {
        setPostError(data.error || "Failed to publish.")
        setTimeout(() => setPostError(""), 4000)
      }
    } catch { setPostError("Failed to publish."); setTimeout(() => setPostError(""), 4000) }
    setPosting(false)
  }

  const handleDeletePost = (id: string) => { setPosts(posts.filter((p) => p.id !== id)); setShowPostModal(null) }
  const handleSyncCalendar = (calendarId: string) => {
    setSyncedCalendars(syncedCalendars.includes(calendarId) ? syncedCalendars.filter((c) => c !== calendarId) : [...syncedCalendars, calendarId])
  }

  const filteredPosts = posts.filter((p) => {
    const matchPlatform = filterPlatform === "all" || p.platforms.includes(filterPlatform)
    const matchStatus = filterStatus === "all" || p.status === filterStatus
    return matchPlatform && matchStatus
  })

  const currentPreviewSpec = PLATFORM_SPECS[previewPlatform] || PLATFORM_SPECS["instagram"]
  const previewCaption = usePlatformCaptions && platformCaptions[previewPlatform] ? platformCaptions[previewPlatform] : (newPost.content || "")
  const previewHashtags = newPost.hashtags?.join(" ") || ""
  const fullPreviewText = [previewCaption, previewHashtags].filter(Boolean).join("\n\n")
  const charCount = fullPreviewText.length
  const maxChars = currentPreviewSpec.maxChars
  const isOverLimit = maxChars > 0 && charCount > maxChars

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
              <div className="flex items-center gap-2 border border-white/10 rounded-xl px-3 py-2">
                {connectedPlatforms.length > 0 ? (
                  <><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /><span className="text-xs text-green-400 font-semibold">{connectedPlatforms.length} platform{connectedPlatforms.length > 1 ? "s" : ""} connected</span></>
                ) : (
                  <><div className="w-2 h-2 bg-yellow-400 rounded-full" /><span className="text-xs text-yellow-400 font-semibold">No platforms connected</span></>
                )}
              </div>
              <Link href="/dashboard/settings/social"><button className="flex items-center gap-2 border border-white/20 hover:border-purple-500 px-4 py-2 rounded-xl text-sm font-semibold transition">🔗 Connect Accounts</button></Link>
              <button onClick={() => setShowCalendarSync(true)} className="flex items-center gap-2 border border-white/20 hover:border-purple-500 px-4 py-2 rounded-xl text-sm font-semibold transition">
                📅 Sync Calendar {syncedCalendars.length > 0 && <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">{syncedCalendars.length}</span>}
              </button>
              <Link href="/content-calendar/bulk"><button className="flex items-center gap-2 border border-white/20 hover:border-purple-500 px-4 py-2 rounded-xl text-sm font-semibold transition">📤 Bulk Upload</button></Link>
              <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-sm font-bold transition">+ Create Post</button>
              <button onClick={() => { setShowCreateModal(true); setActiveTab("ai") }} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-xl text-sm font-bold transition">🤖 AI Generate</button>
            </div>
          </div>

          {postSuccess && <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm font-semibold">{postSuccess}</div>}
          {postError && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-semibold flex items-center justify-between">
              <span>❌ {postError}</span>
              {postError.includes("Connect") && <Link href="/dashboard/settings/social" className="text-xs underline text-red-300 ml-2">Connect accounts →</Link>}
            </div>
          )}

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
            {[{ id: "calendar", label: "📅 Calendar" }, { id: "list", label: "📋 List" }, { id: "grid", label: "⊞ Grid" }].map(({ id, label }) => (
              <button key={id} onClick={() => setView(id as any)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${view === id ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}>{label}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500">
              <option value="all">All Platforms</option>
              {PLATFORMS.map((p) => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500">
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
            <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1) } else setCurrentMonth(currentMonth - 1) }} className="p-2 hover:bg-white/10 rounded-xl transition">←</button>
            <h2 className="text-xl font-bold">{MONTHS[currentMonth]} {currentYear}</h2>
            <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1) } else setCurrentMonth(currentMonth + 1) }} className="p-2 hover:bg-white/10 rounded-xl transition">→</button>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS.map((day) => <div key={day} className="text-center text-xs text-gray-500 font-semibold py-2">{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="h-28 rounded-xl" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayPosts = getPostsForDate(day)
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              const isToday = new Date().toISOString().split("T")[0] === dateStr
              return (
                <div key={day} onClick={() => { setSelectedDate(dateStr); setShowCreateModal(true) }}
                  className={`h-28 rounded-xl border p-2 cursor-pointer transition hover:border-purple-500 ${isToday ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                  <div className={`text-sm font-bold mb-1 ${isToday ? "text-purple-400" : "text-gray-400"}`}>{day}</div>
                  <div className="space-y-1 overflow-hidden">
                    {dayPosts.slice(0, 2).map((post) => {
                      const platform = PLATFORMS.find((p) => post.platforms[0] === p.id)
                      return <div key={post.id} onClick={(e) => { e.stopPropagation(); setShowPostModal(post) }} className={`text-xs px-2 py-0.5 rounded-full truncate border ${colorMap[platform?.color || "gray"]}`}>{post.title.slice(0, 15)}...</div>
                    })}
                    {dayPosts.length > 2 && <div className="text-xs text-gray-500 pl-1">+{dayPosts.length - 2} more</div>}
                    {dayPosts.length === 0 && <div className="text-xs text-gray-700 pl-1">+ Add</div>}
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
              <div className="text-center py-20 text-gray-500"><div className="text-5xl mb-4">📭</div><p>No posts found. Create your first post!</p></div>
            ) : (
              filteredPosts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((post) => (
                <div key={post.id} onClick={() => setShowPostModal(post)} className="bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-2xl p-5 cursor-pointer transition flex items-start gap-4">
                  <div className="flex-shrink-0 text-center">
                    <div className="text-xs text-gray-500">{MONTHS[parseInt(post.date.split("-")[1]) - 1].slice(0, 3)}</div>
                    <div className="text-2xl font-black text-white">{post.date.split("-")[2]}</div>
                    <div className="text-xs text-gray-500">{post.time}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-white">{post.title}</h3>
                      {post.aiGenerated && <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full">🤖 AI</span>}
                      <span className={`text-xs border px-2 py-0.5 rounded-full ${statusColors[post.status]}`}>{post.status}</span>
                      {post.mediaUrl && <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">📎 Media</span>}
                    </div>
                    <p className="text-gray-400 text-sm truncate mb-2">{post.content}</p>
                    <div className="flex flex-wrap gap-1">
                      {post.platforms.map((pid) => {
                        const platform = PLATFORMS.find((p) => p.id === pid)
                        const isConn = connectedPlatforms.includes(pid)
                        return platform ? <span key={pid} className={`text-xs border px-2 py-0.5 rounded-full ${colorMap[platform.color]} ${isConn ? "ring-1 ring-green-400/50" : ""}`}>{platform.icon} {platform.name}{isConn ? " ●" : ""}</span> : null
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
              <div key={post.id} onClick={() => setShowPostModal(post)} className="bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-2xl p-5 cursor-pointer transition">
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
                    return platform ? <span key={pid} className={`text-sm ${isConn ? "" : "opacity-50"}`}>{platform.icon}</span> : null
                  })}
                  {post.platforms.length > 3 && <span className="text-xs text-gray-500">+{post.platforms.length - 3}</span>}
                </div>
              </div>
            ))}
            <div onClick={() => setShowCreateModal(true)} className="border-2 border-dashed border-white/10 hover:border-purple-500 rounded-2xl p-5 cursor-pointer transition flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-white min-h-[200px]">
              <span className="text-4xl">+</span>
              <span className="text-sm font-semibold">Create New Post</span>
            </div>
          </div>
        </section>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8 overflow-y-auto">
          <div className="bg-[#0a0a0a] border border-white/20 rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">

            {/* Header Tabs */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10">
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                <button onClick={() => setActiveTab("create")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "create" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}>✏️ Create</button>
                <button onClick={() => setActiveTab("ai")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "ai" ? "bg-amber-500 text-black" : "text-gray-400 hover:text-white"}`}>🤖 AI Captions</button>
                <button onClick={() => setActiveTab("preview")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "preview" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>👁 Preview</button>
              </div>
              <button onClick={() => { setShowCreateModal(false); setMediaFile(null); setMediaPreview(null); setPlatformCaptions({}); setUsePlatformCaptions(false); setAiGenerated(false) }} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>

            {/* AI CAPTIONS TAB */}
            {activeTab === "ai" && (
              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-5">
                  <h3 className="font-black text-amber-400 text-lg mb-1">🔥 Viral Caption Generator</h3>
                  <p className="text-gray-400 text-sm">Describe your video/content and AI will generate platform-optimized captions tuned to each algorithm — engineered to reach the top 1% of creators in your niche.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block font-semibold">What is your video/post about? *</label>
                    <textarea value={aiTopic} onChange={(e) => setAiTopic(e.target.value)}
                      placeholder="e.g. I show how I made $10k in 30 days using AI webinars while working only 2 hours a day — step by step breakdown..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500 transition resize-none text-sm" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block font-semibold">Your Niche / Industry</label>
                      <input type="text" value={aiNiche} onChange={(e) => setAiNiche(e.target.value)}
                        placeholder="e.g. online business, AI tools, coaching, real estate..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500 transition text-sm" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block font-semibold">Content Type</label>
                      <select value={newPost.contentType} onChange={(e) => setNewPost({ ...newPost, contentType: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 text-sm">
                        {CONTENT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Platform Selection for AI */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block font-semibold">Generate captions for these platforms:</label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {PLATFORMS.filter(p => PLATFORM_SPECS[p.id]).map((platform) => (
                      <button key={platform.id}
                        onClick={() => setAiPlatforms(aiPlatforms.includes(platform.id) ? aiPlatforms.filter(p => p !== platform.id) : [...aiPlatforms, platform.id])}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs transition ${aiPlatforms.includes(platform.id) ? "border-amber-500 bg-amber-500/10 text-white" : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30"}`}>
                        <span>{platform.icon}</span>
                        <span>{platform.name.split(" ")[0]}</span>
                        {aiPlatforms.includes(platform.id) && <span className="ml-auto text-amber-400">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleAIGenerateCaptions} disabled={!aiTopic || aiGenerating || aiPlatforms.length === 0}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black py-4 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-3 text-base">
                  {aiGenerating ? (
                    <><div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />Analyzing algorithms & generating viral captions...</>
                  ) : "🚀 Generate Viral Captions →"}
                </button>

                {/* Generated Captions Results */}
                {aiGenerated && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-lg">✅ Your Viral Captions</h3>
                      <button onClick={applyAICaptions}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-xl text-sm transition">
                        Use These Captions →
                      </button>
                    </div>

                    <div className="space-y-4">
                      {aiPlatforms.filter(pid => aiCaptions[pid]).map((pid) => {
                        const platform = PLATFORMS.find(p => p.id === pid)
                        const spec = PLATFORM_SPECS[pid]
                        const caption = aiCaptions[pid] || ""
                        const tags = aiHashtags[pid] || []
                        const isSelected = selectedAiCaption === pid
                        return (
                          <div key={pid}
                            onClick={() => setSelectedAiCaption(isSelected ? null : pid)}
                            className={`border rounded-2xl p-4 cursor-pointer transition ${isSelected ? "border-amber-500 bg-amber-500/5" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{platform?.icon}</span>
                                <div>
                                  <p className="font-bold text-white text-sm">{platform?.name}</p>
                                  <p className="text-xs text-gray-500">{spec?.ratioLabel} · {spec?.maxChars > 0 ? `${caption.length}/${spec.maxChars} chars` : `${caption.length} chars`}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full font-semibold">
                                  🔥 Viral Optimized
                                </span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(caption + "\n\n" + tags.join(" ")) }}
                                  className="text-xs border border-white/20 hover:border-white/50 text-gray-400 hover:text-white px-2 py-1 rounded-lg transition">
                                  Copy
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed mb-3 line-clamp-6">
                              {caption}
                            </p>
                            {tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {tags.map((tag) => (
                                  <span key={tag} className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <button onClick={applyAICaptions} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition text-sm">
                      ✅ Apply All Captions & Go to Create Post →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CREATE TAB */}
            {activeTab === "create" && (
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Post Title *</label>
                  <input type="text" value={newPost.title || ""}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Give your post a title..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition" />
                </div>

                {/* Caption Editor with Toolbar */}
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Caption *</label>

                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-1 bg-white/5 border border-white/10 border-b-0 rounded-t-xl px-3 py-2 flex-wrap">
                    <button onClick={() => formatText("bold")} title="Bold (select text first)" className="px-2 py-1 rounded hover:bg-white/10 transition text-sm font-black text-white">𝗕</button>
                    <button onClick={() => formatText("italic")} title="Italic (select text first)" className="px-2 py-1 rounded hover:bg-white/10 transition text-sm italic text-white">𝘐</button>
                    <button onClick={() => formatText("caps")} title="ALL CAPS (select text first)" className="px-2 py-1 rounded hover:bg-white/10 transition text-xs font-bold text-gray-400 hover:text-white">AA</button>
                    <button onClick={() => formatText("lower")} title="lowercase (select text first)" className="px-2 py-1 rounded hover:bg-white/10 transition text-xs text-gray-400 hover:text-white">aa</button>
                    <div className="w-px h-4 bg-white/20 mx-1" />
                    <button onClick={() => insertAtCursor("\n\n")} title="Line break" className="px-2 py-1 rounded hover:bg-white/10 transition text-xs text-gray-400 hover:text-white">↵</button>
                    <button onClick={() => insertAtCursor("👉 ")} className="px-2 py-1 rounded hover:bg-white/10 transition text-sm">👉</button>
                    <button onClick={() => insertAtCursor("✅ ")} className="px-2 py-1 rounded hover:bg-white/10 transition text-sm">✅</button>
                    <button onClick={() => insertAtCursor("🔥 ")} className="px-2 py-1 rounded hover:bg-white/10 transition text-sm">🔥</button>
                    <button onClick={() => insertAtCursor("💡 ")} className="px-2 py-1 rounded hover:bg-white/10 transition text-sm">💡</button>
                    <button onClick={() => insertAtCursor("🚀 ")} className="px-2 py-1 rounded hover:bg-white/10 transition text-sm">🚀</button>
                    <button onClick={() => insertAtCursor("💰 ")} className="px-2 py-1 rounded hover:bg-white/10 transition text-sm">💰</button>
                    <button onClick={() => insertAtCursor("⚡ ")} className="px-2 py-1 rounded hover:bg-white/10 transition text-sm">⚡</button>
                    <button onClick={() => insertAtCursor("🎯 ")} className="px-2 py-1 rounded hover:bg-white/10 transition text-sm">🎯</button>
                    <div className="w-px h-4 bg-white/20 mx-1" />
                    <div className="relative">
                      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="px-2 py-1 rounded hover:bg-white/10 transition text-xs text-gray-400 hover:text-white flex items-center gap-1">
                        😀 <span className="text-xs">More</span>
                      </button>
                      {showEmojiPicker && (
                        <div className="absolute top-8 left-0 bg-[#1a1a1a] border border-white/20 rounded-xl p-3 z-20 grid grid-cols-5 gap-2 w-44 shadow-2xl">
                          {EMOJIS.map((emoji) => (
                            <button key={emoji} onClick={() => { insertAtCursor(emoji + " "); setShowEmojiPicker(false) }}
                              className="text-xl hover:bg-white/10 rounded-lg p-1 transition">{emoji}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="ml-auto text-xs text-gray-600">{(newPost.content || "").length} chars</div>
                  </div>

                  <textarea
                    ref={captionRef}
                    value={newPost.content || ""}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Write your caption here, or use 🤖 AI Captions to generate viral platform-optimized captions..."
                    rows={6}
                    className="w-full bg-white/5 border border-white/10 rounded-b-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition resize-none" />

                  {aiGenerated && (
                    <div className="mt-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 flex items-center justify-between">
                      <p className="text-xs text-amber-400">🔥 AI viral captions generated! Platform-specific captions are ready.</p>
                      <button onClick={() => setActiveTab("ai")} className="text-xs text-amber-400 underline">View captions →</button>
                    </div>
                  )}
                </div>

                {/* Per-Platform Caption Toggle */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-white text-sm">Customize Caption Per Platform</p>
                      <p className="text-xs text-gray-500">Different captions for each platform's algorithm</p>
                    </div>
                    <button onClick={() => setUsePlatformCaptions(!usePlatformCaptions)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${usePlatformCaptions ? "bg-purple-600" : "bg-white/20"}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${usePlatformCaptions ? "translate-x-7" : "translate-x-1"}`} />
                    </button>
                  </div>
                  {usePlatformCaptions && (
                    <div className="space-y-3 mt-4">
                      {(newPost.platforms || []).map((pid) => {
                        const platform = PLATFORMS.find((p) => p.id === pid)
                        const spec = PLATFORM_SPECS[pid]
                        if (!platform || !spec) return null
                        const caption = platformCaptions[pid] || ""
                        const count = caption.length
                        const over = spec.maxChars > 0 && count > spec.maxChars
                        return (
                          <div key={pid} className="bg-black/30 border border-white/10 rounded-xl p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span>{platform.icon}</span>
                                <span className="text-sm font-semibold text-white">{platform.name}</span>
                                <span className="text-xs text-gray-500">{spec.ratioLabel}</span>
                                {aiCaptions[pid] && <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">🔥 AI Ready</span>}
                              </div>
                              <div className="flex items-center gap-2">
                                {aiCaptions[pid] && (
                                  <button onClick={() => setPlatformCaptions({ ...platformCaptions, [pid]: aiCaptions[pid] + "\n\n" + (aiHashtags[pid] || []).join(" ") })}
                                    className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-lg hover:bg-amber-500/30 transition">
                                    Use AI Caption
                                  </button>
                                )}
                                <span className={`text-xs font-mono ${over ? "text-red-400" : "text-gray-500"}`}>{count}{spec.maxChars > 0 ? `/${spec.maxChars}` : ""}</span>
                              </div>
                            </div>
                            <textarea value={caption} onChange={(e) => setPlatformCaptions({ ...platformCaptions, [pid]: e.target.value })}
                              placeholder={`Caption for ${platform.name}...`} rows={3}
                              className={`w-full bg-white/5 border rounded-xl px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none transition resize-none text-sm ${over ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-purple-500"}`} />
                            {over && <p className="text-xs text-red-400 mt-1">⚠️ Over limit by {count - spec.maxChars} chars</p>}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Media Upload */}
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Media (Image or Video — optional)</label>
                  {mediaPreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-white/10">
                      {mediaFile?.type.startsWith("video/") ? (
                        <video src={mediaPreview} controls className="w-full max-h-48 object-cover" />
                      ) : (
                        <img src={mediaPreview} alt="preview" className="w-full max-h-48 object-cover" />
                      )}
                      <button onClick={() => { setMediaFile(null); setMediaPreview(null) }}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm transition">✕</button>
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">{mediaFile?.name}</div>
                      <button onClick={() => setActiveTab("preview")}
                        className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-lg font-semibold transition">👁 Preview</button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-purple-500 rounded-xl p-6 cursor-pointer transition group">
                      <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/mov,video/avi,video/quicktime" className="hidden"
                        onChange={(e) => { const file = e.target.files?.[0]; if (file) { setMediaFile(file); setMediaPreview(URL.createObjectURL(file)) } }} />
                      <span className="text-3xl mb-2 group-hover:scale-110 transition">📎</span>
                      <span className="text-sm text-gray-400 group-hover:text-white transition font-semibold">Click to upload image or video</span>
                      <span className="text-xs text-gray-600 mt-1">JPG, PNG, GIF, WebP, MP4, MOV up to 500MB</span>
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Date *</label>
                    <input type="date" value={newPost.date || selectedDate || ""}
                      onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Time</label>
                    <input type="time" value={newPost.time || "09:00"}
                      onChange={(e) => setNewPost({ ...newPost, time: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500" />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Content Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {CONTENT_TYPES.map((type) => (
                      <button key={type.id} onClick={() => setNewPost({ ...newPost, contentType: type.id })}
                        className={`p-2 rounded-xl border text-center transition ${newPost.contentType === type.id ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-white/5 hover:border-white/30"}`}>
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
                      <button key={cat.id} onClick={() => setNewPost({ ...newPost, category: cat.id })}
                        className={`p-2 rounded-xl border text-center transition ${newPost.category === cat.id ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-white/5 hover:border-white/30"}`}>
                        <div className="text-lg mb-1">{cat.icon}</div>
                        <div className="text-xs text-gray-400">{cat.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    Platforms *
                    {connectedPlatforms.length > 0 && <span className="ml-2 text-xs text-green-400">● = connected</span>}
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {PLATFORMS.map((platform) => {
                      const isConn = connectedPlatforms.includes(platform.id)
                      return (
                        <button key={platform.id}
                          onClick={() => {
                            const current = newPost.platforms || []
                            setNewPost({ ...newPost, platforms: current.includes(platform.id) ? current.filter((p) => p !== platform.id) : [...current, platform.id] })
                          }}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-sm transition ${newPost.platforms?.includes(platform.id) ? "border-purple-500 bg-purple-500/10 text-white" : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30"}`}>
                          <span>{platform.icon}</span>
                          <span className="text-xs">{platform.name}</span>
                          {isConn ? <span className="ml-auto text-green-400 text-xs font-bold">●</span> : <span className="ml-auto text-gray-600 text-xs">○</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Hashtags</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={hashtagInput} onChange={(e) => setHashtagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && hashtagInput) {
                          const tag = hashtagInput.startsWith("#") ? hashtagInput : `#${hashtagInput}`
                          setNewPost({ ...newPost, hashtags: [...(newPost.hashtags || []), tag] })
                          setHashtagInput("")
                        }
                      }}
                      placeholder="Type hashtag and press Enter..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition text-sm" />
                    <button onClick={() => { if (hashtagInput) { const tag = hashtagInput.startsWith("#") ? hashtagInput : `#${hashtagInput}`; setNewPost({ ...newPost, hashtags: [...(newPost.hashtags || []), tag] }); setHashtagInput("") } }}
                      className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-xl text-sm transition">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newPost.hashtags?.map((tag) => (
                      <span key={tag} onClick={() => setNewPost({ ...newPost, hashtags: newPost.hashtags?.filter((t) => t !== tag) })}
                        className="text-xs bg-purple-500/20 border border-purple-500/30 text-purple-400 px-2 py-1 rounded-full cursor-pointer hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition">
                        {tag} ✕
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => { setNewPost({ ...newPost, status: "draft" }); handleCreatePost() }} className="flex-1 border border-white/20 hover:border-white/50 py-3 rounded-xl font-semibold text-sm transition">Save as Draft</button>
                  <button onClick={handleCreatePost} disabled={!newPost.title || !newPost.content || !newPost.date}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed">
                    Schedule Post →
                  </button>
                </div>
              </div>
            )}

            {/* PREVIEW TAB */}
            {activeTab === "preview" && (
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-56 flex-shrink-0">
                    <p className="text-sm text-gray-400 font-semibold mb-3">Preview Platform</p>
                    <div className="space-y-2">
                      {(newPost.platforms && newPost.platforms.length > 0 ? newPost.platforms : ["instagram", "instagram_reels", "tiktok", "facebook_personal", "linkedin", "twitter"]).map((pid) => {
                        const platform = PLATFORMS.find((p) => p.id === pid)
                        const spec = PLATFORM_SPECS[pid]
                        if (!platform || !spec) return null
                        return (
                          <button key={pid} onClick={() => setPreviewPlatform(pid)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm transition ${previewPlatform === pid ? "border-blue-500 bg-blue-500/10 text-white" : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30"}`}>
                            <span className="text-lg">{platform.icon}</span>
                            <div className="text-left">
                              <p className="text-xs font-semibold">{platform.name}</p>
                              <p className="text-xs text-gray-500">{spec.ratioLabel}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-white">
                        {PLATFORMS.find(p => p.id === previewPlatform)?.icon}{" "}
                        {PLATFORMS.find(p => p.id === previewPlatform)?.name} Preview
                        <span className="ml-2 text-xs text-gray-500">{currentPreviewSpec.ratioLabel}</span>
                      </p>
                      <span className={`text-xs font-mono px-2 py-1 rounded-lg ${isOverLimit ? "bg-red-500/20 text-red-400" : "bg-white/5 text-gray-400"}`}>
                        {charCount}{maxChars > 0 ? `/${maxChars}` : ""} chars
                      </span>
                    </div>

                    <div className={`relative ${currentPreviewSpec.ratio} w-full max-w-xs mx-auto rounded-2xl overflow-hidden ${currentPreviewSpec.bgColor} border border-white/10`}>
                      {mediaPreview ? (
                        <>
                          {mediaFile?.type.startsWith("video/") ? (
                            <video src={mediaPreview} controls className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <img src={mediaPreview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                          )}
                          {currentPreviewSpec.captionStyle === "overlay" && previewCaption && (
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                              <p className="text-white text-xs font-semibold leading-relaxed line-clamp-4">{previewCaption}</p>
                              {newPost.hashtags && newPost.hashtags.length > 0 && (
                                <p className="text-blue-300 text-xs mt-1 line-clamp-1">{newPost.hashtags.join(" ")}</p>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <span className="text-5xl opacity-30">{PLATFORMS.find(p => p.id === previewPlatform)?.icon}</span>
                          <p className="text-gray-500 text-xs text-center px-4">Upload media to see preview</p>
                          <p className="text-gray-600 text-xs">{currentPreviewSpec.ratioLabel}</p>
                        </div>
                      )}
                      {(previewPlatform === "tiktok" || previewPlatform === "instagram_reels" || previewPlatform === "youtube_shorts") && (
                        <div className="absolute right-3 bottom-20 flex flex-col gap-4 items-center">
                          {[{ icon: "❤️", count: "12.4K" }, { icon: "💬", count: "847" }, { icon: "↗️", count: "Share" }].map(({ icon, count }) => (
                            <div key={icon} className="flex flex-col items-center gap-1">
                              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">{icon}</div>
                              <span className="text-white text-xs">{count}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {currentPreviewSpec.captionStyle === "below" && (
                      <div className="mt-4 max-w-xs mx-auto bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">WF</div>
                          <div>
                            <p className="text-white text-xs font-bold">WebinarForge AI</p>
                            <p className="text-gray-500 text-xs">Just now</p>
                          </div>
                        </div>
                        <p className="text-white text-xs leading-relaxed whitespace-pre-wrap line-clamp-6">
                          {previewCaption || <span className="text-gray-600">Your caption will appear here...</span>}
                        </p>
                        {newPost.hashtags && newPost.hashtags.length > 0 && (
                          <p className="text-blue-400 text-xs mt-2">{newPost.hashtags.join(" ")}</p>
                        )}
                      </div>
                    )}

                    {isOverLimit && (
                      <div className="mt-3 max-w-xs mx-auto bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
                        <p className="text-xs text-red-400">⚠️ {charCount - maxChars} chars over the {PLATFORMS.find(p => p.id === previewPlatform)?.name} limit</p>
                      </div>
                    )}

                    <div className="flex gap-3 mt-4 max-w-xs mx-auto">
                      <button onClick={() => setActiveTab("create")} className="flex-1 border border-white/20 hover:border-purple-500 py-2 rounded-xl text-sm font-semibold transition text-gray-400 hover:text-white">← Edit</button>
                      <button onClick={handleCreatePost} disabled={!newPost.title || !newPost.content || !newPost.date}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-xl transition text-sm disabled:opacity-50">Schedule →</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                  <span className={`text-xs border px-2 py-0.5 rounded-full ${statusColors[showPostModal.status]}`}>{showPostModal.status}</span>
                  <span className="text-xs text-gray-500">{CONTENT_TYPES.find((c) => c.id === showPostModal.contentType)?.icon} {CONTENT_TYPES.find((c) => c.id === showPostModal.contentType)?.label}</span>
                  {showPostModal.aiGenerated && <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full">🤖 AI</span>}
                </div>
                <h2 className="text-xl font-bold text-white">{showPostModal.title}</h2>
              </div>
              <button onClick={() => setShowPostModal(null)} className="text-gray-500 hover:text-white text-xl ml-4">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{showPostModal.content}</p>
              </div>
              {showPostModal.platformCaptions && Object.keys(showPostModal.platformCaptions).length > 0 && (
                <div>
                  <p className="text-gray-500 text-xs mb-2 font-semibold">Platform-Specific Captions</p>
                  <div className="space-y-2">
                    {Object.entries(showPostModal.platformCaptions).map(([pid, caption]) => {
                      const platform = PLATFORMS.find((p) => p.id === pid)
                      return platform ? (
                        <div key={pid} className="bg-white/5 border border-white/10 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1">{platform.icon} {platform.name}</p>
                          <p className="text-white text-xs">{caption}</p>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-500 text-xs mb-1">Scheduled For</p><p className="text-white font-semibold">{showPostModal.date} at {showPostModal.time}</p></div>
                <div><p className="text-gray-500 text-xs mb-1">Category</p><p className="text-white font-semibold">{CATEGORIES.find((c) => c.id === showPostModal.category)?.icon} {CATEGORIES.find((c) => c.id === showPostModal.category)?.label}</p></div>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-2">Publishing To</p>
                <div className="flex flex-wrap gap-2">
                  {showPostModal.platforms.map((pid) => {
                    const platform = PLATFORMS.find((p) => p.id === pid)
                    const isConn = connectedPlatforms.includes(pid)
                    return platform ? <span key={pid} className={`text-xs border px-2 py-1 rounded-full ${colorMap[platform.color]} ${isConn ? "ring-1 ring-green-400/50" : "opacity-60"}`}>{platform.icon} {platform.name} {isConn ? "✅" : "⚠️"}</span> : null
                  })}
                </div>
              </div>
              {showPostModal.hashtags.length > 0 && (
                <div>
                  <p className="text-gray-500 text-xs mb-2">Hashtags</p>
                  <div className="flex flex-wrap gap-2">
                    {showPostModal.hashtags.map((tag) => <span key={tag} className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-1 rounded-full">{tag}</span>)}
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => handlePublishNow(showPostModal)} disabled={posting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                  {posting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Publishing...</> : "🚀 Publish Now"}
                </button>
                <button onClick={() => handleDeletePost(showPostModal.id)} className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/30 font-semibold py-3 rounded-xl transition text-sm">Delete</button>
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
                  <div className="flex items-center gap-3"><span className="text-2xl">{app.icon}</span><span className="font-semibold">{app.name}</span></div>
                  <button onClick={() => handleSyncCalendar(app.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${syncedCalendars.includes(app.id) ? "bg-green-600/20 text-green-400 border border-green-600/30" : "bg-purple-600 hover:bg-purple-700 text-white"}`}>
                    {syncedCalendars.includes(app.id) ? "✅ Connected" : "Connect"}
                  </button>
                </div>
              ))}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-4">
                <p className="text-amber-400 text-xs font-semibold mb-1">🔒 Early Bird Access Required</p>
                <p className="text-gray-400 text-xs">Calendar sync is available with full WebinarForge AI access. Get started for $49 one-time.</p>
                <Link href="/pricing"><button className="mt-3 w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 rounded-xl text-sm transition">Unlock Calendar Sync — $49 →</button></Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
