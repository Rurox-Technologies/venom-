const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.status = status
    this.data = data
    this.name = "ApiError"
  }
}

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
  }
  const response = await fetch(url, config)
  if (!response.ok) {
    let data = null
    try {
      data = await response.json()
    } catch {}
    throw new ApiError(
      data?.detail || `Request failed with status ${response.status}`,
      response.status,
      data,
    )
  }
  return response.json()
}

export async function sendChatMessage(payload) {
  return request("/api/chat/message", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function getMemorySummary() {
  return request("/api/memory/summary")
}

export async function listConversations() {
  return request("/api/conversations")
}

export async function getConversation(sessionId) {
  return request(`/api/conversations/${sessionId}`)
}

export async function deleteConversation(sessionId) {
  return request(`/api/conversations/${sessionId}`, { method: "DELETE" })
}

export async function healthCheck() {
  return request("/health")
}
