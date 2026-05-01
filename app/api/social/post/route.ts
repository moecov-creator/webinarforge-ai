import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

const ZERNIO_BASE = "https://zernio.com/api/v1"

const ZERNIO_ACCOUNTS: Record<string, string> = {
  facebook:  "69dc0ab07dea335c2be0b2d9",
  instagram: "69dc0b357dea335c2be0b4fe",
  linkedin:  "69dc0b597dea335c2be0b5a2",
  tiktok:    "69dc0b6a7dea335c2be0b5e7",
  youtube:   "69dc0bcd7dea335c2be0b775",
}

const PLATFORM_MAP: Record<string, { zernioName: string; contentType?: string; requiresMedia?: boolean }> = {
  facebook:           { zernioName: "facebook" },
  facebook_personal:  { zernioName: "facebook" },
  facebook_page:      { zernioName: "facebook" },
  facebook_group:     { zernioName: "facebook" },
  instagram:          { zernioName: "instagram", requiresMedia: true },
  instagram_reels:    { zernioName: "instagram", contentType: "reels", requiresMedia: true },
  instagram_stories:  { zernioName: "instagram", contentType: "story", requiresMedia: true },
  linkedin:           { zernioName: "linkedin" },
  linkedin_page:      { zernioName: "linkedin" },
  tiktok:             { zernioName: "tiktok", requiresMedia: true },
  youtube:            { zernioName: "youtube", requiresMedia: true },
  youtube_shorts:     { zernioName: "youtube" },
  twitter:            { zernioName: "twitter" },
  pinterest:          { zernioName: "pinterest", requiresMedia: true },
  threads:            { zernioName: "threads" },
  reddit:             { zernioName: "reddit" },
  bluesky:            { zernioName: "bluesky" },
  googlebusiness:     { zernioName: "googlebusiness" },
  telegram:           { zernioName: "telegram" },
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { platforms, content, mediaUrls, scheduledAt, hashtags } = await req.json()

    console.log("Incoming platforms:", platforms)

    if (!platforms || platforms.length === 0) {
      return NextResponse.json({ error: "No platforms selected" }, { status: 400 })
    }
    if (!content) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 })
    }

    const hostedMedia: string[] = (mediaUrls || []).filter(
      (u: string) => u && !u.startsWith("blob:") && u.startsWith("http")
    )

    const seen = new Set<string>()
    const platformsPayload: Record<string, any>[] = []
    const skippedPlatforms: string[] = []

    for (const p of platforms) {
      const mapping = PLATFORM_MAP[p]
      if (!mapping) {
        console.log("No mapping for platform:", p)
        continue
      }

      const { zernioName, contentType, requiresMedia } = mapping
      const accountId = ZERNIO_ACCOUNTS[zernioName]
      if (!accountId) {
        console.log("No account ID for:", zernioName)
        continue
      }

      if (requiresMedia && hostedMedia.length === 0) {
        skippedPlatforms.push(p)
        continue
      }

      const key = `${zernioName}:${contentType || "feed"}`
      if (seen.has(key)) continue
      seen.add(key)

      const entry: Record<string, any> = { platform: zernioName, accountId }
      if (contentType) {
        entry.platformSpecificData = { contentType }
        if (contentType === "reels") entry.platformSpecificData.shareToFeed = true
      }

      platformsPayload.push(entry)
    }

    console.log("Platforms payload:", JSON.stringify(platformsPayload))

    if (platformsPayload.length === 0) {
      if (skippedPlatforms.length > 0) {
        return NextResponse.json({
          error: "Instagram, TikTok, and YouTube require a media file. Please upload a file or select Facebook or LinkedIn instead.",
        }, { status: 400 })
      }
      return NextResponse.json({ error: "No valid platforms found" }, { status: 400 })
    }

    const fullContent = hashtags && hashtags.length > 0
      ? `${content}\n\n${hashtags.join(" ")}`
      : content

    const body: Record<string, any> = {
      content: fullContent,
      platforms: platformsPayload,
      publishNow: !scheduledAt,
    }

    if (scheduledAt) body.scheduledFor = scheduledAt

    if (hostedMedia.length > 0) {
      body.mediaItems = hostedMedia.map((url: string) => {
        const isVideo = /\.(mp4|mov|avi|webm|mkv)$/i.test(url)
        return { type: isVideo ? "video" : "image", url }
      })
    }

    console.log("Zernio POST body:", JSON.stringify(body))

    const res = await fetch(`${ZERNIO_BASE}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ZERNIO_API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    const responseText = await res.text()
    console.log("Zernio response:", res.status, responseText.slice(0, 500))

    let data: any = {}
    try { data = JSON.parse(responseText) } catch { data = { raw: responseText } }

    if (!res.ok) {
      const errMsg = data.message || data.error || data.raw || `Zernio error ${res.status}`
      return NextResponse.json({ error: errMsg }, { status: res.status })
    }

    const response: Record<string, any> = { success: true, post: data }
    if (skippedPlatforms.length > 0) {
      response.warning = `Published to ${platformsPayload.length} platform(s). Skipped ${skippedPlatforms.join(", ")} — these require a media file.`
    }

    return NextResponse.json(response)

  } catch (err) {
    console.error("Social post route error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
