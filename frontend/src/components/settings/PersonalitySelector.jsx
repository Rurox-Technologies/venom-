"use client";

import { useSettings } from "../../context/SettingsContext";

const modes = ["Balanced", "Creative", "Concise", "Friendly", "Professional", "Sarcastic", "Chaos"];

export default function PersonalitySelector() {
  const { personalityMode, setPersonalityMode } = useSettings();

  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">Personality Mode</p>
      <div className="grid grid-cols-2 gap-2">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => setPersonalityMode(mode)}
            className={`rounded-lg border px-3 py-2 text-sm ${personalityMode === mode ? "border-cyan-300 bg-cyan-500/20 text-cyan-200" : "border-slate-700 bg-slate-900/40 text-slate-300"}`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}
