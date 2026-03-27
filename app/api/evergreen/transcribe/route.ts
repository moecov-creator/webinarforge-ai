// app/api/evergreen/transcribe/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const maxDuration = 300; // 5 min timeout for large videos
export const dynamic = "force-dynamic";

// ── Types ──────────────────────────────────────────────────────────
interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

interface SmartChat {
  id: string;
  name: string;
  city: string;
  message: string;
  showAt: number;
  showAtFrac: number;
  cueType: string;
}

// ── Name/city pools ────────────────────────────────────────────────
const FIRST_NAMES = [
  "Jason","Michael","David","James","Robert","William","John","Christopher","Daniel","Matthew",
  "Anthony","Mark","Steven","Paul","Andrew","Joshua","Kenneth","Kevin","Brian","Eric",
  "Sarah","Jennifer","Amanda","Jessica","Ashley","Emily","Stephanie","Nicole","Elizabeth","Megan",
  "Melissa","Lauren","Rachel","Samantha","Katherine","Christine","Angela","Brenda","Amy","Anna",
  "Carlos","Miguel","Marcus","Andre","Darius","Terrence","Malik","Priya","Aisha","Sofia",
  "Tyler","Brandon","Austin","Dylan","Ethan","Logan","Hunter","Caleb","Blake","Nathan",
  "Patricia","Sandra","Donna","Carol","Sharon","Deborah","Cheryl","Janet","Monica","Tiffany",
  "Trevor","Evan","Sean","Aaron","Adam","Justin","Bryan","Jeremy","Travis","Derrick",
];
const LAST_SHORT = ["M.","K.","T.","R.","B.","W.","J.","H.","C.","D.","L.","P.","S.","N.","F.","G."];
const LAST_FULL  = [
  "Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson","Anderson","Taylor",
  "Thomas","Jackson","White","Harris","Martin","Thompson","Robinson","Clark","Lewis","Walker",
  "Howard","Young","Allen","King","Wright","Scott","Green","Baker","Adams","Nelson",
  "Carter","Mitchell","Perez","Roberts","Turner","Phillips","Campbell","Parker","Evans","Edwards",
];
const CITIES = [
  "New York, NY","Los Angeles, CA","Chicago, IL","Houston, TX","Phoenix, AZ",
  "San Antonio, TX","San Diego, CA","Dallas, TX","Austin, TX","Jacksonville, FL",
  "Fort Worth, TX","Columbus, OH","Charlotte, NC","Indianapolis, IN","San Francisco, CA",
  "Seattle, WA","Denver, CO","Nashville, TN","Oklahoma City, OK","Washington, DC",
  "Boston, MA","Memphis, TN","Louisville, KY","Portland, OR","Baltimore, MD",
  "Las Vegas, NV","Atlanta, GA","Miami, FL","Orlando, FL","Tampa, FL",
  "Minneapolis, MN","Kansas City, MO","Pittsburgh, PA","Cincinnati, OH","St. Louis, MO",
  "London, UK","Manchester, UK","Birmingham, UK","Paris, France","Berlin, Germany",
  "Munich, Germany","Madrid, Spain","Barcelona, Spain","Rome, Italy","Amsterdam, Netherlands",
  "Brussels, Belgium","Zurich, Switzerland","Vienna, Austria","Stockholm, Sweden","Dublin, Ireland",
  "Toronto, Canada","Vancouver, Canada","Sydney, Australia","Melbourne, Australia","Dubai, UAE",
];

function randomName(seed: number): string {
  const first = FIRST_NAMES[seed % FIRST_NAMES.length];
  const fmt = seed % 5;
  if (fmt===0) return `${first} ${LAST_SHORT[seed%LAST_SHORT.length]}`;
  if (fmt===1) return `${first} ${LAST_FULL[seed%LAST_FULL.length]}`;
  if (fmt===2) return `${first}${LAST_FULL[seed%LAST_FULL.length].charAt(0)}`;
  if (fmt===3) return `${first.slice(0,3)}${LAST_FULL[(seed+3)%LAST_FULL.length].slice(0,3)}`;
  return `${first} ${LAST_SHORT[(seed+7)%LAST_SHORT.length]}`;
}

function randomCity(seed: number): string {
  return CITIES[seed % CITIES.length];
}

// ── Route handler ──────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const videoFile = formData.get("video") as File | null;
    const durationStr = formData.get("duration") as string | null;
    const duration = durationStr ? parseInt(durationStr) : 0;

    if (!videoFile) {
      return NextResponse.json({ success: false, error: "No video file provided" }, { status: 400 });
    }

    // ── Step 1: Transcribe with Whisper ──────────────────────────
    console.log(`Transcribing video: ${videoFile.name} (${Math.round(videoFile.size/1024/1024)}MB)`);

    const transcriptionResponse = await openai.audio.transcriptions.create({
      file: videoFile,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    });

    const segments: TranscriptSegment[] = (transcriptionResponse as any).segments || [];
    const fullText = transcriptionResponse.text || "";
    const detectedDuration = segments.length > 0
      ? segments[segments.length - 1].end
      : duration || 3600;

    const finalDuration = duration > 0 ? duration : Math.round(detectedDuration);

    console.log(`Transcription complete. Duration: ${finalDuration}s. Segments: ${segments.length}`);

    // ── Step 2: Build segment summary for Claude ─────────────────
    // Group segments into ~20 chunks for analysis
    const chunkCount = Math.min(20, segments.length);
    const chunkSize = Math.max(1, Math.floor(segments.length / chunkCount));

    const segmentSummaries = segments.length > 0
      ? Array.from({length: chunkCount}, (_, i) => {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, segments.length);
          const chunk = segments.slice(start, end);
          const timeStart = chunk[0]?.start || 0;
          const timeEnd = chunk[chunk.length-1]?.end || 0;
          const text = chunk.map(s => s.text).join(" ").trim();
          return `[${Math.round(timeStart)}s–${Math.round(timeEnd)}s]: ${text.slice(0, 300)}`;
        }).join("\n")
      : `Full transcript (${finalDuration}s): ${fullText.slice(0, 3000)}`;

    // ── Step 3: Claude analyzes transcript and generates chat ─────
    const analysisPrompt = `You are analyzing a webinar transcript to generate realistic simulated audience chat messages.

WEBINAR TRANSCRIPT (with timestamps):
${segmentSummaries}

Total duration: ${finalDuration} seconds (${Math.round(finalDuration/60)} minutes)

Your job: Generate exactly 160 realistic audience chat messages that are CONTEXTUALLY ACCURATE to what the presenter is actually saying at each timestamp.

Rules:
1. Messages must match what the presenter is discussing at that specific time
2. Include these cue types based on what the presenter says:
   - "type1": When presenter says "type 1", "comment 1", "drop a 1" — have 15-25 people respond with "1", "1️⃣", "1 ✅", etc. + their city
   - "dropCity": When presenter asks where people are from — city responses
   - "react": At value bombs, shocking stats, key revelations — emotional reactions
   - "question": At confusing or deep points — relevant questions about the ACTUAL topic
   - "testimonial": After success stories — related success stories from audience
   - "general": General engagement throughout
   - "joining": First 60 seconds — people joining

3. Questions and reactions must be SPECIFIC to the actual webinar topic, not generic
4. Spread messages across the FULL ${finalDuration} seconds — don't cluster at the start
5. Each person has a name (varied formats) and US/European city

Return ONLY valid JSON array, no markdown, no explanation:
[
  {
    "name": "Jason C.",
    "city": "Dallas, TX",
    "message": "1 from Dallas!",
    "showAt": 245,
    "cueType": "type1"
  }
]

Generate all 160 messages. Make them feel like a real live webinar audience reacting to THIS specific content.`;

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 8000,
      temperature: 0.85,
      messages: [
        {
          role: "system",
          content: "You generate realistic webinar chat messages. Always respond with valid JSON array only. No markdown, no code fences, no explanation.",
        },
        { role: "user", content: analysisPrompt },
      ],
    });

    const rawContent = chatResponse.choices[0]?.message?.content || "[]";

    // Parse the response
    let generatedChats: any[] = [];
    try {
      const cleaned = rawContent.replace(/```json|```/g, "").trim();
      generatedChats = JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse chat JSON:", err);
      // Fallback: extract JSON array from the response
      const match = rawContent.match(/\[[\s\S]*\]/);
      if (match) {
        try { generatedChats = JSON.parse(match[0]); } catch {}
      }
    }

    // ── Step 4: Normalize and validate chats ─────────────────────
    const validCueTypes = ["type1","dropCity","react","question","testimonial","general","joining"];

    const normalizedChats: SmartChat[] = generatedChats
      .filter((c: any) => c && typeof c.message === "string" && typeof c.showAt === "number")
      .map((c: any, i: number) => {
        const showAt = Math.max(0, Math.min(Math.round(c.showAt), finalDuration - 5));
        return {
          id: String(i),
          name: c.name || randomName(i * 7),
          city: c.city || randomCity(i * 13),
          message: c.message,
          showAt,
          showAtFrac: showAt / finalDuration,
          cueType: validCueTypes.includes(c.cueType) ? c.cueType : "general",
        };
      })
      .sort((a: SmartChat, b: SmartChat) => a.showAt - b.showAt);

    // If we got fewer than 100 chats, pad with generic ones
    if (normalizedChats.length < 100) {
      console.warn(`Only got ${normalizedChats.length} chats, padding...`);
      const padding = generatePaddingChats(finalDuration, 160 - normalizedChats.length, normalizedChats.length);
      normalizedChats.push(...padding);
      normalizedChats.sort((a, b) => a.showAt - b.showAt);
    }

    return NextResponse.json({
      success: true,
      chats: normalizedChats,
      duration: finalDuration,
      transcript: {
        text: fullText.slice(0, 1000) + (fullText.length > 1000 ? "..." : ""),
        segmentCount: segments.length,
      },
    });

  } catch (error) {
    console.error("Transcribe route error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Transcription failed" },
      { status: 500 }
    );
  }
}

function generatePaddingChats(duration: number, count: number, startId: number): SmartChat[] {
  const FIRST_NAMES_P = ["Sarah","Jason","Michael","Jennifer","Marcus","Priya","Tyler","Amanda","David","Nicole"];
  const CITIES_P = ["New York, NY","Dallas, TX","Chicago, IL","Atlanta, GA","London, UK","Los Angeles, CA","Miami, FL","Austin, TX","Paris, France","Seattle, WA"];
  const messages = ["🔥🔥🔥","This is incredible!","Taking notes!","Mind blown 🤯","Gold right here 💰","This changes everything","WOW","💯💯","So glad I showed up today!","Sharing this with my team"];

  return Array.from({length: count}, (_, i) => {
    const seed = (startId + i) * 7;
    const showAt = Math.round((i / count) * duration * 0.9) + Math.floor(Math.random() * 30);
    return {
      id: String(startId + i),
      name: `${FIRST_NAMES_P[seed % FIRST_NAMES_P.length]} ${["M.","T.","K.","R.","B."][seed%5]}`,
      city: CITIES_P[seed % CITIES_P.length],
      message: messages[seed % messages.length],
      showAt: Math.min(showAt, duration - 5),
      showAtFrac: Math.min(showAt, duration - 5) / duration,
      cueType: "react" as const,
    };
  });
}
