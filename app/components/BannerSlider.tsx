"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { Banner } from "../types"

export default function BannerSlider({ banners }: { banners: Banner[] }) {

const [index, setIndex] = useState(0)

useEffect(() => {
if (!banners?.length) return

const interval = setInterval(() => {
setIndex((prev) => (prev + 1) % banners.length)
}, 4000)

return () => clearInterval(interval)
}, [banners])

if (!banners || banners.length === 0) return null

return (

<div className="relative w-full h-[250px] md:h-[400px] overflow-hidden rounded-xl">

{/* SLIDES */}
{banners.map((b, i) => (

<Image
key={i}
src={b.image_url}
alt={`แบนเนอร์ประชาสัมพันธ์ ${i + 1}`}
fill
sizes="100vw"
className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
i === index ? "opacity-100" : "opacity-0"
}`}
/>

))}

{/* LEFT */}
<button
onClick={() =>
setIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
}
className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded"
>
‹
</button>

{/* RIGHT */}
<button
onClick={() =>
setIndex((prev) => (prev + 1) % banners.length)
}
className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded"
>
›
</button>

{/* DOT */}
<div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
{banners.map((_, i) => (
<button
key={i}
onClick={() => setIndex(i)}
type="button"
aria-label={`แสดงแบนเนอร์ที่ ${i + 1}`}
aria-current={i === index}
className={`w-3 h-3 rounded-full cursor-pointer ${
i === index ? "bg-white" : "bg-white/50"
}`}
/>
))}



</div>

</div>

)
}
