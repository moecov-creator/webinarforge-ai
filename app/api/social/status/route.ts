import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ connected: [], profileExists: false })
    }

    const profileId = `wf-${user.id}`

    // First try to list all profiles to find the right one
    const listRes = await fetch("https://api.zernio.com/v1/profiles", {
      headers: {
        "Authorization": `Bearer ${process.env.ZERNIO_API_KEY}`,
      },
    })

    if (!listRes.ok) {
      return NextResponse.json({ connected: [], profileExists: false })
    }

    const listData = await listRes.json()

    // Return raw data so we can debug
    return NextResponse.json({
      profileExists: false,
      connected: [],
      debug: listData,
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ connected: [], profileExists: false })
  }
}
