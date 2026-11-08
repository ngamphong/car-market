"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import Link from "next/link"
import Image from "next/image"
import ThemeToggle from "../components/ThemeToggle"
import type { User } from "@supabase/supabase-js"
import type { Car, CarStatus, Category, InventoryMovement } from "../types"

export default function AdminPage() {

const [user,setUser] = useState<User | null>(null)
const [cars,setCars] = useState<Car[]>([])
const [categories,setCategories] = useState<Category[]>([])
const [movements,setMovements] = useState<InventoryMovement[]>([])
const [sales30Days,setSales30Days] = useState<{sale_price:number|null;quantity_change:number}[]>([])
const [historyWarning,setHistoryWarning] = useState("")
const [loading,setLoading] = useState(true)

const [search,setSearch] = useState("")
const [brandFilter,setBrandFilter] = useState("")
const [yearFilter,setYearFilter] = useState("")
const [priceFilter,setPriceFilter] = useState("")
const [statusFilter,setStatusFilter] = useState("")
const [selectedIds,setSelectedIds] = useState<number[]>([])
const [bulkCategoryId,setBulkCategoryId] = useState("")
const [bulkStatus,setBulkStatus] = useState("")

const [page,setPage] = useState(1)

const perPage = 5


// ================= LOGIN =================

const checkUser = async ()=>{
const {data} = await supabase.auth.getUser()
setUser(data.user)
setLoading(false)
}

useEffect(()=>{
let active = true
void supabase.auth.getUser().then(({ data }) => {
  if (!active) return
  setUser(data.user)
  setLoading(false)
})
void supabase.from("cars").select("*").order("created_at",{ascending:false}).then(({ data }) => {
  if (active) setCars((data ?? []) as Car[])
})
void supabase.from("categories").select("*").order("name").then(({data})=>{if(active)setCategories((data??[]) as Category[])})
void supabase.auth.getUser().then(async({data})=>{
  if(!active || !data.user)return
  const since=new Date(Date.now()-30*24*60*60*1000).toISOString()
  const [historyResult,salesResult]=await Promise.all([
    supabase.from("inventory_movements").select("*").order("created_at",{ascending:false}).limit(8),
    supabase.from("inventory_movements").select("sale_price,quantity_change").eq("event_type","sale").gte("created_at",since),
  ])
  if(!active)return
  if(historyResult.error || salesResult.error)setHistoryWarning("ยังไม่พบตารางประวัติ กรุณารัน migration 202611090002_inventory_history.sql ใน Supabase")
  setMovements((historyResult.data??[]) as InventoryMovement[])
  setSales30Days((salesResult.data??[]) as {sale_price:number|null;quantity_change:number}[])
})
return () => { active = false }
},[])

const login = async(e:React.FormEvent<HTMLFormElement>)=>{
e.preventDefault()

const form = new FormData(e.currentTarget)

const {error}=await supabase.auth.signInWithPassword({
email:form.get("email") as string,
password:form.get("password") as string
})
if(error){alert("เข้าสู่ระบบไม่สำเร็จ ตรวจสอบอีเมลและรหัสผ่าน");return}
checkUser()
void fetchHistory()
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

const fetchHistory = async()=>{
const since=new Date(Date.now()-30*24*60*60*1000).toISOString()
const [historyResult,salesResult]=await Promise.all([
  supabase.from("inventory_movements").select("*").order("created_at",{ascending:false}).limit(8),
  supabase.from("inventory_movements").select("sale_price,quantity_change").eq("event_type","sale").gte("created_at",since),
])
if(historyResult.error || salesResult.error){setHistoryWarning("ยังไม่พบตารางประวัติ กรุณารัน migration 202611090002_inventory_history.sql ใน Supabase");return}
setHistoryWarning("")
setMovements((historyResult.data??[]) as InventoryMovement[])
setSales30Days((salesResult.data??[]) as {sale_price:number|null;quantity_change:number}[])
}


// ================= DELETE =================

const deleteCar = async(car:Car)=>{
if(!confirm(`ยืนยันลบ ${car.brand} ${car.model} หรือไม่? ประวัติสต็อกจะยังถูกเก็บไว้`)) return
const {error}=await supabase.from("cars").delete().eq("id",car.id)
if(error){alert("ลบรถไม่สำเร็จ รายการนี้อาจถูกใช้งานอยู่หรือไม่มีสิทธิ์");return}
setSelectedIds((ids)=>ids.filter((id)=>id!==car.id))
await Promise.all([fetchCars(),fetchHistory()])
}


// ================= UPDATE STATUS =================

const updateStatus = async(car:Car,status:CarStatus)=>{
if(status==="reserved" && Number(car.stock)<1){alert("เพิ่มสต็อกก่อนจองรถ");return}
const patch = status === "sold" ? {status,stock:0} : {status,stock:Math.max(1,Number(car.stock)||0)}
const {error}=await supabase.from("cars").update(patch).eq("id",car.id)
if(error){alert("เปลี่ยนสถานะไม่สำเร็จ");return}
await Promise.all([fetchCars(),fetchHistory()])
}

const adjustStock = async(car:Car,delta:number)=>{
const stock=Math.max(0,(Number(car.stock)||0)+delta)
if(delta<0 && stock===0 && !confirm(`สต็อก ${car.brand} ${car.model} จะเหลือ 0 และเปลี่ยนเป็นขายแล้ว ยืนยันหรือไม่?`))return
const status:CarStatus=stock===0?"sold":car.status==="sold"?"available":car.status as CarStatus
const {error}=await supabase.from("cars").update({stock,status}).eq("id",car.id)
if(error){alert("ปรับสต็อกไม่สำเร็จ");return}
await Promise.all([fetchCars(),fetchHistory()])
}


// ================= SELL (ตัดสต็อก) =================

const sellCar = async(car:Car)=>{
if(Number(car.stock)<1){alert("ไม่มีรถคงเหลือให้บันทึกการขาย");return}
const priceText=window.prompt(`ราคาขายจริงต่อคันของ ${car.brand} ${car.model}`,String(Number(car.price)))
if(priceText===null)return
const salePrice=Number(priceText)
if(!Number.isFinite(salePrice)||salePrice<0){alert("กรุณากรอกราคาขายเป็นตัวเลขตั้งแต่ 0 ขึ้นไป");return}
if(!confirm(`บันทึกขาย ${car.brand} ${car.model} 1 คัน ในราคา ${salePrice.toLocaleString()} บาทหรือไม่?`))return
const {error}=await supabase.rpc("record_car_sale",{p_car_id:car.id,p_quantity:1,p_sale_price:salePrice,p_note:"ขายจากหน้าแอดมิน"})
if(error){alert("บันทึกขายไม่สำเร็จ ตรวจสอบ migration และจำนวนสต็อก");return}
await Promise.all([fetchCars(),fetchHistory()])
}

const toggleSelected=(id:number)=>setSelectedIds((current)=>current.includes(id)?current.filter((item)=>item!==id):[...current,id])
const togglePageSelection=(pageCars:Car[])=>{
const pageIds=pageCars.map((car)=>car.id)
const allSelected=pageIds.length>0 && pageIds.every((id)=>selectedIds.includes(id))
setSelectedIds((current)=>allSelected?current.filter((id)=>!pageIds.includes(id)):[...new Set([...current,...pageIds])])
}
const bulkUpdateCategory=async()=>{
if(!selectedIds.length || !bulkCategoryId)return
if(!confirm(`เปลี่ยนหมวดหมู่รถ ${selectedIds.length} รายการหรือไม่?`))return
const categoryId=bulkCategoryId==="__none__"?null:Number(bulkCategoryId)
const {error}=await supabase.from("cars").update({category_id:categoryId}).in("id",selectedIds)
if(error){alert("เปลี่ยนหมวดหมู่ไม่สำเร็จ");return}
setSelectedIds([]);setBulkCategoryId("");await fetchCars()
}
const bulkUpdateStatus=async()=>{
if(!selectedIds.length || !bulkStatus)return
const picked=cars.filter((car)=>selectedIds.includes(car.id))
if(bulkStatus!=="sold" && picked.some((car)=>Number(car.stock)<1)){alert("รถที่สต็อกเป็นศูนย์ต้องเพิ่มสต็อกก่อนตั้งเป็นพร้อมขายหรือจอง");return}
if(!confirm(`เปลี่ยนสถานะรถ ${selectedIds.length} รายการเป็น “${bulkStatus==="sold"?"ขายแล้ว":bulkStatus==="reserved"?"จองแล้ว":"พร้อมขาย"}” หรือไม่?`))return
const values=bulkStatus==="sold"?{status:"sold",stock:0}:{status:bulkStatus}
const {error}=await supabase.from("cars").update(values).in("id",selectedIds)
if(error){alert("เปลี่ยนสถานะเป็นชุดไม่สำเร็จ");return}
setSelectedIds([]);setBulkStatus("");await Promise.all([fetchCars(),fetchHistory()])
}
const bulkDelete=async()=>{
if(!selectedIds.length)return
const phrase=window.prompt(`กำลังลบรถ ${selectedIds.length} รายการอย่างถาวร ประวัติสต็อกยังคงอยู่\nพิมพ์ ลบ เพื่อยืนยัน`)
if(phrase!=="ลบ")return
const {error}=await supabase.from("cars").delete().in("id",selectedIds)
if(error){alert("ลบรายการไม่สำเร็จ");return}
setSelectedIds([]);await Promise.all([fetchCars(),fetchHistory()])
}


// ================= FILTER =================

const filtered = cars.filter((car)=>{

return(

`${car.brand} ${car.model}`.toLowerCase().includes(search.toLowerCase())

&& (brandFilter ? car.brand.toLowerCase().includes(brandFilter.toLowerCase()) : true)

&& (yearFilter ? String(car.year) === yearFilter : true)

&& (priceFilter ? Number(car.price) <= Number(priceFilter) : true)
&& (statusFilter ? (statusFilter === "available" ? car.status === "available" && Number(car.stock)>0 : car.status === statusFilter) : true)

)

})


// ================= PAGINATION =================

const totalPages = Math.ceil(filtered.length / perPage)

const start = (page-1) * perPage

const paginatedCars = filtered.slice(start,start+perPage)


// ================= STATS =================

const totalCars = cars.length
const availableUnits = cars.filter((car)=>car.status==="available").reduce((sum,car)=>sum+Number(car.stock||0),0)
const reservedUnits = cars.filter((car)=>car.status==="reserved").reduce((sum,car)=>sum+Number(car.stock||0),0)
const soldCars = cars.filter((car)=>car.status==="sold" || Number(car.stock)===0).length
const totalValue = cars.filter((car)=>car.status!=="sold").reduce((sum,c)=>sum + Number(c.price)*Number(c.stock||0),0)
const revenue30Days=sales30Days.reduce((sum,sale)=>sum+Math.abs(Number(sale.quantity_change))*Number(sale.sale_price||0),0)


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
    display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px;
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
    border-radius: 8px; overflow: auto;
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

  .bulk-bar,.movement-preview{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:14px 16px;margin-bottom:16px}
  .bulk-bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.bulk-bar select,.bulk-bar button{min-height:40px;padding:8px 12px;border-radius:5px;border:1px solid var(--border-strong);background:var(--surface2);color:var(--text)}
  .bulk-bar button{cursor:pointer;font-weight:700}.bulk-bar .bulk-danger{background:var(--red-dim);color:var(--red);border-color:rgba(232,25,26,.35)}.bulk-bar button:disabled{opacity:.45;cursor:not-allowed}
  .stock-stepper{display:inline-flex;align-items:center;gap:8px}.stock-stepper button{width:36px;height:36px;border-radius:6px;border:1px solid var(--border-strong);background:var(--surface2);color:var(--text);font-size:1rem;cursor:pointer}.stock-stepper button:disabled{opacity:.4;cursor:not-allowed}
  .movement-preview h2{font-size:1rem;margin-bottom:12px}.movement-list{display:grid;gap:8px}.movement-item{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--border);font-size:.86rem}.movement-item:last-child{border-bottom:0}.movement-item small{display:block;color:var(--muted2);margin-top:3px}.movement-preview a{color:var(--blue);white-space:nowrap}.inventory-notice{padding:12px 16px;margin-bottom:14px;border-radius:6px;background:rgba(234,179,8,.12);color:var(--yellow)}

  /* ── RESPONSIVE ── */
  @media(max-width: 900px) {
    .stats-row { grid-template-columns: repeat(3, 1fr); }
    .filter-bar { grid-template-columns: 1fr 1fr; }
    .admin-content { padding: 16px; }
  }
  @media(max-width: 600px) {
    .stats-row { grid-template-columns: 1fr 1fr; }
    .filter-bar { grid-template-columns: 1fr; }
    .nav-pill span { display: none; }
    .admin-nav{padding:8px 12px}.admin-nav-inner{height:auto;align-items:flex-start;flex-direction:column}.admin-nav-inner>div:last-child{width:100%;justify-content:flex-start!important}.movement-item{align-items:flex-start;flex-direction:column}.movement-item small{display:inline;margin-left:6px}
  }
  @media(max-width:360px){.stats-row{grid-template-columns:1fr}.bulk-bar>*{width:100%}}
`


// ================= LOGIN PAGE =================

if(loading){
return(
<>
<style>{S}</style>
<div className="login-page" role="status" aria-live="polite">กำลังตรวจสอบบัญชีผู้ดูแลระบบ…</div>
</>
)
}

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
        <Link href="/"><div className="admin-brand">KKC <span>CAR</span> HUB</div></Link>
        <span className="admin-brand-sub">Admin Dashboard</span>
      </div>
      <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
        <ThemeToggle />
        <Link href="/admin/add" className="nav-pill nav-pill-green">
          <span>＋</span><span>เพิ่มรถ</span>
        </Link>
        <Link href="/admin/banner" className="nav-pill nav-pill-purple">
          <span>⊞</span><span>จัดการ Banner</span>
        </Link>
        <Link href="/admin/categories" className="nav-pill nav-pill-dark"><span>หมวดหมู่</span></Link>
        <Link href="/admin/inquiries" className="nav-pill nav-pill-dark"><span>คำถามลูกค้า</span></Link>
        <Link href="/admin/history" className="nav-pill nav-pill-dark"><span>ประวัติสต็อก</span></Link>
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
        <div className="stat-label">รายการรถ</div>
        <div className="stat-value blue">{totalCars}</div>
      </div>
      <div className="stat-card red">
        <div className="stat-label">มูลค่าสต็อกคงเหลือ</div>
        <div className="stat-value red">{totalValue.toLocaleString()} ฿</div>
      </div>
      <div className="stat-card green">
        <div className="stat-label">พร้อมขาย / จอง</div>
        <div className="stat-value green">{availableUnits} / {reservedUnits}</div>
      </div>
      <div className="stat-card blue">
        <div className="stat-label">ขายแล้ว</div>
        <div className="stat-value blue">{soldCars}</div>
      </div>
      <div className="stat-card red">
        <div className="stat-label">ยอดขาย 30 วัน</div>
        <div className="stat-value red">{revenue30Days.toLocaleString()} ฿</div>
      </div>
    </div>
    {historyWarning && <p className="inventory-notice" role="status">{historyWarning}</p>}

    {/* FILTER */}
    <div className="filter-bar">
      <input
        placeholder="🔍 ค้นหา"
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="filter-input"
      />
      <select className="filter-input" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} aria-label="กรองสถานะรถ">
        <option value="">ทุกสถานะ</option><option value="available">พร้อมขาย</option><option value="reserved">จองแล้ว</option><option value="sold">ขายแล้ว</option>
      </select>
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

    {selectedIds.length>0 && <div className="bulk-bar" aria-label="จัดการรถที่เลือก">
      <strong>เลือก {selectedIds.length} รายการ</strong>
      <select aria-label="เปลี่ยนหมวดหมู่รถที่เลือก" value={bulkCategoryId} onChange={(event)=>setBulkCategoryId(event.target.value)}>
        <option value="">เลือกหมวดหมู่เพื่อเปลี่ยน</option><option value="__none__">ไม่ระบุหมวดหมู่</option>
        {categories.map((category)=><option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
      <button type="button" disabled={!bulkCategoryId} onClick={()=>void bulkUpdateCategory()}>ใช้หมวดหมู่</button>
      <select aria-label="เปลี่ยนสถานะรถที่เลือก" value={bulkStatus} onChange={(event)=>setBulkStatus(event.target.value)}>
        <option value="">เลือกสถานะเพื่อเปลี่ยน</option><option value="available">พร้อมขาย</option><option value="reserved">จองแล้ว</option><option value="sold">ขายแล้ว / ตัดสต็อกเป็นศูนย์</option>
      </select>
      <button type="button" disabled={!bulkStatus} onClick={()=>void bulkUpdateStatus()}>ใช้สถานะ</button>
      <button type="button" className="bulk-danger" onClick={()=>void bulkDelete()}>ลบที่เลือก</button>
      <button type="button" onClick={()=>setSelectedIds([])}>ล้างการเลือก</button>
    </div>}

    {/* TABLE */}
    <div className="table-wrap">
      <table>
        <thead className="table-head">
          <tr>
            <th className="center"><input type="checkbox" aria-label="เลือกหรือยกเลิกรถทั้งหมดในหน้านี้" checked={paginatedCars.length>0 && paginatedCars.every((car)=>selectedIds.includes(car.id))} onChange={()=>togglePageSelection(paginatedCars)} /></th>
            <th>รถ</th>
            <th className="center">ปี</th>
            <th className="center">ราคา</th>
            <th className="center">สต็อก</th>
            <th className="center">สถานะ</th>
            <th className="center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCars.length===0 && <tr><td colSpan={7} style={{textAlign:"center",padding:24,color:"var(--muted2)"}}>ไม่พบรถตามตัวกรอง</td></tr>}
          {paginatedCars.map((car)=>{
            const img = car.image_url?.split(",")[0]
            return(
              <tr key={car.id}>
                <td className="center"><input type="checkbox" aria-label={`เลือกรถ ${car.brand} ${car.model}`} checked={selectedIds.includes(car.id)} onChange={()=>toggleSelected(car.id)} /></td>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                    <Image src={img || "/file.svg"} alt={`${car.brand} ${car.model}`} width={64} height={48} className="car-thumb" />
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
                  <div className="stock-stepper">
                    <button aria-label={`ลดสต็อก ${car.brand} ${car.model}`} onClick={()=>adjustStock(car,-1)} disabled={Number(car.stock)<=0}>−</button>
                    <strong>{car.stock ?? 0}</strong>
                    <button aria-label={`เพิ่มสต็อก ${car.brand} ${car.model}`} onClick={()=>adjustStock(car,1)}>＋</button>
                  </div>
                </td>
                <td className="center">
                  <span className={`status-pill ${
                    car.status === "available" ? "status-available"
                    : car.status === "sold" ? "status-sold"
                    : "status-other"
                  }`}>
                    {car.status === "available" ? "พร้อมขาย" : car.status === "reserved" ? "จองแล้ว" : "ขายแล้ว"}
                  </span>
                </td>
                <td className="center">
                  <div className="action-btns">
                    <a href={`/admin/edit/${car.id}`} className="act-btn act-edit">Edit</a>
                    <button disabled={car.status === "sold" || Number(car.stock)<1} onClick={()=>sellCar(car)} className="act-btn act-sell">ขาย</button>
                    {car.status !== "sold" && <button onClick={()=>updateStatus(car,car.status === "reserved" ? "available" : "reserved")} className="act-btn act-sold">{car.status === "reserved" ? "ยกเลิกจอง" : "จอง"}</button>}
                    {car.status !== "sold" && <button onClick={()=>updateStatus(car,"sold")} className="act-btn act-sold">ขายหมด</button>}
                    <button onClick={()=>deleteCar(car)} className="act-btn act-del">ลบ</button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>

    <section className="movement-preview" aria-label="ประวัติสต็อกล่าสุด">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginBottom:12}}><h2>ประวัติสต็อกล่าสุด</h2><Link href="/admin/history">ดูทั้งหมด →</Link></div>
      {movements.length===0 ? <p style={{color:'var(--muted2)'}}>ยังไม่มีประวัติ หรือยังไม่ได้ติดตั้ง migration</p> : <div className="movement-list">{movements.map((movement)=><div className="movement-item" key={movement.id}>
        <span><strong>{movement.car_label}</strong><small>{movement.event_type==="sale"?"ขายรถ":movement.event_type==="stock_received"?"รับรถเข้าสต็อก":movement.event_type==="stock_adjustment"?"ปรับสต็อก":movement.event_type==="car_deleted"?"ลบรายการรถ":"เปลี่ยนสถานะ"} · {new Date(movement.created_at).toLocaleString("th-TH")} · {movement.actor_email||"ไม่ระบุผู้ใช้"}</small></span>
        <span>{movement.quantity_change>0?`+${movement.quantity_change}`:movement.quantity_change} คัน · คงเหลือ {movement.stock_after}{movement.event_type==="sale"&&movement.sale_price!==null?` · ${Number(movement.sale_price).toLocaleString()} ฿/คัน`:""}</span>
      </div>)}</div>}
    </section>

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
