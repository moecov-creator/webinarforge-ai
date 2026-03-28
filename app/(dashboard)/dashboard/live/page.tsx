// app/(dashboard)/dashboard/live/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Radio, Plus, Calendar, Users, Clock, Play, Settings2,
  Crown, Zap, Check, ChevronRight, BarChart2, Video,
  Globe, Lock, Copy, ExternalLink, Trash2, Edit3,
} from "lucide-react";

interface LiveSession {
  id: string;
  title: string;
  status: "scheduled" | "live" | "ended" | "draft";
  scheduledAt: string;
  duration?: number;
  attendees?: number;
  peakAttendees?: number;
  recordingUrl?: string;
  savedToEvergreen?: boolean;
}

const MOCK_SESSIONS: LiveSession[] = [
  { id: "1", title: "How to Book 50 Sales Appointments Per Month", status: "live", scheduledAt: "Today, 2:00 PM CDT", attendees: 312, peakAttendees: 312 },
  { id: "2", title: "The AI Receptionist System — Live Demo", status: "scheduled", scheduledAt: "Tomorrow, 11:00 AM CDT" },
  { id: "3", title: "Real Estate Lead Machine Masterclass", status: "ended", scheduledAt: "Mar 25, 2026", duration: 5832, attendees: 847, peakAttendees: 1203, recordingUrl: "#", savedToEvergreen: true },
  { id: "4", title: "Coaches Q&A: Scale to $10k/Month", status: "ended", scheduledAt: "Mar 20, 2026", duration: 3600, attendees: 234, peakAttendees: 412, recordingUrl: "#", savedToEvergreen: false },
  { id: "5", title: "SaaS Growth Secrets — Untitled Draft", status: "draft", scheduledAt: "Not scheduled" },
];

function formatDuration(s: number): string {
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function StatusBadge({ status }: { status: LiveSession["status"] }) {
  const styles = {
    live:      "bg-red-500/20 text-red-400 border-red-500/30",
    scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    ended:     "bg-white/5 text-white/30 border-white/10",
    draft:     "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };
  const labels = { live: "● LIVE", scheduled: "Scheduled", ended: "Ended", draft: "Draft" };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function LiveDashboardPage() {
  const [sessions, setSessions] = useState<LiveSession[]>(MOCK_SESSIONS);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [plan] = useState<"starter"|"pro"|"enterprise">("starter");

  const planLimits = {
    starter:    { attendees: 1000,    price: 97,   label: "Starter" },
    pro:        { attendees: 10000,   price: 297,  label: "Pro" },
    enterprise: { attendees: 1000000, price: null, label: "Enterprise" },
  };

  const currentPlan = planLimits[plan];
  const liveSessions = sessions.filter(s => s.status === "live");
  const upcomingSessions = sessions.filter(s => s.status === "scheduled");
  const pastSessions = sessions.filter(s => s.status === "ended");

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const newSession: LiveSession = {
      id: Date.now().toString(),
      title: newTitle,
      status: newDate ? "scheduled" : "draft",
      scheduledAt: newDate && newTime ? `${newDate} at ${newTime}` : "Not scheduled",
    };
    setSessions(p => [newSession, ...p]);
    setNewTitle(""); setNewDate(""); setNewTime("");
    setShowNewModal(false);
  };

  return (
    <div className="p-8 max-w-6xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Live Webinars</h1>
          <p className="text-white/40 text-sm mt-1">Go live with up to {currentPlan.attendees.toLocaleString()} attendees · {currentPlan.label} plan</p>
        </div>
        <div className="flex items-center gap-3">
          {plan !== "enterprise" && (
            <button onClick={() => setShowUpgrade(true)}
              className="flex items-center gap-2 px-4 py-2 border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/15 rounded-xl text-sm font-medium transition-colors">
              <Crown className="w-4 h-4"/>
              {plan === "starter" ? "Upgrade to Pro — 10k attendees" : "Upgrade to Enterprise — 1M+"}
            </button>
          )}
          <button onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-red-900/30">
            <Plus className="w-4 h-4"/> New Live Webinar
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Live Sessions", value: sessions.filter(s=>s.status!=="draft").length, icon: Radio, color: "text-red-400" },
          { label: "Total Attendees", value: sessions.reduce((s,r)=>(r.attendees||0)+s,0).toLocaleString(), icon: Users, color: "text-blue-400" },
          { label: "Peak Viewers", value: Math.max(...sessions.map(s=>s.peakAttendees||0)).toLocaleString(), icon: BarChart2, color: "text-purple-400" },
          { label: "Saved to Evergreen", value: sessions.filter(s=>s.savedToEvergreen).length, icon: Video, color: "text-green-400" },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-xl bg-white/3 border border-white/8">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className={`w-4 h-4 ${stat.color}`}/>
              <p className="text-xs text-white/30">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Live now */}
      {liveSessions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">🔴 Live Now</h2>
          {liveSessions.map(session => (
            <div key={session.id} className="p-5 rounded-xl bg-red-500/8 border border-red-500/20 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
                  <span className="text-xs font-bold text-red-400">LIVE</span>
                  <span className="text-xs text-white/30">· {session.attendees?.toLocaleString()} watching</span>
                </div>
                <h3 className="font-semibold text-white">{session.title}</h3>
              </div>
              <Link href={`/dashboard/live/${session.id}`}>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors">
                  <Radio className="w-4 h-4"/> Join Room
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming */}
      {upcomingSessions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">Upcoming</h2>
          <div className="space-y-3">
            {upcomingSessions.map(session => (
              <div key={session.id} className="p-4 rounded-xl bg-white/3 border border-white/8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-400"/>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{session.title}</h3>
                    <p className="text-xs text-white/30 mt-0.5">{session.scheduledAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={session.status}/>
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Edit3 className="w-3.5 h-3.5 text-white/30"/></button>
                  <button className="flex items-center gap-1.5 px-3 py-2 border border-white/10 hover:bg-white/5 text-white/50 hover:text-white rounded-lg text-xs transition-colors">
                    <Copy className="w-3 h-3"/> Copy link
                  </button>
                  <Link href={`/dashboard/live/${session.id}`}>
                    <button className="flex items-center gap-1.5 px-3 py-2 bg-white/8 hover:bg-white/12 text-white rounded-lg text-xs font-medium transition-colors">
                      <Play className="w-3 h-3"/> Start Early
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past sessions */}
      {pastSessions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">Past Sessions</h2>
          <div className="space-y-3">
            {pastSessions.map(session => (
              <div key={session.id} className="p-4 rounded-xl bg-white/3 border border-white/8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
                    <Video className="w-4 h-4 text-white/30"/>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{session.title}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-white/30">{session.scheduledAt}</span>
                      {session.duration && <span className="text-xs text-white/20">· {formatDuration(session.duration)}</span>}
                      {session.attendees && <span className="text-xs text-white/20">· {session.attendees.toLocaleString()} attended</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {session.savedToEvergreen ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <Check className="w-3 h-3 text-green-400"/>
                      <span className="text-xs text-green-400 font-medium">In Evergreen</span>
                    </div>
                  ) : (
                    <button onClick={() => setSessions(p => p.map(s => s.id===session.id ? {...s,savedToEvergreen:true} : s))}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors">
                      <Video className="w-3 h-3"/> Save to Evergreen
                    </button>
                  )}
                  {session.recordingUrl && (
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:bg-white/5 text-white/50 hover:text-white rounded-lg text-xs transition-colors">
                      <ExternalLink className="w-3 h-3"/> Recording
                    </button>
                  )}
                  <button onClick={() => setSessions(p => p.filter(s => s.id!==session.id))} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-white/20 hover:text-red-400"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New session modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">New Live Webinar</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Webinar Title</label>
                <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="e.g. How to Scale to $10k/Month" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Date (optional)</label>
                  <input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"/>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Time (optional)</label>
                  <input type="time" value={newTime} onChange={e=>setNewTime(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"/>
                </div>
              </div>
              <div className="p-3 bg-white/3 border border-white/8 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-white/30"/>
                  <span className="text-sm text-white/60">Max attendees</span>
                </div>
                <span className="text-sm font-semibold text-white">{currentPlan.attendees.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowNewModal(false)} className="flex-1 py-3 border border-white/15 hover:bg-white/5 text-white/60 rounded-xl text-sm transition-colors">Cancel</button>
              <button onClick={handleCreate} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors">Create Webinar</button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Choose Your Plan</h3>
              <button onClick={() => setShowUpgrade(false)} className="text-white/30 hover:text-white text-2xl leading-none">×</button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Starter */}
              <div className={`p-5 rounded-xl border ${plan==="starter"?"border-blue-500/40 bg-blue-500/8":"border-white/8 bg-white/3"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Radio className="w-4 h-4 text-blue-400"/>
                  <span className="font-semibold text-white">Starter</span>
                  {plan==="starter"&&<span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">Current</span>}
                </div>
                <p className="text-2xl font-bold text-white mb-1">$97<span className="text-sm text-white/30 font-normal">/mo</span></p>
                <p className="text-xs text-white/40 mb-4">Up to 1,000 attendees</p>
                <div className="space-y-1.5">
                  {["1,000 live attendees","Unlimited sessions","Chat & Q&A","Polls & reactions","Recording & replay","Basic analytics"].map(f=>(
                    <div key={f} className="flex items-center gap-2"><Check className="w-3 h-3 text-green-400 shrink-0"/><span className="text-xs text-white/50">{f}</span></div>
                  ))}
                </div>
              </div>

              {/* Pro */}
              <div className="p-5 rounded-xl border border-purple-500/40 bg-purple-500/8 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 rounded-full text-[10px] font-bold text-white">MOST POPULAR</div>
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-4 h-4 text-purple-400"/>
                  <span className="font-semibold text-white">Pro</span>
                </div>
                <p className="text-2xl font-bold text-white mb-1">$297<span className="text-sm text-white/30 font-normal">/mo</span></p>
                <p className="text-xs text-white/40 mb-4">Up to 10,000 attendees</p>
                <div className="space-y-1.5">
                  {["10,000 live attendees","Everything in Starter","HD video streaming","Advanced analytics","Custom branding","Priority support","AI chat simulator","Automated sequences"].map(f=>(
                    <div key={f} className="flex items-center gap-2"><Check className="w-3 h-3 text-green-400 shrink-0"/><span className="text-xs text-white/50">{f}</span></div>
                  ))}
                </div>
                <button onClick={() => { setShowUpgrade(false); window.location.href="/dashboard/billing"; }}
                  className="w-full mt-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors">
                  Upgrade Now →
                </button>
              </div>

              {/* Enterprise */}
              <div className="p-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-yellow-400"/>
                  <span className="font-semibold text-white">Enterprise</span>
                </div>
                <p className="text-2xl font-bold text-white mb-1">Custom</p>
                <p className="text-xs text-white/40 mb-4">1,000,000+ attendees</p>
                <div className="space-y-1.5">
                  {["Unlimited attendees","Everything in Pro","Dedicated infrastructure","SLA guarantee","White-label option","Dedicated account manager","Custom integrations","On-premise option"].map(f=>(
                    <div key={f} className="flex items-center gap-2"><Check className="w-3 h-3 text-green-400 shrink-0"/><span className="text-xs text-white/50">{f}</span></div>
                  ))}
                </div>
                <button onClick={() => window.open("mailto:sales@webinarforge.ai?subject=Enterprise Plan", "_blank")}
                  className="w-full mt-4 py-2.5 border border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-400 text-sm font-medium rounded-xl transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-white/20">All plans include 14-day free trial · Cancel anytime · Invoice billing available for Pro & Enterprise</p>
          </div>
        </div>
      )}
    </div>
  );
}
