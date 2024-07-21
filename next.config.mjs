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
  i18n: {
    locales: ["en-US", "vi-VN"],
    defaultLocale: "en-US",
    domains: [
      {
        domain: "example.com",
        defaultLocale: "en-US",
      },
      {
        domain: "example.vi",
        defaultLocale: "vi-VN",
      },
    ],
  },
};

export default nextConfig;
