/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bferxknatakjymihgsbs.supabase.co",
      },
    ],
  },
}

module.exports = nextConfig
