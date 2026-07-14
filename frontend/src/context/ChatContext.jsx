"use client"

import { createContext, useContext, useMemo, useState, useCallback, useRef, useEffect } from "react"
import { sendChatMessage, listConversations as fetchConversations, getConversation } from "../lib/api"

const ChatContext = createContext(null)

function buildTitle(text) {
  const clean = text.trim()
  return clean.length > 26 ? `${clean.slice(0, 26)}...` : clean
}

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [messages, setMessages] = useState([])
  const [loaded, setLoaded] = useState(false)
  const activeRef = useRef(activeConversationId)
  activeRef.current = activeConversationId

  useEffect(() => {
    fetchConversations()
      .then((convs) => {
        if (convs.length > 0) {
          setConversations(convs)
          setActiveConversationId(convs[0].session_id)
          return getConversation(convs[0].session_id)
        }
        return null
      })
      .then((conv) => {
        if (conv) setMessages(conv.messages || [])
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  const createConversation = () => {
    const id = `conv-${crypto.randomUUID()}`
    const newConv = { session_id: id, title: "New Conversation", messages: [] }
    setConversations((prev) => [newConv, ...prev])
    setActiveConversationId(id)
    setMessages([])
  }

  const deleteConversation = (conversationId) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.session_id !== conversationId)
      if (next.length === 0) setActiveConversationId(null)
      else if (activeConversationId === conversationId) {
        setActiveConversationId(next[0].session_id)
        getConversation(next[0].session_id).then((c) => setMessages(c.messages || [])).catch(() => {})
      }
      return next
    })
    setMessages([])
  }

  const clearActiveConversation = () => {
    setMessages([])
  }

  const sendMessage = useCallback(async (text) => {
    const sessionId = activeRef.current || `conv-${crypto.randomUUID()}`
    if (!activeRef.current) {
      setActiveConversationId(sessionId)
    }
    const userMsg = { id: crypto.randomUUID(), role: "user", content: text, timestamp: new Date().toISOString() }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)
    setIsStreaming(true)

    try {
      const data = await sendChatMessage({
        user_id: "default",
        session_id: sessionId,
        message: text,
        language: "en",
        mode: "balanced",
      })
      const asstMsg = { id: crypto.randomUUID(), role: "assistant", content: data.reply, timestamp: data.timestamp || new Date().toISOString() }
      setMessages((prev) => [...prev, asstMsg])
      setConversations((prev) => {
        const exists = prev.find((c) => c.session_id === sessionId)
        if (exists) return prev
        return [...prev, { session_id: sessionId, title: buildTitle(text), messages: [] }]
      })
    } catch {
      const errMsg = { id: crypto.randomUUID(), role: "assistant", content: "Sorry, I encountered an error processing your request.", timestamp: new Date().toISOString() }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setIsTyping(false)
      setIsStreaming(false)
    }
  }, [])

  const switchConversation = useCallback((id) => {
    setActiveConversationId(id)
    setMessages([])
    getConversation(id).then((c) => setMessages(c.messages || [])).catch(() => {})
  }, [])

  const value = useMemo(
    () => ({
      messages,
      sendMessage,
      conversations,
      activeConversationId,
      setActiveConversationId: switchConversation,
      createConversation,
      deleteConversation,
      clearActiveConversation,
      isTyping,
      isStreaming,
      loaded,
    }),
    [messages, conversations, activeConversationId, isTyping, isStreaming, loaded, sendMessage, switchConversation],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) throw new Error("useChatContext must be used within ChatProvider")
  return context
}
