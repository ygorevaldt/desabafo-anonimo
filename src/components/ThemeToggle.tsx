"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-full bg-secondary border border-border animate-pulse ${className}`}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        relative inline-flex items-center justify-center
        w-9 h-9 rounded-full
        bg-secondary hover:bg-muted text-foreground
        border border-border/80
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-ring
        active:scale-95
        ${className}
      `}
      title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      aria-label="Alternar tema"
    >
      {isDark ? (
        <FaSun className="w-4 h-4 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
      ) : (
        <FaMoon className="w-3.5 h-3.5 text-zinc-600 transition-transform duration-200 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
