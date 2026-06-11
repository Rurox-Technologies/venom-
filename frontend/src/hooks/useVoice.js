"use client";

import { useSettings } from "../context/SettingsContext";

export function useVoice() {
  const {
    isListening,
    toggleListening,
    isSpeaking,
    stopSpeaking,
    isMuted,
    setIsMuted,
    wakeWordEnabled,
    setWakeWordEnabled,
  } = useSettings();

  return {
    isListening,
    toggleListening,
    isSpeaking,
    stopSpeaking,
    isMuted,
    setIsMuted,
    wakeWordEnabled,
    setWakeWordEnabled,
  };
}
