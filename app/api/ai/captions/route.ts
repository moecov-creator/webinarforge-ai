import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { topic, niche, contentType, category, platforms, algorithmPrompts } = await req.json()
    if (!topic) return NextResponse.json({ error: "Topic required" }, { status: 400 })

    const systemPrompt = `You are an elite social media growth strategist who has helped creators reach top 1% status on every major platform. You write captions that stop the scroll, drive massive engagement, and get pushed by the algorithm. Respond ONLY with valid JSON. No markdown, no explanation.`

    const userPrompt = `Generate platform-optimized viral captions for:
TOPIC: ${topic}
NICHE: ${niche || "online business, marketing, entrepreneurship"}
CONTENT TYPE: ${contentType || "video"}
CATEGORY: ${category || "educational"}

${platforms.map((p: any) => {
  const algoPrompt = algorithmPrompts[p.algoKey] || algorithmPrompts["instagram"]
  return `PLATFORM: ${p.name} (id: ${p.pid})\nALGORITHM RULES: ${algoPrompt}\nMAX CHARS: ${p.maxChars > 0 ? p.maxChars : "unlimited"}`
}).join("\n\n")}

Respond with ONLY this JSON:
{
  "captions": { ${platforms.map((p: any) => `"${p.pid}": "caption"`).join(", ")} },
  "hashtags": { ${platforms.map((p: any) => `"${p.pid}": ["#tag1","#tag2","#tag3","#tag4","#tag5"]`).join(", ")} },
  "strategy": { ${platforms.map((p: any) => `"${p.pid}": "why this works"`).join(", ")} }
}`

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    })

    const text = message.content[0].type === "text" ? message.content[0].text : ""
    const clean = text.replace(/```json|```/g, "").trim()
    const parsed = JSON.parse(clean)
    return NextResponse.json(parsed)
  } catch (err) {
    console.error("AI captions error:", err)
    return NextResponse.json({ error: "Failed to generate captions" }, { status: 500 })
  }
}
