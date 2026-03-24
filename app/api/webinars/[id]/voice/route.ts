import { NextResponse } from "next/server";

export async function POST(
req: Request,
{ params }: { params: { id: string } }
) {
try {
const body = await req.json();

const script =
typeof body.script === "string" && body.script.trim()
? body.script.trim()
: "";

const voiceId =
typeof body.voiceId === "string" && body.voiceId.trim()
? body.voiceId.trim()
: "";

if (!script) {
return NextResponse.json(
{ success: false, error: "Missing script" },
{ status: 400 }
);
}

if (!voiceId) {
return NextResponse.json(
{ success: false, error: "Missing ElevenLabs voiceId" },
{ status: 400 }
);
}

const apiKey = process.env.ELEVENLABS_API_KEY;

if (!apiKey) {
return NextResponse.json(
{ success: false, error: "Missing ELEVENLABS_API_KEY" },
{ status: 500 }
);
}

const response = await fetch(
`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
"xi-api-key": apiKey,
},
body: JSON.stringify({
text: script,
model_id: "eleven_multilingual_v2",
voice_settings: {
stability: 0.5,
similarity_boost: 0.75,
},
}),
}
);

if (!response.ok) {
const text = await response.text();
return NextResponse.json(
{
success: false,
error: `ElevenLabs error: ${text}`,
},
{ status: 500 }
);
}

const arrayBuffer = await response.arrayBuffer();
const base64Audio = Buffer.from(arrayBuffer).toString("base64");
const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

return NextResponse.json({
success: true,
audioUrl,
webinarId: params.id,
});
} catch (error) {
console.error("POST /api/webinars/[id]/voice error:", error);

return NextResponse.json(
{
success: false,
error:
error instanceof Error ? error.message : "Failed to generate voice",
},
{ status: 500 }
);
}
}
