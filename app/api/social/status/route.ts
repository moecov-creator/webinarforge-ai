import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

const ZERNIO_BASE = "https://zernio.com/api/v1"

// ─── Your Zernio account IDs ──────────────────────────────────────────────────
// These were found in your Zernio API Code document.
// Order matches how they appear in your Zernio Connections dashboard:
// Facebook (Strategic Leverage AI), Instagram (@mauricecovingtonsr),
// LinkedIn (@Maurice Covington), TikTok (@mauricecovington1), YouTube (@mcmarketinggroup)
const ZERNIO_ACCOUNTS = {
  facebook:  "69dc0ab07dea335c2be0b2d9",
  instagram: "69dc0b357dea335c2be0b4fe",
  linkedin:  "69dc0b597dea335c2be0b5a2",
  tiktok:    "69dc0b6a7dea335c2be0b5e7",
  youtube:   "69dc0bcd7dea335c2be0b775",
}

// Maps our internal platform IDs → Zernio platform name
const PLATFORM_TO_ZERNIO: Record<string, keyof typeof ZERNIO_ACCOUNTS> = {
  facebook_personal:  "facebook",
  facebook_page:      "facebook",
  facebook_group:     "facebook",
  instagram:          "instagram",
  instagram_reels:    "instagram",
  instagram_stories:  "instagram",
  linkedin:           "linkedin",
  linkedin_page:      "linkedin",
  tiktok:             "tiktok",
  youtube:            "youtube",
  youtube_shorts:     "youtube",
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

    // Build the platforms array with real accountIds, deduplicated
    const seen = new Set<string>()
    const platformsWithIds: { platform: string; accountId: string }[] = []

    for (const p of platforms) {
      const zernioName = PLATFORM_TO_ZERNIO[p]
      if (!zernioName) continue
      if (seen.has(zernioName)) continue
      seen.add(zernioName)
      platformsWithIds.push({
        platform: zernioName,
        accountId: ZERNIO_ACCOUNTS[zernioName],
      })
    }

    if (platformsWithIds.length === 0) {
      return NextResponse.json(
        { error: "None of the selected platforms are supported. Choose from: Facebook, Instagram, LinkedIn, TikTok, or YouTube." },
        { status: 400 }
      )
    }

    const fullContent = hashtags && hashtags.length > 0
      ? `${content}\n\n${hashtags.join(" ")}`
      : content

    const body: Record<string, any> = {
      content: fullContent,
      platforms: platformsWithIds,
      publishNow: !scheduledAt,
    }

    if (scheduledAt) {
      body.scheduledFor = scheduledAt
    }

    // Only include real hosted URLs — blob: URLs cannot be fetched by Zernio
    const hostedMedia = (mediaUrls || []).filter(
      (u: string) => u && !u.startsWith("blob:") && u.startsWith("http")
    )
    if (hostedMedia.length > 0) {
      body.mediaItems = hostedMedia.map((url: string) => ({
        type: "image",
        url,
      }))
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

    return NextResponse.json({ success: true, post: data })

  } catch (err) {
    console.error("Social post route error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
