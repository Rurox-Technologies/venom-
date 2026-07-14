"use client"

import { motion } from "framer-motion"
import MessageBubble from "./MessageBubble"
import TypingAnimation from "./TypingAnimation"
import ChatInput from "./ChatInput"
import { useChat } from "../../hooks/useChat"

export default function ChatBox() {
  const { messages, isTyping, isStreaming } = useChat()

  return (
    <div className="cyber-panel scan-line flex h-full min-h-[420px] flex-col p-3">
      <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] uppercase tracking-[0.16em] text-slate-400">
        <span>Live_Thread</span>
        <span className={isStreaming ? "neon-text" : "text-slate-500"}>{isStreaming ? "Streaming" : "Stable"}</span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((item, index) => (
          <motion.div key={item.id || index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.02 }}>
            <MessageBubble role={item.role} content={item.content} timestamp={item.timestamp} />
          </motion.div>
        ))}
        <TypingAnimation visible={isTyping} />
      </div>

      <ChatInput />
    </div>
  )
}
