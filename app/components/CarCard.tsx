import Link from "next/link"

export default function CarCard({ car }: any) {

const image = car.image_url.split(",")[0]

return (

<Link href={`/car/${car.id}`}>

<div className="border rounded-xl overflow-hidden hover:shadow-xl transition bg-white group">

{/* IMAGE */}
<div className="relative">

<img
src={image}
className="w-full h-48 object-cover group-hover:scale-105 transition"
/>

{/* STATUS BADGE */}
<div className="absolute top-2 left-2">

{car.stock === 0 || car.status === "sold" ? (
<span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">
❌ ขายแล้ว
</span>
) : (
<span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold">
✔️ มีสินค้า
</span>
)}

</div>

</div>


{/* CONTENT */}
<div className="p-4">

<h2 className="font-bold text-lg line-clamp-1 text-gray-900">
{car.brand} {car.model}
</h2>

<p className="text-xs text-gray-900">
{car.categories?.name}
</p>

<p className="text-gray-900 text-sm">
ปี {car.year}
</p>

<p className="text-gray-900 text-xs mt-1">
เลขไมล์ {Number(car.mileage).toLocaleString()} กม.
</p>

<p className="text-red-600 font-bold text-lg mt-2">
{Number(car.price).toLocaleString()} บาท
</p>

</div>

</div>

</Link>

)

}