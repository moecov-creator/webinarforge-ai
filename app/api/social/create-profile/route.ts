import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const profileId = `wf-${user.id}`

    const res = await fetch("https://api.zernio.com/v1/profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ZERNIO_API_KEY}`,
      },
      body: JSON.stringify({
        id: profileId,
        name: user.firstName + " " + user.lastName,
        email: user.emailAddresses[0]?.emailAddress,
      }),
    })

    const data = await res.json()
    return NextResponse.json({ success: true, profile: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }
}
