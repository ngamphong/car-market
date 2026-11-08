"use client"

import { useState } from "react"

export default function ShareButton({ title }: { title: string }) {
  const [message, setMessage] = useState("")

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
      } else {
        await navigator.clipboard.writeText(url)
        setMessage("คัดลอกลิงก์แล้ว")
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        setMessage("แชร์ไม่สำเร็จ กรุณาลองคัดลอกลิงก์จากเบราว์เซอร์")
      }
    }
  }

  return (
    <div className="share-control">
      <button type="button" className="btn-share" onClick={share} aria-label="แชร์ประกาศรถคันนี้">
        ↗ แชร์รถคันนี้
      </button>
      {message && <span role="status" className="share-message">{message}</span>}
    </div>
  )
}
