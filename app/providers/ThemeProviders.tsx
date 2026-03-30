"use client"

import { useEffect, useState } from "react"

export default function ThemeProvider({ children }: any){

  const [theme,setTheme] = useState("dark")

  useEffect(()=>{
    const saved = localStorage.getItem("theme")

    if(saved){
      setTheme(saved)
      document.documentElement.classList.toggle("dark", saved === "dark")
    }else{
      // auto detect OS
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const defaultTheme = prefersDark ? "dark" : "light"

      setTheme(defaultTheme)
      document.documentElement.classList.toggle("dark", defaultTheme === "dark")
    }
  },[])

  const toggleTheme = ()=>{
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <>
      {/* ส่ง function ไปใช้ */}
      <div data-theme={theme}>
        {children(toggleTheme, theme)}
      </div>
    </>
  )
}