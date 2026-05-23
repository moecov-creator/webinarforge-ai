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
  const prompt = `You are an elite marketing strategist. Generate a complete business asset package as valid JSON only (no markdown, no explanation).

BUSINESS:
- Niche: ${input.niche}
- Audience: ${input.targetAudience}
- Outcome: ${input.desiredOutcome}
- Offer Type: ${input.offerType}
- Tone: ${input.tone}
- CTA: ${input.cta}
- Industry: ${input.industry}
- Price: ${input.pricePoint}

Return ONLY this JSON structure with real, specific, high-converting content:

{
  "strategic_intelligence": {
    "pain_points": ["pain 1","pain 2","pain 3","pain 4","pain 5"],
    "dream_outcome": "specific transformation",
    "market_positioning": "positioning statement",
    "unique_mechanism": "unique mechanism name and explanation",
    "offer_angle": "specific angle",
    "objections": ["objection 1 + reframe","objection 2 + reframe","objection 3 + reframe"],
    "big_promise": "bold promise statement",
    "hooks": ["hook 1","hook 2","hook 3","hook 4","hook 5","hook 6","hook 7","hook 8"]
  },
  "offer_engineering": {
    "product_name": "compelling product name",
    "offer_stack": ["item 1","item 2","item 3","item 4","item 5"],
    "bonuses": ["bonus 1 with value","bonus 2 with value","bonus 3 with value"],
    "guarantee": "specific guarantee wording",
    "urgency": "urgency angle",
    "pricing": "pricing recommendation with justification",
    "value_ladder": ["entry $27","core $297","premium $997","VIP $2997"],
    "order_bump": "order bump description and price",
    "upsell": "upsell description and price",
    "downsell": "downsell description and price"
  },
  "digital_product": {
    "ebook_title": "compelling title",
    "ebook_outline": ["Chapter 1: title","Chapter 2: title","Chapter 3: title","Chapter 4: title","Chapter 5: title","Chapter 6: title","Chapter 7: title"],
    "ebook_draft": "400 word introduction chapter with hook, promise, and overview",
    "checklist": ["step 1","step 2","step 3","step 4","step 5","step 6","step 7","step 8","step 9","step 10"],
    "workbook": "workbook intro with 2 exercises",
    "swipe_file": ["email swipe 1 subject + body","email swipe 2 subject + body","email swipe 3 subject + body"],
    "lead_magnet": "lead magnet concept and delivery"
  },
  "webinar_engine": {
    "webinar_title": "high-converting webinar title",
    "perfect_webinar_script": "600 word Perfect Webinar script with intro, story, content, offer, close",
    "slide_outline": ["Slide 1: title","Slide 2: title","Slide 3: title","Slide 4: title","Slide 5: title","Slide 6: title","Slide 7: title","Slide 8: title","Slide 9: title","Slide 10: title"],
    "cta_close": "full close script with price reveal and urgency",
    "objection_handling": "300 word objection handling for top 3 objections",
    "follow_up_sequence": ["Day 1: subject + body","Day 2: subject + body","Day 3: subject + body","Day 4: subject + body","Day 5: subject + body"]
  },
  "ai_video_content": {
    "reel_scripts": ["Reel 1 (30s): full script","Reel 2 (30s): full script","Reel 3 (30s): full script","Reel 4 (30s): full script","Reel 5 (30s): full script"],
    "heygen_avatar_script": "300 word avatar presentation script",
    "scene_direction": "visual direction and scene instructions",
    "broll_suggestions": ["broll 1","broll 2","broll 3","broll 4","broll 5"],
    "caption_package": ["caption 1 with emojis","caption 2 with emojis","caption 3 with emojis","caption 4 with emojis","caption 5 with emojis"],
    "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10","#tag11","#tag12","#tag13","#tag14","#tag15"],
    "cta_keyword": "primary CTA keyword"
  },
  "funnel_crm_assets": {
    "landing_page_copy": "400 word landing page with headline, subheadline, bullets, social proof, CTA",
    "thank_you_page_copy": "thank you page with next steps and upsell bridge",
    "booking_page_copy": "booking page copy with what to expect",
    "email_sequence": ["Email 1 subject + body","Email 2 subject + body","Email 3 subject + body","Email 4 subject + body","Email 5 subject + body"],
    "sms_sequence": ["SMS 1","SMS 2","SMS 3","SMS 4","SMS 5"],
    "pipeline_stages": ["Stage 1: name + action","Stage 2: name + action","Stage 3: name + action","Stage 4: name + action","Stage 5: name + action"],
    "highlevel_workflow_outline": "complete HL automation workflow with triggers and actions"
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
      max_tokens: 6000,
      messages: [{ role: "user", content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`AI generation failed: ${err}`)
  }

  const data = await response.json()
  const text = data.content[0].text.trim()
  const clean = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim()

  try {
    return JSON.parse(clean) as AssetFactoryOutput
  } catch {
    throw new Error("Failed to parse AI response as JSON")
  }
}
