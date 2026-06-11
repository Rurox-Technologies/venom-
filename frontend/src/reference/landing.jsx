import { useEffect, useState } from "react";
import { CodeBlock, Icon, Pill, VenomMark } from "./components";

function Landing({ onLaunch }) {
  const [pkgTab, setPkgTab] = useState("pip");
  const lines = {
    pip: [[{ text: "$ ", color: "var(--accent)" }, { text: "pip install ", color: "var(--text)" }, { text: "venom-ai", color: "var(--accent-bright)" }]],
    docker: [[{ text: "$ ", color: "var(--accent)" }, { text: "docker run ", color: "var(--text)" }, { text: "venom/runtime:latest", color: "var(--accent-bright)" }]],
    curl: [[{ text: "$ ", color: "var(--accent)" }, { text: "curl -fsSL ", color: "var(--text)" }, { text: "venom.sh ", color: "var(--accent-bright)" }, { text: "| sh", color: "var(--text)" }]],
    ollama: [[{ text: "$ ", color: "var(--accent)" }, { text: "ollama pull ", color: "var(--text)" }, { text: "venom:8b", color: "var(--accent-bright)" }]],
  };

  return (
    <div style={{ position: "relative", height: "100%", width: "100%", overflow: "auto" }}>
      <div className="grid-bg" />
      <div className="glow-bg" />

      {/* Top nav */}
      <nav style={{
        position: "relative",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 40px",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(8px)",
        background: "oklch(0.13 0.012 280 / 0.5)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <VenomMark size={28} />
          <span className="pill" style={{ fontSize: 10 }}>
            <span className="dot purple" />v0.9 · public alpha
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 14, color: "var(--text-dim)" }}>
          <a style={{ cursor: "pointer" }}>Docs</a>
          <a style={{ cursor: "pointer" }}>Models</a>
          <a style={{ cursor: "pointer" }}>Personalities</a>
          <a style={{ cursor: "pointer" }}>Changelog</a>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 12px", borderRadius: 8,
            border: "1px solid var(--border-strong)",
            background: "var(--surface)",
            fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)",
          }}>
            <Icon name="search" size={13} /> Search
            <span style={{
              padding: "1px 6px", border: "1px solid var(--border)", borderRadius: 4, fontSize: 10,
            }}>Ctrl+K</span>
          </div>
          <a style={{ cursor: "pointer", color: "var(--text-dim)" }}><Icon name="github" size={18} /></a>
        </div>
      </nav>

      {/* Hero */}
      <main style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1.05fr 1fr",
        gap: 60,
        padding: "70px 80px 40px",
        maxWidth: 1400,
        margin: "0 auto",
      }}>
        {/* Left column */}
        <div>
          <div className="fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "5px 12px 5px 5px",
            borderRadius: 999,
            border: "1px solid var(--border-strong)",
            background: "oklch(0.18 0.02 295 / 0.4)",
            fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.04em",
            color: "var(--text-dim)",
          }}>
            <span style={{
              padding: "2px 8px", borderRadius: 999,
              background: "var(--accent)", color: "var(--bg)",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            }}>NEW</span>
            HYBRID INFERENCE · CLOUD + LOCAL · v0.9
          </div>

          <h1 className="fade-up-d1" style={{
            fontSize: 76,
            fontWeight: 600,
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            margin: "28px 0 0",
            textWrap: "balance",
          }}>
            The personality-<br/>driven AI <span style={{
              background: "linear-gradient(135deg, var(--accent-bright), oklch(0.7 0.2 320))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontStyle: "italic",
              fontWeight: 500,
            }}>operating&nbsp;layer</span>.
          </h1>

          <p className="fade-up-d2" style={{
            fontSize: 17, lineHeight: 1.6,
            color: "var(--text-dim)",
            margin: "26px 0 0",
            maxWidth: 520,
          }}>
            Venom routes between cloud frontier models and on-device inference, remembers
            what matters, and answers in a voice you actually want to hear. Built for the
            command line, the keyboard, and the microphone.
          </p>

          {/* CTA row */}
          <div className="fade-up-d3" style={{ display: "flex", gap: 12, marginTop: 36 }}>
            <button className="btn btn-primary" onClick={onLaunch}>
              Launch Venom <Icon name="arrow-right" size={14} />
            </button>
            <button className="btn">
              <Icon name="github" size={14} /> View on GitHub
            </button>
            <button className="btn btn-ghost">
              Read the docs <Icon name="chevron-right" size={14} />
            </button>
          </div>

          {/* Code block */}
          <div className="fade-up-d4" style={{ marginTop: 44, maxWidth: 560 }}>
            <CodeBlock
              tabs={["pip", "docker", "curl", "ollama"]}
              activeTab={pkgTab}
              onTab={setPkgTab}
              lines={lines[pkgTab]}
            />
          </div>

          {/* Stat bar */}
          <div className="fade-up-d4" style={{
            display: "flex", gap: 28, marginTop: 36,
            paddingTop: 28, borderTop: "1px solid var(--border)",
            maxWidth: 560,
          }}>
            {[
              ["~38ms", "first token, local"],
              ["12+", "open-weight models"],
              ["4", "personality cores"],
              ["100%", "offline-capable"],
            ].map(([n, l]) => (
              <div key={l} style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--text)" }}>{n}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: hero panel */}
        <div className="fade-up-d2" style={{ position: "relative" }}>
          <HeroPanel />
        </div>
      </main>

      {/* Trusted strip */}
      <section style={{
        position: "relative",
        borderTop: "1px solid var(--border)",
        padding: "28px 80px 40px",
        maxWidth: 1400, margin: "40px auto 0",
      }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "var(--text-muted)",
        }}>
          -- Powered by · runs on · plays nice with
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 56, marginTop: 22, flexWrap: "wrap", color: "var(--text-dim)", fontWeight: 500, fontSize: 16, letterSpacing: "0.02em" }}>
          {["OpenRouter", "Ollama", "Whisper", "FastAPI", "Next.js", "llama.cpp"].map(s => (
            <span key={s} style={{ opacity: 0.7 }}>{s}</span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: "relative",
        padding: "30px 80px 24px",
        maxWidth: 1400, margin: "0 auto",
        display: "flex", justifyContent: "space-between",
        fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)",
        letterSpacing: "0.04em",
      }}>
        <span>venom v0.9.2 · build 0xA94F · {new Date().getFullYear()} the venom collective</span>
        <span>licensed under apache-2.0 · privacy · status ●</span>
      </footer>
    </div>
  );
}

// Right-side hero panel: a stylised "system bus" / live readout
function HeroPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: "relative",
      border: "1px solid var(--border-strong)",
      borderRadius: 16,
      background: "oklch(0.12 0.012 280 / 0.7)",
      backdropFilter: "blur(8px)",
      padding: 18,
      height: 560,
      display: "flex", flexDirection: "column", gap: 14,
      boxShadow: "0 0 0 1px var(--accent-glow), 0 30px 80px -40px var(--accent-glow)",
      overflow: "hidden",
    }}>
      {/* corner brackets */}
      {["tl","tr","bl","br"].map((c, i) => {
        const pos = { tl:{top:8,left:8}, tr:{top:8,right:8}, bl:{bottom:8,left:8}, br:{bottom:8,right:8} }[c];
        const borders = {
          tl: { borderTop: "1px solid var(--accent)", borderLeft: "1px solid var(--accent)" },
          tr: { borderTop: "1px solid var(--accent)", borderRight: "1px solid var(--accent)" },
          bl: { borderBottom: "1px solid var(--accent)", borderLeft: "1px solid var(--accent)" },
          br: { borderBottom: "1px solid var(--accent)", borderRight: "1px solid var(--accent)" },
        }[c];
        return <span key={c} style={{ position: "absolute", width: 14, height: 14, opacity: 0.7, ...pos, ...borders }} />;
      })}

      {/* Panel header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--text-muted)" }}>
          VENOM://CORE.RUNTIME
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Pill tone="purple">cloud · openrouter</Pill>
          <Pill>local · ollama</Pill>
        </div>
      </div>

      {/* Big logo plate */}
      <div style={{
        flex: 1,
        position: "relative",
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: "radial-gradient(ellipse at center, oklch(0.2 0.03 295 / 0.5), oklch(0.1 0.01 280) 70%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* concentric rings */}
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            position: "absolute",
            width: 120 + i*70, height: 120 + i*70,
            borderRadius: "50%",
            border: "1px solid var(--border)",
            opacity: 0.6 - i*0.1,
          }} />
        ))}
        {/* orbiting dot */}
        <div style={{
          position: "absolute",
          width: 260, height: 260,
          animation: "spin 18s linear infinite",
        }}>
          <span style={{
            position: "absolute", top: -3, left: "50%",
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--accent)", boxShadow: "0 0 12px var(--accent)",
          }} />
        </div>
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: "50%",
            border: "1px solid var(--border-strong)",
            background: "radial-gradient(circle at 40% 30%, var(--accent-bright), var(--accent-dim) 65%, oklch(0.2 0.05 295) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            filter: "drop-shadow(0 0 30px var(--accent-glow))",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Icon name="thunder" size={72} />
        </div>
      </div>

      {/* Bottom telemetry strip */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: 10,
        fontFamily: "var(--font-mono)", fontSize: 11,
      }}>
        <TelemetryRow label="ROUTER" value={tick % 3 === 0 ? "-> local · llama-3" : "-> cloud · claude-haiku-4"} />
        <TelemetryRow label="LATENCY" value={`${36 + (tick % 7)}ms`} />
        <TelemetryRow label="MEMORY" value={`${42 + (tick % 3)} entries`} />
        <TelemetryRow label="VOICE" value="whisper-v3 · idle" />
        <TelemetryRow label="MODE" value="hybrid · adaptive" accent />
        <TelemetryRow label="UPLINK" value="● ok" ok />
      </div>
    </div>
  );
}

function TelemetryRow({ label, value, accent, ok }) {
  return (
    <div style={{
      padding: "8px 10px",
      borderRadius: 8,
      border: "1px solid var(--border)",
      background: "oklch(0.16 0.014 280 / 0.7)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      gap: 8, minWidth: 0,
    }}>
      <span style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>{label}</span>
      <span style={{
        color: accent ? "var(--accent-bright)" : ok ? "var(--ok)" : "var(--text)",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{value}</span>
    </div>
  );
}

export { Landing };
export default Landing;

