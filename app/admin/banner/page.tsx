"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../../lib/supabase"

export default function BannerPage(){

const [file,setFile] = useState<File|null>(null)
const [preview,setPreview] = useState<string>("")
const [banners,setBanners] = useState<any[]>([])
const [loading,setLoading] = useState(false)


// ================= LOAD =================
const loadBanners = async()=>{
const {data,error} = await supabase
.from("banners")
.select("*")
.order("created_at",{ascending:false})

if(error){
console.error(error)
alert("โหลด banner ไม่สำเร็จ")
return
}

setBanners(data || [])
}

useEffect(()=>{
loadBanners()
},[])


// ================= PREVIEW =================
const handleFileChange = (e:any)=>{
const f = e.target.files?.[0]
if(!f) return

setFile(f)
setPreview(URL.createObjectURL(f))
}


// ================= UPLOAD =================
const uploadBanner = async()=>{

if(!file){
alert("กรุณาเลือกไฟล์ก่อน")
return
}

setLoading(true)

try{

const fileName = Date.now()+"-"+file.name

// upload
const {error:uploadError} = await supabase.storage
.from("banner-images")
.upload(fileName,file)

if(uploadError){
console.error(uploadError)
alert("อัพโหลดไม่สำเร็จ")
setLoading(false)
return
}

// get url
const {data} = supabase.storage
.from("banner-images")
.getPublicUrl(fileName)

// insert db
const { data: insertData, error: insertError } = await supabase
.from("banners")
.insert({
  image_url: data.publicUrl
})
.select()

console.log("INSERT DATA:", insertData)
console.log("INSERT ERROR:", insertError)

if(insertError){
console.error(insertError)
alert("บันทึก DB ไม่สำเร็จ")
setLoading(false)
return
}

alert("อัพโหลดสำเร็จ 🎉")

setFile(null)
setPreview("")
loadBanners()

}catch(err){
console.error(err)
alert("เกิด error")
}

setLoading(false)
}


// ================= DELETE =================
const deleteBanner = async(id:number)=>{

if(!confirm("ลบรูปนี้?")) return

await supabase.from("banners").delete().eq("id",id)
loadBanners()

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
    --border-s: rgba(255,255,255,0.13);
    --text: #F0EEE9;
    --muted: #6B6B78;
    --muted2: #888892;
    --green: #22C55E;
    --purple: #A78BFA;
    --purple-dim: rgba(167,139,250,0.12);
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
  .banner-nav {
    background: var(--dark);
    border-bottom: 1px solid var(--border);
    padding: 0 28px;
  }
  .banner-nav-inner {
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
  .banner-page {
    min-height: 100vh;
    background: var(--black);
    padding-bottom: 60px;
  }
  .banner-content {
    max-width: 960px; margin: 0 auto; padding: 32px 24px;
  }

  /* ── PAGE TITLE ── */
  .page-title-row {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 28px;
  }
  .title-slash { width: 4px; height: 34px; background: var(--purple); border-radius: 2px; flex-shrink: 0; }
  .page-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem; letter-spacing: 0.08em; line-height: 1;
  }
  .page-title-sub {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--muted); margin-top: 2px;
  }
  .banner-count-pill {
    margin-left: auto;
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--purple-dim);
    border: 1px solid rgba(167,139,250,0.25);
    border-radius: 4px; padding: 6px 14px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--purple);
  }

  /* ── UPLOAD CARD ── */
  .upload-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-top: 2px solid var(--purple);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 24px;
  }
  .upload-card-header {
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
    padding: 14px 20px;
    display: flex; align-items: center; gap: 10px;
  }
  .upload-card-header-slash {
    width: 3px; height: 18px; background: var(--purple); border-radius: 1px; flex-shrink: 0;
  }
  .card-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.05rem; letter-spacing: 0.1em; color: var(--text);
  }
  .upload-card-body { padding: 20px; }

  /* ── UPLOAD ZONE ── */
  .upload-zone {
    border: 2px dashed var(--border-s);
    border-radius: 6px;
    padding: 28px 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    position: relative;
    margin-bottom: 16px;
  }
  .upload-zone:hover {
    border-color: var(--purple);
    background: var(--purple-dim);
  }
  .upload-zone input[type="file"] {
    position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
  }
  .upload-icon { font-size: 2rem; display: block; margin-bottom: 8px; }
  .upload-text {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.85rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--muted2);
  }
  .upload-sub { font-size: 0.72rem; color: var(--muted); margin-top: 4px; }

  /* ── PREVIEW ── */
  .preview-wrap {
    margin-bottom: 16px;
    border: 1px solid var(--border-s);
    border-radius: 6px;
    overflow: hidden;
    position: relative;
  }
  .preview-label {
    position: absolute; top: 10px; left: 10px; z-index: 1;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.6rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
    background: rgba(10,10,10,0.8);
    color: var(--purple);
    padding: 4px 10px; border-radius: 3px;
    border: 1px solid rgba(167,139,250,0.3);
  }
  .preview-img {
    width: 100%; height: 180px; object-fit: cover; display: block;
  }
  .preview-filename {
    background: var(--surface2);
    border-top: 1px solid var(--border);
    padding: 8px 14px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.68rem; letter-spacing: 0.08em;
    color: var(--muted2);
    display: flex; align-items: center; gap: 6px;
  }

  /* ── UPLOAD BTN ── */
  .upload-btn {
    background: var(--purple); color: #fff;
    border: none; cursor: pointer;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.05rem; letter-spacing: 0.12em;
    padding: 12px 32px; border-radius: 4px;
    transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .upload-btn:hover:not(:disabled) {
    background: #8B5CF6;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(167,139,250,0.3);
  }
  .upload-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  .upload-loader {
    width: 13px; height: 13px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite; flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── BANNER LIST SECTION ── */
  .list-section-header {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 16px;
  }
  .list-section-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--muted2);
  }
  .list-section-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--border-s), transparent);
  }

  /* ── BANNER GRID ── */
  .banner-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  /* ── BANNER ITEM ── */
  .banner-item {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .banner-item:hover { border-color: var(--border-s); }
  .banner-img {
    width: 100%; height: 150px; object-fit: cover; display: block;
  }
  .banner-item-footer {
    padding: 8px 12px;
    display: flex; align-items: center; justify-content: space-between;
    background: var(--surface2);
    border-top: 1px solid var(--border);
  }
  .banner-id {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--muted);
  }
  .delete-btn {
    background: var(--red-dim);
    border: 1px solid rgba(232,25,26,0.25);
    color: var(--red);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 4px 12px; border-radius: 3px;
    cursor: pointer; transition: all 0.15s;
  }
  .delete-btn:hover { background: rgba(232,25,26,0.24); }

  /* ── EMPTY ── */
  .empty-state {
    grid-column: 1 / -1;
    padding: 48px 20px;
    text-align: center;
    border: 2px dashed var(--border-s);
    border-radius: 6px;
  }
  .empty-icon { font-size: 2.5rem; margin-bottom: 10px; display: block; opacity: 0.4; }
  .empty-text {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--muted);
  }

  /* ── RESPONSIVE ── */
  @media(max-width: 600px) {
    .banner-content { padding: 20px 16px; }
    .banner-grid { grid-template-columns: 1fr; }
    .banner-count-pill { display: none; }
  }
`}</style>

<div className="banner-page">
  <div className="top-slash"/>

  {/* NAV */}
  <nav className="banner-nav">
    <div className="banner-nav-inner">
      <div className="nav-brand">KKC <span>CAR</span> HUB</div>
      <a href="/admin" className="nav-back">← กลับ Admin</a>
    </div>
  </nav>

  <div className="banner-content">

    {/* TITLE */}
    <div className="page-title-row">
      <div className="title-slash"/>
      <div>
        <div className="page-title">🖼 จัดการ Banner</div>
        <div className="page-title-sub">KKC Car Hub · Banner Management</div>
      </div>
      <div className="banner-count-pill">
        <span>⊞</span>
        {banners.length} รูป
      </div>
    </div>

    {/* UPLOAD CARD */}
    <div className="upload-card">
      <div className="upload-card-header">
        <div className="upload-card-header-slash"/>
        <span className="card-title">อัพโหลด Banner ใหม่</span>
      </div>
      <div className="upload-card-body">

        {/* UPLOAD ZONE */}
        <div className="upload-zone">
          <input type="file" onChange={handleFileChange}/>
          <span className="upload-icon">🖼</span>
          <div className="upload-text">คลิกหรือลากรูปมาวางที่นี่</div>
          <div className="upload-sub">รองรับ JPG, PNG, WEBP · แนะนำ 1200×400px</div>
        </div>

        {/* PREVIEW */}
        {preview && (
          <div className="preview-wrap">
            <div className="preview-label">Preview</div>
            <img src={preview} className="preview-img"/>
            <div className="preview-filename">
              <span>📎</span>
              <span>{file?.name}</span>
            </div>
          </div>
        )}

        {/* UPLOAD BTN */}
        <button
          onClick={uploadBanner}
          disabled={loading}
          className="upload-btn"
        >
          {loading ? (
            <><span className="upload-loader"/>กำลังอัพ...</>
          ) : (
            <>↑ อัพโหลด Banner</>
          )}
        </button>

      </div>
    </div>

    {/* LIST */}
    <div className="list-section-header">
      <span className="list-section-title">Banner ทั้งหมด</span>
      <div className="list-section-line"/>
    </div>

    <div className="banner-grid">
      {banners.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🖼</span>
          <div className="empty-text">ยังไม่มี Banner · อัพโหลดรูปแรกได้เลย</div>
        </div>
      ) : banners.map((b)=>(
        <div key={b.id} className="banner-item">
          <img src={b.image_url} className="banner-img"/>
          <div className="banner-item-footer">
            <span className="banner-id">ID: {b.id}</span>
            <button
              onClick={()=>deleteBanner(b.id)}
              className="delete-btn"
            >
              ✕ ลบ
            </button>
          </div>
        </div>
      ))}
    </div>

  </div>
</div>
</>
)

}