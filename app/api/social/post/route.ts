import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { platforms, content, mediaUrls, scheduledAt, hashtags } = await req.json()

    if (!platforms || platforms.length === 0) {
      return NextResponse.json({ error: "No platforms selected" }, { status: 400 })
    }

    if (!content) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 })
    }

    const profileId = `wf-${user.id}`

    const fullContent = hashtags && hashtags.length > 0
      ? `${content}\n\n${hashtags.join(" ")}`
      : content

    const body: Record<string, any> = {
      platforms,
      content: fullContent,
      profileId,
    }

    if (mediaUrls && mediaUrls.length > 0) {
      body.mediaUrls = mediaUrls
    }

    if (scheduledAt) {
      body.scheduledAt = scheduledAt
    }

    const res = await fetch("https://api.zernio.com/v1/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ZERNIO_API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data.message || "Failed to post" }, { status: res.status })
    }

    return NextResponse.json({ success: true, post: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to post" }, { status: 500 })
  }
}
