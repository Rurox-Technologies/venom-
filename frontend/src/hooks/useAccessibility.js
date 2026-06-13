import { useEffect } from "react"

export function useAccessibility() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        const focused = document.activeElement
        if (focused?.type === "text" || focused?.tagName === "TEXTAREA") {
          focused.blur()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    document.documentElement.setAttribute("role", "application")
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])
}
