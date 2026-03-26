import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

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

    // Generate the full script from OpenAI
    const prompt = `
You are an elite direct-response webinar strategist inspired by Russell Brunson's Perfect Webinar framework.

Create a high-converting webinar script for this offer:

Title: ${title}
Audience/Niche: ${audience}
Core Promise: ${corePromise}
Main CTA: ${cta}

Return the response in this EXACT JSON structure with no extra text, no markdown, no code fences:
{
  "hook": "...",
  "promise": "...",
  "problem": "...",
  "origin": "...",
  "teaching1": "...",
  "teaching2": "...",
  "transition": "...",
  "cta": "..."
}

Each field should be 2-5 sentences, persuasive, and written for spoken delivery.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content:
            "You write persuasive webinar scripts. Always respond with valid JSON only, no markdown or code fences.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const raw = response.choices[0]?.message?.content ?? "{}";

    // Safely parse the JSON — strip any accidental code fences
    let sections: Record<string, string> = {};
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      sections = JSON.parse(cleaned);
    } catch {
      // If parsing fails, leave fields empty — the editor can still be used
      console.error("Failed to parse OpenAI script JSON:", raw);
    }

    // Save the webinar + script to the database
    const webinar = await prisma.webinar.create({
      data: {
        userId,
        title,
        niche,
        scriptHook:       sections.hook       ?? "",
        scriptPromise:    sections.promise     ?? "",
        scriptProblem:    sections.problem     ?? "",
        scriptOrigin:     sections.origin      ?? "",
        scriptTeaching1:  sections.teaching1   ?? "",
        scriptTeaching2:  sections.teaching2   ?? "",
        scriptTransition: sections.transition  ?? "",
        scriptCTA:        sections.cta         ?? "",
      },
    });

    return NextResponse.json({
      success: true,
      webinarId: webinar.id,
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
