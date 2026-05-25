/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: ".",
  },
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
  ],
}

export default nextConfig
