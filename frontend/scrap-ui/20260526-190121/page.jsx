"use client";

import { motion } from "framer-motion";
import { useSettings } from "../context/SettingsContext";

function TopStrip() {
  return (
    <div className="venom-top-strip">
      <div className="venom-brand">
        <span className="venom-logo-box" />
        <span>VENOM_AI</span>
      </div>

      <div className="venom-top-center">
        <div className="venom-search">FIND_NODE...</div>
        <button>DOCS</button>
        <button>CHANGELOG</button>
      </div>

      <div className="venom-top-right">◎</div>
    </div>
  );
}

function LeftRail() {
  const links = ["DASHBOARD", "CHAT", "MEMORY", "SETTINGS"];

  return (
    <aside className="venom-left-rail">
      <div className="venom-nav-list">
        {links.map((label, index) => (
          <button key={label} className={`venom-nav-item ${index === 0 ? "active" : ""}`}>
            <span className="venom-nav-icon" />
            {label}
          </button>
        ))}
      </div>

      <div className="venom-rail-bottom">
        <button className="venom-ghost-btn">+ NEW_SESSION</button>
        <div className="venom-stable">● SYS_STABLE</div>
      </div>
    </aside>
  );
}

function SystemHealth() {
  return (
    <section className="venom-panel">
      <div className="venom-panel-head">
        <span><i className="dot" /> SYSTEM_HEALTH_INDEX</span>
        <span>UPTIME: 104:22:12</span>
      </div>
      <div className="venom-health-grid">
        <div>
          <label>LATENCY</label>
          <h3>24<span>MS</span></h3>
        </div>
        <div>
          <label>THROUGHPUT</label>
          <h3>1.2<span>GB/S</span></h3>
        </div>
        <div>
          <label>NODE_DISTRIBUTION</label>
          <h3>82%<span>LOCAL</span></h3>
        </div>
      </div>
    </section>
  );
}

function PreviewPanel() {
  return (
    <section className="venom-panel venom-preview">
      <div className="venom-panel-head">
        <span>REPOS_INTEL_PREVIEW</span>
        <span className="green-dot" />
      </div>
      <div className="venom-preview-body">
        <h1>Repository intelligence,</h1>
        <h2>without the noise.</h2>
      </div>
    </section>
  );
}

function PersonalityCore() {
  const { personalityMode, setPersonalityMode } = useSettings();
  const modes = ["SARCASTIC", "FRIENDLY", "PROFESSIONAL", "CHAOS"];

  return (
    <section className="venom-panel">
      <div className="venom-panel-head">
        <span>PERSONALITY_CORE</span>
        <span>◌</span>
      </div>

      <div className="venom-card-line">
        <div>
          <p>{personalityMode.toUpperCase()}_MODE</p>
          <small>ACTIVE_CYNICISM</small>
        </div>
        <span className="venom-toggle" />
      </div>

      <label className="venom-mini-label">VERBAL_DENSITY</label>
      <input type="range" min="0" max="100" defaultValue="68" className="venom-range" />

      <div className="venom-mode-grid">
        {modes.map((mode) => (
          <button key={mode} onClick={() => setPersonalityMode(mode.charAt(0) + mode.slice(1).toLowerCase())} className={personalityMode.toUpperCase() === mode ? "active" : ""}>
            {mode}
          </button>
        ))}
      </div>

      <p className="venom-quote">"Oh look, another query. I was just starting to enjoy the silence of your incompetence."</p>
    </section>
  );
}

function CurrentThread() {
  return (
    <section className="venom-panel">
      <div className="venom-panel-head">
        <span>CURRENT_THREAD</span>
      </div>
      <div className="venom-thread">
        <span className="venom-thread-icon">▣</span>
        <div>
          <p>OPTIMIZING_LOGIC_GATES</p>
          <small>PID: 9022 // RECURSIVE</small>
        </div>
      </div>
    </section>
  );
}

function MemoryNodes() {
  const rows = [
    ["14:02:11", "EXPLAIN QUANTUM ENTANGLEMENT LIKE I'M FIVE.", "COMPLETED"],
    ["13:58:45", "SEARCH LOCAL FILES FOR ENCRYPTED KEYS.", "REFUSED"],
    ["13:45:00", "INTERNAL ROUTINE: OPTIMIZED KERNEL MEMORY ALLOCATION.", "SYSTEM"],
  ];

  return (
    <section className="venom-panel venom-memory">
      <div className="venom-panel-head">
        <span>◔ MEMORY_NODES</span>
        <button className="venom-ghost-btn small">WIPE_BUFFER</button>
      </div>

      <div className="venom-memory-table">
        {rows.map(([time, text, state]) => (
          <div key={`${time}-${state}`} className="venom-memory-row">
            <span>{time}</span>
            <span className="msg"><i className="green-dot" /> {text}</span>
            <span className="state">{state}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function BottomTelemetry() {
  return (
    <footer className="venom-bottom-strip">
      <span>● LATENCY: 24MS</span>
      <span>⌂ PRIVACY: PERSISTED_LOCAL</span>
      <span>V2.4.1-STABLE</span>
    </footer>
  );
}

export default function HomePage() {
  return (
    <main className="venom-shell">
      <div className="venom-grid-bg" />

      <TopStrip />

      <div className="venom-main">
        <LeftRail />

        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="venom-content">
          <div className="venom-upper-grid">
            <div className="left-stack">
              <SystemHealth />
              <PreviewPanel />
            </div>
            <div className="right-stack">
              <PersonalityCore />
              <CurrentThread />
            </div>
          </div>

          <MemoryNodes />
        </motion.section>
      </div>

      <BottomTelemetry />
    </main>
  );
}
