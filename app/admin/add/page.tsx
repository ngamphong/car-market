"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../../lib/supabase"
import { useRouter } from "next/navigation"

export default function AddCarPage() {

const router = useRouter()

const [files,setFiles] = useState<File[]>([])
const [preview,setPreview] = useState<string[]>([])
const [loading,setLoading] = useState(false)

// ✅ NEW: categories
const [categories, setCategories] = useState<any[]>([])


// ================= โหลดหมวด =================
useEffect(()=>{
loadCategories()
},[])

const loadCategories = async()=>{
const { data } = await supabase
.from("categories")
.select("*")

setCategories(data || [])
}


// ================= เลือกรูป =================
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

if(!e.target.files) return

const selected = Array.from(e.target.files) as File[]

setFiles(selected)

const previews = selected.map((file)=>
URL.createObjectURL(file)
)

setPreview(previews)

}


// ================= เพิ่มรถ =================
const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{

e.preventDefault()
setLoading(true)

const form = new FormData(e.currentTarget)

let imageUrls:string[]=[]


// ---------- upload รูป ----------
for(const file of files){

const fileName = Date.now()+"-"+file.name.replace(/\s/g,"")

const {error} = await supabase.storage
.from("car-images")
.upload(fileName,file)

if(error){
console.log(error)
alert("Upload รูปไม่สำเร็จ")
setLoading(false)
return
}

const {data} = supabase.storage
.from("car-images")
.getPublicUrl(fileName)

imageUrls.push(data.publicUrl)

}


// ---------- insert database ----------
const {error} = await supabase
.from("cars")
.insert({

brand:form.get("brand"),
model:form.get("model"),
year:form.get("year"),
price:form.get("price"),
mileage:form.get("mileage"),
description:form.get("description"),
stock:Number(form.get("stock")) || 1,
status:"available",
image_url:imageUrls.join(","),

// ✅ NEW: category
category_id: form.get("category_id") || null

})

if(error){
console.log(error)
alert("เพิ่มรถไม่สำเร็จ")
setLoading(false)
return
}

alert("เพิ่มรถสำเร็จ")

setFiles([])
setPreview([])

router.push("/admin")
router.refresh()

}


// ================= UI =================
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
    --green: #22C55E;
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
  .add-nav {
    background: var(--dark);
    border-bottom: 1px solid var(--border);
    padding: 0 28px;
  }
  .add-nav-inner {
    max-width: 960px; margin: 0 auto;
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
  .add-page {
    min-height: 100vh;
    background: var(--black);
    padding-bottom: 60px;
  }

  /* ── CONTENT ── */
  .add-content {
    max-width: 960px; margin: 0 auto; padding: 32px 24px;
  }

  /* ── PAGE TITLE ── */
  .page-title-row {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 28px;
  }
  .title-slash { width: 4px; height: 34px; background: var(--red); border-radius: 2px; }
  .page-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem; letter-spacing: 0.08em; line-height: 1;
    color: var(--text);
  }
  .page-title-sub {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--muted); margin-top: 2px;
  }

  /* ── FORM CARD ── */
  .form-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-top: 2px solid var(--red);
    border-radius: 8px;
    overflow: hidden;
  }

  /* ── SECTION ── */
  .form-section {
    padding: 22px 24px;
    border-bottom: 1px solid var(--border);
  }
  .form-section:last-of-type { border-bottom: none; }
  .section-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--red); margin-bottom: 16px;
    display: flex; align-items: center; gap: 10px;
  }
  .section-label::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(232,25,26,0.3), transparent);
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
    font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--muted2);
  }
  .field-input {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text);
    font-family: 'Barlow', sans-serif;
    font-size: 0.92rem;
    padding: 11px 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
  }
  .field-input::placeholder { color: var(--muted); }
  .field-input:focus {
    border-color: var(--red);
    box-shadow: 0 0 0 3px var(--red-glow);
  }
  .field-input option { background: var(--surface2); }

  textarea.field-input {
    resize: vertical; min-height: 100px; line-height: 1.6;
  }

  /* ── FILE UPLOAD ── */
  .upload-zone {
    border: 2px dashed var(--border-s);
    border-radius: 6px;
    padding: 28px 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    position: relative;
  }
  .upload-zone:hover {
    border-color: var(--red);
    background: var(--red-dim);
  }
  .upload-zone input[type="file"] {
    position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
  }
  .upload-icon {
    font-size: 2rem; margin-bottom: 8px;
    display: block;
  }
  .upload-text {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.85rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--muted2);
  }
  .upload-sub {
    font-size: 0.72rem; color: var(--muted); margin-top: 4px;
  }

  /* ── PREVIEW GRID ── */
  .preview-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-top: 14px;
  }
  .preview-thumb {
    aspect-ratio: 4/3;
    width: 100%;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid var(--border-s);
  }
  .preview-count {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--green); margin-top: 10px;
    display: flex; align-items: center; gap: 6px;
  }
  .preview-count::before {
    content: ''; width: 6px; height: 6px;
    border-radius: 50%; background: var(--green); flex-shrink: 0;
  }

  /* ── SUBMIT AREA ── */
  .submit-area {
    padding: 20px 24px;
    background: var(--surface2);
    border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    flex-wrap: wrap;
  }
  .submit-hint {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted);
  }
  .submit-btn {
    background: var(--red);
    color: #fff;
    border: none; cursor: pointer;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem; letter-spacing: 0.12em;
    padding: 13px 40px; border-radius: 4px;
    transition: all 0.2s;
    display: flex; align-items: center; gap: 8px;
    position: relative; overflow: hidden;
  }
  .submit-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .submit-btn:hover:not(:disabled) {
    background: var(--red-dark);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px var(--red-glow);
  }
  .submit-btn:hover:not(:disabled)::before { opacity: 1; }
  .submit-btn:disabled {
    opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none;
  }
  .submit-loader {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── RESPONSIVE ── */
  @media(max-width: 600px) {
    .add-content { padding: 20px 16px; }
    .form-grid { grid-template-columns: 1fr; }
    .col-full { grid-column: auto; }
    .preview-grid { grid-template-columns: repeat(3, 1fr); }
    .submit-area { flex-direction: column; align-items: stretch; }
    .submit-btn { justify-content: center; }
  }
`}</style>

<div className="add-page">
  <div className="top-slash"/>

  {/* NAV */}
  <nav className="add-nav">
    <div className="add-nav-inner">
      <div className="nav-brand">KKC <span>CAR</span> HUB</div>
      <a href="/admin" className="nav-back">← กลับ Admin</a>
    </div>
  </nav>

  <div className="add-content">

    {/* TITLE */}
    <div className="page-title-row">
      <div className="title-slash"/>
      <div>
        <div className="page-title">🚗 เพิ่มรถใหม่</div>
        <div className="page-title-sub">KKC Car Hub · Add New Vehicle</div>
      </div>
    </div>

    {/* FORM */}
    <form onSubmit={handleSubmit} className="form-card">

      {/* ── ข้อมูลพื้นฐาน ── */}
      <div className="form-section">
        <div className="section-label">ข้อมูลรถ</div>
        <div className="form-grid">

          <div className="field">
            <label className="field-label">ยี่ห้อ</label>
            <input name="brand" placeholder="เช่น Toyota, Honda…" className="field-input"/>
          </div>

          <div className="field">
            <label className="field-label">รุ่น</label>
            <input name="model" placeholder="เช่น Camry, Civic…" className="field-input"/>
          </div>

          <div className="field">
            <label className="field-label">ปี</label>
            <input name="year" placeholder="เช่น 2022" className="field-input"/>
          </div>

          <div className="field">
            <label className="field-label">ราคา (บาท)</label>
            <input name="price" placeholder="เช่น 850000" className="field-input"/>
          </div>

          <div className="field">
            <label className="field-label">เลขไมล์ (กม.)</label>
            <input name="mileage" placeholder="เช่น 45000" className="field-input"/>
          </div>

          <div className="field">
            <label className="field-label">จำนวนสต็อก</label>
            <input name="stock" type="number" placeholder="เช่น 1" className="field-input"/>
          </div>

          {/* ✅ NEW: CATEGORY DROPDOWN */}
          <div className="field col-full">
            <label className="field-label">หมวดหมู่</label>
            <select name="category_id" className="field-input">
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((c)=>(
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* ── รูปภาพ ── */}
      <div className="form-section">
        <div className="section-label">รูปภาพ</div>

        <div className="upload-zone">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <span className="upload-icon">📷</span>
          <div className="upload-text">คลิกหรือลากรูปมาวางที่นี่</div>
          <div className="upload-sub">รองรับ JPG, PNG, WEBP · เลือกได้หลายรูป</div>
        </div>

        {preview.length > 0 && (
          <>
            <div className="preview-count">
              เลือกแล้ว {preview.length} รูป
            </div>
            <div className="preview-grid">
              {preview.map((img,i)=>(
                <img key={i} src={img} className="preview-thumb"/>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── รายละเอียด ── */}
      <div className="form-section">
        <div className="section-label">รายละเอียด</div>
        <div className="field">
          <textarea
            name="description"
            placeholder="อธิบายสภาพรถ อุปกรณ์ตกแต่ง ประวัติการใช้งาน…"
            className="field-input"
          />
        </div>
      </div>

      {/* ── SUBMIT ── */}
      <div className="submit-area">
        <div className="submit-hint">* กรอกข้อมูลให้ครบก่อนกดบันทึก</div>
        <button disabled={loading} className="submit-btn">
          {loading ? (
            <>
              <span className="submit-loader"/>
              กำลังบันทึก...
            </>
          ) : (
            <>＋ เพิ่มรถ</>
          )}
        </button>
      </div>

    </form>
  </div>
</div>
</>
)

}