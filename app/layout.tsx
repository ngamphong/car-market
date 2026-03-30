import "./globals.css"
import Link from "next/link"

export default function RootLayout({children}:any){

return(

<html>
<body className="bg-slate-50">



{children}

</body>
</html>

)

}