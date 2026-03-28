// app/(dashboard)/dashboard/live/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mic, MicOff, Video, VideoOff, MonitorUp, Users, MessageSquare,
  Hand, BarChart2, Settings, Radio, StopCircle, Save, Download,
  Share2, Clock, Wifi, WifiOff, ChevronDown, Send, X, Check,
  ArrowRight, Crown, Zap,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────
interface LiveMessage {
  id: string;
  name: string;
  message: string;
  time: string;
  type: "chat" | "question" | "reaction" | "system";
  reaction?: string;
}

interface Attendee {
  id: string;
  name: string;
  location: string;
  joinedAt: number;
  handRaised: boolean;
}

interface Poll {
  id: string;
  question: string;
  options: { text: string; votes: number }[];
  active: boolean;
}

// ── Mock attendee generator ────────────────────────────────────────
const NAMES = ["Jason C.","Sarah M.","Michael T.","Jennifer K.","Marcus W.","Priya R.","David L.","Amanda B.","Carlos G.","Nicole P.","Tyler H.","Melissa J.","Brandon S.","Ashley F.","Evan N.","Tiffany D.","Nathan R.","Lauren C.","Kevin M.","Monica A.","Andre T.","Jasmine W.","Steven B.","Crystal L.","Trevor K.","Keisha M.","Dylan H.","Patricia S.","Justin E.","Camille V."];
const LOCATIONS = ["New York, NY","Los Angeles, CA","Chicago, IL","Dallas, TX","Atlanta, GA","London, UK","Miami, FL","Seattle, WA","Austin, TX","Paris, France","Boston, MA","Toronto, Canada","Denver, CO","Berlin, Germany","Nashville, TN","Amsterdam, Netherlands","Las Vegas, NV","Sydney, Australia","Orlando, FL","Madrid, Spain"];
const CHAT_MESSAGES = ["🔥🔥🔥 This is incredible!","Mind blown 🤯","Taking notes right now!","This is exactly what I needed","WOW — game changer","Gold right here 💰","Can you repeat that last point?","Love this! Keep going!","1 ✅ — makes total sense","Sharing this with my team","Best webinar I've attended all year!","How do I get started?","Question: does this work for e-commerce?","This is pure value 💎","My business needed this yesterday","🙌🙌🙌","Screenshot worthy content!","Been struggling with this for months — finally clarity!","💯 percent agree","Just joined from ${loc}! So glad I made it"];

function generateAttendees(count: number): Attendee[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i),
    name: NAMES[i % NAMES.length],
    location: LOCATIONS[i % LOCATIONS.length],
    joinedAt: Date.now() - Math.random() * 600000,
    handRaised: Math.random() < 0.05,
  }));
}

function generateChatMessage(attendees: Attendee[], index: number): LiveMessage {
  const attendee = attendees[index % attendees.length];
  const msg = CHAT_MESSAGES[index % CHAT_MESSAGES.length].replace("${loc}", attendee.location);
  return {
    id: `${Date.now()}-${index}`,
    name: attendee.name,
    message: msg,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    type: Math.random() < 0.15 ? "question" : "chat",
  };
}

// ── Plan limits ────────────────────────────────────────────────────
const PLAN_LIMITS = {
  starter:    { attendees: 1000,    label: "Starter",    color: "text-blue-400",   badge: "bg-blue-500/20 text-blue-400" },
  pro:        { attendees: 10000,   label: "Pro",        color: "text-purple-400", badge: "bg-purple-500/20 text-purple-400" },
  enterprise: { attendees: 1000000, label: "Enterprise", color: "text-yellow-400", badge: "bg-yellow-500/20 text-yellow-400" },
};

// ── Helpers ────────────────────────────────────────────────────────
function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  return `${m}:${String(s).padStart(2,"0")}`;
}

// ── Main Component ─────────────────────────────────────────────────
export default function LiveWebinarHostPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id || "demo");

  // State
  const [plan] = useState<keyof typeof PLAN_LIMITS>("starter");
  const [isLive, setIsLive] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [peakAttendees, setPeakAttendees] = useState(0);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [activeTab, setActiveTab] = useState<"chat" | "questions" | "attendees" | "polls">("chat");
  const [newMessage, setNewMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedToEvergreen, setSavedToEvergreen] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [polls, setPolls] = useState<Poll[]>([
    { id: "1", question: "How long have you been in business?", options: [{ text: "< 1 year", votes: 0 }, { text: "1–3 years", votes: 0 }, { text: "3–5 years", votes: 0 }, { text: "5+ years", votes: 0 }], active: false },
    { id: "2", question: "What's your biggest challenge?", options: [{ text: "Getting leads", votes: 0 }, { text: "Closing sales", votes: 0 }, { text: "Scaling systems", votes: 0 }, { text: "Team building", votes: 0 }], active: false },
  ]);
  const [newPollQ, setNewPollQ] = useState("");
  const [showNewPoll, setShowNewPoll] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const chatRef = useRef<NodeJS.Timeout>();
  const attendeeRef = useRef<NodeJS.Timeout>();
  const msgIndex = useRef(0);

  const planInfo = PLAN_LIMITS[plan];
  const questions = messages.filter(m => m.type === "question");
  const handRaisedCount = attendees.filter(a => a.handRaised).length;

  // Timer
  useEffect(() => {
    if (isLive) {
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isLive]);

  // Simulate attendees joining
  useEffect(() => {
    if (!isLive) return;
    const baseAttendees = generateAttendees(30);
    setAttendees(baseAttendees);
    setAttendeeCount(47);

    attendeeRef.current = setInterval(() => {
      setAttendeeCount(prev => {
        const delta = Math.floor(Math.random() * 8) - 2;
        const next = Math.max(20, Math.min(planInfo.attendees, prev + delta + 3));
        setPeakAttendees(p => Math.max(p, next));
        return next;
      });
    }, 3000);

    return () => clearInterval(attendeeRef.current);
  }, [isLive, planInfo.attendees]);

  // Simulate live chat messages
  useEffect(() => {
    if (!isLive) return;
    const delay = () => 800 + Math.random() * 3000;

    const fireMessage = () => {
      if (attendees.length === 0) return;
      const msg = generateChatMessage(attendees, msgIndex.current++);
      setMessages(prev => [...prev.slice(-100), msg]);
      chatRef.current = setTimeout(fireMessage, delay());
    };

    chatRef.current = setTimeout(fireMessage, 1500);
    return () => clearTimeout(chatRef.current);
  }, [isLive, attendees]);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate poll votes when active
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setPolls(prev => prev.map(poll => {
        if (!poll.active) return poll;
        return {
          ...poll,
          options: poll.options.map(opt => ({
            ...opt,
            votes: opt.votes + Math.floor(Math.random() * 12),
          })),
        };
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, [isLive]);

  const handleGoLive = () => {
    setIsLive(true);
    setMessages([{
      id: "sys-1",
      name: "System",
      message: "🎉 You're live! Attendees can now join your webinar.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "system",
    }]);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: `host-${Date.now()}`,
      name: "You (Host)",
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "chat",
    }]);
    setNewMessage("");
  };

  const handleSaveToEvergreen = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsSaving(false);
    setSavedToEvergreen(true);
  };

  const handleLaunchPoll = (pollId: string) => {
    setPolls(prev => prev.map(p => ({ ...p, active: p.id === pollId ? !p.active : p.active })));
  };

  const totalPollVotes = (poll: Poll) => poll.options.reduce((s, o) => s + o.votes, 0);

  return (
    <div className="h-screen bg-[#080A0F] flex flex-col overflow-hidden text-white">

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/30 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/live" className="text-white/30 hover:text-white text-sm transition-colors">← Back</Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-white">Live Webinar</h1>
              {isLive && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>
                  <span className="text-[10px] font-bold text-red-400">LIVE</span>
                </div>
              )}
            </div>
            {isLive && <p className="text-xs text-white/30 mt-0.5">{formatDuration(duration)} · {attendeeCount.toLocaleString()} watching</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Plan badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${planInfo.badge}`}>
            <Crown className="w-3 h-3"/>
            {planInfo.label} · {planInfo.attendees.toLocaleString()} max
          </div>

          {plan === "starter" && (
            <button onClick={() => setShowUpgradeModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors">
              <Zap className="w-3 h-3"/> Upgrade to Pro
            </button>
          )}

          {isLive && (
            <>
              {savedToEvergreen ? (
                <div className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
                  <Check className="w-3.5 h-3.5"/> Saved to Evergreen
                </div>
              ) : (
                <button onClick={handleSaveToEvergreen} disabled={isSaving}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-white/15 hover:bg-white/5 text-white/60 hover:text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50">
                  <Save className="w-3.5 h-3.5"/>
                  {isSaving ? "Saving..." : "Save to Evergreen"}
                </button>
              )}
              <button onClick={() => setShowEndModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors">
                <StopCircle className="w-3.5 h-3.5"/> End Webinar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">

        {/* Left: Video area */}
        <div className="flex-1 flex flex-col">

          {/* Video */}
          <div className="flex-1 bg-black relative">
            {isLive ? (
              <>
                {/* Simulated camera feed */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                  {camOn ? (
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-2xl">
                        <span className="text-3xl font-bold">H</span>
                      </div>
                      <p className="text-white/40 text-sm">Your camera feed</p>
                      <p className="text-white/20 text-xs mt-1">Camera preview not available in demo</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <VideoOff className="w-12 h-12 text-white/20 mx-auto mb-2"/>
                      <p className="text-white/20 text-sm">Camera is off</p>
                    </div>
                  )}
                </div>

                {/* Live stats overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
                    <Users className="w-3.5 h-3.5 text-white/60"/>
                    <span className="text-sm font-semibold text-white">{attendeeCount.toLocaleString()}</span>
                    <span className="text-xs text-white/40">watching</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-white/60"/>
                    <span className="text-sm font-mono text-white">{formatDuration(duration)}</span>
                  </div>
                  {screenSharing && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-500/30">
                      <MonitorUp className="w-3.5 h-3.5 text-blue-400"/>
                      <span className="text-xs text-blue-400 font-medium">Sharing screen</span>
                    </div>
                  )}
                </div>

                {/* Hand raises */}
                {handRaisedCount > 0 && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 backdrop-blur-sm rounded-lg border border-yellow-500/30">
                    <Hand className="w-3.5 h-3.5 text-yellow-400"/>
                    <span className="text-xs text-yellow-400 font-medium">{handRaisedCount} hand{handRaisedCount > 1 ? "s" : ""} raised</span>
                  </div>
                )}

                {/* Connection quality */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-lg">
                  <Wifi className="w-3 h-3 text-green-400"/>
                  <span className="text-[10px] text-green-400">Excellent</span>
                </div>
              </>
            ) : (
              /* Pre-live lobby */
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                    <Radio className="w-8 h-8 text-white/30"/>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Ready to go live?</h2>
                  <p className="text-white/40 text-sm mb-8 leading-relaxed">
                    Check your camera and microphone, then click "Go Live" to start broadcasting to up to <strong className="text-white/60">{planInfo.attendees.toLocaleString()}</strong> attendees.
                  </p>

                  {/* Device checks */}
                  <div className="flex items-center justify-center gap-3 mb-8">
                    <button onClick={() => setMicOn(m => !m)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm ${micOn ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
                      {micOn ? <Mic className="w-4 h-4"/> : <MicOff className="w-4 h-4"/>}
                      {micOn ? "Mic On" : "Mic Off"}
                    </button>
                    <button onClick={() => setCamOn(c => !c)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm ${camOn ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
                      {camOn ? <Video className="w-4 h-4"/> : <VideoOff className="w-4 h-4"/>}
                      {camOn ? "Camera On" : "Camera Off"}
                    </button>
                  </div>

                  <button onClick={handleGoLive}
                    className="flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-lg rounded-2xl mx-auto transition-all shadow-lg shadow-red-900/40 hover:shadow-red-900/60 hover:-translate-y-0.5">
                    <Radio className="w-5 h-5"/>
                    Go Live Now
                  </button>
                  <p className="text-white/20 text-xs mt-4">Your attendees will be notified instantly</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls bar */}
          {isLive && (
            <div className="px-6 py-4 border-t border-white/5 bg-black/20 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <button onClick={() => setMicOn(m => !m)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${micOn ? "bg-white/8 hover:bg-white/12 text-white border border-white/10" : "bg-red-600 hover:bg-red-700 text-white"}`}>
                  {micOn ? <Mic className="w-4 h-4"/> : <MicOff className="w-4 h-4"/>}
                  {micOn ? "Mute" : "Unmute"}
                </button>
                <button onClick={() => setCamOn(c => !c)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${camOn ? "bg-white/8 hover:bg-white/12 text-white border border-white/10" : "bg-red-600 hover:bg-red-700 text-white"}`}>
                  {camOn ? <Video className="w-4 h-4"/> : <VideoOff className="w-4 h-4"/>}
                  {camOn ? "Stop Video" : "Start Video"}
                </button>
                <button onClick={() => setScreenSharing(s => !s)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${screenSharing ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-white/8 hover:bg-white/12 text-white border border-white/10"}`}>
                  <MonitorUp className="w-4 h-4"/>
                  {screenSharing ? "Stop Share" : "Share Screen"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Reactions */}
                {["🔥","👏","💯","❤️","🚀"].map(emoji => (
                  <button key={emoji} onClick={() => setMessages(prev => [...prev, {
                    id: `react-${Date.now()}`, name: "You", message: emoji,
                    time: new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}), type: "reaction", reaction: emoji,
                  }])}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-lg transition-colors hover:scale-110">
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white/8 hover:bg-white/12 border border-white/10 rounded-xl text-sm text-white transition-colors">
                  <Share2 className="w-4 h-4"/> Share Link
                </button>
                <button className="w-10 h-10 bg-white/8 hover:bg-white/12 border border-white/10 rounded-xl flex items-center justify-center transition-colors">
                  <Settings className="w-4 h-4 text-white/60"/>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Chat/Q&A/Attendees panel */}
        <div className="w-80 border-l border-white/5 flex flex-col bg-black/20 flex-shrink-0">

          {/* Tab bar */}
          <div className="flex border-b border-white/5 flex-shrink-0">
            {([
              { key: "chat", label: "Chat", count: messages.filter(m=>m.type==="chat"||m.type==="reaction").length },
              { key: "questions", label: "Q&A", count: questions.length },
              { key: "attendees", label: "People", count: attendeeCount },
              { key: "polls", label: "Polls", count: polls.filter(p=>p.active).length },
            ] as const).map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 text-xs font-medium transition-colors relative ${activeTab===tab.key?"text-white border-b-2 border-purple-500":"text-white/30 hover:text-white/60"}`}>
                {tab.label}
                {tab.count > 0 && <span className="ml-1 text-[10px] text-purple-400">({tab.count})</span>}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">

            {/* Chat tab */}
            {activeTab === "chat" && (
              <div className="p-3 space-y-2">
                {!isLive && (
                  <div className="text-center py-8 text-white/20 text-xs">Chat starts when you go live</div>
                )}
                {messages.filter(m => m.type !== "question").map(msg => (
                  <div key={msg.id} className={`${msg.type==="system"?"bg-purple-500/8 border border-purple-500/15 rounded-lg p-2.5":""}`}>
                    {msg.type === "system" ? (
                      <p className="text-xs text-purple-300">{msg.message}</p>
                    ) : (
                      <div className="flex gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-semibold ${msg.name==="You (Host)"?"bg-purple-600 text-white":"bg-white/8 text-white/40"}`}>
                          {msg.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`text-[11px] font-medium ${msg.name==="You (Host)"?"text-purple-400":"text-white/60"}`}>{msg.name}</span>
                            <span className="text-[9px] text-white/20">{msg.time}</span>
                          </div>
                          <p className="text-xs text-white/70 leading-relaxed">{msg.message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef}/>
              </div>
            )}

            {/* Q&A tab */}
            {activeTab === "questions" && (
              <div className="p-3 space-y-2">
                {questions.length === 0 ? (
                  <div className="text-center py-8 text-white/20 text-xs">{isLive ? "No questions yet" : "Questions will appear here when live"}</div>
                ) : questions.map(q => (
                  <div key={q.id} className="p-3 bg-white/3 border border-white/8 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium text-orange-400">{q.name}</span>
                      <span className="text-[9px] text-white/20">{q.time}</span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">{q.message}</p>
                    <button className="mt-2 text-[10px] text-purple-400 hover:text-purple-300 transition-colors">Answer live →</button>
                  </div>
                ))}
              </div>
            )}

            {/* Attendees tab */}
            {activeTab === "attendees" && (
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-white/40">{attendeeCount.toLocaleString()} attending · peak {peakAttendees.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  {attendees.map(a => (
                    <div key={a.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/3 transition-colors">
                      <div className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center text-xs font-semibold text-white/40 shrink-0">{a.name.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white/70 truncate">{a.name}</p>
                        <p className="text-[10px] text-white/25">{a.location}</p>
                      </div>
                      {a.handRaised && <Hand className="w-3.5 h-3.5 text-yellow-400 shrink-0"/>}
                    </div>
                  ))}
                  {attendeeCount > 30 && (
                    <p className="text-center text-[10px] text-white/20 py-2">+{(attendeeCount-30).toLocaleString()} more attendees</p>
                  )}
                </div>
              </div>
            )}

            {/* Polls tab */}
            {activeTab === "polls" && (
              <div className="p-3 space-y-3">
                {polls.map(poll => {
                  const total = totalPollVotes(poll);
                  return (
                    <div key={poll.id} className={`p-3 rounded-xl border ${poll.active?"border-purple-500/30 bg-purple-500/8":"border-white/8 bg-white/3"}`}>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <p className="text-xs font-medium text-white/80 leading-snug">{poll.question}</p>
                        <button onClick={() => handleLaunchPoll(poll.id)}
                          className={`shrink-0 text-[10px] px-2.5 py-1 rounded-lg font-semibold transition-colors ${poll.active?"bg-red-500/20 text-red-400 hover:bg-red-500/30":"bg-purple-600 text-white hover:bg-purple-700"}`}>
                          {poll.active ? "End" : "Launch"}
                        </button>
                      </div>
                      {poll.options.map((opt, i) => {
                        const pct = total > 0 ? Math.round((opt.votes/total)*100) : 0;
                        return (
                          <div key={i} className="mb-1.5">
                            <div className="flex items-center justify-between text-[10px] mb-0.5">
                              <span className="text-white/60">{opt.text}</span>
                              <span className="text-white/40">{pct}% ({opt.votes})</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{width:`${pct}%`}}/>
                            </div>
                          </div>
                        );
                      })}
                      {total > 0 && <p className="text-[10px] text-white/25 mt-2">{total} votes</p>}
                    </div>
                  );
                })}

                {/* New poll */}
                {showNewPoll ? (
                  <div className="p-3 bg-white/3 border border-white/8 rounded-xl space-y-2">
                    <input value={newPollQ} onChange={e=>setNewPollQ(e.target.value)} placeholder="Poll question..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500"/>
                    <div className="flex gap-2">
                      <button onClick={()=>{if(!newPollQ.trim())return;setPolls(p=>[...p,{id:Date.now().toString(),question:newPollQ,options:[{text:"Yes",votes:0},{text:"No",votes:0},{text:"Maybe",votes:0}],active:false}]);setNewPollQ("");setShowNewPoll(false);}} className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg">Add</button>
                      <button onClick={()=>setShowNewPoll(false)} className="px-3 py-1.5 border border-white/10 text-white/40 text-xs rounded-lg hover:bg-white/5">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={()=>setShowNewPoll(true)} className="w-full py-2 border border-dashed border-white/10 rounded-xl text-xs text-white/30 hover:text-white/60 hover:border-white/20 transition-colors">
                    + Add new poll
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Chat input */}
          {activeTab === "chat" && isLive && (
            <div className="px-3 py-3 border-t border-white/5 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && handleSendMessage()}
                  placeholder="Message attendees..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500"
                />
                <button onClick={handleSendMessage} className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                  <Send className="w-3.5 h-3.5 text-white"/>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* End webinar modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">End Webinar?</h3>
            <p className="text-sm text-white/50 mb-6 leading-relaxed">
              Your webinar will end for all {attendeeCount.toLocaleString()} attendees. The recording will be available to save.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-white/3 border border-white/8 rounded-xl text-center">
                <p className="text-xl font-bold text-white">{formatDuration(duration)}</p>
                <p className="text-xs text-white/30 mt-0.5">Duration</p>
              </div>
              <div className="p-3 bg-white/3 border border-white/8 rounded-xl text-center">
                <p className="text-xl font-bold text-white">{peakAttendees.toLocaleString()}</p>
                <p className="text-xs text-white/30 mt-0.5">Peak attendees</p>
              </div>
            </div>
            {!savedToEvergreen && (
              <button onClick={handleSaveToEvergreen} disabled={isSaving}
                className="w-full py-3 mb-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                <Save className="w-4 h-4"/>
                {isSaving ? "Saving recording..." : "Save Recording to Evergreen Room"}
              </button>
            )}
            {savedToEvergreen && (
              <div className="w-full py-3 mb-3 bg-green-500/15 border border-green-500/25 rounded-xl flex items-center justify-center gap-2 text-green-400 font-medium text-sm">
                <Check className="w-4 h-4"/> Recording saved to Evergreen
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowEndModal(false)} className="flex-1 py-3 border border-white/15 hover:bg-white/5 text-white/60 hover:text-white rounded-xl text-sm font-medium transition-colors">
                Keep Going
              </button>
              <button onClick={() => { setIsLive(false); setShowEndModal(false); router.push("/dashboard/live"); }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors">
                End for Everyone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <button onClick={() => setShowUpgradeModal(false)} className="absolute top-4 right-4 text-white/30 hover:text-white">
              <X className="w-5 h-5"/>
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-400"/>
              <h3 className="text-xl font-bold text-white">Upgrade to Pro</h3>
            </div>
            <p className="text-sm text-white/50 mb-6">Scale your live webinars to 10,000 concurrent attendees and unlock all premium features.</p>
            <div className="space-y-2 mb-6">
              {["Up to 10,000 live attendees","HD video streaming","Advanced analytics & heatmaps","Custom branding & domain","Priority support","Unlimited evergreen rooms","AI chat simulator — full access","Automated replay sequences"].map(f => (
                <div key={f} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-green-400 shrink-0"/>
                  <span className="text-sm text-white/70">{f}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setShowUpgradeModal(false); router.push("/dashboard/billing"); }}
                className="py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors">
                Upgrade with Stripe
              </button>
              <button onClick={() => { setShowUpgradeModal(false); window.open("mailto:sales@webinarforge.ai?subject=Pro Plan Inquiry", "_blank"); }}
                className="py-3 border border-white/15 hover:bg-white/5 text-white/70 hover:text-white rounded-xl text-sm font-medium transition-colors">
                Contact Sales (Invoice)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
