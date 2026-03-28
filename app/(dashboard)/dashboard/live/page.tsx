// app/(dashboard)/dashboard/live/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radio, Plus, Calendar, Video, MonitorUp, FileText,
  ChevronLeft, ChevronRight, ChevronDown, Check,
  Crown, Zap, X, Trash2, Bell, Search, Save,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────
interface LiveSession {
  id: string;
  title: string;
  status: "scheduled" | "live" | "ended" | "draft";
  scheduledAt: string;
  duration?: number;
  attendees?: number;
  peakAttendees?: number;
  savedToEvergreen?: boolean;
}

function formatDuration(s: number): string {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(i); }, []);
  return now;
}

const DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const MOCK_SESSIONS: LiveSession[] = [
  { id:"1", title:"How to Book 50 Sales Appointments Per Month",  status:"live",      scheduledAt:"Today, 2:00 PM CDT", attendees:312, peakAttendees:312 },
  { id:"2", title:"The AI Receptionist System — Live Demo",        status:"scheduled", scheduledAt:"Tomorrow, 11:00 AM CDT" },
  { id:"3", title:"Real Estate Lead Machine Masterclass",          status:"ended",     scheduledAt:"Mar 25, 2026", duration:5832, attendees:847,  peakAttendees:1203, savedToEvergreen:true },
  { id:"4", title:"Coaches Q&A: Scale to $10k/Month",             status:"ended",     scheduledAt:"Mar 20, 2026", duration:3600, attendees:234,  peakAttendees:412,  savedToEvergreen:false },
];

// ── New Meeting Modal ──────────────────────────────────────────────
function NewMeetingModal({ onClose, onStart }: { onClose:()=>void; onStart:(title:string)=>void }) {
  const [title,setTitle]=useState("");
  const [date,setDate]=useState("");
  const [time,setTime]=useState("");
  const [mode,setMode]=useState<"now"|"schedule">("now");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-[#1e1e2e] border border-white/10 rounded-2xl shadow-2xl p-7 max-w-md w-full">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-white">New Live Webinar</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X className="w-5 h-5"/></button>
        </div>
        <div className="flex gap-2 mb-5">
          {(["now","schedule"] as const).map(m=>(
            <button key={m} onClick={()=>setMode(m)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${mode===m?"bg-blue-600 text-white":"bg-white/5 text-white/50 hover:bg-white/10"}`}>
              {m==="now"?"Start now":"Schedule"}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/40 mb-1 block">Webinar title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. How to Scale to $10k/Month"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500"/>
          </div>
          {mode==="schedule"&&(
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-white/40 mb-1 block">Date</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"/></div>
              <div><label className="text-xs text-white/40 mb-1 block">Time</label><input type="time" value={time} onChange={e=>setTime(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"/></div>
            </div>
          )}
          <div className="flex items-center justify-between pt-1 text-sm">
            <span className="text-white/40">Max attendees</span>
            <span className="font-semibold text-white">1,000 <span className="text-white/30 font-normal">(Starter)</span></span>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 border border-white/10 text-white/50 hover:bg-white/5 rounded-xl text-sm transition-colors">Cancel</button>
          <button onClick={()=>{onStart(title||"New Live Webinar");onClose();}} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors">
            {mode==="now"?"Start Webinar":"Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Upgrade Modal ──────────────────────────────────────────────────
function UpgradeModal({ onClose }: { onClose:()=>void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-[#1e1e2e] border border-white/10 rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2"><Crown className="w-5 h-5 text-yellow-400"/><h3 className="text-xl font-bold text-white">Choose Your Plan</h3></div>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X className="w-5 h-5"/></button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {name:"Starter",price:"$97",unit:"/mo",attendees:"1,000",current:true,color:"border-blue-500/40 bg-blue-500/8",features:["1,000 live attendees","Unlimited sessions","Chat & Q&A","Polls & reactions","Recording & replay","Basic analytics"]},
            {name:"Pro",price:"$297",unit:"/mo",attendees:"10,000",popular:true,color:"border-purple-500/40 bg-purple-500/8",features:["10,000 live attendees","Everything in Starter","HD video streaming","Advanced analytics","Custom branding","Priority support","AI chat simulator","Automated sequences"]},
            {name:"Enterprise",price:"Custom",unit:"",attendees:"1,000,000+",color:"border-yellow-500/20 bg-yellow-500/5",features:["Unlimited attendees","Everything in Pro","Dedicated infrastructure","SLA guarantee","White-label option","Dedicated account manager","Custom integrations","On-premise option"]},
          ].map(plan=>(
            <div key={plan.name} className={`relative p-5 rounded-2xl border-2 ${plan.color}`}>
              {plan.popular&&<div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 rounded-full text-[10px] font-bold text-white">MOST POPULAR</div>}
              {plan.current&&<div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 rounded-full text-[10px] font-bold text-white">CURRENT PLAN</div>}
              <p className="font-bold text-white mb-1">{plan.name}</p>
              <p className="text-2xl font-bold text-white mb-0.5">{plan.price}<span className="text-sm font-normal text-white/30">{plan.unit}</span></p>
              <p className="text-xs text-white/30 mb-4">Up to {plan.attendees} attendees</p>
              <div className="space-y-1.5 mb-4">{plan.features.map(f=>(<div key={f} className="flex items-center gap-2"><Check className="w-3 h-3 text-green-400 shrink-0"/><span className="text-xs text-white/60">{f}</span></div>))}</div>
              {!plan.current&&<button className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors ${plan.popular?"bg-purple-600 hover:bg-purple-700 text-white":plan.name==="Enterprise"?"border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10":"bg-blue-600 hover:bg-blue-700 text-white"}`}>{plan.name==="Enterprise"?"Contact Sales":"Upgrade Now →"}</button>}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-white/25">All plans include 14-day free trial · Cancel anytime · Invoice billing available for Pro & Enterprise</p>
      </div>
    </div>
  );
}

// ── Mini Calendar ──────────────────────────────────────────────────
function MiniCalendar({ currentDate, onDateClick }: { currentDate:Date; onDateClick:(d:Date)=>void }) {
  const [viewDate,setViewDate]=useState(new Date(currentDate.getFullYear(),currentDate.getMonth(),1));
  const year=viewDate.getFullYear(), month=viewDate.getMonth();
  const firstDay=new Date(year,month,1).getDay();
  const daysInMonth=new Date(year,month+1,0).getDate();
  const today=new Date();
  const cells=[...Array(firstDay).fill(null),...Array.from({length:daysInMonth},(_,i)=>i+1)];

  return (
    <div>
      {/* Month header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-semibold text-white/70">{MONTHS[month]} {year}</span>
        <div className="flex gap-1">
          <button onClick={()=>setViewDate(new Date(year,month-1,1))} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/8 transition-colors"><ChevronLeft className="w-3.5 h-3.5 text-white/40"/></button>
          <button onClick={()=>setViewDate(new Date(year,month+1,1))} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/8 transition-colors"><ChevronRight className="w-3.5 h-3.5 text-white/40"/></button>
        </div>
      </div>
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {["S","M","T","W","T","F","S"].map((d,i)=><div key={i} className="text-center text-[10px] text-white/25 font-medium py-1">{d}</div>)}
      </div>
      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day,i)=>{
          if(!day) return <div key={i}/>;
          const isToday=day===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();
          const isSelected=day===currentDate.getDate()&&month===currentDate.getMonth()&&year===currentDate.getFullYear();
          return (
            <button key={i} onClick={()=>onDateClick(new Date(year,month,day))}
              className={`w-7 h-7 rounded-full text-[11px] flex items-center justify-center mx-auto transition-colors font-medium ${
                isSelected?"bg-blue-600 text-white":
                isToday?"bg-blue-500/20 text-blue-400":
                "text-white/50 hover:bg-white/8"
              }`}>{day}</button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
export default function LiveDashboardPage() {
  const now=useNow();
  const [sessions,setSessions]=useState<LiveSession[]>(MOCK_SESSIONS);
  const [showNewMeeting,setShowNewMeeting]=useState(false);
  const [showDropdown,setShowDropdown]=useState(false);
  const [showUpgrade,setShowUpgrade]=useState(false);
  const [selectedDate,setSelectedDate]=useState(new Date());

  const timeStr=now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  const dateStr=`${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
  const calLabel=`Today, ${MONTHS_SHORT[selectedDate.getMonth()]} ${selectedDate.getDate()}`;

  const liveSessions   = sessions.filter(s=>s.status==="live");
  const upcoming       = sessions.filter(s=>s.status==="scheduled");
  const past           = sessions.filter(s=>s.status==="ended");

  const handleStart=(title:string)=>{
    setSessions(p=>[{id:Date.now().toString(),title,status:"live",scheduledAt:"Now",attendees:0,peakAttendees:0},...p]);
  };

  return (
    // ── Warm dark background — distinct from Zoom's white, distinct from full dark ──
    <div className="min-h-screen flex flex-col" style={{background:"#13131f"}}>

      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-white/5" style={{background:"#13131f"}}>
        <div className="flex-1 max-w-sm">
          <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/25 border border-white/8 bg-white/3">
            <Search className="w-4 h-4"/>
            <span>Search (Ctrl+E)</span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button onClick={()=>setShowUpgrade(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-purple-900/30">
            <Crown className="w-4 h-4"/> Upgrade to Pro
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors border border-white/5">
            <Bell className="w-4 h-4 text-white/40"/>
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main content */}
        <div className="flex-1 flex flex-col items-center pt-16 pb-10 px-8 overflow-y-auto">

          {/* Action button grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">

            {/* New meeting — orange */}
            <div className="relative">
              <div className="flex flex-col items-center gap-2.5 cursor-pointer group" onClick={()=>setShowNewMeeting(true)}>
                <div className="w-[88px] h-[88px] rounded-[22px] flex items-center justify-center shadow-xl transition-all group-hover:-translate-y-1 group-hover:shadow-2xl"
                  style={{background:"linear-gradient(145deg,#ff6b35,#e8420a)",boxShadow:"0 8px 32px rgba(232,66,10,0.35)"}}>
                  <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10"><path d="M15 10l4.553-2.277A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-white/80">New meeting</span>
                  <button onClick={e=>{e.stopPropagation();setShowDropdown(d=>!d);}} className="p-0.5 rounded hover:bg-white/10 transition-colors">
                    <ChevronDown className="w-3.5 h-3.5 text-white/40"/>
                  </button>
                </div>
              </div>
              {showDropdown&&(
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-[#1e1e2e] border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden">
                  <Link href="/dashboard/live/new">
                    <button className="w-full text-left px-4 py-3 text-sm text-white/70 hover:bg-white/5 border-b border-white/5">
                      <p className="font-medium text-white/90">Start with video</p>
                      <p className="text-xs text-white/30">Camera & mic on</p>
                    </button>
                  </Link>
                  <Link href="/dashboard/live/new">
                    <button className="w-full text-left px-4 py-3 text-sm text-white/70 hover:bg-white/5">
                      <p className="font-medium text-white/90">Start without video</p>
                      <p className="text-xs text-white/30">Audio only</p>
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Join — blue */}
            <div className="flex flex-col items-center gap-2.5 cursor-pointer group">
              <div className="w-[88px] h-[88px] rounded-[22px] flex items-center justify-center shadow-xl transition-all group-hover:-translate-y-1 group-hover:shadow-2xl"
                style={{background:"linear-gradient(145deg,#3b82f6,#1d4ed8)",boxShadow:"0 8px 32px rgba(59,130,246,0.30)"}}>
                <Plus className="w-10 h-10 text-white"/>
              </div>
              <span className="text-sm font-medium text-white/80">Join</span>
            </div>

            {/* Schedule — blue */}
            <div className="flex flex-col items-center gap-2.5 cursor-pointer group" onClick={()=>setShowNewMeeting(true)}>
              <div className="w-[88px] h-[88px] rounded-[22px] flex items-center justify-center shadow-xl transition-all group-hover:-translate-y-1 group-hover:shadow-2xl relative"
                style={{background:"linear-gradient(145deg,#3b82f6,#1d4ed8)",boxShadow:"0 8px 32px rgba(59,130,246,0.30)"}}>
                <Calendar className="w-10 h-10 text-white"/>
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white leading-none">{now.getDate()}</span>
              </div>
              <span className="text-sm font-medium text-white/80">Schedule</span>
            </div>

            {/* Share screen — blue */}
            <div className="flex flex-col items-center gap-2.5 cursor-pointer group">
              <div className="w-[88px] h-[88px] rounded-[22px] flex items-center justify-center shadow-xl transition-all group-hover:-translate-y-1 group-hover:shadow-2xl"
                style={{background:"linear-gradient(145deg,#3b82f6,#1d4ed8)",boxShadow:"0 8px 32px rgba(59,130,246,0.30)"}}>
                <MonitorUp className="w-10 h-10 text-white"/>
              </div>
              <span className="text-sm font-medium text-white/80">Share screen</span>
            </div>
          </div>

          {/* My notes — centered */}
          <div className="flex flex-col items-center gap-2.5 cursor-pointer group mb-12">
            <div className="w-[88px] h-[88px] rounded-[22px] flex items-center justify-center shadow-xl transition-all group-hover:-translate-y-1 group-hover:shadow-2xl"
              style={{background:"linear-gradient(145deg,#3b82f6,#1d4ed8)",boxShadow:"0 8px 32px rgba(59,130,246,0.30)"}}>
              <FileText className="w-10 h-10 text-white"/>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/80">My notes</span>
              <span className="text-[9px] font-bold text-blue-400 bg-blue-500/15 border border-blue-500/25 px-1.5 py-0.5 rounded-full tracking-wide">NEW</span>
            </div>
          </div>

          {/* Sessions list */}
          <div className="w-full max-w-xl">
            {liveSessions.length>0&&(
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Live Now</p>
                </div>
                {liveSessions.map(s=>(
                  <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl mb-2 border border-red-500/20" style={{background:"rgba(239,68,68,0.06)"}}>
                    <div><p className="text-sm font-semibold text-white truncate max-w-xs">{s.title}</p><p className="text-xs text-red-400 mt-0.5">{s.attendees?.toLocaleString()} watching</p></div>
                    <Link href={`/dashboard/live/${s.id}`}>
                      <button className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg shadow-red-900/30">
                        <Radio className="w-3 h-3"/> Join Room
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {upcoming.length>0&&(
              <div className="mb-5">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Upcoming</p>
                {upcoming.map(s=>(
                  <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl mb-2 border border-white/6 bg-white/3 hover:bg-white/5 transition-colors">
                    <div><p className="text-sm font-semibold text-white/90 truncate max-w-xs">{s.title}</p><p className="text-xs text-white/30 mt-0.5">{s.scheduledAt}</p></div>
                    <Link href={`/dashboard/live/${s.id}`}>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors">Start Early</button>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {past.length>0&&(
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Past Sessions</p>
                {past.map(s=>(
                  <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl mb-2 border border-white/6 bg-white/3 hover:bg-white/5 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-white/90 truncate max-w-xs">{s.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-white/30">{s.scheduledAt}</p>
                        {s.duration&&<span className="text-xs text-white/20">· {formatDuration(s.duration)}</span>}
                        {s.attendees&&<span className="text-xs text-white/20">· {s.attendees.toLocaleString()} attended</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.savedToEvergreen?(
                        <div className="flex items-center gap-1 text-xs text-green-400 font-medium"><Check className="w-3 h-3"/>Evergreen</div>
                      ):(
                        <button onClick={()=>setSessions(p=>p.map(x=>x.id===s.id?{...x,savedToEvergreen:true}:x))}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-colors">
                          <Save className="w-3 h-3"/> Save to Evergreen
                        </button>
                      )}
                      <button onClick={()=>setSessions(p=>p.filter(x=>x.id!==s.id))} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-white/20 hover:text-red-400"/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right panel — calendar */}
        <div className="w-72 border-l border-white/5 flex flex-col flex-shrink-0" style={{background:"#16162a"}}>

          {/* Clock card — deep purple-green gradient, distinct from Zoom */}
          <div className="m-4 rounded-2xl overflow-hidden relative" style={{minHeight:110,background:"linear-gradient(135deg,#1a2744 0%,#0f1f3a 60%,#0a1628 100%)"}}>
            {/* Decorative accent shapes */}
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{background:"linear-gradient(180deg,#6366f1,#3b82f6)"}}/>
            <div className="absolute right-5 top-3 w-12 h-12 rounded-full opacity-10" style={{background:"radial-gradient(circle,#6366f1,transparent)"}}/>
            <div className="absolute right-8 bottom-2 w-8 h-8 rounded-full opacity-8" style={{background:"radial-gradient(circle,#3b82f6,transparent)"}}/>
            <div className="relative z-10 p-5 text-right">
              <button className="absolute top-3 right-3 text-white/20 hover:text-white/50 transition-colors">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
              </button>
              <p className="text-[28px] font-bold text-white tracking-tight mt-1">{timeStr}</p>
              <p className="text-xs text-white/40 mt-0.5 font-medium">{dateStr}</p>
            </div>
          </div>

          {/* Calendar section */}
          <div className="flex-1 px-4 pb-4 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <button className="w-6 h-6 flex items-center justify-center rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors text-lg leading-none font-light">+</button>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-white/70">{calLabel}</span>
                <ChevronDown className="w-3 h-3 text-white/30"/>
              </div>
              <div className="w-6"/>
            </div>

            {/* Today / nav */}
            <div className="flex items-center gap-1.5 mb-4">
              <button onClick={()=>setSelectedDate(new Date())}
                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-white/10 rounded-lg text-xs text-white/50 hover:bg-white/5 transition-colors">
                <Calendar className="w-3 h-3"/> Today
              </button>
              <button onClick={()=>{const d=new Date(selectedDate);d.setDate(d.getDate()-1);setSelectedDate(d);}} className="w-7 h-7 flex items-center justify-center border border-white/10 rounded-lg hover:bg-white/5 transition-colors"><ChevronLeft className="w-3.5 h-3.5 text-white/40"/></button>
              <button onClick={()=>{const d=new Date(selectedDate);d.setDate(d.getDate()+1);setSelectedDate(d);}} className="w-7 h-7 flex items-center justify-center border border-white/10 rounded-lg hover:bg-white/5 transition-colors"><ChevronRight className="w-3.5 h-3.5 text-white/40"/></button>
              <button className="ml-auto">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-white/20"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
              </button>
            </div>

            {/* Mini calendar */}
            <div className="mb-4">
              <MiniCalendar currentDate={selectedDate} onDateClick={setSelectedDate}/>
            </div>

            {/* Empty state */}
            <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/2 py-8 px-4">
              {/* Subtle icon */}
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5 text-white/20"/>
              </div>
              <p className="text-xs text-white/30 font-medium mb-1">No meetings scheduled.</p>
              <button onClick={()=>setShowNewMeeting(true)} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                <span className="text-sm leading-none">+</span> Schedule a meeting
              </button>
            </div>

            {/* Open recordings */}
            <button className="flex items-center justify-between mt-3 py-2 px-1 text-xs text-white/30 hover:text-white/60 transition-colors">
              <span>Open recordings</span>
              <ChevronRight className="w-3.5 h-3.5"/>
            </button>
          </div>
        </div>
      </div>

      {showNewMeeting&&<NewMeetingModal onClose={()=>setShowNewMeeting(false)} onStart={handleStart}/>}
      {showUpgrade&&<UpgradeModal onClose={()=>setShowUpgrade(false)}/>}
    </div>
  );
}
