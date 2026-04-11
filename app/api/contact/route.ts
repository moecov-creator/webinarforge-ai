// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, company, phone, webinars, budget, message } = body

    if (!name || !email || !company) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: `🏢 New Enterprise Inquiry — ${company}`,
        html: `
          <h2>New Enterprise Contact Form Submission</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Name</strong></td><td style="padding:8px;border:1px solid #ddd">${name}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd">${email}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Company</strong></td><td style="padding:8px;border:1px solid #ddd">${company}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #ddd">${phone || "Not provided"}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Webinars/month</strong></td><td style="padding:8px;border:1px solid #ddd">${webinars || "Not specified"}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Budget</strong></td><td style="padding:8px;border:1px solid #ddd">${budget || "Not specified"}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Message</strong></td><td style="padding:8px;border:1px solid #ddd">${message || "No message"}</td></tr>
          </table>
          <p style="margin-top:20px;color:#666">Reply directly to this email to respond to ${name}.</p>
        `,
        reply_to: email,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Contact form error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
