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

<div className="p-10 text-center">
กำลังโหลดข้อมูล...
</div>

)

}


// ---------------- UI ----------------

const img = car.image_url?.split(",")[0]

return(

<div className="min-h-screen bg-gray-100 p-6">

<div className="max-w-3xl mx-auto">

<h1 className="text-3xl font-bold mb-8">
✏️ แก้ไขข้อมูลรถ
</h1>

<div className="bg-white p-6 rounded-xl shadow">

<img
src={img}
className="w-full h-64 object-cover rounded mb-6"
/>

<form
onSubmit={handleSubmit}
className="grid md:grid-cols-2 gap-4"
>

<input
name="brand"
defaultValue={car.brand}
className="border p-3 rounded"
/>

<select
name="category_id"
defaultValue={car.category_id}
className="border p-3 rounded"
>
<option value="">เลือกหมวดหมู่</option>

{categories.map((c)=>(
<option key={c.id} value={c.id}>
{c.name}
</option>
))}

</select>

<input
name="model"
defaultValue={car.model}
className="border p-3 rounded"
/>

<input
name="year"
defaultValue={car.year}
className="border p-3 rounded"
/>

<input
name="price"
defaultValue={car.price}
className="border p-3 rounded"
/>

<input
name="mileage"
defaultValue={car.mileage}
className="border p-3 rounded"
/>

<textarea
name="description"
defaultValue={car.description}
className="border p-3 rounded md:col-span-2"
/>

<button
disabled={loading}
className="bg-blue-600 text-white py-3 rounded md:col-span-2"
>

{loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}

</button>

</form>

</div>

</div>

</div>

)

}