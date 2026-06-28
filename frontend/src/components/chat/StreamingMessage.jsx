"use client"

import { useState, useEffect, useRef } from "react"

export default function StreamingMessage({ tokens = [], done = false }) {
  const [displayed, setDisplayed] = useState([])
  const indexRef = useRef(0)

  useEffect(() => {
    if (indexRef.current < tokens.length) {
      const interval = setInterval(() => {
        setDisplayed((prev) => [...prev, tokens[indexRef.current]])
        indexRef.current++
        if (indexRef.current >= tokens.length) clearInterval(interval)
      }, 30)
      return () => clearInterval(interval)
    }
  }, [tokens.length])

  useEffect(() => {
    if (done) indexRef.current = tokens.length
  }, [done, tokens.length])

  return (
    <div className="p-3 rounded-lg bg-gray-800/50">
      <p className="text-gray-200">
        {displayed.join("")}
        {!done && <span className="animate-pulse">|</span>}
      </p>
    </div>
  )
}
