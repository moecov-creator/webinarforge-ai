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

    const prompt = `You are an elite digital product creator and copywriter. Create a COMPLETE, production-ready digital product for the following:

KEYWORD/NICHE: ${keyword}
TARGET AUDIENCE: ${audience || "general audience interested in this topic"}
DESIRED OUTCOME: ${outcome || "achieve their goal with this topic"}
PRICE POINT: ${pricePoint || "$27"}

Generate a complete digital product package. Return ONLY valid JSON (no markdown fences, no explanation):

{
  "productTitle": "compelling, specific product name",
  "productPromise": "2-3 sentence promise: who it's for, what they get, the transformation",
  "ebookTitle": "high-converting ebook title with subtitle",
  "chapterOutline": [
    "Chapter 1: Title — brief description",
    "Chapter 2: Title — brief description",
    "Chapter 3: Title — brief description",
    "Chapter 4: Title — brief description",
    "Chapter 5: Title — brief description",
    "Chapter 6: Title — brief description",
    "Chapter 7: Title — brief description"
  ],
  "ebookDraft": "Full ebook in markdown format. Write AT LEAST 1500 words. Include: ## Introduction, ## Chapter 1 through Chapter 7 with real actionable content, ## Conclusion. Use headers, bullet points, and bold text for readability. Write real, specific, actionable content — not placeholders.",
  "coverPrompt": "Detailed Midjourney/DALL-E prompt for a professional ebook cover. Include: style (modern, clean, professional), colors, typography description, imagery, mood. Make it specific and detailed.",
  "checklistContent": "# Quick-Start Checklist: [Product Title]\n\nA formatted markdown checklist with 15-20 actionable items organized into sections. Use ## for sections and - [ ] for checklist items.",
  "workbookContent": "# Workbook: [Product Title]\n\nA formatted markdown workbook with 4-5 exercises. Each exercise has: ## Exercise Title, **Objective:**, **Instructions:**, and blank lines for responses (use underscores like: _______________). Make exercises practical and specific.",
  "bonusTitle": "Compelling bonus resource title",
  "bonusContent": "Full bonus resource in markdown. At least 500 words of real, specific content. Could be a cheat sheet, quick reference guide, resource list, or mini-guide.",
  "salesPageCopy": "# Sales Page: [Product Title]\n\nFull sales page copy in markdown format. Include:\n## Headline (attention-grabbing)\n## Subheadline\n## The Problem (pain points)\n## Introducing [Product Name]\n## What You Get (bullet points with value)\n## Who This Is For\n## Testimonials (3 fictional but realistic)\n## Guarantee\n## What Happens When You Order\n## Call to Action\n\nWrite at least 800 words of real, persuasive copy.",
  "socialPromoPack": "# Social Media Promo Pack\n\n## Instagram/Facebook Posts (5 posts)\n[5 complete social media posts with captions, emojis, and hashtags]\n\n## TikTok/Reels Scripts (3 scripts)\n[3 complete 30-second video scripts with hook, content, CTA]\n\n## Email Announcement\n[Complete email with subject line, preview text, and body]\n\n## Hashtag Pack\n[30 relevant hashtags organized by category]",
  "ebookHtml": "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>[Ebook Title]</title><style>body{font-family:Georgia,serif;max-width:800px;margin:0 auto;padding:40px 20px;color:#1a1a2e;line-height:1.8;background:#fefefe}h1{color:#2d1b69;font-size:2.5em;text-align:center;border-bottom:3px solid #7c3aed;padding-bottom:20px;margin-bottom:40px}h2{color:#4c1d95;font-size:1.6em;margin-top:40px;border-left:4px solid #7c3aed;padding-left:15px}h3{color:#5b21b6;font-size:1.2em}p{margin:15px 0}ul,ol{margin:15px 0;padding-left:30px}li{margin:8px 0}strong{color:#4c1d95}.cover{background:linear-gradient(135deg,#4c1d95,#2563eb);color:white;padding:60px 40px;text-align:center;border-radius:12px;margin-bottom:40px}.cover h1{color:white;border:none;font-size:2.8em}.cover p{color:#e0d7ff;font-size:1.1em}.chapter-break{border:none;border-top:2px solid #e9d5ff;margin:40px 0}.tip-box{background:#f5f3ff;border-left:4px solid #7c3aed;padding:20px;margin:20px 0;border-radius:0 8px 8px 0}.footer{text-align:center;color:#6b7280;font-size:0.85em;margin-top:60px;padding-top:20px;border-top:1px solid #e5e7eb}</style></head><body>[FULL HTML EBOOK CONTENT — convert the ebookDraft into proper HTML. Include a cover div, all chapters as sections, tip boxes for key insights, and a footer]</body></html>"
}`

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
    const clean = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim()

    let output
    try {
      output = JSON.parse(clean)
    } catch {
      // Try to extract JSON if there's surrounding text
      const jsonMatch = clean.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        output = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Failed to parse AI response. Please try again.")
      }
    }

    // Build proper HTML ebook if the AI didn't fully render it
    if (!output.ebookHtml || output.ebookHtml.includes("[FULL HTML EBOOK CONTENT")) {
      output.ebookHtml = buildHtmlEbook(output)
    }

    // Try to save to database (non-blocking — don't fail if DB not ready)
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
  const draft = output.ebookDraft || ""

  // Convert markdown to basic HTML
  const htmlContent = draft
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[h|u|o|l])/gm, "<p>")

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
  body { font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #1a1a2e; line-height: 1.8; background: #fefefe; }
  .cover { background: linear-gradient(135deg, #4c1d95, #2563eb); color: white; padding: 60px 40px; text-align: center; border-radius: 12px; margin-bottom: 50px; }
  .cover h1 { color: white; font-size: 2.5em; margin-bottom: 15px; }
  .cover p { color: #e0d7ff; font-size: 1.1em; }
  h1 { color: #2d1b69; font-size: 2em; border-bottom: 3px solid #7c3aed; padding-bottom: 15px; margin-top: 50px; }
  h2 { color: #4c1d95; font-size: 1.5em; border-left: 4px solid #7c3aed; padding-left: 15px; margin-top: 40px; }
  h3 { color: #5b21b6; }
  p { margin: 15px 0; }
  ul, ol { padding-left: 30px; margin: 15px 0; }
  li { margin: 8px 0; }
  strong { color: #4c1d95; }
  .tip { background: #f5f3ff; border-left: 4px solid #7c3aed; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
  .footer { text-align: center; color: #9ca3af; font-size: 0.85em; margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
</style>
</head>
<body>
  <div class="cover">
    <h1>${title}</h1>
    <p>${output.productPromise || ""}</p>
  </div>
  ${htmlContent}
  <div class="footer">
    <p>© ${new Date().getFullYear()} — Generated by WebinarForge AI Asset Factory™</p>
  </div>
</body>
</html>`
}
