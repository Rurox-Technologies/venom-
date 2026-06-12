export interface Settings {
  provider: "cloud" | "local" | "hybrid"
  personality: "balanced" | "creative" | "concise"
  language: string
  voiceInput: boolean
  voiceOutput: boolean
  wakeWord: boolean
  privacyMode: boolean
  memoryEnabled: boolean
}

export interface PersonalityOption {
  id: string
  label: string
  description: string
}

export interface ProviderOption {
  id: string
  label: string
  description: string
}
