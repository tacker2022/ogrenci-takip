/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/ogrenci-takip',
  assetPrefix: 'https://tacker2022.github.io/ogrenci-takip',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    // Turbopack yapılandırması
    rules: {}
  }
}

module.exports = nextConfig
