"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function AdminPage() {

const [user,setUser] = useState<any>(null)
const [cars,setCars] = useState<any[]>([])
const [loading,setLoading] = useState(true)

const [search,setSearch] = useState("")
const [brandFilter,setBrandFilter] = useState("")
const [yearFilter,setYearFilter] = useState("")
const [priceFilter,setPriceFilter] = useState("")

const [page,setPage] = useState(1)

const perPage = 5


// ================= LOGIN =================

const checkUser = async ()=>{
const {data} = await supabase.auth.getUser()
setUser(data.user)
setLoading(false)
}

useEffect(()=>{
checkUser()
fetchCars()
},[])

const login = async(e:any)=>{
e.preventDefault()

const form = new FormData(e.target)

await supabase.auth.signInWithPassword({
email:form.get("email") as string,
password:form.get("password") as string
})

checkUser()
}

const logout = async ()=>{
await supabase.auth.signOut()
setUser(null)
}


// ================= FETCH =================

const fetchCars = async ()=>{
const {data} = await supabase
.from("cars")
.select("*")
.order("created_at",{ascending:false})

setCars(data || [])
}


// ================= DELETE =================

const deleteCar = async(id:number)=>{

if(!confirm("ลบรถคันนี้ ?")) return

await supabase
.from("cars")
.delete()
.eq("id",id)

fetchCars()

}


// ================= UPDATE STATUS =================

const updateStatus = async(id:number,status:string)=>{

await supabase
.from("cars")
.update({status})
.eq("id",id)

fetchCars()

}


// ================= SELL (ตัดสต็อก) =================

const sellCar = async(car:any)=>{

if(car.stock <= 1){

await supabase
.from("cars")
.update({
stock:0,
status:"sold"
})
.eq("id",car.id)

}else{

await supabase
.from("cars")
.update({
stock:car.stock - 1
})
.eq("id",car.id)

}

fetchCars()

}


// ================= FILTER =================

const filtered = cars.filter((car)=>{

return(

`${car.brand} ${car.model}`.toLowerCase().includes(search.toLowerCase())

&& (brandFilter ? car.brand.toLowerCase().includes(brandFilter.toLowerCase()) : true)

&& (yearFilter ? String(car.year) === yearFilter : true)

&& (priceFilter ? Number(car.price) <= Number(priceFilter) : true)

)

})


// ================= PAGINATION =================

const totalPages = Math.ceil(filtered.length / perPage)

const start = (page-1) * perPage

const paginatedCars = filtered.slice(start,start+perPage)


// ================= STATS =================

const totalCars = cars.length
const totalValue = cars.reduce((sum,c)=>sum + Number(c.price),0)


// ================= STYLES =================

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@400;600;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --red: #E8191A;
    --red-dark: #B71212;
    --red-dim: rgba(232,25,26,0.15);
    --red-glow: rgba(232,25,26,0.25);
    --black: #0A0A0A;
    --dark: #111114;
    --surface: #17171B;
    --surface2: #1F1F25;
    --surface3: #26262D;
    --border: rgba(255,255,255,0.07);
    --border-strong: rgba(255,255,255,0.12);
    --text: #F0EEE9;
    --muted: #6B6B78;
    --muted2: #888892;
    --green: #22C55E;
    --yellow: #EAB308;
    --blue: #3B82F6;
  }

  body {
    background: var(--black);
    color: var(--text);
    font-family: 'Barlow', sans-serif;
  }

  /* ── SLASH TOP BAR ── */
  .kkc-topbar {
    height: 3px;
    background: linear-gradient(90deg, var(--red) 0%, #fff 35%, var(--red) 55%, #B71212 100%);
  }

  /* ── LOGIN PAGE ── */
  .login-page {
    min-height: 100vh;
    background: var(--black);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .login-page::before {
    content: 'KKC';
    position: absolute; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Bebas Neue', sans-serif;
    font-size: 40vw; line-height: 1;
    color: rgba(255,255,255,0.018);
    pointer-events: none; white-space: nowrap;
    letter-spacing: 0.1em;
  }
  .login-card {
    background: var(--surface);
    border: 1px solid var(--border-strong);
    border-top: 2px solid var(--red);
    border-radius: 8px;
    padding: 40px 36px;
    width: 100%; max-width: 400px;
    position: relative; z-index: 1;
  }
  .login-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.4rem; letter-spacing: 0.15em;
    text-align: center; margin-bottom: 4px;
    color: var(--text);
  }
  .login-logo span { color: var(--red); }
  .login-sub {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--muted2); text-align: center; margin-bottom: 32px;
  }
  .login-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--muted2); margin-bottom: 6px; display: block;
  }
  .login-input {
    width: 100%; background: var(--surface2);
    border: 1px solid var(--border-strong); border-radius: 4px;
    color: var(--text); font-family: 'Barlow', sans-serif; font-size: 0.95rem;
    padding: 12px 14px; outline: none; margin-bottom: 16px;
    transition: border-color 0.2s;
  }
  .login-input:focus { border-color: var(--red); box-shadow: 0 0 0 3px var(--red-glow); }
  .login-btn {
    width: 100%; background: var(--red); color: #fff; border: none; cursor: pointer;
    padding: 13px; border-radius: 4px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.15rem; letter-spacing: 0.15em;
    transition: background 0.2s;
  }
  .login-btn:hover { background: var(--red-dark); }

  /* ── ADMIN SHELL ── */
  .admin-page {
    min-height: 100vh;
    background: var(--black);
  }

  /* ── SIDEBAR-STYLE TOPNAV ── */
  .admin-nav {
    background: var(--dark);
    border-bottom: 1px solid var(--border);
    padding: 0 28px;
    position: sticky; top: 0; z-index: 50;
  }
  .admin-nav-inner {
    max-width: 1400px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    height: 60px; gap: 16px;
  }
  .admin-brand {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem; letter-spacing: 0.15em; line-height: 1;
    color: var(--text); white-space: nowrap;
  }
  .admin-brand span { color: var(--red); }
  .admin-brand-sub {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.55rem; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--muted); display: block; margin-top: -2px;
  }
  .nav-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 4px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    text-decoration: none; border: none; cursor: pointer;
    transition: all 0.2s; white-space: nowrap;
  }
  .nav-pill-green { background: rgba(34,197,94,0.12); color: var(--green); border: 1px solid rgba(34,197,94,0.25); }
  .nav-pill-green:hover { background: rgba(34,197,94,0.22); }
  .nav-pill-purple { background: rgba(139,92,246,0.12); color: #A78BFA; border: 1px solid rgba(139,92,246,0.25); }
  .nav-pill-purple:hover { background: rgba(139,92,246,0.22); }
  .nav-pill-dark { background: var(--surface2); color: var(--muted2); border: 1px solid var(--border); }
  .nav-pill-dark:hover { color: var(--text); border-color: var(--border-strong); }

  /* ── MAIN CONTENT ── */
  .admin-content { max-width: 1400px; margin: 0 auto; padding: 28px; }

  /* ── PAGE TITLE ── */
  .page-title-row {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 28px;
  }
  .page-title-slash {
    width: 4px; height: 32px; background: var(--red); border-radius: 2px;
  }
  .page-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem; letter-spacing: 0.08em; line-height: 1;
  }

  /* ── STAT CARDS ── */
  .stats-row {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
    margin-bottom: 24px;
  }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px; padding: 20px 24px;
    position: relative; overflow: hidden;
  }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .stat-card.red::before { background: var(--red); }
  .stat-card.green::before { background: var(--green); }
  .stat-card.blue::before { background: var(--blue); }
  .stat-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--muted2); margin-bottom: 8px;
  }
  .stat-value {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem; letter-spacing: 0.05em; line-height: 1;
  }
  .stat-value.red { color: var(--red); }
  .stat-value.green { color: var(--green); }
  .stat-value.blue { color: var(--blue); }

  /* ── FILTER BAR ── */
  .filter-bar {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px; padding: 16px 20px;
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
    margin-bottom: 20px;
  }
  .filter-input {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 4px; color: var(--text);
    font-family: 'Barlow', sans-serif; font-size: 0.88rem;
    padding: 10px 14px; outline: none; transition: border-color 0.2s;
    width: 100%;
  }
  .filter-input::placeholder { color: var(--muted); }
  .filter-input:focus { border-color: var(--red); }

  /* ── TABLE ── */
  .table-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px; overflow: hidden;
  }
  .table-head {
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
  }
  .table-wrap table { width: 100%; border-collapse: collapse; }
  .table-wrap th {
    padding: 14px 16px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--muted2); font-weight: 700; text-align: left;
  }
  .table-wrap th.center { text-align: center; }
  .table-wrap td {
    padding: 14px 16px;
    border-top: 1px solid var(--border);
    font-size: 0.9rem; vertical-align: middle;
  }
  .table-wrap td.center { text-align: center; }
  .table-wrap tr:hover td { background: rgba(255,255,255,0.02); }

  /* ── CAR ROW ── */
  .car-thumb {
    width: 80px; height: 54px;
    object-fit: cover; border-radius: 4px;
    border: 1px solid var(--border);
    flex-shrink: 0;
  }
  .car-row-name {
    font-weight: 600; font-size: 0.92rem; color: var(--text); margin-bottom: 3px;
  }
  .car-row-sub {
    font-size: 0.78rem; color: var(--muted2);
  }

  /* ── STATUS BADGE ── */
  .status-pill {
    display: inline-block; padding: 3px 10px; border-radius: 3px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  }
  .status-available { background: rgba(34,197,94,0.12); color: var(--green); border: 1px solid rgba(34,197,94,0.2); }
  .status-sold { background: var(--red-dim); color: var(--red); border: 1px solid var(--border-red, rgba(232,25,26,0.25)); }
  .status-other { background: rgba(234,179,8,0.12); color: var(--yellow); border: 1px solid rgba(234,179,8,0.2); }

  /* ── ACTION BUTTONS ── */
  .action-btns { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
  .act-btn {
    padding: 6px 12px; border-radius: 3px; border: none; cursor: pointer;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    text-decoration: none; display: inline-block;
    transition: all 0.15s; white-space: nowrap;
  }
  .act-edit { background: rgba(59,130,246,0.15); color: var(--blue); border: 1px solid rgba(59,130,246,0.25); }
  .act-edit:hover { background: rgba(59,130,246,0.28); }
  .act-sell { background: rgba(234,179,8,0.12); color: var(--yellow); border: 1px solid rgba(234,179,8,0.2); }
  .act-sell:hover { background: rgba(234,179,8,0.24); }
  .act-sold { background: var(--surface3); color: var(--muted2); border: 1px solid var(--border); }
  .act-sold:hover { color: var(--text); border-color: var(--border-strong); }
  .act-del { background: var(--red-dim); color: var(--red); border: 1px solid rgba(232,25,26,0.25); }
  .act-del:hover { background: rgba(232,25,26,0.28); }

  /* ── PAGINATION ── */
  .pagination {
    display: flex; justify-content: center; align-items: center; gap: 8px;
    margin-top: 24px;
  }
  .page-btn {
    min-width: 36px; height: 36px; border-radius: 4px;
    border: 1px solid var(--border); background: var(--surface);
    color: var(--muted2); cursor: pointer;
    font-family: 'Bebas Neue', sans-serif; font-size: 1rem; letter-spacing: 0.05em;
    transition: all 0.15s; display: flex; align-items: center; justify-content: center;
  }
  .page-btn:hover { border-color: var(--red); color: var(--red); }
  .page-btn.active { background: var(--red); color: #fff; border-color: var(--red); }

  /* ── RESPONSIVE ── */
  @media(max-width: 900px) {
    .stats-row { grid-template-columns: 1fr 1fr; }
    .filter-bar { grid-template-columns: 1fr 1fr; }
    .admin-content { padding: 16px; }
  }
  @media(max-width: 600px) {
    .stats-row { grid-template-columns: 1fr; }
    .filter-bar { grid-template-columns: 1fr; }
    .nav-pill span { display: none; }
  }
`


// ================= LOGIN PAGE =================

if(!user){
return(
<>
<style>{S}</style>
<div className="kkc-topbar"/>
<div className="login-page">
  <form onSubmit={login} className="login-card">
    <div className="login-logo">KKC <span>CAR HUB</span></div>
    <div className="login-sub">Admin Control Panel</div>
    <label className="login-label">Email</label>
    <input name="email" placeholder="admin@kkccar.com" className="login-input"/>
    <label className="login-label">Password</label>
    <input name="password" type="password" placeholder="••••••••" className="login-input"/>
    <button className="login-btn">เข้าสู่ระบบ</button>
  </form>
</div>
</>
)
}


// ================= DASHBOARD =================

return(
<>
<style>{S}</style>
<div className="admin-page">

  {/* TOP SLASH */}
  <div className="kkc-topbar"/>

  {/* NAV */}
  <nav className="admin-nav">
    <div className="admin-nav-inner">
      <div>
        <a href="/"><div className="admin-brand">KKC <span>CAR</span> HUB</div></a>
        <span className="admin-brand-sub">Admin Dashboard</span>
      </div>
      <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
        <a href="/admin/add" className="nav-pill nav-pill-green">
          <span>＋</span><span>เพิ่มรถ</span>
        </a>
        <a href="admin/banner/" className="nav-pill nav-pill-purple">
          <span>⊞</span><span>จัดการ Banner</span>
        </a>
        <button onClick={logout} className="nav-pill nav-pill-dark">
          <span>→</span><span>Logout</span>
        </button>
      </div>
    </div>
  </nav>

  <div className="admin-content">

    {/* PAGE TITLE */}
    <div className="page-title-row">
      <div className="page-title-slash"/>
      <h1 className="page-title">🚗 Admin Dashboard</h1>
    </div>

    {/* STATS */}
    <div className="stats-row">
      <div className="stat-card blue">
        <div className="stat-label">รถทั้งหมด</div>
        <div className="stat-value blue">{totalCars}</div>
      </div>
      <div className="stat-card red">
        <div className="stat-label">มูลค่ารถทั้งหมด</div>
        <div className="stat-value red">{totalValue.toLocaleString()} ฿</div>
      </div>
      <div className="stat-card green">
        <div className="stat-label">รถในหน้านี้</div>
        <div className="stat-value green">{paginatedCars.length}</div>
      </div>
    </div>

    {/* FILTER */}
    <div className="filter-bar">
      <input
        placeholder="🔍 ค้นหา"
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="filter-input"
      />
      <input
        placeholder="ยี่ห้อ"
        value={brandFilter}
        onChange={(e)=>setBrandFilter(e.target.value)}
        className="filter-input"
      />
      <input
        placeholder="ปี"
        value={yearFilter}
        onChange={(e)=>setYearFilter(e.target.value)}
        className="filter-input"
      />
      <input
        placeholder="ราคาไม่เกิน"
        value={priceFilter}
        onChange={(e)=>setPriceFilter(e.target.value)}
        className="filter-input"
      />
    </div>

    {/* TABLE */}
    <div className="table-wrap">
      <table>
        <thead className="table-head">
          <tr>
            <th>รถ</th>
            <th className="center">ปี</th>
            <th className="center">ราคา</th>
            <th className="center">สต็อก</th>
            <th className="center">สถานะ</th>
            <th className="center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCars.map((car)=>{
            const img = car.image_url?.split(",")[0]
            return(
              <tr key={car.id}>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                    <img src={img} className="car-thumb"/>
                    <div>
                      <div className="car-row-name">{car.brand} {car.model}</div>
                      <div className="car-row-sub">{car.mileage?.toLocaleString()} km</div>
                    </div>
                  </div>
                </td>
                <td className="center" style={{color:'var(--muted2)'}}>{car.year}</td>
                <td className="center" style={{color:'var(--red)',fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",fontSize:'1rem',letterSpacing:'0.04em'}}>
                  {Number(car.price).toLocaleString()}
                </td>
                <td className="center" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.1rem',letterSpacing:'0.06em'}}>
                  {car.stock ?? 0}
                </td>
                <td className="center">
                  <span className={`status-pill ${
                    car.status === "available" ? "status-available"
                    : car.status === "sold" ? "status-sold"
                    : "status-other"
                  }`}>
                    {car.status}
                  </span>
                </td>
                <td className="center">
                  <div className="action-btns">
                    <a href={`/admin/edit/${car.id}`} className="act-btn act-edit">Edit</a>
                    <button onClick={()=>sellCar(car)} className="act-btn act-sell">ขาย</button>
                    <button onClick={()=>updateStatus(car.id,"sold")} className="act-btn act-sold">Sold</button>
                    <button onClick={()=>deleteCar(car.id)} className="act-btn act-del">Delete</button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>

    {/* PAGINATION */}
    <div className="pagination">
      {Array.from({length:totalPages}).map((_,i)=>{
        const p = i+1
        return(
          <button
            key={p}
            onClick={()=>setPage(p)}
            className={`page-btn ${page===p ? "active" : ""}`}
          >
            {p}
          </button>
        )
      })}
    </div>

  </div>
</div>
</>
)

}