// app/api/evergreen/transcribe/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const FIRST_NAMES=["Jason","Michael","David","James","Robert","Sarah","Jennifer","Amanda","Jessica","Ashley","Emily","Carlos","Miguel","Marcus","Priya","Tyler","Brandon","Patricia","Trevor","Monica","Tiffany","Jasmine","Keisha","Ethan","Logan","Nathan","Justin","Crystal","Destiny","Brianna"];
const LAST_SHORT=["M.","K.","T.","R.","B.","W.","J.","H.","C.","D.","L.","P.","S.","N."];
const LAST_FULL=["Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson","Anderson","Taylor","Thomas","Jackson","White","Harris","Martin","Thompson","Robinson","Clark","Lewis","Walker","Carter","Mitchell","Perez","Roberts","Turner"];
const CITIES=["New York, NY","Los Angeles, CA","Chicago, IL","Houston, TX","Dallas, TX","Austin, TX","Atlanta, GA","Miami, FL","Seattle, WA","Denver, CO","Nashville, TN","Boston, MA","Las Vegas, NV","Orlando, FL","Minneapolis, MN","London, UK","Manchester, UK","Paris, France","Berlin, Germany","Madrid, Spain","Toronto, Canada","Sydney, Australia","Dublin, Ireland","Amsterdam, Netherlands","Rome, Italy"];

function randomName(seed:number):string{const first=FIRST_NAMES[seed%FIRST_NAMES.length];const fmt=seed%4;if(fmt===0)return`${first} ${LAST_SHORT[seed%LAST_SHORT.length]}`;if(fmt===1)return`${first} ${LAST_FULL[seed%LAST_FULL.length]}`;if(fmt===2)return`${first}${LAST_FULL[seed%LAST_FULL.length].charAt(0)}`;return`${first} ${LAST_SHORT[(seed+7)%LAST_SHORT.length]}`;}

interface SmartChat{id:string;name:string;city:string;message:string;showAt:number;showAtFrac:number;cueType:string;}

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

// ── Extract Google Drive file ID and download properly ─────────────
function extractGdriveFileId(url: string): string | null {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/open\?id=([a-zA-Z0-9_-]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

async function downloadGdriveFile(fileId: string): Promise<ArrayBuffer | null> {
  // Step 1: Try direct download
  const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
  
  const res1 = await fetch(directUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "*/*",
    },
    redirect: "follow",
  });

  const contentType = res1.headers.get("content-type") || "";
  
  // If we got HTML back, Google is showing a virus scan warning
  if (contentType.includes("text/html")) {
    console.log("Got HTML from Google Drive — extracting confirm token...");
    const html = await res1.text();
    
    // Extract the confirm token from the warning page
    const confirmMatch = html.match(/confirm=([a-zA-Z0-9_-]+)/) || 
                         html.match(/name="confirm"\s+value="([^"]+)"/) ||
                         html.match(/confirm=t&amp;uuid=([^"&]+)/);
    
    // Extract uuid if present
    const uuidMatch = html.match(/uuid=([a-zA-Z0-9_-]+)/);
    
    let downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
    if (uuidMatch) {
      downloadUrl += `&uuid=${uuidMatch[1]}`;
    }
    
    console.log(`Retrying with: ${downloadUrl}`);
    const res2 = await fetch(downloadUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "*/*",
      },
      redirect: "follow",
    });

    const ct2 = res2.headers.get("content-type") || "";
    if (ct2.includes("text/html")) {
      // Try the export API approach
      const exportUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
      console.log(`Trying export API: ${exportUrl}`);
      const res3 = await fetch(exportUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "*/*",
        },
        redirect: "follow",
      });
      const ct3 = res3.headers.get("content-type") || "";
      if (!ct3.includes("text/html") && res3.ok) {
        return res3.arrayBuffer();
      }
      return null; // All attempts failed
    }

    if (!res2.ok) return null;
    return res2.arrayBuffer();
  }

  if (!res1.ok) return null;
  return res1.arrayBuffer();
}

function toDirectDownloadUrl(url: string): string {
  if (url.includes("dropbox.com")) {
    return url.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0","").replace("?dl=1","");
  }
  return url;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });

    const { url, duration: durationStr } = body;
    const duration = durationStr ? parseInt(String(durationStr)) : 0;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ success: false, error: "No audio URL provided." }, { status: 400 });
    }

    console.log(`Processing URL: ${url}`);

    // ── Step 1: Download audio ─────────────────────────────────────
    let audioBuffer: ArrayBuffer | null = null;
    let downloadMethod = "unknown";

    const gdriveId = extractGdriveFileId(url);

    if (gdriveId) {
      console.log(`Google Drive file ID: ${gdriveId}`);
      downloadMethod = "gdrive";
      audioBuffer = await downloadGdriveFile(gdriveId).catch(e => {
        console.error("GDrive download error:", e);
        return null;
      });
    } else {
      // Direct URL or Dropbox
      const directUrl = toDirectDownloadUrl(url.trim());
      downloadMethod = "direct";
      try {
        const res = await fetch(directUrl, {
          headers: { "User-Agent": "Mozilla/5.0" },
          redirect: "follow",
        });
        if (res.ok) audioBuffer = await res.arrayBuffer();
      } catch (e) {
        console.error("Direct download error:", e);
      }
    }

    if (!audioBuffer || audioBuffer.byteLength === 0) {
      console.log("Download failed — using fallback");
      const fallbackDuration = duration > 0 ? duration : 3600;
      const chats = generateFallbackChats(fallbackDuration);
      return NextResponse.json({
        success: true, chats, duration: fallbackDuration, usedFallback: true,
        message: "⚠️ Could not download your audio file. Make sure sharing is set to 'Anyone with the link' in Google Drive. Chat was generated proportionally instead.",
        transcript: { text: "", segmentCount: 0 },
      });
    }

    const fileSizeMB = audioBuffer.byteLength / 1024 / 1024;
    console.log(`Downloaded ${fileSizeMB.toFixed(1)}MB via ${downloadMethod}`);

    // Check if we accidentally downloaded HTML (Google's warning page)
    const firstBytes = new Uint8Array(audioBuffer.slice(0, 20));
    const firstChars = String.fromCharCode(...firstBytes);
    if (firstChars.includes("<!") || firstChars.includes("<html") || firstChars.includes("<!DOCTYPE")) {
      console.log("Downloaded HTML instead of audio — Google Drive blocked download");
      const fallbackDuration = duration > 0 ? duration : 3600;
      const chats = generateFallbackChats(fallbackDuration);
      return NextResponse.json({
        success: true, chats, duration: fallbackDuration, usedFallback: true,
        message: "⚠️ Google Drive blocked the download (returned a webpage instead of audio). To fix: in Google Drive, right-click your file → Share → change to 'Anyone with the link' → save. Then try again. Chat was generated proportionally for now.",
        transcript: { text: "", segmentCount: 0 },
      });
    }

    if (fileSizeMB > 25) {
      console.log(`File too large for Whisper: ${fileSizeMB.toFixed(1)}MB`);
      const fallbackDuration = duration > 0 ? duration : 3600;
      const chats = generateFallbackChats(fallbackDuration);
      return NextResponse.json({
        success: true, chats, duration: fallbackDuration, usedFallback: true,
        message: `Audio is ${fileSizeMB.toFixed(1)}MB — over Whisper's 25MB limit. Please compress further to under 25MB. Chat generated proportionally for now.`,
        transcript: { text: "", segmentCount: 0 },
      });
    }

    // ── Step 2: Whisper transcription ──────────────────────────────
    console.log("Sending to Whisper...");
    const audioFile = new File([audioBuffer], "audio.mp3", { type: "audio/mpeg" });

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
        message: `Whisper transcription failed: ${whisperError.message}. Chat generated proportionally.`,
        transcript: { text: "", segmentCount: 0 },
      });
    }

    const segments = (transcriptionResponse as any).segments || [];
    const fullText = transcriptionResponse.text || "";
    const detectedDuration = segments.length > 0 ? segments[segments.length - 1].end : duration || 3600;
    const finalDuration = duration > 0 ? duration : Math.round(detectedDuration);

    console.log(`✅ Transcription done: ${segments.length} segments, ${finalDuration}s`);

    // ── Step 3: GPT-4o chat generation ────────────────────────────
    const chunkCount = Math.min(20, Math.max(1, segments.length));
    const chunkSize = Math.max(1, Math.floor(segments.length / chunkCount));
    const segmentSummaries = segments.length > 0
      ? Array.from({ length: chunkCount }, (_, i) => {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, segments.length);
          const chunk = segments.slice(start, end);
          return `[${Math.round(chunk[0]?.start||0)}s–${Math.round(chunk[chunk.length-1]?.end||0)}s]: ${chunk.map((s:any)=>s.text).join(" ").trim().slice(0,300)}`;
        }).join("\n")
      : `Full transcript (${finalDuration}s): ${fullText.slice(0,3000)}`;

    let generatedChats: any[] = [];
    try {
      const chatResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 8000,
        temperature: 0.85,
        messages: [
          { role: "system", content: "You generate realistic webinar audience chat messages. Always respond with valid JSON array only. No markdown, no code fences, no explanation." },
          { role: "user", content: `Analyze this webinar transcript and generate exactly 160 realistic audience chat messages timed to what the presenter is saying.

TRANSCRIPT:
${segmentSummaries}

Total duration: ${finalDuration} seconds (${Math.round(finalDuration/60)} minutes)

Rules:
1. Messages must match the ACTUAL content being discussed at that timestamp
2. Use cue types: "type1" (when presenter says type 1/drop a 1), "dropCity" (where are you from), "react" (value moments), "testimonial" (success stories), "question" (Q&A moments), "general" (engagement), "joining" (first 2 min only)
3. Questions and reactions must reference the ACTUAL webinar topic
4. Spread messages across ALL ${finalDuration} seconds
5. Each message needs a realistic name and US/European city

Return ONLY valid JSON array:
[{"name":"Jason C.","city":"Dallas, TX","message":"1 from Dallas!","showAt":245,"cueType":"type1"}]` }
        ],
      });

      const raw = chatResponse.choices[0]?.message?.content || "[]";
      const cleaned = raw.replace(/\`\`\`json|\`\`\`/g, "").trim();
      try { generatedChats = JSON.parse(cleaned); }
      catch { const m = cleaned.match(/\[[\s\S]*\]/); if(m) try { generatedChats = JSON.parse(m[0]); } catch {} }
    } catch (gptError: any) {
      console.error("GPT error:", gptError);
      const chats = generateFallbackChats(finalDuration);
      return NextResponse.json({ success: true, chats, duration: finalDuration, usedFallback: true, message: "Chat generation had an issue. Generated proportionally.", transcript: { text: fullText.slice(0,500), segmentCount: segments.length } });
    }

    // ── Step 4: Normalize ──────────────────────────────────────────
    const validCueTypes = ["type1","dropCity","react","question","testimonial","general","joining"];
    const normalizedChats: SmartChat[] = generatedChats
      .filter((c:any) => c && typeof c.message === "string" && typeof c.showAt === "number")
      .map((c:any, i:number) => ({
        id: String(i),
        name: c.name || randomName(i*7),
        city: c.city || CITIES[i%CITIES.length],
        message: c.message,
        showAt: Math.max(0, Math.min(Math.round(c.showAt), finalDuration-5)),
        showAtFrac: Math.max(0, Math.min(Math.round(c.showAt), finalDuration-5)) / finalDuration,
        cueType: validCueTypes.includes(c.cueType) ? c.cueType : "general",
      }))
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
      transcript: { text: fullText.slice(0,500)+(fullText.length>500?"...":""), segmentCount: segments.length },
    });

  } catch (error: any) {
    console.error("Route error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Unexpected error." }, { status: 500 });
  }
}
