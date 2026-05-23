// lib/asset-factory/generate.ts

export interface AssetFactoryInput {
  niche: string
  targetAudience: string
  desiredOutcome: string
  offerType: string
  tone: string
  cta: string
  industry: string
  pricePoint: string
}

export interface AssetFactoryOutput {
  strategic_intelligence: {
    pain_points: string[]
    dream_outcome: string
    market_positioning: string
    unique_mechanism: string
    offer_angle: string
    objections: string[]
    big_promise: string
    hooks: string[]
  }
  offer_engineering: {
    product_name: string
    offer_stack: string[]
    bonuses: string[]
    guarantee: string
    urgency: string
    pricing: string
    value_ladder: string[]
    order_bump: string
    upsell: string
    downsell: string
  }
  digital_product: {
    ebook_title: string
    ebook_outline: string[]
    ebook_draft: string
    checklist: string[]
    workbook: string
    swipe_file: string[]
    lead_magnet: string
  }
  webinar_engine: {
    webinar_title: string
    perfect_webinar_script: string
    slide_outline: string[]
    cta_close: string
    objection_handling: string
    follow_up_sequence: string[]
  }
  ai_video_content: {
    reel_scripts: string[]
    heygen_avatar_script: string
    scene_direction: string
    broll_suggestions: string[]
    caption_package: string[]
    hashtags: string[]
    cta_keyword: string
  }
  funnel_crm_assets: {
    landing_page_copy: string
    thank_you_page_copy: string
    booking_page_copy: string
    email_sequence: string[]
    sms_sequence: string[]
    pipeline_stages: string[]
    highlevel_workflow_outline: string
  }
}

export async function generateAssetFactory(input: AssetFactoryInput): Promise<AssetFactoryOutput> {
  const prompt = `You are an elite marketing strategist and copywriter. Generate a complete business asset package for the following business:

BUSINESS DETAILS:
- Niche: ${input.niche}
- Target Audience: ${input.targetAudience}
- Desired Outcome: ${input.desiredOutcome}
- Offer Type: ${input.offerType}
- Tone/Style: ${input.tone}
- Main CTA: ${input.cta}
- Industry: ${input.industry}
- Price Point: ${input.pricePoint}

Generate a comprehensive, production-ready asset package. Be specific, detailed, and actionable. Use real marketing principles. Write copy that converts.

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):

{
  "strategic_intelligence": {
    "pain_points": ["5 specific pain points the target audience faces"],
    "dream_outcome": "The specific transformation they want",
    "market_positioning": "How to position against competitors",
    "unique_mechanism": "The unique mechanism that makes this offer different",
    "offer_angle": "The specific angle to approach the market",
    "objections": ["5 common objections and how to handle them"],
    "big_promise": "The big bold promise of the offer",
    "hooks": ["8 powerful hook ideas for content and ads"]
  },
  "offer_engineering": {
    "product_name": "Compelling product name",
    "offer_stack": ["List of everything included in the offer"],
    "bonuses": ["3-5 bonus items that increase perceived value"],
    "guarantee": "Specific guarantee wording",
    "urgency": "Urgency and scarcity angle",
    "pricing": "Pricing recommendation with justification",
    "value_ladder": ["Entry level", "Core offer", "Premium", "VIP/Done-for-you"],
    "order_bump": "Order bump idea and copy",
    "upsell": "Upsell offer and copy",
    "downsell": "Downsell offer and copy"
  },
  "digital_product": {
    "ebook_title": "Compelling ebook title",
    "ebook_outline": ["10 chapter titles with descriptions"],
    "ebook_draft": "Full 800-word introduction chapter",
    "checklist": ["15-item actionable checklist"],
    "workbook": "Full workbook introduction with 3 exercises",
    "swipe_file": ["5 email swipe copy pieces"],
    "lead_magnet": "Lead magnet concept and delivery description"
  },
  "webinar_engine": {
    "webinar_title": "High-converting webinar title",
    "perfect_webinar_script": "Full Perfect Webinar framework script (1200+ words)",
    "slide_outline": ["20 slide titles with content descriptions"],
    "cta_close": "Full close script with price reveal and CTA",
    "objection_handling": "Full objection handling section (500+ words)",
    "follow_up_sequence": ["7 follow-up email subjects and body copy"]
  },
  "ai_video_content": {
    "reel_scripts": ["10 complete short-form video scripts (30-60 seconds each)"],
    "heygen_avatar_script": "Full HeyGen avatar presentation script (500+ words)",
    "scene_direction": "Detailed scene direction and visual instructions",
    "broll_suggestions": ["10 specific B-roll shot ideas"],
    "caption_package": ["10 platform-optimized captions with emojis"],
    "hashtags": ["30 relevant hashtags organized by category"],
    "cta_keyword": "Primary CTA keyword for comments"
  },
  "funnel_crm_assets": {
    "landing_page_copy": "Full landing page copy with headline, subheadline, bullets, and CTA (800+ words)",
    "thank_you_page_copy": "Thank you page copy with next steps",
    "booking_page_copy": "Booking/call page copy",
    "email_sequence": ["7 complete nurture emails with subject lines and full body copy"],
    "sms_sequence": ["5 SMS follow-up messages"],
    "pipeline_stages": ["CRM pipeline stages with descriptions"],
    "highlevel_workflow_outline": "Complete HighLevel automation workflow description"
  }
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
    throw new Error(`AI generation failed: ${err}`)
  }

  const data = await response.json()
  const text = data.content[0].text.trim()

  // Strip markdown if present
  const clean = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim()

  try {
    return JSON.parse(clean) as AssetFactoryOutput
  } catch {
    throw new Error("Failed to parse AI response as JSON")
  }
}
