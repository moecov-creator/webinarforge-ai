import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { topic, niche, contentType, platforms, algorithmPrompts } = await req.json()

    if (!topic) return NextResponse.json({ error: "Topic required" }, { status: 400 })

    const platformList = platforms.map((p: any) => ({
      pid: p.pid,
      name: p.name,
      algoKey: p.algoKey,
      maxChars: p.maxChars,
    }))

    const systemPrompt = `You are an elite social media growth strategist who has helped creators reach top 1% status on every major platform. You understand each platform's algorithm deeply and know exactly what makes content go viral. You write captions that stop the scroll, drive massive engagement, and get pushed by the algorithm.

You must respond ONLY with a valid JSON object. No explanation, no markdown, no extra text. Just raw JSON.`

    const userPrompt = `Generate platform-optimized viral captions for this content:

TOPIC/VIDEO CONTEXT: ${topic}
NICHE: ${niche || "online business, marketing, entrepreneurship"}
CONTENT TYPE: ${contentType || "video"}

Generate a unique, viral caption for EACH platform below. Each caption must follow that platform's EXACT algorithm rules for top 1% reach.

${platformList.map((p: any) => {
  const algoPrompt = algorithmPrompts[p.algoKey] || algorithmPrompts["instagram"]
  return `PLATFORM: ${p.name} (id: ${p.pid})
ALGORITHM RULES: ${algoPrompt}
MAX CHARS: ${p.maxChars > 0 ? p.maxChars : "unlimited"}`
}).join("\n\n")}

Respond with ONLY this JSON:
{
  "captions": {
    ${platformList.map((p: any) => `"${p.pid}": "full caption text"`).join(",\n    ")}
  },
  "hashtags": {
    ${platformList.map((p: any) => `"${p.pid}": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]`).join(",\n    ")}
  },
  "strategy": {
    ${platformList.map((p: any) => `"${p.pid}": "one sentence why this caption will perform"`).join(",\n    ")}
  }
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
