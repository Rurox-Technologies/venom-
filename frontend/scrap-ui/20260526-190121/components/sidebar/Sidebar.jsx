"use client";

import { motion } from "framer-motion";
import { useChat } from "../../hooks/useChat";

const nav = ["Dashboard", "Chat", "Memory", "Settings"];

export default function Sidebar() {
  const { createConversation } = useChat();

  return (
    <motion.aside initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="cyber-shell flex h-full min-h-[82vh] flex-col justify-between p-3">
      <div>
        <div className="mb-5 border-b border-slate-800 pb-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Command Grid</p>
        </div>

        <div className="space-y-2">
          {nav.map((item, index) => (
            <button
              key={item}
              className={`flex w-full items-center gap-2 border px-3 py-2 text-left text-[11px] uppercase tracking-[0.16em] ${index === 0 ? "border-lime-400/70 bg-lime-500/10 text-lime-300" : "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"}`}
            >
              <span className="h-2 w-2 border border-current" />
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <button onClick={createConversation} className="w-full border border-slate-700 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-slate-200 hover:border-lime-400/50 hover:text-lime-300">
          + New Session
        </button>
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-slate-500">
          <span className="status-dot" />
          Sys_Stable
        </p>
      </div>
    </motion.aside>
  );
}
