"use client"

import { useState, type FormEvent } from "react"
import { supabase } from "../../lib/supabase"

type CustomerInquiryFormProps = {
  carId: number
  carLabel: string
}

export default function CustomerInquiryForm({ carId, carLabel }: CustomerInquiryFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [isError, setIsError] = useState(false)

  const submitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    setSubmitting(true)
    setFeedback("")

    const formData = new FormData(formElement)
    const { error } = await supabase.from("customer_inquiries").insert({
      car_id: String(carId),
      car_label: carLabel,
      customer_name: String(formData.get("customer_name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      line_id: String(formData.get("line_id") ?? "").trim() || null,
      message: String(formData.get("message") ?? "").trim(),
      status: "new",
    })

    setSubmitting(false)
    if (error) {
      setIsError(true)
      setFeedback("ส่งคำถามไม่สำเร็จ กรุณาลองใหม่หรือติดต่อทางโทรศัพท์")
      return
    }

    formElement.reset()
    setIsError(false)
    setFeedback("ส่งคำถามแล้ว ทางร้านจะติดต่อกลับโดยเร็ว")
  }

  return (
    <form className="inquiry-form" onSubmit={submitInquiry}>
      <h3>สอบถามรถคันนี้</h3>
      <label htmlFor="customer-name">ชื่อ</label>
      <input id="customer-name" name="customer_name" autoComplete="name" maxLength={100} required />
      <label htmlFor="customer-phone">เบอร์โทรศัพท์</label>
      <input id="customer-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} required />
      <label htmlFor="customer-line">LINE ID (ถ้ามี)</label>
      <input id="customer-line" name="line_id" autoComplete="off" maxLength={50} />
      <label htmlFor="customer-message">ข้อความ</label>
      <textarea id="customer-message" name="message" maxLength={2000} rows={4} required defaultValue={`สนใจ ${carLabel}`} />
      <button type="submit" className="btn-inquiry" disabled={submitting}>
        {submitting ? "กำลังส่ง…" : "ส่งคำถามให้ร้าน"}
      </button>
      {feedback && <p role="status" className={isError ? "inquiry-feedback error" : "inquiry-feedback"}>{feedback}</p>}
    </form>
  )
}
