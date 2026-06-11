"use client";

import PersonalitySelector from "./PersonalitySelector";
import ProviderToggle from "./ProviderToggle";
import { useSettings } from "../../context/SettingsContext";

function ToggleRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs uppercase tracking-[0.12em]">
      <span className="text-slate-300">{label}</span>
      <button onClick={onChange} className={value ? "neon-text" : "text-slate-500"}>{value ? "On" : "Off"}</button>
    </div>
  );
}

export default function SettingsModal() {
  const {
    isSettingsOpen,
    closeSettings,
    privacyMode,
    setPrivacyMode,
    offlineMode,
    setOfflineMode,
    wakeWordEnabled,
    setWakeWordEnabled,
    memoryEnabled,
    setMemoryEnabled,
  } = useSettings();

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="cyber-shell w-full max-w-3xl p-4">
        <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2 text-xs uppercase tracking-[0.16em]">
          <span>System Settings</span>
          <button onClick={closeSettings} className="text-slate-400 hover:text-slate-200">Close</button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <ProviderToggle />
            <PersonalitySelector />
          </div>
          <div className="space-y-2">
            <ToggleRow label="Privacy Mode" value={privacyMode} onChange={() => setPrivacyMode((v) => !v)} />
            <ToggleRow label="Offline Mode" value={offlineMode} onChange={() => setOfflineMode((v) => !v)} />
            <ToggleRow label="Wake Word" value={wakeWordEnabled} onChange={() => setWakeWordEnabled((v) => !v)} />
            <ToggleRow label="Memory Engine" value={memoryEnabled} onChange={() => setMemoryEnabled((v) => !v)} />
          </div>
        </div>
      </div>
    </div>
  );
}
