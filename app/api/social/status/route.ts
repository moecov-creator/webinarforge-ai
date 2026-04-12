import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

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

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ connected: [], profileExists: false })
    }

    // Query connections directly from the master account
    const res = await fetch("https://api.zernio.com/v1/connections", {
      headers: {
        "Authorization": `Bearer ${process.env.ZERNIO_API_KEY}`,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ connected: [], profileExists: false })
    }

    const data = await res.json()

    // Extract platform names from connections
    const connections = Array.isArray(data) ? data : (data.connections || data.data || [])
    
    const rawPlatforms: string[] = connections
      .filter((c: any) => c.status === "connected" || c.connected === true || !c.status)
      .map((c: any) => (c.platform || c.network || c.type || "").toLowerCase())
      .filter(Boolean)

    const expanded = rawPlatforms.flatMap((p: string) => ZERNIO_PLATFORM_MAP[p] || [p])

    return NextResponse.json({
      profileExists: true,
      connected: connections.map((c: any) => ({ platform: c.platform || c.network || c.type })),
      expandedPlatforms: expanded,
      rawCount: rawPlatforms.length,
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ connected: [], profileExists: false })
  }
}
