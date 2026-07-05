"use client"

import { useState, useEffect, useCallback } from "react"

export default function ConnectionStatus() {
  const [online, setOnline] = useState(true)
  const [lastOnline, setLastOnline] = useState(null)
  const [showReconnected, setShowReconnected] = useState(false)

  const handleOnline = useCallback(() => {
    setOnline(true)
    setLastOnline(Date.now())
    setShowReconnected(true)
    setTimeout(() => setShowReconnected(false), 3000)
  }, [])

  const handleOffline = useCallback(() => {
    setOnline(false)
  }, [])

  useEffect(() => {
    setOnline(navigator.onLine)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [handleOnline, handleOffline])

  if (showReconnected) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-green-600 text-white text-center py-1 text-sm z-50 animate-pulse">
        Connection restored
      </div>
    )
  }

  if (online) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-1 text-sm z-50">
      No internet connection. Reconnect to continue.
    </div>
  )
}
