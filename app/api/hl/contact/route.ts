import { NextRequest, NextResponse } from "next/server"

const HL_API_KEY = process.env.HL_API_KEY!
const HL_LOCATION_ID = "1WPwkUKybpnMzBJW6yZT"

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone } = await req.json()

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const [firstName, ...lastParts] = name.trim().split(" ")
    const lastName = lastParts.join(" ") || ""

    const res = await fetch("https://services.leadconnectorhq.com/contacts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${HL_API_KEY}`,
        "Version": "2021-07-28",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        locationId: HL_LOCATION_ID,
        tags: ["early-bird", "webinarforge-ai"],
        source: "WebinarForge AI Homepage",
      }),
    })

    const data = await res.json()
    console.log("HL response:", res.status, JSON.stringify(data))

    if (!res.ok) {
      const errMsg = data.message || data.error || `HL error ${res.status}`
      return NextResponse.json({ error: errMsg }, { status: res.status })
    }

    return NextResponse.json({ success: true, contact: data })

  } catch (err) {
    console.error("HL contact route error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
