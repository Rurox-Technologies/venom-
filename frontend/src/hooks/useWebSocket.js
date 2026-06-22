"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export function useWebSocket(sessionId, baseUrl = "ws://localhost:8000") {
  const [messages, setMessages] = useState([])
  const [connected, setConnected] = useState(false)
  const ws = useRef(null)
  const retries = useRef(0)
  const maxRetries = 5

  const connect = useCallback(() => {
    if (!sessionId || retries.current >= maxRetries) return
    const socket = new WebSocket(`${baseUrl}/ws/chat/${sessionId}`)
    socket.onopen = () => {
      setConnected(true)
      retries.current = 0
    }
    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, { role: "assistant", content: event.data }])
    }
    socket.onclose = () => {
      setConnected(false)
      retries.current++
      setTimeout(connect, Math.min(1000 * 2 ** retries.current, 30000))
    }
    ws.current = socket
  }, [sessionId, baseUrl])

  useEffect(() => {
    connect()
    return () => ws.current?.close()
  }, [connect])

  const send = useCallback((msg) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(msg)
      setMessages((prev) => [...prev, { role: "user", content: msg }])
    }
  }, [])

  return { messages, send, connected }
}
