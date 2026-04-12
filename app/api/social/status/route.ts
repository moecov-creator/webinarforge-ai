import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const profileId = `wf-${user.id}`

    const res = await fetch(`https://api.zernio.com/v1/profiles/${profileId}`, {
      headers: {
        "Authorization": `Bearer ${process.env.ZERNIO_API_KEY}`,
      },
    })

    if (res.status === 404) {
      return NextResponse.json({ connected: [], profileExists: false })
    }

    const data = await res.json()
    return NextResponse.json({
      profileExists: true,
      connected: data.socialSets || [],
      profile: data,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to get status" }, { status: 500 })
  }
}
