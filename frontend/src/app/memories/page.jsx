"use client"

import { useState, useEffect } from "react"

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export default function MemoriesPage() {
  const [memory, setMemory] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/memory/summary`)
      .then((r) => r.json())
      .then(setMemory)
      .catch(() => setMemory({ facts: [], recent_turns: 0, total_facts: 0 }))
  }, [])

  if (!memory) {
    return <div className="p-6 text-gray-400">Loading memories...</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Memory</h1>

      <div className="flex gap-4 text-sm">
        <div className="bg-gray-800 rounded-lg px-4 py-3">
          <p className="text-2xl font-bold text-purple-400">{memory.total_facts}</p>
          <p className="text-gray-400">Total facts</p>
        </div>
        <div className="bg-gray-800 rounded-lg px-4 py-3">
          <p className="text-2xl font-bold text-purple-400">{memory.recent_turns}</p>
          <p className="text-gray-400">Recent turns</p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-200">Stored Facts</h2>
        {memory.facts.length === 0 && (
          <p className="text-gray-500 text-sm">No facts stored yet. Start a conversation to build memory.</p>
        )}
        {memory.facts.map((fact, i) => (
          <div key={i} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <p className="text-gray-300 text-sm">{fact.fact}</p>
            {fact.created_at && (
              <p className="text-gray-500 text-xs mt-1">{new Date(fact.created_at).toLocaleDateString()}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
