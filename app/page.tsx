"use client"

import { useEffect,useState } from "react"
import { supabase } from "../lib/supabase"
import CarCard from "./components/CarCard"
import BannerSlider from "./components/BannerSlider"

// ─── KKC CAR HUB — Dark/Red Aggressive Theme ───────────────────────────────
// Font imports (add to your layout.tsx or globals.css):
// @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap');

export default function Home(){

const [cars,setCars]=useState<any[]>([])
const [banners,setBanners]=useState<any[]>([])
const [categories,setCategories]=useState<any[]>([])

const [search,setSearch]=useState("")
const [price,setPrice]=useState("")
const [category,setCategory]=useState("")
const [menuOpen,setMenuOpen]=useState(false)


// ---------------- โหลดรถ ----------------
async function loadCars(){

let query=supabase
.from("cars")
.select("*, categories(name)")
.order("created_at",{ascending:false})

if(search){
query=query.ilike("model",`%${search}%`)
}

if(price==="300"){
query=query.lte("price",300000)
}

if(price==="500"){
query=query.gte("price",300000).lte("price",500000)
}

if(price==="500plus"){
query=query.gte("price",500000)
}

if(category){
query = query.eq("category_id", category)
}

const {data}=await query

setCars(data || [])

}


// ---------------- โหลด Banner ----------------
const loadBanners = async () => {

const { data } = await supabase
.from("banners")
.select("*")
.order("created_at", { ascending: false })

setBanners(data || [])

}


// ---------------- โหลด Category ----------------
const loadCategories = async()=>{

const { data } = await supabase
.from("categories")
.select("*")

setCategories(data || [])

}


// ---------------- INIT ----------------
useEffect(()=>{
loadCars()
loadBanners()
loadCategories()
},[])



return(

<div style={{
  backgroundColor: "#0a0a0a",
  minHeight: "100vh",
  fontFamily: "'Barlow', 'Sarabun', sans-serif",
  color: "#f0f0f0",
}}>

<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,900;1,700&display=swap');

  * { box-sizing: border-box; }

  .kkc-nav {
    background: #0a0a0a;
    border-bottom: 2px solid #cc0000;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 20px rgba(204,0,0,0.25);
  }

  .kkc-nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    height: 64px;
  }

  .kkc-logo {
    display: flex;
    flex-direction: column;
    line-height: 1;
  }

  .kkc-logo-kkc {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    letter-spacing: 3px;
    color: #ffffff;
  }

  .kkc-logo-sub {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 2px;
    color: #cc0000;
  }

  .kkc-logo-thai {
    font-size: 10px;
    color: #888;
    letter-spacing: 0.5px;
    margin-top: 1px;
  }

  .kkc-nav-links {
    display: flex;
    gap: 2rem;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .kkc-nav-links a {
    color: #ccc;
    text-decoration: none;
    transition: color 0.2s;
    padding-bottom: 2px;
    border-bottom: 2px solid transparent;
  }

  .kkc-nav-links a:hover {
    color: #ff2222;
    border-bottom-color: #cc0000;
  }

  .kkc-hamburger {
    display: none;
    background: none;
    border: 1px solid #444;
    color: #fff;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 20px;
    cursor: pointer;
  }

  .kkc-mobile-menu {
    background: #111;
    border-top: 1px solid #222;
    padding: 1rem;
  }

  .kkc-mobile-menu p {
    color: #ccc;
    padding: 0.5rem 0;
    cursor: pointer;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-size: 13px;
    border-bottom: 1px solid #1e1e1e;
  }

  /* Search Box */
  .kkc-search-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem 1rem;
  }

  .kkc-search-box {
    background: #141414;
    border: 1px solid #2a2a2a;
    border-top: 3px solid #cc0000;
    padding: 1.25rem 1.5rem;
    border-radius: 4px;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    box-shadow: 0 4px 30px rgba(0,0,0,0.5);
  }

  .kkc-input {
    flex: 1;
    min-width: 160px;
    background: #1e1e1e;
    border: 1px solid #333;
    color: #f0f0f0;
    padding: 0.6rem 0.9rem;
    border-radius: 3px;
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.2s;
  }

  .kkc-input:focus {
    outline: none;
    border-color: #cc0000;
  }

  .kkc-input::placeholder {
    color: #555;
  }

  .kkc-select {
    background: #1e1e1e;
    border: 1px solid #333;
    color: #f0f0f0;
    padding: 0.6rem 0.9rem;
    border-radius: 3px;
    font-size: 14px;
    font-family: inherit;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .kkc-select:focus {
    outline: none;
    border-color: #cc0000;
  }

  .kkc-select option {
    background: #1e1e1e;
  }

  .kkc-btn-search {
    background: #cc0000;
    color: #fff;
    border: none;
    padding: 0.6rem 2rem;
    border-radius: 3px;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    font-family: inherit;
  }

  .kkc-btn-search:hover {
    background: #ff1a1a;
    transform: translateY(-1px);
  }

  .kkc-btn-search:active {
    transform: translateY(0);
  }

  /* Section */
  .kkc-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem 3rem;
  }

  .kkc-section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    letter-spacing: 3px;
    color: #fff;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .kkc-section-title::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(to right, #cc0000 0%, transparent 100%);
    margin-left: 0.5rem;
  }

  .kkc-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  /* Sell Banner */
  .kkc-sell {
    background: linear-gradient(135deg, #cc0000 0%, #8b0000 100%);
    padding: 3.5rem 1rem;
    position: relative;
    overflow: hidden;
  }

  .kkc-sell::before {
    content: 'KKC';
    position: absolute;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 200px;
    color: rgba(255,255,255,0.05);
    right: -20px;
    top: 50%;
    transform: translateY(-50%);
    letter-spacing: 10px;
    pointer-events: none;
    line-height: 1;
  }

  .kkc-sell-inner {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    position: relative;
  }

  .kkc-sell h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.8rem;
    letter-spacing: 4px;
    color: #fff;
    margin-bottom: 0.75rem;
  }

  .kkc-sell p {
    color: rgba(255,255,255,0.8);
    margin-bottom: 1.5rem;
    font-size: 15px;
  }

  .kkc-btn-sell {
    background: #fff;
    color: #cc0000;
    border: none;
    padding: 0.85rem 2.5rem;
    border-radius: 3px;
    font-weight: 800;
    font-size: 15px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }

  .kkc-btn-sell:hover {
    background: #111;
    color: #ff3333;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
  }

  /* Footer */
  .kkc-footer {
    background: #050505;
    border-top: 1px solid #1e1e1e;
    padding: 2.5rem 1rem;
  }

  .kkc-footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;
  }

  .kkc-footer h3 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    letter-spacing: 2px;
    color: #cc0000;
    margin-bottom: 0.5rem;
  }

  .kkc-footer p {
    color: #555;
    font-size: 13px;
    line-height: 1.6;
  }

  .kkc-footer-bar {
    max-width: 1200px;
    margin: 1.5rem auto 0;
    border-top: 1px solid #1a1a1a;
    padding-top: 1rem;
    text-align: center;
    color: #333;
    font-size: 12px;
    letter-spacing: 1px;
  }

  /* Divider stripe */
  .kkc-stripe {
    height: 4px;
    background: repeating-linear-gradient(
      90deg,
      #cc0000 0px,
      #cc0000 30px,
      #1a1a1a 30px,
      #1a1a1a 40px
    );
    opacity: 0.6;
  }

  @media(min-width: 768px){
    .kkc-hamburger { display: none; }
    .kkc-nav-links { display: flex; }
    .kkc-grid { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .kkc-footer-inner { grid-template-columns: repeat(3, 1fr); }
    .kkc-sell h2 { font-size: 3.5rem; }
  }

  @media(max-width: 767px){
    .kkc-nav-links { display: none; }
    .kkc-hamburger { display: block; }
    .kkc-section-title { font-size: 1.6rem; }
  }
`}</style>


{/* ── NAVBAR ── */}
<nav className="kkc-nav">
  <div className="kkc-nav-inner">

    {/* Logo */}
    <div className="kkc-logo">
      <span className="kkc-logo-kkc">KKC <span style={{color:"#cc0000"}}>CAR HUB</span></span>
      <span className="kkc-logo-thai">รับซื้อ – ขายรถยนต์</span>
    </div>

    {/* Desktop links */}
    <div className="kkc-nav-links">
      <a href="/admin">ขายรถ</a>
      <a href="https://www.facebook.com/NIGPremiumCars/?locale=th_TH">ติดต่อเรา</a>
    </div>

    {/* Hamburger */}
    <button
      className="kkc-hamburger"
      onClick={()=>setMenuOpen(!menuOpen)}
    >
      {menuOpen ? "✕" : "☰"}
    </button>

  </div>

  {menuOpen && (
    <div className="kkc-mobile-menu">
      <a href="/admin">ขายรถ</a>
      <a href="https://www.facebook.com/NIGPremiumCars/?locale=th_TH">ติดต่อเรา</a>
    </div>
  )}
</nav>


{/* ── BANNER ── */}
<BannerSlider banners={banners}/>

<div className="kkc-stripe" />


{/* ── SEARCH BOX ── */}
<div className="kkc-search-wrap">
  <div className="kkc-search-box">

    <input
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      className="kkc-input"
      placeholder="🔍  ค้นหายี่ห้อ / รุ่น"
    />

    <select
      value={price}
      onChange={(e)=>setPrice(e.target.value)}
      className="kkc-select"
    >
      <option value="">ราคาทั้งหมด</option>
      <option value="300">ต่ำกว่า 300,000</option>
      <option value="500">300,000 – 500,000</option>
      <option value="500plus">500,000+</option>
    </select>

    <select
      value={category}
      onChange={(e)=>setCategory(e.target.value)}
      className="kkc-select"
    >
      <option value="">ทุกหมวด</option>
      {categories.map((c)=>(
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
    </select>

    <button onClick={loadCars} className="kkc-btn-search">
      ค้นหา
    </button>

  </div>
</div>


{/* ── NEW CARS ── */}
<div className="kkc-section">
  <h2 className="kkc-section-title">🚗 รถลงใหม่ล่าสุด</h2>
  <div className="kkc-grid">
    {cars.slice(0,6).map((car:any)=>(
      <CarCard key={car.id} car={car}/>
    ))}
  </div>
</div>


{/* ── ALL CARS ── */}
<div className="kkc-section">
  <h2 className="kkc-section-title">รถมือสองทั้งหมด</h2>
  <div className="kkc-grid">
    {cars.map((car:any)=>(
      <CarCard key={car.id} car={car}/>
    ))}
  </div>
</div>




{/* ── FOOTER ── */}
<footer className="kkc-footer">
  <div className="kkc-footer-inner">

    <div>
      <h3>KKC Car Hub</h3>
      <p>เว็บไซต์ซื้อขายรถมือสองออนไลน์<br/>คุณภาพเชื่อถือได้</p>
    </div>

    <div>
      <h3>ติดต่อ</h3>
      <p>support@car.com</p>
    </div>

    <div>
      <h3>เมนู</h3>
      <p>ซื้อรถ · ขายรถ · เกี่ยวกับเรา</p>
    </div>

  </div>

  <div className="kkc-footer-bar">
    © 2025 KKC CAR HUB — รับซื้อ–ขายรถยนต์
  </div>
</footer>

</div>

)

}