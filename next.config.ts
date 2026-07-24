import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photography is served from the Unsplash CDN. Point this at your own
    // asset host (or drop files into /public) before going live.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" }],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
  poweredByHeader: false,
  compress: true,
  experimental: {
    // Ship only the icons actually imported instead of the whole set.
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
