"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../../lib/supabase"
import { useRouter, useParams } from "next/navigation"

export default function EditCarPage(){

const router = useRouter()
const params = useParams()

const id = params.id as string

const [car,setCar] = useState<any>(null)
const [loading,setLoading] = useState(false)
const [categories,setCategories] = useState<any[]>([])

// ---------------- โหลดข้อมูลรถ ----------------

const fetchCar = async()=>{

const {data} = await supabase
.from("cars")
.select("*")
.eq("id",id)
.single()

setCar(data)

}

useEffect(()=>{
if(id){
fetchCar()
}
},[id])


// ---------------- categories ----------------
const loadCategories = async()=>{

const { data } = await supabase
.from("categories")
.select("*")

setCategories(data || [])

}
useEffect(()=>{
if(id){
fetchCar()
loadCategories()
}
},[id])


// ---------------- UPDATE ----------------

const handleSubmit = async(e:any)=>{

e.preventDefault()

setLoading(true)

const form = new FormData(e.target)

const {error} = await supabase
.from("cars")
.update({

brand:form.get("brand"),
model:form.get("model"),
year:Number(form.get("year")),
price:Number(form.get("price")),
mileage:Number(form.get("mileage")),
description:form.get("description"),
category_id: form.get("category_id")

})
.eq("id",id)

if(error){

console.log(error)

alert("แก้ไขไม่สำเร็จ")

setLoading(false)

return

}

alert("แก้ไขสำเร็จ")

router.push("/admin")
router.refresh()

}


// ---------------- LOADING ----------------

if(!car){
return(
<>
<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@400;600;700&display=swap');
  body{background:#0A0A0A;color:#F0EEE9;font-family:'Barlow',sans-serif;}
`}</style>
<div style={{
  minHeight:'100vh',background:'#0A0A0A',
  display:'flex',alignItems:'center',justifyContent:'center',
  flexDirection:'column',gap:'16px'
}}>
  <div style={{
    width:'40px',height:'40px',borderRadius:'50%',
    border:'3px solid rgba(232,25,26,0.2)',
    borderTopColor:'#E8191A',
    animation:'spin 0.8s linear infinite'
  }}/>
  <div style={{
    fontFamily:"'Barlow Condensed',sans-serif",
    fontSize:'0.72rem',letterSpacing:'0.2em',textTransform:'uppercase',
    color:'#6B6B78'
  }}>กำลังโหลดข้อมูล...</div>
  <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
</div>
</>
)
}


// ---------------- UI ----------------

const img = car.image_url?.split(",")[0]

return(
<>
<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@400;600;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --red: #E8191A;
    --red-dark: #B71212;
    --red-dim: rgba(232,25,26,0.12);
    --red-glow: rgba(232,25,26,0.22);
    --black: #0A0A0A;
    --dark: #111114;
    --surface: #17171B;
    --surface2: #1F1F25;
    --surface3: #26262D;
    --border: rgba(255,255,255,0.07);
    --border-s: rgba(255,255,255,0.12);
    --text: #F0EEE9;
    --muted: #6B6B78;
    --muted2: #888892;
    --blue: #3B82F6;
  }

  body {
    background: var(--black);
    color: var(--text);
    font-family: 'Barlow', sans-serif;
  }

  /* ── TOP SLASH ── */
  .top-slash {
    height: 3px;
    background: linear-gradient(90deg, var(--red) 0%, #fff 35%, var(--red) 55%, var(--red-dark) 100%);
  }

  /* ── NAV ── */
  .edit-nav {
    background: var(--dark);
    border-bottom: 1px solid var(--border);
    padding: 0 28px;
  }
  .edit-nav-inner {
    max-width: 920px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    height: 58px;
  }
  .nav-brand {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem; letter-spacing: 0.15em; color: var(--text);
  }
  .nav-brand span { color: var(--red); }
  .nav-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.75rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted2); text-decoration: none;
    border: 1px solid var(--border);
    padding: 7px 14px; border-radius: 4px;
    transition: all 0.2s;
  }
  .nav-back:hover { color: var(--text); border-color: var(--border-s); }

  /* ── PAGE ── */
  .edit-page {
    min-height: 100vh;
    background: var(--black);
    padding-bottom: 60px;
  }

  .edit-content {
    max-width: 920px; margin: 0 auto; padding: 32px 24px;
  }

  /* ── PAGE TITLE ── */
  .page-title-row {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 28px;
  }
  .title-slash { width: 4px; height: 34px; background: var(--red); border-radius: 2px; flex-shrink: 0; }
  .page-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem; letter-spacing: 0.08em; line-height: 1;
  }
  .page-title-sub {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--muted); margin-top: 2px;
  }

  /* ── MAIN LAYOUT ── */
  .edit-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 20px;
    align-items: start;
  }

  /* ── CAR PHOTO CARD ── */
  .photo-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    position: sticky; top: 24px;
  }
  .photo-top-stripe {
    height: 2px;
    background: var(--red);
  }
  .car-photo {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
    display: block;
  }
  .photo-info {
    padding: 14px 16px;
    border-top: 1px solid var(--border);
  }
  .photo-car-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.2rem; letter-spacing: 0.08em; line-height: 1.1;
    color: var(--text);
  }
  .photo-car-sub {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted2); margin-top: 3px;
  }
  .photo-price {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.4rem; letter-spacing: 0.06em;
    color: var(--red); margin-top: 10px;
  }
  .photo-edit-badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(59,130,246,0.12);
    border: 1px solid rgba(59,130,246,0.25);
    border-radius: 3px; padding: 4px 10px; margin-top: 10px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--blue);
  }

  /* ── FORM CARD ── */
  .form-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-top: 2px solid var(--blue);
    border-radius: 8px;
    overflow: hidden;
  }

  /* ── SECTION ── */
  .form-section {
    padding: 20px 22px;
    border-bottom: 1px solid var(--border);
  }
  .form-section:last-of-type { border-bottom: none; }
  .section-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--blue); margin-bottom: 14px;
    display: flex; align-items: center; gap: 10px;
  }
  .section-label::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(59,130,246,0.3), transparent);
  }

  /* ── FORM GRID ── */
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .col-full { grid-column: 1 / -1; }

  /* ── FIELD ── */
  .field { display: flex; flex-direction: column; gap: 5px; }
  .field-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--muted2);
  }
  .field-input {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text);
    font-family: 'Barlow', sans-serif;
    font-size: 0.92rem;
    padding: 10px 13px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
  }
  .field-input:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.18);
  }
  .field-input option { background: var(--surface2); }
  textarea.field-input { resize: vertical; min-height: 100px; line-height: 1.6; }

  /* ── SUBMIT AREA ── */
  .submit-area {
    padding: 18px 22px;
    background: var(--surface2);
    border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; flex-wrap: wrap;
  }
  .submit-hint {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted);
  }
  .submit-btn {
    background: var(--blue); color: #fff;
    border: none; cursor: pointer;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.05rem; letter-spacing: 0.12em;
    padding: 12px 36px; border-radius: 4px;
    transition: all 0.2s;
    display: flex; align-items: center; gap: 8px;
  }
  .submit-btn:hover:not(:disabled) {
    background: #2563EB;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59,130,246,0.3);
  }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .submit-loader {
    width: 13px; height: 13px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite; flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── RESPONSIVE ── */
  @media(max-width: 700px) {
    .edit-layout { grid-template-columns: 1fr; }
    .photo-card { position: static; }
    .form-grid { grid-template-columns: 1fr; }
    .col-full { grid-column: auto; }
    .edit-content { padding: 20px 16px; }
    .submit-area { flex-direction: column; align-items: stretch; }
    .submit-btn { justify-content: center; }
  }
`}</style>

<div className="edit-page">
  <div className="top-slash"/>

  {/* NAV */}
  <nav className="edit-nav">
    <div className="edit-nav-inner">
      <div className="nav-brand">KKC <span>CAR</span> HUB</div>
      <a href="/admin" className="nav-back">← กลับ Admin</a>
    </div>
  </nav>

  <div className="edit-content">

    {/* TITLE */}
    <div className="page-title-row">
      <div className="title-slash"/>
      <div>
        <div className="page-title">✏️ แก้ไขข้อมูลรถ</div>
        <div className="page-title-sub">KKC Car Hub · Edit Vehicle · ID: {id}</div>
      </div>
    </div>

    {/* LAYOUT */}
    <div className="edit-layout">

      {/* LEFT — PHOTO */}
      <div className="photo-card">
        <div className="photo-top-stripe"/>
        <img src={img} className="car-photo"/>
        <div className="photo-info">
          <div className="photo-car-name">{car.brand} {car.model}</div>
          <div className="photo-car-sub">ปี {car.year} · {Number(car.mileage).toLocaleString()} กม.</div>
          <div className="photo-price">{Number(car.price).toLocaleString()} ฿</div>
          <div className="photo-edit-badge">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            กำลังแก้ไข
          </div>
        </div>
      </div>

      {/* RIGHT — FORM */}
      <form onSubmit={handleSubmit} className="form-card">

        {/* ข้อมูลหลัก */}
        <div className="form-section">
          <div className="section-label">ข้อมูลรถ</div>
          <div className="form-grid">

            <div className="field">
              <label className="field-label">ยี่ห้อ</label>
              <input name="brand" defaultValue={car.brand} className="field-input"/>
            </div>

            <div className="field">
              <label className="field-label">รุ่น</label>
              <input name="model" defaultValue={car.model} className="field-input"/>
            </div>

            <div className="field">
              <label className="field-label">ปี</label>
              <input name="year" defaultValue={car.year} className="field-input"/>
            </div>

            <div className="field">
              <label className="field-label">ราคา (บาท)</label>
              <input name="price" defaultValue={car.price} className="field-input"/>
            </div>

            <div className="field">
              <label className="field-label">เลขไมล์ (กม.)</label>
              <input name="mileage" defaultValue={car.mileage} className="field-input"/>
            </div>

            <div className="field">
              <label className="field-label">หมวดหมู่</label>
              <select name="category_id" defaultValue={car.category_id} className="field-input">
                <option value="">เลือกหมวดหมู่</option>
                {categories.map((c)=>(
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* รายละเอียด */}
        <div className="form-section">
          <div className="section-label">รายละเอียด</div>
          <div className="field">
            <textarea
              name="description"
              defaultValue={car.description}
              className="field-input"
            />
          </div>
        </div>

        {/* SUBMIT */}
        <div className="submit-area">
          <div className="submit-hint">* แก้ไขข้อมูลแล้วกดบันทึก</div>
          <button disabled={loading} className="submit-btn">
            {loading ? (
              <><span className="submit-loader"/>กำลังบันทึก...</>
            ) : (
              <>✓ บันทึกการแก้ไข</>
            )}
          </button>
        </div>

      </form>
    </div>
  </div>
</div>
</>
)

}