import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

const ZERNIO_BASE = "https://api.zernio.com/v1"

// Maps our internal platform IDs to what Zernio actually accepts
// Zernio uses: facebook, instagram, linkedin, tiktok, youtube, twitter, pinterest
const PLATFORM_TO_ZERNIO: Record<string, string> = {
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
  twitter:            "twitter",
  pinterest:          "pinterest",
  threads:            "threads",
}

async function getZernioProfileId(): Promise<string | null> {
  try {
    const res = await fetch(`${ZERNIO_BASE}/profiles`, {
      headers: {
        "Authorization": `Bearer ${process.env.ZERNIO_API_KEY}`,
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) {
      console.error("Zernio profiles fetch failed:", res.status, await res.text())
      return null
    }
    const data = await res.json()
    console.log("Zernio profiles response:", JSON.stringify(data).slice(0, 300))

    if (Array.isArray(data) && data.length > 0) {
      return data[0].id || data[0].profileId || data[0]._id || null
    }
    const list = data.profiles || data.data || data.items || []
    if (list.length > 0) {
      return list[0].id || list[0].profileId || list[0]._id || null
    }
    return null
  } catch (err) {
    console.error("Failed to fetch Zernio profiles:", err)
    return null
  }
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

    // Convert our platform IDs to Zernio platform names, deduplicate
    const zernioPlatforms = [...new Set(
      platforms
        .map((p: string) => PLATFORM_TO_ZERNIO[p] || p)
        .filter(Boolean)
    )]

    if (zernioPlatforms.length === 0) {
      return NextResponse.json({ error: "No valid Zernio platforms found" }, { status: 400 })
    }

    // Get profile ID
    let profileId = process.env.ZERNIO_PROFILE_ID || null
    if (!profileId) {
      profileId = await getZernioProfileId()
    }
    if (!profileId) {
      return NextResponse.json(
        { error: "Could not get Zernio profile ID. Set ZERNIO_PROFILE_ID in Vercel environment variables." },
        { status: 500 }
      )
    }

    const fullContent = hashtags && hashtags.length > 0
      ? `${content}\n\n${hashtags.join(" ")}`
      : content

    // Only include real hosted URLs — blob: URLs cannot be fetched externally
    const hostedMedia = (mediaUrls || []).filter((u: string) => 
      u && !u.startsWith("blob:") && u.startsWith("http")
    )

    const body: Record<string, any> = {
      platforms: zernioPlatforms,
      content: fullContent,
      profileId,
    }

    if (hostedMedia.length > 0) {
      body.mediaUrls = hostedMedia
    }

    if (scheduledAt) {
      body.scheduledAt = scheduledAt
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
    console.log("Zernio response status:", res.status)
    console.log("Zernio response body:", responseText)

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
