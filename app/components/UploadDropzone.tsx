"use client"

export default function UploadDropzone({setFiles}:any){

const handleDrop=(e:any)=>{

e.preventDefault()

const files=Array.from(e.dataTransfer.files)

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
onChange={(e)=>setFiles(Array.from(e.target.files!))}
/>

</div>

)

}