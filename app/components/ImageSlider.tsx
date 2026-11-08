"use client"

import { useState } from "react"
import Image from "next/image"

export default function ImageSlider({ images }: { images: string[] }) {

const [index,setIndex]=useState(0)

return(

<div>

<div className="relative h-96 w-full">
<Image
src={images[index]}
alt={`รูปรถยนต์ที่ ${index + 1}`}
fill
sizes="(max-width: 768px) 100vw, 60vw"
className="w-full h-96 object-cover rounded-xl"
/>
</div>

<div className="flex gap-3 mt-4">

{images.map((img:string,i:number)=>(

<Image
key={i}
src={img}
alt={`รูปย่อที่ ${i + 1}`}
width={96}
height={64}
onClick={()=>setIndex(i)}
className={`w-24 h-16 object-cover cursor-pointer border
${index===i ? "border-red-500":""}`}
/>

))}

</div>

</div>

)

}
