import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title =
      typeof body.offerName === "string" && body.offerName.trim()
        ? body.offerName.trim()
        : "Untitled Webinar";

    const niche =
      typeof body.niche === "string" && body.niche.trim()
        ? body.niche.trim()
        : "General Audience";

    const corePromise =
      typeof body.desiredOutcome === "string" && body.desiredOutcome.trim()
        ? body.desiredOutcome.trim()
        : "Help the audience get a better result";

    const cta =
      typeof body.ctaGoal === "string" && body.ctaGoal.trim()
        ? body.ctaGoal.trim()
        : "Book a call";

    const audience =
      typeof body.idealAudience === "string" && body.idealAudience.trim()
        ? body.idealAudience.trim()
        : niche;

    const prompt = `
You are an elite direct-response webinar strategist inspired by Russell Brunson's Perfect Webinar framework.

Create a high-converting webinar script for this offer:

Title: ${title}
Audience/Niche: ${audience}
Core Promise: ${corePromise}
Main CTA: ${cta}

Return the response in this exact structure:

### 1. Hook
<content>

### 2. Big Promise
<content>

### 3. Problem Agitation
<content>

### 4. Origin Story
<content>

### 5. Belief Shift
<content>

### 6. Teaching
<content>

### 7. CTA
<content>

Make it persuasive, clear, modern, and written for spoken delivery.
Keep it practical and valuable.
Do not return JSON.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content:
            "You write persuasive webinar scripts for SaaS, consultants, coaches, real estate, travel, and local business offers.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const script =
      response.choices[0]?.message?.content ?? "No script generated.";

    return NextResponse.json({
      success: true,
      script,
    });
  } catch (error) {
    console.error("POST /api/webinars/generate error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate webinar script",
      },
      { status: 500 }
    );
  }
}
