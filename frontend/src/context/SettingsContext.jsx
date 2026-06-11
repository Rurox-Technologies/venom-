"use client";

import { createContext, useContext, useMemo, useState } from "react";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [provider, setProvider] = useState("OpenRouter");
  const [personalityMode, setPersonalityMode] = useState("Friendly");
  const [model, setModel] = useState("openrouter/auto");
  const [language, setLanguage] = useState("English");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
  const [memoryEnabled, setMemoryEnabled] = useState(true);

  const providerStatus = offlineMode
    ? "Local-only"
    : provider === "OpenRouter"
      ? "Cloud Connected"
      : "Local Connected";

  const value = useMemo(
    () => ({
      provider,
      setProvider,
      personalityMode,
      setPersonalityMode,
      model,
      setModel,
      language,
      setLanguage,
      privacyMode,
      setPrivacyMode,
      offlineMode,
      setOfflineMode,
      isListening,
      setIsListening,
      isSpeaking,
      setIsSpeaking,
      isMuted,
      setIsMuted,
      wakeWordEnabled,
      setWakeWordEnabled,
      memoryEnabled,
      setMemoryEnabled,
      providerStatus,
      isSettingsOpen,
      openSettings: () => setIsSettingsOpen(true),
      closeSettings: () => setIsSettingsOpen(false),
      toggleListening: () => setIsListening((state) => !state),
      stopSpeaking: () => setIsSpeaking(false),
    }),
    [
      provider,
      personalityMode,
      model,
      language,
      privacyMode,
      offlineMode,
      isListening,
      isSpeaking,
      isMuted,
      wakeWordEnabled,
      memoryEnabled,
      providerStatus,
      isSettingsOpen,
    ],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
}
