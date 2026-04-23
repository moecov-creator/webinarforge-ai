import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

const ZERNIO_BASE = "https://zernio.com/api/v1"

// Your Zernio account IDs from your API doc
const ZERNIO_ACCOUNTS: Record<string, string> = {
  facebook:  "69dc0ab07dea335c2be0b2d9",
  instagram: "69dc0b357dea335c2be0b4fe",
  linkedin:  "69dc0b597dea335c2be0b5a2",
  tiktok:    "69dc0b6a7dea335c2be0b5e7",
  youtube:   "69dc0bcd7dea335c2be0b775",
}

// Maps our internal platform IDs to Zernio platform names + optional contentType
const PLATFORM_MAP: Record<string, {
  zernioName: string
  contentType?: string
  requiresMedia?: boolean
}> = {
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
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { platforms, content, mediaUrls, scheduledAt, hashtags } = await req.json()

    if (!platforms || platforms.length === 0) {
      return NextResponse.json({ error: "No platforms selected" }, { status: 400 })
    }
    if (!content) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 })
    }

    // Only include real hosted URLs — blob: URLs can't be fetched by Zernio
    const hostedMedia: string[] = (mediaUrls || []).filter(
      (u: string) => u && !u.startsWith("blob:") && u.startsWith("http")
    )

    // Build the platforms array, deduplicated by Zernio platform name
    const seen = new Set<string>()
    const platformsPayload: Record<string, any>[] = []
    const skippedPlatforms: string[] = []

    for (const p of platforms) {
      const mapping = PLATFORM_MAP[p]
      if (!mapping) continue

      const { zernioName, contentType, requiresMedia } = mapping
      const accountId = ZERNIO_ACCOUNTS[zernioName]
      if (!accountId) continue

      // Instagram, TikTok, YouTube require media — skip if no hosted media
      if (requiresMedia && hostedMedia.length === 0) {
        skippedPlatforms.push(p)
        continue
      }

      // Deduplicate — but allow same platform with different contentType
      const key = `${zernioName}:${contentType || "feed"}`
      if (seen.has(key)) continue
      seen.add(key)

      const entry: Record<string, any> = { platform: zernioName, accountId }

      if (contentType) {
        entry.platformSpecificData = { contentType }
        // For reels, also share to feed by default
        if (contentType === "reels") {
          entry.platformSpecificData.shareToFeed = true
        }
      }

      platformsPayload.push(entry)
    }

    if (platformsPayload.length === 0) {
      // All platforms required media but none was provided
      if (skippedPlatforms.length > 0) {
        return NextResponse.json({
          error: "Instagram, TikTok, and YouTube require a media file (image or video). Text-only posts are not supported on these platforms. Please upload an image or video, or select Facebook or LinkedIn instead.",
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

    if (scheduledAt) {
      body.scheduledFor = scheduledAt
    }

    if (hostedMedia.length > 0) {
      // Detect if it's a video based on URL extension
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

    // Warn if some platforms were skipped due to missing media
    const response: Record<string, any> = { success: true, post: data }
    if (skippedPlatforms.length > 0) {
      response.warning = `Post published to ${platformsPayload.length} platform(s). Skipped ${skippedPlatforms.join(", ")} — these require a media file.`
    }

    return NextResponse.json(response)

  } catch (err) {
    console.error("Social post route error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
