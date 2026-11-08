"use client";

import Image from "next/image";
import type { Dispatch, DragEvent, ChangeEvent, SetStateAction } from "react";

type ImageUploadProps = {
  files: File[]
  setFiles: Dispatch<SetStateAction<File[]>>
}

export default function ImageUpload({ files, setFiles }: ImageUploadProps) {

  const handleDrop = (e: DragEvent<HTMLDivElement>)=>{
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    setFiles((prev)=>[...prev,...dropped])
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>)=>{
    const selected = Array.from(e.target.files ?? []).filter((file) => file.type.startsWith("image/"))
    setFiles((prev)=>[...prev,...selected])
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

        {files.map((file,i)=>{
          const preview = URL.createObjectURL(file)
          return <Image
            key={i}
            src={preview}
            alt={`ตัวอย่างรูปที่ ${i + 1}`}
            width={240}
            height={96}
            unoptimized
            className="h-24 w-full object-cover rounded"
          />
        })}

      </div>

    </div>
  )
}
