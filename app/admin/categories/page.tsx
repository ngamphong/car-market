"use client"

import Link from "next/link"
import { useEffect, useState, type FormEvent } from "react"
import { supabase } from "../../../lib/supabase"
import type { Category } from "../../types"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState("")
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    let active = true
    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      setSignedIn(Boolean(data.user))
      if (!data.user) {
        setLoading(false)
        return
      }
      void supabase.from("categories").select("*").order("name").then(({ data: rows, error }) => {
        if (!active) return
        if (error) setNotice("โหลดหมวดหมู่ไม่สำเร็จ")
        setCategories((rows ?? []) as Category[])
        setLoading(false)
      })
    })
    return () => { active = false }
  }, [])

  const saveCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return
    setSaving(true)
    setNotice("")
    const result = editingId === null
      ? await supabase.from("categories").insert({ name: trimmedName }).select().single()
      : await supabase.from("categories").update({ name: trimmedName }).eq("id", editingId).select().single()

    if (result.error) {
      setNotice("บันทึกไม่สำเร็จ ชื่อหมวดหมู่อาจซ้ำหรือมีปัญหาการเชื่อมต่อ")
    } else {
      setCategories((current) => editingId === null
        ? [...current, result.data as Category].sort((a, b) => a.name.localeCompare(b.name, "th"))
        : current.map((category) => category.id === editingId ? result.data as Category : category)
      )
      setName("")
      setEditingId(null)
      setNotice("บันทึกหมวดหมู่แล้ว")
    }
    setSaving(false)
  }

  const deleteCategory = async (category: Category) => {
    if (!window.confirm(`ลบหมวด “${category.name}” หรือไม่?`)) return
    const { error } = await supabase.from("categories").delete().eq("id", category.id)
    if (error) {
      setNotice("ลบไม่สำเร็จ อาจมีรถที่ยังใช้หมวดนี้อยู่ กรุณาเปลี่ยนหมวดรถก่อน")
      return
    }
    setCategories((current) => current.filter((item) => item.id !== category.id))
    if (editingId === category.id) {
      setEditingId(null)
      setName("")
    }
    setNotice("ลบหมวดหมู่แล้ว")
  }

  if (loading) return <main className="admin-tool-page"><p>กำลังโหลด…</p></main>
  if (!signedIn) return <main className="admin-tool-page"><p>กรุณาเข้าสู่ระบบผู้ดูแลระบบก่อนจัดการหมวดหมู่</p><Link href="/admin">ไปหน้าเข้าสู่ระบบ</Link></main>

  return (
    <main className="admin-tool-page">
      <header className="admin-tool-header">
        <div>
          <p className="admin-tool-eyebrow">KKC CAR HUB · ADMIN</p>
          <h1>จัดการหมวดหมู่รถ</h1>
        </div>
        <Link href="/admin" className="admin-tool-back">กลับหน้าแอดมิน</Link>
      </header>

      <form className="admin-tool-form" onSubmit={saveCategory}>
        <label htmlFor="category-name">ชื่อหมวดหมู่</label>
        <div className="admin-tool-form-row">
          <input id="category-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required placeholder="เช่น รถเก๋ง, รถกระบะ" />
          <button type="submit" disabled={saving}>{saving ? "กำลังบันทึก…" : editingId === null ? "เพิ่มหมวดหมู่" : "บันทึกการแก้ไข"}</button>
          {editingId !== null && <button type="button" className="secondary" onClick={() => { setEditingId(null); setName("") }}>ยกเลิก</button>}
        </div>
      </form>

      {notice && <p className="admin-tool-notice" role="status">{notice}</p>}

      <section className="category-list" aria-label="รายการหมวดหมู่">
        {categories.length === 0 ? <p>ยังไม่มีหมวดหมู่ เพิ่มหมวดแรกได้จากช่องด้านบน</p> : categories.map((category) => (
          <article key={category.id} className="category-row">
            <span>{category.name}</span>
            <div>
              <button type="button" className="secondary" onClick={() => { setEditingId(category.id); setName(category.name); setNotice("") }}>แก้ไข</button>
              <button type="button" className="danger" onClick={() => void deleteCategory(category)}>ลบ</button>
            </div>
          </article>
        ))}
      </section>

      <style jsx>{`
        .admin-tool-page{min-height:100vh;background:var(--black,#0a0a0a);color:var(--text,#f0eee9);padding:24px max(16px,calc((100vw - 900px)/2));font-family:Arial,sans-serif}
        .admin-tool-header{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:28px}
        .admin-tool-header h1{font-size:clamp(1.4rem,4vw,2rem);margin:5px 0 0}
        .admin-tool-eyebrow{color:#e8191a;font-size:.72rem;letter-spacing:.14em;margin:0}
        .admin-tool-back{color:var(--text,#f0eee9)}
        .admin-tool-form,.category-list{background:var(--surface,#17171b);border:1px solid var(--border,rgba(255,255,255,.1));border-radius:10px;padding:20px;margin-bottom:18px}
        .admin-tool-form label{display:block;margin-bottom:8px;font-weight:700}
        .admin-tool-form-row{display:flex;gap:10px;flex-wrap:wrap}
        input{flex:1 1 220px;min-width:0;padding:12px;border:1px solid var(--border-s,#444);border-radius:6px;background:var(--surface2,#1f1f25);color:var(--text,#f0eee9)}
        button{padding:10px 14px;border:0;border-radius:6px;background:#e8191a;color:#fff;font-weight:700;cursor:pointer}
        button:disabled{opacity:.6;cursor:wait}
        button.secondary{background:transparent;border:1px solid var(--border-s,#555);color:var(--text,#f0eee9)}
        button.danger{background:rgba(232,25,26,.15);border:1px solid rgba(232,25,26,.4);color:#ff6464}
        .admin-tool-notice{padding:12px 16px;background:var(--surface,#17171b);border-radius:6px}
        .category-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border,rgba(255,255,255,.1))}
        .category-row:last-child{border-bottom:0}
        .category-row div{display:flex;gap:8px}
        @media(max-width:480px){.admin-tool-header{align-items:flex-start;flex-direction:column}.admin-tool-form,.category-list{padding:14px}.category-row{align-items:flex-start}.admin-tool-form-row button{flex:1}}
      `}</style>
    </main>
  )
}
