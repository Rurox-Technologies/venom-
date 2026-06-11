"use client";

import { useSettings } from "../../context/SettingsContext";

export default function ProviderToggle() {
  const { provider, setProvider, setOfflineMode } = useSettings();

  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">AI Provider</p>
      <div className="inline-flex rounded-xl border border-slate-700 bg-slate-900/50 p-1">
        {["OpenRouter", "Ollama"].map((name) => (
          <button
            key={name}
            onClick={() => {
              setProvider(name);
              setOfflineMode(name === "Ollama");
            }}
            className={`rounded-lg px-4 py-2 text-sm ${provider === name ? "bg-cyan-500/20 text-cyan-200" : "text-slate-300"}`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
