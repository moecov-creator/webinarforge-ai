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
