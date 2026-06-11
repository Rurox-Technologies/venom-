"use client";

import { motion } from "framer-motion";

export default function GlowButton({ children, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-lg border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-400/20"
      {...props}
    >
      {children}
    </motion.button>
  );
}
