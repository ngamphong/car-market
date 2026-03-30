import { supabase } from "../../../lib/supabase"
import ImageGallery from "../../components/ImageGallery"
import CarCard from "../../components/CarCard"
import CarFinance from "../../components/CarFinance"

export default async function CarDetail({ params }: { params: Promise<{ id: string }> }) {

const { id } = await params

const { data: car } = await supabase
.from("cars")
.select("*")
.eq("id", id)
.single()

if (!car) {
return <div className="p-20 text-center text-xl">ไม่พบรถคันนี้</div>
}

const images = car.image_url.split(",")


// รถแนะนำ (ไม่เอารถ sold)
const { data: recommend } = await supabase
.from("cars")
.select("*")
.neq("id", id)
.neq("status", "sold")
.limit(3)

return(

<div className="bg-gray-100 min-h-screen">

<div className="max-w-6xl mx-auto p-4 md:p-8">

{/* HEADER */}

<div className="mb-6 flex justify-between items-center">

<div>
<h1 className="text-2xl md:text-3xl font-bold">
{car.brand} {car.model}
</h1>

<p className="text-gray-500 text-sm mt-1">
ประกาศรถมือสอง
</p>
</div>

{/* ✅ STATUS BADGE */}
<div>
{car.stock === 0 || car.status === "sold" ? (
<span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
❌ ขายแล้ว
</span>
) : (
<span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
✔️ พร้อมขาย ({car.stock} คัน)
</span>
)}
</div>

</div>



{/* MAIN GRID */}

<div className="grid lg:grid-cols-3 gap-8">

{/* LEFT */}

<div className="lg:col-span-2 space-y-6">

{/* GALLERY */}

<div className="bg-white rounded-xl p-4 shadow">
<ImageGallery images={images}/>
</div>


{/* CAR INFO */}

<div className="bg-white rounded-xl p-6 shadow">

<h2 className="text-xl font-bold mb-4">
ข้อมูลรถ
</h2>

<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

<div>
<p className="text-gray-400">ยี่ห้อ</p>
<p className="font-semibold">{car.brand}</p>
</div>

<div>
<p className="text-gray-400">รุ่น</p>
<p className="font-semibold">{car.model}</p>
</div>

<div>
<p className="text-gray-400">ปี</p>
<p className="font-semibold">{car.year}</p>
</div>

<div>
<p className="text-gray-400">เลขไมล์</p>
<p className="font-semibold">
{Number(car.mileage).toLocaleString()} กม.
</p>
</div>

<div>
<p className="text-gray-400">ราคา</p>
<p className="font-semibold text-red-600">
{Number(car.price).toLocaleString()} บาท
</p>
</div>

<div>
<p className="text-gray-400">สต็อก</p>
<p className="font-semibold">
{car.stock}
</p>
</div>

</div>

</div>


{/* DESCRIPTION */}

<div className="bg-white rounded-xl p-6 shadow">

<h2 className="text-xl font-bold mb-4">
รายละเอียด
</h2>

<p className="text-gray-700 leading-relaxed whitespace-pre-line">
{car.description}
</p>

</div>

</div>



{/* RIGHT */}

<div className="space-y-6">

{/* PRICE CARD */}

<div className="bg-white rounded-xl shadow p-6 sticky top-20">

<p className="text-gray-500 text-sm">
ราคาขาย
</p>

<h2 className="text-3xl font-bold text-red-600 mb-6">
{Number(car.price).toLocaleString()} บาท
</h2>

{/* ✅ เพิ่มตรงนี้ */}
<CarFinance price={Number(car.price)} />

{/* ❗ ปิดปุ่มถ้าขายแล้ว */}

{car.stock === 0 || car.status === "sold" ? (

<div className="text-center text-red-600 font-bold mt-4">
❌ รถคันนี้ขายแล้ว
</div>

) : (

<div className="space-y-3 mt-4">

<a
href={`tel:${car.phone ?? "0800000000"}`}
className="block text-center bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
>
📞 โทรหาผู้ขาย
</a>

<a
href={`https://line.me/ti/p/~${car.line ?? ""}`}
className="block text-center bg-green-400 text-white py-3 rounded-lg font-semibold hover:bg-green-500"
>
💬 LINE
</a>

</div>

)}

<button className="w-full mt-4 border py-3 rounded-lg hover:bg-gray-100">
❤️ บันทึกรถ
</button>

</div>

</div>

</div>



{/* RECOMMEND */}

<div className="mt-16">

<h2 className="text-2xl font-bold mb-6">
🚗 รถแนะนำ
</h2>

<div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">

{recommend?.map((car:any)=>(
<CarCard key={car.id} car={car}/>
))}

</div>

</div>

</div>

</div>

)

}