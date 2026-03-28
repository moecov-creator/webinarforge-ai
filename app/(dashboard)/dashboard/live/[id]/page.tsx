// app/(dashboard)/dashboard/live/[id]/page.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Mic, MicOff, Video, VideoOff, MonitorUp, Users, MessageSquare, Hand, BarChart2, Settings, Radio, StopCircle, Save, Share2, Clock, Send, X, Check, Crown, Zap, ChevronRight, FileText, Captions, AppWindow } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────
interface LiveMessage { id:string; name:string; message:string; time:string; type:"chat"|"question"|"reaction"|"system"; }
interface Attendee { id:string; name:string; location:string; handRaised:boolean; muted:boolean; videoOff:boolean; }
interface Poll { id:string; question:string; options:{text:string;votes:number}[]; active:boolean; }
type PanelType = "chat"|"questions"|"attendees"|"polls"|"share"|"participants"|"hosttools"|"captions"|"docs"|"apps"|null;

// ── Data ─────────────────────────────────────────────────────────
const NAMES=["Jason C.","Sarah M.","Michael T.","Jennifer K.","Marcus W.","Priya R.","David L.","Amanda B.","Carlos G.","Nicole P.","Tyler H.","Melissa J.","Brandon S.","Ashley F.","Evan N.","Tiffany D.","Nathan R.","Lauren C.","Kevin M.","Monica A.","Andre T.","Jasmine W.","Steven B.","Crystal L.","Trevor K.","Keisha M.","Dylan H.","Patricia S.","Justin E.","Camille V."];
const LOCS=["New York, NY","Los Angeles, CA","Chicago, IL","Dallas, TX","Atlanta, GA","London, UK","Miami, FL","Seattle, WA","Austin, TX","Paris, France","Boston, MA","Toronto, Canada","Denver, CO","Berlin, Germany","Nashville, TN"];
const MSGS=["🔥🔥🔥 This is incredible!","Mind blown 🤯","Taking notes right now!","This is exactly what I needed","WOW — game changer","Gold right here 💰","Can you repeat that last point?","Love this! Keep going!","1 ✅ makes total sense","Sharing this with my team","Best webinar I've attended all year!","How do I get started?","Does this work for e-commerce?","This is pure value 💎","My business needed this yesterday","🙌🙌🙌","Screenshot worthy content!","💯 percent agree","Just joined — so glad I made it","This is why I signed up!"];

function makePeople(n:number):Attendee[]{return Array.from({length:Math.min(n,30)},(_,i)=>({id:String(i),name:NAMES[i%NAMES.length],location:LOCS[i%LOCS.length],handRaised:Math.random()<0.06,muted:Math.random()<0.7,videoOff:Math.random()<0.4}));}
function fmtDur(s:number):string{const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;return h>0?`${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`:`${m}:${String(sec).padStart(2,"0")}`;}

// ── Sub-components ────────────────────────────────────────────────
function ZToggle({value,onChange}:{value:boolean;onChange:(v:boolean)=>void}){return(<button onClick={()=>onChange(!value)} className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${value?"bg-blue-500":"bg-white/15"}`}><div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value?"translate-x-5":""}`}/></button>);}
function ZSelect({value,options,onChange}:{value:string;options:string[];onChange:(v:string)=>void}){return(<select value={value} onChange={e=>onChange(e.target.value)} className="w-full bg-[#1a1a2e] border border-white/15 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer">{options.map(o=><option key={o} value={o}>{o}</option>)}</select>);}

// ── Main ─────────────────────────────────────────────────────────
export default function LiveWebinarHostPage() {
  const params=useParams(); const router=useRouter();
  const [isLive,setIsLive]=useState(false);
  const [micOn,setMicOn]=useState(true);
  const [camOn,setCamOn]=useState(true);
  const [screenSharing,setScreenSharing]=useState(false);
  const [duration,setDuration]=useState(0);
  const [attendeeCount,setAttendeeCount]=useState(0);
  const [peakAttendees,setPeakAttendees]=useState(0);
  const [attendees,setAttendees]=useState<Attendee[]>([]);
  const [messages,setMessages]=useState<LiveMessage[]>([]);
  const [polls,setPolls]=useState<Poll[]>([
    {id:"1",question:"How long have you been in business?",options:[{text:"< 1 year",votes:0},{text:"1–3 years",votes:0},{text:"3–5 years",votes:0},{text:"5+ years",votes:0}],active:false},
    {id:"2",question:"What's your biggest challenge?",options:[{text:"Getting leads",votes:0},{text:"Closing sales",votes:0},{text:"Scaling systems",votes:0},{text:"Team building",votes:0}],active:false},
  ]);
  const [newMsg,setNewMsg]=useState("");
  const [newPollQ,setNewPollQ]=useState("");
  const [showNewPoll,setShowNewPoll]=useState(false);
  const [isSaving,setIsSaving]=useState(false);
  const [savedEvergreen,setSavedEvergreen]=useState(false);
  const [showEndModal,setShowEndModal]=useState(false);
  const [showUpgrade,setShowUpgrade]=useState(false);
  const [activePanel,setActivePanel]=useState<PanelType>(null);
  // Share settings
  const [shareCount,setShareCount]=useState("One participant can share at a time");
  const [whoShare,setWhoShare]=useState("Host only");
  const [whoShareWhile,setWhoShareWhile]=useState("Host only");
  // Participant settings
  const [allowChat,setAllowChat]=useState(true);
  const [allowRename,setAllowRename]=useState(true);
  const [allowUnmute,setAllowUnmute]=useState(true);
  const [allowVideo,setAllowVideo]=useState(true);
  const [allowRecord,setAllowRecord]=useState(false);
  const [allowReqRecord,setAllowReqRecord]=useState(true);
  const [allowCloudRec,setAllowCloudRec]=useState(true);
  const [allowTranscribe,setAllowTranscribe]=useState(true);
  // Host tools
  const [lockMeeting,setLockMeeting]=useState(false);
  const [waitingRoom,setWaitingRoom]=useState(true);
  const [hidePhotos,setHidePhotos]=useState(false);
  // Captions
  const [allowCaptions,setAllowCaptions]=useState(true);
  const [lockCaptionLang,setLockCaptionLang]=useState(false);
  // Docs
  const [allowDocs,setAllowDocs]=useState(true);
  const [whoShareDocs,setWhoShareDocs]=useState("Host only");
  const [whoCreateDoc,setWhoCreateDoc]=useState("All participants (exclude anonymous users)");
  // Apps
  const [shareRealtime,setShareRealtime]=useState(true);
  const [meetingTimers,setMeetingTimers]=useState(true);
  const [whoCollab,setWhoCollab]=useState("All participants");
  const [whoCollabWhile,setWhoCollabWhile]=useState("Host only");

  const chatEndRef=useRef<HTMLDivElement>(null);
  const timerRef=useRef<NodeJS.Timeout>();
  const chatRef=useRef<NodeJS.Timeout>();
  const attRef=useRef<NodeJS.Timeout>();
  const msgIdx=useRef(0);
  const questions=messages.filter(m=>m.type==="question");
  const handsUp=attendees.filter(a=>a.handRaised).length;

  useEffect(()=>{if(isLive){timerRef.current=setInterval(()=>setDuration(d=>d+1),1000);}else clearInterval(timerRef.current);return()=>clearInterval(timerRef.current);},[isLive]);
  useEffect(()=>{
    if(!isLive)return;
    setAttendees(makePeople(30));setAttendeeCount(47);
    attRef.current=setInterval(()=>{setAttendeeCount(p=>{const n=Math.max(20,Math.min(1000,p+Math.floor(Math.random()*8)-1));setPeakAttendees(pk=>Math.max(pk,n));return n;});},3000);
    return()=>clearInterval(attRef.current);
  },[isLive]);
  useEffect(()=>{
    if(!isLive)return;
    const fire=()=>{
      const name=NAMES[msgIdx.current%NAMES.length];
      const msg=MSGS[msgIdx.current%MSGS.length];
      setMessages(p=>[...p.slice(-100),{id:`${Date.now()}-${msgIdx.current}`,name,message:msg,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),type:Math.random()<0.15?"question":"chat"}]);
      msgIdx.current++;chatRef.current=setTimeout(fire,900+Math.random()*3200);
    };
    chatRef.current=setTimeout(fire,1500);return()=>clearTimeout(chatRef.current);
  },[isLive]);
  useEffect(()=>{if(!isLive)return;const i=setInterval(()=>{setPolls(p=>p.map(pl=>!pl.active?pl:{...pl,options:pl.options.map(o=>({...o,votes:o.votes+Math.floor(Math.random()*10)}))}));},1500);return()=>clearInterval(i);},[isLive]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  const goLive=()=>{setIsLive(true);setMessages([{id:"sys-1",name:"System",message:"🎉 You're live! Attendees can now join.",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),type:"system"}]);};
  const sendMsg=()=>{if(!newMsg.trim())return;setMessages(p=>[...p,{id:`h-${Date.now()}`,name:"You (Host)",message:newMsg,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),type:"chat"}]);setNewMsg("");};
  const saveEvergreen=async()=>{setIsSaving(true);await new Promise(r=>setTimeout(r,2000));setIsSaving(false);setSavedEvergreen(true);};
  const togglePanel=(p:PanelType)=>setActivePanel(prev=>prev===p?null:p);
  const totalVotes=(poll:Poll)=>poll.options.reduce((s,o)=>s+o.votes,0);

  const toolbar=[
    {icon:micOn?Mic:MicOff,label:micOn?"Mute":"Unmute",onClick:()=>setMicOn(m=>!m),danger:!micOn},
    {icon:camOn?Video:VideoOff,label:camOn?"Stop Video":"Start Video",onClick:()=>setCamOn(c=>!c),danger:!camOn},
    {icon:MonitorUp,label:screenSharing?"Stop Share":"Share Screen",onClick:()=>setScreenSharing(s=>!s),highlight:screenSharing},
    {icon:Share2,label:"Share",onClick:()=>togglePanel("share"),active:activePanel==="share"},
    {icon:Users,label:"Participants",onClick:()=>togglePanel("participants"),active:activePanel==="participants",badge:attendeeCount||undefined},
    {icon:Settings,label:"Host Tools",onClick:()=>togglePanel("hosttools"),active:activePanel==="hosttools"},
    {icon:Captions,label:"Captions",onClick:()=>togglePanel("captions"),active:activePanel==="captions"},
    {icon:FileText,label:"Docs",onClick:()=>togglePanel("docs"),active:activePanel==="docs"},
    {icon:AppWindow,label:"Apps",onClick:()=>togglePanel("apps"),active:activePanel==="apps"},
    {icon:MessageSquare,label:"Chat",onClick:()=>togglePanel("chat"),active:activePanel==="chat"},
    {icon:BarChart2,label:"Polls",onClick:()=>togglePanel("polls"),active:activePanel==="polls"},
  ];

  const settingsPanels=["share","participants","hosttools","captions","docs","apps"];
  const panelTitle:Record<string,string>={share:"Share",participants:"Participants",hosttools:"Host tools",captions:"Captions",docs:"Docs",apps:"Apps",chat:"Chat",questions:"Q&A",attendees:"People",polls:"Polls"};

  return (
    <div className="h-screen bg-[#0a0a14] flex flex-col overflow-hidden text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-black/40 flex-shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/live" className="text-white/30 hover:text-white text-sm">← Back</Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-white">Maurice Covington's Live Webinar</h1>
              {isLive&&<div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded-full"><div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/><span className="text-[10px] font-bold text-red-400">LIVE</span></div>}
            </div>
            {isLive&&<p className="text-xs text-white/30 mt-0.5">{fmtDur(duration)} · {attendeeCount.toLocaleString()} watching</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/20 text-xs font-semibold text-blue-400"><Crown className="w-3 h-3"/>Starter · 1,000 max</div>
          <button onClick={()=>setShowUpgrade(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors"><Zap className="w-3 h-3"/>Upgrade to Pro</button>
          {isLive&&(savedEvergreen?<div className="flex items-center gap-1.5 text-green-400 text-xs font-medium"><Check className="w-3.5 h-3.5"/>Saved to Evergreen</div>:<button onClick={saveEvergreen} disabled={isSaving} className="flex items-center gap-1.5 px-3 py-1.5 border border-white/15 hover:bg-white/5 text-white/60 hover:text-white text-xs font-medium rounded-lg disabled:opacity-50"><Save className="w-3.5 h-3.5"/>{isSaving?"Saving...":"Save to Evergreen"}</button>)}
          {isLive&&<button onClick={()=>setShowEndModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg"><StopCircle className="w-3.5 h-3.5"/>End Webinar</button>}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video */}
        <div className="flex-1 bg-[#0a0a14] relative">
          {isLive?(
            <>
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f0f1f] to-[#0a0a14]">
                {camOn?(<div className="text-center"><div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center mx-auto mb-4 shadow-2xl ring-4 ring-purple-500/20"><span className="text-4xl font-bold">MC</span></div><p className="text-white/30 text-sm">Maurice Covington</p><p className="text-white/15 text-xs mt-1">Host · Camera preview</p></div>):(<div className="text-center"><VideoOff className="w-12 h-12 text-white/20 mx-auto mb-2"/><p className="text-white/20 text-sm">Camera is off</p></div>)}
              </div>
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10"><Users className="w-3.5 h-3.5 text-white/50"/><span className="text-sm font-semibold">{attendeeCount.toLocaleString()}</span><span className="text-xs text-white/40">watching</span></div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10"><Clock className="w-3.5 h-3.5 text-white/50"/><span className="text-sm font-mono">{fmtDur(duration)}</span></div>
                {screenSharing&&<div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-500/30"><MonitorUp className="w-3.5 h-3.5 text-blue-400"/><span className="text-xs text-blue-400 font-medium">Sharing screen</span></div>}
              </div>
              {handsUp>0&&<div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 backdrop-blur-sm rounded-lg border border-yellow-500/30"><Hand className="w-3.5 h-3.5 text-yellow-400"/><span className="text-xs text-yellow-400 font-medium">{handsUp} hand{handsUp>1?"s":""} raised</span></div>}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {["🔥","👏","💯","❤️","🚀","😮","😂"].map(e=>(
                  <button key={e} onClick={()=>setMessages(p=>[...p,{id:`r-${Date.now()}`,name:"You",message:e,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),type:"reaction"}])} className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/10 flex items-center justify-center text-lg transition-all hover:scale-125">{e}</button>
                ))}
              </div>
            </>
          ):(
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6"><Radio className="w-8 h-8 text-white/30"/></div>
                <h2 className="text-2xl font-bold text-white mb-2">Ready to go live?</h2>
                <p className="text-white/40 text-sm mb-8 leading-relaxed">Check your camera and mic below, then click Go Live to start broadcasting.</p>
                <div className="flex items-center justify-center gap-3 mb-8">
                  <button onClick={()=>setMicOn(m=>!m)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all ${micOn?"border-green-500/30 bg-green-500/10 text-green-400":"border-red-500/30 bg-red-500/10 text-red-400"}`}>{micOn?<Mic className="w-4 h-4"/>:<MicOff className="w-4 h-4"/>}{micOn?"Mic On":"Mic Off"}</button>
                  <button onClick={()=>setCamOn(c=>!c)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all ${camOn?"border-green-500/30 bg-green-500/10 text-green-400":"border-red-500/30 bg-red-500/10 text-red-400"}`}>{camOn?<Video className="w-4 h-4"/>:<VideoOff className="w-4 h-4"/>}{camOn?"Camera On":"Camera Off"}</button>
                </div>
                <button onClick={goLive} className="flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-lg rounded-2xl mx-auto transition-all shadow-lg shadow-red-900/40 hover:-translate-y-0.5"><Radio className="w-5 h-5"/>Go Live Now</button>
                <p className="text-white/20 text-xs mt-4">Up to 1,000 attendees · Starter plan</p>
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        {activePanel&&(
          <div className="w-80 border-l border-white/8 bg-[#111120] flex flex-col flex-shrink-0">
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              {settingsPanels.includes(activePanel)?(
                <div className="flex items-center gap-2"><button onClick={()=>setActivePanel(null)} className="text-white/40 hover:text-white"><ChevronRight className="w-4 h-4 rotate-180"/></button><h3 className="text-sm font-semibold text-white">{panelTitle[activePanel!]}</h3></div>
              ):(
                <div className="flex border-b-0">
                  {(["chat","questions","attendees","polls"] as const).map(t=>(
                    <button key={t} onClick={()=>setActivePanel(t)} className={`px-3 py-1.5 text-xs font-medium transition-colors ${activePanel===t?"text-white border-b-2 border-blue-500":"text-white/30 hover:text-white/60"}`}>{panelTitle[t]}</button>
                  ))}
                </div>
              )}
              <button onClick={()=>setActivePanel(null)} className="text-white/30 hover:text-white"><X className="w-4 h-4"/></button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Share */}
              {activePanel==="share"&&(
                <div className="p-5 space-y-5">
                  <div><p className="text-xs text-white/50 mb-2">How many participants can share at the same time?</p><ZSelect value={shareCount} options={["One participant can share at a time","Multiple participants can share simultaneously"]} onChange={setShareCount}/></div>
                  <div><p className="text-xs text-white/50 mb-2">Who can share?</p><ZSelect value={whoShare} options={["Host only","All participants"]} onChange={setWhoShare}/></div>
                  <div><p className="text-xs text-white/50 mb-2">Who can share when someone else is sharing?</p><ZSelect value={whoShareWhile} options={["Host only","All participants"]} onChange={setWhoShareWhile}/></div>
                </div>
              )}
              {/* Participants */}
              {activePanel==="participants"&&(
                <div className="p-5">
                  <button className="text-sm text-red-400 hover:text-red-300 transition-colors mb-4 block">Suspend participant activities</button>
                  <p className="text-xs text-white/40 mb-3">Allow all participants to:</p>
                  {([["Chat",allowChat,setAllowChat],["Rename themselves",allowRename,setAllowRename],["Unmute themselves",allowUnmute,setAllowUnmute],["Start video",allowVideo,setAllowVideo],["Record to computer",allowRecord,setAllowRecord],["Request to record to computer",allowReqRecord,setAllowReqRecord],["Request host to start cloud recording",allowCloudRec,setAllowCloudRec],["Transcribe in My notes",allowTranscribe,setAllowTranscribe]] as [string,boolean,(v:boolean)=>void][]).map(([label,val,setter])=>(
                    <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"><span className="text-sm text-white/80 pr-4">{label}</span><ZToggle value={val} onChange={setter}/></div>
                  ))}
                </div>
              )}
              {/* Host tools */}
              {activePanel==="hosttools"&&(
                <div className="p-5">
                  {([["Lock meeting",lockMeeting,setLockMeeting],["Enable waiting room",waitingRoom,setWaitingRoom],["Hide profile pictures",hidePhotos,setHidePhotos]] as [string,boolean,(v:boolean)=>void][]).map(([label,val,setter])=>(
                    <div key={label} className="flex items-center justify-between py-3 border-b border-white/5"><span className="text-sm text-white/80">{label}</span><ZToggle value={val} onChange={setter}/></div>
                  ))}
                  <div className="pt-2">
                    {[["Participants","Manage participant permissions"],["Advanced","Advanced host controls"]].map(([label,sub])=>(
                      <div key={label} className="flex items-center justify-between py-3 border-b border-white/5 cursor-pointer hover:bg-white/3 px-1 rounded">
                        <div><p className="text-sm text-white/80">{label}</p><p className="text-xs text-white/30">{sub} →</p></div>
                        <ChevronRight className="w-4 h-4 text-white/20"/>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Captions */}
              {activePanel==="captions"&&(
                <div className="p-5 space-y-1">
                  <div className="flex items-start justify-between py-3 border-b border-white/5 gap-4"><div className="flex-1"><p className="text-sm text-white/80">Allow closed captioning for this meeting</p><p className="text-xs text-white/30 mt-1 leading-relaxed">When this setting is disabled, nobody can use closed captioning in the meeting</p></div><ZToggle value={allowCaptions} onChange={setAllowCaptions}/></div>
                  <div className="flex items-start justify-between py-3 gap-4"><div className="flex-1"><p className="text-sm text-white/80">Lock caption language for this meeting</p><p className="text-xs text-white/30 mt-1 leading-relaxed">When this setting is enabled, only the host can change the caption language in the meeting.</p></div><ZToggle value={lockCaptionLang} onChange={setLockCaptionLang}/></div>
                </div>
              )}
              {/* Docs */}
              {activePanel==="docs"&&(
                <div className="p-5 space-y-5">
                  <div className="flex items-start justify-between gap-4"><div className="flex-1"><p className="text-sm text-white/80">Allow participants to share docs</p><p className="text-xs text-white/30 mt-1 leading-relaxed">When enabled, all signed in participants (internal and external) can share docs during this meeting.</p></div><ZToggle value={allowDocs} onChange={setAllowDocs}/></div>
                  <div><p className="text-xs text-white/50 mb-2">Who can share when someone else is sharing?</p><ZSelect value={whoShareDocs} options={["Host only","All participants"]} onChange={setWhoShareDocs}/></div>
                  <div><p className="text-xs text-white/50 mb-1">Who can create a doc in this meeting?</p><p className="text-xs text-white/25 mb-2">All docs created in the meeting will belong to the host.</p><ZSelect value={whoCreateDoc} options={["All participants (exclude anonymous users)","Host only","No one"]} onChange={setWhoCreateDoc}/></div>
                </div>
              )}
              {/* Apps */}
              {activePanel==="apps"&&(
                <div className="p-5 space-y-5">
                  <div className="flex items-center justify-between"><span className="text-sm text-white/80">Share realtime meeting content with apps</span><ZToggle value={shareRealtime} onChange={setShareRealtime}/></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-white/80">Set meeting timers</span><ZToggle value={meetingTimers} onChange={setMeetingTimers}/></div>
                  <div><p className="text-xs text-white/50 mb-2">Who can start a collaboration?</p><ZSelect value={whoCollab} options={["All participants","Host only"]} onChange={setWhoCollab}/></div>
                  <div><p className="text-xs text-white/50 mb-2">Who can start a collaboration when someone else already started a collaboration?</p><ZSelect value={whoCollabWhile} options={["Host only","All participants"]} onChange={setWhoCollabWhile}/></div>
                </div>
              )}
              {/* Chat */}
              {activePanel==="chat"&&(
                <div className="p-3 space-y-2">
                  {!isLive&&<p className="text-center text-xs text-white/20 py-8">Chat starts when you go live</p>}
                  {messages.filter(m=>m.type!=="question").map(msg=>(
                    <div key={msg.id} className={msg.type==="system"?"p-2.5 bg-blue-500/8 border border-blue-500/15 rounded-lg":""}>
                      {msg.type==="system"?<p className="text-xs text-blue-300">{msg.message}</p>:(
                        <div className="flex gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-semibold ${msg.name==="You (Host)"?"bg-blue-600":"bg-white/8 text-white/40"}`}>{msg.name.charAt(0)}</div>
                          <div className="flex-1 min-w-0"><div className="flex items-center gap-1.5 mb-0.5"><span className={`text-[11px] font-medium ${msg.name==="You (Host)"?"text-blue-400":"text-white/60"}`}>{msg.name}</span><span className="text-[9px] text-white/20">{msg.time}</span></div><p className="text-xs text-white/70 leading-relaxed">{msg.message}</p></div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef}/>
                </div>
              )}
              {/* Q&A */}
              {activePanel==="questions"&&(
                <div className="p-3 space-y-2">
                  {questions.length===0?<p className="text-center text-xs text-white/20 py-8">{isLive?"No questions yet":"Questions appear here when live"}</p>
                  :questions.map(q=>(<div key={q.id} className="p-3 bg-white/3 border border-white/8 rounded-xl"><div className="flex items-center justify-between mb-1"><span className="text-[11px] font-medium text-orange-400">{q.name}</span><span className="text-[9px] text-white/20">{q.time}</span></div><p className="text-xs text-white/70 leading-relaxed">{q.message}</p><button className="mt-2 text-[10px] text-blue-400 hover:text-blue-300">Answer live →</button></div>))}
                </div>
              )}
              {/* Attendees */}
              {activePanel==="attendees"&&(
                <div className="p-3">
                  <p className="text-xs text-white/30 mb-3">{attendeeCount.toLocaleString()} attending · peak {peakAttendees.toLocaleString()}</p>
                  <div className="space-y-1">
                    {attendees.map(a=>(<div key={a.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/3 transition-colors"><div className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center text-xs font-semibold text-white/40 shrink-0">{a.name.charAt(0)}</div><div className="flex-1 min-w-0"><p className="text-xs font-medium text-white/70 truncate">{a.name}</p><p className="text-[10px] text-white/25">{a.location}</p></div><div className="flex items-center gap-1">{a.muted&&<MicOff className="w-3 h-3 text-white/20"/>}{a.videoOff&&<VideoOff className="w-3 h-3 text-white/20"/>}{a.handRaised&&<Hand className="w-3.5 h-3.5 text-yellow-400"/>}</div></div>))}
                    {attendeeCount>30&&<p className="text-center text-[10px] text-white/20 py-2">+{(attendeeCount-30).toLocaleString()} more</p>}
                  </div>
                </div>
              )}
              {/* Polls */}
              {activePanel==="polls"&&(
                <div className="p-3 space-y-3">
                  {polls.map(poll=>{const total=totalVotes(poll);return(
                    <div key={poll.id} className={`p-3 rounded-xl border ${poll.active?"border-blue-500/30 bg-blue-500/8":"border-white/8 bg-white/3"}`}>
                      <div className="flex items-start justify-between gap-2 mb-3"><p className="text-xs font-medium text-white/80 leading-snug">{poll.question}</p><button onClick={()=>setPolls(p=>p.map(x=>x.id===poll.id?{...x,active:!x.active}:x))} className={`shrink-0 text-[10px] px-2.5 py-1 rounded-lg font-semibold ${poll.active?"bg-red-500/20 text-red-400":"bg-blue-600 text-white hover:bg-blue-700"}`}>{poll.active?"End":"Launch"}</button></div>
                      {poll.options.map((opt,i)=>{const pct=total>0?Math.round((opt.votes/total)*100):0;return(<div key={i} className="mb-2"><div className="flex justify-between text-[10px] mb-1"><span className="text-white/60">{opt.text}</span><span className="text-white/40">{pct}%</span></div><div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{width:`${pct}%`}}/></div></div>);})}
                      {total>0&&<p className="text-[10px] text-white/25 mt-1">{total} votes</p>}
                    </div>
                  );})}
                  {showNewPoll?(<div className="p-3 bg-white/3 border border-white/8 rounded-xl space-y-2"><input value={newPollQ} onChange={e=>setNewPollQ(e.target.value)} placeholder="Poll question..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500"/><div className="flex gap-2"><button onClick={()=>{if(!newPollQ.trim())return;setPolls(p=>[...p,{id:Date.now().toString(),question:newPollQ,options:[{text:"Yes",votes:0},{text:"No",votes:0},{text:"Maybe",votes:0}],active:false}]);setNewPollQ("");setShowNewPoll(false);}} className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg">Add</button><button onClick={()=>setShowNewPoll(false)} className="px-3 py-1.5 border border-white/10 text-white/40 text-xs rounded-lg">Cancel</button></div></div>)
                  :(<button onClick={()=>setShowNewPoll(true)} className="w-full py-2 border border-dashed border-white/10 rounded-xl text-xs text-white/30 hover:text-white/60 hover:border-white/20 transition-colors">+ Add new poll</button>)}
                </div>
              )}
            </div>

            {/* Chat input */}
            {activePanel==="chat"&&isLive&&(
              <div className="px-3 py-3 border-t border-white/8 flex-shrink-0">
                <div className="flex gap-2">
                  <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Message attendees..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500"/>
                  <button onClick={sendMsg} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"><Send className="w-3.5 h-3.5"/></button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom toolbar */}
      <div className="border-t border-white/5 bg-[#111120] flex-shrink-0">
        <div className="flex items-center justify-center gap-1 px-4 py-2">
          {toolbar.map(btn=>(
            <button key={btn.label} onClick={btn.onClick} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl min-w-[64px] transition-all relative ${btn.danger?"text-red-400 hover:bg-red-500/10":btn.highlight||btn.active?"text-blue-400 bg-blue-500/10 hover:bg-blue-500/15":"text-white/50 hover:text-white hover:bg-white/5"}`}>
              <div className="relative"><btn.icon className="w-5 h-5"/>{btn.badge&&btn.badge>0&&<span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 px-0.5 bg-red-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center">{btn.badge>99?"99+":btn.badge}</span>}</div>
              <span className="text-[10px] font-medium leading-none">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* End modal */}
      {showEndModal&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">End Webinar?</h3>
            <p className="text-sm text-white/50 mb-6 leading-relaxed">Your webinar will end for all {attendeeCount.toLocaleString()} attendees.</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-white/3 border border-white/8 rounded-xl text-center"><p className="text-xl font-bold text-white">{fmtDur(duration)}</p><p className="text-xs text-white/30 mt-0.5">Duration</p></div>
              <div className="p-3 bg-white/3 border border-white/8 rounded-xl text-center"><p className="text-xl font-bold text-white">{peakAttendees.toLocaleString()}</p><p className="text-xs text-white/30 mt-0.5">Peak attendees</p></div>
            </div>
            {!savedEvergreen&&<button onClick={saveEvergreen} disabled={isSaving} className="w-full py-3 mb-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"><Save className="w-4 h-4"/>{isSaving?"Saving...":"Save Recording to Evergreen Room"}</button>}
            {savedEvergreen&&<div className="w-full py-3 mb-3 bg-green-500/15 border border-green-500/25 rounded-xl flex items-center justify-center gap-2 text-green-400 text-sm font-medium"><Check className="w-4 h-4"/>Recording saved to Evergreen</div>}
            <div className="flex gap-3">
              <button onClick={()=>setShowEndModal(false)} className="flex-1 py-3 border border-white/15 hover:bg-white/5 text-white/60 hover:text-white rounded-xl text-sm font-medium transition-colors">Keep Going</button>
              <button onClick={()=>{setIsLive(false);setShowEndModal(false);router.push("/dashboard/live");}} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors">End for Everyone</button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade modal */}
      {showUpgrade&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl relative">
            <button onClick={()=>setShowUpgrade(false)} className="absolute top-4 right-4 text-white/30 hover:text-white"><X className="w-5 h-5"/></button>
            <div className="flex items-center gap-2 mb-2"><Crown className="w-5 h-5 text-yellow-400"/><h3 className="text-xl font-bold text-white">Upgrade to Pro</h3></div>
            <p className="text-sm text-white/50 mb-6">Scale to 10,000 concurrent attendees and unlock all premium features.</p>
            <div className="space-y-2 mb-6">{["Up to 10,000 live attendees","HD video streaming","Advanced analytics","Custom branding","Priority support","Unlimited evergreen rooms","AI chat simulator — full access","Automated replay sequences"].map(f=>(<div key={f} className="flex items-center gap-2.5"><Check className="w-4 h-4 text-green-400 shrink-0"/><span className="text-sm text-white/70">{f}</span></div>))}</div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={()=>{setShowUpgrade(false);router.push("/dashboard/billing");}} className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">Upgrade — $297/mo</button>
              <button onClick={()=>{setShowUpgrade(false);window.open("mailto:sales@webinarforge.ai?subject=Pro Plan","_blank");}} className="py-3 border border-white/15 hover:bg-white/5 text-white/70 hover:text-white rounded-xl text-sm font-medium transition-colors">Contact Sales (Invoice)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
