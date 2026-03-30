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

<div className="min-h-screen bg-gray-100 p-6">

<div className="max-w-4xl mx-auto">

<h1 className="text-3xl font-bold mb-8">
🚗 เพิ่มรถใหม่
</h1>

<form
onSubmit={handleSubmit}
className="bg-white p-6 rounded-xl shadow grid md:grid-cols-2 gap-4"
>

<input
name="brand"
placeholder="ยี่ห้อ"
className="border p-3 rounded"
/>

<input
name="model"
placeholder="รุ่น"
className="border p-3 rounded"
/>

<input
name="year"
placeholder="ปี"
className="border p-3 rounded"
/>

<input
name="price"
placeholder="ราคา"
className="border p-3 rounded"
/>

<input
name="mileage"
placeholder="เลขไมล์"
className="border p-3 rounded"
/>

<input
name="stock"
type="number"
placeholder="จำนวนสต็อก"
className="border p-3 rounded"
/>


{/* ✅ NEW: CATEGORY DROPDOWN */}
<select
name="category_id"
className="border p-3 rounded"
>
<option value="">เลือกหมวดหมู่</option>

{categories.map((c)=>(
<option key={c.id} value={c.id}>
{c.name}
</option>
))}

</select>


{/* upload */}
<input
type="file"
multiple
accept="image/*"
onChange={handleFileChange}
className="border p-3 rounded md:col-span-2"
/>


{/* preview */}
{preview.length>0 &&(

<div className="grid grid-cols-4 gap-3 md:col-span-2">

{preview.map((img,i)=>(

<img
key={i}
src={img}
className="h-24 w-full object-cover rounded-lg border"
/>

))}

</div>

)}


<textarea
name="description"
placeholder="รายละเอียด"
className="border p-3 rounded md:col-span-2"
/>


<button
disabled={loading}
className="bg-green-600 hover:bg-green-700 text-white py-3 rounded md:col-span-2 font-semibold"
>

{loading ? "กำลังบันทึก..." : "เพิ่มรถ"}

</button>

</form>

</div>

</div>

)

}