// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strict mode for catching subtle bugs early
  reactStrictMode: true,

  // Optimise images from external sources (avatars, thumbnails)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },           // UploadThing
      { protocol: "https", hostname: "img.clerk.com" },     // Clerk avatars
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // Silence the "using eval" warning from Prisma in dev
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals ?? []), "@prisma/client"];
    }
    return config;
  },
};

export default nextConfig;
