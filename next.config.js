/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // Add your image domains here
  },
  // Explicitly set to use the Pages Router
  experimental: {
    appDir: false,
  },
}

module.exports = nextConfig

