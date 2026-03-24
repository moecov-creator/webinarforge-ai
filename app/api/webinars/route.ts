import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
try {
const body = await req.json();

const { title, niche, promise, cta } = body;

// 🔥 STEP 1: Generate AI Script
const aiResponse = await openai.chat.completions.create({
model: "gpt-4o-mini",
messages: [
{
role: "system",
content:
"You are a Russell Brunson style webinar script expert.",
},
{
role: "user",
content: `
Create a high-converting webinar script.

Niche: ${niche}
Promise: ${promise}
CTA: ${cta}

Structure:
1. Hook
2. Big Promise
3. Problem Agitation
4. Origin Story
5. Teaching (Steps)
6. Offer Transition
7. CTA
`,
},
],
});

const script =
aiResponse.choices[0]?.message?.content || "No script generated";

// 🔥 STEP 2: Save EVERYTHING (including script)
const webinar = await prisma.webinar.create({
data: {
title,
niche,
promise,
cta,
script, // ✅ THIS IS THE KEY FIX
status: "DRAFT",
},
});

return NextResponse.json(webinar);
} catch (error: any) {
console.error(error);
return NextResponse.json(
{ error: "Failed to create webinar" },
{ status: 500 }
);
}
}
