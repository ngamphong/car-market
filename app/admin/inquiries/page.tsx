"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"
import type { CustomerInquiry } from "../../types"
import ThemeToggle from "../../components/ThemeToggle"

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([])
  const [signedIn, setSignedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState("")

  useEffect(() => {
    let active = true
    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      setSignedIn(Boolean(data.user))
      if (!data.user) {
        setLoading(false)
        return
      }
      void supabase.from("customer_inquiries").select("*").order("created_at", { ascending: false }).then(({ data: rows, error }) => {
        if (!active) return
        if (error) setNotice("โหลดคำถามไม่สำเร็จ กรุณาตรวจว่ารัน migration ของ customer_inquiries แล้ว")
        setInquiries((rows ?? []) as CustomerInquiry[])
        setLoading(false)
      })
    })
    return () => { active = false }
  }, [])

  const updateInquiryStatus = async (inquiry: CustomerInquiry, status: CustomerInquiry["status"]) => {
    const { error } = await supabase.from("customer_inquiries").update({ status }).eq("id", inquiry.id)
    if (error) {
      setNotice("เปลี่ยนสถานะไม่สำเร็จ")
      return
    }
    setInquiries((current) => current.map((item) => item.id === inquiry.id ? { ...item, status } : item))
  }

  return (
    <main className="inquiries-page">
      <header className="inquiries-header">
        <div><p>KKC CAR HUB · ADMIN</p><h1>คำถามจากลูกค้า</h1></div>
        <div className="inquiries-header-actions"><ThemeToggle /><Link href="/admin">กลับหน้าแอดมิน</Link></div>
      </header>
      {!signedIn && !loading ? <p>กรุณาเข้าสู่ระบบผู้ดูแลระบบก่อนดูข้อมูลลูกค้า <Link href="/admin">เข้าสู่ระบบ</Link></p> : null}
      {notice && <p className="inquiries-notice" role="status">{notice}</p>}
      {loading ? <p>กำลังโหลด…</p> : signedIn && inquiries.length === 0 && !notice ? <p>ยังไม่มีคำถามจากลูกค้า</p> : null}
      <section className="inquiries-list">
        {inquiries.map((inquiry) => (
          <article className="inquiry-card" key={inquiry.id}>
            <div className="inquiry-card-top">
              <div><h2>{inquiry.customer_name}</h2><p>{inquiry.car_label} · {new Date(inquiry.created_at).toLocaleString("th-TH")}</p></div>
              <select aria-label={`สถานะคำถามของ ${inquiry.customer_name}`} value={inquiry.status} onChange={(event) => void updateInquiryStatus(inquiry, event.target.value as CustomerInquiry["status"])}>
                <option value="new">ใหม่</option><option value="contacted">ติดต่อแล้ว</option><option value="closed">ปิดเรื่อง</option>
              </select>
            </div>
            <p className="inquiry-message">{inquiry.message}</p>
            <div className="inquiry-contact">
              <a href={`tel:${inquiry.phone}`}>โทร {inquiry.phone}</a>
              {inquiry.line_id && <span>LINE: {inquiry.line_id}</span>}
            </div>
          </article>
        ))}
      </section>
      <style jsx>{`
        .inquiries-page{min-height:100vh;background:var(--black,#0a0a0a);color:var(--text,#f0eee9);padding:24px max(16px,calc((100vw - 1000px)/2));font-family:Arial,sans-serif}
        .inquiries-header,.inquiry-card-top,.inquiry-contact{display:flex;justify-content:space-between;align-items:center;gap:14px}.inquiries-header-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
        .inquiries-header{margin-bottom:22px}.inquiries-header h1{font-size:clamp(1.4rem,4vw,2rem);margin:4px 0}.inquiries-header p{color:#e8191a;font-size:.72rem;letter-spacing:.14em}
        .inquiries-header a,.inquiry-contact a{color:var(--text,#f0eee9)}
        .inquiries-notice{padding:12px 16px;background:var(--surface,#17171b);border-radius:8px}
        .inquiries-list{display:grid;gap:12px}.inquiry-card{background:var(--surface,#17171b);border:1px solid var(--border,rgba(255,255,255,.1));border-radius:9px;padding:18px}
        .inquiry-card h2{font-size:1.05rem;margin:0 0 5px}.inquiry-card-top p{margin:0;color:var(--muted,#888);font-size:.85rem}
        select{max-width:100%;padding:9px;border-radius:6px;background:var(--surface2,#1f1f25);color:var(--text,#f0eee9);border:1px solid var(--border-s,#444)}
        .inquiry-message{white-space:pre-wrap;line-height:1.6}.inquiry-contact{justify-content:flex-start;flex-wrap:wrap;color:var(--muted2,#aaa);font-size:.9rem}
        @media(max-width:520px){.inquiries-header,.inquiry-card-top{align-items:flex-start;flex-direction:column}.inquiries-header-actions{width:100%;justify-content:space-between}.inquiry-card{padding:14px}.inquiry-card-top select{width:100%}}
      `}</style>
    </main>
  )
}
