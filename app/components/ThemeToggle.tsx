"use client"

import { useEffect, useState } from "react"

type Theme = "dark" | "light"

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const saved = window.localStorage.getItem("car-market-theme")
    const initial: Theme = saved === "light" || saved === "dark" ? saved : "dark"
    setTheme(initial)
    document.documentElement.dataset.theme = initial
  }, [])

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark"
    setTheme(next)
    document.documentElement.dataset.theme = next
    window.localStorage.setItem("car-market-theme", next)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`เปลี่ยนเป็นธีม${theme === "dark" ? "สว่าง" : "มืด"}`}
      aria-pressed={theme === "light"}
      className="theme-toggle"
    >
      <span aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
      <span>{theme === "dark" ? "โหมดสว่าง" : "โหมดมืด"}</span>
    </button>
  )
}
