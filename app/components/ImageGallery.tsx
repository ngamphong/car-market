"use client"

import { useState } from "react"
import Image from "next/image"

export default function ImageGallery({ images }: { images: string[] }) {

const [main,setMain]=useState(images[0])

return(

<div>

{/* รูปใหญ่ */}

<div className="relative h-[400px] border rounded-lg overflow-hidden">

<Image
src={main}
alt="รูปรถยนต์"
fill
sizes="(max-width: 768px) 100vw, 60vw"
className="w-full h-[400px] object-cover hover:scale-110 transition duration-300 cursor-zoom-in"
/>

</div>


{/* Thumbnail */}

<div className="flex gap-3 mt-4 overflow-x-auto">

{images.map((img,index)=>(

<Image
key={index}
src={img}
alt={`รูปที่ ${index + 1} ของรถยนต์`}
width={96}
height={80}
onClick={()=>setMain(img)}
className={`w-24 h-20 object-cover rounded cursor-pointer border
${main===img ? "border-red-500":"border-gray-200"}
`}
/>

))}

</div>

</div>

)

}
