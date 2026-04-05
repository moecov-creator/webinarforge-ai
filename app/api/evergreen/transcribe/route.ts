// app/api/evergreen/transcribe/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const maxDuration = 300;
export const dynamic = "force-dynamic";

// ── Name / city pools ──────────────────────────────────────────────
const FIRST_NAMES=["Jason","Michael","David","James","Robert","Sarah","Jennifer","Amanda","Jessica","Ashley","Emily","Carlos","Miguel","Marcus","Priya","Tyler","Brandon","Patricia","Trevor","Monica","Tiffany","Jasmine","Keisha","Ethan","Logan","Nathan","Justin","Crystal","Destiny","Brianna"];
const LAST_SHORT=["M.","K.","T.","R.","B.","W.","J.","H.","C.","D.","L.","P.","S.","N."];
const LAST_FULL=["Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson","Anderson","Taylor","Thomas","Jackson","White","Harris","Martin","Thompson","Robinson","Clark","Lewis","Walker","Carter","Mitchell","Perez","Roberts","Turner"];
const CITIES=["New York, NY","Los Angeles, CA","Chicago, IL","Houston, TX","Dallas, TX","Austin, TX","Atlanta, GA","Miami, FL","Seattle, WA","Denver, CO","Nashville, TN","Boston, MA","Las Vegas, NV","Orlando, FL","Minneapolis, MN","London, UK","Manchester, UK","Paris, France","Berlin, Germany","Madrid, Spain","Toronto, Canada","Sydney, Australia","Dublin, Ireland","Amsterdam, Netherlands","Rome, Italy"];

function randomName(seed:number):string{const first=FIRST_NAMES[seed%FIRST_NAMES.length];const fmt=seed%4;if(fmt===0)return`${first} ${LAST_SHORT[seed%LAST_SHORT.length]}`;if(fmt===1)return`${first} ${LAST_FULL[seed%LAST_FULL.length]}`;if(fmt===2)return`${first}${LAST_FULL[seed%LAST_FULL.length].charAt(0)}`;return`${first} ${LAST_SHORT[(seed+7)%LAST_SHORT.length]}`;}

interface SmartChat{id:string;name:string;city:string;message:string;showAt:number;showAtFrac:number;cueType:string;}

// ── Fallback generator ─────────────────────────────────────────────
function generateFallbackChats(duration:number):SmartChat[]{
  const cues=[
    {frac:0.01,type:"joining",burst:12,responses:(city:string)=>[`Just joined from ${city}!`,`Hello from ${city} 👋`,`${city} checking in!`,`Made it! From ${city}`]},
    {frac:0.06,type:"dropCity",burst:16,responses:(city:string)=>[city,`${city} 👋`,`Watching from ${city}`,`Live from ${city}`,`${city} in the house!`]},
    {frac:0.12,type:"react",burst:8,responses:(_:string)=>["🔥🔥🔥","Mind blown 🤯","Taking notes!","WOW","Gold right here 💰","YESSS","💯💯"]},
    {frac:0.16,type:"type1",burst:20,responses:(city:string)=>["1","1️⃣","1 ✅","1 👍",`1 from ${city}`,"1 🙌","YES 1","1 — makes total sense","1 💯"]},
    {frac:0.24,type:"question",burst:6,responses:(_:string)=>["Does this work for beginners?","How long does this take?","Can I use this for B2B?","What software do you recommend?","How soon can I see results?"]},
    {frac:0.30,type:"react",burst:9,responses:(_:string)=>["This is incredible!","🙌🙌🙌","Screenshotting this!","Pure value 💎","This changes everything"]},
    {frac:0.36,type:"type1",burst:18,responses:(city:string)=>["1","1 ✅",`1 from ${city}`,"1 👊","Typing 1!","1 absolutely","1 yes!!"]},
    {frac:0.42,type:"testimonial",burst:5,responses:(_:string)=>["Applied this and closed a $5k deal same week!","This got me to $10k/month in 60 days 🎉","Finally broke 6 figures following these steps 🙏"]},
    {frac:0.48,type:"react",burst:8,responses:(_:string)=>["🔥🔥🔥","This is insane!","💯💯💯","👏👏👏","Mind blown 🤯"]},
    {frac:0.54,type:"general",burst:6,responses:(city:string)=>[`Watching from ${city} — loving every minute`,"So glad I showed up today!","Taking tons of notes 📓","Pure value 💎"]},
    {frac:0.60,type:"type1",burst:16,responses:(city:string)=>["1","1 ✅",`1 from ${city}`,"1 — been waiting for this","YES 1","1 👊"]},
    {frac:0.66,type:"question",burst:5,responses:(_:string)=>["Where do we sign up?","Is this recorded?","Do you offer coaching?","What's the investment?","Is there a community?"]},
    {frac:0.72,type:"react",burst:9,responses:(_:string)=>["🚀🚀","This is the missing piece","I needed to hear this today 🙏","Bookmark worthy content","Telling everyone I know"]},
    {frac:0.78,type:"type1",burst:14,responses:(city:string)=>["1","1 💯",`1 from ${city}`,"1 — mind blown","Definitely 1","typing 1 rn"]},
    {frac:0.84,type:"testimonial",burst:5,responses:(_:string)=>["This is how I replaced my 9-5 🙏","$22k last month using this exact system","Went from 0 to 4 clients using exactly this"]},
    {frac:0.90,type:"general",burst:7,responses:(_:string)=>["This is the most practical advice I've heard all year","My business will never be the same","Pure gold 💰","Incredible session!"]},
  ];
  const chats:SmartChat[]=[];let id=0;
  cues.forEach(cue=>{
    const base=cue.frac*duration;const spread=0.02*duration;
    for(let i=0;i<cue.burst;i++){
      const seed=id*7+i*13;const city=CITIES[seed%CITIES.length];
      const responses=cue.responses(city);
      const jitter=(i/cue.burst+Math.random()*0.3)*spread;
      const showAt=Math.round(Math.min(base+jitter,duration-10));
      chats.push({id:String(id++),name:randomName(seed),city,message:responses[(seed+i)%responses.length],showAt,showAtFrac:showAt/duration,cueType:cue.type});
    }
  });
  return chats.sort((a,b)=>a.showAt-b.showAt);
}

// ── Convert Google Drive share URL to direct download URL ──────────
function toDirectDownloadUrl(url: string): string {
  // Handle Google Drive share links
  const gdriveMatcher = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gdriveMatcher) {
    return `https://drive.google.com/uc?export=download&id=${gdriveMatcher[1]}&confirm=t`;
  }
  // Handle Dropbox share links
  if (url.includes("dropbox.com")) {
    return url.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "").replace("?dl=1", "");
  }
  // Return as-is for direct URLs
  return url;
}

// ── Route handler ──────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
    }

    const { url, duration: durationStr } = body;
    const duration = durationStr ? parseInt(String(durationStr)) : 0;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ success: false, error: "No audio URL provided." }, { status: 400 });
    }

    const directUrl = toDirectDownloadUrl(url.trim());
    console.log(`Fetching audio from: ${directUrl}`);

    // ── Step 1: Download the audio file from URL ───────────────────
    let audioBuffer: ArrayBuffer;
    try {
      const audioRes = await fetch(directUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      if (!audioRes.ok) {
        throw new Error(`Failed to download file: HTTP ${audioRes.status}`);
      }
      audioBuffer = await audioRes.arrayBuffer();
    } catch (fetchError: any) {
      console.error("Download error:", fetchError);
      // Fall back to proportional chat if download fails
      const fallbackDuration = duration > 0 ? duration : 3600;
      const chats = generateFallbackChats(fallbackDuration);
      return NextResponse.json({
        success: true, chats, duration: fallbackDuration, usedFallback: true,
        message: `Could not download the file: ${fetchError.message}. Make sure the link is publicly accessible. Chat was generated proportionally instead.`,
        transcript: { text: "", segmentCount: 0 },
      });
    }

    const fileSizeMB = audioBuffer.byteLength / 1024 / 1024;
    console.log(`Downloaded: ${fileSizeMB.toFixed(1)}MB`);

    // ── Step 2: Whisper transcription ──────────────────────────────
    // Convert ArrayBuffer to File for OpenAI SDK
    const audioFile = new File(
      [audioBuffer],
      "audio.mp3",
      { type: "audio/mpeg" }
    );

    if (audioFile.size > 25 * 1024 * 1024) {
      console.log(`File ${fileSizeMB.toFixed(1)}MB exceeds Whisper 25MB limit — using fallback`);
      const fallbackDuration = duration > 0 ? duration : 3600;
      const chats = generateFallbackChats(fallbackDuration);
      return NextResponse.json({
        success: true, chats, duration: fallbackDuration, usedFallback: true,
        message: `Audio file is ${fileSizeMB.toFixed(1)}MB — over Whisper's 25MB limit. Chat was generated proportionally. Try compressing further to under 25MB.`,
        transcript: { text: "", segmentCount: 0 },
      });
    }

    console.log("Sending to Whisper...");
    let transcriptionResponse: any;
    try {
      transcriptionResponse = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        response_format: "verbose_json",
        timestamp_granularities: ["segment"],
      });
    } catch (whisperError: any) {
      console.error("Whisper error:", whisperError);
      const fallbackDuration = duration > 0 ? duration : 3600;
      const chats = generateFallbackChats(fallbackDuration);
      return NextResponse.json({
        success: true, chats, duration: fallbackDuration, usedFallback: true,
        message: `Transcription failed: ${whisperError.message}. Chat was generated proportionally instead.`,
        transcript: { text: "", segmentCount: 0 },
      });
    }

    const segments = (transcriptionResponse as any).segments || [];
    const fullText = transcriptionResponse.text || "";
    const detectedDuration = segments.length > 0 ? segments[segments.length - 1].end : duration || 3600;
    const finalDuration = duration > 0 ? duration : Math.round(detectedDuration);

    console.log(`Transcription done. Duration: ${finalDuration}s, Segments: ${segments.length}`);

    // ── Step 3: Build segment summary for GPT-4o ───────────────────
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
      : `Full transcript (${finalDuration}s): ${fullText.slice(0, 3000)}`;

    // ── Step 4: GPT-4o generates contextual chat ───────────────────
    let generatedChats: any[] = [];
    try {
      const chatResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 8000,
        temperature: 0.85,
        messages: [
          { role: "system", content: "You generate realistic webinar audience chat messages. Always respond with valid JSON array only. No markdown, no code fences, no explanation." },
          { role: "user", content: `Analyze this webinar transcript and generate exactly 160 realistic audience chat messages that match what the presenter is saying at each timestamp.

TRANSCRIPT:
${segmentSummaries}

Total duration: ${finalDuration} seconds (${Math.round(finalDuration/60)} minutes)

Rules:
1. Messages must match the ACTUAL content being discussed at that timestamp
2. Cue types: "type1" (when presenter says type 1), "dropCity" (where are you from), "react" (value bombs), "testimonial" (success stories), "question" (Q&A moments), "general" (engagement), "joining" (first 2 min only)
3. Questions must reference the ACTUAL webinar topic
4. Spread messages across ALL ${finalDuration} seconds evenly
5. Each needs a realistic name and US/European city

Return ONLY valid JSON array:
[{"name":"Jason C.","city":"Dallas, TX","message":"1 from Dallas!","showAt":245,"cueType":"type1"}]

Generate all 160 now.` }
        ],
      });

      const raw = chatResponse.choices[0]?.message?.content || "[]";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      try { generatedChats = JSON.parse(cleaned); }
      catch { const m = cleaned.match(/\[[\s\S]*\]/); if(m) try { generatedChats = JSON.parse(m[0]); } catch {} }
    } catch (gptError: any) {
      console.error("GPT error:", gptError);
      const chats = generateFallbackChats(finalDuration);
      return NextResponse.json({
        success: true, chats, duration: finalDuration, usedFallback: true,
        message: "Chat generation had an issue. Chat was generated proportionally based on transcript timing.",
        transcript: { text: fullText.slice(0, 500), segmentCount: segments.length },
      });
    }

    // ── Step 5: Normalize ──────────────────────────────────────────
    const validCueTypes = ["type1","dropCity","react","question","testimonial","general","joining"];
    const normalizedChats: SmartChat[] = generatedChats
      .filter((c:any) => c && typeof c.message === "string" && typeof c.showAt === "number")
      .map((c:any, i:number) => {
        const showAt = Math.max(0, Math.min(Math.round(c.showAt), finalDuration - 5));
        return { id:String(i), name:c.name||randomName(i*7), city:c.city||CITIES[i%CITIES.length], message:c.message, showAt, showAtFrac:showAt/finalDuration, cueType:validCueTypes.includes(c.cueType)?c.cueType:"general" };
      })
      .sort((a:SmartChat,b:SmartChat) => a.showAt - b.showAt);

    if (normalizedChats.length < 100) {
      const fallback = generateFallbackChats(finalDuration);
      normalizedChats.push(...fallback.slice(normalizedChats.length).map((c,i)=>({...c,id:String(normalizedChats.length+i)})));
      normalizedChats.sort((a,b)=>a.showAt-b.showAt);
    }

    return NextResponse.json({
      success: true,
      chats: normalizedChats,
      duration: finalDuration,
      usedFallback: false,
      transcript: { text: fullText.slice(0, 500) + (fullText.length > 500 ? "..." : ""), segmentCount: segments.length },
    });

  } catch (error: any) {
    console.error("Transcribe route error:", error);
    return NextResponse.json({ success: false, error: error?.message || "An unexpected error occurred." }, { status: 500 });
  }
}
