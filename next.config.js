/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local uploads are served from /public/uploads, no remote domains needed by default.
    remotePatterns: [],
  },
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
};

module.exports = nextConfig;
