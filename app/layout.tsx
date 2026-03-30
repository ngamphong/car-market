import "./globals.css"
import Link from "next/link"
import ThemeProvider from "./providers/ThemeProviders"

export default function RootLayout({children}:any){

return(

<html>
<body className="bg-slate-50">
    <ThemeProvider>
          {(toggleTheme:any, theme:any)=>(
            <>
              {children}
            </>
          )}
    </ThemeProvider>
</body>
</html>

)

}