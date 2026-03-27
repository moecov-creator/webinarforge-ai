// app/(dashboard)/dashboard/evergreen/[slug]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users, Volume2, VolumeX, Maximize2, SkipForward,
  Play, Pause, PlayCircle, Settings2, BarChart2,
  ClipboardList, Globe, Plus, Video, MessageSquare,
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

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors ${value ? "bg-blue-600" : "bg-white/10"}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : ""}`} />
    </button>
  );
}

// ── Tab: Watch Room ────────────────────────────────────────────────
function WatchRoomTab() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [visibleComments, setVisibleComments] = useState<TimedCommentDTO[]>([]);
  const [activeCTA, setActiveCTA] = useState<CTASequenceDTO | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const duration = MOCK_WEBINAR.durationSeconds;
  const progress = (currentTime / duration) * 100;

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((t) => {
          const next = t + 1;
          if (next >= duration) { setIsPlaying(false); return duration; }
          return next;
        });
      }, 1000);
    } else { clearInterval(intervalRef.current); }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, duration]);

  useEffect(() => {
    const triggered = MOCK_TIMED_COMMENTS.filter(
      (c) => c.isActive && c.triggerAt <= currentTime && !visibleComments.find((v) => v.id === c.id)
    );
    if (triggered.length > 0) setVisibleComments((prev) => [...prev, ...triggered]);
  }, [currentTime]);

  useEffect(() => {
    const triggered = [...MOCK_CTA_SEQUENCES].reverse().find((c) => c.isActive && c.triggerAt <= currentTime);
    setActiveCTA(triggered ?? null);
  }, [currentTime]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [visibleComments]);

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-black relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full gradient-brand flex items-center justify-center mx-auto mb-3 opacity-60">
                <span className="font-display text-2xl font-bold text-white">JB</span>
              </div>
              <p className="text-white/20 text-sm">Video presentation</p>
              <p className="text-white/10 text-xs mt-1">Connect your video source or use AI narration</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="max-w-2xl mx-auto bg-black/60 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">Current Section</p>
              <p className="text-base font-semibold text-white">
                {currentTime < 300 ? "Opening Hook" : currentTime < 900 ? "The Promise" : currentTime < 1800 ? "Belief Shift 1" : currentTime < 2700 ? "Teaching Point 1" : currentTime < 3600 ? "Offer Stack" : "Call to Action"}
              </p>
            </div>
          </div>
        </div>

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

        <div className="px-6 py-4 border-t border-white/5 bg-black/20 flex-shrink-0">
          <div
            className="h-1 bg-white/10 rounded-full mb-3 cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setCurrentTime(Math.round(((e.clientX - rect.left) / rect.width) * duration));
            }}
          >
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
            <Button size="sm" variant="ghost" className="text-white/60 hover:text-white h-8 w-8 p-0 ml-auto">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="w-72 border-l border-white/5 flex flex-col bg-black/20 flex-shrink-0">
        <div className="px-4 py-3 border-b border-white/5">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Live Comments</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {visibleComments.length === 0 && (
            <div className="text-center pt-8">
              <p className="text-xs text-white/20">Comments will appear as the webinar plays</p>
            </div>
          )}
          {visibleComments.map((comment) => (
            <div key={comment.id} className="flex gap-2 animate-in fade-in slide-in-from-bottom-2">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-white/40">
                {comment.authorName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium mb-0.5 ${getCommentTypeColor(comment.type)}`}>{comment.authorName}</p>
                <p className="text-xs text-white/55 leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>
    </div>
  );
}

// ── Tab: Settings ──────────────────────────────────────────────────
function SettingsTab() {
  const [activeSection, setActiveSection] = useState("general");
  const [liveChat, setLiveChat] = useState(true);
  const [showBrandLogo, setShowBrandLogo] = useState(true);
  const [allowFullscreen, setAllowFullscreen] = useState(true);
  const [redirectAfter, setRedirectAfter] = useState(false);
  const [redirectLink, setRedirectLink] = useState("");
  const [chatVisibility, setChatVisibility] = useState("Public");
  const [offers, setOffers] = useState<{ id: string; name: string; showAt: number; url: string }[]>([]);
  const [newOffer, setNewOffer] = useState({ name: "", showAt: 2700, url: "" });
  const [chatMessages, setChatMessages] = useState<{ id: string; name: string; message: string; showAt: number }[]>([]);
  const [generatingChat, setGeneratingChat] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [videoSourceType, setVideoSourceType] = useState("Use uploaded video");
  const [externalUrl, setExternalUrl] = useState("");

  const sections = [
    { key: "general", label: "General", icon: Settings2 },
    { key: "video", label: "Video", icon: Video, badge: uploadedVideo ? "1 VIDEO" : undefined },
    { key: "offers", label: "Offers", icon: Gift, badge: offers.length ? `${offers.length} OFFER${offers.length > 1 ? "S" : ""}` : undefined },
    { key: "handouts", label: "Handouts", icon: FileText },
    { key: "polls", label: "Polls", icon: BarChart },
    { key: "chat", label: "Chat", icon: MessageSquare },
    { key: "chatsim", label: "Chat Simulator", icon: MessageSquare, badge: chatMessages.length ? `${chatMessages.length} MESSAGES` : undefined },
    { key: "colors", label: "Colors", icon: Tag },
    { key: "labels", label: "Labels", icon: Tag },
    { key: "embed", label: "Embed", icon: Code },
  ];

  const generateChatMessages = () => {
    setGeneratingChat(true);
    setTimeout(() => {
      const names = ["Sarah M.", "Marcus T.", "Jennifer K.", "David R.", "Lisa P.", "Kevin W.", "Amanda S.", "Brian L.", "Tiffany N.", "Carlos M."];
      const locations = ["Orlando, FL", "New York, NY", "Austin, TX", "Chicago, IL", "Miami, FL", "Dallas, TX", "Atlanta, GA", "Seattle, WA"];
      const messages = [
        "This is exactly what I needed! 🙌",
        "Taking notes on everything here!",
        "Wow, this completely changes how I think about this",
        "Can you say more about that last point?",
        "This is gold. Pure gold.",
        "I've been struggling with this for months",
        "Already seeing how I can apply this",
        "Question: does this work for beginners too?",
        "The results speak for themselves 🔥",
        "Sharing this with my whole team",
        "This is why I signed up. Amazing content.",
        `Hello from ${locations[Math.floor(Math.random() * locations.length)]}! So glad I'm here`,
      ];
      const generated = Array.from({ length: 14 }, (_, i) => ({
        id: String(i),
        name: names[i % names.length],
        message: messages[i % messages.length],
        showAt: (i + 1) * 110 + Math.floor(Math.random() * 60),
      }));
      setChatMessages(generated);
      setGeneratingChat(false);
    }, 1800);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-52 border-r border-white/5 bg-black/10 flex flex-col py-3 shrink-0 overflow-y-auto">
        {sections.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`flex items-center justify-between px-4 py-2.5 text-sm transition-all ${
              activeSection === s.key
                ? "text-white bg-white/8 border-l-2 border-purple-500"
                : "text-white/40 hover:text-white/70 hover:bg-white/4 border-l-2 border-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <s.icon className="w-3.5 h-3.5" />
              <span>{s.label}</span>
            </div>
            {s.badge && (
              <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded-full font-semibold">{s.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content panel */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* ── General ── */}
        {activeSection === "general" && (
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">General Settings</h3>
            <div>
              <label className="text-xs text-white/40 mb-2 block">Duration</label>
              <div className="flex gap-2">
                {[["Hours", "1"], ["Minutes", "30"], ["Seconds", "0"]].map(([label, val]) => (
                  <div key={label} className="flex-1">
                    <label className="text-[10px] text-white/30 block mb-1">{label}</label>
                    <input defaultValue={val} type="number" min={0}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-white/70">Show brand logo</span>
              <Toggle value={showBrandLogo} onChange={setShowBrandLogo} />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-white/70">Redirect after webinar ends</span>
              <Toggle value={redirectAfter} onChange={setRedirectAfter} />
            </div>
            {redirectAfter && (
              <input value={redirectLink} onChange={e => setRedirectLink(e.target.value)}
                placeholder="https://yoursite.com/thank-you"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500" />
            )}
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-white/70">Waiting image</span>
              <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors">Edit</button>
            </div>
          </div>
        )}

        {/* ── Video ── */}
        {activeSection === "video" && (
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">Video Source</h3>

            <div>
              <label className="text-xs text-white/40 mb-1 block">Video source type</label>
              <select
                value={videoSourceType}
                onChange={e => setVideoSourceType(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option>Use uploaded video</option>
                <option>YouTube URL</option>
                <option>Vimeo URL</option>
                <option>Direct MP4 URL</option>
              </select>
            </div>

            {videoSourceType === "Use uploaded video" ? (
              <div>
                <label className="text-xs text-white/40 mb-2 block">Upload video file</label>
                <label
                  htmlFor="video-file-input"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer group"
                >
                  <Video className="w-8 h-8 text-white/20 group-hover:text-purple-400 mx-auto mb-2 transition-colors" />
                  {uploadedVideo ? (
                    <>
                      <p className="text-sm text-green-400 font-medium">{uploadedVideo}</p>
                      <p className="text-xs text-white/30 mt-1">Click to change file</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors">
                        Drop video here or <span className="text-purple-400 underline">click to browse</span>
                      </p>
                      <p className="text-xs text-white/20 mt-1">MP4, MOV, WebM — up to 2GB</p>
                    </>
                  )}
                </label>
                <input
                  id="video-file-input"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setUploadedVideo(file.name);
                  }}
                />

                {uploadedVideo && (
                  <div className="flex items-center gap-3 mt-3 p-3 bg-white/3 border border-white/8 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Video className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{uploadedVideo}</p>
                      <p className="text-xs text-green-400 font-semibold mt-0.5">SELECTED</p>
                    </div>
                    <button onClick={() => setUploadedVideo(null)} className="text-white/20 hover:text-red-400 text-lg leading-none transition-colors">×</button>
                  </div>
                )}

                <p className="text-xs text-blue-400/70 mt-2">
                  Please note: You must select an uploaded video for it to be viewable. Recently uploaded videos may take several minutes to process.
                </p>
              </div>
            ) : (
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  {videoSourceType === "YouTube URL" ? "YouTube URL" : videoSourceType === "Vimeo URL" ? "Vimeo URL" : "Direct video URL"}
                </label>
                <input
                  value={externalUrl}
                  onChange={e => setExternalUrl(e.target.value)}
                  placeholder={videoSourceType === "YouTube URL" ? "https://youtube.com/watch?v=..." : videoSourceType === "Vimeo URL" ? "https://vimeo.com/..." : "https://example.com/video.mp4"}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            <div className="flex items-center justify-between py-3 border-t border-white/5">
              <span className="text-sm text-white/70">Allow fullscreen</span>
              <Toggle value={allowFullscreen} onChange={setAllowFullscreen} />
            </div>
          </div>
        )}

        {/* ── Offers ── */}
        {activeSection === "offers" && (
          <div className="max-w-lg space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Timed Offers</h3>
            </div>

            {/* Add offer form */}
            <div className="p-4 bg-white/3 border border-white/8 rounded-xl space-y-3">
              <p className="text-xs text-purple-400 font-medium">+ New offer</p>
              <input value={newOffer.name} onChange={e => setNewOffer(p => ({ ...p, name: e.target.value }))}
                placeholder="Offer name (e.g. Business Mastermind)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500" />
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] text-white/30 block mb-1">Show at (seconds)</label>
                  <input type="number" value={newOffer.showAt} onChange={e => setNewOffer(p => ({ ...p, showAt: Number(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-white/30 block mb-1">CTA URL</label>
                  <input value={newOffer.url} onChange={e => setNewOffer(p => ({ ...p, url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <button
                onClick={() => {
                  if (!newOffer.name) return;
                  setOffers(prev => [...prev, { ...newOffer, id: Date.now().toString() }]);
                  setNewOffer({ name: "", showAt: 2700, url: "" });
                }}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Add Offer
              </button>
            </div>

            {offers.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
                <Gift className="w-8 h-8 text-white/10 mx-auto mb-2" />
                <p className="text-sm text-white/30">No offers yet</p>
                <p className="text-xs text-white/20 mt-1">Add timed offers that appear during the webinar</p>
              </div>
            ) : (
              <div className="space-y-2">
                {offers.map(o => (
                  <div key={o.id} className="flex items-center justify-between p-4 bg-white/3 border border-white/8 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-white">{o.name}</p>
                      <p className="text-xs text-white/30 mt-0.5">
                        Shows at {Math.floor(o.showAt / 60)} min {o.showAt % 60}s
                        {o.url && <> · <span className="text-purple-400/60">{o.url.slice(0, 30)}…</span></>}
                      </p>
                    </div>
                    <button onClick={() => setOffers(p => p.filter(x => x.id !== o.id))} className="text-white/20 hover:text-red-400 text-lg leading-none transition-colors ml-3">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Handouts ── */}
        {activeSection === "handouts" && (
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">Handouts</h3>
            <div className="text-center py-14 border border-dashed border-white/10 rounded-xl">
              <FileText className="w-8 h-8 text-white/10 mx-auto mb-2" />
              <p className="text-sm text-white/30 mb-1">No handouts yet</p>
              <p className="text-xs text-white/20 mb-4">Add PDFs or resources for attendees to download during the webinar</p>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors">
                + Add new handout
              </button>
            </div>
          </div>
        )}

        {/* ── Polls ── */}
        {activeSection === "polls" && (
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">Polls</h3>
            <div className="text-center py-14 border border-dashed border-white/10 rounded-xl">
              <BarChart className="w-8 h-8 text-white/10 mx-auto mb-2" />
              <p className="text-sm text-white/30 mb-1">No polls yet</p>
              <p className="text-xs text-white/20 mb-4">Engage attendees with timed poll questions</p>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors">
                + Add new poll
              </button>
            </div>
          </div>
        )}

        {/* ── Chat ── */}
        {activeSection === "chat" && (
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">Chat Settings</h3>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-white/70">Live chat</span>
              <Toggle value={liveChat} onChange={setLiveChat} />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Chat message visibility</label>
              <select value={chatVisibility} onChange={e => setChatVisibility(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500">
                <option>Public</option>
                <option>Presenter only</option>
                <option>Hidden</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Notification cooldown</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500">
                <option>1 hour</option>
                <option>30 minutes</option>
                <option>2 hours</option>
                <option>Never</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-white/5">
              <span className="text-sm text-white/70">Chat blocklist</span>
              <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors">Edit</button>
            </div>
          </div>
        )}

        {/* ── Chat Simulator ── */}
        {activeSection === "chatsim" && (
          <div className="max-w-lg space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Chat Simulator</h3>
              <div className="flex items-center gap-2">
                {chatMessages.length > 0 && (
                  <button onClick={() => setChatMessages([])} className="text-xs text-red-400/60 hover:text-red-400 transition-colors">
                    Remove all
                  </button>
                )}
                <button
                  onClick={generateChatMessages}
                  disabled={generatingChat}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors"
                >
                  {generatingChat ? (
                    <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Generating...</>
                  ) : "✦ Generate from script"}
                </button>
              </div>
            </div>

            {chatMessages.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                <MessageSquare className="w-8 h-8 text-white/10 mx-auto mb-3" />
                <p className="text-sm text-white/30 mb-1">No chat messages yet</p>
                <p className="text-xs text-white/20 mb-4 max-w-xs mx-auto leading-relaxed">
                  Generate AI chat messages based on your webinar script. They'll appear at key moments during the presentation to simulate live engagement.
                </p>
                <button
                  onClick={generateChatMessages}
                  disabled={generatingChat}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
                >
                  {generatingChat ? "Generating..." : "✦ Generate AI Chat Messages"}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {chatMessages.map((m, i) => (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-white/3 border border-white/8 rounded-xl hover:border-white/15 transition-colors group">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-semibold text-purple-400 shrink-0">
                        {m.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white/70 truncate">
                          {m.name} <span className="text-white/30 font-normal">· {m.message}</span>
                        </p>
                        <p className="text-[10px] text-white/25 mt-0.5">
                          Shows at {Math.floor(m.showAt / 60)}:{String(m.showAt % 60).padStart(2, "0")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setChatMessages(p => p.filter((_, j) => j !== i))}
                      className="text-white/20 hover:text-red-400 text-lg leading-none ml-2 opacity-0 group-hover:opacity-100 transition-all"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Colors ── */}
        {activeSection === "colors" && (
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">Room Colors</h3>
            {[["Primary color", "#7C3AED"], ["Button color", "#7C3AED"], ["Background color", "#06060F"], ["Text color", "#FFFFFF"], ["Accent color", "#A855F7"]].map(([label, def]) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-sm text-white/70">{label}</span>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg border border-white/10" style={{ background: def }} />
                  <input type="color" defaultValue={def} className="w-8 h-8 border-0 bg-transparent cursor-pointer rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Labels ── */}
        {activeSection === "labels" && (
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">Custom Labels</h3>
            {[
              ["Register button text", "REGISTER NOW"],
              ["Viewer count label", "watching"],
              ["Chat input placeholder", "Type your message..."],
              ["Live badge text", "LIVE"],
              ["CTA button default text", "Get Started →"],
            ].map(([label, def]) => (
              <div key={label}>
                <label className="text-xs text-white/40 mb-1 block">{label}</label>
                <input defaultValue={def}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
              </div>
            ))}
          </div>
        )}

        {/* ── Embed ── */}
        {activeSection === "embed" && (
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">Embed Instructions</h3>
            <div>
              <p className="text-sm text-white/60 mb-2">Step 1: Add this snippet where you want the watch room to appear.</p>
              <textarea readOnly
                className="w-full h-24 bg-white/3 border border-white/10 rounded-xl p-3 text-xs font-mono text-white/50 resize-none focus:outline-none"
                value={`<div id="wf-room"></div>\n<script src="https://webinarforge.ai/embed.js"\n  data-slug="[YOUR_SLUG]">\n</script>`}
              />
            </div>
            <div>
              <p className="text-sm text-white/60 mb-2">Step 2: Add this once to your page head.</p>
              <textarea readOnly
                className="w-full h-14 bg-white/3 border border-white/10 rounded-xl p-3 text-xs font-mono text-white/50 resize-none focus:outline-none"
                value={`<link rel="stylesheet" href="https://webinarforge.ai/css/room.css">`}
              />
            </div>
            <button
              onClick={() => navigator.clipboard.writeText('<div id="wf-room"></div>')}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/50 hover:bg-white/8 transition-colors"
            >
              Copy embed code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab: Analytics ─────────────────────────────────────────────────
function AnalyticsTab() {
  const stats = [
    { label: "Total Registrations", value: "189", change: "+12%", up: true },
    { label: "Completions", value: "81", change: "+8%", up: true },
    { label: "Completion Rate", value: "43%", change: "-2%", up: false },
    { label: "Avg. Watch Time", value: "38:14", change: "+5%", up: true },
    { label: "CTA Clicks", value: "34", change: "+18%", up: true },
    { label: "Conversion Rate", value: "18%", change: "+3%", up: true },
  ];

  const dropOffData = [
    { label: "Hook (0:00)", pct: 100 },
    { label: "Promise (5:00)", pct: 87 },
    { label: "Problem (15:00)", pct: 74 },
    { label: "Teaching 1 (25:00)", pct: 61 },
    { label: "Teaching 2 (35:00)", pct: 52 },
    { label: "Offer (45:00)", pct: 43 },
    { label: "CTA (55:00)", pct: 38 },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {stats.map(s => (
            <div key={s.label} className="p-4 rounded-xl bg-white/3 border border-white/8">
              <p className="text-xs text-white/30 mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className={`text-xs mt-1 font-medium ${s.up ? "text-green-400" : "text-red-400"}`}>{s.change} vs last month</p>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-xl bg-white/3 border border-white/8">
          <h3 className="text-sm font-semibold text-white mb-4">Audience Retention</h3>
          <div className="space-y-2.5">
            {dropOffData.map(d => (
              <div key={d.label} className="flex items-center gap-3">
                <span className="text-xs text-white/30 w-32 shrink-0">{d.label}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${d.pct}%`,
                    background: d.pct > 60 ? "#7C3AED" : d.pct > 40 ? "#9333EA" : "#C026D3"
                  }} />
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
              { name: "Sarah M.", email: "sarah@example.com", time: "2 hours ago", completed: true },
              { name: "Marcus T.", email: "marcus@example.com", time: "4 hours ago", completed: false },
              { name: "Jennifer K.", email: "jen@example.com", time: "6 hours ago", completed: true },
              { name: "David R.", email: "david@example.com", time: "8 hours ago", completed: true },
            ].map(r => (
              <div key={r.email} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-semibold text-purple-400">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/70">{r.name}</p>
                    <p className="text-[10px] text-white/30">{r.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${r.completed ? "bg-green-500/15 text-green-400" : "bg-white/5 text-white/30"}`}>
                    {r.completed ? "Completed" : "Watching"}
                  </span>
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
  const [regMode, setRegMode] = useState<"platform" | "embed">("platform");
  const [tyMode, setTyMode] = useState<"platform" | "embed">("platform");

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-xl bg-white/3 border border-white/8 overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5">
            <h3 className="text-base font-semibold text-white text-center">Registration page</h3>
            <div className="flex items-center justify-center gap-4 mt-3">
              <span className={`text-xs transition-colors ${regMode === "platform" ? "text-white" : "text-white/30"}`}>Build on our platform</span>
              <Toggle value={regMode === "embed"} onChange={v => setRegMode(v ? "embed" : "platform")} />
              <span className={`text-xs transition-colors ${regMode === "embed" ? "text-white" : "text-white/30"}`}>Embed on your site</span>
            </div>
          </div>
          {regMode === "embed" ? (
            <div className="p-8 flex flex-col items-center justify-center min-h-40 cursor-pointer" style={{ background: "linear-gradient(135deg, #4F6EF7, #3451D1)" }}>
              <h4 className="text-lg font-bold text-white text-center">Embed a registration widget on your site or funnel</h4>
              <p className="text-white/60 text-sm mt-2">Click to open embed builder</p>
              <div className="mt-4 bg-white/10 rounded-lg px-5 py-2 text-white text-sm font-medium hover:bg-white/20 transition-colors cursor-pointer">Open embed builder →</div>
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center min-h-40 cursor-pointer" style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
              <h4 className="text-lg font-bold text-white text-center">Build and host your registration page on our platform</h4>
              <p className="text-white/60 text-sm mt-2">Click to open page builder</p>
              <button className="mt-4 bg-white text-green-700 font-semibold text-sm px-5 py-2 rounded-lg hover:bg-white/90 transition-colors">Open page builder →</button>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white/3 border border-white/8 overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5">
            <h3 className="text-base font-semibold text-white text-center">Thank you page</h3>
            <div className="flex items-center justify-center gap-4 mt-3">
              <span className={`text-xs transition-colors ${tyMode === "platform" ? "text-white" : "text-white/30"}`}>Build on our platform</span>
              <Toggle value={tyMode === "embed"} onChange={v => setTyMode(v ? "embed" : "platform")} />
              <span className={`text-xs transition-colors ${tyMode === "embed" ? "text-white" : "text-white/30"}`}>Embed on your site</span>
            </div>
          </div>
          <div className="p-8 flex flex-col items-center justify-center min-h-40 cursor-pointer" style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
            <h4 className="text-lg font-bold text-white text-center">Build and host your thank you page on our platform</h4>
            <p className="text-white/60 text-sm mt-2">Click to open page builder</p>
            <button className="mt-4 bg-white text-green-700 font-semibold text-sm px-5 py-2 rounded-lg hover:bg-white/90 transition-colors">Open page builder →</button>
          </div>
        </div>

        <div className="rounded-xl bg-white/3 border border-white/8 p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Registration form preview</h3>
          <div className="bg-white rounded-xl p-6 max-w-sm mx-auto shadow-xl">
            <p className="text-xs text-gray-500 text-center mb-1">Next session in:</p>
            <div className="flex justify-center gap-4 mb-4">
              {[["0", "days"], ["0", "hours"], ["13", "minutes"], ["57", "seconds"]].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{n}</p>
                  <p className="text-xs text-gray-400">{l}</p>
                </div>
              ))}
            </div>
            <input placeholder="First Name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-2 focus:outline-none focus:border-blue-500" />
            <input placeholder="Email" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-3 focus:outline-none focus:border-blue-500" />
            <button className="w-full bg-blue-600 text-white font-bold text-sm py-3 rounded-lg hover:bg-blue-700 transition-colors">REGISTER NOW</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
const TABS = [
  { key: "watch", label: "Watch Room", icon: PlayCircle },
  { key: "settings", label: "Settings", icon: Settings2 },
  { key: "analytics", label: "Analytics", icon: BarChart2 },
  { key: "registration", label: "Registration", icon: ClipboardList },
];

export default function EvergreenRoomPage() {
  const [activeTab, setActiveTab] = useState("watch");
  const [viewerCount, setViewerCount] = useState(MOCK_WEBINAR.viewerCountMin);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const delta = Math.floor(Math.random() * 10) - 3;
        return Math.max(MOCK_WEBINAR.viewerCountMin, Math.min(MOCK_WEBINAR.viewerCountMax, prev + delta));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-[#06060f] flex flex-col overflow-hidden">

      {/* Header */}
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

      {/* Tab bar */}
      <div className="flex items-center px-6 border-b border-white/5 bg-black/10 flex-shrink-0">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-all ${
              activeTab === tab.key
                ? "border-purple-500 text-white"
                : "border-transparent text-white/30 hover:text-white/60 hover:border-white/10"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 py-2">
          {saved && <span className="text-green-400 text-xs font-medium">✓ Saved</span>}
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Save changes
          </button>
          <a href="#" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:border-white/20 text-white/40 hover:text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Globe className="w-3 h-3" /> Preview
          </a>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === "watch" && <WatchRoomTab />}
        {activeTab === "settings" && <SettingsTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "registration" && <RegistrationTab />}
      </div>
    </div>
  );
}
