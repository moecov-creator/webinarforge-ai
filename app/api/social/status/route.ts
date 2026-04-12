import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()

    // If not logged in return empty — no error
    if (!user) {
      return NextResponse.json({ connected: [], profileExists: false })
    }

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
      connected: data.socialSets || data.connections || [],
      profile: data,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ connected: [], profileExists: false })
  }
}
