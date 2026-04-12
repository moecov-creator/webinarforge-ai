import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { platform } = await req.json()
    const profileId = `wf-${user.id}`

    const res = await fetch(`https://api.zernio.com/v1/profiles/${profileId}/connect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ZERNIO_API_KEY}`,
      },
      body: JSON.stringify({
        platform,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.webinarforge.ai"}/dashboard/settings/social?connected=${platform}`,
      }),
    })

    const data = await res.json()

    if (data.connectUrl) {
      return NextResponse.json({ connectUrl: data.connectUrl })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to initiate connection" }, { status: 500 })
  }
}
