export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="relative w-14 h-7 rounded-full bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center text-sm ${
          theme === "light" ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? "\u263e" : "\u2600"}
      </span>
    </button>
  )
}
