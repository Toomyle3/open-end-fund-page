/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      ignoreBuildErrors: true
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "https://clean-parrot-174.convex.cloud",
        },
        {
          protocol: 'https',
          hostname: 'img.clerk.com'
        },
      ],
    },
  };
  
  export default nextConfig;
  