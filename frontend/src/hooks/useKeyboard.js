import { useEffect, useCallback } from "react"

export function useKeyboard(keyMap, enabled = true) {
  const handler = useCallback(
    (e) => {
      if (!enabled) return
      const key = e.key.toLowerCase()
      const combo = `${e.ctrlKey || e.metaKey ? "mod+" : ""}${key}`
      if (keyMap[key]) {
        e.preventDefault()
        keyMap[key](e)
      }
      if (keyMap[combo]) {
        e.preventDefault()
        keyMap[combo](e)
      }
    },
    [keyMap, enabled],
  )

  useEffect(() => {
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handler])
}
