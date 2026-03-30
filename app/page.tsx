"use client"

import { useEffect,useState } from "react"
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

<div className="bg-gray-50 min-h-screen">

{/* NAVBAR */}
<div className="bg-white border-b">

<div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">

<div
className="md:hidden text-2xl cursor-pointer"
onClick={()=>setMenuOpen(!menuOpen)}
>
☰
</div>

</div>

{menuOpen &&(

<div className="md:hidden border-t p-4 space-y-3 text-sm">
<p className="cursor-pointer">ซื้อรถ</p>
</div>

)}

</div>


{/* 🔥 BANNER */}
<BannerSlider banners={banners}/>


{/* 🔎 SEARCH BOX */}
<div className="max-w-6xl mx-auto px-4 mt-6">

<div className="bg-white p-4 rounded-lg flex flex-col md:flex-row gap-3 shadow">

<input
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="flex-1 border p-2 rounded"
placeholder="ค้นหายี่ห้อ รุ่น"
/>

<select
value={price}
onChange={(e)=>setPrice(e.target.value)}
className="border p-2 rounded"
>
<option value="">ราคาทั้งหมด</option>
<option value="300">ต่ำกว่า 300,000</option>
<option value="500">300,000 - 500,000</option>
<option value="500plus">500,000+</option>
</select>


{/* ✅ dropdown หมวดหมู่ */}
<select
value={category}
onChange={(e)=>setCategory(e.target.value)}
className="border p-2 rounded"
>
<option value="">ทุกหมวด</option>

{categories.map((c)=>(
<option key={c.id} value={c.id}>
{c.name}
</option>
))}

</select>


<button
onClick={loadCars}
className="bg-red-600 text-white px-6 py-2 rounded"
>
ค้นหา
</button>

</div>

</div>


{/* NEW CARS */}
<div className="max-w-6xl mx-auto px-4 md:p-10">

<h2 className="text-xl md:text-2xl font-bold mb-6">
🚗 รถลงใหม่ล่าสุด
</h2>

<div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">

{cars.slice(0,6).map((car:any)=>(
<CarCard key={car.id} car={car}/>
))}

</div>

</div>


{/* ALL CARS */}
<div className="max-w-6xl mx-auto px-4 pb-16 md:px-10 md:pb-20">

<h2 className="text-xl md:text-2xl font-bold mb-6">
รถมือสองทั้งหมด
</h2>

<div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">

{cars.map((car:any)=>(
<CarCard key={car.id} car={car}/>
))}

</div>

</div>


{/* SELL */}
<div className="bg-red-600 text-white py-12 md:py-14">

<div className="max-w-6xl mx-auto text-center px-4">

<h2 className="text-2xl md:text-3xl font-bold mb-4">
ขายรถของคุณฟรี
</h2>

<p className="mb-6 text-sm md:text-base">
ลงประกาศขายรถง่าย ๆ ใน 1 นาที
</p>

<button className="bg-white text-red-600 px-6 py-3 rounded font-semibold">
ลงขายรถ
</button>

</div>

</div>


{/* FOOTER */}
<div className="bg-gray-900 text-gray-300 py-10">

<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm px-4">

<div>
<h3 className="font-bold mb-2">เกี่ยวกับเรา</h3>
<p>เว็บไซต์ซื้อขายรถมือสองออนไลน์</p>
</div>

<div>
<h3 className="font-bold mb-2">ติดต่อ</h3>
<p>support@car.com</p>
</div>

</div>

</div>

</div>

)

}