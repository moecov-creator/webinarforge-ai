// app/(dashboard)/dashboard/live/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radio, Plus, Calendar, Users, Clock, Video,
  MonitorUp, FileText, ChevronDown, ChevronLeft,
  ChevronRight, Check, Crown, Zap, X, ExternalLink,
  Trash2, MoreHorizontal, Bell, Search,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────
interface LiveSession {
  id: string;
  title: string;
  status: "scheduled" | "live" | "ended" | "draft";
  scheduledAt: string;
  scheduledDate?: Date;
  duration?: number;
  attendees?: number;
  peakAttendees?: number;
  savedToEvergreen?: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────
function formatDuration(s: number): string {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(i); }, []);
  return now;
}

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const MOCK_SESSIONS: LiveSession[] = [
  { id: "1", title: "How to Book 50 Sales Appointments Per Month", status: "live", scheduledAt: "Today, 2:00 PM CDT", attendees: 312, peakAttendees: 312 },
  { id: "2", title: "The AI Receptionist System — Live Demo", status: "scheduled", scheduledAt: "Tomorrow, 11:00 AM CDT" },
  { id: "3", title: "Real Estate Lead Machine Masterclass", status: "ended", scheduledAt: "Mar 25, 2026", duration: 5832, attendees: 847, peakAttendees: 1203, savedToEvergreen: true },
  { id: "4", title: "Coaches Q&A: Scale to $10k/Month", status: "ended", scheduledAt: "Mar 20, 2026", duration: 3600, attendees: 234, peakAttendees: 412, savedToEvergreen: false },
];

// ── New Meeting Modal ──────────────────────────────────────────────
function NewMeetingModal({ onClose, onStart }: { onClose: () => void; onStart: (title: string) => void }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState<"now" | "schedule">("now");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-md w-full">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">New Live Webinar</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
        </div>
        <div className="flex gap-2 mb-5">
          {(["now","schedule"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${mode===m?"bg-blue-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {m === "now" ? "Start now" : "Schedule"}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Webinar title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. How to Scale to $10k/Month"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"/>
          </div>
          {mode === "schedule" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-500"/>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Time</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-500"/>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between pt-1 text-sm">
            <span className="text-gray-500 flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/>Max attendees</span>
            <span className="font-semibold text-gray-800">1,000 <span className="text-gray-400 font-normal">(Starter)</span></span>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={() => { onStart(title || "New Live Webinar"); onClose(); }}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors">
            {mode === "now" ? "Start Webinar" : "Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Upgrade Modal ──────────────────────────────────────────────────
function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2"><Crown className="w-5 h-5 text-yellow-500"/><h3 className="text-xl font-bold text-gray-900">Choose Your Plan</h3></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { name:"Starter", price:"$97", unit:"/mo", attendees:"1,000", color:"blue", current:true, features:["1,000 live attendees","Unlimited sessions","Chat & Q&A","Polls & reactions","Recording & replay","Basic analytics"] },
            { name:"Pro", price:"$297", unit:"/mo", attendees:"10,000", color:"purple", popular:true, features:["10,000 live attendees","Everything in Starter","HD video streaming","Advanced analytics","Custom branding","Priority support","AI chat simulator","Automated sequences"] },
            { name:"Enterprise", price:"Custom", unit:"", attendees:"1,000,000+", color:"yellow", features:["Unlimited attendees","Everything in Pro","Dedicated infrastructure","SLA guarantee","White-label option","Dedicated account manager","Custom integrations","On-premise option"] },
          ].map(plan => (
            <div key={plan.name} className={`relative p-5 rounded-2xl border-2 ${plan.popular?"border-purple-500 bg-purple-50":plan.current?"border-blue-200 bg-blue-50":"border-gray-200 bg-gray-50"}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 rounded-full text-[10px] font-bold text-white">MOST POPULAR</div>}
              {plan.current && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 rounded-full text-[10px] font-bold text-white">CURRENT PLAN</div>}
              <p className="font-bold text-gray-900 mb-1">{plan.name}</p>
              <p className="text-2xl font-bold text-gray-900 mb-0.5">{plan.price}<span className="text-sm font-normal text-gray-400">{plan.unit}</span></p>
              <p className="text-xs text-gray-400 mb-4">Up to {plan.attendees} attendees</p>
              <div className="space-y-1.5 mb-4">
                {plan.features.map(f => (<div key={f} className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500 shrink-0"/><span className="text-xs text-gray-600">{f}</span></div>))}
              </div>
              {!plan.current && (
                <button className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors ${plan.popular?"bg-purple-600 hover:bg-purple-700 text-white":plan.name==="Enterprise"?"border border-yellow-400 text-yellow-700 hover:bg-yellow-50":"bg-blue-600 hover:bg-blue-700 text-white"}`}>
                  {plan.name === "Enterprise" ? "Contact Sales" : "Upgrade Now →"}
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400">All plans include 14-day free trial · Cancel anytime · Invoice billing available for Pro & Enterprise</p>
      </div>
    </div>
  );
}

// ── Mini Calendar ──────────────────────────────────────────────────
function MiniCalendar({ currentDate, onDateClick }: { currentDate: Date; onDateClick: (d: Date) => void }) {
  const [viewDate, setViewDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
  const year = viewDate.getFullYear(), month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const cells = Array.from({ length: firstDay }, () => null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-800">{MONTHS[month]} {year}</span>
        <div className="flex gap-1">
          <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100"><ChevronLeft className="w-3.5 h-3.5 text-gray-400"/></button>
          <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100"><ChevronRight className="w-3.5 h-3.5 text-gray-400"/></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {["S","M","T","W","T","F","S"].map((d,i) => (<div key={i} className="text-center text-[10px] text-gray-400 font-medium py-1">{d}</div>))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i}/>;
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const isSelected = day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear();
          return (
            <button key={i} onClick={() => onDateClick(new Date(year, month, day))}
              className={`w-7 h-7 rounded-full text-xs flex items-center justify-center mx-auto transition-colors ${
                isSelected ? "bg-blue-600 text-white font-semibold" :
                isToday ? "bg-blue-100 text-blue-700 font-semibold" :
                "text-gray-700 hover:bg-gray-100"
              }`}>{day}</button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
export default function LiveDashboardPage() {
  const now = useNow();
  const [sessions, setSessions] = useState<LiveSession[]>(MOCK_SESSIONS);
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [showNewDropdown, setShowNewDropdown] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"day" | "week">("day");

  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
  const calendarLabel = `Today, ${MONTHS_SHORT[selectedDate.getMonth()]} ${selectedDate.getDate()}`;

  const liveSessions = sessions.filter(s => s.status === "live");
  const upcomingSessions = sessions.filter(s => s.status === "scheduled");
  const pastSessions = sessions.filter(s => s.status === "ended");

  const handleStart = (title: string) => {
    const newSession: LiveSession = { id: Date.now().toString(), title, status: "live", scheduledAt: "Now", attendees: 0, peakAttendees: 0 };
    setSessions(p => [newSession, ...p]);
  };

  // Big action buttons — modeled exactly from Zoom home
  const actionButtons = [
    {
      icon: <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8"><path d="M15 10l4.553-2.277A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>,
      label: "New meeting",
      color: "bg-orange-500 hover:bg-orange-600",
      hasDropdown: true,
      onClick: () => setShowNewDropdown(d => !d),
      primary: true,
    },
    {
      icon: <Plus className="w-8 h-8 text-white"/>,
      label: "Join",
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: () => {},
    },
    {
      icon: <Calendar className="w-8 h-8 text-white"/>,
      label: "Schedule",
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: () => setShowNewMeeting(true),
    },
    {
      icon: <MonitorUp className="w-8 h-8 text-white"/>,
      label: "Share screen",
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top search bar — Zoom style */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-100">
        <div className="flex-1 max-w-sm">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 text-sm text-gray-400">
            <Search className="w-4 h-4"/>
            <span>Search (Ctrl+E)</span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button onClick={() => setShowUpgrade(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-purple-200">
            <Crown className="w-4 h-4"/> Upgrade to Pro
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <Bell className="w-4.5 h-4.5 text-gray-500"/>
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-0">
        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center py-10 px-8">

          {/* Action buttons — Zoom grid style */}
          <div className="grid grid-cols-2 gap-5 mb-8">
            {/* New meeting — orange with dropdown */}
            <div className="relative">
              <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => { setShowNewMeeting(true); setShowNewDropdown(false); }}>
                <div className="w-20 h-20 rounded-2xl bg-orange-500 hover:bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-200 transition-all group-hover:shadow-orange-300 group-hover:-translate-y-0.5">
                  <svg viewBox="0 0 24 24" fill="white" className="w-9 h-9"><path d="M15 10l4.553-2.277A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-700">New meeting</span>
                  <button onClick={e => { e.stopPropagation(); setShowNewDropdown(d => !d); }} className="hover:bg-gray-100 rounded p-0.5">
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400"/>
                  </button>
                </div>
              </div>
              {showNewDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  <Link href="/dashboard/live/new">
                    <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
                      <p className="font-medium">Start with video</p>
                      <p className="text-xs text-gray-400">Camera & mic on</p>
                    </button>
                  </Link>
                  <Link href="/dashboard/live/new">
                    <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                      <p className="font-medium">Start without video</p>
                      <p className="text-xs text-gray-400">Audio only</p>
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Join */}
            <div className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-20 h-20 rounded-2xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center shadow-lg shadow-blue-200 transition-all group-hover:shadow-blue-300 group-hover:-translate-y-0.5">
                <Plus className="w-9 h-9 text-white"/>
              </div>
              <span className="text-sm font-medium text-gray-700">Join</span>
            </div>

            {/* Schedule */}
            <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => setShowNewMeeting(true)}>
              <div className="w-20 h-20 rounded-2xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center shadow-lg shadow-blue-200 transition-all group-hover:shadow-blue-300 group-hover:-translate-y-0.5">
                <div className="relative">
                  <Calendar className="w-9 h-9 text-white"/>
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white leading-none">{now.getDate()}</span>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">Schedule</span>
            </div>

            {/* Share screen */}
            <div className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-20 h-20 rounded-2xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center shadow-lg shadow-blue-200 transition-all group-hover:shadow-blue-300 group-hover:-translate-y-0.5">
                <MonitorUp className="w-9 h-9 text-white"/>
              </div>
              <span className="text-sm font-medium text-gray-700">Share screen</span>
            </div>
          </div>

          {/* My notes — 5th button, centered */}
          <div className="flex flex-col items-center gap-2 cursor-pointer group mb-10 relative">
            <div className="w-20 h-20 rounded-2xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center shadow-lg shadow-blue-200 transition-all group-hover:shadow-blue-300 group-hover:-translate-y-0.5">
              <FileText className="w-9 h-9 text-white"/>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700">My notes</span>
              <span className="text-[9px] font-bold text-blue-500 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full">NEW</span>
            </div>
          </div>

          {/* Sessions list below */}
          {(liveSessions.length > 0 || upcomingSessions.length > 0 || pastSessions.length > 0) && (
            <div className="w-full max-w-xl">
              <div className="border-t border-gray-100 pt-6">
                {liveSessions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">🔴 Live Now</p>
                    {liveSessions.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl mb-2">
                        <div><p className="text-sm font-semibold text-gray-900 truncate max-w-xs">{s.title}</p><p className="text-xs text-red-500">{s.attendees?.toLocaleString()} watching</p></div>
                        <Link href={`/dashboard/live/${s.id}`}>
                          <button className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors">
                            <Radio className="w-3 h-3"/> Join Room
                          </button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {upcomingSessions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Upcoming</p>
                    {upcomingSessions.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl mb-2 hover:border-gray-200 transition-colors">
                        <div><p className="text-sm font-semibold text-gray-900 truncate max-w-xs">{s.title}</p><p className="text-xs text-gray-400">{s.scheduledAt}</p></div>
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/live/${s.id}`}>
                            <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors">Start Early</button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {pastSessions.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Past Sessions</p>
                    {pastSessions.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl mb-2 hover:border-gray-200 transition-colors">
                        <div><p className="text-sm font-semibold text-gray-900 truncate max-w-xs">{s.title}</p><div className="flex items-center gap-2 mt-0.5"><p className="text-xs text-gray-400">{s.scheduledAt}</p>{s.duration&&<span className="text-xs text-gray-300">· {formatDuration(s.duration)}</span>}{s.attendees&&<span className="text-xs text-gray-300">· {s.attendees.toLocaleString()} attended</span>}</div></div>
                        <div className="flex items-center gap-2">
                          {s.savedToEvergreen?(<div className="flex items-center gap-1 text-xs text-green-500 font-medium"><Check className="w-3 h-3"/>Evergreen</div>):(
                            <button onClick={() => setSessions(p => p.map(x => x.id===s.id?{...x,savedToEvergreen:true}:x))} className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors">Save to Evergreen</button>
                          )}
                          <button onClick={() => setSessions(p => p.filter(x => x.id!==s.id))} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400"/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right panel — Zoom calendar style */}
        <div className="w-80 border-l border-gray-100 flex flex-col flex-shrink-0">
          {/* Clock card */}
          <div className="m-4 rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #1a3a2a 0%, #0d2d1f 100%)", minHeight: 110 }}>
            {/* Decorative leaf shapes */}
            <div className="absolute left-3 top-2 opacity-40">
              <svg width="40" height="70" viewBox="0 0 40 70"><ellipse cx="20" cy="35" rx="12" ry="32" fill="#2d6a4f" transform="rotate(-20 20 35)"/></svg>
            </div>
            <div className="absolute left-8 top-0 opacity-30">
              <svg width="30" height="55" viewBox="0 0 30 55"><ellipse cx="15" cy="27" rx="9" ry="24" fill="#40916c" transform="rotate(10 15 27)"/></svg>
            </div>
            <div className="absolute right-4 bottom-2 opacity-20">
              <div className="w-3 h-3 bg-gray-300 rounded-full"/>
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-1 ml-1"/>
            </div>
            <div className="relative z-10 p-4 text-right">
              <button className="absolute top-3 right-3 text-white/40 hover:text-white/70"><MoreHorizontal className="w-4 h-4"/></button>
              <p className="text-3xl font-bold text-white mt-1">{timeStr}</p>
              <p className="text-sm text-white/70 mt-0.5">{dateStr}</p>
            </div>
          </div>

          {/* Calendar panel */}
          <div className="flex-1 mx-4 mb-4 flex flex-col">
            {/* Calendar header */}
            <div className="flex items-center justify-between mb-3">
              <button className="w-6 h-6 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full text-lg leading-none">+</button>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-gray-800">{calendarLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400"/>
              </div>
              <div className="w-6 h-6"/>
            </div>

            {/* Today / nav */}
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => setSelectedDate(new Date())} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                <Calendar className="w-3 h-3"/> Today
              </button>
              <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate()-1); setSelectedDate(d); }} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronLeft className="w-3.5 h-3.5 text-gray-400"/></button>
              <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate()+1); setSelectedDate(d); }} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronRight className="w-3.5 h-3.5 text-gray-400"/></button>
              <button className="ml-auto"><MoreHorizontal className="w-4 h-4 text-gray-300"/></button>
            </div>

            {/* Mini calendar */}
            <div className="mb-4">
              <MiniCalendar currentDate={selectedDate} onDateClick={setSelectedDate}/>
            </div>

            {/* Day view */}
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-100 py-8 px-4">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="mb-3 opacity-40">
                <ellipse cx="20" cy="40" rx="14" ry="8" fill="#94a3b8" transform="rotate(-20 20 40)"/>
                <ellipse cx="35" cy="38" rx="10" ry="6" fill="#cbd5e1" transform="rotate(10 35 38)"/>
                <circle cx="38" cy="44" r="5" fill="#94a3b8"/>
                <circle cx="34" cy="48" r="4" fill="#cbd5e1"/>
              </svg>
              <p className="text-sm text-gray-500 font-medium mb-1">No meetings scheduled.</p>
              <button onClick={() => setShowNewMeeting(true)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <span className="text-lg leading-none">+</span> Schedule a meeting
              </button>
            </div>

            {/* Open recordings */}
            <button className="flex items-center justify-between mt-3 px-1 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <span>Open recordings</span>
              <ChevronRight className="w-4 h-4 text-gray-400"/>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showNewMeeting && <NewMeetingModal onClose={() => setShowNewMeeting(false)} onStart={handleStart}/>}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)}/>}
    </div>
  );
}
