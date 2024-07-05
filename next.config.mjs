/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    domains: [
      'clean-parrot-174.convex.cloud',
      'img.clerk.com'
    ],
  },
  env: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  },
};

module.exports = nextConfig;
