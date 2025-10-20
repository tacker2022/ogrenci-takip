/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      // Turbopack'i production build'de devre dışı bırak
      rules: {}
    }
  }
}

module.exports = nextConfig
