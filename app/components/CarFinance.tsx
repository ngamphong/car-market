"use client"

import { useState } from "react"

export default function CarFinance({ price }: { price: number }) {

const [downPercent, setDownPercent] = useState(20)
const [years, setYears] = useState(5)

const months = years * 12

// ดอกเบี้ย 4% ต่อปี
const interestRate = 0.04

const downPayment = price * (downPercent / 100)
const loan = price - downPayment

const totalInterest = loan * interestRate * years

const monthly = (loan + totalInterest) / months

return (

<div className="bg-white rounded-xl shadow p-6 space-y-4">

<h2 className="text-lg font-bold">
💰 คำนวณผ่อนรถ
</h2>

{/* ราคา */}
<p className="text-gray-500 text-sm">
ราคารถ {price.toLocaleString()} บาท
</p>


{/* ดาวน์ */}
<div>
<p className="text-sm mb-1">ดาวน์: {downPercent}%</p>

<input
type="range"
min="0"
max="50"
value={downPercent}
onChange={(e)=>setDownPercent(Number(e.target.value))}
className="w-full"
/>

</div>


{/* ปี */}
<div>
<p className="text-sm mb-1">ระยะเวลา: {years} ปี</p>

<select
value={years}
onChange={(e)=>setYears(Number(e.target.value))}
className="border p-2 rounded w-full"
>

<option value={3}>3 ปี</option>
<option value={4}>4 ปี</option>
<option value={5}>5 ปี</option>
<option value={6}>6 ปี</option>
<option value={7}>7 ปี</option>

</select>

</div>


{/* RESULT */}
<div className="bg-gray-100 p-4 rounded-lg text-center">

<p className="text-gray-500 text-sm">
ผ่อนต่อเดือน
</p>

<p className="text-2xl font-bold text-red-600">
{Math.round(monthly).toLocaleString()} บาท
</p>

<p className="text-xs text-gray-400 mt-1">
* คำนวณโดยประมาณ
</p>

</div>

</div>

)

}