import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

const ZERNIO_BASE = "https://api.zernio.com/v1"

// Fetch the first active profile ID from Zernio
async function getZernioProfileId(): Promise<string | null> {
  try {
    const res = await fetch(`${ZERNIO_BASE}/profiles`, {
      headers: {
        "Authorization": `Bearer ${process.env.ZERNIO_API_KEY}`,
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) return null
    const data = await res.json()

    // Handle array response: [{ id, name, ... }]
    if (Array.isArray(data) && data.length > 0) {
      return data[0].id || data[0].profileId || data[0]._id || null
    }
    // Handle object response: { profiles: [...] } or { data: [...] }
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

    // Use env var if set, otherwise fetch dynamically from Zernio
    let profileId = process.env.ZERNIO_PROFILE_ID || null

    if (!profileId) {
      profileId = await getZernioProfileId()
    }

    if (!profileId) {
      return NextResponse.json(
        { error: "Could not determine Zernio profile ID. Set ZERNIO_PROFILE_ID in your environment variables." },
        { status: 500 }
      )
    }

    const fullContent = hashtags && hashtags.length > 0
      ? `${content}\n\n${hashtags.join(" ")}`
      : content

    const body: Record<string, any> = {
      platforms,
      content: fullContent,
      profileId,
    }

    // Only include real hosted URLs — blob: URLs cannot be fetched by Zernio
    if (mediaUrls && mediaUrls.length > 0) {
      const hosted = mediaUrls.filter((u: string) => !u.startsWith("blob:"))
      if (hosted.length > 0) body.mediaUrls = hosted
    }

    if (scheduledAt) {
      body.scheduledAt = scheduledAt
    }

    console.log("Posting to Zernio with profileId:", profileId, "platforms:", platforms)

    const res = await fetch(`${ZERNIO_BASE}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ZERNIO_API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    console.log("Zernio response:", res.status, data)

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || data.error || `Zernio returned ${res.status}` },
        { status: res.status }
      )
    }

    return NextResponse.json({ success: true, post: data })

  } catch (err) {
    console.error("Social post error:", err)
    return NextResponse.json({ error: "Failed to post" }, { status: 500 })
  }
}
