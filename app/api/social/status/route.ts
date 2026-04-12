import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

// Hardcoded connected platforms while we debug Zernio API response
const CONNECTED_ZERNIO_PLATFORMS = [
  "facebook",
  "instagram", 
  "linkedin",
  "tiktok",
  "youtube",
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
}

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ connected: [], profileExists: false })
    }

    const expanded = CONNECTED_ZERNIO_PLATFORMS.flatMap(
      (p) => ZERNIO_PLATFORM_MAP[p] || [p]
    )

    return NextResponse.json({
      profileExists: true,
      connected: CONNECTED_ZERNIO_PLATFORMS.map((p) => ({ platform: p })),
      expandedPlatforms: expanded,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ connected: [], profileExists: false })
  }
}
