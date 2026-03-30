"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import CarCard from "./components/CarCard"
import BannerSlider from "./components/BannerSlider"

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

// ✅ filter category
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
<>
<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Noto+Serif+Thai:wght@300;400;600;700&family=DM+Mono:wght@400;500&display=swap');

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

  :root{
    --ink:#0D0C0A;
    --paper:#F7F4EE;
    --paper2:#EDE9E0;
    --gold:#B8923A;
    --gold-light:#D4A84B;
    --gold-pale:#F0E4C4;
    --red:#C0392B;
    --muted:#7A7670;
    --rule:rgba(13,12,10,0.12);
    --rule-gold:rgba(184,146,58,0.35);
  }

  body{
    background:var(--paper);
    color:var(--ink);
    font-family:'Noto Serif Thai','Playfair Display',serif;
  }

  /* ── MARQUEE TAPE ── */
  .tape{
    background:var(--ink);
    overflow:hidden;
    padding:7px 0;
    border-bottom:1px solid var(--gold);
  }
  .tape-track{
    display:flex;gap:0;
    animation:tape-scroll 28s linear infinite;
    white-space:nowrap;
  }
  .tape-item{
    font-family:'DM Mono',monospace;
    font-size:0.68rem;
    letter-spacing:0.2em;
    text-transform:uppercase;
    color:var(--gold-light);
    padding:0 32px;
  }
  .tape-dot{color:var(--red);margin:0 4px;}
  @keyframes tape-scroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}

  /* ── MASTHEAD ── */
  .masthead{
    background:var(--paper);
    border-bottom:3px double var(--ink);
    padding:0 40px;
  }
  .masthead-top{
    display:flex;align-items:center;justify-content:space-between;
    padding:18px 0 12px;
    border-bottom:1px solid var(--rule);
  }
  .masthead-meta{
    font-family:'DM Mono',monospace;
    font-size:0.65rem;letter-spacing:0.15em;
    text-transform:uppercase;color:var(--muted);
    line-height:1.6;
  }
  .masthead-logo{
    text-align:center;flex:1;
  }
  .logo-wordmark{
    font-family:'Playfair Display',serif;
    font-size:clamp(2.4rem,5vw,4.2rem);
    font-weight:900;letter-spacing:0.18em;
    text-transform:uppercase;color:var(--ink);
    line-height:1;
  }
  .logo-wordmark em{
    font-style:italic;color:var(--gold);
  }
  .logo-sub{
    font-family:'DM Mono',monospace;
    font-size:0.6rem;letter-spacing:0.35em;
    text-transform:uppercase;color:var(--muted);
    margin-top:4px;
  }
  .masthead-nav{
    display:flex;gap:24px;align-items:center;
  }
  .masthead-nav a{
    font-family:'DM Mono',monospace;
    font-size:0.68rem;letter-spacing:0.12em;
    text-transform:uppercase;color:var(--muted);
    text-decoration:none;transition:color .2s;
  }
  .masthead-nav a:hover{color:var(--ink);}
  .nav-sell-btn{
    background:var(--ink);color:var(--paper);
    border:none;cursor:pointer;
    font-family:'DM Mono',monospace;
    font-size:0.68rem;letter-spacing:0.12em;
    text-transform:uppercase;
    padding:8px 18px;
    transition:background .2s;
  }
  .nav-sell-btn:hover{background:var(--gold);}

  .masthead-bottom{
    display:flex;align-items:center;justify-content:space-between;
    padding:10px 0;
    font-family:'DM Mono',monospace;
    font-size:0.62rem;letter-spacing:0.15em;
    text-transform:uppercase;color:var(--muted);
    gap:12px;
  }
  .masthead-bottom-rule{flex:1;height:1px;background:var(--rule);}

  .hamburger-btn{
    display:none;
    background:none;border:1px solid var(--rule);
    color:var(--ink);font-size:1.1rem;
    padding:6px 10px;cursor:pointer;
  }
  .mobile-menu-panel{
    background:var(--paper2);
    border-top:1px solid var(--rule);
    padding:20px 40px;
    display:flex;flex-direction:column;gap:14px;
  }
  .mobile-menu-panel a{
    font-family:'DM Mono',monospace;
    font-size:0.75rem;letter-spacing:0.12em;
    text-transform:uppercase;color:var(--muted);
    text-decoration:none;
  }

  /* ── BANNER ── */
  .banner-section{
    padding:32px 40px 0;
    max-width:1400px;margin:0 auto;
  }
  .banner-label{
    font-family:'DM Mono',monospace;
    font-size:0.62rem;letter-spacing:0.25em;
    text-transform:uppercase;color:var(--gold);
    margin-bottom:10px;
    display:flex;align-items:center;gap:10px;
  }
  .banner-label::before,.banner-label::after{
    content:'';flex:1;height:1px;background:var(--rule-gold);
  }
  .banner-frame{
    border:1px solid var(--rule);
    outline:4px solid var(--paper);
    outline-offset:-8px;
    overflow:hidden;
    position:relative;
  }
  .banner-frame::before,.banner-frame::after{
    content:'';position:absolute;
    width:18px;height:18px;
    border-color:var(--gold);border-style:solid;
    z-index:2;pointer-events:none;
  }
  .banner-frame::before{top:8px;left:8px;border-width:2px 0 0 2px;}
  .banner-frame::after{bottom:8px;right:8px;border-width:0 2px 2px 0;}

  /* ── SEARCH ── */
  .search-section{
    padding:28px 40px;
    max-width:1400px;margin:0 auto;
  }
  .search-eyebrow{
    font-family:'Playfair Display',serif;
    font-size:0.75rem;font-style:italic;
    letter-spacing:0.1em;color:var(--gold);
    margin-bottom:8px;
  }
  .search-strip{
    display:flex;
    border:1px solid var(--ink);
    background:var(--paper);
    flex-wrap:wrap;
  }
  .search-strip input{
    flex:1;min-width:200px;
    background:transparent;border:none;outline:none;
    font-family:'Noto Serif Thai',serif;font-size:0.95rem;
    color:var(--ink);padding:14px 20px;
    border-right:1px solid var(--rule);
  }
  .search-strip input::placeholder{color:var(--muted);}
  .search-strip select{
    background:transparent;border:none;outline:none;
    border-right:1px solid var(--rule);
    font-family:'DM Mono',monospace;font-size:0.72rem;
    letter-spacing:0.06em;color:var(--ink);
    padding:14px 16px;cursor:pointer;
    appearance:none;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%237A7670'/%3E%3C/svg%3E");
    background-repeat:no-repeat;background-position:right 10px center;
    padding-right:28px;
  }
  .search-strip select option{background:var(--paper);}
  .search-btn{
    background:var(--ink);color:var(--paper);
    border:none;cursor:pointer;
    font-family:'DM Mono',monospace;
    font-size:0.72rem;letter-spacing:0.2em;text-transform:uppercase;
    padding:14px 28px;
    transition:background .2s;
    white-space:nowrap;
  }
  .search-btn:hover{background:var(--gold);}

  /* ── DIVIDER ── */
  .ornament-divider{
    display:flex;align-items:center;gap:0;
    padding:0 40px;max-width:1400px;margin:0 auto;
  }
  .ornament-line{flex:1;height:1px;background:var(--rule);}
  .ornament-center{
    font-size:0.7rem;color:var(--gold);
    padding:0 16px;letter-spacing:0.3em;
  }

  /* ── SECTION HEADING ── */
  .section-wrap{
    max-width:1400px;margin:0 auto;padding:40px 40px;
  }
  .section-heading-row{
    display:grid;
    grid-template-columns:auto 1fr auto;
    align-items:end;gap:20px;
    margin-bottom:28px;
    padding-bottom:16px;
    border-bottom:2px solid var(--ink);
  }
  .section-number{
    font-family:'DM Mono',monospace;
    font-size:0.6rem;letter-spacing:0.2em;
    text-transform:uppercase;color:var(--gold);
    padding-bottom:2px;
  }
  .section-title-main{
    font-family:'Playfair Display',serif;
    font-size:clamp(1.6rem,3vw,2.4rem);
    font-weight:700;letter-spacing:0.02em;
    line-height:1;color:var(--ink);
  }
  .section-title-main em{font-style:italic;color:var(--gold);}
  .section-count-badge{
    font-family:'DM Mono',monospace;
    font-size:0.65rem;letter-spacing:0.1em;
    color:var(--muted);padding-bottom:3px;
  }

  /* ── CARS GRID ── */
  .cars-grid{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:1px;
    background:var(--rule);
    border:1px solid var(--rule);
  }
  .cars-grid > *{background:var(--paper);}

  /* ── SELL BAND ── */
  .sell-band{
    background:var(--ink);
    color:var(--paper);
    position:relative;overflow:hidden;
    padding:64px 40px;
  }
  .sell-band::before{
    content:'SELL';
    position:absolute;right:-2%;top:50%;transform:translateY(-50%);
    font-family:'Playfair Display',serif;
    font-size:clamp(8rem,18vw,18rem);
    font-weight:900;font-style:italic;
    color:rgba(255,255,255,0.025);
    letter-spacing:-0.02em;
    pointer-events:none;line-height:1;
    white-space:nowrap;
  }
  .sell-inner{
    max-width:1400px;margin:0 auto;position:relative;
    display:flex;align-items:flex-end;
    justify-content:space-between;gap:40px;flex-wrap:wrap;
  }
  .sell-kicker{
    font-family:'DM Mono',monospace;
    font-size:0.65rem;letter-spacing:0.3em;
    text-transform:uppercase;
    color:var(--gold-light);margin-bottom:10px;
  }
  .sell-headline{
    font-family:'Playfair Display',serif;
    font-size:clamp(2rem,4.5vw,3.8rem);
    font-weight:900;letter-spacing:0.01em;
    line-height:1.1;
  }
  .sell-headline span{font-style:italic;color:var(--gold-light);}
  .sell-body{
    color:rgba(247,244,238,0.55);
    font-size:0.9rem;margin-top:12px;max-width:380px;line-height:1.7;
  }
  .sell-cta{
    background:var(--gold);color:var(--ink);
    border:none;cursor:pointer;
    font-family:'DM Mono',monospace;
    font-size:0.78rem;letter-spacing:0.18em;text-transform:uppercase;
    padding:16px 36px;
    transition:all .2s;flex-shrink:0;
  }
  .sell-cta:hover{background:var(--gold-light);transform:translateY(-2px);}

  /* ── FOOTER ── */
  .footer{
    background:var(--paper2);
    border-top:3px double var(--ink);
    padding:48px 40px 32px;
  }
  .footer-inner{
    max-width:1400px;margin:0 auto;
    display:grid;grid-template-columns:2fr 1fr 1fr;gap:48px;
  }
  .footer-brand{
    font-family:'Playfair Display',serif;
    font-size:1.5rem;font-weight:900;letter-spacing:0.15em;
  }
  .footer-brand em{font-style:italic;color:var(--gold);}
  .footer-tagline{
    font-size:0.82rem;color:var(--muted);margin-top:6px;line-height:1.6;
  }
  .footer-col-title{
    font-family:'DM Mono',monospace;
    font-size:0.62rem;letter-spacing:0.25em;text-transform:uppercase;
    color:var(--gold);margin-bottom:14px;
    padding-bottom:8px;border-bottom:1px solid var(--rule-gold);
  }
  .footer-col a{
    display:block;
    font-size:0.83rem;color:var(--muted);text-decoration:none;
    margin-bottom:7px;transition:color .15s;
  }
  .footer-col a:hover{color:var(--ink);}
  .footer-rule{
    max-width:1400px;margin:28px auto 0;
    padding-top:18px;border-top:1px solid var(--rule);
    display:flex;justify-content:space-between;align-items:center;
    flex-wrap:wrap;gap:10px;
  }
  .footer-copy{
    font-family:'DM Mono',monospace;
    font-size:0.6rem;letter-spacing:0.12em;color:var(--muted);
  }

  /* ── RESPONSIVE ── */
  @media(max-width:768px){
    .masthead{padding:0 20px;}
    .masthead-nav,.nav-sell-btn{display:none;}
    .hamburger-btn{display:block;}
    .masthead-meta{display:none;}
    .banner-section{padding:20px 20px 0;}
    .search-section{padding:20px 20px;}
    .ornament-divider{padding:0 20px;}
    .section-wrap{padding:28px 20px;}
    .search-strip{flex-direction:column;}
    .search-strip input,.search-strip select{
      border-right:none;border-bottom:1px solid var(--rule);
      width:100%;
    }
    .search-btn{width:100%;justify-content:center;padding:14px;}
    .footer{padding:32px 20px;}
    .footer-inner{grid-template-columns:1fr;gap:28px;}
    .sell-band{padding:48px 20px;}
    .sell-inner{flex-direction:column;align-items:flex-start;}
    .mobile-menu-panel{padding:20px;}
  }
  @media(min-width:768px){
    .cars-grid{grid-template-columns:repeat(3,1fr);}
  }
`}</style>

{/* ── TAPE ── */}
<div className="tape">
  <div className="tape-track">
    {[...Array(2)].map((_,i)=>(
      <span key={i} style={{display:'flex',alignItems:'center'}}>
        <span className="tape-item">รถมือสองคุณภาพ</span><span className="tape-dot">◆</span>
        <span className="tape-item">ลงขายฟรี</span><span className="tape-dot">◆</span>
        <span className="tape-item">Used Cars Thailand</span><span className="tape-dot">◆</span>
        <span className="tape-item">ราคาดีที่สุด</span><span className="tape-dot">◆</span>
        <span className="tape-item">ตรวจสอบได้</span><span className="tape-dot">◆</span>
        <span className="tape-item">Best Selection</span><span className="tape-dot">◆</span>
      </span>
    ))}
  </div>
</div>

{/* ── MASTHEAD ── */}
<header className="masthead">
  <div className="masthead-top">
    <div className="masthead-meta">
      ฉบับล่าสุด<br/>
      มีนาคม 2568
    </div>
    <div className="masthead-logo">
      <div className="logo-wordmark">CAR<em>X</em></div>
      <div className="logo-sub">Thailand's Finest Auto Market</div>
    </div>
    <nav className="masthead-nav">
      <a href="#">ซื้อรถ</a>
      <a href="#">ขายรถ</a>
      <a href="#">เปรียบเทียบ</a>
      <button className="nav-sell-btn">ลงขายฟรี</button>
    </nav>
    <button className="hamburger-btn" onClick={()=>setMenuOpen(!menuOpen)}>
      {menuOpen ? '✕' : '☰'}
    </button>
  </div>
  {menuOpen &&(
    <div className="mobile-menu-panel">
      <a href="#">ซื้อรถ</a>
      <a href="#">ขายรถ</a>
      <a href="#">เปรียบเทียบ</a>
      <a href="#">ราคาตลาด</a>
    </div>
  )}
  <div className="masthead-bottom">
    <span>ซื้อ · ขาย · แลกเปลี่ยน</span>
    <div className="masthead-bottom-rule"/>
    <span>Premium · Economy · Luxury</span>
    <div className="masthead-bottom-rule"/>
    <span>กรุงเทพ & ทั่วประเทศ</span>
  </div>
</header>

{/* ── BANNER ── */}
<div className="banner-section">
  <div className="banner-label">Featured Listings</div>
  <div className="banner-frame">
    <BannerSlider banners={banners}/>
  </div>
</div>

{/* ── SEARCH ── */}
<div className="search-section">
  <div className="search-eyebrow">— ค้นหารถในแบบของคุณ</div>
  <div className="search-strip">
    <input
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      placeholder="ยี่ห้อ รุ่น เช่น Toyota Camry…"
    />
    <select value={price} onChange={(e)=>setPrice(e.target.value)}>
      <option value="">ราคาทั้งหมด</option>
      <option value="300">ต่ำกว่า 300,000</option>
      <option value="500">300,000 - 500,000</option>
      <option value="500plus">500,000+</option>
    </select>
    <select value={category} onChange={(e)=>setCategory(e.target.value)}>
      <option value="">ทุกหมวด</option>
      {categories.map((c)=>(
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
    </select>
    <button onClick={loadCars} className="search-btn">ค้นหา →</button>
  </div>
</div>

<div className="ornament-divider">
  <div className="ornament-line"/>
  <div className="ornament-center">✦ ✦ ✦</div>
  <div className="ornament-line"/>
</div>

{/* ── NEW CARS ── */}
<div className="section-wrap">
  <div className="section-heading-row">
    <span className="section-number">No. 01</span>
    <h2 className="section-title-main">รถลงใหม่<em>ล่าสุด</em></h2>
    <span className="section-count-badge">{cars.slice(0,6).length} รายการ</span>
  </div>
  <div className="cars-grid">
    {cars.slice(0,6).map((car:any)=>(
      <CarCard key={car.id} car={car}/>
    ))}
  </div>
</div>

<div className="ornament-divider">
  <div className="ornament-line"/>
  <div className="ornament-center">✦ ✦ ✦</div>
  <div className="ornament-line"/>
</div>

{/* ── ALL CARS ── */}
<div className="section-wrap" style={{paddingTop:24}}>
  <div className="section-heading-row">
    <span className="section-number">No. 02</span>
    <h2 className="section-title-main">รถมือสอง<em>ทั้งหมด</em></h2>
    <span className="section-count-badge">{cars.length} รายการ</span>
  </div>
  <div className="cars-grid">
    {cars.map((car:any)=>(
      <CarCard key={car.id} car={car}/>
    ))}
  </div>
</div>

{/* ── SELL BAND ── */}
<div className="sell-band">
  <div className="sell-inner">
    <div>
      <div className="sell-kicker">Free Listing · ฟรีทุกประเภท</div>
      <h2 className="sell-headline">ขายรถของคุณ<br/><span>วันนี้เลย</span></h2>
      <p className="sell-body">ลงประกาศขายรถง่าย ๆ ใน 1 นาที เข้าถึงผู้ซื้อทั่วประเทศ</p>
    </div>
    <button className="sell-cta">ลงขายรถ →</button>
  </div>
</div>

{/* ── FOOTER ── */}
<footer className="footer">
  <div className="footer-inner">
    <div>
      <div className="footer-brand">CAR<em>X</em></div>
      <p className="footer-tagline">
        แพลตฟอร์มซื้อขายรถมือสองออนไลน์<br/>
        คัดสรรเฉพาะรถคุณภาพ ราคายุติธรรม
      </p>
    </div>
    <div className="footer-col">
      <div className="footer-col-title">เมนู</div>
      <a href="#">ซื้อรถ</a>
      <a href="#">ขายรถ</a>
      <a href="#">เปรียบเทียบ</a>
      <a href="#">ราคาตลาด</a>
    </div>
    <div className="footer-col">
      <div className="footer-col-title">ติดต่อ</div>
      <a href="#">support@car.com</a>
      <a href="#">Line: @carx</a>
      <a href="#">Facebook</a>
    </div>
  </div>
  <div className="footer-rule">
    <span className="footer-copy">© 2568 CARX · All rights reserved</span>
    <span className="footer-copy">เว็บไซต์ซื้อขายรถมือสองออนไลน์</span>
  </div>
</footer>
</>
)

}
