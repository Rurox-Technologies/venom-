"use client";

import { motion } from "framer-motion";
import WaveAnimation from "./WaveAnimation";
import { useVoice } from "../../hooks/useVoice";

export default function VoiceButton() {
  const { isListening, toggleListening, isMuted } = useVoice();

  return (
    <div className="cyber-panel flex items-center gap-3 p-2">
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={toggleListening}
        className={`relative flex h-11 w-11 items-center justify-center border text-xs ${isListening ? "border-lime-400 text-lime-300" : "border-slate-700 text-slate-300"}`}
      >
        {isListening ? "LIVE" : "MIC"}
        <WaveAnimation active={isListening} />
      </motion.button>
      <div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{isListening ? "Listening" : "Voice Idle"}</p>
        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{isMuted ? "Muted" : "Input Open"}</p>
      </div>
    </div>
  );
}
