/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Product/category images are served same-origin from /api/images/[id] (backed by
    // MongoDB — see services/imageService.ts), so no remote domains are needed here.
    remotePatterns: [],
  },
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
};

module.exports = nextConfig;
