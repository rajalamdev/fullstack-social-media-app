/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  env: {
    PUBLIC_API_URL: process.env.PUBLIC_API_URL,
  },
  images: {
    domains: ['res.cloudinary.com', 'localhost', 'i.imgur.com'],
  },
}

