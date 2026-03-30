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

<div className="p-10 max-w-4xl mx-auto">

<h1 className="text-2xl font-bold mb-6">
🖼 จัดการ Banner
</h1>


{/* UPLOAD */}
<div className="bg-white p-6 rounded shadow mb-6">

<input
type="file"
onChange={handleFileChange}
/>

{/* PREVIEW */}
{preview && (
<div className="mt-4">
<p className="text-sm text-gray-500 mb-2">Preview:</p>
<img
src={preview}
className="w-full h-40 object-cover rounded"
/>
</div>
)}

<button
onClick={uploadBanner}
disabled={loading}
className="bg-green-600 text-white px-4 py-2 rounded mt-4 disabled:opacity-50"
>
{loading ? "กำลังอัพ..." : "อัพโหลด"}
</button>

</div>


{/* LIST */}
<div className="grid grid-cols-2 gap-4">

{banners.map((b)=>(

<div key={b.id} className="relative">

<img
src={b.image_url}
className="w-full h-40 object-cover rounded"
/>

<button
onClick={()=>deleteBanner(b.id)}
className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-sm rounded"
>
ลบ
</button>

</div>

))}

</div>

</div>

)

}