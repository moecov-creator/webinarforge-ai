import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
try {
const body = await req.json();

const title =
typeof body.title === "string" && body.title.trim()
? body.title.trim()
: "Untitled Webinar";

const niche =
typeof body.niche === "string" && body.niche.trim()
? body.niche.trim()
: "General Audience";

const corePromise =
typeof body.corePromise === "string" && body.corePromise.trim()
? body.corePromise.trim()
: "Help the audience get a better result";

const cta =
typeof body.cta === "string" && body.cta.trim()
? body.cta.trim()
: "Book a call";

const section =
typeof body.section === "string" && body.section.trim()
? body.section.trim().toLowerCase()
: "";

if (section) {
const currentText =
typeof body.currentText === "string" ? body.currentText : "";

const sectionPrompt = `
You are an elite direct-response webinar strategist inspired by Russell Brunson's Perfect Webinar framework.

Rewrite ONLY this section of a webinar script.

Webinar Title: ${title}
Audience/Niche: ${niche}
Core Promise: ${corePromise}
Main CTA: ${cta}
Section To Rewrite: ${section}

Current Section:
${currentText}

Rules:
- Return only the rewritten section
- Keep it persuasive and concise
- Keep it suitable for spoken delivery
- Do not include explanations
- Do not return JSON
`;

const response = await openai.chat.completions.create({
model: "gpt-4o-mini",
temperature: 0.9,
messages: [
{
role: "system",
content:
"You rewrite webinar script sections for high-converting sales webinars.",
},
{
role: "user",
content: sectionPrompt,
},
],
});

const rewritten =
response.choices[0]?.message?.content ?? "No section generated.";

return NextResponse.json({
success: true,
section,
content: rewritten,
});
}

const prompt = `
You are an elite direct-response webinar strategist inspired by Russell Brunson's Perfect Webinar framework.

Create a high-converting webinar script for this offer:

Title: ${title}
Audience/Niche: ${niche}
Core Promise: ${corePromise}
Main CTA: ${cta}

Return the response in this exact structure:

### 1. Hook
### 2. Big Promise
### 3. Problem Agitation
### 4. Origin Story
### 5. Belief Shift
### 6. Teaching
### 7. CTA

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

const script = response.choices[0]?.message?.content ?? "No script generated.";

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
