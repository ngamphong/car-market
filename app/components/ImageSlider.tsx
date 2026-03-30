"use client"

import { useState } from "react"

export default function ImageSlider({images}:any){

const [index,setIndex]=useState(0)

return(

<div>

<img
src={images[index]}
className="w-full h-96 object-cover rounded-xl"
/>

<div className="flex gap-3 mt-4">

{images.map((img:string,i:number)=>(

<img
key={i}
src={img}
onClick={()=>setIndex(i)}
className={`w-24 h-16 object-cover cursor-pointer border
${index===i ? "border-red-500":""}`}
/>

))}

</div>

</div>

)

}