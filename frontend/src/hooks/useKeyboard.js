import { useEffect, useCallback } from "react"

export function useKeyboard(keyMap, enabled = true) {
  const handler = useCallback(
    (e) => {
      if (!enabled) return
      const key = e.key.toLowerCase()
      const hasMod = e.ctrlKey || e.metaKey
      if (keyMap[key] && !hasMod) {
        e.preventDefault()
        keyMap[key](e)
        return
      }
      if (hasMod) {
        const combo = `mod+${key}`
        if (keyMap[combo]) {
          e.preventDefault()
          keyMap[combo](e)
        }
      }
    },
    [keyMap, enabled],
  )

  useEffect(() => {
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handler])
}
