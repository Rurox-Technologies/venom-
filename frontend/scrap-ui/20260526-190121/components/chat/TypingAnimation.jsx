"use client";

import { motion } from "framer-motion";

export default function TypingAnimation({ visible }) {
  if (!visible) return null;

  return (
    <div className="flex items-center gap-1 px-2 py-1 text-slate-400">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="h-1.5 w-1.5 rounded-full bg-cyan-300"
          animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: dot * 0.15 }}
        />
      ))}
      <span className="ml-2 text-xs">Venom is typing...</span>
    </div>
  );
}
