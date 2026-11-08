import "./globals.css"

export const metadata = {
  title: { default: "KKC CAR HUB | รถมือสองคุณภาพ", template: "%s" },
  description: "ค้นหาและเลือกชมรถมือสอง พร้อมข้อมูลราคา ปีรถ เลขไมล์ และช่องทางติดต่อผู้ขาย",
  applicationName: "KKC CAR HUB",
  ...(process.env.NEXT_PUBLIC_SITE_URL ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) } : {}),
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
