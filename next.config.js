/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  turbopack: {
    // Turbopack yapılandırması
    rules: {}
  }
}

module.exports = nextConfig
