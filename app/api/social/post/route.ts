import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

const ZERNIO_BASE = "https://zernio.com/api/v1"

// Your Zernio account IDs
const ZERNIO_ACCOUNTS: Record<string, string> = {
  facebook:  "69dc0ab07dea335c2be0b2d9",
  instagram: "69dc0b357dea335c2be0b4fe",
  linkedin:  "69dc0b597dea335c2be0b5a2",
  tiktok:    "69dc0b6a7dea335c2be0b5e7",
  youtube:   "69dc0bcd7dea335c2be0b775",
}

// Maps our internal platform IDs to Zernio platform names
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

    const hostedMedia: string[] = (mediaUrls || []).filter(
      (u: string) => u && !u.startsWith("blob:") && u.startsWith("http")
    )

    const seen = new Set<string>()
    const platformsPayload: Record<string, any>[] = []
    const skippedPlatforms: string[] = []

    for (const p of platforms) {
      const mapping = PLATFORM_MAP[p]
      if (!mapping) continue

      const { zernioName, contentType, requiresMedia } = mapping
      const accountId = ZERNIO_ACCOUNTS[zernioName]
      if (!accountId) continue

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
        if (contentType === "reels") {
          entry.platformSpecificData.shareToFeed = true
        }
      }

      platformsPayload.push(entry)
    }

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

// Your Zernio account IDs
const ZERNIO_ACCOUNTS: Record<string, string> = {
  facebook:  "69dc0ab07dea335c2be0b2d9",
  instagram: "69dc0b357dea335c2be0b4fe",
  linkedin:  "69dc0b597dea335c2be0b5a2",
  tiktok:    "69dc0b6a7dea335c2be0b5e7",
  youtube:   "69dc0bcd7dea335c2be0b775",
}

// Maps Zernio platform names to our internal expanded platform IDs
const ZERNIO_PLATFORM_MAP: Record<string, string[]> = {
  facebook:  ["facebook_personal", "facebook_page", "facebook_group"],
  instagram: ["instagram", "instagram_reels", "instagram_stories"],
  linkedin:  ["linkedin", "linkedin_page"],
  tiktok:    ["tiktok"],
  youtube:   ["youtube", "youtube_shorts"],
  twitter:   ["twitter"],
  pinterest: ["pinterest"],
  threads:   ["threads"],
}

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Call Zernio to get connected accounts
    const res = await fetch(`${ZERNIO_BASE}/accounts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ZERNIO_API_KEY}`,
      },
    })

    if (!res.ok) {
      // Fallback — check which account IDs are in our map and return those as connected
      const connectedZernio = Object.keys(ZERNIO_ACCOUNTS)
      const expandedPlatforms = connectedZernio.flatMap(
        (p) => ZERNIO_PLATFORM_MAP[p] || []
      )
      return NextResponse.json({
        connected: connectedZernio.map((p) => ({ platform: p })),
        expandedPlatforms,
      })
    }

    const data = await res.json()

    // Zernio returns an array of connected accounts
    const accounts: any[] = Array.isArray(data) ? data : (data.accounts || data.data || [])

    // Match returned accounts against our known account IDs
    const connectedZernioNames = Object.entries(ZERNIO_ACCOUNTS)
      .filter(([name, id]) =>
        accounts.some(
          (a: any) =>
            a._id === id ||
            a.id === id ||
            (a.platform || "").toLowerCase() === name
        )
      )
      .map(([name]) => name)

    // If Zernio returned accounts but we couldn't match IDs, fall back to platform names
    const finalConnected =
      connectedZernioNames.length > 0
        ? connectedZernioNames
        : accounts.map((a: any) => (a.platform || a.network || "").toLowerCase()).filter(Boolean)

    const expandedPlatforms = finalConnected.flatMap(
      (p) => ZERNIO_PLATFORM_MAP[p] || [p]
    )

    return NextResponse.json({
      connected: finalConnected.map((p) => ({ platform: p })),
      expandedPlatforms,
    })

  } catch (err) {
    console.error("Social status route error:", err)

    // Fallback — return all known platforms as connected so UI works
    const connectedZernio = Object.keys(ZERNIO_ACCOUNTS)
    const expandedPlatforms = connectedZernio.flatMap(
      (p) => ZERNIO_PLATFORM_MAP[p] || []
    )
    return NextResponse.json({
      connected: connectedZernio.map((p) => ({ platform: p })),
      expandedPlatforms,
    })
  }
}
