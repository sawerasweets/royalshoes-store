/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Allows full offline/local image serving without external image proxy dependency
  },
};

module.exports = nextConfig;
