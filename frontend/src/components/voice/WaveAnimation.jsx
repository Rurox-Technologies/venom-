"use client";

import { motion } from "framer-motion";

export default function WaveAnimation({ active }) {
  if (!active) return null;
  return (
    <motion.span
      className="absolute inset-0 rounded-full border border-cyan-300/50"
      animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
      transition={{ duration: 1.4, repeat: Infinity }}
    />
  );
}
