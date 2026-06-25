const PREFIX = "venom_"

export function getStoredValue(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function setStoredValue(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {}
}

export function removeStoredValue(key) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {}
}

export function clearAll() {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(PREFIX))
    keys.forEach((k) => localStorage.removeItem(k))
  } catch {}
}
