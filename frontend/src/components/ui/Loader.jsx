"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      className="h-6 w-6 rounded-full border-2 border-cyan-300 border-t-transparent"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}
