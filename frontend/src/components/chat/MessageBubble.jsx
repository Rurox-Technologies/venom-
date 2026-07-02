function formatTime(value) {
  if (!value) return ""
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export default function MessageBubble({ role, text, createdAt, content, timestamp }) {
  const isUser = role === "user"
  const displayText = text || content || ""
  const displayTime = createdAt || timestamp || ""

  return (
    <div className={`max-w-[88%] border px-3 py-2 text-xs ${isUser ? "ml-auto border-cyan-500/40 bg-cyan-500/10" : "border-slate-700 bg-slate-900/70"}`}>
      <p className="whitespace-pre-wrap leading-relaxed text-slate-200">{displayText}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500">{formatTime(displayTime)}</p>
    </div>
  )
}
