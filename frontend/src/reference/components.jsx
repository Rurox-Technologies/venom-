import { useState } from "react";

// ─── Icons (inline, original geometric) ──────────────────────────────
function Icon({ name, size = 16, className = "", stroke = 1.6 }) {
  const s = size;
  const props = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", className };
  switch (name) {
    case "send": return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "mic": return <svg {...props}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>;
    case "mic-off": return <svg {...props}><path d="M3 3l18 18M9 9v2a3 3 0 0 0 5.1 2.1M15 9.34V6a3 3 0 0 0-5.94-.6M5 11a7 7 0 0 0 .59 2.79M19 11a7 7 0 0 1-1.66 4.52M12 18v3"/></svg>;
    case "stop": return <svg {...props}><rect x="6" y="6" width="12" height="12" rx="2"/></svg>;
    case "plus": return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case "search": return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "settings": return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case "trash": return <svg {...props}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>;
    case "menu": return <svg {...props}><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
    case "github": return <svg {...props} fill="currentColor" stroke="none"><path d="M12 .5C5.6.5.5 5.6.5 12c0 5 3.3 9.3 7.9 10.8.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.8C23.5 5.6 18.4.5 12 .5z"/></svg>;
    case "cloud": return <svg {...props}><path d="M17.5 19a4.5 4.5 0 0 0 .9-8.9 6 6 0 0 0-11.7 1.4A4 4 0 0 0 7 19h10.5z"/></svg>;
    case "chip": return <svg {...props}><rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>;
    case "shield": return <svg {...props}><path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3z"/></svg>;
    case "wave": return <svg {...props}><path d="M3 12h2l2-7 3 14 3-10 2 6 2-3h4"/></svg>;
    case "brain": return <svg {...props}><path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 1 4 3 3 0 0 0 4 4 3 3 0 0 0 3 1V3zM15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-1 4 3 3 0 0 1-4 4 3 3 0 0 1-3 1"/></svg>;
    case "globe": return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case "command": return <svg {...props}><path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6z"/></svg>;
    case "chevron-down": return <svg {...props}><path d="m6 9 6 6 6-6"/></svg>;
    case "chevron-right": return <svg {...props}><path d="m9 6 6 6-6 6"/></svg>;
    case "copy": return <svg {...props}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>;
    case "check": return <svg {...props}><path d="m5 12 5 5L20 7"/></svg>;
    case "x": return <svg {...props}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case "arrow-right": return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "sparkle": return <svg {...props}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>;
    case "thunder": return <svg {...props} fill="currentColor" stroke="none"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg>;
    case "pause": return <svg {...props}><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>;
    case "play": return <svg {...props}><path d="M6 4l14 8-14 8V4z" fill="currentColor"/></svg>;
    default: return null;
  }
}

// ─── Brand mark: wordmark with thunder glyph ─────────────────────────
function VenomMark({ size = 28 }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: size, height: size,
        borderRadius: 8,
        background: "linear-gradient(135deg, var(--accent), oklch(0.55 0.2 320))",
        boxShadow: "0 0 0 1px var(--border-strong), 0 6px 18px -6px var(--accent-glow)",
      }}>
        <Icon name="thunder" size={size * 0.55} className="" />
      </span>
      <span style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        letterSpacing: "0.18em",
        fontSize: size * 0.55,
      }}>VENOM</span>
    </div>
  );
}

// ─── Pill / Badge ────────────────────────────────────────────────────
function Pill({ children, tone = "default", style = {} }) {
  const dotClass = tone === "purple" ? "dot purple" : tone === "warn" ? "dot warn" : "dot";
  return (
    <span className="pill" style={style}>
      <span className={dotClass} />
      {children}
    </span>
  );
}

// ─── Code block w/ tabs ──────────────────────────────────────────────
function CodeBlock({ tabs, activeTab, onTab, lines }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const text = lines.map(l => l.map(t => t.text).join("")).join("\n");
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div style={{
      border: "1px solid var(--border)",
      background: "oklch(0.12 0.012 280 / 0.7)",
      backdropFilter: "blur(10px)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      fontFamily: "var(--font-mono)",
      fontSize: 13,
    }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", paddingLeft: 8 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => onTab(t)} style={{
            padding: "10px 14px",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.05em",
            color: activeTab === t ? "var(--accent)" : "var(--text-muted)",
            borderBottom: activeTab === t ? "1px solid var(--accent)" : "1px solid transparent",
            marginBottom: -1,
          }}>{t}</button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={copy} title="Copy" style={{
          padding: "0 14px", color: "var(--text-muted)",
        }}>
          <Icon name={copied ? "check" : "copy"} size={14} />
        </button>
      </div>
      <div style={{ padding: "14px 16px", lineHeight: 1.7 }}>
        {lines.map((line, i) => (
          <div key={i}>
            {line.map((tok, j) => (
              <span key={j} style={{ color: tok.color || "var(--text-dim)" }}>{tok.text}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Voice waveform ──────────────────────────────────────────────────
function Waveform({ active = false, bars = 24, color = "var(--accent)" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 28 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} style={{
          display: "inline-block",
          width: 3,
          height: 18,
          borderRadius: 2,
          background: color,
          opacity: active ? 0.9 : 0.25,
          transformOrigin: "center",
          animation: active ? `wave-bar ${0.6 + (i % 5) * 0.12}s ease-in-out ${i * 0.03}s infinite` : "none",
        }} />
      ))}
    </div>
  );
}

// ─── Loading dots ────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 4 }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: "50%",
          background: "var(--accent)",
          animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </span>
  );
}

export { Icon, VenomMark, Pill, CodeBlock, Waveform, ThinkingDots };
