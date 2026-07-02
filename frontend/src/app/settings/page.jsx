"use client"

import { useState, useEffect } from "react"

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export default function SettingsPage() {
  const [settings, setSettings] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/settings`)
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {})
  }, [])

  const update = async (key, value) => {
    const next = { ...settings, [key]: value }
    setSettings(next)
    setSaving(true)
    try {
      await fetch(`${API}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      })
    } catch {}
    setSaving(false)
  }

  if (!settings) {
    return <div className="p-6 text-gray-400">Loading settings...</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Settings</h1>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-200 font-medium">Provider</p>
            <p className="text-sm text-gray-400">AI model provider</p>
          </div>
          <select
            value={settings.provider}
            onChange={(e) => update("provider", e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-1.5"
          >
            <option value="hybrid">Hybrid (Cloud + Local)</option>
            <option value="cloud">Cloud (OpenRouter)</option>
            <option value="local">Local (Ollama)</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-200 font-medium">Personality</p>
            <p className="text-sm text-gray-400">Response style</p>
          </div>
          <select
            value={settings.personality}
            onChange={(e) => update("personality", e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-1.5"
          >
            <option value="balanced">Balanced</option>
            <option value="creative">Creative</option>
            <option value="concise">Concise</option>
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="sarcastic">Sarcastic</option>
            <option value="chaos">Chaos</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-200 font-medium">Language</p>
            <p className="text-sm text-gray-400">Response language</p>
          </div>
          <select
            value={settings.language}
            onChange={(e) => update("language", e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-1.5"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-200 font-medium">Privacy Mode</p>
            <p className="text-sm text-gray-400">Disable cloud providers</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.privacy_mode}
              onChange={(e) => update("privacy_mode", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
          </label>
        </div>
      </section>

      {saving && <p className="text-sm text-gray-500">Saving...</p>}
    </div>
  )
}
