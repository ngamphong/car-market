"use client"
import type { Dispatch, DragEvent, ChangeEvent, SetStateAction } from "react"

export default function UploadDropzone({setFiles}:{setFiles:Dispatch<SetStateAction<File[]>>}){

const handleDrop=(e:DragEvent<HTMLDivElement>)=>{

e.preventDefault()

const files=Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

setFiles(files)

}

return(

<div
onDrop={handleDrop}
onDragOver={(e)=>e.preventDefault()}
className="border-2 border-dashed p-10 text-center rounded-xl"
>

ลากรูปมาวางที่นี่

<input
type="file"
multiple
accept="image/*"
onChange={(e:ChangeEvent<HTMLInputElement>)=>setFiles(Array.from(e.target.files ?? []).filter((file) => file.type.startsWith("image/")))}
/>

</div>

)

}
