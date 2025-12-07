import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        hostname: "ik.imagekit.io",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
