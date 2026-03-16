// app/(dashboard)/dashboard/evergreen/[slug]/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Volume2, VolumeX, Maximize2, SkipForward, Play, Pause } from "lucide-react";
import type { TimedCommentDTO, CTASequenceDTO } from "@/types/webinar";

// Mock webinar data — in production, fetch by slug via server component or API
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

export default function EvergreenRoomPage() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [visibleComments, setVisibleComments] = useState<TimedCommentDTO[]>([]);
  const [activeCTA, setActiveCTA] = useState<CTASequenceDTO | null>(null);
  const [viewerCount, setViewerCount] = useState(MOCK_WEBINAR.viewerCountMin);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const duration = MOCK_WEBINAR.durationSeconds;
  const progress = (currentTime / duration) * 100;

  // Simulate viewer count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const delta = Math.floor(Math.random() * 10) - 3;
        return Math.max(
          MOCK_WEBINAR.viewerCountMin,
          Math.min(MOCK_WEBINAR.viewerCountMax, prev + delta)
        );
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Timer tick
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((t) => {
          const next = t + 1;
          if (next >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return next;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, duration]);

  // Fire timed comments
  useEffect(() => {
    const triggered = MOCK_TIMED_COMMENTS.filter(
      (c) => c.isActive && c.triggerAt <= currentTime && !visibleComments.find((v) => v.id === c.id)
    );
    if (triggered.length > 0) {
      setVisibleComments((prev) => [...prev, ...triggered]);
    }
  }, [currentTime]);

  // Fire CTAs
  useEffect(() => {
    const triggered = [...MOCK_CTA_SEQUENCES]
      .reverse()
      .find((c) => c.isActive && c.triggerAt <= currentTime);
    setActiveCTA(triggered ?? null);
  }, [currentTime]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleComments]);

  return (
    <div className="h-screen bg-[#06060f] flex flex-col overflow-hidden">
      {/* Header bar */}
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

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video + controls */}
        <div className="flex-1 flex flex-col">
          {/* Video area */}
          <div className="flex-1 bg-black relative">
            {/* Placeholder presenter area */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full gradient-brand flex items-center justify-center mx-auto mb-3 opacity-60">
                  <span className="font-display text-2xl font-bold text-white">JB</span>
                </div>
                <p className="text-white/20 text-sm">Video presentation</p>
                <p className="text-white/10 text-xs mt-1">Connect your video source or use AI narration</p>
              </div>
            </div>

            {/* Slide overlay area */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="max-w-2xl mx-auto bg-black/60 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">Current Section</p>
                <p className="text-base font-semibold text-white">
                  {currentTime < 300 ? "Opening Hook" :
                   currentTime < 900 ? "The Promise" :
                   currentTime < 1800 ? "Belief Shift 1" :
                   currentTime < 2700 ? "Teaching Point 1" :
                   currentTime < 3600 ? "Offer Stack" : "Call to Action"}
                </p>
              </div>
            </div>
          </div>

          {/* CTA popup */}
          {activeCTA && (
            <div className="mx-6 my-3 p-4 rounded-xl bg-gradient-to-r from-purple-500/15 to-blue-500/15 border border-purple-500/25 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{activeCTA.headline}</p>
                {activeCTA.body && (
                  <p className="text-xs text-white/50 mt-0.5 truncate">{activeCTA.body}</p>
                )}
              </div>
              {activeCTA.buttonUrl && (
                <a href={activeCTA.buttonUrl}>
                  <Button size="sm" className="gradient-brand border-0 flex-shrink-0 text-xs h-8 px-4">
                    {activeCTA.buttonText}
                  </Button>
                </a>
              )}
            </div>
          )}

          {/* Progress / controls */}
          <div className="px-6 py-4 border-t border-white/5 bg-black/20 flex-shrink-0">
            {/* Progress bar */}
            <div
              className="h-1 bg-white/10 rounded-full mb-3 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                setCurrentTime(Math.round(ratio * duration));
              }}
            >
              <div
                className="h-full gradient-brand rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant="ghost"
                className="text-white/60 hover:text-white h-8 w-8 p-0"
                onClick={() => setIsPlaying((p) => !p)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-white/60 hover:text-white h-8 w-8 p-0"
                onClick={() => setCurrentTime((t) => Math.min(duration, t + 30))}
              >
                <SkipForward className="w-4 h-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-white/60 hover:text-white h-8 w-8 p-0"
                onClick={() => setIsMuted((m) => !m)}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>

              <span className="text-xs text-white/30 font-mono ml-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <Button
                size="sm"
                variant="ghost"
                className="text-white/60 hover:text-white h-8 w-8 p-0 ml-auto"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat panel */}
        <div className="w-72 border-l border-white/5 flex flex-col bg-black/20 flex-shrink-0">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Live Comments</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 webinar-room-chat">
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
                  <p className={`text-xs font-medium mb-0.5 ${getCommentTypeColor(comment.type)}`}>
                    {comment.authorName}
                  </p>
                  <p className="text-xs text-white/55 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
