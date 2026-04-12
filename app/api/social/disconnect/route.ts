import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { platform } = await req.json()
    const profileId = `wf-${user.id}`

    await fetch(`https://api.zernio.com/v1/profiles/${profileId}/disconnect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ZERNIO_API_KEY}`,
      },
      body: JSON.stringify({ platform }),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 })
  }
}
