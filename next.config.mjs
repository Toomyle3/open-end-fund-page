/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://clean-parrot-174.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
