"use client"

import { useState } from "react"

type Message = {
  id: string
  role: "user" | "ai" | "agent"
  content: string
  time: string
  read: boolean
}

type Conversation = {
  id: string
  contact: string
  email: string
  phone: string
  channel: "sms" | "email" | "chat" | "instagram" | "facebook" | "whatsapp"
  status: "open" | "ai" | "closed" | "pending"
  lastMessage: string
  time: string
  unread: number
  tags: string[]
  messages: Message[]
  aiEnabled: boolean
  source: string
}

const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    contact: "Sarah Mitchell",
    email: "sarah@example.com",
    phone: "+1 (555) 201-4532",
    channel: "chat",
    status: "ai",
    lastMessage: "I am interested in your coaching program. Can you tell me more?",
    time: "2m ago",
    unread: 3,
    tags: ["hot-lead", "coaching"],
    source: "Website Chat",
    aiEnabled: true,
    messages: [
      { id: "1", role: "user", content: "Hi! I saw your webinar and I am really interested in working with you.", time: "10:02 AM", read: true },
      { id: "2", role: "ai", content: "Hi Sarah! Thanks so much for reaching out and watching the webinar. I am the AI assistant for this business. I would love to help you learn more about our coaching program! What specific results are you looking to achieve?", time: "10:02 AM", read: true },
      { id: "3", role: "user", content: "I am a life coach and I want to get more high-ticket clients. I have been struggling with lead generation.", time: "10:04 AM", read: true },
      { id: "4", role: "ai", content: "That is exactly what our program is designed for! We have helped over 500 coaches just like you land high-ticket clients using our automated webinar system. Our clients typically see their first qualified lead within 7 days. Would you like to book a free strategy call to see if we are a good fit?", time: "10:04 AM", read: true },
      { id: "5", role: "user", content: "I am interested in your coaching program. Can you tell me more?", time: "10:06 AM", read: false },
    ],
  },
  {
    id: "2",
    contact: "James Rodriguez",
    email: "james@bizco.com",
    phone: "+1 (555) 334-8821",
    channel: "sms",
    status: "open",
    lastMessage: "What is the price for the pro plan?",
    time: "15m ago",
    unread: 1,
    tags: ["pricing"],
    source: "SMS",
    aiEnabled: true,
    messages: [
      { id: "1", role: "user", content: "Hey I saw your ad. What is the price for the pro plan?", time: "9:45 AM", read: true },
      { id: "2", role: "ai", content: "Hey James! Great question. Our Pro plan is $297/month and includes unlimited webinar funnels, AI presenter tools, email + SMS automation, and priority support. We also have an Early Bird lifetime deal for just $49 one-time — but that closes soon. Want me to send you the details?", time: "9:45 AM", read: false },
    ],
  },
  {
    id: "3",
    contact: "Maria Thompson",
    email: "maria@coaching.co",
    phone: "+1 (555) 887-2210",
    channel: "email",
    status: "pending",
    lastMessage: "Can I schedule a demo call?",
    time: "1h ago",
    unread: 0,
    tags: ["demo", "warm-lead"],
    source: "Email",
    aiEnabled: false,
    messages: [
      { id: "1", role: "user", content: "Hello, I came across WebinarForge AI and I am very interested. Can I schedule a demo call with someone from your team?", time: "9:00 AM", read: true },
    ],
  },
  {
    id: "4",
    contact: "David Chen",
    email: "david@saas.io",
    phone: "+1 (555) 443-9902",
    channel: "instagram",
    status: "closed",
    lastMessage: "Thanks! I just signed up.",
    time: "3h ago",
    unread: 0,
    tags: ["converted"],
    source: "Instagram DM",
    aiEnabled: true,
    messages: [
      { id: "1", role: "user", content: "Hey I saw your reel about AI webinars. Does this work for SaaS?", time: "7:30 AM", read: true },
      { id: "2", role: "ai", content: "Absolutely David! WebinarForge AI works great for SaaS — many of our users run automated demo webinars that convert cold traffic into trial signups. Our SaaS clients typically see 20-30% conversion rates on demo funnels. Want to see a case study?", time: "7:31 AM", read: true },
      { id: "3", role: "user", content: "Yes please!", time: "7:32 AM", read: true },
      { id: "4", role: "ai", content: "Here you go — one of our SaaS clients went from 3% to 22% demo-to-trial conversion using our automated webinar system. I am going to send you the link to get started. Our Early Bird offer is $49 one-time and closes soon!", time: "7:32 AM", read: true },
      { id: "5", role: "user", content: "Thanks! I just signed up.", time: "7:45 AM", read: true },
    ],
  },
  {
    id: "5",
    contact: "Ashley Williams",
    email: "ashley@fitpro.com",
    phone: "+1 (555) 221-7743",
    channel: "facebook",
    status: "ai",
    lastMessage: "Do you offer payment plans?",
    time: "30m ago",
    unread: 2,
    tags: ["payment", "objection"],
    source: "Facebook Messenger",
    aiEnabled: true,
    messages: [
      { id: "1", role: "user", content: "Hi! I love what you are doing but the price is a bit much for me right now.", time: "9:30 AM", read: true },
      { id: "2", role: "ai", content: "Hi Ashley! I totally understand — and honestly that is exactly why we created the Early Bird deal. Instead of $97/month, you can get lifetime access for just $49 one-time. That is less than a single month and you never pay again. Does that help?", time: "9:31 AM", read: true },
      { id: "3", role: "user", content: "Oh wow that is much better! Do you offer payment plans?", time: "9:32 AM", read: false },
    ],
  },
]

const CHANNEL_ICONS: Record<string, string> = {
  sms: "📱",
  email: "📧",
  chat: "💬",
  instagram: "📸",
  facebook: "👤",
  whatsapp: "💚",
}

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ai: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  closed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
}

const AI_RESPONSES = [
  "Great question! Let me help you with that. Our system is designed specifically to handle this situation and get you the best results possible.",
  "I understand your concern. Many of our clients had the same question before they started. Here is what I can tell you...",
  "That is a fantastic point! Based on what you have shared, I think our program would be a perfect fit for your goals.",
  "I would love to help you explore this further. Can I ask — what is your biggest challenge right now when it comes to getting clients?",
  "Absolutely! We have helped hundreds of businesses in your exact situation. Would you like me to share a quick case study?",
]

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>(SAMPLE_CONVERSATIONS)
  const [activeConvo, setActiveConvo] = useState<Conversation>(SAMPLE_CONVERSATIONS[0])
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [aiTyping, setAiTyping] = useState(false)
  const [activeTab, setActiveTab] = useState<"conversations" | "ai-config" | "widget">("conversations")

  // AI Config state
  const [aiName, setAiName] = useState("Aria")
  const [aiPersonality, setAiPersonality] = useState("professional")
  const [aiGoal, setAiGoal] = useState("qualify")
  const [aiGreeting, setAiGreeting] = useState("Hi there! I am Aria, your AI assistant. How can I help you today?")
  const [businessName, setBusinessName] = useState("WebinarForge AI")
  const [businessDesc, setBusinessDesc] = useState("We help coaches and consultants automate their webinar funnels and get more clients on autopilot.")
  const [bookingUrl, setBookingUrl] = useState("https://calendly.com/yourlink")
  const [aiEnabled, setAiEnabled] = useState(true)

  // Widget config state
  const [widgetColor, setWidgetColor] = useState("#8B5CF6")
  const [widgetPosition, setWidgetPosition] = useState("bottom-right")
  const [widgetGreeting, setWidgetGreeting] = useState("👋 Hi! How can we help you today?")
  const [widgetName, setWidgetName] = useState("WebinarForge AI Support")
  const [copied, setCopied] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return
    setSending(true)

    const newMsg: Message = {
      id: Date.now().toString(),
      role: "agent",
      content: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
    }

    const updated = conversations.map((c) =>
      c.id === activeConvo.id
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: message, unread: 0 }
        : c
    )
    setConversations(updated)
    const updatedActive = { ...activeConvo, messages: [...activeConvo.messages, newMsg], lastMessage: message, unread: 0 }
    setActiveConvo(updatedActive)
    setMessage("")
    setSending(false)
  }

  const triggerAIResponse = async () => {
    setAiTyping(true)
    await new Promise((r) => setTimeout(r, 1500))

    const aiMsg: Message = {
      id: Date.now().toString(),
      role: "ai",
      content: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
    }

    const updated = conversations.map((c) =>
      c.id === activeConvo.id
        ? { ...c, messages: [...c.messages, aiMsg], lastMessage: aiMsg.content }
        : c
    )
    setConversations(updated)
    setActiveConvo({ ...activeConvo, messages: [...activeConvo.messages, aiMsg] })
    setAiTyping(false)
  }

  const toggleAI = (convoId: string) => {
    const updated = conversations.map((c) =>
      c.id === convoId ? { ...c, aiEnabled: !c.aiEnabled, status: !c.aiEnabled ? "ai" : "open" } : c
    ) as Conversation[]
    setConversations(updated)
    if (activeConvo.id === convoId) {
      setActiveConvo({ ...activeConvo, aiEnabled: !activeConvo.aiEnabled })
    }
  }

  const filteredConvos = conversations.filter((c) => {
    const matchFilter = filter === "all" || c.status === filter || c.channel === filter
    const matchSearch = c.contact.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const widgetCode = `<!-- WebinarForge AI Chat Widget -->
<script>
  window.WFConfig = {
    businessName: "${widgetName}",
    greeting: "${widgetGreeting}",
    color: "${widgetColor}",
    position: "${widgetPosition}",
    aiEnabled: ${aiEnabled},
    aiName: "${aiName}",
    bookingUrl: "${bookingUrl}"
  };
  var s = document.createElement('script');
  s.src = 'https://webinarforge.ai/widget/chat.js';
  document.head.appendChild(s);
</script>
<!-- End WebinarForge AI Chat Widget -->`

  const copyCode = () => {
    navigator.clipboard.writeText(widgetCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">

      {/* TOP NAV */}
      <header className="border-b border-white/10 bg-[#050505] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Conversations</h1>
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            {[
              { id: "conversations", label: "💬 Inbox" },
              { id: "ai-config", label: "🤖 AI Config" },
              { id: "widget", label: "⚙️ Widget Builder" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === id ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${aiEnabled ? "bg-green-400 animate-pulse" : "bg-gray-500"}`} />
            <span className={aiEnabled ? "text-green-400" : "text-gray-500"}>
              AI {aiEnabled ? "Active" : "Paused"}
            </span>
          </div>
          <button
            onClick={() => setAiEnabled(!aiEnabled)}
            className={`w-12 h-6 rounded-full transition-colors ${aiEnabled ? "bg-green-600" : "bg-white/10"}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${aiEnabled ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>
      </header>

      {/* ── INBOX TAB ── */}
      {activeTab === "conversations" && (
        <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 73px)" }}>

          {/* SIDEBAR */}
          <div className="w-80 flex-shrink-0 border-r border-white/10 bg-[#050505] flex flex-col">

            {/* Search & Filter */}
            <div className="p-4 border-b border-white/10 space-y-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition"
              />
              <div className="flex gap-2 flex-wrap">
                {["all", "open", "ai", "pending", "closed"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${filter === f ? "bg-purple-600 text-white" : "bg-white/5 text-gray-400 hover:text-white"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 p-3 border-b border-white/10">
              {[
                { label: "Open", value: conversations.filter(c => c.status === "open").length, color: "text-blue-400" },
                { label: "AI", value: conversations.filter(c => c.status === "ai").length, color: "text-purple-400" },
                { label: "Pending", value: conversations.filter(c => c.status === "pending").length, color: "text-yellow-400" },
                { label: "Closed", value: conversations.filter(c => c.status === "closed").length, color: "text-gray-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center bg-white/5 rounded-xl p-2">
                  <div className={`text-lg font-black ${color}`}>{value}</div>
                  <div className="text-xs text-gray-600">{label}</div>
                </div>
              ))}
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConvos.map((convo) => (
                <div
                  key={convo.id}
                  onClick={() => setActiveConvo(convo)}
                  className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition ${activeConvo.id === convo.id ? "bg-purple-600/10 border-l-2 border-l-purple-500" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {convo.contact[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-white truncate">{convo.contact}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">{CHANNEL_ICONS[convo.channel]}</span>
                          <span className="text-xs text-gray-500">{convo.source}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-xs text-gray-500">{convo.time}</span>
                      {convo.unread > 0 && (
                        <span className="bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                          {convo.unread}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 truncate mb-2">{convo.lastMessage}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs border px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[convo.status]}`}>
                      {convo.status === "ai" ? "🤖 AI Handling" : convo.status}
                    </span>
                    {convo.tags.slice(0, 1).map((tag) => (
                      <span key={tag} className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN CHAT AREA */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* Chat Header */}
            <div className="border-b border-white/10 bg-[#080808] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center font-bold">
                  {activeConvo.contact[0]}
                </div>
                <div>
                  <h3 className="font-bold text-white">{activeConvo.contact}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{CHANNEL_ICONS[activeConvo.channel]} {activeConvo.source}</span>
                    <span>📧 {activeConvo.email}</span>
                    <span>📱 {activeConvo.phone}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400 text-xs">AI</span>
                  <button
                    onClick={() => toggleAI(activeConvo.id)}
                    className={`w-10 h-5 rounded-full transition-colors ${activeConvo.aiEnabled ? "bg-purple-600" : "bg-white/10"}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-0.5 ${activeConvo.aiEnabled ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
                <button
                  onClick={() => setShowAIPanel(!showAIPanel)}
                  className="border border-purple-500/50 hover:border-purple-500 text-purple-400 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                >
                  🤖 AI Panel
                </button>
                <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none">
                  <option>Open</option>
                  <option>Pending</option>
                  <option>Closed</option>
                </select>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">

              {/* Messages */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {activeConvo.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                      {msg.role === "user" && (
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-1">
                          {activeConvo.contact[0]}
                        </div>
                      )}
                      <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-white/10 text-white rounded-tl-none"
                          : msg.role === "ai"
                          ? "bg-purple-600/20 border border-purple-500/30 text-white rounded-tr-none"
                          : "bg-blue-600/20 border border-blue-500/30 text-white rounded-tr-none"
                      }`}>
                        {(msg.role === "ai" || msg.role === "agent") && (
                          <p className="text-xs font-bold mb-1 opacity-60">
                            {msg.role === "ai" ? `🤖 ${aiName} (AI)` : "👤 You (Agent)"}
                          </p>
                        )}
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className="text-xs opacity-40 mt-1">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                  {aiTyping && (
                    <div className="flex justify-end">
                      <div className="bg-purple-600/20 border border-purple-500/30 rounded-2xl rounded-tr-none px-4 py-3">
                        <p className="text-xs font-bold mb-1 opacity-60">🤖 {aiName} (AI)</p>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-white/10 p-4">
                  {activeConvo.aiEnabled && (
                    <div className="flex items-center gap-2 mb-3 bg-purple-500/10 border border-purple-500/30 rounded-xl px-3 py-2">
                      <span className="text-purple-400 text-xs">🤖</span>
                      <p className="text-xs text-purple-300">AI is handling this conversation. Type to take over as agent.</p>
                      <button onClick={triggerAIResponse} className="ml-auto text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded-lg transition">
                        Trigger AI Reply
                      </button>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-end gap-3">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                        placeholder="Type a message... (Enter to send)"
                        rows={2}
                        className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-600 focus:outline-none resize-none"
                      />
                      <div className="flex gap-2 flex-shrink-0">
                        <button className="text-gray-500 hover:text-white transition">📎</button>
                        <button className="text-gray-500 hover:text-white transition">😊</button>
                      </div>
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!message.trim() || sending}
                      className="bg-purple-600 hover:bg-purple-700 px-5 rounded-2xl font-semibold transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {sending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : "Send →"}
                    </button>
                  </div>
                </div>
              </div>

              {/* AI PANEL */}
              {showAIPanel && (
                <div className="w-72 border-l border-white/10 bg-[#050505] flex flex-col overflow-y-auto">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="font-bold text-purple-400 mb-1">🤖 AI Assistant</h3>
                    <p className="text-xs text-gray-500">AI insights and suggested replies</p>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Lead Score */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-2">Lead Score</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-white/10 rounded-full h-3">
                          <div className="h-3 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full" style={{ width: "78%" }} />
                        </div>
                        <span className="text-green-400 font-black">78%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Hot lead — ready to buy</p>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-3">Contact Info</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="text-white">{activeConvo.contact}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Source</span><span className="text-white">{activeConvo.source}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Channel</span><span className="text-white capitalize">{activeConvo.channel}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`capitalize text-xs border px-2 py-0.5 rounded-full ${STATUS_COLORS[activeConvo.status]}`}>{activeConvo.status}</span></div>
                      </div>
                    </div>

                    {/* AI Suggested Replies */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-3">Suggested Replies</p>
                      <div className="space-y-2">
                        {[
                          "Would you like to book a free 15-minute strategy call?",
                          "Our Early Bird deal closes soon — shall I send you the link?",
                          "I can answer any questions you have about the program!",
                        ].map((reply) => (
                          <button
                            key={reply}
                            onClick={() => setMessage(reply)}
                            className="w-full text-left text-xs bg-black/40 border border-white/10 hover:border-purple-500 rounded-xl p-3 text-gray-300 transition"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-3">Quick Actions</p>
                      <div className="space-y-2">
                        {[
                          { label: "📅 Send Booking Link", action: () => setMessage(bookingUrl) },
                          { label: "💰 Send Pricing", action: () => setMessage("Here is our pricing: Early Bird $49 one-time or Pro at $297/month. Which works best for you?") },
                          { label: "📋 Send Lead Form", action: () => setMessage("I am sending you a quick form to get you started: https://webinarforge.ai/forms") },
                          { label: "🔄 Add to CRM", action: () => {} },
                        ].map(({ label, action }) => (
                          <button key={label} onClick={action}
                            className="w-full text-left text-xs bg-black/40 border border-white/10 hover:border-purple-500 rounded-xl px-3 py-2 text-gray-300 transition">
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── AI CONFIG TAB ── */}
      {activeTab === "ai-config" && (
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Conversation AI Configuration</h2>
            <p className="text-gray-400">Train your AI to handle conversations, qualify leads, book appointments, and close sales automatically.</p>
          </div>

          {/* AI Toggle */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">AI Conversation Handling</h3>
              <p className="text-gray-400 text-sm">When enabled, AI responds to all new conversations automatically</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={aiEnabled ? "text-green-400 text-sm font-semibold" : "text-gray-500 text-sm"}>
                {aiEnabled ? "Active" : "Paused"}
              </span>
              <button onClick={() => setAiEnabled(!aiEnabled)}
                className={`w-14 h-7 rounded-full transition-colors ${aiEnabled ? "bg-green-600" : "bg-white/10"}`}>
                <div className={`w-6 h-6 bg-white rounded-full transition-transform mx-0.5 ${aiEnabled ? "translate-x-7" : "translate-x-0"}`} />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* AI Identity */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-purple-400">AI Identity</h3>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">AI Assistant Name</label>
                <input type="text" value={aiName} onChange={(e) => setAiName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Personality</label>
                <select value={aiPersonality} onChange={(e) => setAiPersonality(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                  <option value="professional">Professional & Helpful</option>
                  <option value="friendly">Friendly & Casual</option>
                  <option value="aggressive">Direct & Sales-focused</option>
                  <option value="empathetic">Empathetic & Supportive</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Opening Greeting</label>
                <textarea value={aiGreeting} onChange={(e) => setAiGreeting(e.target.value)} rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition resize-none" />
              </div>
            </div>

            {/* Business Context */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-purple-400">Business Context</h3>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Business Name</label>
                <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">What You Do</label>
                <textarea value={businessDesc} onChange={(e) => setBusinessDesc(e.target.value)} rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition resize-none" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Booking / Calendar URL</label>
                <input type="url" value={bookingUrl} onChange={(e) => setBookingUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition" />
              </div>
            </div>
          </div>

          {/* AI Goals */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-purple-400 mb-4">AI Conversation Goals</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { id: "qualify", icon: "🎯", title: "Qualify Leads", desc: "Ask qualifying questions and score leads automatically" },
                { id: "book", icon: "📅", title: "Book Appointments", desc: "Send calendar links and confirm bookings via chat" },
                { id: "sell", icon: "💰", title: "Close Sales", desc: "Handle objections and send payment links automatically" },
                { id: "support", icon: "🛟", title: "Answer FAQs", desc: "Handle common questions without human intervention" },
                { id: "nurture", icon: "🔄", title: "Nurture Leads", desc: "Follow up automatically over time until they are ready" },
                { id: "collect", icon: "📋", title: "Collect Info", desc: "Gather name, email, phone and other lead details" },
              ].map(({ id, icon, title, desc }) => (
                <div key={id} onClick={() => setAiGoal(id)}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${aiGoal === id ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-white/5 hover:border-purple-500/50"}`}>
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Knowledge Base */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-purple-400 mb-2">AI Knowledge Base</h3>
            <p className="text-gray-400 text-sm mb-4">Add FAQs, pricing, objection handlers, and product info the AI will use in conversations.</p>
            <textarea
              placeholder={`Add your FAQ and product knowledge here. Examples:\n\nQ: What is the price?\nA: Our Early Bird deal is $49 one-time. Pro is $297/month.\n\nQ: Do you offer a guarantee?\nA: Yes — 30-day money back guarantee, no questions asked.\n\nQ: How fast will I see results?\nA: Most clients see their first lead within 7 days.`}
              rows={8}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 focus:outline-none focus:border-purple-500 transition resize-none text-sm"
            />
          </div>

          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition">
            Save AI Configuration →
          </button>
        </div>
      )}

      {/* ── WIDGET BUILDER TAB ── */}
      {activeTab === "widget" && (
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">Chat Widget Builder</h2>
            <p className="text-gray-400">Customize your chat widget and embed it on any website in minutes.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">

            {/* Config */}
            <div className="space-y-5">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-purple-400">Widget Settings</h3>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Widget Name / Business</label>
                  <input type="text" value={widgetName} onChange={(e) => setWidgetName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Greeting Message</label>
                  <input type="text" value={widgetGreeting} onChange={(e) => setWidgetGreeting(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Widget Position</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "bottom-right", label: "Bottom Right" },
                      { id: "bottom-left", label: "Bottom Left" },
                      { id: "top-right", label: "Top Right" },
                      { id: "top-left", label: "Top Left" },
                    ].map(({ id, label }) => (
                      <button key={id} onClick={() => setWidgetPosition(id)}
                        className={`py-2 rounded-xl border text-sm font-semibold transition ${widgetPosition === id ? "border-purple-500 bg-purple-500/10 text-white" : "border-white/10 bg-white/5 text-gray-400"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Brand Color</label>
                  <div className="flex flex-wrap gap-3">
                    {["#8B5CF6", "#3B82F6", "#10B981", "#F97316", "#EF4444", "#EC4899", "#F59E0B", "#6366F1"].map((c) => (
                      <button key={c} onClick={() => setWidgetColor(c)} title={c}
                        className={`w-9 h-9 rounded-full border-4 transition ${widgetColor === c ? "border-white scale-110" : "border-transparent"}`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Embed Code */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold">Embed Code</h3>
                    <p className="text-xs text-gray-500">Paste before closing body tag</p>
                  </div>
                  <button onClick={copyCode}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-sm font-semibold transition">
                    {copied ? "✅ Copied!" : "📋 Copy Code"}
                  </button>
                </div>
                <div className="bg-black/60 rounded-xl p-4 overflow-x-auto">
                  <pre className="text-xs text-green-400 whitespace-pre-wrap">{widgetCode}</pre>
                </div>
              </div>

              {/* Platform Instructions */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="font-bold mb-3">Add to Your Site</h3>
                <div className="space-y-2">
                  {[
                    { p: "WordPress", i: "🌐", t: "Appearance → Theme Editor → footer.php before </body>" },
                    { p: "ClickFunnels", i: "⚡", t: "Settings → Tracking Code → Body Tracking Code" },
                    { p: "GoHighLevel", i: "🔥", t: "Sites → Funnels → Settings → Header/Footer Scripts" },
                    { p: "Shopify", i: "🛍️", t: "Online Store → Themes → Edit Code → theme.liquid" },
                    { p: "Wix", i: "🔷", t: "Settings → Custom Code → Add to all pages → Body" },
                    { p: "Webflow", i: "🌊", t: "Project Settings → Custom Code → Footer Code" },
                  ].map(({ p, i, t }) => (
                    <div key={p} className="flex items-start gap-3 bg-black/40 rounded-xl p-3">
                      <span className="text-lg">{i}</span>
                      <div>
                        <p className="font-semibold text-xs text-white">{p}</p>
                        <p className="text-xs text-gray-400">{t}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Widget Preview */}
            <div className="lg:sticky lg:top-4 h-fit">
              <p className="text-xs text-gray-500 uppercase font-bold mb-3">Live Preview</p>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden relative" style={{ height: "600px" }}>

                {/* Fake website background */}
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-3" />
                  <div className="h-3 bg-gray-300 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-300 rounded w-1/2 mb-6" />
                  <div className="h-32 bg-gray-300 rounded-xl mb-4" />
                  <div className="h-3 bg-gray-300 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                </div>

                {/* Chat Widget */}
                <div className={`absolute ${widgetPosition.includes("bottom") ? "bottom-4" : "top-4"} ${widgetPosition.includes("right") ? "right-4" : "left-4"}`}>

                  {/* Chat Popup */}
                  <div className="bg-white rounded-2xl shadow-2xl w-72 mb-3 overflow-hidden">
                    <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: widgetColor }}>
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {widgetName[0]}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{widgetName}</p>
                        <p className="text-white/70 text-xs">● Online</p>
                      </div>
                      <button className="ml-auto text-white/70 hover:text-white">✕</button>
                    </div>
                    <div className="p-4 bg-gray-50">
                      <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm max-w-[85%]">
                        <p className="text-xs text-gray-800">{widgetGreeting}</p>
                        <p className="text-xs text-gray-400 mt-1">Just now</p>
                      </div>
                    </div>
                    <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
                      <input
                        readOnly
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-xs text-gray-400 focus:outline-none cursor-default"
                      />
                      <button className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm" style={{ backgroundColor: widgetColor }}>
                        →
                      </button>
                    </div>
                  </div>

                  {/* Chat Button */}
                  <div className={`flex ${widgetPosition.includes("right") ? "justify-end" : "justify-start"}`}>
                    <button
                      className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white text-2xl"
                      style={{ backgroundColor: widgetColor }}
                    >
                      💬
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
