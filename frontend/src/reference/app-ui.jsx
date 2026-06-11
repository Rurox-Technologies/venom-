import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon, VenomMark, Pill, Waveform } from "./components";
const PERSONALITIES = {
  sarcastic: { name: "Sarcastic", tag: "venom.core", color: "oklch(0.7 0.22 295)",
    desc: "Dry, sharp, allergic to small talk.",
    opener: "Oh hey, another genius with a question. Hit me." },
  friendly: { name: "Friendly", tag: "warm.core", color: "oklch(0.78 0.16 75)",
    desc: "Encouraging, casual, your best teammate.",
    opener: "Hey! Glad you're here. What are we figuring out today?" },
  professional: { name: "Professional", tag: "exec.core", color: "oklch(0.8 0.12 200)",
    desc: "Precise, formal, ready for execs.",
    opener: "Good day. How may I assist with your workflow this morning?" },
  chaos: { name: "Chaos", tag: "rogue.core", color: "oklch(0.7 0.25 25)",
    desc: "Maximum entropy. You asked for this.",
    opener: "WAKE UP SAMURAI WE'VE GOT A QUESTION TO ANSWER. or whatever. fire it." },
};

const PROVIDERS = {
  cloud:  { label: "Cloud",  sub: "OpenRouter",        models: ["claude-haiku-4-5", "gpt-5o", "gemini-flash-2.5", "deepseek-r2", "llama-405b"] },
  local:  { label: "Local",  sub: "Ollama · on-device", models: ["llama-3.1-8b", "qwen-2.5-7b", "mistral-nemo", "phi-4-mini"] },
  hybrid: { label: "Hybrid", sub: "Auto-routed",       models: ["adaptive"] },
};

// Sample conversation seed data
const SEED_CHATS = [
  { id: "c1", title: "Refactor the auth middleware", preview: "Let me read the new express route…", time: "12:08", pinned: true,
    messages: [
      { role: "user", text: "Refactor the auth middleware — it's a mess and the JWT verify is duplicated 3 places." },
      { role: "assistant", text: "Three duplicates, classic. Pull the verify into `lib/auth/verifyJwt.ts`, export a single `requireUser(req)` helper, and replace the three call sites with that. Want me to draft the file?" },
      { role: "user", text: "yes please" },
      { role: "assistant", text: "Drafting. Quick clarifier — should the helper *throw* on bad token (cleanest) or return `{ user, error }`? Different blast radius." },
    ] },
  { id: "c2", title: "Italian phrases for Rome trip", preview: "Sure — start with these 12 high-leverage ones…", time: "Yesterday",
    messages: [
      { role: "user", text: "I'm going to Rome next week. Give me 12 phrases that punch above their weight." },
      { role: "assistant", text: "Twelve, ranked by ROI:\n\n1. *Un caffè, per favore.* — espresso, polite, instantly Italian.\n2. *Scusi, dov'è…?* — excuse me, where is…?\n3. *Vorrei…* — I would like… (use everywhere)\n4. *Quanto costa?* — how much?\n5. *Il conto, grazie.* — the check, thanks.\n…want the other seven?" },
    ] },
  { id: "c3", title: "Why is my Postgres slow", preview: "First check: do you have an index on…", time: "Yesterday",
    messages: [
      { role: "user", text: "Why is my Postgres query slow? It's a join across 4 tables." },
      { role: "assistant", text: "EXPLAIN ANALYZE it and paste the plan — guessing without it is astrology. But the usual suspects: missing index on the join keys, sequential scan on a big table, or a bad join order from outdated stats. Run `ANALYZE` recently?" },
    ] },
  { id: "c4", title: "Weekend recipe — orecchiette", preview: "Toast the breadcrumbs first…", time: "Sat" },
  { id: "c5", title: "OKRs for Q2", preview: "Three objectives, four KRs each…", time: "Apr 18" },
];

// ─── Sidebar ─────────────────────────────────────────────────────────
function Sidebar({ chats, activeId, onSelect, onNew, onDelete, personality, setPersonality, onHome }) {
  return (
    <aside style={{
      width: 280,
      borderRight: "1px solid var(--border)",
      background: "oklch(0.115 0.012 280 / 0.85)",
      backdropFilter: "blur(10px)",
      display: "flex", flexDirection: "column",
      flexShrink: 0,
    }}>
      <div style={{ padding: "18px 16px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onHome} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <VenomMark size={22} />
        </button>
        <Pill tone="purple" style={{ fontSize: 9 }}>v0.9</Pill>
      </div>

      <div style={{ padding: "0 12px 12px", display: "flex", gap: 8 }}>
        <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center", padding: "9px 12px", fontSize: 13 }} onClick={onNew}>
          <Icon name="plus" size={14} /> New chat
        </button>
        <button className="btn" style={{ padding: "9px 10px" }} title="Search">
          <Icon name="search" size={14} />
        </button>
      </div>

      <div style={{
        padding: "8px 16px 6px",
        fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em",
        color: "var(--text-muted)", textTransform: "uppercase",
      }}>Conversations</div>

      <div style={{ flex: 1, overflow: "auto", padding: "0 8px" }}>
        {chats.map(c => {
          const active = c.id === activeId;
          return (
            <button key={c.id} onClick={() => onSelect(c.id)} style={{
              width: "100%", textAlign: "left", display: "block",
              padding: "10px 12px",
              borderRadius: 8,
              marginBottom: 2,
              background: active ? "oklch(0.2 0.04 295 / 0.6)" : "transparent",
              border: active ? "1px solid var(--accent-dim)" : "1px solid transparent",
              position: "relative",
            }}>
              <div style={{
                fontSize: 13, fontWeight: 500,
                color: active ? "var(--text)" : "var(--text-dim)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {c.pinned && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />}
                {c.title}
              </div>
              <div style={{
                fontSize: 11, color: "var(--text-muted)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                marginTop: 2, fontFamily: "var(--font-mono)",
              }}>{c.time} · {c.preview || "…"}</div>
            </button>
          );
        })}
      </div>

      {/* Personality switcher */}
      <div style={{ padding: "12px 12px", borderTop: "1px solid var(--border)" }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em",
          color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8,
        }}>Personality core</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {Object.entries(PERSONALITIES).map(([k, p]) => {
            const active = personality === k;
            return (
              <button key={k} onClick={() => setPersonality(k)} style={{
                padding: "8px 10px",
                borderRadius: 8,
                border: active ? `1px solid ${p.color}` : "1px solid var(--border)",
                background: active ? `color-mix(in oklch, ${p.color} 12%, transparent)` : "transparent",
                textAlign: "left",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, boxShadow: active ? `0 0 8px ${p.color}` : "none" }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: active ? "var(--text)" : "var(--text-dim)" }}>{p.name}</span>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", marginTop: 4, letterSpacing: "0.04em" }}>{p.tag}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* User footer */}
      <div style={{
        padding: "10px 14px", borderTop: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: "linear-gradient(135deg, var(--accent), oklch(0.55 0.2 320))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 12, color: "var(--bg)",
        }}>M</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500 }}>maya</div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>pro · local-first</div>
        </div>
        <button className="btn btn-ghost" style={{ padding: 6 }} title="Settings">
          <Icon name="settings" size={14} />
        </button>
      </div>
    </aside>
  );
}

// ─── Top bar inside chat ─────────────────────────────────────────────
function TopBar({ provider, setProvider, model, setModel, modelOpen, setModelOpen, voiceState, onToggleVoice, privacy, setPrivacy }) {
  return (
    <header style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "12px 22px",
      borderBottom: "1px solid var(--border)",
      background: "oklch(0.13 0.012 280 / 0.7)",
      backdropFilter: "blur(8px)",
      flexShrink: 0,
    }}>
      {/* Provider toggle */}
      <div style={{
        display: "inline-flex",
        padding: 3,
        borderRadius: 8,
        border: "1px solid var(--border-strong)",
        background: "var(--surface)",
      }}>
        {Object.entries(PROVIDERS).map(([k, p]) => (
          <button key={k} onClick={() => setProvider(k)} style={{
            padding: "6px 12px",
            borderRadius: 6,
            fontSize: 12, fontWeight: 500,
            background: provider === k ? "var(--accent)" : "transparent",
            color: provider === k ? "var(--bg)" : "var(--text-dim)",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <Icon name={k === "cloud" ? "cloud" : k === "local" ? "chip" : "sparkle"} size={12} />
            {p.label}
          </button>
        ))}
      </div>

      {/* Model dropdown */}
      <div style={{ position: "relative" }}>
        <button onClick={() => setModelOpen(o => !o)} className="btn" style={{ padding: "7px 12px", fontSize: 12, fontFamily: "var(--font-mono)" }}>
          <span style={{ color: "var(--text-muted)" }}>model:</span>
          <span style={{ color: "var(--accent-bright)" }}>{model}</span>
          <Icon name="chevron-down" size={12} />
        </button>
        {modelOpen && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0,
            minWidth: 240, zIndex: 30,
            border: "1px solid var(--border-strong)",
            background: "var(--surface-solid)",
            borderRadius: 10, padding: 6,
            boxShadow: "0 20px 60px -10px black",
          }}>
            <div style={{ padding: "6px 8px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              {PROVIDERS[provider].sub}
            </div>
            {PROVIDERS[provider].models.map(m => (
              <button key={m} onClick={() => { setModel(m); setModelOpen(false); }} style={{
                width: "100%", textAlign: "left",
                padding: "8px 10px", borderRadius: 6,
                fontFamily: "var(--font-mono)", fontSize: 12,
                color: m === model ? "var(--accent-bright)" : "var(--text-dim)",
                background: m === model ? "oklch(0.2 0.04 295 / 0.5)" : "transparent",
                display: "flex", alignItems: "center", gap: 8,
              }} onMouseEnter={e => { if (m !== model) e.currentTarget.style.background = "oklch(0.2 0.02 280 / 0.6)"; }}
                 onMouseLeave={e => { if (m !== model) e.currentTarget.style.background = "transparent"; }}>
                {m}
                {m === model && <Icon name="check" size={12} style={{ marginLeft: "auto" }} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />

      <button onClick={() => setPrivacy(!privacy)} className="btn" style={{
        padding: "7px 12px", fontSize: 12,
        borderColor: privacy ? "var(--ok)" : "var(--border-strong)",
        color: privacy ? "var(--ok)" : "var(--text-dim)",
      }} title="Privacy mode — pin to local-only">
        <Icon name="shield" size={13} /> Privacy {privacy ? "on" : "off"}
      </button>

      <button onClick={onToggleVoice} className="btn" style={{
        padding: "7px 12px", fontSize: 12,
        borderColor: voiceState !== "off" ? "var(--accent)" : "var(--border-strong)",
        color: voiceState !== "off" ? "var(--accent-bright)" : "var(--text-dim)",
      }}>
        <Icon name={voiceState === "off" ? "mic-off" : "mic"} size={13} />
        Voice {voiceState !== "off" ? "live" : "off"}
      </button>

      <Pill><span className="dot" /> sync ok · ↑38ms</Pill>
    </header>
  );
}

// ─── Message bubble ──────────────────────────────────────────────────
function Message({ msg, personality, isLast, streaming }) {
  const p = PERSONALITIES[personality];
  if (msg.role === "user") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 0" }}>
        <div style={{
          maxWidth: "70%",
          padding: "10px 14px",
          borderRadius: "14px 14px 4px 14px",
          background: "oklch(0.22 0.025 280)",
          border: "1px solid var(--border-strong)",
          fontSize: 14, lineHeight: 1.55,
          whiteSpace: "pre-wrap",
        }}>{msg.text}</div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 12, padding: "12px 0", alignItems: "flex-start" }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: `linear-gradient(135deg, ${p.color}, oklch(0.5 0.2 295))`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 16px -4px ${p.color}`,
      }}>
        <Icon name="thunder" size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>Venom</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em" }}>
            · {p.tag} · {msg.model || "claude-haiku-4-5"} · {msg.provider || "cloud"}
          </span>
        </div>
        <div style={{
          fontSize: 14, lineHeight: 1.65, color: "var(--text)",
          whiteSpace: "pre-wrap",
        }}>
          {msg.text}
          {streaming && isLast && <span className="caret" />}
        </div>
        {!streaming && msg.role === "assistant" && (
          <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
            {["copy", "thunder"].map(i => (
              <button key={i} className="btn btn-ghost" style={{ padding: "4px 8px", fontSize: 11 }}>
                <Icon name={i} size={11} /> {i === "copy" ? "Copy" : "Regenerate"}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Composer ────────────────────────────────────────────────────────
function Composer({ onSend, onVoice, voiceState, busy, suggestions, onSuggest }) {
  const [value, setValue] = useState("");
  const ref = useRef(null);
  const submit = () => {
    const v = value.trim();
    if (!v || busy) return;
    onSend(v); setValue("");
  };
  return (
    <div style={{ padding: "14px 22px 20px" }}>
      {suggestions && suggestions.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => onSuggest(s)} className="btn" style={{ padding: "5px 10px", fontSize: 11, fontFamily: "var(--font-mono)", borderRadius: 999 }}>
              {s}
            </button>
          ))}
        </div>
      )}
      <div style={{
        display: "flex", alignItems: "flex-end", gap: 10,
        padding: 10,
        border: "1px solid var(--border-strong)",
        borderRadius: 14,
        background: "oklch(0.16 0.014 280 / 0.7)",
        backdropFilter: "blur(6px)",
        boxShadow: value ? "0 0 0 1px var(--accent-glow)" : "none",
        transition: "box-shadow 0.2s",
      }}>
        <button onClick={onVoice} title="Voice" style={{
          width: 36, height: 36, borderRadius: 9,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: voiceState === "listening" ? "var(--accent)" : "transparent",
          color: voiceState === "listening" ? "var(--bg)" : "var(--text-dim)",
          border: voiceState === "listening" ? "1px solid var(--accent-bright)" : "1px solid var(--border)",
          animation: voiceState === "listening" ? "glow-pulse 1.6s ease-in-out infinite" : "none",
        }}>
          <Icon name={voiceState === "off" ? "mic-off" : "mic"} size={15} />
        </button>
        <textarea
          ref={ref}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
          }}
          rows={1}
          placeholder='Ask Venom… or say "Hey Venom"'
          style={{
            flex: 1, resize: "none", border: "none", outline: "none",
            background: "transparent", color: "var(--text)",
            fontSize: 14, lineHeight: 1.5, padding: "8px 4px",
            maxHeight: 160, minHeight: 24,
          }}
        />
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>
            ↵ send · ⇧↵ newline
          </span>
          <button onClick={submit} disabled={!value.trim() || busy} className="btn btn-primary" style={{
            padding: "8px 10px",
            opacity: !value.trim() || busy ? 0.4 : 1,
          }}>
            <Icon name="send" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Voice overlay (when listening) ──────────────────────────────────
function VoiceOverlay({ state, onStop, transcript }) {
  if (state === "off") return null;
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 40,
      background: "oklch(0.1 0.01 280 / 0.7)",
      backdropFilter: "blur(14px)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 24,
    }}>
      <div style={{ position: "relative", width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {[1,2,3].map(i => (
          <div key={i} style={{
            position: "absolute",
            width: 220 - i*24, height: 220 - i*24,
            borderRadius: "50%",
            border: "1px solid var(--accent)",
            opacity: 0.35 - i*0.08,
            animation: `glow-pulse 2.5s ease-in-out ${i*0.3}s infinite`,
          }} />
        ))}
        <div style={{
          width: 110, height: 110, borderRadius: "50%",
          background: "radial-gradient(circle, var(--accent), oklch(0.4 0.2 295))",
          boxShadow: "0 0 80px var(--accent-glow)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name={state === "speaking" ? "wave" : "mic"} size={36} />
        </div>
      </div>
      <Waveform active={true} bars={36} />
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.1em",
        color: "var(--text-muted)", textTransform: "uppercase",
      }}>
        {state === "listening" ? "● listening · whisper-v3" : "● venom speaking · piper-en-7"}
      </div>
      <div style={{
        maxWidth: 520, textAlign: "center", fontSize: 18, color: "var(--text)",
        minHeight: 28, lineHeight: 1.4,
      }}>
        {transcript || <span style={{ color: "var(--text-muted)" }}>say something…</span>}
      </div>
      <button onClick={onStop} className="btn">
        <Icon name="stop" size={13} /> Stop
      </button>
    </div>
  );
}

// ─── Memory drawer (right rail) ──────────────────────────────────────
function MemoryRail({ open, personality, model, provider, memorySummary }) {
  const memories = [
    { tag: "summary", text: memorySummary || "No memory summary yet." },
    { tag: "preference", text: "Maya prefers concise replies. No preamble." },
    { tag: "stack", text: "Working in Next.js 15 + Postgres + Drizzle." },
    { tag: "context", text: "Refactoring auth middleware this week." },
    { tag: "language", text: "Studying Italian for Rome trip (28 May)." },
    { tag: "tone", text: "Likes mild sarcasm. Will roll eyes at corporate-speak." },
  ];
  return (
    <aside style={{
      width: open ? 320 : 0,
      flexShrink: 0,
      overflow: "hidden",
      borderLeft: open ? "1px solid var(--border)" : "none",
      background: "oklch(0.115 0.012 280 / 0.85)",
      transition: "width 0.25s ease",
    }}>
      <div style={{ width: 320, padding: 18, display: "flex", flexDirection: "column", gap: 18, height: "100%" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 10 }}>System status</div>
          <div style={{ display: "grid", gap: 6, fontFamily: "var(--font-mono)", fontSize: 11 }}>
            {[
              ["personality", PERSONALITIES[personality].tag, PERSONALITIES[personality].color],
              ["provider", provider, "var(--accent-bright)"],
              ["model", model, "var(--text)"],
              ["uptime", "4h 12m", "var(--text-dim)"],
              ["tokens (24h)", "184,212", "var(--text-dim)"],
            ].map(([k, v, c]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", borderRadius: 6, background: "oklch(0.16 0.014 280 / 0.5)" }}>
                <span style={{ color: "var(--text-muted)" }}>{k}</span>
                <span style={{ color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase" }}>Long-term memory</div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent-bright)" }}>{memories.length} entries</span>
          </div>
          <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
            {memories.map((m, i) => (
              <div key={i} style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "oklch(0.16 0.014 280 / 0.5)",
              }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.08em", color: "var(--accent)", textTransform: "uppercase" }}>{m.tag}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4, lineHeight: 1.5 }}>{m.text}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost" style={{ marginTop: 10, justifyContent: "center", fontSize: 11 }}>
            <Icon name="trash" size={12} /> Clear memory
          </button>
        </div>
      </div>
    </aside>
  );
}

export { Sidebar, TopBar, Message, Composer, VoiceOverlay, MemoryRail, PERSONALITIES, PROVIDERS, SEED_CHATS };
