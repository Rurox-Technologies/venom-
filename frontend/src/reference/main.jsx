import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getMemorySummary, sendChatMessage } from "../lib/api";
import { Landing } from "./landing";
import {
  Composer,
  MemoryRail,
  Message,
  PERSONALITIES,
  PROVIDERS,
  SEED_CHATS,
  Sidebar,
  TopBar,
  VoiceOverlay,
} from "./app-ui";
import { Pill, ThinkingDots } from "./components";

function ChatHeader({ chat, personality, provider, model }) {
  if (!chat) return null;
  const p = PERSONALITIES[personality];
  return (
    <div style={{ paddingBottom: 18, marginBottom: 6, borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Pill tone="purple">
          <span style={{ color: p.color }}>o</span>
          {p.tag}
        </Pill>
        <Pill>
          {provider} - {model}
        </Pill>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--text-muted)",
            marginLeft: "auto",
          }}
        >
          context - live backend
        </span>
      </div>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em" }}>{chat.title}</h2>
    </div>
  );
}

function ChatView(props) {
  const {
    chats,
    activeId,
    setActiveId,
    newChat,
    personality,
    setPersonality,
    provider,
    setProvider,
    model,
    setModel,
    modelOpen,
    setModelOpen,
    voiceState,
    toggleVoice,
    transcript,
    privacy,
    setPrivacy,
    messages,
    busy,
    send,
    suggestions,
    onHome,
    memorySummary,
  } = props;
  const scroller = useRef(null);

  useEffect(() => {
    if (!scroller.current) return;
    scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages.length, messages[messages.length - 1]?.text]);

  return (
    <div style={{ position: "relative", display: "flex", height: "100%", width: "100%" }}>
      <div className="grid-bg" />
      <Sidebar
        chats={chats}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={newChat}
        personality={personality}
        setPersonality={setPersonality}
        onHome={onHome}
      />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
        <TopBar
          provider={provider}
          setProvider={setProvider}
          model={model}
          setModel={setModel}
          modelOpen={modelOpen}
          setModelOpen={setModelOpen}
          voiceState={voiceState}
          onToggleVoice={toggleVoice}
          privacy={privacy}
          setPrivacy={setPrivacy}
        />

        <div ref={scroller} style={{ flex: 1, overflow: "auto", padding: "22px 32px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <ChatHeader chat={chats.find((c) => c.id === activeId)} personality={personality} provider={provider} model={model} />
            {messages.map((m, i) => (
              <Message key={i} msg={m} personality={personality} isLast={i === messages.length - 1} streaming={m.streaming} />
            ))}
            {busy && messages[messages.length - 1]?.text === "" && (
              <div style={{ paddingLeft: 40, marginTop: -4 }}>
                <ThinkingDots />
              </div>
            )}
            <div style={{ height: 12 }} />
          </div>
        </div>

        <div style={{ maxWidth: 820, margin: "0 auto", width: "100%" }}>
          <Composer onSend={send} onVoice={toggleVoice} voiceState={voiceState} busy={busy} suggestions={suggestions} onSuggest={send} />
        </div>

        <VoiceOverlay state={voiceState} onStop={toggleVoice} transcript={transcript} />
      </main>
      <MemoryRail open personality={personality} model={model} provider={provider} memorySummary={memorySummary} />
    </div>
  );
}

function streamReply(conversationId, fullReply, setChats, setBusy) {
  let i = 0;
  const id = setInterval(() => {
    i += 2 + Math.floor(Math.random() * 4);
    const partial = fullReply.slice(0, i);
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== conversationId) return chat;
        const messages = chat.messages.slice();
        const last = messages[messages.length - 1];
        messages[messages.length - 1] = { ...last, text: partial };
        return { ...chat, messages };
      }),
    );
    if (i >= fullReply.length) {
      clearInterval(id);
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== conversationId) return chat;
          const messages = chat.messages.slice();
          messages[messages.length - 1] = { ...messages[messages.length - 1], streaming: false };
          return { ...chat, messages };
        }),
      );
      setBusy(false);
    }
  }, 38);
}

export default function ReferenceApp() {
  const [view, setView] = useState("landing");
  const [chats, setChats] = useState(SEED_CHATS);
  const [activeId, setActiveId] = useState("c1");
  const [provider, setProvider] = useState("hybrid");
  const [model, setModel] = useState("adaptive");
  const [modelOpen, setModelOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [voiceState, setVoiceState] = useState("off");
  const [transcript, setTranscript] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [personality, setPersonality] = useState("sarcastic");
  const [memorySummary, setMemorySummary] = useState("Loading memory summary...");

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", "oklch(0.68 0.22 295)");
    root.style.setProperty("--accent-bright", "oklch(0.78 0.2 295)");
    root.style.setProperty("--accent-dim", "oklch(0.55 0.18 295)");
    root.style.setProperty("--accent-glow", "oklch(0.68 0.22 295 / 0.35)");
    root.style.setProperty("--font-sans", "'Space Grotesk', system-ui, sans-serif");
  }, []);

  useEffect(() => {
    let mounted = true;
    getMemorySummary()
      .then((result) => {
        if (mounted) setMemorySummary(result.summary || "Memory summary is empty.");
      })
      .catch(() => {
        if (mounted) setMemorySummary("Memory service unavailable.");
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (privacy && provider !== "local") {
      setProvider("local");
      setModel(PROVIDERS.local.models[0]);
    }
  }, [privacy, provider]);

  useEffect(() => {
    const valid = PROVIDERS[provider].models;
    if (!valid.includes(model)) setModel(valid[0]);
  }, [provider, model]);

  const activeChat = chats.find((chat) => chat.id === activeId);
  const messages = activeChat?.messages || [];

  const send = useCallback(
    async (text) => {
      if (!activeChat) return;
      const conversationId = activeId;
      const userMsg = { role: "user", text };
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === conversationId
            ? {
                ...chat,
                messages: [...(chat.messages || []), userMsg, { role: "assistant", text: "", streaming: true, model, provider }],
                preview: text.slice(0, 60),
                time: "now",
              }
            : chat,
        ),
      );
      setBusy(true);

      const mode = personality === "professional" ? "concise" : personality === "chaos" ? "creative" : "balanced";
      let fullReply = "";
      try {
        const result = await sendChatMessage({
          user_id: "web-user",
          session_id: conversationId,
          message: text,
          language: "en",
          mode,
        });
        fullReply = result.reply || "No reply received from backend.";
      } catch (error) {
        fullReply = `Backend error: ${error?.message || "request failed"}`;
      }

      streamReply(conversationId, fullReply, setChats, setBusy);
    },
    [activeChat, activeId, model, personality, provider],
  );

  const newChat = useCallback(() => {
    const id = `c${Date.now()}`;
    const chat = {
      id,
      title: "New conversation",
      preview: PERSONALITIES[personality].opener.slice(0, 60),
      time: "now",
      messages: [{ role: "assistant", text: PERSONALITIES[personality].opener, model, provider }],
    };
    setChats((prev) => [chat, ...prev]);
    setActiveId(id);
  }, [personality, model, provider]);

  const toggleVoice = useCallback(() => {
    if (voiceState !== "off") {
      setVoiceState("off");
      setTranscript("");
      return;
    }
    setVoiceState("listening");
    const phrases = [
      "Hey Venom, what is on my calendar tomorrow?",
      "Hey Venom, draft an email declining the meeting.",
      "Hey Venom, summarize the auth refactor.",
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
            setVoiceState("off");
            setTranscript("");
            send(phrase);
          }, 1800);
        }, 600);
      }
    }, 55);
  }, [voiceState, send]);

  const suggestions = useMemo(() => {
    if (!activeChat || (activeChat.messages || []).length > 2) return [];
    return [
      "What is on my calendar tomorrow?",
      "Refactor this React component",
      "Translate this to Italian",
      "Summarize this architecture",
    ];
  }, [activeChat]);

  return (
    <div className="app">
      {view === "landing" ? (
        <Landing onLaunch={() => setView("app")} />
      ) : (
        <ChatView
          chats={chats}
          activeId={activeId}
          setActiveId={setActiveId}
          newChat={newChat}
          personality={personality}
          setPersonality={setPersonality}
          provider={provider}
          setProvider={setProvider}
          model={model}
          setModel={setModel}
          modelOpen={modelOpen}
          setModelOpen={setModelOpen}
          voiceState={voiceState}
          toggleVoice={toggleVoice}
          transcript={transcript}
          privacy={privacy}
          setPrivacy={setPrivacy}
          messages={messages}
          busy={busy}
          send={send}
          suggestions={suggestions}
          onHome={() => setView("landing")}
          memorySummary={memorySummary}
        />
      )}
    </div>
  );
}
