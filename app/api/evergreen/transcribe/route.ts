// app/api/evergreen/transcribe/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const maxDuration = 300;
export const dynamic = "force-dynamic";

// ── Vercel body size limit fix ─────────────────────────────────────
// By default Vercel limits request bodies to 4.5MB on hobby plans
// and ~100MB on Pro. For large video files we need to handle this.
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

// ── Name / city pools ──────────────────────────────────────────────
const FIRST_NAMES = [
  "Jason","Michael","David","James","Robert","William","John","Christopher","Daniel","Matthew",
  "Sarah","Jennifer","Amanda","Jessica","Ashley","Emily","Stephanie","Nicole","Elizabeth","Megan",
  "Carlos","Miguel","Marcus","Andre","Darius","Priya","Aisha","Sofia","Tyler","Brandon",
  "Patricia","Sandra","Donna","Carol","Sharon","Trevor","Evan","Sean","Aaron","Adam",
  "Monica","Tiffany","Jasmine","Keisha","Brianna","Destiny","Crystal","Alexis","Nathan","Justin",
];
const LAST_SHORT = ["M.","K.","T.","R.","B.","W.","J.","H.","C.","D.","L.","P.","S.","N."];
const LAST_FULL  = [
  "Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson","Anderson","Taylor",
  "Thomas","Jackson","White","Harris","Martin","Thompson","Robinson","Clark","Lewis","Walker",
  "Carter","Mitchell","Perez","Roberts","Turner","Phillips","Campbell","Parker","Evans","Edwards",
];
const CITIES = [
  "New York, NY","Los Angeles, CA","Chicago, IL","Houston, TX","Dallas, TX",
  "Austin, TX","Atlanta, GA","Miami, FL","Seattle, WA","Denver, CO",
  "Nashville, TN","Boston, MA","Las Vegas, NV","Orlando, FL","Minneapolis, MN",
  "London, UK","Manchester, UK","Paris, France","Berlin, Germany","Madrid, Spain",
  "Toronto, Canada","Sydney, Australia","Dublin, Ireland","Amsterdam, Netherlands","Rome, Italy",
];

function randomName(seed: number): string {
  const first = FIRST_NAMES[seed % FIRST_NAMES.length];
  const fmt = seed % 4;
  if (fmt === 0) return `${first} ${LAST_SHORT[seed % LAST_SHORT.length]}`;
  if (fmt === 1) return `${first} ${LAST_FULL[seed % LAST_FULL.length]}`;
  if (fmt === 2) return `${first}${LAST_FULL[seed % LAST_FULL.length].charAt(0)}`;
  return `${first} ${LAST_SHORT[(seed + 7) % LAST_SHORT.length]}`;
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

// ── Fallback generator (proportional, no AI) ───────────────────────
function generateFallbackChats(duration: number): SmartChat[] {
  const cues = [
    { frac:0.01, type:"joining",     burst:12, responses:(city:string)=>[`Just joined from ${city}!`,`Hello from ${city} 👋`,`${city} checking in!`,`Made it! From ${city}`] },
    { frac:0.06, type:"dropCity",    burst:16, responses:(city:string)=>[city,`${city} 👋`,`Watching from ${city}`,`Live from ${city}`,`${city} in the house!`] },
    { frac:0.12, type:"react",       burst:8,  responses:(_:string)=>["🔥🔥🔥","Mind blown 🤯","Taking notes!","WOW","Gold right here 💰","YESSS","💯💯"] },
    { frac:0.16, type:"type1",       burst:20, responses:(city:string)=>["1","1️⃣","1 ✅","1 👍",`1 from ${city}`,"1 🙌","YES 1","1 — makes total sense","1 💯"] },
    { frac:0.24, type:"question",    burst:6,  responses:(_:string)=>["Does this work for beginners?","How long does this take?","Can I use this for B2B?","What software do you recommend?","How soon can I see results?"] },
    { frac:0.30, type:"react",       burst:9,  responses:(_:string)=>["This is incredible!","🙌🙌🙌","Screenshotting this!","Pure value 💎","This changes everything"] },
    { frac:0.36, type:"type1",       burst:18, responses:(city:string)=>["1","1 ✅",`1 from ${city}`,"1 👊","Typing 1!","1 absolutely","1 yes!!"] },
    { frac:0.42, type:"testimonial", burst:5,  responses:(_:string)=>["Applied this and closed a $5k deal same week!","This got me to $10k/month in 60 days 🎉","Finally broke 6 figures following these steps 🙏","Best investment I've ever made learning this"] },
    { frac:0.48, type:"react",       burst:8,  responses:(_:string)=>["🔥🔥🔥","This is insane!","💯💯💯","👏👏👏","Mind blown 🤯"] },
    { frac:0.54, type:"general",     burst:6,  responses:(city:string)=>[`Watching from ${city} — loving every minute`,"So glad I showed up today!","Taking tons of notes 📓","Pure value 💎"] },
    { frac:0.60, type:"type1",       burst:16, responses:(city:string)=>["1","1 ✅",`1 from ${city}`,"1 — been waiting for this","YES 1","1 👊"] },
    { frac:0.66, type:"question",    burst:5,  responses:(_:string)=>["Where do we sign up?","Is this recorded?","Do you offer coaching?","What's the investment?","Is there a community?"] },
    { frac:0.72, type:"react",       burst:9,  responses:(_:string)=>["🚀🚀","This is the missing piece","I needed to hear this today 🙏","Bookmark worthy content","Telling everyone I know"] },
    { frac:0.78, type:"type1",       burst:14, responses:(city:string)=>["1","1 💯",`1 from ${city}`,"1 — mind blown","Definitely 1","typing 1 rn"] },
    { frac:0.84, type:"testimonial", burst:5,  responses:(_:string)=>["This is how I replaced my 9-5 🙏","$22k last month using this exact system","Went from 0 to 4 clients using exactly this"] },
    { frac:0.90, type:"general",     burst:7,  responses:(_:string)=>["This is the most practical advice I've heard all year","My business will never be the same","Pure gold 💰","Incredible session!"] },
  ];

  const chats: SmartChat[] = [];
  let id = 0;
  cues.forEach(cue => {
    const baseTime = cue.frac * duration;
    const spreadSecs = 0.02 * duration;
    for (let i = 0; i < cue.burst; i++) {
      const seed = id * 7 + i * 13;
      const city = CITIES[seed % CITIES.length];
      const responses = cue.responses(city);
      const jitter = (i / cue.burst + Math.random() * 0.3) * spreadSecs;
      const showAt = Math.round(Math.min(baseTime + jitter, duration - 10));
      chats.push({
        id: String(id++),
        name: randomName(seed),
        city,
        message: responses[(seed + i) % responses.length],
        showAt,
        showAtFrac: showAt / duration,
        cueType: cue.type,
      });
    }
  });
  return chats.sort((a, b) => a.showAt - b.showAt);
}

// ── Route handler ──────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    // Check content length before parsing — Vercel Pro allows up to 100MB
    const contentLength = req.headers.get("content-length");
    const fileSizeMB = contentLength ? parseInt(contentLength) / 1024 / 1024 : 0;

    // If file is too large for Whisper (>25MB audio equivalent), use fallback
    // Whisper API limit is 25MB. Large video files need to be sent as audio only.
    if (fileSizeMB > 500) {
      return NextResponse.json({
        success: false,
        error: `File too large (${Math.round(fileSizeMB)}MB). Please use a file under 500MB, or export just the audio track (M4A/MP3) for faster processing.`,
      }, { status: 413 });
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (e) {
      return NextResponse.json({
        success: false,
        error: "Could not read the uploaded file. Make sure the file is under 500MB and try again.",
      }, { status: 400 });
    }

    const videoFile = formData.get("video") as File | null;
    const durationStr = formData.get("duration") as string | null;
    const duration = durationStr ? parseInt(durationStr) : 0;

    if (!videoFile) {
      return NextResponse.json({ success: false, error: "No video file provided." }, { status: 400 });
    }

    const fileMB = Math.round(videoFile.size / 1024 / 1024);
    console.log(`Transcribing: ${videoFile.name} (${fileMB}MB)`);

    // Whisper API hard limit is 25MB
    if (videoFile.size > 25 * 1024 * 1024) {
      console.log(`File is ${fileMB}MB — too large for Whisper direct upload. Using fallback.`);

      // Use fallback chat generation with the provided duration
      const fallbackDuration = duration > 0 ? duration : 3600;
      const chats = generateFallbackChats(fallbackDuration);

      return NextResponse.json({
        success: true,
        chats,
        duration: fallbackDuration,
        usedFallback: true,
        message: `Your video (${fileMB}MB) is larger than Whisper's 25MB limit. Smart chat was generated based on your video duration. For AI-accurate comments, export just the audio track as M4A/MP3 (usually under 25MB) and upload that instead.`,
        transcript: { text: "", segmentCount: 0 },
      });
    }

    // ── Step 1: Whisper transcription ──────────────────────────────
    console.log("Sending to Whisper...");
    let transcriptionResponse: any;
    try {
      transcriptionResponse = await openai.audio.transcriptions.create({
        file: videoFile,
        model: "whisper-1",
        response_format: "verbose_json",
        timestamp_granularities: ["segment"],
      });
    } catch (whisperError: any) {
      console.error("Whisper error:", whisperError);
      // If Whisper fails, fall back to proportional generation
      const fallbackDuration = duration > 0 ? duration : 3600;
      const chats = generateFallbackChats(fallbackDuration);
      return NextResponse.json({
        success: true,
        chats,
        duration: fallbackDuration,
        usedFallback: true,
        message: `Transcription encountered an issue: ${whisperError.message || "Unknown error"}. Chat was generated proportionally instead. Try uploading just the audio track (M4A/MP3).`,
        transcript: { text: "", segmentCount: 0 },
      });
    }

    const segments = (transcriptionResponse as any).segments || [];
    const fullText = transcriptionResponse.text || "";
    const detectedDuration = segments.length > 0
      ? segments[segments.length - 1].end
      : duration || 3600;
    const finalDuration = duration > 0 ? duration : Math.round(detectedDuration);

    console.log(`Transcription done. Duration: ${finalDuration}s, Segments: ${segments.length}`);

    // ── Step 2: Build segment summary ─────────────────────────────
    const chunkCount = Math.min(20, Math.max(1, segments.length));
    const chunkSize = Math.max(1, Math.floor(segments.length / chunkCount));

    const segmentSummaries = segments.length > 0
      ? Array.from({ length: chunkCount }, (_, i) => {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, segments.length);
          const chunk = segments.slice(start, end);
          const timeStart = chunk[0]?.start || 0;
          const timeEnd = chunk[chunk.length - 1]?.end || 0;
          const text = chunk.map((s: any) => s.text).join(" ").trim().slice(0, 300);
          return `[${Math.round(timeStart)}s–${Math.round(timeEnd)}s]: ${text}`;
        }).join("\n")
      : `Full transcript (${finalDuration}s total): ${fullText.slice(0, 3000)}`;

    // ── Step 3: GPT-4o chat generation ────────────────────────────
    let generatedChats: any[] = [];
    try {
      const chatResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 8000,
        temperature: 0.85,
        messages: [
          {
            role: "system",
            content: "You generate realistic webinar audience chat messages. Always respond with valid JSON array only. No markdown, no code fences, no explanation — just the raw JSON array.",
          },
          {
            role: "user",
            content: `You are analyzing a webinar transcript to generate realistic simulated audience chat messages.

WEBINAR TRANSCRIPT (with timestamps):
${segmentSummaries}

Total duration: ${finalDuration} seconds (${Math.round(finalDuration / 60)} minutes)

Generate exactly 160 realistic audience chat messages that are CONTEXTUALLY ACCURATE to what the presenter is actually saying at each timestamp.

Rules:
1. Messages must match what the presenter is discussing at that specific time
2. Cue types to use:
   - "type1": When presenter says "type 1", "drop a 1", "comment 1" — 15-25 people respond "1", "1 ✅", "1 from [city]"
   - "dropCity": When presenter asks where people are from — city responses
   - "react": At value bombs, key revelations — "🔥🔥🔥", "Mind blown 🤯", etc.
   - "testimonial": After success stories — audience shares their wins
   - "question": At teaching moments — specific questions about the ACTUAL topic
   - "general": General engagement throughout
   - "joining": First 2 minutes only — people joining
3. Questions and reactions must reference the ACTUAL webinar topic and content
4. Spread messages evenly across ALL ${finalDuration} seconds
5. Each person needs a name and US/European city

Return ONLY a valid JSON array like this:
[{"name":"Jason C.","city":"Dallas, TX","message":"1 from Dallas!","showAt":245,"cueType":"type1"}]

Generate all 160 messages now.`,
          },
        ],
      });

      const rawContent = chatResponse.choices[0]?.message?.content || "[]";
      const cleaned = rawContent.replace(/```json|```/g, "").trim();

      try {
        generatedChats = JSON.parse(cleaned);
      } catch {
        // Try extracting JSON array from response
        const match = cleaned.match(/\[[\s\S]*\]/);
        if (match) {
          try { generatedChats = JSON.parse(match[0]); } catch {}
        }
      }
    } catch (gptError: any) {
      console.error("GPT error:", gptError);
      // Fall back to proportional generation
      const chats = generateFallbackChats(finalDuration);
      return NextResponse.json({
        success: true,
        chats,
        duration: finalDuration,
        usedFallback: true,
        message: "Chat generation encountered an issue. Chat was generated proportionally based on your transcript timing.",
        transcript: { text: fullText.slice(0, 500), segmentCount: segments.length },
      });
    }

    // ── Step 4: Normalize chats ────────────────────────────────────
    const validCueTypes = ["type1","dropCity","react","question","testimonial","general","joining"];
    const normalizedChats: SmartChat[] = generatedChats
      .filter((c: any) => c && typeof c.message === "string" && typeof c.showAt === "number")
      .map((c: any, i: number) => {
        const showAt = Math.max(0, Math.min(Math.round(c.showAt), finalDuration - 5));
        return {
          id: String(i),
          name: c.name || randomName(i * 7),
          city: c.city || CITIES[i % CITIES.length],
          message: c.message,
          showAt,
          showAtFrac: showAt / finalDuration,
          cueType: validCueTypes.includes(c.cueType) ? c.cueType : "general",
        };
      })
      .sort((a: SmartChat, b: SmartChat) => a.showAt - b.showAt);

    // Pad with fallback if we didn't get enough
    if (normalizedChats.length < 100) {
      const fallback = generateFallbackChats(finalDuration);
      const padded = fallback.slice(normalizedChats.length);
      normalizedChats.push(...padded.map((c, i) => ({ ...c, id: String(normalizedChats.length + i) })));
      normalizedChats.sort((a, b) => a.showAt - b.showAt);
    }

    return NextResponse.json({
      success: true,
      chats: normalizedChats,
      duration: finalDuration,
      usedFallback: false,
      transcript: {
        text: fullText.slice(0, 500) + (fullText.length > 500 ? "..." : ""),
        segmentCount: segments.length,
      },
    });

  } catch (error: any) {
    console.error("Transcribe route error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
