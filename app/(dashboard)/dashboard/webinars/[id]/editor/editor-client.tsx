<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>WebinarForge AI – Script Editor</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:ital,wght@0,300;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0d0f0e;
    --sidebar-bg: #111312;
    --panel: #161a18;
    --border: #1f2421;
    --border-light: #263029;
    --text: #d4dbd5;
    --text-dim: #5a6b5d;
    --text-muted: #3a4a3d;
    --green: #3ddc84;
    --green-dim: #2a9e5e;
    --green-glow: rgba(61,220,132,0.12);
    --green-glow2: rgba(61,220,132,0.06);
    --accent: #a8f5c2;
    --red: #ff6b6b;
    --yellow: #f5c842;
    --editor-bg: #13161400;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    overflow: hidden;
  }

  /* ── Sidebar ── */
  .sidebar {
    width: 200px;
    min-width: 200px;
    background: var(--sidebar-bg);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 0;
    position: relative;
    z-index: 10;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 18px 20px;
    border-bottom: 1px solid var(--border);
  }

  .logo-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    box-shadow: 0 0 16px rgba(124,58,237,0.35);
  }

  .logo-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    letter-spacing: 0.01em;
  }

  .logo-text span { color: var(--green); }

  nav {
    flex: 1;
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 20px;
    font-size: 13px;
    color: var(--text-dim);
    cursor: pointer;
    transition: all 0.15s;
    border-left: 2px solid transparent;
    font-weight: 400;
  }

  .nav-item:hover { color: var(--text); background: rgba(255,255,255,0.025); }
  .nav-item.active {
    color: var(--green);
    background: var(--green-glow2);
    border-left-color: var(--green);
  }

  .nav-icon { font-size: 13px; opacity: 0.7; width: 16px; text-align: center; }

  .sidebar-footer {
    padding: 14px 16px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .account {
    display: flex; align-items: center; gap: 9px;
    cursor: pointer;
  }

  .avatar {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; color: white; font-weight: 600;
  }

  .account-name { font-size: 12.5px; color: var(--text-dim); }

  /* ── Main ── */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--bg);
    position: relative;
  }

  /* subtle background texture */
  .main::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 40% at 70% 10%, rgba(61,220,132,0.04) 0%, transparent 60%),
      radial-gradient(ellipse 40% 50% at 20% 80%, rgba(79,70,229,0.04) 0%, transparent 60%);
    pointer-events: none;
  }

  /* ── Topbar ── */
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 40px 18px;
    position: relative;
    z-index: 2;
  }

  .page-title {
    font-family: 'Fraunces', serif;
    font-size: 26px;
    font-weight: 300;
    color: var(--text);
    letter-spacing: -0.02em;
  }

  .topbar-actions { display: flex; align-items: center; gap: 10px; }

  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px;
    border-radius: 7px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.18s;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.01em;
  }

  .btn-primary {
    background: var(--green);
    color: #0a1a0f;
    box-shadow: 0 0 20px rgba(61,220,132,0.25);
  }
  .btn-primary:hover {
    background: #5ef5a0;
    box-shadow: 0 0 30px rgba(61,220,132,0.4);
    transform: translateY(-1px);
  }
  .btn-primary:active { transform: translateY(0); }

  .btn-ghost {
    background: transparent;
    color: var(--text-dim);
    border: 1px solid var(--border-light);
  }
  .btn-ghost:hover {
    background: var(--panel);
    color: var(--text);
    border-color: var(--text-muted);
  }

  /* ── Editor area ── */
  .editor-wrap {
    flex: 1;
    padding: 0 40px 32px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow: hidden;
    position: relative;
    z-index: 2;
  }

  /* ── Toolbar ── */
  .toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    flex-wrap: wrap;
  }

  .toolbar-sep {
    width: 1px; height: 18px;
    background: var(--border-light);
    margin: 0 4px;
  }

  .tb-btn {
    padding: 5px 10px;
    border-radius: 5px;
    border: none;
    background: transparent;
    color: var(--text-dim);
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.12s;
    white-space: nowrap;
  }
  .tb-btn:hover { background: var(--border); color: var(--text); }
  .tb-btn.active { background: var(--green-glow); color: var(--green); }

  .tb-icon { font-style: normal; font-size: 13px; }

  .toolbar-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }

  .word-count {
    font-size: 11.5px;
    color: var(--text-muted);
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.02em;
  }

  .gen-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 14px;
    background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.2));
    border: 1px solid rgba(124,58,237,0.35);
    border-radius: 6px;
    color: #a78bfa;
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
  }
  .gen-btn:hover {
    background: linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.3));
    box-shadow: 0 0 16px rgba(124,58,237,0.2);
  }

  /* ── Script editor ── */
  .script-container {
    flex: 1;
    display: flex;
    gap: 0;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--panel);
    position: relative;
  }

  /* Line numbers */
  .line-numbers {
    width: 44px;
    min-width: 44px;
    background: var(--sidebar-bg);
    border-right: 1px solid var(--border);
    padding: 20px 0;
    overflow: hidden;
    border-radius: 12px 0 0 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  .line-num {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-muted);
    line-height: 1.7;
    padding: 0 8px;
    width: 100%;
    text-align: right;
    user-select: none;
  }

  .line-num.active { color: var(--green); }

  /* Editor */
  .editor-inner {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  #script-editor {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 20px 24px;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 13.5px;
    line-height: 1.7;
    resize: none;
    width: 100%;
    height: 100%;
    caret-color: var(--green);
    overflow-y: auto;
  }

  #script-editor::placeholder {
    color: var(--text-muted);
    font-style: italic;
    font-family: 'Fraunces', serif;
    font-size: 14px;
  }

  #script-editor::-webkit-scrollbar { width: 6px; }
  #script-editor::-webkit-scrollbar-track { background: transparent; }
  #script-editor::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 3px; }
  #script-editor::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

  /* ── Sidebar panel (right) ── */
  .right-panel {
    width: 240px;
    min-width: 240px;
    border-left: 1px solid var(--border);
    background: var(--sidebar-bg);
    border-radius: 0 12px 12px 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .right-panel-header {
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    font-size: 11px;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .section-item {
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    border-bottom: 1px solid var(--border);
    transition: background 0.12s;
  }

  .section-item:hover { background: rgba(255,255,255,0.02); }

  .section-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .section-info { flex: 1; overflow: hidden; }
  .section-name {
    font-size: 12px;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
  }
  .section-meta { font-size: 10.5px; color: var(--text-muted); font-family: 'DM Mono', monospace; margin-top: 1px; }

  .rp-footer {
    margin-top: auto;
    padding: 14px 16px;
    border-top: 1px solid var(--border);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .stat-box {
    background: var(--border);
    border-radius: 7px;
    padding: 10px;
    text-align: center;
  }

  .stat-val {
    font-family: 'Fraunces', serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--green);
    display: block;
    line-height: 1;
  }

  .stat-label {
    font-size: 10px;
    color: var(--text-muted);
    margin-top: 4px;
    display: block;
    letter-spacing: 0.05em;
  }

  /* ── Empty state ── */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 16px;
    opacity: 0;
    animation: fadeIn 0.5s 0.2s forwards;
  }

  @keyframes fadeIn {
    to { opacity: 1; }
  }

  .empty-icon {
    width: 56px; height: 56px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(61,220,132,0.1), rgba(79,70,229,0.1));
    border: 1px solid var(--border-light);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
  }

  .empty-title {
    font-family: 'Fraunces', serif;
    font-size: 16px;
    font-weight: 300;
    color: var(--text-dim);
  }

  .empty-sub {
    font-size: 12.5px;
    color: var(--text-muted);
    text-align: center;
    max-width: 200px;
    line-height: 1.6;
  }

  .empty-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    padding: 0 20px;
  }

  .empty-btn {
    width: 100%;
    padding: 9px 14px;
    border-radius: 7px;
    border: 1px solid var(--border-light);
    background: transparent;
    color: var(--text-dim);
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
  }

  .empty-btn:hover { background: var(--panel); color: var(--text); border-color: var(--text-muted); }

  .empty-btn.primary-empty {
    background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.15));
    border-color: rgba(124,58,237,0.3);
    color: #a78bfa;
  }

  .empty-btn.primary-empty:hover {
    background: linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.25));
    box-shadow: 0 0 20px rgba(124,58,237,0.15);
  }

  /* ── Generation modal overlay ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
  }

  .modal-overlay.open { opacity: 1; pointer-events: all; }

  .modal {
    background: var(--panel);
    border: 1px solid var(--border-light);
    border-radius: 14px;
    padding: 28px;
    width: 440px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
    transform: translateY(10px) scale(0.98);
    transition: transform 0.2s;
  }

  .modal-overlay.open .modal { transform: translateY(0) scale(1); }

  .modal-title {
    font-family: 'Fraunces', serif;
    font-size: 20px;
    font-weight: 300;
    color: var(--text);
    margin-bottom: 6px;
  }

  .modal-sub { font-size: 12.5px; color: var(--text-muted); margin-bottom: 22px; line-height: 1.5; }

  .modal label {
    display: block;
    font-size: 11.5px;
    color: var(--text-dim);
    margin-bottom: 6px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .modal input, .modal textarea, .modal select {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border-light);
    border-radius: 7px;
    padding: 10px 12px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    outline: none;
    margin-bottom: 16px;
    transition: border-color 0.15s;
  }

  .modal input:focus, .modal textarea:focus, .modal select:focus { border-color: var(--green-dim); }
  .modal textarea { resize: vertical; min-height: 80px; }
  .modal select { appearance: none; cursor: pointer; }
  .modal select option { background: var(--panel); }

  .modal-row { display: flex; gap: 12px; }
  .modal-row > div { flex: 1; }

  .modal-actions { display: flex; gap: 10px; margin-top: 4px; }
  .modal-actions .btn { flex: 1; justify-content: center; }

  /* Generating animation */
  .generating {
    display: none;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: var(--green-glow);
    border: 1px solid rgba(61,220,132,0.2);
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .generating.active { display: flex; }

  .gen-dots {
    display: flex; gap: 4px; align-items: center;
  }

  .gen-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--green);
    animation: bounce 1.2s infinite;
  }

  .gen-dot:nth-child(2) { animation-delay: 0.15s; }
  .gen-dot:nth-child(3) { animation-delay: 0.3s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }

  .gen-text { font-size: 12.5px; color: var(--green); }

  /* ── Status bar ── */
  .status-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 40px;
    border-top: 1px solid var(--border);
    font-size: 11px;
    color: var(--text-muted);
    font-family: 'DM Mono', monospace;
    position: relative;
    z-index: 2;
  }

  .status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--text-muted);
  }

  .status-dot.saved { background: var(--green); box-shadow: 0 0 8px rgba(61,220,132,0.5); }

  /* ── Saved toast ── */
  .toast {
    position: fixed;
    bottom: 28px;
    right: 28px;
    background: var(--green);
    color: #0a1a0f;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 20px rgba(61,220,132,0.35);
    transform: translateY(60px);
    opacity: 0;
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 200;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .toast.show { transform: translateY(0); opacity: 1; }
</style>
</head>
<body>

<!-- Sidebar -->
<aside class="sidebar">
  <div class="logo">
    <div class="logo-icon">⚡</div>
    <div class="logo-text">WebinarForge <span>AI</span></div>
  </div>
  <nav>
    <div class="nav-item"><span class="nav-icon">⊞</span> Dashboard</div>
    <div class="nav-item"><span class="nav-icon">◈</span> Webinars</div>
    <div class="nav-item"><span class="nav-icon">▦</span> Templates</div>
    <div class="nav-item"><span class="nav-icon">⊕</span> Evergreen Rooms</div>
    <div class="nav-item active"><span class="nav-icon">✦</span> AI Presenters</div>
    <div class="nav-item"><span class="nav-icon">↗</span> Analytics</div>
    <div class="nav-item"><span class="nav-icon">⊛</span> Affiliates</div>
    <div class="nav-item"><span class="nav-icon">⟡</span> Integrations</div>
    <div class="nav-item"><span class="nav-icon">▭</span> Billing</div>
  </nav>
  <div class="sidebar-footer">
    <div class="account">
      <div class="avatar">A</div>
      <span class="account-name">Account</span>
    </div>
    <span style="color:var(--text-muted);font-size:14px;cursor:pointer;">⚙</span>
  </div>
</aside>

<!-- Main -->
<main class="main">
  <!-- Topbar -->
  <div class="topbar">
    <h1 class="page-title">Webinar Script Editor</h1>
    <div class="topbar-actions">
      <button class="btn btn-primary" onclick="saveScript()">Save</button>
      <button class="btn btn-ghost" onclick="goBack()">← Back</button>
    </div>
  </div>

  <!-- Editor wrap -->
  <div class="editor-wrap">
    <!-- Toolbar -->
    <div class="toolbar" id="toolbar" style="display:none">
      <button class="tb-btn" onclick="fmt('bold')"><i class="tb-icon"><b>B</b></i></button>
      <button class="tb-btn" onclick="fmt('italic')"><i class="tb-icon"><em>I</em></i></button>
      <button class="tb-btn" onclick="fmt('underline')"><i class="tb-icon"><u>U</u></i></button>
      <div class="toolbar-sep"></div>
      <button class="tb-btn" id="btn-intro" onclick="insertSection('Intro')">+ Intro</button>
      <button class="tb-btn" onclick="insertSection('Hook')">+ Hook</button>
      <button class="tb-btn" onclick="insertSection('Main Content')">+ Main Content</button>
      <button class="tb-btn" onclick="insertSection('CTA')">+ CTA</button>
      <button class="tb-btn" onclick="insertSection('Q&A')">+ Q&A</button>
      <div class="toolbar-sep"></div>
      <button class="tb-btn" onclick="insertSection('Close')">+ Close</button>
      <div class="toolbar-right">
        <span class="word-count" id="word-count">0 words · 0 min</span>
        <button class="gen-btn" onclick="openModal()">✦ Generate with AI</button>
      </div>
    </div>

    <!-- Script container -->
    <div class="script-container" id="script-container">
      <!-- Empty state -->
      <div class="empty-state" id="empty-state">
        <div class="empty-icon">✦</div>
        <div class="empty-title">No script yet</div>
        <div class="empty-sub">Generate a script with AI or start writing from scratch.</div>
        <div class="empty-actions">
          <button class="empty-btn primary-empty" onclick="openModal()">✦ Generate with AI</button>
          <button class="empty-btn" onclick="startBlank()">✎ Write from scratch</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Status bar -->
  <div class="status-bar" id="status-bar" style="display:none">
    <div class="status-dot" id="status-dot"></div>
    <span id="status-text">Unsaved changes</span>
    <span style="color:var(--border-light)">·</span>
    <span id="status-cursor">Ln 1, Col 1</span>
    <span style="color:var(--border-light)">·</span>
    <span>DM Mono · UTF-8</span>
  </div>
</main>

<!-- Modal -->
<div class="modal-overlay" id="modal" onclick="closeModalOutside(event)">
  <div class="modal">
    <div class="modal-title">Generate Script with AI</div>
    <div class="modal-sub">Fill in the details below and let WebinarForge AI craft a compelling webinar script for you.</div>

    <div class="generating" id="generating">
      <div class="gen-dots">
        <div class="gen-dot"></div>
        <div class="gen-dot"></div>
        <div class="gen-dot"></div>
      </div>
      <span class="gen-text">Generating your script…</span>
    </div>

    <label>Webinar Topic</label>
    <input type="text" id="topic" placeholder="e.g. How to scale a SaaS product to $1M ARR">

    <label>Target Audience</label>
    <input type="text" id="audience" placeholder="e.g. Early-stage founders, B2B marketers">

    <label>Key Message / Goal</label>
    <textarea id="goal" placeholder="e.g. Convince attendees to start a free trial of our platform"></textarea>

    <div class="modal-row">
      <div>
        <label>Duration</label>
        <select id="duration">
          <option>30 minutes</option>
          <option selected>45 minutes</option>
          <option>60 minutes</option>
          <option>90 minutes</option>
        </select>
      </div>
      <div>
        <label>Tone</label>
        <select id="tone">
          <option>Professional</option>
          <option selected>Conversational</option>
          <option>Educational</option>
          <option>Inspirational</option>
        </select>
      </div>
    </div>

    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="generateScript()">✦ Generate Script</button>
    </div>
  </div>
</div>

<!-- Toast -->
<div class="toast" id="toast">✓ Script saved</div>

<script>
  let hasScript = false;
  let saveTimeout = null;
  let isEditorMode = false;

  function buildEditor() {
    const container = document.getElementById('script-container');
    container.innerHTML = `
      <div class="line-numbers" id="line-numbers"></div>
      <div class="editor-inner">
        <textarea id="script-editor" placeholder="Start writing your webinar script…" spellcheck="true"></textarea>
      </div>
      <div class="right-panel">
        <div class="right-panel-header">Script Sections</div>
        <div id="sections-list"></div>
        <div class="rp-footer">
          <div class="stats-grid">
            <div class="stat-box">
              <span class="stat-val" id="stat-words">0</span>
              <span class="stat-label">Words</span>
            </div>
            <div class="stat-box">
              <span class="stat-val" id="stat-min">0</span>
              <span class="stat-label">Min est.</span>
            </div>
            <div class="stat-box">
              <span class="stat-val" id="stat-sections">0</span>
              <span class="stat-label">Sections</span>
            </div>
            <div class="stat-box">
              <span class="stat-val" id="stat-lines">0</span>
              <span class="stat-label">Lines</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('toolbar').style.display = 'flex';
    document.getElementById('status-bar').style.display = 'flex';
    isEditorMode = true;

    const editor = document.getElementById('script-editor');
    editor.addEventListener('input', onEditorChange);
    editor.addEventListener('keyup', onEditorChange);
    editor.addEventListener('click', updateCursor);
    editor.addEventListener('keyup', updateCursor);
    updateLineNumbers();
  }

  function onEditorChange() {
    const editor = document.getElementById('script-editor');
    const text = editor.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;
    const minutes = Math.ceil(words / 130);
    const sections = (text.match(/^#+\s.+/gm) || []).length;

    if (document.getElementById('word-count'))
      document.getElementById('word-count').textContent = `${words} words · ${minutes} min`;
    if (document.getElementById('stat-words')) {
      document.getElementById('stat-words').textContent = words;
      document.getElementById('stat-min').textContent = minutes;
      document.getElementById('stat-sections').textContent = sections;
      document.getElementById('stat-lines').textContent = lines;
    }

    updateLineNumbers();
    updateSections(text);
    markUnsaved();
  }

  function updateLineNumbers() {
    const editor = document.getElementById('script-editor');
    const lnEl = document.getElementById('line-numbers');
    if (!editor || !lnEl) return;
    const lines = editor.value.split('\n').length;
    let html = '';
    for (let i = 1; i <= Math.max(lines, 20); i++) {
      html += `<div class="line-num">${i}</div>`;
    }
    lnEl.innerHTML = html;
  }

  function updateSections(text) {
    const list = document.getElementById('sections-list');
    if (!list) return;
    const headers = text.match(/^#+\s.+/gm) || [];
    const colors = ['#3ddc84','#60a5fa','#f59e0b','#f472b6','#a78bfa','#34d399'];
    if (!headers.length) {
      list.innerHTML = '<div style="padding:16px;font-size:12px;color:var(--text-muted);text-align:center">No sections yet</div>';
      return;
    }
    list.innerHTML = headers.map((h, i) => {
      const name = h.replace(/^#+\s/, '');
      const level = h.match(/^#+/)[0].length;
      const color = colors[i % colors.length];
      return `<div class="section-item">
        <div class="section-dot" style="background:${color}"></div>
        <div class="section-info">
          <div class="section-name">${name}</div>
          <div class="section-meta">H${level} · Section ${i+1}</div>
        </div>
      </div>`;
    }).join('');
  }

  function updateCursor() {
    const editor = document.getElementById('script-editor');
    if (!editor) return;
    const text = editor.value.substring(0, editor.selectionStart);
    const lines = text.split('\n');
    const ln = lines.length;
    const col = lines[lines.length-1].length + 1;
    const el = document.getElementById('status-cursor');
    if (el) el.textContent = `Ln ${ln}, Col ${col}`;
  }

  function markUnsaved() {
    const dot = document.getElementById('status-dot');
    const txt = document.getElementById('status-text');
    if (dot) { dot.className = 'status-dot'; }
    if (txt) txt.textContent = 'Unsaved changes';
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(autoSave, 2000);
  }

  function autoSave() {
    const dot = document.getElementById('status-dot');
    const txt = document.getElementById('status-text');
    if (dot) dot.className = 'status-dot saved';
    if (txt) txt.textContent = 'Auto-saved';
  }

  function saveScript() {
    autoSave();
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  function goBack() { history.back(); }

  function startBlank() {
    buildEditor();
    hasScript = true;
    setTimeout(() => {
      const editor = document.getElementById('script-editor');
      if (editor) editor.focus();
    }, 50);
  }

  function insertSection(name) {
    const editor = document.getElementById('script-editor');
    if (!editor) return;
    const pos = editor.selectionStart;
    const before = editor.value.substring(0, pos);
    const after = editor.value.substring(pos);
    const nl = before.length && !before.endsWith('\n') ? '\n\n' : '';
    const insert = `${nl}## ${name}\n\n`;
    editor.value = before + insert + after;
    editor.selectionStart = editor.selectionEnd = pos + insert.length;
    editor.focus();
    onEditorChange();
    markUnsaved();
  }

  function fmt(command) {
    document.execCommand(command);
  }

  // Modal
  function openModal() {
    document.getElementById('modal').classList.add('open');
  }

  function closeModal() {
    document.getElementById('modal').classList.remove('open');
    document.getElementById('generating').classList.remove('active');
  }

  function closeModalOutside(e) {
    if (e.target === document.getElementById('modal')) closeModal();
  }

  function generateScript() {
    const topic = document.getElementById('topic').value.trim();
    if (!topic) {
      document.getElementById('topic').style.borderColor = '#ff6b6b';
      document.getElementById('topic').focus();
      return;
    }
    document.getElementById('topic').style.borderColor = '';

    const audience = document.getElementById('audience').value || 'General audience';
    const goal = document.getElementById('goal').value || 'Educate and engage';
    const duration = document.getElementById('duration').value;
    const tone = document.getElementById('tone').value;

    document.getElementById('generating').classList.add('active');

    setTimeout(() => {
      closeModal();
      if (!isEditorMode) buildEditor();

      setTimeout(() => {
        const editor = document.getElementById('script-editor');
        if (!editor) return;

        const script = buildScript(topic, audience, goal, duration, tone);
        typeScript(editor, script);
      }, 100);
    }, 1800);
  }

  function buildScript(topic, audience, goal, duration, tone) {
    return `# ${topic}
Audience: ${audience} · Duration: ${duration} · Tone: ${tone}

---

## Introduction (0:00 – 2:00)

Welcome, everyone! I'm thrilled you've carved out time to join us today.

My name is [Your Name], and over the next ${duration}, we're going to dive deep into ${topic}.

Before we get started — if you're here to ${goal.toLowerCase()}, you're in exactly the right place.

Quick housekeeping: keep your questions coming in the chat. We'll have a dedicated Q&A at the end, and I read every single one.

---

## Hook (2:00 – 5:00)

Let me start with a question: what if everything you knew about this topic was only half the picture?

Here's a story. Last year, one of our clients was struggling with exactly the challenges facing ${audience}. They tried everything. Nothing stuck — until they discovered the framework we're sharing today.

Within 90 days, results shifted dramatically. That's what we're going to give you the roadmap to today.

---

## Problem & Context (5:00 – 15:00)

Let's ground ourselves in the real challenge here.

${audience} are facing three critical friction points right now:

**1. Lack of clarity** — Most people don't have a clear north star for this area.
**2. Information overload** — There's too much noise, not enough signal.
**3. Execution gaps** — The gap between knowing and doing remains massive.

You're not alone in this. Research shows that 78% of people in this space face these exact blockers. The good news? They're all solvable.

---

## Main Content (15:00 – 35:00)

Here's the core framework — I call it the **3-Phase System**.

### Phase 1: Foundation

Before anything else, we need to establish the right foundation. This means:
- Auditing what's working and what isn't
- Defining your north star metric
- Removing the obstacles that are slowing you down

**Action step:** Grab a piece of paper. Write down your #1 goal for the next 90 days.

### Phase 2: Execution

Once the foundation is solid, execution becomes almost automatic. The key is:
- Building repeatable systems, not one-off efforts
- Measuring what matters — and ignoring what doesn't
- Creating feedback loops that help you course-correct fast

### Phase 3: Scale

This is where ${audience} typically get stuck. Scaling isn't about doing more — it's about doing the right things with leverage.

We'll cover the specific levers that move the needle most for your situation.

---

## Case Study (35:00 – 42:00)

Let me share a real example. [Client/Company Name] came to us 6 months ago. They were exactly where many of you are right now.

Here's what changed:
- They implemented Phase 1 in week one
- Saw early signals within 30 days
- Scaled confidently by month 3

This isn't magic. It's method.

---

## Call to Action (42:00 – 44:00)

Here's what I want you to do next.

${goal}.

We've made it easy to get started — and I want to make sure everyone on this call has the opportunity to take the next step.

**[Your specific CTA here]**

This offer is available for webinar attendees only, so take action today.

---

## Q&A (44:00 – 48:00)

Let's open it up. I can see questions coming in — let's work through as many as we can.

[Read and answer top questions from chat]

---

## Close (48:00 – 50:00)

Thank you so much for being here today. Your time is valuable and I don't take that lightly.

Remember: the biggest difference between where you are and where you want to be is the decision to start.

You have everything you need. Go make it happen.

Until next time — take care.`;
  }

  function typeScript(el, text) {
    el.value = '';
    let i = 0;
    const speed = 4;
    const chunk = 12;

    function type() {
      if (i < text.length) {
        el.value += text.slice(i, i + chunk);
        i += chunk;
        el.scrollTop = el.scrollHeight;
        onEditorChange();
        setTimeout(type, speed);
      } else {
        el.value = text;
        onEditorChange();
        markUnsaved();
      }
    }
    type();
  }
</script>
</body>
</html>
