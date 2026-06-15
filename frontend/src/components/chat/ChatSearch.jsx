"use client"

import { useState } from "react"

export default function ChatSearch({ onSearch }) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search messages..."
        className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500"
      />
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">q</span>
    </form>
  )
}
