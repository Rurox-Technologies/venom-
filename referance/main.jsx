// Venom — root app: landing/chat switcher + orchestration + tweaks
const { useState: useS, useEffect: useE, useRef: useR, useMemo: useM, useCallback: useC } = React;

function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "violet",
    "fontPair": "modern",
    "showRail": true,
    "density": "comfortable",
    "personality": "sarcastic",
    "startOnChat": false
  }/*EDITMODE-END*/;

  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const ACCENT_OPTIONS = {
    violet:  { name: "Violet",  hue: 295, chroma: 0.22 },
    cyan:    { name: "Cyan",    hue: 215, chroma: 0.18 },
    emerald: { name: "Emerald", hue: 155, chroma: 0.18 },
    amber:   { name: "Amber",   hue: 70,  chroma: 0.18 },
  };
  useE(() => {
    const a = ACCENT_OPTIONS[tweaks.accent] || ACCENT_OPTIONS.violet;
    const root = document.documentElement;
    root.style.setProperty("--accent", `oklch(0.68 ${a.chroma} ${a.hue})`);
    root.style.setProperty("--accent-bright", `oklch(0.78 ${a.chroma - 0.02} ${a.hue})`);
    root.style.setProperty("--accent-dim", `oklch(0.55 ${a.chroma - 0.04} ${a.hue})`);
    root.style.setProperty("--accent-glow", `oklch(0.68 ${a.chroma} ${a.hue} / 0.35)`);
  }, [tweaks.accent]);

  useE(() => {
    const pair = tweaks.fontPair;
    const root = document.documentElement;
    if (pair === "mono") {
      root.style.setProperty("--font-sans", "'JetBrains Mono', monospace");
    } else if (pair === "serif") {
      root.style.setProperty("--font-sans", "'Instrument Serif', Georgia, serif");
    } else {
      root.style.setProperty("--font-sans", "'Space Grotesk', system-ui, sans-serif");
    }
  }, [tweaks.fontPair]);

  // App state
  const [view, setView] = useS(tweaks.startOnChat ? "app" : "landing");
  const [chats, setChats] = useS(SEED_CHATS);
  const [activeId, setActiveId] = useS("c1");
  const [provider, setProvider] = useS("hybrid");
  const [model, setModel] = useS("adaptive");
  const [modelOpen, setModelOpen] = useS(false);
  const [busy, setBusy] = useS(false);
  const [voiceState, setVoiceState] = useS("off"); // off | listening | speaking
  const [transcript, setTranscript] = useS("");
  const [privacy, setPrivacy] = useS(false);

  // Personality is mirrored into tweaks for persistence
  const personality = tweaks.personality;
  const setPersonality = (k) => setTweak("personality", k);

  // When privacy toggles, pin provider local
  useE(() => {
    if (privacy && provider !== "local") {
      setProvider("local");
      setModel(PROVIDERS.local.models[0]);
    }
  }, [privacy]);

  // When provider changes, ensure model is valid
  useE(() => {
    const valid = PROVIDERS[provider].models;
    if (!valid.includes(model)) setModel(valid[0]);
  }, [provider]);

  const activeChat = chats.find(c => c.id === activeId);
  const messages = activeChat?.messages || [];

  // Streaming response simulator
  const streamingRef = useR(null);
  const send = useC((text) => {
    if (!activeChat) return;
    const userMsg = { role: "user", text };
    setChats(cs => cs.map(c => c.id === activeId ? {
      ...c, messages: [...(c.messages || []), userMsg, { role: "assistant", text: "", streaming: true, model, provider }],
      preview: text.slice(0, 60), time: "now"
    } : c));
    setBusy(true);

    const full = composeReply(text, personality);
    let i = 0;
    clearInterval(streamingRef.current);
    streamingRef.current = setInterval(() => {
      i += 2 + Math.floor(Math.random() * 4);
      const partial = full.slice(0, i);
      setChats(cs => cs.map(c => {
        if (c.id !== activeId) return c;
        const msgs = c.messages.slice();
        const last = msgs[msgs.length - 1];
        msgs[msgs.length - 1] = { ...last, text: partial };
        return { ...c, messages: msgs };
      }));
      if (i >= full.length) {
        clearInterval(streamingRef.current);
        setChats(cs => cs.map(c => {
          if (c.id !== activeId) return c;
          const msgs = c.messages.slice();
          msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], streaming: false };
          return { ...c, messages: msgs };
        }));
        setBusy(false);
      }
    }, 38);
  }, [activeChat, activeId, model, provider, personality]);

  const newChat = useC(() => {
    const id = "c" + Date.now();
    const c = { id, title: "New conversation", preview: PERSONALITIES[personality].opener.slice(0, 60), time: "now",
      messages: [{ role: "assistant", text: PERSONALITIES[personality].opener, model, provider }] };
    setChats(cs => [c, ...cs]);
    setActiveId(id);
  }, [personality, model, provider]);

  const toggleVoice = useC(() => {
    if (voiceState !== "off") {
      setVoiceState("off"); setTranscript("");
      return;
    }
    setVoiceState("listening");
    // simulate transcript typing
    const phrases = [
      "Hey Venom, what's on my calendar tomorrow?",
      "Hey Venom, draft an email declining the meeting.",
      "Hey Venom, can you summarise the auth refactor?",
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTranscript(phrase.slice(0, i));
      if (i >= phrase.length) {
        clearInterval(id);
        setTimeout(() => {
          setVoiceState("speaking");
          setTimeout(() => {
            setVoiceState("off"); setTranscript("");
            send(phrase);
          }, 1800);
        }, 600);
      }
    }, 55);
  }, [voiceState, send]);

  const deleteChat = (id) => setChats(cs => cs.filter(c => c.id !== id));

  const suggestions = useM(() => {
    if (!activeChat || (activeChat.messages || []).length > 2) return [];
    return [
      "What's on my calendar tomorrow?",
      "Refactor this React component",
      "Translate to Italian",
      "Summarise this PDF",
    ];
  }, [activeChat]);

  return (
    <div className="app">
      {view === "landing" ? (
        <Landing onLaunch={() => setView("app")} />
      ) : (
        <ChatView
          chats={chats} activeId={activeId} setActiveId={setActiveId}
          newChat={newChat} deleteChat={deleteChat}
          personality={personality} setPersonality={setPersonality}
          provider={provider} setProvider={setProvider}
          model={model} setModel={setModel}
          modelOpen={modelOpen} setModelOpen={setModelOpen}
          voiceState={voiceState} toggleVoice={toggleVoice} transcript={transcript}
          privacy={privacy} setPrivacy={setPrivacy}
          messages={messages} busy={busy} send={send}
          suggestions={suggestions}
          showRail={tweaks.showRail}
          density={tweaks.density}
          onHome={() => setView("landing")}
        />
      )}

      {/* Tweaks panel */}
      <TweaksPanel>
        <TweakSection label="Brand">
          <AccentSwatchRow
            label="Accent"
            value={tweaks.accent}
            options={Object.keys(ACCENT_OPTIONS)}
            optionMeta={ACCENT_OPTIONS}
            onChange={v => setTweak("accent", v)}
          />
          <TweakRadio label="Type" value={tweaks.fontPair} onChange={v => setTweak("fontPair", v)} options={[
            { value: "modern", label: "Modern" },
            { value: "mono", label: "Mono" },
            { value: "serif", label: "Serif" },
          ]} />
        </TweakSection>
        <TweakSection label="Layout">
          <TweakToggle label="System rail" value={tweaks.showRail} onChange={v => setTweak("showRail", v)} />
          <TweakRadio label="Density" value={tweaks.density} onChange={v => setTweak("density", v)} options={[
            { value: "comfortable", label: "Comfy" },
            { value: "compact", label: "Compact" },
          ]} />
        </TweakSection>
        <TweakSection label="Personality">
          <TweakSelect label="Default core" value={tweaks.personality} onChange={v => setTweak("personality", v)} options={[
            { value: "sarcastic", label: "Sarcastic" },
            { value: "friendly", label: "Friendly" },
            { value: "professional", label: "Professional" },
            { value: "chaos", label: "Chaos" },
          ]} />
        </TweakSection>
        <TweakSection label="Demo">
          <TweakButton label={"Go to " + (view === "landing" ? "Chat" : "Landing")} onClick={() => setView(view === "landing" ? "app" : "landing")} />
          <TweakButton label={voiceState === "off" ? "Trigger voice demo" : "Stop voice"} onClick={toggleVoice} secondary />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// Custom accent swatch row — avoid freeform color picker
function AccentSwatchRow({ label, value, options, optionMeta, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "6px 0" }}>
      <span style={{ fontSize: 11, color: "var(--text-muted, #888)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
        {options.map(opt => {
          const meta = optionMeta[opt];
          const swatch = `oklch(0.68 ${meta.chroma} ${meta.hue})`;
          const active = value === opt;
          return (
            <button key={opt} onClick={() => onChange(opt)} style={{
              padding: "6px 4px",
              borderRadius: 8,
              border: active ? `1px solid ${swatch}` : "1px solid var(--border, rgba(255,255,255,0.1))",
              background: active ? `color-mix(in oklch, ${swatch} 14%, transparent)` : "transparent",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
              cursor: "pointer",
            }}>
              <span style={{ width: 22, height: 12, borderRadius: 3, background: swatch }} />
              <span style={{ fontSize: 10, opacity: active ? 1 : 0.6, textTransform: "capitalize" }}>{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main chat view ──────────────────────────────────────────────────
function ChatView(props) {
  const { chats, activeId, setActiveId, newChat, deleteChat,
    personality, setPersonality, provider, setProvider, model, setModel,
    modelOpen, setModelOpen, voiceState, toggleVoice, transcript,
    privacy, setPrivacy, messages, busy, send, suggestions,
    showRail, density, onHome } = props;
  const scroller = useR(null);
  useE(() => {
    if (!scroller.current) return;
    scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages.length, messages[messages.length - 1]?.text]);

  const pad = density === "compact" ? "14px 22px" : "22px 32px";

  return (
    <div style={{ position: "relative", display: "flex", height: "100%", width: "100%" }}>
      <div className="grid-bg" />
      <Sidebar
        chats={chats} activeId={activeId} onSelect={setActiveId}
        onNew={newChat} onDelete={deleteChat}
        personality={personality} setPersonality={setPersonality}
        onHome={onHome}
      />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
        <TopBar
          provider={provider} setProvider={setProvider}
          model={model} setModel={setModel}
          modelOpen={modelOpen} setModelOpen={setModelOpen}
          voiceState={voiceState} onToggleVoice={toggleVoice}
          privacy={privacy} setPrivacy={setPrivacy}
        />

        {/* Chat thread */}
        <div ref={scroller} style={{ flex: 1, overflow: "auto", padding: pad }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <ChatHeader chat={chats.find(c => c.id === activeId)} personality={personality} provider={provider} model={model} />
            {messages.map((m, i) => (
              <Message
                key={i}
                msg={m}
                personality={personality}
                isLast={i === messages.length - 1}
                streaming={m.streaming}
              />
            ))}
            {busy && messages[messages.length - 1]?.text === "" && (
              <div style={{ paddingLeft: 40, marginTop: -4 }}><ThinkingDots /></div>
            )}
            <div style={{ height: 12 }} />
          </div>
        </div>

        <div style={{ maxWidth: 820, margin: "0 auto", width: "100%" }}>
          <Composer
            onSend={send}
            onVoice={toggleVoice}
            voiceState={voiceState}
            busy={busy}
            suggestions={suggestions}
            onSuggest={(s) => send(s)}
          />
        </div>

        <VoiceOverlay state={voiceState} onStop={toggleVoice} transcript={transcript} />
      </main>
      {showRail && <MemoryRail open={showRail} personality={personality} model={model} provider={provider} />}
    </div>
  );
}

function ChatHeader({ chat, personality, provider, model }) {
  if (!chat) return null;
  const p = PERSONALITIES[personality];
  return (
    <div style={{
      paddingBottom: 18, marginBottom: 6,
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Pill tone="purple"><span style={{ color: p.color }}>●</span>{p.tag}</Pill>
        <Pill>{provider} · {model}</Pill>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginLeft: "auto" }}>
          context · 4k / 200k tokens
        </span>
      </div>
      <h2 style={{
        margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em",
      }}>{chat.title}</h2>
    </div>
  );
}

// Personality-flavoured fake reply composer
function composeReply(prompt, personality) {
  const p = prompt.toLowerCase();
  const intros = {
    sarcastic: "Sure, why not. Here's the take:",
    friendly: "Great question! Let me break it down:",
    professional: "Understood. Here is a structured response:",
    chaos: "OKAY OKAY OKAY listen up:",
  };
  const closers = {
    sarcastic: "\n\nYou're welcome. Try not to break it this time.",
    friendly: "\n\nHappy to dig deeper — just say the word.",
    professional: "\n\nPlease let me know if you require further detail.",
    chaos: "\n\nthat's it that's the answer go go go",
  };
  let body;
  if (p.includes("calendar")) {
    body = "Tomorrow you have:\n  • 09:30 — design review (45m)\n  • 11:00 — 1:1 with sam\n  • 14:00 — venom build session ⚡\n  • 17:00 — dentist (you keep moving this — go)";
  } else if (p.includes("email")) {
    body = "Here's a polite decline:\n\n> Hi —\n> Thanks for the invite. Conflict on my end this week. Could you share notes after, or grab time next Tuesday?\n> — m";
  } else if (p.includes("italian") || p.includes("translate")) {
    body = "Five extra-useful ones:\n\n• *Posso pagare con la carta?* — can I pay by card?\n• *È compreso il servizio?* — is service included?\n• *Mi sono perso/persa.* — I'm lost (m/f).\n• *Non parlo bene italiano.* — I don't speak Italian well.\n• *Buona giornata.* — have a good day.";
  } else if (p.includes("refactor") || p.includes("auth")) {
    body = "Here's the move:\n\n  1. Extract `verifyJwt` into `lib/auth/verifyJwt.ts`\n  2. Add `requireUser(req)` that throws `UnauthorizedError`\n  3. Replace the 3 inline calls with `await requireUser(req)`\n  4. Add a single catch in your error middleware → 401\n\nKeeps the call sites one line. Tests get easier — mock `requireUser` once.";
  } else if (p.includes("summar")) {
    body = "Short version:\n\n  • Auth middleware was duplicated across 3 routes.\n  • We're pulling it into a single `requireUser` helper.\n  • The helper throws on failure; error middleware converts to 401.\n  • Net effect: -42 LOC, +1 abstraction, +clear tests.";
  } else {
    body = "Quick answer: depends on the constraints, but the cheapest path is usually:\n  1. Reduce scope.\n  2. Validate the riskiest assumption first.\n  3. Ship the thinnest end-to-end slice you can stand to use yourself.\n\nWhat's the actual constraint here — time, money, or unknowns?";
  }
  return intros[personality] + "\n\n" + body + closers[personality];
}

window.App = App;
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
