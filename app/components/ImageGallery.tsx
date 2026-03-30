"use client"

import { useState } from "react"

export default function ImageGallery({ images }: { images: string[] }) {

const [main,setMain]=useState(images[0])

return(

<div>

{/* รูปใหญ่ */}

<div className="border rounded-lg overflow-hidden">

<img
src={main}
className="w-full h-[400px] object-cover hover:scale-110 transition duration-300 cursor-zoom-in"
/>

</div>


{/* Thumbnail */}

<div className="flex gap-3 mt-4 overflow-x-auto">

{images.map((img,index)=>(

<img
key={index}
src={img}
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