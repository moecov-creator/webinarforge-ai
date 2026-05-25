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

    // ── CALL 1: Product Structure ─────────────────────────────────────────
    const r1 = await callAI(`You are an elite digital product creator.
Create a product for: "${keyword}" | Audience: ${audience || "general"} | Outcome: ${outcome || "achieve their goal"} | Price: ${pricePoint || "$27"}
Return ONLY a JSON object (no markdown, no backticks, start with {):
{"productTitle":"name","productPromise":"2-3 sentence promise","ebookTitle":"title: subtitle","chapterTitles":["ch1","ch2","ch3","ch4","ch5","ch6","ch7"],"coverPrompt":"professional ebook cover: modern flat design, rich deep navy and gold color palette, bold typography, the title prominently displayed, minimal clean layout, digital product mockup style, high quality commercial illustration","bonusTitle":"bonus title","emailSubjectLines":["subject 1","subject 2","subject 3","subject 4","subject 5"],"miniCourseTitle":"mini course title","videoScriptTopics":["topic 1","topic 2","topic 3","topic 4","topic 5"]}`, 800)
    const structure = parseJSON(r1)

    // ── CALL 2: Full Ebook Draft ──────────────────────────────────────────
    const ebookDraft = await callAI(`Write a complete, professional ebook titled "${structure.ebookTitle || keyword}" for ${audience || "readers"}.
Write 2000+ words in markdown. Use this exact structure:
## Introduction
## Chapter 1: ${structure.chapterTitles?.[0] || "Getting Started"}
## Chapter 2: ${structure.chapterTitles?.[1] || "Core Principles"}
## Chapter 3: ${structure.chapterTitles?.[2] || "Taking Action"}
## Chapter 4: ${structure.chapterTitles?.[3] || "Advanced Strategies"}
## Chapter 5: ${structure.chapterTitles?.[4] || "Overcoming Obstacles"}
## Chapter 6: ${structure.chapterTitles?.[5] || "Accelerating Results"}
## Chapter 7: ${structure.chapterTitles?.[6] || "Your Next Steps"}
## Conclusion
Use **bold** for key insights, bullet points for lists. Write real actionable content. Return only markdown.`, 4000)

    // ── CALL 3: Sales Page ────────────────────────────────────────────────
    const salesPageCopy = await callAI(`Write a high-converting sales page for "${structure.productTitle || keyword}" at ${pricePoint || "$27"} for ${audience || "readers"}.
Include: attention-grabbing headline, subheadline, pain points, solution intro, what you get (bullet list), who it's for, 3 testimonials, 30-day guarantee, strong CTA.
Write 700+ words in markdown. Return only markdown.`, 2000)

    // ── CALL 4: Email Sequence ────────────────────────────────────────────
    const emailSequence = await callAI(`Write a 5-email nurture sequence to sell "${structure.productTitle || keyword}" at ${pricePoint || "$27"}.
For each email write:
### Email 1: [Subject Line]
**Subject:** [subject]
**Body:** [full email body 150+ words]
Do all 5 emails. Return only markdown.`, 2000)

    // ── CALL 5: Mini Course Outline + Video Scripts ───────────────────────
    const miniCourse = await callAI(`Create a mini-course and video scripts for "${structure.miniCourseTitle || keyword}".
## Mini-Course Outline
[5 modules with titles and 3 lessons each]
## Video Script 1: [Topic from ${structure.videoScriptTopics?.[0] || "Introduction"}]
[Full 60-second script with hook, content, CTA]
## Video Script 2: [Topic from ${structure.videoScriptTopics?.[1] || "Core Concept"}]
[Full 60-second script]
## Video Script 3: [Topic from ${structure.videoScriptTopics?.[2] || "Quick Win"}]
[Full 60-second script]
Return only markdown.`, 2000)

    // ── CALL 6: Checklist + Workbook ─────────────────────────────────────
    const checklistRaw = await callAI(`Create a 15-item checklist for "${structure.productTitle || keyword}".
Return ONLY a JSON array (no markdown, start with [):
["item 1","item 2","item 3","item 4","item 5","item 6","item 7","item 8","item 9","item 10","item 11","item 12","item 13","item 14","item 15"]`, 400)
    let checklistItems: string[] = []
    try { const arr = parseJSON(checklistRaw); checklistItems = Array.isArray(arr) ? arr : [] } catch { checklistItems = checklistRaw.split("\n").filter((l: string) => l.trim()).slice(0, 15) }

    // ── CALL 7: Social Pack ───────────────────────────────────────────────
    const socialRaw = await callAI(`Create social content for "${structure.productTitle || keyword}".
Return ONLY JSON (no markdown, start with {):
{"posts":["post 1 with emojis hashtags","post 2","post 3","post 4","post 5"],"reels":["30s reel script 1 with hook body CTA","30s reel script 2","30s reel script 3"],"hashtags":["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10","#tag11","#tag12","#tag13","#tag14","#tag15","#tag16","#tag17","#tag18","#tag19","#tag20"]}`, 800)
    let socialData: any = { posts: [], reels: [], hashtags: [] }
    try { socialData = parseJSON(socialRaw) } catch {}

    // ── CALL 8: Bonus Content ─────────────────────────────────────────────
    const bonusContent = await callAI(`Write a 500-word "${structure.bonusTitle || "Quick Reference Guide"}" bonus for "${keyword}".
Make it a practical cheat sheet or reference guide. Write in markdown. Return only markdown.`, 800)

    // ── CALL 9: Generate Cover Image with DALL-E 3 ────────────────────────
    let coverImageUrl = ""
    try {
      const imagePrompt = `Professional digital ebook cover design for "${structure.ebookTitle || keyword}". Modern flat design style with deep navy blue and gold color palette. Bold clean typography. The title "${structure.ebookTitle || keyword}" prominently displayed. Clean minimal layout. High quality commercial illustration. No people, no photos. Pure graphic design. 1024x1024.`
      const imgRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: "dall-e-3", prompt: imagePrompt, n: 1, size: "1024x1024", quality: "standard" }),
      })
      if (imgRes.ok) {
        const imgData = await imgRes.json()
        coverImageUrl = imgData.data?.[0]?.url || ""
      }
    } catch (imgErr) { console.warn("Cover image generation failed:", imgErr) }

    // ── Assemble all content ──────────────────────────────────────────────
    const chapterOutline = (structure.chapterTitles || []).map((t: string, i: number) => `Chapter ${i + 1}: ${t}`)
    const checklistContent = `# Quick-Start Checklist: ${structure.productTitle || keyword}\n\n${checklistItems.map(item => `- [ ] ${item}`).join("\n")}`
    const workbookContent = `# Workbook: ${structure.productTitle || keyword}\n\n${chapterOutline.slice(0, 4).map((ch, i) =>
      `## Exercise ${i + 1}: ${ch.replace(/^Chapter \d+:\s*/i, "")}\n\n**Objective:** Apply concepts from this chapter.\n\n**Reflection Questions:**\n\n1. What is your biggest takeaway?\n\n_______________________________________________\n\n2. What one action will you take in the next 24 hours?\n\n_______________________________________________\n\n3. What obstacles might you face and how will you overcome them?\n\n_______________________________________________\n`).join("\n")}`
    const socialPromoPack = `# Social Media Promo Pack: ${structure.productTitle || keyword}\n\n## 📱 Instagram/Facebook Posts\n\n${(socialData.posts || []).map((p: string, i: number) => `**Post ${i + 1}:**\n${p}`).join("\n\n")}\n\n## 🎬 TikTok/Reels Scripts\n\n${(socialData.reels || []).map((s: string, i: number) => `**Reel ${i + 1}:**\n${s}`).join("\n\n")}\n\n## #️⃣ Hashtag Pack\n\n${(socialData.hashtags || []).join(" ")}`

    const output = {
      productTitle: structure.productTitle || keyword,
      productPromise: structure.productPromise || "",
      ebookTitle: structure.ebookTitle || keyword,
      chapterOutline,
      ebookDraft,
      coverPrompt: structure.coverPrompt || "",
      coverImageUrl,
      checklistContent,
      workbookContent,
      bonusTitle: structure.bonusTitle || "Bonus Guide",
      bonusContent,
      salesPageCopy,
      emailSequence,
      miniCourse,
      socialPromoPack,
      ebookHtml: buildHtmlEbook({ ebookTitle: structure.ebookTitle, productTitle: structure.productTitle, productPromise: structure.productPromise, chapterOutline, ebookDraft, coverImageUrl }),
    }

    // Save to DB
    let projectId = null
    try {
      const { PrismaClient } = await import("@prisma/client")
      const prisma = new PrismaClient()
      const project = await prisma.assetFactoryProject.create({
        data: { userId: user.id, title: output.productTitle, niche: keyword, targetAudience: audience || "", desiredOutcome: outcome || "", offerType: "Digital Product", tone: "Professional", cta: "Buy Now", industry: "General", pricePoint: pricePoint || "$27", status: "complete" },
      })
      projectId = project.id
      await prisma.$disconnect()
    } catch (dbErr) { console.warn("DB save skipped:", dbErr) }

    return NextResponse.json({ success: true, output, projectId })
  } catch (err: any) {
    console.error("Product generation error:", err)
    return NextResponse.json({ error: err.message || "Generation failed" }, { status: 500 })
  }
}

async function callAI(prompt: string, maxTokens: number): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY!, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: maxTokens, messages: [{ role: "user", content: prompt }] }),
  })
  if (!res.ok) throw new Error(`AI call failed: ${res.status}`)
  const data = await res.json()
  return data.content[0].text.trim()
}

function parseJSON(text: string): any {
  const clean = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim()
  try { return JSON.parse(clean) } catch {
    const match = clean.match(/[\[{][\s\S]*[\]}]/)
    if (match) { try { return JSON.parse(match[0]) } catch {} }
    throw new Error("Parse failed")
  }
}

function buildHtmlEbook(output: any): string {
  const title = output.ebookTitle || output.productTitle || "Your Guide"
  const promise = output.productPromise || ""
  const draft = output.ebookDraft || ""
  const coverImg = output.coverImageUrl || ""
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
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;max-width:860px;margin:0 auto;color:#1a1a2e;line-height:1.9;background:#fff;font-size:16px}
.cover{background:linear-gradient(150deg,#0a0a2e 0%,#1a1a6e 40%,#0d47a1 100%);color:white;padding:80px 60px;text-align:center;position:relative;overflow:hidden;min-height:500px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.cover::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(255,200,0,.15) 0%,transparent 60%)}
.cover-img{width:100%;max-width:400px;border-radius:12px;box-shadow:0 30px 80px rgba(0,0,0,.5);margin-bottom:40px;position:relative;z-index:1}
.cover-badge{background:rgba(255,200,0,.2);border:1px solid rgba(255,200,0,.4);color:#ffd700;font-size:.75em;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:6px 18px;border-radius:50px;margin-bottom:20px;display:inline-block;position:relative;z-index:1}
.cover h1{font-family:'Playfair Display',serif;color:white;font-size:2.8em;margin-bottom:16px;line-height:1.15;text-shadow:0 2px 20px rgba(0,0,0,.3);position:relative;z-index:1}
.cover p{color:rgba(255,255,255,.8);font-size:1.05em;max-width:540px;line-height:1.7;position:relative;z-index:1}
.cover-line{width:60px;height:3px;background:linear-gradient(90deg,#ffd700,#ff9800);margin:20px auto;border-radius:2px;position:relative;z-index:1}
.toc{background:#f8f8ff;border-left:5px solid #1a1a6e;padding:35px 40px;margin:60px 40px 50px;border-radius:0 12px 12px 0}
.toc-title{font-family:'Playfair Display',serif;color:#1a1a6e;font-size:1.2em;font-weight:700;margin-bottom:20px;display:flex;align-items:center;gap:10px}
.toc ol{padding-left:24px}
.toc li{margin:8px 0;color:#374151;font-size:.95em}
.content{padding:20px 50px 60px}
h1{font-family:'Playfair Display',serif;color:#0a0a2e;font-size:2em;border-bottom:3px solid #1a1a6e;padding-bottom:14px;margin:60px 0 24px}
h2{font-family:'Playfair Display',serif;color:#1a1a6e;font-size:1.5em;margin:50px 0 16px;display:flex;align-items:center;gap:10px}
h2::before{content:'';display:block;width:5px;height:1.5em;background:linear-gradient(180deg,#ffd700,#ff9800);border-radius:3px;flex-shrink:0}
h3{color:#1a3a8e;font-size:1.15em;margin:30px 0 10px;font-weight:600}
h4{color:#2d4fa0;font-size:1em;margin:20px 0 8px;text-transform:uppercase;letter-spacing:.06em;font-size:.85em}
p{margin:16px 0;color:#374151}
ul,ol{padding-left:28px;margin:16px 0}
li{margin:9px 0;color:#374151}
strong{color:#1a1a6e;font-weight:600}
em{color:#555;font-style:italic}
.tip{background:linear-gradient(135deg,#f0f4ff,#e8efff);border-left:5px solid #1a1a6e;padding:22px 28px;margin:28px 0;border-radius:0 12px 12px 0;position:relative}
.tip::before{content:'💡';position:absolute;top:-12px;left:20px;font-size:1.4em}
blockquote{border-left:4px solid #ffd700;padding:16px 24px;margin:24px 0;background:#fffbf0;font-style:italic;color:#555;border-radius:0 8px 8px 0}
.chapter-header{background:linear-gradient(135deg,#0a0a2e,#1a1a6e);color:white;padding:30px 40px;margin:60px -50px 30px;position:relative;overflow:hidden}
.chapter-header::after{content:'';position:absolute;right:30px;top:50%;transform:translateY(-50%);width:80px;height:80px;background:rgba(255,200,0,.1);border-radius:50%}
.chapter-header h2{color:white;margin:0;border:none;font-size:1.6em}
.chapter-header h2::before{background:linear-gradient(180deg,rgba(255,200,0,.8),rgba(255,150,0,.8))}
.chapter-num{color:rgba(255,200,0,.7);font-size:.8em;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px}
.footer{background:#0a0a2e;color:rgba(255,255,255,.6);text-align:center;padding:30px 40px;font-size:.82em;margin-top:60px}
.footer strong{color:#ffd700}
</style></head><body>
<div class="cover">
  ${coverImg ? `<img src="${coverImg}" alt="${title}" class="cover-img">` : ""}
  <div class="cover-badge">Digital Guide</div>
  <h1>${title}</h1>
  <div class="cover-line"></div>
  <p>${promise}</p>
</div>
<div class="toc">
  <div class="toc-title">📋 Table of Contents</div>
  <ol>${(output.chapterOutline || []).map((ch: string) => `<li>${ch.replace(/^Chapter \d+:\s*/i, "")}</li>`).join("")}</ol>
</div>
<div class="content"><p>${html}</p></div>
<div class="footer"><p>© ${new Date().getFullYear()} <strong>${title}</strong> — Generated by WebinarForge AI Asset Factory™</p></div>
</body></html>`
}
