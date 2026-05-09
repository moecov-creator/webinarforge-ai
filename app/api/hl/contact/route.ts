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

    // Try upsert endpoint first — creates or updates contact
    const res = await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
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
    console.log("HL upsert response:", res.status, JSON.stringify(data))

    if (res.ok) {
      return NextResponse.json({ success: true, contact: data })
    }

    // Fallback to regular create
    const res2 = await fetch("https://services.leadconnectorhq.com/contacts/", {
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

    const data2 = await res2.json()
    console.log("HL create response:", res2.status, JSON.stringify(data2))

    if (!res2.ok) {
      const errMsg = (data2.message || data2.error || "").toLowerCase()
      if (errMsg.includes("duplicate") || errMsg.includes("already exists") || errMsg.includes("duplicated")) {
        return NextResponse.json({ success: true, existing: true })
      }
      return NextResponse.json({ error: data2.message || "Failed to submit" }, { status: res2.status })
    }

    return NextResponse.json({ success: true, contact: data2 })

  } catch (err) {
    console.error("HL contact route error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
