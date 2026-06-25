"use client"

import { useState, useEffect } from "react"
import { getStoredValue, setStoredValue } from "../lib/storage"

export function usePersistedState(key, defaultValue) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    const stored = getStoredValue(key)
    if (stored !== null) setValue(stored)
  }, [key])

  useEffect(() => {
    setStoredValue(key, value)
  }, [key, value])

  return [value, setValue]
}
