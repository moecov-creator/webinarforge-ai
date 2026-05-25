// app/api/asset-factory/generate-product/route.ts

export const maxDuration = 300

import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { keyword, audience, outcome, pricePoint } = await req.json()
    if (!keyword) return NextResponse.json({ error: "Keyword is required" }, { status: 400 })

    // ── STEP 1: Generate structured data (safe JSON — no long text fields) ──
    const structurePrompt = `You are an elite digital product creator. For this product:

KEYWORD: ${keyword}
AUDIENCE: ${audience || "general audience"}
OUTCOME: ${outcome || "achieve their goal"}
PRICE: ${pricePoint || "$27"}

Return ONLY a JSON object. No markdown. No backticks. Start with { end with }.

{
  "productTitle": "compelling product name",
  "productPromise": "2-3 sentence promise of transformation",
  "ebookTitle": "ebook title: subtitle",
  "chapterTitles": ["Chapter 1 title","Chapter 2 title","Chapter 3 title","Chapter 4 title","Chapter 5 title","Chapter 6 title","Chapter 7 title"],
  "coverPrompt": "detailed AI image prompt for professional ebook cover with specific colors, style, and imagery",
  "bonusTitle": "bonus resource title",
  "pricingJustification": "one sentence why this price is perfect",
  "targetPain": "the #1 pain point in one sentence",
  "bigPromise": "the transformation in one sentence"
}`

    const r1 = await callAI(structurePrompt, 1000)
    const structure = parseJSON(r1)

    // ── STEP 2: Generate ebook content ──
    const ebookPrompt = `Write a complete ebook for "${structure.ebookTitle}".
Target audience: ${audience || "general audience"}
Desired outcome: ${outcome || "achieve their goal"}

Write 1500+ words in clean markdown. Include:
- ## Introduction
- ## Chapter 1: ${structure.chapterTitles?.[0] || "Getting Started"}
- ## Chapter 2: ${structure.chapterTitles?.[1] || "Core Principles"}
- ## Chapter 3: ${structure.chapterTitles?.[2] || "Taking Action"}
- ## Chapter 4: ${structure.chapterTitles?.[3] || "Advanced Strategies"}
- ## Chapter 5: ${structure.chapterTitles?.[4] || "Overcoming Obstacles"}
- ## Chapter 6: ${structure.chapterTitles?.[5] || "Accelerating Results"}
- ## Chapter 7: ${structure.chapterTitles?.[6] || "Your Next Steps"}
- ## Conclusion

Use **bold** for key points, bullet points for lists. Write real actionable content.
Return ONLY the markdown text, no JSON wrapper.`

    const ebookDraft = await callAI(ebookPrompt, 4000)

    // ── STEP 3: Generate sales & marketing assets ──
    const marketingPrompt = `Create marketing assets for "${structure.productTitle}" targeting ${audience || "general audience"} at ${pricePoint || "$27"}.

Return ONLY a JSON object. No markdown. No backticks. Start with { end with }.
Use \\n for line breaks inside strings.

{
  "salesPageCopy": "full sales page with headline, problem, solution, benefits, testimonials, guarantee, CTA — 600+ words using \\n for line breaks",
  "checklistItems": ["action item 1","action item 2","action item 3","action item 4","action item 5","action item 6","action item 7","action item 8","action item 9","action item 10","action item 11","action item 12","action item 13","action item 14","action item 15"],
  "workbookExercises": ["Exercise 1: title — instructions and reflection prompt","Exercise 2: title — instructions and reflection prompt","Exercise 3: title — instructions and reflection prompt","Exercise 4: title — instructions and reflection prompt"],
  "bonusContent": "500+ word bonus resource content using \\n for line breaks",
  "socialPosts": ["Post 1: full caption with emojis and hashtags","Post 2: full caption with emojis and hashtags","Post 3: full caption with emojis and hashtags","Post 4: full caption with emojis and hashtags","Post 5: full caption with emojis and hashtags"],
  "reelScripts": ["Reel 1 (30s): hook + content + CTA","Reel 2 (30s): hook + content + CTA","Reel 3 (30s): hook + content + CTA"],
  "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10","#tag11","#tag12","#tag13","#tag14","#tag15","#tag16","#tag17","#tag18","#tag19","#tag20"]
}`

    const r3 = await callAI(marketingPrompt, 3000)
    const marketing = parseJSON(r3)

    // ── Build formatted content ──
    const checklistContent = `# Quick-Start Checklist: ${structure.productTitle}\n\n${
      (marketing.checklistItems || []).map((item: string) => `- [ ] ${item}`).join("\n")
    }`

    const workbookContent = `# Workbook: ${structure.productTitle}\n\n${
      (marketing.workbookExercises || []).map((ex: string, i: number) =>
        `## Exercise ${i+1}: ${ex}\n\n_______________\n_______________\n_______________\n`
      ).join("\n")
    }`

    const socialPromoPack = `# Social Media Promo Pack: ${structure.productTitle}\n\n## 📱 Instagram/Facebook Posts\n\n${
      (marketing.socialPosts || []).map((p: string, i: number) => `**Post ${i+1}:**\n${p}`).join("\n\n")
    }\n\n## 🎬 TikTok/Reels Scripts\n\n${
      (marketing.reelScripts || []).map((s: string, i: number) => `**Reel ${i+1}:**\n${s}`).join("\n\n")
    }\n\n## #️⃣ Hashtag Pack\n\n${(marketing.hashtags || []).join(" ")}`

    const chapterOutline = (structure.chapterTitles || []).map((t: string, i: number) =>
      `Chapter ${i+1}: ${t}`
    )

    const output = {
      productTitle: structure.productTitle || keyword,
      productPromise: structure.productPromise || "",
      ebookTitle: structure.ebookTitle || keyword,
      chapterOutline,
      ebookDraft,
      coverPrompt: structure.coverPrompt || "",
      checklistContent,
      workbookContent,
      bonusTitle: structure.bonusTitle || "Bonus Resource",
      bonusContent: marketing.bonusContent || "",
      salesPageCopy: marketing.salesPageCopy || "",
      socialPromoPack,
      ebookHtml: buildHtmlEbook({ 
        ebookTitle: structure.ebookTitle,
        productTitle: structure.productTitle,
        productPromise: structure.productPromise,
        chapterOutline,
        ebookDraft 
      }),
    }

    // Save to DB (non-blocking)
    let projectId = null
    try {
      const { PrismaClient } = await import("@prisma/client")
      const prisma = new PrismaClient()
      const project = await prisma.assetFactoryProject.create({
        data: {
          userId: user.id,
          title: output.productTitle,
          niche: keyword,
          targetAudience: audience || "",
          desiredOutcome: outcome || "",
          offerType: "Digital Product",
          tone: "Professional",
          cta: "Buy Now",
          industry: "General",
          pricePoint: pricePoint || "$27",
          status: "complete",
        },
      })
      projectId = project.id
      await prisma.$disconnect()
    } catch (dbErr) {
      console.warn("DB save skipped:", dbErr)
    }

    return NextResponse.json({ success: true, output, projectId })

  } catch (err: any) {
    console.error("Product generation error:", err)
    return NextResponse.json({ error: err.message || "Generation failed" }, { status: 500 })
  }
}

// ── Helper: call Anthropic API ──
async function callAI(prompt: string, maxTokens: number): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  })
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`AI call failed: ${err.slice(0, 200)}`)
  }
  const data = await response.json()
  return data.content[0].text.trim()
}

// ── Helper: safe JSON parse ──
function parseJSON(text: string): any {
  const clean = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()
  try {
    return JSON.parse(clean)
  } catch {
    const match = clean.match(/\{[\s\S]*\}/)
    if (match) {
      try { return JSON.parse(match[0]) } catch {}
    }
    console.error("JSON parse failed. Raw:", clean.slice(0, 300))
    throw new Error("AI response could not be parsed. Please try again.")
  }
}

// ── Helper: build HTML ebook ──
function buildHtmlEbook(output: any): string {
  const title = output.ebookTitle || output.productTitle || "Your Guide"
  const promise = output.productPromise || ""
  const draft = output.ebookDraft || ""

  const htmlContent = draft
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^#### (.+)$/gm, "</p><h4>$1</h4><p>")
    .replace(/^### (.+)$/gm, "</p><h3>$1</h3><p>")
    .replace(/^## (.+)$/gm, "</p><h2>$1</h2><p>")
    .replace(/^# (.+)$/gm, "</p><h1>$1</h1><p>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*?<\/li>\n?)+/gs, m => `</p><ul>${m}</ul><p>`)
    .replace(/\n\n+/g, "</p><p>")

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Georgia, serif; max-width: 820px; margin: 0 auto; padding: 40px 30px; color: #1a1a2e; line-height: 1.9; background: #fefefe; font-size: 16px; }
  .cover { background: linear-gradient(135deg, #4c1d95, #2563eb); color: white; padding: 70px 50px; text-align: center; border-radius: 16px; margin-bottom: 60px; box-shadow: 0 20px 60px rgba(76,29,149,0.3); }
  .cover h1 { color: white; font-size: 2.4em; margin-bottom: 20px; line-height: 1.2; }
  .cover .promise { color: #e0d7ff; font-size: 1em; line-height: 1.7; }
  h1 { color: #2d1b69; font-size: 1.9em; border-bottom: 3px solid #7c3aed; padding-bottom: 12px; margin: 50px 0 20px; }
  h2 { color: #4c1d95; font-size: 1.4em; border-left: 5px solid #7c3aed; padding: 10px 15px; margin: 40px 0 15px; background: #faf5ff; border-radius: 0 8px 8px 0; }
  h3 { color: #5b21b6; font-size: 1.15em; margin: 25px 0 10px; }
  h4 { color: #6d28d9; font-size: 1em; margin: 20px 0 8px; text-transform: uppercase; letter-spacing: 0.05em; }
  p { margin: 15px 0; color: #374151; }
  ul, ol { padding-left: 28px; margin: 15px 0; }
  li { margin: 8px 0; color: #374151; }
  strong { color: #4c1d95; font-weight: 700; }
  .toc { background: #f8f7ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 25px 30px; margin: 0 0 50px; }
  .toc h3 { color: #4c1d95; margin: 0 0 15px; }
  .toc ol { padding-left: 20px; }
  .toc li { margin: 6px 0; color: #5b21b6; }
  .footer { text-align: center; color: #9ca3af; font-size: 0.82em; margin-top: 70px; padding-top: 25px; border-top: 2px solid #f3f4f6; }
</style>
</head>
<body>
<div class="cover">
  <h1>${title}</h1>
  <p class="promise">${promise}</p>
</div>
<div class="toc">
  <h3>📋 Table of Contents</h3>
  <ol>${(output.chapterOutline || []).map((ch: string) => `<li>${ch.replace(/^Chapter \d+:\s*/i, "")}</li>`).join("")}</ol>
</div>
<p>${htmlContent}</p>
<div class="footer">
  <p>© ${new Date().getFullYear()} ${title} — Generated by WebinarForge AI Asset Factory™</p>
</div>
</body>
</html>`
}
