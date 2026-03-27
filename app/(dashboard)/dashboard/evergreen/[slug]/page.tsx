// app/(dashboard)/dashboard/evergreen/[slug]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users, Volume2, VolumeX, Maximize2, SkipForward,
  Play, Pause, PlayCircle, Settings2, BarChart2,
  ClipboardList, Globe, Video, MessageSquare,
  Gift, FileText, BarChart, Tag, Code,
} from "lucide-react";
import type { TimedCommentDTO, CTASequenceDTO } from "@/types/webinar";

// ── Mock data ──────────────────────────────────────────────────────
const MOCK_WEBINAR = {
  title: "The 3-Step System to Land High-Ticket Coaching Clients Without Cold Outreach",
  presenter: "Jordan Blake",
  durationSeconds: 4500,
  viewerCountMin: 47,
  viewerCountMax: 312,
};

const MOCK_TIMED_COMMENTS: TimedCommentDTO[] = [
  { id: "1", type: "SOCIAL_PROOF", authorName: "Sarah M.", authorAvatar: null, content: "This is exactly what I needed! Taking notes 📝", triggerAt: 300, isActive: true, order: 1 },
  { id: "2", type: "FAQ", authorName: "Marcus T.", authorAvatar: null, content: "Question: Does this work if you're just starting out?", triggerAt: 900, isActive: true, order: 2 },
  { id: "3", type: "MODERATOR", authorName: "Jordan Blake", authorAvatar: null, content: "Great question Marcus — yes, we cover this in step 2 coming up!", triggerAt: 960, isActive: true, order: 3 },
  { id: "4", type: "TESTIMONIAL", authorName: "Jennifer K.", authorAvatar: null, content: "I applied this and went from $3k to $22k months. Changed my business completely.", triggerAt: 1800, isActive: true, order: 4 },
  { id: "5", type: "URGENCY", authorName: "System", authorAvatar: null, content: "🔥 67 people are watching right now", triggerAt: 2400, isActive: true, order: 5 },
  { id: "6", type: "CTA_REMINDER", authorName: "Jordan Blake", authorAvatar: null, content: "Enrollment is open! The link is below 👇", triggerAt: 4200, isActive: true, order: 6 },
];

const MOCK_CTA_SEQUENCES: CTASequenceDTO[] = [
  { id: "1", type: "SOFT", triggerAt: 600, headline: "Stay with me...", body: "The most important part is coming up.", buttonText: "Keep watching", buttonUrl: null, isActive: true, order: 1 },
  { id: "2", type: "MID", triggerAt: 2700, headline: "Ready to implement this?", body: "The Business Acceleration Mastermind gives you everything you need.", buttonText: "Tell me more →", buttonUrl: "#checkout", isActive: true, order: 2 },
  { id: "3", type: "FINAL", triggerAt: 4200, headline: "This is your moment.", body: "Everything we covered today is waiting for you. Click below to get started.", buttonText: "Claim Your Spot →", buttonUrl: "#checkout", isActive: true, order: 3 },
  { id: "4", type: "URGENCY", triggerAt: 4500, headline: "⚡ 3 spots remaining", body: "We limit cohort size for quality. Once these are gone, they're gone.", buttonText: "Secure Your Spot →", buttonUrl: "#checkout", isActive: true, order: 4 },
];

// ── Chat simulator data ────────────────────────────────────────────
const FIRST_NAMES = [
  "Jason","Michael","David","James","Robert","William","John","Christopher","Daniel","Matthew",
  "Anthony","Mark","Donald","Steven","Paul","Andrew","Joshua","Kenneth","Kevin","Brian",
  "Sarah","Jennifer","Amanda","Jessica","Ashley","Emily","Stephanie","Nicole","Elizabeth","Megan",
  "Melissa","Lauren","Rachel","Samantha","Katherine","Christine","Angela","Brenda","Amy","Anna",
  "Carlos","Miguel","Luis","Jose","Marcus","Andre","Darius","Terrence","DeShawn","Malik",
  "Priya","Aisha","Fatima","Yuki","Sofia","Isabella","Camille","Natasha","Ingrid","Chiara",
  "Tyler","Brandon","Austin","Cody","Dylan","Ethan","Logan","Hunter","Caleb","Blake",
  "Patricia","Sandra","Donna","Carol","Ruth","Sharon","Deborah","Cheryl","Janet","Catherine",
  "Trevor","Evan","Sean","Aaron","Adam","Nathan","Justin","Bryan","Jeremy","Eric",
  "Monica","Tiffany","Jasmine","Keisha","Latoya","Brianna","Destiny","Crystal","Alexis","Shaniqua",
];

const LAST_NAMES_SHORT = ["M.","K.","T.","R.","B.","W.","J.","H.","C.","D.","L.","P.","S.","N.","F.","G.","A.","E.","V.","Z."];
const LAST_NAMES_FULL = [
  "Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson","Anderson","Taylor",
  "Thomas","Jackson","White","Harris","Martin","Thompson","Robinson","Clark","Lewis","Walker",
  "Howard","Young","Allen","King","Wright","Scott","Green","Baker","Adams","Nelson",
  "Carter","Mitchell","Perez","Roberts","Turner","Phillips","Campbell","Parker","Evans","Edwards",
  "Collins","Stewart","Sanchez","Morris","Rogers","Reed","Cook","Morgan","Bell","Murphy",
  "Bailey","Rivera","Cooper","Richardson","Cox","Ward","Torres","Peterson","Gray","Ramirez",
];

const CITIES = [
  "New York, NY","Los Angeles, CA","Chicago, IL","Houston, TX","Phoenix, AZ",
  "Philadelphia, PA","San Antonio, TX","San Diego, CA","Dallas, TX","San Jose, CA",
  "Austin, TX","Jacksonville, FL","Fort Worth, TX","Columbus, OH","Charlotte, NC",
  "Indianapolis, IN","San Francisco, CA","Seattle, WA","Denver, CO","Nashville, TN",
  "Oklahoma City, OK","El Paso, TX","Washington, DC","Boston, MA","Memphis, TN",
  "Louisville, KY","Portland, OR","Baltimore, MD","Las Vegas, NV","Milwaukee, WI",
  "Albuquerque, NM","Tucson, AZ","Fresno, CA","Sacramento, CA","Mesa, AZ",
  "Kansas City, MO","Atlanta, GA","Omaha, NE","Colorado Springs, CO","Raleigh, NC",
  "Long Beach, CA","Virginia Beach, VA","Minneapolis, MN","Tampa, FL","New Orleans, LA",
  "Arlington, TX","Bakersfield, CA","Honolulu, HI","Anaheim, CA","Aurora, CO",
  "Miami, FL","Cleveland, OH","Pittsburgh, PA","Cincinnati, OH","St. Louis, MO",
  "Orlando, FL","Riverside, CA","Lexington, KY","St. Paul, MN","Stockton, CA",
  "London, UK","Manchester, UK","Birmingham, UK","Leeds, UK","Glasgow, UK",
  "Paris, France","Lyon, France","Marseille, France","Berlin, Germany","Munich, Germany",
  "Hamburg, Germany","Frankfurt, Germany","Madrid, Spain","Barcelona, Spain","Valencia, Spain",
  "Rome, Italy","Milan, Italy","Naples, Italy","Amsterdam, Netherlands","Rotterdam, Netherlands",
  "Brussels, Belgium","Zurich, Switzerland","Vienna, Austria","Stockholm, Sweden","Oslo, Norway",
  "Copenhagen, Denmark","Helsinki, Finland","Dublin, Ireland","Lisbon, Portugal","Warsaw, Poland",
  "Toronto, Canada","Vancouver, Canada","Montreal, Canada","Calgary, Canada","Sydney, Australia",
];

type CueType = "type1" | "dropCity" | "react" | "question" | "testimonial" | "general" | "joining";

const CUE_RESPONSES: Record<CueType, (city: string) => string[]> = {
  type1: (city) => [
    "1","1️⃣","1 ✅","1 👍","1!","1 — makes total sense",
    `1 from ${city}`,"1 🙌","1 — finally someone explains this right",
    "1 for sure","Typing 1!","1 💯","1 absolutely","1 yes!!",
    "1 — been waiting for this","1 👊","1 this is gold","YES 1",
    "Definitely 1","1 no doubt","1 1 1","typing 1 rn","1 — mind blown",
  ],
  dropCity: (city) => [
    city,`${city} 👋`,`Joining from ${city}!`,`Hello from ${city}`,
    `${city} in the house!`,`Watching from ${city} 🙌`,`${city} represent!`,
    `Live from ${city}`,`${city} here!`,`Greetings from ${city} 👏`,
    `${city} — so excited for this`,`Tuning in from ${city}`,
    `${city} checking in!`,`Hey from ${city}`,`${city} 🌍`,
  ],
  react: (_city) => [
    "🔥🔥🔥","This is insane!","Mind blown 🤯","Taking notes!",
    "This changes everything","WOW","🙌🙌🙌","Gold right here 💰",
    "Incredible value!","This is exactly what I needed","YESSS",
    "Can't believe this is free","👏👏👏","Screenshotting this!",
    "This is the missing piece","Pausing to take notes 📝",
    "Finally someone explains this clearly!","💯💯💯","🚀🚀","Wow wow wow",
  ],
  question: (_city) => [
    "Does this work for beginners?","How long does this take to implement?",
    "Can I use this for B2B?","What's the fastest way to get started?",
    "Is there a template for this?","How do you handle objections?",
    "What software do you recommend?","How many hours a week does this take?",
    "What's the investment?","Is there a community included?",
    "Can I do this part-time?","How soon can I see results?",
    "Do you offer coaching?","Is this recorded?","Where do we sign up?",
  ],
  testimonial: (_city) => [
    "I tried this last month and got 3 new clients! 🎉",
    "This method got me to $10k/month in 60 days",
    "Applied this and closed a $5k deal same week",
    "Went from 0 to 4 clients using exactly this",
    "This is how I replaced my 9-5. Life changing.",
    "$22k in revenue last month using this exact system",
    "Finally broke 6 figures following these steps 🙏",
    "This is the real deal. I'm living proof.",
    "3 years ago I was broke. This changed everything.",
    "Best investment I ever made was learning this",
  ],
  general: (city) => [
    "So glad I showed up today!","This is better than I expected",
    "Taking tons of notes 📓","Sharing this with my team",
    `Watching from ${city} — loving every minute`,
    "This should cost way more than it does",
    "Been struggling with this for months. Finally clarity.",
    "I needed to hear this today 🙏","Bookmark worthy content",
    "My business will never be the same after today",
    "Telling everyone I know about this","Pure value 💎",
    "Just got here — what did I miss?",
    "This is the most practical advice I've heard all year",
  ],
  joining: (city) => [
    `Just joined from ${city}!`,`Hello everyone from ${city} 👋`,
    `Jumping in late from ${city}`,`${city} just arrived!`,
    `Made it! Joining from ${city}`,`Hey everyone! ${city} here`,
    `Just got in — watching from ${city}`,`${city} checking in 🙋`,
    `${city} is in the building!`,`Finally here from ${city}`,
  ],
};

interface SimChat {
  id: string;
  name: string;
  city: string;
  message: string;
  showAt: number;
  cueType: CueType;
}

function randomName(seed: number): string {
  const first = FIRST_NAMES[seed % FIRST_NAMES.length];
  const format = seed % 5;
  if (format === 0) return `${first} ${LAST_NAMES_SHORT[seed % LAST_NAMES_SHORT.length]}`;
  if (format === 1) return `${first} ${LAST_NAMES_FULL[seed % LAST_NAMES_FULL.length]}`;
  if (format === 2) return `${first}${LAST_NAMES_FULL[seed % LAST_NAMES_FULL.length].charAt(0)}`;
  if (format === 3) return `${first.slice(0,3)}${LAST_NAMES_FULL[(seed+3)%LAST_NAMES_FULL.length].slice(0,3)}`;
  return `${first} ${LAST_NAMES_SHORT[(seed+7)%LAST_NAMES_SHORT.length]}`;
}

function generateSimChats(durationSeconds: number = 4500): SimChat[] {
  const cues: { time: number; type: CueType; burstSize: number; spread: number }[] = [
    { time: 30,   type: "joining",     burstSize: 14, spread: 60  },
    { time: 180,  type: "dropCity",    burstSize: 18, spread: 120 },
    { time: 420,  type: "react",       burstSize: 8,  spread: 60  },
    { time: 600,  type: "type1",       burstSize: 22, spread: 90  },
    { time: 900,  type: "question",    burstSize: 6,  spread: 120 },
    { time: 1200, type: "react",       burstSize: 10, spread: 80  },
    { time: 1500, type: "type1",       burstSize: 20, spread: 90  },
    { time: 1800, type: "testimonial", burstSize: 5,  spread: 150 },
    { time: 2100, type: "react",       burstSize: 8,  spread: 60  },
    { time: 2400, type: "general",     burstSize: 6,  spread: 120 },
    { time: 2700, type: "type1",       burstSize: 18, spread: 90  },
    { time: 3000, type: "question",    burstSize: 5,  spread: 100 },
    { time: 3300, type: "react",       burstSize: 10, spread: 60  },
    { time: 3600, type: "type1",       burstSize: 15, spread: 90  },
    { time: 3900, type: "testimonial", burstSize: 6,  spread: 120 },
    { time: 4200, type: "general",     burstSize: 8,  spread: 90  },
  ];

  const chats: SimChat[] = [];
  let idCounter = 0;

  cues.forEach((cue) => {
    if (cue.time > durationSeconds) return;
    for (let i = 0; i < cue.burstSize; i++) {
      const seed = idCounter * 7 + i * 13;
      const city = CITIES[seed % CITIES.length];
      const responses = CUE_RESPONSES[cue.type](city);
      const message = responses[(seed + i) % responses.length];
      const jitter = Math.floor((i / cue.burstSize) * cue.spread) + Math.floor(Math.random() * 12);
      chats.push({
        id: String(idCounter++),
        name: randomName(seed),
        city,
        message,
        showAt: Math.min(cue.time + jitter, durationSeconds - 5),
        cueType: cue.type,
      });
    }
  });

  return chats.sort((a, b) => a.showAt - b.showAt);
}

// ── Shared types ───────────────────────────────────────────────────
interface VideoSource {
  type: "upload" | "youtube" | "vimeo" | "mp4";
  url: string;
  name: string;
}

// ── Helpers ────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getCommentTypeColor(type: string) {
  switch (type) {
    case "TESTIMONIAL": return "text-yellow-400";
    case "URGENCY": return "text-red-400";
    case "CTA_REMINDER": return "text-purple-400";
    case "MODERATOR": return "text-blue-400";
    default: return "text-white/70";
  }
}

function getCueColor(cue: CueType) {
  switch (cue) {
    case "type1": return "text-green-400";
    case "dropCity": return "text-blue-400";
    case "testimonial": return "text-yellow-400";
    case "question": return "text-orange-400";
    case "react": return "text-purple-400";
    case "joining": return "text-cyan-400";
    default: return "text-white/60";
  }
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors ${value ? "bg-blue-600" : "bg-white/10"}`}>
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : ""}`} />
    </button>
  );
}

function toEmbedUrl(source: VideoSource): string {
  if (source.type === "youtube") {
    const match = source.url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;
  }
  if (source.type === "vimeo") {
    const match = source.url.match(/vimeo\.com\/(\d+)/);
    if (match) return `https://player.vimeo.com/video/${match[1]}`;
  }
  return source.url;
}

// ── Video Player ───────────────────────────────────────────────────
function VideoPlayer({
  source,
  videoRef,
}: {
  source: VideoSource | null;
  videoRef?: React.RefObject<HTMLVideoElement>;
}) {
  if (!source) return null;
  if (source.type === "upload" || source.type === "mp4") {
    return (
      <video
        ref={videoRef}
        key={source.url}
        src={source.url}
        controls
        className="absolute inset-0 w-full h-full object-contain bg-black"
      />
    );
  }
  return (
    <iframe
      key={source.url}
      src={toEmbedUrl(source)}
      className="absolute inset-0 w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

// ── Tab: Watch Room ────────────────────────────────────────────────
function WatchRoomTab({
  videoSource,
  simChats,
}: {
  videoSource: VideoSource | null;
  simChats: SimChat[];
}) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [visibleComments, setVisibleComments] = useState<TimedCommentDTO[]>([]);
  const [visibleSimChats, setVisibleSimChats] = useState<SimChat[]>([]);
  const [activeCTA, setActiveCTA] = useState<CTASequenceDTO | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const duration = MOCK_WEBINAR.durationSeconds;
  const progress = (currentTime / duration) * 100;

  // Sync currentTime from real video element every second
  useEffect(() => {
    const tick = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setCurrentTime(Math.floor(videoRef.current.currentTime));
      }
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  // Also run mock timer when no video is loaded
  useEffect(() => {
    if (!videoSource) {
      if (isPlaying) {
        intervalRef.current = setInterval(() => {
          setCurrentTime((t) => {
            const next = t + 1;
            if (next >= duration) { setIsPlaying(false); return duration; }
            return next;
          });
        }, 1000);
      } else {
        clearInterval(intervalRef.current);
      }
      return () => clearInterval(intervalRef.current);
    }
  }, [isPlaying, duration, videoSource]);

  // Fire timed comments
  useEffect(() => {
    const triggered = MOCK_TIMED_COMMENTS.filter(
      (c) => c.isActive && c.triggerAt <= currentTime && !visibleComments.find((v) => v.id === c.id)
    );
    if (triggered.length > 0) setVisibleComments((prev) => [...prev, ...triggered]);
  }, [currentTime]);

  // Fire sim chats
  useEffect(() => {
    if (simChats.length === 0) return;
    const triggered = simChats.filter(
      (c) => c.showAt <= currentTime && !visibleSimChats.find((v) => v.id === c.id)
    );
    if (triggered.length > 0) setVisibleSimChats((prev) => [...prev, ...triggered]);
  }, [currentTime, simChats]);

  // Fire CTAs
  useEffect(() => {
    const triggered = [...MOCK_CTA_SEQUENCES].reverse().find((c) => c.isActive && c.triggerAt <= currentTime);
    setActiveCTA(triggered ?? null);
  }, [currentTime]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleComments, visibleSimChats]);

  const allMessages = [
    ...visibleComments.map(c => ({ id: `tc-${c.id}`, time: c.triggerAt, type: "timed" as const, data: c })),
    ...visibleSimChats.map(c => ({ id: `sc-${c.id}`, time: c.showAt, type: "sim" as const, data: c })),
  ].sort((a, b) => a.time - b.time);

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col">
        {/* Video area */}
        <div className="flex-1 bg-black relative">
          {videoSource ? (
            <VideoPlayer source={videoSource} videoRef={videoRef} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full gradient-brand flex items-center justify-center mx-auto mb-3 opacity-60">
                  <span className="font-display text-2xl font-bold text-white">JB</span>
                </div>
                <p className="text-white/20 text-sm">Video presentation</p>
                <p className="text-white/10 text-xs mt-1">Add a video source in Settings → Video</p>
              </div>
            </div>
          )}
          {!videoSource && (
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="max-w-2xl mx-auto bg-black/60 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">Current Section</p>
                <p className="text-base font-semibold text-white">
                  {currentTime < 300 ? "Opening Hook" : currentTime < 900 ? "The Promise" : currentTime < 1800 ? "Belief Shift 1" : currentTime < 2700 ? "Teaching Point 1" : currentTime < 3600 ? "Offer Stack" : "Call to Action"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        {activeCTA && (
          <div className="mx-6 my-3 p-4 rounded-xl bg-gradient-to-r from-purple-500/15 to-blue-500/15 border border-purple-500/25 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{activeCTA.headline}</p>
              {activeCTA.body && <p className="text-xs text-white/50 mt-0.5 truncate">{activeCTA.body}</p>}
            </div>
            {activeCTA.buttonUrl && (
              <a href={activeCTA.buttonUrl}>
                <Button size="sm" className="gradient-brand border-0 flex-shrink-0 text-xs h-8 px-4">{activeCTA.buttonText}</Button>
              </a>
            )}
          </div>
        )}

        {/* Controls — mock timer only when no real video */}
        {!videoSource && (
          <div className="px-6 py-4 border-t border-white/5 bg-black/20 flex-shrink-0">
            <div className="h-1 bg-white/10 rounded-full mb-3 cursor-pointer"
              onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setCurrentTime(Math.round(((e.clientX - rect.left) / rect.width) * duration)); }}>
              <div className="h-full gradient-brand rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex items-center gap-4">
              <Button size="sm" variant="ghost" className="text-white/60 hover:text-white h-8 w-8 p-0" onClick={() => setIsPlaying((p) => !p)}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="ghost" className="text-white/60 hover:text-white h-8 w-8 p-0" onClick={() => setCurrentTime((t) => Math.min(duration, t + 30))}>
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white/60 hover:text-white h-8 w-8 p-0" onClick={() => setIsMuted((m) => !m)}>
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <span className="text-xs text-white/30 font-mono ml-2">{formatTime(currentTime)} / {formatTime(duration)}</span>
              <Button size="sm" variant="ghost" className="text-white/60 hover:text-white h-8 w-8 p-0 ml-auto"><Maximize2 className="w-4 h-4" /></Button>
            </div>
          </div>
        )}
      </div>

      {/* Chat panel */}
      <div className="w-72 border-l border-white/5 flex flex-col bg-black/20 flex-shrink-0">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Live Chat</p>
          {simChats.length > 0 && (
            <span className="text-[10px] text-purple-400/70 font-medium">{simChats.length} messages loaded</span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {allMessages.length === 0 && (
            <div className="text-center pt-8 px-4">
              <p className="text-xs text-white/20 leading-relaxed">
                {simChats.length > 0
                  ? "▶ Play the video to see chat messages appear in real-time"
                  : "Generate chat messages in Settings → Chat Simulator, then play the video"}
              </p>
            </div>
          )}
          {allMessages.map((msg) => {
            if (msg.type === "timed") {
              const comment = msg.data as TimedCommentDTO;
              return (
                <div key={msg.id} className="flex gap-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-[10px] font-semibold text-white/40">
                    {comment.authorName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-medium mb-0.5 ${getCommentTypeColor(comment.type)}`}>{comment.authorName}</p>
                    <p className="text-xs text-white/55 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              );
            } else {
              const chat = msg.data as SimChat;
              return (
                <div key={msg.id} className="flex gap-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-[10px] font-semibold text-white/30">
                    {chat.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <p className={`text-[11px] font-medium ${getCueColor(chat.cueType)}`}>{chat.name}</p>
                      <span className="text-[9px] text-white/20">· {chat.city}</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">{chat.message}</p>
                  </div>
                </div>
              );
            }
          })}
          <div ref={chatEndRef} />
        </div>
        {/* Chat input */}
        <div className="px-3 py-2 border-t border-white/5">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
            <input placeholder="Type a message..." className="flex-1 bg-transparent text-xs text-white/40 placeholder:text-white/20 outline-none" />
            <button className="text-white/20 hover:text-white/50 text-xs transition-colors">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Settings ──────────────────────────────────────────────────
function SettingsTab({
  videoSource,
  onVideoSourceChange,
  simChats,
  onSimChatsChange,
}: {
  videoSource: VideoSource | null;
  onVideoSourceChange: (source: VideoSource | null) => void;
  simChats: SimChat[];
  onSimChatsChange: (chats: SimChat[]) => void;
}) {
  const [activeSection, setActiveSection] = useState("general");
  const [liveChat, setLiveChat] = useState(true);
  const [showBrandLogo, setShowBrandLogo] = useState(true);
  const [allowFullscreen, setAllowFullscreen] = useState(true);
  const [redirectAfter, setRedirectAfter] = useState(false);
  const [redirectLink, setRedirectLink] = useState("");
  const [chatVisibility, setChatVisibility] = useState("Public");
  const [sourceType, setSourceType] = useState<"upload"|"youtube"|"vimeo"|"mp4">("upload");
  const [externalUrl, setExternalUrl] = useState("");
  const [offers, setOffers] = useState<{id:string;name:string;showAt:number;url:string}[]>([]);
  const [newOffer, setNewOffer] = useState({name:"",showAt:2700,url:""});
  const [generatingChat, setGeneratingChat] = useState(false);

  const sections = [
    {key:"general",label:"General",icon:Settings2},
    {key:"video",label:"Video",icon:Video,badge:videoSource?"1 VIDEO":undefined},
    {key:"offers",label:"Offers",icon:Gift,badge:offers.length?`${offers.length} OFFER${offers.length>1?"S":""}`:undefined},
    {key:"handouts",label:"Handouts",icon:FileText},
    {key:"polls",label:"Polls",icon:BarChart},
    {key:"chat",label:"Chat",icon:MessageSquare},
    {key:"chatsim",label:"Chat Simulator",icon:MessageSquare,badge:simChats.length?`${simChats.length} MESSAGES`:undefined},
    {key:"colors",label:"Colors",icon:Tag},
    {key:"labels",label:"Labels",icon:Tag},
    {key:"embed",label:"Embed",icon:Code},
  ];

  const handleGenerateChats = () => {
    setGeneratingChat(true);
    setTimeout(() => {
      onSimChatsChange(generateSimChats(4500));
      setGeneratingChat(false);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (videoSource?.type === "upload") URL.revokeObjectURL(videoSource.url);
    onVideoSourceChange({ type: "upload", url: URL.createObjectURL(file), name: file.name });
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-52 border-r border-white/5 bg-black/10 flex flex-col py-3 shrink-0 overflow-y-auto">
        {sections.map(s => (
          <button key={s.key} onClick={() => setActiveSection(s.key)}
            className={`flex items-center justify-between px-4 py-2.5 text-sm transition-all ${
              activeSection===s.key ? "text-white bg-white/8 border-l-2 border-purple-500" : "text-white/40 hover:text-white/70 hover:bg-white/4 border-l-2 border-transparent"
            }`}>
            <div className="flex items-center gap-2.5"><s.icon className="w-3.5 h-3.5" /><span>{s.label}</span></div>
            {s.badge && <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded-full font-semibold">{s.badge}</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">

        {activeSection==="general" && (
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">General Settings</h3>
            <div>
              <label className="text-xs text-white/40 mb-2 block">Duration</label>
              <div className="flex gap-2">
                {[["Hours","1"],["Minutes","30"],["Seconds","0"]].map(([label,val])=>(
                  <div key={label} className="flex-1">
                    <label className="text-[10px] text-white/30 block mb-1">{label}</label>
                    <input defaultValue={val} type="number" min={0} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-white/70">Show brand logo</span><Toggle value={showBrandLogo} onChange={setShowBrandLogo} />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-white/70">Redirect after webinar ends</span><Toggle value={redirectAfter} onChange={setRedirectAfter} />
            </div>
            {redirectAfter && (
              <input value={redirectLink} onChange={e=>setRedirectLink(e.target.value)} placeholder="https://yoursite.com/thank-you"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500" />
            )}
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-white/70">Waiting image</span>
              <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors">Edit</button>
            </div>
          </div>
        )}

        {activeSection==="video" && (
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">Video Source</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={()=>setSourceType("upload")}
                className={`p-4 rounded-xl border-2 transition-all text-left ${sourceType==="upload"?"border-purple-500 bg-purple-500/10":"border-white/10 hover:border-white/20 bg-white/3"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Video className={`w-4 h-4 ${sourceType==="upload"?"text-purple-400":"text-white/30"}`} />
                  <span className={`text-sm font-medium ${sourceType==="upload"?"text-white":"text-white/50"}`}>Upload file</span>
                </div>
                <p className="text-xs text-white/25">Upload MP4, MOV or WebM directly</p>
              </button>
              <button onClick={()=>{if(sourceType==="upload")setSourceType("youtube");}}
                className={`p-4 rounded-xl border-2 transition-all text-left ${sourceType!=="upload"?"border-purple-500 bg-purple-500/10":"border-white/10 hover:border-white/20 bg-white/3"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Globe className={`w-4 h-4 ${sourceType!=="upload"?"text-purple-400":"text-white/30"}`} />
                  <span className={`text-sm font-medium ${sourceType!=="upload"?"text-white":"text-white/50"}`}>Use URL</span>
                </div>
                <p className="text-xs text-white/25">YouTube, Vimeo, or direct MP4 link</p>
              </button>
            </div>

            {sourceType==="upload" ? (
              <div className="space-y-3">
                <label htmlFor="video-file-input"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer group">
                  <Video className="w-8 h-8 text-white/20 group-hover:text-purple-400 mx-auto mb-2 transition-colors" />
                  {videoSource?.type==="upload" ? (
                    <><p className="text-sm text-green-400 font-medium">{videoSource.name}</p><p className="text-xs text-white/30 mt-1">Click to change file</p></>
                  ) : (
                    <><p className="text-sm text-white/40 group-hover:text-white/60 transition-colors">Drop video here or <span className="text-purple-400 underline">click to browse</span></p><p className="text-xs text-white/20 mt-1">MP4, MOV, WebM — up to 2GB</p></>
                  )}
                </label>
                <input id="video-file-input" type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
                {videoSource?.type==="upload" && (
                  <div className="flex items-center gap-3 p-3 bg-white/3 border border-white/8 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0"><Video className="w-4 h-4 text-purple-400" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{videoSource.name}</p>
                      <p className="text-xs text-green-400 font-semibold mt-0.5">SELECTED — switch to Watch Room to preview</p>
                    </div>
                    <button onClick={()=>onVideoSourceChange(null)} className="text-white/20 hover:text-red-400 text-lg leading-none transition-colors">×</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                  {(["youtube","vimeo","mp4"] as const).map(t=>(
                    <button key={t} onClick={()=>setSourceType(t)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${sourceType===t?"bg-purple-600 text-white":"text-white/30 hover:text-white/60"}`}>
                      {t==="mp4"?"Direct MP4":t.charAt(0).toUpperCase()+t.slice(1)}
                    </button>
                  ))}
                </div>
                <input value={externalUrl} onChange={e=>setExternalUrl(e.target.value)}
                  placeholder={sourceType==="youtube"?"https://youtube.com/watch?v=...":sourceType==="vimeo"?"https://vimeo.com/123456789":"https://example.com/video.mp4"}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500" />
                <button onClick={()=>{if(externalUrl.trim())onVideoSourceChange({type:sourceType,url:externalUrl.trim(),name:externalUrl.trim()});}}
                  disabled={!externalUrl.trim()}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition-colors">
                  Use this video →
                </button>
                {videoSource && videoSource.type!=="upload" && (
                  <div className="flex items-center gap-3 p-3 bg-white/3 border border-green-500/20 rounded-xl">
                    <Globe className="w-4 h-4 text-green-400 shrink-0" />
                    <div className="flex-1 min-w-0"><p className="text-xs text-white/60 truncate">{videoSource.name}</p><p className="text-xs text-green-400 font-semibold mt-0.5">ACTIVE — playing in Watch Room</p></div>
                    <button onClick={()=>{onVideoSourceChange(null);setExternalUrl("");}} className="text-white/20 hover:text-red-400 text-lg leading-none transition-colors">×</button>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center justify-between py-3 border-t border-white/5">
              <span className="text-sm text-white/70">Allow fullscreen</span><Toggle value={allowFullscreen} onChange={setAllowFullscreen} />
            </div>
          </div>
        )}

        {activeSection==="offers" && (
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">Timed Offers</h3>
            <div className="p-4 bg-white/3 border border-white/8 rounded-xl space-y-3">
              <p className="text-xs text-purple-400 font-medium">+ New offer</p>
              <input value={newOffer.name} onChange={e=>setNewOffer(p=>({...p,name:e.target.value}))} placeholder="Offer name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500" />
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] text-white/30 block mb-1">Show at (seconds)</label>
                  <input type="number" value={newOffer.showAt} onChange={e=>setNewOffer(p=>({...p,showAt:Number(e.target.value)}))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-white/30 block mb-1">CTA URL</label>
                  <input value={newOffer.url} onChange={e=>setNewOffer(p=>({...p,url:e.target.value}))} placeholder="https://..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <button onClick={()=>{if(!newOffer.name)return;setOffers(p=>[...p,{...newOffer,id:Date.now().toString()}]);setNewOffer({name:"",showAt:2700,url:""}); }}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors">Add Offer</button>
            </div>
            {offers.length===0 ? (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
                <Gift className="w-8 h-8 text-white/10 mx-auto mb-2" /><p className="text-sm text-white/30">No offers yet</p>
              </div>
            ) : offers.map(o=>(
              <div key={o.id} className="flex items-center justify-between p-4 bg-white/3 border border-white/8 rounded-xl">
                <div><p className="text-sm font-medium text-white">{o.name}</p><p className="text-xs text-white/30 mt-0.5">Shows at {Math.floor(o.showAt/60)}m {o.showAt%60}s</p></div>
                <button onClick={()=>setOffers(p=>p.filter(x=>x.id!==o.id))} className="text-white/20 hover:text-red-400 text-lg leading-none transition-colors ml-3">×</button>
              </div>
            ))}
          </div>
        )}

        {activeSection==="handouts" && (
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">Handouts</h3>
            <div className="text-center py-14 border border-dashed border-white/10 rounded-xl">
              <FileText className="w-8 h-8 text-white/10 mx-auto mb-2" /><p className="text-sm text-white/30 mb-1">No handouts yet</p>
              <p className="text-xs text-white/20 mb-4">Add PDFs or resources for attendees to download</p>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors">+ Add new handout</button>
            </div>
          </div>
        )}

        {activeSection==="polls" && (
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">Polls</h3>
            <div className="text-center py-14 border border-dashed border-white/10 rounded-xl">
              <BarChart className="w-8 h-8 text-white/10 mx-auto mb-2" /><p className="text-sm text-white/30 mb-1">No polls yet</p>
              <p className="text-xs text-white/20 mb-4">Engage attendees with timed poll questions</p>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors">+ Add new poll</button>
            </div>
          </div>
        )}

        {activeSection==="chat" && (
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">Chat Settings</h3>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-white/70">Live chat</span><Toggle value={liveChat} onChange={setLiveChat} />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Chat message visibility</label>
              <select value={chatVisibility} onChange={e=>setChatVisibility(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500">
                <option>Public</option><option>Presenter only</option><option>Hidden</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Notification cooldown</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500">
                <option>1 hour</option><option>30 minutes</option><option>2 hours</option><option>Never</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-white/5">
              <span className="text-sm text-white/70">Chat blocklist</span>
              <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors">Edit</button>
            </div>
          </div>
        )}

        {activeSection==="chatsim" && (
          <div className="max-w-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Chat Simulator</h3>
                <p className="text-xs text-white/30 mt-0.5">~160 realistic attendees with names & city locations</p>
              </div>
              <div className="flex items-center gap-2">
                {simChats.length>0 && <button onClick={()=>onSimChatsChange([])} className="text-xs text-red-400/60 hover:text-red-400 transition-colors">Remove all</button>}
                <button onClick={handleGenerateChats} disabled={generatingChat}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors">
                  {generatingChat ? (
                    <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Generating...</>
                  ) : simChats.length>0 ? "↺ Regenerate" : "✦ Generate Chat"}
                </button>
              </div>
            </div>

            <div className="p-4 bg-white/3 border border-white/8 rounded-xl">
              <p className="text-xs text-white/40 font-medium mb-3 uppercase tracking-wider">Chat cue types</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  ["type1","🔢 Type a 1","Fires when presenter asks viewers to type 1"],
                  ["dropCity","📍 Drop your city","Fires when presenter asks where people are from"],
                  ["react","🔥 Reactions","Value bombs and key teaching moments"],
                  ["testimonial","💰 Testimonials","Social proof from past attendees"],
                  ["question","❓ Questions","Curiosity during Q&A moments"],
                  ["joining","👋 Joining","People arriving at the start"],
                ] as [CueType,string,string][]).map(([cue,label,desc])=>(
                  <div key={cue} className="flex items-start gap-2 p-2 rounded-lg bg-white/3">
                    <div className={`text-xs font-bold mt-0.5 ${getCueColor(cue)}`}>●</div>
                    <div>
                      <p className={`text-xs font-medium ${getCueColor(cue)}`}>{label}</p>
                      <p className="text-[10px] text-white/25 leading-snug mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {simChats.length===0 ? (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                <MessageSquare className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-sm text-white/40 mb-1 font-medium">No chat messages yet</p>
                <p className="text-xs text-white/20 mb-3 max-w-sm mx-auto leading-relaxed">
                  Generate ~160 realistic attendees from 80+ US cities and 30+ European cities. Messages fire automatically as the video plays.
                </p>
                <div className="flex flex-wrap justify-center gap-1 mb-4 px-6">
                  {["Jason C. · Dallas, TX","Sarah M. · London, UK","Marcus Johnson · Atlanta, GA","Priya K. · Chicago, IL"].map(ex=>(
                    <span key={ex} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-white/30">{ex}</span>
                  ))}
                </div>
                <button onClick={handleGenerateChats} disabled={generatingChat}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors">
                  {generatingChat?"Generating...":"✦ Generate AI Chat Simulator"}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs text-white/30 mb-2">{simChats.length} messages · Messages sync to video playback time automatically</p>
                <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
                  {simChats.map((m)=>(
                    <div key={m.id} className="flex items-center gap-3 p-2.5 bg-white/3 border border-white/5 rounded-lg hover:border-white/10 transition-colors">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        m.cueType==="type1"?"bg-green-400":m.cueType==="dropCity"?"bg-blue-400":m.cueType==="testimonial"?"bg-yellow-400":m.cueType==="question"?"bg-orange-400":m.cueType==="joining"?"bg-cyan-400":"bg-purple-400"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-white/70">{m.name}</span>
                        <span className="text-[10px] text-white/25 mx-1.5">·</span>
                        <span className="text-[10px] text-white/25">{m.city}</span>
                        <span className="text-[10px] text-white/15 mx-1.5">·</span>
                        <span className="text-[10px] text-white/20">{Math.floor(m.showAt/60)}:{String(m.showAt%60).padStart(2,"0")}</span>
                      </div>
                      <span className="text-xs text-white/40 truncate max-w-[140px]">{m.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection==="colors" && (
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">Room Colors</h3>
            {[["Primary color","#7C3AED"],["Button color","#7C3AED"],["Background color","#06060F"],["Text color","#FFFFFF"],["Accent color","#A855F7"]].map(([label,def])=>(
              <div key={label} className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-sm text-white/70">{label}</span>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg border border-white/10" style={{background:def}} />
                  <input type="color" defaultValue={def} className="w-8 h-8 border-0 bg-transparent cursor-pointer rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection==="labels" && (
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">Custom Labels</h3>
            {[["Register button text","REGISTER NOW"],["Viewer count label","watching"],["Chat input placeholder","Type your message..."],["Live badge text","LIVE"],["CTA button default text","Get Started →"]].map(([label,def])=>(
              <div key={label}>
                <label className="text-xs text-white/40 mb-1 block">{label}</label>
                <input defaultValue={def} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
              </div>
            ))}
          </div>
        )}

        {activeSection==="embed" && (
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">Embed Instructions</h3>
            <div>
              <p className="text-sm text-white/60 mb-2">Step 1: Add this snippet where you want the watch room to appear.</p>
              <textarea readOnly className="w-full h-24 bg-white/3 border border-white/10 rounded-xl p-3 text-xs font-mono text-white/50 resize-none"
                value={`<div id="wf-room"></div>\n<script src="https://webinarforge.ai/embed.js"\n  data-slug="[YOUR_SLUG]">\n</script>`} />
            </div>
            <div>
              <p className="text-sm text-white/60 mb-2">Step 2: Add this once to your page head.</p>
              <textarea readOnly className="w-full h-14 bg-white/3 border border-white/10 rounded-xl p-3 text-xs font-mono text-white/50 resize-none"
                value={`<link rel="stylesheet" href="https://webinarforge.ai/css/room.css">`} />
            </div>
            <button onClick={()=>navigator.clipboard.writeText('<div id="wf-room"></div>')}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/50 hover:bg-white/8 transition-colors">Copy embed code</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab: Analytics ─────────────────────────────────────────────────
function AnalyticsTab() {
  const stats=[
    {label:"Total Registrations",value:"189",change:"+12%",up:true},
    {label:"Completions",value:"81",change:"+8%",up:true},
    {label:"Completion Rate",value:"43%",change:"-2%",up:false},
    {label:"Avg. Watch Time",value:"38:14",change:"+5%",up:true},
    {label:"CTA Clicks",value:"34",change:"+18%",up:true},
    {label:"Conversion Rate",value:"18%",change:"+3%",up:true},
  ];
  const dropOff=[
    {label:"Hook (0:00)",pct:100},{label:"Promise (5:00)",pct:87},
    {label:"Problem (15:00)",pct:74},{label:"Teaching 1 (25:00)",pct:61},
    {label:"Teaching 2 (35:00)",pct:52},{label:"Offer (45:00)",pct:43},{label:"CTA (55:00)",pct:38},
  ];
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {stats.map(s=>(
            <div key={s.label} className="p-4 rounded-xl bg-white/3 border border-white/8">
              <p className="text-xs text-white/30 mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className={`text-xs mt-1 font-medium ${s.up?"text-green-400":"text-red-400"}`}>{s.change} vs last month</p>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-xl bg-white/3 border border-white/8">
          <h3 className="text-sm font-semibold text-white mb-4">Audience Retention</h3>
          <div className="space-y-2.5">
            {dropOff.map(d=>(
              <div key={d.label} className="flex items-center gap-3">
                <span className="text-xs text-white/30 w-32 shrink-0">{d.label}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{width:`${d.pct}%`,background:d.pct>60?"#7C3AED":d.pct>40?"#9333EA":"#C026D3"}} />
                </div>
                <span className="text-xs text-white/50 w-10 text-right">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 rounded-xl bg-white/3 border border-white/8">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Registrations</h3>
          <div className="space-y-2">
            {[
              {name:"Sarah M.",email:"sarah@example.com",time:"2 hours ago",completed:true},
              {name:"Marcus T.",email:"marcus@example.com",time:"4 hours ago",completed:false},
              {name:"Jennifer K.",email:"jen@example.com",time:"6 hours ago",completed:true},
              {name:"David R.",email:"david@example.com",time:"8 hours ago",completed:true},
            ].map(r=>(
              <div key={r.email} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-semibold text-purple-400">{r.name.charAt(0)}</div>
                  <div><p className="text-xs font-medium text-white/70">{r.name}</p><p className="text-[10px] text-white/30">{r.email}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${r.completed?"bg-green-500/15 text-green-400":"bg-white/5 text-white/30"}`}>{r.completed?"Completed":"Watching"}</span>
                  <span className="text-[10px] text-white/25">{r.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Registration ──────────────────────────────────────────────
function RegistrationTab() {
  const [regMode,setRegMode]=useState<"platform"|"embed">("platform");
  const [tyMode,setTyMode]=useState<"platform"|"embed">("platform");
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {[{title:"Registration page",mode:regMode,setMode:setRegMode},{title:"Thank you page",mode:tyMode,setMode:setTyMode}].map(({title,mode,setMode})=>(
          <div key={title} className="rounded-xl bg-white/3 border border-white/8 overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5">
              <h3 className="text-base font-semibold text-white text-center">{title}</h3>
              <div className="flex items-center justify-center gap-4 mt-3">
                <span className={`text-xs ${mode==="platform"?"text-white":"text-white/30"}`}>Build on our platform</span>
                <Toggle value={mode==="embed"} onChange={v=>setMode(v?"embed":"platform")} />
                <span className={`text-xs ${mode==="embed"?"text-white":"text-white/30"}`}>Embed on your site</span>
              </div>
            </div>
            {mode==="embed"?(
              <div className="p-8 flex flex-col items-center justify-center min-h-40" style={{background:"linear-gradient(135deg,#4F6EF7,#3451D1)"}}>
                <h4 className="text-lg font-bold text-white text-center">Embed a widget on your site or funnel</h4>
                <div className="mt-4 bg-white/10 rounded-lg px-5 py-2 text-white text-sm font-medium cursor-pointer hover:bg-white/20">Open embed builder →</div>
              </div>
            ):(
              <div className="p-8 flex flex-col items-center justify-center min-h-40" style={{background:"linear-gradient(135deg,#059669,#047857)"}}>
                <h4 className="text-lg font-bold text-white text-center">Build and host your {title.toLowerCase()} on our platform</h4>
                <button className="mt-4 bg-white text-green-700 font-semibold text-sm px-5 py-2 rounded-lg hover:bg-white/90 transition-colors">Open page builder →</button>
              </div>
            )}
          </div>
        ))}
        <div className="rounded-xl bg-white/3 border border-white/8 p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Registration form preview</h3>
          <div className="bg-white rounded-xl p-6 max-w-sm mx-auto shadow-xl">
            <p className="text-xs text-gray-500 text-center mb-1">Next session in:</p>
            <div className="flex justify-center gap-4 mb-4">
              {[["0","days"],["0","hours"],["13","minutes"],["57","seconds"]].map(([n,l])=>(
                <div key={l} className="text-center"><p className="text-2xl font-bold text-gray-900">{n}</p><p className="text-xs text-gray-400">{l}</p></div>
              ))}
            </div>
            <input placeholder="First Name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-2 focus:outline-none focus:border-blue-500" />
            <input placeholder="Email" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-3 focus:outline-none focus:border-blue-500" />
            <button className="w-full bg-blue-600 text-white font-bold text-sm py-3 rounded-lg">REGISTER NOW</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
const TABS=[
  {key:"watch",label:"Watch Room",icon:PlayCircle},
  {key:"settings",label:"Settings",icon:Settings2},
  {key:"analytics",label:"Analytics",icon:BarChart2},
  {key:"registration",label:"Registration",icon:ClipboardList},
];

export default function EvergreenRoomPage() {
  const [activeTab,setActiveTab]=useState("watch");
  const [viewerCount,setViewerCount]=useState(MOCK_WEBINAR.viewerCountMin);
  const [saved,setSaved]=useState(false);
  const [videoSource,setVideoSource]=useState<VideoSource|null>(null);
  const [simChats,setSimChats]=useState<SimChat[]>([]);

  useEffect(()=>{
    const interval=setInterval(()=>{
      setViewerCount(prev=>{
        const delta=Math.floor(Math.random()*10)-3;
        return Math.max(MOCK_WEBINAR.viewerCountMin,Math.min(MOCK_WEBINAR.viewerCountMax,prev+delta));
      });
    },5000);
    return ()=>clearInterval(interval);
  },[]);

  useEffect(()=>{
    return ()=>{if(videoSource?.type==="upload")URL.revokeObjectURL(videoSource.url);};
  },[videoSource]);

  return (
    <div className="h-screen bg-[#06060f] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/20 flex-shrink-0">
        <div className="flex-1 min-w-0 mr-4">
          <h1 className="text-sm font-semibold text-white truncate">{MOCK_WEBINAR.title}</h1>
          <p className="text-xs text-white/30 mt-0.5">with {MOCK_WEBINAR.presenter}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <Users className="w-3 h-3" />
            <span>{viewerCount} watching</span>
          </div>
          <Badge className="bg-red-500/15 text-red-400 border-red-500/20 text-xs">LIVE</Badge>
        </div>
      </div>

      <div className="flex items-center px-6 border-b border-white/5 bg-black/10 flex-shrink-0">
        {TABS.map(tab=>(
          <button key={tab.key} onClick={()=>setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-all ${
              activeTab===tab.key?"border-purple-500 text-white":"border-transparent text-white/30 hover:text-white/60 hover:border-white/10"
            }`}>
            <tab.icon className="w-3.5 h-3.5" />{tab.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 py-2">
          {saved&&<span className="text-green-400 text-xs font-medium">✓ Saved</span>}
          <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);}}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors">
            Save changes
          </button>
          <a href="#" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:border-white/20 text-white/40 hover:text-white text-xs font-medium rounded-lg transition-colors">
            <Globe className="w-3 h-3" /> Preview
          </a>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {activeTab==="watch" && <WatchRoomTab videoSource={videoSource} simChats={simChats} />}
        {activeTab==="settings" && <SettingsTab videoSource={videoSource} onVideoSourceChange={setVideoSource} simChats={simChats} onSimChatsChange={setSimChats} />}
        {activeTab==="analytics" && <AnalyticsTab />}
        {activeTab==="registration" && <RegistrationTab />}
      </div>
    </div>
  );
}
