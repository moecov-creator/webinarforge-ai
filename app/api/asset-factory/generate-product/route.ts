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

    // ── CALL 1: Product Structure ──────────────────────────────────────────
    const r1 = await callAI(`You are an elite digital product creator.

Create a product for:
- Keyword: ${keyword}
- Audience: ${audience || "general audience"}
- Outcome: ${outcome || "achieve their goal"}
- Price: ${pricePoint || "$27"}

Respond with ONLY a JSON object (no markdown, no backticks, start with {):
{"productTitle":"name","productPromise":"2-3 sentence promise","ebookTitle":"title: subtitle","chapterTitles":["title 1","title 2","title 3","title 4","title 5","title 6","title 7"],"coverPrompt":"detailed AI image prompt for ebook cover","bonusTitle":"bonus title"}`, 800)

    const structure = parseJSON(r1)

    // ── CALL 2: Full Ebook Draft ───────────────────────────────────────────
    const ebookDraft = await callAI(`Write a complete ebook guide titled "${structure.ebookTitle || keyword}".

Write 1500+ words in markdown. Structure:
## Introduction
## Chapter 1: ${structure.chapterTitles?.[0] || "Getting Started"}
## Chapter 2: ${structure.chapterTitles?.[1] || "Core Principles"}
## Chapter 3: ${structure.chapterTitles?.[2] || "Taking Action"}
## Chapter 4: ${structure.chapterTitles?.[3] || "Advanced Strategies"}
## Chapter 5: ${structure.chapterTitles?.[4] || "Overcoming Obstacles"}
## Chapter 6: ${structure.chapterTitles?.[5] || "Accelerating Results"}
## Chapter 7: ${structure.chapterTitles?.[6] || "Your Next Steps"}
## Conclusion

Use **bold** for key points and bullet points for lists. Write real, specific, actionable content for ${audience || "readers"}. Return only the markdown text.`, 4000)

    // ── CALL 3: Sales Page ─────────────────────────────────────────────────
    const salesPageCopy = await callAI(`Write a complete sales page for "${structure.productTitle || keyword}" priced at ${pricePoint || "$27"} targeting ${audience || "general audience"}.

Include these sections in markdown:
# [Headline]
## The Problem
## Introducing [Product Name]
## What You Get
## Who This Is For
## What Others Are Saying
## Our Guarantee
## Get Instant Access

Write 600+ words of real persuasive copy. Return only the markdown text.`, 2000)

    // ── CALL 4: Checklist ──────────────────────────────────────────────────
    const checklistRaw = await callAI(`Create a 15-item quick-start checklist for "${structure.productTitle || keyword}".

Return ONLY a JSON array of strings (no markdown, no backticks, start with [):
["item 1","item 2","item 3","item 4","item 5","item 6","item 7","item 8","item 9","item 10","item 11","item 12","item 13","item 14","item 15"]`, 500)

    let checklistItems: string[] = []
    try {
      const arr = JSON.parse(checklistRaw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim())
      checklistItems = Array.isArray(arr) ? arr : []
    } catch {
      checklistItems = checklistRaw.split("\n").filter(l => l.trim()).slice(0, 15)
    }

    // ── CALL 5: Social Pack ────────────────────────────────────────────────
    const socialPackRaw = await callAI(`Create social media content for "${structure.productTitle || keyword}".

Return ONLY a JSON object (no markdown, no backticks, start with {):
{"posts":["post 1 with emojis and hashtags","post 2 with emojis and hashtags","post 3 with emojis and hashtags","post 4 with emojis and hashtags","post 5 with emojis and hashtags"],"reels":["reel script 1 with hook and CTA","reel script 2 with hook and CTA","reel script 3 with hook and CTA"],"hashtags":["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10","#tag11","#tag12","#tag13","#tag14","#tag15"]}`, 1000)

    let socialData: any = { posts: [], reels: [], hashtags: [] }
    try {
      socialData = parseJSON(socialPackRaw)
    } catch {
      console.warn("Social pack parse failed, using defaults")
    }

    // ── CALL 6: Bonus Content ──────────────────────────────────────────────
    const bonusContent = await callAI(`Write a 400-word bonus resource titled "${structure.bonusTitle || "Quick Reference Guide"}" for "${keyword}".

Write practical, specific content in markdown format. Include tips, strategies, or a reference guide. Return only the markdown text.`, 800)

    // ── Assemble Output ────────────────────────────────────────────────────
    const chapterOutline = (structure.chapterTitles || []).map((t: string, i: number) => `Chapter ${i + 1}: ${t}`)

    const checklistContent = `# Quick-Start Checklist: ${structure.productTitle || keyword}\n\n${checklistItems.map(item => `- [ ] ${item}`).join("\n")}`

    const workbookContent = `# Workbook: ${structure.productTitle || keyword}\n\n${chapterOutline.slice(0, 4).map((ch, i) =>
      `## Exercise ${i + 1}: Reflect on ${ch}\n\n**Objective:** Apply the concepts from this chapter.\n\n**Instructions:** Answer the following questions thoughtfully.\n\n1. What is your biggest takeaway from this chapter?\n\n_______________________________________________\n\n2. What one action will you take in the next 24 hours?\n\n_______________________________________________\n\n3. What obstacles might stop you, and how will you overcome them?\n\n_______________________________________________\n`
    ).join("\n")}`

    const socialPromoPack = `# Social Media Promo Pack: ${structure.productTitle || keyword}\n\n## 📱 Instagram/Facebook Posts\n\n${
      (socialData.posts || []).map((p: string, i: number) => `**Post ${i + 1}:**\n${p}`).join("\n\n")
    }\n\n## 🎬 TikTok/Reels Scripts\n\n${
      (socialData.reels || []).map((s: string, i: number) => `**Reel ${i + 1}:**\n${s}`).join("\n\n")
    }\n\n## #️⃣ Hashtag Pack\n\n${(socialData.hashtags || []).join(" ")}`

    const output = {
      productTitle: structure.productTitle || keyword,
      productPromise: structure.productPromise || "",
      ebookTitle: structure.ebookTitle || keyword,
      chapterOutline,
      ebookDraft,
      coverPrompt: structure.coverPrompt || "",
      checklistContent,
      workbookContent,
      bonusTitle: structure.bonusTitle || "Bonus Guide",
      bonusContent,
      salesPageCopy,
      socialPromoPack,
      ebookHtml: buildHtmlEbook({
        ebookTitle: structure.ebookTitle,
        productTitle: structure.productTitle,
        productPromise: structure.productPromise,
        chapterOutline,
        ebookDraft,
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
  if (!response.ok) throw new Error(`AI call failed: ${response.status}`)
  const data = await response.json()
  return data.content[0].text.trim()
}

function parseJSON(text: string): any {
  const clean = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim()
  try { return JSON.parse(clean) } catch {
    const match = clean.match(/[\[{][\s\S]*[\]}]/)
    if (match) { try { return JSON.parse(match[0]) } catch {} }
    throw new Error("AI response could not be parsed. Please try again.")
  }
}

function buildHtmlEbook(output: any): string {
  const title = output.ebookTitle || output.productTitle || "Your Guide"
  const promise = output.productPromise || ""
  const draft = output.ebookDraft || ""

  const safe = draft.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  const html = safe
    .replace(/^#### (.+)$/gm, "</p><h4>$1</h4><p>")
    .replace(/^### (.+)$/gm, "</p><h3>$1</h3><p>")
    .replace(/^## (.+)$/gm, "</p><h2>$1</h2><p>")
    .replace(/^# (.+)$/gm, "</p><h1>$1</h1><p>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\n\n+/g, "</p><p>")
    .replace(/\n/g, "<br>")

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${title}</title>
<style>*{box-sizing:border-box}body{font-family:Georgia,serif;max-width:820px;margin:0 auto;padding:40px 30px;color:#1a1a2e;line-height:1.9;background:#fefefe;font-size:16px}.cover{background:linear-gradient(135deg,#4c1d95,#2563eb);color:white;padding:70px 50px;text-align:center;border-radius:16px;margin-bottom:60px;box-shadow:0 20px 60px rgba(76,29,149,.3)}.cover h1{color:white;font-size:2.4em;margin-bottom:20px;line-height:1.2}.cover p{color:#e0d7ff;font-size:1em;line-height:1.7}h1{color:#2d1b69;font-size:1.9em;border-bottom:3px solid #7c3aed;padding-bottom:12px;margin:50px 0 20px}h2{color:#4c1d95;font-size:1.4em;border-left:5px solid #7c3aed;padding:10px 15px;margin:40px 0 15px;background:#faf5ff;border-radius:0 8px 8px 0}h3{color:#5b21b6;margin:25px 0 10px}p{margin:15px 0;color:#374151}ul{padding-left:28px;margin:15px 0}li{margin:8px 0;color:#374151}strong{color:#4c1d95;font-weight:700}.toc{background:#f8f7ff;border:1px solid #e9d5ff;border-radius:12px;padding:25px 30px;margin:0 0 50px}.toc h3{color:#4c1d95;margin:0 0 15px}.toc ol{padding-left:20px}.toc li{margin:6px 0;color:#5b21b6}.footer{text-align:center;color:#9ca3af;font-size:.82em;margin-top:70px;padding-top:25px;border-top:2px solid #f3f4f6}</style>
</head><body>
<div class="cover"><h1>${title}</h1><p>${promise}</p></div>
<div class="toc"><h3>📋 Table of Contents</h3><ol>${(output.chapterOutline || []).map((ch: string) => `<li>${ch.replace(/^Chapter \d+:\s*/i, "")}</li>`).join("")}</ol></div>
<p>${html}</p>
<div class="footer"><p>© ${new Date().getFullYear()} ${title} — Generated by WebinarForge AI Asset Factory™</p></div>
</body></html>`
}
