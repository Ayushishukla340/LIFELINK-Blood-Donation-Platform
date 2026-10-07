import { useTheme } from "../../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle({ className = "", showLabel = false }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`group relative flex items-center gap-2.5 rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
        isDark
          ? "border-slate-700 bg-slate-800/90 text-amber-400 hover:border-amber-400/40 hover:bg-slate-800 hover:shadow-lg hover:shadow-amber-400/10"
          : "border-red-200 bg-red-50/80 text-red-700 hover:border-red-300 hover:bg-red-100 hover:shadow-md hover:shadow-red-200/50"
      } ${className}`}
    >
      {/* Icon with smooth rotation */}
      <span className="relative flex h-5 w-5 items-center justify-center">
        {isDark ? (
          <FiSun className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45 text-amber-400" />
        ) : (
          <FiMoon className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-12 text-slate-700" />
        )}
      </span>

      {showLabel ? (
        <span className="text-xs font-bold tracking-wide">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      ) : (
        <span className="hidden md:inline-block text-xs font-bold">
          {isDark ? "Light" : "Dark"}
        </span>
      )}

      {/* Subtle indicator dot */}
      <span
        className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
          isDark ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" : "bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]"
        }`}
      />
    </button>
  );
}
