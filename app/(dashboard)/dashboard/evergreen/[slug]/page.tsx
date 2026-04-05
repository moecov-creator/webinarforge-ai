// app/(dashboard)/dashboard/evergreen/[slug]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users, Volume2, VolumeX, Maximize2, SkipForward,
  Play, Pause, PlayCircle, Settings2, BarChart2,
  ClipboardList, Globe, Video, MessageSquare,
  Gift, FileText, BarChart, Tag, Code, Sparkles,
} from "lucide-react";
import type { TimedCommentDTO, CTASequenceDTO } from "@/types/webinar";

// ── Mock data (triggerAt as fractions 0-1) ─────────────────────────
const MOCK_WEBINAR = {
  title: "The 3-Step System to Land High-Ticket Coaching Clients Without Cold Outreach",
  presenter: "Jordan Blake",
  durationSeconds: 4500,
  viewerCountMin: 47,
  viewerCountMax: 312,
};
const MOCK_COMMENTS: TimedCommentDTO[] = [
  { id:"1", type:"SOCIAL_PROOF",  authorName:"Sarah M.",     authorAvatar:null, content:"This is exactly what I needed! Taking notes 📝",                 triggerAt:0.07, isActive:true, order:1 },
  { id:"2", type:"FAQ",           authorName:"Marcus T.",    authorAvatar:null, content:"Question: Does this work if you're just starting out?",          triggerAt:0.20, isActive:true, order:2 },
  { id:"3", type:"MODERATOR",     authorName:"Jordan Blake", authorAvatar:null, content:"Great question Marcus — yes, we cover this in step 2!",          triggerAt:0.22, isActive:true, order:3 },
  { id:"4", type:"TESTIMONIAL",   authorName:"Jennifer K.",  authorAvatar:null, content:"I applied this and went from $3k to $22k months. Life changing.", triggerAt:0.40, isActive:true, order:4 },
  { id:"5", type:"URGENCY",       authorName:"System",       authorAvatar:null, content:"🔥 67 people are watching right now",                            triggerAt:0.55, isActive:true, order:5 },
  { id:"6", type:"CTA_REMINDER",  authorName:"Jordan Blake", authorAvatar:null, content:"Enrollment is open! The link is below 👇",                      triggerAt:0.88, isActive:true, order:6 },
];
const MOCK_CTAS: CTASequenceDTO[] = [
  { id:"1", type:"SOFT",  triggerAt:0.15, headline:"Stay with me...",          body:"The most important part is coming up.",                      buttonText:"Keep watching",     buttonUrl:null,        isActive:true, order:1 },
  { id:"2", type:"MID",   triggerAt:0.50, headline:"Ready to implement this?", body:"The Business Acceleration Mastermind gives you everything.",  buttonText:"Tell me more →",   buttonUrl:"#checkout", isActive:true, order:2 },
  { id:"3", type:"FINAL", triggerAt:0.85, headline:"This is your moment.",     body:"Everything we covered today is waiting for you.",             buttonText:"Claim Your Spot →",buttonUrl:"#checkout", isActive:true, order:3 },
];

// ── Chat simulator pools ───────────────────────────────────────────
const FIRST_NAMES=["Jason","Michael","David","James","Robert","Sarah","Jennifer","Amanda","Jessica","Ashley","Emily","Carlos","Miguel","Marcus","Priya","Tyler","Brandon","Patricia","Trevor","Monica","Tiffany","Jasmine","Keisha","Ethan","Logan","Nathan","Justin","Crystal","Destiny","Brianna"];
const LAST_SHORT=["M.","K.","T.","R.","B.","W.","J.","H.","C.","D.","L.","P.","S.","N.","F."];
const LAST_FULL=["Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson","Anderson","Taylor","Thomas","Jackson","White","Harris","Martin","Thompson","Robinson","Clark","Lewis","Walker","Carter","Mitchell","Perez","Roberts","Turner"];
const CITIES=["New York, NY","Los Angeles, CA","Chicago, IL","Houston, TX","Dallas, TX","Austin, TX","Atlanta, GA","Miami, FL","Seattle, WA","Denver, CO","Nashville, TN","Boston, MA","Las Vegas, NV","Orlando, FL","Minneapolis, MN","London, UK","Manchester, UK","Paris, France","Berlin, Germany","Madrid, Spain","Rome, Italy","Amsterdam, Netherlands","Toronto, Canada","Sydney, Australia","Dublin, Ireland"];

type CueType="type1"|"dropCity"|"react"|"question"|"testimonial"|"general"|"joining";
const CUE_RESP:Record<CueType,(c:string)=>string[]>={
  type1:(city)=>["1","1️⃣","1 ✅","1 👍","1!",`1 from ${city}`,"1 🙌","1 absolutely","YES 1","Definitely 1","typing 1 rn","1 — mind blown","1 💯"],
  dropCity:(city)=>[city,`${city} 👋`,`Joining from ${city}!`,`Hello from ${city}`,`${city} in the house!`,`Watching from ${city} 🙌`,`Live from ${city}`,`${city} here!`],
  react:(_)=>["🔥🔥🔥","This is insane!","Mind blown 🤯","Taking notes!","WOW","🙌🙌🙌","Gold right here 💰","YESSS","💯💯💯","🚀🚀","Screenshotting this!"],
  question:(_)=>["Does this work for beginners?","How long does this take?","Can I use this for B2B?","What software do you recommend?","How soon can I see results?","Do you offer coaching?","Where do we sign up?"],
  testimonial:(_)=>["I tried this and got 3 new clients! 🎉","This got me to $10k/month in 60 days","Applied this and closed a $5k deal same week","Finally broke 6 figures following these steps 🙏"],
  general:(city)=>["So glad I showed up today!","Taking tons of notes 📓","Sharing this with my team",`Watching from ${city} — loving every minute`,"Pure value 💎","I needed to hear this today 🙏"],
  joining:(city)=>[`Just joined from ${city}!`,`Hello from ${city} 👋`,`${city} checking in!`,`Made it! From ${city}`,`${city} is in the building!`],
};

interface SimChat { id:string; name:string; city:string; message:string; showAt:number; showAtFrac:number; cueType:string; }
interface VideoSource { type:"upload"|"youtube"|"vimeo"|"mp4"; url:string; name:string; }

function randomName(seed:number):string {
  const first=FIRST_NAMES[seed%FIRST_NAMES.length];
  const fmt=seed%4;
  if(fmt===0)return`${first} ${LAST_SHORT[seed%LAST_SHORT.length]}`;
  if(fmt===1)return`${first} ${LAST_FULL[seed%LAST_FULL.length]}`;
  if(fmt===2)return`${first}${LAST_FULL[seed%LAST_FULL.length].charAt(0)}`;
  return`${first} ${LAST_SHORT[(seed+7)%LAST_SHORT.length]}`;
}

const CUE_TEMPLATES=[
  {frac:0.01,type:"joining" as CueType,burst:12,spread:0.015},
  {frac:0.06,type:"dropCity" as CueType,burst:16,spread:0.025},
  {frac:0.12,type:"react" as CueType,burst:8,spread:0.015},
  {frac:0.16,type:"type1" as CueType,burst:20,spread:0.020},
  {frac:0.24,type:"question" as CueType,burst:6,spread:0.018},
  {frac:0.30,type:"react" as CueType,burst:9,spread:0.015},
  {frac:0.36,type:"type1" as CueType,burst:18,spread:0.020},
  {frac:0.42,type:"testimonial" as CueType,burst:5,spread:0.025},
  {frac:0.48,type:"react" as CueType,burst:8,spread:0.015},
  {frac:0.54,type:"general" as CueType,burst:6,spread:0.020},
  {frac:0.60,type:"type1" as CueType,burst:16,spread:0.020},
  {frac:0.66,type:"question" as CueType,burst:5,spread:0.018},
  {frac:0.72,type:"react" as CueType,burst:9,spread:0.015},
  {frac:0.78,type:"type1" as CueType,burst:14,spread:0.020},
  {frac:0.84,type:"testimonial" as CueType,burst:5,spread:0.025},
  {frac:0.90,type:"general" as CueType,burst:7,spread:0.020},
];

function generateFallbackChats(duration:number):SimChat[]{
  const chats:SimChat[]=[];let id=0;
  CUE_TEMPLATES.forEach(cue=>{
    const base=cue.frac*duration;const spread=cue.spread*duration;
    for(let i=0;i<cue.burst;i++){
      const seed=id*7+i*13;const city=CITIES[seed%CITIES.length];
      const resp=CUE_RESP[cue.type](city);
      const jitter=(i/cue.burst+Math.random()*0.3)*spread;
      const showAt=Math.round(Math.min(base+jitter,duration-10));
      chats.push({id:String(id++),name:randomName(seed),city,message:resp[(seed+i)%resp.length],showAt,showAtFrac:showAt/duration,cueType:cue.type});
    }
  });
  return chats.sort((a,b)=>a.showAt-b.showAt);
}

function rescaleSimChats(chats:SimChat[],newDur:number):SimChat[]{
  return chats.map(c=>({...c,showAt:Math.round(c.showAtFrac*newDur)})).sort((a,b)=>a.showAt-b.showAt);
}

// ── Helpers ────────────────────────────────────────────────────────
function formatTime(s:number):string{const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;if(h>0)return`${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;return`${m}:${String(sec).padStart(2,"0")}`;}
function getCommentColor(type:string){switch(type){case"TESTIMONIAL":return"text-yellow-400";case"URGENCY":return"text-red-400";case"CTA_REMINDER":return"text-purple-400";case"MODERATOR":return"text-blue-400";default:return"text-white/70";}}
function getCueColor(cue:string){switch(cue){case"type1":return"text-green-400";case"dropCity":return"text-blue-400";case"testimonial":return"text-yellow-400";case"question":return"text-orange-400";case"joining":return"text-cyan-400";default:return"text-purple-400";}}
function Toggle({value,onChange}:{value:boolean;onChange:(v:boolean)=>void}){return(<button onClick={()=>onChange(!value)} className={`relative w-10 h-5 rounded-full transition-colors ${value?"bg-blue-600":"bg-white/10"}`}><div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value?"translate-x-5":""}`}/></button>);}
function toEmbedUrl(src:VideoSource):string{if(src.type==="youtube"){const m=src.url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);if(m)return`https://www.youtube.com/embed/${m[1]}?autoplay=0&rel=0`;}if(src.type==="vimeo"){const m=src.url.match(/vimeo\.com\/(\d+)/);if(m)return`https://player.vimeo.com/video/${m[1]}`;}return src.url;}
function saveLS(key:string,val:unknown){try{if(typeof window!=="undefined")localStorage.setItem(key,JSON.stringify(val));}catch{}}
function loadLS<T>(key:string,fb:T):T{try{if(typeof window==="undefined")return fb;const r=localStorage.getItem(key);return r?JSON.parse(r):fb;}catch{return fb;}}

// ── Video Player ───────────────────────────────────────────────────
function VideoPlayer({source,videoRef,onDuration}:{source:VideoSource|null;videoRef?:React.RefObject<HTMLVideoElement>;onDuration?:(d:number)=>void}){
  if(!source)return null;
  if(source.type==="upload"||source.type==="mp4"){
    return<video ref={videoRef} key={source.url} src={source.url} controls className="absolute inset-0 w-full h-full object-contain bg-black" onLoadedMetadata={e=>{const d=Math.floor((e.target as HTMLVideoElement).duration);if(d>0)onDuration?.(d);}}/>;
  }
  return<iframe key={source.url} src={toEmbedUrl(source)} className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>;
}

// ── Watch Room ─────────────────────────────────────────────────────
function WatchRoomTab({videoSource,simChats,videoDuration,onVideoDuration}:{videoSource:VideoSource|null;simChats:SimChat[];videoDuration:number;onVideoDuration:(d:number)=>void}){
  const [currentTime,setCurrentTime]=useState(0);
  const [isPlaying,setIsPlaying]=useState(false);
  const [isMuted,setIsMuted]=useState(false);
  const [visibleComments,setVisibleComments]=useState<TimedCommentDTO[]>([]);
  const [visibleSim,setVisibleSim]=useState<SimChat[]>([]);
  const [activeCTA,setActiveCTA]=useState<CTASequenceDTO|null>(null);
  const [userInput,setUserInput]=useState("");
  const [userMessages,setUserMessages]=useState<{id:string;name:string;message:string;time:string}[]>([]);
  const chatEndRef=useRef<HTMLDivElement>(null);
  const videoRef=useRef<HTMLVideoElement>(null);
  const sendUserMessage=()=>{
    if(!userInput.trim())return;
    setUserMessages(p=>[...p,{id:`u-${Date.now()}`,name:"You",message:userInput.trim(),time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);
    setUserInput("");
  };
  const timerRef=useRef<NodeJS.Timeout>();
  const dur=videoDuration>0?videoDuration:MOCK_WEBINAR.durationSeconds;

  useEffect(()=>{const tick=setInterval(()=>{if(videoRef.current&&!videoRef.current.paused)setCurrentTime(Math.floor(videoRef.current.currentTime));},500);return()=>clearInterval(tick);},[]);
  useEffect(()=>{if(videoSource)return;if(isPlaying){timerRef.current=setInterval(()=>{setCurrentTime(t=>{if(t+1>=dur){setIsPlaying(false);return dur;}return t+1;});},1000);}else clearInterval(timerRef.current);return()=>clearInterval(timerRef.current);},[isPlaying,dur,videoSource]);

  const resolvedComments=MOCK_COMMENTS.map(c=>({...c,triggerAt:Math.round(c.triggerAt*dur)}));
  const resolvedCTAs=MOCK_CTAS.map(c=>({...c,triggerAt:Math.round(c.triggerAt*dur)}));

  useEffect(()=>{const t=resolvedComments.filter(c=>c.isActive&&c.triggerAt<=currentTime&&!visibleComments.find(v=>v.id===c.id));if(t.length>0)setVisibleComments(p=>[...p,...t]);},[currentTime,dur]);
  useEffect(()=>{if(!simChats.length)return;const t=simChats.filter(c=>c.showAt<=currentTime&&!visibleSim.find(v=>v.id===c.id));if(t.length>0)setVisibleSim(p=>[...p,...t]);},[currentTime,simChats]);
  useEffect(()=>{const t=[...resolvedCTAs].reverse().find(c=>c.isActive&&c.triggerAt<=currentTime);setActiveCTA(t??null);},[currentTime,dur]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[visibleComments,visibleSim]);

  const allMessages=[
    ...visibleComments.map(c=>({id:`tc-${c.id}`,time:c.triggerAt,type:"timed" as const,data:c})),
    ...visibleSim.map(c=>({id:`sc-${c.id}`,time:c.showAt,type:"sim" as const,data:c})),
    ...userMessages.map(c=>({id:c.id,time:currentTime+0.1,type:"user" as const,data:c})),
  ].sort((a,b)=>a.time-b.time);
  const progress=dur>0?(currentTime/dur)*100:0;

  return(
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-black relative">
          {videoSource?(<VideoPlayer source={videoSource} videoRef={videoRef} onDuration={onVideoDuration}/>):(
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full gradient-brand flex items-center justify-center mx-auto mb-3 opacity-60"><span className="font-display text-2xl font-bold text-white">JB</span></div>
                <p className="text-white/20 text-sm">Video presentation</p>
                <p className="text-white/10 text-xs mt-1">Add a video in Settings → Video</p>
              </div>
            </div>
          )}
          {!videoSource&&(
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="max-w-2xl mx-auto bg-black/60 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">Current Section</p>
                <p className="text-base font-semibold text-white">{progress<15?"Opening Hook":progress<30?"The Promise":progress<50?"Belief Shift":progress<65?"Teaching Point":progress<80?"Offer Stack":"Call to Action"}</p>
              </div>
            </div>
          )}
        </div>

        {activeCTA&&(<div className="mx-6 my-3 p-4 rounded-xl bg-gradient-to-r from-purple-500/15 to-blue-500/15 border border-purple-500/25 flex items-center justify-between gap-4"><div className="flex-1 min-w-0"><p className="text-sm font-semibold text-white">{activeCTA.headline}</p>{activeCTA.body&&<p className="text-xs text-white/50 mt-0.5 truncate">{activeCTA.body}</p>}</div>{activeCTA.buttonUrl&&<a href={activeCTA.buttonUrl}><Button size="sm" className="gradient-brand border-0 text-xs h-8 px-4">{activeCTA.buttonText}</Button></a>}</div>)}

        <div className="px-6 py-4 border-t border-white/5 bg-black/20 flex-shrink-0">
          {!videoSource?(
            <><div className="h-1 bg-white/10 rounded-full mb-3 cursor-pointer" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setCurrentTime(Math.round(((e.clientX-r.left)/r.width)*dur));}}><div className="h-full gradient-brand rounded-full transition-all" style={{width:`${progress}%`}}/></div>
            <div className="flex items-center gap-4">
              <Button size="sm" variant="ghost" className="text-white/60 hover:text-white h-8 w-8 p-0" onClick={()=>setIsPlaying(p=>!p)}>{isPlaying?<Pause className="w-4 h-4"/>:<Play className="w-4 h-4"/>}</Button>
              <Button size="sm" variant="ghost" className="text-white/60 hover:text-white h-8 w-8 p-0" onClick={()=>setCurrentTime(t=>Math.min(dur,t+60))}><SkipForward className="w-4 h-4"/></Button>
              <Button size="sm" variant="ghost" className="text-white/60 hover:text-white h-8 w-8 p-0" onClick={()=>setIsMuted(m=>!m)}>{isMuted?<VolumeX className="w-4 h-4"/>:<Volume2 className="w-4 h-4"/>}</Button>
              <span className="text-xs text-white/30 font-mono ml-2">{formatTime(currentTime)} / {formatTime(dur)}</span>
              <Button size="sm" variant="ghost" className="text-white/60 hover:text-white h-8 w-8 p-0 ml-auto"><Maximize2 className="w-4 h-4"/></Button>
            </div></>
          ):(
            <div className="flex items-center gap-2 text-xs text-white/30">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
              <span>Video synced · {formatTime(currentTime)} elapsed{videoDuration>0?` / ${formatTime(videoDuration)}`:""}{simChats.length>0?` · ${simChats.length} chat messages loaded`:""}</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-72 border-l border-white/5 flex flex-col bg-black/20 flex-shrink-0">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Live Chat</p>
          {simChats.length>0&&<span className="text-[10px] text-purple-400/70">{simChats.length} loaded</span>}
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {allMessages.length===0&&(
            <div className="text-center pt-8 px-4 space-y-2">
              {simChats.length>0?<p className="text-xs text-white/20 leading-relaxed">▶ Press play to see {simChats.length} messages fire in sync</p>:<><p className="text-xs text-white/20">Generate chat in</p><p className="text-xs text-purple-400/60">Settings → Chat Simulator</p><p className="text-xs text-white/15">then press play</p></>}
            </div>
          )}
          {allMessages.map(msg=>{
            if(msg.type==="timed"){const c=msg.data as TimedCommentDTO;return(<div key={msg.id} className="flex gap-2 animate-in fade-in slide-in-from-bottom-2"><div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[10px] font-semibold text-white/40">{c.authorName.charAt(0)}</div><div className="flex-1 min-w-0"><p className={`text-[11px] font-medium mb-0.5 ${getCommentColor(c.type)}`}>{c.authorName}</p><p className="text-xs text-white/55 leading-relaxed">{c.content}</p></div></div>);}
            else if(msg.type==="user"){const c=msg.data as {id:string;name:string;message:string;time:string};return(<div key={msg.id} className="flex gap-2 animate-in fade-in slide-in-from-bottom-2"><div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center shrink-0 text-[10px] font-semibold text-white">Y</div><div className="flex-1 min-w-0"><p className="text-[11px] font-medium mb-0.5 text-purple-400">You</p><p className="text-xs text-white/80 leading-relaxed">{c.message}</p></div></div>);}
            else{const c=msg.data as SimChat;return(<div key={msg.id} className="flex gap-2 animate-in fade-in slide-in-from-bottom-2"><div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-[10px] font-semibold text-white/30">{c.name.charAt(0)}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-1.5 mb-0.5 flex-wrap"><p className={`text-[11px] font-medium ${getCueColor(c.cueType)}`}>{c.name}</p><span className="text-[9px] text-white/20">· {c.city}</span></div><p className="text-xs text-white/60 leading-relaxed">{c.message}</p></div></div>);}
          })}
          <div ref={chatEndRef}/>
        </div>
        <div className="px-3 py-2 border-t border-white/5"><div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2"><input value={userInput} onChange={e=>setUserInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")sendUserMessage();}} placeholder="Type a message..." className="flex-1 bg-transparent text-xs text-white placeholder:text-white/30 outline-none"/><button onClick={sendUserMessage} className="text-purple-400 hover:text-purple-300 text-xs font-medium transition-colors px-1">Send</button></div></div>
      </div>
    </div>
  );
}

// ── Chat Simulator Section ─────────────────────────────────────────
function ChatSimulatorSection({slug,simChats,onSimChatsChange,videoDuration,onVideoDuration}:{slug:string;simChats:SimChat[];onSimChatsChange:(c:SimChat[])=>void;videoDuration:number;onVideoDuration:(d:number)=>void}){
  const [mode,setMode]=useState<"ai"|"fallback">("ai");
  const [audioUrl,setAudioUrl]=useState("");
  const [transcribing,setTranscribing]=useState(false);
  const [transcribeProgress,setTranscribeProgress]=useState("");
  const [transcribeError,setTranscribeError]=useState("");
  const [transcribeInfo,setTranscribeInfo]=useState("");
  const [transcriptPreview,setTranscriptPreview]=useState("");
  const [aiSuccess,setAiSuccess]=useState(false);
  const [generatingFallback,setGeneratingFallback]=useState(false);
  const [manualDuration,setManualDuration]=useState(videoDuration>0?String(Math.round(videoDuration/60)):"");

  const handleTranscribe=async()=>{
    if(!audioUrl.trim()){setTranscribeError("Please paste a Google Drive or Dropbox link to your audio file.");return;}
    setTranscribing(true);setTranscribeError("");setTranscribeInfo("");
    setTranscribeProgress("Connecting to your audio file...");
    try{
      setTranscribeProgress("Transcribing with Whisper AI... (this may take 2–4 minutes for long audio)");
      const res=await fetch("/api/evergreen/transcribe",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({url:audioUrl.trim(),duration:videoDuration>0?videoDuration:undefined}),
      });
      let data:any;
      try{data=await res.json();}
      catch{const text=await res.text();throw new Error(`Server error (${res.status}): ${text.slice(0,200)}`);}
      if(!data.success&&!data.chats)throw new Error(data.error||"Something went wrong. Please try again.");
      if(data.usedFallback){
        setTranscribeInfo(data.message||"Chat generated proportionally — AI transcription did not run.");
        setAiSuccess(false);
      } else {
        setAiSuccess(true);
        setTranscribeInfo("");
        if(data.transcript?.text){setTranscriptPreview(data.transcript.text.slice(0,300));}
      }
      setTranscribeProgress("");
      const chats:SimChat[]=data.chats;
      const detectedDur:number=data.duration;
      if(detectedDur>0&&detectedDur!==videoDuration){onVideoDuration(detectedDur);saveLS(`wf-duration-${slug}`,detectedDur);}
      onSimChatsChange(chats);saveLS(`wf-chats-${slug}`,chats);
    }catch(err){
      setTranscribeError(err instanceof Error?err.message:"Something went wrong. Please try again.");
      setTranscribeProgress("");
    }finally{setTranscribing(false);}
  };

  const handleFallback=()=>{
    const dur=videoDuration>0?videoDuration:(parseInt(manualDuration)||60)*60;
    setGeneratingFallback(true);
    setTimeout(()=>{const chats=generateFallbackChats(dur);onSimChatsChange(chats);saveLS(`wf-chats-${slug}`,chats);if(!videoDuration&&manualDuration){const d=parseInt(manualDuration)*60;onVideoDuration(d);saveLS(`wf-duration-${slug}`,d);}setGeneratingFallback(false);},1200);
  };

  const handleManualDuration=(val:string)=>{
    setManualDuration(val);const mins=parseInt(val);
    if(mins>0){const d=mins*60;onVideoDuration(d);saveLS(`wf-duration-${slug}`,d);if(simChats.length>0){const r=rescaleSimChats(simChats,d);onSimChatsChange(r);saveLS(`wf-chats-${slug}`,r);}}
  };

  return(
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Chat Simulator</h3>
          <p className="text-xs text-white/30 mt-0.5">{simChats.length>0?`${simChats.length} messages · ${videoDuration>0?`synced to ${formatTime(videoDuration)} video`:"set video duration to sync"}`:"AI reads your audio and generates contextual chat"}</p>
        </div>
        {simChats.length>0&&<button onClick={()=>{onSimChatsChange([]);saveLS(`wf-chats-${slug}`,[]);}} className="text-xs text-red-400/60 hover:text-red-400 transition-colors">Remove all</button>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={()=>setMode("ai")} className={`p-4 rounded-xl border-2 text-left transition-all ${mode==="ai"?"border-purple-500 bg-purple-500/10":"border-white/10 hover:border-white/20 bg-white/3"}`}>
          <div className="flex items-center gap-2 mb-1"><Sparkles className={`w-4 h-4 ${mode==="ai"?"text-purple-400":"text-white/30"}`}/><span className={`text-sm font-semibold ${mode==="ai"?"text-white":"text-white/50"}`}>AI Video Analysis</span><span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">Recommended</span></div>
          <p className="text-xs text-white/25 leading-snug">Paste a Google Drive or Dropbox link — AI transcribes and generates comments matching exactly what the presenter says</p>
        </button>
        <button onClick={()=>setMode("fallback")} className={`p-4 rounded-xl border-2 text-left transition-all ${mode==="fallback"?"border-purple-500 bg-purple-500/10":"border-white/10 hover:border-white/20 bg-white/3"}`}>
          <div className="flex items-center gap-2 mb-1"><MessageSquare className={`w-4 h-4 ${mode==="fallback"?"text-purple-400":"text-white/30"}`}/><span className={`text-sm font-semibold ${mode==="fallback"?"text-white":"text-white/50"}`}>Quick Generate</span></div>
          <p className="text-xs text-white/25 leading-snug">Generate generic but realistic chat messages spread across your video without any link</p>
        </button>
      </div>

      {mode==="ai"&&(
        <div className="space-y-4">
          <div className="p-4 bg-purple-500/8 border border-purple-500/20 rounded-xl">
            <div className="flex items-start gap-2 mb-2"><Sparkles className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0"/><p className="text-xs text-purple-300 font-medium">How it works</p></div>
            <ol className="text-xs text-white/35 space-y-1 ml-5 list-decimal leading-relaxed">
              <li>Upload your MP3/M4A to Google Drive → Share → Anyone with the link</li>
              <li>Paste the share link below</li>
              <li>AI downloads, transcribes with Whisper, and identifies key moments</li>
              <li>Generates 160 comments timed to exactly what the presenter says</li>
            </ol>
            <p className="text-[10px] text-green-400/70 mt-2">✅ No file size limits — works with any size audio via Google Drive or Dropbox</p>
          </div>

          {transcribeError&&<div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"><p className="text-xs text-red-400">{transcribeError}</p></div>}
          {aiSuccess&&transcriptPreview&&(
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg space-y-1">
              <p className="text-xs text-green-400 font-medium">✅ AI transcription successful! Comments are synced to your video content.</p>
              <p className="text-[10px] text-green-400/60 leading-relaxed italic">"{transcriptPreview}..."</p>
            </div>
          )}
          {transcribeInfo&&!aiSuccess&&<div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg"><p className="text-xs text-orange-400 font-medium">⚠️ Fallback used</p><p className="text-xs text-orange-400/70 mt-1">{transcribeInfo}</p></div>}

          {transcribing?(
            <div className="p-6 border border-purple-500/20 rounded-xl bg-purple-500/5 text-center space-y-3">
              <div className="flex items-center justify-center gap-2"><svg className="animate-spin h-5 w-5 text-purple-400" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg><span className="text-sm text-purple-300 font-medium">Processing...</span></div>
              <p className="text-xs text-white/40">{transcribeProgress}</p>
              <p className="text-[10px] text-white/20">This may take 2–4 minutes. Don't close this tab.</p>
            </div>
          ):(
            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Google Drive or Dropbox audio link</label>
                <input value={audioUrl} onChange={e=>setAudioUrl(e.target.value)} placeholder="https://drive.google.com/file/d/... or https://dropbox.com/..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500"/>
                <p className="text-[10px] text-white/25 mt-1.5 leading-relaxed">In Google Drive: right-click file → Share → Anyone with the link → Copy link</p>
              </div>
              <button onClick={handleTranscribe} disabled={!audioUrl.trim()} className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4"/>{audioUrl.trim()?"✦ Analyze Audio & Generate Smart Chat →":"Paste a Google Drive or Dropbox link first"}
              </button>
            </div>
          )}
        </div>
      )}

      {mode==="fallback"&&(
        <div className="space-y-4">
          <div><label className="text-xs text-white/40 mb-1 block">Video duration (minutes)</label>
            <div className="flex gap-2">
              <input value={manualDuration} onChange={e=>handleManualDuration(e.target.value)} type="number" min="1" placeholder="e.g. 106 for 1h46m" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500"/>
              <div className="flex items-center px-3 py-2 bg-white/3 border border-white/8 rounded-lg min-w-[80px] justify-center"><span className="text-xs text-white/30">{manualDuration?formatTime(parseInt(manualDuration||"0")*60):"hh:mm:ss"}</span></div>
            </div>
          </div>
          <button onClick={handleFallback} disabled={generatingFallback} className="w-full py-3 bg-white/8 hover:bg-white/12 border border-white/10 hover:border-white/20 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
            {generatingFallback?(<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Generating...</>):"✦ Generate Generic Chat Messages"}
          </button>
          <p className="text-xs text-white/20 text-center">Messages spread proportionally. For video-accurate comments use AI Video Analysis.</p>
        </div>
      )}

      {simChats.length>0&&(
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-white/30">{simChats.length} messages · first at {formatTime(simChats[0]?.showAt||0)} · last at {formatTime(simChats[simChats.length-1]?.showAt||0)}</p>
            <button onClick={handleFallback} className="text-xs text-white/30 hover:text-white/60">↺ Regenerate</button>
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
            {simChats.slice(0,50).map(m=>(<div key={m.id} className="flex items-center gap-3 p-2 bg-white/3 border border-white/5 rounded-lg hover:border-white/10 transition-colors"><div className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.cueType==="type1"?"bg-green-400":m.cueType==="dropCity"?"bg-blue-400":m.cueType==="testimonial"?"bg-yellow-400":m.cueType==="question"?"bg-orange-400":m.cueType==="joining"?"bg-cyan-400":"bg-purple-400"}`}/><div className="flex-1 min-w-0"><span className="text-xs font-medium text-white/70">{m.name}</span><span className="text-[10px] text-white/25 mx-1">·</span><span className="text-[10px] text-white/25">{m.city}</span><span className="text-[10px] text-white/15 mx-1">·</span><span className="text-[10px] text-white/20">{formatTime(m.showAt)}</span></div><span className="text-xs text-white/40 truncate max-w-[130px]">{m.message}</span></div>))}
            {simChats.length>50&&<p className="text-center text-xs text-white/20 py-2">+{simChats.length-50} more messages</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Settings Tab ───────────────────────────────────────────────────
function SettingsTab({slug,videoSource,onVideoSourceChange,simChats,onSimChatsChange,videoDuration,onVideoDuration}:{slug:string;videoSource:VideoSource|null;onVideoSourceChange:(s:VideoSource|null)=>void;simChats:SimChat[];onSimChatsChange:(c:SimChat[])=>void;videoDuration:number;onVideoDuration:(d:number)=>void}){
  const [activeSection,setActiveSection]=useState("general");
  const [liveChat,setLiveChat]=useState(true);
  const [showBrandLogo,setShowBrandLogo]=useState(true);
  const [allowFullscreen,setAllowFullscreen]=useState(true);
  const [redirectAfter,setRedirectAfter]=useState(false);
  const [redirectLink,setRedirectLink]=useState("");
  const [sourceType,setSourceType]=useState<"upload"|"youtube"|"vimeo"|"mp4">(videoSource&&videoSource.type!=="upload"?videoSource.type:"upload");
  const [externalUrl,setExternalUrl]=useState(videoSource&&videoSource.type!=="upload"?videoSource.url:"");
  const [offers,setOffers]=useState<{id:string;name:string;showAt:number;url:string}[]>([]);
  const [newOffer,setNewOffer]=useState({name:"",showAt:0,url:""});
  const [manualDur,setManualDur]=useState(videoDuration>0?String(Math.round(videoDuration/60)):"");

  const sections=[
    {key:"general",label:"General",icon:Settings2},
    {key:"video",label:"Video",icon:Video,badge:videoSource?"1 VIDEO":undefined},
    {key:"offers",label:"Offers",icon:Gift,badge:offers.length?`${offers.length} OFFER${offers.length>1?"S":""}`:undefined},
    {key:"handouts",label:"Handouts",icon:FileText},
    {key:"polls",label:"Polls",icon:BarChart},
    {key:"chat",label:"Chat",icon:MessageSquare},
    {key:"chatsim",label:"Chat Simulator",icon:Sparkles,badge:simChats.length?`${simChats.length} MESSAGES`:undefined},
    {key:"colors",label:"Colors",icon:Tag},
    {key:"labels",label:"Labels",icon:Tag},
    {key:"embed",label:"Embed",icon:Code},
  ];

  const handleFileUpload=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0];if(!file)return;
    if(videoSource?.type==="upload")URL.revokeObjectURL(videoSource.url);
    onVideoSourceChange({type:"upload",url:URL.createObjectURL(file),name:file.name});
  };
  const handleExternalUrlSave=()=>{
    if(!externalUrl.trim())return;
    const src:VideoSource={type:sourceType,url:externalUrl.trim(),name:externalUrl.trim()};
    onVideoSourceChange(src);saveLS(`wf-video-${slug}`,src);
  };
  const handleManualDur=(val:string)=>{
    setManualDur(val);const mins=parseInt(val);
    if(mins>0){const d=mins*60;onVideoDuration(d);saveLS(`wf-duration-${slug}`,d);if(simChats.length>0){const r=rescaleSimChats(simChats,d);onSimChatsChange(r);saveLS(`wf-chats-${slug}`,r);}}
  };

  return(
    <div className="flex-1 flex overflow-hidden">
      <div className="w-52 border-r border-white/5 bg-black/10 flex flex-col py-3 shrink-0 overflow-y-auto">
        {sections.map(s=>(<button key={s.key} onClick={()=>setActiveSection(s.key)} className={`flex items-center justify-between px-4 py-2.5 text-sm transition-all ${activeSection===s.key?"text-white bg-white/8 border-l-2 border-purple-500":"text-white/40 hover:text-white/70 hover:bg-white/4 border-l-2 border-transparent"}`}><div className="flex items-center gap-2.5"><s.icon className="w-3.5 h-3.5"/><span>{s.label}</span></div>{s.badge&&<span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded-full font-semibold">{s.badge}</span>}</button>))}
      </div>
      <div className="flex-1 overflow-y-auto p-6">

        {activeSection==="general"&&(<div className="max-w-lg space-y-5"><h3 className="text-base font-semibold text-white">General Settings</h3><div><label className="text-xs text-white/40 mb-2 block">Duration</label><div className="flex gap-2">{[["Hours","1"],["Minutes","30"],["Seconds","0"]].map(([l,v])=>(<div key={l} className="flex-1"><label className="text-[10px] text-white/30 block mb-1">{l}</label><input defaultValue={v} type="number" min={0} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"/></div>))}</div></div><div className="flex items-center justify-between py-3 border-b border-white/5"><span className="text-sm text-white/70">Show brand logo</span><Toggle value={showBrandLogo} onChange={setShowBrandLogo}/></div><div className="flex items-center justify-between py-3 border-b border-white/5"><span className="text-sm text-white/70">Redirect after webinar ends</span><Toggle value={redirectAfter} onChange={setRedirectAfter}/></div>{redirectAfter&&<input value={redirectLink} onChange={e=>setRedirectLink(e.target.value)} placeholder="https://yoursite.com/thank-you" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500"/>}<div className="flex items-center justify-between py-3"><span className="text-sm text-white/70">Waiting image</span><button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg">Edit</button></div></div>)}

        {activeSection==="video"&&(
          <div className="max-w-lg space-y-5">
            <h3 className="text-base font-semibold text-white">Video Source</h3>
            {videoDuration>0&&<div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400 shrink-0"/><p className="text-xs text-green-400">Duration detected: <strong>{formatTime(videoDuration)}</strong> — chat messages synced</p></div>}
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"><p className="text-xs text-yellow-400/80 leading-relaxed"><strong>Tip:</strong> Use YouTube, Vimeo, or MP4 URL for permanent video that saves across sessions.</p></div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={()=>setSourceType("upload")} className={`p-4 rounded-xl border-2 transition-all text-left ${sourceType==="upload"?"border-purple-500 bg-purple-500/10":"border-white/10 hover:border-white/20 bg-white/3"}`}><div className="flex items-center gap-2 mb-1"><Video className={`w-4 h-4 ${sourceType==="upload"?"text-purple-400":"text-white/30"}`}/><span className={`text-sm font-medium ${sourceType==="upload"?"text-white":"text-white/50"}`}>Upload file</span></div><p className="text-xs text-white/25">MP4, MOV, WebM (session only)</p></button>
              <button onClick={()=>{if(sourceType==="upload")setSourceType("youtube");}} className={`p-4 rounded-xl border-2 transition-all text-left ${sourceType!=="upload"?"border-purple-500 bg-purple-500/10":"border-white/10 hover:border-white/20 bg-white/3"}`}><div className="flex items-center gap-2 mb-1"><Globe className={`w-4 h-4 ${sourceType!=="upload"?"text-purple-400":"text-white/30"}`}/><span className={`text-sm font-medium ${sourceType!=="upload"?"text-white":"text-white/50"}`}>Use URL</span></div><p className="text-xs text-white/25">YouTube, Vimeo, MP4 (saved)</p></button>
            </div>
            {sourceType==="upload"?(
              <div className="space-y-3">
                <label htmlFor="video-file-input" className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer group">
                  <Video className="w-8 h-8 text-white/20 group-hover:text-purple-400 mb-2 transition-colors"/>
                  {videoSource?.type==="upload"?(<><p className="text-sm text-green-400 font-medium">{videoSource.name}</p><p className="text-xs text-white/30 mt-1">Click to change</p></>):(<><p className="text-sm text-white/40 group-hover:text-white/60">Drop here or <span className="text-purple-400 underline">browse</span></p><p className="text-xs text-white/20 mt-1">MP4, MOV, WebM up to 2GB</p></>)}
                </label>
                <input id="video-file-input" type="file" accept="video/*" className="hidden" onChange={handleFileUpload}/>
                {videoSource?.type==="upload"&&<div className="flex items-center gap-3 p-3 bg-white/3 border border-white/8 rounded-xl"><Video className="w-4 h-4 text-purple-400 shrink-0"/><div className="flex-1 min-w-0"><p className="text-sm text-white truncate">{videoSource.name}</p><p className="text-xs text-green-400 font-semibold mt-0.5">{videoDuration>0?`Duration: ${formatTime(videoDuration)}`:"Switch to Watch Room — duration auto-detects"}</p></div><button onClick={()=>{onVideoSourceChange(null);saveLS(`wf-video-${slug}`,null);}} className="text-white/20 hover:text-red-400 text-lg leading-none">×</button></div>}
              </div>
            ):(
              <div className="space-y-3">
                <div className="flex gap-1 bg-white/5 rounded-lg p-1">{(["youtube","vimeo","mp4"] as const).map(t=>(<button key={t} onClick={()=>setSourceType(t)} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${sourceType===t?"bg-purple-600 text-white":"text-white/30 hover:text-white/60"}`}>{t==="mp4"?"Direct MP4":t.charAt(0).toUpperCase()+t.slice(1)}</button>))}</div>
                <input value={externalUrl} onChange={e=>setExternalUrl(e.target.value)} placeholder={sourceType==="youtube"?"https://youtube.com/watch?v=...":sourceType==="vimeo"?"https://vimeo.com/123456789":"https://example.com/video.mp4"} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500"/>
                <div><label className="text-xs text-white/40 mb-1 block">Video duration (minutes) — required for chat sync</label><div className="flex gap-2"><input value={manualDur} onChange={e=>handleManualDur(e.target.value)} type="number" min="1" placeholder="e.g. 106" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500"/><div className="flex items-center px-3 py-2 bg-white/3 border border-white/8 rounded-lg"><span className="text-xs text-white/30">{manualDur?formatTime(parseInt(manualDur||"0")*60):"hh:mm:ss"}</span></div></div></div>
                <button onClick={handleExternalUrlSave} disabled={!externalUrl.trim()} className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm font-semibold rounded-lg">Save & use this video →</button>
                {videoSource&&videoSource.type!=="upload"&&<div className="flex items-center gap-3 p-3 bg-white/3 border border-green-500/20 rounded-xl"><Globe className="w-4 h-4 text-green-400 shrink-0"/><div className="flex-1 min-w-0"><p className="text-xs text-white/60 truncate">{videoSource.name}</p><p className="text-xs text-green-400 font-semibold mt-0.5">SAVED · {videoDuration>0?`${formatTime(videoDuration)}`:"Enter duration for chat sync"}</p></div><button onClick={()=>{onVideoSourceChange(null);saveLS(`wf-video-${slug}`,null);setExternalUrl("");}} className="text-white/20 hover:text-red-400 text-lg leading-none">×</button></div>}
              </div>
            )}
            <div className="flex items-center justify-between py-3 border-t border-white/5"><span className="text-sm text-white/70">Allow fullscreen</span><Toggle value={allowFullscreen} onChange={setAllowFullscreen}/></div>
          </div>
        )}

        {activeSection==="offers"&&(<div className="max-w-lg space-y-5"><h3 className="text-base font-semibold text-white">Timed Offers</h3><div className="p-4 bg-white/3 border border-white/8 rounded-xl space-y-3"><input value={newOffer.name} onChange={e=>setNewOffer(p=>({...p,name:e.target.value}))} placeholder="Offer name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500"/><div className="flex gap-2"><input type="number" value={newOffer.showAt} onChange={e=>setNewOffer(p=>({...p,showAt:Number(e.target.value)}))} placeholder="Show at (s)" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"/><input value={newOffer.url} onChange={e=>setNewOffer(p=>({...p,url:e.target.value}))} placeholder="CTA URL" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500"/></div><button onClick={()=>{if(!newOffer.name)return;setOffers(p=>[...p,{...newOffer,id:Date.now().toString()}]);setNewOffer({name:"",showAt:0,url:""});}} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg">Add Offer</button></div>{offers.length===0?(<div className="text-center py-10 border border-dashed border-white/10 rounded-xl"><Gift className="w-8 h-8 text-white/10 mx-auto mb-2"/><p className="text-sm text-white/30">No offers yet</p></div>):offers.map(o=>(<div key={o.id} className="flex items-center justify-between p-4 bg-white/3 border border-white/8 rounded-xl"><div><p className="text-sm font-medium text-white">{o.name}</p><p className="text-xs text-white/30 mt-0.5">Shows at {formatTime(o.showAt)}</p></div><button onClick={()=>setOffers(p=>p.filter(x=>x.id!==o.id))} className="text-white/20 hover:text-red-400 text-lg leading-none ml-3">×</button></div>))}</div>)}
        {activeSection==="handouts"&&(<div className="max-w-lg"><h3 className="text-base font-semibold text-white mb-5">Handouts</h3><div className="text-center py-14 border border-dashed border-white/10 rounded-xl"><FileText className="w-8 h-8 text-white/10 mx-auto mb-2"/><p className="text-sm text-white/30 mb-4">No handouts yet</p><button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg">+ Add new handout</button></div></div>)}
        {activeSection==="polls"&&(<div className="max-w-lg"><h3 className="text-base font-semibold text-white mb-5">Polls</h3><div className="text-center py-14 border border-dashed border-white/10 rounded-xl"><BarChart className="w-8 h-8 text-white/10 mx-auto mb-2"/><p className="text-sm text-white/30 mb-4">No polls yet</p><button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg">+ Add new poll</button></div></div>)}
        {activeSection==="chat"&&(<div className="max-w-lg space-y-5"><h3 className="text-base font-semibold text-white">Chat Settings</h3><div className="flex items-center justify-between py-3 border-b border-white/5"><span className="text-sm text-white/70">Live chat</span><Toggle value={liveChat} onChange={setLiveChat}/></div><div><label className="text-xs text-white/40 mb-1 block">Message visibility</label><select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"><option>Public</option><option>Presenter only</option><option>Hidden</option></select></div><div><label className="text-xs text-white/40 mb-1 block">Notification cooldown</label><select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"><option>1 hour</option><option>30 minutes</option><option>2 hours</option><option>Never</option></select></div></div>)}
        {activeSection==="chatsim"&&<ChatSimulatorSection slug={slug} simChats={simChats} onSimChatsChange={onSimChatsChange} videoDuration={videoDuration} onVideoDuration={onVideoDuration}/>}
        {activeSection==="colors"&&(<div className="max-w-lg space-y-5"><h3 className="text-base font-semibold text-white">Room Colors</h3>{[["Primary","#7C3AED"],["Button","#7C3AED"],["Background","#06060F"],["Text","#FFFFFF"],["Accent","#A855F7"]].map(([l,d])=>(<div key={l} className="flex items-center justify-between py-3 border-b border-white/5"><span className="text-sm text-white/70">{l} color</span><div className="flex items-center gap-3"><div className="w-6 h-6 rounded-lg border border-white/10" style={{background:d}}/><input type="color" defaultValue={d} className="w-8 h-8 border-0 bg-transparent cursor-pointer rounded"/></div></div>))}</div>)}
        {activeSection==="labels"&&(<div className="max-w-lg space-y-5"><h3 className="text-base font-semibold text-white">Custom Labels</h3>{[["Register button","REGISTER NOW"],["Viewer count label","watching"],["Chat placeholder","Type your message..."],["Live badge","LIVE"]].map(([l,d])=>(<div key={l}><label className="text-xs text-white/40 mb-1 block">{l}</label><input defaultValue={d} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"/></div>))}</div>)}
        {activeSection==="embed"&&(<div className="max-w-lg space-y-5"><h3 className="text-base font-semibold text-white">Embed Instructions</h3><div><p className="text-sm text-white/60 mb-2">Step 1:</p><textarea readOnly className="w-full h-20 bg-white/3 border border-white/10 rounded-xl p-3 text-xs font-mono text-white/50 resize-none" value={`<div id="wf-room"></div>\n<script src="https://webinarforge.ai/embed.js" data-slug="[SLUG]"></script>`}/></div><div><p className="text-sm text-white/60 mb-2">Step 2:</p><textarea readOnly className="w-full h-12 bg-white/3 border border-white/10 rounded-xl p-3 text-xs font-mono text-white/50 resize-none" value={`<link rel="stylesheet" href="https://webinarforge.ai/css/room.css">`}/></div></div>)}
      </div>
    </div>
  );
}

// ── Analytics Tab ──────────────────────────────────────────────────
function AnalyticsTab(){
  const stats=[{label:"Total Registrations",value:"189",change:"+12%",up:true},{label:"Completions",value:"81",change:"+8%",up:true},{label:"Completion Rate",value:"43%",change:"-2%",up:false},{label:"Avg. Watch Time",value:"38:14",change:"+5%",up:true},{label:"CTA Clicks",value:"34",change:"+18%",up:true},{label:"Conversion Rate",value:"18%",change:"+3%",up:true}];
  const dropOff=[{label:"Hook (0:00)",pct:100},{label:"Promise (15%)",pct:87},{label:"Problem (30%)",pct:74},{label:"Teaching 1 (45%)",pct:61},{label:"Teaching 2 (60%)",pct:52},{label:"Offer (75%)",pct:43},{label:"CTA (90%)",pct:38}];
  return(<div className="flex-1 overflow-y-auto p-6"><div className="max-w-4xl mx-auto space-y-6"><div className="grid grid-cols-3 gap-4">{stats.map(s=>(<div key={s.label} className="p-4 rounded-xl bg-white/3 border border-white/8"><p className="text-xs text-white/30 mb-1">{s.label}</p><p className="text-2xl font-bold text-white">{s.value}</p><p className={`text-xs mt-1 font-medium ${s.up?"text-green-400":"text-red-400"}`}>{s.change} vs last month</p></div>))}</div><div className="p-5 rounded-xl bg-white/3 border border-white/8"><h3 className="text-sm font-semibold text-white mb-4">Audience Retention</h3><div className="space-y-2.5">{dropOff.map(d=>(<div key={d.label} className="flex items-center gap-3"><span className="text-xs text-white/30 w-36 shrink-0">{d.label}</span><div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${d.pct}%`,background:d.pct>60?"#7C3AED":d.pct>40?"#9333EA":"#C026D3"}}/></div><span className="text-xs text-white/50 w-10 text-right">{d.pct}%</span></div>))}</div></div><div className="p-5 rounded-xl bg-white/3 border border-white/8"><h3 className="text-sm font-semibold text-white mb-4">Recent Registrations</h3><div className="space-y-2">{[{name:"Sarah M.",email:"sarah@example.com",time:"2 hours ago",completed:true},{name:"Marcus T.",email:"marcus@example.com",time:"4 hours ago",completed:false},{name:"Jennifer K.",email:"jen@example.com",time:"6 hours ago",completed:true},{name:"David R.",email:"david@example.com",time:"8 hours ago",completed:true}].map(r=>(<div key={r.email} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"><div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-semibold text-purple-400">{r.name.charAt(0)}</div><div><p className="text-xs font-medium text-white/70">{r.name}</p><p className="text-[10px] text-white/30">{r.email}</p></div></div><div className="flex items-center gap-3"><span className={`text-[10px] px-2 py-0.5 rounded-full ${r.completed?"bg-green-500/15 text-green-400":"bg-white/5 text-white/30"}`}>{r.completed?"Completed":"Watching"}</span><span className="text-[10px] text-white/25">{r.time}</span></div></div>))}</div></div></div></div>);
}

// ── Registration Tab ───────────────────────────────────────────────
function RegistrationTab(){
  const [regMode,setRegMode]=useState<"platform"|"embed">("platform");
  const [tyMode,setTyMode]=useState<"platform"|"embed">("platform");
  return(<div className="flex-1 overflow-y-auto p-6"><div className="max-w-3xl mx-auto space-y-6">{[{title:"Registration page",mode:regMode,setMode:setRegMode},{title:"Thank you page",mode:tyMode,setMode:setTyMode}].map(({title,mode,setMode})=>(<div key={title} className="rounded-xl bg-white/3 border border-white/8 overflow-hidden"><div className="px-6 py-5 border-b border-white/5"><h3 className="text-base font-semibold text-white text-center">{title}</h3><div className="flex items-center justify-center gap-4 mt-3"><span className={`text-xs ${mode==="platform"?"text-white":"text-white/30"}`}>Build on our platform</span><Toggle value={mode==="embed"} onChange={v=>setMode(v?"embed":"platform")}/><span className={`text-xs ${mode==="embed"?"text-white":"text-white/30"}`}>Embed on your site</span></div></div>{mode==="embed"?(<div className="p-8 flex flex-col items-center justify-center min-h-40" style={{background:"linear-gradient(135deg,#4F6EF7,#3451D1)"}}><h4 className="text-lg font-bold text-white text-center">Embed a widget on your site or funnel</h4><div className="mt-4 bg-white/10 rounded-lg px-5 py-2 text-white text-sm font-medium cursor-pointer hover:bg-white/20">Open embed builder →</div></div>):(<div className="p-8 flex flex-col items-center justify-center min-h-40" style={{background:"linear-gradient(135deg,#059669,#047857)"}}><h4 className="text-lg font-bold text-white text-center">Build and host your {title.toLowerCase()} on our platform</h4><button className="mt-4 bg-white text-green-700 font-semibold text-sm px-5 py-2 rounded-lg hover:bg-white/90">Open page builder →</button></div>)}</div>))}<div className="rounded-xl bg-white/3 border border-white/8 p-6"><h3 className="text-sm font-semibold text-white mb-4">Registration form preview</h3><div className="bg-white rounded-xl p-6 max-w-sm mx-auto shadow-xl"><p className="text-xs text-gray-500 text-center mb-1">Next session in:</p><div className="flex justify-center gap-4 mb-4">{[["0","days"],["0","hours"],["13","minutes"],["57","seconds"]].map(([n,l])=>(<div key={l} className="text-center"><p className="text-2xl font-bold text-gray-900">{n}</p><p className="text-xs text-gray-400">{l}</p></div>))}</div><input placeholder="First Name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-2 focus:outline-none focus:border-blue-500"/><input placeholder="Email" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-3 focus:outline-none focus:border-blue-500"/><button className="w-full bg-blue-600 text-white font-bold text-sm py-3 rounded-lg">REGISTER NOW</button></div></div></div></div>);
}

// ── Main Page ──────────────────────────────────────────────────────
const TABS=[{key:"watch",label:"Watch Room",icon:PlayCircle},{key:"settings",label:"Settings",icon:Settings2},{key:"analytics",label:"Analytics",icon:BarChart2},{key:"registration",label:"Registration",icon:ClipboardList}];

export default function EvergreenRoomPage(){
  const params=useParams();
  const slug=String((params as any)?.slug||"default");
  const [activeTab,setActiveTab]=useState("watch");
  const [viewerCount,setViewerCount]=useState(MOCK_WEBINAR.viewerCountMin);
  const [saved,setSaved]=useState(false);
  const [videoSource,setVideoSource]=useState<VideoSource|null>(null);
  const [simChats,setSimChats]=useState<SimChat[]>([]);
  const [videoDuration,setVideoDuration]=useState(0);
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{
    const vs=loadLS<VideoSource|null>(`wf-video-${slug}`,null);if(vs)setVideoSource(vs);
    const sc=loadLS<SimChat[]>(`wf-chats-${slug}`,[]);if(sc.length>0)setSimChats(sc);
    const dur=loadLS<number>(`wf-duration-${slug}`,0);if(dur>0)setVideoDuration(dur);
    setLoaded(true);
  },[slug]);

  const handleVideoDuration=(d:number)=>{
    if(d===videoDuration||d<=0)return;
    setVideoDuration(d);saveLS(`wf-duration-${slug}`,d);
    if(simChats.length>0){const r=rescaleSimChats(simChats,d);setSimChats(r);saveLS(`wf-chats-${slug}`,r);}
  };

  useEffect(()=>{const i=setInterval(()=>{setViewerCount(p=>{const d=Math.floor(Math.random()*10)-3;return Math.max(MOCK_WEBINAR.viewerCountMin,Math.min(MOCK_WEBINAR.viewerCountMax,p+d));});},5000);return()=>clearInterval(i);},[]);
  useEffect(()=>{return()=>{if(videoSource?.type==="upload")URL.revokeObjectURL(videoSource.url);};},[videoSource]);

  if(!loaded)return(<div className="h-screen bg-[#06060f] flex items-center justify-center"><div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"/></div>);

  return(
    <div className="h-screen bg-[#06060f] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/20 flex-shrink-0">
        <div className="flex-1 min-w-0 mr-4"><h1 className="text-sm font-semibold text-white truncate">{MOCK_WEBINAR.title}</h1><p className="text-xs text-white/30 mt-0.5">with {MOCK_WEBINAR.presenter}</p></div>
        <div className="flex items-center gap-3 flex-shrink-0"><div className="flex items-center gap-1.5 text-xs text-white/50"><div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/><Users className="w-3 h-3"/><span>{viewerCount} watching</span></div><Badge className="bg-red-500/15 text-red-400 border-red-500/20 text-xs">LIVE</Badge></div>
      </div>
      <div className="flex items-center px-6 border-b border-white/5 bg-black/10 flex-shrink-0">
        {TABS.map(tab=>(<button key={tab.key} onClick={()=>setActiveTab(tab.key)} className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-all ${activeTab===tab.key?"border-purple-500 text-white":"border-transparent text-white/30 hover:text-white/60 hover:border-white/10"}`}><tab.icon className="w-3.5 h-3.5"/>{tab.label}</button>))}
        <div className="ml-auto flex items-center gap-2 py-2">
          {saved&&<span className="text-green-400 text-xs font-medium">✓ Saved</span>}
          <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);}} className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg">Save changes</button>
          <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:border-white/20 text-white/40 hover:text-white text-xs font-medium rounded-lg"><Globe className="w-3 h-3"/>Preview</a>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {activeTab==="watch"&&<WatchRoomTab videoSource={videoSource} simChats={simChats} videoDuration={videoDuration>0?videoDuration:MOCK_WEBINAR.durationSeconds} onVideoDuration={handleVideoDuration}/>}
        {activeTab==="settings"&&<SettingsTab slug={slug} videoSource={videoSource} onVideoSourceChange={setVideoSource} simChats={simChats} onSimChatsChange={setSimChats} videoDuration={videoDuration} onVideoDuration={handleVideoDuration}/>}
        {activeTab==="analytics"&&<AnalyticsTab/>}
        {activeTab==="registration"&&<RegistrationTab/>}
      </div>
    </div>
  );
}
