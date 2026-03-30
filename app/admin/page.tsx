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


// ================= LOGIN PAGE =================

if(!user){

return(

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<form
onSubmit={login}
className="bg-white p-8 rounded-xl shadow w-96 space-y-4"
>

<h1 className="text-2xl font-bold text-center">
Admin Login
</h1>

<input name="email" placeholder="Email" className="border p-3 w-full rounded"/>
<input name="password" type="password" placeholder="Password" className="border p-3 w-full rounded"/>

<button className="bg-red-600 text-white w-full py-3 rounded">
Login
</button>

</form>

</div>

)

}


// ================= DASHBOARD =================

return(

<div className="min-h-screen bg-gray-100 p-6">

<div className="max-w-7xl mx-auto">

{/* HEADER */}

<div className="flex justify-between items-center mb-10">

<h1 className="text-3xl font-bold">
🚗 Admin Dashboard
</h1>

<div className="flex gap-3">
<a href="/admin/add" className="bg-green-600 text-white px-4 py-2 rounded">
+ เพิ่มรถ
</a>

<a
href="admin/banner/"
className="bg-purple-600 text-white px-4 py-2 rounded"
>
จัดการ Banner
</a>

<button onClick={logout} className="bg-gray-800 text-white px-4 py-2 rounded">
Logout
</button>
</div>

</div>


{/* STATS */}

<div className="grid md:grid-cols-3 gap-6 mb-10">

<div className="bg-white p-6 rounded-xl shadow">
<p className="text-gray-500">รถทั้งหมด</p>
<p className="text-2xl font-bold">{totalCars}</p>
</div>

<div className="bg-white p-6 rounded-xl shadow">
<p className="text-gray-500">มูลค่ารถทั้งหมด</p>
<p className="text-2xl font-bold text-red-600">
{totalValue.toLocaleString()} บาท
</p>
</div>

<div className="bg-white p-6 rounded-xl shadow">
<p className="text-gray-500">รถในหน้านี้</p>
<p className="text-2xl font-bold">
{paginatedCars.length}
</p>
</div>

</div>


{/* FILTER */}

<div className="bg-white p-6 rounded-xl shadow mb-8 grid md:grid-cols-4 gap-4">

<input
placeholder="ค้นหา"
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border p-3 rounded"
/>

<input
placeholder="ยี่ห้อ"
value={brandFilter}
onChange={(e)=>setBrandFilter(e.target.value)}
className="border p-3 rounded"
/>

<input
placeholder="ปี"
value={yearFilter}
onChange={(e)=>setYearFilter(e.target.value)}
className="border p-3 rounded"
/>

<input
placeholder="ราคาไม่เกิน"
value={priceFilter}
onChange={(e)=>setPriceFilter(e.target.value)}
className="border p-3 rounded"
/>

</div>


{/* TABLE */}

<div className="bg-white rounded-xl shadow overflow-hidden">

<table className="w-full">

<thead className="bg-gray-50">

<tr>
<th className="p-4 text-left">รถ</th>
<th className="p-4">ปี</th>
<th className="p-4">ราคา</th>
<th className="p-4">สต็อก</th>
<th className="p-4">สถานะ</th>
<th className="p-4">จัดการ</th>
</tr>

</thead>

<tbody>

{paginatedCars.map((car)=>{

const img = car.image_url?.split(",")[0]

return(

<tr key={car.id} className="border-t">

<td className="p-4 flex items-center gap-4">

<img src={img} className="w-20 h-14 object-cover rounded"/>

<div>
<p className="font-semibold">{car.brand} {car.model}</p>
<p className="text-gray-500 text-sm">{car.mileage} km</p>
</div>

</td>

<td className="text-center">{car.year}</td>

<td className="text-center text-red-600 font-bold">
{Number(car.price).toLocaleString()}
</td>

<td className="text-center">{car.stock ?? 0}</td>

<td className="text-center">

<span className={`px-2 py-1 rounded text-xs ${
car.status === "available"
? "bg-green-100 text-green-600"
: car.status === "sold"
? "bg-red-100 text-red-600"
: "bg-yellow-100 text-yellow-600"
}`}>
{car.status}
</span>

</td>

<td className="text-center space-x-2">

<a href={`/admin/edit/${car.id}`} className="bg-blue-500 text-white px-3 py-1 rounded">
Edit
</a>

<button
onClick={()=>sellCar(car)}
className="bg-yellow-500 text-white px-3 py-1 rounded"
>
ขาย
</button>

<button
onClick={()=>updateStatus(car.id,"sold")}
className="bg-gray-800 text-white px-3 py-1 rounded"
>
Sold
</button>

<button
onClick={()=>deleteCar(car.id)}
className="bg-red-500 text-white px-3 py-1 rounded"
>
Delete
</button>

</td>

</tr>

)

})}

</tbody>

</table>

</div>


{/* PAGINATION */}

<div className="flex justify-center gap-3 mt-6">

{Array.from({length:totalPages}).map((_,i)=>{

const p = i+1

return(

<button
key={p}
onClick={()=>setPage(p)}
className={`px-4 py-2 rounded ${
page===p ? "bg-red-600 text-white" : "bg-white border"
}`}
>
{p}
</button>

)

})}

</div>

</div>

</div>

)

}