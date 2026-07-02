"use client"

import { useState, useEffect } from "react"

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export default function useMemory() {
  const [memoryItems, setMemoryItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/memory/summary`)
      .then((r) => r.json())
      .then((data) => setMemoryItems(data.facts || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { memoryItems, loading }
}
