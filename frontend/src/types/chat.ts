export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface Conversation {
  session_id: string
  messages: Message[]
  updated_at: string
}

export interface ChatRequest {
  user_id: string
  session_id: string
  message: string
  language?: string
  mode?: string
}

export interface ChatResponse {
  reply: string
  timestamp: string
}

export type PersonalityMode = "balanced" | "creative" | "concise"
export type ProviderType = "cloud" | "local" | "hybrid"
export type Language = "en" | "hi" | "es" | "fr" | "de"
