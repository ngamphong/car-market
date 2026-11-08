import "./globals.css"

export const metadata = {
  title: "KKC CAR HUB", // 
  description: "ขายรถมือสองออนไลน์",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

return(

<html>
<body>
{children}

</body>
</html>

)

}
