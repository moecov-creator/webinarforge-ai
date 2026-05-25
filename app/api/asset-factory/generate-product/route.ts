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

    const prompt = `You are an elite digital product creator and copywriter. Create a COMPLETE digital product for:

KEYWORD/NICHE: ${keyword}
TARGET AUDIENCE: ${audience || "general audience"}
DESIRED OUTCOME: ${outcome || "achieve their goal"}
PRICE POINT: ${pricePoint || "$27"}

CRITICAL: Return ONLY a raw JSON object. No markdown code fences. No backticks. No explanation. Start your response with { and end with }.

The JSON must have these exact keys with string or array values only:

{
  "productTitle": "string",
  "productPromise": "string - 2-3 sentences",
  "ebookTitle": "string - title with subtitle",
  "chapterOutline": ["Chapter 1: Title - description", "Chapter 2: Title - description", "Chapter 3: Title - description", "Chapter 4: Title - description", "Chapter 5: Title - description", "Chapter 6: Title - description", "Chapter 7: Title - description"],
  "ebookDraft": "string - full ebook in markdown, minimum 1500 words, use \\n for newlines, use ## for chapter headers",
  "coverPrompt": "string - detailed AI image generation prompt for book cover",
  "checklistContent": "string - formatted checklist in markdown with 15+ items, use \\n for newlines",
  "workbookContent": "string - workbook with 4 exercises in markdown, use \\n for newlines",
  "bonusTitle": "string - bonus resource title",
  "bonusContent": "string - full bonus content in markdown 500+ words, use \\n for newlines",
  "salesPageCopy": "string - full sales page copy in markdown 800+ words, use \\n for newlines",
  "socialPromoPack": "string - social media pack with 5 posts and 3 reel scripts in markdown, use \\n for newlines"
}

Write real, specific, actionable content. No placeholders. Every field must have actual content.`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`AI generation failed: ${err.slice(0, 200)}`)
    }

    const data = await response.json()
    const text = data.content[0].text.trim()

    // Strip any accidental markdown fences
    const clean = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim()

    let output: any
    try {
      output = JSON.parse(clean)
    } catch (parseErr) {
      // Try extracting JSON object
      const match = clean.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          output = JSON.parse(match[0])
        } catch {
          console.error("Raw AI response:", clean.slice(0, 500))
          throw new Error("AI returned malformed JSON. Please try again.")
        }
      } else {
        console.error("Raw AI response:", clean.slice(0, 500))
        throw new Error("AI response could not be parsed. Please try again.")
      }
    }

    // Always build HTML from the markdown draft (don't rely on AI for HTML)
    output.ebookHtml = buildHtmlEbook(output)

    // Save to DB (non-blocking)
    let projectId = null
    try {
      const { PrismaClient } = await import("@prisma/client")
      const prisma = new PrismaClient()
      const project = await prisma.assetFactoryProject.create({
        data: {
          userId: user.id,
          title: output.productTitle || keyword,
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

function buildHtmlEbook(output: any): string {
  const title = output.ebookTitle || output.productTitle || "Your Guide"
  const promise = output.productPromise || ""
  const draft = (output.ebookDraft || "").replace(/\\n/g, "\n")

  const htmlContent = draft
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "</p><h2>$1</h2><p>")
    .replace(/^# (.+)$/gm, "</p><h1>$1</h1><p>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, 'Times New Roman', serif; max-width: 820px; margin: 0 auto; padding: 40px 30px; color: #1a1a2e; line-height: 1.9; background: #fefefe; font-size: 16px; }
  .cover { background: linear-gradient(135deg, #4c1d95 0%, #2563eb 100%); color: white; padding: 70px 50px; text-align: center; border-radius: 16px; margin-bottom: 60px; box-shadow: 0 20px 60px rgba(76,29,149,0.3); }
  .cover h1 { color: white; font-size: 2.6em; margin-bottom: 20px; line-height: 1.2; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
  .cover .promise { color: #e0d7ff; font-size: 1.05em; line-height: 1.7; max-width: 600px; margin: 0 auto; }
  .cover .price-badge { display: inline-block; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; font-weight: bold; padding: 8px 20px; border-radius: 50px; margin-top: 20px; font-size: 0.9em; }
  h1 { color: #2d1b69; font-size: 1.9em; border-bottom: 3px solid #7c3aed; padding-bottom: 12px; margin: 50px 0 20px; }
  h2 { color: #4c1d95; font-size: 1.5em; border-left: 5px solid #7c3aed; padding-left: 18px; margin: 40px 0 15px; background: #faf5ff; padding-top: 10px; padding-bottom: 10px; padding-right: 15px; border-radius: 0 8px 8px 0; }
  h3 { color: #5b21b6; font-size: 1.2em; margin: 25px 0 10px; }
  h4 { color: #6d28d9; font-size: 1em; margin: 20px 0 8px; text-transform: uppercase; letter-spacing: 0.05em; }
  p { margin: 15px 0; color: #374151; }
  ul, ol { padding-left: 28px; margin: 15px 0; }
  li { margin: 8px 0; color: #374151; }
  strong { color: #4c1d95; font-weight: 700; }
  em { color: #5b21b6; font-style: italic; }
  .tip-box { background: linear-gradient(135deg, #f5f3ff, #ede9fe); border-left: 5px solid #7c3aed; padding: 20px 25px; margin: 25px 0; border-radius: 0 12px 12px 0; }
  .tip-box::before { content: "💡 Key Insight"; display: block; font-weight: bold; color: #5b21b6; margin-bottom: 8px; font-size: 0.85em; text-transform: uppercase; letter-spacing: 0.05em; }
  blockquote { border-left: 4px solid #a78bfa; padding: 15px 20px; margin: 20px 0; background: #faf5ff; font-style: italic; color: #5b21b6; border-radius: 0 8px 8px 0; }
  .chapter-divider { border: none; border-top: 2px solid #e9d5ff; margin: 50px 0; }
  .footer { text-align: center; color: #9ca3af; font-size: 0.82em; margin-top: 70px; padding-top: 25px; border-top: 2px solid #f3f4f6; }
  .toc { background: #f8f7ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 25px 30px; margin: 30px 0 50px; }
  .toc h3 { color: #4c1d95; margin-bottom: 15px; }
  .toc ol { padding-left: 20px; }
  .toc li { margin: 6px 0; color: #5b21b6; }
  @media print { body { padding: 20px; } .cover { break-after: page; } }
</style>
</head>
<body>

<div class="cover">
  <h1>${title}</h1>
  <p class="promise">${promise}</p>
</div>

<div class="toc">
  <h3>📋 Table of Contents</h3>
  <ol>
    ${(output.chapterOutline || []).map((ch: string) => `<li>${ch.replace(/^Chapter \d+:\s*/i, "")}</li>`).join("\n    ")}
  </ol>
</div>

<div>${htmlContent}</div>

<div class="footer">
  <p>© ${new Date().getFullYear()} ${output.productTitle || title}</p>
  <p style="margin-top:8px;">Generated by WebinarForge AI Asset Factory™</p>
</div>

</body>
</html>`
}
