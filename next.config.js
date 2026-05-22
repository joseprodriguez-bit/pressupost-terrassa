/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/terrassa/:path*',
        destination: 'https://opendata.terrassa.cat/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
