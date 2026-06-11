"use client";

import { motion } from "framer-motion";
import { useSettings } from "../../context/SettingsContext";

export default function Navbar() {
  const { providerStatus } = useSettings();

  return (
    <motion.nav initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="cyber-shell flex h-12 items-center justify-between px-4 text-[11px] uppercase tracking-[0.16em]">
      <div className="flex items-center gap-2">
        <span className="status-dot" />
        <span className="display-font text-slate-200">Venom_AI</span>
      </div>
      <div className="hidden items-center gap-6 text-slate-400 md:flex">
        <span>Docs</span>
        <span>Changelog</span>
        <span>Status: {providerStatus}</span>
      </div>
    </motion.nav>
  );
}
