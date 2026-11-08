"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "../../../lib/supabase"
import ThemeToggle from "../../components/ThemeToggle"
import type { InventoryMovement } from "../../types"

const eventLabels: Record<InventoryMovement["event_type"], string> = {
  stock_received: "รับรถเข้าสต็อก",
  stock_adjustment: "ปรับจำนวนสต็อก",
  sale: "ขายรถ",
  status_change: "เปลี่ยนสถานะ",
  car_deleted: "ลบรายการรถ",
}

export default function InventoryHistoryPage() {
  const [rows, setRows] = useState<InventoryMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [signedIn, setSignedIn] = useState(false)
  const [eventFilter, setEventFilter] = useState("")
  const [search, setSearch] = useState("")
  const [notice, setNotice] = useState("")

  useEffect(() => {
    let active = true
    void supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return
      setSignedIn(Boolean(data.user))
      if (!data.user) { setLoading(false); return }
      const { data: movements, error } = await supabase.from("inventory_movements").select("*").order("created_at", { ascending: false }).limit(500)
      if (!active) return
      if (error) setNotice("ประวัติยังโหลดไม่ได้ กรุณารัน migration 202611090002_inventory_history.sql ใน Supabase ก่อน")
      setRows((movements ?? []) as InventoryMovement[])
      setLoading(false)
    })
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => rows.filter((row) =>
    (!eventFilter || row.event_type === eventFilter) &&
    (!search || `${row.car_label} ${row.note ?? ""}`.toLocaleLowerCase("th").includes(search.toLocaleLowerCase("th")))
  ), [rows, eventFilter, search])

  return (
    <main className="history-page">
      <header className="history-header">
        <div><p>KKC CAR HUB · ADMIN</p><h1>ประวัติสต็อกและการขาย</h1></div>
        <div><ThemeToggle /><Link href="/admin">กลับหน้าแอดมิน</Link></div>
      </header>
      {!signedIn && !loading && <p>กรุณาเข้าสู่ระบบผู้ดูแลระบบก่อนดูประวัติ <Link href="/admin">เข้าสู่ระบบ</Link></p>}
      {notice && <p className="history-notice" role="status">{notice}</p>}
      {signedIn && !notice && <>
        <section className="history-filters" aria-label="กรองประวัติ">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหารุ่นรถหรือบันทึก" aria-label="ค้นหาประวัติ" />
          <select value={eventFilter} onChange={(event) => setEventFilter(event.target.value)} aria-label="กรองประเภทประวัติ">
            <option value="">ทุกประเภท</option>{Object.entries(eventLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </section>
        {loading ? <p>กำลังโหลดประวัติ…</p> : filtered.length === 0 ? <p>ยังไม่มีประวัติที่ตรงกับตัวกรอง</p> :
          <div className="history-table-wrap"><table><thead><tr><th>วันเวลา</th><th>ผู้ดำเนินการ</th><th>รถ</th><th>รายการ</th><th>จำนวน</th><th>ยอดขาย</th><th>บันทึก</th></tr></thead>
            <tbody>{filtered.map((row) => <tr key={row.id}>
              <td>{new Date(row.created_at).toLocaleString("th-TH")}</td><td>{row.actor_email || "—"}</td><td>{row.car_label}</td><td>{eventLabels[row.event_type]}</td>
              <td>{row.quantity_change > 0 ? `+${row.quantity_change}` : row.quantity_change} <small>({row.stock_before} → {row.stock_after})</small></td>
              <td>{row.event_type === "sale" && row.sale_price !== null ? `${(Math.abs(row.quantity_change) * Number(row.sale_price)).toLocaleString()} บาท` : "—"}</td>
              <td>{row.note || "—"}</td>
            </tr>)}</tbody>
          </table></div>}
      </>}
      <style jsx>{`
        .history-page{min-height:100vh;background:var(--black,#0a0a0a);color:var(--text,#f0eee9);padding:24px max(16px,calc((100vw - 1200px)/2));font-family:Arial,sans-serif}
        .history-header{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:22px}.history-header>div:last-child{display:flex;align-items:center;gap:12px}.history-header p{margin:0;color:#e8191a;font-size:.72rem;letter-spacing:.14em}.history-header h1{font-size:clamp(1.35rem,4vw,2rem);margin:5px 0}.history-header a{color:var(--text,#f0eee9)}
        .history-notice,.history-filters,.history-table-wrap{padding:16px;background:var(--surface,#17171b);border:1px solid var(--border,rgba(255,255,255,.1));border-radius:9px;margin-bottom:16px}.history-filters{display:flex;gap:10px}.history-filters input,.history-filters select{min-width:0;flex:1;padding:11px;border-radius:6px;background:var(--surface2,#1f1f25);color:var(--text,#f0eee9);border:1px solid var(--border-s,#444)}
        .history-table-wrap{overflow:auto;padding:0}.history-table-wrap table{width:100%;border-collapse:collapse;min-width:760px}.history-table-wrap th,.history-table-wrap td{text-align:left;padding:12px 14px;border-bottom:1px solid var(--border,rgba(255,255,255,.1));vertical-align:top}.history-table-wrap th{color:var(--muted2,#aaa);background:var(--surface2,#1f1f25);font-size:.78rem}.history-table-wrap small{color:var(--muted2,#aaa)}
        @media(max-width:560px){.history-header{align-items:flex-start;flex-direction:column}.history-header>div:last-child{width:100%;justify-content:space-between}.history-filters{flex-direction:column;padding:12px}}
      `}</style>
    </main>
  )
}
