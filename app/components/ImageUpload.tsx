"use client";

import { useState } from "react";

export default function ImageUpload({ files, setFiles }: any) {

  const handleDrop = (e:any)=>{
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files)
    setFiles((prev:any)=>[...prev,...dropped])
  }

  const handleChange = (e:any)=>{
    const selected = Array.from(e.target.files)
    setFiles((prev:any)=>[...prev,...selected])
  }

  return (

    <div
      onDrop={handleDrop}
      onDragOver={(e)=>e.preventDefault()}
      className="border-2 border-dashed p-6 rounded-xl text-center bg-indigo-50"
    >

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="mb-4"
      />

      <p className="text-sm text-gray-500">
        ลากรูปมาวาง หรือเลือกไฟล์
      </p>

      {/* preview */}
      <div className="grid grid-cols-3 gap-3 mt-4">

        {files.map((file:any,i:number)=>(
          <img
            key={i}
            src={URL.createObjectURL(file)}
            className="h-24 w-full object-cover rounded"
          />
        ))}

      </div>

    </div>
  )
}