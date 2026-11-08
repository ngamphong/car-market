"use client"

import { useEffect } from "react"

type Theme = "dark" | "light"

export default function ThemeToggle() {
  useEffect(() => {
    const saved = window.localStorage.getItem("car-market-theme")
    const initial: Theme = saved === "light" || saved === "dark" ? saved : "dark"
    document.documentElement.dataset.theme = initial
  }, [])

  const toggleTheme = () => {
    const current = document.documentElement.dataset.theme
    const next: Theme = current === "light" ? "dark" : "light"
    document.documentElement.dataset.theme = next
    window.localStorage.setItem("car-market-theme", next)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="สลับโหมดสว่างและมืด"
      className="theme-toggle"
    >
      <span aria-hidden="true">🌓</span>
      <span>สลับธีม</span>
    </button>
  )
}
